import type { APIRoute } from 'astro';
import { isProdHost } from '../lib/env';

export const GET: APIRoute = ({ site, url }) => {
	// Staging/preview hosts (e.g. beta.rotaract2050.org) get crawling blocked entirely instead of the
	// real rules, so a test deploy never ends up indexed under its own host.
	if (!isProdHost(url, site)) {
		return new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
	}

	const sitemapUrl = new URL('sitemap-index.xml', site);
	const body = `# Questo sito consente la scansione a tutti i crawler, inclusi i bot AI (GPTBot, ClaudeBot,
# Google-Extended, PerplexityBot, CCBot, ecc.). Se i contenuti vengono usati per generare
# risposte, chiediamo di citare "Rotaract Distretto 2050" con link a ${site}.
User-agent: *
Allow: /

Disallow: /admin

Sitemap: ${sitemapUrl}
`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
