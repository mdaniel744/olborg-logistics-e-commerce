"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useLang, usePageMeta } from "@/lib/i18n";
import { GUIDES } from "@/i18n/guides";
import { pathFor } from "@/lib/routes";

export default function GuidesPage() {
  const { lang, t } = useLang();
  usePageMeta(
    t("nav.guides"),
    lang === "de"
      ? "Ratgeber rund um Seecontainer: Maße, Typen, Zustand, Lieferung und Stellplatzvorbereitung."
      : "Poradnik o kontenerach morskich: wymiary, typy, stan, dostawa i przygotowanie miejsca."
  );

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 md:py-14">
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[#1A1C1E]">{t("nav.guides")}</h1>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GUIDES.map((g) => {
          const slug = lang === "de" ? g.slug_de : g.slug;
          const title = lang === "de" ? g.title_de : g.title_pl;
          return (
            <Link
              key={g.slug}
              href={`${pathFor("guides", lang)}/${slug}`}
              className="group overflow-hidden rounded-xl bg-white border border-[#D7DADF] hover:border-[#795207] transition-colors flex flex-col"
            >
              <div className="aspect-[16/9] overflow-hidden bg-[#E0E2E5]">
                <Image src={g.image} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="font-heading font-bold text-[#1A1C1E] leading-snug">{title}</h2>
                <span className="mt-auto pt-4 text-sm font-semibold text-[#795207] inline-flex items-center gap-1">
                  {t("common.seeDetails")} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
