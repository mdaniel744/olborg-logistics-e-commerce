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

test("dashboard checkout forwards flat shipping amounts and the idempotency key unchanged", async () => {
  const calls = [];
  const markets = [
    { locale: "pl", shippingAmount: 1380 },
    { locale: "de", shippingAmount: 530 },
  ];

  await withMockFetch(async (url, options) => {
    calls.push({ url, options });
    const callNumber = calls.length;
    return Response.json(
      { order: { id: `order-${callNumber}`, orderNumber: `OLB-${callNumber}` } },
      { status: 201 }
    );
  }, async () => {
    for (const market of markets) {
      const order = await submitDashboardOrder(
        "store-123",
        {
          locale: market.locale,
          shippingAmount: market.shippingAmount,
          lineItems: [{ productId: "container-20", quantity: 1 }],
        },
        "submission-key-123456"
      );
      assert.ok(order.id);
    }
  });

  assert.equal(calls.length, markets.length);
  calls.forEach(({ url, options }, index) => {
    assert.equal(url, "https://mycontainergmbh.com/api/storefront/checkout/store-123");
    assert.equal(options.method, "POST");
    assert.equal(options.headers["Content-Type"], "application/json");
    assert.equal(options.headers["Idempotency-Key"], "submission-key-123456");

    const sent = JSON.parse(options.body);
    assert.equal(sent.shippingAmount, markets[index].shippingAmount);
    assert.equal(typeof sent.shippingAmount, "number");
  });
});

test("dashboard checkout refuses to create an order without a valid structured shipping amount", async () => {
  let calls = 0;
  await withMockFetch(async () => {
    calls += 1;
    return Response.json({ order: { id: "order-1", orderNumber: "OLB-1" } }, { status: 201 });
  }, async () => {
    for (const shippingAmount of [undefined, Number.NaN, -1, "1380"]) {
      await assert.rejects(
        submitDashboardOrder(
          "store-123",
          { locale: "pl", shippingAmount, lineItems: [] },
          "submission-key-123456"
        ),
        /invalid shipping amount/
      );
    }
  });
  assert.equal(calls, 0);
});

test("dashboard checkout rejects malformed or missing order identity", async () => {
  const malformedResponses = [
    {},
    { order: {} },
    { order: { id: "order-1" } },
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
            { locale: "pl", shippingAmount: 1380, lineItems: [] },
            "submission-key-123456"
          ),
          /Dashboard checkout submission failed/
        );
      }
    }
  );
});
