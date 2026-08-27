// Market-correct money formatting: "12 300,00 zł" (PL) / "2.990,00 €" (DE)
export function formatMoney(amount, currency) {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "—";
  const locale = currency === "PLN" ? "pl-PL" : "de-DE";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency || "PLN",
  }).format(amount);
}

export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}