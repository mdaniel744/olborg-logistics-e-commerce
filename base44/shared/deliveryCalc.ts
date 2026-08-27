// Delivery cost calculation from admin-managed zones. Never invents prices:
// if no matching zone/rate exists, returns { quoteRequired: true }.

export function findZone(zones, country, postalCode) {
  const code = String(postalCode || "").replace(/[\s-]/g, "");
  const candidates = (zones || []).filter(
    (z) => z.active !== false && z.country === country
  );
  let best = null;
  let bestLen = -1;
  for (const zone of candidates) {
    for (const prefix of zone.postal_prefixes || []) {
      const p = String(prefix).replace(/[\s-]/g, "");
      if (code.startsWith(p) && p.length > bestLen) {
        best = zone;
        bestLen = p.length;
      }
    }
  }
  return best;
}

// items: [{ size, quantity }]
export function calcDelivery(zones, { country, postalCode, items, craneUnloading }) {
  const zone = findZone(zones, country, postalCode);
  if (!zone || zone.manual_quote_only) {
    return { quoteRequired: true, zone: zone ? zone.name : null, cost: 0 };
  }
  let total = 0;
  for (const item of items || []) {
    const rate = (zone.rates || []).find((r) => r.size === item.size);
    if (!rate || typeof rate.rate_net !== "number") {
      return { quoteRequired: true, zone: zone.name, cost: 0 };
    }
    const qty = Math.max(1, Number(item.quantity) || 1);
    const extra =
      typeof rate.additional_unit_rate_net === "number"
        ? rate.additional_unit_rate_net
        : rate.rate_net;
    total += rate.rate_net + (qty - 1) * extra;
  }
  if (craneUnloading && typeof zone.crane_surcharge_net === "number") {
    total += zone.crane_surcharge_net;
  }
  return { quoteRequired: false, zone: zone.name, cost: Math.round(total * 100) / 100 };
}