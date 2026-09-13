import React, { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { pathFor } from "@/lib/routes";

const KEY = "olborg_cookie_consent";

export default function CookieConsent() {
  const { lang, t } = useLang();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
    const open = () => {
      setVisible(true);
      setShowSettings(true);
    };
    window.addEventListener("open-cookie-settings", open);
    return () => window.removeEventListener("open-cookie-settings", open);
  }, []);

  const save = () => {
    try {
      // No optional trackers are installed; do not collect consent to nonexistent purposes.
      localStorage.setItem(KEY, JSON.stringify({ essential: true, analytics: false, marketing: false, ts: Date.now() }));
    } catch {
      // Blocking browser storage must never block browsing or dismissing the notice.
    }
    setVisible(false);
    setShowSettings(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] bg-[#1A1C1E] text-white shadow-2xl" role="dialog" aria-label={lang === "de" ? "Browserspeicher" : "Pamięć przeglądarki"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <p className="text-sm text-white/80 max-w-3xl">{t("cookie.text")}</p>
        {showSettings && (
          <div className="mt-4 space-y-3 max-w-md">
            <p className="text-sm text-white/80">{lang === "de"
              ? "Aktiv: notwendiger Speicher für Warenkorb und Einstellungen. Analyse und Marketing: nicht eingesetzt. Gespeicherte Daten können Sie in den Einstellungen Ihres Browsers löschen."
              : "Aktywna jest pamięć niezbędna dla koszyka i ustawień. Analityka i marketing: nie są używane. Zapisane dane możesz usunąć w ustawieniach przeglądarki."}</p>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={save} className="bg-[#F5A623] hover:bg-[#DB930D] !text-[#1A1C1E] rounded-none font-semibold">
            {lang === "de" ? "Verstanden" : "Rozumiem"}
          </Button>
          {!showSettings && (
            <Button onClick={() => setShowSettings(true)} variant="ghost" className="rounded-none text-white/70 hover:text-white hover:bg-white/10">
              {t("cookie.settings")}
            </Button>
          )}
          <Link href={pathFor("cookies", lang)} className="self-center text-sm text-white underline underline-offset-4">
            {lang === "de" ? "Cookie-Richtlinie" : "Polityka cookies"}
          </Link>
        </div>
      </div>
    </div>
  );
}
