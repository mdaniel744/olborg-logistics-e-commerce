// Centralized EU VAT engine + rounding. Single source of truth for tax logic.

export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

// ctx: { market: 'PL'|'DE', customerType: 'private'|'business', vatValid: boolean, deliveryCountry: string }
// Returns { rate (percent), treatment, labelKey }
export function computeVatTreatment(settings, ctx) {
  const vat = (settings && settings.vat) || {};
  const plRate = typeof vat.pl_standard_rate === "number" ? vat.pl_standard_rate : 23;
  const deRate = typeof vat.de_consumer_rate === "number" ? vat.de_consumer_rate : 19;
  const zeroRatingEnabled = vat.b2b_zero_rating_enabled !== false;

  if (ctx.market === "PL") {
    return { rate: plRate, treatment: "pl_domestic", labelKey: "vat_pl" };
  }
  // DE market
  if (
    ctx.customerType === "business" &&
    ctx.vatValid === true &&
    zeroRatingEnabled &&
    ctx.deliveryCountry === "DE"
  ) {
    return { rate: 0, treatment: "intra_eu_b2b_0", labelKey: "vat_intra_eu" };
  }
  const destinationVat = vat.distance_sales_destination_vat !== false;
  return {
    rate: destinationVat ? deRate : plRate,
    treatment: "de_consumer",
    labelKey: "vat_de",
  };
}

export function grossFromNet(net, ratePercent) {
  return round2(net * (1 + ratePercent / 100));
}