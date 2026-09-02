const PRICING_API_BASE = "https://mycontainergmbh.com/api/storefront/prices";

// Live, per-market pricing (VAT treatment + ECB currency conversion) computed fresh on
// every call — never cached, since exchange rates and VAT config can change. Returns a
// Map of productId -> net price + currency for that market, or an empty Map on any
// failure (network, non-200, malformed body) so callers can fall back to whatever
// static pricing they already have rather than breaking the page.
export async function fetchMarketPrices(storeId, locale, productIds) {
  if (!storeId || !productIds || productIds.length === 0) return new Map();

  const url = `${PRICING_API_BASE}/${storeId}?locale=${encodeURIComponent(locale)}&productIds=${productIds.join(",")}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      console.error(`Market pricing request failed: ${response.status} ${url}`);
      return new Map();
    }
    const data = await response.json();
    const map = new Map();
    for (const entry of data.products || []) {
      const mp = entry.marketPrice;
      if (!mp || typeof mp.price !== "number") continue;
      map.set(entry.id, {
        // The endpoint only VAT-adjusts foreign delivery markets (includesVat: true); for
        // the home market it returns a plain net figure. Normalizing to "net" here lets
        // this feed straight into the existing local VAT engine (computeVatTreatment),
        // which already handles B2B zero-rating that this endpoint has no concept of.
        net: mp.includesVat ? mp.netPrice : mp.price,
        saleNet: mp.includesVat ? mp.netSalePrice : mp.salePrice,
        currency: mp.currency,
      });
    }
    return map;
  } catch (error) {
    console.error("Failed to fetch market prices", error);
    return new Map();
  }
}
