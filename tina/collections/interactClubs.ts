import type { Collection } from 'tinacms';
import { focalImageFields } from '../fields/focalPointImage';

// Isolated from `clubs` per an explicit decision: Interact clubs get their own collection
// rather than mixing into the Rotaract club list, while still referencing the SAME `zones`
// collection (the district's Interact clubs use the same 4 geographic zones as Rotaract).
// No `ui.router`/detail page — see InteractClubDirectory.astro, a listing-only block (no
// per-club detail route, to sidestep the documented nested-dynamic-route-vs-catch-all routing
// bug rather than depend on it not applying here).
//
// Tina collection `name` must be alphanumeric/underscore only (no dashes) — camelCase here,
// `path` below keeps the dashed directory name for consistency with the rest of the site's
// content folders.
export const interactClubsCollection: Collection = {
	name: 'interactClubs',
	label: 'Club Interact',
	path: 'src/content/interact-clubs',
	format: 'md',
	fields: [
		{ type: 'string', name: 'name', label: 'Nome club', isTitle: true, required: true },
		{ type: 'reference', name: 'zone', label: 'Zona', collections: ['zones'], required: true },
		{ type: 'number', name: 'foundationYear', label: 'Anno di fondazione' },
		{
			type: 'number',
			name: 'lat',
			label: 'Latitudine (mappa club)',
			description: 'Coordinate approssimative del comune sede del club, da OpenStreetMap. Compilare insieme a Longitudine.',
		},
		{
			type: 'number',
			name: 'lng',
			label: 'Longitudine (mappa club)',
			description: 'Coordinate approssimative del comune sede del club, da OpenStreetMap. Compilare insieme a Latitudine.',
		},
		...focalImageFields('photo', 'Foto club'),
		{ type: 'string', name: 'email', label: 'Email' },
		{ type: 'string', name: 'website', label: 'Sito web' },
		{ type: 'string', name: 'instagram', label: 'Instagram' },
		{ type: 'string', name: 'facebook', label: 'Facebook' },
		{ type: 'string', name: 'story', label: 'Storia del club (IT)', ui: { component: 'textarea' } },
		{ type: 'string', name: 'storyEn', label: 'Storia del club (EN)', ui: { component: 'textarea' } },
	],
};
