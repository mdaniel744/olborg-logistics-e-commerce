import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { calculateOrderTotals } from "../src/lib/orderTotals.js";

// Exercise the real route and dashboard adapter, with all remote I/O isolated.
const product = { id: "test-container", status: "active", availability: "in_stock", size: "20ft", name_pl: "Kontener", name_de: "Container", price_pln_net: 1000, price_eur_net: 1000 };
const state = { records: [], calls: [], remoteFailure: false, backupFailure: false, vatValid: false };
const key = "__olborgCheckoutTest";
globalThis[key] = { state, product };
const mocks = {
  "@/lib/supabaseCatalog": `export async function getProducts() { return [globalThis.${key}.product]; }`,
  "@/lib/supabaseClient": 'export const STORE_ID = "test-store";',
  "@/server/submission-store": `export async function saveSubmission(type, record) { const state = globalThis.${key}.state; if (state.backupFailure) throw new Error("Test backup unavailable"); state.records.push(record); }`,
  "@/server/vies": `export { parseVatId } from ${JSON.stringify(new URL("../src/server/vies.js", import.meta.url).href)}; export async function checkVat() { return { available: true, valid: globalThis.${key}.state.vatValid }; }`,
};
const routeSource = await readFile(new URL("../src/app/api/orders/route.js", import.meta.url), "utf8");
const resolvedRoute = routeSource.replace(/from "(@\/[^"]+)"/g, (_, specifier) => {
  const url = mocks[specifier]
    ? `data:text/javascript,${encodeURIComponent(mocks[specifier])}`
    : new URL(`../src/${specifier.slice(2)}.js`, import.meta.url).href;
  return `from ${JSON.stringify(url)}`;
});
const { POST } = await import(`data:text/javascript,${encodeURIComponent(resolvedRoute)}`);

function orderBody(market, language, customerType = "private", vatRate = market === "PL" ? 23 : 19) {
  const currency = market === "PL" ? "PLN" : "EUR";
  const totals = calculateOrderTotals({ itemsNet: 1000, deliveryCharge: market === "PL" ? 1380 : 530, vatRate });
  const address = { street: "Test Street 1", postal_code: market === "PL" ? "00-001" : "10115", city: "Test City", country: market };
  return {
    market, language, customer_type: customerType, terms_accepted: true,
    customer: { name: "Test Buyer", email: "test@example.invalid", phone: "+48000000000", ...(customerType === "business" ? { company: "Test Company" } : {}) },
    billing_address: address, delivery_address: address,
    items: [{ product_id: product.id, quantity: 1 }],
    reviewed_totals: { currency, ...totals },
  };
}

function send(body) {
  return POST(new Request("http://localhost/api/orders", {
    method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": "test-submission-12345" }, body: JSON.stringify(body),
  }));
}

test("checkout sends orders for invoicing in both countries and both languages", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalError = console.error;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://mycontainergmbh.com/api/storefront/checkout/test-store");
    state.calls.push({ body: JSON.parse(options.body), headers: options.headers });
    return state.remoteFailure
      ? Response.json({ error: "Test dashboard unavailable" }, { status: 503 })
      : Response.json({ order: { id: "test-order-id", order_number: "TEST-123" } }, { status: 201 });
  };
  console.error = () => {};
  try {
    for (const market of ["PL", "DE"]) {
      for (const language of ["pl", "de"]) {
        for (const type of ["private", "business"]) {
          await t.test(`${market} / ${language} / ${type}, tax number omitted`, async () => {
            const response = await send(orderBody(market, language, type));
            assert.equal(response.status, 200);
            const data = await response.json();
            assert.equal(data.order_number, "TEST-123");
            assert.equal(data.status, "processing");
            assert.equal(data.payment_status, "awaiting_invoice");
            assert.equal(data.currency, market === "PL" ? "PLN" : "EUR");
            assert.equal(data.totals.delivery_charge, market === "PL" ? 1380 : 530);
            assert.equal(data.totals.vat_rate, market === "PL" ? 23 : 19);
            const sent = state.calls.at(-1);
            assert.equal(sent.body.locale, market.toLowerCase());
            assert.equal(sent.body.customerName, type === "business" ? "Test Company" : "Test Buyer");
            assert.equal(sent.body.billingAddress.country, market);
            assert.equal("nip" in sent.body.billingAddress, false);
            assert.equal("vat_id" in sent.body.billingAddress, false);
            assert.equal("shippingAmount" in sent.body, false);
            assert.equal(sent.headers["Idempotency-Key"], "test-submission-12345");
            assert.match(sent.body.customerNote, /issue invoice/);
            assert.ok(sent.body.customerNote.includes(`Customer correspondence language: ${language}`));
            assert.deepEqual(state.records.at(-1).totals, data.totals);
          });
        }
      }
    }
    await t.test("price changes stop submission and return the updated summary", async () => {
      const body = orderBody("PL", "de");
      body.reviewed_totals.gross_total -= 1;
      const before = state.calls.length;
      const response = await send(body);
      assert.equal(response.status, 409);
      const result = await response.json();
      assert.equal(result.error, "checkout_changed");
      assert.equal(result.totals.gross_total, 2610);
      assert.equal(state.calls.length, before);
    });
    await t.test("VAT verification can update the summary, then succeed on the reviewed amount", async () => {
      const body = orderBody("DE", "pl", "business");
      body.customer.vat_id = "DE123456789";
      state.vatValid = true;
      const changed = await send(body);
      assert.equal(changed.status, 409);
      const update = await changed.json();
      body.reviewed_totals = update.totals;
      const accepted = await send(body);
      assert.equal(accepted.status, 200);
      assert.equal((await accepted.json()).totals.vat_rate, 0);
      state.vatValid = false;
    });
    await t.test("dashboard rejection never produces a false confirmation", async () => {
      state.remoteFailure = true;
      const before = state.records.length;
      const response = await send(orderBody("DE", "de"));
      assert.equal(response.status, 502);
      assert.equal((await response.json()).error, "dashboard_submission_failed");
      assert.equal(state.records.length, before);
      state.remoteFailure = false;
    });
    await t.test("local backup failure does not fail a remotely accepted order", async () => {
      state.backupFailure = true;
      const response = await send(orderBody("PL", "pl"));
      assert.equal(response.status, 200);
      assert.equal((await response.json()).order_number, "TEST-123");
    });
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalError;
    delete globalThis[key];
  }
});
