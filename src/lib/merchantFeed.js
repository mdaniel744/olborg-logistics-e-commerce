import { productPath } from "./routes.js";

export const plainText = (value) => String(value || "")
  .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
  .replace(/<[^>]*>/g, " ")
  .replace(/&(nbsp|amp|lt|gt|quot|apos);/g, (_, entity) =>
    ({ nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" })[entity])
  .replace(/\s+/g, " ").trim();

export const escapeXml = (value) => String(value ?? "")
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const tag = (key, value) => value ? `<g:${key}>${escapeXml(value)}</g:${key}>` : "";

function imageUrl(image, origin) {
  try {
    const url = new URL(image, origin);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

// Export only genuine, priced listings. A quotation is not a backorder.
export function merchantItem(product, { lang, origin, vatRate }) {
  const net = lang === "de" ? product.price_eur_net : product.price_pln_net;
  const id = product.sku || product.id;
  const name = plainText(product[`name_${lang}`]);
  const description = plainText(product[`short_description_${lang}`] || product[`description_${lang}`]);
  const image = product.featured_image && imageUrl(product.featured_image, origin);
  if (product.is_demo || product.active === false || !product.merchant_eligible ||
      !["in_stock", "out_of_stock"].includes(product.availability) ||
      !["new", "used", "refurbished"].includes(product.condition) ||
      !Number.isFinite(net) || net <= 0 || !Number.isFinite(vatRate) ||
      !id || !name || !description || !image || !product[`slug_${lang}`] ||
      product.merchant_languages?.[lang] === false) return null;

  const color = [...new Set([product[`color_label_${lang}`], product.color_ral].filter(Boolean))].join(" ");
  const condition = product.condition === "new" ? (lang === "de" ? "Neu" : "Nowy")
    : product.condition === "used" ? (lang === "de" ? "Gebraucht" : "Używany")
      : (lang === "de" ? "Generalüberholt" : "Odnowiony");
  const title = [name, name.toLowerCase().includes(condition.toLowerCase()) ? null : condition, color].filter(Boolean).join(" — ");
  const gtin = /^\d{8}$|^\d{12,14}$/.test(String(product.gtin || "")) ? product.gtin : null;
  const identifiersAbsent = product.identifier_exists === false && !gtin && !product.mpn && !product.brand;

  return {
    id,
    xml: "<item>" +
      tag("id", id) + tag("title", title.slice(0, 150)) + tag("description", description.slice(0, 5000)) +
      tag("link", new URL(productPath(product, lang), origin).href) + tag("image_link", image) +
      tag("price", `${(Math.round(net * (1 + vatRate / 100) * 100) / 100).toFixed(2)} ${lang === "de" ? "EUR" : "PLN"}`) +
      tag("availability", product.availability) + tag("condition", product.condition) +
      tag("color", color) + tag("size", product.size) +
      tag("brand", product.brand) + tag("gtin", gtin) + tag("mpn", product.mpn) +
      tag("identifier_exists", identifiersAbsent ? "no" : null) +
      tag("google_product_category", product.google_product_category) + "</item>",
  };
}

export function renderMerchantFeed(products, options) {
  const seen = new Set();
  const items = products.flatMap((product) => {
    const item = merchantItem(product, options);
    if (!item || seen.has(item.id)) return [];
    seen.add(item.id);
    return [item.xml];
  });
  return '<?xml version="1.0" encoding="UTF-8"?>' +
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>' +
    `<title>Olborg Logistics — ${options.lang === "de" ? "Container (DE)" : "Kontenery (PL)"}</title>` +
    `<link>${escapeXml(options.origin)}</link><description>${options.lang === "de" ? "Neue und gebrauchte Seecontainer" : "Nowe i używane kontenery morskie"}</description>` +
    items.join("") + "</channel></rss>";
}
