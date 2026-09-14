import test from "node:test";
import assert from "node:assert/strict";
import { computeVatTreatment } from "../src/server/pricing.js";

const settings = {
  vat: {
    pl_standard_rate: 23,
    de_consumer_rate: 19,
    distance_sales_destination_vat: true,
    b2b_zero_rating_enabled: true,
  },
};

test("every Polish checkout uses 23% VAT regardless of customer type or VIES state", () => {
  for (const customerType of ["private", "business"]) {
    for (const vatValid of [false, true]) {
      assert.deepEqual(computeVatTreatment(settings, {
        market: "PL",
        customerType,
        vatValid,
        deliveryCountry: "PL",
      }), {
        rate: 23,
        treatment: "pl_domestic",
      });
    }
  }
});
