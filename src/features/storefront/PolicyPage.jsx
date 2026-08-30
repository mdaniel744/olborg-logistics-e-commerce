"use client";

import React from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, Settings2 } from "lucide-react";
import { useLang, usePageMeta } from "@/lib/i18n";
import { POLICIES } from "@/i18n/policies";
import { pathFor } from "@/lib/routes";
import { Button } from "@/components/ui/button";

function PolicyText({ children }) {
  const lines = String(children || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    return (
      <ul>
        {lines.map((line) => (
          <li key={line}>{line.replace(/^—\s*/, "")}</li>
        ))}
      </ul>
    );
  }

  return <p>{lines[0] || ""}</p>;
}

// Renders the bilingual legal pages that remain as standalone routes.
export default function PolicyPage({ policyKey }) {
  const { lang } = useLang();
  const policy = POLICIES[policyKey];
  const title = lang === "de" ? policy.title_de : policy.title_pl;
  usePageMeta(title);
  const isReturns = policyKey === "returns";
  const isCookies = policyKey === "cookies";
  const isTerms = policyKey === "terms";
  const complaints = POLICIES.complaints;

  return (
    <article className="reading-page">
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#1A1C1E]">{title}</h1>
      <div className="long-form-content mt-10">
        {policy.sections.map((s) => (
          <section key={s.h_de} className="border-t border-[#D7DADF] pt-7">
            <h2>
              {lang === "de" ? s.h_de : s.h_pl}
            </h2>
            <PolicyText>{lang === "de" ? s.p_de : s.p_pl}</PolicyText>
          </section>
        ))}

        {isTerms && (
          <section className="rounded-xl bg-white border border-[#D7DADF] p-5 sm:p-7">
            <h2>
              {lang === "de" ? "Widerrufsrecht für Verbraucher" : "Prawo odstąpienia dla konsumentów"}
            </h2>
            <p>
              {lang === "de"
                ? "Die Fristen, Voraussetzungen und das Musterformular finden Sie auf der Seite zum Widerrufsrecht."
                : "Terminy, warunki oraz wzór formularza znajdują się na stronie prawa odstąpienia od umowy."}
            </p>
            <Link href={pathFor("withdrawal", lang)} className="mt-4 inline-flex items-center gap-2 font-semibold text-[#8A5D08] hover:text-[#1A1C1E]">
              {lang === "de" ? "Zum Widerrufsrecht" : "Przejdź do prawa odstąpienia"} <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        )}

        {isReturns && (
          <>
            <section className="rounded-xl bg-amber-50 border border-amber-200 p-5 sm:p-7">
              <h2>
                {lang === "de" ? "Reklamation oder Gewährleistungsfall?" : "Reklamacja lub odpowiedzialność sprzedawcy?"}
              </h2>
              <p>
                {lang === "de"
                  ? "Im nächsten Abschnitt finden Sie den Ablauf für Mängel, Falschlieferungen und Transportschäden."
                  : "W następnej sekcji znajdziesz zasady dotyczące wad, niewłaściwych dostaw i uszkodzeń transportowych."}
              </p>
              <Link href={`${pathFor("returns", lang)}#reklamationen`} className="mt-4 inline-flex items-center gap-2 font-semibold text-[#8A5D08] hover:text-[#1A1C1E]">
                {lang === "de" ? "Weiter zu Reklamationen" : "Przejdź do reklamacji"} <ArrowDown className="h-4 w-4" />
              </Link>
            </section>

            <section id="reklamationen" className="scroll-mt-36 border-t border-[#E0E2E5] pt-8">
              <h2 className="!text-2xl">
                {lang === "de" ? complaints.title_de : complaints.title_pl}
              </h2>
              <div className="mt-7 space-y-8">
                {complaints.sections.map((section) => (
                  <div key={section.h_de}>
                    <h3>
                      {lang === "de" ? section.h_de : section.h_pl}
                    </h3>
                    <PolicyText>{lang === "de" ? section.p_de : section.p_pl}</PolicyText>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {isCookies && (
          <section className="rounded-xl bg-white border border-[#D7DADF] p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <Settings2 className="h-5 w-5 text-[#A9700A] mt-0.5 shrink-0" />
              <div>
                <h2>
                  {lang === "de" ? "Cookie-Einstellungen" : "Ustawienia cookies"}
                </h2>
                <p>
                  {lang === "de"
                    ? "Passen Sie hier Ihre Einwilligung für Analyse- und Marketing-Cookies an."
                    : "W tym miejscu możesz zmienić zgodę na cookies analityczne i marketingowe."}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-settings"))}
                  className="mt-4 border-[#C9CDD2]"
                >
                  {lang === "de" ? "Einstellungen öffnen" : "Otwórz ustawienia"}
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
