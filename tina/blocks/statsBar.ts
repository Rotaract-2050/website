export const statsBarTemplate = {
	name: 'StatsBar',
	label: 'Statistiche',
	fields: [
		{
			type: 'object' as const,
			name: 'items',
			label: 'Statistiche',
			list: true,
			ui: { itemProps: (item: { label?: string }) => ({ label: item.label }) },
			fields: [
				{ type: 'string' as const, name: 'value', label: 'Valore' },
				{ type: 'string' as const, name: 'label', label: 'Etichetta (IT)' },
				{ type: 'string' as const, name: 'labelEn', label: 'Etichetta (EN)' },
			],
		},
	],
};
