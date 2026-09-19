export const clubDirectoryTemplate = {
	name: 'ClubDirectory',
	label: 'Elenco club (per zona)',
	fields: [
		{ type: 'string' as const, name: 'intro', label: 'Introduzione (IT)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'introEn', label: 'Introduzione (EN)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'disclaimer', label: 'Disclaimer (IT)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'disclaimerEn', label: 'Disclaimer (EN)', ui: { component: 'textarea' } },
	],
};
