"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { formatMoney } from "@/lib/format";
import { pathFor } from "@/lib/routes";
import { readLastOrder } from "@/lib/orderConfirmation";
import SellerIdentity from "@/components/store/SellerIdentity";

export default function OrderConfirmation() {
  const { lang, t } = useLang();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loaded, setLoaded] = useState(false);
  usePageMeta(t("confirmation.title"));

  useEffect(() => {
    setOrder(readLastOrder());
    setLoaded(true);
  }, []);

  const urlNr = searchParams.get("nr");
  if (!loaded) {
    return <div className="py-20 text-center text-[#6B7075]">{t("common.loading")}</div>;
  }
  if (!order || (urlNr && order.order_number !== urlNr)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-[#6B7075]">{t("notFound.title")}</p>
        <Button asChild className="mt-6 bg-[#1A1C1E] rounded-none"><Link href={pathFor("home", lang)}>{t("notFound.cta")}</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="text-center mb-10">
        <CheckCircle2 className="w-12 h-12 text-[#2E7D32] mx-auto mb-4" />
        <h1 className="font-heading text-3xl font-bold tracking-tight text-[#1A1C1E]">{t("confirmation.title")}</h1>
        <p className="font-mono text-sm text-[#6B7075] mt-3">
          {t("confirmation.orderNumber")}: <span className="font-bold text-[#1A1C1E]">{order.order_number}</span>
        </p>
        <span className="inline-block mt-3 rounded-md bg-[#FFF3E0] text-[#795207] text-sm font-semibold px-3 py-1.5">
          {t("confirmation.processing")}
        </span>
      </div>

      <SellerIdentity lang={lang} className="mb-6 text-[#3A3E42]" />
      <section className="bg-white border border-[#E0E2E5]">
        <h2 className="font-heading font-bold text-[#1A1C1E] px-4 py-3 border-b border-[#E0E2E5]">
          {t("confirmation.nextSteps")}
        </h2>
        <div className="px-4 py-4 text-sm leading-relaxed text-[#4B5157] space-y-3">
          <p>{t("confirmation.invoiceNext")}</p>
          {order.email && (
            <p className="break-words">{t("confirmation.invoiceEmail", { email: order.email })}</p>
          )}
        </div>
      </section>

      {order.totals && (
        <section className="bg-white border border-[#E0E2E5] mt-6 px-4 py-4">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-[#6B7075]">{t("checkout.itemsSubtotal")}</dt><dd className="font-mono">{formatMoney(order.totals.items_gross ?? order.totals.items_net, order.currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-[#6B7075]">{t("checkout.flatRateShipping")}</dt><dd className="font-mono">{formatMoney(order.totals.delivery_charge ?? order.totals.delivery_net, order.currency)}</dd></div>
            <div className="flex justify-between text-xs"><dt className="text-[#6B7075]">{t("checkout.includedVat")} ({order.totals.vat_rate}%)</dt><dd className="font-mono text-[#6B7075]">{formatMoney(order.totals.vat_amount, order.currency)}</dd></div>
            <div className="flex justify-between border-t border-[#E0E2E5] pt-2 font-bold"><dt>{t("common.total")}</dt><dd className="font-mono">{formatMoney(order.totals.gross_total, order.currency)}</dd></div>
          </dl>
          {order.totals.label && <p className="font-mono text-[11px] text-[#6B7075] mt-2">{order.totals.label}</p>}
          {order.delivery_quote_required && (
            <p className="text-sm text-[#795207] mt-2">{t("product.deliveryQuoteRequired")}</p>
          )}
          {order.return_transport_charge && (
            <p className="text-sm text-[#4B5157] mt-3">{t("checkout.returnTransportCharge")}: {order.return_transport_charge}</p>
          )}
        </section>
      )}

      <div className="mt-8 text-center text-sm text-[#6B7075]">
        <p>{t("confirmation.questions")}</p>
        <p className="mt-1 font-mono">
          <a href="tel:+48505611446" className="font-semibold text-[#795207] hover:underline">+48 505 611 446</a> ·{" "}
          <a href="mailto:info@olborglogistics.com" className="font-semibold text-[#795207] hover:underline">info@olborglogistics.com</a>
        </p>
        <Button asChild variant="outline" className="mt-6 rounded-none border-[#1A1C1E]">
          <Link href={pathFor("home", lang)}>{t("common.continueShopping")}</Link>
        </Button>
      </div>
    </div>
  );
}
