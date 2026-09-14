export function returnTransportCharge(settings, market, lang) {
  const charge = settings?.returns?.transport_charges?.[market]?.[lang];
  return typeof charge === "string" ? charge.trim() : "";
}

export function checkoutReadiness({ delivery, settings, market, lang }) {
  const deliveryKnown = Boolean(delivery && !delivery.quoteRequired && Number.isFinite(delivery.customerCharge) && delivery.customerCharge >= 0);
  const returnCharge = returnTransportCharge(settings, market, lang);
  const returnCostKnown = Boolean(returnCharge);
  return { deliveryKnown, returnCharge, returnCostKnown, ready: deliveryKnown && returnCostKnown };
}
