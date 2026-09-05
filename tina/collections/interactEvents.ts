import type { Collection } from 'tinacms';
import { focalImageFields } from '../fields/focalPointImage';
import { interactEventsRouter } from '../routers';

// Isolated from `events` per an explicit decision: Interact events get their own
// collection/calendar/archive, no cross-programma filtering. `clubs` references
// `interactClubs`, not `clubs`. v1 omits ticketsOpen/ticketsUrl/photoAlbumUrl/
// ticketWidgetEmbed — no proven ticketing need yet for 12-18-year-old members,
// addable later without breaking anything (additive schema change).
//
// Same naming constraint as `interactClubs`: camelCase `name`, dashed `path`.
export const interactEventsCollection: Collection = {
	name: 'interactEvents',
	label: 'Eventi Interact',
	path: 'src/content/interact-events',
	format: 'md',
	ui: { router: interactEventsRouter },
	fields: [
		{ type: 'string', name: 'title', label: 'Titolo (IT)', isTitle: true, required: true },
		{ type: 'string', name: 'titleEn', label: 'Titolo (EN)' },
		{
			type: 'boolean',
			name: 'visible',
			label: 'Mostra evento',
			description: 'Disattiva per preparare un evento senza pubblicarlo ancora nell\'archivio eventi Interact del sito.',
		},
		{ type: 'datetime', name: 'date', label: 'Data evento', required: true, ui: { dateFormat: 'DD MMMM YYYY' } },
		{
			type: 'datetime',
			name: 'endDate',
			label: 'Data fine evento (solo se dura più di un giorno)',
			description:
				'Lascia vuoto per il caso normale (evento di un solo giorno): i dati strutturati per Google useranno automaticamente la stessa data di inizio. Compilalo solo per un evento che si estende su più giorni.',
		},
		{
			type: 'datetime',
			name: 'calendarDate',
			label: 'Data su Google Calendar (se diversa)',
			description:
				'Usata per collegare questo evento alla voce corrispondente nel widget "Calendario eventi Interact", quando la data su Google Calendar non coincide con la Data evento sopra (o per forzare/disambiguare il collegamento). Lascia vuoto per usare direttamente la Data evento.',
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
		// Same reference-list workaround as `events.clubs` (Tina's `reference` field doesn't
		// support `list: true` directly): one club per row, referencing `interactClubs`.
		{
			type: 'object',
			name: 'clubs',
			label: 'Club Host',
			list: true,
			fields: [{ type: 'reference', name: 'club', label: 'Club', collections: ['interactClubs'], required: true }],
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
	],
};
