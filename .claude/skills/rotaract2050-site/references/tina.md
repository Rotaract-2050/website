# TinaCMS — riferimento best practice

Convenzioni ufficiali TinaCMS (tina.io/docs) applicate al sito.

## Setup Tina + Astro

Due percorsi ufficiali per integrare Tina in Astro (fonte: tina.io/docs/frameworks/astro e docs.astro.build/en/guides/cms/tina-cms):

- **Starter Astro-first di Tina** (`create-tina-app --template tina-astro-starter` o `@tinacms/astro`): editing visuale in-context (click-to-edit) tramite `<TinaIsland>` + `tinaField()`, senza React nell'albero pagina. Richiede `output: 'server'` (o isole server-side) e un adapter SSR (Vercel/Netlify/Cloudflare/Node) — **non è compatibile con hosting puramente statico**. È l'opzione migliore per l'esperienza dei soci non tecnici (vedono la pagina vera mentre editano), da preferire se l'hosting scelto supporta SSR.
- **Setup "Other framework"** (`@tinacms/cli init`, framework "Other"): Tina scrive/legge file markdown/mdx in `src/content/...`, editing tramite form in `/admin/index.html` senza preview live. Compatibile con output statico puro. Più semplice da hostare, meno immediato da usare per chi non è tecnico.

**Decisione presa: hosting su Netlify.** Netlify supporta entrambi i path (`@astrojs/netlify` fa da adapter sia per `output: 'static'` che `output: 'server'`/edge functions), quindi l'hosting non è più il vincolo — usare lo **starter Astro-first con editing visuale** (opzione preferita per soci non tecnici), con `output: 'server'` + `@astrojs/netlify`. Deploy automatico su Netlify a ogni push del branch collegato (git-backed, coerente col workflow Tina).

**Stato reale in `astro.config.mjs`**: `output: 'server'` + adapter `@astrojs/netlify()`. Il progetto Astro vive alla root del repo (non in sottocartella), `netlify.toml` alla root non ha bisogno di `base`.

**Pipeline verificata funzionante end-to-end**: dev locale → push GitHub (`Rotaract-2050/website`, branch `main`) → Tina Cloud (progetto `45ced600-56cb-4e98-a4eb-26f93b147dcf`, indicizza da GitHub) → Netlify (sito `rotaract2050`, https://rotaract2050.netlify.app, deploy automatico ad ogni push su `main`, env `TINA_CLIENT_ID`/`TINA_TOKEN` impostate). Login Tina Cloud e salvataggio con commit su GitHub testati con successo sul sito live — **non sul dev locale**: `tinacms dev` in locale gira sempre in "local mode" (nessun login, nessun account Tina Cloud, editing su filesystem locale) per design, il vero login esiste solo su un build che parla con Tina Cloud (sito deployato, o `npm run build && astro preview` in locale con `TINA_TOKEN` valido).

**Account Netlify — SSO di default**: un account/team Netlify nuovo ha `site_sso_login: true` a livello di account (protegge *tutti* i siti del team dietro login Netlify, non solo questo). Per un sito pubblico va disattivato dalla dashboard (Team settings → Security/SSO) — non risulta scrivibile via `netlify api updateAccount` (write silenziosamente ignorato, campo probabilmente non esposto in scrittura dall'API pubblica).

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

Fonte: tina.io/docs/editing/blocks. Un campo `object` con `list: true` e `templates: [...]` permette agli editor di aggiungere/riordinare/rimuovere sezioni di pagina (Hero, StatsBar, SplitSection, CardGrid, EventsCalendar, NewsGrid, CtaBanner, ValuesGrid, RoleGrid, PagePlaceholder, ClubDirectory) senza scrivere codice. Ogni template Tina ha un componente Astro corrispondente con lo stesso nome in `src/components/blocks/`, renderizzato da `BlockRenderer.astro`.

**Discriminazione del blocco**: il match nel renderer avviene su **`block.__typename`**, non su un campo `_template` custom — `__typename` è generato dalla GraphQL API di Tina come `<Collection>Blocks<NomeTemplate>` (es. template `Hero` nella collection `pages` → `PagesBlocksHero`). Vedi `BlockRenderer.astro` reale in `src/components/BlockRenderer.astro` per il pattern esatto (uno `{block.__typename === '...' && <Componente .../>}` per template, dentro un wrapper con `data-tina-field={tinaField(block)}`).

## Query e visual editing — pattern reale

Ogni route/blocco che legge contenuto Tina segue questo schema (vedi `src/pages/[...slug].astro`, `src/components/blocks/ClubDirectory.astro`):

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

## Visual editing — limiti noti e workaround

Due comportamenti non documentati di `@tinacms/astro`/`@tinacms/bridge`, scoperti lavorando sulla collection `events` (router condiviso con la pagina `/eventi` + blocco `EventsArchive` con UI interattiva client-side):

- **Collection con `ui.router` che punta allo stesso path per più documenti** (es. eventi senza pagina dedicata, tutti su `/eventi#slug`, solo l'hash cambia): Tina identifica il documento in preview dal **path**, non dall'hash. Cliccare un documento nella lista collection apre quindi il form del documento che possiede quel path (es. la pagina `pages/it/eventi.md`), non quello cliccato. Le collection con path unico per documento (`news`, `/news/<slug>`) non hanno questo problema. **Workaround**: nell'anteprima live, cliccare direttamente sul campo/testo del documento specifico (usa `data-tina-field`, non il router) invece che sulla riga nella lista collection.
- **Il click-capture del quick-edit inghiotte i click su UI interattiva dentro un blocco**: `BlockRenderer.astro` avvolge ogni blocco in `<div data-tina-field={tinaField(block)}>`. Il listener globale di `@tinacms/bridge` (`click`, capture phase, `stopPropagation`) risolve il campo cliccato con `element.closest('[data-tina-field]')` e intercetta il click anche per elementi **senza un field proprio** (es. tab/filtri client-side dentro il blocco), impedendo a script custom del componente di ricevere l'evento. Un `data-tina-field=""` (vuoto, non omesso) su quell'elemento ferma la risalita più vicino: Tina lo trova, lo valuta falsy, lascia passare il click normalmente — vedi il contenitore `.year-tabs` in `EventsArchive.astro`. Serve solo su UI interattiva dentro un blocco che non ha già un field più specifico su cui "atterrare" il click (gli articoli `EventCard`, con un `data-tina-field` reale, non ne hanno bisogno).
- **L'indexer di `tinacms dev` riscrive il frontmatter dei file `.md` che tocca**, non solo al salvataggio dall'admin: appena un file entra nell'indicizzazione (es. subito dopo una modifica fatta a mano/da agente fuori da Tina), viene riserializzato nel formato canonico di Tina — virgolette singole invece di doppie, `_template` spostato in fondo alla mappa del blocco invece che in testa. Non è un bug di dati (il contenuto non cambia), ma un `git diff` su un file appena editato può mostrare più righe cambiate del previsto: normale, non va scambiato per una modifica indesiderata.

## Dev locale: `npm run dev` → `scripts/dev.sh`

Il comando combinato `tinacms dev -c "astro dev"` è fragile: in alcuni ambienti (sandbox Claude Code inclusi) `astro dev` come figlio di `tinacms -c` ritorna il controllo subito invece di restare in foreground, `tinacms dev` vede il "comando web" finire e chiude anche sé stesso, portandosi via il proprio server locale (GraphQL/asset admin, porta 4001) — Astro resta su come demone indipendente, ma l'ammin Tina risulta rotto (asset `main.tsx` con `ERR_CONNECTION_REFUSED`).

Per questo `npm run dev` esegue `scripts/dev.sh` invece del comando combinato: avvia `tinacms dev` e `astro dev` come **due processi separati** (backgroundati dallo script stesso), attende che il GraphQL di Tina (`:4001/graphql`) risponda prima di avviare Astro, stampa gli URL, e alla pressione di Ctrl+C ferma entrambi (`kill` sui PID + `astro dev stop` come fallback). Verificato funzionante end-to-end (home/admin/asset tutti 200) sia in sessione Claude Code che da lanciare a mano.

Il comando combinato originale resta disponibile come `npm run dev:raw`, solo per debug — non usarlo come workflow normale.

**Prima di un build** (`npm run build` / `netlify deploy --build`): fermare eventuali dev server residenti (`npx astro dev stop`, `pkill -f "tinacms dev"`) — tengono occupate le porte 4001/9000 e il build fallisce con "Datalayer server is busy".

**Cartelle/documenti fantasma o duplicati nella lista collection dell'admin** (es. due voci `it` nella stessa collection): visto dopo diverse modifiche live a `tina/config.ts` nella stessa sessione dev (ogni salvataggio fa "Config change detected, rebuilding" + re-index a caldo). Il refresh della tab browser da solo non basta. Fix verificato: fermare del tutto sia Astro (`npx astro dev stop`) che il processo `tinacms dev` (kill sul PID in ascolto su `:4001`), poi rilanciare `bash scripts/dev.sh` da zero — non un bug nei dati (verificato via query GraphQL diretta: nessun duplicato reale), solo stato in-memory dell'indexer rimasto sporco dopo troppi hot-reload dello schema.

## Fonti

[Tina + Astro](https://tina.io/docs/frameworks/astro), [Astro + TinaCMS (Astro docs)](https://docs.astro.build/en/guides/cms/tina-cms/), [Content Modeling / Schema](https://tina.io/docs/schema), [Blocks / website builder](https://tina.io/docs/editing/blocks), [Tina Pricing](https://tina.io/pricing).
