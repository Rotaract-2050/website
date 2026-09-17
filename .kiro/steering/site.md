---
inclusion: auto
name: rotaract2050-site
description: Regole generali per lo sviluppo del sito Rotaract Distretto 2050 (Astro + TinaCMS + Cloudflare). Attivare per qualsiasi modifica a pagine, componenti, collection Tina, routing, deploy.
---

# Sito Rotaract Distretto 2050

## Stack

- **Astro** (`output: 'server'`) + adapter `@astrojs/cloudflare` — deploy su Cloudflare Workers, non Pages classica.
- **TinaCMS** git-backed: ogni contenuto editabile da un socio non tecnico va su Tina, mai hardcoded.
- **Zero-JS di default**: niente `client:*` salvo vera interattività client. Script vanilla in `<script>` nel componente `.astro`.
- **Bilingue obbligatorio IT (default) + EN**: ogni pagina, blocco, stringa editoriale esiste in entrambe le lingue. Routing in `src/pages/[...slug].astro` (IT) e `src/pages/en/[...slug].astro` (EN).
- **Hosting live**: https://rotaract2050.org/ (Workers Builds da `main`).

## Avviare in locale

```bash
bash scripts/dev.sh
```
**Non** usare `astro dev` da solo: salta il server GraphQL di TinaCMS (`:4001`). Se il sito appare bianco con errore `Network connection lost` in console server: le variabili `.env` hanno riferimenti `op://...` non risolti — avviare con:
```bash
op run --env-file=.env -- bash scripts/dev.sh
```
Se il server crasha con `file does not exist ... optimize deps directory`: cache Vite corrotta, fix:
```bash
rm -rf node_modules/.vite && bash scripts/dev.sh
```

## Struttura Tina (dal 2026-09-04)

`tina/config.ts` è solo l'orchestratore. I file reali sono:
- `tina/collections/*.ts` — una collection per file
- `tina/blocks/*.ts` — un block template per file, aggregati in `tina/blocks/index.ts`
- `tina/routers.ts` — funzioni router

**Gotcha critico**: ogni collection/template esportato DEVE avere annotazione di tipo esplicita:
```ts
import type { Collection } from 'tinacms';
export const pagesCollection: Collection = { ... };
```
Senza questa annotazione, il type-check Astro fallisce con un errore fuorviante su `templates`.

Per trovare un campo specifico: `grep -rn "name: '<campo>'" tina/` — non indovinare il file.

## Pattern a blocchi (pagine)

Ogni pagina è una sequenza di blocchi Tina. Il match nel renderer avviene su `block.__typename` (es. `PagesBlocksHero`), NON su un campo custom. Vedi `src/components/BlockRenderer.astro`.

**Nomi campo univoci tra template**: se due template della stessa collection usano lo stesso nome campo con tipo diverso (es. `body` stringa vs `body` rich-text), la build Tina esplode con errore GraphQL. Controllare con `grep -rn "name: '<nome>'" tina/blocks/` prima di aggiungere un campo.

## IT/EN — un file unico per pagina

Dal 2026-08-16: `src/content/pages/*.md` contiene sia IT che EN nello stesso file con campi `xEn` (`titleEn`, `bodyEn`, ecc.). Non creare file separati `it/` / `en/`. Traduzione automatica notturna via `.github/workflows/auto-translate.yml` (Cloudflare Workers AI).

## Lettura contenuti

```ts
import { requestWithMetadata, tinaField } from '@tinacms/astro';
import client from '../../tina/__generated__/client';

const result = await requestWithMetadata(client.queries.pages({ relativePath: `${slug}.md` }), { priority: 'primary' });
```
- Usare sempre `requestWithMetadata()` (abilita visual editing), mai il client diretto.
- `tinaField(obj, 'campo')` su elementi cliccabili per l'editing in-context.

## Deploy e branch

- **main → produzione automatica** (Workers Builds).
- **dev → preview** via GitHub Action `preview-dev.yml` (usa `wrangler versions upload`, NON `wrangler deploy` — non tocca produzione).
- Branch `dev` ha branch protection: serve sempre una PR, no push diretto (vale anche per admin).
- Commit `[preview]` nel titolo → trigger build preview di `dev`.
- Commit su `src/content/`/`public/uploads/` → NON triggerano build (contenuto letto a runtime).

## Da evitare assolutamente

- Non usare `sc-for`/`sc-if`/`x-dc`/`DCLogic`: sono sintassi del vecchio mockup.
- Non creare una pagina/componente dedicata per ogni sezione: usare il pattern a blocchi.
- Non hardcodare colori, font o loghi fuori da `references/rotary-brand.md`.
- Non usare `set:html` su contenuto Tina non sanificato.
- Non usare `<div onClick>` invece di `<a>`/`<button>` semantici.
- Non rimuovere disclaimer su dati placeholder finché non confermati dal distretto.
- Non saltare best practice "per fare prima" senza dirlo esplicitamente all'utente.

## Reference da leggere prima di agire (usare `#file` in chat)

| Argomento | File |
|---|---|
| Colori, font, loghi, tono di voce Rotary | `.claude/skills/rotaract2050-site/references/rotary-brand.md` |
| Astro routing, i18n, content collections | `.claude/skills/rotaract2050-site/references/astro.md` |
| Checklist qualità componenti (set:html, stili, immagini, a11y) | `.claude/skills/rotaract2050-site/references/astro-standards.md` |
| TinaCMS schema, pattern blocchi, IT/EN, visual editing | `.claude/skills/rotaract2050-site/references/tina.md` |
| Animazioni (motion.ts, bug transform/hover) | `.claude/skills/rotaract2050-site/references/motion.md` |
| Cloudflare Workers Builds, preview, branch protection | `.claude/skills/rotaract2050-site/references/cloudflare-deploy.md` |
| Tag news (collection tags, zone, anno rotariano) | `.claude/skills/rotaract2050-site/references/news-tags.md` |
| Sezione formazione (collection resources, wikilink, routing) | `.claude/skills/rotaract2050-site/references/formazione-knowledge-base.md` |
| Sezione Interact (tema, blocchi, colori, naming collection) | `.claude/skills/rotaract2050-site/references/interact-section.md` |
| Analytics, cookie banner, tracking | `.claude/skills/rotaract2050-site/references/analytics-seo.md` |
