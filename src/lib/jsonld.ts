import type { Lang } from '../data/ui-strings';
import { SITE_NAME } from '../data/ui-strings';

interface OrganizationGraphInput {
	/** Rotaract Distretto 2050 and Interact Distretto 2050 are two distinct entities under Rotary
	 * International, not one organization with a different color scheme — never default this to
	 * SITE_NAME, every caller must say which entity the current page actually belongs to. */
	name: string;
	/** Distinct `@id`/`@id`-suffix per entity so the two graphs never collide when a crawler sees
	 * them on different pages of the same domain (default: the site's main organization). */
	idSuffix?: string;
	/** The entity's own homepage — the domain root for Rotaract, `/interact` for Interact. Defaults to `siteUrl`. */
	url?: string;
	about?: string | null;
	logo?: string | null; // già risolto a URL assoluto dal chiamante
	fiscalCode?: string | null;
	sameAs?: string[];
}

/** Grafo sitewide Organization + WebSite, renderizzato una volta da BaseLayout — un nodo distinto per
 * entità (vedi il commento su `name` sopra), non un solo grafo Rotaract riusato ovunque. */
export function buildOrganizationGraph(input: OrganizationGraphInput, siteUrl: string) {
	const idSuffix = input.idSuffix ?? 'organization';
	const url = input.url ?? siteUrl;
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': `${siteUrl}#${idSuffix}`,
				name: input.name,
				url,
				logo: input.logo || undefined,
				description: input.about || undefined,
				taxID: input.fiscalCode || undefined,
				sameAs: input.sameAs,
			},
			{
				'@type': 'WebSite',
				'@id': `${siteUrl}#${idSuffix}-website`,
				name: input.name,
				url,
				inLanguage: ['it', 'en'],
				publisher: { '@id': `${siteUrl}#${idSuffix}` },
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
	endDate?: string | null;
	imageUrl: string;
	url: string;
	siteUrl: string;
	/** Chi organizza l'evento secondo schema.org — Rotaract Distretto 2050 e Interact Distretto 2050
	 * sono due entità diverse, va sempre passato esplicitamente dal chiamante (mai un default a
	 * SITE_NAME: un evento Interact non è organizzato dal Rotaract). */
	organizerName: string;
	locationName?: string | null;
	ticketsUrl?: string | null;
	ticketsOpen?: boolean;
}) {
	if (!p.locationName) return null;
	return {
		'@context': 'https://schema.org',
		'@type': 'Event',
		name: p.name,
		startDate: p.startDate,
		// Almost every event here runs a single day; rather than make editors duplicate the start
		// date into `endDate` for the common case, default to it automatically and only let Tina's
		// (optional) endDate field override it for the rare multi-day event.
		endDate: p.endDate || p.startDate,
		eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
		eventStatus: 'https://schema.org/EventScheduled',
		image: [p.imageUrl],
		description: p.description || undefined,
		url: p.url,
		// `address` also accepts plain text per schema.org's Place definition — locationLavori/
		// locationCena are free-text venue names in Tina (no separate street/city fields), so
		// reusing the same string is the only genuine address data we actually have; not fabricating
		// a PostalAddress out of nothing.
		location: { '@type': 'Place', name: p.locationName, address: p.locationName },
		organizer: { '@type': 'Organization', name: p.organizerName, url: p.siteUrl },
		// Only emit `offers` when there's a real ticket link — a bare Offer with no url would be
		// worse than none. We don't have a structured price (external Ticket Tailor page owns
		// that), so `price`/`priceCurrency` stay unset; Google may start flagging those as their own
		// (still non-blocking) warning, which is expected and fine.
		offers: p.ticketsUrl
			? {
					'@type': 'Offer',
					url: p.ticketsUrl,
					availability: p.ticketsOpen === false ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
					validFrom: p.startDate,
				}
			: undefined,
	};
}
