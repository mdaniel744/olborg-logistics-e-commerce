import { randomUUID } from "node:crypto";
import { saveSubmission } from "@/server/submission-store";

export const runtime = "nodejs";

const text = (value, max = 500) => String(value || "").slice(0, max);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const customer = body.customer || {};
    if (!text(customer.email) || !text(customer.name)) {
      return Response.json({ error: "missing_customer" }, { status: 400 });
    }

    const quoteNumber = `WYC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
    const record = {
      id: randomUUID(),
      quote_number: quoteNumber,
      created_at: new Date().toISOString(),
      language: body.language === "de" ? "de" : "pl",
      market: body.market === "DE" ? "DE" : "PL",
      items: (Array.isArray(body.items) ? body.items : []).slice(0, 20).map((item) => ({
        product_id: text(item.product_id, 80),
        product_name: text(item.product_name, 200),
        sku: text(item.sku, 80),
        variant_label: text(item.variant_label, 200),
        quantity: Math.min(Math.max(1, Number(item.quantity) || 1), 500),
      })),
      free_text_products: text(body.free_text_products, 2000),
      delivery_country: text(body.delivery_country, 2),
      delivery_postal_code: text(body.delivery_postal_code, 12),
      delivery_city: text(body.delivery_city, 120),
      delivery_address: text(body.delivery_address, 300),
      unloading_method: text(body.unloading_method, 60),
      site_access_notes: text(body.site_access_notes, 2000),
      customer_type: body.customer_type === "business" ? "business" : "private",
      customer: {
        name: text(customer.name, 150),
        company: text(customer.company, 200),
        vat_id: text(customer.vat_id, 20),
        email: text(customer.email, 150),
        phone: text(customer.phone, 40),
      },
      notes: text(body.notes, 3000),
      photo_urls: (Array.isArray(body.photo_urls) ? body.photo_urls : [])
        .slice(0, 6)
        .map((url) => text(url, 500)),
      status: "new",
    };

    await saveSubmission("quotes", record);
    return Response.json({ quote_number: record.quote_number, id: record.id });
  } catch (error) {
    console.error("Quote submission failed", error);
    return Response.json({ error: "quote_submission_failed" }, { status: 500 });
  }
}
