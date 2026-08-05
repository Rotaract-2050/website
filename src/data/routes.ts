export type PageKey = 'home' | 'distretto' | 'story' | 'club' | 'squadra' | 'news' | 'eventi' | 'materiali';

/** Path segment (relative to the locale root) for each page. */
export const pageSlugs: Record<PageKey, string> = {
	home: '',
	distretto: 'distretto',
	story: 'story',
	club: 'club',
	squadra: 'la-squadra',
	news: 'news',
	eventi: 'eventi',
	materiali: 'materiali',
};
