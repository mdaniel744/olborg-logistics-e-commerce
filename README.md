# Olborg Logistics storefront

A full-stack, bilingual e-commerce storefront built with Next.js App Router.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
node --test tests/*.test.mjs
```

With the local server running on port 3001, `node tests/storefront-smoke.mjs` checks both language versions without submitting an order or quote. Use `SMOKE_ORIGIN` for another localhost port.

## Application structure

- `src/app/` contains layouts, routes, metadata, and server endpoints.
- `src/features/storefront/` contains reusable storefront page components.
- `src/lib/supabaseCatalog.js` loads active catalogue rows, translations and market prices. `src/data/catalog.js` contains local demo products, public settings and delivery zones.
- `src/server/` contains authoritative delivery, VAT, pricing, and persistence logic.
- `public/images/` contains the brand and product assets served by the app.

## Server endpoints

- `POST /api/orders` validates catalog items and recomputes delivery, VAT, and totals.
- `POST /api/quotes` validates and records quote requests.
- `POST /api/uploads` accepts up to six image files of at most 5 MB each.
- `POST /api/vat` validates EU VAT IDs against VIES.
- `GET /api/merchant-feed?market=pl|de` generates a Google Merchant XML feed.

Orders and quotes are submitted to the configured external dashboard/inquiry service, with a best-effort local backup under `.data/`. Polish orders always record 23% VAT for private and business buyers. The dashboard currently rejects storefront-supplied `shippingAmount`, so configure matching delivery rules in that dashboard before relying on its generated invoice total; until then the server-authoritative delivery/VAT/total snapshot is retained locally and in the order audit note. Development is not a mock order environment: do not submit real-looking test orders without a designated test backend. Quote images currently use `public/uploads/`; private storage, retention and authorized retrieval remain required follow-up work.

Checkout submits an order for staff processing; it does not collect a payment. Staff issue the invoice and send bank-transfer details afterwards. The confirmation shows `processing` / `awaiting_invoice` and the exact submitted total. Shipping is displayed before postcode entry, while complete addresses remain required on submission. Delivery country controls currency and VAT independently of interface language. Company tax numbers are optional. Browser storage is best-effort and cannot turn an accepted order into a failure.

For the real local catalog, set `NEXT_PUBLIC_STORE_ID`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in ignored `.env.local`, with `NEXT_PUBLIC_USE_DEMO_PRODUCTS=false`. Restart the local server after restoring connection settings. Existing demo items in a stored cart must be replaced with current catalog products. A configured live catalog no longer silently substitutes demo products during an outage. `tests/checkout-flow.test.mjs` exercises the real order handler with isolated catalog, VAT and dashboard responses; it creates no external orders.

## Merchant Center / SEO release checks

Read [the dated audit and unresolved business facts](docs/merchant-seo-audit.md) before publishing or requesting a Google review.

- Set `NEXT_PUBLIC_SITE_URL` to the verified public HTTPS origin. Without it the site is non-indexable, the sitemap is empty and the feed returns HTTP 503. The request host is not used as a production canonical domain.
- Checkout uses one final customer delivery charge per order: 1,380 PLN for Poland and 530 EUR for Germany, independent of customer type, container size and quantity. Published standard-delivery estimates for available containers are about 3–7 days within Poland and 4–9 days to Germany after order acceptance and cleared payment. The same country amounts are configured under `SITE_SETTINGS.returns.transport_charges` for Olborg-arranged customer-paid return transport. Keep the website, checkout and Merchant Center shipping/return settings identical if these commercial rates or delivery windows change.
- Demo products cannot be ordered or advertised. Keep `NEXT_PUBLIC_USE_DEMO_PRODUCTS` off in production. A deployment explicitly enabling demo products is non-indexable.
- Verify the registered address, return depot, invoices, stock, manufacturer identifiers, translated descriptions and Merchant Center shipping/returns settings. Published rates and delivery windows still need to match the operational service and Merchant Center configuration.
- Public pages have localized metadata, canonical links and hreflang; `/sitemap.xml` excludes demo products, incomplete product translations and transactional pages. Old direct product URLs use permanent redirects to `/produkt/…` and `/de/produkt/…`.
