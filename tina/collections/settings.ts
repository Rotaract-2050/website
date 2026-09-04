import type { Collection } from 'tinacms';

export const settingsCollection: Collection = {
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
};
