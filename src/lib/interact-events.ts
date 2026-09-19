// Clone of src/lib/events.ts, pointed at the isolated `interactEvents` Tina collection instead
// of `events` — see the Interact implementation plan (§ "Events blocks: clone, don't
// parametrize"). Tina generates one typed query per collection name, so this can't be folded
// into events.ts without losing type safety; the project already has a precedent for this
// (resources got its own lib/resources.ts instead of being merged into lib/news.ts).
import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type { InteractEventsConnectionQuery } from '../../tina/__generated__/types';
import type { Lang } from '../data/ui-strings';
import { dateKeyEuropeRome } from './calendar';
import { clubTagLabels, rotaryYearLabel, type NewsTag } from './news';

type InteractEventEdge = NonNullable<InteractEventsConnectionQuery['interactEventsConnection']['edges']>[number];
export type InteractEvent = NonNullable<NonNullable<InteractEventEdge>['node']>;

/**
 * Badge labels for an event card: the "Distrettuale" type tag first (Altro events get no type
 * badge, same as untagged news), then the tagged "Club Host" club(s) — same shape/coloring as
 * news club tags. `clubTagLabels` is structurally typed (just `{ club?: { name, zone? } }`), so
 * it works unchanged for `interactEvents.clubs` pointing at `interactClubs` instead of `clubs`.
 */
export function interactEventTags(event: Pick<InteractEvent, 'clubs' | 'eventType'>): NewsTag[] {
	return [...interactEventTypeTag(event), ...clubTagLabels(event.clubs)];
}

/** Just the "Distrettuale" type badge (no club tags) — for callers that render club tags separately. */
export function interactEventTypeTag(event: Pick<InteractEvent, 'eventType'>): NewsTag[] {
	return event.eventType === 'Distrettuale' ? [{ label: event.eventType }] : [];
}

/** Slug for an event, e.g. `passaggio-consegne-2026.md` -> `passaggio-consegne-2026`. */
export function interactEventSlug(event: Pick<InteractEvent, '_sys'>): string {
	return event._sys.breadcrumbs.join('/');
}

/**
 * Calendar day (Europe/Rome, `YYYY-MM-DD`) used to match this event against a Google Calendar
 * entry in `InteractEventsCalendar.astro` — `calendarDate` overrides `date` when the socio needs
 * to fix a mismatch or disambiguate two events on the same day.
 */
export function interactEventCalendarDayKey(event: Pick<InteractEvent, 'date' | 'calendarDate'>): string {
	return dateKeyEuropeRome(new Date(event.calendarDate || event.date));
}

/**
 * An event's title/excerpt/imageLabel in the given language — one file holds both (`title`/
 * `titleEn`, like `clubs.story`/`storyEn`), falling back to the IT value when the EN twin is
 * empty, same as `ClubDetail.astro`'s `story`/`storyEn` fallback.
 */
export function localizeInteractEvent(
	event: Pick<InteractEvent, 'title' | 'titleEn' | 'excerpt' | 'excerptEn' | 'imageLabel' | 'imageLabelEn'>,
	lang: Lang,
) {
	const isEn = lang === 'en';
	return {
		title: (isEn && event.titleEn) || event.title,
		excerpt: (isEn && event.excerptEn) || event.excerpt,
		imageLabel: (isEn && event.imageLabelEn) || event.imageLabel,
	};
}

/** True once an Interact event's date is now or in the future. */
export function isUpcomingInteractEvent(dateIso: string): boolean {
	return new Date(dateIso).getTime() >= Date.now();
}

/** Today's Rotary year label (server clock) — the archive's default active tab. */
export function currentInteractRotaryYearLabel(): string {
	return rotaryYearLabel(new Date().toISOString());
}

/** URL-friendly id for a Rotary-year label, e.g. `AR 2026/2027` -> `2026-2027` (for `?anno=`). */
export function interactYearLabelSlug(yearLabel: string): string {
	const match = yearLabel.match(/^AR (\d{4})\/(\d{4})$/);
	return match ? `${match[1]}-${match[2]}` : yearLabel;
}

/**
 * All Interact district events, in both languages (past and upcoming). Backed by the
 * `interactEvents` Tina collection, so any event a socio adds shows up here without touching
 * code.
 *
 * Order: upcoming events first (soonest first), then past events (most recent first).
 */
export async function getInteractArchiveEvents(): Promise<InteractEvent[]> {
	const result = await requestWithMetadata(client.queries.interactEventsConnection({ sort: 'date' }));
	const edges = result.data.interactEventsConnection.edges ?? [];

	const events = edges
		.map((edge) => edge?.node)
		.filter((node): node is InteractEvent => node != null)
		// `visible` defaults to shown — only an explicit "Mostra evento" = off hides a draft event.
		.filter((node) => node.visible ?? true);

	const upcoming = events.filter((event) => isUpcomingInteractEvent(event.date)).sort((a, b) => a.date.localeCompare(b.date));
	const past = events
		.filter((event) => !isUpcomingInteractEvent(event.date))
		.sort((a, b) => b.date.localeCompare(a.date));

	return [...upcoming, ...past];
}

export interface InteractEventYearGroup {
	yearLabel: string;
	events: InteractEvent[];
}

/** An event's Rotary-year bucket — plain `rotaryYearLabel` of its date (no S.I.D.E. exception: that's a Rotaract-only event series). */
function interactEventYearLabel(event: Pick<InteractEvent, 'date'>): string {
	return rotaryYearLabel(event.date);
}

/** Start year parsed out of a `rotaryYearLabel`/event-year-label output ("AR 2025/2026" -> 2025). */
function yearLabelStartYear(yearLabel: string): number {
	return Number(yearLabel.match(/^AR (\d{4})\//)?.[1] ?? 0);
}

/**
 * Buckets events into Rotary-year groups (preserving each event's position within its group),
 * with groups ordered most recent Rotary year first.
 */
export function groupInteractEventsByYear(events: InteractEvent[]): InteractEventYearGroup[] {
	const groups = new Map<string, InteractEvent[]>();
	for (const event of events) {
		const yearLabel = interactEventYearLabel(event);
		const bucket = groups.get(yearLabel);
		if (bucket) bucket.push(event);
		else groups.set(yearLabel, [event]);
	}
	return Array.from(groups, ([yearLabel, events]) => ({ yearLabel, events })).sort(
		(a, b) => yearLabelStartYear(b.yearLabel) - yearLabelStartYear(a.yearLabel),
	);
}
