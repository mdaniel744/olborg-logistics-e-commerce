import { notFound, redirect } from "next/navigation";
import CategoryLanding from "@/components/store/CategoryLanding";
import { PRODUCTS } from "@/data/catalog";
import { CATEGORY_LANDINGS } from "@/lib/routes";
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

const staticRoutes = {
  de: { component: Home, title: "Seecontainer kaufen" },
  kontenery: { component: Shop, title: "Kontenery na sprzedaż" },
  "de/container": { component: Shop, title: "Container kaufen" },
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

function resolveRoute(segments) {
  const path = segments.join("/");
  if (redirectRoutes[path]) return { type: "redirect", destination: redirectRoutes[path] };
  if (staticRoutes[path]) return { type: "static", ...staticRoutes[path] };
  if (policyRoutes[path]) return { type: "policy", policyKey: policyRoutes[path] };

  const landing = CATEGORY_LANDINGS.find(
    (entry) => entry.pl.slice(1) === path || entry.de.slice(1) === path
  );
  if (landing) return { type: "landing", landing };

  if (segments.length === 2 && ["poradnik", "ratgeber"].includes(segments[0])) {
    return { type: "guide", slug: segments[1] };
  }
  if (segments.length === 3 && segments[0] === "de" && segments[1] === "ratgeber") {
    return { type: "guide", slug: segments[2] };
  }

  const language = segments[0] === "de" ? "de" : "pl";
  const slug = language === "de" ? segments[1] : segments[0];
  const slugKey = language === "de" ? "slug_de" : "slug_pl";
  if (slug && PRODUCTS.some((product) => product[slugKey] === slug)) {
    return { type: "product", slug, language };
  }

  return null;
}

export async function generateMetadata({ params }) {
  const { segments = [] } = await params;
  const route = resolveRoute(segments);
  if (!route) return {};
  if (route.type === "product") {
    const product = PRODUCTS.find((entry) => entry[`slug_${route.language}`] === route.slug);
    return {
      title: route.language === "de" ? product.name_de : product.name_pl,
      description:
        route.language === "de" ? product.short_description_de : product.short_description_pl,
    };
  }
  return { title: route.title || "Olborg Logistics" };
}

export default async function StoreRoute({ params }) {
  const { segments = [] } = await params;
  const route = resolveRoute(segments);
  if (!route) notFound();

  if (route.type === "redirect") redirect(route.destination);

  if (route.type === "static") {
    const Component = route.component;
    return <Component />;
  }
  if (route.type === "policy") return <PolicyPage policyKey={route.policyKey} />;
  if (route.type === "landing") return <CategoryLanding landing={route.landing} />;
  if (route.type === "guide") return <GuideDetail slug={route.slug} />;
  if (route.type === "product") return <ProductDetail slug={route.slug} />;
  notFound();
}
