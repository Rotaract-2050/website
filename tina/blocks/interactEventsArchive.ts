// Clone of eventsArchiveTemplate, bound to InteractEventsArchive.astro (reads the isolated
// `interact-events` collection instead of `events`).
export const interactEventsArchiveTemplate = {
	name: 'InteractEventsArchive',
	label: 'Archivio eventi Interact (elenco)',
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
