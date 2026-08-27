import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";
import { IMAGES } from "@/lib/images";

const CONTENT = {
  pl: {
    intro:
      "Olborg Logistics Sp. z o.o. to polska firma z Poddębic specjalizująca się w sprzedaży i dostawie kontenerów morskich na terenie Polski i Niemiec.",
    p1: "Oferujemy nowe kontenery One Trip oraz sprawdzone kontenery używane w rozmiarach 10, 20 i 40 stóp — w wersjach Standard, High Cube i Open Side. Każdy produkt opisujemy rzetelnie: pełna specyfikacja, stan techniczny i zdjęcia.",
    p2: "Obsługujemy zarówno klientów prywatnych, jak i firmy. Dla przedsiębiorstw z ważnym numerem VAT UE realizujemy wewnątrzwspólnotowe dostawy towarów ze stawką 0% VAT, z automatyczną weryfikacją w systemie VIES.",
    p3: "Transport organizujemy własnym zapleczem logistycznym — samochodami z naczepą oraz autami z HDS. Koszt dostawy obliczysz online na podstawie kodu pocztowego, a przy nietypowych lokalizacjach przygotujemy indywidualną wycenę.",
    values: [
      ["Przejrzystość", "Jasne ceny netto i brutto, rzetelne opisy stanu kontenerów."],
      ["Zasięg", "Dostawy w całej Polsce i w Niemczech."],
      ["Elastyczność", "Zakup online lub indywidualna oferta B2B."],
    ],
    cta: "Zobacz naszą ofertę",
  },
  de: {
    intro:
      "Olborg Logistics Sp. z o.o. ist ein polnisches Unternehmen aus Poddębice, spezialisiert auf Verkauf und Lieferung von Seecontainern in Polen und Deutschland.",
    p1: "Wir bieten neue One-Trip-Container sowie geprüfte Gebrauchtcontainer in 10, 20 und 40 Fuß — als Standard, High Cube und Open Side. Jedes Produkt beschreiben wir transparent: vollständige Spezifikation, technischer Zustand und Fotos.",
    p2: "Wir bedienen Privatkunden und Unternehmen. Für Firmen mit gültiger USt-IdNr. führen wir innergemeinschaftliche Lieferungen mit 0% USt. durch — mit automatischer Prüfung über das VIES-System.",
    p3: "Den Transport organisieren wir mit eigener Logistik — Sattelzüge und LKW mit Ladekran (HDS). Die Lieferkosten berechnen Sie online anhand der Postleitzahl; für besondere Standorte erstellen wir ein individuelles Angebot.",
    values: [
      ["Transparenz", "Klare Netto- und Bruttopreise, ehrliche Zustandsbeschreibungen."],
      ["Reichweite", "Lieferungen in ganz Polen und Deutschland."],
      ["Flexibilität", "Online-Kauf oder individuelles B2B-Angebot."],
    ],
    cta: "Unser Angebot ansehen",
  },
};

export default function AboutPage() {
  const { lang, t } = useLang();
  const c = CONTENT[lang];
  usePageMeta(t("about.title"), c.intro);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[#1A1C1E]">{t("about.title")}</h1>
      <p className="mt-4 text-lg text-[#3A3E42] leading-relaxed">{c.intro}</p>

      <div className="mt-8 aspect-[21/9] overflow-hidden border border-[#E0E2E5]">
        <Image src={IMAGES.hero} alt="Olborg Logistics" className="w-full h-full object-cover" />
      </div>

      <div className="mt-8 space-y-4 text-[#3A3E42] leading-relaxed">
        <p>{c.p1}</p>
        <p>{c.p2}</p>
        <p>{c.p3}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {c.values.map(([h, d], i) => (
          <div key={i} className="bg-white border border-[#E0E2E5] p-5">
            <p className="font-mono text-[#F5A623] text-xs">{String(i + 1).padStart(2, "0")}</p>
            <p className="font-heading font-bold text-[#1A1C1E] mt-2">{h}</p>
            <p className="text-sm text-[#6B7075] mt-1">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button asChild className="bg-[#F5A623] hover:bg-[#C74600] rounded-none font-semibold h-12 px-8">
          <Link to={pathFor("shop", lang)}>{c.cta}</Link>
        </Button>
      </div>
    </div>
  );
}