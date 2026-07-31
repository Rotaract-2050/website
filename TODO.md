# TODO

Generato confrontando questo sito con il sito attuale in produzione ([rotaract2050.org](https://www.rotaract2050.org/)). Serve a tracciare pagine/dati mancanti o segnaposto da sostituire con contenuti reali, non decisioni tecniche (quelle sono in [`.claude/skills/rotaract2050-site/`](.claude/skills/rotaract2050-site/)).

## Pagine con dati segnaposto da sostituire con dati reali

- [x] **Home — statistiche club/soci/zone**: corretto a `30 club / 403 soci / 4 zone` (numeri reali da rotaract2050.org).
- [ ] **Home — statistica "progetti attivi"**: resta `40+`, placeholder — il sito attuale non riporta questo dato, chiedere il numero reale al distretto.
- [ ] **Home — tema dell'anno**: sito attuale ha un motto sociale in evidenza ("Formiamoci per non fermarci mai" per l'anno in corso) — il nuovo sito non ha questo elemento, valutare se aggiungerlo come blocco/eyebrow in home.
- [ ] **Il Distretto — box Rappresentante Distrettuale**: sostituire "Nome Cognome" con dato reale (Rappresentante Distrettuale attuale: Lorenzo Pancini, rd@rotaract2050.org) + quote reale.
- [ ] **Il Distretto — Direttivo Distrettuale (RoleGrid)**: lo schema attuale ha 4 ruoli fissi placeholder (RD, VR, SD, TD). Il direttivo reale ha 9 persone e ruoli diversi — rivedere lo schema del blocco `RoleGrid`/i dati, non solo compilare i nomi:
  | Ruolo | Nome | Contatto |
  |---|---|---|
  | Rappresentante Distrettuale | Lorenzo Pancini | rd@rotaract2050.org |
  | Immediate Past R.D. | Guido Bosi | — |
  | R.D. Incoming | Sebastiano Fortugno | rd.incoming@rotaract2050.org |
  | Segretario Distrettuale e Vice RD | Edoardo Zaffignani | segreteria@rotaract2050.org |
  | Tesoriere Distrettuale | Riccardo Amerio | tesoreria@rotaract2050.org |
  | Prefetto Distrettuale | Alessandro Drovanti | prefettura@rotaract2050.org |
  | Prefetto Distrettuale | Valeria Bastiani | prefettura@rotaract2050.org |
  | Consigliere Distrettuale | Alessandro Puerari | — |
  | Consigliere Distrettuale | Clara Brugali | — |
- [ ] **Esecutivo Distrettuale** (oggi pagina "in preparazione"): popolare con la stessa tabella del direttivo sopra (o capire se è una pagina distinta dal box "Il Distretto" — sul sito attuale sembra ripetere le stesse persone).
- [ ] **Delegati di Zona** (oggi pagina "in preparazione"): popolare — 3 persone per 4 zone (una copre 2 zone):
  | Zona | Nome | Contatto |
  |---|---|---|
  | Navigli | Marcello Gorla | dz.navigli@rotaract2050.org |
  | Leonessa | Alberto Paitoni Faustinoni | dz.leonessa@rotaract2050.org |
  | Francigena + Padana | Benedetta Basola | dz.francigena@rotaract2050.org, dz.padana@rotaract2050.org |
- [ ] **Commissioni Distrettuali** (oggi pagina "in preparazione"): popolare con le 15 commissioni elencate sul sito attuale (nomi dei presidenti non pubblicati lì — da chiedere al distretto):
  Azione Interna · Risoluzione e Controversie · Service · Pubblica Immagine e Comunicazione · Sviluppo Professionale e Leadership · Premio Maturità · Premio Università · R.Y.L.A. e R.Y.L.A. Junior · Azione Internazionale · Delegato E.R.I.C. · Delegato Rotaract per lo Scambio Giovani · Commissione Interdistrettuale 2041-2042-2050 · Delegato Rotaract per la Rotary Foundation · Commissione Rotary-Rotaract · Commissione Rotary-Interact
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

## Fuori scope di questo file

Decisioni di brand, palette, tipografia, logo ufficiale, hosting, setup Tina → [`.claude/skills/rotaract2050-site/`](.claude/skills/rotaract2050-site/), non duplicate qui.
