import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { computeVatTreatment, round2 } from "../../shared/pricing.ts";
import { parseVatId, checkVat } from "../../shared/vies.ts";
import { calcDelivery } from "../../shared/deliveryCalc.ts";

const s = (v, max = 300) => String(v || "").slice(0, max);

// Public checkout endpoint. All prices, VAT and delivery costs are recomputed
// server-side from stored products/settings/zones — client totals are ignored.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const market = body.market === "DE" ? "DE" : "PL";
    const language = body.language === "de" ? "de" : "pl";
    const currency = market === "DE" ? "EUR" : "PLN";
    const customerType = body.customer_type === "business" ? "business" : "private";
    const customer = body.customer || {};

    if (!s(customer.email) || !s(customer.name)) {
      return Response.json({ error: "missing_customer" }, { status: 400 });
    }
    const rawItems = (Array.isArray(body.items) ? body.items : []).slice(0, 20);
    if (rawItems.length === 0) {
      return Response.json({ error: "empty_cart" }, { status: 400 });
    }

    const settingsList = await base44.asServiceRole.entities.SiteSettings.filter({ singleton_key: "main" });
    const settings = settingsList[0] || {};

    // Rebuild items from stored products
    const items = [];
    const deliveryItems = [];
    for (const raw of rawItems) {
      const product = await base44.asServiceRole.entities.Product.get(s(raw.product_id, 64));
      if (!product || product.status === "archived") {
        return Response.json({ error: "product_unavailable", sku: raw.sku }, { status: 400 });
      }
      const variant = (product.variants || []).find((v) => v.sku === s(raw.sku, 64) && v.active !== false);
      if (!variant) {
        return Response.json({ error: "variant_unavailable", sku: raw.sku }, { status: 400 });
      }
      const unitNet = market === "DE" ? variant.price_eur_net : variant.price_pln_net;
      if (typeof unitNet !== "number") {
        return Response.json({ error: "price_unavailable", sku: raw.sku }, { status: 400 });
      }
      const quantity = Math.min(Math.max(1, Number(raw.quantity) || 1), 100);
      items.push({
        product_id: product.id,
        product_name: language === "de" ? product.name_de : product.name_pl,
        sku: variant.sku,
        variant_label: s(raw.variant_label, 200),
        quantity,
        unit_price_net: unitNet,
        image: variant.image || product.featured_image || "",
      });
      deliveryItems.push({ size: product.size, quantity });
    }

    // Delivery (server-side recompute; never invented)
    const deliveryCountry = market === "DE" ? "DE" : "PL";
    const zones = await base44.asServiceRole.entities.DeliveryZone.filter({ country: deliveryCountry });
    const crane = s(body.unloading_method, 60).toLowerCase().includes("crane") || s(body.unloading_method, 60).toLowerCase().includes("hds");
    const delivery = calcDelivery(zones, {
      country: deliveryCountry,
      postalCode: s(body.delivery_postal_code, 12),
      items: deliveryItems,
      craneUnloading: crane,
    });

    // VAT: server-side re-validation of the VAT ID for any 0% claim
    let vatValidation = { validated: false, valid: false };
    if (market === "DE" && customerType === "business" && s(customer.vat_id, 20)) {
      const parsed = parseVatId(customer.vat_id);
      if (parsed && parsed.country === "DE") {
        const check = await checkVat(parsed.country, parsed.number);
        vatValidation = {
          validated: check.available === true,
          valid: check.valid === true,
          vat_id: parsed.country + parsed.number,
          company_name: check.company_name || "",
          checked_at: check.checked_at || new Date().toISOString(),
          reference: check.reference || "",
        };
      }
    }

    const treatment = computeVatTreatment(settings, {
      market,
      customerType,
      vatValid: vatValidation.valid,
      deliveryCountry,
    });

    const itemsNet = round2(items.reduce((sum, it) => sum + it.unit_price_net * it.quantity, 0));
    const deliveryNet = delivery.quoteRequired ? 0 : delivery.cost;
    const netSubtotal = round2(itemsNet + deliveryNet);
    const vatAmount = round2(netSubtotal * (treatment.rate / 100));
    const grossTotal = round2(netSubtotal + vatAmount);

    const vatLabels = {
      pl_domestic: `w tym ${treatment.rate}% VAT`,
      de_consumer: `inkl. ${treatment.rate}% MwSt.`,
      intra_eu_b2b_0:
        (settings.vat && (language === "de" ? settings.vat.intra_eu_label_de : settings.vat.intra_eu_label_pl)) ||
        "Intra-Community supply — 0% VAT",
    };

    const orderNumber =
      "OL-" +
      new Date().toISOString().slice(0, 10).replace(/-/g, "") +
      "-" +
      Math.random().toString(36).slice(2, 7).toUpperCase();

    const order = await base44.asServiceRole.entities.Order.create({
      order_number: orderNumber,
      market,
      language,
      currency,
      items,
      customer_type: customerType,
      customer: {
        name: s(customer.name, 150),
        company: s(customer.company, 200),
        vat_id: s(customer.vat_id, 20),
        nip: s(customer.nip, 20),
        email: s(customer.email, 150),
        phone: s(customer.phone, 40),
        po_reference: s(customer.po_reference, 100),
        notes: s(customer.notes, 2000),
      },
      vat_validation: vatValidation,
      billing_address: body.billing_address || {},
      delivery_address: body.delivery_address || {},
      delivery_country: deliveryCountry,
      delivery_postal_code: s(body.delivery_postal_code, 12),
      delivery_instructions: s(body.delivery_instructions, 2000),
      unloading_method: s(body.unloading_method, 60),
      delivery_cost_net: deliveryNet,
      delivery_quote_required: delivery.quoteRequired,
      tax_snapshot: {
        vat_rate: treatment.rate,
        vat_amount: vatAmount,
        net_subtotal: netSubtotal,
        gross_total: grossTotal,
        treatment: treatment.treatment,
        fx_rate: market === "DE" ? (settings.fx && settings.fx.published_rate) || null : null,
        label: vatLabels[treatment.treatment],
      },
      payment_method: "bank_transfer",
      payment_status: "awaiting_payment",
      status: "new",
    });

    return Response.json({
      order_number: order.order_number,
      id: order.id,
      currency,
      totals: order.tax_snapshot,
      delivery_quote_required: delivery.quoteRequired,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}