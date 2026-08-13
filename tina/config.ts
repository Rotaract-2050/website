import { defineConfig } from 'tinacms';
import { focalImageFields } from './fields/focalPointImage';

const pageRouter = ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) => {
	const [locale, ...rest] = document._sys.breadcrumbs;
	const slug = rest.join('/');
	const path = slug === 'home' ? '' : slug;
	return locale === 'it' ? `/${path}` : `/en/${path}`;
};

// news/events are single files (IT + EN fields together, like clubs/zones) — the router just
// jumps to the IT (default-locale) route, same as clubs/zones get no router override at all.
const newsRouter = ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) => {
	const slug = document._sys.breadcrumbs.join('/');
	return `/news/${slug}`;
};

// Events are single files (IT + EN fields together, like news) with a real detail page —
// the router jumps to it directly.
const eventsRouter = ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) => {
	const slug = document._sys.breadcrumbs.join('/');
	return `/eventi/${slug}`;
};

const heroTemplate = {
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
			ui: { itemProps: (item: { label?: string }) => ({ label: item.label }) },
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
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'kicker', label: 'Eyebrow' },
		{ type: 'string' as const, name: 'title', label: 'Titolo', required: true },
		{ type: 'string' as const, name: 'quote', label: 'Citazione', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'body', label: 'Testo', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'subhead', label: 'Sottotitolo secondario' },
		{ type: 'string' as const, name: 'body2', label: 'Testo secondario', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'ctaLabel', label: 'Testo pulsante' },
		{ type: 'string' as const, name: 'ctaHref', label: 'Link pulsante (slug pagina)' },
		...focalImageFields('image', 'Immagine'),
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
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Elementi',
			list: true,
			ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
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
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{ type: 'string' as const, name: 'intro', label: 'Testo introduttivo (opzionale)', ui: { component: 'textarea' } },
		{
			type: 'string' as const,
			name: 'accent',
			label: 'Colore accento sezione (per differenziare più griglie sulla stessa pagina)',
			options: [
				{ value: '#D41367', label: 'Cranberry (default)' },
				{ value: '#F7A81B', label: 'Rotary Gold' },
				{ value: '#0067C8', label: 'Azure' },
				{ value: '#00A2E0', label: 'Sky Blue' },
				{ value: '#657F99', label: 'Slate' },
			],
		},
		{
			type: 'string' as const,
			name: 'layout',
			label: 'Stile card',
			description:
				'Badge: cerchio col contorno, per valori/principi astratti. Percorso: cerchi pieni numerati collegati da una linea, per sequenze ordinate. Icona: pittogramma per voce, per elenchi di temi/cause distinti.',
			options: [
				{ value: 'badge', label: 'Badge (contorno)' },
				{ value: 'path', label: 'Percorso collegato' },
				{ value: 'icon', label: 'Icona personalizzata' },
			],
		},
		{
			type: 'object' as const,
			name: 'items',
			label: 'Valori',
			list: true,
			ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
			fields: [
				{ type: 'string' as const, name: 'letter', label: 'Lettera' },
				{
					type: 'string' as const,
					name: 'icon',
					label: 'Icona (solo per stile "Icona personalizzata")',
					options: [
						{ value: '', label: '— Nessuna —' },
						{ value: 'peace', label: 'Pace (cerchi uniti)' },
						{ value: 'health', label: 'Salute (croce)' },
						{ value: 'water', label: 'Acqua (goccia)' },
						{ value: 'family', label: 'Famiglia (cuore)' },
						{ value: 'education', label: 'Istruzione (libro)' },
						{ value: 'growth', label: 'Sviluppo (crescita)' },
						{ value: 'leaf', label: 'Ambiente (foglia)' },
					],
				},
				{ type: 'string' as const, name: 'title', label: 'Titolo' },
				{ type: 'string' as const, name: 'description', label: 'Descrizione', ui: { component: 'textarea' } },
			],
		},
	],
};

const roleGridTemplate = {
	name: 'RoleGrid',
	label: 'Griglia ruoli',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{ type: 'boolean' as const, name: 'showDisclaimer', label: 'Mostra disclaimer' },
		{ type: 'string' as const, name: 'disclaimerText', label: 'Testo disclaimer' },
		{
			type: 'boolean' as const,
			name: 'highlightFirst',
			label: 'Metti in evidenza il primo ruolo (card grande sopra gli altri)',
		},
		{
			type: 'object' as const,
			name: 'items',
			label: 'Ruoli',
			list: true,
			ui: { itemProps: (item: { role?: string }) => ({ label: item.role }) },
			fields: [
				{ type: 'string' as const, name: 'initials', label: 'Iniziali (fallback se manca la foto)' },
				...focalImageFields('photo', 'Foto', { zoom: true }),
				{ type: 'string' as const, name: 'name', label: 'Nome e cognome' },
				{ type: 'string' as const, name: 'role', label: 'Ruolo' },
				{ type: 'string' as const, name: 'email', label: 'Email (se disponibile)' },
				{
					type: 'string' as const,
					name: 'themeMotto',
					label: 'Motto dell’anno (solo per il ruolo in evidenza)',
				},
				{
					type: 'image' as const,
					name: 'themeLogo',
					label: 'Logo distrettuale dell’anno (solo per il ruolo in evidenza)',
				},
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
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{ type: 'boolean' as const, name: 'showDisclaimer', label: 'Mostra disclaimer' },
		{ type: 'string' as const, name: 'disclaimerText', label: 'Testo disclaimer' },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Commissioni / Deleghe',
			list: true,
			ui: { itemProps: (item: { name?: string }) => ({ label: item.name }) },
			fields: [
				{ type: 'string' as const, name: 'name', label: 'Nome commissione/delega' },
				{ type: 'string' as const, name: 'description', label: 'Descrizione (cosa fa questa commissione)', ui: { component: 'textarea' } },
				{ type: 'string' as const, name: 'leadLabel', label: 'Etichetta responsabile (es. "Presidente" o "Delegato")' },
				{ type: 'string' as const, name: 'membersLabel', label: 'Etichetta membri (es. "Membro")' },
				{
					type: 'object' as const,
					name: 'lead',
					label: 'Responsabile',
					fields: [
						...focalImageFields('photo', 'Foto', { zoom: true }),
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
						...focalImageFields('photo', 'Foto', { zoom: true }),
						{ type: 'string' as const, name: 'name', label: 'Nome e cognome' },
						{ type: 'string' as const, name: 'email', label: 'Email (se disponibile)' },
					],
				},
			],
		},
	],
};

// Events themselves are not Tina content: EventsCalendar.astro fetches them live from the
// district's public Google Calendar (src/lib/calendar.ts), whose ID is set below (calendarId).
// Only the events themselves are non-editorial — title and calendar source are.
const eventsCalendarTemplate = {
	name: 'EventsCalendar',
	label: 'Calendario eventi',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{
			type: 'string' as const,
			name: 'calendarId',
			label: 'ID Calendario Google (opzionale)',
			description:
				'Da Google Calendar → Impostazioni del calendario → "Integra calendario" → "ID calendario" (es. admin@rotaract2050.org). Lascia vuoto per usare il calendario di default del distretto.',
		},
	],
};

// Ticker items are not Tina content: NewsTicker.astro fetches them live from an RSS feed
// (default: Rotary International's rotary.org/rss.xml) via src/lib/rotaryNews.ts. Only the
// label and feed settings are editorial, so a socio can point it at a different feed without
// touching code.
const newsTickerTemplate = {
	name: 'NewsTicker',
	label: 'Barra notizie (RSS)',
	ui: { itemProps: (item: { label?: string }) => ({ label: item.label }) },
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
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{ type: 'number' as const, name: 'limit', label: 'Numero massimo di notizie mostrate' },
		{ type: 'boolean' as const, name: 'showDate', label: 'Mostra la data sulle card' },
		{ type: 'boolean' as const, name: 'showYear', label: 'Mostra l\'anno rotariano (AR) sulle card' },
	],
};

const ctaBannerTemplate = {
	name: 'CtaBanner',
	label: 'Banner CTA',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo', required: true },
		{ type: 'string' as const, name: 'body', label: 'Testo', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'buttonLabel', label: 'Testo pulsante' },
		{ type: 'string' as const, name: 'buttonHref', label: 'Link pulsante (slug pagina)' },
	],
};

// Files themselves are not Tina content: MaterialsGrid.astro fetches them live client-side
// from the Drive API v3 (files.list), including subfolders (folder browsing happens entirely
// in the client script). Only the section title, the root folder ID and the empty-state
// override are editorial — the API key lives once in `settings` (not per-block), since it's
// a site-wide credential, not page content.
const materialsGridTemplate = {
	name: 'MaterialsGrid',
	label: 'Materiali distrettuali (Google Drive)',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{
			type: 'string' as const,
			name: 'driveFolderId',
			label: 'ID cartella Google Drive (radice)',
			required: true,
			description:
				'ID della cartella condivisa dal distretto, dall\'URL Drive (https://drive.google.com/drive/folders/<ID>). La cartella e le sue sottocartelle devono essere condivise "chiunque abbia il link": la lettura avviene via API key, senza login Google.',
		},
		{
			type: 'string' as const,
			name: 'emptyMessage',
			label: 'Messaggio se una cartella è vuota (opzionale)',
			ui: { component: 'textarea' },
		},
	],
};

const pagePlaceholderTemplate = {
	name: 'PagePlaceholder',
	label: 'Pagina in preparazione',
	ui: { itemProps: (item: { message?: string }) => ({ label: item.message }) },
	fields: [{ type: 'string' as const, name: 'message', label: 'Messaggio', ui: { component: 'textarea' } }],
};

const rrdTimelineTemplate = {
	name: 'RrdTimeline',
	label: 'Timeline RRD (Rappresentanti Rotaract Distrettuali)',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione', required: true },
		{ type: 'boolean' as const, name: 'showDisclaimer', label: 'Mostra disclaimer' },
		{ type: 'string' as const, name: 'disclaimerText', label: 'Testo disclaimer' },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Annate (dalla più recente alla più antica)',
			list: true,
			ui: { itemProps: (item: { yearRange?: string; name?: string; surname?: string }) => ({ label: item.yearRange ? `${item.yearRange} — ${item.name ?? ''} ${item.surname ?? ''}` : undefined }) },
			fields: [
				{ type: 'string' as const, name: 'yearRange', label: 'Anno rotariano (es. 2026/2027)' },
				{ type: 'string' as const, name: 'name', label: 'Nome' },
				{ type: 'string' as const, name: 'surname', label: 'Cognome' },
				{ type: 'string' as const, name: 'motto', label: 'Motto Rotary International (tema dell’anno rotariano)' },
				{ type: 'string' as const, name: 'mottoDistretto', label: 'Motto del distretto (opzionale)' },
				{
					type: 'string' as const,
					name: 'eraLabel',
					label: 'Separatore era (opzionale)',
					description: 'Se compilato, mostra un separatore con questa etichetta sopra questa annata — usalo sull’annata in cui inizia un nuovo nome di distretto (es. "Rotaract Distretto 204").',
				},
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
		{ type: 'boolean' as const, name: 'showDate', label: 'Mostra la data sulle card' },
		{ type: 'boolean' as const, name: 'showYear', label: 'Mostra l\'anno rotariano (AR) sulle card' },
	],
};

export default defineConfig({
	branch: process.env.WORKERS_CI_BRANCH || process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main',
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
						fields: [
							{ type: 'string', name: 'title', label: 'Titolo alternativo (SEO/social)', description: 'Se vuoto, usa il Titolo della pagina.' },
							{ type: 'string', name: 'description', label: 'Descrizione (meta/OG)', ui: { component: 'textarea' } },
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
							materialsGridTemplate,
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
					...focalImageFields('photo', 'Foto club'),
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
			},
			{
				name: 'events',
				label: 'Eventi',
				path: 'src/content/events',
				format: 'md',
				ui: { router: eventsRouter },
				fields: [
					{ type: 'string', name: 'title', label: 'Titolo (IT)', isTitle: true, required: true },
					{ type: 'string', name: 'titleEn', label: 'Titolo (EN)' },
					{
						type: 'boolean',
						name: 'visible',
						label: 'Mostra evento',
						description: 'Disattiva per preparare un evento senza pubblicarlo ancora nell\'archivio eventi del sito.',
					},
					{ type: 'datetime', name: 'date', label: 'Data evento', required: true, ui: { dateFormat: 'DD MMMM YYYY' } },
					{
						type: 'datetime',
						name: 'calendarDate',
						label: 'Data su Google Calendar (se diversa)',
						description:
							'Usata per collegare questo evento alla voce corrispondente nel widget "Calendario eventi" in home, quando la data su Google Calendar non coincide con la Data evento sopra (o per forzare/disambiguare il collegamento). Lascia vuoto per usare direttamente la Data evento.',
					},
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
					{ type: 'string', name: 'excerpt', label: 'Descrizione (IT)', ui: { component: 'textarea' } },
					{ type: 'string', name: 'excerptEn', label: 'Descrizione (EN)', ui: { component: 'textarea' } },
					...focalImageFields('image', 'Immagine'),
					{ type: 'string', name: 'imageLabel', label: 'Didascalia segnaposto immagine (IT)', required: true },
					{ type: 'string', name: 'imageLabelEn', label: 'Didascalia segnaposto immagine (EN)' },
					{
						type: 'boolean',
						name: 'ticketsOpen',
						label: 'Biglietti in vendita',
						description:
							'Disattiva per preparare in anticipo il link e/o il widget biglietti senza pubblicarli finché la vendita non è aperta: pulsante "Info e biglietti" e widget vendita biglietti restano nascosti, senza dover cancellare quanto già compilato.',
					},
					{
						type: 'string',
						name: 'ticketsUrl',
						label: 'Link info e biglietti',
						description: 'Se compilato (e "Biglietti in vendita" è attivo), mostra un bottone "Info e biglietti" che apre questo link in una nuova scheda.',
					},
					{
						type: 'string',
						name: 'photoAlbumUrl',
						label: 'Link album foto (Google Drive/Photos)',
						description: 'Se compilato, mostra un bottone "Foto" che apre questo link in una nuova scheda.',
					},
					{
						type: 'string',
						name: 'ticketWidgetEmbed',
						label: 'Widget vendita biglietti (embed HTML)',
						ui: { component: 'textarea' },
						description:
							'Incolla qui l\'intero snippet HTML fornito dal servizio di biglietteria (es. Ticket Tailor, "Paste this into your website"), tag <script> compreso: verrà inserito così com\'è nella pagina evento (se "Biglietti in vendita" è attivo). Lascia vuoto per non mostrare nessun widget. Usare solo snippet copiati direttamente dal fornitore di biglietteria, mai testo incollato da altre fonti.',
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
					{ type: 'image', name: 'logo', label: 'Logo distretto (dati strutturati / social)' },
					{
						type: 'image',
						name: 'defaultOgImage',
						label: 'Immagine social predefinita (Open Graph)',
						description: "Usata quando una pagina non ha un'immagine propria. Formato orizzontale, circa 1200×630px.",
					},
					{
						type: 'string',
						name: 'twitterHandle',
						label: 'Account Twitter/X (opzionale)',
						description: 'Es. @rotaract2050. Lasciare vuoto se non esiste.',
					},
					{
						type: 'string',
						name: 'driveApiKey',
						label: 'API key Google Drive (materiali distrettuali)',
						description:
							'Da Google Cloud Console: API key con Drive API abilitata, ristretta per HTTP referrer al dominio del sito. Non è un segreto da nascondere — è pensata per finire nel codice client, per questo va ristretta per referrer, non protetta come una password. Usata dal blocco "Materiali distrettuali" per elencare i file della cartella Drive del distretto.',
					},
				],
			},
		],
	},
});
