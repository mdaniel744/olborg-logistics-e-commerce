"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Package, Truck, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";
import { POLICIES } from "@/i18n/policies";
import DeliveryCalculator from "@/components/store/DeliveryCalculator";

export default function DeliveryPage() {
  const { lang, t } = useLang();
  usePageMeta(t("delivery.title"), t("delivery.subtitle"));

  const factors = [
    { icon: MapPin, text: t("delivery.f1") },
    { icon: Package, text: t("delivery.f2") },
    { icon: Truck, text: t("delivery.f3") },
    { icon: Construction, text: t("delivery.f4") },
  ];
  const shipping = POLICIES.shipping;
  const internationalCustomers = {
    pl: {
      title: "Polska firma, dostawa do Niemiec",
      customerText:
        "Przy dostawie do Niemiec podaj pełny adres i niemiecki kod pocztowy, nawet jeśli dane do faktury dotyczą firmy w Polsce. Ustalmy też sposób rozładunku i osobę, która odbierze kontener. Te informacje pozwalają sprawdzić trasę, pojazd oraz koszt do wskazanego miejsca. Zapytanie ofertowe nie zobowiązuje do zakupu.",
      vatText:
        "Dla kwalifikujących się transakcji wewnątrzwspólnotowych B2B możliwe jest zastosowanie stawki 0% VAT po spełnieniu wymogów prawnych i weryfikacji aktywnego numeru VAT UE w systemie VIES. Samo posiadanie numeru VAT UE nie gwarantuje automatycznie zastosowania stawki 0%.",
    },
    de: {
      title: "Polnisches Unternehmen, Lieferung nach Deutschland",
      customerText:
        "Geben Sie für eine Lieferung nach Deutschland die vollständige Lieferadresse und deutsche Postleitzahl an, auch wenn die Rechnungsanschrift in Polen liegt. Klären Sie außerdem die Entladung und wer den Container vor Ort annimmt. Mit diesen Angaben lassen sich Route, Fahrzeug und Transportpreis für den Standort prüfen. Eine Angebotsanfrage verpflichtet nicht zum Kauf.",
      vatText:
        "Bei qualifizierten innergemeinschaftlichen B2B-Lieferungen kann nach Erfüllung der gesetzlichen Voraussetzungen und Prüfung einer aktiven USt-IdNr. im VIES-System der Steuersatz von 0% angewendet werden. Der Besitz einer USt-IdNr. allein ist keine automatische Garantie für 0% USt.",
    },
  }[lang];

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-6 py-12 md:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#1A1C1E]">{t("delivery.title")}</h1>
      <p className="mt-4 text-base md:text-lg text-[#343A40] max-w-2xl leading-[1.75]">{t("delivery.subtitle")}</p>

      <div className="mt-8">
        <DeliveryCalculator />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-[#1A1C1E] mb-5">{t("delivery.factorsTitle")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {factors.map((f, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-white border border-[#D7DADF] p-5">
              <f.icon className="w-5 h-5 text-[#F5A623] shrink-0 mt-0.5" />
              <p className="text-base leading-7 text-[#343A40]">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 max-w-3xl border-l-4 border-[#D3941B] pl-5 md:pl-8">
        <h2 className="text-2xl font-semibold text-[#1A1C1E]">{internationalCustomers.title}</h2>
        <p className="mt-4 text-base md:text-lg leading-[1.75] text-[#343A40]">
          {internationalCustomers.customerText}
        </p>
        <p className="mt-5 text-base leading-[1.75] text-[#343A40]">
          {internationalCustomers.vatText}
        </p>
      </section>

      <section id="versand-und-lieferung" className="long-form-content mt-12 rounded-xl bg-white border border-[#D7DADF] p-6 sm:p-8 scroll-mt-36">
        <h2 className="!text-2xl">
          {lang === "de" ? shipping.title_de : shipping.title_pl}
        </h2>
        <div className="mt-6 space-y-6">
          {shipping.sections.map((section) => (
            <div key={section.h_de}>
              <h3>
                {lang === "de" ? section.h_de : section.h_pl}
              </h3>
              <p>
                {lang === "de" ? section.p_de : section.p_pl}
              </p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-6 text-base leading-7 text-[#343A40]">
        {lang === "de" ? "Fragen zur Rückgabe oder zu einem Transportschaden? " : "Pytania o zwrot lub szkodę transportową? "}
        <Link href={pathFor("returns", lang)} className="font-semibold text-[#795207] underline underline-offset-4">
          {lang === "de" ? "Rückgabe und Reklamationen" : "Zwroty i reklamacje"}
        </Link>
        {" · "}
        <Link href={pathFor("contact", lang)} className="font-semibold text-[#795207] underline underline-offset-4">
          {lang === "de" ? "Kontakt zum Verkäufer" : "Kontakt ze sprzedawcą"}
        </Link>
      </p>

      <div className="mt-10 bg-[#1A1C1E] text-white p-6 sm:p-8 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-lg">{t("product.deliveryQuoteRequired")}</p>
          <p className="text-base leading-7 text-white/75 mt-1">{t("product.quoteHint")}</p>
        </div>
        <Button asChild className="h-11 bg-[#F5A623] hover:bg-[#DB930D] !text-[#1A1C1E] font-semibold shrink-0">
          <Link href={pathFor("quote", lang)}>{t("common.requestQuote")}</Link>
        </Button>
      </div>
    </div>
  );
}
