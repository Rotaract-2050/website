import { defineConfig } from 'tinacms';

const pageRouter = ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) => {
	const [locale, ...rest] = document._sys.breadcrumbs;
	const slug = rest.join('/');
	const path = slug === 'home' ? '' : slug;
	return locale === 'it' ? `/${path}` : `/en/${path}`;
};

const heroTemplate = {
	name: 'Hero',
	label: 'Hero (Carosello)',
	fields: [
		{ type: 'string' as const, name: 'ctaHref', label: 'Link pulsante (slug pagina)' },
		{
			type: 'object' as const,
			name: 'slides',
			label: 'Slide',
			list: true,
			fields: [
				{ type: 'string' as const, name: 'eyebrow', label: 'Etichetta' },
				{ type: 'string' as const, name: 'title', label: 'Titolo' },
				{ type: 'string' as const, name: 'subtitle', label: 'Sottotitolo', ui: { component: 'textarea' } },
				{ type: 'string' as const, name: 'ctaLabel', label: 'Testo pulsante' },
			],
		},
	],
};

const statsBarTemplate = {
	name: 'StatsBar',
	label: 'Statistiche',
	fields: [
		{
			type: 'object' as const,
			name: 'items',
			label: 'Statistiche',
			list: true,
			fields: [
				{ type: 'string' as const, name: 'value', label: 'Valore' },
				{ type: 'string' as const, name: 'label', label: 'Etichetta' },
			],
		},
	],
};

const splitSectionTemplate = {
	name: 'SplitSection',
	label: 'Sezione divisa (testo + immagine)',
	fields: [
		{ type: 'string' as const, name: 'kicker', label: 'Eyebrow' },
		{ type: 'string' as const, name: 'title', label: 'Titolo', required: true },
		{ type: 'string' as const, name: 'quote', label: 'Citazione', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'body', label: 'Testo', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'subhead', label: 'Sottotitolo secondario' },
		{ type: 'string' as const, name: 'body2', label: 'Testo secondario', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'ctaLabel', label: 'Testo pulsante' },
		{ type: 'string' as const, name: 'ctaHref', label: 'Link pulsante (slug pagina)' },
		{ type: 'image' as const, name: 'image', label: 'Immagine' },
		{ type: 'string' as const, name: 'imageLabel', label: 'Didascalia segnaposto immagine', required: true },
		{
			type: 'string' as const,
			name: 'imageSide',
			label: 'Lato immagine',
			options: ['left', 'right'],
		},
	],
};

const cardGridTemplate = {
	name: 'CardGrid',
	label: 'Griglia link',
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Elementi',
			list: true,
			fields: [
				{ type: 'string' as const, name: 'title', label: 'Titolo' },
				{ type: 'string' as const, name: 'meta', label: 'Sottotitolo' },
				{ type: 'string' as const, name: 'href', label: 'Link (slug pagina)' },
			],
		},
	],
};

const valuesGridTemplate = {
	name: 'ValuesGrid',
	label: 'Griglia valori',
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Valori',
			list: true,
			fields: [
				{ type: 'string' as const, name: 'letter', label: 'Lettera' },
				{ type: 'string' as const, name: 'title', label: 'Titolo' },
				{ type: 'string' as const, name: 'description', label: 'Descrizione', ui: { component: 'textarea' } },
			],
		},
	],
};

const roleGridTemplate = {
	name: 'RoleGrid',
	label: 'Griglia ruoli',
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{ type: 'boolean' as const, name: 'showDisclaimer', label: 'Mostra disclaimer' },
		{ type: 'string' as const, name: 'disclaimerText', label: 'Testo disclaimer' },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Ruoli',
			list: true,
			fields: [
				{ type: 'string' as const, name: 'initials', label: 'Iniziali' },
				{ type: 'string' as const, name: 'name', label: 'Nome' },
				{ type: 'string' as const, name: 'role', label: 'Ruolo' },
			],
		},
	],
};

const eventsListTemplate = {
	name: 'EventsList',
	label: 'Elenco eventi',
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Eventi',
			list: true,
			fields: [
				{ type: 'string' as const, name: 'day', label: 'Giorno' },
				{ type: 'string' as const, name: 'month', label: 'Mese' },
				{ type: 'string' as const, name: 'title', label: 'Titolo evento' },
				{ type: 'string' as const, name: 'time', label: 'Orario' },
				{ type: 'string' as const, name: 'location', label: 'Luogo' },
			],
		},
	],
};

const newsGridTemplate = {
	name: 'NewsGrid',
	label: 'Griglia news',
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{
			type: 'object' as const,
			name: 'items',
			label: 'News',
			list: true,
			fields: [
				{ type: 'string' as const, name: 'tag', label: 'Tag' },
				{ type: 'string' as const, name: 'title', label: 'Titolo' },
				{ type: 'string' as const, name: 'excerpt', label: 'Estratto', ui: { component: 'textarea' } },
				{ type: 'string' as const, name: 'date', label: 'Data' },
				{ type: 'image' as const, name: 'image', label: 'Immagine' },
				{ type: 'string' as const, name: 'imageLabel', label: 'Didascalia segnaposto immagine', required: true },
			],
		},
	],
};

const ctaBannerTemplate = {
	name: 'CtaBanner',
	label: 'Banner CTA',
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo', required: true },
		{ type: 'string' as const, name: 'body', label: 'Testo', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'buttonLabel', label: 'Testo pulsante' },
		{ type: 'string' as const, name: 'buttonHref', label: 'Link pulsante (slug pagina)' },
	],
};

const pagePlaceholderTemplate = {
	name: 'PagePlaceholder',
	label: 'Pagina in preparazione',
	fields: [{ type: 'string' as const, name: 'message', label: 'Messaggio', ui: { component: 'textarea' } }],
};

const clubDirectoryTemplate = {
	name: 'ClubDirectory',
	label: 'Elenco club (per zona)',
	fields: [
		{ type: 'string' as const, name: 'intro', label: 'Introduzione', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'disclaimer', label: 'Disclaimer', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'contactLabel', label: 'Testo link contatto' },
	],
};

export default defineConfig({
	branch: process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main',
	clientId: process.env.TINA_CLIENT_ID || null,
	token: process.env.TINA_TOKEN || null,
	build: {
		outputFolder: 'admin',
		publicFolder: 'public',
	},
	media: {
		tina: {
			mediaRoot: 'uploads',
			publicFolder: 'public',
		},
	},
	schema: {
		collections: [
			{
				name: 'pages',
				label: 'Pagine',
				path: 'src/content/pages',
				format: 'md',
				ui: { router: pageRouter },
				fields: [
					{ type: 'string', name: 'title', label: 'Titolo', isTitle: true, required: true },
					{ type: 'string', name: 'eyebrow', label: 'Eyebrow (banner pagina)' },
					{ type: 'string', name: 'breadcrumbCurrent', label: 'Titolo nel breadcrumb' },
					{
						type: 'object',
						name: 'seo',
						label: 'SEO',
						fields: [{ type: 'string', name: 'description', label: 'Descrizione (meta/OG)', ui: { component: 'textarea' } }],
					},
					{
						type: 'object',
						name: 'blocks',
						label: 'Blocchi',
						list: true,
						templates: [
							heroTemplate,
							statsBarTemplate,
							splitSectionTemplate,
							cardGridTemplate,
							valuesGridTemplate,
							roleGridTemplate,
							eventsListTemplate,
							newsGridTemplate,
							ctaBannerTemplate,
							pagePlaceholderTemplate,
							clubDirectoryTemplate,
						],
					},
				],
			},
			{
				name: 'zones',
				label: 'Zone',
				path: 'src/content/zones',
				format: 'md',
				fields: [{ type: 'string', name: 'name', label: 'Nome zona', isTitle: true, required: true }],
			},
			{
				name: 'clubs',
				label: 'Club',
				path: 'src/content/clubs',
				format: 'md',
				fields: [
					{ type: 'string', name: 'name', label: 'Nome club', isTitle: true, required: true },
					{ type: 'reference', name: 'zone', label: 'Zona', collections: ['zones'], required: true },
					{ type: 'string', name: 'contactUrl', label: 'Link di contatto' },
				],
			},
			{
				name: 'settings',
				label: 'Impostazioni sito',
				path: 'src/content/settings',
				format: 'md',
				fields: [
					{ type: 'string', name: 'about', label: 'Testo "chi siamo" (footer)', ui: { component: 'textarea' } },
					{ type: 'string', name: 'address', label: 'Indirizzo' },
					{ type: 'string', name: 'email', label: 'Email' },
				],
			},
		],
	},
});
