export type Lang = 'it' | 'en';

export interface UiStrings {
	nav: {
		home: string;
		distrettoMenu: string;
		distrettoSub: string;
		story: string;
		squadra: string;
		club: string;
		news: string;
		eventi: string;
		join: string;
		materials: string;
		menuOpen: string;
		menuClose: string;
	};
	breadcrumbHome: string;
	footer: {
		linksTitle: string;
		contactTitle: string;
		socialTitle: string;
		copyright: string;
		underRotary: string;
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
		ticketsButtonLabel: string;
		photoButtonLabel: string;
	};
}

export type SocialName = 'instagram' | 'linkedin';

export const SOCIAL_LINKS: { name: SocialName; label: string; href: string }[] = [
	{ name: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/rotaract2050/' },
	{ name: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/distretto-rotaract-club-2050' },
];

export const UTILITY_LINKS = [
	{ label: 'ROTARY DISTRETTO 2050', href: 'https://www.rotary2050.org/site/' },
	{ label: 'ROTARY INTERNATIONAL', href: 'https://www.rotary.org/' },
	{ label: 'MY ROTARY', href: 'https://my.rotary.org/it' },
	{ label: 'ROTARY BRAND CENTER', href: 'https://brandcenter.rotary.org/it-it/our-brand/brand-elements' },
];

const IT: UiStrings = {
	nav: {
		home: 'HOME',
		distrettoMenu: 'IL DISTRETTO',
		distrettoSub: 'Panoramica',
		story: 'LA STORIA',
		squadra: 'LA SQUADRA',
		club: 'I CLUB',
		news: 'NEWS',
		eventi: 'EVENTI',
		join: 'ENTRA IN ROTARACT',
		materials: 'MATERIALI DISTRETTUALI',
		menuOpen: 'Apri il menu di navigazione',
		menuClose: 'Chiudi il menu di navigazione',
	},
	breadcrumbHome: 'HOME',
	footer: {
		linksTitle: 'LINK UTILI',
		contactTitle: 'CONTATTI',
		socialTitle: 'SEGUICI',
		copyright: '© Rotaract Distretto 2050',
		underRotary: 'Sostenuto dal Rotary Distretto 2050',
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
		ticketsButtonLabel: 'Info e biglietti',
		photoButtonLabel: 'Guarda le foto',
	},
};

const EN: UiStrings = {
	nav: {
		home: 'HOME',
		distrettoMenu: 'THE DISTRICT',
		distrettoSub: 'Overview',
		story: 'OUR STORY',
		squadra: 'THE TEAM',
		club: 'CLUBS',
		news: 'NEWS',
		eventi: 'EVENTS',
		join: 'JOIN ROTARACT',
		materials: 'DISTRICT MATERIALS',
		menuOpen: 'Open navigation menu',
		menuClose: 'Close navigation menu',
	},
	breadcrumbHome: 'HOME',
	footer: {
		linksTitle: 'QUICK LINKS',
		contactTitle: 'CONTACT',
		socialTitle: 'FOLLOW US',
		copyright: '© Rotaract District 2050',
		underRotary: 'Sponsored by Rotary District 2050',
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
		ticketsButtonLabel: 'Info & tickets',
		photoButtonLabel: 'View the photos',
	},
};

export const uiStrings: Record<Lang, UiStrings> = { it: IT, en: EN };
