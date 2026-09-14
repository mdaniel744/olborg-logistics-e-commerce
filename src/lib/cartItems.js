export const cartItemKey = (item) => item?.product_id || item?.sku || "";

export function normalizeStoredCart(stored) {
  return (Array.isArray(stored) ? stored : [])
    .filter((item) => cartItemKey(item))
    .map((item) => ({
      ...item,
      quantity: Number.isInteger(item.quantity) && item.quantity > 0
        ? Math.min(item.quantity, 100)
        : 1,
    }));
}

export function applyCartPriceUpdates(items, updates, market) {
  const byId = new Map((Array.isArray(updates) ? updates : []).map((update) => [update.product_id, update]));
  return items.map((item) => {
    const update = byId.get(item.product_id);
    if (!update || !Number.isFinite(update.unit_price_net)) return item;
    return market === "DE"
      ? { ...item, price_eur_net: update.unit_price_net }
      : { ...item, price_pln_net: update.unit_price_net };
  });
}
