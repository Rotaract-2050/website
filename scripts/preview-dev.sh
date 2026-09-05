#!/usr/bin/env bash
# Genera un link di preview per il branch `dev`, sullo STESSO Worker di
# produzione ("website"), senza mai poter toccare il traffico live.
#
# La sicurezza qui non viene da un Worker/dominio separato (un tentativo
# precedente in quella direzione e' stato abbandonato — troppa roba da
# mantenere per il bisogno reale), ma dal comando stesso:
#
#   `wrangler versions upload` crea una nuova Version del Worker con un suo
#   Preview URL automatico, MA NON la promuove mai al 100% del traffico.
#   Solo `wrangler deploy` (o una promozione esplicita) sposta traffico live.
#   Per questo script non serve nessun --config/--name custom: usa
#   wrangler.jsonc cosi' com'e', e non puo' comunque sovrascrivere produzione.
#
# Vedi .claude/skills/rotaract2050-site/references/cloudflare-deploy.md per
# la storia di com'e' nato questo script (incidente + tentativo con Worker
# separato, poi abbandonato).
#
# IMPORTANTE: .env in chiaro contiene riferimenti 1Password non risolti
# (TINA_CLIENT_ID/TINA_TOKEN/TINA_SEARCH_TOKEN = "op://..."), non i valori
# veri — un build con quei valori grezzi produce un sito con l'homepage
# bianca (lo stream si interrompe a meta') e /llms.txt a 500, perche' il
# client Tina generato incorpora un client id/token non validi. Lancia
# questo script dentro `op run`, cosi' i secret arrivano gia' risolti come
# variabili d'ambiente vere e lo script li usa al posto delle righe "op://"
# in .env:
#
#   op signin   # una tantum, richiede il vault 1Password del progetto
#   op run --env-file=.env -- bash scripts/preview-dev.sh
#
# Senza `op run` lo script builda comunque (per non bloccarsi silenziosamente),
# ma il sito risultante avra' lo stesso problema di homepage bianca finche'
# non lanci col wrapper giusto.

set -euo pipefail
cd "$(dirname "$0")/.."

readonly PROD_NAME="website"
readonly REMOTE_REF="origin/dev"
readonly WORKTREE_DIR=".wrangler-preview-worktree"

echo "Leggo lo stato attuale di produzione (baseline, deve restare invariato)..."
PROD_BASELINE="$(npx wrangler deployments list --name "$PROD_NAME" 2>&1)" \
  || { echo "ABORT: impossibile leggere lo stato di produzione — rifiuto di procedere senza baseline."; exit 1; }
PROD_BASELINE_HEAD="$(echo "$PROD_BASELINE" | grep -m1 -E "Version")"

echo "Preparo worktree pulito su $REMOTE_REF..."
git fetch origin dev --quiet
rm -rf "$WORKTREE_DIR"
git worktree add --detach "$WORKTREE_DIR" "$REMOTE_REF"
DEPLOY_SHA="$(git -C "$WORKTREE_DIR" rev-parse HEAD)"
echo "Commit da buildare: $DEPLOY_SHA ($REMOTE_REF)"

cp .env "$WORKTREE_DIR/.env" 2>/dev/null || true

# Se lanciato dentro `op run`, i secret Tina arrivano gia' risolti come
# variabili d'ambiente vere in questo processo: sovrascrivono le righe
# "op://..." grezze copiate da .env qui sopra. Mai stampati, letti/scritti
# solo tramite variabili di shell.
for _var in TINA_CLIENT_ID TINA_TOKEN TINA_SEARCH_TOKEN; do
  _val="${!_var:-}"
  if [ -n "$_val" ] && [[ "$_val" != op://* ]]; then
    grep -v "^${_var}=" "$WORKTREE_DIR/.env" > "$WORKTREE_DIR/.env.tmp" 2>/dev/null || true
    printf '%s=%s\n' "$_var" "$_val" >> "$WORKTREE_DIR/.env.tmp"
    mv "$WORKTREE_DIR/.env.tmp" "$WORKTREE_DIR/.env"
  fi
done

pushd "$WORKTREE_DIR" >/dev/null
npm ci
# Comando reale (stesso della CI di produzione), --skip-search-index perche'
# in locale non abbiamo le credenziali dedicate per l'upload dell'indice.
#
# HEAD=dev: tina/config.ts legge `branch` da WORKERS_CI_BRANCH (solo
# Workers Builds la inietta) o da HEAD, altrimenti "main" — senza questo il
# client Tina interroga sempre lo schema di main su Tina Cloud, e un
# blocco/campo nuovo solo su dev fa fallire la query GraphQL (pagina
# bianca, nessun errore visibile lato Worker deployato).
NODE_OPTIONS=--max-old-space-size=4096 HEAD=dev npx tinacms build -c "astro build" --skip-cloud-checks --skip-search-index

echo ""
echo "=== wrangler versions upload (non promuove mai, nessun rischio produzione) ==="
npx wrangler versions upload --config dist/server/wrangler.json 2>&1 | tee /tmp/rotaract2050-preview-upload.log
popd >/dev/null

echo ""
echo "Ricontrollo che produzione non si sia mossa..."
PROD_AFTER="$(npx wrangler deployments list --name "$PROD_NAME" 2>&1)"
PROD_AFTER_HEAD="$(echo "$PROD_AFTER" | grep -m1 -E "Version")"

if [ "$PROD_BASELINE_HEAD" != "$PROD_AFTER_HEAD" ]; then
  echo ""
  echo "!!! CRITICO: produzione ($PROD_NAME) e' cambiata durante questo upload !!!"
  echo "Prima: $PROD_BASELINE_HEAD"
  echo "Dopo:  $PROD_AFTER_HEAD"
  echo "Esegui subito: npx wrangler rollback --name $PROD_NAME  (scegli la versione pre-baseline)"
  exit 2
fi

echo "Produzione invariata."
echo ""
echo "Link di preview (condividibile subito, non tocca rotaract2050.org):"
grep -oE "https://[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev" /tmp/rotaract2050-preview-upload.log | head -1
echo ""
echo "Commit buildato: $DEPLOY_SHA"
