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
const PAGE_SLUGS = ['', 'distretto', 'club', 'esecutivo', 'delegati', 'commissioni'];

const NEWS_DIR = fileURLToPath(new URL('./src/content/news', import.meta.url));

/** Article slugs (filename without extension) published for a locale, read straight off disk. */
function newsSlugs(/** @type {string} */ locale) {
	try {
		return readdirSync(`${NEWS_DIR}/${locale}`)
			.filter((file) => file.endsWith('.md'))
			.map((file) => file.replace(/\.md$/, ''));
	} catch {
		return [];
	}
}

const clubSlugs = readdirSync(fileURLToPath(new URL('./src/content/clubs', import.meta.url)))
	.filter((file) => file.endsWith('.md'))
	.map((file) => file.replace(/\.md$/, ''));

const customPages = [
	...PAGE_SLUGS.flatMap((slug) => [`${SITE}/${slug}`, `${SITE}/en/${slug}`]),
	`${SITE}/news`,
	`${SITE}/en/news`,
	...newsSlugs('it').map((slug) => `${SITE}/news/${slug}`),
	...newsSlugs('en').map((slug) => `${SITE}/en/news/${slug}`),
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
