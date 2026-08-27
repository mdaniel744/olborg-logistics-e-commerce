import { IMAGES } from "@/lib/images";

// Knowledge centre articles (Poradnik / Ratgeber)
export const GUIDES = [
  {
    slug: "wymiary-kontenerow",
    slug_de: "container-masse",
    title_pl: "Wymiary kontenerów morskich — 10, 20 i 40 stóp",
    title_de: "Maße von Seecontainern — 10, 20 und 40 Fuß",
    image: IMAGES.container40ft,
    body_pl: `Kontenery morskie produkowane są według normy ISO 668, dzięki czemu ich wymiary są ujednolicone na całym świecie.\n\n**Kontener 10 stóp** ma długość zewnętrzną ok. 2,99 m, szerokość 2,44 m i wysokość 2,59 m. Sprawdza się jako kompaktowy magazyn na małych działkach.\n\n**Kontener 20 stóp** to najpopularniejszy rozmiar: ok. 6,06 m długości, 2,44 m szerokości i 2,59 m wysokości. Pojemność ok. 33 m³.\n\n**Kontener 40 stóp** ma ok. 12,19 m długości i pojemność ok. 67 m³ (wersja standardowa) lub ok. 76 m³ (High Cube).\n\nWymiary wewnętrzne są mniejsze o grubość ścian — przy planowaniu magazynowania warto sprawdzić specyfikację konkretnego produktu.`,
    body_de: `Seecontainer werden nach der Norm ISO 668 gefertigt, wodurch ihre Maße weltweit einheitlich sind.\n\n**Der 10 Fuß Container** hat eine Außenlänge von ca. 2,99 m, eine Breite von 2,44 m und eine Höhe von 2,59 m. Er eignet sich als kompaktes Lager auf kleinen Grundstücken.\n\n**Der 20 Fuß Container** ist die beliebteste Größe: ca. 6,06 m lang, 2,44 m breit und 2,59 m hoch. Volumen ca. 33 m³.\n\n**Der 40 Fuß Container** ist ca. 12,19 m lang und fasst ca. 67 m³ (Standard) bzw. ca. 76 m³ (High Cube).\n\nDie Innenmaße sind um die Wandstärke geringer — prüfen Sie bei der Lagerplanung die Spezifikation des jeweiligen Produkts.`,
  },
  {
    slug: "standard-czy-high-cube",
    slug_de: "standard-oder-high-cube",
    title_pl: "Standard czy High Cube — który kontener wybrać?",
    title_de: "Standard oder High Cube — welcher Container passt?",
    image: IMAGES.highCube,
    body_pl: `Kontener **High Cube** różni się od standardowego wyłącznie wysokością — jest o ok. 30 cm wyższy (2,89 m zamiast 2,59 m zewnętrznie).\n\nHigh Cube wybierz, gdy:\n- składujesz wysokie przedmioty lub regały,\n- planujesz adaptację kontenera (izolacja obniża wysokość wewnętrzną),\n- potrzebujesz maksymalnej pojemności.\n\nStandard wystarczy, gdy:\n- magazynujesz typowe towary na paletach,\n- liczy się niższa cena zakupu i transportu.\n\nOba typy mają identyczną długość i szerokość, więc zajmują tyle samo miejsca na działce.`,
    body_de: `Ein **High Cube-Container** unterscheidet sich vom Standardcontainer nur in der Höhe — er ist ca. 30 cm höher (2,89 m statt 2,59 m außen).\n\nWählen Sie High Cube, wenn:\n- Sie hohe Gegenstände oder Regale lagern,\n- Sie einen Ausbau planen (Dämmung reduziert die Innenhöhe),\n- Sie maximales Volumen benötigen.\n\nStandard genügt, wenn:\n- Sie typische Palettenware lagern,\n- ein günstigerer Kauf- und Transportpreis zählt.\n\nBeide Typen haben identische Länge und Breite und benötigen daher gleich viel Stellfläche.`,
  },
  {
    slug: "nowy-czy-uzywany",
    slug_de: "neu-oder-gebraucht",
    title_pl: "Kontener nowy czy używany — poradnik zakupowy",
    title_de: "Neuer oder gebrauchter Container — Kaufratgeber",
    image: IMAGES.used,
    body_pl: `**Kontener nowy (One Trip)** odbył jeden rejs z fabryki i jest w stanie niemal idealnym: równa blacha, sprawne uszczelki, estetyczny wygląd. To wybór na lata, do celów reprezentacyjnych i adaptacji.\n\n**Kontener używany** ma za sobą kilka lat eksploatacji w transporcie morskim. Może mieć rysy, wgniecenia i korozję powierzchniową, ale sprzedawane przez nas kontenery pozostają szczelne (wind & watertight).\n\nKryteria wyboru:\n- budżet — kontener używany jest wyraźnie tańszy,\n- przeznaczenie — do magazynu często wystarczy używany,\n- estetyka — do biura lub punktu sprzedaży lepszy będzie nowy.\n\nStan każdego używanego kontenera opisujemy w karcie produktu.`,
    body_de: `**Ein neuer Container (One Trip)** hat eine einzige Reise ab Werk hinter sich und ist in nahezu perfektem Zustand: glattes Blech, intakte Dichtungen, gepflegtes Erscheinungsbild. Die Wahl für viele Jahre, repräsentative Zwecke und Ausbauten.\n\n**Ein gebrauchter Container** war mehrere Jahre im Seeverkehr im Einsatz. Er kann Kratzer, Dellen und Oberflächenrost aufweisen — die von uns verkauften Container bleiben jedoch dicht (wind & watertight).\n\nAuswahlkriterien:\n- Budget — gebrauchte Container sind deutlich günstiger,\n- Verwendungszweck — für Lagerzwecke genügt oft ein gebrauchter,\n- Optik — für Büro oder Verkaufsfläche ist ein neuer besser.\n\nDen Zustand jedes gebrauchten Containers beschreiben wir auf der Produktseite.`,
  },
  {
    slug: "jak-dziala-dostawa",
    slug_de: "so-funktioniert-die-lieferung",
    title_pl: "Jak działa dostawa kontenera?",
    title_de: "So funktioniert die Containerlieferung",
    image: IMAGES.hero,
    body_pl: `Kontenery dostarczamy samochodami ciężarowymi z naczepą lub autem z HDS (dźwigiem załadunkowym).\n\n**Przebieg dostawy:**\n1. Po zamówieniu uzgadniamy termin dostawy.\n2. Kierowca dojeżdża na wskazany adres.\n3. Kontener zostaje rozładowany HDS-em lub sprzętem klienta.\n\n**Wymagania dla miejsca dostawy:**\n- utwardzona droga dojazdowa dla ciężarówki,\n- brak niskich bram, drzew i linii energetycznych nad miejscem posadowienia,\n- równe, stabilne podłoże (np. bloczki betonowe w narożach).\n\nKoszt dostawy zależy od odległości, rozmiaru kontenera i sposobu rozładunku — sprawdzisz go w kalkulatorze dostawy.`,
    body_de: `Wir liefern Container mit Sattelzügen oder LKW mit Ladekran (HDS).\n\n**Ablauf der Lieferung:**\n1. Nach der Bestellung stimmen wir den Liefertermin ab.\n2. Der Fahrer fährt die angegebene Adresse an.\n3. Der Container wird per LKW-Kran oder mit Gerät des Kunden entladen.\n\n**Anforderungen an den Lieferort:**\n- befestigte Zufahrt für einen LKW,\n- keine niedrigen Tore, Bäume oder Stromleitungen über dem Stellplatz,\n- ebener, tragfähiger Untergrund (z. B. Betonblöcke an den Ecken).\n\nDie Lieferkosten hängen von Entfernung, Containergröße und Entlademethode ab — prüfen Sie sie im Lieferkostenrechner.`,
  },
  {
    slug: "przygotowanie-miejsca",
    slug_de: "stellplatz-vorbereiten",
    title_pl: "Jak przygotować miejsce pod kontener?",
    title_de: "Den Stellplatz für den Container vorbereiten",
    image: IMAGES.container20ft,
    body_pl: `Dobre przygotowanie miejsca skraca rozładunek i wydłuża żywotność kontenera.\n\n**Podłoże:** kontener powinien opierać się na czterech narożach. Najprostsze rozwiązanie to bloczki betonowe lub płyty drogowe na wypoziomowanym gruncie.\n\n**Dojazd:** ciężarówka z 40-stopowym kontenerem potrzebuje ok. 4 m szerokości drogi i sporego promienia skrętu. Sprawdź nośność drogi dojazdowej.\n\n**Przestrzeń manewrowa:** przy rozładunku HDS auto stoi bezpośrednio przy miejscu posadowienia — nad kontenerem nie może być przeszkód.\n\nW razie wątpliwości wyślij nam zdjęcia miejsca dostawy w zapytaniu o wycenę.`,
    body_de: `Eine gute Vorbereitung des Stellplatzes verkürzt die Entladung und verlängert die Lebensdauer des Containers.\n\n**Untergrund:** Der Container sollte auf seinen vier Ecken aufliegen. Die einfachste Lösung sind Betonblöcke oder Straßenplatten auf nivelliertem Boden.\n\n**Zufahrt:** Ein LKW mit 40 Fuß Container benötigt ca. 4 m Fahrbahnbreite und einen großen Wendekreis. Prüfen Sie die Tragfähigkeit der Zufahrt.\n\n**Rangierfläche:** Bei der Entladung per LKW-Kran steht das Fahrzeug direkt am Stellplatz — über dem Container dürfen sich keine Hindernisse befinden.\n\nIm Zweifel senden Sie uns Fotos des Lieferorts mit Ihrer Angebotsanfrage.`,
  },
  {
    slug: "kontener-open-side",
    slug_de: "open-side-container",
    title_pl: "Kontener Open Side — kiedy warto go wybrać?",
    title_de: "Open Side-Container — wann lohnt er sich?",
    image: IMAGES.openSide,
    body_pl: `Kontener **Open Side** ma pełnowymiarowe drzwi na całej długości jednej ściany bocznej, oprócz standardowych drzwi czołowych.\n\n**Zalety:**\n- załadunek długich elementów wózkiem widłowym od boku,\n- łatwy dostęp do towaru w każdej części kontenera,\n- idealny na mobilny magazyn, warsztat czy punkt wydawania towarów.\n\n**Na co zwrócić uwagę:**\n- większa liczba uszczelek wymaga okresowej kontroli,\n- cena jest wyższa niż kontenera standardowego.\n\nOferujemy kontenery Open Side w rozmiarach 20 i 40 stóp.`,
    body_de: `Ein **Open Side-Container** verfügt neben den Standard-Stirntüren über vollflächige Türen entlang einer kompletten Seitenwand.\n\n**Vorteile:**\n- seitliches Beladen langer Elemente per Gabelstapler,\n- einfacher Zugriff auf Ware in jedem Bereich des Containers,\n- ideal als mobiles Lager, Werkstatt oder Ausgabestelle.\n\n**Zu beachten:**\n- mehr Dichtungen erfordern regelmäßige Kontrolle,\n- der Preis liegt über dem eines Standardcontainers.\n\nWir bieten Open Side-Container in 20 und 40 Fuß an.`,
  },
];