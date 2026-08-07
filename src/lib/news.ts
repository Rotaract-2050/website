import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type { NewsConnectionQuery } from '../../tina/__generated__/types';
import type { Lang } from '../data/ui-strings';

type NewsEdge = NonNullable<NewsConnectionQuery['newsConnection']['edges']>[number];
export type NewsArticle = NonNullable<NonNullable<NewsEdge>['node']>;

/** Slug for a news article, e.g. `academy-2050.md` -> `academy-2050`. */
export function newsSlug(article: Pick<NewsArticle, '_sys'>): string {
	return article._sys.breadcrumbs.join('/');
}

/**
 * A news article's title/excerpt/body/imageLabel in the given language — one file holds both
 * (`title`/`titleEn`, like `clubs.story`/`storyEn`), falling back to the IT value when the EN
 * twin is empty, same as `ClubDetail.astro`'s `story`/`storyEn` fallback.
 */
export function localizeNews(article: Pick<NewsArticle, 'title' | 'titleEn' | 'excerpt' | 'excerptEn' | 'body' | 'bodyEn' | 'imageLabel' | 'imageLabelEn'>, lang: Lang) {
	const isEn = lang === 'en';
	return {
		title: (isEn && article.titleEn) || article.title,
		excerpt: (isEn && article.excerptEn) || article.excerpt,
		body: (isEn && article.bodyEn) || article.body,
		imageLabel: (isEn && article.imageLabelEn) || article.imageLabel,
	};
}

/**
 * The date label shown on a news card: `displayDate` verbatim if the article has one
 * (an editorial override, e.g. "Estate 2026" instead of a day-precise date), otherwise
 * the publish date formatted normally. Ordering and the Rotary year (`rotaryYearLabel`)
 * always use the real `date` field regardless — this only changes what's displayed.
 */
export function newsDateLabel(article: Pick<NewsArticle, 'date' | 'displayDate'>, formatter: Intl.DateTimeFormat): string {
	return article.displayDate || formatter.format(new Date(article.date)).toUpperCase();
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

type ClubTagRef = { club?: { name: string; zone?: { color?: string | null } | null } | null } | null;

/**
 * Badge labels for tagged clubs (colored by their zone) — shared shape between `news.clubs` and
 * `events.clubs` ("Club ospitanti"), both the same Tina reference-list workaround (see below).
 */
export function clubTagLabels(clubs: ClubTagRef[] | null | undefined): NewsTag[] {
	return (clubs ?? [])
		.map((entry) => entry?.club)
		.filter((club): club is NonNullable<typeof club> => club != null)
		.map((club) => ({ label: club.name, color: club.zone?.color ?? null }));
}

/** Badge labels for a news card/detail page: tagged club names (colored by their zone), then scope tags (Distretto/MDIO/Service Distrettuale/Service Interdistrettuale/Service Nazionale). */
export function newsTagLabels(article: Pick<NewsArticle, 'clubs' | 'scope'>): NewsTag[] {
	const scopeTags: NewsTag[] = (article.scope ?? [])
		.filter((s): s is string => Boolean(s))
		.map((label) => ({ label }));
	return [...clubTagLabels(article.clubs), ...scopeTags];
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
 * All published district news, newest first, in both languages (one doc per article, like
 * clubs/zones — see `localizeNews`). Backed by the `news` Tina collection, so any article a
 * socio adds shows up here without touching a page block. Pass `limit` to cap how many are
 * returned (e.g. for the homepage teaser); omit it for the full archive.
 */
export async function getDistrictNews(limit?: number): Promise<NewsArticle[]> {
	const result = await requestWithMetadata(client.queries.newsConnection({ sort: 'date' }));
	const edges = result.data.newsConnection.edges ?? [];
	const articles = edges
		.map((edge) => edge?.node)
		.filter((node): node is NewsArticle => node != null)
		.reverse();

	return typeof limit === 'number' ? articles.slice(0, limit) : articles;
}
