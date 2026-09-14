import test from "node:test";
import assert from "node:assert/strict";
import { calculateOrderTotals } from "../src/lib/orderTotals.js";

test("Polish checkout keeps the 1,380 PLN shipping charge VAT-inclusive", () => {
  assert.deepEqual(calculateOrderTotals({ itemsNet: 100, deliveryCharge: 1380, vatRate: 23 }), {
    items_net: 100,
    items_gross: 123,
    delivery_net: 1121.95,
    delivery_charge: 1380,
    net_subtotal: 1221.95,
    vat_rate: 23,
    vat_amount: 281.05,
    gross_total: 1503,
  });
});

test("German private checkout keeps the 530 EUR shipping charge VAT-inclusive", () => {
  assert.deepEqual(calculateOrderTotals({ itemsNet: 100, deliveryCharge: 530, vatRate: 19 }), {
    items_net: 100,
    items_gross: 119,
    delivery_net: 445.38,
    delivery_charge: 530,
    net_subtotal: 545.38,
    vat_rate: 19,
    vat_amount: 103.62,
    gross_total: 649,
  });
});

test("zero-rated German B2B checkout still charges exactly 530 EUR shipping", () => {
  assert.deepEqual(calculateOrderTotals({ itemsNet: 100, deliveryCharge: 530, vatRate: 0 }), {
    items_net: 100,
    items_gross: 100,
    delivery_net: 530,
    delivery_charge: 530,
    net_subtotal: 630,
    vat_rate: 0,
    vat_amount: 0,
    gross_total: 630,
  });
});

test("invalid monetary input is rejected", () => {
  assert.equal(calculateOrderTotals({ itemsNet: -1, deliveryCharge: 530, vatRate: 19 }), null);
  assert.equal(calculateOrderTotals({ itemsNet: 100, deliveryCharge: Number.NaN, vatRate: 19 }), null);
});
