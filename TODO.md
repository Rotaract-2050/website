# TODO

Generato confrontando questo sito con il sito attuale in produzione ([rotaract2050.org](https://www.rotaract2050.org/)). Serve a tracciare pagine/dati mancanti o segnaposto da sostituire con contenuti reali, non decisioni tecniche (quelle sono in [`.claude/skills/rotaract2050-site/`](.claude/skills/rotaract2050-site/)).

## Pagine con dati segnaposto da sostituire con dati reali

- [x] **Home — statistiche club/soci/zone**: corretto a `30 club / 403 soci / 4 zone` (numeri reali da rotaract2050.org).
- [ ] **Home — statistica "progetti attivi"**: resta `40+`, placeholder — il sito attuale non riporta questo dato, chiedere il numero reale al distretto.
- [ ] **Home — tema dell'anno**: sito attuale ha un motto sociale in evidenza ("Formiamoci per non fermarci mai" per l'anno in corso) — il nuovo sito non ha questo elemento, valutare se aggiungerlo come blocco/eyebrow in home.
- [ ] **Il Distretto — box Rappresentante Distrettuale**: RD in carica A.R. 2026/2027 è **Sebastiano Fortugno** (l'anno sociale 2026/2027 è iniziato l'1 lug 2026 — dato sotto più aggiornato del vecchio "Lorenzo Pancini", che ora è Past RD). Contatto/quote reali da riconfermare (vecchia `rd@rotaract2050.org` da riverificare che sia ancora quella giusta).
- [x] **La Squadra A.R. 2026/2027** (ex "Esecutivo Distrettuale"): bozza pubblicata come **unica pagina** `/la-squadra` (IT) e `/en/la-squadra` (EN, nav "THE TEAM") con l'intero organigramma — RD/RDE/Segretario/Tesoriere/2 Prefetti/2 Consiglieri/Past RD, Delegati di Zona, Commissioni con Presidente+Membri e deleghe singole, email reali incluse dove fornite dal distretto. Schema `RoleGrid` esteso con `photo`/`email` opzionali (retrocompatibile con l'uso già esistente in `distretto.md`); nuovo blocco `CommitteeGrid` (`tina/config.ts`, `src/components/blocks/CommitteeGrid.astro`) per il pattern presidente-riga-sopra/membri-riga-sotto, con card persona condivisa in `src/components/PersonCard.astro`. **Consolidamento nav**: le voci separate "Delegati di Zona" e "Commissioni" (pagine `/delegati` e `/commissioni`, mai popolate) sono state rimosse dal dropdown "Il Distretto" e dai relativi file — tutto confluisce nell'unica voce "La Squadra". **Resta da fare**: foto reali (oggi solo iniziali/placeholder); email per il Past RD e per il Delegato Interact (non fornite); traduzione EN dei nomi di ruoli/commissioni è una bozza non confermata (vedi disclaimer in pagina).
- [ ] **Zone e Club**: nel nuovo sito ci sono già 28 club su 4 zone (Francigena, Leonessa, Navigli, Padana) — confermare uno a uno che nomi ed elenco combacino esattamente col sito attuale (a un primo controllo il conteggio per zona coincide, ma non è stato verificato club per club).
- [ ] **Eventi**: sito attuale ha una pagina dedicata (`/home/eventi`) con eventi reali 2025-26 + archivio 2024-25 con foto. Il blocco `EventsCalendar` in home ora legge live dal calendario Google reale del distretto (vedi voce "Calendario eventi" sotto), non più 4 eventi placeholder — ma resta solo in home, senza archivio/foto. Decidere: basta così, o serve comunque una pagina `/eventi` dedicata con archivio storico e foto (il calendario live ha 108 voci fino al 2021, materiale c'è)? Eventi reali già visti nel calendario per l'A.R. 2025-26 (per confronto/verifica, i nomi non coincidono sempre 1:1 col sito attuale):
  - I AD — 13 set 2025, Desenzano del Garda
  - II AD — 15 nov 2025, Piacenza
  - III AD — 13 dic 2025, Pavia
  - IV AD e MultiDistrettuale — 7 mar 2026, Crema
  - S.I.D.E. 2026 — 2 mag 2026, Salò
  - V AD — 16 mag 2026, Guidizzolo
  - Passaggio delle Consegne — 27 giu 2026, Cremona

## Pagine mancanti (non esistono nel nuovo sito)

- [x] **Download / Materiali Distrettuali**: implementata come pagina dedicata `/materiali` (IT) e `/en/materiali` (EN), il bottone in header ora punta lì invece che a `#`. Vedi voce sotto in "Nuove funzionalità richieste" per i dettagli tecnici e cosa resta da fare (ID cartella reale + API key).
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

- [x] **Calendario eventi**: implementato in Home come blocco `EventsCalendar` (`src/lib/calendar.ts` + `src/components/blocks/EventsCalendar.astro`), non più un iframe — fetch server-side (Astro `output: 'server'`, per-request con cache in-memory di 15 min) dell'export ICS pubblico del calendario `admin@rotaract2050.org` (`https://calendar.google.com/calendar/ical/admin%40rotaract2050.org/public/basic.ics`, parsing con `node-ical`), reso con due viste coerenti con la grafica del sito: **Agenda** (prossimi eventi, righe) e **Mese** (un mese singolo grande, navigabile con frecce prev/next — paging istantaneo lato client via piccolo `<script>` vanilla su una finestra di 13 mesi pre-renderizzata, stesso pattern già usato dal carosello Hero; oltre la finestra ricade su una navigazione `?month=` reale). **Attenzione**: al 31 lug 2026 il calendario live non ha eventi oltre inizio luglio 2026 (l'A.R. 2026/27 non è ancora stato popolato) — la sezione lo gestisce con un messaggio "nessun evento in programma", ma va aggiornato appena il distretto (Delegato IT?) inserisce le date dell'anno sociale nuovo.
- [ ] **Mappa dei club del distretto**: mappa con i 28 club nelle 4 zone. Il Rotary Distretto 2050 (rotary2050.org/site/i-club) usa un plugin WP con OpenLayers + tile OpenStreetMap (un marker per club, niente zone visibili). Direzione scelta: niente libreria JS custom, mappa "pronta" via iframe (stesso pattern zero-JS del calendario) — **Google My Maps** (mymaps.google.com): un layer per zona (Navigli/Leonessa/Francigena/Padana) con colore diverso, pin club (import CSV nome+indirizzo possibile), poi `<iframe>` embed nel sito, aggiornabile da chiunque abbia un account Google (es. `admin@rotaract2050.org`) senza toccare codice. Alternativa più privacy-friendly/no-Google: **uMap** (umap.openstreetmap.fr), stesso principio ma su OSM. Libreria JS custom (Leaflet + isola `client:*`) resta possibile in futuro solo se serve styling brand-preciso o click→pagina club interna, non serve per il solo "pin colorati per zona".
  **Prossimo passo**: creare la mappa su mymaps.google.com (o uMap), impostarla pubblica/embeddabile, passare il link embed — come fatto per il calendario.
- [ ] **Ultime notizie via RSS da Rotary International**: blocco news che legge il feed RSS ufficiale di Rotary International. Da trovare l'URL feed reale. Preferire fetch/parsing a build time in Astro (SSG, resta zero-JS lato client) — da decidere libreria di parsing XML/RSS (es. `rss-parser`, `fast-xml-parser`) o parsing manuale con `fetch`.
- [x] **Pagina Download / Materiali Distrettuali**: implementata come blocco Tina `MaterialsGrid` (`tina/config.ts`, `src/components/blocks/MaterialsGrid.astro`), usato dalla pagina `/materiali` (`src/content/pages/{it,en}/materiali.md`). Fetch **client-side** (script vanilla inline nel componente, niente React/`client:load` — coerente con lo zero-JS di default, non serve un framework per un fetch+render) della Drive API v3 (`files.list`), con supporto **sottocartelle**: cliccare una cartella la apre sul posto (senza reload) con un breadcrumb per tornare indietro, stesso pattern client-side già usato da `EventsCalendar`/`EventsArchive`. Resa come lista brandizzata (icona per tipo file/cartella — SVG hardcoded nel componente, mai da dati API — nome, dimensione, link che apre il file su Drive). A differenza del piano originale, **niente env var Netlify**: sia l'ID della cartella (per pagina, campo del blocco `MaterialsGrid`) sia la API key (una sola, per tutto il sito, campo `driveApiKey` nella collection `settings` → "Impostazioni sito") sono campi Tina — modificabili dal distretto via `/admin` senza toccare codice o redeploy. Finché uno dei due manca, la sezione mostra uno stato "non ancora configurato" invece di rompersi. **Resta da fare, dal distretto**: (1) l'ID della cartella Drive radice condivisa, da incollare nel blocco `MaterialsGrid` della pagina; (2) una API key Google Cloud Console con Drive API abilitata, ristretta per HTTP referrer al dominio del sito, da incollare in "Impostazioni sito"; (3) verificare che la cartella (e le sue sottocartelle) siano condivise "chiunque abbia il link", altrimenti l'API key da sola non può elencarle (nessun login Google nel fetch).
- [x] **Campi contatto club in Tina**: schema `clubs` (`tina/config.ts`) aggiornato — ogni club ha ora `name`, `zone`, `email`, `website`, `instagram` (campi diretti per file club, non un file bulk separato: si è scelta l'opzione (a), editabile singolarmente da Tina). `contactUrl` generico rimosso (non era ancora usato in `ClubDirectory.astro`). **Resta da fare**: compilare i valori reali per i 28 club (oggi tutti vuoti) e collegare i campi nel rendering di `ClubDirectory.astro` (oggi il blocco contatto è solo testo statico, non un link).

## SEO e indicizzazione

- [ ] **`robots.txt`**: non presente in `public/` — aggiungere, puntando alla sitemap generata da `@astrojs/sitemap` (già configurata in `astro.config.mjs`, output in `sitemap-index.xml`/`sitemap-0.xml`).
- [ ] **Copertura `SeoHead.astro`**: verificare che tutte le pagine (incl. `/eventi`, pagine club dinamiche, pagine "in preparazione") passino title/description/canonical/OG corretti, non solo i default di `BaseLayout.astro`.
- [ ] **Dati strutturati (JSON-LD)**: valutare schema.org `Organization`/`Event` per le pagine club ed eventi, utile per rich snippet.
- [ ] **Testo per crawler bot / AI**: valutare `llms.txt` (indicizzazione da parte di crawler LLM, non solo motori di ricerca classici) e verificare che contenuti chiave (nomi club, eventi, contatti) siano in HTML renderizzato server-side, non solo dietro JS client-side (rilevante per le pagine non zero-JS come mappa club e download materiali, vedi sopra).
- [ ] **Verifica indicizzazione reale**: dopo il deploy, submit sitemap a Google Search Console e controllare copertura/errori.

## Tooling interno

- [x] **Script dev locale affidabile**: `npm run dev` ora esegue `scripts/dev.sh` (avvia Tina e Astro come due processi separati, attende che Tina sia pronto, ferma entrambi con Ctrl+C) invece del comando combinato `tinacms dev -c "astro dev"` (fragile in alcuni ambienti — vedi `references/tina.md`). Comando combinato originale resta come `npm run dev:raw` per debug.

## Fuori scope di questo file

Decisioni di brand, palette, tipografia, logo ufficiale, hosting, setup Tina → [`.claude/skills/rotaract2050-site/`](.claude/skills/rotaract2050-site/), non duplicate qui.
