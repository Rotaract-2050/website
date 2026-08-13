import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type { ResourcesConnectionQuery } from '../../tina/__generated__/types';
import type { Lang } from '../data/ui-strings';

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
	Prefetto: 'Prefect',
	Cerimoniale: 'Protocol',
};

/** A tag's label in the given language, falling back to the Italian value for any tag not yet in `TAG_LABELS_EN`. */
export function localizeTag(tag: string, lang: Lang): string {
	return lang === 'en' ? TAG_LABELS_EN[tag] ?? tag : tag;
}

/**
 * A resource's title/excerpt/body/imageLabel/tags in the given language — one file holds both
 * (`title`/`titleEn`, like `news.title`/`titleEn`), falling back to the IT value when the EN
 * twin is empty, same fallback rule as `localizeNews`.
 */
export function localizeResource(
	resource: Pick<Resource, 'title' | 'titleEn' | 'excerpt' | 'excerptEn' | 'body' | 'bodyEn' | 'imageLabel' | 'imageLabelEn' | 'tags'>,
	lang: Lang,
) {
	const isEn = lang === 'en';
	return {
		title: (isEn && resource.titleEn) || resource.title,
		excerpt: (isEn && resource.excerptEn) || resource.excerpt,
		body: (isEn && resource.bodyEn) || resource.body,
		imageLabel: (isEn && resource.imageLabelEn) || resource.imageLabel,
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
