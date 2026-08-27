import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLang, usePageMeta } from "@/lib/i18n";
import { useCart } from "@/lib/CartContext";
import { useSettings } from "@/lib/useSettings";
import { formatMoney, round2 } from "@/lib/format";
import { computeVatTreatment, vatLabel } from "@/lib/vat";
import { calcDeliveryClient } from "@/lib/deliveryClient";
import { pathFor } from "@/lib/routes";
import VatIdField from "@/components/store/VatIdField";

function Field({ id, label, required, ...props }) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs font-mono text-[#6B7075]">
        {label}{required && " *"}
      </Label>
      <Input id={id} required={required} className="rounded-none mt-1" {...props} />
    </div>
  );
}

export default function Checkout() {
  const { lang, market, currency, t } = useLang();
  const { items, clearCart } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();
  usePageMeta(t("checkout.title"));

  const [customerType, setCustomerType] = useState("private");
  const [form, setForm] = useState({
    name: "", company: "", nip: "", email: "", phone: "",
    street: "", postal: "", city: "",
    d_street: "", d_postal: "", d_city: "",
    instructions: "", unloading: "self", po: "", notes: "",
  });
  const [vatId, setVatId] = useState("");
  const [vatResult, setVatResult] = useState(null);
  const [sameAddress, setSameAddress] = useState(true);
  const [termsOk, setTermsOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const deliveryPostal = sameAddress ? form.postal : form.d_postal;

  const { data: zones } = useQuery({
    queryKey: ["delivery-zones", market],
    queryFn: () => base44.entities.DeliveryZone.filter({ country: market }),
  });

  const delivery = useMemo(() => {
    if (!deliveryPostal) return null;
    return calcDeliveryClient(zones || [], {
      country: market,
      postalCode: deliveryPostal,
      items: items.map((i) => ({ size: i.size, quantity: i.quantity })),
      craneUnloading: form.unloading === "crane",
    });
  }, [zones, deliveryPostal, items, form.unloading, market]);

  const unitNet = (i) => (market === "DE" ? i.price_eur_net : i.price_pln_net);
  const itemsNet = round2(items.reduce((s, i) => s + (unitNet(i) || 0) * i.quantity, 0));
  const deliveryNet = delivery && !delivery.quoteRequired ? delivery.cost : 0;
  const netSubtotal = round2(itemsNet + deliveryNet);
  const { rate, treatment } = computeVatTreatment(settings, {
    market,
    customerType,
    vatValid: vatResult?.valid === true,
    deliveryCountry: market,
  });
  const vatAmount = round2(netSubtotal * (rate / 100));
  const grossTotal = round2(netSubtotal + vatAmount);

  const submit = async (e) => {
    e.preventDefault();
    if (!termsOk || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const billing = { street: form.street, postal_code: form.postal, city: form.city, country: market };
      const deliveryAddr = sameAddress
        ? billing
        : { street: form.d_street, postal_code: form.d_postal, city: form.d_city, country: market };
      const res = await base44.functions.invoke("submitOrder", {
        market, language: lang,
        items: items.map((i) => ({
          product_id: i.product_id, sku: i.sku, quantity: i.quantity,
          variant_label: lang === "de" ? i.variant_label_de : i.variant_label_pl,
        })),
        customer_type: customerType,
        customer: {
          name: form.name, company: form.company, nip: form.nip, vat_id: vatId,
          email: form.email, phone: form.phone, po_reference: form.po, notes: form.notes,
        },
        billing_address: billing,
        delivery_address: deliveryAddr,
        delivery_postal_code: deliveryAddr.postal_code,
        delivery_instructions: form.instructions,
        unloading_method: form.unloading === "crane" ? "crane_hds" : "self",
      });
      const data = res.data;
      sessionStorage.setItem(
        "olborg_last_order",
        JSON.stringify({ ...data, email: form.email, lang })
      );
      clearCart();
      navigate(`${pathFor("confirmation", lang)}?nr=${encodeURIComponent(data.order_number)}`);
    } catch {
      setError(t("checkout.submitError"));
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-[#6B7075] mb-6">{t("cart.empty")}</p>
        <Button asChild className="bg-[#1A1C1E] rounded-none"><Link to={pathFor("shop", lang)}>{t("cart.emptyCta")}</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-[#1A1C1E] mb-8">{t("checkout.title")}</h1>
      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Customer */}
          <section className="bg-white border border-[#E0E2E5] p-5 sm:p-6">
            <h2 className="font-heading font-bold text-[#1A1C1E] mb-4">
              <span className="font-mono text-[#E65100] mr-2">01</span>{t("checkout.stepCustomer")}
            </h2>
            <RadioGroup value={customerType} onValueChange={(v) => { setCustomerType(v); setVatResult(null); }} className="flex gap-4 mb-5">
              <label className={`flex-1 border p-3 cursor-pointer flex items-center gap-2 text-sm font-medium ${customerType === "private" ? "border-[#1A1C1E] bg-[#F8F9FA]" : "border-[#E0E2E5]"}`}>
                <RadioGroupItem value="private" /> {t("checkout.private")}
              </label>
              <label className={`flex-1 border p-3 cursor-pointer flex items-center gap-2 text-sm font-medium ${customerType === "business" ? "border-[#1A1C1E] bg-[#F8F9FA]" : "border-[#E0E2E5]"}`}>
                <RadioGroupItem value="business" /> {t("checkout.business")}
              </label>
            </RadioGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="c-name" label={t("checkout.name")} required value={form.name} onChange={set("name")} />
              <Field id="c-email" label={t("checkout.email")} type="email" required value={form.email} onChange={set("email")} />
              <Field id="c-phone" label={t("checkout.phone")} required value={form.phone} onChange={set("phone")} />
              {customerType === "business" && (
                <>
                  <Field id="c-company" label={t("checkout.company")} required value={form.company} onChange={set("company")} />
                  {market === "PL" ? (
                    <Field id="c-nip" label={t("checkout.nip")} required value={form.nip} onChange={set("nip")} />
                  ) : (
                    <div className="sm:col-span-2">
                      <VatIdField value={vatId} onChange={setVatId} onResult={setVatResult} />
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* 2. Addresses + delivery */}
          <section className="bg-white border border-[#E0E2E5] p-5 sm:p-6">
            <h2 className="font-heading font-bold text-[#1A1C1E] mb-4">
              <span className="font-mono text-[#E65100] mr-2">02</span>{t("checkout.stepDelivery")}
            </h2>
            <p className="font-mono text-xs uppercase tracking-widest text-[#6B7075] mb-3">{t("checkout.billingAddress")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3"><Field id="b-street" label={t("checkout.street")} required value={form.street} onChange={set("street")} /></div>
              <Field id="b-postal" label={`${t("checkout.postalCode")} (${market})`} required value={form.postal} onChange={set("postal")} />
              <div className="sm:col-span-2"><Field id="b-city" label={t("checkout.city")} required value={form.city} onChange={set("city")} /></div>
            </div>
            <label className="flex items-center gap-2 text-sm mt-4">
              <Checkbox checked={sameAddress} onCheckedChange={setSameAddress} /> {t("checkout.sameAsBilling")}
            </label>
            {!sameAddress && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="sm:col-span-3"><Field id="d-street" label={t("checkout.street")} required value={form.d_street} onChange={set("d_street")} /></div>
                <Field id="d-postal" label={`${t("checkout.postalCode")} (${market})`} required value={form.d_postal} onChange={set("d_postal")} />
                <div className="sm:col-span-2"><Field id="d-city" label={t("checkout.city")} required value={form.d_city} onChange={set("d_city")} /></div>
              </div>
            )}
            <div className="mt-5">
              <p className="font-mono text-xs uppercase tracking-widest text-[#6B7075] mb-2">{t("checkout.unloading")}</p>
              <RadioGroup value={form.unloading} onValueChange={(v) => setForm((f) => ({ ...f, unloading: v }))} className="space-y-2">
                <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="self" /> {t("checkout.unloadingSelf")}</label>
                <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="crane" /> {t("checkout.unloadingCrane")}</label>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <Field id="c-po" label={`${t("checkout.poReference")} (${t("common.optional")})`} value={form.po} onChange={set("po")} />
              <Field id="c-instr" label={`${t("checkout.deliveryInstructions")} (${t("common.optional")})`} value={form.instructions} onChange={set("instructions")} />
            </div>
            {delivery && (
              <div className="mt-4 border-t border-[#E0E2E5] pt-3 text-sm">
                {delivery.quoteRequired ? (
                  <p className="font-semibold text-[#E65100]">{t("product.deliveryQuoteRequired")}</p>
                ) : (
                  <p className="flex justify-between">
                    <span className="text-[#6B7075]">{t("product.deliveryCost")} ({t("common.netto")})</span>
                    <span className="font-mono font-semibold">{formatMoney(delivery.cost, currency)}</span>
                  </p>
                )}
              </div>
            )}
          </section>

          {/* 3. Payment */}
          <section className="bg-white border border-[#E0E2E5] p-5 sm:p-6">
            <h2 className="font-heading font-bold text-[#1A1C1E] mb-4">
              <span className="font-mono text-[#E65100] mr-2">03</span>{t("checkout.stepPayment")}
            </h2>
            <div className="border border-[#1A1C1E] bg-[#F8F9FA] p-4">
              <p className="font-semibold text-sm">{t("checkout.bankTransfer")}</p>
              <p className="text-xs text-[#6B7075] mt-1">{t("checkout.bankTransferInfo")}</p>
            </div>
            <div className="mt-4">
              <Label htmlFor="c-notes" className="text-xs font-mono text-[#6B7075]">{t("checkout.notes")} ({t("common.optional")})</Label>
              <Textarea id="c-notes" value={form.notes} onChange={set("notes")} className="rounded-none mt-1" rows={3} />
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="bg-white border border-[#E0E2E5] p-5 h-fit lg:sticky lg:top-24">
          <h2 className="font-heading font-bold text-[#1A1C1E] mb-4">{t("checkout.orderSummary")}</h2>
          <ul className="space-y-2 text-sm mb-4">
            {items.map((i) => (
              <li key={i.sku} className="flex justify-between gap-2">
                <span className="text-[#3A3E42]">
                  {i.quantity} × {lang === "de" ? i.name_de : i.name_pl}
                  <span className="block font-mono text-[11px] text-[#6B7075]">{i.sku}</span>
                </span>
                <span className="font-mono shrink-0">{formatMoney(round2((unitNet(i) || 0) * i.quantity), currency)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 text-sm border-t border-[#E0E2E5] pt-3">
            <div className="flex justify-between"><dt className="text-[#6B7075]">{t("checkout.netSubtotal")}</dt><dd className="font-mono">{formatMoney(itemsNet, currency)}</dd></div>
            <div className="flex justify-between">
              <dt className="text-[#6B7075]">{t("common.delivery")} ({t("common.netto")})</dt>
              <dd className="font-mono">{delivery && !delivery.quoteRequired ? formatMoney(deliveryNet, currency) : "—"}</dd>
            </div>
            <div className="flex justify-between"><dt className="text-[#6B7075]">{t("common.vat")} ({rate}%)</dt><dd className="font-mono">{formatMoney(vatAmount, currency)}</dd></div>
            <div className="flex justify-between border-t border-[#E0E2E5] pt-2 text-base font-bold"><dt>{t("checkout.grossTotal")}</dt><dd className="font-mono">{formatMoney(grossTotal, currency)}</dd></div>
          </dl>
          <p className="font-mono text-[11px] text-[#6B7075] mt-2">{vatLabel(lang, rate, treatment, settings)}</p>
          {treatment === "intra_eu_b2b_0" && (
            <p className="text-xs text-[#2E7D32] mt-1.5">{t("checkout.vatValid")}</p>
          )}
          <label className="flex items-start gap-2 text-xs text-[#3A3E42] mt-4">
            <Checkbox checked={termsOk} onCheckedChange={setTermsOk} className="mt-0.5" />
            <span>
              {t("checkout.termsAgree")} — <Link to={pathFor("terms", lang)} className="underline" target="_blank">{lang === "de" ? "AGB" : "Regulamin"}</Link>,{" "}
              <Link to={pathFor("privacy", lang)} className="underline" target="_blank">{lang === "de" ? "Datenschutz" : "Prywatność"}</Link>
            </span>
          </label>
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          <Button
            type="submit"
            disabled={!termsOk || submitting}
            className="w-full mt-4 bg-[#E65100] hover:bg-[#C74600] rounded-none font-semibold h-12 text-base"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t("checkout.placeOrder")}
          </Button>
        </aside>
      </form>
    </div>
  );
}