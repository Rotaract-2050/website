export type PageKey = 'home' | 'distretto' | 'club' | 'esecutivo' | 'delegati' | 'commissioni';

/** Path segment (relative to the locale root) for each page. */
export const pageSlugs: Record<PageKey, string> = {
	home: '',
	distretto: 'distretto',
	club: 'club',
	esecutivo: 'esecutivo',
	delegati: 'delegati',
	commissioni: 'commissioni',
};
