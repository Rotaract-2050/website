// @ts-check
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tina from '@tinacms/astro/integration';
import react from '@astrojs/react';

const SITE = 'https://rotaract2050.org';
// Every page is server-rendered (required for Tina's edit-mode middleware), so there
// are no prerendered routes for @astrojs/sitemap to auto-discover — list them explicitly.
const PAGE_SLUGS = ['', 'distretto', 'club', 'la-squadra', 'materiali'];

const newsSlugs = readdirSync(fileURLToPath(new URL('./src/content/news', import.meta.url)))
	.filter((file) => file.endsWith('.md'))
	.map((file) => file.replace(/\.md$/, ''));

const clubSlugs = readdirSync(fileURLToPath(new URL('./src/content/clubs', import.meta.url)))
	.filter((file) => file.endsWith('.md'))
	.map((file) => file.replace(/\.md$/, ''));

const customPages = [
	...PAGE_SLUGS.flatMap((slug) => [`${SITE}/${slug}`, `${SITE}/en/${slug}`]),
	`${SITE}/news`,
	`${SITE}/en/news`,
	...newsSlugs.flatMap((slug) => [`${SITE}/news/${slug}`, `${SITE}/en/news/${slug}`]),
	...clubSlugs.flatMap((slug) => [`${SITE}/club/${slug}`, `${SITE}/en/club/${slug}`]),
];

// https://astro.build/config
export default defineConfig({
	site: SITE,
	output: 'server',
	adapter: netlify(),
	i18n: {
		locales: ['it', 'en'],
		defaultLocale: 'it',
		routing: {
			prefixDefaultLocale: false,
		},
	},
	// node-ical (and its rrule-temporal dependency) ship conditional `exports` maps
	// and/or import each other's runtime deps (temporal-polyfill) as bare specifiers;
	// Netlify's function bundler has repeatedly failed to trace and copy those into
	// the deployed function's node_modules, causing prod-only ERR_MODULE_NOT_FOUND
	// crashes that never reproduce locally (full node_modules is always present there).
	// Bundling all three at Vite's build step instead removes the runtime filesystem
	// import entirely, so there's nothing left for Netlify's tracer to miss.
	vite: {
		ssr: {
			noExternal: ['node-ical', 'rrule-temporal', 'temporal-polyfill'],
		},
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
