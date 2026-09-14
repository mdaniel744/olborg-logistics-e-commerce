import test from "node:test";
import assert from "node:assert/strict";
import { applyCartPriceUpdates, cartItemKey, normalizeStoredCart } from "../src/lib/cartItems.js";

test("cart identity uses product ID and only falls back to legacy SKU", () => {
  assert.equal(cartItemKey({ product_id: "row-1", sku: null }), "row-1");
  assert.equal(cartItemKey({ product_id: "row-2", sku: null }), "row-2");
  assert.equal(cartItemKey({ sku: "LEGACY-1" }), "LEGACY-1");
  assert.notEqual(cartItemKey({ product_id: "row-1" }), cartItemKey({ product_id: "row-2" }));
});

test("stored cart normalization drops unidentified rows and bounds quantities", () => {
  assert.deepEqual(normalizeStoredCart(null), []);
  const normalized = normalizeStoredCart([
    { product_id: "one", quantity: 500 },
    { sku: "two", quantity: 0 },
    { quantity: 2 },
  ]);
  assert.deepEqual(normalized.map((item) => item.quantity), [100, 1]);
});

test("authoritative price refresh updates only the active market price", () => {
  const items = [{ product_id: "one", price_pln_net: 100, price_eur_net: 20 }];
  const updates = [{ product_id: "one", unit_price_net: 25 }];
  assert.deepEqual(applyCartPriceUpdates(items, updates, "DE"), [
    { product_id: "one", price_pln_net: 100, price_eur_net: 25 },
  ]);
});
