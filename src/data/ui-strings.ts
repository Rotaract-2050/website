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
		allDay: string;
		prevMonth: string;
		nextMonth: string;
		weekdaysShort: string[];
		monthsShort: string[];
		monthsFull: string[];
	};
}

export const SOCIAL_LINKS = [
	{ label: 'f', href: '#' },
	{ label: 'in', href: '#' },
	{ label: 'ig', href: '#' },
	{ label: 'yt', href: '#' },
];

export const UTILITY_LINKS = [
	{ label: 'ROTARY DISTRETTO 2050', href: '#' },
	{ label: 'ROTARY INTERNATIONAL', href: '#' },
	{ label: 'INTERACT 2050', href: '#' },
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
		allDay: 'Tutto il giorno',
		prevMonth: 'Mese precedente',
		nextMonth: 'Mese successivo',
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
		allDay: 'All day',
		prevMonth: 'Previous month',
		nextMonth: 'Next month',
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
};

export const uiStrings: Record<Lang, UiStrings> = { it: IT, en: EN };
