// Pure calculation shared by the browser preview and authoritative order checks.
export function normalizePostalCode(country, postalCode) {
  const value = String(postalCode ?? "").trim();
  if (country === "PL" && /^\d{2}-?\d{3}$/.test(value)) return value.replace("-", "");
  if (country === "DE" && /^\d{5}$/.test(value)) return value;
  return null;
}

export function findZone(zones, country, postalCode) {
  const code = normalizePostalCode(country, postalCode);
  if (!code) return null;
  let best = null;
  let bestLength = -1;

  for (const zone of zones || []) {
    if (zone.active === false || zone.country !== country) continue;
    for (const prefix of zone.postal_prefixes || []) {
      const normalized = String(prefix).replace(/[\s-]/g, "");
      if (/^\d{1,5}$/.test(normalized) && code.startsWith(normalized) && normalized.length > bestLength) {
        best = zone;
        bestLength = normalized.length;
      }
    }
  }

  return best;
}

export function calculateDelivery(zones, { country, postalCode, items, craneUnloading }) {
  if (!normalizePostalCode(country, postalCode)) {
    return { quoteRequired: true, zone: null, cost: 0, reason: "invalid_postal_code" };
  }
  const zone = findZone(zones, country, postalCode);
  if (!zone || zone.manual_quote_only) {
    return { quoteRequired: true, zone: zone?.name || null, cost: 0 };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { quoteRequired: true, zone: zone.name, cost: 0 };
  }

  let total = 0;
  for (const item of items) {
    const rate = (zone.rates || []).find((entry) => entry.size === item.size);
    const quantity = Number(item.quantity);
    if (!rate || !Number.isFinite(rate.rate_net) || rate.rate_net < 0 || !Number.isInteger(quantity) || quantity < 1) {
      return { quoteRequired: true, zone: zone.name, cost: 0 };
    }
    const additional =
      typeof rate.additional_unit_rate_net === "number"
        ? rate.additional_unit_rate_net
        : rate.rate_net;
    if (!Number.isFinite(additional) || additional < 0) {
      return { quoteRequired: true, zone: zone.name, cost: 0 };
    }
    total += rate.rate_net + (quantity - 1) * additional;
  }

  if (craneUnloading) {
    if (!Number.isFinite(zone.crane_surcharge_net) || zone.crane_surcharge_net < 0) {
      return { quoteRequired: true, zone: zone.name, cost: 0 };
    }
    total += zone.crane_surcharge_net;
  }

  if (!Number.isFinite(total)) return { quoteRequired: true, zone: zone.name, cost: 0 };
  return { quoteRequired: false, zone: zone.name, cost: Math.round(total * 100) / 100 };
}
