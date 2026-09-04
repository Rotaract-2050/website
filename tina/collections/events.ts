import type { Collection } from 'tinacms';
import { focalImageFields } from '../fields/focalPointImage';
import { eventsRouter } from '../routers';

export const eventsCollection: Collection = {
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
			// Precompila con la pagina eventi Ticket Tailor del distretto per un nuovo evento —
			// resta un campo di testo libero, modificabile o svuotabile per ogni singolo evento.
			ui: { defaultValue: 'https://www.tickettailor.com/events/distrettorotaract2050/' },
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
};
