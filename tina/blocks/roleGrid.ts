import { focalImageFields } from '../fields/focalPointImage';

export const roleGridTemplate = {
	name: 'RoleGrid',
	label: 'Griglia ruoli',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
		{ type: 'boolean' as const, name: 'showDisclaimer', label: 'Mostra disclaimer' },
		{ type: 'string' as const, name: 'disclaimerText', label: 'Testo disclaimer (IT)' },
		{ type: 'string' as const, name: 'disclaimerTextEn', label: 'Testo disclaimer (EN)' },
		{
			type: 'boolean' as const,
			name: 'highlightFirst',
			label: 'Metti in evidenza il primo ruolo (card grande sopra gli altri)',
		},
		{
			type: 'object' as const,
			name: 'items',
			label: 'Ruoli',
			list: true,
			ui: { itemProps: (item: { role?: string }) => ({ label: item.role }) },
			fields: [
				{
					type: 'string' as const,
					name: 'shape',
					label: 'Forma Avatar (Material You)',
					description: 'Scegli la forma per bilanciare visivamente il layout',
					options: [
						{ value: 'auto', label: 'Alternato (Automatico)' },
						{ value: 'petal', label: 'Petalo (1 angolo appuntito)' },
						{ value: 'cross', label: 'Incrociato (2 angoli appuntiti)' },
						{ value: 'arch', label: 'Arco (Tombstone)' },
						{ value: 'blob', label: 'Blob Organico' },
						{ value: 'squircle', label: 'Squircle Classico' },
					],
				},
				{ type: 'string' as const, name: 'initials', label: 'Iniziali (fallback se manca la foto)' },
				...focalImageFields('photo', 'Foto', { zoom: true }),
				{ type: 'string' as const, name: 'name', label: 'Nome e cognome' },
				{ type: 'string' as const, name: 'role', label: 'Ruolo (IT)' },
				{ type: 'string' as const, name: 'roleEn', label: 'Ruolo (EN)' },
				{ type: 'string' as const, name: 'email', label: 'Email (se disponibile)' },
				{ type: 'reference' as const, name: 'club', label: 'Club', collections: ['clubs'] },
				{
					type: 'string' as const,
					name: 'clubCustom',
					label: 'Club (se non in elenco — es. club Rotary/Interact)',
					description: 'Usato solo se il club non è un Rotaract Club presente in "Club". Es. "RC Zerotrenta", "Interact Club Piacenza".',
				},
				{
					type: 'string' as const,
					name: 'themeMotto',
					label: 'Motto dell’anno (IT, solo per il ruolo in evidenza)',
				},
				{
					type: 'string' as const,
					name: 'themeMottoEn',
					label: 'Motto dell’anno (EN, solo per il ruolo in evidenza)',
				},
				{
					type: 'image' as const,
					name: 'themeLogo',
					label: 'Logo distrettuale dell’anno (solo per il ruolo in evidenza)',
				},
			],
		},
	],
};
