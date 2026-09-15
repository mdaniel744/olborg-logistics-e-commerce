import test from "node:test";
import assert from "node:assert/strict";
import { calculateDelivery, findZone, flatRateDelivery, normalizePostalCode } from "../src/server/delivery.js";
import { calcDeliveryClient } from "../src/lib/deliveryClient.js";
import { DELIVERY_ZONES } from "../src/data/catalog.js";

const zones = [
  { name: "PL", country: "PL", pricing_type: "flat_rate", postal_prefixes: ["99"], customer_charge: 100 },
  { name: "DE", country: "DE", pricing_type: "flat_rate", postal_prefixes: ["10", "01"], customer_charge: 50 },
];
const request = { country: "PL", postalCode: "99-200", items: [{ quantity: 1 }] };

test("postal codes require the complete format of the selected country", () => {
  assert.equal(normalizePostalCode("PL", "99-200"), "99200");
  assert.equal(normalizePostalCode("PL", "99200"), "99200");
  assert.equal(normalizePostalCode("DE", "01067"), "01067");
  assert.equal(normalizePostalCode("DE", "10115"), "10115");
  for (const country of ["PL", "DE"]) {
    for (const value of ["", "1", "1234", "123456", "abcde", "12 345"]) {
      assert.equal(normalizePostalCode(country, value), null);
      assert.equal(findZone(zones, country, value), null);
    }
  }
  assert.equal(normalizePostalCode("DE", "10-115"), null);
  assert.equal(normalizePostalCode("FR", "75001"), null);
});

test("client and server use the same country-specific flat charge", () => {
  assert.equal(calcDeliveryClient, calculateDelivery);
  assert.equal(calculateDelivery(zones, request).customerCharge, 100);
  assert.equal(calculateDelivery(zones, request).method, "flat_rate");
  assert.equal(calculateDelivery(zones, { ...request, country: "DE", postalCode: "10115" }).customerCharge, 50);
  assert.equal(findZone(zones, "DE", "01067").name, "DE");
});

test("one charge covers every valid quantity, size and product line", () => {
  for (const items of [
    [{ size: "10ft", quantity: 1 }],
    [{ size: "40ft", quantity: 20 }],
    [{ size: "10ft", quantity: 2 }, { size: "20ft", quantity: 3 }, { size: "40ft", quantity: 4 }],
  ]) {
    assert.equal(calculateDelivery(zones, { ...request, items }).customerCharge, 100);
  }
});

test("a legacy unloading flag cannot alter the flat shipping charge", () => {
  assert.equal(calculateDelivery(zones, { ...request, craneUnloading: false }).customerCharge, 100);
  assert.equal(calculateDelivery(zones, { ...request, craneUnloading: true }).customerCharge, 100);
});

test("unknown, manual, disabled or incomplete delivery options require a quote", () => {
  assert.equal(calculateDelivery(zones, { ...request, postalCode: "1" }).reason, "invalid_postal_code");
  assert.equal(calculateDelivery(zones, { ...request, postalCode: "50-001" }).quoteRequired, true);
  assert.equal(calculateDelivery(zones, { ...request, items: [] }).quoteRequired, true);
  assert.equal(calculateDelivery(zones, { ...request, items: [{ quantity: -1 }] }).quoteRequired, true);
  assert.equal(calculateDelivery([{ ...zones[0], manual_quote_only: true }], request).quoteRequired, true);
  assert.equal(calculateDelivery([{ ...zones[0], active: false }], request).quoteRequired, true);
  assert.equal(calculateDelivery([{ ...zones[0], customer_charge: undefined }], request).quoteRequired, true);
});

test("the most specific valid postcode prefix takes precedence", () => {
  const specific = { ...zones[0], name: "specific", postal_prefixes: ["99-200"] };
  const wildcard = { ...zones[0], name: "empty", postal_prefixes: [""] };
  assert.equal(findZone([wildcard, ...zones, specific], "PL", "99-200").name, "specific");
  assert.equal(findZone([wildcard], "PL", "99-200"), null);
});

test("production checkout uses one nationwide charge per market", () => {
  const items = [{ size: "20ft", quantity: 1 }];
  assert.equal(calculateDelivery(DELIVERY_ZONES, { country: "PL", postalCode: "00-001", items }).customerCharge, 1380);
  assert.equal(calculateDelivery(DELIVERY_ZONES, { country: "PL", postalCode: "99-200", items: [{ size: "40ft", quantity: 8 }] }).customerCharge, 1380);
  assert.equal(calculateDelivery(DELIVERY_ZONES, { country: "DE", postalCode: "01067", items }).customerCharge, 530);
  assert.equal(calculateDelivery(DELIVERY_ZONES, { country: "DE", postalCode: "99998", items: [{ size: "10ft", quantity: 2 }, { size: "40ft", quantity: 3 }] }).customerCharge, 530);
});

test("checkout displays configured nationwide delivery before address entry, matching the submitted order", () => {
  for (const [country, postalCode, expectedCharge] of [["PL", "99-200", 1380], ["DE", "10115", 530]]) {
    const preview = flatRateDelivery(DELIVERY_ZONES, country);
    assert.equal(preview.customerCharge, expectedCharge);
    assert.deepEqual(preview, calculateDelivery(DELIVERY_ZONES, { country, postalCode, items: [{ quantity: 2 }] }));
    assert.equal(calculateDelivery(DELIVERY_ZONES, { country, postalCode: "", items: [{ quantity: 1 }] }).quoteRequired, true);
  }
  assert.equal(flatRateDelivery(DELIVERY_ZONES, "FR"), null);
  assert.equal(flatRateDelivery(zones, "PL"), null, "a regional zone must not be advertised nationwide");
  assert.equal(flatRateDelivery([{ ...DELIVERY_ZONES[0], active: false }], "PL"), null);
  assert.equal(flatRateDelivery([{ ...DELIVERY_ZONES[0], manual_quote_only: true }], "PL"), null);
});
