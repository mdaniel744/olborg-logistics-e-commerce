import { productPath } from "./routes.js";
import { plainText } from "./merchantFeed.js";

export function productStructuredData(product, { lang, origin, grossPrice, purchasable = false }) {
  if (!origin || product.is_demo || product.active === false) return null;
  const url = new URL(productPath(product, lang), origin).href;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    url,
    name: product[`name_${lang}`],
    description: plainText(product[`description_${lang}`] || product[`short_description_${lang}`]),
    ...(product.sku ? { sku: product.sku } : {}),
    image: [product.featured_image, ...(product.gallery || [])].filter(Boolean).flatMap((src) => {
      try {
        const image = new URL(src, origin);
        return ["https:", "http:"].includes(image.protocol) ? [image.href] : [];
      } catch { return []; }
    }),
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    ...(product.mpn ? { mpn: product.mpn } : {}),
    ...(product.color_ral ? { color: product.color_ral } : {}),
  };
  const condition = { new: "NewCondition", used: "UsedCondition", refurbished: "RefurbishedCondition" }[product.condition];
  if (purchasable && Number.isFinite(grossPrice) && grossPrice > 0 && condition && ["in_stock", "out_of_stock"].includes(product.availability)) {
    data.offers = {
      "@type": "Offer", url, priceCurrency: lang === "de" ? "EUR" : "PLN", price: grossPrice.toFixed(2),
      itemCondition: `https://schema.org/${condition}`,
      availability: `https://schema.org/${product.availability === "in_stock" ? "InStock" : "OutOfStock"}`,
    };
  }
  return data;
}
