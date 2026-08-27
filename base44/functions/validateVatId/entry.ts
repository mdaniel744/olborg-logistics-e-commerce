import { parseVatId, checkVat } from "../../shared/vies.ts";

// Public endpoint (checkout is available to anonymous visitors).
// Narrow scope: validates a single EU VAT ID against VIES, returns only the result.
export default async function (req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = parseVatId(body.vat_id);
    if (!parsed) {
      return Response.json({ valid: false, error: "invalid_format" });
    }
    const result = await checkVat(parsed.country, parsed.number);
    return Response.json({
      vat_id: parsed.country + parsed.number,
      country: parsed.country,
      valid: result.valid,
      available: result.available,
      company_name: result.company_name || "",
      address: result.address || "",
      reference: result.reference || "",
      checked_at: result.checked_at || new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ valid: false, error: error.message }, { status: 500 });
  }
}