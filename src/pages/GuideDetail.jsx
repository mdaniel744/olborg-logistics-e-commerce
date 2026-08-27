import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { GUIDES } from "@/i18n/guides";
import { pathFor } from "@/lib/routes";
import PageNotFound from "@/lib/PageNotFound";

export default function GuideDetail() {
  const { slug } = useParams();
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
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <nav className="font-mono text-xs text-[#6B7075] mb-6" aria-label="Breadcrumb">
        <Link to={pathFor("guides", lang)} className="hover:text-[#E65100]">{t("nav.guides")}</Link>
        <span className="mx-2">/</span>
        <span className="text-[#1A1C1E]">{title}</span>
      </nav>
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[#1A1C1E]">{title}</h1>
      <div className="mt-6 aspect-[21/9] overflow-hidden border border-[#E0E2E5]">
        <Image src={guide.image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="prose prose-sm sm:prose max-w-none mt-8 text-[#3A3E42] leading-relaxed [&_strong]:text-[#1A1C1E] [&_h2]:font-heading">
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
      <div className="mt-12 bg-[#1A1C1E] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-heading font-bold text-lg">{t("hero.ctaPrimary")}</p>
        <Button asChild className="bg-[#E65100] hover:bg-[#C74600] rounded-none font-semibold shrink-0">
          <Link to={pathFor("shop", lang)}>{t("nav.shop")}</Link>
        </Button>
      </div>
    </article>
  );
}