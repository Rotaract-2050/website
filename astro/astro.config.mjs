// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://rotaract2050.org',
	i18n: {
		locales: ['it', 'en'],
		defaultLocale: 'it',
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
