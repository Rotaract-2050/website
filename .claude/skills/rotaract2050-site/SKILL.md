---
name: rotaract2050-site
description: Sviluppo e manutenzione del sito Rotaract Distretto 2050 (Astro + TinaCMS). Usare per creare/modificare pagine, componenti, collection Tina, palette colori o tono del sito. Contiene la palette ufficiale Rotary, il pattern a blocchi per pagine generiche, e le best practice ufficiali Astro/TinaCMS per il templating editabile da soci non tecnici.
---

# Sito Rotaract Distretto 2050

## Stack target

- **Astro** (content collections + islands architecture) per pagine/componenti.
- **TinaCMS** come CMS git-backed: ogni contenuto che un socio non tecnico deve poter modificare va esposto come collection/field Tina, mai come testo hardcoded nel componente.
- Zero-JS di default (principio Astro): niente framework component (`.tsx`/`.vue`) a meno che serva vera interattività client. La maggior parte del sito è HTML statico a build time.

## Stato attuale del repo

Il repo contiene solo un **mockup statico di riferimento**, non codice reale:

- [`Rotaract Distretto 2050.dc.html`](../../../Rotaract%20Distretto%202050.dc.html) — wireframe interattivo (bindings `{{ }}`, `sc-for`, `sc-if`, classe `DCLogic`) con contenuti IT/EN completi e realistici.
- `support.js`, `image-slot.js` — runtime del tool di prototipazione che ha generato il mockup. **Non portare questo runtime in Astro.**

Il mockup resta la fonte di verità per gerarchia visiva, copy IT/EN, colori e spaziature, ma va **generalizzato**: non ricreare 1:1 una pagina per "Home", una per "Distretto", ecc. con markup diverso ognuna. Vedi pattern a blocchi sotto — l'obiettivo è che aggiungere una nuova pagina (o sezione) sia un'operazione da CMS, non da codice.

## Pattern architetturale: pagine come sequenza di blocchi

Per restare generici su **tutte** le pagine (non solo le 7 del mockup) e permettere ai soci di comporre pagine nuove senza scrivere Astro, modellare ogni pagina come **elenco ordinato di blocchi**, seguendo il pattern ufficiale Tina "website builder" (`templates` + blocks, vedi tina.io/docs/editing/blocks):

1. **Collection Tina `page`** (`.tina/config.ts` o `tina/config.ts`): campo `title`, `slug`, `seo`, e un campo `blocks` di tipo `object` con `list: true` e `templates: [...]` — un template per ogni tipo di sezione riusabile (Hero, StatsBar, SplitSection, CardGrid, EventsList, NewsGrid, CtaBanner, ValuesGrid/RoleGrid, PagePlaceholder...).
2. **Componente Astro `BlockRenderer.astro`**: riceve l'array `blocks` e fa match su `_template` per renderizzare il componente Astro corrispondente (un componente `.astro` per ogni template Tina, stesso nome). Un socio che aggiunge un blocco da Tina ottiene automaticamente la sezione renderizzata, senza deploy di codice.
3. **Route generica** `src/pages/[...slug].astro` (o per-locale, vedi i18n sotto) che carica l'entry `page` dalla collection Astro corrispondente e passa `blocks` a `BlockRenderer`.
4. Pagine con logica non componibile a blocchi (es. elenco club per zona con dati relazionali) restano collection dedicate (`clubs`, `zones`) referenziate da un blocco `ClubDirectory` che le interroga via `reference()`.

Questo sostituisce l'approccio del mockup (una pagina fissa per `isHome`/`isDistretto`/`isClub`/...): i **blocchi** del mockup (hero carousel, stats bar, split mission, values grid, role grid, events list, news grid, cta banner, empty placeholder) diventano i **template Tina + componenti Astro** riusabili su qualunque pagina futura (nuova pagina evento, nuovo comitato, nuova zona) senza toccare codice.

## Content Collections Astro — convenzioni

- Schema in `src/content.config.ts` (build-time, contenuto relativamente statico — il caso di questo sito). Definire ogni collection con `defineCollection` + schema **Zod**: campi obbligatori sempre validati, niente `any`.
- Usare il loader `glob()` per collection a più file (una entry = una pagina/evento/news/club) e `file()` solo per liste compatte a file singolo (es. `zones.json`).
- Relazioni (club → zona, news → autore) tramite `reference()`, non stringhe libere duplicate.
- Immagini nei frontmatter tramite lo schema immagine di Astro (`image()` helper in Zod) per ottenere ottimizzazione automatica in build; mai URL hardcoded o `<img>` senza `astro:assets`.
- Mantenere la struttura Tina (`tina/config.ts` collections) e la struttura Astro (`src/content.config.ts`) **allineate 1:1** per nome/campi: Tina scrive nei file che Astro legge, non due modelli paralleli.

## Internazionalizzazione (IT default / EN)

Il mockup incorpora IT/EN come oggetto unico dentro ogni componente (`IT = {...}`, `EN = {...}`). Per il sito reale, preferire il **routing i18n nativo di Astro** (`astro:i18n`), più scalabile e allineato alle best practice ufficiali:

- `astro.config.mjs`: `i18n.locales = ['it','en']`, `defaultLocale: 'it'`, `prefixDefaultLocale: false` → IT senza prefisso (`/distretto`), EN con prefisso (`/en/distretto`).
- Contenuti per lingua come entry separate nella stessa collection (una per IT, una per EN, stesso slug) oppure sotto-cartelle locale in `src/content/<collection>/it/`, `.../en/` — decidere una convenzione la prima volta e restare coerenti.
- Usare `getRelativeLocaleUrl()` per generare link interni invece di stringhe hardcoded.
- Stringhe di interfaccia fisse (nav, footer, bottoni ricorrenti) in un piccolo dizionario per-locale (non serve Tina per queste, sono di sistema); i **contenuti editoriali** (titoli, testi, eventi, news) restano sempre su Tina, in entrambe le lingue.

## TinaCMS — setup e best practice

Due percorsi ufficiali per integrare Tina in Astro (fonte: tina.io/docs/frameworks/astro e docs.astro.build/en/guides/cms/tina-cms):

- **Starter Astro-first di Tina** (`create-tina-app --template tina-astro-starter` o `@tinacms/astro`): editing visuale in-context (click-to-edit) tramite `<TinaIsland>` + `tinaField()`, senza React nell'albero pagina. Richiede `output: 'server'` (o isole server-side) e un adapter SSR (Vercel/Netlify/Cloudflare/Node) — **non è compatibile con hosting puramente statico**. È l'opzione migliore per l'esperienza dei soci non tecnici (vedono la pagina vera mentre editano), da preferire se l'hosting scelto supporta SSR.
- **Setup "Other framework"** (`@tinacms/cli init`, framework "Other"): Tina scrive/legge file markdown/mdx in `src/content/...`, editing tramite form in `/admin/index.html` senza preview live. Compatibile con output statico puro. Più semplice da hostare, meno immediato da usare per chi non è tecnico.

Scegliere in base all'hosting disponibile (verificare con l'utente prima di impostare `output: 'server'`); se non ancora deciso, favorire comunque lo starter con editing visuale per il beneficio ai soci, segnalando il requisito SSR come conseguenza.

Convenzioni schema Tina:
- Ogni collection/field con **label in italiano semplice** (`label: "Titolo evento"`), non il nome tecnico del campo.
- Campi `rich-text` solo dove serve prosa lunga (corpo news/eventi); per tutto il resto `string`/`image`/`list`/`datetime`/`boolean`, per restare semplici da editare.
- `isBody: true` sul campo che deve finire nel corpo markdown invece che in frontmatter (tipicamente il rich-text principale).
- Blocchi/pagine flessibili tramite `templates` (vedi pattern sopra), non tramite `boolean` multipli tipo `isHome`/`isDistretto` come nel mockup.
- Immagini sempre via media manager Tina (mai URL incollati a mano).
- `ui.router` per collegare ogni collection alla route Astro corrispondente, così il pulsante "edit" di Tina porta alla pagina giusta.

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
- Contenuto bilingue **IT (default) / EN**, vedi sezione i18n.
- Placeholder/dati fittizi (nomi cariche, contatti club) vanno sempre marcati con un disclaimer visibile (campo `disclaimer`/`showDisclaimer` sul blocco) finché non sono dati reali.

## Componenti Astro — convenzioni

- `.astro` per tutto ciò che non richiede interattività client (praticamente tutto in questo sito: card, griglie, hero statico, footer). Framework component + `client:*` solo per casi reali (es. un carosello che deve girare lato client): scegliere la direttiva di hydration più leggera possibile (`client:visible` per componenti sotto la piega, `client:idle` per non bloccanti, `client:load` solo se serve subito).
- Props tipizzate con `interface Props` in ogni componente `.astro`, con default sensati via destructuring.
- Usare `<slot />` (anche named slot) per layout/wrapper condivisi invece di duplicare markup.
- Un componente Astro per template Tina (vedi pattern a blocchi) — 1 nome, 1 file, mappatura diretta.

## Da evitare

- Non copiare `sc-for`/`sc-if`/`x-dc`/`DCLogic` in Astro: sono sintassi del tool di prototipazione, non pattern Astro.
- Non ricreare una pagina/componente dedicata per ogni sezione del mockup: usare il pattern a blocchi cosicché nuove pagine non richiedano nuovo codice.
- Non introdurre colori, font o toni fuori da quanto sopra.
- Non hardcodare testo che un socio dovrebbe poter modificare da Tina.
- Non rompere il pattern IT/EN (routing i18n + contenuti Tina per lingua).
- Non usare componenti framework (`client:*`) dove basterebbe HTML statico: mantenere il sito zero-JS di default.
- Non rimuovere i disclaimer sui dati placeholder finché non sono sostituiti da dati reali confermati dal distretto.

## Fonti

Best practice recuperate da documentazione ufficiale: [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/), [Astro Project Structure](https://docs.astro.build/en/basics/project-structure/), [Astro i18n](https://docs.astro.build/en/guides/internationalization/), [Astro Islands](https://docs.astro.build/en/concepts/islands/), [Astro Components](https://docs.astro.build/en/basics/astro-components/), [Astro + TinaCMS](https://docs.astro.build/en/guides/cms/tina-cms/), [Tina + Astro](https://tina.io/docs/frameworks/astro), [Tina Schema](https://tina.io/docs/schema), [Tina Blocks / website builder](https://tina.io/docs/editing/blocks), [Rotary Brand Center — Colors](https://brandcenter.rotary.org/en-us/our-brand/brand-elements/colors).
