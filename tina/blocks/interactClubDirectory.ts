// Clone of clubDirectoryTemplate: same editorial fields (clubs/zones themselves come live from
// their own collections, not authored here), but the Astro component behind this template
// (InteractClubDirectory.astro) queries `interactClubsConnection` instead of `clubsConnection` —
// Tina generates one typed query per collection name, so the two can't share one component.
// Zones stay shared with Rotaract (interact-clubs.zone still references the `zones` collection).
export const interactClubDirectoryTemplate = {
	name: 'InteractClubDirectory',
	label: 'Elenco club Interact (per zona)',
	fields: [
		{ type: 'string' as const, name: 'intro', label: 'Introduzione (IT)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'introEn', label: 'Introduzione (EN)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'disclaimer', label: 'Disclaimer (IT)', ui: { component: 'textarea' } },
		{ type: 'string' as const, name: 'disclaimerEn', label: 'Disclaimer (EN)', ui: { component: 'textarea' } },
	],
};
