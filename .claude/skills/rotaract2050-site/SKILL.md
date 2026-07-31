---
name: rotaract2050-site
description: Sviluppo e manutenzione del sito Rotaract Distretto 2050 (Astro + TinaCMS), bilingue italiano/inglese. Usare per creare/modificare pagine, componenti, collection Tina, palette colori, loghi o tono del sito. Indice verso le regole di brand Rotary ufficiali, le best practice Astro e TinaCMS, e il pattern a blocchi per pagine generiche editabili da soci non tecnici.
---

# Sito Rotaract Distretto 2050

## Stack target

- **Astro** (content collections + islands architecture) per pagine/componenti.
- **TinaCMS** come CMS git-backed: ogni contenuto che un socio non tecnico deve poter modificare va esposto come collection/field Tina, mai come testo hardcoded nel componente.
- Zero-JS di default (principio Astro): niente framework component (`.tsx`/`.vue`) a meno che serva vera interattività client. La maggior parte del sito è HTML statico a build time.
- **Sito bilingue obbligatorio, italiano (default) + inglese**: ogni pagina, blocco e stringa editoriale esiste in entrambe le lingue, nessuna pagina solo-IT o solo-EN. Routing e convenzioni in `references/astro.md` (sezione Internazionalizzazione).
- **Hosting: Netlify** (piano free), deploy automatico da git push. Adapter `@astrojs/netlify`. Dettagli setup Tina+Netlify e vincolo utenti Tina Cloud free (2 editor) in `references/tina.md`.

## Stato attuale del repo

Il progetto Astro+Tina **reale e funzionante vive alla root del repo** (non in una sottocartella) — non è più solo un mockup. È già stato implementato seguendo il pattern a blocchi descritto sotto: `tina/config.ts` (schema), `src/pages/[...slug].astro` + `src/pages/en/[...slug].astro` (route), `src/components/BlockRenderer.astro` + `src/components/blocks/*.astro` (11 blocchi), `src/content/{pages,zones,clubs,settings}/` (contenuti git-backed). Leggere questi file **prima** di aggiungere qualcosa di nuovo: sono l'esempio concreto da estendere, più affidabile di qualunque descrizione astratta in questa skill. Il `README.md` alla root riassume struttura e comandi.

Il vecchio mockup HTML statico di prototipazione (`Rotaract Distretto 2050.dc.html`, `support.js`, `image-slot.js`) non è più nel repo: è stato superato dall'implementazione reale. Se compare ancora un riferimento a `sc-for`/`sc-if`/`x-dc`/`DCLogic` da qualche parte è un residuo da correggere, non un pattern da seguire.

## Pattern architetturale: pagine come sequenza di blocchi

Per restare generici su **tutte** le pagine (non solo le 7 del mockup) e permettere ai soci di comporre pagine nuove senza scrivere Astro, modellare ogni pagina come **elenco ordinato di blocchi**, seguendo il pattern ufficiale Tina "website builder" (`templates` + blocks — dettagli in `references/tina.md`):

1. **Collection Tina `pages`** (`tina/config.ts`): campo `title`, `eyebrow`, `breadcrumbCurrent`, `seo`, e un campo `blocks` di tipo `object` con `list: true` e `templates: [...]` — un template per ogni tipo di sezione riusabile (Hero, StatsBar, SplitSection, CardGrid, EventsList, NewsGrid, CtaBanner, ValuesGrid, RoleGrid, PagePlaceholder, ClubDirectory...).
2. **Componente Astro `BlockRenderer.astro`**: riceve l'array `blocks` e fa match su **`block.__typename`** (non su un campo `_template` custom: `__typename` è generato automaticamente dalla GraphQL API di Tina come `<Collection><Blocks><NomeTemplate>`, es. `PagesBlocksHero` per il template `Hero` nella collection `pages`) per renderizzare il componente Astro corrispondente. Un socio che aggiunge un blocco da Tina ottiene automaticamente la sezione renderizzata, senza deploy di codice.
3. **Route** `src/pages/[...slug].astro` (IT) e `src/pages/en/[...slug].astro` (EN) — rest parameter Astro, non un placeholder: cattura qualunque slug. Ognuna interroga il client GraphQL generato da Tina (`requestWithMetadata(client.queries.pages({ relativePath: 'it/${slug}.md' }), { priority: 'primary' })`) per ottenere la entry `page`, poi passa `page.blocks` a `BlockRenderer`. Vedi `references/tina.md` per i dettagli di questo pattern (niente Astro Content Collections qui, i dati arrivano dal client Tina).
4. Pagine con logica non componibile a blocchi (es. elenco club per zona con dati relazionali) restano collection Tina dedicate (`zones`, `clubs`, con un campo Tina `type: 'reference'` da club a zona) interrogate da un blocco `ClubDirectory` che fa due query GraphQL (`zonesConnection`, `clubsConnection`) e le unisce lato componente.

Questo sostituisce l'approccio del mockup (una pagina fissa per `isHome`/`isDistretto`/`isClub`/...): i **blocchi** del mockup (hero carousel, stats bar, split mission, values grid, role grid, events list, news grid, cta banner, empty placeholder) diventano i **template Tina + componenti Astro** riusabili su qualunque pagina futura (nuova pagina evento, nuovo comitato, nuova zona) senza toccare codice.

## Riferimenti — leggere prima di agire sul tema specifico

Il dettaglio non sta in questo file: leggere la reference pertinente **prima** di scrivere codice o contenuti sul relativo tema, non fidarsi della memoria.

- **`references/rotary-brand.md`** — prima di toccare colori, font, tono di voce, loghi/emblemi, foto/video o naming "Rotary"/"Rotaract": palette ufficiale (con discrepanze note del mockup), tipografia ufficiale, voce di brand, regole loghi, regole fotografia/video, regole sul nome. Fonte: brandcenter.rotary.org.
- **`references/astro.md`** — prima di definire content collections, routing i18n, o convenzioni componenti `.astro`. Fonte: docs.astro.build.
- **`references/astro-standards.md`** — checklist qualità **obbligatoria** su ogni componente/pagina: niente `set:html` su contenuto non sanificato, niente stili inline sparsi, sempre `<Image>`/`<Picture>` con `alt`, TypeScript strict, HTML semantico (no `<div onClick>`), SEO/sitemap. Da rileggere prima di dichiarare un componente "finito", non solo alla creazione del progetto.
- **`references/tina.md`** — prima di impostare o modificare `tina/config.ts`, scegliere il setup Tina+Astro (visual editing vs static), o definire il pattern a blocchi. Fonte: tina.io/docs.

**Nessuna scorciatoia silenziosa**: se per fare prima si vuole saltare una best practice (in queste reference o note nel resto della skill), non farlo senza dirlo esplicitamente all'utente. "Più veloce così" non è mai un motivo sufficiente da solo per introdurre HTML iniettato non sanificato, markup non semantico, stili inline sparsi o `any` non tipizzato.

## Da evitare

- Non copiare `sc-for`/`sc-if`/`x-dc`/`DCLogic` in Astro: sono sintassi del tool di prototipazione, non pattern Astro.
- Non ricreare una pagina/componente dedicata per ogni sezione del mockup: usare il pattern a blocchi cosicché nuove pagine non richiedano nuovo codice.
- Non introdurre colori, font, loghi o toni fuori da quanto in `references/rotary-brand.md`.
- Non hardcodare testo che un socio dovrebbe poter modificare da Tina.
- Non rompere il pattern IT/EN (routing i18n + contenuti Tina per lingua, vedi `references/astro.md`).
- Non usare componenti framework (`client:*`) dove basterebbe HTML statico: mantenere il sito zero-JS di default.
- Non rimuovere i disclaimer sui dati placeholder finché non sono sostituiti da dati reali confermati dal distretto.
- Non usare `set:html` su contenuto non sanificato "per fare prima" — vedi `references/astro-standards.md`.
- Non usare `<div onClick>` al posto di `<a>`/`<button>` semantici, non riempire il markup di `style="..."` inline, non lasciare `Astro.props` non tipizzato: vedi `references/astro-standards.md` per la checklist completa.
