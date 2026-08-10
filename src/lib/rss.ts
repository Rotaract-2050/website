import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticTinaMarkdown, type TinaMarkdownContent } from 'tinacms/dist/rich-text/static';
import { uiStrings, SITE_NAME, type Lang } from '../data/ui-strings';
import { eventSlug, localizeEvent, type DistrictEvent } from './events';
import { localizeNews, newsSlug, type NewsArticle } from './news';

export interface RssItem {
	title: string;
	link: string;
	pubDate: Date;
	/** Plain/short summary — the classic RSS `description`. */
	description: string;
	/** Full HTML content (`content:encoded`) — only set for news, which need the whole article, not just an excerpt. */
	content?: string;
}

/** Channel title/description text, per feed and language. Hardcoded like robots.txt — this is feed plumbing, not editorial copy a socio edits from Tina. */
export const RSS_CHANNELS = {
	combined: {
		it: { title: `${SITE_NAME} — Eventi e news`, description: `Prossimi eventi e ultime news dal ${SITE_NAME}.` },
		en: { title: `${SITE_NAME} — Events & news`, description: `Upcoming events and latest news from ${SITE_NAME}.` },
	},
	events: {
		it: { title: `${SITE_NAME} — Eventi`, description: `Eventi in programma e archivio eventi del ${SITE_NAME}.` },
		en: { title: `${SITE_NAME} — Events`, description: `Upcoming and past events of the ${SITE_NAME}.` },
	},
	news: {
		it: { title: `${SITE_NAME} — News`, description: `Ultime news dal ${SITE_NAME}.` },
		en: { title: `${SITE_NAME} — News`, description: `Latest news from the ${SITE_NAME}.` },
	},
} satisfies Record<string, Record<Lang, { title: string; description: string }>>;

const EVENT_RSS_LABELS: Record<Lang, { when: string; tickets: string }> = {
	it: { when: 'Quando', tickets: 'Biglietti e info' },
	en: { when: 'When', tickets: 'Tickets & info' },
};

/** News items kept per feed (per language) — bounds feed size as the archive grows over the years. */
export const NEWS_FEED_LIMIT = 50;

function formatEventDateTime(dateIso: string, lang: Lang): string {
	return new Intl.DateTimeFormat(lang === 'it' ? 'it-IT' : 'en-GB', {
		timeZone: 'Europe/Rome',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(dateIso));
}

/** Same Lavori/Cena vs. single-Location wording as the event detail page's meta block. */
function eventLocationLine(event: Pick<DistrictEvent, 'locationLavori' | 'locationCena'>, lang: Lang): string | null {
	const t = uiStrings[lang].events;
	if (event.locationLavori && event.locationCena) {
		return `${t.worksLocationLabel}: ${event.locationLavori} · ${t.dinnerLocationLabel}: ${event.locationCena}`;
	}
	const single = event.locationLavori || event.locationCena;
	return single ? `${t.locationLabel}: ${single}` : null;
}

/**
 * RSS item for a district event: `description` is an HTML fragment with when/where/what and
 * the ticket link — there's no dedicated RSS element for "buy tickets", so it's a clearly
 * labeled paragraph (same info as the event detail page's "Info e biglietti" button).
 */
export function eventToRssItem(event: DistrictEvent, lang: Lang): RssItem {
	const localized = localizeEvent(event, lang);
	const labels = EVENT_RSS_LABELS[lang];
	const location = eventLocationLine(event, lang);
	const parts = [`<p><strong>${labels.when}:</strong> ${formatEventDateTime(event.date, lang)}</p>`];
	if (location) parts.push(`<p>${location}</p>`);
	if (localized.excerpt) parts.push(`<p>${localized.excerpt}</p>`);
	if (event.ticketsUrl) parts.push(`<p><a href="${event.ticketsUrl}">${labels.tickets}</a>: ${event.ticketsUrl}</p>`);
	return {
		title: localized.title,
		link: lang === 'en' ? `/en/eventi/${eventSlug(event)}` : `/eventi/${eventSlug(event)}`,
		pubDate: new Date(event.date),
		description: parts.join('\n'),
	};
}

/**
 * RSS item for a news article: short excerpt as `description`, full body as `content:encoded`
 * — rendered through the same `StaticTinaMarkdown` component as the article page
 * (`src/pages/news/[slug].astro`), so links/formatting match what's on the site.
 */
export function newsToRssItem(article: NewsArticle, lang: Lang): RssItem {
	const localized = localizeNews(article, lang);
	const html = localized.body
		? renderToStaticMarkup(React.createElement(StaticTinaMarkdown, { content: localized.body as TinaMarkdownContent }))
		: '';
	return {
		title: localized.title,
		link: lang === 'en' ? `/en/news/${newsSlug(article)}` : `/news/${newsSlug(article)}`,
		pubDate: new Date(article.date),
		description: localized.excerpt || '',
		content: html,
	};
}

export function sortByPubDateDesc(items: RssItem[]): RssItem[] {
	return [...items].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}
