## Agent instructions location

This repo keeps agent skills and instructions centrally in `.claude/skills/` (Claude Code's config dir).

Per-agent config locations:

| Agent | Config dir | Format |
|---|---|---|
| **Claude Code** | `CLAUDE.md` (root) + `.claude/hooks/` | Markdown + shell hooks |
| **Kiro** | `.kiro/steering/` + `.kiro/hooks/` | Markdown steering + JSON hooks |
| **Cursor** | `.cursor/rules/` | `.mdc` files with `globs` frontmatter |
| **Antigravity** | `.agent/rules/`, `.agent/skills/`, `.agent/workflows/` | Markdown flat files |
| **Gemini/others** | `.agents/skills/` (symlinks → `.claude/skills/`) | Markdown SKILL.md |

Shared skills (the authoritative copy) live in `.claude/skills/rotaract2050-site/` and `.claude/skills/rotaract2050-design-system/`. All other agent configs reference or symlink these rather than duplicating content.

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
