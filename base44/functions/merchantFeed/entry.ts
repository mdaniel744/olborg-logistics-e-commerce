import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { computeVatTreatment, grossFromNet } from "../../shared/pricing.ts";

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Google Merchant Center feed. ?market=pl → PLN/Polish, ?market=de → EUR/German.
// Uses published storefront prices only — never live FX conversion.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);
    let market = (url.searchParams.get("market") || "").toLowerCase();
    if (!market) {
      const body = await req.json().catch(() => ({}));
      market = (body.market || "pl").toLowerCase();
    }
    const isDE = market === "de";

    const settingsList = await base44.asServiceRole.entities.SiteSettings.filter({ singleton_key: "main" });
    const settings = settingsList[0] || {};
    const products = await base44.asServiceRole.entities.Product.filter({ status: "active" });

    const origin = url.origin;
    const treatment = computeVatTreatment(settings, {
      market: isDE ? "DE" : "PL",
      customerType: "private",
      vatValid: false,
      deliveryCountry: isDE ? "DE" : "PL",
    });

    const itemsXml = [];
    for (const p of products) {
      if (p.is_demo) continue; // DEMO/DRAFT records are never submitted
      const slug = isDE ? p.slug_de : p.slug_pl;
      const name = isDE ? p.name_de : p.name_pl;
      const desc = isDE ? p.short_description_de || p.description_de : p.short_description_pl || p.description_pl;
      for (const v of p.variants || []) {
        if (v.active === false || !v.merchant_eligible) continue;
        const net = isDE ? v.price_eur_net : v.price_pln_net;
        if (typeof net !== "number") continue;
        const image = v.image || p.featured_image;
        if (!image) continue;
        const gross = grossFromNet(net, treatment.rate);
        const params = isDE ? `?zustand=${v.condition === "new" ? "neu" : "gebraucht"}` : `?stan=${v.condition === "new" ? "nowy" : "uzywany"}`;
        const link = isDE ? `${origin}/de/${slug}${params}` : `${origin}/${slug}${params}`;
        const availability = v.availability === "in_stock" ? "in_stock" : v.availability === "on_request" ? "backorder" : "out_of_stock";
        const condition = v.condition === "new" ? "new" : "used";
        const title = `${name} — ${v.condition === "new" ? (isDE ? "Neu" : "Nowy") : isDE ? "Gebraucht" : "Używany"}`;
        itemsXml.push(
          `<item>` +
            `<g:id>${esc(v.sku)}</g:id>` +
            `<g:item_group_id>${esc(p.id)}</g:item_group_id>` +
            `<g:title>${esc(title)}</g:title>` +
            `<g:description>${esc(desc)}</g:description>` +
            `<g:link>${esc(link)}</g:link>` +
            `<g:image_link>${esc(image)}</g:image_link>` +
            `<g:price>${gross.toFixed(2)} ${isDE ? "EUR" : "PLN"}</g:price>` +
            `<g:availability>${availability}</g:availability>` +
            `<g:condition>${condition}</g:condition>` +
            `<g:brand>Olborg Logistics</g:brand>` +
            `<g:identifier_exists>no</g:identifier_exists>` +
            (v.color_pl ? `<g:color>${esc(isDE ? v.color_de : v.color_pl)}</g:color>` : "") +
            `<g:size>${esc(p.size)}</g:size>` +
            `</item>`
        );
      }
    }

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">` +
      `<channel>` +
      `<title>Olborg Logistics — ${isDE ? "Container (DE)" : "Kontenery (PL)"}</title>` +
      `<link>${esc(origin)}</link>` +
      `<description>${isDE ? "Seecontainer neu und gebraucht" : "Kontenery morskie nowe i używane"}</description>` +
      itemsXml.join("") +
      `</channel></rss>`;

    return new Response(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}