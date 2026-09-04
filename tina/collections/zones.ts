import type { Collection } from 'tinacms';

export const zonesCollection: Collection = {
	name: 'zones',
	label: 'Zone',
	path: 'src/content/zones',
	format: 'md',
	fields: [
		{ type: 'string', name: 'name', label: 'Nome zona', isTitle: true, required: true },
		{ type: 'string', name: 'description', label: 'Descrizione zona (IT)', ui: { component: 'textarea' } },
		{ type: 'string', name: 'descriptionEn', label: 'Descrizione zona (EN)', ui: { component: 'textarea' } },
		{
			type: 'string',
			name: 'color',
			label: 'Colore zona (badge club/news)',
			// Palette "secondaria" ufficiale Rotary riservata a tag/categorizzazione — vedi
			// references/rotary-brand.md. Cranberry/Gold/Azure/Royal Blue restano fuori: sono i
			// colori primari di brand (CTA, link, sfondi scuri), non vanno riusati per i tag.
			options: [
				{ value: '#00ADBB', label: 'Turquoise' },
				{ value: '#901F93', label: 'Violet' },
				{ value: '#FF7600', label: 'Orange' },
				{ value: '#009739', label: 'Grass' },
			],
		},
	],
};
