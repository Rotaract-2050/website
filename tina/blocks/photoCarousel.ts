import { focalImageFields } from '../fields/focalPointImage';

export const photoCarouselTemplate = {
	name: 'PhotoCarousel',
	label: 'Carosello foto',
	fields: [
		{ type: 'boolean' as const, name: 'autoplay', label: 'Scorrimento automatico' },
		{
			type: 'object' as const,
			name: 'images',
			label: 'Foto',
			list: true,
			ui: { itemProps: (item: { label?: string }) => ({ label: item.label }) },
			fields: [
				...focalImageFields('image', 'Foto'),
				{ type: 'string' as const, name: 'label', label: 'Didascalia (IT, testo alternativo per accessibilità, non visibile)', required: true },
				{ type: 'string' as const, name: 'labelEn', label: 'Didascalia (EN, testo alternativo per accessibilità, non visibile)' },
			],
		},
	],
};
