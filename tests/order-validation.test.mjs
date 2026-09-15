import test from "node:test";
import assert from "node:assert/strict";
import { reviewedTotalsMatch, sanitizeAddress, sanitizeCustomerForType, validateOrderDetails, validateOrderPayloadShape } from "../src/server/orderValidation.js";

const privateOrder = {
  market: "PL",
  customerType: "private",
  customer: { name: "Jan Kowalski", email: "jan@example.com", phone: "+48 500 000 000" },
  billingAddress: { street: "Rynek 1", postal_code: "99-200", city: "Poddębice", country: "PL" },
  deliveryAddress: { street: "Rynek 1", postal_code: "99-200", city: "Poddębice", country: "PL" },
};

test("a complete private-customer checkout passes validation", () => {
  assert.equal(validateOrderDetails(privateOrder), null);
});

test("validated addresses are reduced to bounded invoice and delivery fields", () => {
  assert.deepEqual(sanitizeAddress({
    ...privateOrder.billingAddress,
    city: "  Poddębice  ",
    injected: "must not reach the dashboard",
  }, "PL"), {
    street: "Rynek 1",
    postal_code: "99-200",
    city: "Poddębice",
    country: "PL",
  });
});

test("private checkout requires contact details and both complete addresses", () => {
  assert.equal(validateOrderDetails({ ...privateOrder, customer: { ...privateOrder.customer, phone: "" } }), "missing_customer");
  assert.equal(validateOrderDetails({ ...privateOrder, customer: { ...privateOrder.customer, email: "not-an-email" } }), "invalid_email");
  assert.equal(validateOrderDetails({ ...privateOrder, deliveryAddress: { ...privateOrder.deliveryAddress, postal_code: "123" } }), "invalid_address");
  assert.equal(validateOrderDetails({ ...privateOrder, deliveryAddress: { ...privateOrder.deliveryAddress, country: "DE" } }), "invalid_address");
});

test("business-only fields do not leak into private validation", () => {
  assert.equal(validateOrderDetails({ ...privateOrder, customer: { ...privateOrder.customer, company: "", nip: "" } }), null);
  assert.equal(validateOrderDetails({ ...privateOrder, customerType: "business" }), "missing_company");
  assert.equal(validateOrderDetails({
    ...privateOrder,
    customerType: "business",
    customer: { ...privateOrder.customer, company: "Example sp. z o.o.", nip: "" },
  }), null);
  assert.equal(
    validateOrderDetails({
      ...privateOrder,
      customerType: "business",
      customer: { ...privateOrder.customer, company: "Example sp. z o.o.", nip: "123" },
    }),
    "invalid_tax_id"
  );
  assert.equal(validateOrderDetails({
    ...privateOrder,
    customerType: "business",
    customer: { ...privateOrder.customer, company: "Example sp. z o.o.", nip: "123-456-78-90" },
  }), null);
});

test("private orders discard stale business identity and purchase-order data", () => {
  const submittedCustomer = {
    name: "Jan Kowalski",
    email: "jan@example.com",
    phone: "+48 500 000 000",
    notes: "Call before delivery",
    company: "Stale Company sp. z o.o.",
    nip: "1234567890",
    vat_id: "DE123456789",
    po_reference: "PO-SECRET-42",
  };

  assert.deepEqual(sanitizeCustomerForType("private", submittedCustomer), {
    name: submittedCustomer.name,
    email: submittedCustomer.email,
    phone: submittedCustomer.phone,
    notes: submittedCustomer.notes,
  });
  assert.deepEqual(sanitizeCustomerForType("business", submittedCustomer), submittedCustomer);
  assert.deepEqual(sanitizeCustomerForType("business", submittedCustomer, "PL"), {
    name: submittedCustomer.name,
    email: submittedCustomer.email,
    phone: submittedCustomer.phone,
    notes: submittedCustomer.notes,
    company: submittedCustomer.company,
    nip: submittedCustomer.nip,
    po_reference: submittedCustomer.po_reference,
  });
  assert.deepEqual(sanitizeCustomerForType("business", submittedCustomer, "DE"), {
    name: submittedCustomer.name,
    email: submittedCustomer.email,
    phone: submittedCustomer.phone,
    notes: submittedCustomer.notes,
    company: submittedCustomer.company,
    vat_id: submittedCustomer.vat_id,
    po_reference: submittedCustomer.po_reference,
  });
});

test("order payload requires an explicit market, paid-order acceptance and strict cart quantities", () => {
  const body = {
    market: "PL",
    language: "pl",
    customer_type: "private",
    terms_accepted: true,
    items: [{ product_id: "product-1", quantity: 1 }],
  };
  assert.equal(validateOrderPayloadShape(body), null);
  assert.equal(validateOrderPayloadShape({ ...body, market: "FR" }), "invalid_market");
  assert.equal(validateOrderPayloadShape({ ...body, language: "de" }), null);
  assert.equal(validateOrderPayloadShape({ ...body, market: "DE", language: "pl" }), null);
  assert.equal(validateOrderPayloadShape({ ...body, language: "en" }), "invalid_language");
  assert.equal(validateOrderPayloadShape({ ...body, terms_accepted: false }), "terms_required");
  assert.equal(validateOrderPayloadShape({ ...body, unloading_method: "legacy-value" }), null);
  assert.equal(validateOrderPayloadShape({ ...body, items: [{ product_id: "product-1", quantity: 1.5 }] }), "invalid_cart_item");
  assert.equal(validateOrderPayloadShape({ ...body, items: [{ product_id: "product-1", quantity: 1 }, { product_id: "product-1", quantity: 1 }] }), "invalid_cart_item");
});

test("the server only accepts the exact totals reviewed in the same currency", () => {
  const calculated = { currency: "PLN", items_net: 100, items_gross: 123, delivery_net: 20, delivery_charge: 24.6, vat_rate: 23, vat_amount: 27.6, gross_total: 147.6 };
  assert.equal(reviewedTotalsMatch({ ...calculated }, calculated), true);
  assert.equal(reviewedTotalsMatch({ ...calculated, gross_total: 147.604 }, calculated), true);
  assert.equal(reviewedTotalsMatch({ ...calculated, gross_total: 147.61 }, calculated), false);
  assert.equal(reviewedTotalsMatch({ ...calculated, gross_total: 147.62 }, calculated), false);
  assert.equal(reviewedTotalsMatch({ ...calculated, currency: "EUR" }, calculated), false);
  assert.equal(reviewedTotalsMatch({ ...calculated, vat_amount: Number.NaN }, calculated), false);
});
