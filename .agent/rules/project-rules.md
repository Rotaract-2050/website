# Rotaract Distretto 2050 — project rules

## Stack e architettura

- **Astro** (output: server) + **TinaCMS** git-backed + **Cloudflare Workers**
- Niente Tailwind — vanilla CSS scoped in `<style>` Astro
- Zero React islands — interattività leggera con `<script>` vanilla
- Bilingue **IT (default) + EN** — un file per pagina con campi `xEn`
- Live: https://beta.rotaract2050.org/

## Avviare in locale

```bash
# SEMPRE questo script, mai `astro dev` da solo
bash scripts/dev.sh

# Se sito bianco (variabili .env non risolte da 1Password)
op run --env-file=.env -- bash scripts/dev.sh

# Se crash "optimize deps" (cache Vite corrotta)
rm -rf node_modules/.vite && bash scripts/dev.sh
```

## Colori — sempre variabili CSS

| Token | Hex | Note |
|---|---|---|
| `var(--color-navy)` | `#0B2545` | Primario scuro — NON cambiare in Royal Blue |
| `var(--color-pink)` | `#D41367` | Accent/CTA/link (Cranberry Rotaract) |
| `var(--color-gold)` | `#F7A81B` | Accent secondario su scuro |
| `var(--color-text)` | `#54565A` | Testo body (Charcoal ufficiale) |

Mai hex hardcoded se esiste la variabile. Definite in `src/styles/global.css`.

## Lettura contenuti — sempre via client Tina

```ts
import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
const result = await requestWithMetadata(client.queries.pages({ relativePath: `${slug}.md` }), { priority: 'primary' });
```
MAI `getCollection()` di Astro per contenuti Tina.

## TinaCMS — gotcha critici

1. **Annotazione tipo obbligatoria**: ogni `Collection`/`Template` esportato da `tina/collections/*.ts` o `tina/blocks/*.ts` DEVE avere `import type { Collection } from 'tinacms'` + annotazione esplicita sul tipo dell'export. Senza: build rotta.
2. **Nomi campo univoci tra template**: stesso nome, tipo diverso = GraphQL conflict. Fare `grep -rn "name: '<campo>'" tina/blocks/` prima di aggiungere.
3. **Nomi collection senza trattini**: `interactClubs` ✅, `interact-clubs` ❌.
4. **File Tina split**: `tina/config.ts` è solo l'orchestratore — schema in `tina/collections/*.ts` e `tina/blocks/*.ts`.

## HTML e CSS — divieti assoluti

- Mai `<div onClick>` — usare `<a href>` o `<button>`
- Mai `set:html` su contenuto Tina non sanificato
- Mai `style="..."` inline sparsi per valori ripetuti
- Toggle via JS: `.selector:not([hidden]) { display: flex }` — NON `.selector { display: flex }` + `el.hidden`

## Deploy

| Branch | Cosa succede |
|---|---|
| `main` | Build produzione automatica (Workers Builds) |
| `dev` | Preview via `wrangler versions upload` (Action `preview-dev.yml`) |
| altri | Niente build |

Branch `dev` ha branch protection — serve sempre una PR, no push diretti.
MAI `wrangler deploy` per preview — usare solo `wrangler versions upload`.
