"use client";

import React from "react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { FAQ } from "@/i18n/faq";
import { pathFor } from "@/lib/routes";

export default function FaqPage() {
  const { lang, t } = useLang();
  usePageMeta("FAQ", lang === "de" ? "Häufig gestellte Fragen zu Containern, Lieferung, Zahlung und Rückgabe." : "Najczęściej zadawane pytania o kontenery, dostawę, płatność i zwroty.");

  return (
    <div className="reading-page">
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#1A1C1E]">FAQ</h1>

      {FAQ.map((group, gi) => (
        <section key={gi} className="mt-10">
          <h2 className="text-sm uppercase tracking-[0.14em] text-[#795207] mb-3">
            {lang === "de" ? group.category_de : group.category_pl}
          </h2>
          <Accordion type="single" collapsible className="rounded-xl bg-white border border-[#D7DADF] px-5 sm:px-6">
            {group.items.map((item, ii) => (
              <AccordionItem key={ii} value={`${gi}-${ii}`} className="border-[#E0E2E5]">
                <AccordionTrigger className="py-5 text-left text-base font-semibold leading-6 text-[#1A1C1E] hover:no-underline">
                  {lang === "de" ? item.q_de : item.q_pl}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base text-[#343A40] leading-[1.75]">
                  {lang === "de" ? item.a_de : item.a_pl}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}

      <div className="mt-12 rounded-xl bg-[#1A1C1E] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-semibold text-lg">
          {lang === "de" ? "Ihre Frage ist nicht dabei?" : "Nie znalazłeś odpowiedzi?"}
        </p>
        <Button asChild className="h-11 bg-[#F5A623] hover:bg-[#E39A17] font-semibold text-[#1A1C1E] shrink-0">
          <Link href={pathFor("contact", lang)}>{t("nav.contact")}</Link>
        </Button>
      </div>
    </div>
  );
}
