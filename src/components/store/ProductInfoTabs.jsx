import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useLang } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";

export default function ProductInfoTabs({ product }) {
  const { lang, t } = useLang();
  const description = lang === "de" ? product.description_de : product.description_pl;

  return (
    <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <section>
        <h2 className="font-heading text-xl font-bold text-[#1A1C1E] border-b border-[#E0E2E5] pb-3 mb-4">
          {t("product.description")}
        </h2>
        <div className="prose max-w-none long-form-content [&_h2]:mt-8 [&_h3]:mt-6 [&_li]:my-1.5">
          <ReactMarkdown>{description || ""}</ReactMarkdown>
        </div>
        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
          <Link href={pathFor("shippingPolicy", lang)} className="text-[#795207] underline-offset-4 hover:underline">
            → {lang === "de" ? "Versand und Lieferung" : "Dostawa i transport"}
          </Link>
          <Link href={pathFor("returns", lang)} className="text-[#795207] underline-offset-4 hover:underline">
            → {lang === "de" ? "Rückgabe und Rückerstattung" : "Zwroty i zwroty płatności"}
          </Link>
          <Link href={pathFor("faq", lang)} className="text-[#795207] underline-offset-4 hover:underline">→ FAQ</Link>
        </div>
      </section>
      <section>
        <h2 className="font-heading text-xl font-bold text-[#1A1C1E] border-b border-[#E0E2E5] pb-3 mb-4">
          {t("product.specifications")}
        </h2>
        <dl className="divide-y divide-[#E0E2E5] border border-[#E0E2E5] bg-white">
          {(product.specs || []).map((spec, i) => (
            <div key={i} className="flex justify-between px-4 py-2.5 text-sm">
              <dt className="text-[#6B7075]">{lang === "de" ? spec.label_de : spec.label_pl}</dt>
              <dd className="font-mono font-semibold text-[#1A1C1E]">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
