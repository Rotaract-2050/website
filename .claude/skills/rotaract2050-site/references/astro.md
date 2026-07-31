# Astro — riferimento best practice

Convenzioni ufficiali Astro (docs.astro.build) applicate al sito.

## Content Collections — convenzioni

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

## Componenti Astro — convenzioni

- `.astro` per tutto ciò che non richiede interattività client (praticamente tutto in questo sito: card, griglie, hero statico, footer). Framework component + `client:*` solo per casi reali (es. un carosello che deve girare lato client): scegliere la direttiva di hydration più leggera possibile (`client:visible` per componenti sotto la piega, `client:idle` per non bloccanti, `client:load` solo se serve subito).
- Props tipizzate con `interface Props` in ogni componente `.astro`, con default sensati via destructuring.
- Usare `<slot />` (anche named slot) per layout/wrapper condivisi invece di duplicare markup.
- Un componente Astro per template Tina (vedi pattern a blocchi in SKILL.md) — 1 nome, 1 file, mappatura diretta.
- Zero-JS di default: niente framework component a meno che serva vera interattività client.

## Fonti

[Content Collections](https://docs.astro.build/en/guides/content-collections/), [Project Structure](https://docs.astro.build/en/basics/project-structure/), [Internationalization](https://docs.astro.build/en/guides/internationalization/), [Islands architecture](https://docs.astro.build/en/concepts/islands/), [Astro Components](https://docs.astro.build/en/basics/astro-components/), [Astro + TinaCMS](https://docs.astro.build/en/guides/cms/tina-cms/).
