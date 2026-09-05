import type { Collection } from 'tinacms';
import { focalImageFields } from '../fields/focalPointImage';

export const clubsCollection: Collection = {
	name: 'clubs',
	label: 'Club',
	path: 'src/content/clubs',
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
