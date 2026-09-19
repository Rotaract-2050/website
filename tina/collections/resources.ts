import type { Collection } from 'tinacms';
import { resourcesRouter } from '../routers';

export const resourcesCollection: Collection = {
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
};
