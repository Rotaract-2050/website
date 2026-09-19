import type { Collection } from 'tinacms';
import { pageRouter } from '../routers';
import { pageBlockTemplates } from '../blocks';

export const pagesCollection: Collection = {
	name: 'pages',
	label: 'Pagine',
	path: 'src/content/pages',
	format: 'md',
	ui: { router: pageRouter },
	fields: [
		{ type: 'string', name: 'title', label: 'Titolo (IT)', isTitle: true, required: true },
		{ type: 'string', name: 'titleEn', label: 'Titolo (EN)' },
		{ type: 'string', name: 'eyebrow', label: 'Eyebrow (IT, banner pagina)' },
		{ type: 'string', name: 'eyebrowEn', label: 'Eyebrow (EN, banner pagina)' },
		{ type: 'string', name: 'breadcrumbCurrent', label: 'Titolo nel breadcrumb (IT)' },
		{ type: 'string', name: 'breadcrumbCurrentEn', label: 'Titolo nel breadcrumb (EN)' },
		{
			type: 'object',
			name: 'seo',
			label: 'SEO',
			fields: [
				{ type: 'string', name: 'title', label: 'Titolo alternativo (IT, SEO/social)', description: 'Se vuoto, usa il Titolo della pagina.' },
				{ type: 'string', name: 'titleEn', label: 'Titolo alternativo (EN, SEO/social)', description: 'Se vuoto, usa il Titolo della pagina.' },
				{ type: 'string', name: 'description', label: 'Descrizione (IT, meta/OG)', ui: { component: 'textarea' } },
				{ type: 'string', name: 'descriptionEn', label: 'Descrizione (EN, meta/OG)', ui: { component: 'textarea' } },
				{ type: 'image', name: 'ogImage', label: 'Immagine social (Open Graph)' },
				{
					type: 'boolean',
					name: 'noindex',
					label: 'Escludi dai motori di ricerca (noindex)',
					description: 'Solo per pagine di servizio da non indicizzare.',
				},
			],
		},
		{
			type: 'object',
			name: 'blocks',
			label: 'Blocchi',
			list: true,
			templates: pageBlockTemplates,
		},
	],
};
