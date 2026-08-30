export const SITE_SETTINGS = {
  company: {
    name: "Olborg Logistics Sp. z o.o.",
    address_line1: "Jana III Sobieskiego 9/23",
    address_line2: "99-200 Poddębice",
    country: "Poland",
    phone: "+48 505 611 446",
    email: "info@olborglogistics.com",
  },
  vat: {
    pl_standard_rate: 23,
    de_consumer_rate: 19,
    distance_sales_destination_vat: true,
    b2b_zero_rating_enabled: true,
    intra_eu_label_pl:
      "Wewnątrzwspólnotowa dostawa towarów — 0% VAT (odwrotne obciążenie)",
    intra_eu_label_de:
      "Innergemeinschaftliche Lieferung — 0% USt. (Reverse Charge)",
  },
  payment: {
    payment_deadline_days: 7,
    reference_format: "Order {order_number}",
  },
  brand: {
    primary_color: "#1A1C1E",
    accent_color: "#F5A623",
    logo_url: "/images/logo-olb-standard-color.png",
  },
};

const specs = (length, width, height, volume) => [
  { label_pl: "Długość zewnętrzna", label_de: "Außenlänge", value: length },
  { label_pl: "Szerokość zewnętrzna", label_de: "Außenbreite", value: width },
  { label_pl: "Wysokość zewnętrzna", label_de: "Außenhöhe", value: height },
  { label_pl: "Pojemność", label_de: "Volumen", value: volume },
];

const variant = ({ sku, condition, pln, eur, image, availability = "in_stock" }) => ({
  sku,
  condition,
  price_pln_net: pln,
  price_eur_net: eur,
  availability,
  image,
  merchant_eligible: true,
  active: true,
});

export const PRODUCTS = [
  {
    id: "container-10-standard",
    slug_pl: "kontener-10-stop-standard",
    slug_de: "10-fuss-standard-container",
    name_pl: "Kontener 10 stóp Standard",
    name_de: "10 Fuß Standard-Container",
    short_description_pl: "Kompaktowy i szczelny kontener magazynowy do miejsc o ograniczonej przestrzeni.",
    short_description_de: "Kompakter, dichter Lagercontainer für Standorte mit wenig Platz.",
    description_pl: "Kontener 10-stopowy sprawdza się jako bezpieczny magazyn na budowie, w gospodarstwie lub przy firmie. Konstrukcja stalowa i podłoga ze sklejki zapewniają trwałość w codziennym użytkowaniu.",
    description_de: "Der 10-Fuß-Container eignet sich als sicheres Lager auf Baustellen, Höfen und Betriebsgeländen. Stahlkonstruktion und Sperrholzboden sind für den täglichen Einsatz ausgelegt.",
    size: "10ft",
    container_type: "standard",
    status: "active",
    featured: true,
    featured_image: "/images/container-10.png",
    gallery: ["/images/container-door.png"],
    specs: specs("2,99 m", "2,44 m", "2,59 m", "15,9 m³"),
    variants: [
      variant({ sku: "OL-10-NEW", condition: "new", pln: 13200, eur: 3090, image: "/images/container-10.png" }),
      variant({ sku: "OL-10-USED", condition: "used", pln: 9200, eur: 2160, image: "/images/container-used.png" }),
    ],
    sort_order: 10,
  },
  {
    id: "container-20-standard",
    slug_pl: "kontener-20-stop-standard",
    slug_de: "20-fuss-standard-container",
    name_pl: "Kontener 20 stóp Standard",
    name_de: "20 Fuß Standard-Container",
    short_description_pl: "Najpopularniejszy kontener morski do magazynowania, transportu i adaptacji.",
    short_description_de: "Der meistgenutzte Seecontainer für Lagerung, Transport und Umbau.",
    description_pl: "Uniwersalny kontener 20-stopowy oferuje wygodny kompromis między pojemnością a łatwością ustawienia. Dostępny jako nowy One Trip lub sprawdzony kontener używany.",
    description_de: "Der vielseitige 20-Fuß-Container verbindet viel Stauraum mit einfacher Aufstellung. Er ist als neuer One-Trip- oder geprüfter Gebrauchtcontainer erhältlich.",
    size: "20ft",
    container_type: "standard",
    status: "active",
    featured: true,
    featured_image: "/images/container-20.png",
    gallery: ["/images/container-door.png"],
    specs: specs("6,06 m", "2,44 m", "2,59 m", "33,2 m³"),
    variants: [
      variant({ sku: "OL-20-NEW", condition: "new", pln: 16600, eur: 3890, image: "/images/container-20.png" }),
      variant({ sku: "OL-20-USED", condition: "used", pln: 10900, eur: 2550, image: "/images/container-used.png" }),
    ],
    sort_order: 20,
  },
  {
    id: "container-40-standard",
    slug_pl: "kontener-40-stop-standard",
    slug_de: "40-fuss-standard-container",
    name_pl: "Kontener 40 stóp Standard",
    name_de: "40 Fuß Standard-Container",
    short_description_pl: "Duża powierzchnia magazynowa w trwałej stalowej konstrukcji.",
    short_description_de: "Große Lagerfläche in einer robusten Stahlkonstruktion.",
    description_pl: "Kontener 40-stopowy zapewnia ponad 67 m³ przestrzeni. Polecany do dużych magazynów, logistyki i projektów wymagających długiej, niepodzielonej przestrzeni.",
    description_de: "Der 40-Fuß-Container bietet mehr als 67 m³ Raum. Ideal für große Lager, Logistik und Projekte mit langer, ungeteilter Fläche.",
    size: "40ft",
    container_type: "standard",
    status: "active",
    featured: true,
    featured_image: "/images/container-40.png",
    gallery: ["/images/container-door.png"],
    specs: specs("12,19 m", "2,44 m", "2,59 m", "67,7 m³"),
    variants: [
      variant({ sku: "OL-40-NEW", condition: "new", pln: 25200, eur: 5890, image: "/images/container-40.png" }),
      variant({ sku: "OL-40-USED", condition: "used", pln: 15400, eur: 3590, image: "/images/container-used.png" }),
    ],
    sort_order: 30,
  },
  {
    id: "container-40-high-cube",
    slug_pl: "kontener-40-stop-high-cube",
    slug_de: "40-fuss-high-cube-container",
    name_pl: "Kontener 40 stóp High Cube",
    name_de: "40 Fuß High-Cube-Container",
    short_description_pl: "Dodatkowe 30 cm wysokości dla większej kubatury i łatwiejszej adaptacji.",
    short_description_de: "30 cm zusätzliche Höhe für mehr Volumen und flexible Umbauten.",
    description_pl: "High Cube ma podwyższoną konstrukcję i około 76 m³ pojemności. To dobry wybór do składowania wysokich ładunków i adaptacji modułowych.",
    description_de: "Der High Cube ist höher gebaut und bietet rund 76 m³ Volumen. Eine gute Wahl für hohe Ladung und modulare Ausbauprojekte.",
    size: "40ft",
    container_type: "high_cube",
    status: "active",
    featured: true,
    featured_image: "/images/container-high-cube.png",
    gallery: ["/images/container-door.png"],
    specs: specs("12,19 m", "2,44 m", "2,90 m", "76,3 m³"),
    variants: [
      variant({ sku: "OL-40HC-NEW", condition: "new", pln: 27200, eur: 6350, image: "/images/container-high-cube.png" }),
      variant({ sku: "OL-40HC-USED", condition: "used", pln: 16900, eur: 3950, image: "/images/container-used.png" }),
    ],
    sort_order: 40,
  },
  {
    id: "container-20-open-side",
    slug_pl: "kontener-20-stop-open-side",
    slug_de: "20-fuss-open-side-container",
    name_pl: "Kontener 20 stóp Open Side",
    name_de: "20 Fuß Open-Side-Container",
    short_description_pl: "Pełne otwarcie boczne ułatwia załadunek długich i nietypowych elementów.",
    short_description_de: "Die vollständig zu öffnende Längsseite erleichtert das Laden langer Güter.",
    description_pl: "Kontener Open Side ma drzwi na dłuższym boku, dzięki czemu zapewnia szybki dostęp do całej przestrzeni. Sprawdza się w handlu, eventach i magazynowaniu materiałów długich.",
    description_de: "Der Open-Side-Container öffnet sich entlang der Längsseite und bietet direkten Zugang zum gesamten Innenraum. Ideal für Handel, Events und lange Materialien.",
    size: "20ft",
    container_type: "open_side",
    status: "active",
    featured: false,
    featured_image: "/images/container-open-side.png",
    gallery: [],
    specs: specs("6,06 m", "2,44 m", "2,59 m", "31,5 m³"),
    variants: [
      variant({ sku: "OL-20OS-NEW", condition: "new", pln: 31500, eur: 7350, image: "/images/container-open-side.png", availability: "on_request" }),
    ],
    sort_order: 50,
  },
];

export const DELIVERY_ZONES = [
  {
    name: "Polska — wycena standardowa",
    country: "PL",
    postal_prefixes: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    rates: [
      { size: "10ft", rate_net: 1100, additional_unit_rate_net: 850 },
      { size: "20ft", rate_net: 1450, additional_unit_rate_net: 1100 },
      { size: "40ft", rate_net: 2100, additional_unit_rate_net: 1750 },
    ],
    crane_surcharge_net: 650,
    active: true,
  },
  {
    name: "Deutschland — Standardangebot",
    country: "DE",
    postal_prefixes: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    rates: [
      { size: "10ft", rate_net: 390, additional_unit_rate_net: 310 },
      { size: "20ft", rate_net: 520, additional_unit_rate_net: 410 },
      { size: "40ft", rate_net: 760, additional_unit_rate_net: 640 },
    ],
    crane_surcharge_net: 240,
    active: true,
  },
];

export function getProductById(id) {
  return PRODUCTS.find((product) => product.id === id) || null;
}

export function getProductBySlug(slug, language = "pl") {
  const key = language === "de" ? "slug_de" : "slug_pl";
  return PRODUCTS.find((product) => product[key] === slug) || null;
}
