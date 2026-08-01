export type PageKey = 'home' | 'distretto' | 'story' | 'club' | 'esecutivo' | 'delegati' | 'commissioni' | 'news' | 'eventi';

/** Path segment (relative to the locale root) for each page. */
export const pageSlugs: Record<PageKey, string> = {
	home: '',
	distretto: 'distretto',
	story: 'story',
	club: 'club',
	esecutivo: 'esecutivo',
	delegati: 'delegati',
	commissioni: 'commissioni',
	news: 'news',
	eventi: 'eventi',
};
