"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { GUIDES } from "@/i18n/guides";
import { pathFor } from "@/lib/routes";
import PageNotFound from "@/lib/PageNotFound";

export default function GuideDetail({ slug }) {
  const { lang, t, setDynamicAlt } = useLang();
  const guide = GUIDES.find((g) => (lang === "de" ? g.slug_de : g.slug) === slug);

  useEffect(() => {
    if (guide) {
      setDynamicAlt({
        pl: `${pathFor("guides", "pl")}/${guide.slug}`,
        de: `${pathFor("guides", "de")}/${guide.slug_de}`,
      });
    }
  }, [guide, setDynamicAlt]);

  const title = guide ? (lang === "de" ? guide.title_de : guide.title_pl) : null;
  usePageMeta(title);

  if (!guide) return <PageNotFound />;

  const body = lang === "de" ? guide.body_de : guide.body_pl;

  return (
    <article className="reading-page">
      <nav className="text-sm text-[#5F656B] mb-6" aria-label="Breadcrumb">
        <Link href={pathFor("guides", lang)} className="font-semibold hover:text-[#795207]">{t("nav.guides")}</Link>
        <span className="mx-2">/</span>
        <span className="text-[#1A1C1E]">{title}</span>
      </nav>
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#1A1C1E]">{title}</h1>
      <div className="mt-7 aspect-[16/8] overflow-hidden rounded-xl border border-[#D7DADF]">
        <Image src={guide.image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="prose max-w-none long-form-content mt-10 [&_strong]:text-[#1A1C1E] [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-2xl [&_h3]:mt-8 [&_li]:my-2">
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
      <div className="mt-14 rounded-xl bg-[#1A1C1E] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-semibold text-lg">{t("hero.ctaPrimary")}</p>
        <Button asChild className="h-11 bg-[#F5A623] hover:bg-[#E39A17] font-semibold text-[#1A1C1E] shrink-0">
          <Link href={pathFor("shop", lang)}>{t("nav.shop")}</Link>
        </Button>
      </div>
    </article>
  );
}
