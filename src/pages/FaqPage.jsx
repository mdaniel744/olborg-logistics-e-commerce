import React from "react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { FAQ } from "@/i18n/faq";
import { pathFor } from "@/lib/routes";

export default function FaqPage() {
  const { lang, t } = useLang();
  usePageMeta("FAQ", lang === "de" ? "Häufig gestellte Fragen zu Containern, Lieferung, Zahlung und Rückgabe." : "Najczęściej zadawane pytania o kontenery, dostawę, płatność i zwroty.");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[#1A1C1E]">FAQ</h1>

      {FAQ.map((group, gi) => (
        <section key={gi} className="mt-10">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#F5A623] mb-2">
            {lang === "de" ? group.category_de : group.category_pl}
          </h2>
          <Accordion type="single" collapsible className="bg-white border border-[#E0E2E5] px-4">
            {group.items.map((item, ii) => (
              <AccordionItem key={ii} value={`${gi}-${ii}`} className="border-[#E0E2E5]">
                <AccordionTrigger className="text-left font-semibold text-[#1A1C1E] hover:no-underline">
                  {lang === "de" ? item.q_de : item.q_pl}
                </AccordionTrigger>
                <AccordionContent className="text-[#3A3E42] leading-relaxed">
                  {lang === "de" ? item.a_de : item.a_pl}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}

      <div className="mt-12 bg-[#1A1C1E] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-heading font-bold text-lg">
          {lang === "de" ? "Ihre Frage ist nicht dabei?" : "Nie znalazłeś odpowiedzi?"}
        </p>
        <Button asChild className="bg-[#F5A623] hover:bg-[#C74600] rounded-none font-semibold shrink-0">
          <Link to={pathFor("contact", lang)}>{t("nav.contact")}</Link>
        </Button>
      </div>
    </div>
  );
}