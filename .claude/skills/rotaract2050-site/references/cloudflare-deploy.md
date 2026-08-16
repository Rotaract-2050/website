# Cloudflare Workers Builds — branch control e preview su richiesta

Il progetto è deployato come **Cloudflare Workers** (adapter `@astrojs/cloudflare`, `wrangler.jsonc`), non Pages classica: build/deploy gestiti da **Workers Builds** (Settings → Build nel dashboard del Worker), non dal pannello Pages a 3 opzioni (All/None/Custom branches) che esiste solo per progetti Pages "legacy".

## Come funziona il branch control su Workers Builds

- Ogni Worker ha **al massimo 2 trigger**: uno production (branch `main`), uno preview (default: tutti gli altri branch).
- Nel dashboard (Settings → Build → Branch control) c'è solo un **checkbox binario**: "Builds for non-production branches" — ON builda ogni branch push, OFF non builda nessun non-prod branch. **Non esiste selezione UI per-branch** per Workers (a differenza di Pages).
- Il filtro fine per branch (`branch_includes`/`branch_excludes`, pattern con wildcard `*`) esiste solo nella **Builds API** (`PATCH /accounts/{account_id}/builds/triggers/{trigger_uuid}`), non esposto in UI. Nessun MCP tool Cloudflare disponibile in questo progetto copre questo endpoint (i tool `cloudflare-builds` sono solo lettura: list/get build, get logs).

## Setup adottato (2026-08-16)

Per evitare di sprecare build su ogni branch/commit:

1. **Checkbox "Builds for non-production branches" → OFF.** Solo push su `main` builda automaticamente (production).
2. **Deploy Hook** creato in Settings → Build → Deploy Hooks, nome `dev-preview`, branch to build = `dev`. Un Deploy Hook è un URL segreto che, chiamato via `POST`, forza una build sul branch configurato — indipendente dal checkbox globale, non scatta da solo su git push.
3. **GitHub Action** [`cf-preview-build.yml`](../../../.github/workflows/cf-preview-build.yml) chiama quell'URL quando un commit ha `[preview]` nel titolo (qualsiasi branch — il trigger è sul messaggio di commit, non sul nome branch; il Deploy Hook builda comunque sempre il branch `dev` configurato in Cloudflare).
4. URL del Deploy Hook salvato come **GitHub Actions secret** `CF_DEV_DEPLOY_HOOK` (repo Settings → Secrets and variables → Actions) — mai in chiaro nel workflow file.

Risultato: `main` → build produzione automatica ad ogni push. Commit con `[preview]` nel titolo → build preview di `dev` via GitHub Action + Deploy Hook. Ogni altro push → zero build.

## Se serve cambiare branch/pattern in futuro

- Cambiare quale branch builda il Deploy Hook: dashboard Worker → Settings → Build → Deploy Hooks → modifica "Branch to build" dell'hook esistente (non serve toccare secret o workflow).
- Cambiare la keyword che fa scattare il workflow: editare `contains(github.event.head_commit.message, '[preview]')` in [`cf-preview-build.yml`](../../../.github/workflows/cf-preview-build.yml).
- Per un filtro branch-native più granulare (senza passare da commit message/GitHub Action), servirebbe la Builds API (`branch_includes`/`branch_excludes` su trigger) con un token API con permesso Workers Scripts:Edit — non fattibile dai tool MCP Cloudflare disponibili in questa sessione, richiede curl diretto.
