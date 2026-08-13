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
 * A resource's title/excerpt/body/imageLabel/category in the given language — one file holds
 * both (`title`/`titleEn`, like `news.title`/`titleEn`), falling back to the IT value when the
 * EN twin is empty, same fallback rule as `localizeNews`.
 */
export function localizeResource(
	resource: Pick<Resource, 'title' | 'titleEn' | 'excerpt' | 'excerptEn' | 'body' | 'bodyEn' | 'imageLabel' | 'imageLabelEn' | 'category' | 'categoryEn'>,
	lang: Lang,
) {
	const isEn = lang === 'en';
	return {
		title: (isEn && resource.titleEn) || resource.title,
		excerpt: (isEn && resource.excerptEn) || resource.excerpt,
		body: (isEn && resource.bodyEn) || resource.body,
		imageLabel: (isEn && resource.imageLabelEn) || resource.imageLabel,
		category: (isEn && resource.categoryEn) || resource.category,
	};
}

/** Stable filter key for a category label (lowercased, accents/punctuation collapsed to `-`) — the `data-category` value the archive's filter pills match against, independent of display casing/accents. */
export function categorySlug(category: string): string {
	return category
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** Distinct category labels across a set of resources, in first-seen order (stable, not alphabetized away from editorial intent) — powers the archive's filter pills. */
export function resourceCategories(resources: Pick<Resource, 'category' | 'categoryEn'>[], lang: Lang): string[] {
	const isEn = lang === 'en';
	const seen = new Set<string>();
	for (const resource of resources) {
		seen.add((isEn && resource.categoryEn) || resource.category);
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
