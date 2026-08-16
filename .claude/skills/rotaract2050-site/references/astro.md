# Astro — riferimento best practice

Convenzioni ufficiali Astro (docs.astro.build) applicate al sito.

## Niente Astro Content Collections per i contenuti Tina

**Il progetto non usa `astro:content`/`src/content.config.ts`.** Non aggiungerlo per "seguire le best practice generiche di Astro" — non è il pattern scelto qui. I contenuti editoriali (pagine, zone, club, settings) vivono come file markdown in `src/content/{pages,zones,clubs,settings}/` ma vengono letti **a runtime via il client GraphQL generato da Tina** (`tina/__generated__/client`), non tramite le API `astro:content`. Pattern reale, da replicare per qualunque nuova query:

```ts
import { requestWithMetadata, tinaField } from '@tinacms/astro';
import client from '../../tina/__generated__/client';

const result = await requestWithMetadata(client.queries.pages({ relativePath: `it/${slug}.md` }), { priority: 'primary' });
const page = result.data.pages;
```

- `requestWithMetadata()` (da `@tinacms/astro`) invece di chiamare `client.queries.*` direttamente: è quello che abilita l'editing visuale in-context lato client.
- `tinaField(objectOrRecord, 'campo')` produce l'attributo `data-tina-field` che rende un elemento cliccabile per l'editing (vedi uso in `PageBanner`/`BlockRenderer`/`ClubDirectory` reali).
- Relazioni (club → zona) tramite campo Tina `type: 'reference'` nello schema (`tina/config.ts`), risolte a runtime con due query separate (`zonesConnection`, `clubsConnection`) unite lato componente — non con `reference()` di Astro (quella è un'API di `astro:content`, non usata qui).
- Immagini da Tina: comunque tramite `astro:assets` (`<Image>`/`<Picture>`) una volta ottenuto l'URL dal campo `image` della query — vedi `references/astro-standards.md`.
- Se in futuro serve un dataset **non gestito da Tina** (es. una lista statica che non ha senso rendere editabile), lì sì è corretto usare Astro Content Collections con `defineCollection` + Zod in `src/content.config.ts`: sono due sistemi che possono coesistere, ma non duplicare in Astro Content Collections dati che Tina gestisce già.

## Internazionalizzazione (IT default / EN)

Implementato con **due file di route separati** (non un'unica route dinamica per-locale): `src/pages/[...slug].astro` (IT, `lang = 'it' as const`) e `src/pages/en/[...slug].astro` (EN) — questi restano due file perché servono due alberi URL distinti (IT senza prefisso, EN con `/en/`), non per il contenuto. `[...slug]` è un rest parameter Astro reale (cattura qualunque slug, inclusa stringa vuota per la home), non un placeholder da sostituire.

- `astro.config.mjs`: `i18n.locales = ['it','en']`, `defaultLocale: 'it'`, `routing.prefixDefaultLocale: false` → IT senza prefisso (`/distretto`), EN con prefisso (`/en/distretto`).
- **Contenuto**: dal 2026-08-16 `src/content/pages/*.md` è **un file solo per pagina** (non più sotto-cartelle `it/`/`en/`), con ogni campo testuale traducibile affiancato dal suo gemello `xEn` (`title`/`titleEn`, ecc., stesso pattern di `news`/`events`/`resources`/`clubs`/`zones` — dettagli in `references/tina.md`). Entrambe le route Astro (IT ed EN) leggono lo **stesso file** (`relativePath: '${slug}.md'`, nessun prefisso di lingua) e scelgono il valore giusto dopo la query, non un file diverso per lingua come nel vecchio mockup (`{IT: {...}, EN: {...}}`) né come nella versione pre-2026-08-16 di questo stesso progetto (`it/${slug}.md` vs `en/${slug}.md`).
- Usare `getRelativeLocaleUrl()` (da `astro:i18n`) per generare link interni invece di stringhe hardcoded — usato in `Header.astro`/`Footer.astro`/`PageBanner.astro` reali.
- Stringhe di interfaccia fisse (nav, footer) in `src/data/ui-strings.ts`, un dizionario `Record<Lang, UiStrings>` per-locale — non servono a Tina, sono di sistema. I **contenuti editoriali** (titoli, testi, eventi, news) restano sempre su Tina, in entrambe le lingue.

## Componenti Astro — convenzioni

- `.astro` per tutto ciò che non richiede interattività client (praticamente tutto in questo sito: card, griglie, hero, footer, calendario). Per interattività client leggera (toggle, carousel, filtri) usare **`<script>` vanilla in fondo al componente `.astro`** (pattern reale: `Hero.astro` per il carosello, `EventsCalendar.astro` per lo swap agenda/mese) — non è un island, non richiede `client:*`, resta zero-JS lato framework. Framework component + `client:*` solo per casi con vero stato client complesso che uno script vanilla non gestirebbe bene (nessun caso reale nel sito finora); se mai serve, scegliere la direttiva di hydration più leggera possibile (`client:visible` per componenti sotto la piega, `client:idle` per non bloccanti, `client:load` solo se serve subito).
- Props tipizzate con `interface Props` in ogni componente `.astro`, con default sensati via destructuring.
- Usare `<slot />` (anche named slot) per layout/wrapper condivisi invece di duplicare markup.
- Un componente Astro per template Tina (vedi pattern a blocchi in SKILL.md) — 1 nome, 1 file, mappatura diretta.
- Zero-JS di default: niente framework component a meno che serva vera interattività client.

## Bug di routing: `[...slug]` in una sottosezione collide con l'indice della sezione

Una sottosezione con contenuti annidati un livello (es. `src/content/events/<anno>/<slug>.md`, dal riordino 2026-08-16 degli eventi in cartelle per anno rotariano — vedi `references/tina.md`) **non va servita con un rest param `eventi/[...slug].astro`**, anche se sembra la scelta più generica: un rest param matcha *anche* zero segmenti, quindi `eventi/[...slug].astro` intercetta pure `/eventi` (l'archivio, servito dalla collection `pages` tramite la route radice `[...slug].astro`, vedi sopra), rubandogli la richiesta. Il componente evento riceve `slug` vuoto, non trova nessun documento, fa redirect verso `/eventi` per rientrare nell'archivio — che però ricade di nuovo sulla stessa route evento vuota: **redirect loop infinito**, riprodotto in `astro dev`. Soluzione adottata: route a segmenti fissi `eventi/[year]/[slug].astro` invece di `eventi/[...slug].astro` — uno slug a due parti richiede esattamente due segmenti nel path Astro, niente ambiguità con l'indice a zero segmenti. Da tenere a mente se in futuro un'altra sezione flat (`news`, `resources`...) guadagna una cartella di raggruppamento: non riusare subito il pattern `[...slug]` di `src/pages/[...slug].astro` senza controllare se la sezione ha anche una propria pagina indice sullo stesso prefisso.

## Avviso dev toolbar "no interactive component islands"

L'Astro dev toolbar (app "Inspect"/X-ray, `node_modules/astro/dist/runtime/client/dev-toolbar/apps/xray.js`) mostra "It looks like there are no interactive component islands on this page. Did you forget to add a client directive?" ogni volta che la pagina ha **zero elementi `<astro-island>`** nel DOM — cioè zero componenti framework con `client:*`. Su questo sito è **atteso su ogni pagina**, sempre: essendo zero-JS di default, l'interattività (carosello hero, calendario) è fatta con `<script>` vanilla, non con island. Non è un bug da inseguire e **non è un motivo per convertire `Hero.astro`/`EventsCalendar.astro` (o altri) in componenti React/`client:*`** — vedi punto sopra.

## Fonti

[Content Collections](https://docs.astro.build/en/guides/content-collections/), [Project Structure](https://docs.astro.build/en/basics/project-structure/), [Internationalization](https://docs.astro.build/en/guides/internationalization/), [Islands architecture](https://docs.astro.build/en/concepts/islands/), [Astro Components](https://docs.astro.build/en/basics/astro-components/), [Astro + TinaCMS](https://docs.astro.build/en/guides/cms/tina-cms/).
