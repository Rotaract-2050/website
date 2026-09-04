// Events themselves are not authored inline: they live in the dedicated `events` collection
// (like NewsGrid/`news`), so adding one anywhere shows up on the /eventi archive automatically.
// The page's own title/eyebrow (from the `pages` collection) already serve as the archive's
// banner — GraphQL requires an object type to define at least one field, so the only editorial
// field here is the (optional) empty-state message, overriding the default system copy.
export const eventsArchiveTemplate = {
	name: 'EventsArchive',
	label: 'Archivio eventi (elenco)',
	fields: [
		{
			type: 'string' as const,
			name: 'emptyMessage',
			label: 'Messaggio se non ci sono eventi (IT, opzionale)',
			ui: { component: 'textarea' },
		},
		{
			type: 'string' as const,
			name: 'emptyMessageEn',
			label: 'Messaggio se non ci sono eventi (EN, opzionale)',
			ui: { component: 'textarea' },
		},
	],
};
