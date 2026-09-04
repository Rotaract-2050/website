export type PageKey =
	| 'home'
	| 'distretto'
	| 'story'
	| 'rrd'
	| 'club'
	| 'squadra'
	| 'news'
	| 'eventi'
	| 'materiali'
	| 'formazione'
	| 'privacy'
	| 'interactHome'
	| 'interactStoria'
	| 'interactSquadra'
	| 'interactClub'
	| 'interactAlbo'
	| 'interactEventi';

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
	// Interact sub-section — nested `pages` documents (src/content/pages/interact/*.md),
	// served by the same catch-all + pageRouter mechanism as every other `pages` entry (see
	// tina/config.ts's pageRouter and the interactSlug guard in src/pages/[...slug].astro).
	interactHome: 'interact',
	interactStoria: 'interact/storia',
	interactSquadra: 'interact/squadra',
	interactClub: 'interact/club',
	interactAlbo: 'interact/albo',
	interactEventi: 'interact/eventi',
};
