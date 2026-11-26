# cms-backend

Self-hosted TinaCMS backend. It runs in Docker on the District VPS and never on the Cloudflare Worker. The Worker
reaches it in two ways: `src/lib/tina-client.ts` for reads and `src/pages/api/tina/[...path].ts` as a proxy for
the admin. Operational details (hosts, Access, backups, runbook) live in the private `documentazione` repo.

| File | Role |
|---|---|
| `server.ts` | `node:http` server: `/health`, Auth.js under `/api/tina/auth/*`, the GitHub webhook at `/api/hooks/github`, everything else goes to `TinaNodeBackend` |
| `auth.ts` | who may call the backend: the read-only token for query documents, or a Google Workspace session in the editor allowlist |
| `media.ts` | repo-backed media for the admin (`tina/media-store.ts`): list/preview from the checkout, upload/delete as commits to `public/uploads/` |
| `editors-db.ts`, `editors.ts` | editor allowlist (Mongo `cms_editors`) and its CLI |
| `reindex.ts`, `run.sh` | container lifecycle: start, webhook-driven partial reindex, nightly full reindex |
| `Dockerfile`, `entrypoint.sh` | image: Node 22 + git; the website checkout lives in the `/srv/website` volume |

## Security: the container runs its branch's code

The container clones `GITHUB_BRANCH` and runs `npm ci`, `tinacms build` and the server from it, again on every
push (webhook reindex, restart when `tina/`, `cms-backend/` or the lockfile change). Whoever can push to that
branch therefore runs code on the VPS. Prod serves `main`, which is protected (PR required). A preview instance
serves a working branch any collaborator can push to, so it has to stay as isolated as prod: internal network
only, no host mounts, its own volume and secrets.

## Environment

| Variable | Notes |
|---|---|
| `GITHUB_BRANCH` | branch this instance serves; also the Mongo namespace |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | token that commits editor saves (contents:write on the website repo) |
| `GITHUB_WEBHOOK_SECRET` | HMAC secret of the push webhook, ≥ 32 chars |
| `MONGODB_URI` | Mongo holding the index (`tinacms` db) and the allowlist |
| `TINA_READ_TOKEN` | read-only token the Worker sends as `X-API-KEY`, ≥ 32 chars; identical on every instance (Worker secrets are shared by prod and preview versions) |
| `AUTH_URL` | public origin of the site this instance serves (prod domain or the preview alias) |
| `AUTH_SECRET` | Auth.js session secret, ≥ 32 chars, one per instance |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Google OAuth web client; redirect URI `<AUTH_URL>/api/tina/auth/callback/google` |
| `ALLOWED_GOOGLE_DOMAIN` | Workspace domain allowed to sign in (default `rotaract2050.org`) |
| `EDITORS` | `domain`: every verified account of the domain can edit (sessions last 1 day; removing someone = suspending their Workspace account). `allowlist` (default): only the emails added with `editors.mjs` (sessions 7 days, removal immediate) |

## Commands (inside the container)

```sh
node cms-backend/dist/editors.mjs add nome.cognome@rotaract2050.org
node cms-backend/dist/editors.mjs remove nome.cognome@rotaract2050.org
node cms-backend/dist/editors.mjs list
sh cms-backend/run.sh reindex --full   # nightly, from a host timer
```
