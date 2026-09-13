import React from "react";
import Link from "next/link";
import { Building2, Globe2, ShieldCheck } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";

const IMG_DEPOT = "/images/container-yard-blue-side-opening.jpg";
const IMG_DELIVERY = "/images/olborg-container-crane-delivery.webp";

const COPY = {
  pl: {
    eyebrow: "O firmie",
    title: "Olborg Logistics — dostawca kontenerów morskich",
    p1: "Olborg Logistics to marka polskiej spółki OLBORG LOGISTIC SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ. Sprzedajemy kontenery i organizujemy ich transport dla klientów prywatnych oraz firm.",
    p2: "Wybór zacznij od tego, co chcesz przechowywać lub przewozić. Porównaj rozmiar, drzwi, stan i kolor kontenera, a następnie sprawdź możliwość dostawy oraz rozładunku pod wskazanym adresem w Polsce lub Niemczech.",
    facts: [
      { icon: Building2, label: "Polski sprzedawca", value: "Dane firmy dostępne na stronie Kontakt" },
      { icon: Globe2, label: "Obsługiwane rynki", value: "Polska i Niemcy" },
      { icon: ShieldCheck, label: "Sprzedaż B2B i B2C", value: "Faktura VAT, przelew bankowy / SEPA" },
    ],
    cta: "Poznaj naszą firmę",
    caption: "Przykład składowania kontenerów na placu",
    caption2: "Ilustracja rozładunku kontenera samochodem z HDS",
  },
  de: {
    eyebrow: "Über das Unternehmen",
    title: "Olborg Logistics — Ihr Lieferant für Seecontainer",
    p1: "Olborg Logistics ist die Marke der polnischen Gesellschaft OLBORG LOGISTIC SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ. Wir verkaufen Container und organisieren deren Transport für Privatpersonen und Unternehmen.",
    p2: "Beginnen Sie mit der Ware, die Sie lagern oder transportieren möchten. Vergleichen Sie Größe, Türen, Zustand und Farbe des Containers und prüfen Sie anschließend Lieferung und Entladung an Ihrer Adresse in Polen oder Deutschland.",
    facts: [
      { icon: Building2, label: "Verkäufer aus Polen", value: "Unternehmensangaben auf der Kontaktseite" },
      { icon: Globe2, label: "Märkte", value: "Polen und Deutschland" },
      { icon: ShieldCheck, label: "Verkauf B2B und B2C", value: "Rechnung, Banküberweisung / SEPA" },
    ],
    cta: "Mehr über uns",
    caption: "Beispiel einer Containerlagerung auf einem Depotgelände",
    caption2: "Illustration einer Containerentladung per LKW-Kran",
  },
};

export default function CompanySection() {
  const { lang } = useLang();
  const c = COPY[lang] || COPY.pl;

  return (
    <section className="bg-[#F8F9FA] border-y border-[#E0E2E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-[#A9700A] uppercase mb-3">{c.eyebrow}</p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#1A1C1E]">{c.title}</h2>
          <p className="mt-4 text-[#3A3E42] leading-relaxed">{c.p1}</p>
          <p className="mt-3 text-[#3A3E42] leading-relaxed">{c.p2}</p>

          <dl className="mt-7 divide-y divide-[#E0E2E5] border-y border-[#E0E2E5]">
            {c.facts.map((f, i) => (
              <div key={i} className="flex items-start gap-3 py-3">
                <f.icon className="w-4 h-4 text-[#A9700A] mt-0.5 shrink-0" />
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-[#6B7075]">{f.label}</dt>
                  <dd className="text-sm font-semibold text-[#1A1C1E]">{f.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <Button asChild className="mt-7 bg-[#1A1C1E] hover:bg-black text-white rounded-none font-semibold h-11 px-6">
            <Link href={pathFor("about", lang)}>{c.cta}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <figure className="sm:col-span-2">
            <div className="aspect-[16/9] bg-[#E0E2E5] overflow-hidden border border-[#E0E2E5]">
              <Image src={IMG_DEPOT} alt={c.caption} className="h-full w-full object-cover object-center" />
            </div>
            <figcaption className="font-mono text-[11px] text-[#6B7075] mt-2">{c.caption}</figcaption>
          </figure>
          <figure className="sm:col-span-2">
            <div className="aspect-[4/3] bg-[#E0E2E5] overflow-hidden border border-[#E0E2E5]">
              <Image src={IMG_DELIVERY} alt={c.caption2} className="h-full w-full object-cover object-center" />
            </div>
            <figcaption className="font-mono text-[11px] text-[#6B7075] mt-2">{c.caption2}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
