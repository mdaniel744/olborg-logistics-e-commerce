"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLang, usePageMeta } from "@/lib/i18n";
import { useCart } from "@/lib/CartContext";
import { cartItemKey } from "@/lib/cartItems";
import { useSettings } from "@/lib/useSettings";
import { formatMoney, round2 } from "@/lib/format";
import { computeVatTreatment, vatLabel } from "@/lib/vat";
import { calcDeliveryClient } from "@/lib/deliveryClient";
import { pathFor } from "@/lib/routes";
import VatIdField from "@/components/store/VatIdField";
import { DELIVERY_ZONES } from "@/data/catalog";
import SellerIdentity from "@/components/store/SellerIdentity";
import { checkoutReadiness } from "@/lib/checkoutReadiness";
import { calculateOrderTotals } from "@/lib/orderTotals";

function Field({ id, label, required, ...props }) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm text-[#4B5157]">
        {label}{required && " *"}
      </Label>
      <Input id={id} name={id} required={required} className="rounded-none mt-1" {...props} />
    </div>
  );
}

export default function Checkout() {
  const { lang, market, currency, t } = useLang();
  const { items, hydrated, clearCart, applyPriceUpdates } = useCart();
  const { settings } = useSettings();
  const router = useRouter();
  usePageMeta(t("checkout.title"));

  const [customerType, setCustomerType] = useState("private");
  const [form, setForm] = useState({
    name: "", company: "", nip: "", email: "", phone: "",
    street: "", postal: "", city: "",
    d_street: "", d_postal: "", d_city: "",
    instructions: "", po: "", notes: "",
  });
  const [vatId, setVatId] = useState("");
  const [vatResult, setVatResult] = useState(null);
  const [sameAddress, setSameAddress] = useState(true);
  const [termsOk, setTermsOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const submissionKey = useRef(null);
  const submissionFingerprint = useRef(null);

  useEffect(() => {
    setVatId("");
    setVatResult(null);
    setError(null);
    setForm((current) => ({ ...current, nip: "" }));
  }, [market]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const changeCustomerType = (value) => {
    setCustomerType(value);
    setVatResult(null);
    setError(null);
    if (value === "private") {
      setVatId("");
      setForm((current) => ({ ...current, company: "", nip: "", po: "" }));
    }
  };
  const deliveryPostal = sameAddress ? form.postal : form.d_postal;

  const zones = useMemo(
    () => DELIVERY_ZONES.filter((zone) => zone.country === market),
    [market]
  );

  const delivery = useMemo(() => {
    if (!deliveryPostal) return null;
    return calcDeliveryClient(zones || [], {
      country: market,
      postalCode: deliveryPostal,
      items: items.map((i) => ({ size: i.size, quantity: i.quantity })),
    });
  }, [zones, deliveryPostal, items, market]);

  const unitNet = (i) => (market === "DE" ? i.price_eur_net : i.price_pln_net);
  const pricesKnown = items.every((item) => Number.isFinite(unitNet(item)) && unitNet(item) > 0);
  const itemsNet = pricesKnown ? round2(items.reduce((s, i) => s + unitNet(i) * i.quantity, 0)) : null;
  const { rate, treatment } = computeVatTreatment(settings, {
    market,
    customerType,
    vatValid: vatResult?.valid === true,
    deliveryCountry: market,
  });
  const deliveryCharge = delivery && !delivery.quoteRequired ? delivery.customerCharge : 0;
  const totals = pricesKnown ? calculateOrderTotals({ itemsNet, deliveryCharge, vatRate: rate }) : null;
  const itemsGross = totals?.items_gross ?? null;
  const deliveryNet = totals?.delivery_net ?? 0;
  const vatAmount = totals?.vat_amount ?? null;
  const grossTotal = totals?.gross_total ?? null;
  const readiness = checkoutReadiness({ delivery, settings, market, lang });

  const submit = async (e) => {
    e.preventDefault();
    if (!termsOk || submitting || !readiness.ready || !pricesKnown) return;
    setSubmitting(true);
    setError(null);
    try {
      const billing = { street: form.street, postal_code: form.postal, city: form.city, country: market };
      const deliveryAddr = sameAddress
        ? billing
        : { street: form.d_street, postal_code: form.d_postal, city: form.d_city, country: market };
      const payload = {
        market, language: lang,
        items: items.map((i) => ({
          product_id: i.product_id, sku: i.sku, quantity: i.quantity,
          variant_label: lang === "de" ? i.variant_label_de : i.variant_label_pl,
        })),
        customer_type: customerType,
        customer: {
          name: form.name, email: form.email, phone: form.phone, notes: form.notes,
          ...(customerType === "business" ? {
            company: form.company,
            po_reference: form.po,
            ...(market === "PL" && form.nip.trim() ? { nip: form.nip } : {}),
            ...(market === "DE" && vatId.trim() ? { vat_id: vatId } : {}),
          } : {}),
        },
        billing_address: billing,
        delivery_address: deliveryAddr,
        delivery_postal_code: deliveryAddr.postal_code,
        delivery_instructions: form.instructions,
        terms_accepted: termsOk,
        reviewed_totals: {
          currency,
          items_net: itemsNet,
          items_gross: itemsGross,
          delivery_net: deliveryNet,
          delivery_charge: deliveryCharge,
          vat_rate: rate,
          vat_amount: vatAmount,
          gross_total: grossTotal,
        },
      };
      const fingerprint = JSON.stringify(payload);
      if (submissionFingerprint.current !== fingerprint) {
        submissionKey.current = crypto.randomUUID();
        submissionFingerprint.current = fingerprint;
      }
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": submissionKey.current },
        body: fingerprint,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.order_number) {
        const code = data?.error || "order_submission_failed";
        if (response.status === 409 && data?.cart_updates) {
          applyPriceUpdates(data.cart_updates, market);
          setVatId("");
          setVatResult(null);
        }
        throw new Error(code);
      }
      sessionStorage.setItem(
        "olborg_last_order",
        JSON.stringify({ ...data, email: form.email, lang })
      );
      clearCart();
      router.push(`${pathFor("confirmation", lang)}?nr=${encodeURIComponent(data.order_number)}`);
    } catch (submissionError) {
      const errorKey = `checkout.errors.${submissionError?.message}`;
      const translatedError = t(errorKey);
      setError(translatedError === errorKey ? t("checkout.submitError") : translatedError);
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return <div className="py-20 text-center text-[#6B7075]">{t("common.loading")}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-[#6B7075] mb-6">{t("cart.empty")}</p>
        <Button asChild className="bg-[#1A1C1E] rounded-none"><Link href={pathFor("shop", lang)}>{t("cart.emptyCta")}</Link></Button>
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
              <span className="text-[#795207] mr-2">01</span>{t("checkout.stepCustomer")}
            </h2>
            <RadioGroup value={customerType} onValueChange={changeCustomerType} className="flex gap-4 mb-5">
              <label className={`flex-1 border p-3 cursor-pointer flex items-center gap-2 text-sm font-medium ${customerType === "private" ? "border-[#1A1C1E] bg-[#F8F9FA]" : "border-[#E0E2E5]"}`}>
                <RadioGroupItem value="private" /> {t("checkout.private")}
              </label>
              <label className={`flex-1 border p-3 cursor-pointer flex items-center gap-2 text-sm font-medium ${customerType === "business" ? "border-[#1A1C1E] bg-[#F8F9FA]" : "border-[#E0E2E5]"}`}>
                <RadioGroupItem value="business" /> {t("checkout.business")}
              </label>
            </RadioGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="c-name" label={t("checkout.name")} autoComplete="name" required value={form.name} onChange={set("name")} />
              <Field id="c-email" label={t("checkout.email")} type="email" autoComplete="email" required value={form.email} onChange={set("email")} />
              <Field id="c-phone" label={t("checkout.phone")} type="tel" autoComplete="tel" required value={form.phone} onChange={set("phone")} />
              {customerType === "business" && (
                <>
                  <Field id="c-company" label={t("checkout.company")} autoComplete="organization" required value={form.company} onChange={set("company")} />
                  {market === "PL" ? (
                    <Field id="c-nip" label={`${t("checkout.nip")} (${t("common.optional")})`} inputMode="numeric" value={form.nip} onChange={set("nip")} />
                  ) : (
                    <div className="sm:col-span-2">
              <VatIdField value={vatId} onChange={setVatId} onResult={setVatResult} expectedCountry="DE" />
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* 2. Addresses + delivery */}
          <section className="bg-white border border-[#E0E2E5] p-5 sm:p-6">
            <h2 className="font-heading font-bold text-[#1A1C1E] mb-4">
              <span className="text-[#795207] mr-2">02</span>{t("checkout.stepDelivery")}
            </h2>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4B5157] mb-3">{t("checkout.billingAddress")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3"><Field id="b-street" label={t("checkout.street")} autoComplete="street-address" required value={form.street} onChange={set("street")} /></div>
              <Field id="b-postal" label={`${t("checkout.postalCode")} (${market})`} autoComplete="postal-code" inputMode="numeric" pattern={market === "DE" ? "[0-9]{5}" : "[0-9]{2}-?[0-9]{3}"} maxLength={market === "DE" ? 5 : 6} required value={form.postal} onChange={set("postal")} />
              <div className="sm:col-span-2"><Field id="b-city" label={t("checkout.city")} autoComplete="address-level2" required value={form.city} onChange={set("city")} /></div>
            </div>
            <label className="flex items-center gap-2 text-sm mt-4">
              <Checkbox checked={sameAddress} onCheckedChange={(value) => setSameAddress(value === true)} /> {t("checkout.sameAsBilling")}
            </label>
            {!sameAddress && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="sm:col-span-3"><Field id="d-street" label={t("checkout.street")} autoComplete="shipping street-address" required value={form.d_street} onChange={set("d_street")} /></div>
                <Field id="d-postal" label={`${t("checkout.postalCode")} (${market})`} autoComplete="shipping postal-code" inputMode="numeric" pattern={market === "DE" ? "[0-9]{5}" : "[0-9]{2}-?[0-9]{3}"} maxLength={market === "DE" ? 5 : 6} required value={form.d_postal} onChange={set("d_postal")} />
                <div className="sm:col-span-2"><Field id="d-city" label={t("checkout.city")} autoComplete="shipping address-level2" required value={form.d_city} onChange={set("d_city")} /></div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              {customerType === "business" && <Field id="c-po" label={`${t("checkout.poReference")} (${t("common.optional")})`} value={form.po} onChange={set("po")} />}
              <Field id="c-instr" label={`${t("checkout.deliveryInstructions")} (${t("common.optional")})`} value={form.instructions} onChange={set("instructions")} />
            </div>
            {delivery && (
              <div className="mt-4 border-t border-[#E0E2E5] pt-3 text-sm">
                {delivery.quoteRequired ? (
                  <p className="font-semibold text-[#795207]">{t("product.deliveryQuoteRequired")}</p>
                ) : (
                  <p className="flex justify-between">
                    <span className="text-[#6B7075]">{t("checkout.flatRateShipping")}</span>
                    <span className="font-mono font-semibold">{formatMoney(deliveryCharge, currency)}</span>
                  </p>
                )}
                {!delivery.quoteRequired && <p className="mt-2 text-xs leading-5 text-[#6B7075]">{t("checkout.flatRateShippingInfo")}</p>}
              </div>
            )}
          </section>

          {/* 3. Payment */}
          <section className="bg-white border border-[#E0E2E5] p-5 sm:p-6">
            <h2 className="font-heading font-bold text-[#1A1C1E] mb-4">
              <span className="text-[#795207] mr-2">03</span>{t("checkout.stepPayment")}
            </h2>
            <div className="border border-[#1A1C1E] bg-[#F8F9FA] p-4">
              <p className="font-semibold text-sm">{t("checkout.bankTransfer")}</p>
              <p className="text-sm leading-6 text-[#4B5157] mt-1">{t("checkout.bankTransferInfo")}</p>
            </div>
            <div className="mt-4">
              <Label htmlFor="c-notes" className="text-sm text-[#4B5157]">{t("checkout.notes")} ({t("common.optional")})</Label>
              <Textarea id="c-notes" value={form.notes} onChange={set("notes")} className="rounded-none mt-1" rows={3} />
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="bg-white border border-[#E0E2E5] p-5 h-fit lg:sticky lg:top-24">
          <h2 className="font-heading font-bold text-[#1A1C1E] mb-4">{t("checkout.orderSummary")}</h2>
          <ul className="space-y-2 text-sm mb-4">
            {items.map((i) => (
              <li key={cartItemKey(i)} className="flex justify-between gap-2">
                <span className="text-[#3A3E42]">
                  {i.quantity} × {lang === "de" ? i.name_de : i.name_pl}
                  {i.sku && <span className="block font-mono text-[11px] text-[#6B7075]">{i.sku}</span>}
                </span>
                <span className="font-mono shrink-0">{formatMoney(Number.isFinite(unitNet(i)) ? round2(unitNet(i) * i.quantity * (1 + rate / 100)) : null, currency)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 text-sm border-t border-[#E0E2E5] pt-3">
            <div className="flex justify-between"><dt className="text-[#6B7075]">{t("checkout.itemsSubtotal")}</dt><dd className="font-mono">{formatMoney(itemsGross, currency)}</dd></div>
            <div className="flex justify-between">
              <dt className="text-[#6B7075]">{t("checkout.flatRateShipping")}</dt>
              <dd className="font-mono">{delivery && !delivery.quoteRequired ? formatMoney(deliveryCharge, currency) : "—"}</dd>
            </div>
            <div className="flex justify-between text-xs"><dt className="text-[#6B7075]">{t("checkout.includedVat")} ({rate}%)</dt><dd className="font-mono text-[#6B7075]">{formatMoney(vatAmount, currency)}</dd></div>
            <div className="flex justify-between border-t border-[#E0E2E5] pt-2 text-base font-bold"><dt>{t("checkout.grossTotal")}</dt><dd className="font-mono">{readiness.deliveryKnown ? formatMoney(grossTotal, currency) : "—"}</dd></div>
          </dl>
          <p className="font-mono text-[11px] text-[#6B7075] mt-2">{vatLabel(lang, rate, treatment, settings)}</p>
          {treatment === "intra_eu_b2b_0" && (
            <p className="text-sm leading-6 text-[#2E7D32] mt-1.5">{t("checkout.vatValid")}</p>
          )}
          <label className="flex items-start gap-2 text-sm leading-6 text-[#343A40] mt-4">
            <Checkbox checked={termsOk} onCheckedChange={(value) => setTermsOk(value === true)} className="mt-0.5" />
            <span>
              {t("checkout.termsAgree")} — <Link href={pathFor("terms", lang)} className="underline" target="_blank">{lang === "de" ? "AGB" : "Regulamin"}</Link>,{" "}
              <Link href={pathFor("privacy", lang)} className="underline" target="_blank">{lang === "de" ? "Datenschutz" : "Prywatność"}</Link>
            </span>
          </label>
          {error && <p className="text-sm text-red-600 mt-3" role="alert" aria-live="polite">{error}</p>}
          {!pricesKnown && <p className="mt-4 text-sm leading-6 text-red-600">{t("checkout.priceUnavailable")}</p>}
          {!readiness.deliveryKnown && (
            <p className="mt-4 text-sm leading-6 text-[#795207]">
              {lang === "de" ? "Geben Sie eine gültige polnische oder deutsche Lieferpostleitzahl ein, damit die Pauschale für die gesamte Bestellung angezeigt wird. Für die Standardlieferung ist kein gesondertes Angebot erforderlich." : "Podaj prawidłowy polski lub niemiecki kod pocztowy dostawy, aby wyświetlić stałą stawkę dla całego zamówienia. Standardowa dostawa nie wymaga osobnej wyceny."}
            </p>
          )}
          {readiness.returnCharge && (
            <div className="mt-4 text-sm leading-6 text-[#4B5157]">
              <p>{t("checkout.returnTransportCharge")}: {readiness.returnCharge}</p>
              <Link href={pathFor("returns", lang)} className="underline">{lang === "de" ? "Rückgabe und Erstattung" : "Zwroty i zwrot płatności"}</Link>
            </div>
          )}
          {!readiness.ready && <Button asChild variant="outline" className="mt-4 w-full"><Link href={pathFor("quote", lang)}>{t("common.requestQuote")}</Link></Button>}
          <Button
            type="submit"
            disabled={!termsOk || submitting || !readiness.ready || !pricesKnown}
            className="w-full mt-4 bg-[#F5A623] hover:bg-[#DB930D] !text-[#1A1C1E] rounded-none font-semibold h-12 text-base"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t(customerType === "business" ? "checkout.placeOrderBusiness" : "checkout.placeOrder")}
          </Button>
          <SellerIdentity lang={lang} className="mt-6 text-[#5F656B]" />
        </aside>
      </form>
    </div>
  );
}
