import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useCart } from "@/lib/CartContext";
import { pathFor, CATEGORY_LANDINGS } from "@/lib/routes";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { lang, t, altPath } = useLang();
  const { count, setDrawerOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: t("nav.shop"), to: pathFor("shop", lang) },
    { label: t("nav.delivery"), to: pathFor("delivery", lang) },
    { label: t("nav.guides"), to: pathFor("guides", lang) },
    { label: t("nav.about"), to: pathFor("about", lang) },
    { label: t("nav.faq"), to: pathFor("faq", lang) },
    { label: t("nav.contact"), to: pathFor("contact", lang) },
  ];

  const switchLang = (target) => {
    localStorage.setItem("olborg_lang", target);
    navigate(altPath(target));
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#E0E2E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-28 md:h-32">
          <Link to={pathFor("home", lang)} className="flex items-center shrink-0" aria-label="Olborg Logistics">
            <img
              src="https://media.base44.com/images/public/6a901448048a3205edc04025/23bb84640_Olborgmainlogo.png"
              alt="Olborg Container Logistics"
              className="h-24 md:h-28 w-auto object-contain"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Main">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="text-sm font-medium text-[#3A3E42] hover:text-[#A9700A] transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center font-mono text-xs font-semibold" role="group" aria-label="Language">
              <button
                onClick={() => switchLang("pl")}
                className={`px-2 py-1 ${lang === "pl" ? "bg-[#1A1C1E] text-white" : "text-[#6B7075] hover:text-[#1A1C1E]"}`}
              >
                PL
              </button>
              <button
                onClick={() => switchLang("de")}
                className={`px-2 py-1 ${lang === "de" ? "bg-[#1A1C1E] text-white" : "text-[#6B7075] hover:text-[#1A1C1E]"}`}
              >
                DE
              </button>
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative p-2 text-[#1A1C1E] hover:text-[#A9700A] transition-colors"
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
              <Link to={pathFor("quote", lang)}>{t("nav.quoteCta")}</Link>
            </Button>
            <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-[#E0E2E5] bg-white" aria-label="Mobile">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm font-medium text-[#1A1C1E] border-b border-[#F0F1F3]"
              >
                {item.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2 pb-1">
              {CATEGORY_LANDINGS.slice(0, 4).map((c) => (
                <Link key={c.key} to={c[lang]} onClick={() => setMobileOpen(false)} className="font-mono text-xs text-[#6B7075] py-1">
                  → {c[lang].replace("/de/", "").replace("/", "").replace(/-/g, " ")}
                </Link>
              ))}
            </div>
            <Button asChild className="w-full bg-[#F5A623] hover:bg-[#DB930D] text-[#1A1C1E] rounded-none font-semibold mt-2">
              <Link to={pathFor("quote", lang)} onClick={() => setMobileOpen(false)}>
                {t("nav.quoteCta")}
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}