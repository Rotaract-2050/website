# Astro — standard di qualità obbligatori

Checklist da rispettare **sempre**, su ogni componente/pagina, senza scorciatoie "tanto funziona". Fonte: docs.astro.build (ufficiale). Non sono opzionali per andare più veloci: un socio non tecnico userà questo sito per anni, il codice va scritto una volta bene.

## Niente HTML iniettato per pigrizia

- **Mai `set:html` su contenuto non fidato o non sanificato**, solo per evitare di scrivere il markup a componenti. `set:html` funziona come `innerHTML`: Astro non lo sanifica automaticamente — è un vettore XSS diretto se il valore arriva da input utente o da un campo Tina non processato correttamente.
- Ammesso solo per: HTML già fidato/sanificato lato build (es. output di un renderer markdown ufficiale), JSON-LD via `JSON.stringify()` in un `<script type="application/ld+json">`, contenuto generato internamente e noto.
- Per rich-text da Tina, usare sempre il renderer ufficiale (`<TinaMarkdown>` / componente equivalente in `@tinacms/astro`), mai `set:html` sul markdown grezzo.
- Le espressioni normali `{value}` in un template Astro **escapano automaticamente** — è quasi sempre la scelta giusta. `set:text` esiste ma è raramente necessario visto che è equivalente a un'espressione.

## Styling

- Default: `<style>` **scoped** dentro il componente (comportamento automatico di Astro). Non serve altro nella maggior parte dei casi.
- Mai riempire il markup di attributi `style="..."` inline sparsi come nel mockup di riferimento (`Rotaract Distretto 2050.dc.html` ne è pieno perché è un export di prototipazione, non codice da imitare). Portare ogni valore ripetuto (colori, spaziature, radius) in CSS scoped o in variabili condivise; usare `define:vars` solo per valori realmente dinamici da JS/frontmatter.
- `<style is:global>` solo per reset/base a livello di layout radice, mai per singoli componenti — se un componente "ha bisogno" di stili globali probabilmente lo stile andrebbe scoped meglio.

## Immagini

- Sempre `<Image />` o `<Picture />` da `astro:assets`, mai `<img src="...">` diretto per immagini locali o da Tina media manager. Sostituisce gli `image-slot` placeholder del mockup.
- `alt` **obbligatorio** e descrittivo (mai `alt=""` salvo immagine puramente decorativa, mai omesso — Astro stesso segnala errore se manca).
- Non forzare `loading`/`decoding`/`width`/`height` manualmente: i componenti Astro li inferiscono per evitare Cumulative Layout Shift, non bypassarli con `<img>` grezzo "per fare prima".
- Immagini remote (es. da Tina Cloud media) vanno autorizzate in `astro.config.mjs` (`image.domains`/`remotePatterns`) per poter essere ottimizzate.

## TypeScript

- `tsconfig.json` su preset **`strict`** minimo (idealmente `strictest`); mai disattivare strict per silenziare errori.
- Ogni componente `.astro` con props dichiara `interface Props { ... }` — mai `Astro.props` non tipizzato, mai `any`.
- Le collection Astro (`src/content.config.ts`) sono già tipizzate via Zod: usare i tipi generati (`CollectionEntry<'...'>`), non ridefinirli a mano nei componenti.

## Semantica HTML e accessibilità

- Elementi cliccabili/interattivi con tag semantico corretto (`<a href>` per navigazione, `<button>` per azioni), **non** `<div onClick>` come nel mockup — un `<div>` cliccabile non è raggiungibile da tastiera né annunciato da screen reader senza `role`/`tabindex`/gestione keydown aggiuntiva, che è più lavoro e più fragile che usare il tag giusto da subito.
- Gerarchia titoli corretta (`h1` unico per pagina, `h2`/`h3` in ordine) invece di div stilizzati come titoli.
- Usare l'Astro Dev Toolbar in sviluppo per controllare i problemi di accessibilità segnalati automaticamente prima di considerare un componente finito.

## SEO

- `site` impostato in `astro.config.mjs` con l'URL di produzione (richiesto per sitemap/canonical corretti).
- Componente `<Head />` condiviso nel layout comune: title, meta description, canonical, Open Graph — per pagina, non genericati a mano ogni volta.
- Integrazione ufficiale `@astrojs/sitemap` (`npx astro add sitemap`) con blocco `i18n` configurato sulle locale IT/EN per generare `hreflang` corretti tra le due lingue.

## Regola generale

Prima di segnare un componente/pagina come completo, ripassare questa checklist voce per voce. "Ho fatto prima così" non è un motivo valido per saltare uno di questi punti — se una scorciatoia sembra necessaria per i tempi, segnalarlo esplicitamente invece di introdurla silenziosamente.

## Fonti

[set:html / set:text](https://docs.astro.build/en/reference/directives-reference/), [Styling & CSS](https://docs.astro.build/en/guides/styling/), [Images](https://docs.astro.build/en/guides/images/), [TypeScript](https://docs.astro.build/en/guides/typescript/), [Sitemap integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/).
