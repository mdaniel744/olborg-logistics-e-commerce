# AGENTS.md

## Project context

This is a bilingual Polish/German e-commerce storefront built with Next.js App Router, React, and Tailwind CSS.

## Key areas

- `src/app/`: routes, layouts, metadata, and server endpoints.
- `src/features/storefront/`: reusable client-side storefront page components.
- `src/components/`: storefront and UI components.
- `src/data/catalog.js`: local product catalog, delivery zones, and public settings.
- `src/server/`: server-only pricing, VAT, delivery, and submission helpers.
- `public/images/`: repository-owned brand and catalog images.

## Working notes

- Use `npm run dev` for local development.
- Keep server-side order totals authoritative; never trust totals sent by a browser.
- Keep Polish root routes and German `/de` routes aligned through `src/lib/routes.js`.
- Order and quote submissions are stored as newline-delimited JSON in `.data/` during local development.
- Uploaded quote images are stored in `public/uploads/` during local development.
- Run lint, type checking, and a production build before finishing changes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
