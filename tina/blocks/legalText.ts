// Long-form editorial text (titoli via ## nel rich-text, elenchi puntati, grassetto) per pagine
// di servizio come Privacy/Termini — un socio non tecnico può modificarlo dall'editor rich-text
// di Tina, senza toccare Markdown a mano come nel campo `body` testuale di SplitSection.
// Nomi campo `content`/`contentEn` (non `body`/`bodyEn`, non `title`/`titleEn`): Tina genera
// un'unica query GraphQL che spread-a i fragment di TUTTI i template blocco di `pages` nello
// stesso selection set, quindi un nome campo già usato altrove con tipo diverso (es. `body`
// stringa in SplitSection vs `body` JSON qui, o `title` opzionale qui vs `required: true`
// altrove) rompe la validazione GraphQL ("Fields conflict because they return conflicting
// types") — vedi tina/__generated__/frags.gql.
export const legalTextTemplate = {
	name: 'LegalText',
	label: 'Testo legale (informativa)',
	fields: [
		{ type: 'rich-text' as const, name: 'content', label: 'Testo (IT)' },
		{ type: 'rich-text' as const, name: 'contentEn', label: 'Testo (EN)' },
	],
};
