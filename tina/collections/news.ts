import type { Collection } from 'tinacms';
import { focalImageFields } from '../fields/focalPointImage';
import { newsRouter } from '../routers';

export const newsCollection: Collection = {
	name: 'news',
	label: 'News dal distretto',
	path: 'src/content/news',
	format: 'md',
	ui: { router: newsRouter },
	fields: [
		{ type: 'string', name: 'title', label: 'Titolo (IT)', isTitle: true, required: true },
		{ type: 'string', name: 'titleEn', label: 'Titolo (EN)' },
		{
			type: 'string',
			name: 'scope',
			label: 'Ambito',
			list: true,
			options: ['Distretto', 'MDIO', 'Service Distrettuale', 'Service Interdistrettuale', 'Service Nazionale'],
		},
		// Tina's `reference` field doesn't support `list: true` directly (tina.io/docs/r/content-fields/#list-fields):
		// wrap each reference in a repeatable object, one club per row, as the documented workaround.
		{
			type: 'object',
			name: 'clubs',
			label: 'Club taggati',
			list: true,
			fields: [{ type: 'reference', name: 'club', label: 'Club', collections: ['clubs'], required: true }],
		},
		{ type: 'string', name: 'excerpt', label: 'Estratto (IT)', ui: { component: 'textarea' }, required: true },
		{ type: 'string', name: 'excerptEn', label: 'Estratto (EN)', ui: { component: 'textarea' } },
		{ type: 'datetime', name: 'date', label: 'Data pubblicazione', required: true, ui: { dateFormat: 'DD MMMM YYYY' } },
		{
			type: 'string',
			name: 'displayDate',
			label: 'Data mostrata sulla card (opzionale)',
			description:
				'Se compilata, sostituisce la Data pubblicazione SOLO nel testo mostrato sulla card (es. "Estate 2026"). L\'ordinamento delle news e l\'anno rotariano (AR) restano calcolati dalla Data pubblicazione qui sopra, non da questo campo.',
		},
		...focalImageFields('image', 'Immagine'),
		{ type: 'string', name: 'imageLabel', label: 'Didascalia segnaposto immagine (IT)', required: true },
		{ type: 'string', name: 'imageLabelEn', label: 'Didascalia segnaposto immagine (EN)' },
		{ type: 'rich-text', name: 'body', label: 'Corpo articolo (IT)', isBody: true },
		{ type: 'rich-text', name: 'bodyEn', label: 'Corpo articolo (EN)' },
	],
};
