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
```

## Application structure

- `src/app/` contains layouts, routes, metadata, and server endpoints.
- `src/features/storefront/` contains reusable storefront page components.
- `src/data/catalog.js` is the source of truth for products, settings, and delivery zones.
- `src/server/` contains authoritative delivery, VAT, pricing, and persistence logic.
- `public/images/` contains the brand and product assets served by the app.

## Server endpoints

- `POST /api/orders` validates catalog items and recomputes delivery, VAT, and totals.
- `POST /api/quotes` validates and records quote requests.
- `POST /api/uploads` accepts up to six image files of at most 5 MB each.
- `POST /api/vat` validates EU VAT IDs against VIES.
- `GET /api/merchant-feed?market=pl|de` generates a Google Merchant XML feed.

During local development, orders and quotes are appended to `.data/*.ndjson`, and uploaded quote images are written to `public/uploads/`. Replace this storage adapter with a database and object storage before deploying to an ephemeral or serverless production environment.
