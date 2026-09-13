import { R, CATEGORY_LANDINGS, productLanguagePaths } from "@/lib/routes";
import { GUIDES } from "@/i18n/guides";
import { PUBLIC_PAGE_KEYS } from "@/lib/pageMetadata";
import { getProducts } from "@/lib/supabaseCatalog";
import { siteOrigin } from "@/lib/siteUrl";

export const revalidate = 3600;

export default async function sitemap() {
  if (!siteOrigin || process.env.NEXT_PUBLIC_USE_DEMO_PRODUCTS === "true") return [];
  const pairs = [
    ...PUBLIC_PAGE_KEYS.map((key) => R[key]),
    ...CATEGORY_LANDINGS,
    ...GUIDES.map((guide) => ({ pl: `/poradnik/${guide.slug}`, de: `/de/ratgeber/${guide.slug_de}` })),
    ...(await getProducts()).filter((p) => !p.is_demo && p.active !== false).map(productLanguagePaths),
  ];
  const seen = new Set();
  return pairs.flatMap((pair) => {
    const languages = Object.fromEntries(["pl", "de"].filter((lang) => pair[lang]).map((lang) => [lang, new URL(pair[lang], siteOrigin).href]));
    return Object.values(languages).flatMap((url) => {
      if (seen.has(url)) return [];
      seen.add(url);
      return [{ url, alternates: { languages } }];
    });
  });
}
