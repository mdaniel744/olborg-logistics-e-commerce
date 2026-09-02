import { randomUUID } from "node:crypto";
import { STORE_ID } from "@/lib/supabaseClient";
import { submitInquiry } from "@/lib/dashboardInquiries";
import { saveSubmission } from "@/server/submission-store";

export const runtime = "nodejs";

const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const text = (value, max = 500) => String(value || "").slice(0, max);

function buildMessage(language, items, freeText, delivery) {
  const lines = [];
  if (items.length) {
    lines.push(items.map((item) => `${item.quantity}x ${item.product_name}${item.variant_label ? ` (${item.variant_label})` : ""}`).join("; "));
  }
  if (freeText) lines.push(freeText);
  const deliveryBits = [delivery.city, delivery.postal_code, delivery.country].filter(Boolean).join(", ");
  if (deliveryBits) lines.push(language === "de" ? `Lieferung: ${deliveryBits}` : `Dostawa: ${deliveryBits}`);
  const prefix = language === "de" ? "Angebotsanfrage" : "Zapytanie o wycenę";
  return lines.length ? `${prefix} — ${lines.join(" | ")}` : prefix;
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const customer = body.customer || {};
    if (!text(customer.email) || !text(customer.name)) {
      return Response.json({ error: "missing_customer" }, { status: 400 });
    }

    const language = body.language === "de" ? "de" : "pl";
    const items = (Array.isArray(body.items) ? body.items : []).slice(0, 20).map((item) => ({
      product_id: text(item.product_id, 80),
      product_name: text(item.product_name, 200),
      sku: text(item.sku, 80),
      variant_label: text(item.variant_label, 200),
      quantity: Math.min(Math.max(1, Number(item.quantity) || 1), 500),
    }));

    const delivery = {
      country: text(body.delivery_country, 2),
      postal_code: text(body.delivery_postal_code, 12),
      city: text(body.delivery_city, 120),
      address: text(body.delivery_address, 300),
    };

    // inquiries.product_id is singular — only meaningful when the quote references exactly
    // one catalog product. Multi-item or free-text-only quotes carry everything in
    // message/details instead, which the dashboard actually renders.
    const singleProductId = items.length === 1 && items[0].product_id ? items[0].product_id : undefined;

    const inquiryRecord = {
      customer_name: text(customer.name, 150),
      customer_email: text(customer.email, 150),
      customer_phone: text(customer.phone, 40) || undefined,
      customer_company: text(customer.company, 200) || undefined,
      customer_address: {
        address_line_1: delivery.address || undefined,
        city: delivery.city || undefined,
        postal_code: delivery.postal_code || undefined,
        country: delivery.country || undefined,
      },
      product_id: singleProductId,
      requested_quantity: items.length === 1 ? items[0].quantity : undefined,
      message: buildMessage(language, items, text(body.free_text_products, 2000), delivery),
      details: {
        items,
        free_text_products: text(body.free_text_products, 2000),
        delivery,
        unloading_method: text(body.unloading_method, 60),
        site_access_notes: text(body.site_access_notes, 2000),
        customer_type: body.customer_type === "business" ? "business" : "private",
        customer_vat_id: text(customer.vat_id, 20) || undefined,
        notes: text(body.notes, 3000),
        photo_urls: (Array.isArray(body.photo_urls) ? body.photo_urls : []).slice(0, 6).map((url) => text(url, 500)),
        language,
        market: body.market === "DE" ? "DE" : "PL",
      },
    };

    try {
      await submitInquiry(STORE_ID, ANON_KEY, inquiryRecord);
    } catch (inquiryError) {
      console.error("Dashboard inquiry submission failed", inquiryError);
      return Response.json({ error: "dashboard_submission_failed" }, { status: 502 });
    }

    const quoteNumber = `WYC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    // Best-effort local backup only — the real inquiry already exists in the dashboard by
    // this point, so a failure here must not fail the customer's request.
    await saveSubmission("quotes", {
      id: randomUUID(),
      quote_number: quoteNumber,
      created_at: new Date().toISOString(),
      inquiry: inquiryRecord,
    }).catch((error) => {
      console.error("Local quote backup failed (dashboard submission already succeeded)", error);
    });

    return Response.json({ quote_number: quoteNumber });
  } catch (error) {
    console.error("Quote submission failed", error);
    return Response.json({ error: "quote_submission_failed" }, { status: 500 });
  }
}
