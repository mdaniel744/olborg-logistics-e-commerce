import { isSupabaseConfigured, supabase, STORE_ID } from "@/lib/supabaseClient";
import { fetchMarketPrices } from "@/lib/marketPricing";
import { PRODUCTS as DEMO_PRODUCTS } from "@/data/catalog";

// Each products row is its own independently-crawlable page (Google Merchant requires a
// unique landing page per listing) — siblings sharing family_id are condition variants,
// not sub-rows of one page. attributes->>'Stan' ("Nowy"/"Używany") is the picker's source
// of truth; the `condition` column stays English for Merchant/schema.org output only.
const STAN_TO_CONDITION = { Nowy: "new", Używany: "used" };
const CONDITION_SUFFIX = /\s*[–-]\s*(Nowy|Używany|Neu|Gebraucht)\s*$/i;

const COLOR_REFERENCES = [
  { key: "ral_1007", ral: "RAL 1007", hex: "#E18A00", label_pl: "Żółty narcyzowy", label_de: "Narzissengelb" },
  { key: "ral_2004", ral: "RAL 2004", hex: "#E25303", label_pl: "Pomarańczowy czysty", label_de: "Reinorange" },
  { key: "ral_3009", ral: "RAL 3009", hex: "#6F352B", label_pl: "Czerwony tlenkowy", label_de: "Oxidrot" },
  { key: "ral_5010", ral: "RAL 5010", hex: "#0E4C86", label_pl: "Niebieski gencjanowy", label_de: "Enzianblau" },
  { key: "ral_5013", ral: "RAL 5013", hex: "#1E2D44", label_pl: "Niebieski kobaltowy", label_de: "Kobaltblau" },
  { key: "ral_6005", ral: "RAL 6005", hex: "#47744C", label_pl: "Zielony mchowy", label_de: "Moosgrün" },
  { key: "ral_7016", ral: "RAL 7016", hex: "#383E42", label_pl: "Szary antracytowy", label_de: "Anthrazitgrau" },
  { key: "ral_7035", ral: "RAL 7035", hex: "#CBD0D2", label_pl: "Jasnoszary", label_de: "Lichtgrau" },
  { key: "ral_8004", ral: "RAL 8004", hex: "#8D4931", label_pl: "Brąz miedziany", label_de: "Kupferbraun" },
  { key: "ral_9002", ral: "RAL 9002", hex: "#D7D5CB", label_pl: "Białoszary", label_de: "Grauweiß" },
  { key: "ral_9005", ral: "RAL 9005", hex: "#0A0A0D", label_pl: "Czarny głęboki", label_de: "Tiefschwarz" },
  { key: "ral_9010", ral: "RAL 9010", hex: "#F1ECE1", label_pl: "Biały czysty", label_de: "Reinweiß" },
];

const COLOR_KEYWORDS = [
  { pattern: /blue|blau|niebiesk/i, hex: "#0E4C86" },
  { pattern: /red|rot|czerwon/i, hex: "#8B3A32" },
  { pattern: /green|grün|zielon/i, hex: "#47744C" },
  { pattern: /grey|gray|grau|szar/i, hex: "#6B7075" },
  { pattern: /white|weiß|weiss|biał/i, hex: "#F1ECE1" },
  { pattern: /black|schwarz|czarn/i, hex: "#0A0A0D" },
  { pattern: /orange|pomarańcz/i, hex: "#E25303" },
  { pattern: /yellow|gelb|żół/i, hex: "#E1A100" },
  { pattern: /brown|braun|brąz/i, hex: "#8D4931" },
];

function attributeValue(attributes, keys) {
  if (!attributes || typeof attributes !== "object" || Array.isArray(attributes)) return null;
  const wanted = new Set(keys.map((key) => key.toLowerCase()));
  const match = Object.entries(attributes).find(([key]) => wanted.has(key.toLowerCase()));
  return match?.[1] ?? null;
}

function parseTranslatedAttributes(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function scalarColorValue(value) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value).trim();
  if (typeof value === "object") {
    return String(value.value || value.name || value.label || value.ral || "").trim();
  }
  return "";
}

function normalizeHex(value) {
  const match = String(value || "").match(/#([0-9a-f]{6}|[0-9a-f]{3})\b/i);
  if (!match) return null;
  const raw = match[1];
  return `#${raw.length === 3 ? raw.split("").map((part) => part + part).join("") : raw}`.toUpperCase();
}

function textColor(hex) {
  const value = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16));
  return r * 0.299 + g * 0.587 + b * 0.114 > 170 ? "#1A1C1E" : "#FFFFFF";
}

function colorKey(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function normalizeColor(attributes, translatedAttributes) {
  const keys = ["Kolor", "RAL Kolor", "Farbe", "RAL Farbe", "Color", "Colour"];
  const raw = attributeValue(attributes, keys);
  const translatedRaw = attributeValue(parseTranslatedAttributes(translatedAttributes), keys);
  const rawLabel = scalarColorValue(raw);
  if (!rawLabel) return {};

  const translatedLabel = scalarColorValue(translatedRaw);
  const ralMatch = rawLabel.match(/RAL\s*([0-9]{4})/i);
  const reference = ralMatch
    ? COLOR_REFERENCES.find((entry) => entry.ral.endsWith(ralMatch[1]))
    : null;
  const explicitHex = normalizeHex(
    typeof raw === "object" ? raw.hex || raw.color || raw.swatch : rawLabel
  );
  const keywordHex = COLOR_KEYWORDS.find((entry) => entry.pattern.test(rawLabel))?.hex;
  const hex = explicitHex || reference?.hex || keywordHex || "#6B7075";
  const ral = reference?.ral || (ralMatch ? `RAL ${ralMatch[1]}` : "");

  return {
    color: reference?.key || colorKey(rawLabel),
    color_hex: hex,
    color_text: textColor(hex),
    color_ral: ral,
    color_label_pl: reference?.label_pl || rawLabel,
    color_label_de: reference?.label_de || translatedLabel || rawLabel,
  };
}

const DEMO_NEW_COLORS = {
  "container-10-standard": "RAL 7016",
  "container-20-standard": "RAL 5010",
  "container-40-standard": "RAL 7035",
  "container-40-high-cube": "RAL 6005",
  "container-20-open-side": "RAL 5010",
};

function demoProductRows() {
  return DEMO_PRODUCTS.flatMap((product) =>
    (product.variants || [])
      .filter((variant) => variant.active !== false)
      .map((variant, index) => {
        const isUsed = variant.condition === "used";
        const conditionPl = isUsed ? "Używany" : "Nowy";
        const conditionDe = isUsed ? "Gebraucht" : "Neu";
        const color = normalizeColor(
          { Kolor: isUsed ? "RAL 3009" : DEMO_NEW_COLORS[product.id] || "RAL 5010" },
          null
        );

        return {
          id: `demo-${variant.sku.toLowerCase()}`,
          family_id: product.id,
          sku: variant.sku,
          condition: variant.condition,
          slug_pl: isUsed ? `${product.slug_pl}-uzywany` : product.slug_pl,
          slug_de: isUsed ? `${product.slug_de}-gebraucht` : product.slug_de,
          name_pl: `${product.name_pl} – ${conditionPl}`,
          name_de: `${product.name_de} – ${conditionDe}`,
          short_description_pl: product.short_description_pl,
          short_description_de: product.short_description_de,
          description_pl: product.description_pl,
          description_de: product.description_de,
          price_pln_net: variant.price_pln_net,
          price_eur_net: variant.price_eur_net,
          availability: variant.availability,
          active: true,
          status: "active",
          merchant_eligible: false,
          featured: product.featured,
          featured_image: variant.image || product.featured_image,
          gallery: product.gallery || [],
          specs: product.specs || [],
          sort_order: (product.sort_order || 0) + index,
          created_date: null,
          size: product.size,
          container_type: product.container_type,
          is_demo: true,
          ...color,
        };
      })
  );
}

// Typ values are brand terminology used verbatim in PL/DE copy ("... High Cube", "... Open
// Side"), so normalize generically (lowercase, spaces -> underscores) rather than mapping a
// fixed list — matches the app's existing standard/high_cube/open_side enum without needing
// Ecom King to confirm exact casing for every value up front.
function normalizeTyp(value) {
  if (!value) return undefined;
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

async function fetchTranslations(productIds) {
  if (!isSupabaseConfigured || !supabase || productIds.length === 0) return [];
  const { data, error } = await supabase
    .from("translations")
    .select("entity_id,field_name,value")
    .eq("store_id", STORE_ID)
    .eq("entity_type", "product")
    .eq("locale", "de")
    .in("entity_id", productIds);
  if (error) {
    console.error("Failed to load product translations", error);
    return [];
  }
  return data;
}

function normalize(row, translationsByEntity) {
  const de = translationsByEntity.get(row.id) || {};
  const condition = row.condition || STAN_TO_CONDITION[row.attributes?.Stan] || null;
  const color = normalizeColor(row.attributes, de.attributes);
  const availability =
    row.stock_quantity > 0 ? "in_stock" : row.status === "active" ? "on_request" : "out_of_stock";
  return {
    id: row.id,
    family_id: row.family_id || row.id,
    sku: row.sku,
    condition,
    slug_pl: row.slug,
    slug_de: de.slug || row.slug,
    name_pl: row.name,
    name_de: de.name || row.name,
    short_description_pl: row.short_description,
    short_description_de: de.short_description || row.short_description,
    description_pl: row.description,
    description_de: de.description || row.description,
    // Single price + currency per row by design (Ecom King: dual-currency deferred, not a
    // gap) — EUR-market visitors correctly fall through to "on request" rather than a
    // guessed conversion when a row is priced in PLN only.
    price_pln_net: row.currency === "PLN" ? row.price : null,
    price_eur_net: row.currency === "EUR" ? row.price : null,
    availability,
    active: row.status === "active",
    status: row.status,
    merchant_eligible: Boolean(row.google_product_category),
    featured: Boolean(row.is_featured),
    featured_image: row.images?.[0] || null,
    gallery: (row.images || []).slice(1),
    sort_order: row.display_order ?? 0,
    created_date: row.created_at,
    size: row.attributes?.Rozmiar || undefined,
    container_type: normalizeTyp(row.attributes?.Typ),
    ...color,
  };
}

// Flat list — one entry per real, independently-routable product row.
export async function getProducts() {
  const demoEnabled =
    process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_USE_DEMO_PRODUCTS === "true";
  if (!isSupabaseConfigured || !supabase) return demoEnabled ? demoProductRows() : [];

  const { data: rows, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", STORE_ID)
    .eq("status", "active");

  if (error) {
    console.error("Failed to load products from Supabase", error);
    return demoEnabled ? demoProductRows() : [];
  }
  if (!rows || rows.length === 0) return demoEnabled ? demoProductRows() : [];

  const translations = await fetchTranslations(rows.map((r) => r.id));
  const translationsByEntity = new Map();
  for (const t of translations) {
    if (!translationsByEntity.has(t.entity_id)) translationsByEntity.set(t.entity_id, {});
    translationsByEntity.get(t.entity_id)[t.field_name] = t.value;
  }

  const products = rows.map((row) => normalize(row, translationsByEntity));

  // Overlay live per-market net prices (VAT-aware, ECB-converted) so a row priced in only
  // one currency still gets a real price in the other market, instead of permanently
  // falling back to "on request". Fetched for both markets unconditionally since this list
  // feeds server routes (order validation, merchant feed) that don't have a single "current
  // locale" to key off. Failure here degrades to the static per-row price — never breaks
  // the page or blocks an order.
  const productIds = products.map((p) => p.id);
  const [plPrices, dePrices] = await Promise.all([
    fetchMarketPrices(STORE_ID, "pl", productIds),
    fetchMarketPrices(STORE_ID, "de", productIds),
  ]);
  for (const product of products) {
    const pl = plPrices.get(product.id);
    const de = dePrices.get(product.id);
    if (pl && pl.currency === "PLN") product.price_pln_net = pl.net;
    if (de && de.currency === "EUR") product.price_eur_net = de.net;
  }

  return products;
}

// Family-level cards for listing/grid pages (Shop, Home, ProductCard) — one card per
// family, "from X" price and condition badges derived across its sibling variants. The
// representative variant (preferring "new") supplies the card's shared display fields.
export function groupFamilies(products) {
  const families = new Map();
  for (const product of products) {
    const key = product.family_id;
    if (!families.has(key)) families.set(key, []);
    families.get(key).push(product);
  }

  return Array.from(families.values()).map((variants) => {
    const representative = variants.find((v) => v.condition === "new") || variants[0];
    return {
      id: representative.family_id,
      slug_pl: representative.slug_pl,
      slug_de: representative.slug_de,
      name_pl: representative.name_pl.replace(CONDITION_SUFFIX, "").trim(),
      name_de: representative.name_de.replace(CONDITION_SUFFIX, "").trim(),
      short_description_pl: representative.short_description_pl,
      short_description_de: representative.short_description_de,
      description_pl: representative.description_pl,
      description_de: representative.description_de,
      size: representative.size,
      container_type: representative.container_type,
      status: representative.status,
      featured: representative.featured,
      featured_image: representative.featured_image,
      gallery: representative.gallery,
      sort_order: representative.sort_order,
      created_date: representative.created_date,
      is_demo: representative.is_demo,
      variants,
    };
  });
}

export async function getProductFamilies() {
  return groupFamilies(await getProducts());
}
