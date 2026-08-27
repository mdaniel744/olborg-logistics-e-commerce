import React from "react";
import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { useCart } from "@/lib/CartContext";
import { useLang } from "@/lib/i18n";
import { useSettings } from "@/lib/useSettings";
import { formatMoney, round2 } from "@/lib/format";
import { computeVatTreatment, vatLabel } from "@/lib/vat";
import { pathFor } from "@/lib/routes";

export default function CartDrawer() {
  const { items, drawerOpen, setDrawerOpen, updateQuantity, removeItem } = useCart();
  const { lang, market, currency, t } = useLang();
  const { settings } = useSettings();

  const unitNet = (item) => (market === "DE" ? item.price_eur_net : item.price_pln_net);
  const netTotal = round2(items.reduce((s, i) => s + (unitNet(i) || 0) * i.quantity, 0));
  const { rate, treatment } = computeVatTreatment(settings, {
    market,
    customerType: "private",
    vatValid: false,
    deliveryCountry: market,
  });
  const gross = round2(netTotal * (1 + rate / 100));

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 rounded-none">
        <SheetHeader className="px-5 py-4 border-b border-[#E0E2E5]">
          <SheetTitle className="font-heading text-lg tracking-tight">{t("cart.title")}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <p className="text-[#6B7075]">{t("cart.empty")}</p>
            <Button asChild className="bg-[#1A1C1E] hover:bg-black rounded-none" onClick={() => setDrawerOpen(false)}>
              <Link to={pathFor("shop", lang)} onClick={() => setDrawerOpen(false)}>{t("cart.emptyCta")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.sku} className="flex gap-3 border border-[#E0E2E5] bg-white p-3">
                  {item.image && (
                    <Image src={item.image} alt={lang === "de" ? item.name_de : item.name_pl} className="w-20 h-20 object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1C1E] truncate">
                      {lang === "de" ? item.name_de : item.name_pl}
                    </p>
                    <p className="font-mono text-xs text-[#6B7075] mt-0.5">
                      {item.sku} · {lang === "de" ? item.variant_label_de : item.variant_label_pl}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#E0E2E5]">
                        <button className="p-1.5" onClick={() => updateQuantity(item.sku, item.quantity - 1)} aria-label="-">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-sm w-8 text-center">{item.quantity}</span>
                        <button className="p-1.5" onClick={() => updateQuantity(item.sku, item.quantity + 1)} aria-label="+">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-mono text-sm font-semibold">
                        {formatMoney(round2((unitNet(item) || 0) * item.quantity * (1 + rate / 100)), currency)}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.sku)} className="self-start p-1 text-[#6B7075] hover:text-red-600" aria-label={t("common.remove")}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E0E2E5] px-5 py-4 space-y-3 bg-white">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-[#6B7075]">{t("common.total")}</span>
                <div className="text-right">
                  <span className="font-heading text-xl font-bold">{formatMoney(gross, currency)}</span>
                  <p className="font-mono text-[11px] text-[#6B7075]">{vatLabel(lang, rate, treatment, settings)}</p>
                </div>
              </div>
              <p className="text-xs text-[#6B7075]">{t("cart.deliveryCalculated")}</p>
              <Button asChild className="w-full bg-[#F5A623] hover:bg-[#DB930D] !text-[#1A1C1E] rounded-none font-semibold h-11">
                <Link to={pathFor("checkout", lang)} onClick={() => setDrawerOpen(false)}>{t("common.goToCheckout")}</Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-none border-[#1A1C1E]">
                <Link to={pathFor("cart", lang)} onClick={() => setDrawerOpen(false)}>{t("common.viewCart")}</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}