import type { Collection } from 'tinacms';
import { focalImageFields } from '../fields/focalPointImage';
import { servicesRouter } from '../routers';

export const servicesCollection: Collection = {
	name: 'services',
	label: 'Service',
	path: 'src/content/services',
	format: 'md',
	ui: { router: servicesRouter },
	fields: [
		{ type: 'string', name: 'title', label: 'Titolo (IT)', isTitle: true, required: true },
		{ type: 'string', name: 'titleEn', label: 'Titolo (EN)' },
		{
			type: 'string',
			name: 'scope',
			label: 'Ambito',
			list: true,
			options: ['Distretto', 'MDIO', 'Service Distrettuale', 'Service Interdistrettuale', 'Service Nazionale', 'Club'],
		},
		{
			type: 'object',
			name: 'clubs',
			label: 'Club taggati',
			list: true,
			fields: [{ type: 'reference', name: 'club', label: 'Club', collections: ['clubs'], required: true }],
		},
		{ type: 'string', name: 'excerpt', label: 'Estratto (IT)', ui: { component: 'textarea' }, required: true },
		{ type: 'string', name: 'excerptEn', label: 'Estratto (EN)', ui: { component: 'textarea' } },
		{ type: 'datetime', name: 'date', label: 'Data', required: true, ui: { dateFormat: 'DD MMMM YYYY' } },
		{
			type: 'string',
			name: 'displayDate',
			label: 'Data mostrata sulla card (opzionale)',
			description:
				'Se compilata, sostituisce la Data SOLO nel testo mostrato sulla card (es. "Estate 2026").',
		},
		...focalImageFields('image', 'Immagine'),
		{ type: 'string', name: 'imageLabel', label: 'Didascalia segnaposto immagine (IT)', required: true },
		{ type: 'string', name: 'imageLabelEn', label: 'Didascalia segnaposto immagine (EN)' },
		{ type: 'rich-text', name: 'body', label: 'Corpo articolo (IT)', isBody: true },
		{ type: 'rich-text', name: 'bodyEn', label: 'Corpo articolo (EN)' },
	],
};
