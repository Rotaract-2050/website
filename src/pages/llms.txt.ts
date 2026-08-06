import type { APIRoute } from 'astro';
import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import { pageSlugs } from '../data/routes';

export const GET: APIRoute = async ({ site }) => {
	const [{ data: it }, { data: en }] = await Promise.all([
		requestWithMetadata(client.queries.settings({ relativePath: 'it.md' })),
		requestWithMetadata(client.queries.settings({ relativePath: 'en.md' })),
	]);

	const abs = (slug: string, lang: 'it' | 'en') => new URL(lang === 'it' ? `/${slug}` : `/en/${slug}`, site).toString();

	const body = `# Rotaract Distretto 2050

> ${it.settings.about}
>
> ${en.settings.about}

Sito bilingue italiano (default) / inglese del Distretto Rotaract 2050. / Bilingual Italian (default) / English site of Rotaract District 2050.

## Pagine principali (italiano)
- [Il Distretto](${abs(pageSlugs.distretto, 'it')})
- [I Club](${abs(pageSlugs.club, 'it')})
- [La Squadra](${abs(pageSlugs.squadra, 'it')})
- [News dal distretto](${abs(pageSlugs.news, 'it')})
- [Eventi](${abs(pageSlugs.eventi, 'it')})
- [Materiali distrettuali](${abs(pageSlugs.materiali, 'it')})

## Main pages (English)
- [The District](${abs(pageSlugs.distretto, 'en')})
- [Clubs](${abs(pageSlugs.club, 'en')})
- [The Team](${abs(pageSlugs.squadra, 'en')})
- [News](${abs(pageSlugs.news, 'en')})
- [Events](${abs(pageSlugs.eventi, 'en')})
- [District materials](${abs(pageSlugs.materiali, 'en')})

## Utilizzo dei contenuti da parte di sistemi AI / Use of content by AI systems
Il Distretto Rotaract 2050 autorizza l'uso dei contenuti di questo sito da parte di assistenti e
motori di risposta basati su intelligenza artificiale. Se questi contenuti vengono citati o
riassunti, chiediamo di indicare "Rotaract Distretto 2050" come fonte con link a
https://rotaract2050.org.

Rotaract District 2050 permits AI assistants and answer engines to use this site's content. When
citing or summarizing it, please attribute "Rotaract District 2050" as the source with a link to
https://rotaract2050.org.

## Contatti / Contact
${it.settings.email}
${it.settings.address}

## Sitemap
${new URL('sitemap-index.xml', site)}
`;

	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
