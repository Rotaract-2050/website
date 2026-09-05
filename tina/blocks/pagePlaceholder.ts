export const pagePlaceholderTemplate = {
	name: 'PagePlaceholder',
	label: 'Pagina in preparazione',
	ui: { itemProps: (item: { message?: string }) => ({ label: item.message }) },
	fields: [
		{ type: 'string' as const, name: 'message', label: 'Messaggio (IT)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'messageEn', label: 'Messaggio (EN)', ui: { component: 'textarea' } },
	],
};
