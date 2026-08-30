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
        "10ft": "Kompakte Stellfläche für kleinere Lageraufgaben und Standorte mit wenig Raum.",
        "20ft": "Vielseitige Standardgröße mit gut planbarer Aufstellung und rund 33 m³ Volumen.",
        "40ft": "Lange, zusammenhängende Lagerfläche für größere Mengen und anspruchsvolle Projekte.",
      },
      type: {
        standard: "Klassische Bauart mit stirnseitiger Doppeltür für Lagerung, Transport und Ausbau.",
        high_cube: "Rund 30 cm zusätzliche Höhe für mehr Volumen, hohe Güter und Installationen.",
        open_side: "Großflächige Seitenöffnung für lange Güter und direkten Zugriff auf mehrere Lagerzonen.",
      },
      condition: {
        new: "Gepflegte One-Trip-Qualität für lange Nutzung, sichtbare Standorte und hochwertige Umbauten.",
        used: "Wirtschaftliche Wahl mit individuellen Gebrauchsspuren für robuste, funktionale Aufgaben.",
      },
    },
    general: {
      eyebrow: "Container auswählen",
      title: "Der richtige Container beginnt mit dem Einsatzzweck",
      intro: "Größe, Höhe, Türkonzept und Zustand beeinflussen, wie gut ein Container zu Ihrem Standort und Arbeitsablauf passt. Nutzen Sie die Filter für einen direkten Vergleich und die Kategorieseiten für vertiefende Informationen.",
      criteria: [
        ["Größe", "10 Fuß für knappe Flächen, 20 Fuß als vielseitiger Standard und 40 Fuß für große, zusammenhängende Lagerkapazität."],
        ["Bauart", "Standard für klassische Aufgaben, High Cube für mehr Höhe und Open Side für direkten seitlichen Zugang."],
        ["Zustand", "One Trip für gepflegte Optik und lange Nutzung; gebraucht für wirtschaftliche, funktionale Lagerlösungen."],
      ],
    },
    combinationEyebrow: "Aktive Filterkombination",
    combinationTitle: "Auswahlhilfe",
    combinationIntro: (selection) => `Sie sehen aktuell ${selection}. Diese Kombination verbindet die ausgewählte Größe, Bauart und/oder Zustandsklasse. Die folgenden Hinweise sind eine erste redaktionelle Grundlage und können mit weiteren technischen Details ergänzt werden.`,
    categories: "Passende Container-Kategorien",
    checklist: "Für diese Auswahl vorab klären",
    defaultChecks: ["Einsatzzweck und Lagergut genau beschreiben.", "Stellfläche und Türbereich ausmessen.", "Zufahrt und tragfähigen Untergrund prüfen.", "Transport, Entladung und Verfügbarkeit bestätigen."],
    delivery: "Lieferung prüfen",
    quote: "Individuelles Angebot anfragen",
    singleSuffix: "Auswahl, Einsatz und Planung",
    imageAlt: (selection) => `${selection} Container als Auswahlbeispiel`,
  },
  pl: {
    labels: {
      size: { "10ft": "10 stóp", "20ft": "20 stóp", "40ft": "40 stóp" },
      type: { standard: "Standard", high_cube: "High Cube", open_side: "Open Side" },
      condition: { new: "Nowy / One Trip", used: "Używany" },
    },
    details: {
      size: {
        "10ft": "Kompaktowa powierzchnia do mniejszych zadań i lokalizacji z ograniczonym miejscem.",
        "20ft": "Uniwersalny standard, łatwy do zaplanowania i oferujący około 33 m³ pojemności.",
        "40ft": "Długa, ciągła przestrzeń dla większych zapasów i wymagających projektów.",
      },
      type: {
        standard: "Klasyczna konstrukcja z dwuskrzydłowymi drzwiami czołowymi do magazynu, transportu i adaptacji.",
        high_cube: "Około 30 cm dodatkowej wysokości dla większej kubatury, wysokich towarów i instalacji.",
        open_side: "Duże otwarcie boczne do długich towarów i bezpośredniego dostępu do kilku stref.",
      },
      condition: {
        new: "Zadbana jakość One Trip do wieloletniej pracy, widocznych lokalizacji i wysokiej jakości adaptacji.",
        used: "Ekonomiczny wybór z indywidualnymi śladami pracy do trwałych, funkcjonalnych zadań.",
      },
    },
    general: {
      eyebrow: "Wybór kontenera",
      title: "Właściwy kontener zaczyna się od zastosowania",
      intro: "Rozmiar, wysokość, układ drzwi i stan wpływają na dopasowanie kontenera do lokalizacji oraz sposobu pracy. Filtry ułatwiają porównanie, a strony kategorii rozwijają najważniejsze informacje.",
      criteria: [
        ["Rozmiar", "10 stóp na małe place, 20 stóp jako uniwersalny standard i 40 stóp dla dużej, ciągłej przestrzeni."],
        ["Konstrukcja", "Standard do typowych zadań, High Cube dla większej wysokości i Open Side dla dostępu od boku."],
        ["Stan", "One Trip dla estetyki i długiej pracy; używany jako ekonomiczne rozwiązanie magazynowe."],
      ],
    },
    combinationEyebrow: "Aktywna kombinacja filtrów",
    combinationTitle: "Pomoc w wyborze",
    combinationIntro: (selection) => `Aktualnie wybrano: ${selection}. Ta kombinacja łączy wskazany rozmiar, konstrukcję i/lub stan. Poniższe informacje są pierwszą bazą redakcyjną, którą można później rozbudować o dokładniejsze dane techniczne.`,
    categories: "Powiązane kategorie kontenerów",
    checklist: "Co sprawdzić dla tego wyboru",
    defaultChecks: ["Dokładnie opisz zastosowanie i składowany towar.", "Zmierz miejsce ustawienia i strefę drzwi.", "Sprawdź dojazd oraz nośność podłoża.", "Potwierdź transport, rozładunek i dostępność."],
    delivery: "Sprawdź dostawę",
    quote: "Poproś o indywidualną ofertę",
    singleSuffix: "wybór, zastosowanie i planowanie",
    imageAlt: (selection) => `Kontener ${selection} jako przykład wyboru`,
  },
};

function activeFilterEntries(filters) {
  return ["size", "type", "condition"]
    .filter((group) => filters[group])
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
  const checks = [
    filters.size ? `${copy.labels.size[filters.size]}: ${copy.details.size[filters.size]}` : null,
    filters.type ? `${copy.labels.type[filters.type]}: ${copy.details.type[filters.type]}` : null,
    filters.condition ? `${copy.labels.condition[filters.condition]}: ${copy.details.condition[filters.condition]}` : null,
    copy.defaultChecks[2],
    copy.defaultChecks[3],
  ].filter(Boolean).slice(0, 4);

  return {
    eyebrow: copy.combinationEyebrow,
    title: `${copy.combinationTitle}: ${selection}`,
    intro: copy.combinationIntro(selection),
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
        <figure className="min-h-[360px] overflow-hidden bg-white">
          <Image
            src={content.image}
            alt={content.imageAlt}
            width={1200}
            height={900}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={content.active.length ? "h-full w-full object-contain p-6 sm:p-10" : "h-full w-full object-cover"}
          />
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
                  {lang === "de" ? "Kategorie verstehen" : "Poznaj kategorię"}
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
            <span className="font-mono text-xs uppercase tracking-[0.2em]">Logistics</span>
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
