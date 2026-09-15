import test from "node:test";
import assert from "node:assert/strict";
import { checkVat } from "../src/server/vies.js";

test("VIES verification supplies an eight-second timeout and returns a verified result", async (t) => {
  const controller = new AbortController();
  t.mock.method(AbortSignal, "timeout", (milliseconds) => {
    assert.equal(milliseconds, 8000);
    return controller.signal;
  });
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://ec.europa.eu/taxation_customs/vies/rest-api/ms/DE/vat/123456789");
    assert.equal(options.signal, controller.signal);
    assert.equal(options.cache, "no-store");
    return Response.json({ isValid: true, name: "Example GmbH", address: "Berlin", requestIdentifier: "verification-123" });
  });

  const result = await checkVat("DE", "123456789");
  assert.equal(result.available, true);
  assert.equal(result.valid, true);
  assert.equal(result.company_name, "Example GmbH");
  assert.equal(result.reference, "verification-123");
});

test("an unavailable VIES response never validates a VAT number", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 503 }));

  const result = await checkVat("DE", "123456789");
  assert.deepEqual(result, {
    available: false,
    valid: false,
    error: "VIES service returned 503",
  });
});

test("a VIES timeout rejects promptly for the existing checkout and VAT-route fallback handlers", async (t) => {
  const timeoutError = new DOMException("Verification timed out", "TimeoutError");
  t.mock.method(AbortSignal, "timeout", () => AbortSignal.abort(timeoutError));
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    options.signal.throwIfAborted();
    assert.fail("An aborted request must not continue to a verification result");
  });

  await assert.rejects(checkVat("DE", "123456789"), (error) => error === timeoutError);
});
