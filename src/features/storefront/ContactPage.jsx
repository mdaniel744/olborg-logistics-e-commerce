"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { useSettings } from "@/lib/useSettings";
import { pathFor } from "@/lib/routes";
import SellerIdentity from "@/components/store/SellerIdentity";

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
        <a href={`tel:${phone.replace(/\s/g, "")}`} className="bg-white border border-[#E0E2E5] p-5 hover:border-[#F5A623] transition-colors">
          <Phone className="w-5 h-5 text-[#F5A623]" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#6B7075] mt-3">{t("contact.phone")}</p>
          <p className="font-semibold text-[#1A1C1E] mt-1">{phone}</p>
        </a>
        <a href={`mailto:${email}`} className="bg-white border border-[#E0E2E5] p-5 hover:border-[#F5A623] transition-colors">
          <Mail className="w-5 h-5 text-[#F5A623]" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#6B7075] mt-3">{t("contact.email")}</p>
          <p className="font-semibold text-[#1A1C1E] mt-1 break-all">{email}</p>
        </a>
        <div className="bg-white border border-[#E0E2E5] p-5">
          <MapPin className="w-5 h-5 text-[#F5A623]" />
          <p className="font-mono text-xs uppercase tracking-widest text-[#6B7075] mt-3">{lang === "de" ? "Kontaktadresse" : "Adres kontaktowy"}</p>
          <p className="font-semibold text-[#1A1C1E] mt-1 text-sm">
            {company.brand}<br />
            {company.address_line1 || "Jana III Sobieskiego 9/23"}<br />
            {company.address_line2 || "99-200 Poddębice"}, {lang === "de" ? "Polen" : "Polska"}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#6B7075]">{t("contact.hoursNote")}</p>
      <SellerIdentity lang={lang} className="mt-6 text-[#3A3E42]" />
      <p className="mt-3 text-sm leading-6 text-[#5F656B]">
        {lang === "de"
          ? "Die Kontaktadresse ist keine bestätigte Rückgabe- oder Abholstelle für Container. Bitte stimmen Sie den Standort und den Transport vor einer Anlieferung mit uns ab."
          : "Adres kontaktowy nie jest potwierdzonym miejscem zwrotu ani odbioru kontenerów. Przed dostarczeniem kontenera uzgodnij z nami lokalizację i transport."}
      </p>

      <div className="mt-10 bg-[#1A1C1E] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-heading font-bold text-lg">{t("product.quoteHint")}</p>
        <Button asChild className="bg-[#F5A623] hover:bg-[#C74600] rounded-none font-semibold shrink-0">
          <Link href={pathFor("quote", lang)}>{t("common.requestQuote")}</Link>
        </Button>
      </div>
    </div>
  );
}
