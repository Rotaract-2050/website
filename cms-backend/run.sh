#!/bin/sh
# Lifecycle of the Tina backend inside its container (cwd = the website checkout, REPO_DIR).
#   run.sh start            sync checkout, install, index (full only when needed), bundle, exec the server
#   run.sh reindex [--full] sync checkout, partial (or full) reindex; exit 75 when the server must restart
# Reindex is run by the server on the GitHub push webhook, and nightly with --full by a host timer
# (`docker exec <container> sh cms-backend/run.sh reindex --full`), after auto-translate.yml's 01:00 UTC commits.
set -eu
: "${GITHUB_BRANCH:?GITHUB_BRANCH missing}"
RESTART=75

sync() {
	git fetch --quiet origin "$GITHUB_BRANCH"
	# Read-only mirror of the branch: nobody commits here, so a hard reset also survives force-pushes.
	git reset --quiet --hard "origin/$GITHUB_BRANCH"
}

install() {
	# Lockfile hash kept next to node_modules: skip the (slow) npm ci when dependencies didn't change.
	hash=$(sha256sum package-lock.json | cut -d' ' -f1)
	[ -f node_modules/.lock-hash ] && [ "$(cat node_modules/.lock-hash)" = "$hash" ] && return 0
	npm ci --no-audit --no-fund
	echo "$hash" > node_modules/.lock-hash
}

index() {
	# Measured full index (2026-11-26, ~2550 entries): peak RSS ≈ heap limit + ~0.9 GB off-heap; 1 GB heap aborts,
	# 1.5 GB → 2.4 GB RSS. The compose's NODE_OPTIONS wins when set.
	NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1536}" npx tinacms build --skip-cloud-checks --skip-search-index "$@"
}

bundle() {
	for entry in server editors; do
		node_modules/.bin/esbuild "cms-backend/$entry.ts" --bundle --platform=node --format=esm --target=node22 \
			--banner:js="import { createRequire } from 'module';const require = createRequire(import.meta.url);" \
			--outfile="cms-backend/dist/$entry.mjs" --log-level=warning
	done
}

case "${1:-}" in
start)
	sync
	install
	# Partial: the CLI falls back to a full index by itself when there is no previous sha in Mongo or when
	# tina/tina-lock.json (the schema) changed, so restarts after a code-only push stay cheap.
	index --partial-reindex
	bundle
	exec node cms-backend/dist/server.mjs
	;;
reindex)
	before=$(git rev-parse HEAD)
	sync
	if [ "${2:-}" = "--full" ]; then index; else index --partial-reindex; fi
	# Schema, backend code or dependencies changed: the running server is stale, let the container restart it
	# (start does install + index + bundle again).
	git diff --quiet "$before" HEAD -- tina cms-backend package-lock.json || exit $RESTART
	;;
*)
	echo "usage: run.sh start | reindex [--full]" >&2
	exit 2
	;;
esac
