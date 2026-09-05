export type Lang = 'it' | 'en';

export interface UiStrings {
	nav: {
		home: string;
		distrettoMenu: string;
		distrettoSub: string;
		story: string;
		rrd: string;
		squadra: string;
		club: string;
		news: string;
		eventi: string;
		join: string;
		materials: string;
		interactLink: string;
		formazione: string;
		menuOpen: string;
		menuClose: string;
	};
	breadcrumbHome: string;
	/** Nav/footer copy for the Interact sub-section's own header/footer (InteractHeader.astro,
	 * InteractFooter.astro) — kept separate from `nav`/`footer` above since it's a different,
	 * smaller set of pages with its own identity, not a variant of the Rotaract nav. */
	interact: {
		navHome: string;
		navStoria: string;
		navSquadra: string;
		navClub: string;
		navAlbo: string;
		navEventi: string;
		backToRotaract: string;
		footerTitle: string;
	};
	footer: {
		linksTitle: string;
		contactTitle: string;
		socialTitle: string;
		copyright: string;
		underRotary: string;
		fiscalCodeLabel: string;
		sourceCode: string;
		privacyLink: string;
		cookieSettingsLink: string;
	};
	cookieConsent: {
		body: string;
		accept: string;
		reject: string;
		policyLink: string;
	};
	calendar: {
		agendaTab: string;
		monthTab: string;
		viewToggleLabel: string;
		noEvents: string;
		unavailable: string;
		viewFullCalendar: string;
		subscribe: string;
		allDay: string;
		prevMonth: string;
		nextMonth: string;
		dayFilterPrefix: string;
		dayFilterEmpty: string;
		dayFilterReset: string;
		filterLabel: string;
		filterAll: string;
		filterRotaract: string;
		filterInteract: string;
		filterRotary: string;
		filterScadenze: string;
		titleRotaract: string;
		titleInteract: string;
		titleRotary: string;
		titleScadenze: string;
		weekdaysShort: string[];
		monthsShort: string[];
		monthsFull: string[];
	};
	newsTicker: {
		unavailable: string;
		pauseToggle: string;
		opensInNewTab: string;
	};
	news: {
		readMore: string;
		viewAll: string;
		empty: string;
		articleEyebrow: string;
		backToArchive: string;
	};
	resources: {
		readMore: string;
		empty: string;
		detailEyebrow: string;
		backToArchive: string;
		searchPlaceholder: string;
		filterAll: string;
		noResults: string;
	};
	clubDetail: {
		eyebrow: string;
		zoneLabel: string;
		foundationYearLabel: string;
		emailLabel: string;
		websiteLabel: string;
		instagramLabel: string;
		facebookLabel: string;
		storyTitle: string;
		backToList: string;
		photoAltPrefix: string;
		photoMissing: string;
		seoDescriptionPrefix: string;
	};
	clubMap: {
		title: string;
		disclaimer: string;
		viewClub: string;
		unavailable: string;
	};
	events: {
		empty: string;
		yearFilterLabel: string;
		upcomingBadge: string;
		locationLabel: string;
		worksLocationLabel: string;
		dinnerLocationLabel: string;
		hostClubLabel: string;
		ticketsButtonLabel: string;
		photoButtonLabel: string;
		detailEyebrow: string;
		backToArchive: string;
		scheduleTitle: string;
	};
	materials: {
		loading: string;
		unavailable: string;
		notConfigured: string;
		empty: string;
		breadcrumbLabel: string;
		rootLabel: string;
		openFolderLabel: string;
		foldersLabel: string;
		filesLabel: string;
		openInDriveLabel: string;
	};
	chat: {
		fabLabel: string;
		title: string;
		closeLabel: string;
		placeholder: string;
		sendLabel: string;
		disclaimer: string;
		greeting: string;
		errorGeneric: string;
		errorQuota: string;
		errorNotConfigured: string;
		errorEmptyCorpus: string;
		errorTurnstile: string;
		errorInvalidInput: string;
	};
}

export type SocialName = 'instagram' | 'linkedin' | 'github';

export const SOCIAL_LINKS: { name: SocialName; label: string; href: string }[] = [
	{ name: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/rotaract2050/' },
	{ name: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/distretto-rotaract-club-2050' },
];

export const SITE_NAME = 'Rotaract Distretto 2050';
/** Interact Distretto 2050 è un'entità distinta dal Rotaract sotto lo stesso ombrello Rotary
 * International, non una sotto-sezione a tema — mai riusare SITE_NAME per contenuto Interact
 * (title/JSON-LD/organizer evento). Unica fonte per questo nome: non ripetere la stringa altrove. */
export const INTERACT_SITE_NAME: Record<Lang, string> = {
	it: 'Interact Distretto 2050',
	en: 'Interact District 2050',
};
/** Fallback finale se pagina/articolo/evento e settings.defaultOgImage sono tutti vuoti. */
export const DEFAULT_OG_IMAGE = '/uploads/Loghi/Logo-distretto.png';

export const UTILITY_LINKS = [
	{ label: 'ROTARY INTERNATIONAL', href: 'https://www.rotary.org/' },
	{ label: 'MY ROTARY', href: 'https://my.rotary.org/it' },
	{ label: 'ROTARY BRAND CENTER', href: 'https://brandcenter.rotary.org/it-it/our-brand/brand-elements' },
	{ label: 'ROTARY DISTRETTO 2050', href: 'https://www.rotary2050.org/site/' },
	{ label: 'PROMETEO 2050', href: 'https://www.prometeo2050.org/' },
];

const IT: UiStrings = {
	nav: {
		home: 'HOME',
		distrettoMenu: 'IL DISTRETTO',
		distrettoSub: 'IL ROTARACT',
		story: 'LA STORIA',
		rrd: 'ALBO RRD',
		squadra: 'LA SQUADRA',
		club: 'I CLUB',
		news: 'NEWS',
		eventi: 'EVENTI',
		join: 'ENTRA NEL ROTARACT',
		materials: 'MATERIALI DISTRETTUALI',
		interactLink: "L'INTERACT",
		formazione: 'FORMAZIONE',
		menuOpen: 'Apri il menu di navigazione',
		menuClose: 'Chiudi il menu di navigazione',
	},
	breadcrumbHome: 'HOME',
	interact: {
		navHome: 'HOME',
		navStoria: 'LA STORIA',
		navSquadra: 'LA SQUADRA',
		navClub: 'I CLUB',
		navAlbo: 'ALBO IRD',
		navEventi: 'EVENTI',
		backToRotaract: '← Rotaract Distretto 2050',
		footerTitle: 'INTERACT DISTRETTO 2050',
	},
	footer: {
		linksTitle: 'LINK UTILI',
		contactTitle: 'CONTATTI',
		socialTitle: 'SEGUICI',
		copyright: '© Rotaract Distretto 2050',
		underRotary: 'Sostenuto dal Rotary Distretto 2050',
		fiscalCodeLabel: 'CF',
		sourceCode: 'Questo sito è open source',
		privacyLink: 'Privacy e Cookie',
		cookieSettingsLink: 'Preferenze cookie',
	},
	cookieConsent: {
		body: 'Usiamo cookie tecnici necessari al funzionamento del sito. Con il tuo consenso, usiamo anche Google Analytics per capire come viene usato il sito.',
		accept: 'Accetta',
		reject: 'Rifiuta',
		policyLink: 'Maggiori informazioni',
	},
	calendar: {
		agendaTab: 'Agenda',
		monthTab: 'Mese',
		viewToggleLabel: 'Vista calendario',
		noEvents: 'Nessun evento in programma al momento.',
		unavailable: 'Calendario momentaneamente non disponibile.',
		viewFullCalendar: 'Vedi il calendario completo →',
		subscribe: '+ Iscriviti al calendario',
		allDay: 'Tutto il giorno',
		prevMonth: 'Mese precedente',
		nextMonth: 'Mese successivo',
		dayFilterPrefix: 'Eventi del',
		dayFilterEmpty: 'Nessun evento in questo giorno.',
		dayFilterReset: '× Mostra i prossimi eventi',
		filterLabel: 'Filtra per tipo evento',
		filterAll: 'Tutti',
		filterRotaract: 'Rotaract',
		filterInteract: 'Interact',
		filterRotary: 'Rotary',
		filterScadenze: 'Scadenze',
		titleRotaract: 'Eventi Rotaract',
		titleInteract: 'Eventi Interact',
		titleRotary: 'Eventi Rotary',
		titleScadenze: 'Scadenze',
		weekdaysShort: ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM'],
		monthsShort: ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'],
		monthsFull: [
			'Gennaio',
			'Febbraio',
			'Marzo',
			'Aprile',
			'Maggio',
			'Giugno',
			'Luglio',
			'Agosto',
			'Settembre',
			'Ottobre',
			'Novembre',
			'Dicembre',
		],
	},
	newsTicker: {
		unavailable: 'Notizie momentaneamente non disponibili.',
		pauseToggle: 'Metti in pausa o riprendi lo scorrimento delle notizie',
		opensInNewTab: 'si apre in una nuova scheda',
	},
	news: {
		readMore: 'Leggi tutto →',
		viewAll: 'Tutte le news →',
		empty: 'Nessuna news pubblicata al momento.',
		articleEyebrow: 'DAL DISTRETTO',
		backToArchive: '← Tutte le news',
	},
	resources: {
		readMore: 'Leggi la scheda →',
		empty: 'Nessuna scheda pubblicata al momento.',
		detailEyebrow: 'FORMAZIONE E RISORSE',
		backToArchive: '← Tutte le schede',
		searchPlaceholder: 'Cerca tra le schede…',
		filterAll: 'Tutte',
		noResults: 'Nessuna scheda corrisponde alla ricerca o al filtro scelto.',
	},
	clubDetail: {
		eyebrow: 'I CLUB',
		zoneLabel: 'Zona',
		foundationYearLabel: 'Anno di fondazione',
		emailLabel: 'Email',
		websiteLabel: 'Sito web',
		instagramLabel: 'Instagram',
		facebookLabel: 'Facebook',
		storyTitle: 'La nostra storia',
		backToList: '← Tutti i club',
		photoAltPrefix: 'Foto di',
		photoMissing: 'Foto non disponibile',
		seoDescriptionPrefix: 'Scheda del club Rotaract Distretto 2050:',
	},
	clubMap: {
		title: 'I club sulla mappa',
		disclaimer: 'Posizioni indicative del comune sede di ciascun club, non l\'indirizzo esatto delle riunioni.',
		viewClub: 'Vedi scheda club →',
		unavailable: 'Mappa non disponibile al momento.',
	},
	events: {
		empty: 'Nessun evento pubblicato al momento.',
		yearFilterLabel: 'Filtra per anno rotariano',
		upcomingBadge: 'IN ARRIVO',
		locationLabel: 'Location',
		worksLocationLabel: 'Lavori',
		dinnerLocationLabel: 'Cena',
		hostClubLabel: 'Club ospitante:',
		ticketsButtonLabel: 'Partecipa',
		photoButtonLabel: 'Guarda le foto',
		detailEyebrow: 'EVENTI DEL DISTRETTO',
		backToArchive: '← Tutti gli eventi',
		scheduleTitle: 'Programma',
	},
	materials: {
		loading: 'Caricamento file…',
		unavailable: 'Materiali momentaneamente non disponibili.',
		notConfigured: 'Sezione non ancora configurata: cartella o chiave Drive mancanti.',
		empty: 'Questa cartella è vuota.',
		breadcrumbLabel: 'Percorso cartelle',
		rootLabel: 'Materiali',
		openFolderLabel: 'Apri cartella',
		foldersLabel: 'Cartelle',
		filesLabel: 'File',
		openInDriveLabel: 'Apri su Google Drive',
	},
	chat: {
		fabLabel: 'Apri l\'assistente Formazione',
		fabCallout: '👋 Ciao! Sono l\'AI del Distretto. Dubbi su storia, cerimoniale o ruoli? Chiedimi tutto quello che un Rotaractiano doc deve sapere! ✨',
		title: 'Assistente Formazione',
		closeLabel: 'Chiudi l\'assistente',
		placeholder: 'Scrivi una domanda…',
		sendLabel: 'Invia',
		disclaimer: 'Risposte generate da un\'intelligenza artificiale sulla base delle schede pubblicate: possono contenere imprecisioni.',
		greeting: 'Ciao! Chiedimi qualcosa sulle schede di Formazione: cerimoniale, ruoli del club, cultura rotariana.',
		errorGeneric: 'Qualcosa non ha funzionato. Riprova tra poco.',
		errorQuota: 'Abbiamo esaurito i token del piano gratuito. L\'assistente tornerà disponibile dopo il prossimo reset!',
		errorNotConfigured: 'Assistente non ancora configurato.',
		errorEmptyCorpus: 'Nessuna scheda pubblicata al momento: l\'assistente non ha ancora contenuti su cui rispondere.',
		errorTurnstile: 'Verifica anti-bot non riuscita. Ricarica la pagina e riprova.',
		errorInvalidInput: 'Domanda non valida: prova con un testo più breve.',
	},
};

const EN: UiStrings = {
	nav: {
		home: 'HOME',
		distrettoMenu: 'THE DISTRICT',
		distrettoSub: 'THE ROTARACT',
		story: 'OUR STORY',
		rrd: 'RRD ROLL',
		squadra: 'THE TEAM',
		club: 'CLUBS',
		news: 'NEWS',
		eventi: 'EVENTS',
		join: 'JOIN ROTARACT',
		materials: 'DISTRICT MATERIALS',
		interactLink: 'INTERACT',
		formazione: 'TRAINING',
		menuOpen: 'Open navigation menu',
		menuClose: 'Close navigation menu',
	},
	breadcrumbHome: 'HOME',
	interact: {
		navHome: 'HOME',
		navStoria: 'HISTORY',
		navSquadra: 'TEAM',
		navClub: 'CLUBS',
		navAlbo: 'IRD ROSTER',
		navEventi: 'EVENTS',
		backToRotaract: '← Rotaract District 2050',
		footerTitle: 'INTERACT DISTRICT 2050',
	},
	footer: {
		linksTitle: 'QUICK LINKS',
		contactTitle: 'CONTACT',
		socialTitle: 'FOLLOW US',
		copyright: '© Rotaract District 2050',
		underRotary: 'Sponsored by Rotary District 2050',
		fiscalCodeLabel: 'CF',
		sourceCode: 'This site is open source',
		privacyLink: 'Privacy & Cookies',
		cookieSettingsLink: 'Cookie preferences',
	},
	cookieConsent: {
		body: 'We use technical cookies required for the site to work. With your consent, we also use Google Analytics to understand how the site is used.',
		accept: 'Accept',
		reject: 'Reject',
		policyLink: 'Learn more',
	},
	calendar: {
		agendaTab: 'Agenda',
		monthTab: 'Month',
		viewToggleLabel: 'Calendar view',
		noEvents: 'No events scheduled at the moment.',
		unavailable: 'Calendar temporarily unavailable.',
		viewFullCalendar: 'View full calendar →',
		subscribe: '+ Subscribe to calendar',
		allDay: 'All day',
		prevMonth: 'Previous month',
		nextMonth: 'Next month',
		dayFilterPrefix: 'Events on',
		dayFilterEmpty: 'No events on this day.',
		dayFilterReset: '× Show upcoming events',
		filterLabel: 'Filter by event type',
		filterAll: 'All',
		filterRotaract: 'Rotaract',
		filterInteract: 'Interact',
		filterRotary: 'Rotary',
		filterScadenze: 'Deadlines',
		titleRotaract: 'Rotaract Events',
		titleInteract: 'Interact Events',
		titleRotary: 'Rotary Events',
		titleScadenze: 'Upcoming deadlines',
		weekdaysShort: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
		monthsShort: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
		monthsFull: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		],
	},
	newsTicker: {
		unavailable: 'News temporarily unavailable.',
		pauseToggle: 'Pause or resume the news scroll',
		opensInNewTab: 'opens in a new tab',
	},
	news: {
		readMore: 'Read more →',
		viewAll: 'All news →',
		empty: 'No news published at the moment.',
		articleEyebrow: 'FROM THE DISTRICT',
		backToArchive: '← All news',
	},
	resources: {
		readMore: 'Read the guide →',
		empty: 'No guide published yet.',
		detailEyebrow: 'TRAINING & RESOURCES',
		backToArchive: '← All guides',
		searchPlaceholder: 'Search the guides…',
		filterAll: 'All',
		noResults: 'No guide matches this search or filter.',
	},
	clubDetail: {
		eyebrow: 'CLUBS',
		zoneLabel: 'Zone',
		foundationYearLabel: 'Founded in',
		emailLabel: 'Email',
		websiteLabel: 'Website',
		instagramLabel: 'Instagram',
		facebookLabel: 'Facebook',
		storyTitle: 'Our story',
		backToList: '← All clubs',
		photoAltPrefix: 'Photo of',
		photoMissing: 'Photo not available',
		seoDescriptionPrefix: 'Rotaract District 2050 club page:',
	},
	clubMap: {
		title: 'Clubs on the map',
		disclaimer: 'Approximate location of each club\'s home town, not the exact meeting address.',
		viewClub: 'View club →',
		unavailable: 'Map unavailable at the moment.',
	},
	events: {
		empty: 'No events published yet.',
		yearFilterLabel: 'Filter by Rotary year',
		upcomingBadge: 'UPCOMING',
		locationLabel: 'Location',
		worksLocationLabel: 'Sessions',
		dinnerLocationLabel: 'Dinner',
		hostClubLabel: 'Host club:',
		ticketsButtonLabel: 'Register',
		photoButtonLabel: 'View the photos',
		detailEyebrow: 'DISTRICT EVENTS',
		backToArchive: '← All events',
		scheduleTitle: 'Schedule',
	},
	materials: {
		loading: 'Loading files…',
		unavailable: 'Materials temporarily unavailable.',
		notConfigured: 'This section isn\'t configured yet: missing Drive folder or key.',
		empty: 'This folder is empty.',
		breadcrumbLabel: 'Folder path',
		rootLabel: 'Materials',
		openFolderLabel: 'Open folder',
		foldersLabel: 'Folders',
		filesLabel: 'Files',
		openInDriveLabel: 'Open in Google Drive',
	},
	chat: {
		fabLabel: 'Open the Formazione assistant',
		fabCallout: '👋 Hi! I\'m the District AI. Doubts about history, protocol, or roles? Ask me anything a true Rotaractor should know! ✨',
		title: 'Formazione assistant',
		closeLabel: 'Close the assistant',
		placeholder: 'Ask a question…',
		sendLabel: 'Send',
		disclaimer: 'AI-generated answers based on the published guides — they may contain inaccuracies.',
		greeting: 'Hi! Ask me anything about the Formazione guides: protocol, club roles, Rotary culture.',
		errorGeneric: 'Something went wrong. Please try again shortly.',
		errorQuota: 'We have run out of free plan tokens. The assistant will be available again after the next reset!',
		errorNotConfigured: 'Assistant not configured yet.',
		errorEmptyCorpus: 'No guides published yet: the assistant has no content to answer from.',
		errorTurnstile: 'Bot check failed. Reload the page and try again.',
		errorInvalidInput: 'Invalid question: try a shorter message.',
	},
};

export const uiStrings: Record<Lang, UiStrings> = { it: IT, en: EN };
