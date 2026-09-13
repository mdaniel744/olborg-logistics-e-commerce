import React, { useId, useState } from "react";
import Link from "next/link";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLang } from "@/lib/i18n";
import { formatMoney } from "@/lib/format";
import { calcDeliveryClient } from "@/lib/deliveryClient";
import { pathFor } from "@/lib/routes";
import { DELIVERY_ZONES, SITE_SETTINGS } from "@/data/catalog";
import { computeVatTreatment, grossFromNet } from "@/lib/vat";

// items: optional [{size, quantity}] — when omitted, user picks a size
export default function DeliveryCalculator({ items, compact }) {
  const { lang, market, t } = useLang();
  const fieldId = useId();
  const [country, setCountry] = useState(market);
  const [postalCode, setPostalCode] = useState("");
  const [size, setSize] = useState("20ft");
  const [crane, setCrane] = useState(false);
  const [calculation, setCalculation] = useState(null);

  const currency = country === "DE" ? "EUR" : "PLN";
  const calcItems = items?.length ? items : [{ size, quantity: 1 }];
  const requestKey = JSON.stringify({ country, postalCode, items: calcItems, crane });
  const result = calculation?.requestKey === requestKey ? calculation : null;
  const { rate: vatRate } = computeVatTreatment(SITE_SETTINGS, {
    market: country,
    customerType: "private",
    vatValid: false,
    deliveryCountry: country,
  });

  const calculate = (e) => {
    e.preventDefault();
    setCalculation({
      ...calcDeliveryClient(DELIVERY_ZONES, {
        country,
        postalCode,
        items: calcItems,
        craneUnloading: crane,
      }),
      requestKey,
    });
  };

  return (
    <div className={compact ? "" : "bg-white border border-[#E0E2E5] p-5"}>
      <form onSubmit={calculate} className="space-y-3">
        {!compact && (
          <p className="flex items-center gap-2 font-semibold text-[#1A1C1E]">
            <Truck className="w-4 h-4 text-[#A9700A]" />
            {t("product.checkDelivery")}
          </p>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor={`${fieldId}-country`} className="text-sm text-[#4B5157]">{t("checkout.country")}</Label>
            <Select value={country} onValueChange={(value) => {
              setCountry(value);
              setPostalCode("");
              setCalculation(null);
            }}>
              <SelectTrigger id={`${fieldId}-country`} className="rounded-none mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PL">{lang === "de" ? "Polen" : "Polska"} · PLN</SelectItem>
                <SelectItem value="DE">{lang === "de" ? "Deutschland" : "Niemcy"} · EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!items?.length && (
            <div className="flex-1">
              <Label htmlFor={`${fieldId}-size`} className="text-sm text-[#4B5157]">{t("delivery.containerSize")}</Label>
              <Select value={size} onValueChange={(value) => { setSize(value); setCalculation(null); }}>
                <SelectTrigger id={`${fieldId}-size`} className="rounded-none mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10ft">10ft</SelectItem>
                  <SelectItem value="20ft">20ft</SelectItem>
                  <SelectItem value="40ft">40ft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex-1">
            <Label htmlFor={`${fieldId}-postal`} className="text-sm text-[#4B5157]">
              {t("product.postalCode")} ({country})
            </Label>
            <Input
              id={`${fieldId}-postal`}
              value={postalCode}
              onChange={(e) => { setPostalCode(e.target.value); setCalculation(null); }}
              placeholder={country === "DE" ? "10115" : "99-200"}
              pattern={country === "DE" ? "[0-9]{5}" : "[0-9]{2}-?[0-9]{3}"}
              maxLength={country === "DE" ? 5 : 6}
              inputMode="numeric"
              autoComplete="postal-code"
              title={country === "DE" ? t("delivery.postalHintDE") : t("delivery.postalHintPL")}
              className="rounded-none mt-1 font-mono"
              required
            />
            <p className="mt-1 text-xs text-[#6B7075]">{country === "DE" ? t("delivery.postalHintDE") : t("delivery.postalHintPL")}</p>
          </div>
          <div className="flex items-end">
            <Button type="submit" className="bg-[#1A1C1E] hover:bg-black text-white rounded-none w-full sm:w-auto">
              {t("product.calculate")}
            </Button>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-[#3A3E42]">
          <Checkbox checked={crane} onCheckedChange={(value) => { setCrane(value === true); setCalculation(null); }} />
          {t("delivery.craneUnloading")}
        </label>
        <p className="text-xs leading-5 text-[#6B7075]">{t("delivery.currencyHint").replace("{currency}", currency)}</p>
      </form>

      {result && (
        <div className="mt-4 border-t border-[#E0E2E5] pt-3" role="status">
          {result.quoteRequired ? (
            <div className="text-sm">
              <p className="font-semibold text-[#1A1C1E]">{t(result.reason === "invalid_postal_code" ? "delivery.invalidPostalCode" : "product.deliveryQuoteRequired")}</p>
              <Button asChild variant="link" className="px-0 text-[#A9700A]">
                <Link href={pathFor("quote", lang)}>{t("common.requestQuote")} →</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="text-sm text-[#6B7075]">
                {t("delivery.result")}
              </span>
              <div className="text-right">
                <p className="font-heading text-lg font-bold text-[#1A1C1E]">{formatMoney(grossFromNet(result.cost, vatRate), currency)}</p>
                <p className="text-xs text-[#6B7075]">{lang === "de" ? `inkl. ${vatRate}% MwSt.` : `w tym ${vatRate}% VAT`}</p>
                <p className="mt-1 text-xs text-[#6B7075]">{formatMoney(result.cost, currency)} {t("common.netto")}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
