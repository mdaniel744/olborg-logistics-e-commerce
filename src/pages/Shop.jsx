import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLang, usePageMeta } from "@/lib/i18n";
import { useProducts, useSettings } from "@/lib/useSettings";
import { variantGross } from "@/lib/vat";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/store/ProductCard";
import FilterChips from "@/components/store/FilterChips";

// presetFilter comes from SEO landing routes; title/description override page meta
export default function Shop({ presetFilter, title, description }) {
  const { lang, market, t } = useLang();
  const { products, isLoading } = useProducts();
  const { settings } = useSettings();
  const [searchParams] = useSearchParams();

  const initialType = presetFilter?.type || searchParams.get("typ") || null;
  const [size, setSize] = useState(presetFilter?.size || null);
  const [type, setType] = useState(initialType);
  const [condition, setCondition] = useState(presetFilter?.condition || null);
  const [sort, setSort] = useState("recommended");

  const pageTitle = title || (lang === "de" ? "Container kaufen — neu und gebraucht" : "Kontenery na sprzedaż — nowe i używane");
  usePageMeta(pageTitle, description || t("hero.sub"));

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-[#1A1C1E]">{pageTitle}</h1>
      {description && <p className="mt-3 text-[#3A3E42] max-w-3xl leading-relaxed">{description}</p>}

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between border-y border-[#E0E2E5] py-4">
        <FilterChips
          size={size} setSize={setSize}
          type={type} setType={setType}
          condition={condition} setCondition={setCondition}
          locked={presetFilter || {}}
        />
        <div className="shrink-0 w-full sm:w-52">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="rounded-none" aria-label="Sort"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(sortLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}