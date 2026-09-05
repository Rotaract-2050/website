// Clone of eventsCalendarTemplate, bound to InteractEventsCalendar.astro (own Google Calendar
// source, own cross-links into /interact/eventi/<slug> — see src/lib/interact-events.ts).
export const interactEventsCalendarTemplate = {
	name: 'InteractEventsCalendar',
	label: 'Calendario eventi Interact',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
		{
			type: 'string' as const,
			name: 'calendarId',
			label: 'ID Calendario Google (opzionale)',
			description:
				'Da Google Calendar → Impostazioni del calendario → "Integra calendario" → "ID calendario". Lascia vuoto per usare il calendario di default del distretto Interact.',
		},
	],
};
