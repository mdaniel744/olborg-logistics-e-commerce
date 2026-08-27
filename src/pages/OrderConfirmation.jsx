import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang, usePageMeta } from "@/lib/i18n";
import { useSettings } from "@/lib/useSettings";
import { formatMoney } from "@/lib/format";
import { pathFor } from "@/lib/routes";

function CopyRow({ label, value, copyLabel, copiedLabel }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
      <span className="text-[#6B7075] shrink-0">{label}</span>
      <span className="font-mono font-semibold text-right break-all">{value}</span>
      <button type="button" onClick={copy} className="shrink-0 text-[#6B7075] hover:text-[#F5A623]" aria-label={copyLabel}>
        {copied ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function OrderConfirmation() {
  const { lang, t } = useLang();
  const { settings } = useSettings();
  usePageMeta(t("confirmation.title"));

  let order = null;
  try {
    order = JSON.parse(sessionStorage.getItem("olborg_last_order"));
  } catch { /* empty */ }

  const urlNr = new URLSearchParams(window.location.search).get("nr");
  if (!order || (urlNr && order.order_number !== urlNr)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-[#6B7075]">{t("notFound.title")}</p>
        <Button asChild className="mt-6 bg-[#1A1C1E] rounded-none"><Link to={pathFor("home", lang)}>{t("notFound.cta")}</Link></Button>
      </div>
    );
  }

  const account = order.currency === "EUR" ? settings?.payment?.eur_account : settings?.payment?.pln_account;
  const hasBankDetails = account?.iban;
  const reference = (settings?.payment?.reference_format || "Order {order_number}").replace("{order_number}", order.order_number);
  const deadlineDays = settings?.payment?.payment_deadline_days;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="text-center mb-10">
        <CheckCircle2 className="w-12 h-12 text-[#2E7D32] mx-auto mb-4" />
        <h1 className="font-heading text-3xl font-bold tracking-tight text-[#1A1C1E]">{t("confirmation.title")}</h1>
        <p className="font-mono text-sm text-[#6B7075] mt-3">
          {t("confirmation.orderNumber")}: <span className="font-bold text-[#1A1C1E]">{order.order_number}</span>
        </p>
        <span className="inline-block mt-3 bg-[#FFF3E0] text-[#F5A623] font-mono text-xs font-semibold px-3 py-1.5">
          {t("confirmation.awaitingPayment")}
        </span>
      </div>

      <section className="bg-white border border-[#E0E2E5]">
        <h2 className="font-heading font-bold text-[#1A1C1E] px-4 py-3 border-b border-[#E0E2E5]">
          {t("confirmation.payInstructions")}
        </h2>
        {hasBankDetails ? (
          <div className="divide-y divide-[#F0F1F3]">
            <CopyRow label={t("confirmation.accountHolder")} value={account.account_holder} copyLabel={t("confirmation.copy")} />
            <CopyRow label={t("confirmation.iban")} value={account.iban} copyLabel={t("confirmation.copy")} />
            <CopyRow label={t("confirmation.bic")} value={account.bic} copyLabel={t("confirmation.copy")} />
            <CopyRow label={t("confirmation.bank")} value={account.bank_name} copyLabel={t("confirmation.copy")} />
            <CopyRow label={t("confirmation.reference")} value={reference} copyLabel={t("confirmation.copy")} />
            <CopyRow
              label={t("confirmation.amount")}
              value={order.totals ? formatMoney(order.totals.gross_total, order.currency) : ""}
              copyLabel={t("confirmation.copy")}
            />
          </div>
        ) : (
          <p className="px-4 py-4 text-sm text-[#6B7075]">{t("confirmation.bankPending")}</p>
        )}
        {typeof deadlineDays === "number" && hasBankDetails && (
          <p className="px-4 py-3 border-t border-[#E0E2E5] font-mono text-xs text-[#6B7075]">
            {t("confirmation.deadline", { days: deadlineDays })}
          </p>
        )}
      </section>

      {order.totals && (
        <section className="bg-white border border-[#E0E2E5] mt-6 px-4 py-4">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-[#6B7075]">{t("checkout.netSubtotal")}</dt><dd className="font-mono">{formatMoney(order.totals.net_subtotal, order.currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-[#6B7075]">{t("common.vat")} ({order.totals.vat_rate}%)</dt><dd className="font-mono">{formatMoney(order.totals.vat_amount, order.currency)}</dd></div>
            <div className="flex justify-between border-t border-[#E0E2E5] pt-2 font-bold"><dt>{t("common.total")}</dt><dd className="font-mono">{formatMoney(order.totals.gross_total, order.currency)}</dd></div>
          </dl>
          {order.totals.label && <p className="font-mono text-[11px] text-[#6B7075] mt-2">{order.totals.label}</p>}
          {order.delivery_quote_required && (
            <p className="text-xs text-[#F5A623] mt-2">{t("product.deliveryQuoteRequired")}</p>
          )}
        </section>
      )}

      <div className="mt-8 text-center text-sm text-[#6B7075]">
        <p>{t("confirmation.questions")}</p>
        <p className="mt-1 font-mono">
          <a href="tel:+48505611446" className="text-[#F5A623] hover:underline">+48 505 611 446</a> ·{" "}
          <a href="mailto:info@olborglogistics.com" className="text-[#F5A623] hover:underline">info@olborglogistics.com</a>
        </p>
        <Button asChild variant="outline" className="mt-6 rounded-none border-[#1A1C1E]">
          <Link to={pathFor("home", lang)}>{t("common.continueShopping")}</Link>
        </Button>
      </div>
    </div>
  );
}