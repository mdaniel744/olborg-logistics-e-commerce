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
    heroTitle: "Kontenery i organizacja dostawy z Polski",
    heroText:
      "Olborg Logistics łączy sprzedaż kontenerów z organizacją ich transportu. Pomagamy klientom w Polsce i Niemczech porównać warianty oraz ustalić warunki dostawy do miejsca, w którym kontener ma być używany.",
    storyTitle: "Kim jesteśmy i w czym pomagamy",
    story: [
      "Olborg Logistics to marka, pod którą działa polska spółka OLBORG LOGISTIC SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ. Zajmujemy się sprzedażą kontenerów i organizacją dostaw dla klientów prywatnych oraz firm.",
      "Rozmowę o wyborze zaczynamy od zastosowania: co trafi do środka, jak będzie załadowane i jak często potrzebny jest dostęp. Te informacje pozwalają porównać rozmiar, układ drzwi i stan kontenera.",
      "Równie ważne jest miejsce ustawienia. Kod pocztowy, dojazd, podłoże i miejsce odbioru pomagają potwierdzić warunki standardowej dostawy. Jeśli potrzebujesz opcjonalnej usługi specjalnej, możesz przesłać jej opis i zdjęcia miejsca w zapytaniu o wycenę.",
    ],
    imageAlt: "Wizualizacja samochodu ciężarowego przewożącego kontener",
    imageCaption: "Wizualizacja transportu kontenera; pojazd dostawy jest ustalany dla zamówienia.",
    logisticsTitle: "Organizacja standardowej dostawy",
    logisticsText:
      "Stała stawka obejmuje transport oraz standardowe, bezpieczne przekazanie kontenera pod adresem dostawy. Przed wysyłką potwierdzamy dojazd, miejsce odbioru i termin; klient nie wybiera sposobu rozładunku w kasie.",
    logisticsPoints: [
      "organizacja transportu dla całego zamówienia",
      "potwierdzenie dojazdu i bezpiecznego miejsca odbioru",
      "stała stawka 1 380 PLN w Polsce albo 530 EUR w Niemczech za całe zamówienie",
      "opcjonalne usługi specjalne tylko na podstawie osobnej wyceny zaakceptowanej przed zakupem",
    ],
    marketsTitle: "Polska i Niemcy",
    markets: [
      ["Firma z Polski", "Sprzedawcą jest polska spółka. Jej dane identyfikacyjne oraz sposoby kontaktu są dostępne na stronie Kontakt."],
      ["Obsługa klientów w Niemczech", "Niemiecka wersja sklepu pozwala porównać kontenery i złożyć zapytanie. Dostawę sprawdzamy według wskazanego adresu, niezależnie od języka strony."],
    ],
    goalTitle: "Prosty i uczciwy proces zakupu",
    goalText:
      "Przed decyzją potrzebujesz informacji o wybranym kontenerze, cenie i transporcie. Jeżeli brakuje danych istotnych dla Twojego zastosowania, zapytaj nas przed zakupem.",
    goals: [
      "wybór rozmiaru, typu, stanu i koloru",
      "porównanie danych wybranego wariantu",
      "potwierdzenie dojazdu i miejsca odbioru",
      "zamówienie lub niewiążące zapytanie",
    ],
    ctaTitle: "Znajdź odpowiedni kontener",
    ctaText:
      "Sprawdź aktualną ofertę lub poproś nasz zespół o pomoc w wyborze kontenera i organizacji dostawy.",
    primaryCta: "Zobacz kontenery",
    secondaryCta: "Zapytaj o ofertę",
  },
  de: {
    eyebrow: "OLBORG LOGISTICS",
    heroTitle: "Container und Lieferorganisation aus Polen",
    heroText:
      "Olborg Logistics verbindet den Containerverkauf mit der Organisation des Transports. Wir unterstützen Kunden in Polen und Deutschland beim Variantenvergleich und bei der Abstimmung der Lieferung an den geplanten Einsatzort.",
    storyTitle: "Wer wir sind und wobei wir helfen",
    story: [
      "Olborg Logistics ist die Marke der polnischen Gesellschaft OLBORG LOGISTIC SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ. Wir verkaufen Container und organisieren Lieferungen für Privatpersonen und Unternehmen.",
      "Bei der Auswahl beginnen wir mit dem Einsatz: Was soll hinein, wie wird beladen und wie häufig brauchen Sie Zugang? Damit lassen sich Größe, Türanordnung und Zustand sinnvoll vergleichen.",
      "Ebenso wichtig ist der Stellplatz. Postleitzahl, Zufahrt, Untergrund und Annahmestelle helfen, die Bedingungen der Standardlieferung zu bestätigen. Benötigen Sie eine optionale Sonderleistung, können Sie Ihrer Angebotsanfrage eine Beschreibung und Standortbilder beifügen.",
    ],
    imageAlt: "Visualisierung eines LKW mit Container",
    imageCaption: "Visualisierung eines Containertransports; das Lieferfahrzeug wird je Bestellung abgestimmt.",
    logisticsTitle: "Standardlieferung organisieren",
    logisticsText:
      "Die Pauschale umfasst den Transport und die sichere Standardübergabe des Containers an der Lieferadresse. Vor dem Versand bestätigen wir Zufahrt, Annahmestelle und Termin; in der Kasse wählen Kunden keine Entlademethode.",
    logisticsPoints: [
      "Transportorganisation für die gesamte Bestellung",
      "Bestätigung von Zufahrt und sicherer Annahmestelle",
      "Pauschale von 1.380 PLN in Polen oder 530 EUR in Deutschland je Bestellung",
      "optionale Sonderleistungen nur auf Grundlage eines gesonderten, vor dem Kauf angenommenen Angebots",
    ],
    marketsTitle: "Polen und Deutschland",
    markets: [
      ["Ein Unternehmen aus Polen", "Verkäufer ist eine polnische Gesellschaft. Die Unternehmensangaben und Kontaktmöglichkeiten finden Sie auf der Kontaktseite."],
      ["Kunden in Deutschland", "Im deutschsprachigen Shop können Sie Container vergleichen und eine Anfrage stellen. Die Lieferung prüfen wir anhand der angegebenen Adresse, unabhängig von der Seitensprache."],
    ],
    goalTitle: "Ein einfacher und fairer Kaufprozess",
    goalText:
      "Für Ihre Entscheidung brauchen Sie Angaben zum gewählten Container, zum Preis und zum Transport. Fehlen Daten, die für Ihren Einsatzzweck wichtig sind, fragen Sie uns vor dem Kauf.",
    goals: [
      "Größe, Typ, Zustand und Farbe wählen",
      "Daten der gewählten Variante vergleichen",
      "Zufahrt und Annahmestelle bestätigen",
      "Bestellen oder unverbindlich anfragen",
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
        <figure>
          <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[#D7DADF] bg-white">
            <Image src={ABOUT_IMAGE} alt={c.imageAlt} loading="eager" className="h-full w-full object-cover object-center" />
          </div>
          <figcaption className="mt-2 text-xs leading-5 text-[#5F656B]">{c.imageCaption}</figcaption>
        </figure>
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
