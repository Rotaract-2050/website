# TinaCMS — riferimento best practice

Convenzioni ufficiali TinaCMS (tina.io/docs) applicate al sito.

## Setup Tina + Astro

Due percorsi ufficiali per integrare Tina in Astro (fonte: tina.io/docs/frameworks/astro e docs.astro.build/en/guides/cms/tina-cms):

- **Starter Astro-first di Tina** (`create-tina-app --template tina-astro-starter` o `@tinacms/astro`): editing visuale in-context (click-to-edit) tramite `<TinaIsland>` + `tinaField()`, senza React nell'albero pagina. Richiede `output: 'server'` (o isole server-side) e un adapter SSR (Vercel/Netlify/Cloudflare/Node) — **non è compatibile con hosting puramente statico**. È l'opzione migliore per l'esperienza dei soci non tecnici (vedono la pagina vera mentre editano), da preferire se l'hosting scelto supporta SSR.
- **Setup "Other framework"** (`@tinacms/cli init`, framework "Other"): Tina scrive/legge file markdown/mdx in `src/content/...`, editing tramite form in `/admin/index.html` senza preview live. Compatibile con output statico puro. Più semplice da hostare, meno immediato da usare per chi non è tecnico.

**Decisione presa: hosting su Netlify.** Netlify supporta entrambi i path (`@astrojs/netlify` fa da adapter sia per `output: 'static'` che `output: 'server'`/edge functions), quindi l'hosting non è più il vincolo — usare lo **starter Astro-first con editing visuale** (opzione preferita per soci non tecnici), con `output: 'server'` + `@astrojs/netlify`. Deploy automatico su Netlify a ogni push del branch collegato (git-backed, coerente col workflow Tina).

**Stato reale in `astro/astro.config.mjs`**: `output: 'server'` è già impostato correttamente, ma l'adapter è ancora `@astrojs/node({ mode: 'standalone' })` (lasciato così dal refactor iniziale, prima di questa decisione). Va sostituito con `@astrojs/netlify` prima del primo deploy Netlify — vedi anche `astro/README.md`.

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
- `ui.router` per collegare ogni collection alla route Astro corrispondente, così il pulsante "edit" di Tina porta alla pagina giusta (vedi `pageRouter` in `tina/config.ts` reale: deriva la route da `document._sys.breadcrumbs`).
- Non serve allineare `tina/config.ts` a un `src/content.config.ts` Astro: quel file non esiste in questo progetto (vedi `references/astro.md`) — i componenti leggono i contenuti direttamente dal client GraphQL generato da Tina, la struttura di riferimento è solo quella dello schema Tina.

## Pattern "Blocks" (website builder)

Fonte: tina.io/docs/editing/blocks. Un campo `object` con `list: true` e `templates: [...]` permette agli editor di aggiungere/riordinare/rimuovere sezioni di pagina (Hero, StatsBar, SplitSection, CardGrid, EventsList, NewsGrid, CtaBanner, ValuesGrid, RoleGrid, PagePlaceholder, ClubDirectory) senza scrivere codice. Ogni template Tina ha un componente Astro corrispondente con lo stesso nome in `src/components/blocks/`, renderizzato da `BlockRenderer.astro`.

**Discriminazione del blocco**: il match nel renderer avviene su **`block.__typename`**, non su un campo `_template` custom — `__typename` è generato dalla GraphQL API di Tina come `<Collection>Blocks<NomeTemplate>` (es. template `Hero` nella collection `pages` → `PagesBlocksHero`). Vedi `BlockRenderer.astro` reale in `astro/src/components/BlockRenderer.astro` per il pattern esatto (uno `{block.__typename === '...' && <Componente .../>}` per template, dentro un wrapper con `data-tina-field={tinaField(block)}`).

## Query e visual editing — pattern reale

Ogni route/blocco che legge contenuto Tina segue questo schema (vedi `astro/src/pages/[...slug].astro`, `astro/src/components/blocks/ClubDirectory.astro`):

```ts
import { requestWithMetadata, tinaField } from '@tinacms/astro';
import client from '.../tina/__generated__/client';

const result = await requestWithMetadata(client.queries.pages({ relativePath: `it/${slug}.md` }), { priority: 'primary' });
const page = result.data.pages;
```

- `client` è generato da `tinacms dev`/`tinacms build` in `tina/__generated__/` (gitignored, va rigenerato ad ogni checkout con `npm run dev` o `npx tinacms build` — richiede `TINA_CLIENT_ID`/`TINA_TOKEN` in `.env` per il build di produzione, non per `tinacms dev` in locale).
- `requestWithMetadata()` invece della chiamata diretta al client: abilita l'editing in-context.
- `tinaField(obj, 'campo')` sull'elemento che deve diventare cliccabile in editing.
- Relazioni Tina (club → zona) tramite campo schema `{ type: 'reference', collections: ['zones'] }`, risolte con due query separate (`zonesConnection`, `clubsConnection`) unite lato componente — non un'unica query annidata.

## Fonti

[Tina + Astro](https://tina.io/docs/frameworks/astro), [Astro + TinaCMS (Astro docs)](https://docs.astro.build/en/guides/cms/tina-cms/), [Content Modeling / Schema](https://tina.io/docs/schema), [Blocks / website builder](https://tina.io/docs/editing/blocks), [Tina Pricing](https://tina.io/pricing).
