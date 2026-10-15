/** Site sections reported to GA4 as the `content_group` parameter. */
export type ContentGroup = 'home' | 'news' | 'eventi' | 'formazione' | 'interact' | 'club' | 'service' | 'pagina' | '404';

const SECTION_GROUPS: Record<string, ContentGroup> = {
	news: 'news',
	eventi: 'eventi',
	formazione: 'formazione',
	interact: 'interact',
	club: 'club',
	service: 'service',
};

/** Derives the GA4 `content_group` from a URL pathname. The `/en` prefix is ignored so IT and EN
 * pages land in the same group; unknown first segments are generic Tina pages (`pagina`). */
export function resolveContentGroup(pathname: string): ContentGroup {
	const segments = pathname.split('/').filter(Boolean);
	if (segments[0] === 'en') segments.shift();
	if (segments.length === 0) return 'home';
	return SECTION_GROUPS[segments[0]] ?? 'pagina';
}
