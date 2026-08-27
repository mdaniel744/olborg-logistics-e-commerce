import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { useSettings } from "@/lib/useSettings";
import { pathFor } from "@/lib/routes";

export default function ContactPage() {
  const { lang, t } = useLang();
  const { settings } = useSettings();
  usePageMeta(t("contact.title"), t("contact.subtitle"));

  const company = settings?.company || {};
  const phone = company.phone || "+48 505 611 446";
  const email = company.email || "info@olborglogistics.com";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[#1A1C1E]">{t("contact.title")}</h1>
      <p className="mt-3 text-[#3A3E42] max-w-2xl leading-relaxed">{t("contact.subtitle")}</p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href={`tel:${phone.replace(/\s/g, "")}`} className="bg-white border border-[#E0E2E5] p-5 hover:border-[#E65100] transition-colors">
          <Phone className="w-5 h-5 text-[#E65100]" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#6B7075] mt-3">{t("contact.phone")}</p>
          <p className="font-semibold text-[#1A1C1E] mt-1">{phone}</p>
        </a>
        <a href={`mailto:${email}`} className="bg-white border border-[#E0E2E5] p-5 hover:border-[#E65100] transition-colors">
          <Mail className="w-5 h-5 text-[#E65100]" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#6B7075] mt-3">{t("contact.email")}</p>
          <p className="font-semibold text-[#1A1C1E] mt-1 break-all">{email}</p>
        </a>
        <div className="bg-white border border-[#E0E2E5] p-5">
          <MapPin className="w-5 h-5 text-[#E65100]" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#6B7075] mt-3">{t("contact.address")}</p>
          <p className="font-semibold text-[#1A1C1E] mt-1 text-sm">
            {company.name || "Olborg Logistics Sp. z o.o."}<br />
            {company.address_line1 || "Jana III Sobieskiego 9/23"}<br />
            {company.address_line2 || "99-200 Poddębice"}, {lang === "de" ? "Polen" : "Polska"}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#6B7075]">{t("contact.hoursNote")}</p>

      <div className="mt-10 bg-[#1A1C1E] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-heading font-bold text-lg">{t("product.quoteHint")}</p>
        <Button asChild className="bg-[#E65100] hover:bg-[#C74600] rounded-none font-semibold shrink-0">
          <Link to={pathFor("quote", lang)}>{t("common.requestQuote")}</Link>
        </Button>
      </div>
    </div>
  );
}