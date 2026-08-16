export type PageKey = 'home' | 'distretto' | 'story' | 'rrd' | 'club' | 'squadra' | 'news' | 'eventi' | 'materiali' | 'formazione' | 'privacy';

/** Path segment (relative to the locale root) for each page. */
export const pageSlugs: Record<PageKey, string> = {
	home: '',
	distretto: 'distretto',
	story: 'story',
	rrd: 'rrd',
	club: 'club',
	squadra: 'la-squadra',
	news: 'news',
	eventi: 'eventi',
	materiali: 'materiali',
	formazione: 'formazione',
	privacy: 'privacy',
};
