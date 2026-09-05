#!/usr/bin/env bash
# Deploya il Worker di preview isolato (website-beta / beta.rotaract2050.org)
# a partire da origin/dev, in un worktree pulito separato dalla working tree
# locale (che puo' avere tinacms dev/astro dev attivi o modifiche non committate).
#
# Un tentativo precedente di isolare questo deploy con un blocco `env.beta`
# dentro wrangler.jsonc ha silenziosamente deployato su produzione invece che
# su un Worker separato (causa non confermata — vedi
# .claude/skills/rotaract2050-site/references/cloudflare-deploy.md). Per questo
# qui NON si usa `--env`: nome e config sono un file a se' stante
# (wrangler.beta.jsonc), verificati con un dry-run prima di ogni deploy vero, e
# lo stato di produzione viene controllato prima/dopo per essere certi che non
# si sia mosso di un millimetro.
#
# Questo script e' l'UNICO modo sanzionato per deployare a mano su
# website-beta. Non aggiungere parametri per cambiare nome/target "per
# comodita'": e' esattamente la forma dell'incidente originale.

set -euo pipefail
cd "$(dirname "$0")/.."

readonly TARGET_NAME="website-beta"
readonly PROD_NAME="website"
readonly CONFIG_FILE="wrangler.beta.jsonc"
readonly REMOTE_REF="origin/dev"
readonly WORKTREE_DIR=".wrangler-beta-worktree"
readonly DRY_RUN_LOG="/tmp/rotaract2050-beta-dry-run.log"

[ -f "$CONFIG_FILE" ] || { echo "ABORT: $CONFIG_FILE non trovato."; exit 1; }

CONFIGURED_NAME="$(grep -oP '"name"\s*:\s*"\K[^"]+' "$CONFIG_FILE" | head -1)"
if [ "$CONFIGURED_NAME" != "$TARGET_NAME" ]; then
  echo "ABORT: $CONFIG_FILE dichiara name=\"$CONFIGURED_NAME\", atteso \"$TARGET_NAME\"."
  exit 1
fi
if [ "$TARGET_NAME" = "$PROD_NAME" ]; then
  echo "ABORT: TARGET_NAME coincide col nome di produzione. Rifiuto di procedere."
  exit 1
fi
if grep -q '"env"' "$CONFIG_FILE"; then
  echo "ABORT: $CONFIG_FILE contiene un blocco \"env\" — vietato per design (vedi doc incidente). Rifiuto di procedere."
  exit 1
fi

echo "Leggo lo stato attuale di produzione (baseline, deve restare invariato)..."
PROD_BASELINE="$(npx wrangler deployments list --name "$PROD_NAME" 2>&1)" \
  || { echo "ABORT: impossibile leggere lo stato di produzione — rifiuto di procedere senza baseline."; exit 1; }
PROD_BASELINE_HEAD="$(echo "$PROD_BASELINE" | grep -m1 -E "Version")"

echo "Preparo worktree pulito su $REMOTE_REF..."
git fetch origin dev --quiet
rm -rf "$WORKTREE_DIR"
git worktree add --detach "$WORKTREE_DIR" "$REMOTE_REF"
DEPLOY_SHA="$(git -C "$WORKTREE_DIR" rev-parse HEAD)"
echo "Commit da deployare: $DEPLOY_SHA ($REMOTE_REF)"

cp .env "$WORKTREE_DIR/.env" 2>/dev/null || true
cp "$CONFIG_FILE" "$WORKTREE_DIR/$CONFIG_FILE"

pushd "$WORKTREE_DIR" >/dev/null
npm ci
# astro build diretto, non il wrapper tinacms: il contenuto si legge a runtime
# via client GraphQL Tina, non serve infornarlo a build time (vedi
# references/tina.md). Il build CI automatico (Workers Builds/Action) usa
# invece il comando reale "npm run build -- --skip-cloud-checks".
NODE_OPTIONS=--max-old-space-size=4096 npx astro build

echo ""
echo "=== DRY RUN (nessuna modifica live) — verifico il nome target prima di continuare ==="
npx wrangler deploy --config "$CONFIG_FILE" --name "$TARGET_NAME" --dry-run 2>&1 | tee "$DRY_RUN_LOG"

if ! grep -q "$TARGET_NAME" "$DRY_RUN_LOG"; then
  echo "ABORT: l'output del dry-run non nomina mai \"$TARGET_NAME\". Rifiuto di deployare sul serio."
  popd >/dev/null
  exit 1
fi
if grep -qE "\\b${PROD_NAME}\\b" "$DRY_RUN_LOG"; then
  echo "ABORT: l'output del dry-run nomina produzione (\"$PROD_NAME\"). Rifiuto di deployare sul serio."
  popd >/dev/null
  exit 1
fi

echo ""
read -r -p "Dry run ok (target=$TARGET_NAME, commit=$DEPLOY_SHA). Scrivi per esteso \"$TARGET_NAME\" per confermare il deploy vero: " CONFIRM
if [ "$CONFIRM" != "$TARGET_NAME" ]; then
  echo "ABORT: conferma non corrispondente. Nessun deploy eseguito."
  popd >/dev/null
  exit 1
fi

echo ""
echo "=== DEPLOY VERO ==="
npx wrangler deploy --config "$CONFIG_FILE" --name "$TARGET_NAME"
popd >/dev/null

echo ""
echo "Ricontrollo che produzione non si sia mossa..."
PROD_AFTER="$(npx wrangler deployments list --name "$PROD_NAME" 2>&1)"
PROD_AFTER_HEAD="$(echo "$PROD_AFTER" | grep -m1 -E "Version")"

if [ "$PROD_BASELINE_HEAD" != "$PROD_AFTER_HEAD" ]; then
  echo ""
  echo "!!! CRITICO: produzione ($PROD_NAME) e' cambiata durante questo deploy beta !!!"
  echo "Prima: $PROD_BASELINE_HEAD"
  echo "Dopo:  $PROD_AFTER_HEAD"
  echo "Esegui subito: npx wrangler rollback --name $PROD_NAME  (scegli la versione pre-baseline)"
  exit 2
fi

echo "Produzione invariata."
echo ""
echo "Deployments di $TARGET_NAME:"
npx wrangler deployments list --name "$TARGET_NAME" 2>&1 | tail -8
echo ""
echo "Commit deployato: $DEPLOY_SHA"
