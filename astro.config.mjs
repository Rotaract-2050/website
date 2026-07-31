// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tina from '@tinacms/astro/integration';

const SITE = 'https://rotaract2050.org';
// Every page is server-rendered (required for Tina's edit-mode middleware), so there
// are no prerendered routes for @astrojs/sitemap to auto-discover — list them explicitly.
const PAGE_SLUGS = ['', 'distretto', 'club', 'esecutivo', 'delegati', 'commissioni'];
const customPages = PAGE_SLUGS.flatMap((slug) => [`${SITE}/${slug}`, `${SITE}/en/${slug}`]);

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
	],
});
