import test from "node:test";
import assert from "node:assert/strict";
import { merchantItem, renderMerchantFeed, plainText } from "../src/lib/merchantFeed.js";
import { publicSiteOrigin } from "../src/lib/siteUrl.js";
import { productLanguagePaths } from "../src/lib/routes.js";
import { publicPageMetadata, PUBLIC_PAGE_KEYS } from "../src/lib/pageMetadata.js";
import { R } from "../src/lib/routes.js";
import { productStructuredData } from "../src/lib/productStructuredData.js";
import { checkoutReadiness } from "../src/lib/checkoutReadiness.js";

const product = {
  id: "product-20-used-blue", sku: "20U-BL", active: true, merchant_eligible: true,
  condition: "used", availability: "in_stock", size: "20ft",
  name_pl: "Kontener 20 stóp — Używany", name_de: "20 Fuß Container — Gebraucht",
  slug_pl: "kontener-20-stop-uzywany", slug_de: "20-fuss-container-gebraucht",
  short_description_pl: "<p>Opis &amp; dane</p>", short_description_de: "<p>Container &amp; Details</p>",
  price_pln_net: 100, price_eur_net: 100, featured_image: "/images/container.jpg",
  color_label_pl: "Niebieski", color_label_de: "Blau", color_ral: "RAL 5010",
  merchant_languages: { pl: true, de: true },
};
const options = { lang: "de", origin: "https://example.com", vatRate: 19 };

test("feed matches localized URLs, gross consumer prices and actual condition", () => {
  const { xml } = merchantItem(product, options);
  assert.match(xml, /119\.00 EUR/);
  assert.match(xml, /\/de\/produkt\/20-fuss-container-gebraucht/);
  assert.match(xml, /<g:condition>used/);
  assert.match(xml, /Container &amp; Details/);
  assert.equal((xml.match(/Gebraucht/g) || []).length, 1);
  assert.doesNotMatch(xml, /<g:brand>|identifier_exists|backorder/);
  assert.match(merchantItem(product, { ...options, lang: "pl", vatRate: 23 }).xml, /123\.00 PLN/);
});

test("feed rejects demo, quotation-only, incomplete and invalid records", () => {
  for (const changed of [
    { is_demo: true }, { availability: "on_request" }, { condition: "unknown" },
    { price_eur_net: NaN }, { price_eur_net: Infinity }, { price_eur_net: -1 }, { price_eur_net: 0 },
    { slug_de: "" }, { name_de: "" }, { short_description_de: "" },
    { featured_image: "javascript:alert(1)" }, { active: false }, { merchant_eligible: false },
    { merchant_languages: { de: false } },
  ]) assert.equal(merchantItem({ ...product, ...changed }, options), null, JSON.stringify(changed));
});

test("feed preserves supplied identifiers, never labels the seller as manufacturer", () => {
  const item = merchantItem({ ...product, brand: "Actual manufacturer", mpn: "20-X" }, options);
  assert.match(item.xml, /<g:brand>Actual manufacturer<\/g:brand>/);
  assert.match(item.xml, /<g:mpn>20-X<\/g:mpn>/);
  assert.doesNotMatch(item.xml, /identifier_exists/);
  assert.match(merchantItem({ ...product, identifier_exists: false }, options).xml, /<g:identifier_exists>no/);
});

test("feed supports stable row IDs without SKU and deduplicates IDs", () => {
  assert.equal(merchantItem({ ...product, sku: null }, options).id, product.id);
  assert.equal((renderMerchantFeed([product, product], options).match(/<item>/g) || []).length, 1);
});

test("deployment origin is explicit HTTPS, not a request host or local address", () => {
  assert.equal(publicSiteOrigin("https://example.com/"), "https://example.com");
  for (const value of ["", "not a URL", "http://example.com", "https://localhost:3001", "https://127.0.0.1", "https://name:password@example.com"]) {
    assert.equal(publicSiteOrigin(value), null);
  }
});

test("every public page has bilingual unique metadata and paired canonicals", () => {
  for (const lang of ["pl", "de"]) {
    const titles = new Set();
    for (const key of PUBLIC_PAGE_KEYS) {
      const metadata = publicPageMetadata(R[key][lang], lang);
      assert.ok(metadata.description.length > 30);
      assert.equal(metadata.alternates.canonical, R[key][lang]);
      assert.equal(metadata.alternates.languages.de, R[key].de);
      assert.ok(!titles.has(metadata.title));
      titles.add(metadata.title);
    }
  }
  assert.equal(publicPageMetadata("/de/kasse", "de"), null);
});

test("incomplete product translations cannot become hreflang or sitemap targets", () => {
  assert.deepEqual(productLanguagePaths({ ...product, merchant_languages: { pl: true, de: false } }), { pl: "/produkt/kontener-20-stop-uzywany" });
  assert.deepEqual(productLanguagePaths({ ...product, merchant_languages: { pl: false, de: true } }), { de: "/de/produkt/20-fuss-container-gebraucht" });
});

test("description conversion removes markup and script contents", () => {
  assert.equal(plainText("<script>evil()</script><p>Container &amp; <strong>Details</strong></p>"), "Container & Details");
});

test("Product schema never fabricates an offer for demo/quotation/unready checkout", () => {
  assert.equal(productStructuredData({ ...product, is_demo: true }, { ...options, grossPrice: 119 }), null);
  assert.equal(productStructuredData(product, { ...options, grossPrice: 119 }).offers, undefined);
  assert.equal(productStructuredData({ ...product, availability: "on_request" }, { ...options, grossPrice: 119, purchasable: true }).offers, undefined);
  const data = productStructuredData(product, { ...options, grossPrice: 119, purchasable: true });
  assert.equal(data.offers.price, "119.00");
  assert.equal(data.offers.priceCurrency, "EUR");
  assert.equal(data.offers.itemCondition, "https://schema.org/UsedCondition");
  assert.equal(data.brand, undefined);
});

test("checkout requires known delivery and return charges for every customer", () => {
  const base = { settings: { returns: { transport_charges: { DE: { de: "530 EUR" } } } }, market: "DE", lang: "de" };
  assert.equal(checkoutReadiness({ ...base, delivery: null }).ready, false);
  assert.equal(checkoutReadiness({ ...base, delivery: { quoteRequired: true, customerCharge: 0 } }).ready, false);
  assert.equal(checkoutReadiness({ ...base, delivery: { quoteRequired: false, customerCharge: 530 } }).ready, true);
  assert.equal(checkoutReadiness({ ...base, settings: {}, delivery: { quoteRequired: false, customerCharge: 530 } }).ready, false);
});
