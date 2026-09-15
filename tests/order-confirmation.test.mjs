import test from "node:test";
import assert from "node:assert/strict";

let moduleNumber = 0;
const freshHelper = () => import(`../src/lib/orderConfirmation.js?test=${++moduleNumber}`);
const order = {
  id: "order-123",
  order_number: "OLB-123",
  currency: "PLN",
  email: "buyer@example.test",
  totals: { gross_total: 9000 },
};

test("saved orders remain available when browser storage rejects writes and reads", async () => {
  const { rememberOrder, readLastOrder } = await freshHelper();
  const blockedStorage = {
    setItem() { throw new Error("Storage denied"); },
    getItem() { throw new Error("Storage denied"); },
  };
  assert.equal(rememberOrder(order, blockedStorage), true);
  assert.deepEqual(readLastOrder(blockedStorage), order);
});

test("a new saved order takes priority over an older session when the storage write fails", async () => {
  const { rememberOrder, readLastOrder } = await freshHelper();
  const staleStorage = {
    setItem() { throw new Error("Quota exceeded"); },
    getItem() { return JSON.stringify({ id: "old-order", order_number: "OLD-1" }); },
  };
  rememberOrder(order, staleStorage);
  assert.equal(readLastOrder(staleStorage).order_number, "OLB-123");
});

test("a persisted confirmation restores its reference, customer and totals after a fresh page load", async () => {
  const storedValues = new Map();
  const storage = {
    setItem(key, value) { storedValues.set(key, value); },
    getItem(key) { return storedValues.get(key) ?? null; },
  };
  const writer = await freshHelper();
  writer.rememberOrder(order, storage);
  const reader = await freshHelper();
  assert.deepEqual(reader.readLastOrder(storage), order);
});

test("empty, blocked, damaged or incomplete sessions do not produce a confirmation", async () => {
  const invalidSessions = [null, "{damaged", "null", "[]", "{}", '{"id":"123"}', '{"order_number":"OLB-1"}', '{"id":" ","order_number":"OLB-1"}'];
  for (const saved of invalidSessions) {
    const { readLastOrder } = await freshHelper();
    assert.equal(readLastOrder({ getItem: () => saved }), null);
  }
  const { readLastOrder } = await freshHelper();
  assert.equal(readLastOrder({ getItem() { throw new Error("Storage denied"); } }), null);
});

test("remembering an incomplete response does not replace a valid order", async () => {
  const { rememberOrder, readLastOrder } = await freshHelper();
  rememberOrder(order, null);
  assert.equal(rememberOrder({ id: "incomplete" }, null), false);
  assert.deepEqual(readLastOrder(null), order);
});
