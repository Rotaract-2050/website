export const rrdTimelineTemplate = {
	name: 'RrdTimeline',
	label: 'Timeline RRD (Rappresentanti Rotaract Distrettuali)',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
		{ type: 'boolean' as const, name: 'showDisclaimer', label: 'Mostra disclaimer' },
		{ type: 'string' as const, name: 'disclaimerText', label: 'Testo disclaimer (IT)' },
		{ type: 'string' as const, name: 'disclaimerTextEn', label: 'Testo disclaimer (EN)' },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Annate (dalla più recente alla più antica)',
			list: true,
			ui: {
				itemProps: (item: { yearRange?: string; name?: string; surname?: string }) => ({ label: item.yearRange ? `${item.yearRange} — ${item.name ?? ''} ${item.surname ?? ''}` : undefined }),
				addItemBehavior: 'prepend',
			},
			fields: [
				{ type: 'string' as const, name: 'yearRange', label: 'Anno rotariano (es. 2026/2027)' },
				{ type: 'string' as const, name: 'name', label: 'Nome' },
				{ type: 'string' as const, name: 'surname', label: 'Cognome' },
				{ type: 'string' as const, name: 'clubName', label: 'Club di provenienza' },
				{ type: 'string' as const, name: 'motto', label: 'Motto Rotary International (IT, tema dell’anno rotariano)' },
				{ type: 'string' as const, name: 'mottoEn', label: 'Motto Rotary International (EN, tema dell’anno rotariano)' },
				{ type: 'string' as const, name: 'mottoDistretto', label: 'Motto del distretto (IT, opzionale)' },
				{ type: 'string' as const, name: 'mottoDistrettoEn', label: 'Motto del distretto (EN, opzionale)' },
				{
					type: 'string' as const,
					name: 'eraLabel',
					label: 'Separatore era (IT, opzionale)',
					description: 'Se compilato, mostra un separatore con questa etichetta sopra questa annata — usalo sull’annata in cui inizia un nuovo nome di distretto (es. "Rotaract Distretto 204").',
				},
				{
					type: 'string' as const,
					name: 'eraLabelEn',
					label: 'Separatore era (EN, opzionale)',
				},
			],
		},
	],
};
