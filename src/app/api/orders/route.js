import { DELIVERY_ZONES, SITE_SETTINGS } from "@/data/catalog";
import { getProducts } from "@/lib/supabaseCatalog";
import { STORE_ID } from "@/lib/supabaseClient";
import { submitDashboardOrder } from "@/lib/dashboardCheckout";
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

    const products = await getProducts();
    const items = [];
    const deliveryItems = [];
    for (const raw of rawItems) {
      // product_id (the row's own id) already uniquely identifies the exact variant — sku
      // is display-only. Matching on it too broke every order once real dashboard products
      // (sku: null) replaced the old demo catalog's populated skus.
      const product = products.find((entry) => entry.id === text(raw.product_id, 80));
      if (!product || product.status !== "active" || product.active === false) {
        console.error("Order rejected: product_unavailable", { market, product_id: raw.product_id, found: Boolean(product) });
        return Response.json({ error: "product_unavailable", sku: raw.sku }, { status: 400 });
      }
      const unitNet = market === "DE" ? product.price_eur_net : product.price_pln_net;
      if (typeof unitNet !== "number") {
        console.error("Order rejected: price_unavailable", { market, product_id: product.id, price_pln_net: product.price_pln_net, price_eur_net: product.price_eur_net });
        return Response.json({ error: "price_unavailable", sku: raw.sku }, { status: 400 });
      }
      const quantity = Math.min(Math.max(1, Number(raw.quantity) || 1), 100);
      items.push({
        product_id: product.id,
        product_name: language === "de" ? product.name_de : product.name_pl,
        sku: product.sku,
        variant_label: text(raw.variant_label, 200),
        quantity,
        unit_price_net: unitNet,
        image: product.featured_image || "",
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

    const labels = {
      pl_domestic: `w tym ${treatment.rate}% VAT`,
      de_consumer: `inkl. ${treatment.rate}% MwSt.`,
      intra_eu_b2b_0:
        language === "de"
          ? SITE_SETTINGS.vat.intra_eu_label_de
          : SITE_SETTINGS.vat.intra_eu_label_pl,
    };

    // The dashboard endpoint has no fields for company/VAT-ID/NIP or a PO reference, so
    // fold them into the note rather than silently drop them.
    const businessLines = [
      customerType === "business" ? text(customer.company, 200) && `Firma: ${text(customer.company, 200)}` : null,
      text(customer.vat_id, 20) && `VAT ID: ${text(customer.vat_id, 20)}`,
      text(customer.nip, 20) && `NIP: ${text(customer.nip, 20)}`,
      text(customer.po_reference, 100) && `PO: ${text(customer.po_reference, 100)}`,
      text(customer.notes, 2000),
    ].filter(Boolean);

    let dashboardOrder;
    try {
      dashboardOrder = await submitDashboardOrder(STORE_ID, {
        locale: language,
        customerName: text(customer.name, 150),
        customerEmail: text(customer.email, 150),
        customerPhone: text(customer.phone, 40) || undefined,
        billingAddress: body.billing_address || undefined,
        deliveryAddress: body.delivery_address || undefined,
        customerNote: businessLines.join(" | ") || undefined,
        lineItems: items.map((item) => ({ productId: item.product_id, quantity: item.quantity })),
      });
    } catch (dashboardError) {
      console.error("Dashboard order submission failed", dashboardError);
      return Response.json({ error: "dashboard_submission_failed" }, { status: 502 });
    }

    const record = {
      id: dashboardOrder.id,
      order_number: dashboardOrder.orderNumber,
      dashboard_order: dashboardOrder,
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

    // Best-effort local backup only — the real order already exists in the dashboard by
    // this point, so a failure here must not fail the customer's request.
    await saveSubmission("orders", record).catch((error) => {
      console.error("Local order backup failed (dashboard submission already succeeded)", error);
    });

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
