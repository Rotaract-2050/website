import { focalImageFields } from '../fields/focalPointImage';

// A commission/delegation grid: each item is either a committee (president + members) or a
// standalone delegation (president only, no members) — the "members row" simply doesn't render
// when the list is empty, so both shapes share one template instead of two.
export const committeeGridTemplate = {
	name: 'CommitteeGrid',
	label: 'Griglia commissioni',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
		{ type: 'boolean' as const, name: 'showDisclaimer', label: 'Mostra disclaimer' },
		{ type: 'string' as const, name: 'disclaimerText', label: 'Testo disclaimer (IT)' },
		{ type: 'string' as const, name: 'disclaimerTextEn', label: 'Testo disclaimer (EN)' },
		{
			type: 'object' as const,
			name: 'items',
			label: 'Commissioni / Deleghe',
			list: true,
			ui: { itemProps: (item: { name?: string }) => ({ label: item.name }) },
			fields: [
				{ type: 'string' as const, name: 'name', label: 'Nome commissione/delega (IT)' },
				{ type: 'string' as const, name: 'nameEn', label: 'Nome commissione/delega (EN)' },
				{ type: 'string' as const, name: 'description', label: 'Descrizione (IT, cosa fa questa commissione)', ui: { component: 'textarea' } },
				{ type: 'string' as const, name: 'descriptionEn', label: 'Descrizione (EN, cosa fa questa commissione)', ui: { component: 'textarea' } },
				{ type: 'string' as const, name: 'leadLabel', label: 'Etichetta responsabile (IT, es. "Presidente" o "Delegato")' },
				{ type: 'string' as const, name: 'leadLabelEn', label: 'Etichetta responsabile (EN, es. "President" o "Delegate")' },
				{ type: 'string' as const, name: 'membersLabel', label: 'Etichetta membri (IT, es. "Membro")' },
				{ type: 'string' as const, name: 'membersLabelEn', label: 'Etichetta membri (EN, es. "Member")' },
				{
					type: 'object' as const,
					name: 'lead',
					label: 'Responsabile',
					fields: [
						{
							type: 'string' as const,
							name: 'shape',
							label: 'Forma Avatar (Material You)',
							options: [
								{ value: 'auto', label: 'Alternato (Automatico)' },
								{ value: 'petal', label: 'Petalo (1 angolo appuntito)' },
								{ value: 'cross', label: 'Incrociato (2 angoli appuntiti)' },
								{ value: 'arch', label: 'Arco (Tombstone)' },
								{ value: 'blob', label: 'Blob Organico' },
								{ value: 'squircle', label: 'Squircle Classico' },
							],
						},
						...focalImageFields('photo', 'Foto', { zoom: true }),
						{ type: 'string' as const, name: 'name', label: 'Nome e cognome' },
						{ type: 'string' as const, name: 'email', label: 'Email (se disponibile)' },
						{ type: 'reference' as const, name: 'club', label: 'Club', collections: ['clubs'] },
						{
							type: 'string' as const,
							name: 'clubCustom',
							label: 'Club (se non in elenco — es. club Rotary/Interact)',
							description: 'Usato solo se il club non è un Rotaract Club presente in "Club". Es. "RC Zerotrenta", "Interact Club Piacenza".',
						},
					],
				},
				{
					type: 'object' as const,
					name: 'members',
					label: 'Membri',
					list: true,
					fields: [
						{
							type: 'string' as const,
							name: 'shape',
							label: 'Forma Avatar (Material You)',
							options: [
								{ value: 'auto', label: 'Alternato (Automatico)' },
								{ value: 'petal', label: 'Petalo (1 angolo appuntito)' },
								{ value: 'cross', label: 'Incrociato (2 angoli appuntiti)' },
								{ value: 'arch', label: 'Arco (Tombstone)' },
								{ value: 'blob', label: 'Blob Organico' },
								{ value: 'squircle', label: 'Squircle Classico' },
							],
						},
						...focalImageFields('photo', 'Foto', { zoom: true }),
						{ type: 'string' as const, name: 'name', label: 'Nome e cognome' },
						{ type: 'string' as const, name: 'email', label: 'Email (se disponibile)' },
						{ type: 'reference' as const, name: 'club', label: 'Club', collections: ['clubs'] },
						{
							type: 'string' as const,
							name: 'clubCustom',
							label: 'Club (se non in elenco — es. club Rotary/Interact)',
							description: 'Usato solo se il club non è un Rotaract Club presente in "Club". Es. "RC Zerotrenta", "Interact Club Piacenza".',
						},
					],
				},
			],
		},
	],
};
