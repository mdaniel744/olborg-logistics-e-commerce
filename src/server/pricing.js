export function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function computeVatTreatment(settings, context) {
  const vat = settings?.vat || {};
  const plRate = typeof vat.pl_standard_rate === "number" ? vat.pl_standard_rate : 23;
  const deRate = typeof vat.de_consumer_rate === "number" ? vat.de_consumer_rate : 19;

  if (context.market === "PL") {
    return { rate: plRate, treatment: "pl_domestic" };
  }

  if (
    context.customerType === "business" &&
    context.vatValid === true &&
    vat.b2b_zero_rating_enabled !== false &&
    context.deliveryCountry === "DE"
  ) {
    return { rate: 0, treatment: "intra_eu_b2b_0" };
  }

  return {
    rate: vat.distance_sales_destination_vat !== false ? deRate : plRate,
    treatment: "de_consumer",
  };
}

export function grossFromNet(net, ratePercent) {
  return round2(net * (1 + ratePercent / 100));
}
