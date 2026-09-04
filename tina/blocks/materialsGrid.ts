// Files themselves are not Tina content: MaterialsGrid.astro fetches them live client-side
// from the Drive API v3 (files.list), including subfolders (folder browsing happens entirely
// in the client script). Only the section title, the root folder ID and the empty-state
// override are editorial — the API key lives once in `settings` (not per-block), since it's
// a site-wide credential, not page content.
export const materialsGridTemplate = {
	name: 'MaterialsGrid',
	label: 'Materiali distrettuali (Google Drive)',
	ui: { itemProps: (item: { title?: string }) => ({ label: item.title }) },
	fields: [
		{ type: 'string' as const, name: 'title', label: 'Titolo sezione (IT)', required: true },
		{ type: 'string' as const, name: 'titleEn', label: 'Titolo sezione (EN)' },
		{
			type: 'string' as const,
			name: 'driveFolderId',
			label: 'ID cartella Google Drive (radice)',
			required: true,
			description:
				'ID della cartella condivisa dal distretto, dall\'URL Drive (https://drive.google.com/drive/folders/<ID>). La cartella e le sue sottocartelle devono essere condivise "chiunque abbia il link": la lettura avviene via API key, senza login Google.',
		},
		{
			type: 'string' as const,
			name: 'emptyMessage',
			label: 'Messaggio se una cartella è vuota (IT, opzionale)',
			ui: { component: 'textarea' },
		},
		{
			type: 'string' as const,
			name: 'emptyMessageEn',
			label: 'Messaggio se una cartella è vuota (EN, opzionale)',
			ui: { component: 'textarea' },
		},
	],
};
