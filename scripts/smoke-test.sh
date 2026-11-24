#!/usr/bin/env bash
# Smoke test sul sito live: verifica che le pagine alimentate da Tina abbiano davvero contenuti.
#
# Perché serve: il sito è `output: 'server'`, quindi le query Tina girano a runtime e una build
# verde non garantisce nulla. In più i loader (src/lib/*.ts) hanno un try/catch che trasforma
# qualunque errore GraphQL in una lista vuota: la pagina risponde 200 con "Nessun ... pubblicato".
# È successo il 2026-10-16 (tina-lock.json non rigenerato dopo #90): eventi, news e formazione
# vuoti in produzione senza nessun errore visibile. Questo script fallisce in quel caso.
#
# Uso: bash scripts/smoke-test.sh [base_url]   (default https://rotaract2050.org)

set -uo pipefail

BASE="${1:-https://rotaract2050.org}"
BASE="${BASE%/}"
FAILED=0

# check <path> <regex> <minimo occorrenze>
check() {
	local path="$1" pattern="$2" min="$3" html code count
	html="$(curl -sSL --max-time 30 -w '\n%{http_code}' "$BASE$path?smoke=$RANDOM")"
	code="${html##*$'\n'}"
	html="${html%$'\n'*}"
	count="$(grep -oE "$pattern" <<<"$html" | wc -l)"
	if [ "$code" != "200" ] || [ "$count" -lt "$min" ]; then
		echo "FAIL $path — HTTP $code, trovati $count match di '$pattern' (minimo $min)"
		FAILED=1
	else
		echo "ok   $path — $count"
	fi
}

check /                 'class="news-card'        1
check /eventi           'href="/eventi/[^"]+'     3
check /news             'class="news-card'        3
check /formazione       'href="/formazione/[^"]+' 3
check /club             'class="club-card'        10
check /interact/club    'class="club-card'        5
check /en/eventi        'href="/en/eventi/[^"]+'  3
check /en/news          'class="news-card'        3
check /en/club          'class="club-card'        10
check /en/interact/club 'class="club-card'        5

exit "$FAILED"
