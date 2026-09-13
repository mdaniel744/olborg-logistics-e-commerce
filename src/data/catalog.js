export const SITE_SETTINGS = {
  company: {
    name: "OLBORG LOGISTIC SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ",
    brand: "Olborg Logistics",
    nip: "8281415227",
    krs: "0000662755",
    regon: "366537890",
    // Existing website contact address only. Registered office/depot require a current KRS extract.
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
      "Wewnątrzwspólnotowa dostawa towarów — 0% VAT, pod warunkiem spełnienia wymogów ustawowych",
    intra_eu_label_de:
      "Innergemeinschaftliche Lieferung — 0% USt., vorbehaltlich der gesetzlichen Voraussetzungen",
  },
  payment: {
    payment_deadline_days: 7,
    reference_format: "Order {order_number}",
  },
  returns: {
    // Publish confirmed VAT-inclusive estimates/ranges or maxima before B2C checkout.
    // Each market needs customer-facing { pl: "...", de: "..." } text in that market's currency.
    transport_estimates: { PL: null, DE: null },
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
    short_description_pl: "Krótki kontener z drzwiami czołowymi na narzędzia lub niewielki zapas materiałów. Przy wyborze uwzględnij wnętrze i miejsce na otwieranie drzwi.",
    short_description_de: "Kurzer Container mit Stirntüren für Werkzeug oder kleine Materialbestände. Berücksichtigen Sie Innenraum und Platz zum Öffnen der Türen.",
    description_pl: "### Magazyn na niewielkiej powierzchni\n\nFormat 10 stóp warto rozważyć, gdy potrzebujesz osobnego miejsca na narzędzia, części lub wyposażenie sezonowe, a na placu nie mieści się dłuższy kontener. Ustaw regały tak, aby pozostało przejście do rzeczy znajdujących się z tyłu.\n\n### Co sprawdzić przed wyborem\n\n- Porównaj największy przedmiot z długością wnętrza i otworem drzwiowym, nie tylko z wymiarami zewnętrznymi.\n- Zostaw miejsce na skrzydła drzwi i wózek transportowy.\n- Zaplanuj równe, nośne podparcie oraz dojazd samochodu rozładowującego.\n\nZwykły kontener magazynowy nie ma izolacji termicznej. Przy towarze wrażliwym na wilgoć potrzebna może być dodatkowa ochrona. Stan podłogi, drzwi i ewentualną przydatność do transportu trzeba potwierdzić dla konkretnego egzemplarza.",
    description_de: "### Lagerraum auf kleiner Fläche\n\nDas 10-Fuß-Format kommt infrage, wenn Werkzeug, Ersatzteile oder saisonales Material einen eigenen Platz brauchen und ein längerer Container nicht auf den Hof passt. Ordnen Sie Regale so an, dass ein Gang zu den hinteren Lagerplätzen frei bleibt.\n\n### Vor der Auswahl prüfen\n\n- Das größte Lagerstück mit Innenlänge und Türöffnung vergleichen, nicht nur mit den Außenmaßen.\n- Raum für Türflügel und Transportwagen lassen.\n- Ebene, tragfähige Auflager sowie die Zufahrt des Entladefahrzeugs planen.\n\nEin gewöhnlicher Lagercontainer ist nicht wärmegedämmt. Feuchteempfindliche Waren können zusätzlichen Schutz benötigen. Bodenzustand, Türen und eine gegebenenfalls benötigte Transporttauglichkeit sind für die konkrete Einheit zu klären.",
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
    short_description_pl: "Kontener Standard 20 stóp z dostępem od krótszego boku. Przestrzeń na regały, materiały i towary, z przejściem zaplanowanym pod codzienny załadunek.",
    short_description_de: "20-Fuß-Standardcontainer mit Zugang über die Stirnseite. Raum für Regale, Material und Waren mit einem zum täglichen Ladeablauf passenden Gang.",
    description_pl: "### Uporządkowany magazyn z wejściem od przodu\n\nKontener Standard 20 stóp pozwala rozplanować regały, miejsca na podłodze i przejście. Często używane części warto ustawić przy drzwiach, aby sięganie po nie nie wymagało przestawiania całego zapasu.\n\n### Wymiary i obciążenie\n\nTypowy model Standard tej długości ma około 33 m³ pojemności. To wartość orientacyjna: sprawdź wymiary wybranej jednostki, zwłaszcza mniejszy od wnętrza otwór drzwiowy. Przy maszynach porównaj też masę i powierzchnię podparcia — sam fakt zmieszczenia przedmiotu nie potwierdza dopuszczalnego obciążenia podłogi.\n\nPrzed dostawą ustal stronę drzwi, pozycję rozładunku i miejsce pracy ciężarówki. Stan One Trip lub używany, ślady eksploatacji i wyposażenie należy ocenić na podstawie konkretnej oferty.",
    description_de: "### Geordnetes Lager mit Zugang von vorn\n\nIm 20-Fuß-Standardcontainer lassen sich Regale, Bodenplätze und ein Laufweg anordnen. Häufig benötigte Teile gehören in Türnähe, damit für den täglichen Zugriff nicht zuerst andere Bestände bewegt werden müssen.\n\n### Maße und Belastung\n\nEin typischer Standardcontainer dieser Länge bietet etwa 33 m³ Volumen. Das ist ein Richtwert: Prüfen Sie die Maße der gewählten Einheit, besonders die gegenüber dem Innenraum kleinere Türöffnung. Bei Maschinen zählen auch Gewicht und Auflagefläche. Dass ein Gegenstand hineinpasst, bestätigt noch nicht die zulässige Bodenbelastung.\n\nLegen Sie vor der Lieferung Türseite, Absetzposition und Arbeitsfläche des LKW fest. One Trip oder gebraucht, Gebrauchsspuren und Ausstattung sind anhand des konkreten Angebots zu beurteilen.",
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
    short_description_pl: "Kontener Standard 40 stóp na większe zapasy i długie materiały. Zaplanuj dostęp do końca magazynu oraz manewrowanie zestawu przy dostawie.",
    short_description_de: "40-Fuß-Standardcontainer für größere Bestände und lange Materialien. Planen Sie den Zugang zum hinteren Lagerbereich und die LKW-Zufahrt.",
    description_pl: "### Długa przestrzeń na towary i materiały\n\nFormat 40 stóp ma około dwunastu metrów długości zewnętrznej. Może pomieścić kilka stref magazynowych, ale przy drzwiach czołowych szczególnie ważne jest wolne przejście. Rzeczy potrzebne codziennie nie powinny być blokowane przez rzadziej używane zapasy.\n\n### Więcej miejsca nie oznacza proporcjonalnie większej ładowności\n\nStandard tej wielkości ma zwykle około 68 m³ pojemności. Dopuszczalna masa i rozkład obciążenia zależą jednak od konkretnego kontenera. Długie elementy trzeba porównać nie tylko z wnętrzem, lecz także z drogą wprowadzania przez drzwi.\n\nSprawdź zakręty, przewężenia, podłoże i miejsce pracy urządzenia rozładowującego. Wolny prostokąt pod kontener nie gwarantuje jeszcze możliwości ustawienia go w tej pozycji.",
    description_de: "### Langer Innenraum für Waren und Material\n\nDas 40-Fuß-Format hat etwa zwölf Meter Außenlänge. Darin lassen sich mehrere Lagerzonen anordnen, doch bei Stirntüren ist ein freier Laufweg besonders wichtig. Täglich benötigte Dinge sollten nicht hinter selten genutzten Beständen stehen.\n\n### Mehr Raum bedeutet nicht proportional mehr Nutzlast\n\nEin Standardcontainer dieser Größe bietet üblicherweise rund 68 m³ Volumen. Zulässiges Gewicht und Lastverteilung richten sich jedoch nach der konkreten Einheit. Lange Teile müssen nicht nur in den Innenraum passen, sondern auch durch die Tür eingebracht werden können.\n\nPrüfen Sie Kurven, Engstellen, Untergrund und die Arbeitsfläche des Entladegeräts. Eine freie Fläche in Containergröße bestätigt noch nicht, dass das Absetzen an dieser Position möglich ist.",
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
    short_description_pl: "Podwyższony kontener 40 stóp na towary o dużej objętości lub planowaną zabudowę. Wysokość drzwi sprawdź niezależnie od wysokości wnętrza.",
    short_description_de: "Erhöhter 40-Fuß-Container für voluminöse Waren oder einen geplanten Innenausbau. Prüfen Sie die Türhöhe getrennt von der Innenhöhe.",
    description_pl: "### Zapas wysokości nad ładunkiem\n\nHigh Cube ma zwykle około 30 cm więcej wysokości zewnętrznej niż Standard o tej samej długości. Daje to dodatkową przestrzeń dla wysokich opakowań, regałów lub planowanego wykończenia. Typowy 40-stopowy High Cube Dry ma około 76 m³ pojemności; dokładne dane zależą od konstrukcji.\n\n### Sprawdź drogę załadunku\n\nOtwór drzwiowy jest zwykle niższy niż wnętrze. Zmierz towar razem z opakowaniem, podstawą i sprzętem potrzebnym do wprowadzenia go do środka. Przy dojeździe uwzględnij również bramy, przewody i przeszkody nad pojazdem.\n\nWiększa wysokość nie oznacza ocieplenia, gotowego biura ani zwiększonej ładowności. Izolacja, instalacje i zmiany konstrukcyjne wymagają osobnego doboru i uzgodnienia.",
    description_de: "### Höhenreserve über dem Lagergut\n\nHigh Cube bietet üblicherweise etwa 30 cm mehr Außenhöhe als Standard bei gleicher Länge. Das schafft Raum für hohe Verpackungen, Regale oder einen geplanten Innenaufbau. Ein typischer 40-Fuß-High-Cube-Dry-Container hat rund 76 m³ Volumen; die genauen Werte hängen von der Bauart ab.\n\n### Den Ladeweg prüfen\n\nDie Türöffnung ist meist niedriger als der Innenraum. Messen Sie das Lagergut einschließlich Verpackung, Transportgestell und benötigten Hebemitteln. Berücksichtigen Sie auf der Zufahrt außerdem Tore, Leitungen und Hindernisse oberhalb des Fahrzeugs.\n\nMehr Höhe bedeutet weder Dämmung noch ein fertiges Büro oder eine höhere Nutzlast. Isolierung, Installationen und konstruktive Änderungen müssen separat ausgewählt und vereinbart werden.",
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
    short_description_pl: "Kontener 20 stóp z drzwiami bocznymi do sięgania po wybrane materiały. Porównaj wolny otwór drzwiowy i potrzebne miejsce obok kontenera.",
    short_description_de: "20-Fuß-Container mit Seitentüren für den Zugriff auf einzelne Materialbestände. Vergleichen Sie freie Türöffnung und Platz neben dem Container.",
    description_pl: "### Dostęp do magazynu od dłuższego boku\n\nDrzwi boczne pozwalają sięgać po wybrane rzeczy bez przesuwania ich przez całe wnętrze do drzwi czołowych. Taki układ można rozważyć przy długich elementach lub materiale pobieranym z kilku stref magazynu.\n\n### Układ drzwi ma znaczenie\n\nSprawdź liczbę skrzydeł, ewentualne stałe słupki oraz szerokość i wysokość wolnego otworu. Nazwa Open Side nie potwierdza nieprzerwanego dostępu na całej długości każdego modelu. Nie oznacza również otwieranego dachu.\n\nNa placu zostaw miejsce na obrót drzwi i pracę osób albo sprzętu do załadunku. Równe podparcie pomaga zachować prawidłową geometrię otworu. Wymiary wnętrza i dopuszczalne obciążenia trzeba sprawdzić dla wersji bocznej, a nie przenosić ze Standard.",
    description_de: "### Zugang über die Längsseite\n\nSeitentüren machen einzelne Waren erreichbar, ohne sie erst durch den ganzen Innenraum zur Stirntür zu bewegen. Diese Anordnung kommt bei langen Bauteilen oder Material infrage, das aus mehreren Lagerzonen entnommen wird.\n\n### Die Türanordnung ist entscheidend\n\nPrüfen Sie Anzahl der Türflügel, mögliche feste Pfosten sowie Breite und Höhe der freien Öffnung. Open Side bestätigt nicht bei jedem Modell einen durchgehenden Zugang über die gesamte Länge. Die Bezeichnung bedeutet auch kein zu öffnendes Dach.\n\nLassen Sie am Standort Raum für die geöffneten Türen und den Ladeweg von Personen oder Geräten. Ebene Auflager helfen, die Geometrie der Öffnung zu erhalten. Innenmaße und Belastungsgrenzen müssen für die Seitenöffner-Bauart geprüft werden und dürfen nicht vom Standard übernommen werden.",
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
