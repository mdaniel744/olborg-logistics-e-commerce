// Read-only checks against an already running local server; never submits a real order.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { R, CATEGORY_LANDINGS } from "../src/lib/routes.js";
import { PUBLIC_PAGE_KEYS } from "../src/lib/pageMetadata.js";

const origin = process.env.SMOKE_ORIGIN || "http://127.0.0.1:3001";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname), "Smoke tests must target localhost");
const guideSource = readFileSync(new URL("../src/i18n/guides.js", import.meta.url), "utf8");
const guideRoutes = [
  ...[...guideSource.matchAll(/slug: "([^"]+)"/g)].map((m) => `/poradnik/${m[1]}`),
  ...[...guideSource.matchAll(/slug_de: "([^"]+)"/g)].map((m) => `/de/ratgeber/${m[1]}`),
];
const paths = [...new Set([
  ...PUBLIC_PAGE_KEYS.flatMap((key) => [R[key].pl, R[key].de]),
  ...CATEGORY_LANDINGS.flatMap((entry) => [entry.pl, entry.de]), ...guideRoutes,
])];
let checked = 0;
for (let i = 0; i < paths.length; i += 4) {
  await Promise.all(paths.slice(i, i + 4).map(async (path) => {
    const response = await fetch(`${origin}${path}`);
    const html = await response.text();
    assert.equal(response.status, 200, path);
    assert.match(html, /<h1\b/, `${path}: heading`);
    assert.match(html, /<title>[^<]+<\/title>/, `${path}: title`);
    assert.match(html, /name="description" content="[^"]+"/, `${path}: description`);
    assert.match(html, /rel="canonical"/, `${path}: canonical`);
    assert.match(html, /8281415227/, `${path}: seller identity`);
    assert.doesNotMatch(html, /name="google" content="notranslate"/, `${path}: browser translation metadata`);
    assert.doesNotMatch(html, /<(?:html|body)[^>]*translate="no"/, `${path}: global browser translation attribute`);
    assert.match(
      html,
      new RegExp(`<div lang="${path === "/de" || path.startsWith("/de/") ? "de-DE" : "pl-PL"}"`),
      `${path}: localized content language`
    );
    checked++;
  }));
}
const productResponse = await fetch(`${origin}/de/produkt/20-fuss-standard-container`);
if (productResponse.ok) {
  const html = await productResponse.text();
  assert.match(html, /product-panel-description/, "Description panel must be in server HTML before tab click");
  assert.match(html, /Demoprodukt/, "Local fallback must be explicitly labelled demo");
  assert.match(html, /name="robots" content="noindex/, "Demo must not be indexed");
}
const feed = await fetch(`${origin}/api/merchant-feed?market=de`);
assert.equal(feed.status, 503, "Unconfigured local checkout must not produce retail offers");
assert.equal((await fetch(`${origin}/api/merchant-feed?market=fr`)).status, 400);
assert.equal((await fetch(`${origin}/api/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })).status, 400);
for (const path of ["/de/ratgeber/not-a-real-guide", "/de/not-a-real-product"]) {
  assert.equal((await fetch(`${origin}${path}`)).status, 404, path);
}
const legacy = await fetch(`${origin}/de/20-fuss-standard-container`, { redirect: "manual" });
assert.equal(legacy.status, 308);
assert.equal(legacy.headers.get("location"), "/de/produkt/20-fuss-standard-container");
console.log(`Passed ${checked} bilingual content routes, product HTML, feed readiness and empty-order validation.`);
