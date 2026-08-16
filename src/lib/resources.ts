import { getRelativeLocaleUrl } from 'astro:i18n';
import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type { ResourcesConnectionQuery } from '../../tina/__generated__/types';
import type { Lang } from '../data/ui-strings';
import type { WikilinkResolver } from './resource-markdown';

type ResourceEdge = NonNullable<ResourcesConnectionQuery['resourcesConnection']['edges']>[number];
export type Resource = NonNullable<NonNullable<ResourceEdge>['node']>;

/** Slug for a resource, e.g. `il-ruolo-del-prefetto.md` -> `il-ruolo-del-prefetto`. */
export function resourceSlug(resource: Pick<Resource, '_sys'>): string {
	return resource._sys.breadcrumbs.join('/');
}

/**
 * English label for each `tags` option in `tina/config.ts`. `tags` is a fixed, options-constrained
 * list (unlike free-text fields), so a small lookup map here covers every possible value without
 * needing a parallel `tagsEn` list field for editors to keep in sync by index. Add a translation
 * here whenever a new tag option is added to the schema.
 */
const TAG_LABELS_EN: Record<string, string> = {
	'Storia & Valori': 'History & Values',
	'Struttura & Governance': 'Structure & Governance',
	'Dimensione Internazionale': 'International Network',
	'Service & Fondazione': 'Service & Foundation',
	'Protocollo & Cerimoniale': 'Protocol & Ceremonial',
	'Leadership & Giovani': 'Leadership & Youth',
	'Gestione & Strumenti': 'Management & Tools',
	Presidente: 'President',
	Segretario: 'Secretary',
	Tesoriere: 'Treasurer',
	Prefetto: 'Prefect',
	Cerimoniale: 'Protocol',
	'Cultura Rotariana': 'Rotary Culture',
};

/** A tag's label in the given language, falling back to the Italian value for any tag not yet in `TAG_LABELS_EN`. */
export function localizeTag(tag: string, lang: Lang): string {
	return lang === 'en' ? TAG_LABELS_EN[tag] ?? tag : tag;
}

/**
 * Color for each `tags` option, from the secondary Rotary palette reserved for tag/categorization
 * badges (see references/rotary-brand.md) — the same set `zones.color` draws from for club/news
 * tags, so resource tags read as the same "kind" of UI element sitewide. Add a color here whenever
 * a new tag option is added to the schema; DEFAULT_TAG_COLOR covers any tag not yet assigned one.
 */
const TAG_COLORS: Record<string, string> = {
	'Storia & Valori': '#901F93', // Violet
	'Struttura & Governance': '#0067C8', // Azure
	'Dimensione Internazionale': '#00A2E0', // Sky Blue
	'Service & Fondazione': '#009739', // Grass
	'Protocollo & Cerimoniale': '#FF7600', // Orange
	'Leadership & Giovani': '#F7A81B', // Rotary Gold
	'Gestione & Strumenti': '#00ADBB', // Turquoise
	Presidente: '#17458F', // Rotary Royal Blue
	Segretario: '#00A2E0', // Sky Blue
	Tesoriere: '#F7A81B', // Rotary Gold
	Prefetto: '#D41367', // Cranberry — was Orange, same as 'Protocollo & Cerimoniale' (flat gradient when a card has both, which is common)
	Cerimoniale: '#00ADBB', // Turquoise
	'Cultura Rotariana': '#901F93', // Violet
};
const DEFAULT_TAG_COLOR = '#D41367'; // Cranberry — brand default, also used when a resource has no tags at all

export function tagColor(tag: string): string {
	return TAG_COLORS[tag] ?? DEFAULT_TAG_COLOR;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
	const clean = hex.replace('#', '');
	return { r: parseInt(clean.slice(0, 2), 16), g: parseInt(clean.slice(2, 4), 16), b: parseInt(clean.slice(4, 6), 16) };
}

/** Inline CSS custom properties for a tag pill's color (light tint background, solid text) — same recipe as `tagPillStyle` in lib/news.ts, kept separate here since resource tags key off the local `TAG_COLORS` map instead of a zone reference. */
export function tagPillStyle(tag: string): string {
	const { r, g, b } = hexToRgb(tagColor(tag));
	return `--tag-bg: rgba(${r}, ${g}, ${b}, 0.14); --tag-color: ${tagColor(tag)};`;
}

/**
 * A resource card's background: sets the smoke-animation RGB variables (--smoke-c1, --smoke-c2)
 * derived from its tags' colors, plus a fallback static soft linear gradient.
 */
export function resourceCardGradient(tags: string[]): string {
	const colors = tags.length > 0 ? tags.slice(0, 2).map(tagColor) : [DEFAULT_TAG_COLOR];
	const rgb1 = hexToRgb(colors[0]);
	const rgb2 = hexToRgb(colors[1] ?? colors[0]);
	const stops = colors.length === 1
		? `rgba(${rgb1.r}, ${rgb1.g}, ${rgb1.b}, 0.1) 0%, #fff 60%`
		: `rgba(${rgb1.r}, ${rgb1.g}, ${rgb1.b}, 0.1) 0%, rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, 0.1) 55%, #fff 90%`;
	return `--smoke-c1: ${rgb1.r}, ${rgb1.g}, ${rgb1.b}; --smoke-c2: ${rgb2.r}, ${rgb2.g}, ${rgb2.b}; background: linear-gradient(155deg, ${stops});`;
}

/**
 * A resource's title/excerpt/body/imageLabel/tags in the given language — one file holds both
 * (`title`/`titleEn`, like `news.title`/`titleEn`), falling back to the IT value when the EN
 * twin is empty, same fallback rule as `localizeNews`.
 */
export function localizeResource(
	resource: Pick<Resource, 'title' | 'titleEn' | 'excerpt' | 'excerptEn' | 'body' | 'bodyEn' | 'tags'>,
	lang: Lang,
) {
	const isEn = lang === 'en';
	return {
		title: (isEn && resource.titleEn) || resource.title,
		excerpt: (isEn && resource.excerptEn) || resource.excerpt,
		body: (isEn && resource.bodyEn) || resource.body,
		tags: (resource.tags ?? []).filter((tag): tag is string => Boolean(tag)).map((tag) => localizeTag(tag, lang)),
	};
}

/** Stable filter key for a tag label (lowercased, accents/punctuation collapsed to `-`) — the `data-tags` value the archive's filter pills match against, independent of display casing/accents. Applied to the canonical (Italian) tag so IT/EN pages share the same filter keys. */
export function tagSlug(tag: string): string {
	return tag
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** Distinct tags across a set of resources, in first-seen order (stable, not alphabetized away from editorial intent) — powers the archive's filter pills. */
export function resourceTags(resources: Pick<Resource, 'tags'>[]): string[] {
	const seen = new Set<string>();
	for (const resource of resources) {
		for (const tag of resource.tags ?? []) {
			if (tag) seen.add(tag);
		}
	}
	return [...seen];
}

/**
 * Builds a `[[slug]]` wikilink resolver (see `lib/resource-markdown.ts`) from a set of resources
 * already fetched for the page — the archive fetches the whole collection anyway, and a resource
 * detail page fetches it once for this purpose (see ResourceView.astro), rather than issuing a
 * query per link found in a body.
 */
export function buildWikilinkResolver(resources: Pick<Resource, '_sys' | 'title' | 'titleEn'>[], lang: Lang): WikilinkResolver {
	const bySlug = new Map(resources.map((resource) => [resourceSlug(resource), resource]));
	return (slug) => {
		const resource = bySlug.get(slug);
		if (!resource) return undefined;
		const isEn = lang === 'en';
		return {
			href: getRelativeLocaleUrl(lang, `formazione/${slug}`),
			label: (isEn && resource.titleEn) || resource.title,
		};
	};
}

/**
 * All knowledge-base resources, ordered by their editorial `order` (lowest first, unset treated
 * as last) then alphabetically by title — see the `order` field description in `tina/config.ts`.
 * Backed by the `resources` Tina collection, so any article a socio adds shows up here without
 * touching a page block, same reasoning as `getDistrictNews`.
 */
export async function getKnowledgeResources(): Promise<Resource[]> {
	const result = await requestWithMetadata(client.queries.resourcesConnection());
	const edges = result.data.resourcesConnection.edges ?? [];
	const resources = edges.map((edge) => edge?.node).filter((node): node is Resource => node != null);

	return resources.sort((a, b) => {
		const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
		const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
		if (orderA !== orderB) return orderA - orderB;
		return a.title.localeCompare(b.title);
	});
}
