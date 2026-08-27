// EU VIES VAT ID validation via the official EU REST API.

export function parseVatId(raw) {
  const cleaned = String(raw || "").replace(/[\s.-]/g, "").toUpperCase();
  const match = cleaned.match(/^([A-Z]{2})([0-9A-Z+*]{2,12})$/);
  if (!match) return null;
  return { country: match[1], number: match[2] };
}

export async function checkVat(country, number) {
  const url = `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${encodeURIComponent(
    country
  )}/vat/${encodeURIComponent(number)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    return { available: false, valid: false, error: `VIES service returned ${res.status}` };
  }
  const data = await res.json();
  return {
    available: true,
    valid: data.isValid === true,
    company_name: data.name && data.name !== "---" ? data.name : "",
    address: data.address && data.address !== "---" ? data.address : "",
    reference: data.requestIdentifier || "",
    checked_at: new Date().toISOString(),
  };
}