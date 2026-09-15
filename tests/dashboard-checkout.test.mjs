import test from "node:test";
import assert from "node:assert/strict";
import { submitDashboardOrder } from "../src/lib/dashboardCheckout.js";

async function withMockFetch(mockFetch, run) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch;
  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("dashboard checkout forwards order identity and idempotency without unsupported monetary fields", async () => {
  const calls = [];
  const locales = ["pl", "de"];

  await withMockFetch(async (url, options) => {
    calls.push({ url, options });
    const callNumber = calls.length;
    return Response.json(
      { order: { id: `order-${callNumber}`, orderNumber: `OLB-${callNumber}` } },
      { status: 201 }
    );
  }, async () => {
    for (const locale of locales) {
      const order = await submitDashboardOrder(
        "store-123",
        {
          locale,
          lineItems: [{ productId: "container-20", quantity: 1 }],
        },
        "submission-key-123456"
      );
      assert.ok(order.id);
    }
  });

  assert.equal(calls.length, locales.length);
  calls.forEach(({ url, options }) => {
    assert.equal(url, "https://mycontainergmbh.com/api/storefront/checkout/store-123");
    assert.equal(options.method, "POST");
    assert.equal(options.headers["Content-Type"], "application/json");
    assert.equal(options.headers["Idempotency-Key"], "submission-key-123456");

    const sent = JSON.parse(options.body);
    assert.equal("shippingAmount" in sent, false);
    assert.equal("price" in sent.lineItems[0], false);
  });
});

test("dashboard order-number aliases and id fallback are normalized after successful creation", async () => {
  const remoteOrders = [
    { id: "order-1", order_number: "OLB-1" },
    { id: "order-2", number: "OLB-2" },
    { id: "order-3" },
  ];
  let responseIndex = 0;

  await withMockFetch(
    async () => Response.json({ order: remoteOrders[responseIndex++] }, { status: 201 }),
    async () => {
      const first = await submitDashboardOrder("store-123", { locale: "pl", lineItems: [] });
      const second = await submitDashboardOrder("store-123", { locale: "pl", lineItems: [] });
      const third = await submitDashboardOrder("store-123", { locale: "pl", lineItems: [] });
      assert.equal(first.orderNumber, "OLB-1");
      assert.equal(second.orderNumber, "OLB-2");
      assert.equal(third.orderNumber, "order-3");
    }
  );
});

test("dashboard checkout rejects failed responses or a missing immutable order id", async () => {
  const malformedResponses = [
    {},
    { order: {} },
    { order: { orderNumber: "OLB-1" } },
  ];
  let responseIndex = 0;

  await withMockFetch(
    async () => Response.json(malformedResponses[responseIndex++], { status: 201 }),
    async () => {
      for (let index = 0; index < malformedResponses.length; index += 1) {
        await assert.rejects(
          submitDashboardOrder(
            "store-123",
            { locale: "pl", lineItems: [] },
            "submission-key-123456"
          ),
          /Dashboard checkout submission failed/
        );
      }
    }
  );
});

test("dashboard checkout exposes a remote rejection as a failed submission", async () => {
  await withMockFetch(
    async () => Response.json({ error: "Delivery amount is not accepted" }, { status: 422 }),
    async () => {
      await assert.rejects(
        submitDashboardOrder("store-123", { locale: "pl", lineItems: [] }),
        /Delivery amount is not accepted/
      );
    }
  );
});
