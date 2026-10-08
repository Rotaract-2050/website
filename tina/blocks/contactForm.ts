import type { Template } from 'tinacms';

export const contactFormTemplate: Template = {
	name: 'ContactForm',
	label: 'Modulo di Contatto',
	fields: [
		{ type: 'string', name: 'heading', label: 'Titolo (IT)' },
		{ type: 'string', name: 'headingEn', label: 'Titolo (EN)' },
		{ type: 'string', name: 'description', label: 'Descrizione (IT)', ui: { component: 'textarea' } },
		{ type: 'string', name: 'descriptionEn', label: 'Descrizione (EN)', ui: { component: 'textarea' } },
		{ type: 'string', name: 'submitLabel', label: 'Testo Pulsante (IT)', description: 'Default: Invia' },
		{ type: 'string', name: 'submitLabelEn', label: 'Testo Pulsante (EN)', description: 'Default: Send' },
		{
			type: 'object',
			name: 'fields',
			label: 'Campi del Modulo',
			list: true,
			description: 'Se lasciato vuoto, mostrerà i campi predefiniti (Nome, Email, Messaggio).',
			ui: {
				itemProps: (item) => ({ label: item?.label || 'Nuovo campo' }),
			},
			fields: [
				{ type: 'string', name: 'name', label: 'ID Campo (es. "nome", "email", "telefono")', description: 'Senza spazi e in minuscolo. IMPORTANTE: per far funzionare il tasto "Rispondi" nelle email, chiama il campo della mail "email".', required: true },
				{ type: 'string', name: 'label', label: 'Etichetta (IT)', required: true },
				{ type: 'string', name: 'labelEn', label: 'Etichetta (EN)' },
				{
					type: 'string',
					name: 'type',
					label: 'Tipo di Campo',
					options: [
						{ label: 'Testo Corto', value: 'text' },
						{ label: 'Indirizzo Email', value: 'email' },
						{ label: 'Numero di Telefono', value: 'tel' },
						{ label: 'Testo Lungo (Textarea)', value: 'textarea' },
						{ label: 'Menu a Tendina (Select)', value: 'select' }
					],
					required: true,
				},
				{ type: 'boolean', name: 'required', label: 'Obbligatorio?' },
				{ type: 'string', name: 'options', label: 'Opzioni (solo per Select)', description: 'Inserisci le opzioni separate da virgola (es. "Opzione 1, Opzione 2")' }
			]
		}
	],
};
