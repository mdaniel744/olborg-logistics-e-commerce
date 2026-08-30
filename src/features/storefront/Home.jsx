"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Calculator,
  CheckCircle2,
  FileText,
  PackageCheck,
  ShoppingCart,
  Truck,
  Warehouse,
  Wrench,
} from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { useProducts } from "@/lib/useSettings";
import { pathFor, CATEGORY_LANDINGS } from "@/lib/routes";
import { IMAGES } from "@/lib/images";
import ProductCard from "@/components/store/ProductCard";
import DeliveryCalculator from "@/components/store/DeliveryCalculator";
import CompanySection from "@/components/store/CompanySection";

export default function Home() {
  const { lang, t } = useLang();
  const { products } = useProducts();
  usePageMeta(
    lang === "de" ? "Seecontainer kaufen — neu & gebraucht" : "Kontenery morskie na sprzedaż — nowe i używane",
    t("hero.sub")
  );

  const featured = products.filter((p) => p.featured).slice(0, 8);
  const typeCards = [
    { key: "standard", img: "/images/filters/filter-container-20ft-branded.png", to: pathFor("shop", lang) + "?typ=standard", desc: t("home.standardD") },
    { key: "high_cube", img: "/images/filters/filter-container-high-cube-branded-v2.png", to: CATEGORY_LANDINGS[3][lang], desc: t("home.highCubeD") },
    { key: "open_side", img: "/images/filters/filter-container-open-side.png", to: CATEGORY_LANDINGS[4][lang], desc: t("home.openSideD") },
  ];
  const solutionItems = [
    { icon: Warehouse, title: t("home.solution1"), desc: t("home.solution1d") },
    { icon: Building2, title: t("home.solution2"), desc: t("home.solution2d") },
    { icon: Wrench, title: t("home.solution3"), desc: t("home.solution3d") },
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
      <section className="relative isolate min-h-[560px] overflow-hidden bg-[#1A1C1E] md:min-h-[620px] lg:min-h-[640px]">
        <div className="absolute inset-0">
          <Image
            src={IMAGES.hero}
            alt={t("hero.h1")}
            loading="eager"
            sizes="100vw"
            className="h-full w-full object-cover object-[68%_center]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#101214]/95 via-[#101214]/70 to-[#101214]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101214]/35 via-transparent to-transparent" />
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-20 sm:px-6 md:min-h-[620px] md:py-24 lg:min-h-[640px] lg:items-start lg:py-24 lg:pb-40">
          <div className="max-w-2xl lg:pt-8">
            <h1 className="font-heading text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.35rem]">
              {t("hero.h1")}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">{t("hero.sub")}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-[#F5A623] hover:bg-[#DB930D] text-[#1A1C1E] rounded-none font-semibold text-base h-12 px-8">
                <Link href={pathFor("shop", lang)}>{t("hero.ctaPrimary")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-none border-white/40 bg-transparent text-white hover:bg-white hover:text-[#1A1C1E] font-semibold text-base h-12 px-8">
                <Link href={pathFor("quote", lang)}>{t("hero.ctaSecondary")}</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="h-1 bg-[#F5A623]" aria-hidden="true" />
      </section>

      {/* Shop by type */}
      <section className="relative z-20 bg-white border-b border-[#E0E2E5] lg:-mt-20 lg:border-b-0 lg:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 lg:py-0 lg:pb-16">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {typeCards.map((c) => (
              <Link
                key={c.key}
                href={c.to}
                className="group relative flex min-h-[350px] flex-col overflow-hidden rounded-none bg-[#F4F5F6] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:bg-[#FFF8EA] hover:shadow-[0_14px_32px_rgba(26,28,30,0.08)] lg:min-h-[300px] lg:shadow-[0_16px_38px_rgba(26,28,30,0.12)]"
              >
                <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-white px-5 py-7 sm:min-h-[210px] lg:min-h-[185px] lg:px-4 lg:py-4">
                  <Image
                    src={c.img}
                    alt={t(`common.${c.key}`)}
                    width={520}
                    height={320}
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="h-auto max-h-[190px] w-full object-contain drop-shadow-[0_12px_12px_rgba(26,28,30,0.2)] transition-transform duration-500 group-hover:scale-[1.04] lg:max-h-[155px]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-heading text-lg font-bold text-[#1A1C1E]">{t(`common.${c.key}`)}</h3>
                    <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-[#A9700A] transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <p className="mt-2 text-[15px] leading-6 text-[#4B5157]">{c.desc}</p>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#F5A623] transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industrial applications */}
      <section className="bg-[#F8F9FA]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-8 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <div className="relative min-h-[340px] overflow-hidden rounded-2xl bg-[#D9DDE1] lg:min-h-[520px]">
            <Image
              src={IMAGES.used}
              alt={t("home.solutionsImageAlt")}
              className="h-full w-full object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C1E]/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#F5A623]">{t("home.solutionsImageLabel")}</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/80">{t("home.solutionsImageText")}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#A9700A]">{t("home.solutionsEyebrow")}</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#1A1C1E] md:text-4xl">{t("home.solutionsTitle")}</h2>
            <p className="mt-5 max-w-xl leading-7 text-[#3A3E42]">{t("home.solutionsText")}</p>

            <div className="mt-8 space-y-3">
              {solutionItems.map((item) => (
                <div key={item.title} className="flex gap-4 rounded-xl border border-[#D7DADF] bg-white p-4 sm:p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0D2] text-[#A9700A]">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-[#1A1C1E]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#5F656B]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href={pathFor("shop", lang)} className="mt-7 inline-flex items-center gap-2 self-start text-sm font-semibold text-[#8A5A05] hover:underline">
              {t("home.solutionsCta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Company */}
      <CompanySection />

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#1A1C1E]">{t("home.featuredTitle")}</h2>
            <Link href={pathFor("shop", lang)} className="font-mono text-sm text-[#A9700A] hover:underline shrink-0">
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
        <div className="grid grid-cols-1 lg:grid-cols-[0.88fr_1.12fr] gap-10 lg:gap-14 items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#A9700A]">{t("home.deliveryEyebrow")}</p>
            <h2 className="mt-3 font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#1A1C1E]">{t("home.deliveryTitle")}</h2>
            <p className="mt-4 text-[#3A3E42] leading-relaxed">{t("home.deliveryText")}</p>
            <ul className="mt-6 space-y-3">
              {[t("home.deliveryPoint1"), t("home.deliveryPoint2"), t("home.deliveryPoint3")].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-6 text-[#3A3E42]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#A9700A]" />
                  {point}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-7 rounded-xl bg-[#1A1C1E] px-6 font-semibold text-white hover:bg-black">
              <Link href={pathFor("delivery", lang)}>
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
