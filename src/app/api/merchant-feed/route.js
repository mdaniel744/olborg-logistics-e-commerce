import { SITE_SETTINGS } from "@/data/catalog";
import { getProducts } from "@/lib/supabaseCatalog";
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

  const products = await getProducts();
  const items = products.flatMap((product) => {
    if (product.active === false || !product.merchant_eligible) return [];
    const net = isGerman ? product.price_eur_net : product.price_pln_net;
    const image = product.featured_image;
    if (typeof net !== "number" || !image) return [];
    const condition = product.condition === "new" ? "new" : "used";
    const localizedCondition =
      product.condition === "new" ? (isGerman ? "Neu" : "Nowy") : isGerman ? "Gebraucht" : "Używany";
    const localizedColor = isGerman ? product.color_label_de : product.color_label_pl;
    const colorWithRal = [localizedColor, product.color_ral].filter(Boolean).join(" ");
    const slug = isGerman ? product.slug_de : product.slug_pl;
    const link = `${url.origin}${isGerman ? "/de" : ""}/${slug}`;
    const description = isGerman ? product.short_description_de : product.short_description_pl;
    const name = isGerman ? product.name_de : product.name_pl;
    const availability =
      product.availability === "in_stock"
        ? "in_stock"
        : product.availability === "on_request"
          ? "backorder"
          : "out_of_stock";
    const absoluteImage = new URL(image, url.origin).toString();

    return [
      `<item>` +
        `<g:id>${escapeXml(product.sku)}</g:id>` +
        `<g:item_group_id>${escapeXml(product.family_id)}</g:item_group_id>` +
        `<g:title>${escapeXml([name, localizedCondition, colorWithRal].filter(Boolean).join(" — "))}</g:title>` +
        `<g:description>${escapeXml(description)}</g:description>` +
        `<g:link>${escapeXml(link)}</g:link>` +
        `<g:image_link>${escapeXml(absoluteImage)}</g:image_link>` +
        `<g:price>${grossFromNet(net, treatment.rate).toFixed(2)} ${isGerman ? "EUR" : "PLN"}</g:price>` +
        `<g:availability>${availability}</g:availability>` +
        `<g:condition>${condition}</g:condition>` +
        (colorWithRal ? `<g:color>${escapeXml(colorWithRal)}</g:color>` : "") +
        `<g:brand>Olborg Logistics</g:brand>` +
        `<g:identifier_exists>no</g:identifier_exists>` +
        `<g:size>${escapeXml(product.size)}</g:size>` +
        `</item>`,
    ];
  });

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
