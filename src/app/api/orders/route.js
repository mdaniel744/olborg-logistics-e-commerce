import { DELIVERY_ZONES, SITE_SETTINGS } from "@/data/catalog";
import { getProducts } from "@/lib/supabaseCatalog";
import { STORE_ID } from "@/lib/supabaseClient";
import { submitDashboardOrder } from "@/lib/dashboardCheckout";
import { calculateDelivery } from "@/server/delivery";
import { computeVatTreatment, round2 } from "@/server/pricing";
import { saveSubmission } from "@/server/submission-store";
import { checkVat, parseVatId } from "@/server/vies";
import { checkoutReadiness } from "@/lib/checkoutReadiness";
import { calculateOrderTotals } from "@/lib/orderTotals";
import { reviewedTotalsMatch, sanitizeAddress, sanitizeCustomerForType, validateOrderDetails, validateOrderPayloadShape } from "@/server/orderValidation";

export const runtime = "nodejs";

const text = (value, max = 300) => String(value || "").slice(0, max);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const idempotencyKey = text(request.headers.get("idempotency-key"), 80);
    if (!/^[A-Za-z0-9_-]{16,80}$/.test(idempotencyKey)) {
      return Response.json({ error: "invalid_submission_key" }, { status: 400 });
    }
    const payloadError = validateOrderPayloadShape(body);
    if (payloadError) return Response.json({ error: payloadError }, { status: 400 });

    const market = body.market;
    const language = body.language;
    const currency = market === "DE" ? "EUR" : "PLN";
    const customerType = body.customer_type;
    // Enforce the customer-type boundary on the server. A stale form or crafted request
    // must never attach company, tax or purchase-order data to a private order.
    const customer = sanitizeCustomerForType(customerType, body.customer);

    const submittedBillingAddress = body.billing_address || {};
    const submittedDeliveryAddress = body.delivery_address || {};
    const detailsError = validateOrderDetails({
      market,
      customerType,
      customer,
      billingAddress: submittedBillingAddress,
      deliveryAddress: submittedDeliveryAddress,
    });
    if (detailsError) return Response.json({ error: detailsError }, { status: 400 });
    const billingAddress = sanitizeAddress(submittedBillingAddress, market);
    const deliveryAddress = sanitizeAddress(submittedDeliveryAddress, market);

    const rawItems = body.items;

    const products = await getProducts();
    const items = [];
    const deliveryItems = [];
    for (const raw of rawItems) {
      // product_id (the row's own id) already uniquely identifies the exact variant — sku
      // is display-only. Matching on it too broke every order once real dashboard products
      // (sku: null) replaced the old demo catalog's populated skus.
      const product = products.find((entry) => entry.id === text(raw.product_id, 80));
      if (!product || product.is_demo || product.status !== "active" || product.active === false || product.availability !== "in_stock") {
        console.error("Order rejected: product_unavailable", { market, product_id: raw.product_id, found: Boolean(product) });
        return Response.json({ error: "product_unavailable", sku: raw.sku }, { status: 400 });
      }
      const unitNet = market === "DE" ? product.price_eur_net : product.price_pln_net;
      if (!Number.isFinite(unitNet) || unitNet <= 0) {
        console.error("Order rejected: price_unavailable", { market, product_id: product.id, price_pln_net: product.price_pln_net, price_eur_net: product.price_eur_net });
        return Response.json({ error: "price_unavailable", sku: raw.sku }, { status: 400 });
      }
      const quantity = raw.quantity;
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

    const delivery = calculateDelivery(DELIVERY_ZONES, {
      country: market,
      postalCode: text(deliveryAddress.postal_code, 12),
      items: deliveryItems,
    });

    const readiness = checkoutReadiness({ delivery, settings: SITE_SETTINGS, market, lang: language });
    if (!readiness.ready) {
      return Response.json({ error: "delivery_quote_required" }, { status: 400 });
    }
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
    const deliveryCharge = delivery.quoteRequired ? 0 : delivery.customerCharge;
    const totals = calculateOrderTotals({ itemsNet, deliveryCharge, vatRate: treatment.rate });
    if (!totals) return Response.json({ error: "order_submission_failed" }, { status: 500 });
    const {
      items_gross: itemsGross,
      delivery_net: deliveryNet,
      net_subtotal: netSubtotal,
      vat_amount: vatAmount,
      gross_total: grossTotal,
    } = totals;
    const calculatedTotals = {
      currency,
      items_net: itemsNet,
      items_gross: itemsGross,
      delivery_net: deliveryNet,
      delivery_charge: deliveryCharge,
      vat_rate: treatment.rate,
      vat_amount: vatAmount,
      gross_total: grossTotal,
    };
    if (!reviewedTotalsMatch(body.reviewed_totals, calculatedTotals)) {
      return Response.json({
        error: "checkout_changed",
        totals: calculatedTotals,
        cart_updates: items.map((item) => ({
          product_id: item.product_id,
          unit_price_net: item.unit_price_net,
        })),
      }, { status: 409 });
    }

    const labels = {
      pl_domestic: `w tym ${treatment.rate}% VAT`,
      de_consumer: `inkl. ${treatment.rate}% MwSt.`,
      intra_eu_b2b_0:
        language === "de"
          ? SITE_SETTINGS.vat.intra_eu_label_de
          : SITE_SETTINGS.vat.intra_eu_label_pl,
    };

    // The dashboard endpoint has no fields for company/VAT-ID/NIP or a PO reference, so
    // fold those identity details into the note rather than silently drop them. Shipping
    // is also sent through its supported structured field below; the note remains a human-
    // readable audit trail of the exact tax-inclusive amount accepted by the customer.
    const businessLines = [
      customerType === "business" ? `Contact: ${text(customer.name, 150)}` : null,
      customerType === "business" ? text(customer.company, 200) && `Firma: ${text(customer.company, 200)}` : null,
      customerType === "business" ? text(customer.vat_id, 20) && `VAT ID: ${text(customer.vat_id, 20)}` : null,
      customerType === "business" ? text(customer.nip, 20) && `NIP: ${text(customer.nip, 20)}` : null,
      customerType === "business" ? text(customer.po_reference, 100) && `PO: ${text(customer.po_reference, 100)}` : null,
      `Flat shipping (${delivery.method}): ${deliveryCharge.toFixed(2)} ${currency} customer charge / ${deliveryNet.toFixed(2)} net`,
      `VAT: ${treatment.rate}% / ${vatAmount.toFixed(2)} ${currency}`,
      `Checkout total: ${grossTotal.toFixed(2)} ${currency} gross`,
      `Storefront submission: ${idempotencyKey}`,
      text(customer.notes, 2000),
    ].filter(Boolean);

    // The dashboard uses customerName as the invoice buyer name. A business invoice must
    // therefore use the legal company name, while the human contact remains in the note.
    // Its address schema also accepts these structured identity fields for downstream
    // invoice templates without exposing them on private-customer orders.
    const dashboardBillingAddress = customerType === "business"
      ? {
          ...billingAddress,
          company: text(customer.company, 200),
          ...(market === "PL"
            ? { nip: text(customer.nip, 20).replace(/[\s-]/g, "") }
            : text(customer.vat_id, 20) ? { vat_id: text(customer.vat_id, 20) } : {}),
        }
      : billingAddress;

    let dashboardOrder;
    try {
      dashboardOrder = await submitDashboardOrder(STORE_ID, {
        locale: language,
        customerName: customerType === "business"
          ? text(customer.company, 200)
          : text(customer.name, 150),
        customerEmail: text(customer.email, 150),
        customerPhone: text(customer.phone, 40) || undefined,
        billingAddress: dashboardBillingAddress,
        deliveryAddress,
        customerNote: businessLines.join(" | ") || undefined,
        // Dashboard checkout expects the final customer-facing shipping charge. For a
        // Polish order this is 1,380 PLN including 23% VAT (1,121.95 net + 258.05 VAT).
        shippingAmount: deliveryCharge,
        lineItems: items.map((item) => ({ productId: item.product_id, quantity: item.quantity })),
      }, idempotencyKey);
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
        email: text(customer.email, 150),
        phone: text(customer.phone, 40),
        notes: text(customer.notes, 2000),
        ...(customerType === "business" ? {
          company: text(customer.company, 200),
          vat_id: text(customer.vat_id, 20),
          nip: text(customer.nip, 20),
          po_reference: text(customer.po_reference, 100),
        } : {}),
      },
      vat_validation: vatValidation,
      billing_address: billingAddress,
      delivery_address: deliveryAddress,
      delivery_country: market,
      delivery_postal_code: text(deliveryAddress.postal_code, 12),
      delivery_instructions: text(body.delivery_instructions, 2000),
      delivery_cost_net: deliveryNet,
      delivery_customer_charge: deliveryCharge,
      delivery_pricing_method: delivery.method,
      delivery_quote_required: delivery.quoteRequired,
      return_transport_charge: readiness.returnCharge || null,
      seller: SITE_SETTINGS.company,
      totals: {
        items_net: itemsNet,
        items_gross: itemsGross,
        delivery_net: deliveryNet,
        delivery_charge: deliveryCharge,
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
      checkout_acceptance: {
        submission_key: idempotencyKey,
        terms_accepted: true,
        accepted_at: new Date().toISOString(),
        button_label: customerType === "private"
          ? (language === "de" ? "Zahlungspflichtig bestellen" : "Zamawiam i płacę")
          : (language === "de" ? "Bestellung aufgeben" : "Złóż zamówienie"),
      },
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
      return_transport_charge: record.return_transport_charge,
      delivery_quote_required: record.delivery_quote_required,
    });
  } catch (error) {
    console.error("Order submission failed", error);
    return Response.json({ error: "order_submission_failed" }, { status: 500 });
  }
}
