"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getImageProps } from "next/image";
import { Check, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { useProductRows, useSettings } from "@/lib/useSettings";
import { groupFamilies } from "@/lib/supabaseCatalog";
import { useCart } from "@/lib/CartContext";
import { formatMoney } from "@/lib/format";
import { variantGross, vatLabel } from "@/lib/vat";
import { pathFor } from "@/lib/routes";
import PageNotFound from "@/lib/PageNotFound";
import DeliveryCalculator from "@/components/store/DeliveryCalculator";
import ProductGallery from "@/components/store/ProductGallery";
import ProductInfoTabs from "@/components/store/ProductInfoTabs";
import ProductCard from "@/components/store/ProductCard";

const colorLabel = (variant, lang) => {
  if (!variant?.color) return "";
  const label = lang === "de" ? variant.color_label_de : variant.color_label_pl;
  return [label, variant.color_ral].filter(Boolean).join(" · ");
};

const warmedVariantImages = new Set();
const warmingVariantImages = new Map();

function warmVariantImage(src) {
  if (!src || warmedVariantImages.has(src) || warmingVariantImages.has(src)) return;
  try {
    const { props } = getImageProps({
      src,
      alt: "",
      width: 1200,
      height: 900,
      sizes: "(max-width: 1023px) 100vw, 50vw",
    });
    const image = new window.Image();
    image.decoding = "async";
    image.fetchPriority = "low";
    image.onload = () => {
      warmingVariantImages.delete(src);
      warmedVariantImages.add(src);
    };
    image.onerror = () => warmingVariantImages.delete(src);
    warmingVariantImages.set(src, image);
    image.sizes = props.sizes;
    image.srcset = props.srcSet;
    image.src = props.src;
  } catch {
    // A future external image host may not yet be in the Next.js image allow-list.
  }
}

export default function ProductDetail({ slug, initialProducts }) {
  const { lang, market, currency, t, setDynamicAlt } = useLang();
  const { products, isLoading } = useProductRows(initialProducts);
  const { settings } = useSettings();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [localSelection, setLocalSelection] = useState(null);

  // Every variant keeps its own crawlable URL, while regular swatch clicks select from
  // the catalogue already in memory instead of waiting for another server round trip.
  const routedProduct = products.find((p) => (lang === "de" ? p.slug_de : p.slug_pl) === slug);
  const locallySelectedProduct = localSelection?.routeSlug === slug
    ? products.find((entry) => entry.id === localSelection.productId)
    : null;
  const product = locallySelectedProduct || routedProduct;
  const siblings = product ? products.filter((p) => p.family_id === product.family_id) : [];
  const activeSiblings = siblings.filter((entry) => entry.active !== false);
  // Colour is the final level in the product hierarchy. Never leak a colour from
  // another condition into the current selection (for example, New into Used).
  const matchingConditionSiblings = activeSiblings.filter(
    (entry) =>
      entry.condition === product?.condition &&
      entry.size === product?.size &&
      entry.container_type === product?.container_type
  );
  const colorOptions = Array.from(
    new Set(matchingConditionSiblings.map((entry) => entry.color).filter(Boolean))
  ).map((color) => matchingConditionSiblings.find((entry) => entry.color === color));
  const conditionOptions = Array.from(
    new Set(activeSiblings.map((entry) => entry.condition).filter(Boolean))
  ).map(
    (condition) =>
      activeSiblings.find((entry) => entry.condition === condition && entry.color === product?.color) ||
      activeSiblings.find((entry) => entry.condition === condition)
  );

  useEffect(() => {
    if (product) {
      setDynamicAlt({ pl: `/${product.slug_pl}`, de: `/de/${product.slug_de}` });
    }
  }, [product, setDynamicAlt]);

  useEffect(() => {
    setLocalSelection((current) => current?.routeSlug === slug ? current : null);
  }, [slug]);

  useEffect(() => {
    const handleHistoryNavigation = () => {
      const parts = window.location.pathname.split("/").filter(Boolean);
      const historySlug = lang === "de" ? parts[1] : parts[0];
      const historyProduct = products.find(
        (entry) => (lang === "de" ? entry.slug_de : entry.slug_pl) === historySlug
      );
      setLocalSelection(
        historyProduct ? { productId: historyProduct.id, routeSlug: slug } : null
      );
    };

    window.addEventListener("popstate", handleHistoryNavigation);
    return () => window.removeEventListener("popstate", handleHistoryNavigation);
  }, [lang, products, slug]);

  useEffect(() => {
    if (!product) return undefined;

    const siblingImages = products
      .filter((entry) => entry.family_id === product.family_id && entry.id !== product.id)
      .map((entry) => entry.featured_image)
      .filter(Boolean);
    const warmImages = () => siblingImages.forEach(warmVariantImage);

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(warmImages, { timeout: 1500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timerId = window.setTimeout(warmImages, 250);
    return () => window.clearTimeout(timerId);
  }, [product, products]);

  usePageMeta(
    product
      ? (lang === "de" ? product.seo_title_de : product.seo_title_pl) ||
          (lang === "de" ? product.name_de : product.name_pl)
      : null,
    product
      ? (lang === "de" ? product.seo_description_de : product.seo_description_pl) ||
          (lang === "de" ? product.short_description_de : product.short_description_pl)
      : null
  );

  if (isLoading) return <div className="py-32 text-center text-[#6B7075]">{t("common.loading")}</div>;
  if (!product) return <PageNotFound />;

  const price = product.active !== false ? variantGross(product, settings, market) : null;
  const image = product.featured_image;
  const gallery = [image, ...(product.gallery || []).filter((g) => g !== image)].filter(Boolean);
  const availabilityKey =
    product.availability === "in_stock" ? "inStock" : product.availability === "on_request" ? "onRequest" : "outOfStock";

  const handleAddToCart = () => {
    if (!price) return;
    const colorPl = [product.color_label_pl, product.color_ral].filter(Boolean).join(" ");
    const colorDe = [product.color_label_de, product.color_ral].filter(Boolean).join(" ");
    addItem({
      product_id: product.id,
      sku: product.sku,
      name_pl: product.name_pl,
      name_de: product.name_de,
      variant_label_pl: `Stan: ${product.condition === "new" ? "Nowy" : "Używany"}${colorPl ? ` · Kolor: ${colorPl}` : ""}`,
      variant_label_de: `Zustand: ${product.condition === "new" ? "Neu" : "Gebraucht"}${colorDe ? ` · Farbe: ${colorDe}` : ""}`,
      price_pln_net: product.price_pln_net,
      price_eur_net: product.price_eur_net,
      size: product.size,
      image,
      quantity,
    });
  };

  const handleVariantNavigation = (event, variant, href) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    if (variant.id === product.id) return;
    setLocalSelection({ productId: variant.id, routeSlug: slug });
    window.history.pushState(null, "", href);
  };

  // ProductCard expects family-grouped objects (with a variants[] array), not flat rows.
  const related = groupFamilies(products.filter((p) => p.family_id !== product.family_id)).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 md:py-14">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#5F656B] mb-6" aria-label="Breadcrumb">
        <Link href={pathFor("home", lang)} className="font-medium hover:text-[#795207]">{t("nav.home")}</Link>
        <span className="mx-2">/</span>
        <Link href={pathFor("shop", lang)} className="font-medium hover:text-[#795207]">{t("nav.shop")}</Link>
        <span className="mx-2">/</span>
        <span className="text-[#1A1C1E]">{lang === "de" ? product.name_de : product.name_pl}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 self-start">
          <ProductGallery
            images={gallery}
            productName={`${lang === "de" ? product.name_de : product.name_pl}${product.color ? ` — ${colorLabel(product, lang)}` : ""}`}
          />
        </div>

        {/* Configuration */}
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#1A1C1E]">
            {lang === "de" ? product.name_de : product.name_pl}
          </h1>
          <p className="text-sm text-[#5F656B] mt-2">
            {t("common.sku")}: {product.sku || "—"}
            {product.size && ` · ${product.size}`}
            {product.container_type && ` · ${t(`common.${product.container_type}`)}`}
          </p>
          {/* Price */}
          <div className="mt-6 border-y border-[#E0E2E5] py-5">
            {price ? (
              <>
                <p className="font-heading text-3xl font-bold text-[#1A1C1E]">{formatMoney(price.gross, currency)}</p>
                <p className="text-sm text-[#5F656B] mt-1">
                  {vatLabel(lang, price.rate, "std", settings)} · {formatMoney(price.net, currency)} {t("common.netto")}
                </p>
                <p className="text-sm text-[#5F656B] mt-0.5">{t("product.deliveryNotIncluded")}</p>
              </>
            ) : (
              <p className="font-heading text-xl font-bold text-[#1A1C1E]">{t("common.onRequest")}</p>
            )}
            <p className={`mt-2 inline-flex items-center gap-1.5 text-sm font-semibold ${
              availabilityKey === "inStock" ? "text-[#2E7D32]" : availabilityKey === "onRequest" ? "text-[#795207]" : "text-red-600"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {t(`common.${availabilityKey}`)}
            </p>
          </div>

          {conditionOptions.length > 1 && (
            <div className="mt-6">
              <p className="text-sm font-semibold tracking-[0.12em] uppercase text-[#4B5157] mb-2">{t("common.condition")}</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label={t("common.condition")}>
                {conditionOptions.map((conditionVariant) => {
                  const isCurrent = conditionVariant.id === product.id;
                  const href = lang === "de" ? `/de/${conditionVariant.slug_de}` : `/${conditionVariant.slug_pl}`;
                  return (
                    <Link
                      key={conditionVariant.condition}
                      href={href}
                      prefetch={false}
                      onClick={(event) => handleVariantNavigation(event, conditionVariant, href)}
                      className={`px-5 py-3 border font-semibold text-sm transition-colors inline-flex items-center gap-2 ${
                        isCurrent
                          ? "border-[#1A1C1E] bg-[#1A1C1E] text-white"
                          : "border-[#E0E2E5] bg-white text-[#3A3E42] hover:border-[#1A1C1E]"
                      }`}
                      aria-current={isCurrent ? "page" : undefined}
                    >
                      {isCurrent && <Check className="w-4 h-4" />}
                      {t(`common.${conditionVariant.condition}`)}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colour selectors — scoped to the selected product criteria and condition. */}
          {colorOptions.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold tracking-[0.12em] uppercase text-[#4B5157] mb-3">
                {t("common.color")}
                <span className="ml-2 normal-case tracking-normal font-medium text-[#1A1C1E]">
                  {colorLabel(product, lang)}
                </span>
              </p>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={t("common.color")}>
                {colorOptions.map((colorVariant) => {
                  const selected = product.color === colorVariant.color;
                  const label = colorLabel(colorVariant, lang);
                  const href = lang === "de" ? `/de/${colorVariant.slug_de}` : `/${colorVariant.slug_pl}`;
                  return (
                    <Link
                      key={colorVariant.color}
                      href={href}
                      prefetch={false}
                      onClick={(event) => handleVariantNavigation(event, colorVariant, href)}
                      className={`relative h-12 w-12 border bg-white p-1.5 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] focus-visible:ring-offset-2 ${
                        selected
                          ? "border-[#1A1C1E] shadow-[0_0_0_2px_#F5A623]"
                          : "border-[#C7CBCF] hover:border-[#1A1C1E]"
                      }`}
                      role="radio"
                      aria-checked={selected}
                      aria-current={selected ? "page" : undefined}
                      aria-label={`${t("common.color")}: ${label}`}
                      title={label}
                    >
                      <span
                        className="flex h-full w-full items-center justify-center border border-black/10"
                        style={{ backgroundColor: colorVariant.color_hex, color: colorVariant.color_text }}
                        aria-hidden="true"
                      >
                        {selected && <Check className="h-4 w-4" strokeWidth={3} />}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity + CTA */}
          <div className="mt-6 flex gap-3 items-end flex-wrap">
            <div>
              <p className="text-sm font-semibold tracking-[0.12em] uppercase text-[#4B5157] mb-2">{t("common.quantity")}</p>
              <div className="flex items-center border border-[#E0E2E5] bg-white h-12">
                <button className="px-4 h-full text-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="-">−</button>
                <span className="font-mono w-10 text-center">{quantity}</span>
                <button className="px-4 h-full text-lg" onClick={() => setQuantity(quantity + 1)} aria-label="+">+</button>
              </div>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!price || availabilityKey === "outOfStock"}
              className="bg-[#F5A623] hover:bg-[#DB930D] !text-[#1A1C1E] rounded-none font-semibold h-12 px-8 text-base flex-1 sm:flex-none"
            >
              {t("common.addToCart")}
            </Button>
            <Button asChild variant="outline" className="rounded-none border-[#1A1C1E] h-12 px-6">
              <Link href={pathFor("quote", lang)}>{t("common.requestQuote")}</Link>
            </Button>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#5F656B] flex items-start gap-1.5">
            <Truck className="w-3.5 h-3.5" /> {t("product.quoteHint")}
          </p>

          {/* Delivery check */}
          <div className="mt-8">
            <DeliveryCalculator items={[{ size: product.size, quantity }]} />
          </div>
        </div>
      </div>

      <ProductInfoTabs product={product} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-xl font-bold text-[#1A1C1E] mb-6">{t("product.related")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
