// One file per collection (see each for its own comments), collected here in the same order
// they've always appeared in the schema. Interact collections sit right after their Rotaract
// counterpart (clubs → interactClubs, events → interactEvents) so the two are easy to compare.
import { pagesCollection } from './pages';
import { zonesCollection } from './zones';
import { clubsCollection } from './clubs';
import { interactClubsCollection } from './interactClubs';
import { newsCollection } from './news';
import { resourcesCollection } from './resources';
import { eventsCollection } from './events';
import { interactEventsCollection } from './interactEvents';
import { settingsCollection } from './settings';

export const collections = [
	pagesCollection,
	zonesCollection,
	clubsCollection,
	interactClubsCollection,
	newsCollection,
	resourcesCollection,
	eventsCollection,
	interactEventsCollection,
	settingsCollection,
];
