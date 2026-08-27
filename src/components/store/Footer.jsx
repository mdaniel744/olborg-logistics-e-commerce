import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { pathFor, CATEGORY_LANDINGS } from "@/lib/routes";

export default function Footer() {
  const { lang, t } = useLang();

  const shopLinks = CATEGORY_LANDINGS.slice(0, 6);
  const infoLinks = [
    { label: t("nav.delivery"), key: "delivery" },
    { label: t("nav.guides"), key: "guides" },
    { label: t("nav.about"), key: "about" },
    { label: t("nav.faq"), key: "faq" },
    { label: t("nav.contact"), key: "contact" },
    { label: t("nav.quoteCta"), key: "quote" },
  ];
  const policyLinks = [
    { label: lang === "de" ? "AGB" : "Regulamin sklepu", key: "terms" },
    { label: lang === "de" ? "Versand und Lieferung" : "Dostawa i transport", key: "shippingPolicy" },
    { label: lang === "de" ? "Rückgabe und Rückerstattung" : "Zwroty i zwroty płatności", key: "returns" },
    { label: lang === "de" ? "Widerrufsrecht" : "Prawo odstąpienia od umowy", key: "withdrawal" },
    { label: lang === "de" ? "Reklamationen" : "Reklamacje", key: "complaints" },
    { label: lang === "de" ? "Datenschutz" : "Polityka prywatności", key: "privacy" },
    { label: lang === "de" ? "Cookie-Richtlinie" : "Polityka cookies", key: "cookies" },
  ];

  const landingLabel = (c) => {
    const labels = {
      size10: lang === "de" ? "10-Fuß-Container" : "Kontenery 10 stóp",
      size20: lang === "de" ? "20-Fuß-Container" : "Kontenery 20 stóp",
      size40: lang === "de" ? "40-Fuß-Container" : "Kontenery 40 stóp",
      highCube: lang === "de" ? "High-Cube-Container" : "Kontenery High Cube",
      openSide: lang === "de" ? "Open-Side-Container" : "Kontenery Open Side",
      used: lang === "de" ? "Gebrauchte Container" : "Kontenery używane",
    };
    return labels[c.key] || c.key;
  };

  return (
    <footer className="bg-[#1A1C1E] text-white mt-20">
      <div className="h-px bg-[#F5A623]" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="mb-5">
              <img
                src="https://media.base44.com/images/public/6a901448048a3205edc04025/23bb84640_Olborgmainlogo.png"
                alt="Olborg Container Logistics"
                className="h-14 w-auto object-contain"
              />
            </div>
            <address className="not-italic text-sm text-white/70 space-y-2.5">
              <p className="font-semibold text-white">Olborg Logistics Sp. z o.o.</p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#F5A623]" />
                Jana III Sobieskiego 9/23
                <br />
                99-200 Poddębice, {lang === "de" ? "Polen" : "Polska"}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-[#F5A623]" />
                <a href="tel:+48505611446" className="hover:text-white">+48 505 611 446</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-[#F5A623]" />
                <a href="mailto:info@olborglogistics.com" className="hover:text-white">info@olborglogistics.com</a>
              </p>
            </address>
          </div>

          <div>
            <h3 className="font-mono text-xs tracking-[0.2em] text-white/50 uppercase mb-4">{t("footer.shopTitle")}</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to={pathFor("shop", lang)} className="text-white/80 hover:text-[#F5A623]">{t("nav.allContainers")}</Link>
              </li>
              {shopLinks.map((c) => (
                <li key={c.key}>
                  <Link to={c[lang]} className="text-white/80 hover:text-[#F5A623]">{landingLabel(c)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs tracking-[0.2em] text-white/50 uppercase mb-4">{t("footer.infoTitle")}</h3>
            <ul className="space-y-2.5 text-sm">
              {infoLinks.map((l) => (
                <li key={l.key}>
                  <Link to={pathFor(l.key, lang)} className="text-white/80 hover:text-[#F5A623]">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs tracking-[0.2em] text-white/50 uppercase mb-4">{t("footer.policiesTitle")}</h3>
            <ul className="space-y-2.5 text-sm">
              {policyLinks.map((l) => (
                <li key={l.key}>
                  <Link to={pathFor(l.key, lang)} className="text-white/80 hover:text-[#F5A623]">{l.label}</Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-settings"))}
                  className="text-white/80 hover:text-[#F5A623]"
                >
                  {t("footer.cookieSettings")}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row justify-between gap-2 font-mono text-xs text-white/40">
          <span>© {new Date().getFullYear()} Olborg Logistics Sp. z o.o. {t("footer.rights")}</span>
          <span>PL · DE — PLN · EUR</span>
        </div>
      </div>
    </footer>
  );
}