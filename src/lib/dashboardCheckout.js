const CHECKOUT_API_BASE = "https://mycontainergmbh.com/api/storefront/checkout";

// Submits the order to Ecom King's dashboard (checkout_orders table) — this is what makes
// the order visible to the store owner at all; previously orders only ever reached a local
// file. Server recomputes product price/currency/VAT from live product data itself, so this
// never sends a browser-supplied product price or delivery amount. The dashboard explicitly
// rejects shippingAmount until delivery rules are configured in that system; delivery is
// therefore retained in our authoritative totals and audit note. Throws on any failure
// (network, non-2xx, rejected products) — the caller must treat that as the order not having
// gone through, not silently save a local-only record and call it done.
export async function submitDashboardOrder(storeId, payload, idempotencyKey) {
  const response = await fetch(`${CHECKOUT_API_BASE}/${storeId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.order?.id) {
    const message = data?.error || data?.message || `HTTP ${response.status}`;
    throw new Error(`Dashboard checkout submission failed: ${message}`);
  }

  // Do not report a successfully-created remote order as failed only because dashboard
  // versions name (or omit) the human-facing number differently. The immutable id is a
  // safe fallback and preserves the customer's confirmation/reference.
  return {
    ...data.order,
    orderNumber:
      data.order.orderNumber ||
      data.order.order_number ||
      data.order.number ||
      data.order.id,
  };
}
