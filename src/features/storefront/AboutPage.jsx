"use client";

import React from "react";
import Link from "next/link";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";

const ABOUT_IMAGE = "/images/about-olborg-container-truck.webp";

const CONTENT = {
  pl: {
    eyebrow: "OLBORG LOGISTICS",
    heroTitle: "Logistyka i kontenery oparte na doświadczeniu",
    heroText:
      "Od 2017 roku rozwijamy nasze doświadczenie w transporcie i logistyce, zapewniając dziś klientom w Polsce i Niemczech dostęp do najpopularniejszych typów kontenerów morskich.",
    storyTitle: "Nasza historia",
    story: [
      "Olborg Logistics to polska firma logistyczna z siedzibą w Poddębicach, działająca od 2017 roku. Nasza działalność rozpoczęła się od transportu drogowego i obsługi logistycznej.",
      "Wieloletnie doświadczenie w branży transportowej pozwoliło nam obserwować rozwój rynku kontenerowego oraz rosnące zapotrzebowanie na kontenery w logistyce, magazynowaniu, budownictwie i handlu internetowym.",
      "Coraz częstsze adaptacje kontenerów na magazyny, biura, obiekty usługowe i inne przestrzenie użytkowe sprawiły, że sprzedaż kontenerów stała się naturalnym kierunkiem rozwoju Olborg Logistics.",
    ],
    imageAlt: "Kontenery morskie i zaplecze logistyczne Olborg Logistics",
    logisticsTitle: "Własna logistyka i dostawa",
    logisticsText:
      "Transport pozostaje jednym z najważniejszych elementów naszej działalności. Organizujemy dostawy za pośrednictwem naszej sieci logistycznej, a przy nietypowych warunkach przygotowujemy indywidualną wycenę.",
    logisticsPoints: [
      "samochody ciężarowe i zestawy transportowe",
      "pojazdy z HDS, gdy potrzebny jest rozładunek dźwigiem",
      "szacunkowy koszt transportu według kodu pocztowego dla obsługiwanych lokalizacji",
      "indywidualne wyceny dla trudnego dojazdu i bardziej złożonych dostaw",
    ],
    marketsTitle: "Polska i Niemcy",
    markets: [
      ["Polska — główny rynek", "W Poddębicach znajduje się siedziba firmy i baza naszej działalności logistycznej."],
      ["Niemcy — rozwijany rynek dostaw", "Doświadczenie w transporcie międzynarodowym pomaga nam regularnie obsługiwać sprzedaż i dostawy do Niemiec."],
    ],
    goalTitle: "Prosty i uczciwy proces zakupu",
    goalText:
      "Chcemy zapewniać prosty dostęp do sprawdzonych kontenerów bez niepotrzebnego komplikowania zakupu.",
    goals: [
      "regularna dostępność popularnych modeli",
      "przejrzyste informacje o produktach",
      "sprawna organizacja transportu",
      "obsługa klientów prywatnych i biznesowych",
    ],
    ctaTitle: "Znajdź odpowiedni kontener",
    ctaText:
      "Sprawdź aktualną ofertę lub poproś nasz zespół o pomoc w wyborze kontenera i organizacji dostawy.",
    primaryCta: "Zobacz kontenery",
    secondaryCta: "Zapytaj o ofertę",
  },
  de: {
    eyebrow: "OLBORG LOGISTICS",
    heroTitle: "Logistik und Container auf der Grundlage von Erfahrung",
    heroText:
      "Seit 2017 bauen wir unsere Erfahrung in Transport und Logistik aus und bieten Kunden in Polen und Deutschland heute Zugang zu den gefragtesten Seecontainertypen.",
    storyTitle: "Unsere Geschichte",
    story: [
      "Olborg Logistics ist ein polnisches Logistikunternehmen mit Sitz in Poddębice und seit 2017 tätig. Unser Weg begann mit Straßentransport und logistischer Betreuung.",
      "Die langjährige Erfahrung im Transportwesen ließ uns die dynamische Entwicklung des Containermarktes und die wachsende Nachfrage in Logistik, Lagerung, Bauwesen und Onlinehandel aus nächster Nähe verfolgen.",
      "Die zunehmende Umnutzung von Containern zu Lagern, Büros, Gewerbe- und Nutzflächen machte den Containerverkauf zu einem natürlichen nächsten Schritt für Olborg Logistics.",
    ],
    imageAlt: "Seecontainer und Logistik von Olborg Logistics",
    logisticsTitle: "Eigene Logistik und Lieferung",
    logisticsText:
      "Der Transport bleibt ein zentraler Teil unserer Arbeit. Wir organisieren Lieferungen über unser Logistiknetzwerk und erstellen bei besonderen Bedingungen ein individuelles Angebot.",
    logisticsPoints: [
      "Lkw und komplette Transportzüge",
      "Fahrzeuge mit Ladekran (HDS), wenn eine Kranentladung erforderlich ist",
      "voraussichtliche Transportkosten nach Postleitzahl für bediente Regionen",
      "individuelle Kalkulation bei schwieriger Zufahrt und komplexeren Lieferungen",
    ],
    marketsTitle: "Polen und Deutschland",
    markets: [
      ["Polen — unser Hauptmarkt", "In Poddębice befinden sich der Firmensitz und die Basis unserer logistischen Tätigkeit."],
      ["Deutschland — wachsender Liefermarkt", "Unsere Erfahrung im internationalen Transport unterstützt den regelmäßigen Verkauf und die Lieferung nach Deutschland."],
    ],
    goalTitle: "Ein einfacher und fairer Kaufprozess",
    goalText:
      "Wir möchten den Zugang zu bewährten Containern ermöglichen, ohne den Kauf unnötig kompliziert zu machen.",
    goals: [
      "regelmäßige Verfügbarkeit gefragter Modelle",
      "transparente Produktinformationen",
      "zuverlässige Organisation des Transports",
      "Betreuung von Privat- und Geschäftskunden",
    ],
    ctaTitle: "Den passenden Container finden",
    ctaText:
      "Sehen Sie sich das aktuelle Angebot an oder lassen Sie sich von unserem Team bei Auswahl und Lieferung beraten.",
    primaryCta: "Container ansehen",
    secondaryCta: "Angebot anfragen",
  },
};

export default function AboutPage() {
  const { lang, t } = useLang();
  const c = CONTENT[lang];
  usePageMeta(t("about.title"), c.heroText);

  return (
    <article className="max-w-6xl mx-auto px-5 sm:px-6 py-12 md:py-16">
      <header className="max-w-4xl">
        <p className="text-sm font-semibold tracking-[0.16em] text-[#795207]">{c.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl md:text-5xl font-bold leading-[1.12] text-[#1A1C1E]">
          {c.heroTitle}
        </h1>
        <p className="mt-6 max-w-3xl text-lg md:text-xl leading-[1.7] text-[#343A40]">
          {c.heroText}
        </p>
      </header>

      <section className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-9 md:gap-14 items-start">
        <div className="long-form-content">
          <h2>{c.storyTitle}</h2>
          {c.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[#D7DADF] bg-white">
          <Image src={ABOUT_IMAGE} alt={c.imageAlt} loading="eager" className="h-full w-full object-cover object-center" />
        </div>
      </section>

      <section className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
        <div>
          <h2 className="text-2xl md:text-3xl">{c.logisticsTitle}</h2>
          <p className="mt-4 text-base md:text-lg leading-[1.75] text-[#343A40]">{c.logisticsText}</p>
        </div>
        <ul className="space-y-4 text-base leading-7 text-[#343A40]" aria-label={c.logisticsTitle}>
          {c.logisticsPoints.map((point) => (
            <li key={point} className="flex gap-3 border-b border-[#E0E2E5] pb-4">
              <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#A9700A]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 md:mt-20">
        <h2 className="text-2xl md:text-3xl">{c.marketsTitle}</h2>
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-8">
          {c.markets.map(([title, description]) => (
            <div key={title} className="border-t border-[#C9CDD2] pt-5">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 leading-7 text-[#4B5157]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-14 items-start">
        <div>
          <h2 className="text-2xl md:text-3xl">{c.goalTitle}</h2>
          <p className="mt-4 text-base md:text-lg leading-[1.75] text-[#343A40]">{c.goalText}</p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-7 gap-y-4 text-base text-[#343A40]">
          {c.goals.map((goal) => (
            <li key={goal} className="border-b border-[#E0E2E5] pb-4 font-medium">{goal}</li>
          ))}
        </ul>
      </section>

      <section className="mt-16 md:mt-20 rounded-2xl bg-[#1A1C1E] px-6 py-9 sm:px-9 sm:py-11 md:flex md:items-center md:justify-between md:gap-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl text-white">{c.ctaTitle}</h2>
          <p className="mt-3 text-base leading-7 text-white/75">{c.ctaText}</p>
        </div>
        <div className="mt-7 md:mt-0 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 shrink-0">
          <Button asChild className="h-12 bg-[#F5A623] px-6 text-base font-semibold text-[#1A1C1E] hover:bg-[#E39A17]">
            <Link href={pathFor("shop", lang)}>{c.primaryCta}</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 border-white/50 bg-transparent px-6 text-base font-semibold text-white hover:bg-white hover:text-[#1A1C1E]">
            <Link href={pathFor("quote", lang)}>{c.secondaryCta}</Link>
          </Button>
        </div>
      </section>
    </article>
  );
}
