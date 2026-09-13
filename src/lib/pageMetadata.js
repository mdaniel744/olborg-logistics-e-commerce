import { R } from "./routes.js";

const content = {
  home: [
    ["Kontenery morskie i transport", "Kontenery Standard, High Cube i Open Side. Porównaj rozmiary i stan, sprawdź ofertę Olborg Logistics oraz warunki dostawy w Polsce i Niemczech."],
    ["Seecontainer kaufen und transportieren", "Standard-, High-Cube- und Open-Side-Container: Größen und Zustand vergleichen, Angebote von Olborg Logistics und Lieferung in Polen und Deutschland prüfen."],
  ],
  shop: [["Kontenery na sprzedaż", "Przeglądaj kontenery według rozmiaru, typu, stanu i koloru. Sprawdź cenę wybranego wariantu, dane techniczne oraz dostawę."], ["Container kaufen", "Container nach Größe, Bauart, Zustand und Farbe auswählen. Prüfen Sie Variantenpreise, technische Angaben und Liefermöglichkeiten."]],
  delivery: [["Dostawa i rozładunek kontenerów", "Jak zaplanować dojazd ciężarówki, rozładunek HDS i miejsce ustawienia kontenera. Koszty transportu oraz dostawa w Polsce i Niemczech."], ["Container-Lieferung und Entladung", "LKW-Zufahrt, Kranentladung und Stellfläche für Ihren Container planen. Transportkosten und Lieferbedingungen für Polen und Deutschland."]],
  guides: [["Poradnik kontenerowy", "Praktyczne poradniki: wymiary kontenerów, Standard a High Cube, stan One Trip i używany oraz przygotowanie terenu do dostawy."], ["Container-Ratgeber", "Praktische Informationen zu Containermaßen, Standard und High Cube, One Trip und gebrauchten Containern sowie zur Vorbereitung der Lieferung."]],
  about: [["O Olborg Logistics", "Poznaj Olborg Logistics — polską firmę oferującą kontenery i organizację dostaw dla klientów w Polsce i Niemczech."], ["Über Olborg Logistics", "Olborg Logistics: ein Unternehmen aus Polen für Containerangebote und die Organisation von Lieferungen nach Polen und Deutschland."]],
  faq: [["Pytania o zakup i dostawę kontenera", "Odpowiedzi na pytania o wybór kontenera, stan, cenę, transport, rozładunek, płatność i prawa po zakupie."], ["Häufige Fragen zu Containern", "Antworten zu Containerauswahl, Zustand, Preis, Transport, Entladung, Zahlung und Rechten nach dem Kauf."]],
  contact: [["Kontakt i dane sprzedawcy", "Skontaktuj się z Olborg Logistics w sprawie kontenera lub transportu. Telefon, e-mail i dane identyfikacyjne polskiego sprzedawcy."], ["Kontakt und Verkäuferangaben", "Kontaktieren Sie Olborg Logistics zu Containern und Transport. Telefon, E-Mail und Angaben zum polnischen Verkäufer."]],
  quote: [["Wycena kontenera i transportu", "Prześlij rozmiar, typ, stan i kolor kontenera oraz miejsce dostawy, aby zapytać o ofertę i koszty transportu."], ["Container- und Transportangebot anfragen", "Größe, Bauart, Zustand und Farbe des Containers sowie den Lieferort angeben und ein Angebot mit Transportkosten anfragen."]],
  terms: [["Regulamin sprzedaży", "Dane sprzedawcy, zasady zamawiania kontenerów, płatności przelewem, dostawy i ustawowych praw klienta."], ["Allgemeine Geschäftsbedingungen", "Verkäuferangaben, Bestellung von Containern, Zahlung per Überweisung, Lieferung und gesetzliche Kundenrechte."]],
  returns: [["Zwroty, reklamacje i zwrot płatności", "Zasady odstąpienia od umowy, transport zwrotny kontenera, reklamacje oraz rozliczenie zwracanych płatności."], ["Rückgabe, Reklamationen und Erstattung", "Widerruf, Rücktransport von Containern, Reklamationen und Erstattung von Zahlungen bei Olborg Logistics."]],
  withdrawal: [["Prawo odstąpienia od umowy", "Informacje o odstąpieniu od umowy konsumenckiej, złożeniu oświadczenia i zwrocie kontenera."], ["Widerrufsrecht", "Informationen zum Verbraucherwiderruf, zur Widerrufserklärung und zur Rückgabe eines Containers."]],
  privacy: [["Polityka prywatności", "Jak przetwarzane są dane kontaktowe, zapytania, zamówienia i przesłane pliki oraz jak korzystać ze swoich praw dotyczących danych."], ["Datenschutzerklärung", "Informationen zur Verarbeitung von Kontaktdaten, Anfragen, Bestellungen und hochgeladenen Dateien sowie zu Ihren Datenschutzrechten."]],
  cookies: [["Polityka cookies i pamięci przeglądarki", "Informacje o niezbędnej pamięci przeglądarki używanej przez koszyk i ustawienia prywatności sklepu."], ["Cookies und Browserspeicher", "Informationen zum notwendigen Browserspeicher für den Warenkorb und die Datenschutzeinstellungen des Shops."]],
};

export const PUBLIC_PAGE_KEYS = Object.keys(content);

export function publicPageMetadata(path, lang) {
  const key = PUBLIC_PAGE_KEYS.find((key) => R[key][lang] === path);
  if (!key) return null;
  const [title, description] = content[key][lang === "de" ? 1 : 0];
  return { title, description, alternates: { canonical: R[key][lang], languages: R[key] } };
}
