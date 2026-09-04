// Resources themselves are not authored inline: they live in the dedicated `resources`
// collection (like NewsArchive/`news`), so adding a knowledge-base article anywhere shows up
// on the /formazione archive automatically. The page's own title/eyebrow already serve as the
// archive's banner — the only editorial field here is an optional empty-state message override.
export const resourceArchiveTemplate = {
	name: 'ResourceArchive',
	label: 'Archivio formazione/risorse (elenco)',
	fields: [
		{
			type: 'string' as const,
			name: 'emptyMessage',
			label: 'Messaggio se non ci sono risorse (IT, opzionale)',
			ui: { component: 'textarea' },
		},
		{
			type: 'string' as const,
			name: 'emptyMessageEn',
			label: 'Messaggio se non ci sono risorse (EN, opzionale)',
			ui: { component: 'textarea' },
		},
	],
};
