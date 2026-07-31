#!/usr/bin/env bash
# Avvia TinaCMS + Astro in locale e li ferma entrambi con Ctrl+C.
#
# tinacms dev e astro dev vanno avviati come due processi separati (non con
# "tinacms dev -c astro dev"): in alcuni ambienti astro dev ritorna il
# controllo subito dopo l'avvio, e tinacms interpreta questo come "il
# comando web e' finito" chiudendo anche il proprio server locale (porta
# 4001, admin Tina) — vedi .claude/skills/rotaract2050-site/references/tina.md.

set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -d node_modules ]; then
  echo "node_modules mancante, eseguo npm ci..."
  npm ci
fi

if [ ! -f .env ]; then
  echo "Attenzione: .env mancante. Il sito funziona comunque in modalita' locale," >&2
  echo "ma senza TINA_CLIENT_ID l'ammin Tina non potra' collegarsi a Tina Cloud." >&2
fi

echo "Libero le porte da eventuali sessioni precedenti..."
npx astro dev stop >/dev/null 2>&1 || true
pkill -f "tinacms dev" >/dev/null 2>&1 || true
sleep 1

echo "Avvio TinaCMS (GraphQL + admin, :4001)..."
npx tinacms dev > /tmp/rotaract2050-tinacms-dev.log 2>&1 &
TINA_PID=$!

echo "Attendo che TinaCMS sia pronto..."
for _ in $(seq 1 30); do
  if curl -sf http://localhost:4001/graphql -o /dev/null 2>/dev/null; then
    break
  fi
  sleep 1
done

echo "Avvio Astro (:4321)..."
npx astro dev &
ASTRO_PID=$!

cleanup() {
  echo ""
  echo "Arresto server..."
  kill "$TINA_PID" >/dev/null 2>&1 || true
  kill "$ASTRO_PID" >/dev/null 2>&1 || true
  npx astro dev stop >/dev/null 2>&1 || true
  exit 0
}
trap cleanup INT TERM

echo ""
echo "Sito:   http://localhost:4321"
echo "Admin:  http://localhost:4321/admin/index.html"
echo "Log Tina: /tmp/rotaract2050-tinacms-dev.log"
echo ""
echo "Ctrl+C per fermare tutto."

while true; do
  sleep 3600 &
  wait $!
done
