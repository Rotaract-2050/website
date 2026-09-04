// 3 grandi card colorate ("Rotary / Rotaract / Interact"), ognuna col proprio colore ufficiale
// di brand e un bottone — non un CardGrid (quello è pensato per badge zona piccoli, `color` lì
// è la palette secondaria di tag, non i colori identitari primari di Rotary/Rotaract/Interact).
export const familyGridTemplate = {
	name: 'FamilyGrid',
	label: 'Griglia famiglia Rotary (Rotary/Rotaract/Interact)',
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
		{ type: 'string' as const, name: 'intro', label: 'Testo introduttivo (IT, opzionale)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'introEn', label: 'Testo introduttivo (EN, opzionale)', ui: { component: 'textarea' } },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Card',
			list: true,
			ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
			fields: [
				{ type: 'string' as const, name: 'title', label: 'Titolo (IT)' },
				{ type: 'string' as const, name: 'titleEn', label: 'Titolo (EN)' },
				{ type: 'string' as const, name: 'body', label: 'Testo (IT)', ui: { component: 'textarea' } },
				{ type: 'string' as const, name: 'bodyEn', label: 'Testo (EN)', ui: { component: 'textarea' } },
				{ type: 'string' as const, name: 'buttonLabel', label: 'Testo pulsante (IT)' },
				{ type: 'string' as const, name: 'buttonLabelEn', label: 'Testo pulsante (EN)' },
				{
					type: 'string' as const,
					name: 'buttonHref',
					label: 'Link pulsante',
					description: 'Slug interno (es. "interact") oppure URL completo per un link esterno (es. "https://www.rotary2050.org/site/").',
				},
				{
					type: 'string' as const,
					name: 'color',
					label: 'Colore (identità di brand ufficiale)',
					options: [
						{ value: '#17458F', label: 'Rotary Royal Blue' },
						{ value: '#D41367', label: 'Rotaract Cranberry' },
						{ value: '#00A2E0', label: 'Interact Sky Blue' },
					],
				},
			],
		},
	],
};
