import type { Lang } from '../data/ui-strings';
import { SITE_NAME, SOCIAL_LINKS } from '../data/ui-strings';

interface SettingsForJsonLd {
	about?: string | null;
	logo?: string | null; // già risolto a URL assoluto dal chiamante
	fiscalCode?: string | null;
}

/** Grafo sitewide Organization + WebSite, renderizzato una volta da BaseLayout. */
export function buildOrganizationGraph(settings: SettingsForJsonLd, siteUrl: string) {
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': `${siteUrl}#organization`,
				name: SITE_NAME,
				url: siteUrl,
				logo: settings.logo,
				description: settings.about || undefined,
				taxID: settings.fiscalCode || undefined,
				sameAs: SOCIAL_LINKS.map((s) => s.href),
			},
			{
				'@type': 'WebSite',
				'@id': `${siteUrl}#website`,
				name: SITE_NAME,
				url: siteUrl,
				inLanguage: ['it', 'en'],
				publisher: { '@id': `${siteUrl}#organization` },
			},
		],
	};
}

/** BreadcrumbList — rispecchia esattamente il breadcrumb visibile in pagina, niente gerarchie inventate. */
export function buildBreadcrumbList(items: { name: string; url: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url })),
	};
}

export function buildNewsArticleJsonLd(p: {
	headline: string;
	description: string;
	imageUrl: string;
	datePublished: string;
	url: string;
	lang: Lang;
	publisherLogoUrl: string;
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'NewsArticle',
		headline: p.headline,
		description: p.description,
		image: [p.imageUrl],
		datePublished: p.datePublished,
		inLanguage: p.lang,
		mainEntityOfPage: { '@type': 'WebPage', '@id': p.url },
		author: { '@type': 'Organization', name: SITE_NAME },
		publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: p.publisherLogoUrl } },
	};
}

/** Generic Article schema for evergreen knowledge-base content (no publish date semantics like NewsArticle). */
export function buildArticleJsonLd(p: { headline: string; description: string; imageUrl: string; url: string; lang: Lang; publisherLogoUrl: string }) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: p.headline,
		description: p.description,
		image: [p.imageUrl],
		inLanguage: p.lang,
		mainEntityOfPage: { '@type': 'WebPage', '@id': p.url },
		author: { '@type': 'Organization', name: SITE_NAME },
		publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: p.publisherLogoUrl } },
	};
}

/** ItemList — tells search engines a page is a hub linking to N other pages (e.g. the /formazione archive), not just prose. Each entry is a full ListItem with its own `url` (schema.org allows a bare string too, but explicit ListItems are what's shown in examples for indexable collection pages). */
export function buildItemListJsonLd(items: { name: string; url: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, url: item.url })),
	};
}

// `location` is required by Google for Event rich results (an in-person OfflineEventAttendanceMode
// event without one is reported as "invalid item" in Search Console, not just missing a nice-to-have
// field) — so when a club hasn't filled in locationLavori/locationCena yet, emit no Event markup at
// all rather than an Event object Google will flag as broken. Better to have no rich result than an
// invalid one.
export function buildEventJsonLd(p: {
	name: string;
	description?: string | null;
	startDate: string;
	imageUrl: string;
	url: string;
	locationName?: string | null;
}) {
	if (!p.locationName) return null;
	return {
		'@context': 'https://schema.org',
		'@type': 'Event',
		name: p.name,
		startDate: p.startDate,
		eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
		eventStatus: 'https://schema.org/EventScheduled',
		image: [p.imageUrl],
		description: p.description || undefined,
		url: p.url,
		location: { '@type': 'Place', name: p.locationName },
		organizer: { '@type': 'Organization', name: SITE_NAME },
	};
}
