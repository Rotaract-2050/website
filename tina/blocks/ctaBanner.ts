export const ctaBannerTemplate = {
	name: 'CtaBanner',
	label: 'Banner CTA',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo (EN)' },
		{ type: 'string' as const, name: 'body', label: 'Testo (IT)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'bodyEn', label: 'Testo (EN)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'buttonLabel', label: 'Testo pulsante (IT)' },
		{ type: 'string' as const, name: 'buttonLabelEn', label: 'Testo pulsante (EN)' },
		{ type: 'string' as const, name: 'buttonHref', label: 'Link pulsante (slug pagina)' },
		{
			type: 'string' as const,
			name: 'accent',
			label: 'Colore accento (opzionale, default Cranberry)',
			description: 'Per differenziare un banner puntuale — es. un rimando dalla home Rotaract alla sezione Interact.',
			options: [
				{ value: '#D41367', label: 'Cranberry (default)' },
				{ value: '#00A2E0', label: 'Sky Blue (Interact)' },
				{ value: '#F7A81B', label: 'Rotary Gold' },
				{ value: '#0067C8', label: 'Azure' },
			],
		},
	],
};
