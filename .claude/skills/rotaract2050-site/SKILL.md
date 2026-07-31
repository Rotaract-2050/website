---
name: rotaract2050-site
description: Sviluppo e manutenzione del sito Rotaract Distretto 2050 (Astro + TinaCMS). Usare per creare/modificare pagine, componenti, collection Tina, palette colori o tono del sito. Contiene la palette ufficiale Rotary, la mappa delle sezioni della homepage di riferimento e le regole di templating per editor non tecnici.
---

# Sito Rotaract Distretto 2050

## Stack target

- **Astro** (SSG/islands) come framework di pagina/componenti.
- **TinaCMS** come CMS: ogni contenuto che un socio non tecnico deve poter modificare (testi, immagini, eventi, news, elenco club, cariche) va esposto come collection/field Tina, mai come testo hardcoded nel componente.
- Niente altri framework CMS o page builder. Niente stato client pesante: il sito è istituzionale, contenuti perlopiù statici a build time.

## Stato attuale del repo

Il repo contiene solo un **mockup statico di riferimento**, non codice reale:

- [`Rotaract Distretto 2050.dc.html`](../../../Rotaract%20Distretto%202050.dc.html) — wireframe interattivo (bindings `{{ }}`, `sc-for`, `sc-if`, classe `DCLogic`) con contenuti IT/EN completi e realistici.
- `support.js`, `image-slot.js` — runtime del tool di prototipazione che ha generato il mockup. **Non portare questo runtime in Astro.**

Questo file è la fonte di verità per: struttura delle pagine, copy IT/EN, gerarchia visiva, colori e spaziature. Va **tradotto in componenti Astro + schema Tina**, non copiato as-is.

## Palette ufficiale Rotary (brandcenter.rotary.org)

Usare **solo** questi colori (o tinte neutre/grigie della palette) per elementi di brand. Non inventare colori.

| Ruolo nel sito | Nome Rotary | Hex | Uso nel mockup |
|---|---|---|---|
| Primario scuro (header, footer, blocchi dark) | Rotary Royal Blue | `#17458F` | mockup usa `#0B2545`, navy più scuro — **verificare con il distretto quale usare**: `#0B2545` non è un colore ufficiale brandcenter |
| Accent/CTA/link | Cranberry | `#D41367` | usato correttamente, è colore ufficiale |
| Accent secondario (numeri, badge su sfondo scuro) | Rotary Gold | `#F7A81B` | usato correttamente |
| Blu azione/link alternativo | Azure | `#0067C8` | non ancora usato, disponibile |
| Sfondo pagina chiaro | White / neutro | `#FFFFFF`, `#FAFAFB` | ok, `#FAFAFB` è tinta neutra non ufficiale ma coerente (quasi-bianco) |
| Testo body | Charcoal-ish grigio | `#54565A` (Charcoal ufficiale) | mockup usa `#5B6472` (blu-grigio, non ufficiale ma leggibile) |

**Regola pratica**: prima di introdurre un componente nuovo, chiedere conferma su `#0B2545` vs `#17458F` (Royal Blue ufficiale) se non già deciso nel progetto — è la discrepanza principale rispetto al brandcenter. Se non c'è risposta, mantenere `#0B2545` per coerenza con la homepage esistente (regola "mantenere lo stile della homepage" prevale finché non arriva una decisione esplicita), ma segnalarlo sempre all'utente.

Non usare mai colori secondari (Cardinal, Violet, Turquoise, Grass, Orange) senza motivo di brand esplicito: il sito distrettuale deve restare essenziale, non "arcobaleno".

## Tipografia

Mockup usa Google Fonts **Barlow** (testo) e **Barlow Condensed** (titoli, uppercase, tracking largo). Mantenere questa coppia finché non arriva una guida tipografica ufficiale Rotary diversa. Non introdurre altri font.

## Tono e lingua

- Tono **istituzionale**, pulito, mai giocoso o casual. Frasi brevi, verbi diretti ("Scopri", "Trova il tuo club").
- Contenuto bilingue **IT (default) / EN**, come nel mockup (`IT`/`EN` in `Component`). Ogni nuova stringa va aggiunta in entrambe le lingue.
- Placeholder/dati fittizi (nomi cariche, contatti club) vanno sempre marcati con un disclaimer visibile (vedi `sampleDisclaimer` / `showDisclaimer` nel mockup) finché non sono dati reali.

## Struttura del sito (dalla homepage di riferimento)

Pagine/route da ricreare in Astro (`src/pages/`):

- `/` **Home**: hero carousel (slide con eyebrow/titolo/sottotitolo/CTA), stats bar (4 numeri), sezione mission ("Chi siamo"), preview zone/club, elenco eventi, griglia news, CTA banner finale.
- `/distretto` **Il Distretto**: header con breadcrumb, box rappresentante distrettuale (foto + quote + intro + missione), griglia valori (L.A.D.S. — Leadership, Amicizia, Diversità&Inclusione, Service), griglia direttivo distrettuale.
- `/club` **I Club**: intro, 4 zone (Francigena, Leonessa, Navigli, Padana) ciascuna con griglia club.
- `/distretto/esecutivo`, `/distretto/delegati`, `/distretto/commissioni`: pagine "in preparazione" (stesso layout header+placeholder), da popolare quando arrivano i dati.
- Header globale: nav (Home / Il Distretto ▾ con sottomenu / I Club), bottone "Materiali distrettuali", CTA "Entra in Rotaract", selettore lingua IT/EN, utility bar (link Rotary Distretto 2050 / Rotary International / Interact 2050), social icons.
- Footer globale: about, link utili, contatti, social, copyright + "Sostenuto dal Rotary Distretto 2050".

## Componenti Astro da estrarre (riuso massimo)

Ogni sezione ricorrente del mockup deve diventare **un componente riusabile** con contenuti da collection Tina, così i soci possono aggiungere pagine/sezioni senza toccare codice:

- `Header.astro` (con dropdown "Il Distretto", lang switch)
- `Footer.astro`
- `PageHero.astro` (banner con breadcrumb, eyebrow, titolo — usato in tutte le sottopagine)
- `HeroCarousel.astro` (slide gestibili da Tina come lista)
- `StatsBar.astro`
- `SplitSection.astro` (immagine + testo, usato per mission e per il box rappresentante)
- `ValuesGrid.astro` / `RoleGrid.astro` (card con lettera/iniziali + titolo + testo — pattern riusabile)
- `ClubZoneList.astro` (zone → club)
- `EventsList.astro`
- `NewsGrid.astro`
- `CtaBanner.astro`
- `EmptyPagePlaceholder.astro` (per pagine "in preparazione")
- `ImageSlot.astro` (sostituisce `image-slot.js` del mockup: placeholder immagine con testo alt descrittivo finché non c'è la foto reale)

## Linee guida TinaCMS

- Ogni collection deve avere **label ed field in italiano semplice**, pensati per un socio non tecnico (es. "Titolo evento", non "eventTitle" nudo — usare `label` Tina esplicite).
- Usare campi `rich-text` solo dove serve davvero (corpo news/eventi); per tutto il resto campi `string`/`image`/`list` semplici, per non intimidire chi edita.
- Struttura collection consigliata: `hero` (slide), `stats`, `mission`, `events`, `news`, `zones`/`clubs`, `distretto` (rappresentante, valori, direttivo), `pagineVuote` (esecutivo/delegati/commissioni), `footer`, `nav`.
- Ogni collection con contenuti bilingue: due campi o due file per lingua (IT/EN), coerente col pattern `IT`/`EN` del mockup — decidere e documentare la convenzione la prima volta che si crea lo schema, poi restare coerenti.
- Le immagini vanno sempre tramite media manager Tina, mai URL hardcoded.

## Da evitare

- Non copiare `sc-for`/`sc-if`/`x-dc`/`DCLogic` in Astro: sono sintassi del tool di prototipazione, non pattern Astro.
- Non introdurre colori, font o toni fuori da quanto sopra.
- Non hardcodare testo che un socio dovrebbe poter modificare da Tina.
- Non rompere il pattern IT/EN.
- Non rimuovere i disclaimer sui dati placeholder finché non sono sostituiti da dati reali confermati dal distretto.
