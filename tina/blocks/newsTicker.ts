// Ticker items are not Tina content: NewsTicker.astro fetches them live from an RSS feed
// (default: Rotary International's rotary.org/rss.xml) via src/lib/rotaryNews.ts. Only the
// label and feed settings are editorial, so a socio can point it at a different feed without
// touching code.
export const newsTickerTemplate = {
	name: 'NewsTicker',
	label: 'Barra notizie (RSS)',
	ui: { itemProps: (item: { label?: string }) => ({ label: item.label }) },
	fields: [
		{ type: 'string' as const, name: 'label', label: 'Etichetta (IT)', required: true },
		{ type: 'string' as const, name: 'labelEn', label: 'Etichetta (EN)' },
		{ type: 'string' as const, name: 'feedUrl', label: 'URL feed RSS' },
		{ type: 'number' as const, name: 'limit', label: 'Numero massimo di notizie' },
	],
};
