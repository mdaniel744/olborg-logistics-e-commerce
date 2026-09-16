// Identity confirmed by the business. The address below is intentionally identified as
// the customer-facing contact/correspondence address, not an unverified registered office.
const SELLER = "OLBORG LOGISTIC SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ";
const EMAIL = "info@olborglogistics.com";
const PHONE = "+48 505 611 446";
const CONTACT_ADDRESS = "Jana III Sobieskiego 9/23, 99-200 Poddębice, Polska";

export const POLICIES = {
  imprint: {
    title_pl: "Dane prawne i dane sprzedawcy",
    title_de: "Impressum",
    sections: [
      {
        h_pl: "Podmiot prowadzący serwis",
        h_de: "Anbieter und Diensteanbieter",
        p_pl: `${SELLER}, polska spółka z ograniczoną odpowiedzialnością działająca pod marką OLBORG LOGISTICS. Spółka jest sprzedawcą kontenerów, stroną umów zawieranych przez sklep oraz wystawcą faktur.`,
        p_de: `${SELLER}, eine polnische Gesellschaft mit beschränkter Haftung, tätig unter der Marke OLBORG LOGISTICS. Die Gesellschaft ist Verkäuferin der Container, Vertragspartnerin für Bestellungen über den Shop und Rechnungsausstellerin.`,
      },
      {
        h_pl: "Dane rejestrowe i podatkowe",
        h_de: "Register- und Steuerangaben",
        p_pl: "Krajowy Rejestr Sądowy (KRS): 0000662755\nNumer identyfikacji podatkowej (NIP): 8281415227\nREGON: 366537890",
        p_de: "Polnisches Handelsregister (KRS): 0000662755\nPolnische Steuernummer (NIP): 8281415227\nREGON: 366537890",
      },
      {
        h_pl: "Kontakt i adres korespondencyjny",
        h_de: "Kontakt- und Korrespondenzanschrift",
        p_pl: `OLBORG LOGISTICS\n${CONTACT_ADDRESS}\nTelefon: ${PHONE}\nE-mail: ${EMAIL}`,
        p_de: `OLBORG LOGISTICS\nJana III Sobieskiego 9/23, 99-200 Poddębice, Polen\nTelefon: ${PHONE}\nE-Mail: ${EMAIL}`,
      },
      {
        h_pl: "Informacje o rejestrze",
        h_de: "Hinweis zum Register",
        p_pl: "Aktualny odpis spółki, w tym oficjalną siedzibę i sposób reprezentacji, można sprawdzić w publicznej wyszukiwarce Krajowego Rejestru Sądowego, używając numeru KRS 0000662755.",
        p_de: "Der aktuelle Registerauszug mit offiziellem Sitz und Vertretungsregelung kann im öffentlichen polnischen Handelsregister anhand der KRS-Nummer 0000662755 abgerufen werden.",
      },
      {
        h_pl: "Obsługa klienta i treści serwisu",
        h_de: "Kundenservice und redaktionelle Verantwortung",
        p_pl: `W sprawach dotyczących produktów, zamówień, dostawy, praw konsumenta lub treści serwisu skontaktuj się z OLBORG LOGISTICS pod adresem ${EMAIL} albo numerem ${PHONE}. Zasady sprzedaży, zwrotów i ochrony danych znajdują się w dokumentach dostępnych w stopce.`,
        p_de: `Bei Fragen zu Produkten, Bestellungen, Lieferung, Verbraucherrechten oder den Inhalten dieses Shops kontaktieren Sie OLBORG LOGISTICS unter ${EMAIL} oder ${PHONE}. Verkaufs-, Rückgabe- und Datenschutzinformationen finden Sie in den Rechtsseiten im Footer.`,
      },
    ],
  },
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
        p_pl: "Przed zamówieniem sprawdź rozmiar, typ, stan, kolor i wyposażenie wybranego wariantu. Zdjęcia i parametry należy odczytywać razem z jego opisem, szczególnie przy kontenerach używanych. Zamówienie konsumenckie przyciskiem „Zamawiam i płacę” jest ofertą zawarcia umowy. Umowa zostaje zawarta po przyjęciu zamówienia przez sprzedawcę. Samo wysłanie zapytania o wycenę nie jest zamówieniem i nie zobowiązuje do zapłaty.",
        p_de: "Prüfen Sie Größe, Bauart, Zustand, Farbe und Ausstattung der gewählten Variante. Bilder und technische Angaben gehören zur jeweiligen Beschreibung, besonders bei gebrauchten Containern. Mit „Zahlungspflichtig bestellen“ geben Sie ein Angebot zum Vertragsschluss ab. Der Vertrag kommt mit der Annahme der Bestellung durch den Verkäufer zustande. Eine Angebotsanfrage allein ist keine Bestellung und begründet keine Zahlungspflicht.",
      },
      {
        h_pl: "3. Ceny, VAT i płatność",
        h_de: "3. Preise, Umsatzsteuer und Zahlung",
        p_pl: "Ceny podajemy w PLN dla rynku polskiego i w EUR dla rynku niemieckiego. Kwoty netto i brutto są oznaczone. Dostawa całego zamówienia kosztuje 1 380 PLN na adres w Polsce albo 530 EUR na adres w Niemczech, tak samo dla klientów prywatnych i firm; właściwy VAT jest już zawarty w tej stawce. Łączny koszt jest widoczny przed przyciskiem „Zamawiam i płacę”. Płatność odbywa się przelewem bankowym w PLN lub EUR, w tym przelewem SEPA. Dane rachunku i termin płatności znajdują się w dokumentach zamówienia. Wystawiamy faktury VAT. Numer VAT UE nie wystarcza do zastosowania stawki 0%; muszą być spełnione warunki wewnątrzwspólnotowej dostawy towarów.",
        p_de: "Die Preise werden für den polnischen Markt in PLN und für den deutschen Markt in EUR angegeben. Netto- und Bruttopreise sind gekennzeichnet. Die Lieferung der gesamten Bestellung kostet 1.380 PLN an eine Adresse in Polen oder 530 EUR an eine Adresse in Deutschland, gleichermaßen für Privat- und Geschäftskunden; die jeweils geltende Umsatzsteuer ist in der Pauschale enthalten. Der Gesamtpreis steht vor der Schaltfläche „Zahlungspflichtig bestellen“ fest. Bezahlt wird per Banküberweisung in PLN oder EUR, einschließlich SEPA-Überweisung. Bankverbindung und Zahlungsfrist stehen in den Bestellunterlagen. Wir stellen Umsatzsteuerrechnungen aus. Eine USt-IdNr. allein berechtigt nicht zu 0% Umsatzsteuer; die Voraussetzungen einer innergemeinschaftlichen Lieferung müssen erfüllt sein.",
      },
      {
        h_pl: "4. Dostawa",
        h_de: "4. Lieferung",
        p_pl: "Organizujemy dostawy w Polsce i do Niemiec. Standardowa dostawa dostępnego kontenera trwa zwykle około 3–7 dni na terenie Polski i około 4–9 dni do Niemiec, licząc od przyjęcia zamówienia i zaksięgowania płatności. W kasie nie wybiera się sposobu rozładunku i nie doliczamy osobnej dopłaty za rozładunek. Stała stawka obejmuje transport oraz standardowe, bezpieczne przekazanie kontenera pod adresem dostawy. Przed wysyłką potwierdzamy dojazd, miejsce odbioru i dokładny termin. Jeśli adres wymaga usługi specjalnej wykraczającej poza standardową dostawę, należy uzyskać odrębną wycenę przed złożeniem zamówienia.",
        p_de: "Wir organisieren Lieferungen in Polen und Deutschland. Die Standardlieferung eines verfügbaren Containers dauert ab Bestellannahme und Zahlungseingang gewöhnlich etwa 3–7 Tage innerhalb Polens und etwa 4–9 Tage nach Deutschland. In der Kasse wird keine Entlademethode gewählt und kein gesonderter Entladezuschlag berechnet. Die Pauschale umfasst den Transport und die sichere Standardübergabe des Containers an der Lieferadresse. Vor dem Versand bestätigen wir Zufahrt, Annahmestelle und den konkreten Termin. Erfordert der Standort eine Sonderleistung außerhalb der Standardlieferung, ist vor der Bestellung ein gesondertes Angebot einzuholen.",
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
    title_pl: "Dostawa kontenera: stawka, termin i przygotowanie miejsca",
    title_de: "Containerlieferung: Pauschale, Termin und Standortvorbereitung",
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
        p_pl: "Dla całego zwykłego zamówienia obowiązuje jedna stawka: 1 380 PLN na adres w Polsce albo 530 EUR na adres w Niemczech. Jest taka sama dla klientów prywatnych i firm, niezależnie od rozmiaru i liczby kontenerów, a właściwy VAT jest już zawarty w kwocie. Nie ma osobnej dopłaty ani wyboru sposobu rozładunku w kasie. Jeżeli nietypowy dojazd lub usługa specjalna wymaga odrębnej oferty, należy uzyskać ją przed złożeniem zamówienia online.",
        p_de: "Für die gesamte reguläre Bestellung gilt eine Pauschale: 1.380 PLN an eine Adresse in Polen oder 530 EUR an eine Adresse in Deutschland. Sie ist für Privat- und Geschäftskunden gleich, unabhängig von Containergröße und Anzahl; die jeweils geltende Umsatzsteuer ist bereits enthalten. In der Kasse gibt es weder einen gesonderten Entladezuschlag noch die Auswahl einer Entlademethode. Ist wegen besonderer Zufahrt oder einer Sonderleistung ein eigenes Angebot nötig, muss es vor der Onlinebestellung eingeholt werden.",
      },
      {
        h_pl: "Termin dostawy",
        h_de: "Lieferfrist",
        p_pl: "Dla dostępnych kontenerów standardowa dostawa trwa zwykle około 3–7 dni na terenie Polski i około 4–9 dni do Niemiec, licząc od przyjęcia zamówienia i zaksięgowania płatności. Jest to przewidywany przedział: dokładny dzień przyjazdu potwierdzamy indywidualnie po sprawdzeniu dostępności transportu i warunków dojazdu. Kontener niestandardowy, niedostępny od ręki albo wymagający dodatkowych prac może mieć inny termin, który podajemy przed przyjęciem zamówienia.",
        p_de: "Für verfügbare Container dauert die Standardlieferung ab Bestellannahme und Zahlungseingang gewöhnlich etwa 3–7 Tage innerhalb Polens und etwa 4–9 Tage nach Deutschland. Dies ist ein voraussichtlicher Zeitraum; den konkreten Anliefertag bestätigen wir nach Prüfung der Transportverfügbarkeit und Zufahrt individuell. Für nicht sofort verfügbare, kundenspezifische oder zusätzlich bearbeitete Container gilt der vor Bestellannahme mitgeteilte abweichende Zeitraum.",
      },
      {
        h_pl: "Standardowa dostawa i miejsce odbioru",
        h_de: "Standardlieferung und Annahmestelle",
        p_pl: "Stała stawka obejmuje standardową dostawę pod podany adres. Klient zapewnia prawidłowe dane o bramie, podłożu, przeszkodach i miejscu odbioru. Olborg dobiera bezpieczną organizację transportu; w kasie nie wybiera się sprzętu ani sposobu rozładunku. Nietypowe ustawienie, dodatkowy dźwig lub inna usługa wykraczająca poza standardową dostawę wymaga odrębnej oferty zaakceptowanej przed zawarciem umowy.",
        p_de: "Die Pauschale umfasst die Standardlieferung an die angegebene Adresse. Der Kunde macht zutreffende Angaben zu Tor, Untergrund, Hindernissen und Annahmestelle. Olborg organisiert den sicheren Transport; in der Kasse werden weder Gerät noch Entlademethode gewählt. Eine besondere Aufstellung, ein zusätzlicher Kran oder eine andere Leistung außerhalb der Standardlieferung erfordert ein gesondertes, vor Vertragsschluss angenommenes Angebot.",
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
        p_pl: `Kontener wymaga ciężarówki i sprzętu do podnoszenia; nie nadaje się do zwrotu zwykłą pocztą. Olborg organizuje odbiór zwrotny po stałej stawce. Po zgłoszeniu odstąpienia skontaktuj się przez ${EMAIL} lub ${PHONE} i udostępnij kontener do odbioru bez zbędnej zwłoki, najpóźniej w ciągu 14 dni. Wskaż adres, warunki dojazdu i stan kontenera; podamy termin oraz właściwe miejsce przyjęcia. Adres kontaktowy firmy nie jest automatycznie placem zwrotów. Organizacja odbioru nie ogranicza prawa do odstąpienia.`,
        p_de: `Für einen Container sind ein LKW und geeignetes Hebezeug nötig; eine Postrücksendung ist nicht möglich. Olborg organisiert die Rückholung zum Festpreis. Kontaktieren Sie uns nach Erklärung des Widerrufs unter ${EMAIL} oder ${PHONE} und stellen Sie den Container ohne unnötige Verzögerung, spätestens binnen 14 Tagen, zur Abholung bereit. Teilen Sie Adresse, Zufahrtsbedingungen und Containerzustand mit; wir bestätigen Termin und Annahmestelle. Die Kontaktanschrift ist nicht automatisch das Rückgabedepot. Die Abholorganisation schränkt den Widerruf nicht ein.`,
      },
      {
        h_pl: "Koszty transportu zwrotnego",
        h_de: "Kosten des Rücktransports",
        p_pl: "Przy zwykłym odstąpieniu konsument ponosi stały bezpośredni koszt transportu zwrotnego: 1 380 PLN dla zamówienia dostarczonego w Polsce albo 530 EUR dla zamówienia dostarczonego w Niemczech. Właściwy VAT jest zawarty w tej kwocie. Tę samą stawkę transportową stosujemy przy dobrowolnym zwrocie B2B zaakceptowanym przez sprzedawcę; nie oznacza to przyznania firmom ustawowego prawa odstąpienia. Przy towarze niezgodnym z umową lub szkodzie, za którą odpowiada sprzedawca, konieczny transport związany z odbiorem, naprawą, wymianą lub zwrotem opłaca sprzedawca.",
        p_de: "Bei einem gewöhnlichen Widerruf trägt der Verbraucher feste unmittelbare Rücktransportkosten: 1.380 PLN bei einer Lieferung in Polen oder 530 EUR bei einer Lieferung in Deutschland. Die jeweils geltende Umsatzsteuer ist enthalten. Derselbe Transportpreis gilt für eine vom Verkäufer angenommene freiwillige B2B-Rückgabe; dadurch erhalten Unternehmen kein gesetzliches Widerrufsrecht. Bei nicht vertragsgemäßer Ware oder einem vom Verkäufer zu vertretenden Schaden trägt der Verkäufer den erforderlichen Transport für Abholung, Nachbesserung, Ersatz oder Rückgabe.",
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
        p_pl: "Zwracamy otrzymane płatności wraz z kosztem oferowanej zwykłej dostawy bez zbędnej zwłoki, najpóźniej 14 dni od otrzymania odstąpienia. Uzgodniona stała opłata za organizowany przez Olborg transport zwrotny może zostać potrącona z kwoty zwrotu, jeśli klient nie zapłacił jej osobno. Stosujemy tę samą metodę płatności, chyba że wyraźnie zgodzisz się na inną, bez dodatkowych opłat za zwrot.",
        p_de: "Wir erstatten erhaltene Zahlungen einschließlich der angebotenen Standardlieferung ohne unnötige Verzögerung, spätestens 14 Tage ab Eingang des Widerrufs. Der vereinbarte Festpreis für den von Olborg organisierten Rücktransport kann mit der Erstattung verrechnet werden, wenn der Kunde ihn nicht gesondert bezahlt hat. Wir verwenden dasselbe Zahlungsmittel, sofern Sie keinem anderen ausdrücklich zustimmen; die Erstattung verursacht keine zusätzlichen Gebühren.",
      },
      {
        h_pl: "Firmy i indywidualna produkcja",
        h_de: "Geschäftskäufe und Sonderanfertigungen",
        p_pl: "Niektóre osoby fizyczne kupujące na potrzeby działalności korzystają z ochrony konsumenckiej przewidzianej polskim prawem. W innych transakcjach B2B dobrowolny zwrot wymaga zgody sprzedawcy, ale po jego zaakceptowaniu obowiązuje ta sama krajowa stawka transportu zwrotnego co dla klienta prywatnego. Ustawowy wyjątek od odstąpienia może dotyczyć towaru nieprefabrykowanego, wykonanego według specyfikacji klienta lub dla jego indywidualnych potrzeb. Sam wybór standardowego rozmiaru, stanu lub dostępnego koloru nie jest w naszym sklepie podstawą automatycznego wyłączenia zwrotu.",
        p_de: "Bestimmte Einzelunternehmer genießen nach polnischem Recht Verbraucherschutz. In anderen B2B-Geschäften bedarf eine freiwillige Rücknahme der Zustimmung des Verkäufers; nach Annahme gilt derselbe landesbezogene Rücktransportpreis wie für Privatkunden. Eine gesetzliche Ausnahme vom Widerruf kann für nicht vorgefertigte Waren nach Kundenspezifikation oder eindeutig persönlichen Bedürfnissen gelten. Die bloße Auswahl einer regulären Größe, eines Zustands oder einer angebotenen Farbe führt in unserem Shop nicht automatisch zum Ausschluss des Widerrufs.",
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
        p_pl: `Olborg organizuje odbiór kontenera. Po odstąpieniu skontaktuj się przez ${EMAIL} lub ${PHONE} i udostępnij kontener do odbioru bez zbędnej zwłoki, najpóźniej w ciągu 14 dni. Stały bezpośredni koszt odbioru zwrotnego ponoszony przez klienta wynosi 1 380 PLN dla zamówienia dostarczonego w Polsce albo 530 EUR dla zamówienia dostarczonego w Niemczech; właściwy VAT jest zawarty. Przy niezgodności towaru lub szkodzie, za którą odpowiada sprzedawca, konieczny transport opłaca sprzedawca. Potwierdzimy termin i miejsce przyjęcia; adres kontaktowy nie jest automatycznie placem zwrotów.`,
        p_de: `Olborg organisiert die Abholung des Containers. Kontaktieren Sie uns nach dem Widerruf unter ${EMAIL} oder ${PHONE} und stellen Sie den Container ohne unnötige Verzögerung, spätestens binnen 14 Tagen, zur Abholung bereit. Die vom Kunden getragenen festen unmittelbaren Rückholkosten betragen 1.380 PLN bei einer Lieferung in Polen oder 530 EUR bei einer Lieferung in Deutschland; die jeweils geltende Umsatzsteuer ist enthalten. Bei nicht vertragsgemäßer Ware oder einem vom Verkäufer zu vertretenden Schaden trägt der Verkäufer den erforderlichen Transport. Wir bestätigen Termin und Annahmestelle; die Kontaktanschrift ist nicht automatisch das Rückgabedepot.`,
      },
      {
        h_pl: "Zwrot płatności i wartość towaru",
        h_de: "Erstattung und Warenwert",
        p_pl: "Zwracamy otrzymane płatności i koszt oferowanej zwykłej dostawy nie później niż 14 dni od otrzymania oświadczenia. Uzgodniona stała opłata za organizowany przez Olborg odbiór zwrotny może zostać potrącona, jeśli klient nie zapłacił jej osobno. Stosujemy tę samą metodę płatności, chyba że wyraźnie uzgodniono inną bez dodatkowych kosztów. Odpowiedzialność za zmniejszenie wartości dotyczy tylko użytkowania ponad konieczne sprawdzenie cech i działania, pod warunkiem prawidłowego poinformowania o odstąpieniu.",
        p_de: "Wir erstatten erhaltene Zahlungen und die angebotene Standardlieferung spätestens 14 Tage nach Eingang der Erklärung. Der vereinbarte Festpreis für die von Olborg organisierte Rückholung kann verrechnet werden, wenn der Kunde ihn nicht gesondert bezahlt hat. Wir verwenden dasselbe Zahlungsmittel, sofern keine andere kostenfreie Methode ausdrücklich vereinbart ist. Ein Wertverlust kann nur bei Nutzung über die erforderliche Prüfung hinaus und nach ordnungsgemäßer Widerrufsbelehrung berechnet werden.",
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
