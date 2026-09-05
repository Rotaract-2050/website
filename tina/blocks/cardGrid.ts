export const cardGridTemplate = {
	name: 'CardGrid',
	label: 'Griglia link',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Elementi',
			list: true,
			ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
			fields: [
				{ type: 'string' as const, name: 'title', label: 'Titolo (IT)' },
				{ type: 'string' as const, name: 'titleEn', label: 'Titolo (EN)' },
				{ type: 'string' as const, name: 'meta', label: 'Sottotitolo (IT)' },
				{ type: 'string' as const, name: 'metaEn', label: 'Sottotitolo (EN)' },
				{ type: 'string' as const, name: 'href', label: 'Link (slug pagina)' },
				{
					type: 'string' as const,
					name: 'color',
					label: 'Colore tag (badge zona)',
					options: [
						{ value: '#00ADBB', label: 'Turquoise' },
						{ value: '#901F93', label: 'Violet' },
						{ value: '#FF7600', label: 'Orange' },
						{ value: '#009739', label: 'Grass' },
					],
				},
			],
		},
	],
};
