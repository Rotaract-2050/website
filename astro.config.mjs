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
	// node-ical's date-recurrence chain (node-ical -> rrule-temporal + temporal-polyfill
	// -> temporal-spec + temporal-utils) ships conditional `exports` maps and imports
	// each other as bare specifiers at every layer. Netlify's function bundler has
	// repeatedly failed to trace and copy those into the deployed function's
	// node_modules, causing prod-only ERR_MODULE_NOT_FOUND crashes that never
	// reproduce locally (full node_modules is always present there) — each fix so far
	// surfaced the next package one layer deeper. This is the full, closed dependency
	// set (confirmed: temporal-spec/temporal-utils have no further deps of their own),
	// bundled at Vite's build step so there's no runtime filesystem import left for
	// Netlify's tracer to miss.
	vite: {
		ssr: {
			noExternal: ['node-ical', 'rrule-temporal', 'temporal-polyfill', 'temporal-spec', 'temporal-utils'],
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
