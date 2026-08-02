import { defineConfig } from 'tinacms';

const pageRouter = ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) => {
	const [locale, ...rest] = document._sys.breadcrumbs;
	const slug = rest.join('/');
	const path = slug === 'home' ? '' : slug;
	return locale === 'it' ? `/${path}` : `/en/${path}`;
};

const newsRouter = ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) => {
	const [locale, ...rest] = document._sys.breadcrumbs;
	const slug = rest.join('/');
	return locale === 'it' ? `/news/${slug}` : `/en/news/${slug}`;
};

// Past events have no dedicated detail page (single archive page, per district decision):
// the router jumps straight to the event's anchor on the archive list instead of a route.
const eventsRouter = ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) => {
	const [locale, ...rest] = document._sys.breadcrumbs;
	const slug = rest.join('/');
	return locale === 'it' ? `/eventi#${slug}` : `/en/eventi#${slug}`;
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
				{
					type: 'string' as const,
					name: 'color',
					label: 'Colore tag (badge zona)',
					options: [
						{ value: '#00ADBB', label: 'Turquoise' },
						{ value: '#901F93', label: 'Violet' },
						{ value: '#FF7600', label: 'Orange' },
						{ value: '#009739', label: 'Grass' },
					],
				},
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
				{ type: 'string' as const, name: 'initials', label: 'Iniziali (fallback se manca la foto)' },
				{ type: 'image' as const, name: 'photo', label: 'Foto' },
				{ type: 'string' as const, name: 'name', label: 'Nome e cognome' },
				{ type: 'string' as const, name: 'role', label: 'Ruolo' },
				{ type: 'string' as const, name: 'email', label: 'Email (se disponibile)' },
			],
		},
	],
};

// A commission/delegation grid: each item is either a committee (president + members) or a
// standalone delegation (president only, no members) — the "members row" simply doesn't render
// when the list is empty, so both shapes share one template instead of two.
const committeeGridTemplate = {
	name: 'CommitteeGrid',
	label: 'Griglia commissioni',
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{ type: 'boolean' as const, name: 'showDisclaimer', label: 'Mostra disclaimer' },
		{ type: 'string' as const, name: 'disclaimerText', label: 'Testo disclaimer' },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Commissioni / Deleghe',
			list: true,
			fields: [
				{ type: 'string' as const, name: 'name', label: 'Nome commissione/delega' },
				{ type: 'string' as const, name: 'leadLabel', label: 'Etichetta responsabile (es. "Presidente" o "Delegato")' },
				{ type: 'string' as const, name: 'membersLabel', label: 'Etichetta membri (es. "Membro")' },
				{
					type: 'object' as const,
					name: 'lead',
					label: 'Responsabile',
					fields: [
						{ type: 'image' as const, name: 'photo', label: 'Foto' },
						{ type: 'string' as const, name: 'name', label: 'Nome e cognome' },
						{ type: 'string' as const, name: 'email', label: 'Email (se disponibile)' },
					],
				},
				{
					type: 'object' as const,
					name: 'members',
					label: 'Membri',
					list: true,
					fields: [
						{ type: 'image' as const, name: 'photo', label: 'Foto' },
						{ type: 'string' as const, name: 'name', label: 'Nome e cognome' },
						{ type: 'string' as const, name: 'email', label: 'Email (se disponibile)' },
					],
				},
			],
		},
	],
};

// Events themselves are not Tina content: EventsCalendar.astro fetches them live from the
// district's public Google Calendar (src/lib/calendar.ts). Only the section title is editorial.
const eventsCalendarTemplate = {
	name: 'EventsCalendar',
	label: 'Calendario eventi',
	fields: [{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true }],
};

// Ticker items are not Tina content: NewsTicker.astro fetches them live from an RSS feed
// (default: Rotary International's rotary.org/rss.xml) via src/lib/rotaryNews.ts. Only the
// label and feed settings are editorial, so a socio can point it at a different feed without
// touching code.
const newsTickerTemplate = {
	name: 'NewsTicker',
	label: 'Barra notizie (RSS)',
	fields: [
		{ type: 'string' as const, name: 'label', label: 'Etichetta', required: true },
		{ type: 'string' as const, name: 'feedUrl', label: 'URL feed RSS' },
		{ type: 'number' as const, name: 'limit', label: 'Numero massimo di notizie' },
	],
};

// News items are not authored inline on the page: they live in the dedicated `news`
// collection (like clubs/zones) so that adding an article anywhere shows up here
// automatically. Only the section title and how many to show are editorial.
const newsGridTemplate = {
	name: 'NewsGrid',
	label: 'Griglia news',
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{ type: 'number' as const, name: 'limit', label: 'Numero massimo di notizie mostrate' },
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

const rrdTimelineTemplate = {
	name: 'RrdTimeline',
	label: 'Timeline RRD (Rappresentanti Rotaract Distrettuali)',
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{ type: 'boolean' as const, name: 'showDisclaimer', label: 'Mostra disclaimer' },
		{ type: 'string' as const, name: 'disclaimerText', label: 'Testo disclaimer' },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Annate (dalla più recente alla più antica)',
			list: true,
			fields: [
				{ type: 'string' as const, name: 'yearRange', label: 'Anno rotariano (es. 2026/2027)' },
				{ type: 'string' as const, name: 'name', label: 'Nome' },
				{ type: 'string' as const, name: 'surname', label: 'Cognome' },
				{ type: 'string' as const, name: 'motto', label: 'Motto dell’anno' },
			],
		},
	],
};

const clubDirectoryTemplate = {
	name: 'ClubDirectory',
	label: 'Elenco club (per zona)',
	fields: [
		{ type: 'string' as const, name: 'intro', label: 'Introduzione', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'disclaimer', label: 'Disclaimer', ui: { component: 'textarea' } },
	],
};

// Events themselves are not authored inline: they live in the dedicated `events` collection
// (like NewsGrid/`news`), so adding one anywhere shows up on the /eventi archive automatically.
// The page's own title/eyebrow (from the `pages` collection) already serve as the archive's
// banner — GraphQL requires an object type to define at least one field, so the only editorial
// field here is the (optional) empty-state message, overriding the default system copy.
const eventsArchiveTemplate = {
	name: 'EventsArchive',
	label: 'Archivio eventi (elenco)',
	fields: [
		{
			type: 'string' as const,
			name: 'emptyMessage',
			label: 'Messaggio se non ci sono eventi (opzionale)',
			ui: { component: 'textarea' },
		},
	],
};

// Same reasoning/shape as EventsArchive above: articles live in the dedicated `news` collection,
// the page's own title/eyebrow serve as the banner, and the one editorial field is an optional
// empty-state override (also required so the block's GraphQL object type isn't fieldless).
const newsArchiveTemplate = {
	name: 'NewsArchive',
	label: 'Archivio news (elenco)',
	fields: [
		{
			type: 'string' as const,
			name: 'emptyMessage',
			label: 'Messaggio se non ci sono news (opzionale)',
			ui: { component: 'textarea' },
		},
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
							committeeGridTemplate,
							eventsCalendarTemplate,
							newsTickerTemplate,
							newsGridTemplate,
							ctaBannerTemplate,
							pagePlaceholderTemplate,
							clubDirectoryTemplate,
							rrdTimelineTemplate,
							eventsArchiveTemplate,
							newsArchiveTemplate,
						],
					},
				],
			},
			{
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
			},
			{
				name: 'clubs',
				label: 'Club',
				path: 'src/content/clubs',
				format: 'md',
				fields: [
					{ type: 'string', name: 'name', label: 'Nome club', isTitle: true, required: true },
					{ type: 'reference', name: 'zone', label: 'Zona', collections: ['zones'], required: true },
					{ type: 'number', name: 'foundationYear', label: 'Anno di fondazione' },
					{
						type: 'number',
						name: 'lat',
						label: 'Latitudine (mappa club)',
						description: 'Coordinate approssimative del comune sede del club, da OpenStreetMap. Compilare insieme a Longitudine.',
					},
					{
						type: 'number',
						name: 'lng',
						label: 'Longitudine (mappa club)',
						description: 'Coordinate approssimative del comune sede del club, da OpenStreetMap. Compilare insieme a Latitudine.',
					},
					{ type: 'image', name: 'photo', label: 'Foto club' },
					{ type: 'string', name: 'email', label: 'Email' },
					{ type: 'string', name: 'website', label: 'Sito web' },
					{ type: 'string', name: 'instagram', label: 'Instagram' },
					{ type: 'string', name: 'facebook', label: 'Facebook' },
					{ type: 'string', name: 'story', label: 'Storia del club (IT)', ui: { component: 'textarea' } },
					{ type: 'string', name: 'storyEn', label: 'Storia del club (EN)', ui: { component: 'textarea' } },
				],
			},
			{
				name: 'news',
				label: 'News dal distretto',
				path: 'src/content/news',
				format: 'md',
				ui: { router: newsRouter },
				fields: [
					{ type: 'string', name: 'title', label: 'Titolo', isTitle: true, required: true },
					{
						type: 'string',
						name: 'scope',
						label: 'Ambito',
						list: true,
						options: ['Distretto', 'MDIO'],
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
					{ type: 'string', name: 'excerpt', label: 'Estratto', ui: { component: 'textarea' }, required: true },
					{ type: 'datetime', name: 'date', label: 'Data pubblicazione', required: true, ui: { dateFormat: 'DD MMMM YYYY' } },
					{ type: 'image', name: 'image', label: 'Immagine' },
					{ type: 'string', name: 'imageLabel', label: 'Didascalia segnaposto immagine', required: true },
					{ type: 'rich-text', name: 'body', label: 'Corpo articolo', isBody: true },
				],
			},
			{
				name: 'events',
				label: 'Archivio eventi',
				path: 'src/content/events',
				format: 'md',
				ui: { router: eventsRouter },
				fields: [
					{ type: 'string', name: 'title', label: 'Titolo', isTitle: true, required: true },
					{
						type: 'boolean',
						name: 'visible',
						label: 'Mostra evento',
						description: 'Disattiva per preparare un evento senza pubblicarlo ancora nell\'archivio eventi del sito.',
					},
					{ type: 'datetime', name: 'date', label: 'Data evento', required: true, ui: { dateFormat: 'DD MMMM YYYY' } },
					{
						type: 'string',
						name: 'eventType',
						label: 'Tipo evento',
						options: ['Distrettuale', 'Altro'],
						required: true,
					},
					{ type: 'string', name: 'locationLavori', label: 'Luogo (lavori)' },
					{
						type: 'string',
						name: 'locationCena',
						label: 'Luogo (cena)',
						description: 'Compila solo se l\'evento ha una seconda sede (es. cena di gala dopo i lavori).',
					},
					// Same reference-list workaround as `news.clubs` (Tina's `reference` field doesn't
					// support `list: true` directly, tina.io/docs/r/content-fields/#list-fields): one
					// club per row. For eventi Distrettuali rappresenta il/i Club Host; badge sulla
					// scheda evento, colorato in base alla zona del club.
					{
						type: 'object',
						name: 'clubs',
						label: 'Club Host',
						list: true,
						fields: [{ type: 'reference', name: 'club', label: 'Club', collections: ['clubs'], required: true }],
					},
					{ type: 'string', name: 'excerpt', label: 'Descrizione', ui: { component: 'textarea' } },
					{ type: 'image', name: 'image', label: 'Immagine' },
					{ type: 'string', name: 'imageLabel', label: 'Didascalia segnaposto immagine', required: true },
					{
						type: 'string',
						name: 'ticketsUrl',
						label: 'Link info e biglietti',
						description: 'Se compilato, mostra un bottone "Info e biglietti" che apre questo link in una nuova scheda.',
					},
					{
						type: 'string',
						name: 'photoAlbumUrl',
						label: 'Link album foto (Google Drive/Photos)',
						description: 'Se compilato, mostra un bottone "Foto" che apre questo link in una nuova scheda.',
					},
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
