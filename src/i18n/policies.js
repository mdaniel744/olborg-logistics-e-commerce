// Identity confirmed by the business. The registered address, return depot,
// delivery windows and pre-contract return-cost estimates require verification.
const SELLER = "OLBORG LOGISTIC SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ";
const EMAIL = "info@olborglogistics.com";
const PHONE = "+48 505 611 446";

export const POLICIES = {
  terms: {
    title_pl: "Regulamin sklepu",
    title_de: "Allgemeine Geschäftsbedingungen",
    sections: [
      {
        h_pl: "1. Sprzedawca i kontakt",
        h_de: "1. Verkäufer und Kontakt",
        p_pl: `Sprzedawcą jest ${SELLER}, spółka zarejestrowana w Polsce, działająca pod marką Olborg Logistics. NIP: 8281415227; KRS: 0000662755; REGON: 366537890. Kontakt: ${EMAIL}, ${PHONE}.`,
        p_de: `Verkäufer ist ${SELLER}, eine in Polen registrierte Gesellschaft, die unter der Marke Olborg Logistics auftritt. Polnische Steuernummer (NIP): 8281415227; Handelsregisternummer (KRS): 0000662755; REGON: 366537890. Kontakt: ${EMAIL}, ${PHONE}.`,
      },
      {
        h_pl: "2. Wybór kontenera i zamówienie",
        h_de: "2. Containerauswahl und Bestellung",
        p_pl: "Przed zamówieniem sprawdź rozmiar, typ, stan, kolor i wyposażenie wybranego wariantu. Zdjęcia i parametry należy odczytywać razem z jego opisem, szczególnie przy kontenerach używanych. Zamówienie przyciskiem „Kupuję i płacę” jest ofertą zawarcia umowy. Umowa zostaje zawarta po przyjęciu zamówienia przez sprzedawcę. Samo wysłanie zapytania o wycenę nie jest zamówieniem i nie zobowiązuje do zapłaty.",
        p_de: "Prüfen Sie Größe, Bauart, Zustand, Farbe und Ausstattung der gewählten Variante. Bilder und technische Angaben gehören zur jeweiligen Beschreibung, besonders bei gebrauchten Containern. Mit „Zahlungspflichtig bestellen“ geben Sie ein Angebot zum Vertragsschluss ab. Der Vertrag kommt mit der Annahme der Bestellung durch den Verkäufer zustande. Eine Angebotsanfrage allein ist keine Bestellung und begründet keine Zahlungspflicht.",
      },
      {
        h_pl: "3. Ceny, VAT i płatność",
        h_de: "3. Preise, Umsatzsteuer und Zahlung",
        p_pl: "Ceny podajemy w PLN dla rynku polskiego i w EUR dla rynku niemieckiego. Kwoty netto i brutto są oznaczone. Końcowa kwota zależy od wariantu, ilości, kraju dostawy, właściwego VAT oraz transportu i rozładunku. Łączny koszt musi być znany przed zamówieniem z obowiązkiem zapłaty. Płatność odbywa się przelewem bankowym w PLN lub EUR, w tym przelewem SEPA. Dane rachunku i termin płatności znajdują się w dokumentach zamówienia. Wystawiamy faktury VAT. Numer VAT UE nie wystarcza do zastosowania stawki 0%; muszą być spełnione warunki wewnątrzwspólnotowej dostawy towarów.",
        p_de: "Die Preise werden für den polnischen Markt in PLN und für den deutschen Markt in EUR angegeben. Netto- und Bruttopreise sind gekennzeichnet. Der Endbetrag richtet sich nach Variante, Menge, Lieferland, Umsatzsteuer sowie Transport und Entladung. Der Gesamtpreis muss vor der zahlungspflichtigen Bestellung feststehen. Bezahlt wird per Banküberweisung in PLN oder EUR, einschließlich SEPA-Überweisung. Bankverbindung und Zahlungsfrist stehen in den Bestellunterlagen. Wir stellen Umsatzsteuerrechnungen aus. Eine USt-IdNr. allein berechtigt nicht zu 0% Umsatzsteuer; die Voraussetzungen einer innergemeinschaftlichen Lieferung müssen erfüllt sein.",
      },
      {
        h_pl: "4. Dostawa i rozładunek",
        h_de: "4. Lieferung und Entladung",
        p_pl: "Organizujemy dostawy w Polsce i do Niemiec. Przy zamówieniu określa się, czy rozładunek zapewnia klient, czy ma go wykonać dźwig samochodowy. Sam transport nie oznacza automatycznie rozładunku dźwigiem. Warunki dojazdu, ustawienia kontenera, koszt i termin dostawy wymagają ustalenia przed zawarciem umowy. Szczegóły przygotowania miejsca opisuje strona Dostawa.",
        p_de: "Wir organisieren Lieferungen in Polen und nach Deutschland. Bei der Bestellung wird festgelegt, ob Sie selbst entladen oder ein LKW-Ladekran benötigt wird. Ein Transport umfasst nicht automatisch eine Kranentladung. Zufahrt, Aufstellung, Kosten und Lieferfrist müssen vor Vertragsschluss geklärt sein. Hinweise zur Standortvorbereitung finden Sie auf der Seite Lieferung.",
      },
      {
        h_pl: "5. Zwroty i reklamacje",
        h_de: "5. Widerruf und Mängelrechte",
        p_pl: "Przy konsumenckich zakupach na odległość obowiązuje ustawowe prawo odstąpienia, co do zasady w ciągu 14 dni od odbioru. Dotyczy także standardowych kontenerów używanych. Reklamacja niezgodnego towaru jest odrębnym uprawnieniem i nie ogranicza się do terminu na odstąpienie. Procedura, koszty transportu zwrotnego i zasady zwrotu płatności są opisane na stronach Zwroty i Prawo odstąpienia.",
        p_de: "Bei Verbraucherkäufen im Fernabsatz besteht grundsätzlich ein Widerrufsrecht von 14 Tagen ab Erhalt. Es gilt auch für reguläre gebrauchte Container. Mängelrechte bestehen unabhängig davon und sind nicht auf die Widerrufsfrist begrenzt. Ablauf, Rücktransportkosten und Erstattung finden Sie unter Rückgabe und Widerrufsrecht.",
      },
      {
        h_pl: "6. Prawa klientów prywatnych i firm",
        h_de: "6. Rechte von Privat- und Geschäftskunden",
        p_pl: "Regulamin nie ogranicza praw konsumenta ani ochrony przyznanej przez polskie przepisy osobie fizycznej kupującej w związku z działalnością gospodarczą, gdy umowa nie ma dla niej charakteru zawodowego. W innych transakcjach B2B dodatkowe warunki ustala się w umowie. Konsument w innym kraju zachowuje ochronę wynikającą z bezwzględnie obowiązujących przepisów mających zastosowanie do umowy.",
        p_de: "Diese Bedingungen beschränken weder Verbraucherrechte noch den Schutz, den das polnische Recht bestimmten Einzelunternehmern bei einem nicht berufsspezifischen Kauf gewährt. Ergänzende B2B-Bedingungen werden vertraglich vereinbart. Verbraucher in einem anderen Land behalten den Schutz der zwingenden Vorschriften, die auf ihren Vertrag anwendbar sind.",
      },
    ],
  },
  shipping: {
    title_pl: "Dostawa kontenera: transport, termin i rozładunek",
    title_de: "Containerlieferung: Transport, Termin und Entladung",
    sections: [
      {
        h_pl: "Gdzie dostarczamy",
        h_de: "Unser Liefergebiet",
        p_pl: "Olborg Logistics jest polską firmą. Organizujemy dostawy kontenerów do klientów w Polsce i Niemczech. Dojazd sprawdza się dla konkretnego adresu: sam kod pocztowy nie potwierdza, że ciężarówka zmieści się na posesji lub że dźwig dosięgnie miejsca ustawienia.",
        p_de: "Olborg Logistics ist ein polnisches Unternehmen. Wir organisieren Containerlieferungen in Polen und Deutschland. Die Zufahrt muss für die konkrete Adresse geprüft werden: Eine Postleitzahl allein sagt nicht aus, ob der LKW das Grundstück erreichen oder der Ladekran den Stellplatz bedienen kann.",
      },
      {
        h_pl: "Co składa się na koszt",
        h_de: "Woraus sich die Transportkosten ergeben",
        p_pl: "Na koszt wpływają miejsce dostawy, rozmiar i liczba kontenerów oraz rozładunek. Kalkulator pokazuje koszt dla obsługiwanych kombinacji. Jeżeli potrzebna jest wycena indywidualna, brak kwoty nie oznacza bezpłatnej dostawy. Cena transportu, uzgodnionego rozładunku i dodatkowych usług musi być podana do akceptacji przed zamówieniem z obowiązkiem zapłaty.",
        p_de: "Die Kosten richten sich nach Lieferort, Größe und Anzahl der Container sowie der Entladung. Der Rechner zeigt Preise für unterstützte Kombinationen. Ist ein individuelles Angebot nötig, bedeutet ein fehlender Betrag keine kostenlose Lieferung. Transport, vereinbarte Entladung und Zusatzleistungen müssen vor einer zahlungspflichtigen Bestellung mit Preis zur Zustimmung vorliegen.",
      },
      {
        h_pl: "Termin dostawy",
        h_de: "Lieferfrist",
        p_pl: "Termin zależy od dostępności wariantu i transportu. Wiążący termin lub okres dostawy należy uzgodnić przed zawarciem umowy; później ustala się szczegóły przyjazdu. Sama informacja o dostępności nie oznacza dostawy w konkretnym dniu. W sprzedaży konsumenckiej, jeśli nie uzgodniono inaczej, towar powinien zostać wydany bez zbędnej zwłoki, najpóźniej w ciągu 30 dni od zawarcia umowy. Uzgodnienie późniejszej dostawy nie wyłącza ustawowych praw w razie opóźnienia.",
        p_de: "Die Lieferfrist hängt von Variante und Transportplanung ab. Ein verbindlicher Termin oder Lieferzeitraum ist vor Vertragsschluss festzulegen; danach werden die Einzelheiten der Anfahrt abgestimmt. Eine Verfügbarkeitsangabe allein ist keine Zusage für einen bestimmten Liefertag. Bei Verbraucherkäufen gilt ohne andere Vereinbarung die Lieferung ohne unnötige Verzögerung, spätestens innerhalb von 30 Tagen nach Vertragsschluss. Auch bei einem vereinbarten späteren Termin bleiben gesetzliche Rechte wegen Lieferverzugs bestehen.",
      },
      {
        h_pl: "Dźwig samochodowy czy rozładunek własny",
        h_de: "Ladekran oder eigene Entladung",
        p_pl: "Przy rozładunku własnym klient zapewnia odpowiedni sprzęt i osobę uprawnioną do jego obsługi. Dla transportu z HDS podaj odległość miejsca ustawienia od postoju ciężarówki, zdjęcia dojazdu i przeszkody. Udźwig maleje wraz z wysięgiem, dlatego możliwość podniesienia i ustawienia kontenera ocenia się dla konkretnego pojazdu i miejsca. Wybór HDS nie gwarantuje ustawienia za budynkiem lub w dowolnej odległości od drogi.",
        p_de: "Bei eigener Entladung stellen Sie geeignetes Hebezeug und eine zur Bedienung befugte Person bereit. Für einen Ladekran benötigen wir die Entfernung zwischen LKW-Standplatz und Stellplatz, Zufahrtsfotos und Angaben zu Hindernissen. Die Tragfähigkeit sinkt mit zunehmender Ausladung. Die Aufstellung muss deshalb für Fahrzeug, Container und Standort geprüft werden. Die Kranauswahl garantiert keine Aufstellung hinter Gebäuden oder in beliebiger Entfernung zur Straße.",
      },
      {
        h_pl: "Przygotowanie miejsca",
        h_de: "Den Standort vorbereiten",
        p_pl: "Potrzebne są nośna droga, miejsce na manewry i stabilne, wypoziomowane podparcie kontenera. Sprawdź szerokość bramy, ograniczenia tonażowe, wysokość przejazdu, nachylenie terenu i linie energetyczne. Nie wchodź pod zawieszony ładunek. Prace ziemne, fundamenty oraz ewentualne zgłoszenia lub pozwolenia na ustawienie nie są automatycznie częścią dostawy.",
        p_de: "Erforderlich sind eine tragfähige Zufahrt, Rangierfläche und eine stabile, waagerechte Auflage. Prüfen Sie Torbreite, Gewichtsbeschränkungen, Durchfahrtshöhe, Gefälle und Stromleitungen. Halten Sie sich vom schwebenden Container fern. Erdarbeiten, Fundamente sowie gegebenenfalls erforderliche Anzeigen oder Genehmigungen gehören nicht automatisch zur Lieferung.",
      },
      {
        h_pl: "Kontrola przy odbiorze",
        h_de: "Prüfung bei der Annahme",
        p_pl: "Porównaj kontener z zamówieniem i obejrzyj widoczne powierzchnie oraz drzwi. Zdjęcia i adnotacja w protokole pomagają wyjaśnić uszkodzenia. Prosimy o możliwie szybki kontakt, ale brak protokołu przy kierowcy ani późniejsze zauważenie szkody nie odbierają konsumentowi ustawowych praw. Przy niewłaściwej dostawie lub szkodzie, za którą odpowiada sprzedawca, konieczny transport w ramach naprawy, wymiany lub zwrotu nie obciąża konsumenta.",
        p_de: "Vergleichen Sie den Container mit der Bestellung und prüfen Sie sichtbare Flächen und Türen. Fotos und ein Protokollvermerk helfen bei der Klärung von Schäden. Bitte melden Sie Probleme zeitnah. Ein fehlendes Protokoll beim Fahrer oder ein erst später bemerkter Schaden lässt Verbraucherrechte unberührt. Bei Falschlieferung oder einem vom Verkäufer zu verantwortenden Schaden trägt der Verbraucher keine notwendigen Transportkosten für Abhilfe oder Rückgabe.",
      },
      {
        h_pl: "Gdy rozładunek jest niemożliwy",
        h_de: "Wenn eine Entladung nicht möglich ist",
        p_pl: "Kierowca nie może wykonywać rozładunku w niebezpiecznych warunkach. Poinformuj nas przed dostawą, jeśli warunki na miejscu się zmieniły. Ewentualny ponowny transport, postój lub dodatkowy sprzęt wymagają wyjaśnienia przyczyny i podstawy kosztów. Nie naliczamy automatycznie opłaty tylko dlatego, że próba dostawy się nie powiodła; zastosowanie mają uzgodnione warunki i przepisy.",
        p_de: "Unter unsicheren Bedingungen darf der Fahrer nicht entladen. Melden Sie Änderungen am Standort vor der Lieferung. Bei erneuter Anfahrt, Wartezeit oder zusätzlichem Gerät sind Ursache und Kostengrundlage zu klären. Eine fehlgeschlagene Lieferung führt nicht automatisch zu einer Gebühr; maßgeblich sind die vereinbarten Bedingungen und das geltende Recht.",
      },
    ],
  },
  returns: {
    title_pl: "Zwroty i zwrot płatności",
    title_de: "Rückgabe und Rückerstattung",
    sections: [
      {
        h_pl: "14 dni na odstąpienie",
        h_de: "14 Tage Widerrufsrecht",
        p_pl: "Konsument może odstąpić od zakupu na odległość bez podania przyczyny w ciągu 14 dni od otrzymania kontenera przez siebie lub wskazaną osobę inną niż przewoźnik. Dotyczy to standardowych kontenerów nowych i używanych. Przy towarach jednego zamówienia dostarczanych osobno termin biegnie od otrzymania ostatniego towaru. Reklamacja wady jest odrębną procedurą opisaną niżej.",
        p_de: "Verbraucher können einen Fernabsatzkauf binnen 14 Tagen ab Erhalt des Containers durch sie oder einen benannten Dritten, der nicht der Beförderer ist, ohne Begründung widerrufen. Dies gilt für reguläre neue und gebrauchte Container. Bei getrennt gelieferten Waren einer Bestellung beginnt die Frist mit der letzten Ware. Mängelansprüche sind davon unabhängig und werden weiter unten erläutert.",
      },
      {
        h_pl: "Jak zgłosić odstąpienie",
        h_de: "So erklären Sie den Widerruf",
        p_pl: `Wyślij jednoznaczne oświadczenie do sprzedawcy, ${SELLER}, na ${EMAIL}. Podaj imię i nazwisko oraz numer zamówienia lub opis kontenera i datę zakupu. Formularz na stronie Prawo odstąpienia jest pomocny, ale nieobowiązkowy. Wystarczy wysłanie oświadczenia przed upływem terminu; jego skuteczność nie zależy od uzyskania zgody na zwrot. Sprawy transportu można omówić pod ${PHONE}.`,
        p_de: `Senden Sie Ihre eindeutige Erklärung an den Verkäufer, ${SELLER}, unter ${EMAIL}. Zur Zuordnung helfen Name sowie Bestellnummer oder Containerbeschreibung und Kaufdatum. Das Musterformular unter Widerrufsrecht ist freiwillig. Die rechtzeitige Absendung genügt; der Widerruf bedarf keiner Rückgabegenehmigung. Den Transport können Sie unter ${PHONE} abstimmen.`,
      },
      {
        h_pl: "Termin i organizacja zwrotu",
        h_de: "Rückgabefrist und Organisation",
        p_pl: "Kontener wymaga ciężarówki i sprzętu do podnoszenia; nie nadaje się do zwrotu zwykłą pocztą. Jeśli sprzedawca nie zaoferował odbioru, zwróć towar bez zbędnej zwłoki, najpóźniej w ciągu 14 dni od zgłoszenia odstąpienia. Wysyłka przed upływem terminu jest wystarczająca. Skontaktuj się wcześnie w sprawie miejsca przyjęcia i bezpiecznego rozładunku. Adres kontaktowy firmy nie jest automatycznie placem przyjmującym kontenery. Uzgodnienie transportu nie ogranicza prawa do odstąpienia.",
        p_de: "Für einen Container sind ein LKW und geeignetes Hebezeug nötig; eine Postrücksendung ist nicht möglich. Hat der Verkäufer keine Abholung angeboten, senden Sie die Ware ohne unnötige Verzögerung, spätestens 14 Tage nach Mitteilung des Widerrufs, zurück. Die rechtzeitige Absendung genügt. Stimmen Sie Annahmeort und sichere Entladung frühzeitig ab. Die Kontaktanschrift ist nicht automatisch ein Container-Rückgabedepot. Die Transportabstimmung schränkt den Widerruf nicht ein.",
      },
      {
        h_pl: "Koszty transportu zwrotnego",
        h_de: "Kosten des Rücktransports",
        p_pl: "Przy zwykłym odstąpieniu konsument ponosi bezpośredni koszt zwrotu, jeśli został o tym prawidłowo poinformowany przed zawarciem umowy. Dla kontenera informacja musi obejmować koszt transportu lub — gdy nie można go rozsądnie wyliczyć z góry — oszacowanie maksymalnego kosztu. Sama „wycena indywidualna” po zakupie nie wystarcza. Jeśli wymaganej informacji nie przekazano lub sprzedawca zgodził się pokryć koszty, nie obciążają one konsumenta. Przy towarze niezgodnym z umową konieczny transport związany z odbiorem, naprawą, wymianą lub zwrotem obciąża sprzedawcę.",
        p_de: "Bei einem gewöhnlichen Widerruf trägt der Verbraucher die unmittelbaren Rücktransportkosten, wenn er vor Vertragsschluss ordnungsgemäß informiert wurde. Bei einem Container muss die Information den Transportpreis enthalten oder, wenn eine vernünftige Vorausberechnung nicht möglich ist, eine Schätzung der Höchstkosten. Ein individuelles Angebot erst nach dem Kauf genügt nicht. Fehlt die vorgeschriebene Information oder übernimmt der Verkäufer die Kosten, gehen sie nicht zulasten des Verbrauchers. Bei nicht vertragsgemäßer Ware trägt der Verkäufer den notwendigen Transport für Abholung, Nachbesserung, Ersatz oder Rückgabe.",
      },
      {
        h_pl: "Stan kontenera i zmniejszenie wartości",
        h_de: "Zustand und möglicher Wertverlust",
        p_pl: "Możesz sprawdzić cechy i działanie kontenera w zakresie potrzebnym do jego oceny. Użytkowanie ponad ten zakres, np. trwała przeróbka lub uszkodzenie, może powodować odpowiedzialność za rzeczywiste zmniejszenie wartości. Nie jest to automatyczna opłata za przyjęcie zwrotu ani utrata prawa do odstąpienia. Odpowiedzialność ta nie powstaje, jeśli sprzedawca nie przekazał wymaganej informacji o prawie odstąpienia.",
        p_de: "Sie dürfen Eigenschaften und Funktion im erforderlichen Umfang prüfen. Darüber hinausgehende Nutzung, etwa ein dauerhafter Umbau oder eine Beschädigung, kann zum Ersatz eines tatsächlichen Wertverlusts führen. Dies ist keine pauschale Rücknahmegebühr und beseitigt den Widerruf nicht. Eine solche Haftung besteht nicht, wenn die vorgeschriebene Widerrufsbelehrung unterblieben ist.",
      },
      {
        h_pl: "Kiedy i jak zwracamy płatność",
        h_de: "Wann und wie wir erstatten",
        p_pl: "Zwracamy otrzymane płatności wraz z kosztem najtańszej oferowanej zwykłej dostawy. Nie musimy zwracać dopłaty za droższą dostawę wybraną przez klienta. Zwrot następuje bez zbędnej zwłoki, najpóźniej 14 dni od otrzymania odstąpienia. Jeśli nie zaoferowaliśmy odbioru, możemy zaczekać do otrzymania kontenera albo dowodu jego odesłania — zależnie od tego, co nastąpi wcześniej. Stosujemy tę samą metodę płatności, chyba że wyraźnie zgodzisz się na inną, bez dodatkowych opłat za zwrot.",
        p_de: "Wir erstatten erhaltene Zahlungen einschließlich der günstigsten angebotenen Standardlieferung. Mehrkosten einer gewählten teureren Lieferart müssen nicht erstattet werden. Die Erstattung erfolgt ohne unnötige Verzögerung, spätestens 14 Tage ab Eingang des Widerrufs. Haben wir keine Abholung angeboten, dürfen wir bis zum Erhalt des Containers oder zum Rücksendenachweis warten, je nachdem, was früher eintritt. Wir verwenden dasselbe Zahlungsmittel, sofern Sie keinem anderen ausdrücklich zustimmen; die Erstattung verursacht keine zusätzlichen Gebühren.",
      },
      {
        h_pl: "Firmy i indywidualna produkcja",
        h_de: "Geschäftskäufe und Sonderanfertigungen",
        p_pl: "Niektóre osoby fizyczne kupujące na potrzeby działalności korzystają z ochrony konsumenckiej przewidzianej polskim prawem. W innych transakcjach B2B dobrowolny zwrot wymaga uzgodnienia. Ustawowy wyjątek od odstąpienia może dotyczyć towaru nieprefabrykowanego, wykonanego według specyfikacji klienta lub dla jego indywidualnych potrzeb. Sam wybór standardowego rozmiaru, stanu lub dostępnego koloru nie jest w naszym sklepie podstawą automatycznego wyłączenia zwrotu.",
        p_de: "Bestimmte Einzelunternehmer genießen nach polnischem Recht Verbraucherschutz. In anderen B2B-Geschäften bedarf eine freiwillige Rücknahme einer Vereinbarung. Eine gesetzliche Ausnahme vom Widerruf kann für nicht vorgefertigte Waren nach Kundenspezifikation oder eindeutig persönlichen Bedürfnissen gelten. Die bloße Auswahl einer regulären Größe, eines Zustands oder einer angebotenen Farbe führt in unserem Shop nicht automatisch zum Ausschluss des Widerrufs.",
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
        p_pl: `Konsument ma co do zasady 14 dni na odstąpienie od zakupu na odległość bez podania przyczyny. Termin biegnie od otrzymania towaru przez konsumenta lub wskazaną osobę inną niż przewoźnik, a przy jednym zamówieniu dostarczanym osobno — od ostatniego towaru. Oświadczenie skieruj do ${SELLER}, e-mail: ${EMAIL}. Wystarczy wysłać je przed upływem terminu. Nie trzeba korzystać z formularza ani uzyskiwać zgody sprzedawcy.`,
        p_de: `Verbraucher können einen Fernabsatzkauf grundsätzlich binnen 14 Tagen ohne Begründung widerrufen. Die Frist beginnt mit dem Erhalt durch den Verbraucher oder einen benannten Dritten, der nicht der Beförderer ist, bei getrennt gelieferten Waren einer Bestellung mit der letzten Ware. Richten Sie die Erklärung an ${SELLER}, E-Mail: ${EMAIL}. Die rechtzeitige Absendung genügt. Ein bestimmtes Formular oder eine Genehmigung ist nicht erforderlich.`,
      },
      {
        h_pl: "Zwrot kontenera i jego koszt",
        h_de: "Rücksendung und deren Kosten",
        p_pl: `Jeśli nie zaoferowaliśmy odbioru, zwróć towar bez zbędnej zwłoki, najpóźniej 14 dni od zgłoszenia odstąpienia; wystarczy wysłać go w tym terminie. Pod ${EMAIL} uzgodnisz miejsce przyjęcia i transport. Kontener nie nadaje się do zwrotu pocztą. Konsument ponosi bezpośrednie koszty tylko po wymaganej informacji przed umową, obejmującej kwotę lub rozsądne oszacowanie maksymalnego kosztu. Nie można ustalić ich dopiero po zakupie bez wcześniejszej informacji. Gdy wymaganej informacji nie przekazano lub sprzedawca przyjął koszty na siebie, nie obciążają konsumenta. Adres kontaktowy nie jest automatycznie placem zwrotów.`,
        p_de: `Haben wir keine Abholung angeboten, ist die Ware ohne unnötige Verzögerung, spätestens 14 Tage nach Mitteilung des Widerrufs, zurückzusenden; die rechtzeitige Absendung genügt. Unter ${EMAIL} können Sie Annahmeort und Transport abstimmen. Ein Container kann nicht per Post zurückgesandt werden. Der Verbraucher trägt unmittelbare Kosten nur nach der vorgeschriebenen Information vor Vertragsschluss, einschließlich Betrag oder vernünftiger Schätzung der Höchstkosten. Eine erstmalige Mitteilung nach dem Kauf genügt nicht. Fehlt die vorgeschriebene Information oder übernimmt der Verkäufer die Kosten, trägt sie der Verbraucher nicht. Die Kontaktanschrift ist nicht automatisch der Rückgabeplatz.`,
      },
      {
        h_pl: "Zwrot płatności i wartość towaru",
        h_de: "Erstattung und Warenwert",
        p_pl: "Zwracamy otrzymane płatności i koszt najtańszej oferowanej zwykłej dostawy, bez dopłaty za droższy sposób wybrany przez klienta. Zwrot następuje nie później niż 14 dni od otrzymania oświadczenia. Jeśli nie zaoferowaliśmy odbioru, możemy wstrzymać płatność do otrzymania kontenera albo dowodu odesłania — co nastąpi wcześniej. Stosujemy tę samą metodę płatności, chyba że wyraźnie uzgodniono inną bez dodatkowych kosztów. Odpowiedzialność za zmniejszenie wartości dotyczy tylko użytkowania ponad konieczne sprawdzenie cech i działania, pod warunkiem prawidłowego poinformowania o odstąpieniu.",
        p_de: "Wir erstatten erhaltene Zahlungen und die günstigste angebotene Standardlieferung, ohne Aufpreis für eine gewählte teurere Lieferart, spätestens 14 Tage nach Eingang der Erklärung. Haben wir keine Abholung angeboten, dürfen wir bis zum Erhalt des Containers oder Rücksendenachweis warten, je nachdem, was früher eintritt. Wir verwenden dasselbe Zahlungsmittel, sofern keine andere kostenfreie Methode ausdrücklich vereinbart ist. Ein Wertverlust kann nur bei Nutzung über die erforderliche Prüfung hinaus und nach ordnungsgemäßer Widerrufsbelehrung berechnet werden.",
      },
      {
        h_pl: "Wzór formularza — użycie dobrowolne",
        h_de: "Musterformular — freiwillig verwendbar",
        p_pl: `— Adresat: ${SELLER}, ${EMAIL}\n— Informuję/Informujemy o odstąpieniu od umowy sprzedaży następującego towaru: [opis kontenera]\n— Numer zamówienia, jeżeli znany: [numer]\n— Data zamówienia / otrzymania: [data]\n— Imię i nazwisko konsumenta/konsumentów: [dane]\n— Adres konsumenta/konsumentów: [adres]\n— Data: [data]\n— Podpis konsumenta/konsumentów tylko przy formularzu na papierze.`,
        p_de: `— An: ${SELLER}, ${EMAIL}\n— Hiermit widerrufe(n) ich/wir den Vertrag über den Kauf folgender Ware: [Containerbeschreibung]\n— Bestellnummer, sofern bekannt: [Nummer]\n— Bestellt am / erhalten am: [Datum]\n— Name des/der Verbraucher(s): [Name]\n— Anschrift des/der Verbraucher(s): [Anschrift]\n— Datum: [Datum]\n— Unterschrift des/der Verbraucher(s) nur bei Erklärung auf Papier.`,
      },
    ],
  },
  complaints: {
    title_pl: "Reklamacje — towar niezgodny z umową",
    title_de: "Reklamationen und gesetzliche Mängelrechte",
    sections: [
      {
        h_pl: "Kontenery nowe i używane",
        h_de: "Neue und gebrauchte Container",
        p_pl: "Sprzedawca odpowiada za zgodność kontenera z umową. Polskie przepisy konsumenckie obejmują brak zgodności istniejący przy wydaniu i ujawniony w ciągu dwóch lat od wydania. Kontenery używane również są objęte tą ochroną. Opis stanu powinien wyjaśniać konkretne ślady eksploatacji; samo słowo „używany” nie wyłącza odpowiedzialności za nieujawnione problemy. Odstępstwo od wymaganych cech wymaga warunków ustawowych, w tym wyraźnej informacji i odrębnej akceptacji konsumenta przy umowie.",
        p_de: "Der Verkäufer haftet für die Vertragsmäßigkeit des Containers. Nach polnischem Verbraucherrecht umfasst dies bei Übergabe vorhandene Vertragswidrigkeiten, die innerhalb von zwei Jahren auftreten. Auch gebrauchte Container sind geschützt. Eine Zustandsbeschreibung sollte konkrete Gebrauchsspuren erläutern; „gebraucht“ allein schließt die Haftung für nicht offengelegte Probleme nicht aus. Eine Abweichung von geschuldeten Eigenschaften setzt die gesetzlichen Bedingungen voraus, darunter ausdrückliche Information und gesonderte Zustimmung bei Vertragsschluss.",
      },
      {
        h_pl: "Jak zgłosić problem",
        h_de: "So melden Sie ein Problem",
        p_pl: `Skontaktuj się pod ${EMAIL} lub ${PHONE}. Opisz problem i oczekiwane rozwiązanie. Numer zamówienia, dowód zakupu i zdjęcia pomagają w ocenie, ale brak zdjęć lub oryginalnego paragonu nie jest sam w sobie podstawą odrzucenia zgłoszenia. Na reklamacje konsumenckie odpowiadamy w ciągu 14 dni od otrzymania. Tam, gdzie polska ustawa przewiduje ten skutek, brak odpowiedzi oznacza uznanie reklamacji.`,
        p_de: `Kontaktieren Sie uns unter ${EMAIL} oder ${PHONE}. Beschreiben Sie Problem und gewünschte Abhilfe. Bestellnummer, Kaufnachweis und Fotos helfen; fehlende Fotos oder der fehlende ursprüngliche Kassenbeleg sind allein kein Ablehnungsgrund. Auf Verbraucherreklamationen antworten wir innerhalb von 14 Tagen. Soweit das polnische Gesetz diese Rechtsfolge vorsieht, gilt eine ausbleibende Antwort als Anerkennung.`,
      },
      {
        h_pl: "Naprawa, wymiana lub zwrot pieniędzy",
        h_de: "Nachbesserung, Ersatz oder Erstattung",
        p_pl: "Konsument może żądać naprawy lub wymiany na zasadach ustawowych. Po spełnieniu przesłanek prawnych, np. odmowie lub nieskutecznej naprawie czy wymianie albo przy istotnej niezgodności, możliwe jest obniżenie ceny lub odstąpienie od umowy. Naprawa lub wymiana powinny nastąpić w rozsądnym czasie i bez nadmiernych niedogodności. Sprzedawca ponosi konieczne koszty transportu, odbioru, robocizny i materiałów. Sposób udostępnienia kontenera ustala się z uwzględnieniem jego rozmiaru i miejsca ustawienia.",
        p_de: "Verbraucher können im gesetzlichen Rahmen Nachbesserung oder Ersatz verlangen. Bei erfüllten Voraussetzungen, etwa verweigerter oder erfolgloser Abhilfe oder einem erheblichen Mangel, kommen Preisminderung oder Vertragsauflösung in Betracht. Nachbesserung oder Ersatz müssen in angemessener Zeit und ohne erhebliche Unannehmlichkeiten erfolgen. Der Verkäufer trägt erforderliche Kosten für Transport, Abholung, Arbeit und Material. Die Bereitstellung wird passend zu Containergröße und Standort abgestimmt.",
      },
      {
        h_pl: "Szkody transportowe i błędna dostawa",
        h_de: "Transportschäden und Falschlieferung",
        p_pl: "Warto udokumentować szkodę przy dostawie i odnotować ją z kierowcą. Nie jest to warunek ustawowych praw konsumenta. Zgłoszenie po odjeździe kierowcy również podlega rozpatrzeniu. Przy uszkodzeniu przypisywanym dostawie przez sprzedawcę lub innym kontenerze niż zamówiony konieczny transport w ramach reklamacji obciąża sprzedawcę.",
        p_de: "Fotos und ein Vermerk mit dem Fahrer sind hilfreich, aber keine Voraussetzung gesetzlicher Verbraucherrechte. Eine Meldung nach Abfahrt des Fahrers wird ebenfalls geprüft. Bei Schäden aus einer vom Verkäufer verantworteten Lieferung oder einem falsch gelieferten Container trägt der Verkäufer die notwendigen Transportkosten der Reklamationsabwicklung.",
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
        p_pl: `Administratorem jest ${SELLER}, działająca pod marką Olborg Logistics w Polsce; NIP: 8281415227, KRS: 0000662755, REGON: 366537890. Sprawy danych osobowych: ${EMAIL}, ${PHONE}.`,
        p_de: `Verantwortlicher ist ${SELLER}, tätig unter der Marke Olborg Logistics in Polen; NIP: 8281415227, KRS: 0000662755, REGON: 366537890. Kontakt zum Datenschutz: ${EMAIL}, ${PHONE}.`,
      },
      {
        h_pl: "Jakie informacje przekazujesz",
        h_de: "Welche Angaben Sie übermitteln",
        p_pl: "Przy zamówieniu lub zapytaniu otrzymujemy podane imię i nazwisko, dane firmy i VAT, e-mail, telefon, adres rozliczeniowy i dostawy, wybrane kontenery oraz wiadomość. Jeśli formularz umożliwia zdjęcia miejsca dostawy, przesyłaj tylko informacje potrzebne do transportu, bez dokumentów tożsamości i zbędnych danych innych osób. Pola wymagane oznaczają dane niezbędne do danej czynności; bez nich wycena lub zamówienie nie mogą zostać obsłużone. Pozostałe informacje podajesz dobrowolnie.",
        p_de: "Bei Bestellung oder Anfrage erhalten wir die angegebenen Namen, Unternehmens- und Umsatzsteuerdaten, E-Mail, Telefon, Rechnungs- und Lieferadresse, Containerauswahl und Nachricht. Soweit ein Formular Standortfotos zulässt, übermitteln Sie nur transportrelevante Informationen, keine Ausweisdokumente oder unnötigen Daten anderer Personen. Pflichtfelder kennzeichnen Angaben, die für den jeweiligen Vorgang benötigt werden; ohne sie ist dessen Bearbeitung nicht möglich. Weitere Angaben sind freiwillig.",
      },
      {
        h_pl: "Cele i podstawy przetwarzania",
        h_de: "Zwecke und Rechtsgrundlagen",
        p_pl: "Dane wykorzystujemy do przygotowania oferty, zawarcia i wykonania umowy, dostawy oraz kontaktu w jej sprawie — art. 6 ust. 1 lit. b RODO. Faktury, rozliczenia i obowiązki ustawowe opieramy na art. 6 ust. 1 lit. c. Pozostała korespondencja, ochrona przed nadużyciami oraz dochodzenie lub obrona roszczeń służą prawnie uzasadnionemu interesowi — art. 6 ust. 1 lit. f. Wysłanie zapytania nie jest zapisem do newslettera ani zgodą na reklamy.",
        p_de: "Wir verwenden Daten zur Angebotserstellung, zum Vertragsschluss und zur Abwicklung, Lieferung und Kommunikation — Art. 6 Abs. 1 lit. b DSGVO. Rechnungen, Abrechnung und gesetzliche Pflichten beruhen auf Art. 6 Abs. 1 lit. c. Sonstige Korrespondenz, Schutz vor Missbrauch sowie Geltendmachung oder Abwehr von Ansprüchen dienen berechtigten Interessen — Art. 6 Abs. 1 lit. f. Eine Anfrage ist weder Newsletter-Anmeldung noch Zustimmung zu Werbung.",
      },
      {
        h_pl: "Odbiorcy danych",
        h_de: "Empfänger der Daten",
        p_pl: "W obsłudze uczestniczą dostawcy hostingu i systemu zamówień oraz zapytań, w tym usług bazodanowych Supabase. Przewoźnicy otrzymują dane potrzebne do dostawy, a dostawcy usług księgowych i bankowych — niezbędne dane rozliczeniowe. Zakres zależy od wykonywanej usługi. Organy publiczne otrzymują informacje, gdy wymaga tego prawo. O odbiorców właściwych dla Twojej sprawy możesz zapytać administratora.",
        p_de: "Beteiligt sind Hostinganbieter sowie Anbieter des Bestell- und Anfragesystems, darunter Supabase für Datenbankdienste. Beförderer erhalten lieferrelevante Angaben, Buchhaltungs- und Bankdienstleister die nötigen Abrechnungsdaten. Der Umfang richtet sich nach der Leistung. Behörden erhalten Informationen, soweit gesetzlich erforderlich. Empfänger in Ihrem konkreten Fall können Sie beim Verantwortlichen erfragen.",
      },
      {
        h_pl: "Przechowywanie danych",
        h_de: "Speicherdauer",
        p_pl: "Dane zapytań są potrzebne w czasie ich obsługi, a zamówień — w czasie wykonania umowy. Późniejsze przechowywanie może wynikać z obowiązków podatkowych i rachunkowych lub ustalenia, dochodzenia i obrony roszczeń. Okres zależy od dokumentu i terminów ustawowych; po ustaniu celu i podstawy dane powinny zostać usunięte. Informacje o pamięci przeglądarki znajdują się w Polityce cookies.",
        p_de: "Anfragedaten werden für deren Bearbeitung und Bestelldaten für die Vertragsabwicklung benötigt. Spätere Aufbewahrung kann aufgrund steuerlicher oder buchhalterischer Pflichten oder zur Feststellung, Geltendmachung und Abwehr von Ansprüchen erforderlich sein. Die Dauer richtet sich nach Dokumentart und gesetzlichen Fristen; nach Wegfall von Zweck und Grundlage sind Daten zu löschen. Zum Browserspeicher informiert die Cookie-Richtlinie.",
      },
      {
        h_pl: "Twoje prawa",
        h_de: "Ihre Rechte",
        p_pl: `Na zasadach RODO możesz żądać dostępu, sprostowania, usunięcia lub ograniczenia przetwarzania, a w odpowiednich przypadkach przeniesienia danych. Możesz wnieść sprzeciw wobec przetwarzania opartego na uzasadnionym interesie. Zgodę, jeśli jest podstawą przetwarzania, można wycofać bez wpływu na wcześniejsze zgodne z prawem działania. Napisz na ${EMAIL}. Możesz złożyć skargę do Prezesa UODO albo właściwego organu nadzorczego w kraju zwykłego pobytu.`,
        p_de: `Nach Maßgabe der DSGVO können Sie Auskunft, Berichtigung, Löschung oder Einschränkung und gegebenenfalls Datenübertragbarkeit verlangen. Einer Verarbeitung aufgrund berechtigter Interessen können Sie widersprechen. Eine Einwilligung können Sie ohne Auswirkung auf die Rechtmäßigkeit bisheriger Verarbeitung widerrufen. Schreiben Sie an ${EMAIL}. Beschwerden sind bei der polnischen Aufsicht UODO oder der zuständigen Aufsichtsbehörde Ihres gewöhnlichen Aufenthaltsorts möglich.`,
      },
    ],
  },
  cookies: {
    title_pl: "Polityka cookies i pamięci przeglądarki",
    title_de: "Cookie-Richtlinie und Browserspeicher",
    sections: [
      {
        h_pl: "Co zapisuje sklep",
        h_de: "Was der Shop speichert",
        p_pl: "Korzystamy z pamięci przeglądarki dla koszyka, języka i ustawień prywatności. Są to mechanizmy localStorage i sessionStorage, nie wyłącznie tradycyjne cookies. Pomagają korzystać z wybranych funkcji bez ponownego podawania tych samych informacji. Te wpisy nie śledzą aktywności na innych witrynach.",
        p_de: "Wir nutzen Browserspeicher für Warenkorb, Sprache und Datenschutzeinstellungen. Dabei handelt es sich um localStorage und sessionStorage, nicht ausschließlich um klassische Cookies. So müssen Angaben bei gewählten Funktionen nicht wiederholt eingegeben werden. Diese Einträge verfolgen keine Aktivitäten auf anderen Websites.",
      },
      {
        h_pl: "Koszyk, język i preferencje",
        h_de: "Warenkorb, Sprache und Einstellungen",
        p_pl: "olborg_cart_v1 przechowuje pozycje koszyka, olborg_lang wybór języka, a olborg_cookie_consent ustawienia prywatności i czas ich zapisania. Wpisy localStorage pozostają w używanej przeglądarce bez automatycznego terminu wygaśnięcia, do usunięcia lub zastąpienia. Wyczyszczenie danych witryny może usunąć koszyk i preferencje.",
        p_de: "olborg_cart_v1 enthält Warenkorbpositionen, olborg_lang die Sprachwahl und olborg_cookie_consent die Datenschutzeinstellungen samt Speicherzeitpunkt. localStorage-Einträge bleiben ohne automatisches Ablaufdatum bis zum Löschen oder Ersetzen im verwendeten Browser. Beim Löschen der Websitedaten können Warenkorb und Einstellungen verloren gehen.",
      },
      {
        h_pl: "Dane bieżącej sesji",
        h_de: "Daten der aktuellen Sitzung",
        p_pl: "olborg_quote_draft_v3 zachowuje robocze zapytanie przy zmianie języka. olborg_last_order służy do pokazania ostatniego potwierdzenia zamówienia i może zawierać dane kontaktowe. Wpisy sessionStorage dotyczą sesji danej karty i zwykle znikają po jej zamknięciu, choć przeglądarka może przywrócić sesję. Na wspólnym urządzeniu po zakupach warto wyczyścić dane witryny.",
        p_de: "olborg_quote_draft_v3 erhält einen Anfrageentwurf beim Sprachwechsel. olborg_last_order zeigt die letzte Bestellbestätigung und kann Kontaktdaten enthalten. sessionStorage gehört zur jeweiligen Tab-Sitzung und wird normalerweise beim Schließen entfernt; der Browser kann Sitzungen jedoch wiederherstellen. Auf gemeinsam genutzten Geräten empfiehlt sich das Löschen der Websitedaten nach dem Einkauf.",
      },
      {
        h_pl: "Analityka i reklamy",
        h_de: "Analyse und Werbung",
        p_pl: "W obecnej wersji sklepu nie uruchamiamy Google Analytics ani pikseli reklamowych. Panel informuje o niezbędnej pamięci i zapisuje potwierdzenie przeczytania komunikatu, a nie zgodę na nieistniejące narzędzia. Dodanie opcjonalnego śledzenia wymaga uprzedniej informacji o narzędziach oraz właściwej zgody przed ich uruchomieniem.",
        p_de: "In der aktuellen Shop-Version setzen wir weder Google Analytics noch Werbepixel ein. Der Bereich informiert über den notwendigen Speicher und merkt sich das Schließen des Hinweises; er holt keine Einwilligung für nicht eingesetzte Tools ein. Vor optionalem Tracking sind Informationen über die Tools und eine entsprechende Einwilligung erforderlich.",
      },
      {
        h_pl: "Zmiana ustawień",
        h_de: "Einstellungen ändern",
        p_pl: "Przyciskiem poniżej ponownie otworzysz informacje o aktywnej pamięci. Dane witryny możesz usunąć w przeglądarce. Wyłączenie całej pamięci witryny może ograniczyć koszyk, zapisywanie zapytania i potwierdzenie zamówienia.",
        p_de: "Über die Schaltfläche unten öffnen Sie erneut die Informationen zum aktiven Speicher. Websitedaten lassen sich in den Browsereinstellungen löschen. Die Blockierung des gesamten Webspeichers kann Warenkorb, Anfrageentwurf und Bestellbestätigung einschränken.",
      },
    ],
  },
};
