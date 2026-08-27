import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Truck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLang } from "@/lib/i18n";
import { formatMoney } from "@/lib/format";
import { calcDeliveryClient } from "@/lib/deliveryClient";
import { pathFor } from "@/lib/routes";

// items: optional [{size, quantity}] — when omitted, user picks a size
export default function DeliveryCalculator({ items, compact }) {
  const { lang, market, currency, t } = useLang();
  const [postalCode, setPostalCode] = useState("");
  const [size, setSize] = useState("20ft");
  const [crane, setCrane] = useState(false);
  const [result, setResult] = useState(null);

  const { data: zones } = useQuery({
    queryKey: ["delivery-zones", market],
    queryFn: () => base44.entities.DeliveryZone.filter({ country: market }),
    staleTime: 5 * 60 * 1000,
  });

  const calculate = (e) => {
    e.preventDefault();
    const calcItems = items && items.length ? items : [{ size, quantity: 1 }];
    setResult(
      calcDeliveryClient(zones || [], {
        country: market,
        postalCode,
        items: calcItems,
        craneUnloading: crane,
      })
    );
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
        <div className="flex flex-col sm:flex-row gap-3">
          {!items && (
            <div className="flex-1">
              <Label className="text-xs font-mono text-[#6B7075]">{t("delivery.containerSize")}</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="rounded-none mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10ft">10ft</SelectItem>
                  <SelectItem value="20ft">20ft</SelectItem>
                  <SelectItem value="40ft">40ft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex-1">
            <Label htmlFor="dc-postal" className="text-xs font-mono text-[#6B7075]">
              {t("product.postalCode")} ({market})
            </Label>
            <Input
              id="dc-postal"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder={market === "DE" ? "10115" : "99-200"}
              className="rounded-none mt-1 font-mono"
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="bg-[#1A1C1E] hover:bg-black rounded-none w-full sm:w-auto">
              {t("product.calculate")}
            </Button>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-[#3A3E42]">
          <Checkbox checked={crane} onCheckedChange={setCrane} />
          {t("delivery.craneUnloading")}
        </label>
      </form>

      {result && (
        <div className="mt-4 border-t border-[#E0E2E5] pt-3">
          {result.quoteRequired ? (
            <div className="text-sm">
              <p className="font-semibold text-[#1A1C1E]">{t("product.deliveryQuoteRequired")}</p>
              <Button asChild variant="link" className="px-0 text-[#A9700A]">
                <Link to={pathFor("quote", lang)}>{t("common.requestQuote")} →</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-[#6B7075]">
                {t("delivery.result")}
                {result.zone && <span className="font-mono text-xs block">{t("delivery.zone")}: {result.zone}</span>}
              </span>
              <span className="font-heading text-lg font-bold text-[#1A1C1E]">
                {formatMoney(result.cost, currency)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}