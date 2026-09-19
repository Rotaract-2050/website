// News items are not authored inline on the page: they live in the dedicated `news`
// collection (like clubs/zones) so that adding an article anywhere shows up here
// automatically. Only the section title and how many to show are editorial.
export const newsGridTemplate = {
	name: 'NewsGrid',
	label: 'Griglia news',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
		{ type: 'number' as const, name: 'limit', label: 'Numero massimo di notizie mostrate' },
		{ type: 'boolean' as const, name: 'showDate', label: 'Mostra la data sulle card' },
		{ type: 'boolean' as const, name: 'showYear', label: 'Mostra l\'anno rotariano (AR) sulle card' },
	],
};
