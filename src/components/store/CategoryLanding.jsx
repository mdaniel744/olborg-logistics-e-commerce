"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, PackageOpen, Ruler, Truck } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useLang } from "@/lib/i18n";
import { CATEGORY_LANDINGS, pathFor } from "@/lib/routes";
import { getCategoryContent } from "@/data/categoryContent";
import Shop from "@/features/storefront/Shop";

export default function CategoryLanding({ landing }) {
  const { lang } = useLang();
  const content = getCategoryContent(landing.key, lang);
  const related = CATEGORY_LANDINGS.filter((entry) => entry.key !== landing.key).slice(0, 4);

  if (!content) return null;

  const labels = lang === "de"
    ? {
        shop: "Verfügbare Container ansehen",
        all: "Alle Container",
        uses: "Typische Einsatzbereiche",
        planning: "Lieferung und Aufstellung planen",
        planningLead: "Diese Angaben helfen uns, Transport, Fahrzeug und Entladung passend vorzubereiten.",
        productsEyebrow: "Aktueller Bestand",
        productsTitle: `${content.title}: verfügbare Angebote`,
        productsLead: "Vergleichen Sie verfügbare Varianten und Preise. Die Filter für diese Kategorie sind bereits vorausgewählt.",
        faq: "Häufige Fragen",
        related: "Weitere Container-Themen",
        delivery: "Mehr zur Containerlieferung",
        guides: "Zum Container-Ratgeber",
      }
    : {
        shop: "Zobacz dostępne kontenery",
        all: "Wszystkie kontenery",
        uses: "Typowe zastosowania",
        planning: "Zaplanuj dostawę i ustawienie",
        planningLead: "Te informacje pomagają nam dobrać transport, pojazd i sposób rozładunku.",
        productsEyebrow: "Aktualna oferta",
        productsTitle: `${content.title}: dostępne oferty`,
        productsLead: "Porównaj dostępne warianty i ceny. Filtry tej kategorii są już ustawione.",
        faq: "Najczęstsze pytania",
        related: "Więcej tematów o kontenerach",
        delivery: "Więcej o dostawie kontenerów",
        guides: "Przejdź do poradnika",
      };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <article className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="bg-[#F3F4F5]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-12 sm:px-6 md:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#8A5D08]">{content.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] text-[#1A1C1E] sm:text-5xl lg:text-6xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#3A3E42]">{content.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#category-products" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#F5A623] px-6 font-semibold text-[#1A1C1E] transition-colors hover:bg-[#E39A17]">
                {labels.shop} <ArrowRight className="h-4 w-4" />
              </a>
              <Link href={pathFor("shop", lang)} className="inline-flex min-h-12 items-center justify-center border border-[#AEB2B6] bg-white px-6 font-semibold text-[#1A1C1E] transition-colors hover:bg-[#E8EAEC]">
                {labels.all}
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-[#D7DADF] pt-6">
              {content.facts.map(([value, label]) => (
                <div key={label}>
                  <dt className="text-[11px] leading-4 text-[#666C72] sm:text-xs">{label}</dt>
                  <dd className="mt-1 text-sm font-bold text-[#1A1C1E] sm:text-base">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className={`relative overflow-hidden bg-white ${content.imageMode === "photo" ? "aspect-[4/3]" : "min-h-[300px] sm:min-h-[420px]"}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff_0%,#ffffff_56%,#eceef0_100%)]" aria-hidden="true" />
            <Image
              src={content.image}
              alt={content.imageAlt}
              width={1200}
              height={820}
              sizes="(min-width: 1024px) 54vw, 100vw"
              priority
              className={`relative z-10 h-full w-full ${content.imageMode === "photo" ? "object-cover" : "min-h-[300px] object-contain p-5 drop-shadow-[0_18px_18px_rgba(26,28,30,0.16)] sm:min-h-[420px] sm:p-9"}`}
            />
          </figure>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-16 sm:px-6 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8A5D08]">{content.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold text-[#1A1C1E] md:text-4xl">{content.introTitle}</h2>
        </div>
        <div className="space-y-5 text-base leading-8 text-[#3F454B] md:text-lg">
          {content.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="grid grid-cols-1 gap-3 pt-3 sm:grid-cols-2">
            <Link href={pathFor("delivery", lang)} className="inline-flex min-h-12 items-center gap-3 bg-[#F3F4F5] px-4 font-semibold text-[#1A1C1E] hover:bg-[#E8EAEC]">
              <Truck className="h-5 w-5 text-[#A9700A]" /> {labels.delivery}
            </Link>
            <Link href={pathFor("guides", lang)} className="inline-flex min-h-12 items-center gap-3 bg-[#F3F4F5] px-4 font-semibold text-[#1A1C1E] hover:bg-[#E8EAEC]">
              <PackageOpen className="h-5 w-5 text-[#A9700A]" /> {labels.guides}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#1A1C1E]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-20">
          <h2 className="text-3xl font-bold text-white md:text-4xl">{labels.uses}</h2>
          <div className="mt-10 grid grid-cols-1 gap-px bg-white/15 md:grid-cols-3">
            {content.uses.map(([title, description], index) => (
              <div key={title} className="bg-[#1A1C1E] p-6 md:p-8">
                <span className="font-mono text-xs text-[#F5A623]">0{index + 1}</span>
                <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 leading-7 text-white/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-20">
        <div>
          <div className="flex items-center gap-3 text-[#A9700A]">
            <Ruler className="h-5 w-5" />
            <span className="font-mono text-xs uppercase tracking-[0.18em]">{content.eyebrow}</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-[#1A1C1E]">{content.optionsTitle}</h2>
          <div className="mt-8 space-y-6">
            {content.options.map(([title, description]) => (
              <div key={title} className="border-t border-[#D7DADF] pt-5">
                <h3 className="text-lg font-semibold text-[#1A1C1E]">{title}</h3>
                <p className="mt-2 leading-7 text-[#4B5157]">{description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#F3F4F5] p-6 sm:p-8 md:p-10">
          <Truck className="h-7 w-7 text-[#A9700A]" />
          <h2 className="mt-5 text-3xl font-bold text-[#1A1C1E]">{labels.planning}</h2>
          <p className="mt-3 leading-7 text-[#4B5157]">{labels.planningLead}</p>
          <ul className="mt-8 space-y-4">
            {content.planning.map((item) => (
              <li key={item} className="flex gap-3 leading-7 text-[#343A40]">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#A9700A]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link href={pathFor("quote", lang)} className="mt-8 inline-flex min-h-12 items-center gap-2 bg-[#1A1C1E] px-6 font-semibold text-white hover:bg-black">
            {lang === "de" ? "Lieferung und Angebot anfragen" : "Zapytaj o dostawę i ofertę"} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section id="category-products" className="scroll-mt-28 bg-[#F7F8F9]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8A5D08]">{labels.productsEyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold text-[#1A1C1E] md:text-4xl">{labels.productsTitle}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#4B5157]">{labels.productsLead}</p>
          <Shop presetFilter={landing.filter} embedded />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="text-3xl font-bold text-[#1A1C1E]">{labels.faq}</h2>
          <div className="mt-8 divide-y divide-[#D7DADF] border-y border-[#D7DADF]">
            {content.faq.map(([question, answer]) => (
              <section key={question} className="py-6">
                <h3 className="text-lg font-semibold text-[#1A1C1E]">{question}</h3>
                <p className="mt-2 leading-7 text-[#4B5157]">{answer}</p>
              </section>
            ))}
          </div>
        </div>
        <aside>
          <h2 className="text-2xl font-bold text-[#1A1C1E]">{labels.related}</h2>
          <nav className="mt-6 grid grid-cols-1 gap-3" aria-label={labels.related}>
            {related.map((entry) => {
              const relatedContent = getCategoryContent(entry.key, lang);
              return (
                <Link key={entry.key} href={entry[lang]} className="group flex min-h-16 items-center justify-between gap-4 bg-[#F3F4F5] px-5 font-semibold text-[#1A1C1E] transition-colors hover:bg-[#FFF0D2]">
                  <span>{relatedContent?.title || entry.key}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#A9700A] transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </nav>
        </aside>
      </section>
    </article>
  );
}
