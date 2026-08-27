import React from "react";
import { useLang } from "@/lib/i18n";
import Shop from "@/pages/Shop";

const META = {
  size10: {
    pl: { title: "Kontenery 10 stóp na sprzedaż", desc: "Kompaktowe kontenery magazynowe 10 stóp — nowe i używane, z dostawą w Polsce i Niemczech." },
    de: { title: "10-Fuß-Container kaufen", desc: "Kompakte 10-Fuß-Lagercontainer — neu und gebraucht, mit Lieferung in Polen und Deutschland." },
  },
  size20: {
    pl: { title: "Kontenery 20 stóp na sprzedaż", desc: "Najpopularniejszy rozmiar kontenera morskiego — 20 stóp, nowe i używane, Standard i High Cube." },
    de: { title: "20-Fuß-Container kaufen", desc: "Die beliebteste Seecontainer-Größe — 20 Fuß, neu und gebraucht, Standard und High Cube." },
  },
  size40: {
    pl: { title: "Kontenery 40 stóp na sprzedaż", desc: "Kontenery 40 stóp o pojemności do 76 m³ — idealne na duży magazyn. Nowe i używane." },
    de: { title: "40-Fuß-Container kaufen", desc: "40-Fuß-Container mit bis zu 76 m³ Volumen — ideal als großes Lager. Neu und gebraucht." },
  },
  highCube: {
    pl: { title: "Kontenery High Cube", desc: "Kontenery High Cube z dodatkowymi 30 cm wysokości — więcej przestrzeni na magazyn i adaptacje." },
    de: { title: "High-Cube-Container", desc: "High-Cube-Container mit 30 cm mehr Höhe — mehr Raum für Lagerung und Ausbauten." },
  },
  openSide: {
    pl: { title: "Kontenery Open Side", desc: "Kontenery z pełnym otwarciem bocznym — wygodny załadunek długich elementów od boku." },
    de: { title: "Open-Side-Container", desc: "Container mit vollständiger Seitenöffnung — bequemes seitliches Beladen langer Elemente." },
  },
  used: {
    pl: { title: "Kontenery używane", desc: "Sprawdzone kontenery używane, szczelne (wind & watertight), w atrakcyjnych cenach." },
    de: { title: "Gebrauchte Container", desc: "Geprüfte Gebrauchtcontainer, dicht (wind & watertight), zu attraktiven Preisen." },
  },
  new: {
    pl: { title: "Nowe kontenery (One Trip)", desc: "Fabrycznie nowe kontenery One Trip w stanie niemal idealnym — na lata użytkowania." },
    de: { title: "Neue Container (One Trip)", desc: "Fabrikneue One-Trip-Container in nahezu perfektem Zustand — für viele Jahre." },
  },
};

export default function CategoryLanding({ landing }) {
  const { lang } = useLang();
  const meta = META[landing.key]?.[lang] || {};
  return <Shop presetFilter={landing.filter} title={meta.title} description={meta.desc} />;
}