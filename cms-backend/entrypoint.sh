#!/bin/sh
# Baked into the image; everything else comes from the repo (cms-backend/run.sh), so backend changes ship with git.
set -eu
: "${GITHUB_BRANCH:?GITHUB_BRANCH missing}"
cd "$REPO_DIR"
# Public repo: cloning needs no token (the token is only used to commit editor saves).
[ -d .git ] || git clone --quiet --branch "$GITHUB_BRANCH" --single-branch https://github.com/Rotaract-2050/website.git .
exec sh cms-backend/run.sh start
