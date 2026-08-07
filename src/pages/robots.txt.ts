import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
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
