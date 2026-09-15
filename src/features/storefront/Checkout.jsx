"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLang, usePageMeta } from "@/lib/i18n";
import { useCart } from "@/lib/CartContext";
import { cartItemKey } from "@/lib/cartItems";
import { useProductRows, useSettings } from "@/lib/useSettings";
import { formatMoney, round2 } from "@/lib/format";
import { computeVatTreatment, vatLabel } from "@/lib/vat";
import { flatRateDelivery } from "@/lib/deliveryClient";
import { pathFor } from "@/lib/routes";
import VatIdField from "@/components/store/VatIdField";
import { DELIVERY_ZONES } from "@/data/catalog";
import { checkoutReadiness } from "@/lib/checkoutReadiness";
import { calculateOrderTotals } from "@/lib/orderTotals";
import { rememberOrder } from "@/lib/orderConfirmation";

function Field({ id, label, required, ...props }) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm text-[#4B5157]">
        {label}{required && " *"}
      </Label>
      <Input id={id} name={id} required={required} className="rounded-none mt-1.5 h-11" {...props} />
    </div>
  );
}

export default function Checkout() {
  const { lang, market: initialMarket, t } = useLang();
  const [market, setMarket] = useState(initialMarket);
  const currency = market === "DE" ? "EUR" : "PLN";
  const { items, hydrated, clearCart, applyPriceUpdates } = useCart();
  const { settings } = useSettings();
  const { products, isLoading: checkingProducts } = useProductRows();
  const router = useRouter();
  usePageMeta(t("checkout.title"));

  const [customerType, setCustomerType] = useState("private");
  const [form, setForm] = useState({
    name: "", company: "", nip: "", email: "", phone: "",
    street: "", postal: "", city: "",
    d_street: "", d_postal: "", d_city: "",
    notes: "",
  });
  const [vatId, setVatId] = useState("");
  const [vatResult, setVatResult] = useState(null);
  const [sameAddress, setSameAddress] = useState(true);
  const [termsOk, setTermsOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [reviewedPrices, setReviewedPrices] = useState({});
  const submissionKey = useRef(null);
  const submissionFingerprint = useRef(null);
  const submissionInFlight = useRef(false);

  const changeMarket = (value) => {
    setMarket(value);
    setVatId("");
    setVatResult(null);
    setError(null);
    setForm((current) => ({ ...current, nip: "" }));
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const changeCustomerType = (value) => {
    setCustomerType(value);
    setVatResult(null);
    setError(null);
    if (value === "private") {
      setVatId("");
      setForm((current) => ({ ...current, company: "", nip: "" }));
    }
  };
  const delivery = flatRateDelivery(DELIVERY_ZONES, market);

  const unavailableItems = checkingProducts ? [] : items.filter((item) => {
    const product = products.find((entry) => entry.id === item.product_id);
    return !product || product.is_demo || product.active === false || product.status !== "active" || product.availability !== "in_stock";
  });
  const productsAvailable = !checkingProducts && unavailableItems.length === 0;
  const unitNet = (item) => {
    const reviewed = reviewedPrices[`${market}:${item.product_id}`];
    if (Number.isFinite(reviewed)) return reviewed;
    const current = products.find((product) => product.id === item.product_id);
    return market === "DE" ? (current || item).price_eur_net : (current || item).price_pln_net;
  };
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
    if (!termsOk || submissionInFlight.current || !readiness.ready || !pricesKnown || !productsAvailable) return;
    submissionInFlight.current = true;
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
            ...(market === "PL" && form.nip.trim() ? { nip: form.nip } : {}),
            ...(market === "DE" && vatId.trim() ? { vat_id: vatId } : {}),
          } : {}),
        },
        billing_address: billing,
        delivery_address: deliveryAddr,
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
      if (!response.ok || !data?.id || !data?.order_number) {
        const code = data?.error || "order_submission_failed";
        if (response.status === 409 && data?.cart_updates) {
          applyPriceUpdates(data.cart_updates, market);
          setReviewedPrices((current) => ({
            ...current,
            ...Object.fromEntries(data.cart_updates.map((item) => [`${market}:${item.product_id}`, item.unit_price_net])),
          }));
          setVatResult({ valid: data.totals?.vat_rate === 0, vat_id: vatId });
        }
        throw new Error(code);
      }
      rememberOrder({ ...data, email: form.email.trim(), lang });
      clearCart();
      router.replace(`${pathFor("confirmation", lang)}?nr=${encodeURIComponent(data.order_number)}`);
    } catch (submissionError) {
      const errorKey = `checkout.errors.${submissionError?.message}`;
      const translatedError = t(errorKey);
      setError(translatedError === errorKey ? t("checkout.submitError") : translatedError);
      setSubmitting(false);
      submissionInFlight.current = false;
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
      <Link href={pathFor("cart", lang)} className="inline-flex items-center gap-2 text-sm text-[#5F656B] hover:text-[#1A1C1E] mb-6">
        <ArrowLeft className="w-4 h-4" /><span>{t("checkout.backToCart")}</span>
      </Link>
      <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1C1E]">{t("checkout.title")}</h1>
      <p className="mt-3 mb-8 max-w-2xl text-[#5F656B] leading-7">{t("checkout.intro")}</p>
      <form onSubmit={submit}>
        <fieldset disabled={submitting} className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-6 lg:gap-10">
        <div className="min-w-0 bg-white p-5 sm:p-7 shadow-sm">
          <section aria-labelledby="checkout-details-heading">
            <h2 id="checkout-details-heading" className="font-heading text-lg font-bold text-[#1A1C1E] mb-5">{t("checkout.billingDetails")}</h2>
            <fieldset className="mb-6">
              <legend className="sr-only">{t("checkout.customerType")}</legend>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {["private", "business"].map((value) => (
                  <label key={value} className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="radio" name="customer-type" value={value} checked={customerType === value} onChange={() => changeCustomerType(value)} className="h-4 w-4 accent-[#DB930D]" />
                    <span>{t(`checkout.${value}`)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="checkout-country" className="text-sm text-[#4B5157]">{t("checkout.deliveryCountry")}</Label>
                <select id="checkout-country" name="country" value={market} onChange={(event) => changeMarket(event.target.value)} className="mt-1.5 h-11 w-full border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]">
                  <option value="PL">{t("checkout.poland")} — PLN</option>
                  <option value="DE">{t("checkout.germany")} — EUR</option>
                </select>
              </div>
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
                      <VatIdField key={market} value={vatId} onChange={setVatId} onResult={setVatResult} expectedCountry="DE" />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="sm:col-span-2"><Field id="b-street" label={t("checkout.street")} autoComplete="billing street-address" required value={form.street} onChange={set("street")} /></div>
              <Field id="b-postal" label={t("checkout.postalCode")} autoComplete="billing postal-code" inputMode="numeric" pattern={market === "DE" ? "[0-9]{5}" : "[0-9]{2}-?[0-9]{3}"} title={market === "DE" ? "10115" : "00-001"} placeholder={market === "DE" ? "10115" : "00-001"} maxLength={market === "DE" ? 5 : 6} required value={form.postal} onChange={set("postal")} />
              <Field id="b-city" label={t("checkout.city")} autoComplete="billing address-level2" required value={form.city} onChange={set("city")} />
            </div>
            <label className="flex items-center gap-2 text-sm mt-6 cursor-pointer">
              <input type="checkbox" checked={sameAddress} onChange={(event) => setSameAddress(event.target.checked)} className="h-4 w-4 shrink-0 accent-[#DB930D]" />
              <span>{t("checkout.sameAsBilling")}</span>
            </label>
            {!sameAddress && (
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5" aria-labelledby="delivery-address-heading">
                <h3 id="delivery-address-heading" className="sm:col-span-2 font-semibold text-[#1A1C1E]">{t("checkout.deliveryAddress")}</h3>
                <div className="sm:col-span-2"><Field id="d-street" label={t("checkout.street")} autoComplete="shipping street-address" required value={form.d_street} onChange={set("d_street")} /></div>
                <Field id="d-postal" label={t("checkout.postalCode")} autoComplete="shipping postal-code" inputMode="numeric" pattern={market === "DE" ? "[0-9]{5}" : "[0-9]{2}-?[0-9]{3}"} title={market === "DE" ? "10115" : "00-001"} placeholder={market === "DE" ? "10115" : "00-001"} maxLength={market === "DE" ? 5 : 6} required value={form.d_postal} onChange={set("d_postal")} />
                <Field id="d-city" label={t("checkout.city")} autoComplete="shipping address-level2" required value={form.d_city} onChange={set("d_city")} />
              </section>
            )}
            <div className="mt-6">
              <Label htmlFor="c-notes" className="text-sm text-[#4B5157]">{t("checkout.notes")} ({t("common.optional")})</Label>
              <Textarea id="c-notes" name="notes" value={form.notes} onChange={set("notes")} placeholder={t("checkout.notesPlaceholder")} className="rounded-none mt-1.5" rows={3} />
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="min-w-0 bg-white p-5 sm:p-7 shadow-sm h-fit lg:sticky lg:top-24" aria-labelledby="checkout-summary-heading">
          <div className="flex items-start justify-between gap-3 mb-5">
            <h2 id="checkout-summary-heading" className="font-heading text-lg font-bold text-[#1A1C1E]">{t("checkout.orderSummary")}</h2>
            <Link href={pathFor("cart", lang)} className="text-sm underline text-[#6B7075]">{t("checkout.editCart")}</Link>
          </div>
          <ul className="space-y-4 text-sm mb-5">
            {items.map((i) => (
              <li key={cartItemKey(i)} className="flex justify-between gap-2">
                <span className="text-[#3A3E42] min-w-0">
                  {i.quantity} × {lang === "de" ? i.name_de : i.name_pl}
                  {(lang === "de" ? i.variant_label_de : i.variant_label_pl) && <span className="block text-xs text-[#6B7075] mt-1">{lang === "de" ? i.variant_label_de : i.variant_label_pl}</span>}
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
          <p className="text-xs leading-5 text-[#6B7075] mt-2">{vatLabel(lang, rate, treatment, settings)}</p>
          {treatment === "intra_eu_b2b_0" && (
            <p className="text-sm leading-6 text-[#2E7D32] mt-1.5">{t("checkout.vatValid")}</p>
          )}
          <div className="mt-5 bg-[#F8F9FA] p-4 flex gap-3">
            <FileText className="w-5 h-5 shrink-0 text-[#795207] mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[#1A1C1E]">{t("checkout.invoiceAfterOrder")}</h3>
              <p className="text-sm leading-6 text-[#5F656B] mt-1">{t("checkout.invoiceInfo")}</p>
            </div>
          </div>
          <label className="flex items-start gap-2 text-sm leading-6 text-[#343A40] mt-5 cursor-pointer">
            <input type="checkbox" name="terms" required checked={termsOk} onChange={(event) => setTermsOk(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#DB930D]" />
            <span>
              {t("checkout.termsAgree")} — <Link href={pathFor("terms", lang)} className="underline" target="_blank">{lang === "de" ? "AGB" : "Regulamin"}</Link>,{" "}
              <Link href={pathFor("privacy", lang)} className="underline" target="_blank">{lang === "de" ? "Datenschutz" : "Prywatność"}</Link>
            </span>
          </label>
          {error && <p className="text-sm text-red-600 mt-3" role="alert" aria-live="polite">{error}</p>}
          {checkingProducts && <p className="mt-4 text-sm text-[#6B7075]" role="status">{t("checkout.checkingProducts")}</p>}
          {unavailableItems.length > 0 && (
            <div className="mt-4 text-sm leading-6 text-red-600" role="alert">
              <p>{t("checkout.unavailableItems")}</p>
              <ul className="list-disc pl-5 mt-1">
                {unavailableItems.map((item) => <li key={cartItemKey(item)}>{lang === "de" ? item.name_de : item.name_pl}</li>)}
              </ul>
              <Link href={pathFor("cart", lang)} className="underline font-medium">{t("checkout.editCart")}</Link>
            </div>
          )}
          {!pricesKnown && <p className="mt-4 text-sm leading-6 text-red-600">{t("checkout.priceUnavailable")}</p>}
          {readiness.returnCharge && (
            <div className="mt-4 text-xs leading-5 text-[#6B7075]">
              <span>{t("checkout.returnTransportCharge")}: {readiness.returnCharge} </span>
              <Link href={pathFor("returns", lang)} className="underline">{t("checkout.returnDetails")}</Link>
            </div>
          )}
          {!readiness.ready && <p className="mt-4 text-sm text-red-600" role="alert">{t("checkout.deliveryUnavailable")}</p>}
          <Button
            type="submit"
            disabled={submitting || !readiness.ready || !pricesKnown || !productsAvailable}
            className="w-full mt-4 bg-[#F5A623] hover:bg-[#DB930D] !text-[#1A1C1E] rounded-none font-semibold h-12 text-base"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{submitting ? t("checkout.submitting") : t(customerType === "business" ? "checkout.placeOrderBusiness" : "checkout.placeOrder")}</span>
            {!submitting && <ArrowRight className="w-4 h-4 shrink-0" />}
          </Button>
          <p className="mt-3 text-center text-xs leading-5 text-[#6B7075]">{t("checkout.noOnlinePayment")}</p>
        </aside>
        </fieldset>
      </form>
    </div>
  );
}
