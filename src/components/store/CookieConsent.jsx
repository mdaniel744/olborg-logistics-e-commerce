import React, { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const KEY = "olborg_cookie_consent";

export default function CookieConsent() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
    const open = () => {
      setVisible(true);
      setShowSettings(true);
    };
    window.addEventListener("open-cookie-settings", open);
    return () => window.removeEventListener("open-cookie-settings", open);
  }, []);

  const save = (a, m) => {
    localStorage.setItem(KEY, JSON.stringify({ essential: true, analytics: a, marketing: m, ts: Date.now() }));
    setVisible(false);
    setShowSettings(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] bg-[#1A1C1E] text-white shadow-2xl" role="dialog" aria-label="Cookie consent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <p className="text-sm text-white/80 max-w-3xl">{t("cookie.text")}</p>
        {showSettings && (
          <div className="mt-4 space-y-3 max-w-md">
            <div className="flex items-center justify-between text-sm">
              <span>{t("cookie.essential")}</span>
              <Switch checked disabled aria-label={t("cookie.essential")} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>{t("cookie.analytics")}</span>
              <Switch checked={analytics} onCheckedChange={setAnalytics} aria-label={t("cookie.analytics")} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>{t("cookie.marketing")}</span>
              <Switch checked={marketing} onCheckedChange={setMarketing} aria-label={t("cookie.marketing")} />
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={() => save(true, true)} className="bg-[#E65100] hover:bg-[#C74600] rounded-none font-semibold">
            {t("cookie.accept")}
          </Button>
          <Button onClick={() => save(false, false)} variant="outline" className="rounded-none border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
            {t("cookie.reject")}
          </Button>
          {showSettings ? (
            <Button onClick={() => save(analytics, marketing)} variant="ghost" className="rounded-none text-white/70 hover:text-white hover:bg-white/10">
              {t("cookie.save")}
            </Button>
          ) : (
            <Button onClick={() => setShowSettings(true)} variant="ghost" className="rounded-none text-white/70 hover:text-white hover:bg-white/10">
              {t("cookie.settings")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}