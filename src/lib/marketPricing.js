const PRICING_API_BASE = "https://mycontainergmbh.com/api/storefront/prices";
const REQUEST_TIMEOUT_MS = 8000;

// Live, per-market pricing (VAT treatment + ECB currency conversion) computed fresh on
// every call — never cached, since exchange rates and VAT config can change. Returns a
// Map of productId -> net price + currency for that market, or an empty Map on any
// failure (network, non-200, malformed body) so callers can fall back to whatever
// static pricing they already have rather than breaking the page.
async function attemptFetch(url) {
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    console.error(`Market pricing request failed: ${response.status} ${url}`);
    return null;
  }
  return response.json();
}

export async function fetchMarketPrices(storeId, locale, productIds) {
  if (!storeId || !productIds || productIds.length === 0) return new Map();

  const url = `${PRICING_API_BASE}/${storeId}?locale=${encodeURIComponent(locale)}&productIds=${productIds.join(",")}`;

  let data = null;
  try {
    data = await attemptFetch(url);
  } catch (error) {
    // A slow-but-alive endpoint (observed: 3-5s+ responses) can trip a single timeout
    // without actually being down — this matters most for checkout, where a spurious
    // failure here means a rejected order (price_unavailable), not just a stale price.
    // One retry catches that transient case without retrying on a clean HTTP error,
    // which is very unlikely to succeed on a second attempt.
    console.error("Market pricing request errored, retrying once", error);
    try {
      data = await attemptFetch(url);
    } catch (retryError) {
      console.error("Market pricing retry also failed", retryError);
      return new Map();
    }
  }
  if (!data) return new Map();

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
}
