const CHECKOUT_API_BASE = "https://mycontainergmbh.com/api/storefront/checkout";

// Submits the order to Ecom King's dashboard (checkout_orders table) — this is what makes
// the order visible to the store owner at all; previously orders only ever reached a local
// file. Server recomputes price/currency/VAT from live product data itself, so this only
// ever sends product id + quantity, never a price. Throws on any failure (network, non-201,
// rejected products) — the caller must treat that as the order not having gone through,
// not silently save a local-only record and call it done.
export async function submitDashboardOrder(storeId, payload) {
  const response = await fetch(`${CHECKOUT_API_BASE}/${storeId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.order) {
    const message = data?.error || data?.message || `HTTP ${response.status}`;
    throw new Error(`Dashboard checkout submission failed: ${message}`);
  }
  return data.order;
}
