"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Box,
  ClipboardList,
  DoorOpen,
  FileText,
  MapPin,
  Ruler,
  Scale,
  Truck,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";
import RichTextContent from "@/components/store/RichTextContent";

function SpecificationIcon({ label }) {
  const normalized = label
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (/gewicht|masa|weight|ladownosc|nutzlast|payload/.test(normalized)) return <Scale aria-hidden="true" />;
  if (/drzwi|door|tur|otwor|offnung/.test(normalized)) return <DoorOpen aria-hidden="true" />;
  if (/pojemnosc|objetosc|volumen|volume|capacity/.test(normalized)) return <Box aria-hidden="true" />;
  if (/dlugosc|szerokosc|wysokosc|wymiar|lange|breite|hohe|mass|length|width|height|size|rozmiar|grosse/.test(normalized)) {
    return <Ruler aria-hidden="true" />;
  }
  return <ClipboardList aria-hidden="true" />;
}

export default function ProductInfoTabs({ product }) {
  const { lang, t } = useLang();
  const [activeTab, setActiveTab] = useState("specifications");
  const description = lang === "de" ? product.description_de : product.description_pl;
  const specs = product.specs || [];
  const tabs = [
    { id: "specifications", label: t("product.specifications"), icon: ClipboardList },
    { id: "description", label: t("product.description"), icon: FileText },
    { id: "shipping", label: t("product.shippingDelivery"), icon: Truck },
  ];

  const handleTabKeyDown = (event, index) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    setActiveTab(tabs[nextIndex].id);
    event.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
  };

  return (
    <section className="mt-14" aria-label={t("product.details")}>
      <div
        className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:#F5A623_#E9EAEC]"
        role="tablist"
        aria-label={t("product.details")}
      >
        {tabs.map(({ id, label, icon: Icon }, index) => {
          const selected = activeTab === id;
          return (
            <button
              key={id}
              id={`product-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`product-panel-${id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`inline-flex min-h-12 shrink-0 items-center gap-2 px-5 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] focus-visible:ring-offset-2 md:text-base ${
                selected
                  ? "bg-[#1A1C1E] text-white shadow-[inset_0_-3px_0_#F5A623]"
                  : "bg-[#EFF0F1] text-[#444A50] hover:bg-[#E2E4E6] hover:text-[#1A1C1E]"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 bg-[#F7F7F6] p-5 sm:p-7 lg:p-9">
        {activeTab === "specifications" && (
          <div
            id="product-panel-specifications"
            role="tabpanel"
            aria-labelledby="product-tab-specifications"
          >
            <div className="mb-6 max-w-3xl">
              <h2 className="font-heading text-xl font-bold text-[#1A1C1E] md:text-2xl">
                {t("product.specifications")}
              </h2>
              <p className="mt-2 leading-7 text-[#5F656B]">{t("product.specificationsIntro")}</p>
            </div>
            {specs.length > 0 ? (
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {specs.map((spec, index) => {
                  const label = lang === "de" ? spec.label_de || spec.label_pl : spec.label_pl || spec.label_de;
                  const value = lang === "de" ? spec.value_de || spec.value : spec.value_pl || spec.value;
                  return (
                    <div key={`${label}-${index}`} className="flex min-h-24 items-center gap-4 bg-white p-4 shadow-sm">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#FFF1D5] text-[#A66700] [&_svg]:h-5 [&_svg]:w-5">
                        <SpecificationIcon label={label || ""} />
                      </div>
                      <div className="min-w-0">
                        <dt className="text-sm leading-5 text-[#6B7075]">{label}</dt>
                        <dd className="mt-1 break-words font-mono text-base font-bold text-[#1A1C1E]">{value}</dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            ) : (
              <p className="bg-white p-5 text-[#5F656B]">{t("product.noSpecifications")}</p>
            )}
          </div>
        )}

        {activeTab === "description" && (
          <div
            id="product-panel-description"
            role="tabpanel"
            aria-labelledby="product-tab-description"
          >
            <h2 className="font-heading mb-5 text-xl font-bold text-[#1A1C1E] md:text-2xl">
              {t("product.description")}
            </h2>
            <RichTextContent content={description} className="max-w-4xl" />
          </div>
        )}

        {activeTab === "shipping" && (
          <div
            id="product-panel-shipping"
            role="tabpanel"
            aria-labelledby="product-tab-shipping"
          >
            <div className="max-w-3xl">
              <h2 className="font-heading text-xl font-bold text-[#1A1C1E] md:text-2xl">
                {t("product.shippingDelivery")}
              </h2>
              <p className="mt-2 leading-7 text-[#5F656B]">{t("product.shippingIntro")}</p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                { icon: MapPin, title: t("product.shippingAreaTitle"), text: t("product.shippingAreaText") },
                { icon: Truck, title: t("product.shippingCostTitle"), text: t("product.shippingCostText") },
                { icon: BadgeCheck, title: t("product.unloadingTitle"), text: t("product.unloadingText") },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="bg-white p-5 shadow-sm">
                  <Icon className="h-6 w-6 text-[#A66700]" aria-hidden="true" />
                  <h3 className="mt-4 font-heading text-base font-bold text-[#1A1C1E]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5F656B]">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href={pathFor("shippingPolicy", lang)}
                className="inline-flex min-h-11 items-center bg-[#F5A623] px-5 py-2.5 text-sm font-bold text-[#1A1C1E] transition-colors hover:bg-[#DB930D]"
              >
                {t("product.shippingCta")}
              </Link>
              <Link href={pathFor("returns", lang)} className="text-sm font-semibold text-[#795207] underline-offset-4 hover:underline">
                {t("product.returnsLink")}
              </Link>
              <Link href={pathFor("faq", lang)} className="text-sm font-semibold text-[#795207] underline-offset-4 hover:underline">
                FAQ
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
