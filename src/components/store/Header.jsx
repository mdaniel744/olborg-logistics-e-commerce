import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, X, ShoppingCart } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useCart } from "@/lib/CartContext";
import { pathFor, CATEGORY_LANDINGS } from "@/lib/routes";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { lang, t, altPath } = useLang();
  const { count, setDrawerOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const router = useRouter();

  const primaryNavItems = [
    { label: t("nav.home"), to: pathFor("home", lang) },
    { label: t("nav.shop"), to: pathFor("shop", lang) },
  ];
  const aboutMenuItems = [
    { label: t("nav.delivery"), to: pathFor("delivery", lang) },
    { label: t("nav.guides"), to: pathFor("guides", lang) },
    { label: t("nav.faq"), to: pathFor("faq", lang) },
  ];

  const switchLang = (target) => {
    localStorage.setItem("olborg_lang", target);
    router.push(altPath(target));
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#E0E2E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-24 md:h-28">
          <Link href={pathFor("home", lang)} className="flex items-center shrink-0" aria-label="Olborg Logistics">
            <span className="relative block h-14 w-16 sm:h-16 sm:w-20 md:h-20 md:w-24">
              <Image
                src="/images/logo-olb-standard-color.png"
                alt="Olborg Logistics"
                fill
                sizes="(min-width: 768px) 96px, (min-width: 640px) 80px, 64px"
                priority
                className="object-contain"
              />
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Main">
            {primaryNavItems.map((item) => (
              <Link key={item.to} href={item.to} className="inline-flex min-h-11 items-center text-sm font-medium text-[#3A3E42] hover:text-[#795207] transition-colors">
                {item.label}
              </Link>
            ))}
            <div className="group relative">
              <Link
                href={pathFor("about", lang)}
                className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-[#3A3E42] hover:text-[#795207] transition-colors"
                aria-haspopup="menu"
              >
                {t("nav.about")}
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
              </Link>
              <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="rounded-lg border border-[#E0E2E5] bg-white p-2 shadow-xl" role="menu">
                  {aboutMenuItems.map((item) => (
                    <Link
                      key={item.to}
                      href={item.to}
                      role="menuitem"
                      className="flex min-h-11 items-center rounded-md px-3 py-2.5 text-sm font-medium text-[#3A3E42] hover:bg-[#FFF7E8] hover:text-[#795207] focus:bg-[#FFF7E8] focus:text-[#795207]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href={pathFor("contact", lang)} className="inline-flex min-h-11 items-center text-sm font-medium text-[#3A3E42] hover:text-[#795207] transition-colors">
              {t("nav.contact")}
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center font-mono text-xs font-semibold" role="group" aria-label="Language">
              <button
                onClick={() => switchLang("pl")}
                className={`min-h-10 min-w-10 rounded-md px-2 py-1 ${lang === "pl" ? "bg-[#1A1C1E] text-white" : "text-[#5F656B] hover:text-[#1A1C1E]"}`}
              >
                PL
              </button>
              <button
                onClick={() => switchLang("de")}
                className={`min-h-10 min-w-10 rounded-md px-2 py-1 ${lang === "de" ? "bg-[#1A1C1E] text-white" : "text-[#5F656B] hover:text-[#1A1C1E]"}`}
              >
                DE
              </button>
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative flex min-h-11 min-w-11 items-center justify-center p-2 text-[#1A1C1E] hover:text-[#795207] transition-colors"
              aria-label={t("nav.cart")}
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#F5A623] text-white text-[10px] font-mono font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <Button asChild className="hidden md:inline-flex bg-[#F5A623] hover:bg-[#DB930D] text-[#1A1C1E] rounded-none font-semibold">
              <Link href={pathFor("quote", lang)}>{t("nav.quoteCta")}</Link>
            </Button>
            <button className="flex min-h-11 min-w-11 items-center justify-center lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-[#E0E2E5] bg-white" aria-label="Mobile">
          <div className="px-4 py-3 space-y-1">
            {primaryNavItems.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 items-center py-2.5 text-base font-medium text-[#1A1C1E] border-b border-[#F0F1F3]"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-b border-[#F0F1F3]">
              <div className="flex items-center">
                <Link
                  href={pathFor("about", lang)}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-11 flex-1 items-center py-2.5 text-base font-medium text-[#1A1C1E]"
                >
                  {t("nav.about")}
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileAboutOpen((open) => !open)}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-[#343A40] hover:bg-[#F8F9FA]"
                  aria-label={lang === "de" ? "Menü Über uns öffnen" : "Otwórz menu O nas"}
                  aria-expanded={mobileAboutOpen}
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`} />
                </button>
              </div>
              {mobileAboutOpen && (
                <div className="mb-2 rounded-lg bg-[#F8F9FA] p-2">
                  {aboutMenuItems.map((item) => (
                    <Link
                      key={item.to}
                      href={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex min-h-11 items-center rounded-md px-3 py-2 text-base text-[#343A40] hover:bg-white hover:text-[#795207]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href={pathFor("contact", lang)}
              onClick={() => setMobileOpen(false)}
              className="flex min-h-11 items-center py-2.5 text-base font-medium text-[#1A1C1E] border-b border-[#F0F1F3]"
            >
              {t("nav.contact")}
            </Link>
            <div className="grid grid-cols-2 gap-2 pt-2 pb-1">
              {CATEGORY_LANDINGS.slice(0, 4).map((c) => (
                <Link key={c.key} href={c[lang]} onClick={() => setMobileOpen(false)} className="flex min-h-10 items-center text-sm text-[#5F656B] py-1">
                  → {c[lang].replace("/de/", "").replace("/", "").replace(/-/g, " ")}
                </Link>
              ))}
            </div>
            <Button asChild className="w-full bg-[#F5A623] hover:bg-[#DB930D] text-[#1A1C1E] rounded-none font-semibold mt-2">
              <Link href={pathFor("quote", lang)} onClick={() => setMobileOpen(false)}>
                {t("nav.quoteCta")}
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
