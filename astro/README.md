# Sito Rotaract Distretto 2050

Astro + TinaCMS, bilingue IT/EN. Vedi `.claude/skills/rotaract2050-site/` (nella root del repo) per stack, palette di brand, pattern architetturale e best practice — leggere quello prima di modificare il progetto.

## Struttura

```text
tina/config.ts          schema collections Tina (pages, zones, clubs, settings)
src/content/pages/it|en  una entry per pagina, con blocks[] (_template + campi)
src/content/zones/       le 4 zone del distretto
src/content/clubs/       i club, ognuno con reference() alla propria zona
src/content/settings/    testi footer/contatti, per lingua
src/components/blocks/   un componente per ogni _template Tina (Hero, StatsBar, SplitSection, CardGrid, ValuesGrid, RoleGrid, EventsList, NewsGrid, CtaBanner, PagePlaceholder, ClubDirectory)
src/components/BlockRenderer.astro   fa match su _template e monta il componente giusto
src/pages/[...slug].astro            route IT (default, senza prefisso)
src/pages/en/[...slug].astro         route EN
```

Aggiungere una pagina = nuova entry in `src/content/pages/{it,en}/` con i blocchi voluti, nessun codice nuovo. Aggiungere un tipo di sezione riusabile = nuovo template in `tina/config.ts` + componente corrispondente in `src/components/blocks/` + riga in `BlockRenderer.astro`.

## Comandi

| Comando | Azione |
| :--- | :--- |
| `npm ci` | Installa le dipendenze (usa il lockfile) |
| `npm run dev` | `tinacms dev -c "astro dev"` — server locale + editing visuale Tina su `/admin/index.html` |
| `npm run build` | `tinacms build -c "astro build"` — richiede `TINA_CLIENT_ID`/`TINA_TOKEN` in env |
| `npx astro check` | Type-check + validazione contenuti |
| `npx astro dev --background` / `astro dev stop|status|logs` | server in background |

## Env richieste

`.env` (mai committato, vedi `.gitignore`): `TINA_CLIENT_ID`, `TINA_TOKEN` (progetto Tina Cloud del distretto).

## Hosting

Netlify (deciso — vedi `references/tina.md` nella skill). L'adapter in `astro.config.mjs` va allineato a `@astrojs/netlify` prima del primo deploy: attualmente è ancora `@astrojs/node` (standalone), lasciato così dal refactor iniziale.
