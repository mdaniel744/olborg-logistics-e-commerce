import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, PackageCheck, FileText, ShoppingCart, MapPin, Calculator, CheckCircle2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { useProducts } from "@/lib/useSettings";
import { pathFor, CATEGORY_LANDINGS } from "@/lib/routes";
import { IMAGES } from "@/lib/images";
import ProductCard from "@/components/store/ProductCard";
import DeliveryCalculator from "@/components/store/DeliveryCalculator";

export default function Home() {
  const { lang, t } = useLang();
  const { products } = useProducts();
  usePageMeta(
    lang === "de" ? "Seecontainer kaufen — neu & gebraucht" : "Kontenery morskie na sprzedaż — nowe i używane",
    t("hero.sub")
  );

  const featured = products.filter((p) => p.featured).slice(0, 8);
  const sizeCards = [
    { size: "10ft", img: IMAGES.container10ft, landing: CATEGORY_LANDINGS[0] },
    { size: "20ft", img: IMAGES.container20ft, landing: CATEGORY_LANDINGS[1] },
    { size: "40ft", img: IMAGES.container40ft, landing: CATEGORY_LANDINGS[2] },
  ];
  const typeCards = [
    { key: "standard", img: IMAGES.container20ft, to: pathFor("shop", lang) + "?typ=standard", desc: t("home.standardD") },
    { key: "high_cube", img: IMAGES.highCube, to: CATEGORY_LANDINGS[3][lang], desc: t("home.highCubeD") },
    { key: "open_side", img: IMAGES.openSide, to: CATEGORY_LANDINGS[4][lang], desc: t("home.openSideD") },
  ];
  const whyItems = [
    { icon: FileText, title: t("home.why1"), desc: t("home.why1d") },
    { icon: PackageCheck, title: t("home.why2"), desc: t("home.why2d") },
    { icon: Truck, title: t("home.why3"), desc: t("home.why3d") },
    { icon: ShoppingCart, title: t("home.why4"), desc: t("home.why4d") },
    { icon: FileText, title: t("home.why5"), desc: t("home.why5d") },
  ];
  const steps = [t("home.how1"), t("home.how2"), t("home.how3"), t("home.how4"), t("home.how5"), t("home.how6"), t("home.how7")];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#1A1C1E]">
        <div className="absolute inset-0">
          <Image src={IMAGES.hero} alt={t("hero.h1")} className="w-full h-full object-cover opacity-60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.3em] text-[#F5A623] uppercase mb-4">PL · DE — 10ft / 20ft / 40ft</p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              {t("hero.h1")}
            </h1>
            <p className="mt-5 text-white/80 text-lg leading-relaxed">{t("hero.sub")}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-[#F5A623] hover:bg-[#DB930D] text-[#1A1C1E] rounded-none font-semibold text-base h-12 px-8">
                <Link to={pathFor("shop", lang)}>{t("hero.ctaPrimary")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-none border-white/40 bg-transparent text-white hover:bg-white hover:text-[#1A1C1E] font-semibold text-base h-12 px-8">
                <Link to={pathFor("quote", lang)}>{t("hero.ctaSecondary")}</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="h-1 bg-[#F5A623]" aria-hidden="true" />
      </section>

      {/* Shop by size */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#1A1C1E] mb-8">{t("home.bySizeTitle")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {sizeCards.map((c) => (
            <Link key={c.size} to={c.landing[lang]} className="group relative aspect-[4/3] overflow-hidden bg-[#E0E2E5] border border-[#E0E2E5] hover:border-[#1A1C1E] transition-colors">
              <Image src={c.img} alt={`${c.size} container`} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C1E]/70 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 flex items-center justify-between">
                <span className="font-heading text-3xl font-bold text-white">{c.size}</span>
                <ArrowRight className="w-5 h-5 text-[#F5A623] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop by type */}
      <section className="bg-white border-y border-[#E0E2E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#1A1C1E] mb-8">{t("home.byTypeTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {typeCards.map((c) => (
              <Link key={c.key} to={c.to} className="group border border-[#E0E2E5] hover:border-[#1A1C1E] transition-colors bg-[#F8F9FA]">
                <div className="aspect-[16/9] overflow-hidden bg-[#E0E2E5]">
                  <Image src={c.img} alt={t(`common.${c.key}`)} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-[#1A1C1E]">{t(`common.${c.key}`)}</h3>
                  <p className="text-sm text-[#6B7075] mt-1">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#1A1C1E]">{t("home.featuredTitle")}</h2>
            <Link to={pathFor("shop", lang)} className="font-mono text-sm text-[#A9700A] hover:underline shrink-0">
              {t("nav.allContainers")} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Why us */}
      <section className="bg-[#1A1C1E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-10">{t("home.whyTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {whyItems.map((item, i) => (
              <div key={i}>
                <item.icon className="w-6 h-6 text-[#F5A623] mb-3" />
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-sm text-white/60 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-[#A9700A] uppercase mb-3">
              <MapPin className="w-4 h-4 inline mr-1" /> PL → DE
            </p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#1A1C1E]">{t("home.deliveryTitle")}</h2>
            <p className="mt-4 text-[#3A3E42] leading-relaxed">{t("home.deliveryText")}</p>
            <Button asChild className="mt-6 bg-[#1A1C1E] hover:bg-black rounded-none font-semibold">
              <Link to={pathFor("delivery", lang)}>
                <Calculator className="w-4 h-4 mr-2" />
                {t("home.deliveryCta")}
              </Link>
            </Button>
          </div>
          <DeliveryCalculator />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t border-[#E0E2E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#1A1C1E] mb-10">{t("home.howTitle")}</h2>
          <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
            {steps.map((step, i) => (
              <li key={i} className="relative">
                <span className="font-mono text-xs text-[#A9700A] font-bold">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm font-medium text-[#1A1C1E] mt-1.5 leading-snug">{step}</p>
                {i < steps.length - 1 && <div className="hidden lg:block absolute top-2 -right-3 w-2 h-px bg-[#E0E2E5]" />}
              </li>
            ))}
          </ol>
          <div className="mt-10 flex items-center gap-2 text-sm text-[#6B7075]">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            {lang === "de"
              ? "Direktbestellung oder unverbindliche Angebotsanfrage — Sie entscheiden."
              : "Zamówienie bezpośrednie lub niewiążące zapytanie o wycenę — Ty decydujesz."}
          </div>
        </div>
      </section>
    </div>
  );
}