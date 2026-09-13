import { SITE_SETTINGS } from "@/data/catalog";

// One source for the legal seller, separate from the customer-facing brand.
export default function SellerIdentity({ lang = "pl", className = "" }) {
  const company = SITE_SETTINGS.company;
  return (
    <div className={`text-sm leading-6 ${className}`}>
      <p>{lang === "de" ? "Verkäufer / Rechnungsaussteller" : "Sprzedawca / wystawca faktury"}</p>
      <p className="font-semibold">{company.name}</p>
      <p>NIP: {company.nip} · KRS: {company.krs} · REGON: {company.regon}</p>
    </div>
  );
}
