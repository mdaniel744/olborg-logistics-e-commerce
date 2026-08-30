"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { translations } from "@/i18n/translations";
import { getStaticAltPath } from "@/lib/routes";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const pathname = usePathname();
  const lang =
    pathname === "/de" || pathname.startsWith("/de/") ? "de" : "pl";
  const market = lang === "de" ? "DE" : "PL";
  const currency = lang === "de" ? "EUR" : "PLN";
  // Dynamic pages (product detail) register their alternate-language URL here
  const [dynamicAlt, setDynamicAlt] = useState(null);

  useEffect(() => {
    setDynamicAlt(null);
    document.documentElement.lang = lang === "de" ? "de-DE" : "pl-PL";
  }, [pathname, lang]);

  const t = (key, vars) => {
    const parts = key.split(".");
    let node = translations[lang];
    for (const p of parts) {
      node = node?.[p];
      if (node === undefined) return key;
    }
    if (typeof node === "string" && vars) {
      return Object.entries(vars).reduce(
        (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
        node
      );
    }
    return node;
  };

  const altPath = (targetLang) =>
    dynamicAlt?.[targetLang] ||
    getStaticAltPath(pathname, targetLang) ||
    (targetLang === "de" ? "/de" : "/");

  return (
    <LanguageContext.Provider
      value={{ lang, market, currency, t, altPath, setDynamicAlt }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

// Sets document title/description per page
export function usePageMeta(title, description) {
  useEffect(() => {
    if (title) document.title = `${title} | Olborg Logistics`;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }
  }, [title, description]);
}
