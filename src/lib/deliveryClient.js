// Client-side preview of delivery pricing (authoritative recompute happens server-side at order submit).
export function findZoneClient(zones, country, postalCode) {
  const code = String(postalCode || "").replace(/[\s-]/g, "");
  let best = null;
  let bestLen = -1;
  for (const zone of zones || []) {
    if (zone.active === false || zone.country !== country) continue;
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

export function calcDeliveryClient(zones, { country, postalCode, items, craneUnloading }) {
  const zone = findZoneClient(zones, country, postalCode);
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
      typeof rate.additional_unit_rate_net === "number" ? rate.additional_unit_rate_net : rate.rate_net;
    total += rate.rate_net + (qty - 1) * extra;
  }
  if (craneUnloading && typeof zone.crane_surcharge_net === "number") {
    total += zone.crane_surcharge_net;
  }
  return { quoteRequired: false, zone: zone.name, cost: Math.round(total * 100) / 100 };
}