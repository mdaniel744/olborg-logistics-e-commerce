export function parseVatId(raw) {
  const cleaned = String(raw || "").replace(/[\s.-]/g, "").toUpperCase();
  const match = cleaned.match(/^([A-Z]{2})([0-9A-Z+*]{2,12})$/);
  return match ? { country: match[1], number: match[2] } : null;
}

export async function checkVat(country, number) {
  const url = `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${encodeURIComponent(
    country
  )}/vat/${encodeURIComponent(number)}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    return { available: false, valid: false, error: `VIES service returned ${response.status}` };
  }

  const data = await response.json();
  return {
    available: true,
    valid: data.isValid === true,
    company_name: data.name && data.name !== "---" ? data.name : "",
    address: data.address && data.address !== "---" ? data.address : "",
    reference: data.requestIdentifier || "",
    checked_at: new Date().toISOString(),
  };
}
