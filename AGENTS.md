## Agent instructions location

This repo also keeps agent skills and instructions under `.claude/` (Claude Code's config dir), not just `.agents/`. Read `.claude/skills/*/SKILL.md` and any `.claude/*.md` files too — shared skills are symlinked from `.agents/skills/` into `.claude/skills/` so both locations stay in sync.

## Development

Don't run plain `astro dev` — it skips the TinaCMS GraphQL/admin server (`:4001`) that the site's data layer depends on. Use the project's own script instead, in background mode:

```
bash scripts/dev.sh
```

It starts TinaCMS and Astro (`:4321`) together and stops both on exit. Since it runs in the foreground with a Ctrl+C trap, launch it as a background process from the agent shell rather than backgrounding `astro dev` directly.

Manage the underlying Astro server with `astro dev stop`, `astro dev status`, and `astro dev logs`; TinaCMS logs go to `/tmp/rotaract2050-tinacms-dev.log`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
