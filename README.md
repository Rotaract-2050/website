# Rotaract District 2050 Website

## What this is

This is the official website of **Rotaract District 2050** (Lombardy, Italy), live in Italian and English.

It tells visitors who we are, what we do, and how to reach us: district pages, the list of clubs with their zones, events, news, and board roles. All content — text, images, pages — is edited through a visual editing panel (no code required), designed to be usable by non-developers too. Edits made there are saved straight into the repository and published automatically.

## Tech stack

- **[Astro](https://astro.build)** — framework that generates the site as fast static pages
- **[TinaCMS](https://tina.io)** — headless CMS with in-page visual editing, stores content as Markdown/JSON files inside the repo (no external database)
- **TypeScript** — typing across config and components
- **[Cloudflare Pages](https://pages.cloudflare.com)** — hosting and automatic deploy on every push to `main` (adapter `@astrojs/cloudflare`, config in `wrangler.jsonc`)

Block-based architecture: each page in `src/content/pages/{it,en}/` is a list of blocks (Hero, StatsBar, CardGrid, EventsCalendar, etc.), each defined once in `tina/config.ts` and rendered by a component in `src/components/blocks/`. Adding a page requires no new code; adding a new section type does (Tina template + component + a line in `BlockRenderer.astro`).

```text
tina/config.ts          Tina collections schema (pages, zones, clubs, settings)
src/content/pages/it|en  one entry per page, with blocks[] (Tina _template + fields)
src/content/zones/       the district's 4 zones
src/content/clubs/       clubs, each with a Tina type:'reference' field to its zone
src/content/settings/    footer/contact text, per language
src/components/blocks/   one component per Tina template
src/components/BlockRenderer.astro   matches on block.__typename and mounts the right component
src/pages/[...slug].astro            IT route (default, no prefix)
src/pages/en/[...slug].astro         EN route
```

For full detail (Rotary brand palette, Tina conventions, architectural pattern) see [`.claude/skills/rotaract2050-site/`](.claude/skills/rotaract2050-site/) — read it before modifying the project.

## Contributing

### Requirements

- Node.js ≥ 22.12.0
- A local `.env` with `TINA_CLIENT_ID` and `TINA_TOKEN` (the district's Tina Cloud project — never commit this file)
- Optional: `TINA_SEARCH_TOKEN` in the same `.env` (Tina Cloud dashboard → project → Search) to enable Tina's hosted search index for the CMS admin. Safe to leave unset — everything else works without it.

### Setup

```bash
npm ci
npm run dev
```

`npm run dev` starts Tina + Astro together; the site runs on `localhost:4321`, the editing panel on `/admin/index.html`.

### Useful commands

| Command | Action |
| :--- | :--- |
| `npm ci` | Install dependencies (uses the lockfile) |
| `npm run dev` | Local server + Tina visual editing |
| `npm run build` | Production build (requires `TINA_CLIENT_ID`/`TINA_TOKEN` in env) |
| `npx astro check` | Type-check + content validation |
| `astro dev --background` / `astro dev stop\|status\|logs` | run server in background |

### Workflow

1. Branch off `main`
2. Content changes → via the Tina panel (`/admin`) or directly on files in `src/content/`; code/component changes → regular editor
3. Verify with `npx astro check` and `npm run dev` before opening a PR
4. Open a Pull Request against `main` — Cloudflare Pages deploy runs automatically after merge

PRs written with AI assistance (Claude, Copilot, ChatGPT, etc.) are welcome — just make sure you've reviewed and tested the changes yourself before opening the PR.

### Where to find things

- Content/block structure, brand palette, Tina/Astro best practices → [`.claude/skills/rotaract2050-site/`](.claude/skills/rotaract2050-site/)
- Tina Cloud project (user management, tokens) → https://app.tina.io/projects/45ced600-56cb-4e98-a4eb-26f93b147dcf
- Cloudflare Pages config → [`wrangler.jsonc`](wrangler.jsonc)
