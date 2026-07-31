# TinaCMS — riferimento best practice

Convenzioni ufficiali TinaCMS (tina.io/docs) applicate al sito.

## Setup Tina + Astro

Due percorsi ufficiali per integrare Tina in Astro (fonte: tina.io/docs/frameworks/astro e docs.astro.build/en/guides/cms/tina-cms):

- **Starter Astro-first di Tina** (`create-tina-app --template tina-astro-starter` o `@tinacms/astro`): editing visuale in-context (click-to-edit) tramite `<TinaIsland>` + `tinaField()`, senza React nell'albero pagina. Richiede `output: 'server'` (o isole server-side) e un adapter SSR (Vercel/Netlify/Cloudflare/Node) — **non è compatibile con hosting puramente statico**. È l'opzione migliore per l'esperienza dei soci non tecnici (vedono la pagina vera mentre editano), da preferire se l'hosting scelto supporta SSR.
- **Setup "Other framework"** (`@tinacms/cli init`, framework "Other"): Tina scrive/legge file markdown/mdx in `src/content/...`, editing tramite form in `/admin/index.html` senza preview live. Compatibile con output statico puro. Più semplice da hostare, meno immediato da usare per chi non è tecnico.

**Decisione presa: hosting su Netlify.** Netlify supporta entrambi i path (`@astrojs/netlify` fa da adapter sia per `output: 'static'` che `output: 'server'`/edge functions), quindi l'hosting non è più il vincolo — usare lo **starter Astro-first con editing visuale** (opzione preferita per soci non tecnici), con `output: 'server'` + `@astrojs/netlify`. Deploy automatico su Netlify a ogni push del branch collegato (git-backed, coerente col workflow Tina).

## Account Tina Cloud — vincolo utenti

Piano **Free** di Tina Cloud (tina.io/pricing): **2 utenti/editor**, 1 progetto, documenti illimitati, 100MB limite per asset. Prima di attivare l'account, confermare con l'utente quante persone del direttivo/comitati devono editare autonomamente da Tina:
- se restano 1-2 persone → piano Free sufficiente, nessuna azione.
- se servono più editor indipendenti → serve piano Team (da $24/mese, base 3 utenti espandibile a 10) fin dall'inizio, altrimenti si scontrerà il limite non appena si aggiunge un terzo account.

Non presumere il numero di editor: è una decisione dell'utente, non tecnica.

## Convenzioni schema

- Ogni collection/field con **label in italiano semplice** (`label: "Titolo evento"`), non il nome tecnico del campo.
- Campi `rich-text` solo dove serve prosa lunga (corpo news/eventi); per tutto il resto `string`/`image`/`list`/`datetime`/`boolean`, per restare semplici da editare.
- `isBody: true` sul campo che deve finire nel corpo markdown invece che in frontmatter (tipicamente il rich-text principale).
- Blocchi/pagine flessibili tramite `templates` (vedi pattern a blocchi in SKILL.md), non tramite `boolean` multipli tipo `isHome`/`isDistretto` come nel mockup.
- Immagini sempre via media manager Tina (mai URL incollati a mano).
- `ui.router` per collegare ogni collection alla route Astro corrispondente, così il pulsante "edit" di Tina porta alla pagina giusta.
- Mantenere la struttura Tina (`tina/config.ts` collections) e la struttura Astro (`src/content.config.ts`) allineate 1:1 per nome/campi.

## Pattern "Blocks" (website builder)

Fonte: tina.io/docs/editing/blocks. Un campo `object` con `list: true` e `templates: [...]` permette agli editor di aggiungere/riordinare/rimuovere sezioni di pagina (Hero, StatsBar, SplitSection, CardGrid, EventsList, NewsGrid, CtaBanner, ValuesGrid/RoleGrid, PagePlaceholder...) senza scrivere codice. Ogni template Tina deve avere un componente Astro corrispondente con lo stesso nome, renderizzato da un `BlockRenderer.astro` centrale che fa match su `_template`. Vedi SKILL.md per il pattern architetturale completo.

## Fonti

[Tina + Astro](https://tina.io/docs/frameworks/astro), [Astro + TinaCMS (Astro docs)](https://docs.astro.build/en/guides/cms/tina-cms/), [Content Modeling / Schema](https://tina.io/docs/schema), [Blocks / website builder](https://tina.io/docs/editing/blocks), [Tina Pricing](https://tina.io/pricing).
