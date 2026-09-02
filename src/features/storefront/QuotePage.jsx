"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Plus, Trash2, ImagePlus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLang, usePageMeta } from "@/lib/i18n";
import { useProducts } from "@/lib/useSettings";
import { useCart } from "@/lib/CartContext";
import { pathFor } from "@/lib/routes";

const QUOTE_DRAFT_KEY = "olborg_quote_draft_v3";
const NO_COLOR = "__not_specified__";

const blankForm = (country) => ({
  freeText: "", country, postal: "", city: "", address: "",
  unloading: "self", siteAccess: "", name: "", company: "", vatId: "",
  email: "", phone: "", notes: "",
});

const emptyRow = (id = "quote-row-initial") => ({
  id,
  size: "",
  containerType: "",
  condition: "",
  color: "",
  quantity: 1,
});

const uniqueBy = (items, key) => {
  const seen = new Set();
  return items.filter((item) => {
    const value = item[key];
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

export default function QuotePage() {
  const { lang, market, t } = useLang();
  const { products, isLoading: productsLoading } = useProducts();
  const { items: cartItems, hydrated: cartHydrated } = useCart();
  usePageMeta(t("quote.title"), t("quote.subtitle"));

  const catalogVariants = useMemo(
    () =>
      products.flatMap((product) =>
        (product.variants || [])
          .filter((variant) => variant.active !== false)
          .map((variant) => ({
            ...variant,
            product_id: variant.id || product.id,
            product_name_pl: product.name_pl,
            product_name_de: product.name_de,
            size: variant.size || product.size || "",
            containerType: variant.container_type || product.container_type || "",
            colorKey: variant.color || NO_COLOR,
          }))
      ),
    [products]
  );

  const sizeOptions = useMemo(
    () =>
      uniqueBy(catalogVariants, "size")
        .map((variant) => variant.size)
        .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10)),
    [catalogVariants]
  );

  const [rows, setRows] = useState([emptyRow()]);
  const [form, setForm] = useState(() => blankForm(market));
  const [customerType, setCustomerType] = useState("private");
  const [photos, setPhotos] = useState([]);
  const [draftReady, setDraftReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sentNumber, setSentNumber] = useState(null);
  const initialized = useRef(false);
  const rowCounter = useRef(1);

  const resolveVariant = (row) =>
    catalogVariants.find(
      (variant) =>
        variant.size === row.size &&
        variant.containerType === row.containerType &&
        variant.condition === row.condition &&
        variant.colorKey === row.color
    );

  useEffect(() => {
    if (initialized.current || productsLoading || !cartHydrated) return;
    initialized.current = true;

    let draft = null;
    try {
      draft = JSON.parse(sessionStorage.getItem(QUOTE_DRAFT_KEY));
    } catch {
      draft = null;
    }

    if (draft && Array.isArray(draft.rows)) {
      const restoredRows = draft.rows.map((row, index) => ({
        ...emptyRow(row.id || `quote-row-restored-${index}`),
        size: String(row.size || ""),
        containerType: String(row.containerType || ""),
        condition: String(row.condition || ""),
        color: String(row.color || ""),
        quantity: Math.min(Math.max(1, Number(row.quantity) || 1), 500),
      }));
      setRows(restoredRows.length ? restoredRows : [emptyRow()]);
      setForm({ ...blankForm(market), ...(draft.form || {}), country: draft.form?.country || market });
      setCustomerType(draft.customerType === "business" ? "business" : "private");
      setPhotos(Array.isArray(draft.photos) ? draft.photos.slice(0, 6) : []);
    } else {
      const cartRows = cartItems
        .map((item, index) => {
          const variant = catalogVariants.find(
            (entry) => entry.product_id === item.product_id || entry.sku === item.sku
          );
          if (!variant) return null;
          return {
            id: `quote-row-cart-${index}`,
            size: variant.size,
            containerType: variant.containerType,
            condition: variant.condition || "",
            color: variant.colorKey,
            quantity: Math.min(Math.max(1, Number(item.quantity) || 1), 500),
          };
        })
        .filter(Boolean);
      if (cartRows.length) setRows(cartRows);
    }
    setDraftReady(true);
  }, [cartHydrated, cartItems, catalogVariants, market, productsLoading]);

  useEffect(() => {
    if (!draftReady) return;
    try {
      sessionStorage.setItem(
        QUOTE_DRAFT_KEY,
        JSON.stringify({ rows, form, customerType, photos })
      );
    } catch {
      // The form still works when browser storage is blocked.
    }
  }, [customerType, draftReady, form, photos, rows]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setRow = (i, patch) => setRows((r) => r.map((row, ri) => (ri === i ? { ...row, ...patch } : row)));
  const setRowChoice = (index, key, value) => {
    const patch = { [key]: value };
    if (key === "size") Object.assign(patch, { containerType: "", condition: "", color: "" });
    if (key === "containerType") Object.assign(patch, { condition: "", color: "" });
    if (key === "condition") Object.assign(patch, { color: "" });
    setRow(index, patch);
    setError(null);
  };

  const uploadPhotos = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 6 - photos.length);
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const response = await fetch("/api/uploads", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setPhotos((current) => [...current, ...data.urls]);
    } catch {
      setError(t("checkout.submitError"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const startedRows = rows.filter((row) =>
        row.size || row.containerType || row.condition || row.color
      );
      const configuredRows = startedRows.map((row) => ({ row, variant: resolveVariant(row) }));
      if (configuredRows.some(({ variant }) => !variant)) {
        setError(t("quote.incompleteConfiguration"));
        return;
      }
      if (configuredRows.length === 0 && !form.freeText.trim()) {
        setError(t("quote.chooseProductOrDescribe"));
        return;
      }
      const items = configuredRows.map(({ row, variant }) => {
        const color = [
          lang === "de" ? variant.color_label_de : variant.color_label_pl,
          variant.color_ral,
        ].filter(Boolean).join(" ") || t("quote.colorUnspecified");
        return {
          product_id: variant.product_id,
          product_name: lang === "de" ? variant.product_name_de : variant.product_name_pl,
          sku: variant.sku,
          variant_label: [t(`common.${variant.condition}`), `${t("common.color")}: ${color}`].join(" · "),
          quantity: row.quantity,
        };
      });
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          market: form.country === "DE" ? "DE" : "PL",
          language: lang,
          items,
          free_text_products: form.freeText,
          delivery_country: form.country,
          delivery_postal_code: form.postal,
          delivery_city: form.city,
          delivery_address: form.address,
          unloading_method: form.unloading === "crane" ? "crane_hds" : "self",
          site_access_notes: form.siteAccess,
          customer_type: customerType,
          customer: { name: form.name, company: form.company, vat_id: form.vatId, email: form.email, phone: form.phone },
          notes: form.notes,
          photo_urls: photos,
        }),
      });
      if (!response.ok) throw new Error("Quote request failed");
      const data = await response.json();
      try {
        sessionStorage.removeItem(QUOTE_DRAFT_KEY);
      } catch {
        // Nothing to clear when browser storage is unavailable.
      }
      setSentNumber(data.quote_number);
      window.scrollTo(0, 0);
    } catch {
      setError(t("checkout.submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (sentNumber) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <CheckCircle2 className="w-12 h-12 text-[#2E7D32] mx-auto mb-4" />
        <h1 className="font-heading text-3xl font-bold text-[#1A1C1E]">{t("quote.sent")}</h1>
        <p className="text-[#3A3E42] mt-3">{t("quote.sentDesc", { number: sentNumber })}</p>
        <Button asChild className="mt-8 bg-[#1A1C1E] rounded-none">
          <Link href={pathFor("home", lang)}>{t("notFound.cta")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[#1A1C1E]">{t("quote.title")}</h1>
      <p className="mt-3 text-[#3A3E42]">{t("quote.subtitle")}</p>

      <form onSubmit={submit} className="mt-8 space-y-8">
        {/* Products */}
        <section className="bg-white border border-[#E0E2E5] p-5 sm:p-6">
          <h2 className="font-heading font-bold text-[#1A1C1E] mb-4">
            <span className="text-[#795207] mr-2">01</span>{t("quote.stepProducts")}
          </h2>
          <div className="space-y-4" translate="no">
            {!draftReady || productsLoading ? (
              <div className="flex min-h-28 items-center justify-center text-sm text-[#6B7075]">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("common.loading")}
              </div>
            ) : rows.map((row, i) => {
              const typeOptions = uniqueBy(
                catalogVariants.filter((variant) => variant.size === row.size),
                "containerType"
              );
              const conditionOptions = uniqueBy(
                catalogVariants.filter(
                  (variant) =>
                    variant.size === row.size && variant.containerType === row.containerType
                ),
                "condition"
              ).sort((a, b) => (a.condition === "new" ? -1 : b.condition === "new" ? 1 : 0));
              const colorOptions = uniqueBy(
                catalogVariants.filter(
                  (variant) =>
                    variant.size === row.size &&
                    variant.containerType === row.containerType &&
                    variant.condition === row.condition
                ),
                "colorKey"
              );
              const selectedVariant = resolveVariant(row);

              return (
                <div key={row.id} className="border border-[#E0E2E5] bg-[#FAFAFA] p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#1A1C1E]">
                      {t("quote.configuration")} {i + 1}
                    </p>
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setRows((current) => current.filter((_, rowIndex) => rowIndex !== i))}
                        className="flex min-h-10 min-w-10 items-center justify-center text-[#6B7075] hover:text-red-600"
                        aria-label={t("common.remove")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <Label htmlFor={`q-size-${row.id}`} className="text-sm text-[#4B5157]">{t("common.size")}</Label>
                      <Select value={row.size} onValueChange={(value) => setRowChoice(i, "size", value)}>
                        <SelectTrigger id={`q-size-${row.id}`} className="mt-1 rounded-none" aria-label={t("quote.selectSize")}>
                          <SelectValue placeholder={t("quote.selectSize")} />
                        </SelectTrigger>
                        <SelectContent translate="no">
                          {sizeOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`q-type-${row.id}`} className="text-sm text-[#4B5157]">{t("common.type")}</Label>
                      <Select
                        value={row.containerType}
                        onValueChange={(value) => setRowChoice(i, "containerType", value)}
                        disabled={!row.size}
                      >
                        <SelectTrigger id={`q-type-${row.id}`} className="mt-1 rounded-none" aria-label={t("quote.selectType")}>
                          <SelectValue placeholder={t("quote.selectType")} />
                        </SelectTrigger>
                        <SelectContent translate="no">
                          {typeOptions.map((variant) => (
                            <SelectItem key={variant.containerType} value={variant.containerType}>
                              {t(`common.${variant.containerType}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`q-condition-${row.id}`} className="text-sm text-[#4B5157]">{t("common.condition")}</Label>
                      <Select
                        value={row.condition}
                        onValueChange={(value) => setRowChoice(i, "condition", value)}
                        disabled={!row.containerType}
                      >
                        <SelectTrigger id={`q-condition-${row.id}`} className="mt-1 rounded-none" aria-label={t("quote.selectCondition")}>
                          <SelectValue placeholder={t("quote.selectCondition")} />
                        </SelectTrigger>
                        <SelectContent translate="no">
                          {conditionOptions.map((variant) => (
                            <SelectItem key={variant.condition} value={variant.condition}>
                              {t(`common.${variant.condition}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`q-quantity-${row.id}`} className="text-sm text-[#4B5157]">{t("common.quantity")}</Label>
                      <Input
                        id={`q-quantity-${row.id}`}
                        type="number"
                        min={1}
                        max={500}
                        value={row.quantity}
                        onChange={(event) => setRow(i, { quantity: Math.min(500, Math.max(1, Number(event.target.value) || 1)) })}
                        className="mt-1 rounded-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-[#4B5157]">{t("common.color")}</p>
                    {!row.condition ? (
                      <p className="mt-1 text-sm text-[#7A8086]">{t("quote.choosePrevious")}</p>
                    ) : colorOptions.length === 0 ? (
                      <p className="mt-1 text-sm text-[#7A8086]">{t("quote.unavailableConfiguration")}</p>
                    ) : (
                      <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={t("quote.selectColor")}>
                        {colorOptions.map((variant) => {
                          const colorName = [
                            lang === "de" ? variant.color_label_de : variant.color_label_pl,
                            variant.color_ral,
                          ].filter(Boolean).join(" · ") || t("quote.colorUnspecified");
                          const selected = row.color === variant.colorKey;
                          return (
                            <button
                              key={variant.colorKey}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              aria-label={`${t("common.color")}: ${colorName}`}
                              onClick={() => setRowChoice(i, "color", variant.colorKey)}
                              className={`inline-flex min-h-11 items-center gap-2 border bg-white px-3 py-2 text-sm font-medium transition-colors ${
                                selected
                                  ? "border-[#1A1C1E] shadow-[0_0_0_2px_#F5A623]"
                                  : "border-[#D7DADF] hover:border-[#A9700A]"
                              }`}
                            >
                              <span
                                className="flex h-6 w-6 shrink-0 items-center justify-center border border-black/15"
                                style={{ backgroundColor: variant.color_hex || "#E0E2E5", color: variant.color_text || "#1A1C1E" }}
                                aria-hidden="true"
                              >
                                {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                              </span>
                              {colorName}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {selectedVariant && (
                    <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#2E7D32]">
                      <CheckCircle2 className="h-4 w-4" /> {t("quote.configurationReady")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const id = `quote-row-${Date.now()}-${rowCounter.current++}`;
              setRows((current) => [...current, emptyRow(id)]);
            }}
            disabled={!draftReady || productsLoading}
            className="mt-3 rounded-none border-[#E0E2E5] text-[#3A3E42]"
          >
            <Plus className="w-4 h-4" /> {t("quote.addConfiguration")}
          </Button>
          <div className="mt-4">
            <Label htmlFor="q-free" className="text-sm text-[#4B5157]">{t("quote.freeText")} ({t("common.optional")})</Label>
            <Textarea id="q-free" value={form.freeText} onChange={set("freeText")} className="rounded-none mt-1" rows={2} />
          </div>
        </section>

        {/* Delivery */}
        <section className="bg-white border border-[#E0E2E5] p-5 sm:p-6">
          <h2 className="font-heading font-bold text-[#1A1C1E] mb-4">
            <span className="text-[#795207] mr-2">02</span>{t("quote.stepDelivery")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="q-country" className="text-sm text-[#4B5157]">{t("checkout.country")} *</Label>
              <Select value={form.country} onValueChange={(v) => setForm((f) => ({ ...f, country: v }))}>
                <SelectTrigger id="q-country" className="rounded-none mt-1"><SelectValue /></SelectTrigger>
                <SelectContent translate="no">
                  <SelectItem value="PL">Polska</SelectItem>
                  <SelectItem value="DE">Deutschland</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="q-postal" className="text-sm text-[#4B5157]">{t("checkout.postalCode")} *</Label>
              <Input id="q-postal" required value={form.postal} onChange={set("postal")} className="rounded-none mt-1 font-mono" />
            </div>
            <div>
              <Label htmlFor="q-city" className="text-sm text-[#4B5157]">{t("checkout.city")} *</Label>
              <Input id="q-city" required value={form.city} onChange={set("city")} className="rounded-none mt-1" />
            </div>
            <div className="sm:col-span-3">
              <Label htmlFor="q-addr" className="text-sm text-[#4B5157]">{t("checkout.street")} ({t("common.optional")})</Label>
              <Input id="q-addr" value={form.address} onChange={set("address")} className="rounded-none mt-1" />
            </div>
            <p className="text-sm text-[#6B7075] sm:col-span-3">{t("quote.countryHint")}</p>
          </div>
          <div className="mt-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4B5157] mb-2">{t("checkout.unloading")}</p>
            <RadioGroup value={form.unloading} onValueChange={(v) => setForm((f) => ({ ...f, unloading: v }))} className="space-y-2">
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="self" /> {t("checkout.unloadingSelf")}</label>
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="crane" /> {t("checkout.unloadingCrane")}</label>
            </RadioGroup>
          </div>
          <div className="mt-4">
            <Label htmlFor="q-access" className="text-sm text-[#4B5157]">{t("quote.siteAccess")} ({t("common.optional")})</Label>
            <Textarea id="q-access" value={form.siteAccess} onChange={set("siteAccess")} className="rounded-none mt-1" rows={2} />
          </div>
        </section>

        {/* Customer */}
        <section className="bg-white border border-[#E0E2E5] p-5 sm:p-6">
          <h2 className="font-heading font-bold text-[#1A1C1E] mb-4">
            <span className="text-[#795207] mr-2">03</span>{t("quote.stepCustomer")}
          </h2>
          <RadioGroup value={customerType} onValueChange={setCustomerType} className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm font-medium"><RadioGroupItem value="private" /> {t("checkout.private")}</label>
            <label className="flex items-center gap-2 text-sm font-medium"><RadioGroupItem value="business" /> {t("checkout.business")}</label>
          </RadioGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="q-name" className="text-sm text-[#4B5157]">{t("checkout.name")} *</Label>
              <Input id="q-name" required value={form.name} onChange={set("name")} className="rounded-none mt-1" />
            </div>
            <div>
              <Label htmlFor="q-email" className="text-sm text-[#4B5157]">{t("checkout.email")} *</Label>
              <Input id="q-email" type="email" required value={form.email} onChange={set("email")} className="rounded-none mt-1" />
            </div>
            <div>
              <Label htmlFor="q-phone" className="text-sm text-[#4B5157]">{t("checkout.phone")} *</Label>
              <Input id="q-phone" required value={form.phone} onChange={set("phone")} className="rounded-none mt-1" />
            </div>
            {customerType === "business" && (
              <>
                <div>
                  <Label htmlFor="q-company" className="text-sm text-[#4B5157]">{t("checkout.company")} *</Label>
                  <Input id="q-company" required value={form.company} onChange={set("company")} className="rounded-none mt-1" />
                </div>
                <div>
                  <Label htmlFor="q-vat" className="text-sm text-[#4B5157]">{t("checkout.vatId")} ({t("common.optional")})</Label>
                  <Input id="q-vat" value={form.vatId} onChange={set("vatId")} className="rounded-none mt-1 font-mono" />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Notes + photos */}
        <section className="bg-white border border-[#E0E2E5] p-5 sm:p-6">
          <h2 className="font-heading font-bold text-[#1A1C1E] mb-4">
            <span className="text-[#795207] mr-2">04</span>{t("quote.stepNotes")}
          </h2>
          <Textarea value={form.notes} onChange={set("notes")} className="rounded-none" rows={3} placeholder={t("checkout.notes")} />
          <div className="mt-4">
            <label className="inline-flex items-center gap-2 border border-dashed border-[#E0E2E5] px-4 py-3 text-sm text-[#6B7075] cursor-pointer hover:border-[#F5A623]">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
              {lang === "de" ? "Fotos vom Lieferort hinzufügen" : "Dodaj zdjęcia miejsca dostawy"} ({t("common.optional")})
              <input type="file" accept="image/*" multiple className="hidden" onChange={uploadPhotos} disabled={uploading || photos.length >= 6} />
            </label>
            {photos.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {photos.map((url, i) => (
                  <div key={i} className="relative">
                    <Image src={url} alt={`Upload ${i + 1}`} width={80} height={80} className="w-20 h-20 object-cover border border-[#E0E2E5]" />
                    <button type="button" onClick={() => setPhotos((p) => p.filter((_, pi) => pi !== i))} className="absolute -top-2 -right-2 bg-white border border-[#E0E2E5] rounded-full p-0.5" aria-label={t("common.remove")}>
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div>
          <p className="text-sm leading-6 text-[#4B5157] mb-3">{t("quote.nonBinding")}</p>
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <Button type="submit" disabled={submitting} className="bg-[#F5A623] hover:bg-[#DB930D] !text-[#1A1C1E] rounded-none font-semibold h-12 px-10 text-base">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t("quote.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
