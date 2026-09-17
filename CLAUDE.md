# Rotaract Distretto 2050 — istruzioni per Claude

## Dove vivono le istruzioni

Questo progetto tiene tutta la documentazione per gli agenti in `.claude/skills/`:

- `.claude/skills/rotaract2050-site/SKILL.md` — regole generali del sito (stack, TinaCMS, deploy, i18n, pattern a blocchi)
- `.claude/skills/rotaract2050-design-system/SKILL.md` — design system (colori, font, glassmorphism, griglia, animazioni)
- `.claude/skills/rotaract2050-site/references/` — reference dettagliate per aree specifiche (leggere PRIMA di agire)

**Leggi entrambi i SKILL.md all'inizio di ogni sessione.** Le reference vanno lette quando si lavora sull'area specifica.

## Avvio rapido

```bash
# Dev locale (non usare astro dev direttamente)
bash scripts/dev.sh

# Se il sito è bianco (variabili .env con op:// non risolte)
op run --env-file=.env -- bash scripts/dev.sh

# Se il server crasha con "optimize deps" error (cache Vite)
rm -rf node_modules/.vite && bash scripts/dev.sh
```

## Regole critiche (non dimenticarle)

1. **TinaCMS split schema**: ogni `Collection`/`Template` esportato da `tina/collections/*.ts` o `tina/blocks/*.ts` DEVE avere annotazione esplicita `import type { Collection } from 'tinacms'`. Senza: build rotta con errore fuorviante.

2. **Un file per pagina, IT+EN insieme**: campi `titleEn`, `bodyEn`, ecc. — NON creare file separati per lingua.

3. **Lettura dati sempre via client Tina**: `requestWithMetadata(client.queries.x(...))` — mai `getCollection()` di Astro.

4. **Nomi campo univoci tra template**: due template con stesso nome campo ma tipo diverso = build Tina esplosa. Fare `grep -rn "name: '<campo>'" tina/blocks/` prima di aggiungere.

5. **Deploy**: `main` → produzione automatica. `dev` → preview via `wrangler versions upload` (NON `wrangler deploy`). Nessun push diretto su `dev` (branch protection).

6. **Navy `#0B2545`** è il primario scuro — scelta definitiva dell'utente. Non migrare a Royal Blue `#17458F`.

## Hooks Claude Code

Claude Code supporta hook automatici configurati in `.claude/hooks/` (file `.sh` o `.json` con trigger `PreToolUse`/`PostToolUse`/`Stop`/`Notification`).

### Hook attivi

#### `PostToolUse` su scrittura file `.astro` — quality gate

Ogni volta che viene scritto un file `.astro` in `src/components/`, verificare:
- Nessun `set:html` su contenuto Tina non sanificato
- Nessun `style="..."` inline sparso per valori ripetuti
- Elementi interattivi con tag semantici (`<a>`, `<button>` — non `<div onClick>`)
- `<Image>`/`<Picture>` da `astro:assets` con `alt` obbligatorio
- `interface Props` dichiarata con tutti i prop tipizzati
- Elemento toggleable via JS: regola CSS su `.selector:not([hidden])`, non `.selector { display: flex }`

#### `PostToolUse` su scrittura file `tina/`

Ogni volta che viene scritto un file in `tina/collections/` o `tina/blocks/`:
- Annotazione tipo `Collection`/`Template` presente su ogni export
- Nessun nome campo duplicato con tipo diverso tra template della stessa collection
- Nessun trattino nel `name` della collection (solo alfanumerico/underscore)

## Reference rapida per area

| Stai lavorando su... | Leggi prima |
|---|---|
| Schema Tina, visual editing, blocchi | `references/tina.md` |
| Routing Astro, i18n, content collections | `references/astro.md` |
| Qualità componenti (set:html, a11y, immagini) | `references/astro-standards.md` |
| Colori, font, loghi Rotary | `references/rotary-brand.md` |
| Animazioni scroll/entrance | `references/motion.md` |
| Deploy Cloudflare, branch, preview | `references/cloudflare-deploy.md` |
| Sezione `/formazione`, wiki, chat AI | `references/formazione-knowledge-base.md` |
| Sezione `/interact`, tema, blocchi clonati | `references/interact-section.md` |
| Tag news, zone, anno rotariano | `references/news-tags.md` |
| Analytics, cookie banner, tracking | `references/analytics-seo.md` |
