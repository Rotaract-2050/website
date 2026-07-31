export type Lang = 'it' | 'en';

export interface HeroSlide {
	eyebrow: string;
	title: string;
	subtitle: string;
	cta: string;
}

export interface StatItem {
	value: string;
	label: string;
}

export interface EventItem {
	day: string;
	month: string;
	title: string;
	time: string;
	location: string;
}

export interface NewsItem {
	tag: string;
	title: string;
	excerpt: string;
	date: string;
}

export interface ValueItem {
	letter: string;
	title: string;
	desc: string;
}

export interface RoleItem {
	initials: string;
	name: string;
	role: string;
}

export interface EmptyPageCopy {
	eyebrow: string;
	title: string;
	breadcrumbCurrent: string;
	placeholder: string;
}

export interface Copy {
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
	clubsSectionTitle: string;
	clubWord: string;
	sampleDisclaimer: string;
	hero: HeroSlide[];
	stats: StatItem[];
	mission: {
		eyebrow: string;
		title: string;
		body1: string;
		subhead: string;
		body2: string;
		cta: string;
	};
	events: { title: string; items: EventItem[] };
	news: { title: string; items: NewsItem[] };
	cta: { title: string; body: string; button: string };
	footer: {
		about: string;
		linksTitle: string;
		contactTitle: string;
		socialTitle: string;
		address: string;
		email: string;
		copyright: string;
		underRotary: string;
	};
	distretto: {
		eyebrow: string;
		title: string;
		breadcrumbCurrent: string;
		leaderRole: string;
		leaderName: string;
		quote: string;
		intro: string;
		missionTitle: string;
		missionText: string;
		valuesTitle: string;
		values: ValueItem[];
		governanceTitle: string;
		roles: RoleItem[];
	};
	club: {
		eyebrow: string;
		title: string;
		breadcrumbCurrent: string;
		intro: string;
		disclaimer: string;
		contactCta: string;
	};
	pagesEmpty: {
		esecutivo: EmptyPageCopy;
		delegati: EmptyPageCopy;
		commissioni: EmptyPageCopy;
	};
}

export interface Zone {
	name: string;
	clubs: string[];
}

export const ZONES: Zone[] = [
	{
		name: 'Francigena',
		clubs: [
			'Rotaract Club Codogno',
			"Rotaract Club Fiorenzuola d'Arda",
			'Rotaract Club Lodi Adda',
			'Rotaract Club Piacenza',
			'Rotaract Club Terre Cremasche',
		],
	},
	{
		name: 'Leonessa',
		clubs: [
			'Rotaract Club Brescia',
			'Rotaract Club Brescia Vittoria Alata',
			'Rotaract Club Brescia Franciacorta',
			'Rotaract Club Garda Valle Sabbia',
			'Rotaract Club Brescia Ovest Castello',
			'Rotaract Club Brescia Sud Est Montichiari',
			'Rotaract Club Valtrompia',
			'Rotaract Club Brescia Veronica Gambara',
		],
	},
	{
		name: 'Navigli',
		clubs: [
			'Rotaract Club Abbiategrasso',
			'Rotaract Club Vigevano Lomellina',
			'Rotaract Club Morimondo Abbazia',
			'Rotaract Club Pavia',
			'Rotaract Club Pavia Est Terre Viscontee',
			'Rotaract Club Pavia Nord',
			'Rotaract Club Vigevano Castello',
			'Rotaract Club Voghera',
		],
	},
	{
		name: 'Padana',
		clubs: [
			'Rotaract Club Andes Virgilio Curtatone',
			'Rotaract Club Casalmaggiore Viadana Sabbioneta',
			'Rotaract Club Castiglione delle Stiviere e Alto Mantovano',
			'Rotaract Club Cremona',
			'Rotaract Club Gonzaga Suzzara',
			'Rotaract Club Mantova',
			'Rotaract Club Piadena Casalmaggiore Asola',
		],
	},
];

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

const IT: Copy = {
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
	clubsSectionTitle: 'I CLUB DEL DISTRETTO',
	clubWord: 'club',
	sampleDisclaimer:
		'* Nomi ed elenco del direttivo a scopo dimostrativo — dati da confermare con il distretto.',
	hero: [
		{
			eyebrow: 'DISTRETTO ROTARACT 2050',
			title: 'GIOVANI CHE COSTRUISCONO IL CAMBIAMENTO',
			subtitle:
				'Lombardia orientale ed Emilia occidentale: 7 provincie, un solo distretto di giovani leader al servizio della comunità.',
			cta: 'SCOPRI IL DISTRETTO',
		},
		{
			eyebrow: 'SERVIZIO E LEADERSHIP',
			title: 'PROGETTI CHE LASCIANO IL SEGNO',
			subtitle:
				"Dalla lotta alla povertà alla tutela dell'ambiente: ogni club Rotaract sceglie una causa e la porta avanti.",
			cta: 'I NOSTRI CLUB',
		},
		{
			eyebrow: 'UNISCITI A NOI',
			title: 'LA TUA RETE PARTE DA QUI',
			subtitle:
				'Rotaract è la community di giovani 18-30 anni che unisce crescita personale, amicizia e service.',
			cta: 'ENTRA IN ROTARACT',
		},
	],
	stats: [
		{ value: '28', label: 'CLUB ROTARACT' },
		{ value: '350+', label: 'SOCI' },
		{ value: '4', label: 'ZONE' },
		{ value: '40+', label: 'PROGETTI ATTIVI' },
	],
	mission: {
		eyebrow: 'CHI SIAMO',
		title: 'IL ROTARACT NEL DISTRETTO 2050',
		body1:
			'Rotaract è la rete distrettuale dei club per giovani dai 18 ai 30 anni, sostenuta dal Rotary International. Nel Distretto 2050 riunisce club attivi in Lombardia orientale ed Emilia occidentale.',
		subhead: 'La nostra missione',
		body2:
			'Formiamo leader responsabili, promuoviamo il service e costruiamo una rete di professioniste e professionisti impegnati per le proprie comunità.',
		cta: 'SCOPRI IL DISTRETTO',
	},
	events: {
		title: 'EVENTI DISTRETTUALI',
		items: [
			{ day: '12', month: 'SET', title: 'Assemblea Distrettuale 2026-27', time: '09:30 - 13:00', location: 'Piacenza' },
			{ day: '03', month: 'OTT', title: 'Seminario Leadership & Service', time: '15:00 - 18:00', location: 'Cremona' },
			{ day: '24', month: 'OTT', title: 'Giornata Mondiale della Polio', time: 'Tutto il giorno', location: 'Distretto 2050' },
			{ day: '14', month: 'NOV', title: 'Congresso Distrettuale Rotaract', time: '09:00 - 19:00', location: 'Brescia' },
		],
	},
	news: {
		title: 'NEWS DAL DISTRETTO',
		items: [
			{ tag: 'PROGETTI', title: 'Raccolta fondi per la Fondazione Rotary', excerpt: "I club del distretto superano l'obiettivo annuale di raccolta.", date: '18 LUG 2026' },
			{ tag: 'FORMAZIONE', title: "Al via l'Academy 2050 per i nuovi socie", excerpt: 'Un percorso formativo per i giovani leader del distretto.', date: '05 LUG 2026' },
			{ tag: 'SERVIZIO', title: 'NGSE: scambio internazionale di servizio', excerpt: 'Sei club coinvolti nel nuovo programma di service exchange.', date: '22 GIU 2026' },
		],
	},
	cta: {
		title: 'DIVENTA SOCIO ROTARACT',
		body: 'Hai tra 18 e 30 anni? Scopri il club più vicino a te e inizia il tuo percorso di leadership e servizio.',
		button: 'TROVA IL TUO CLUB',
	},
	footer: {
		about: 'Il Distretto Rotaract 2050 riunisce i club Rotaract di Lombardia orientale ed Emilia occidentale, sotto gli auspici del Rotary Distretto 2050.',
		linksTitle: 'LINK UTILI',
		contactTitle: 'CONTATTI',
		socialTitle: 'SEGUICI',
		address: 'Via Egidio Gorra, 55 — Piacenza (Italia)',
		email: 'info@rotaract2050.org',
		copyright: '© Rotaract Distretto 2050',
		underRotary: 'Sostenuto dal Rotary Distretto 2050',
	},
	distretto: {
		eyebrow: 'DISTRETTO ROTARACT 2050',
		title: 'IL DISTRETTO',
		breadcrumbCurrent: 'IL DISTRETTO',
		leaderRole: 'Rappresentante Distrettuale 2026-27',
		leaderName: 'Nome Cognome',
		quote: 'Il Rotaract è la palestra dove si diventa i leader di cui le nostre comunità hanno bisogno.',
		intro: 'Il Distretto Rotaract 2050 riunisce i club attivi nelle province di Cremona, Brescia, Lodi, Mantova, Milano Sud, Pavia e Piacenza, sotto gli auspici del Rotary Distretto 2050.',
		missionTitle: 'La nostra missione',
		missionText: 'Sosteniamo i club nella formazione di giovani leader, promuoviamo progetti di servizio e favoriamo lo scambio tra socie e soci di tutto il distretto.',
		valuesTitle: 'I NOSTRI VALORI',
		values: [
			{ letter: 'L', title: 'Leadership', desc: 'Sviluppiamo competenze di guida attraverso esperienze reali di responsabilità.' },
			{ letter: 'A', title: 'Amicizia', desc: 'Costruiamo legami duraturi tra giovani con interessi e valori condivisi.' },
			{ letter: 'D', title: 'Diversità & Inclusione', desc: 'Accogliamo prospettive diverse per generare un impatto più ampio.' },
			{ letter: 'S', title: 'Service', desc: "Trasformiamo l'impegno in progetti concreti per le nostre comunità." },
		],
		governanceTitle: 'IL DIRETTIVO DISTRETTUALE',
		roles: [
			{ initials: 'RD', name: 'Nome Cognome', role: 'Rappresentante Distrettuale' },
			{ initials: 'VR', name: 'Nome Cognome', role: 'Vice Rappresentante' },
			{ initials: 'SD', name: 'Nome Cognome', role: 'Segretario Distrettuale' },
			{ initials: 'TD', name: 'Nome Cognome', role: 'Tesoriere Distrettuale' },
		],
	},
	club: {
		eyebrow: 'DISTRETTO 2050',
		title: 'I CLUB',
		breadcrumbCurrent: 'I CLUB',
		intro: 'Il Distretto 2050 è organizzato in quattro zone — Francigena, Leonessa, Navigli e Padana — che riuniscono i club Rotaract attivi tra Lombardia orientale ed Emilia occidentale.',
		disclaimer: '* I collegamenti di contatto sono segnaposto in attesa dei dati reali dei club.',
		contactCta: 'Contatta il club',
	},
	pagesEmpty: {
		esecutivo: { eyebrow: 'DISTRETTO ROTARACT 2050', title: 'ESECUTIVO DISTRETTUALE', breadcrumbCurrent: 'ESECUTIVO DISTRETTUALE', placeholder: 'Questa pagina è in preparazione. Torna a trovarci a breve.' },
		delegati: { eyebrow: 'DISTRETTO ROTARACT 2050', title: 'DELEGATI DI ZONA', breadcrumbCurrent: 'DELEGATI DI ZONA', placeholder: 'Questa pagina è in preparazione. Torna a trovarci a breve.' },
		commissioni: { eyebrow: 'DISTRETTO ROTARACT 2050', title: 'COMMISSIONI DISTRETTUALI', breadcrumbCurrent: 'COMMISSIONI DISTRETTUALI', placeholder: 'Questa pagina è in preparazione. Torna a trovarci a breve.' },
	},
};

const EN: Copy = {
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
	clubsSectionTitle: 'CLUBS IN THE DISTRICT',
	clubWord: 'club(s)',
	sampleDisclaimer: '* Sample names for the leadership team — data to be confirmed with the district.',
	hero: [
		{
			eyebrow: 'ROTARACT DISTRICT 2050',
			title: 'YOUNG PEOPLE BUILDING CHANGE',
			subtitle: 'Eastern Lombardy and western Emilia: 7 provinces, one district of young leaders serving their communities.',
			cta: 'DISCOVER THE DISTRICT',
		},
		{
			eyebrow: 'SERVICE AND LEADERSHIP',
			title: 'PROJECTS THAT LEAVE A MARK',
			subtitle: 'From fighting poverty to protecting the environment: every Rotaract club picks a cause and drives it forward.',
			cta: 'OUR CLUBS',
		},
		{
			eyebrow: 'JOIN US',
			title: 'YOUR NETWORK STARTS HERE',
			subtitle: 'Rotaract is the community for 18-30 year-olds combining personal growth, fellowship and service.',
			cta: 'JOIN ROTARACT',
		},
	],
	stats: [
		{ value: '28', label: 'ROTARACT CLUBS' },
		{ value: '350+', label: 'MEMBERS' },
		{ value: '4', label: 'ZONES' },
		{ value: '40+', label: 'ACTIVE PROJECTS' },
	],
	mission: {
		eyebrow: 'WHO WE ARE',
		title: 'ROTARACT IN DISTRICT 2050',
		body1: 'Rotaract is the district network of clubs for young people aged 18-30, sponsored by Rotary International. In District 2050 it brings together clubs across eastern Lombardy and western Emilia.',
		subhead: 'Our mission',
		body2: 'We shape responsible leaders, champion service, and build a network of professionals and students committed to their communities.',
		cta: 'DISCOVER THE DISTRICT',
	},
	events: {
		title: 'DISTRICT EVENTS',
		items: [
			{ day: '12', month: 'SEP', title: 'District Assembly 2026-27', time: '09:30 - 13:00', location: 'Piacenza' },
			{ day: '03', month: 'OCT', title: 'Leadership & Service Seminar', time: '15:00 - 18:00', location: 'Cremona' },
			{ day: '24', month: 'OCT', title: 'World Polio Day', time: 'All day', location: 'District 2050' },
			{ day: '14', month: 'NOV', title: 'Rotaract District Conference', time: '09:00 - 19:00', location: 'Brescia' },
		],
	},
	news: {
		title: 'DISTRICT NEWS',
		items: [
			{ tag: 'PROJECTS', title: 'Fundraiser for The Rotary Foundation', excerpt: "District clubs exceed this year's fundraising goal.", date: 'JUL 18 2026' },
			{ tag: 'TRAINING', title: 'Academy 2050 kicks off for new members', excerpt: "A training path for the district's young leaders.", date: 'JUL 05 2026' },
			{ tag: 'SERVICE', title: 'NGSE: international service exchange', excerpt: 'Six clubs take part in the new service exchange program.', date: 'JUN 22 2026' },
		],
	},
	cta: {
		title: 'BECOME A ROTARACT MEMBER',
		body: 'Are you 18 to 30 years old? Find the club nearest to you and start your leadership and service journey.',
		button: 'FIND YOUR CLUB',
	},
	footer: {
		about: 'Rotaract District 2050 brings together Rotaract clubs across eastern Lombardy and western Emilia, sponsored by Rotary District 2050.',
		linksTitle: 'QUICK LINKS',
		contactTitle: 'CONTACT',
		socialTitle: 'FOLLOW US',
		address: 'Via Egidio Gorra, 55 — Piacenza (Italy)',
		email: 'info@rotaract2050.org',
		copyright: '© Rotaract District 2050',
		underRotary: 'Sponsored by Rotary District 2050',
	},
	distretto: {
		eyebrow: 'ROTARACT DISTRICT 2050',
		title: 'THE DISTRICT',
		breadcrumbCurrent: 'THE DISTRICT',
		leaderRole: 'District Representative 2026-27',
		leaderName: 'Full Name',
		quote: 'Rotaract is the training ground where the leaders our communities need are made.',
		intro: 'Rotaract District 2050 brings together clubs active in the provinces of Cremona, Brescia, Lodi, Mantova, Milano Sud, Pavia and Piacenza, sponsored by Rotary District 2050.',
		missionTitle: 'Our mission',
		missionText: 'We support clubs in developing young leaders, promote service projects, and foster exchange among members across the district.',
		valuesTitle: 'OUR VALUES',
		values: [
			{ letter: 'L', title: 'Leadership', desc: 'We build leadership skills through real hands-on responsibility.' },
			{ letter: 'F', title: 'Fellowship', desc: 'We build lasting bonds among young people with shared interests and values.' },
			{ letter: 'D', title: 'Diversity & Inclusion', desc: 'We welcome different perspectives to create broader impact.' },
			{ letter: 'S', title: 'Service', desc: 'We turn commitment into concrete projects for our communities.' },
		],
		governanceTitle: 'DISTRICT LEADERSHIP TEAM',
		roles: [
			{ initials: 'DR', name: 'Full Name', role: 'District Representative' },
			{ initials: 'VR', name: 'Full Name', role: 'Vice District Representative' },
			{ initials: 'DS', name: 'Full Name', role: 'District Secretary' },
			{ initials: 'DT', name: 'Full Name', role: 'District Treasurer' },
		],
	},
	club: {
		eyebrow: 'DISTRICT 2050',
		title: 'CLUBS',
		breadcrumbCurrent: 'CLUBS',
		intro: 'District 2050 is organized into four zones — Francigena, Leonessa, Navigli and Padana — bringing together Rotaract clubs across eastern Lombardy and western Emilia.',
		disclaimer: '* Contact links are placeholders pending real club data.',
		contactCta: 'Contact the club',
	},
	pagesEmpty: {
		esecutivo: { eyebrow: 'ROTARACT DISTRICT 2050', title: 'DISTRICT EXECUTIVE', breadcrumbCurrent: 'DISTRICT EXECUTIVE', placeholder: 'This page is under construction. Check back soon.' },
		delegati: { eyebrow: 'ROTARACT DISTRICT 2050', title: 'ZONE DELEGATES', breadcrumbCurrent: 'ZONE DELEGATES', placeholder: 'This page is under construction. Check back soon.' },
		commissioni: { eyebrow: 'ROTARACT DISTRICT 2050', title: 'DISTRICT COMMITTEES', breadcrumbCurrent: 'DISTRICT COMMITTEES', placeholder: 'This page is under construction. Check back soon.' },
	},
};

export const translations: Record<Lang, Copy> = { it: IT, en: EN };
