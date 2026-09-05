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

pushd "$WORKTREE_DIR" >/dev/null
npm ci
# Comando reale (stesso della CI di produzione), --skip-search-index perche'
# in locale non abbiamo le credenziali dedicate per l'upload dell'indice.
NODE_OPTIONS=--max-old-space-size=4096 npx tinacms build -c "astro build" --skip-cloud-checks --skip-search-index

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
