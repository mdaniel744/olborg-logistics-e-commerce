"use client";

import React, { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useProducts, useSettings } from "@/lib/useSettings";
import { variantGross } from "@/lib/vat";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/store/ProductCard";
import FilterChips from "@/components/store/FilterChips";
import ShopEditorialContent from "@/components/store/ShopEditorialContent";

// presetFilter comes from SEO landing routes; title/description override page meta
export default function Shop({ presetFilter, title, description, embedded = false }) {
  const { lang, market, t } = useLang();
  const { products, isLoading } = useProducts();
  const { settings } = useSettings();
  const searchParams = useSearchParams();

  const initialType = presetFilter?.type || searchParams.get("typ") || null;
  const [size, setSize] = useState(presetFilter?.size || null);
  const [type, setType] = useState(initialType);
  const [condition, setCondition] = useState(presetFilter?.condition || null);
  const [sort, setSort] = useState("recommended");
  const filterScrollerRef = useRef(null);

  const scrollFilters = (direction) => {
    const scroller = filterScrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({
      left: direction * Math.max(scroller.clientWidth * 0.78, 280),
      behavior: "smooth",
    });
  };

  const pageTitle = title || (lang === "de" ? "Container kaufen — neu und gebraucht" : "Kontenery na sprzedaż — nowe i używane");
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (size && p.size !== size) return false;
      if (type && p.container_type !== type) return false;
      if (condition && !(p.variants || []).some((v) => v.active !== false && v.condition === condition)) return false;
      return true;
    });
    const minGross = (p) => {
      const prices = (p.variants || [])
        .filter((v) => v.active !== false && (!condition || v.condition === condition))
        .map((v) => variantGross(v, settings, market))
        .filter(Boolean)
        .map((x) => x.gross);
      return prices.length ? Math.min(...prices) : Infinity;
    };
    if (sort === "price_asc") list = [...list].sort((a, b) => minGross(a) - minGross(b));
    else if (sort === "price_desc") list = [...list].sort((a, b) => minGross(b) - minGross(a));
    else if (sort === "newest") list = [...list].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    else if (sort === "size") list = [...list].sort((a, b) => parseInt(a.size) - parseInt(b.size));
    else list = [...list].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    return list;
  }, [products, size, type, condition, sort, settings, market]);

  const sortLabels = {
    recommended: lang === "de" ? "Empfohlen" : "Polecane",
    price_asc: lang === "de" ? "Preis aufsteigend" : "Cena rosnąco",
    price_desc: lang === "de" ? "Preis absteigend" : "Cena malejąco",
    newest: lang === "de" ? "Neueste" : "Najnowsze",
    size: lang === "de" ? "Größe" : "Rozmiar",
  };

  return (
    <div className={embedded ? "pt-7" : "max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14"}>
      {!embedded && (
        <>
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[#1A1C1E]">{pageTitle}</h1>
          {description && <p className="mt-3 text-[#3A3E42] max-w-3xl leading-relaxed">{description}</p>}
        </>
      )}

      <div className="mt-8 border-y border-[#E0E2E5] py-4">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-[#1A1C1E]">
            <SlidersHorizontal className="h-4 w-4 text-[#A9700A]" />
            {lang === "de" ? "Container filtern" : "Filtruj kontenery"}
          </p>
          <p className="hidden font-mono text-[10px] uppercase tracking-wider text-[#7A6A4C] sm:block">
            {lang === "de" ? "Seitlich scrollen" : "Przewiń w bok"}
          </p>
        </div>
        <div className="group/filter-strip relative">
          <div
            ref={filterScrollerRef}
            className="w-full max-w-full snap-x snap-proximity touch-pan-x scroll-smooth overflow-x-auto overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-color:#D3941B_#F1F2F3] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D3941B] [&::-webkit-scrollbar-track]:bg-[#F1F2F3] [&::-webkit-scrollbar]:h-1.5"
          >
            <div className="flex min-w-max flex-nowrap items-stretch gap-3">
              <FilterChips
                size={size} setSize={setSize}
                type={type} setType={setType}
                condition={condition} setCondition={setCondition}
                locked={presetFilter || {}}
              />
              <span className="w-px shrink-0 self-stretch bg-[#E0E2E5]" aria-hidden="true" />
              <div className="w-44 shrink-0 sm:w-56">
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="h-[112px] rounded-none border-[#E0A12D] bg-[#FFF8EA] px-4 font-semibold text-[#1A1C1E] sm:h-[124px] lg:h-[132px]" aria-label="Sort">
                    <SlidersHorizontal className="mr-2 h-5 w-5 shrink-0 text-[#A9700A]" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(sortLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => scrollFilters(-1)}
            className="pointer-events-none absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-[#E0A12D] bg-white/95 text-[#8A5A05] opacity-0 shadow-lg backdrop-blur-sm transition-[opacity,background-color] hover:bg-[#FFF0D2] focus-visible:pointer-events-auto focus-visible:opacity-100 group-hover/filter-strip:pointer-events-auto group-hover/filter-strip:opacity-100 md:flex"
            aria-label={lang === "de" ? "Filter nach links scrollen" : "Przewiń filtry w lewo"}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollFilters(1)}
            className="pointer-events-none absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-[#E0A12D] bg-white/95 text-[#8A5A05] opacity-0 shadow-lg backdrop-blur-sm transition-[opacity,background-color] hover:bg-[#FFF0D2] focus-visible:pointer-events-auto focus-visible:opacity-100 group-hover/filter-strip:pointer-events-auto group-hover/filter-strip:opacity-100 md:flex"
            aria-label={lang === "de" ? "Filter nach rechts scrollen" : "Przewiń filtry w prawo"}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-[#6B7075]">{t("common.loading")}</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-[#6B7075]">
          {lang === "de" ? "Keine Container gefunden." : "Nie znaleziono kontenerów."}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p, index) => (
            <ProductCard key={p.id} product={p} eager={index === 0} />
          ))}
        </div>
      )}

      {!embedded && <ShopEditorialContent filters={{ size, type, condition }} />}
    </div>
  );
}
