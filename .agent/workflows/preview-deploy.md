# Workflow: creare una preview di `dev`

Genera un Version Preview URL di Cloudflare (non un deploy production) dal branch `dev`.

## Opzione A — automatica (push su `dev` via PR)

```bash
# 1. Push del branch feature su un branch temporaneo
git push origin HEAD:refs/heads/feat/mia-feature

# 2. Apri e mergia una PR verso dev
gh pr create --base dev --head feat/mia-feature --title "feat: descrizione"
gh pr merge --merge

# 3. La GitHub Action preview-dev.yml parte da sola
#    e stampa il Preview URL nel summary della run
gh run watch   # segui in tempo reale
```

## Opzione B — manuale con script locale

```bash
# Richiede 1Password CLI per le variabili Tina
op run --env-file=.env -- bash scripts/preview-dev.sh
```

Lo script:
1. Builda `origin/dev` in un worktree pulito
2. Usa `wrangler versions upload` (non deploy — non tocca produzione)
3. Stampa un URL `https://<version-id>-website.<subdomain>.workers.dev`

## Verificare la preview

```bash
# Un link di preview con HTTP 200 non è sufficiente — controllare il contenuto
curl -s -o /dev/null -w "%{size_download}" https://<preview-url>/
# Se size_download è 0 → pagina bianca (SSR stream interrotto)

# Controllare anche una pagina profonda
curl -s -o /dev/null -w "%{size_download}" https://<preview-url>/distretto/
```

## Cause comuni di preview "verde ma bianca"

1. **Schema Tina Cloud su `main`**: se il branch ha blocchi nuovi non ancora su `main`, la query GraphQL fallisce silenziosamente. Riprodurre in locale: `HEAD=dev npx tinacms build ... && npx wrangler dev --local`
2. **Cartella content vuota**: `git ls-files src/content/<nuova-collection>/` — se vuoto, aggiungere `.gitkeep`
3. **Env non risolte**: verifica con `curl https://<preview-url>/robots.txt` — se 200, il server è vivo e il problema è Tina client
