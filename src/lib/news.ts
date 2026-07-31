import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type { NewsConnectionQuery } from '../../tina/__generated__/types';
import type { Lang } from '../data/ui-strings';

type NewsEdge = NonNullable<NewsConnectionQuery['newsConnection']['edges']>[number];
export type NewsArticle = NonNullable<NonNullable<NewsEdge>['node']>;

/** Slug relative to the locale folder, e.g. `it/academy-2050.md` -> `academy-2050`. */
export function newsSlug(article: Pick<NewsArticle, '_sys'>): string {
	return article._sys.breadcrumbs.slice(1).join('/');
}

/**
 * Rotary year label for a date, e.g. `AR 2026/2027`. The Rotary year always runs
 * 1 July - 30 June, so this is derived from the article's publish date rather than
 * tagged by hand — see references/news-tags.md for why.
 */
export function rotaryYearLabel(dateIso: string): string {
	const date = new Date(dateIso);
	const startYear = date.getUTCMonth() >= 6 ? date.getUTCFullYear() : date.getUTCFullYear() - 1;
	return `AR ${startYear}/${startYear + 1}`;
}

export interface NewsTag {
	label: string;
	/** Zone brand color (hex) for club tags, so a club's pill reads as its zone's color. Unset for scope tags. */
	color?: string | null;
}

/** Badge labels for a news card/detail page: tagged club names (colored by their zone), then fixed scope tags (Distretto/MDIO). */
export function newsTagLabels(article: Pick<NewsArticle, 'clubs' | 'scope'>): NewsTag[] {
	const clubTags: NewsTag[] = (article.clubs ?? [])
		.map((entry) => entry?.club)
		.filter((club): club is NonNullable<typeof club> => club != null)
		.map((club) => ({ label: club.name, color: club.zone?.color ?? null }));
	const scopeTags: NewsTag[] = (article.scope ?? [])
		.filter((s): s is string => Boolean(s))
		.map((label) => ({ label }));
	return [...clubTags, ...scopeTags];
}

/**
 * Inline CSS custom properties for a tag pill's zone color (light tint background, solid text) —
 * the same recipe as the fixed Cranberry scope pill, just parameterized by hex. Returns undefined
 * for untagged/no-color tags, so the pill falls back to the default pink in CSS.
 */
export function tagPillStyle(color?: string | null): string | undefined {
	if (!color) return undefined;
	const hex = color.replace('#', '');
	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);
	return `--tag-bg: rgba(${r}, ${g}, ${b}, 0.12); --tag-color: ${color};`;
}

/**
 * All published district news for a locale, newest first. Backed by the `news` Tina
 * collection (like clubs/zones), so any article a socio adds shows up here without
 * touching a page block. Pass `limit` to cap how many are returned (e.g. for the
 * homepage teaser); omit it for the full archive.
 */
export async function getDistrictNews(lang: Lang, limit?: number): Promise<NewsArticle[]> {
	const result = await requestWithMetadata(client.queries.newsConnection({ sort: 'date' }));
	const edges = result.data.newsConnection.edges ?? [];
	const articles = edges
		.map((edge) => edge?.node)
		.filter((node): node is NewsArticle => node != null)
		.filter((node) => node._sys.breadcrumbs[0] === lang)
		.reverse();

	return typeof limit === 'number' ? articles.slice(0, limit) : articles;
}
