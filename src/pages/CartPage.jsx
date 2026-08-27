import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { useCart } from "@/lib/CartContext";
import { useSettings } from "@/lib/useSettings";
import { formatMoney, round2 } from "@/lib/format";
import { computeVatTreatment, vatLabel } from "@/lib/vat";
import { pathFor } from "@/lib/routes";

export default function CartPage() {
  const { lang, market, currency, t } = useLang();
  const { items, updateQuantity, removeItem } = useCart();
  const { settings } = useSettings();
  usePageMeta(t("cart.title"));

  const unitNet = (i) => (market === "DE" ? i.price_eur_net : i.price_pln_net);
  const netTotal = round2(items.reduce((s, i) => s + (unitNet(i) || 0) * i.quantity, 0));
  const { rate, treatment } = computeVatTreatment(settings, {
    market, customerType: "private", vatValid: false, deliveryCountry: market,
  });
  const vatAmount = round2(netTotal * (rate / 100));
  const gross = round2(netTotal + vatAmount);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-[#1A1C1E] mb-8">{t("cart.title")}</h1>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[#6B7075] mb-6">{t("cart.empty")}</p>
          <Button asChild className="bg-[#1A1C1E] hover:bg-black rounded-none">
            <Link to={pathFor("shop", lang)}>{t("cart.emptyCta")}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.sku} className="flex gap-4 bg-white border border-[#E0E2E5] p-4">
                {item.image && (
                  <Image src={item.image} alt={lang === "de" ? item.name_de : item.name_pl} className="w-24 h-24 object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1A1C1E]">{lang === "de" ? item.name_de : item.name_pl}</p>
                  <p className="font-mono text-xs text-[#6B7075] mt-0.5">
                    {item.sku} · {lang === "de" ? item.variant_label_de : item.variant_label_pl}
                  </p>
                  <p className="font-mono text-xs text-[#6B7075] mt-1">
                    {t("cart.unitPrice")}: {formatMoney(unitNet(item), currency)}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#E0E2E5]">
                      <button className="p-2" onClick={() => updateQuantity(item.sku, item.quantity - 1)} aria-label="-"><Minus className="w-4 h-4" /></button>
                      <span className="font-mono w-10 text-center">{item.quantity}</span>
                      <button className="p-2" onClick={() => updateQuantity(item.sku, item.quantity + 1)} aria-label="+"><Plus className="w-4 h-4" /></button>
                    </div>
                    <span className="font-mono font-semibold">{formatMoney(round2((unitNet(item) || 0) * item.quantity), currency)} {t("common.netto")}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.sku)} className="self-start p-1 text-[#6B7075] hover:text-red-600" aria-label={t("common.remove")}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <aside className="bg-white border border-[#E0E2E5] p-5 h-fit">
            <h2 className="font-heading font-bold text-[#1A1C1E] mb-4">{t("checkout.orderSummary")}</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-[#6B7075]">{t("checkout.netSubtotal")}</dt><dd className="font-mono">{formatMoney(netTotal, currency)}</dd></div>
              <div className="flex justify-between"><dt className="text-[#6B7075]">{t("common.vat")} ({rate}%)</dt><dd className="font-mono">{formatMoney(vatAmount, currency)}</dd></div>
              <div className="flex justify-between border-t border-[#E0E2E5] pt-2 font-bold"><dt>{t("common.total")}</dt><dd className="font-mono">{formatMoney(gross, currency)}</dd></div>
            </dl>
            <p className="font-mono text-[11px] text-[#6B7075] mt-2">{vatLabel(lang, rate, treatment, settings)}</p>
            <p className="text-xs text-[#6B7075] mt-3">{t("cart.deliveryCalculated")}</p>
            <Button asChild className="w-full mt-4 bg-[#F5A623] hover:bg-[#DB930D] !text-[#1A1C1E] rounded-none font-semibold h-11">
              <Link to={pathFor("checkout", lang)}>{t("common.goToCheckout")}</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full mt-2 rounded-none text-[#6B7075]">
              <Link to={pathFor("shop", lang)}>{t("common.continueShopping")}</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}