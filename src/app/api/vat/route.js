import { checkVat, parseVatId } from "@/server/vies";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = parseVatId(body.vat_id);
    if (!parsed) {
      return Response.json({ valid: false, error: "invalid_format" });
    }
    const result = await checkVat(parsed.country, parsed.number);
    return Response.json({
      vat_id: `${parsed.country}${parsed.number}`,
      country: parsed.country,
      valid: result.valid,
      available: result.available,
      company_name: result.company_name || "",
      address: result.address || "",
      reference: result.reference || "",
      checked_at: result.checked_at || new Date().toISOString(),
    });
  } catch (error) {
    console.error("VAT validation failed", error);
    return Response.json({ valid: false, available: false, error: "vat_service_unavailable" }, { status: 502 });
  }
}
