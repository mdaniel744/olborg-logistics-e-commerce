// Bilingual route map. Polish = root URLs, German = /de/ prefix.
export const R = {
  home: { pl: "/", de: "/de" },
  shop: { pl: "/kontenery", de: "/de/container" },
  delivery: { pl: "/dostawa", de: "/de/lieferung" },
  guides: { pl: "/poradnik", de: "/de/ratgeber" },
  about: { pl: "/o-nas", de: "/de/ueber-uns" },
  faq: { pl: "/faq", de: "/de/faq" },
  contact: { pl: "/kontakt", de: "/de/kontakt" },
  cart: { pl: "/koszyk", de: "/de/warenkorb" },
  checkout: { pl: "/zamowienie", de: "/de/kasse" },
  confirmation: { pl: "/potwierdzenie", de: "/de/bestellbestaetigung" },
  quote: { pl: "/wycena", de: "/de/angebot" },
  terms: { pl: "/regulamin", de: "/de/agb" },
  shippingPolicy: { pl: "/dostawa-i-transport", de: "/de/versand-und-lieferung" },
  returns: { pl: "/zwroty", de: "/de/rueckgabe" },
  withdrawal: { pl: "/odstapienie-od-umowy", de: "/de/widerruf" },
  complaints: { pl: "/reklamacje", de: "/de/reklamationen" },
  privacy: { pl: "/polityka-prywatnosci", de: "/de/datenschutz" },
  cookies: { pl: "/polityka-cookies", de: "/de/cookie-richtlinie" },
};

// SEO category landing pages → shop filters
export const CATEGORY_LANDINGS = [
  { key: "size10", pl: "/kontenery-10-stop", de: "/de/10-fuss-container", filter: { size: "10ft" } },
  { key: "size20", pl: "/kontenery-20-stop", de: "/de/20-fuss-container", filter: { size: "20ft" } },
  { key: "size40", pl: "/kontenery-40-stop", de: "/de/40-fuss-container", filter: { size: "40ft" } },
  { key: "highCube", pl: "/kontenery-high-cube", de: "/de/high-cube-container", filter: { type: "high_cube" } },
  { key: "openSide", pl: "/kontenery-open-side", de: "/de/open-side-container", filter: { type: "open_side" } },
  { key: "used", pl: "/kontenery-uzywane", de: "/de/gebrauchte-container", filter: { condition: "used" } },
  { key: "new", pl: "/nowe-kontenery", de: "/de/neue-container", filter: { condition: "new" } },
];

export function pathFor(key, lang) {
  return R[key] ? R[key][lang] : lang === "de" ? "/de" : "/";
}

// Static alternate-language path for the current pathname (dynamic pages set their own)
export function getStaticAltPath(pathname, targetLang) {
  const all = [...Object.values(R), ...CATEGORY_LANDINGS];
  for (const entry of all) {
    if (entry.pl === pathname || entry.de === pathname) return entry[targetLang];
  }
  return null;
}