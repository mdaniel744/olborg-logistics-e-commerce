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

export function calculateDelivery(zones, { country, postalCode, items }) {
  if (!normalizePostalCode(country, postalCode)) {
    return { quoteRequired: true, zone: null, customerCharge: 0, method: null, reason: "invalid_postal_code" };
  }
  const zone = findZone(zones, country, postalCode);
  if (!zone || zone.manual_quote_only) {
    return { quoteRequired: true, zone: zone?.name || null, customerCharge: 0, method: null };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { quoteRequired: true, zone: zone.name, customerCharge: 0, method: null };
  }

  for (const item of items) {
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return { quoteRequired: true, zone: zone.name, customerCharge: 0, method: null };
    }
  }

  if (!Number.isFinite(zone.customer_charge) || zone.customer_charge < 0) {
    return { quoteRequired: true, zone: zone.name, customerCharge: 0, method: null };
  }
  return {
    quoteRequired: false,
    zone: zone.name,
    customerCharge: Math.round(zone.customer_charge * 100) / 100,
    method: zone.pricing_type === "flat_rate" ? "flat_rate" : "calculated",
  };
}
