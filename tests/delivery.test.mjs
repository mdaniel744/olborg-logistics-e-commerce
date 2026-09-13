import test from "node:test";
import assert from "node:assert/strict";
import { calculateDelivery, findZone, normalizePostalCode } from "../src/server/delivery.js";
import { calcDeliveryClient } from "../src/lib/deliveryClient.js";

// Synthetic rates verify calculation only, not live commercial delivery prices.
const zones = [
  { name: "PL", country: "PL", postal_prefixes: ["99"], rates: [{ size: "20ft", rate_net: 100, additional_unit_rate_net: 80 }], crane_surcharge_net: 20 },
  { name: "DE", country: "DE", postal_prefixes: ["10", "01"], rates: [{ size: "20ft", rate_net: 50 }], crane_surcharge_net: 10 },
];
const request = { country: "PL", postalCode: "99-200", items: [{ size: "20ft", quantity: 1 }], craneUnloading: false };

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

test("client and server use country-specific matching and the same arithmetic", () => {
  assert.equal(calcDeliveryClient, calculateDelivery);
  assert.equal(calculateDelivery(zones, request).cost, 100);
  assert.equal(calculateDelivery(zones, { ...request, country: "DE", postalCode: "10115", craneUnloading: true }).cost, 60);
  assert.equal(calculateDelivery(zones, { ...request, items: [{ size: "20ft", quantity: 2 }], craneUnloading: true }).cost, 200);
  assert.equal(findZone(zones, "DE", "01067").name, "DE");
});

test("unknown, manual, disabled or incomplete delivery options require a quote", () => {
  assert.equal(calculateDelivery(zones, { ...request, postalCode: "1" }).reason, "invalid_postal_code");
  assert.equal(calculateDelivery(zones, { ...request, postalCode: "50-001" }).quoteRequired, true);
  assert.equal(calculateDelivery(zones, { ...request, items: [{ size: "40ft", quantity: 1 }] }).quoteRequired, true);
  assert.equal(calculateDelivery(zones, { ...request, items: [] }).quoteRequired, true);
  assert.equal(calculateDelivery(zones, { ...request, items: [{ size: "20ft", quantity: -1 }] }).quoteRequired, true);
  assert.equal(calculateDelivery([{ ...zones[0], manual_quote_only: true }], request).quoteRequired, true);
  assert.equal(calculateDelivery([{ ...zones[0], active: false }], request).quoteRequired, true);
  assert.equal(calculateDelivery([{ ...zones[0], crane_surcharge_net: undefined }], { ...request, craneUnloading: true }).quoteRequired, true);
});

test("the most specific valid postcode prefix takes precedence", () => {
  const specific = { ...zones[0], name: "specific", postal_prefixes: ["99-200"] };
  const wildcard = { ...zones[0], name: "empty", postal_prefixes: [""] };
  assert.equal(findZone([wildcard, ...zones, specific], "PL", "99-200").name, "specific");
  assert.equal(findZone([wildcard], "PL", "99-200"), null);
});
