// Events themselves are not Tina content: EventsCalendar.astro fetches them live from the
// district's public Google Calendar (src/lib/calendar.ts), whose ID is set below (calendarId).
// Only the events themselves are non-editorial — title and calendar source are.
export const eventsCalendarTemplate = {
	name: 'EventsCalendar',
	label: 'Calendario eventi',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
		{
			type: 'string' as const,
			name: 'calendarId',
			label: 'ID Calendario Google (opzionale)',
			description:
				'Da Google Calendar → Impostazioni del calendario → "Integra calendario" → "ID calendario" (es. admin@rotaract2050.org). Lascia vuoto per usare il calendario di default del distretto.',
		},
	],
};
