# TinaCMS — riferimento best practice

Convenzioni ufficiali TinaCMS (tina.io/docs) applicate al sito.

## Setup Tina + Astro

Due percorsi ufficiali per integrare Tina in Astro (fonte: tina.io/docs/frameworks/astro e docs.astro.build/en/guides/cms/tina-cms):

- **Starter Astro-first di Tina** (`create-tina-app --template tina-astro-starter` o `@tinacms/astro`): editing visuale in-context (click-to-edit) tramite `<TinaIsland>` + `tinaField()`, senza React nell'albero pagina. Richiede `output: 'server'` (o isole server-side) e un adapter SSR (Vercel/Netlify/Cloudflare/Node) — **non è compatibile con hosting puramente statico**. È l'opzione migliore per l'esperienza dei soci non tecnici (vedono la pagina vera mentre editano), da preferire se l'hosting scelto supporta SSR.
- **Setup "Other framework"** (`@tinacms/cli init`, framework "Other"): Tina scrive/legge file markdown/mdx in `src/content/...`, editing tramite form in `/admin/index.html` senza preview live. Compatibile con output statico puro. Più semplice da hostare, meno immediato da usare per chi non è tecnico.

Scegliere in base all'hosting disponibile (verificare con l'utente prima di impostare `output: 'server'`); se non ancora deciso, favorire comunque lo starter con editing visuale per il beneficio ai soci, segnalando il requisito SSR come conseguenza.

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

[Tina + Astro](https://tina.io/docs/frameworks/astro), [Astro + TinaCMS (Astro docs)](https://docs.astro.build/en/guides/cms/tina-cms/), [Content Modeling / Schema](https://tina.io/docs/schema), [Blocks / website builder](https://tina.io/docs/editing/blocks).
