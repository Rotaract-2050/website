# TODO

Generato confrontando questo sito con il sito attuale in produzione ([rotaract2050.org](https://www.rotaract2050.org/)). Serve a tracciare pagine/dati mancanti o segnaposto da sostituire con contenuti reali, non decisioni tecniche (quelle sono in [`.claude/skills/rotaract2050-site/`](.claude/skills/rotaract2050-site/)).

## Pagine con dati segnaposto da sostituire con dati reali

- [x] **Home — statistiche club/soci/zone**: corretto a `30 club / 403 soci / 4 zone` (numeri reali da rotaract2050.org).
- [ ] **Home — statistica "progetti attivi"**: resta `40+`, placeholder — il sito attuale non riporta questo dato, chiedere il numero reale al distretto.
- [ ] **Home — tema dell'anno**: sito attuale ha un motto sociale in evidenza ("Formiamoci per non fermarci mai" per l'anno in corso) — il nuovo sito non ha questo elemento, valutare se aggiungerlo come blocco/eyebrow in home.
- [ ] **Il Distretto — box Rappresentante Distrettuale**: RD in carica A.R. 2026/2027 è **Sebastiano Fortugno** (l'anno sociale 2026/2027 è iniziato l'1 lug 2026 — dato sotto più aggiornato del vecchio "Lorenzo Pancini", che ora è Past RD). Contatto/quote reali da riconfermare (vecchia `rd@rotaract2050.org` da riverificare che sia ancora quella giusta).
- [ ] **Esecutivo Distrettuale A.R. 2026/2027** (oggi pagina "in preparazione"): organigramma completo ricevuto dal distretto — **sostituisce** il vecchio dato Direttivo/Esecutivo A.R. 2025/2026 (rimosso da qui). Lo schema `RoleGrid` attuale (4 ruoli fissi placeholder RD/VR/SD/TD) non basta: qui ci sono ruoli singoli + coppie (2 Prefetti, 2 Consiglieri) — rivedere lo schema del blocco, non solo compilare i nomi. Contatti email non forniti in questo organigramma, da chiedere al distretto se esistono email per ruolo (tipo le vecchie `segreteria@`, `tesoreria@`, `prefettura@rotaract2050.org`) o solo nomi:
  | Ruolo | Nome |
  |---|---|
  | Rappresentante Distrettuale | Sebastiano Fortugno |
  | Rappresentante Distrettuale Eletto | Marco Zacchetti |
  | Segretario | Alessandro Drovanti |
  | Tesoriere | Virginia Goffredi |
  | Prefetto | Andrea Pizzi |
  | Prefetto | Leonardo Toselli |
  | Consigliere | Martina Cattadori |
  | Consigliere | Angela Rebecchi |
  | Rappresentante Distrettuale A.R. 2025/2026 (Past RD) | Lorenzo Pancini |
- [ ] **Delegati di Zona A.R. 2026/2027** (oggi pagina "in preparazione"): **sostituisce** il vecchio dato (3 persone su 4 zone) — ora 1 delegato per zona:
  | Zona | Nome |
  |---|---|
  | Francigena | Davide Bosio |
  | Leonessa | Elena Vetturi |
  | Navigli | Andrea Pisano |
  | Padana | Hildegard Bombeccari |
- [ ] **Commissioni Distrettuali A.R. 2026/2027** (oggi pagina "in preparazione"): **sostituisce** la vecchia lista di 15 nomi senza membri (rimossa da qui, nomi commissioni cambiati). Ogni commissione ha Presidente + Membri (alcuni delegati sono singoli, senza commissione/membri) — dato nested, non compilabile in una stringa flat come il vecchio schema:
  - **Azione Interna** — Presidente: Alexander Rispo · Membri: Michele Zito, Emanuele Steffani, Mario Alessio Benelli, Jessica Bontempi
  - **Azione Professionale** — Presidente: Giovanni Maria Tosi · Membri: Gianluca Tegano, Caterina Treccani, Elisa Goi, Simone Costa
  - **Azione di Pubblico Interesse** — Presidente: Silvia Vetturi · Membri: Giulia Pennacchio, Erika Mazza, Mattia Festa, Clara Brugali
  - **Azione Internazionale** — Presidente: Alessio Alberti · Membri: Federica Maria Di Mola, Francesca Iembo, Benedetta Romani
  - **Delegato E.R.I.C.** — Leonardo Calori (singolo)
  - **Azione Giovani** (ex Premio Maturità, Premio Università, R.Y.L.A. e R.Y.L.A. Junior) — Presidente: Maria Gloria Garavani · Membri: Carlotta Varchi, Matteo Righetti, Mario Lamperti, Alma Lauricella
  - **Delegato per lo Scambio Giovani** — Sofia Somenzi (singolo)
  - **Cultura** — Presidente: Federico Magni · Membri: Francesco Locatelli, Filippo Balasini, Daniele Brignani, Lucrezia Giuseppina Zandon
  - **Immagine Pubblica** — Presidente: Federica Grassi · Membri: Marco Santagostino, Annalisa Lazzari, Marta Vincenzi, Filippo Cantini
  - **Risoluzione Controversie, Regolamento e Bilancio** — Presidente: Giovanni Scielzo · Membri: Alessandro Ginevra, Valeria Goi
  - **Delegato IT** — Alessandro Gorla (singolo)
  - **Delegato per la Rotary Foundation** — Davide Cappello (singolo)
  - **Delegato per l'Interact** — Benedetta Gilardi (singolo)
- [ ] **Zone e Club**: nel nuovo sito ci sono già 28 club su 4 zone (Francigena, Leonessa, Navigli, Padana) — confermare uno a uno che nomi ed elenco combacino esattamente col sito attuale (a un primo controllo il conteggio per zona coincide, ma non è stato verificato club per club).
- [ ] **Eventi**: sito attuale ha una pagina dedicata (`/home/eventi`) con eventi reali 2025-26 + archivio 2024-25 con foto; il nuovo sito ha solo il blocco `EventsList` in home con 4 eventi placeholder. Decidere: blocco in home basta, o serve una pagina `/eventi` dedicata con calendario/archivio? Eventi reali attuali da inserire:
  - I AD — 13 set 2025, Desenzano del Garda
  - II AD — 15 nov 2025, Piacenza
  - III AD — 13 dic 2025, Pavia
  - IV AD e MultiDistrettuale — 7 mar 2026, Crema
  - S.I.D.E. 2026 — 2 mag 2026, Salò
  - V AD — 16 mag 2026, Guidizzolo
  - Passaggio delle Consegne — 27 giu 2026, Cremona

## Pagine mancanti (non esistono nel nuovo sito)

- [ ] **Download / Materiali Distrettuali**: il bottone in header "Materiali Distrettuali" punta a `#` (placeholder). Sul sito attuale è una pagina che linka a una cartella Google Drive condivisa — serve almeno il link reale, anche senza pagina dedicata.
- [ ] **Donazioni**: non esiste nel nuovo sito. Sito attuale ha una pagina semplice con IBAN e CTA ("Con una piccola donazione puoi fare una grande differenza!"):
  - Intestatario: DISTRETTO ROTARACT 2050
  - IBAN: IT16V0307501603CC8001096799
  - Nessuna piattaforma di pagamento online, solo bonifico — valutare se aggiungere un link footer o una pagina dedicata.

## Link segnaposto da collegare

- [ ] Header/footer social icons (`f`, `in`, `ig`, `yt`) puntano a `#` — link reali:
  - Facebook: https://www.facebook.com/rotaract2050
  - Instagram: https://www.instagram.com/rotaract2050/
  - LinkedIn: https://www.linkedin.com/company/distretto-rotaract-club-2050/
  - (il sito attuale non mostra un canale YouTube — verificare se esiste prima di tenere l'icona `yt`)
- [ ] Utility bar "ROTARY INTERNATIONAL" → https://www.rotary.org/it
- [ ] Utility bar "ROTARY DISTRETTO 2050" → verificare URL reale del sito del Rotary Distretto 2050 (non Rotaract)
- [ ] Email di contatto footer: segreteria@rotaract2050.org (verificare che sia quella corretta anche per il form/CTA "Entra in Rotaract")

## Nuove funzionalità richieste (libreria/servizio da scegliere)

Feature nuove chieste dal distretto, non ancora presenti nel mockup/sito attuale. Qui si traccia solo il "cosa serve", la scelta di libreria/servizio va poi documentata in [`references/tina.md`](.claude/skills/rotaract2050-site/references/tina.md) o [`references/astro.md`](.claude/skills/rotaract2050-site/references/astro.md) una volta decisa.

- [ ] **Calendario eventi**: calendario pubblico del distretto — `admin@rotaract2050.org`, tz `Europe/Rome`. Embed: `https://calendar.google.com/calendar/embed?src=admin%40rotaract2050.org&ctz=Europe%2FRome`. Da decidere: iframe embed diretto (zero-JS, nessuna libreria, ma meno controllo sullo stile, iframe Google non è responsive/dark-mode friendly) vs fetch a build-time (ICS pubblico dello stesso calendario, o API Google Calendar) per renderizzare gli eventi come blocco Astro in stile `EventsList` (più lavoro, ma coerente col resto del sito e con Tina).
- [ ] **Mappa dei club del distretto**: mappa con i 28 club nelle 4 zone. Il Rotary Distretto 2050 (rotary2050.org/site/i-club) usa un plugin WP con OpenLayers + tile OpenStreetMap (un marker per club, niente zone visibili). Direzione scelta: niente libreria JS custom, mappa "pronta" via iframe (stesso pattern zero-JS del calendario) — **Google My Maps** (mymaps.google.com): un layer per zona (Navigli/Leonessa/Francigena/Padana) con colore diverso, pin club (import CSV nome+indirizzo possibile), poi `<iframe>` embed nel sito, aggiornabile da chiunque abbia un account Google (es. `admin@rotaract2050.org`) senza toccare codice. Alternativa più privacy-friendly/no-Google: **uMap** (umap.openstreetmap.fr), stesso principio ma su OSM. Libreria JS custom (Leaflet + isola `client:*`) resta possibile in futuro solo se serve styling brand-preciso o click→pagina club interna, non serve per il solo "pin colorati per zona".
  **Prossimo passo**: creare la mappa su mymaps.google.com (o uMap), impostarla pubblica/embeddabile, passare il link embed — come fatto per il calendario.
- [ ] **Ultime notizie via RSS da Rotary International**: blocco news che legge il feed RSS ufficiale di Rotary International. Da trovare l'URL feed reale. Preferire fetch/parsing a build time in Astro (SSG, resta zero-JS lato client) — da decidere libreria di parsing XML/RSS (es. `rss-parser`, `fast-xml-parser`) o parsing manuale con `fetch`.
- [x] **Campi contatto club in Tina**: schema `clubs` (`tina/config.ts`) aggiornato — ogni club ha ora `name`, `zone`, `email`, `website`, `instagram` (campi diretti per file club, non un file bulk separato: si è scelta l'opzione (a), editabile singolarmente da Tina). `contactUrl` generico rimosso (non era ancora usato in `ClubDirectory.astro`). **Resta da fare**: compilare i valori reali per i 28 club (oggi tutti vuoti) e collegare i campi nel rendering di `ClubDirectory.astro` (oggi il blocco contatto è solo testo statico, non un link).

## Tooling interno

- [x] **Script dev locale affidabile**: `npm run dev` ora esegue `scripts/dev.sh` (avvia Tina e Astro come due processi separati, attende che Tina sia pronto, ferma entrambi con Ctrl+C) invece del comando combinato `tinacms dev -c "astro dev"` (fragile in alcuni ambienti — vedi `references/tina.md`). Comando combinato originale resta come `npm run dev:raw` per debug.

## Fuori scope di questo file

Decisioni di brand, palette, tipografia, logo ufficiale, hosting, setup Tina → [`.claude/skills/rotaract2050-site/`](.claude/skills/rotaract2050-site/), non duplicate qui.
