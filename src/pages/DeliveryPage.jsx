import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Package, Truck, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";
import DeliveryCalculator from "@/components/store/DeliveryCalculator";

export default function DeliveryPage() {
  const { lang, t } = useLang();
  usePageMeta(t("delivery.title"), t("delivery.subtitle"));

  const factors = [
    { icon: MapPin, text: t("delivery.f1") },
    { icon: Package, text: t("delivery.f2") },
    { icon: Truck, text: t("delivery.f3") },
    { icon: Construction, text: t("delivery.f4") },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[#1A1C1E]">{t("delivery.title")}</h1>
      <p className="mt-3 text-[#3A3E42] max-w-2xl leading-relaxed">{t("delivery.subtitle")}</p>

      <div className="mt-8">
        <DeliveryCalculator />
      </div>

      <section className="mt-12">
        <h2 className="font-heading text-xl font-bold text-[#1A1C1E] mb-5">{t("delivery.factorsTitle")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {factors.map((f, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-[#E0E2E5] p-4">
              <f.icon className="w-5 h-5 text-[#E65100] shrink-0 mt-0.5" />
              <p className="text-sm text-[#3A3E42]">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 bg-[#1A1C1E] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-heading font-bold text-lg">{t("product.deliveryQuoteRequired")}</p>
          <p className="text-sm text-white/70 mt-1">{t("product.quoteHint")}</p>
        </div>
        <Button asChild className="bg-[#E65100] hover:bg-[#C74600] rounded-none font-semibold shrink-0">
          <Link to={pathFor("quote", lang)}>{t("common.requestQuote")}</Link>
        </Button>
      </div>
    </div>
  );
}