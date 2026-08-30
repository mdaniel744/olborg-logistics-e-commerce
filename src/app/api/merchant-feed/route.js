import { PRODUCTS, SITE_SETTINGS } from "@/data/catalog";
import { computeVatTreatment, grossFromNet } from "@/server/pricing";

const escapeXml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function GET(request) {
  const url = new URL(request.url);
  const isGerman = (url.searchParams.get("market") || "pl").toLowerCase() === "de";
  const market = isGerman ? "DE" : "PL";
  const treatment = computeVatTreatment(SITE_SETTINGS, {
    market,
    customerType: "private",
    vatValid: false,
    deliveryCountry: market,
  });

  const items = PRODUCTS.flatMap((product) =>
    (product.variants || []).flatMap((variant) => {
      if (variant.active === false || !variant.merchant_eligible) return [];
      const net = isGerman ? variant.price_eur_net : variant.price_pln_net;
      const image = variant.image || product.featured_image;
      if (typeof net !== "number" || !image) return [];
      const condition = variant.condition === "new" ? "new" : "used";
      const localizedCondition =
        variant.condition === "new" ? (isGerman ? "Neu" : "Nowy") : isGerman ? "Gebraucht" : "Używany";
      const slug = isGerman ? product.slug_de : product.slug_pl;
      const query = isGerman
        ? `?zustand=${condition === "new" ? "neu" : "gebraucht"}`
        : `?stan=${condition === "new" ? "nowy" : "uzywany"}`;
      const link = `${url.origin}${isGerman ? "/de" : ""}/${slug}${query}`;
      const description = isGerman ? product.short_description_de : product.short_description_pl;
      const name = isGerman ? product.name_de : product.name_pl;
      const availability =
        variant.availability === "in_stock"
          ? "in_stock"
          : variant.availability === "on_request"
            ? "backorder"
            : "out_of_stock";
      const absoluteImage = new URL(image, url.origin).toString();

      return [
        `<item>` +
          `<g:id>${escapeXml(variant.sku)}</g:id>` +
          `<g:item_group_id>${escapeXml(product.id)}</g:item_group_id>` +
          `<g:title>${escapeXml(`${name} — ${localizedCondition}`)}</g:title>` +
          `<g:description>${escapeXml(description)}</g:description>` +
          `<g:link>${escapeXml(link)}</g:link>` +
          `<g:image_link>${escapeXml(absoluteImage)}</g:image_link>` +
          `<g:price>${grossFromNet(net, treatment.rate).toFixed(2)} ${isGerman ? "EUR" : "PLN"}</g:price>` +
          `<g:availability>${availability}</g:availability>` +
          `<g:condition>${condition}</g:condition>` +
          `<g:brand>Olborg Logistics</g:brand>` +
          `<g:identifier_exists>no</g:identifier_exists>` +
          `<g:size>${escapeXml(product.size)}</g:size>` +
          `</item>`,
      ];
    })
  );

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>` +
    `<title>Olborg Logistics — ${isGerman ? "Container (DE)" : "Kontenery (PL)"}</title>` +
    `<link>${escapeXml(url.origin)}</link>` +
    `<description>${isGerman ? "Seecontainer neu und gebraucht" : "Kontenery morskie nowe i używane"}</description>` +
    items.join("") +
    `</channel></rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
