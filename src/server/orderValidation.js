import { normalizePostalCode } from "./delivery.js";

const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const cleanText = (value, max) => String(value || "").trim().slice(0, max);

export function sanitizeAddress(address, market) {
  return {
    street: cleanText(address?.street, 200),
    postal_code: cleanText(address?.postal_code, 12),
    city: cleanText(address?.city, 120),
    country: market,
  };
}

export function sanitizeCustomerForType(customerType, customer = {}, market) {
  const commonCustomer = {
    name: customer?.name,
    email: customer?.email,
    phone: customer?.phone,
    notes: customer?.notes,
  };

  if (customerType !== "business") return commonCustomer;

  const businessCustomer = {
    ...commonCustomer,
    company: customer?.company,
    po_reference: customer?.po_reference,
  };
  const nip = cleanText(customer?.nip, 20);
  const vatId = cleanText(customer?.vat_id, 20);
  if ((!market || market === "PL") && nip) businessCustomer.nip = nip;
  if ((!market || market === "DE") && vatId) businessCustomer.vat_id = vatId;
  return businessCustomer;
}

export function validateOrderPayloadShape(body) {
  if (!body || !["PL", "DE"].includes(body.market)) return "invalid_market";
  if (!["pl", "de"].includes(body.language) || body.language !== body.market.toLowerCase()) return "invalid_language";
  if (!["private", "business"].includes(body.customer_type)) return "invalid_customer_type";
  if (body.terms_accepted !== true) return "terms_required";

  const items = body.items;
  if (!Array.isArray(items) || items.length < 1 || items.length > 20) return "empty_cart";
  const productIds = new Set();
  for (const item of items) {
    if (
      !hasText(item?.product_id) ||
      !Number.isInteger(item?.quantity) ||
      item.quantity < 1 ||
      item.quantity > 100
    ) {
      return "invalid_cart_item";
    }
    if (productIds.has(item.product_id)) return "invalid_cart_item";
    productIds.add(item.product_id);
  }
  return null;
}

export function reviewedTotalsMatch(reviewed, calculated) {
  if (!reviewed || reviewed.currency !== calculated.currency) return false;
  for (const key of ["items_net", "items_gross", "delivery_net", "delivery_charge", "vat_rate", "vat_amount", "gross_total"]) {
    if (!Number.isFinite(reviewed[key]) || Math.round(reviewed[key] * 100) !== Math.round(calculated[key] * 100)) return false;
  }
  return true;
}

export function validateOrderDetails({ market, customerType, customer, billingAddress, deliveryAddress }) {
  if (!hasText(customer?.name) || !hasText(customer?.phone)) return "missing_customer";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(customer?.email || "").trim())) return "invalid_email";

  if (customerType === "business") {
    if (!hasText(customer?.company)) return "missing_company";
    const nip = String(customer?.nip || "").trim();
    if (market === "PL" && nip && !/^\d{10}$/.test(nip.replace(/[\s-]/g, ""))) return "invalid_tax_id";
  }

  for (const address of [billingAddress, deliveryAddress]) {
    if (
      !hasText(address?.street) ||
      !hasText(address?.city) ||
      address?.country !== market ||
      !normalizePostalCode(market, address?.postal_code)
    ) {
      return "invalid_address";
    }
  }

  return null;
}
