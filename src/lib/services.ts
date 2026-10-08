import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type { ServicesConnectionQuery } from '../../tina/__generated__/types';
import type { Lang } from '../data/ui-strings';
import { clubTagLabels } from './news';
import type { NewsTag } from './news';

type ServiceEdge = NonNullable<ServicesConnectionQuery['servicesConnection']['edges']>[number];
export type ServiceArticle = NonNullable<NonNullable<ServiceEdge>['node']>;

export function serviceSlug(article: Pick<ServiceArticle, '_sys'>): string {
	return article._sys.breadcrumbs.join('/');
}

export function localizeService(article: Pick<ServiceArticle, 'title' | 'titleEn' | 'excerpt' | 'excerptEn' | 'body' | 'bodyEn' | 'imageLabel' | 'imageLabelEn'>, lang: Lang) {
	const isEn = lang === 'en';
	return {
		title: (isEn && article.titleEn) || article.title,
		excerpt: (isEn && article.excerptEn) || article.excerpt,
		body: (isEn && article.bodyEn) || article.body,
		imageLabel: (isEn && article.imageLabelEn) || article.imageLabel,
	};
}

export function serviceDateLabel(article: Pick<ServiceArticle, 'date' | 'displayDate'>, formatter: Intl.DateTimeFormat): string {
	return article.displayDate || formatter.format(new Date(article.date)).toUpperCase();
}

export function rotaryYearLabel(dateIso: string): string {
	const date = new Date(dateIso);
	const startYear = date.getUTCMonth() >= 6 ? date.getUTCFullYear() : date.getUTCFullYear() - 1;
	return `AR ${startYear}/${startYear + 1}`;
}

export function serviceTagLabels(article: Pick<ServiceArticle, 'clubs' | 'scope'>): NewsTag[] {
	const scopeTags: NewsTag[] = (article.scope ?? [])
		.filter((s): s is string => Boolean(s))
		.map((label) => ({ label }));
	return [...clubTagLabels(article.clubs as any), ...scopeTags];
}

export async function getClubServices(clubFilename: string): Promise<ServiceArticle[]> {
	const result = await requestWithMetadata(client.queries.servicesConnection({ sort: 'date' }));
	const edges = result.data.servicesConnection.edges ?? [];
	const articles = edges
		.map((edge) => edge?.node)
		.filter((node): node is ServiceArticle => node != null)
		.filter((node) => node.clubs?.some(c => {
			if (!c?.club?._sys) return false;
			// check if it's the right club
			const slug = 'breadcrumbs' in c.club._sys && c.club._sys.breadcrumbs ? c.club._sys.breadcrumbs.join('/') : (c.club._sys as any).filename;
			return slug === clubFilename;
		}))
		.reverse();

	return articles;
}
