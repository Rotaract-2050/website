// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import matter from 'gray-matter';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tina from '@tinacms/astro/integration';
import react from '@astrojs/react';
import { pageSlugs } from './src/data/routes';

const SITE = 'https://rotaract2050.org';
// Every page is server-rendered (required for Tina's edit-mode middleware), so there
// are no prerendered routes for @astrojs/sitemap to auto-discover — list them explicitly.
// Derived from the canonical slug registry (src/data/routes.ts) instead of a second
// hand-maintained array, so a new `pages` document can't silently go missing from the sitemap.
const PAGE_SLUGS = Object.values(pageSlugs);

const newsSlugs = readdirSync(fileURLToPath(new URL('./src/content/news', import.meta.url)))
	.filter((file) => file.endsWith('.md'))
	.map((file) => file.replace(/\.md$/, ''));

const clubSlugs = readdirSync(fileURLToPath(new URL('./src/content/clubs', import.meta.url)))
	.filter((file) => file.endsWith('.md'))
	.map((file) => file.replace(/\.md$/, ''));

// `visible: false` events (drafts) are excluded from the archive list (see getArchiveEvents() in
// src/lib/events.ts) and must stay out of the sitemap for the same reason.
const eventsDir = fileURLToPath(new URL('./src/content/events', import.meta.url));
const eventSlugs = readdirSync(eventsDir)
	.filter((file) => file.endsWith('.md'))
	.filter((file) => matter(readFileSync(join(eventsDir, file), 'utf-8')).data.visible !== false)
	.map((file) => file.replace(/\.md$/, ''));

const customPages = [
	...PAGE_SLUGS.flatMap((slug) => [`${SITE}/${slug}`, `${SITE}/en/${slug}`]),
	...newsSlugs.flatMap((slug) => [`${SITE}/news/${slug}`, `${SITE}/en/news/${slug}`]),
	...clubSlugs.flatMap((slug) => [`${SITE}/club/${slug}`, `${SITE}/en/club/${slug}`]),
	...eventSlugs.flatMap((slug) => [`${SITE}/eventi/${slug}`, `${SITE}/en/eventi/${slug}`]),
];

// @tinacms/astro ships its own dev-time auto-reload plugin, but it only watches
// content files being *added or removed* (it exists to fix a getStaticPaths
// route-cache bug for brand-new docs — see node_modules/@tinacms/astro/src/integration.ts,
// devContentInvalidationPlugin). Saving an edit to an *existing* doc from the Tina
// admin is a `change` event, which that plugin never listens for, so the open tab
// doesn't reflect the edit until you reload by hand. This plugin covers that gap
// with the same signals @tinacms/astro sends: `astro:content-changed` on the SSR
// hot channel (Astro's own content-layer route-cache invalidation) plus a Vite
// full-reload, debounced so saving several fields in one go only reloads once.
function tinaReloadOnContentChangePlugin() {
	const CONTENT_EXT = /\.(?:md|mdx|markdown|mdoc|json|ya?ml|toml)$/i;
	const IGNORED = /[\\/](?:node_modules|\.git|\.astro|dist|\.vercel|\.netlify|\.cache)[\\/]/;
	/** @param {string} file */
	const isContentFile = (file) => CONTENT_EXT.test(file) && !IGNORED.test(file) && /[\\/]src[\\/]content[\\/]/.test(file);

	return {
		name: 'tina-reload-on-content-change',
		apply: 'serve',
		/** @param {import('vite').ViteDevServer} server */
		configureServer(server) {
			const ssr = server.environments?.ssr;
			const client = server.environments?.client;
			if (!client?.hot) return;
			/** @type {ReturnType<typeof setTimeout> | undefined} */
			let timer;
			const flush = () => {
				ssr?.hot?.send('astro:content-changed', {});
				client.hot.send({ type: 'full-reload', path: '*' });
			};
			server.watcher.on('change', (/** @type {string} */ file) => {
				if (!isContentFile(file)) return;
				clearTimeout(timer);
				timer = setTimeout(flush, 50);
			});
		},
	};
}

// https://astro.build/config
export default defineConfig({
	site: SITE,
	output: 'server',
	// Every page is server-rendered (see PAGE_SLUGS comment above), so astro:assets runs
	// on every request, not just at build time. Sharp (Astro's default image service)
	// cannot run in the Workers `workerd` isolate at all — no native binaries — so
	// 'passthrough' is the only zero-cost option here; it serves images unresized/
	// unconverted rather than failing. Revisit with 'cloudflare-binding' (Cloudflare
	// Images, paid) if unoptimized image payloads become a real performance problem.
	adapter: cloudflare({ imageService: 'passthrough' }),
	i18n: {
		locales: ['it', 'en'],
		defaultLocale: 'it',
		routing: {
			prefixDefaultLocale: false,
		},
	},
	// node-ical's date-recurrence chain (node-ical -> rrule-temporal + temporal-polyfill
	// -> temporal-spec + temporal-utils) ships conditional `exports` maps and imports
	// each other as bare specifiers at every layer. There's no node_modules at runtime
	// on Cloudflare Workers (the whole SSR handler is one bundled worker script), so
	// anything left as an external import would 404 in prod even though it resolves
	// fine locally against the full node_modules tree. This is the full, closed
	// dependency set (confirmed: temporal-spec/temporal-utils have no further deps of
	// their own), forced inline at Vite's build step so nothing is left external.
	vite: {
		ssr: {
			noExternal: ['node-ical', 'rrule-temporal', 'temporal-polyfill', 'temporal-spec', 'temporal-utils'],
		},
		plugins: [tinaReloadOnContentChangePlugin()],
	},
	integrations: [
		tina(),
		sitemap({
			customPages,
			i18n: {
				defaultLocale: 'it',
				locales: { it: 'it', en: 'en' },
			},
		}),
		react(),
	],
});
