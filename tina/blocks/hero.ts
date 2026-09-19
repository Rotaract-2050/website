import { focalImageFields } from '../fields/focalPointImage';

export const heroTemplate = {
	name: 'Hero',
	label: 'Hero (Carosello)',
	fields: [
		{ type: 'string' as const, name: 'ctaHref', label: 'Link pulsante (slug pagina)' },
		{ type: 'boolean' as const, name: 'autoplay', label: 'Scorrimento automatico slide' },
		{
			type: 'object' as const,
			name: 'slides',
			label: 'Slide',
			list: true,
			ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
			fields: [
				...focalImageFields('image', 'Foto di sfondo'),
				{ type: 'string' as const, name: 'eyebrow', label: 'Etichetta (IT)' },
				{ type: 'string' as const, name: 'eyebrowEn', label: 'Etichetta (EN)' },
				{ type: 'string' as const, name: 'title', label: 'Titolo (IT)' },
				{ type: 'string' as const, name: 'titleEn', label: 'Titolo (EN)' },
				{ type: 'string' as const, name: 'subtitle', label: 'Sottotitolo (IT)', ui: { component: 'textarea' } },
				{ type: 'string' as const, name: 'subtitleEn', label: 'Sottotitolo (EN)', ui: { component: 'textarea' } },
				{ type: 'string' as const, name: 'ctaLabel', label: 'Testo pulsante (IT)' },
				{ type: 'string' as const, name: 'ctaLabelEn', label: 'Testo pulsante (EN)' },
			],
		},
	],
};
