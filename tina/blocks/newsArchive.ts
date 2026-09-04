// Same reasoning/shape as EventsArchive above: articles live in the dedicated `news` collection,
// the page's own title/eyebrow serve as the banner, and the one editorial field is an optional
// empty-state override (also required so the block's GraphQL object type isn't fieldless).
export const newsArchiveTemplate = {
	name: 'NewsArchive',
	label: 'Archivio news (elenco)',
	fields: [
		{
			type: 'string' as const,
			name: 'emptyMessage',
			label: 'Messaggio se non ci sono news (IT, opzionale)',
			ui: { component: 'textarea' },
		},
		{
			type: 'string' as const,
			name: 'emptyMessageEn',
			label: 'Messaggio se non ci sono news (EN, opzionale)',
			ui: { component: 'textarea' },
		},
		{ type: 'boolean' as const, name: 'showDate', label: 'Mostra la data sulle card' },
		{ type: 'boolean' as const, name: 'showYear', label: 'Mostra l\'anno rotariano (AR) sulle card' },
	],
};
