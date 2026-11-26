# Tina self-hosted backend. Build context: cms-backend/ (docker build -t tina-backend cms-backend).
# The image holds only Node + git: the website checkout, its node_modules and the generated Tina client live in
# the /srv/website volume, so a reindex can `git pull` and rebuild without rebuilding the image.
# Required env: see cms-backend/README.md.
FROM node:22-bookworm-slim

RUN apt-get update \
	&& apt-get install -y --no-install-recommends git ca-certificates tini \
	&& rm -rf /var/lib/apt/lists/* \
	&& mkdir -p /srv/website && chown node:node /srv/website

COPY entrypoint.sh /usr/local/bin/tina-entrypoint

USER node
# No NODE_ENV=production: npm ci would skip devDependencies, and the Tina CLI/datalayer are devDependencies.
ENV REPO_DIR=/srv/website PORT=4001
WORKDIR /srv/website
VOLUME /srv/website
EXPOSE 4001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10m --retries=3 \
	CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/health').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"

ENTRYPOINT ["tini", "--", "sh", "/usr/local/bin/tina-entrypoint"]
