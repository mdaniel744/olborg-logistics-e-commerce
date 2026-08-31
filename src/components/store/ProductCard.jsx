import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useLang } from "@/lib/i18n";
import { useSettings } from "@/lib/useSettings";
import { formatMoney } from "@/lib/format";
import { variantGross, vatLabel } from "@/lib/vat";

export default function ProductCard({ product, eager = false }) {
  const { lang, market, currency, t } = useLang();
  const { settings } = useSettings();

  const activeVariants = (product.variants || []).filter((v) => v.active !== false);
  const prices = activeVariants
    .map((v) => variantGross(v, settings, market))
    .filter(Boolean)
    .map((p) => p.gross);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const sample = activeVariants.length ? variantGross(activeVariants[0], settings, market) : null;
  const to = lang === "de" ? `/de/${product.slug_de}` : `/${product.slug_pl}`;
  const conditions = [...new Set(activeVariants.map((v) => v.condition))];

  return (
    <Link
      href={to}
      className="group rounded-xl overflow-hidden bg-white border border-[#D7DADF] hover:border-[#795207] transition-colors flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#E0E2E5]">
        <Image
          src={product.featured_image}
          alt={lang === "de" ? product.name_de : product.name_pl}
          loading={eager ? "eager" : "lazy"}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        {product.is_demo && (
          <span className="absolute top-2 left-2 bg-[#1A1C1E]/85 text-white font-mono text-[10px] px-2 py-1">
            {t("common.demoBadge")}
          </span>
        )}
        {(product.size || product.container_type) && (
          <span className="absolute bottom-2 left-2 rounded-md bg-white/95 text-xs font-semibold px-2 py-1 text-[#1A1C1E]">
            {[product.size, product.container_type && t(`common.${product.container_type}`)]
              .filter(Boolean)
              .join(" · ")}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading font-semibold text-[#1A1C1E] leading-snug">
          {lang === "de" ? product.name_de : product.name_pl}
        </h3>
        <p className="text-sm text-[#5F656B] mt-1">
          {conditions.map((c) => t(`common.${c}`)).join(" / ")}
        </p>
        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            {minPrice !== null ? (
              <>
                <p className="font-heading text-lg font-bold text-[#1A1C1E]">
                  {t("common.from")} {formatMoney(minPrice, currency)}
                </p>
                {sample && (
                  <p className="text-xs leading-5 text-[#5F656B]">
                    {vatLabel(lang, sample.rate, "std", settings)}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-[#6B7075]">{t("common.onRequest")}</p>
            )}
          </div>
          <ArrowRight className="w-4 h-4 text-[#A9700A] group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
