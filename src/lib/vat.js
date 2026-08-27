import { round2 } from "@/lib/format";

// Frontend mirror of the centralized VAT engine (authoritative copy runs server-side).
export function computeVatTreatment(settings, ctx) {
  const vat = (settings && settings.vat) || {};
  const plRate = typeof vat.pl_standard_rate === "number" ? vat.pl_standard_rate : 23;
  const deRate = typeof vat.de_consumer_rate === "number" ? vat.de_consumer_rate : 19;
  const zeroRatingEnabled = vat.b2b_zero_rating_enabled !== false;

  if (ctx.market === "PL") return { rate: plRate, treatment: "pl_domestic" };
  if (
    ctx.customerType === "business" &&
    ctx.vatValid === true &&
    zeroRatingEnabled &&
    ctx.deliveryCountry === "DE"
  ) {
    return { rate: 0, treatment: "intra_eu_b2b_0" };
  }
  const destinationVat = vat.distance_sales_destination_vat !== false;
  return { rate: destinationVat ? deRate : plRate, treatment: "de_consumer" };
}

export function grossFromNet(net, ratePercent) {
  return round2(net * (1 + ratePercent / 100));
}

// Consumer gross price for a variant in the current market
export function variantGross(variant, settings, market) {
  const net = market === "DE" ? variant.price_eur_net : variant.price_pln_net;
  if (typeof net !== "number") return null;
  const { rate } = computeVatTreatment(settings, {
    market,
    customerType: "private",
    vatValid: false,
    deliveryCountry: market,
  });
  return { net, rate, gross: grossFromNet(net, rate) };
}

export function vatLabel(lang, rate, treatment, settings) {
  if (treatment === "intra_eu_b2b_0") {
    const vat = (settings && settings.vat) || {};
    return lang === "de"
      ? vat.intra_eu_label_de || "Innergemeinschaftliche Lieferung — 0% USt."
      : vat.intra_eu_label_pl || "Wewnątrzwspólnotowa dostawa towarów — 0% VAT";
  }
  return lang === "de" ? `inkl. ${rate}% MwSt.` : `w tym ${rate}% VAT`;
}