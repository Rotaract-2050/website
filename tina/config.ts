import { defineConfig } from 'tinacms';
import { focalImageFields } from './fields/focalPointImage';

// Pages are a single file (IT + EN fields together, like clubs/zones/news/events/resources) —
// the router just jumps to the IT (default-locale) route, same as clubs/zones get no router
// override at all. "home" is the one page-specific special case: it maps to `/`, not `/home`.
const pageRouter = ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) => {
	const slug = document._sys.breadcrumbs.join('/');
	return slug === 'home' ? '/' : `/${slug}`;
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

// Resources (knowledge base articles, e.g. il Cerimoniale) are single files (IT + EN fields
// together, same reasoning as news/events) with a real detail page under /formazione/<slug>.
const resourcesRouter = ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) => {
	const slug = document._sys.breadcrumbs.join('/');
	return `/formazione/${slug}`;
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
				{ type: 'string' as const, name: 'label', label: 'Etichetta (IT)' },
				{ type: 'string' as const, name: 'labelEn', label: 'Etichetta (EN)' },
			],
		},
	],
};

const splitSectionTemplate = {
	name: 'SplitSection',
	label: 'Sezione divisa (testo + immagine)',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'kicker', label: 'Eyebrow (IT)' },
		{ type: 'string' as const, name: 'kickerEn', label: 'Eyebrow (EN)' },
		{ type: 'string' as const, name: 'title', label: 'Titolo (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo (EN)' },
		{ type: 'string' as const, name: 'quote', label: 'Citazione (IT)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'quoteEn', label: 'Citazione (EN)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'body', label: 'Testo (IT)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'bodyEn', label: 'Testo (EN)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'subhead', label: 'Sottotitolo secondario (IT)' },
		{ type: 'string' as const, name: 'subheadEn', label: 'Sottotitolo secondario (EN)' },
		{ type: 'string' as const, name: 'quote2', label: 'Citazione secondaria (IT)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'quote2En', label: 'Citazione secondaria (EN)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'body2', label: 'Testo secondario (IT)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'body2En', label: 'Testo secondario (EN)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'ctaLabel', label: 'Testo pulsante (IT)' },
		{ type: 'string' as const, name: 'ctaLabelEn', label: 'Testo pulsante (EN)' },
		{ type: 'string' as const, name: 'ctaHref', label: 'Link pulsante (slug pagina)' },
		...focalImageFields('image', 'Immagine'),
		{ type: 'string' as const, name: 'imageLabel', label: 'Didascalia segnaposto immagine (IT)', required: true },
		{ type: 'string' as const, name: 'imageLabelEn', label: 'Didascalia segnaposto immagine (EN)' },
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
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Elementi',
			list: true,
			ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
			fields: [
				{ type: 'string' as const, name: 'title', label: 'Titolo (IT)' },
				{ type: 'string' as const, name: 'titleEn', label: 'Titolo (EN)' },
				{ type: 'string' as const, name: 'meta', label: 'Sottotitolo (IT)' },
				{ type: 'string' as const, name: 'metaEn', label: 'Sottotitolo (EN)' },
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
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
		{ type: 'string' as const, name: 'intro', label: 'Testo introduttivo (IT, opzionale)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'introEn', label: 'Testo introduttivo (EN, opzionale)', ui: { component: 'textarea' } },
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
				{ value: 'statement', label: 'Dichiarazione Storica (scuro)' },
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
				{ type: 'string' as const, name: 'title', label: 'Titolo (IT)' },
				{ type: 'string' as const, name: 'titleEn', label: 'Titolo (EN)' },
				{ type: 'string' as const, name: 'description', label: 'Descrizione (IT)', ui: { component: 'textarea' } },
				{ type: 'string' as const, name: 'descriptionEn', label: 'Descrizione (EN)', ui: { component: 'textarea' } },
			],
		},
	],
};

const roleGridTemplate = {
	name: 'RoleGrid',
	label: 'Griglia ruoli',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
		{ type: 'boolean' as const, name: 'showDisclaimer', label: 'Mostra disclaimer' },
		{ type: 'string' as const, name: 'disclaimerText', label: 'Testo disclaimer (IT)' },
		{ type: 'string' as const, name: 'disclaimerTextEn', label: 'Testo disclaimer (EN)' },
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
				{
					type: 'string' as const,
					name: 'shape',
					label: 'Forma Avatar (Material You)',
					description: 'Scegli la forma per bilanciare visivamente il layout',
					options: [
						{ value: 'auto', label: 'Alternato (Automatico)' },
						{ value: 'petal', label: 'Petalo (1 angolo appuntito)' },
						{ value: 'cross', label: 'Incrociato (2 angoli appuntiti)' },
						{ value: 'arch', label: 'Arco (Tombstone)' },
						{ value: 'blob', label: 'Blob Organico' },
						{ value: 'squircle', label: 'Squircle Classico' },
					],
				},
				{ type: 'string' as const, name: 'initials', label: 'Iniziali (fallback se manca la foto)' },
				...focalImageFields('photo', 'Foto', { zoom: true }),
				{ type: 'string' as const, name: 'name', label: 'Nome e cognome' },
				{ type: 'string' as const, name: 'role', label: 'Ruolo (IT)' },
				{ type: 'string' as const, name: 'roleEn', label: 'Ruolo (EN)' },
				{ type: 'string' as const, name: 'email', label: 'Email (se disponibile)' },
				{ type: 'reference' as const, name: 'club', label: 'Club', collections: ['clubs'] },
				{
					type: 'string' as const,
					name: 'clubCustom',
					label: 'Club (se non in elenco — es. club Rotary/Interact)',
					description: 'Usato solo se il club non è un Rotaract Club presente in "Club". Es. "RC Zerotrenta", "Interact Club Piacenza".',
				},
				{
					type: 'string' as const,
					name: 'themeMotto',
					label: 'Motto dell’anno (IT, solo per il ruolo in evidenza)',
				},
				{
					type: 'string' as const,
					name: 'themeMottoEn',
					label: 'Motto dell’anno (EN, solo per il ruolo in evidenza)',
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
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
		{ type: 'boolean' as const, name: 'showDisclaimer', label: 'Mostra disclaimer' },
		{ type: 'string' as const, name: 'disclaimerText', label: 'Testo disclaimer (IT)' },
		{ type: 'string' as const, name: 'disclaimerTextEn', label: 'Testo disclaimer (EN)' },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Commissioni / Deleghe',
			list: true,
			ui: { itemProps: (item: { name?: string }) => ({ label: item.name }) },
			fields: [
				{ type: 'string' as const, name: 'name', label: 'Nome commissione/delega (IT)' },
				{ type: 'string' as const, name: 'nameEn', label: 'Nome commissione/delega (EN)' },
				{ type: 'string' as const, name: 'description', label: 'Descrizione (IT, cosa fa questa commissione)', ui: { component: 'textarea' } },
				{ type: 'string' as const, name: 'descriptionEn', label: 'Descrizione (EN, cosa fa questa commissione)', ui: { component: 'textarea' } },
				{ type: 'string' as const, name: 'leadLabel', label: 'Etichetta responsabile (IT, es. "Presidente" o "Delegato")' },
				{ type: 'string' as const, name: 'leadLabelEn', label: 'Etichetta responsabile (EN, es. "President" o "Delegate")' },
				{ type: 'string' as const, name: 'membersLabel', label: 'Etichetta membri (IT, es. "Membro")' },
				{ type: 'string' as const, name: 'membersLabelEn', label: 'Etichetta membri (EN, es. "Member")' },
				{
					type: 'object' as const,
					name: 'lead',
					label: 'Responsabile',
					fields: [
						{
							type: 'string' as const,
							name: 'shape',
							label: 'Forma Avatar (Material You)',
							options: [
								{ value: 'auto', label: 'Alternato (Automatico)' },
								{ value: 'petal', label: 'Petalo (1 angolo appuntito)' },
								{ value: 'cross', label: 'Incrociato (2 angoli appuntiti)' },
								{ value: 'arch', label: 'Arco (Tombstone)' },
								{ value: 'blob', label: 'Blob Organico' },
								{ value: 'squircle', label: 'Squircle Classico' },
							],
						},
						...focalImageFields('photo', 'Foto', { zoom: true }),
						{ type: 'string' as const, name: 'name', label: 'Nome e cognome' },
						{ type: 'string' as const, name: 'email', label: 'Email (se disponibile)' },
						{ type: 'reference' as const, name: 'club', label: 'Club', collections: ['clubs'] },
						{
							type: 'string' as const,
							name: 'clubCustom',
							label: 'Club (se non in elenco — es. club Rotary/Interact)',
							description: 'Usato solo se il club non è un Rotaract Club presente in "Club". Es. "RC Zerotrenta", "Interact Club Piacenza".',
						},
					],
				},
				{
					type: 'object' as const,
					name: 'members',
					label: 'Membri',
					list: true,
					fields: [
						{
							type: 'string' as const,
							name: 'shape',
							label: 'Forma Avatar (Material You)',
							options: [
								{ value: 'auto', label: 'Alternato (Automatico)' },
								{ value: 'petal', label: 'Petalo (1 angolo appuntito)' },
								{ value: 'cross', label: 'Incrociato (2 angoli appuntiti)' },
								{ value: 'arch', label: 'Arco (Tombstone)' },
								{ value: 'blob', label: 'Blob Organico' },
								{ value: 'squircle', label: 'Squircle Classico' },
							],
						},
						...focalImageFields('photo', 'Foto', { zoom: true }),
						{ type: 'string' as const, name: 'name', label: 'Nome e cognome' },
						{ type: 'string' as const, name: 'email', label: 'Email (se disponibile)' },
						{ type: 'reference' as const, name: 'club', label: 'Club', collections: ['clubs'] },
						{
							type: 'string' as const,
							name: 'clubCustom',
							label: 'Club (se non in elenco — es. club Rotary/Interact)',
							description: 'Usato solo se il club non è un Rotaract Club presente in "Club". Es. "RC Zerotrenta", "Interact Club Piacenza".',
						},
					],
				},
			],
		},
	],
};

const photoCarouselTemplate = {
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

// Events themselves are not Tina content: EventsCalendar.astro fetches them live from the
// district's public Google Calendar (src/lib/calendar.ts), whose ID is set below (calendarId).
// Only the events themselves are non-editorial — title and calendar source are.
const eventsCalendarTemplate = {
	name: 'EventsCalendar',
	label: 'Calendario eventi',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
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
		{ type: 'string' as const, name: 'label', label: 'Etichetta (IT)', required: true },
		{ type: 'string' as const, name: 'labelEn', label: 'Etichetta (EN)' },
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
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
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
		{ type: 'string' as const, name: 'title', label: 'Titolo (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo (EN)' },
		{ type: 'string' as const, name: 'body', label: 'Testo (IT)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'bodyEn', label: 'Testo (EN)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'buttonLabel', label: 'Testo pulsante (IT)' },
		{ type: 'string' as const, name: 'buttonLabelEn', label: 'Testo pulsante (EN)' },
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
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
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
			label: 'Messaggio se una cartella è vuota (IT, opzionale)',
			ui: { component: 'textarea' },
		},
		{
			type: 'string' as const,
			name: 'emptyMessageEn',
			label: 'Messaggio se una cartella è vuota (EN, opzionale)',
			ui: { component: 'textarea' },
		},
	],
};

// Resources themselves are not authored inline: they live in the dedicated `resources`
// collection (like NewsArchive/`news`), so adding a knowledge-base article anywhere shows up
// on the /formazione archive automatically. The page's own title/eyebrow already serve as the
// archive's banner — the only editorial field here is an optional empty-state message override.
const resourceArchiveTemplate = {
	name: 'ResourceArchive',
	label: 'Archivio formazione/risorse (elenco)',
	fields: [
		{
			type: 'string' as const,
			name: 'emptyMessage',
			label: 'Messaggio se non ci sono risorse (IT, opzionale)',
			ui: { component: 'textarea' },
		},
		{
			type: 'string' as const,
			name: 'emptyMessageEn',
			label: 'Messaggio se non ci sono risorse (EN, opzionale)',
			ui: { component: 'textarea' },
		},
	],
};

const pagePlaceholderTemplate = {
	name: 'PagePlaceholder',
	label: 'Pagina in preparazione',
	ui: { itemProps: (item: { message?: string }) => ({ label: item.message }) },
	fields: [
		{ type: 'string' as const, name: 'message', label: 'Messaggio (IT)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'messageEn', label: 'Messaggio (EN)', ui: { component: 'textarea' } },
	],
};

// Long-form editorial text (titoli via ## nel rich-text, elenchi puntati, grassetto) per pagine
// di servizio come Privacy/Termini — un socio non tecnico può modificarlo dall'editor rich-text
// di Tina, senza toccare Markdown a mano come nel campo `body` testuale di SplitSection.
// Nomi campo `content`/`contentEn` (non `body`/`bodyEn`, non `title`/`titleEn`): Tina genera
// un'unica query GraphQL che spread-a i fragment di TUTTI i template blocco di `pages` nello
// stesso selection set, quindi un nome campo già usato altrove con tipo diverso (es. `body`
// stringa in SplitSection vs `body` JSON qui, o `title` opzionale qui vs `required: true`
// altrove) rompe la validazione GraphQL ("Fields conflict because they return conflicting
// types") — vedi tina/__generated__/frags.gql.
const legalTextTemplate = {
	name: 'LegalText',
	label: 'Testo legale (informativa)',
	fields: [
		{ type: 'rich-text' as const, name: 'content', label: 'Testo (IT)' },
		{ type: 'rich-text' as const, name: 'contentEn', label: 'Testo (EN)' },
	],
};

const rrdTimelineTemplate = {
	name: 'RrdTimeline',
	label: 'Timeline RRD (Rappresentanti Rotaract Distrettuali)',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
		{ type: 'boolean' as const, name: 'showDisclaimer', label: 'Mostra disclaimer' },
		{ type: 'string' as const, name: 'disclaimerText', label: 'Testo disclaimer (IT)' },
		{ type: 'string' as const, name: 'disclaimerTextEn', label: 'Testo disclaimer (EN)' },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Annate (dalla più recente alla più antica)',
			list: true,
			ui: {
				itemProps: (item: { yearRange?: string; name?: string; surname?: string }) => ({ label: item.yearRange ? `${item.yearRange} — ${item.name ?? ''} ${item.surname ?? ''}` : undefined }),
				addItemBehavior: 'prepend',
			},
			fields: [
				{ type: 'string' as const, name: 'yearRange', label: 'Anno rotariano (es. 2026/2027)' },
				{ type: 'string' as const, name: 'name', label: 'Nome' },
				{ type: 'string' as const, name: 'surname', label: 'Cognome' },
				{ type: 'string' as const, name: 'clubName', label: 'Club di provenienza' },
				{ type: 'string' as const, name: 'motto', label: 'Motto Rotary International (IT, tema dell’anno rotariano)' },
				{ type: 'string' as const, name: 'mottoEn', label: 'Motto Rotary International (EN, tema dell’anno rotariano)' },
				{ type: 'string' as const, name: 'mottoDistretto', label: 'Motto del distretto (IT, opzionale)' },
				{ type: 'string' as const, name: 'mottoDistrettoEn', label: 'Motto del distretto (EN, opzionale)' },
				{
					type: 'string' as const,
					name: 'eraLabel',
					label: 'Separatore era (IT, opzionale)',
					description: 'Se compilato, mostra un separatore con questa etichetta sopra questa annata — usalo sull’annata in cui inizia un nuovo nome di distretto (es. "Rotaract Distretto 204").',
				},
				{
					type: 'string' as const,
					name: 'eraLabelEn',
					label: 'Separatore era (EN, opzionale)',
				},
			],
		},
	],
};

const clubDirectoryTemplate = {
	name: 'ClubDirectory',
	label: 'Elenco club (per zona)',
	fields: [
		{ type: 'string' as const, name: 'intro', label: 'Introduzione (IT)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'introEn', label: 'Introduzione (EN)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'disclaimer', label: 'Disclaimer (IT)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'disclaimerEn', label: 'Disclaimer (EN)', ui: { component: 'textarea' } },
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
			label: 'Messaggio se non ci sono eventi (IT, opzionale)',
			ui: { component: 'textarea' },
		},
		{
			type: 'string' as const,
			name: 'emptyMessageEn',
			label: 'Messaggio se non ci sono eventi (EN, opzionale)',
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
			label: 'Messaggio se non ci sono news (IT, opzionale)',
			ui: { component: 'textarea' },
		},
		{
			type: 'string' as const,
			name: 'emptyMessageEn',
			label: 'Messaggio se non ci sono news (EN, opzionale)',
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
	// Tina Cloud's hosted search index (tina.io/docs/reference/search/overview) — powers the
	// admin's own content search/reference pickers as collections like `resources` grow past a
	// glance-able size. `indexerToken` is only used by the CLI to *push* the index on dev/build;
	// it's optional in Tina's own types, so this is a safe no-op locally until TINA_SEARCH_TOKEN
	// is set in .env (get it from the Tina Cloud dashboard → project → Search). Not the same thing
	// as the public /formazione search box, which is a small client-side filter (see
	// ResourceArchive.astro) — Tina's hosted search is scoped to the CMS admin, not the public site.
	search: {
		tina: {
			indexerToken: process.env.TINA_SEARCH_TOKEN || undefined,
			stopwordLanguages: ['eng', 'ita'],
		},
		indexBatchSize: 100,
		maxSearchIndexFieldLength: 400,
	},
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
						templates: [
							heroTemplate,
							photoCarouselTemplate,
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
							legalTextTemplate,
							clubDirectoryTemplate,
							rrdTimelineTemplate,
							eventsArchiveTemplate,
							newsArchiveTemplate,
							materialsGridTemplate,
							resourceArchiveTemplate,
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
				name: 'resources',
				label: 'Formazione e risorse',
				path: 'src/content/resources',
				format: 'md',
				ui: { router: resourcesRouter },
				fields: [
					{ type: 'string', name: 'title', label: 'Titolo (IT)', isTitle: true, required: true },
					{ type: 'string', name: 'titleEn', label: 'Titolo (EN)' },
					{
						type: 'string',
						name: 'tags',
						label: 'Tag',
						list: true,
						required: true,
						options: [
							'Storia & Valori',
							'Struttura & Governance',
							'Dimensione Internazionale',
							'Service & Fondazione',
							'Protocollo & Cerimoniale',
							'Leadership & Giovani',
							'Gestione & Strumenti',
							'Presidente',
							'Segretario',
							'Tesoriere',
							'Prefetto',
						],
						description:
							'Diventano filtri cliccabili nell\'elenco — una scheda può avere più tag. Per un nuovo filtro aggiungere una nuova opzione qui (e la relativa traduzione in TAG_LABELS_EN, src/lib/resources.ts); il resto della granularità (es. "tavolo", "saluti") si copre con la ricerca testuale, non con altri tag.',
					},
					{
						type: 'number',
						name: 'order',
						label: 'Ordine (opzionale)',
						description: 'Le schede sono ordinate dal numero più basso al più alto; a parità di numero (o se vuoto) in ordine alfabetico per titolo.',
					},
					{ type: 'string', name: 'excerpt', label: 'Estratto (IT)', ui: { component: 'textarea' }, required: true },
					{ type: 'string', name: 'excerptEn', label: 'Estratto (EN)', ui: { component: 'textarea' } },
					{
						type: 'string',
						name: 'body',
						label: 'Contenuto scheda (IT)',
						isBody: true,
						ui: { component: 'textarea' },
						description:
							'Markdown puro — non l\'editor visuale usato altrove sul sito: # Titolo, ## Sottotitolo, - elenco puntato, 1. elenco numerato, **grassetto**, > citazione. Per collegare un\'altra scheda di questa sezione, scrivi [[slug-scheda]] (usa il titolo della scheda collegata come testo del link) oppure [[slug-scheda|Testo del link]] per un testo personalizzato — lo slug è il nome del file della scheda collegata (es. "ruolo-del-prefetto"). Per inserire un\'immagine nel testo: caricala prima dal pannello "Media" dell\'admin Tina (menu a sinistra), poi scrivi ![descrizione immagine](percorso copiato dal pannello Media) nel punto del testo dove deve comparire. Per una tabella: | Colonna 1 | Colonna 2 |, poi una riga | --- | --- |, poi una riga per dato — utile per elenchi con più colonne (es. ordine di precedenza + carica).',
					},
					{
						type: 'string',
						name: 'bodyEn',
						label: 'Contenuto scheda (EN)',
						ui: { component: 'textarea' },
						description:
							'Same convention as the Italian body — plain Markdown, [[slug]] / [[slug|Custom label]] wikilinks, ![description](path) for an inline image (upload it first from the Tina admin\'s "Media" panel to get its path), and | Column 1 | Column 2 | tables (a | --- | --- | separator row, then one row per data line).',
					},
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
						type: 'object',
						name: 'schedule',
						label: 'Programma',
						list: true,
						description: 'Scaletta oraria dell\'evento (facoltativa): una voce per riga, mostrata nell\'ordine di inserimento.',
						fields: [
							{ type: 'string', name: 'time', label: 'Orario', description: 'Es. 10:00 oppure 10:00 – 10:30' },
							{ type: 'string', name: 'title', label: 'Voce (IT)', required: true },
							{ type: 'string', name: 'titleEn', label: 'Voce (EN)' },
							{ type: 'string', name: 'speaker', label: 'Relatore/ruolo (IT)' },
							{ type: 'string', name: 'speakerEn', label: 'Relatore/ruolo (EN)' },
						],
						ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
					},
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
					{ type: 'string', name: 'about', label: 'Testo "chi siamo" (IT, footer)', ui: { component: 'textarea' } },
					{ type: 'string', name: 'aboutEn', label: 'Testo "chi siamo" (EN, footer)', ui: { component: 'textarea' } },
					{ type: 'string', name: 'address', label: 'Indirizzo (IT)' },
					{ type: 'string', name: 'addressEn', label: 'Indirizzo (EN)' },
					{ type: 'string', name: 'fiscalCode', label: 'Codice Fiscale' },
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
					{
						type: 'string',
						name: 'gaMeasurementId',
						label: 'Google Analytics 4 — Measurement ID',
						description:
							'Es. G-XXXXXXXXXX, da Google Analytics (Amministrazione → Flussi di dati). Se vuoto, Google Analytics resta disattivato. Quando impostato, lo script parte solo dopo consenso esplicito dal banner cookie (vedi pagina "Privacy e Cookie").',
					},
					{
						type: 'string',
						name: 'gscVerification',
						label: 'Google Search Console — codice verifica',
						description:
							'Solo il valore "content" del meta tag HTML di verifica proprietà (Search Console → Impostazioni → Verifica proprietà → tag HTML), non il tag intero. Es. "abc123...". Serve solo la prima volta per confermare la proprietà del sito su Search Console.',
					},
					{
						type: 'object',
						name: 'chatAssistant',
						label: 'Assistente AI (Formazione)',
						description:
							'Personalizzazione del mini-chat AI nella sezione Formazione. File unico per entrambe le lingue (come il resto di `settings` dal 2026-08-16) — ogni campo testuale ha un gemello "(EN)".',
						fields: [
							{
								type: 'string',
								name: 'title',
								label: 'Titolo finestra chat (IT)',
								description: 'Se vuoto, resta il titolo predefinito ("Assistente Formazione" / "Formazione assistant").',
							},
							{
								type: 'string',
								name: 'titleEn',
								label: 'Titolo finestra chat (EN)',
								description: 'Se vuoto, resta il titolo predefinito ("Assistente Formazione" / "Formazione assistant").',
							},
							{
								type: 'string',
								name: 'greeting',
								label: 'Messaggio iniziale (IT)',
								ui: { component: 'textarea' },
								description: 'Primo messaggio mostrato in chat prima di qualunque domanda. Se vuoto, resta il messaggio predefinito.',
							},
							{
								type: 'string',
								name: 'greetingEn',
								label: 'Messaggio iniziale (EN)',
								ui: { component: 'textarea' },
								description: 'Primo messaggio mostrato in chat prima di qualunque domanda. Se vuoto, resta il messaggio predefinito.',
							},
							{
								type: 'string',
								name: 'callout',
								label: 'Testo del fumetto (IT)',
								ui: { component: 'textarea' },
								description: 'Messaggio mostrato nel fumetto a comparsa vicino al bottone. Se vuoto, usa il testo predefinito.',
							},
							{
								type: 'string',
								name: 'calloutEn',
								label: 'Testo del fumetto (EN)',
								ui: { component: 'textarea' },
								description: 'Messaggio mostrato nel fumetto a comparsa vicino al bottone per la versione in inglese.',
							},
							{
								type: 'string',
								name: 'extraInstructions',
								label: "Istruzioni aggiuntive per l'AI (IT, tono, focus...)",
								ui: { component: 'textarea' },
								description:
									'Aggiunte alle istruzioni di base dell\'assistente (che restano fisse per sicurezza: rispondere solo con le schede pubblicate, mai inventare, ammettere quando non sa). Usare questo campo solo per tono di voce o enfasi extra, es. "Rispondi in modo informale e amichevole" — non per cambiare le regole di sicurezza sopra.',
							},
							{
								type: 'string',
								name: 'extraInstructionsEn',
								label: "Istruzioni aggiuntive per l'AI (EN, tono, focus...)",
								ui: { component: 'textarea' },
								description:
									'Same as the Italian field, additive tone/emphasis guidance only — e.g. "Answer informally and warmly", not a change to the fixed safety rules above.',
							},
							{
								type: 'boolean',
								name: 'autoOpen',
								label: "Apri automaticamente all'arrivo sulla pagina",
								description: 'Se attivo, la finestra chat si apre da sola alla prima visita di ogni sessione (non si riapre da sola se il visitatore la chiude).',
							},
							{
								type: 'string',
								name: 'suggestions',
								label: 'Domande Suggerite (IT)',
								list: true,
								description: 'Pillole cliccabili mostrate sopra la barra di testo per suggerire domande rapide. Se vuoto, non compaiono suggerimenti.',
							},
							{
								type: 'string',
								name: 'suggestionsEn',
								label: 'Domande Suggerite (EN)',
								list: true,
								description: 'Pillole cliccabili per la versione in inglese.',
							},
						],
					},
				],
			},
		],
	},
});
