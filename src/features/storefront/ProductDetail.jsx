"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Truck } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { useProducts, useSettings } from "@/lib/useSettings";
import { useCart } from "@/lib/CartContext";
import { formatMoney } from "@/lib/format";
import { variantGross, vatLabel } from "@/lib/vat";
import { pathFor } from "@/lib/routes";
import PageNotFound from "@/lib/PageNotFound";
import DeliveryCalculator from "@/components/store/DeliveryCalculator";
import ProductInfoTabs from "@/components/store/ProductInfoTabs";
import ProductCard from "@/components/store/ProductCard";

const CONDITION_PARAM = { pl: "stan", de: "zustand" };
const CONDITION_VALUES = {
  pl: { new: "nowy", used: "uzywany" },
  de: { new: "neu", used: "gebraucht" },
};

export default function ProductDetail({ slug }) {
  const { lang, market, currency, t, setDynamicAlt } = useLang();
  const { products, isLoading } = useProducts();
  const { settings } = useSettings();
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => (lang === "de" ? p.slug_de : p.slug_pl) === slug);

  const activeVariants = useMemo(
    () => (product?.variants || []).filter((v) => v.active !== false),
    [product]
  );

  // Restore variant from shareable URL (?stan=nowy / ?zustand=neu)
  const paramKey = CONDITION_PARAM[lang];
  const urlCondition = Object.entries(CONDITION_VALUES[lang]).find(
    ([, v]) => v === searchParams.get(paramKey)
  )?.[0];
  const [condition, setCondition] = useState(null);
  const effectiveCondition =
    condition ||
    (urlCondition && activeVariants.some((v) => v.condition === urlCondition) ? urlCondition : null) ||
    activeVariants[0]?.condition;

  const variant = activeVariants.find((v) => v.condition === effectiveCondition) || activeVariants[0];

  useEffect(() => {
    if (product) {
      setDynamicAlt({ pl: `/${product.slug_pl}`, de: `/de/${product.slug_de}` });
    }
  }, [product, setDynamicAlt]);

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

  const selectCondition = (c) => {
    setCondition(c);
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set(paramKey, CONDITION_VALUES[lang][c]);
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  const price = variant ? variantGross(variant, settings, market) : null;
  const image = variant?.image || product.featured_image;
  const gallery = [image, ...(product.gallery || []).filter((g) => g !== image)].filter(Boolean);
  const availabilityKey =
    variant?.availability === "in_stock" ? "inStock" : variant?.availability === "on_request" ? "onRequest" : "outOfStock";

  const handleAddToCart = () => {
    if (!variant || !price) return;
    addItem({
      product_id: product.id,
      sku: variant.sku,
      name_pl: product.name_pl,
      name_de: product.name_de,
      variant_label_pl: `${t("common.condition")}: ${variant.condition === "new" ? "Nowy" : "Używany"}`,
      variant_label_de: `Zustand: ${variant.condition === "new" ? "Neu" : "Gebraucht"}`,
      price_pln_net: variant.price_pln_net,
      price_eur_net: variant.price_eur_net,
      size: product.size,
      image,
      quantity,
    });
  };

  const related = products.filter((p) => p.id !== product.id && p.size === product.size).slice(0, 4);

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
          <div className="aspect-[4/3] bg-[#E0E2E5] border border-[#E0E2E5] overflow-hidden">
            <Image src={gallery[0]} alt={lang === "de" ? product.name_de : product.name_pl} loading="eager" className="w-full h-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {gallery.slice(1, 5).map((g, i) => (
                <div key={i} className="aspect-[4/3] bg-[#E0E2E5] overflow-hidden border border-[#E0E2E5]">
                  <Image src={g} alt={`${lang === "de" ? product.name_de : product.name_pl} ${i + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Configuration */}
        <div>
          {product.is_demo && (
            <span className="inline-block bg-[#1A1C1E] text-white font-mono text-[10px] px-2 py-1 mb-3">
              {t("common.demoBadge")}
            </span>
          )}
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#1A1C1E]">
            {lang === "de" ? product.name_de : product.name_pl}
          </h1>
          <p className="text-sm text-[#5F656B] mt-2">
            {t("common.sku")}: {variant?.sku || "—"} · {product.size} · {t(`common.${product.container_type}`)}
          </p>
          <p className="mt-4 text-base md:text-lg text-[#343A40] leading-[1.75]">
            {lang === "de" ? product.short_description_de : product.short_description_pl}
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

          {/* Variant selectors */}
          <div className="mt-6">
            <p className="text-sm font-semibold tracking-[0.12em] uppercase text-[#4B5157] mb-2">{t("common.condition")}</p>
            <div className="flex gap-2" role="group" aria-label={t("common.condition")}>
              {[...new Set(activeVariants.map((v) => v.condition))].map((c) => (
                <button
                  key={c}
                  onClick={() => selectCondition(c)}
                  className={`px-5 py-3 border font-semibold text-sm transition-colors inline-flex items-center gap-2 ${
                    effectiveCondition === c
                      ? "border-[#1A1C1E] bg-[#1A1C1E] text-white"
                      : "border-[#E0E2E5] bg-white text-[#3A3E42] hover:border-[#1A1C1E]"
                  }`}
                  aria-pressed={effectiveCondition === c}
                >
                  {effectiveCondition === c && <Check className="w-4 h-4" />}
                  {t(`common.${c}`)}
                </button>
              ))}
            </div>
          </div>

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
