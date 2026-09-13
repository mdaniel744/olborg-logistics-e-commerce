export function returnTransportEstimate(settings, market, lang) {
  const estimate = settings?.returns?.transport_estimates?.[market]?.[lang];
  return typeof estimate === "string" ? estimate.trim() : "";
}

export function checkoutReadiness({ delivery, customerType, settings, market, lang }) {
  const deliveryKnown = Boolean(delivery && !delivery.quoteRequired && Number.isFinite(delivery.cost) && delivery.cost >= 0);
  const returnEstimate = returnTransportEstimate(settings, market, lang);
  const returnCostKnown = customerType === "business" || Boolean(returnEstimate);
  return { deliveryKnown, returnEstimate, returnCostKnown, ready: deliveryKnown && returnCostKnown };
}
