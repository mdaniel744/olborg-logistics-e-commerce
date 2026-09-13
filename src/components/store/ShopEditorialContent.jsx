"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, PackageOpen, Ruler, Truck } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useLang } from "@/lib/i18n";
import { CATEGORY_LANDINGS, pathFor } from "@/lib/routes";
import { getCategoryContent } from "@/data/categoryContent";

const FILTER_CATEGORY_KEYS = {
  size: { "10ft": "size10", "20ft": "size20", "40ft": "size40" },
  type: { standard: "standard", high_cube: "highCube", open_side: "openSide" },
  condition: { new: "new", used: "used" },
};

const FILTER_IMAGES = {
  size: { "10ft": "/images/container-10.png", "20ft": "/images/container-20.png", "40ft": "/images/container-40.png" },
  type: { standard: "/images/container-20.png", high_cube: "/images/container-high-cube.png", open_side: "/images/container-open-side.png" },
  condition: { new: "/images/container-20.png", used: "/images/container-used.png" },
};

const FILTER_COPY = {
  de: {
    labels: {
      size: { "10ft": "10 Fuß", "20ft": "20 Fuß", "40ft": "40 Fuß" },
      type: { standard: "Standard", high_cube: "High Cube", open_side: "Open Side" },
      condition: { new: "Neu / One Trip", used: "Gebraucht" },
    },
    details: {
      size: {
        "10ft": "Rund drei Meter Außenlänge für kleine Bestände. Türbereich und Platz für das Lieferfahrzeug kommen zur Stellfläche hinzu.",
        "20ft": "Rund sechs Meter Außenlänge. Nutzbares Volumen und Türöffnung hängen von Höhe und Bauart des konkreten Produkts ab.",
        "40ft": "Rund zwölf Meter Außenlänge für größere Bestände. Zugang zu den hinteren Lagerplätzen und LKW-Rangierfläche früh planen.",
      },
      type: {
        standard: "Klassische Bauart mit stirnseitiger Doppeltür für Lagerung, Transport und Ausbau.",
        high_cube: "Rund 30 cm mehr Außenhöhe als Standard. Innenhöhe und meist niedrigere Türöffnung getrennt mit dem Ladegut vergleichen.",
        open_side: "Seitlicher Zugang zu mehreren Lagerzonen. Die freie Öffnung, Türteilung und mögliche feste Pfosten unterscheiden sich nach Modell.",
      },
      condition: {
        new: "One Trip bedeutet geringe Vornutzung nach einem ersten Transport. Leichte Umschlagspuren sind möglich; Zubehör und Farbe am Produkt prüfen.",
        used: "Gebraucht beschreibt keine einheitliche Qualitätsklasse. Türen, Boden, Reparaturen und zugesicherte Eigenschaften der Einheit vergleichen.",
      },
    },
    general: {
      eyebrow: "Container auswählen",
      title: "Was möchten Sie lagern – und wie kommen Sie daran?",
      intro: "Messen Sie das größte Lagerstück, überlegen Sie den täglichen Ladeweg und prüfen Sie die Stellfläche. Mit diesen drei Angaben lässt sich die Auswahl eingrenzen. Die Filter zeigen passende Katalogangebote; die jeweilige Produktseite beschreibt die Variante, ihren Preis und ihre Verfügbarkeit.",
      criteria: [
        ["Platz und Last", "10, 20 und 40 Fuß beschreiben die Länge. Innenmaße und Türöffnung sind kleiner als die Außenmaße. Mehr Volumen bedeutet nicht automatisch mehr zulässige Nutzlast."],
        ["Zugang und Höhe", "Standard hat meist Stirntüren, High Cube zusätzliche Höhe und Open Side Seitentüren. Höhe und Seitenzugang können in einer Einheit kombiniert sein."],
        ["Zustand und Lagerklima", "One Trip kann Transportspuren haben; gebrauchte Einheiten sind individuell zu beurteilen. Ein gewöhnlicher Dry-Container ist weder gedämmt noch klimatisiert."],
      ],
    },
    combinationEyebrow: "Aktive Filterkombination",
    combinationTitle: "Auswahlhilfe",
    combinationIntro: (selection) => `Ihre Auswahl: ${selection}. Vergleichen Sie innerhalb dieser Gruppe die tatsächlichen Innenmaße, die Türöffnung und die enthaltene Ausstattung. Die Filter legen keine einheitliche Nutzlast oder Lieferfrist fest; maßgeblich ist die ausgewählte Produktvariante.`,
    combinationAdvice: {
      standard: "Bei Stirntüren bleibt ein Laufweg besonders wichtig, wenn regelmäßig Ware aus dem hinteren Bereich gebraucht wird.",
      high_cube: "Bei hohen Gütern zählt auch der Weg durch die Tür. Verpackung und Hebemittel müssen in die freie Öffnung passen.",
      open_side: "Für den Seitenzugang muss neben dem Container dauerhaft Platz zum Öffnen und Beladen frei bleiben.",
      new: "Klären Sie besondere optische Anforderungen vorab, denn One Trip bedeutet nicht ohne Transportspuren.",
      used: "Prüfen Sie aktuelle Zustandsangaben zu Boden, Türen und Reparaturen, besonders bei feuchteempfindlichem Lagergut.",
    },
    categories: "Passende Container-Kategorien",
    checklist: "Für diese Auswahl vorab klären",
    defaultChecks: ["Lagergut einschließlich Verpackung, Gewicht und Auflageflächen beschreiben.", "Stellfläche, Türbereich und spätere Laufwege ausmessen.", "Zufahrt, Auflager und Arbeitsfläche für die Entladung prüfen.", "Transportkosten, Entladeumfang und Liefertermin für die Variante klären."],
    delivery: "Lieferung prüfen",
    quote: "Individuelles Angebot anfragen",
    singleSuffix: "Auswahl, Einsatz und Planung",
    imageAlt: (selection) => `${selection} Container als Auswahlbeispiel`,
    imageCaption: "Beispielbild zur Auswahl. Farbe, Ausstattung und Zustand richten sich nach dem jeweiligen Produkt.",
  },
  pl: {
    labels: {
      size: { "10ft": "10 stóp", "20ft": "20 stóp", "40ft": "40 stóp" },
      type: { standard: "Standard", high_cube: "High Cube", open_side: "Open Side" },
      condition: { new: "Nowy / One Trip", used: "Używany" },
    },
    details: {
      size: {
        "10ft": "Około trzech metrów długości na mniejsze zapasy. Do miejsca ustawienia dolicz strefę drzwi i plac dla samochodu.",
        "20ft": "Około sześciu metrów długości zewnętrznej. Pojemność i otwór drzwiowy zależą od wysokości oraz budowy produktu.",
        "40ft": "Około dwunastu metrów długości na większe zapasy. Wcześniej zaplanuj dostęp do końca magazynu i manewrowanie ciężarówki.",
      },
      type: {
        standard: "Klasyczna konstrukcja z dwuskrzydłowymi drzwiami czołowymi do magazynu, transportu i adaptacji.",
        high_cube: "Około 30 cm więcej wysokości zewnętrznej niż Standard. Porównaj z ładunkiem osobno wnętrze i zwykle niższy otwór drzwiowy.",
        open_side: "Boczny dostęp do kilku stref. Wolny otwór, podział drzwi i ewentualne stałe słupki zależą od modelu.",
      },
      condition: {
        new: "One Trip oznacza niewielkie wcześniejsze użycie po pierwszym transporcie. Możliwe są ślady przeładunku; kolor i dodatki sprawdź przy produkcie.",
        used: "Używany nie oznacza jednej klasy jakości. Porównaj drzwi, podłogę, naprawy i właściwości zapewnione dla egzemplarza.",
      },
    },
    general: {
      eyebrow: "Wybór kontenera",
      title: "Co chcesz przechowywać i jak po to sięgać?",
      intro: "Zmierz największy przedmiot, określ codzienną drogę załadunku i sprawdź miejsce ustawienia. Te trzy informacje pomagają zawęzić wybór. Filtry pokazują pasujące oferty katalogowe, a strona produktu opisuje wariant, jego cenę i dostępność.",
      criteria: [
        ["Miejsce i obciążenie", "10, 20 i 40 stóp określają długość. Wnętrze i otwór drzwiowy są mniejsze od wymiarów zewnętrznych. Większa kubatura nie oznacza automatycznie wyższej ładowności."],
        ["Dostęp i wysokość", "Standard zwykle ma drzwi czołowe, High Cube większą wysokość, a Open Side drzwi boczne. Wysokość i dostęp boczny można połączyć w jednym kontenerze."],
        ["Stan i warunki w środku", "One Trip może mieć ślady transportu; używane jednostki wymagają indywidualnej oceny. Zwykły kontener Dry nie jest ocieplony ani klimatyzowany."],
      ],
    },
    combinationEyebrow: "Aktywna kombinacja filtrów",
    combinationTitle: "Pomoc w wyborze",
    combinationIntro: (selection) => `Twój wybór: ${selection}. W tej grupie porównaj rzeczywiste wnętrze, otwór drzwiowy i wyposażenie w cenie. Filtry nie określają jednej ładowności ani terminu dostawy; decydują dane wybranego wariantu produktu.`,
    combinationAdvice: {
      standard: "Przy drzwiach czołowych przejście jest szczególnie ważne, jeśli często pobierasz towar z końca magazynu.",
      high_cube: "Przy wysokich przedmiotach liczy się także droga przez drzwi. Opakowanie i sprzęt do podnoszenia muszą zmieścić się w otworze.",
      open_side: "Przy dostępie bocznym obok kontenera musi stale pozostawać miejsce na otwieranie i załadunek.",
      new: "Ustal szczególne wymagania wizualne, ponieważ One Trip nie oznacza braku śladów transportu.",
      used: "Sprawdź aktualny opis podłogi, drzwi i napraw, zwłaszcza gdy towar jest wrażliwy na wilgoć.",
    },
    categories: "Powiązane kategorie kontenerów",
    checklist: "Co sprawdzić dla tego wyboru",
    defaultChecks: ["Opisz towar wraz z opakowaniem, masą i powierzchnią podparcia.", "Zmierz miejsce ustawienia, strefę drzwi i późniejsze przejścia.", "Sprawdź dojazd, podparcie i plac roboczy do rozładunku.", "Ustal koszt transportu, zakres rozładunku i termin dostawy wariantu."],
    delivery: "Sprawdź dostawę",
    quote: "Poproś o indywidualną ofertę",
    singleSuffix: "wybór, zastosowanie i planowanie",
    imageAlt: (selection) => `Kontener ${selection} jako przykład wyboru`,
    imageCaption: "Materiał poglądowy wyboru. Kolor, wyposażenie i stan wynikają z konkretnej oferty produktu.",
  },
};

function activeFilterEntries(filters) {
  return ["size", "type", "condition"]
    .filter((group) => FILTER_CATEGORY_KEYS[group]?.[filters[group]])
    .map((group) => ({ group, value: filters[group] }));
}

function categoryKeyFor(group, value) {
  return FILTER_CATEGORY_KEYS[group]?.[value] || null;
}

function buildEditorial(lang, filters) {
  const copy = FILTER_COPY[lang];
  const active = activeFilterEntries(filters);

  if (active.length === 0) {
    return {
      ...copy.general,
      image: "/images/depot.png",
      imageAlt: lang === "de" ? "Container auf einem Depot" : "Kontenery na placu",
      checks: copy.defaultChecks,
      active,
    };
  }

  if (active.length === 1) {
    const { group, value } = active[0];
    const selectedLabel = copy.labels[group][value];
    const categoryKey = categoryKeyFor(group, value);
    const category = categoryKey ? getCategoryContent(categoryKey, lang) : null;

    return {
      eyebrow: category?.eyebrow || copy.combinationEyebrow,
      title: category ? `${category.title}: ${copy.singleSuffix}` : `${copy.combinationTitle}: ${selectedLabel}`,
      intro: category?.intro?.join(" ") || copy.combinationIntro(selectedLabel),
      criteria: category?.options || [[selectedLabel, copy.details[group][value]]],
      image: category?.image || FILTER_IMAGES[group][value],
      imageAlt: category?.imageAlt || copy.imageAlt(selectedLabel),
      checks: category?.planning || copy.defaultChecks,
      active,
    };
  }

  const selection = active.map(({ group, value }) => copy.labels[group][value]).join(" · ");
  const criteria = active.map(({ group, value }) => [copy.labels[group][value], copy.details[group][value]]);
  const groupPriority = { type: 0, size: 1, condition: 2 };
  const priority = [...active].sort((a, b) => groupPriority[a.group] - groupPriority[b.group])[0];
  const advice = [copy.combinationAdvice[filters.type], copy.combinationAdvice[filters.condition]].filter(Boolean);
  const checks = [...new Set([
    ...active.map(({ group, value }) => getCategoryContent(categoryKeyFor(group, value), lang)?.planning[0]),
    copy.defaultChecks[2],
    copy.defaultChecks[3],
  ].filter(Boolean))];

  return {
    eyebrow: copy.combinationEyebrow,
    title: `${copy.combinationTitle}: ${selection}`,
    intro: [copy.combinationIntro(selection), ...advice].join(" "),
    criteria,
    image: FILTER_IMAGES[priority.group][priority.value],
    imageAlt: copy.imageAlt(selection),
    checks,
    active,
  };
}

function relevantCategoryEntries(active) {
  const preferredKeys = active.map(({ group, value }) => categoryKeyFor(group, value)).filter(Boolean);
  const orderedKeys = [...new Set([...preferredKeys, ...CATEGORY_LANDINGS.map((entry) => entry.key)])];
  return orderedKeys.map((key) => CATEGORY_LANDINGS.find((entry) => entry.key === key)).filter(Boolean).slice(0, 4);
}

export default function ShopEditorialContent({ filters }) {
  const { lang } = useLang();
  const copy = FILTER_COPY[lang];
  const content = buildEditorial(lang, filters);
  const relatedEntries = relevantCategoryEntries(content.active);

  return (
    <div className="mt-20 md:mt-24" aria-live="polite">
      <section className="grid grid-cols-1 items-stretch bg-[#F3F4F5] lg:grid-cols-2">
        <div className="p-6 sm:p-9 md:p-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8A5D08]">{content.eyebrow}</p>
          <h2 className="mt-3 max-w-xl text-3xl font-bold text-[#1A1C1E] md:text-4xl">{content.title}</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#4B5157]">{content.intro}</p>
          <div className="mt-8 space-y-6">
            {content.criteria.map(([title, description], index) => (
              <div key={`${title}-${index}`} className="grid grid-cols-[2.5rem_1fr] gap-3">
                <span className="font-mono text-sm text-[#A9700A]">0{index + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold text-[#1A1C1E]">{title}</h3>
                  <p className="mt-1 leading-7 text-[#4B5157]">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <figure className="flex min-h-[360px] flex-col overflow-hidden bg-white">
          <div className="relative min-h-[300px] flex-1">
            <Image
              src={content.image}
              alt={content.imageAlt}
              width={1200}
              height={900}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={content.active.length ? "absolute inset-0 h-full w-full object-contain p-6 sm:p-10" : "absolute inset-0 h-full w-full object-cover"}
            />
          </div>
          <figcaption className="px-6 py-4 text-sm leading-6 text-[#666C72]">{copy.imageCaption}</figcaption>
        </figure>
      </section>

      <section className="py-16 md:py-20">
        <h2 className="text-3xl font-bold text-[#1A1C1E]">{copy.categories}</h2>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {relatedEntries.map((entry) => {
            const item = getCategoryContent(entry.key, lang);
            return (
              <Link key={entry.key} href={entry[lang]} className="group flex min-h-24 flex-col justify-between bg-[#F3F4F5] p-5 transition-colors hover:bg-[#FFF0D2]">
                <span className="font-semibold text-[#1A1C1E]">{item?.title || entry.key}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8A5D08]">
                  {lang === "de" ? "Auswahlhilfe lesen" : "Przeczytaj o wyborze"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-10 bg-[#1A1C1E] p-6 sm:p-9 md:p-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
        <div>
          <div className="flex items-center gap-3 text-[#F5A623]">
            <Truck className="h-6 w-6" />
            <span className="font-mono text-xs uppercase tracking-[0.2em]">{lang === "de" ? "Transport und Aufstellung" : "Transport i ustawienie"}</span>
          </div>
          <h2 className="mt-5 text-3xl font-bold text-white md:text-4xl">{copy.checklist}</h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {content.checks.map((item) => (
              <li key={item} className="flex gap-3 leading-7 text-white/75">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#F5A623]" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <Link href={pathFor("delivery", lang)} className="inline-flex min-h-13 items-center justify-between bg-[#F5A623] px-6 py-4 font-semibold text-[#1A1C1E] hover:bg-[#E39A17]">
            <span className="inline-flex items-center gap-3"><Ruler className="h-5 w-5" /> {copy.delivery}</span><ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={pathFor("quote", lang)} className="inline-flex min-h-13 items-center justify-between bg-white px-6 py-4 font-semibold text-[#1A1C1E] hover:bg-[#F3F4F5]">
            <span className="inline-flex items-center gap-3"><PackageOpen className="h-5 w-5" /> {copy.quote}</span><ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
