import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";

const s = (v, max = 500) => String(v || "").slice(0, max);

// Public endpoint: creates a non-binding quotation request with bounded input.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const customer = body.customer || {};
    if (!s(customer.email) || !s(customer.name)) {
      return Response.json({ error: "missing_customer" }, { status: 400 });
    }

    const items = (Array.isArray(body.items) ? body.items : [])
      .slice(0, 20)
      .map((it) => ({
        product_id: s(it.product_id, 64),
        product_name: s(it.product_name, 200),
        sku: s(it.sku, 64),
        variant_label: s(it.variant_label, 200),
        quantity: Math.min(Math.max(1, Number(it.quantity) || 1), 500),
      }));

    const quoteNumber =
      "WYC-" +
      new Date().toISOString().slice(0, 10).replace(/-/g, "") +
      "-" +
      Math.random().toString(36).slice(2, 6).toUpperCase();

    const record = await base44.asServiceRole.entities.QuoteRequest.create({
      quote_number: quoteNumber,
      language: body.language === "de" ? "de" : "pl",
      market: body.market === "DE" ? "DE" : "PL",
      items,
      free_text_products: s(body.free_text_products, 2000),
      delivery_country: s(body.delivery_country, 2),
      delivery_postal_code: s(body.delivery_postal_code, 12),
      delivery_city: s(body.delivery_city, 120),
      delivery_address: s(body.delivery_address, 300),
      unloading_method: s(body.unloading_method, 60),
      site_access_notes: s(body.site_access_notes, 2000),
      customer_type: body.customer_type === "business" ? "business" : "private",
      customer: {
        name: s(customer.name, 150),
        company: s(customer.company, 200),
        vat_id: s(customer.vat_id, 20),
        email: s(customer.email, 150),
        phone: s(customer.phone, 40),
      },
      notes: s(body.notes, 3000),
      photo_urls: (Array.isArray(body.photo_urls) ? body.photo_urls : []).slice(0, 6).map((u) => s(u, 500)),
      status: "new",
    });

    return Response.json({ quote_number: record.quote_number, id: record.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}