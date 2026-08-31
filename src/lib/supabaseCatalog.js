import { supabase, STORE_ID } from "@/lib/supabaseClient";

// Each products row is its own independently-crawlable page (Google Merchant requires a
// unique landing page per listing) — siblings sharing family_id are condition variants,
// not sub-rows of one page. attributes->>'Stan' ("Nowy"/"Używany") is the picker's source
// of truth; the `condition` column stays English for Merchant/schema.org output only.
const STAN_TO_CONDITION = { Nowy: "new", Używany: "used" };
const CONDITION_SUFFIX = /\s*[–-]\s*(Nowy|Używany|Neu|Gebraucht)\s*$/i;

// Typ values are brand terminology used verbatim in PL/DE copy ("... High Cube", "... Open
// Side"), so normalize generically (lowercase, spaces -> underscores) rather than mapping a
// fixed list — matches the app's existing standard/high_cube/open_side enum without needing
// Ecom King to confirm exact casing for every value up front.
function normalizeTyp(value) {
  if (!value) return undefined;
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

async function fetchTranslations(productIds) {
  if (productIds.length === 0) return [];
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
  };
}

// Flat list — one entry per real, independently-routable product row.
export async function getProducts() {
  const { data: rows, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", STORE_ID)
    .eq("status", "active");

  if (error) {
    console.error("Failed to load products from Supabase", error);
    return [];
  }
  if (!rows || rows.length === 0) return [];

  const translations = await fetchTranslations(rows.map((r) => r.id));
  const translationsByEntity = new Map();
  for (const t of translations) {
    if (!translationsByEntity.has(t.entity_id)) translationsByEntity.set(t.entity_id, {});
    translationsByEntity.get(t.entity_id)[t.field_name] = t.value;
  }

  return rows.map((row) => normalize(row, translationsByEntity));
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
      variants,
    };
  });
}

export async function getProductFamilies() {
  return groupFamilies(await getProducts());
}
