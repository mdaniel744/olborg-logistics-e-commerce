import React from "react";
import { useLang, usePageMeta } from "@/lib/i18n";
import { POLICIES } from "@/i18n/policies";

// Renders a bilingual legal/policy page. policyKey: terms | shipping | returns | withdrawal | complaints | privacy | cookies
export default function PolicyPage({ policyKey }) {
  const { lang } = useLang();
  const policy = POLICIES[policyKey];
  const title = lang === "de" ? policy.title_de : policy.title_pl;
  usePageMeta(title);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[#1A1C1E]">{title}</h1>
      <div className="mt-8 space-y-8">
        {policy.sections.map((s, i) => (
          <section key={i}>
            <h2 className="font-heading text-lg font-bold text-[#1A1C1E] mb-2">
              {lang === "de" ? s.h_de : s.h_pl}
            </h2>
            <p className="text-[#3A3E42] leading-relaxed whitespace-pre-line">
              {lang === "de" ? s.p_de : s.p_pl}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}