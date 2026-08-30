// Bilingual policy page content. Company-specific values (NIP, KRS, bank data,
// return address, deadlines) are pulled from admin settings — never invented here.
export const POLICIES = {
  terms: {
    title_pl: "Regulamin sklepu",
    title_de: "Allgemeine Geschäftsbedingungen",
    sections: [
      {
        h_pl: "1. Sprzedawca",
        h_de: "1. Verkäufer",
        p_pl: "Sklep internetowy prowadzony jest przez Olborg Logistics Sp. z o.o., Jana III Sobieskiego 9/23, 99-200 Poddębice, Polska. Kontakt: +48 505 611 446, info@olborglogistics.com. Dane rejestrowe spółki (NIP, KRS, REGON) publikowane są w sekcji Dane firmy po ich uzupełnieniu przez administratora.",
        p_de: "Der Online-Shop wird betrieben von Olborg Logistics Sp. z o.o., Jana III Sobieskiego 9/23, 99-200 Poddębice, Polen. Kontakt: +48 505 611 446, info@olborglogistics.com. Die Registerdaten der Gesellschaft (NIP, KRS, REGON) werden im Bereich Unternehmensangaben veröffentlicht, sobald sie vom Administrator hinterlegt sind.",
      },
      {
        h_pl: "2. Zamówienia",
        h_de: "2. Bestellungen",
        p_pl: "Zamówienia można składać przez sklep internetowy w języku polskim lub niemieckim. Złożenie zamówienia przyciskiem „Kupuję i płacę” stanowi ofertę zawarcia umowy sprzedaży. Umowa zostaje zawarta z chwilą potwierdzenia zamówienia przez sprzedawcę.",
        p_de: "Bestellungen können über den Online-Shop in polnischer oder deutscher Sprache aufgegeben werden. Mit dem Klick auf „Zahlungspflichtig bestellen“ geben Sie ein verbindliches Angebot zum Abschluss eines Kaufvertrags ab. Der Vertrag kommt mit der Bestellbestätigung durch den Verkäufer zustande.",
      },
      {
        h_pl: "3. Ceny i płatność",
        h_de: "3. Preise und Zahlung",
        p_pl: "Ceny na polskiej wersji sklepu podawane są w PLN brutto (z VAT), a na niemieckiej w EUR brutto, chyba że zastosowanie ma wewnątrzwspólnotowa dostawa towarów 0% VAT dla zweryfikowanych firm. Płatność następuje przelewem bankowym na rachunek wskazany w potwierdzeniu zamówienia.",
        p_de: "Preise in der polnischen Shop-Version werden in PLN brutto (inkl. USt.), in der deutschen Version in EUR brutto angegeben, sofern nicht die innergemeinschaftliche Lieferung mit 0% USt. für verifizierte Unternehmen zur Anwendung kommt. Die Zahlung erfolgt per Banküberweisung auf das in der Bestellbestätigung genannte Konto.",
      },
      {
        h_pl: "4. Dostawa",
        h_de: "4. Lieferung",
        p_pl: "Dostawy realizowane są na terenie Polski i Niemiec. Koszt dostawy obliczany jest na podstawie kodu pocztowego lub ustalany indywidualnie. Szczegóły znajdują się na stronie Dostawa.",
        p_de: "Lieferungen erfolgen innerhalb Polens und nach Deutschland. Die Lieferkosten werden anhand der Postleitzahl berechnet oder individuell vereinbart. Details finden Sie auf der Seite Lieferung.",
      },
      {
        h_pl: "5. Reklamacje i odstąpienie",
        h_de: "5. Reklamation und Widerruf",
        p_pl: "Zasady reklamacji oraz prawo odstąpienia od umowy opisane są na osobnych stronach: Reklamacje oraz Prawo odstąpienia od umowy. Postanowienia regulaminu nie wyłączają bezwzględnie obowiązujących praw konsumenta.",
        p_de: "Die Regeln für Reklamationen und das Widerrufsrecht sind auf gesonderten Seiten beschrieben: Reklamationen sowie Widerrufsrecht. Die Bestimmungen dieser AGB schränken zwingende Verbraucherrechte nicht ein.",
      },
    ],
  },
  shipping: {
    title_pl: "Dostawa i transport",
    title_de: "Versand und Lieferung",
    sections: [
      {
        h_pl: "Obszar dostaw",
        h_de: "Liefergebiet",
        p_pl: "Dostarczamy kontenery na terenie Polski oraz do Niemiec. Transport realizowany jest samochodem ciężarowym z naczepą lub autem z HDS (dźwigiem załadunkowym).",
        p_de: "Wir liefern Container innerhalb Polens und nach Deutschland. Der Transport erfolgt per Sattelzug oder LKW mit Ladekran (HDS).",
      },
      {
        h_pl: "Obliczanie kosztu dostawy",
        h_de: "Berechnung der Lieferkosten",
        p_pl: "Koszt dostawy zależy od kodu pocztowego, rozmiaru i liczby kontenerów oraz sposobu rozładunku. Jeżeli automatyczne obliczenie nie jest możliwe, koszt dostawy wymaga indywidualnej wyceny.",
        p_de: "Die Lieferkosten hängen von Postleitzahl, Größe und Anzahl der Container sowie der Entlademethode ab. Ist eine automatische Berechnung nicht möglich, müssen die Lieferkosten individuell kalkuliert werden.",
      },
      {
        h_pl: "Wymagania dotyczące miejsca dostawy",
        h_de: "Anforderungen an den Lieferort",
        p_pl: "Klient zapewnia utwardzoną drogę dojazdową dla ciężarówki, przestrzeń manewrową oraz miejsce posadowienia wolne od przeszkód (bramy, drzewa, linie energetyczne). Termin dostawy uzgadniany jest po zaksięgowaniu płatności.",
        p_de: "Der Kunde stellt eine befestigte LKW-Zufahrt, Rangierfläche sowie einen hindernisfreien Stellplatz (Tore, Bäume, Stromleitungen) sicher. Der Liefertermin wird nach Zahlungseingang abgestimmt.",
      },
      {
        h_pl: "Kontrola przy odbiorze",
        h_de: "Prüfung bei Anlieferung",
        p_pl: "Prosimy o sprawdzenie kontenera przy dostawie. Widoczne uszkodzenia transportowe należy odnotować w protokole dostawy i niezwłocznie zgłosić sprzedawcy.",
        p_de: "Bitte prüfen Sie den Container bei der Anlieferung. Sichtbare Transportschäden sind im Lieferprotokoll zu vermerken und dem Verkäufer unverzüglich zu melden.",
      },
      {
        h_pl: "Nieudana dostawa",
        h_de: "Fehlgeschlagene Lieferung",
        p_pl: "Jeżeli dostawa nie może zostać zrealizowana z przyczyn leżących po stronie klienta (brak dojazdu, brak przygotowanego miejsca), koszty ponownego transportu mogą obciążyć klienta zgodnie z ustaleniami.",
        p_de: "Kann die Lieferung aus Gründen, die der Kunde zu vertreten hat (fehlende Zufahrt, unvorbereiteter Stellplatz), nicht erfolgen, können die Kosten einer erneuten Anlieferung nach Vereinbarung dem Kunden berechnet werden.",
      },
    ],
  },
  returns: {
    title_pl: "Zwroty i zwroty płatności",
    title_de: "Rückgabe und Rückerstattung",
    sections: [
      {
        h_pl: "Zwroty towarów wielkogabarytowych",
        h_de: "Rückgabe von Sperrgut",
        p_pl: "Kontenery są towarem wielkogabarytowym i nie mogą być odesłane przesyłką kurierską. Zwrot wymaga transportu specjalistycznego, którego organizację i koszt ustalamy indywidualnie przed zwrotem.",
        p_de: "Container sind Sperrgut und können nicht per Paketdienst zurückgesandt werden. Eine Rückgabe erfordert einen Spezialtransport, dessen Organisation und Kosten vor der Rückgabe individuell vereinbart werden.",
      },
      {
        h_pl: "Prawo odstąpienia konsumenta",
        h_de: "Widerrufsrecht des Verbrauchers",
        p_pl: "Konsumentom przysługuje 14-dniowe prawo odstąpienia od umowy zawartej na odległość, zgodnie ze stroną Prawo odstąpienia od umowy. Bezpośrednie koszty zwrotu towaru ponosi konsument, o czym informujemy przed zakupem.",
        p_de: "Verbrauchern steht ein 14-tägiges Widerrufsrecht bei Fernabsatzverträgen zu, gemäß der Seite Widerrufsrecht. Die unmittelbaren Kosten der Rücksendung trägt der Verbraucher, worüber wir vor dem Kauf informieren.",
      },
      {
        h_pl: "Stan zwracanego kontenera",
        h_de: "Zustand des zurückgegebenen Containers",
        p_pl: "Zwracany kontener powinien znajdować się w stanie niezmienionym ponad zakres niezbędny do stwierdzenia jego charakteru i cech. Konsument odpowiada za zmniejszenie wartości towaru wynikające z korzystania w sposób wykraczający poza ten zakres.",
        p_de: "Der zurückgegebene Container soll sich in unverändertem Zustand befinden, über das zur Prüfung von Beschaffenheit und Eigenschaften Erforderliche hinaus. Der Verbraucher haftet für einen Wertverlust, der auf einen darüber hinausgehenden Umgang zurückzuführen ist.",
      },
      {
        h_pl: "Zwrot płatności",
        h_de: "Rückerstattung",
        p_pl: "Zwrot płatności następuje niezwłocznie, nie później niż w terminie 14 dni od otrzymania oświadczenia o odstąpieniu, przy czym możemy wstrzymać się ze zwrotem do chwili otrzymania towaru z powrotem lub dostarczenia dowodu jego odesłania.",
        p_de: "Die Rückerstattung erfolgt unverzüglich, spätestens 14 Tage nach Zugang der Widerrufserklärung. Wir können die Rückzahlung verweigern, bis wir die Ware zurückerhalten haben oder ein Nachweis über die Rücksendung vorliegt.",
      },
      {
        h_pl: "Uszkodzenia transportowe i niewłaściwy towar",
        h_de: "Transportschäden und Falschlieferung",
        p_pl: "Widoczne uszkodzenia transportowe oraz dostawę niewłaściwego produktu prosimy zgłaszać niezwłocznie — w takich przypadkach koszty transportu zwrotnego ponosi sprzedawca.",
        p_de: "Sichtbare Transportschäden sowie die Lieferung eines falschen Produkts melden Sie bitte umgehend — in diesen Fällen trägt der Verkäufer die Kosten des Rücktransports.",
      },
      {
        h_pl: "Zakupy firmowe",
        h_de: "Geschäftliche Käufe",
        p_pl: "Ustawowe prawo odstąpienia dotyczy konsumentów oraz — w przewidzianym prawem zakresie — osób fizycznych prowadzących działalność gospodarczą. Zwroty w transakcjach B2B ustalane są indywidualnie.",
        p_de: "Das gesetzliche Widerrufsrecht gilt für Verbraucher. Rückgaben bei B2B-Transaktionen werden individuell vereinbart.",
      },
    ],
  },
  withdrawal: {
    title_pl: "Prawo odstąpienia od umowy",
    title_de: "Widerrufsrecht",
    sections: [
      {
        h_pl: "Termin i sposób odstąpienia",
        h_de: "Frist und Ausübung des Widerrufs",
        p_pl: "Konsument może odstąpić od umowy zawartej na odległość w terminie 14 dni od objęcia towaru w posiadanie, bez podania przyczyny. Oświadczenie można złożyć e-mailem na adres info@olborglogistics.com lub pisemnie na adres: Olborg Logistics Sp. z o.o., Jana III Sobieskiego 9/23, 99-200 Poddębice.",
        p_de: "Verbraucher können den Fernabsatzvertrag innerhalb von 14 Tagen ab Inbesitznahme der Ware ohne Angabe von Gründen widerrufen. Die Erklärung kann per E-Mail an info@olborglogistics.com oder schriftlich an Olborg Logistics Sp. z o.o., Jana III Sobieskiego 9/23, 99-200 Poddębice, Polen, erfolgen.",
      },
      {
        h_pl: "Skutki odstąpienia",
        h_de: "Folgen des Widerrufs",
        p_pl: "W przypadku odstąpienia zwracamy wszystkie otrzymane płatności, w tym koszty dostarczenia (z wyjątkiem kosztów wynikających z wybranego sposobu dostawy innego niż najtańszy oferowany), nie później niż 14 dni od otrzymania oświadczenia, z zastrzeżeniem prawa wstrzymania zwrotu do czasu otrzymania towaru.",
        p_de: "Im Falle des Widerrufs erstatten wir alle erhaltenen Zahlungen einschließlich Lieferkosten (mit Ausnahme zusätzlicher Kosten einer anderen als der günstigsten angebotenen Lieferart) spätestens 14 Tage nach Zugang der Erklärung, vorbehaltlich des Zurückbehaltungsrechts bis zum Erhalt der Ware.",
      },
      {
        h_pl: "Koszty zwrotu",
        h_de: "Kosten der Rücksendung",
        p_pl: "Kontener nie może zostać odesłany zwykłą pocztą. Bezpośrednie koszty zwrotu towaru ponosi konsument. Szacunkowy koszt transportu zwrotnego zależy od lokalizacji i zostanie ustalony indywidualnie.",
        p_de: "Ein Container kann nicht mit normaler Post zurückgesandt werden. Die unmittelbaren Kosten der Rücksendung trägt der Verbraucher. Die voraussichtlichen Rücktransportkosten hängen vom Standort ab und werden individuell ermittelt.",
      },
      {
        h_pl: "Wzór formularza odstąpienia",
        h_de: "Muster-Widerrufsformular",
        p_pl: "— Adresat: Olborg Logistics Sp. z o.o., Jana III Sobieskiego 9/23, 99-200 Poddębice, info@olborglogistics.com\n— Niniejszym informuję o moim odstąpieniu od umowy sprzedaży następujących towarów: …\n— Data zawarcia umowy / odbioru: …\n— Imię i nazwisko konsumenta: …\n— Adres konsumenta: …\n— Podpis (tylko forma papierowa) i data.",
        p_de: "— An: Olborg Logistics Sp. z o.o., Jana III Sobieskiego 9/23, 99-200 Poddębice, Polen, info@olborglogistics.com\n— Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über den Kauf der folgenden Waren: …\n— Bestellt am / erhalten am: …\n— Name des/der Verbraucher(s): …\n— Anschrift des/der Verbraucher(s): …\n— Unterschrift (nur bei Mitteilung auf Papier) und Datum.",
      },
    ],
  },
  complaints: {
    title_pl: "Reklamacje",
    title_de: "Reklamationen und Gewährleistung",
    sections: [
      {
        h_pl: "Podstawa reklamacji",
        h_de: "Grundlage der Reklamation",
        p_pl: "Sprzedawca odpowiada za zgodność towaru z umową na zasadach przewidzianych przepisami prawa. Kontenery używane sprzedawane są z opisem ich stanu — normalne ślady eksploatacji opisane w karcie produktu nie stanowią wady.",
        p_de: "Der Verkäufer haftet für die Vertragsmäßigkeit der Ware nach den gesetzlichen Vorschriften. Gebrauchte Container werden mit einer Zustandsbeschreibung verkauft — die auf der Produktseite beschriebenen normalen Gebrauchsspuren stellen keinen Mangel dar.",
      },
      {
        h_pl: "Zgłoszenie reklamacji",
        h_de: "Einreichung der Reklamation",
        p_pl: "Reklamacje prosimy zgłaszać e-mailem na info@olborglogistics.com, podając numer zamówienia, opis problemu oraz zdjęcia. Odpowiadamy w terminie przewidzianym przepisami, nie później niż w ciągu 14 dni.",
        p_de: "Reklamationen richten Sie bitte per E-Mail an info@olborglogistics.com unter Angabe der Bestellnummer, einer Problembeschreibung und Fotos. Wir antworten innerhalb der gesetzlichen Frist, spätestens innerhalb von 14 Tagen.",
      },
      {
        h_pl: "Uszkodzenia transportowe",
        h_de: "Transportschäden",
        p_pl: "Widoczne uszkodzenia powstałe w transporcie należy odnotować w protokole dostawy w obecności kierowcy i zgłosić niezwłocznie.",
        p_de: "Sichtbare Transportschäden sind im Lieferprotokoll in Anwesenheit des Fahrers zu vermerken und unverzüglich zu melden.",
      },
    ],
  },
  privacy: {
    title_pl: "Polityka prywatności",
    title_de: "Datenschutzerklärung",
    sections: [
      {
        h_pl: "Administrator danych",
        h_de: "Verantwortlicher",
        p_pl: "Administratorem danych osobowych jest Olborg Logistics Sp. z o.o., Jana III Sobieskiego 9/23, 99-200 Poddębice, Polska, e-mail: info@olborglogistics.com, tel. +48 505 611 446.",
        p_de: "Verantwortlicher für die Verarbeitung personenbezogener Daten ist Olborg Logistics Sp. z o.o., Jana III Sobieskiego 9/23, 99-200 Poddębice, Polen, E-Mail: info@olborglogistics.com, Tel. +48 505 611 446.",
      },
      {
        h_pl: "Cele i podstawy przetwarzania",
        h_de: "Zwecke und Rechtsgrundlagen",
        p_pl: "Dane przetwarzamy w celu realizacji zamówień i zapytań ofertowych (art. 6 ust. 1 lit. b RODO), wypełnienia obowiązków prawnych, w tym podatkowych (lit. c), oraz w prawnie uzasadnionym interesie, np. obsługi korespondencji (lit. f).",
        p_de: "Wir verarbeiten Daten zur Abwicklung von Bestellungen und Angebotsanfragen (Art. 6 Abs. 1 lit. b DSGVO), zur Erfüllung rechtlicher Pflichten einschließlich steuerlicher Pflichten (lit. c) sowie aufgrund berechtigten Interesses, z. B. zur Bearbeitung von Korrespondenz (lit. f).",
      },
      {
        h_pl: "Odbiorcy i okres przechowywania",
        h_de: "Empfänger und Speicherdauer",
        p_pl: "Dane mogą być przekazywane przewoźnikom, dostawcom usług IT i księgowych. Przechowujemy je przez okres wymagany przepisami (np. podatkowymi) lub do czasu przedawnienia roszczeń.",
        p_de: "Daten können an Transportunternehmen, IT- und Buchhaltungsdienstleister weitergegeben werden. Wir speichern sie für die gesetzlich vorgeschriebene Dauer (z. B. steuerrechtlich) oder bis zur Verjährung von Ansprüchen.",
      },
      {
        h_pl: "Prawa osób, których dane dotyczą",
        h_de: "Rechte der betroffenen Personen",
        p_pl: "Przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, sprzeciwu oraz skargi do Prezesa UODO.",
        p_de: "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit, Widerspruch sowie Beschwerde bei einer Datenschutzaufsichtsbehörde.",
      },
    ],
  },
  cookies: {
    title_pl: "Polityka cookies",
    title_de: "Cookie-Richtlinie",
    sections: [
      {
        h_pl: "Czym są pliki cookies",
        h_de: "Was sind Cookies",
        p_pl: "Cookies to małe pliki zapisywane na Twoim urządzeniu. Używamy cookies niezbędnych do działania sklepu (np. koszyk, wybór języka) oraz — wyłącznie za Twoją zgodą — cookies analitycznych i marketingowych.",
        p_de: "Cookies sind kleine Dateien, die auf Ihrem Gerät gespeichert werden. Wir verwenden für den Shop-Betrieb erforderliche Cookies (z. B. Warenkorb, Sprachauswahl) sowie — nur mit Ihrer Einwilligung — Analyse- und Marketing-Cookies.",
      },
      {
        h_pl: "Zarządzanie zgodą",
        h_de: "Verwaltung der Einwilligung",
        p_pl: "Zgodę możesz w każdej chwili zmienić lub wycofać w sekcji ustawień poniżej albo w ustawieniach przeglądarki.",
        p_de: "Sie können Ihre Einwilligung jederzeit im Einstellungsbereich unten oder über die Einstellungen Ihres Browsers ändern oder widerrufen.",
      },
    ],
  },
};
