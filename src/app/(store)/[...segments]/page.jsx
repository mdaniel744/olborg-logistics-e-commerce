import { cache } from "react";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import CategoryLanding from "@/components/store/CategoryLanding";
import { getProducts } from "@/lib/supabaseCatalog";
import { CATEGORY_LANDINGS, productPath, productRouteSegment } from "@/lib/routes";
import { getCategoryContent } from "@/data/categoryContent";
import { GUIDES } from "@/i18n/guides";
import { publicPageMetadata } from "@/lib/pageMetadata";
import { plainText } from "@/lib/merchantFeed";
import AboutPage from "@/features/storefront/AboutPage";
import CartPage from "@/features/storefront/CartPage";
import Checkout from "@/features/storefront/Checkout";
import ContactPage from "@/features/storefront/ContactPage";
import DeliveryPage from "@/features/storefront/DeliveryPage";
import FaqPage from "@/features/storefront/FaqPage";
import GuideDetail from "@/features/storefront/GuideDetail";
import GuidesPage from "@/features/storefront/GuidesPage";
import Home from "@/features/storefront/Home";
import OrderConfirmation from "@/features/storefront/OrderConfirmation";
import PolicyPage from "@/features/storefront/PolicyPage";
import ProductDetail from "@/features/storefront/ProductDetail";
import QuotePage from "@/features/storefront/QuotePage";
import Shop from "@/features/storefront/Shop";

// Dedupe the catalogue across metadata and rendering during the same server request.
const getCachedProducts = cache(getProducts);

const staticRoutes = {
  de: { component: Home, title: "Seecontainer kaufen" },
  kontenery: { component: Shop, title: "Kontenery na sprzedaż", description: "Nowe i używane kontenery 10, 20 i 40 stóp — Standard, High Cube i Open Side, z dostawą w Polsce i Niemczech." },
  "de/container": { component: Shop, title: "Container kaufen", description: "Neue und gebrauchte Container in 10, 20 und 40 Fuß — Standard, High Cube und Open Side, mit Lieferung in Polen und Deutschland." },
  dostawa: { component: DeliveryPage, title: "Dostawa kontenerów" },
  "de/lieferung": { component: DeliveryPage, title: "Container-Lieferung" },
  poradnik: { component: GuidesPage, title: "Poradnik kontenerowy" },
  "de/ratgeber": { component: GuidesPage, title: "Container-Ratgeber" },
  "o-nas": { component: AboutPage, title: "O nas" },
  "de/ueber-uns": { component: AboutPage, title: "Über uns" },
  faq: { component: FaqPage, title: "FAQ" },
  "de/faq": { component: FaqPage, title: "FAQ" },
  kontakt: { component: ContactPage, title: "Kontakt" },
  "de/kontakt": { component: ContactPage, title: "Kontakt" },
  koszyk: { component: CartPage, title: "Koszyk" },
  "de/warenkorb": { component: CartPage, title: "Warenkorb" },
  zamowienie: { component: Checkout, title: "Zamówienie" },
  "de/kasse": { component: Checkout, title: "Kasse" },
  potwierdzenie: { component: OrderConfirmation, title: "Potwierdzenie zamówienia" },
  "de/bestellbestaetigung": { component: OrderConfirmation, title: "Bestellbestätigung" },
  wycena: { component: QuotePage, title: "Poproś o wycenę" },
  "de/angebot": { component: QuotePage, title: "Angebot anfragen" },
};

const policyRoutes = {
  "dane-prawne": "imprint",
  "de/impressum": "imprint",
  regulamin: "terms",
  "de/agb": "terms",
  zwroty: "returns",
  "de/rueckgabe": "returns",
  "odstapienie-od-umowy": "withdrawal",
  "de/widerruf": "withdrawal",
  "polityka-prywatnosci": "privacy",
  "de/datenschutz": "privacy",
  "polityka-cookies": "cookies",
  "de/cookie-richtlinie": "cookies",
};

const redirectRoutes = {
  "dostawa-i-transport": "/dostawa#versand-und-lieferung",
  "de/versand-und-lieferung": "/de/lieferung#versand-und-lieferung",
  reklamacje: "/zwroty#reklamationen",
  "de/reklamationen": "/de/rueckgabe#reklamationen",
};

function resolveRoute(segments, products) {
  const path = segments.join("/");
  if (redirectRoutes[path]) return { type: "redirect", destination: redirectRoutes[path] };
  if (staticRoutes[path]) return { type: "static", ...staticRoutes[path] };
  if (policyRoutes[path]) return { type: "policy", policyKey: policyRoutes[path] };

  const landing = CATEGORY_LANDINGS.find(
    (entry) => entry.pl.slice(1) === path || entry.de.slice(1) === path
  );
  if (landing) return { type: "landing", landing };

  if (segments.length === 2 && segments[0] === "poradnik" && GUIDES.some((g) => g.slug === segments[1])) {
    return { type: "guide", slug: segments[1] };
  }
  if (segments.length === 3 && segments[0] === "de" && segments[1] === "ratgeber" && GUIDES.some((g) => g.slug_de === segments[2])) {
    return { type: "guide", slug: segments[2] };
  }

  const language = segments[0] === "de" ? "de" : "pl";
  const localizedProductSegment = productRouteSegment(language);
  const hasProductPrefix =
    language === "de"
      ? segments.length === 3 && segments[1] === localizedProductSegment
      : segments.length === 2 && segments[0] === localizedProductSegment;
  const slug = hasProductPrefix
    ? segments[language === "de" ? 2 : 1]
    : null;
  const slugKey = language === "de" ? "slug_de" : "slug_pl";
  if (slug && products.some((product) => product[slugKey] === slug)) {
    return { type: "product", slug, language };
  }

  // Preserve links already indexed or shared before the product namespace was
  // introduced. These routes are upgraded with an SEO-safe permanent redirect.
  const legacySlug =
    language === "de" && segments.length === 2
      ? segments[1]
      : language === "pl" && segments.length === 1
        ? segments[0]
        : null;
  const legacyProduct = legacySlug
    ? products.find((product) => product[slugKey] === legacySlug)
    : null;
  if (legacyProduct) {
    return {
      type: "legacyProduct",
      destination: productPath(legacyProduct, language),
      product: legacyProduct,
      language,
    };
  }

  return null;
}

export async function generateMetadata({ params }) {
  const { segments = [] } = await params;
  const contentRoute = resolveRoute(segments, []);
  const products = contentRoute ? [] : await getCachedProducts();
  const route = contentRoute || resolveRoute(segments, products);
  if (!route) return {};
  if (route.type === "product" || route.type === "legacyProduct") {
    const product = route.product || products.find(
      (entry) => entry[`slug_${route.language}`] === route.slug
    );
    return {
      title: route.language === "de" ? product.name_de : product.name_pl,
      description: plainText(product[`short_description_${route.language}`] || product[`description_${route.language}`]).slice(0, 170),
      ...(product.is_demo || product.merchant_languages?.[route.language] === false
        ? { robots: { index: false, follow: true } } : {}),
      // ProductDetail renders canonical/hreflang in the initial HTML and keeps them
      // attached to local swatch state. Do not duplicate those links in metadata.
    };
  }
  if (route.type === "landing") {
    const language = segments[0] === "de" ? "de" : "pl";
    const content = getCategoryContent(route.landing.key, language);
    return {
      title: content?.title || "Olborg Logistics",
      description: content?.description,
      alternates: {
        canonical: route.landing[language],
        languages: { pl: route.landing.pl, de: route.landing.de },
      },
    };
  }
  const language = segments[0] === "de" ? "de" : "pl";
  if (route.type === "guide") {
    const guide = GUIDES.find((g) => (language === "de" ? g.slug_de : g.slug) === route.slug);
    const languages = { pl: `/poradnik/${guide.slug}`, de: `/de/ratgeber/${guide.slug_de}` };
    return {
      title: guide[`title_${language}`],
      description: plainText(guide[`body_${language}`]).replace(/[#*]/g, "").slice(0, 160),
      alternates: { canonical: languages[language], languages },
    };
  }
  return publicPageMetadata(`/${segments.join("/")}`, language) || {
    title: route.title || "Olborg Logistics", robots: { index: false, follow: true },
  };
}

export default async function StoreRoute({ params }) {
  const { segments = [] } = await params;
  const contentRoute = resolveRoute(segments, []);
  const products = contentRoute ? [] : await getCachedProducts();
  const route = contentRoute || resolveRoute(segments, products);
  if (!route) notFound();

  if (route.type === "redirect") redirect(route.destination);
  if (route.type === "legacyProduct") permanentRedirect(route.destination);

  if (route.type === "static") {
    const Component = route.component;
    return <Component />;
  }
  if (route.type === "policy") return <PolicyPage policyKey={route.policyKey} />;
  if (route.type === "landing") return <CategoryLanding landing={route.landing} />;
  if (route.type === "guide") return <GuideDetail slug={route.slug} />;
  if (route.type === "product") return <ProductDetail slug={route.slug} initialProducts={products} />;
  notFound();
}
