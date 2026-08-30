import { randomUUID } from "node:crypto";
import { DELIVERY_ZONES, SITE_SETTINGS, getProductById } from "@/data/catalog";
import { calculateDelivery } from "@/server/delivery";
import { computeVatTreatment, round2 } from "@/server/pricing";
import { saveSubmission } from "@/server/submission-store";
import { checkVat, parseVatId } from "@/server/vies";

export const runtime = "nodejs";

const text = (value, max = 300) => String(value || "").slice(0, max);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const market = body.market === "DE" ? "DE" : "PL";
    const language = body.language === "de" ? "de" : "pl";
    const currency = market === "DE" ? "EUR" : "PLN";
    const customerType = body.customer_type === "business" ? "business" : "private";
    const customer = body.customer || {};

    if (!text(customer.email) || !text(customer.name)) {
      return Response.json({ error: "missing_customer" }, { status: 400 });
    }

    const rawItems = (Array.isArray(body.items) ? body.items : []).slice(0, 20);
    if (rawItems.length === 0) {
      return Response.json({ error: "empty_cart" }, { status: 400 });
    }

    const items = [];
    const deliveryItems = [];
    for (const raw of rawItems) {
      const product = getProductById(text(raw.product_id, 80));
      if (!product || product.status !== "active") {
        return Response.json({ error: "product_unavailable", sku: raw.sku }, { status: 400 });
      }
      const selected = (product.variants || []).find(
        (entry) => entry.sku === text(raw.sku, 80) && entry.active !== false
      );
      if (!selected) {
        return Response.json({ error: "variant_unavailable", sku: raw.sku }, { status: 400 });
      }
      const unitNet = market === "DE" ? selected.price_eur_net : selected.price_pln_net;
      if (typeof unitNet !== "number") {
        return Response.json({ error: "price_unavailable", sku: raw.sku }, { status: 400 });
      }
      const quantity = Math.min(Math.max(1, Number(raw.quantity) || 1), 100);
      items.push({
        product_id: product.id,
        product_name: language === "de" ? product.name_de : product.name_pl,
        sku: selected.sku,
        variant_label: text(raw.variant_label, 200),
        quantity,
        unit_price_net: unitNet,
        image: selected.image || product.featured_image || "",
      });
      deliveryItems.push({ size: product.size, quantity });
    }

    const crane = /crane|hds/i.test(text(body.unloading_method, 60));
    const delivery = calculateDelivery(DELIVERY_ZONES, {
      country: market,
      postalCode: text(body.delivery_postal_code, 12),
      items: deliveryItems,
      craneUnloading: crane,
    });

    let vatValidation = { validated: false, valid: false };
    if (market === "DE" && customerType === "business" && text(customer.vat_id, 20)) {
      const parsed = parseVatId(customer.vat_id);
      if (parsed?.country === "DE") {
        const result = await checkVat(parsed.country, parsed.number).catch(() => ({
          available: false,
          valid: false,
        }));
        vatValidation = {
          validated: result.available === true,
          valid: result.valid === true,
          vat_id: `${parsed.country}${parsed.number}`,
          company_name: result.company_name || "",
          checked_at: result.checked_at || new Date().toISOString(),
          reference: result.reference || "",
        };
      }
    }

    const treatment = computeVatTreatment(SITE_SETTINGS, {
      market,
      customerType,
      vatValid: vatValidation.valid,
      deliveryCountry: market,
    });
    const itemsNet = round2(items.reduce((sum, item) => sum + item.unit_price_net * item.quantity, 0));
    const deliveryNet = delivery.quoteRequired ? 0 : delivery.cost;
    const netSubtotal = round2(itemsNet + deliveryNet);
    const vatAmount = round2(netSubtotal * (treatment.rate / 100));
    const grossTotal = round2(netSubtotal + vatAmount);
    const orderNumber = `OL-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`;

    const labels = {
      pl_domestic: `w tym ${treatment.rate}% VAT`,
      de_consumer: `inkl. ${treatment.rate}% MwSt.`,
      intra_eu_b2b_0:
        language === "de"
          ? SITE_SETTINGS.vat.intra_eu_label_de
          : SITE_SETTINGS.vat.intra_eu_label_pl,
    };
    const record = {
      id: randomUUID(),
      order_number: orderNumber,
      created_at: new Date().toISOString(),
      market,
      language,
      currency,
      items,
      customer_type: customerType,
      customer: {
        name: text(customer.name, 150),
        company: text(customer.company, 200),
        vat_id: text(customer.vat_id, 20),
        nip: text(customer.nip, 20),
        email: text(customer.email, 150),
        phone: text(customer.phone, 40),
        po_reference: text(customer.po_reference, 100),
        notes: text(customer.notes, 2000),
      },
      vat_validation: vatValidation,
      billing_address: body.billing_address || {},
      delivery_address: body.delivery_address || {},
      delivery_country: market,
      delivery_postal_code: text(body.delivery_postal_code, 12),
      delivery_instructions: text(body.delivery_instructions, 2000),
      unloading_method: text(body.unloading_method, 60),
      delivery_cost_net: deliveryNet,
      delivery_quote_required: delivery.quoteRequired,
      totals: {
        vat_rate: treatment.rate,
        vat_amount: vatAmount,
        net_subtotal: netSubtotal,
        gross_total: grossTotal,
        treatment: treatment.treatment,
        label: labels[treatment.treatment],
      },
      payment_method: "bank_transfer",
      payment_status: "awaiting_payment",
      status: "new",
    };

    await saveSubmission("orders", record);
    return Response.json({
      order_number: record.order_number,
      id: record.id,
      currency,
      totals: record.totals,
      delivery_quote_required: record.delivery_quote_required,
    });
  } catch (error) {
    console.error("Order submission failed", error);
    return Response.json({ error: "order_submission_failed" }, { status: 500 });
  }
}
