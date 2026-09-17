#!/usr/bin/env bash
# Hook: PostToolUse — eseguito dopo ogni scrittura di file .astro / .ts / .tsx
# Riceve JSON su stdin con { tool_name, tool_input, tool_response }
#
# Controlla se il file scritto è un .astro/.ts/.tsx e lancia astro check
# per catturare errori TypeScript subito, incluso il gotcha TinaCMS.

set -euo pipefail

# Leggi il path del file scritto dallo stdin JSON
FILE_PATH=$(cat - | python3 -c "
import json, sys
data = json.load(sys.stdin)
path = (data.get('tool_input') or {}).get('path', '')
print(path)
" 2>/dev/null || echo "")

# Agisci solo su file rilevanti
if [[ "$FILE_PATH" =~ \.(astro|ts|tsx)$ ]]; then
  echo "→ Running astro check (errori TypeScript)..."
  cd /home/gorlix/Documents/Git/Rotaract2050-website
  npx astro check --minimumSeverity error 2>&1 | tail -30 || true
fi
