"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Trash2, ImagePlus, CheckCircle2 } from "lucide-react";
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

export default function QuotePage() {
  const { lang, market, t } = useLang();
  const { products } = useProducts();
  const { items: cartItems } = useCart();
  usePageMeta(t("quote.title"), t("quote.subtitle"));

  // Variant options across all products
  const options = products.flatMap((p) =>
    (p.variants || [])
      .filter((v) => v.active !== false)
      .map((v) => ({
        value: `${p.id}|${v.sku}`,
        label: `${lang === "de" ? p.name_de : p.name_pl} — ${t(`common.${v.condition}`)}`,
        product_id: p.id,
        product_name: lang === "de" ? p.name_de : p.name_pl,
        sku: v.sku,
        variant_label: t(`common.${v.condition}`),
      }))
  );

  const [rows, setRows] = useState(() =>
    cartItems.length
      ? cartItems.map((i) => ({ value: `${i.product_id}|${i.sku}`, quantity: i.quantity }))
      : [{ value: "", quantity: 1 }]
  );
  const [form, setForm] = useState({
    freeText: "", country: market, postal: "", city: "", address: "",
    unloading: "self", siteAccess: "", name: "", company: "", vatId: "",
    email: "", phone: "", notes: "",
  });
  const [customerType, setCustomerType] = useState("private");
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sentNumber, setSentNumber] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setRow = (i, patch) => setRows((r) => r.map((row, ri) => (ri === i ? { ...row, ...patch } : row)));

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
      const items = rows
        .filter((r) => r.value)
        .map((r) => {
          const opt = options.find((o) => o.value === r.value);
          return opt && {
            product_id: opt.product_id, product_name: opt.product_name,
            sku: opt.sku, variant_label: opt.variant_label, quantity: r.quantity,
          };
        })
        .filter(Boolean);
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
          <div className="space-y-3">
            {rows.map((row, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1">
                  <Select value={row.value} onValueChange={(v) => setRow(i, { value: v })}>
                    <SelectTrigger className="rounded-none"><SelectValue placeholder={t("quote.addProduct")} /></SelectTrigger>
                    <SelectContent>
                      {options.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  type="number" min={1} max={500}
                  value={row.quantity}
                  onChange={(e) => setRow(i, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                  className="rounded-none w-20 font-mono"
                  aria-label={t("common.quantity")}
                />
                {rows.length > 1 && (
                  <button type="button" onClick={() => setRows((r) => r.filter((_, ri) => ri !== i))} className="text-[#6B7075] hover:text-red-600 px-1" aria-label={t("common.remove")}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" onClick={() => setRows((r) => [...r, { value: "", quantity: 1 }])} className="mt-3 rounded-none border-[#E0E2E5] text-[#3A3E42]">
            <Plus className="w-4 h-4" /> {t("quote.addProduct")}
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
              <Label className="text-sm text-[#4B5157]">{t("checkout.country")} *</Label>
              <Select value={form.country} onValueChange={(v) => setForm((f) => ({ ...f, country: v }))}>
                <SelectTrigger className="rounded-none mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
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
