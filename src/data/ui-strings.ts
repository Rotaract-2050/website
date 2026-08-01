export type Lang = 'it' | 'en';

export interface UiStrings {
	nav: {
		home: string;
		distrettoMenu: string;
		distrettoSub: string;
		esecutivo: string;
		delegati: string;
		commissioni: string;
		club: string;
		news: string;
		eventi: string;
		join: string;
		materials: string;
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
		archiveEyebrow: string;
		archiveTitle: string;
		backToArchive: string;
	};
	clubDetail: {
		eyebrow: string;
		zoneLabel: string;
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
	events: {
		empty: string;
		yearFilterLabel: string;
		upcomingBadge: string;
		dinnerLocationLabel: string;
		ticketsButtonLabel: string;
		photoButtonPrefix: string;
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
];

const IT: UiStrings = {
	nav: {
		home: 'HOME',
		distrettoMenu: 'IL DISTRETTO',
		distrettoSub: 'Panoramica',
		esecutivo: 'ESECUTIVO DISTRETTUALE',
		delegati: 'DELEGATI DI ZONA',
		commissioni: 'COMMISSIONI DISTRETTUALI',
		club: 'I CLUB',
		news: 'NEWS',
		eventi: 'EVENTI',
		join: 'ENTRA IN ROTARACT',
		materials: 'MATERIALI DISTRETTUALI',
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
		archiveEyebrow: 'DAL DISTRETTO',
		archiveTitle: 'NEWS DAL DISTRETTO',
		backToArchive: '← Tutte le news',
	},
	clubDetail: {
		eyebrow: 'I CLUB',
		zoneLabel: 'Zona',
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
	events: {
		empty: 'Nessun evento pubblicato al momento.',
		yearFilterLabel: 'Filtra per anno rotariano',
		upcomingBadge: 'IN ARRIVO',
		dinnerLocationLabel: 'Cena',
		ticketsButtonLabel: 'Info e biglietti',
		photoButtonPrefix: 'Foto',
	},
};

const EN: UiStrings = {
	nav: {
		home: 'HOME',
		distrettoMenu: 'THE DISTRICT',
		distrettoSub: 'Overview',
		esecutivo: 'DISTRICT EXECUTIVE',
		delegati: 'ZONE DELEGATES',
		commissioni: 'DISTRICT COMMITTEES',
		club: 'CLUBS',
		news: 'NEWS',
		eventi: 'EVENTS',
		join: 'JOIN ROTARACT',
		materials: 'DISTRICT MATERIALS',
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
		archiveEyebrow: 'FROM THE DISTRICT',
		archiveTitle: 'DISTRICT NEWS',
		backToArchive: '← All news',
	},
	clubDetail: {
		eyebrow: 'CLUBS',
		zoneLabel: 'Zone',
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
	events: {
		empty: 'No events published yet.',
		yearFilterLabel: 'Filter by Rotary year',
		upcomingBadge: 'UPCOMING',
		dinnerLocationLabel: 'Dinner',
		ticketsButtonLabel: 'Info & tickets',
		photoButtonPrefix: 'Photos:',
	},
};

export const uiStrings: Record<Lang, UiStrings> = { it: IT, en: EN };
