import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type { EventsConnectionQuery } from '../../tina/__generated__/types';
import type { Lang } from '../data/ui-strings';
import { clubTagLabels, rotaryYearLabel, type NewsTag } from './news';

type EventEdge = NonNullable<EventsConnectionQuery['eventsConnection']['edges']>[number];
export type DistrictPastEvent = NonNullable<NonNullable<EventEdge>['node']>;

/** Badge labels for an event's "Club ospitanti" tags — same shape/coloring as news club tags. */
export function eventClubTags(event: Pick<DistrictPastEvent, 'clubs'>): NewsTag[] {
	return clubTagLabels(event.clubs);
}

/** Slug relative to the locale folder, e.g. `it/passaggio-consegne-2026.md` -> `passaggio-consegne-2026`. */
export function eventSlug(event: Pick<DistrictPastEvent, '_sys'>): string {
	return event._sys.breadcrumbs.slice(1).join('/');
}

/**
 * Past district events for a locale, most recent first. Backed by the `events` Tina collection
 * (like news/clubs/zones), so any event a socio adds shows up here without touching code. Only
 * events with a date in the past are returned — upcoming events stay on the live Google Calendar
 * (EventsCalendar.astro / src/lib/calendar.ts), a separate data source on purpose.
 */
export async function getPastDistrictEvents(lang: Lang): Promise<DistrictPastEvent[]> {
	const result = await requestWithMetadata(client.queries.eventsConnection({ sort: 'date' }));
	const edges = result.data.eventsConnection.edges ?? [];
	const now = Date.now();

	return edges
		.map((edge) => edge?.node)
		.filter((node): node is DistrictPastEvent => node != null)
		.filter((node) => node._sys.breadcrumbs[0] === lang)
		.filter((node) => new Date(node.date).getTime() < now)
		.reverse();
}

export interface EventYearGroup {
	yearLabel: string;
	events: DistrictPastEvent[];
}

/**
 * Buckets already-sorted (newest-first) past events into Rotary-year groups, newest year first.
 * Relies on the input being pre-sorted so same-year events stay contiguous.
 */
export function groupEventsByYear(events: DistrictPastEvent[]): EventYearGroup[] {
	const groups: EventYearGroup[] = [];
	for (const event of events) {
		const yearLabel = rotaryYearLabel(event.date);
		const currentGroup = groups[groups.length - 1];
		if (currentGroup && currentGroup.yearLabel === yearLabel) {
			currentGroup.events.push(event);
		} else {
			groups.push({ yearLabel, events: [event] });
		}
	}
	return groups;
}
