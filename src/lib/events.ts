import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type { EventsConnectionQuery } from '../../tina/__generated__/types';
import type { Lang } from '../data/ui-strings';
import { dateKeyEuropeRome } from './calendar';
import { clubTagLabels, rotaryYearLabel, type NewsTag } from './news';

type EventEdge = NonNullable<EventsConnectionQuery['eventsConnection']['edges']>[number];
export type DistrictEvent = NonNullable<NonNullable<EventEdge>['node']>;

/**
 * Badge labels for an event card: the "Distrettuale" type tag first (Altro events get no type
 * badge, same as untagged news), then the tagged "Club Host" club(s) — same shape/coloring as
 * news club tags.
 */
export function eventTags(event: Pick<DistrictEvent, 'clubs' | 'eventType'>): NewsTag[] {
	return [...eventTypeTag(event), ...clubTagLabels(event.clubs)];
}

/** Just the "Distrettuale" type badge (no club tags) — for callers that render club tags separately. */
export function eventTypeTag(event: Pick<DistrictEvent, 'eventType'>): NewsTag[] {
	return event.eventType === 'Distrettuale' ? [{ label: event.eventType }] : [];
}

/** Slug for an event, e.g. `passaggio-consegne-2026.md` -> `passaggio-consegne-2026`. */
export function eventSlug(event: Pick<DistrictEvent, '_sys'>): string {
	return event._sys.breadcrumbs.join('/');
}

/**
 * Calendar day (Europe/Rome, `YYYY-MM-DD`) used to match this event against a Google Calendar
 * entry in `EventsCalendar.astro` — `calendarDate` overrides `date` when the socio needs to fix a
 * mismatch or disambiguate two events on the same day (see `tina/config.ts`'s `calendarDate` field).
 */
export function eventCalendarDayKey(event: Pick<DistrictEvent, 'date' | 'calendarDate'>): string {
	return dateKeyEuropeRome(new Date(event.calendarDate || event.date));
}

/**
 * An event's title/excerpt/imageLabel in the given language — one file holds both (`title`/
 * `titleEn`, like `clubs.story`/`storyEn`), falling back to the IT value when the EN twin is
 * empty, same as `ClubDetail.astro`'s `story`/`storyEn` fallback.
 */
export function localizeEvent(event: Pick<DistrictEvent, 'title' | 'titleEn' | 'excerpt' | 'excerptEn' | 'imageLabel' | 'imageLabelEn'>, lang: Lang) {
	const isEn = lang === 'en';
	return {
		title: (isEn && event.titleEn) || event.title,
		excerpt: (isEn && event.excerptEn) || event.excerpt,
		imageLabel: (isEn && event.imageLabelEn) || event.imageLabel,
	};
}

/** True once a district event's date is now or in the future. */
export function isUpcomingEvent(dateIso: string): boolean {
	return new Date(dateIso).getTime() >= Date.now();
}

/** Today's Rotary year label (server clock) — the archive's default active tab. */
export function currentRotaryYearLabel(): string {
	return rotaryYearLabel(new Date().toISOString());
}

/** URL-friendly id for a Rotary-year label, e.g. `AR 2026/2027` -> `2026-2027` (for `?anno=`). */
export function yearLabelSlug(yearLabel: string): string {
	const match = yearLabel.match(/^AR (\d{4})\/(\d{4})$/);
	return match ? `${match[1]}-${match[2]}` : yearLabel;
}

/**
 * All district events, in both languages (past and upcoming — e.g. a Distrettuale event with a
 * ticket link needs to be visible before it happens). Backed by the `events` Tina collection
 * (like news/clubs/zones), so any event a socio adds shows up here without touching code.
 *
 * Order: upcoming events first (soonest first, so the next flagship event surfaces at the top),
 * then past events (most recent first). Separate from the live Google Calendar
 * (EventsCalendar.astro / src/lib/calendar.ts), which stays the lightweight upcoming-agenda widget.
 */
export async function getArchiveEvents(): Promise<DistrictEvent[]> {
	try {
		const result = await requestWithMetadata(client.queries.eventsConnection({ sort: 'date' }));
		const edges = result.data.eventsConnection.edges ?? [];

		const events = edges
			.map((edge) => edge?.node)
			.filter((node): node is DistrictEvent => node != null)
			// `visible` defaults to shown — only an explicit "Mostra evento" = off hides a draft event.
			.filter((node) => node.visible ?? true);

		const upcoming = events.filter((event) => isUpcomingEvent(event.date)).sort((a, b) => a.date.localeCompare(b.date));
		const past = events
			.filter((event) => !isUpcomingEvent(event.date))
			.sort((a, b) => b.date.localeCompare(a.date));

		return [...upcoming, ...past];
	} catch (error) {
		console.error("Error fetching archive events:", error);
		return [];
	}
}

export interface EventYearGroup {
	yearLabel: string;
	events: DistrictEvent[];
}

/** True for S.I.D.E. events ("SIDE 2024", "S.I.D.E. 2026", ...), matched on title since there's no dedicated series field. */
function isSideEvent(title: string): boolean {
	return title.replace(/[.\s]/g, '').toUpperCase().startsWith('SIDE');
}

/** True for Passaggio delle Consegne events ("Passaggio delle Consegne 2025", "PDC 2026", ...), matched on title like S.I.D.E. */
function isHandoverEvent(title: string): boolean {
	return /^(passaggio delle consegne|pdc)\b/i.test(title.trim());
}

/** Shifts a `rotaryYearLabel` output ("AR 2024/2025") by `delta` Rotary years ("AR 2025/2026" for +1). */
function shiftRotaryYearLabel(label: string, delta: number): string {
	const match = label.match(/^AR (\d{4})\/(\d{4})$/);
	if (!match) return label;
	const startYear = Number(match[1]) + delta;
	return `AR ${startYear}/${startYear + 1}`;
}

/**
 * An event's Rotary-year bucket, normally the plain `rotaryYearLabel` of its date — except:
 * - S.I.D.E. trains incoming officers, so it opens the *next* Rotary year though held in May;
 * - Passaggio delle Consegne closes the Rotary year that's ending, so one held just after the
 *   1 July cutoff (e.g. 5 July 2025) still belongs to the year before.
 */
function eventYearLabel(event: Pick<DistrictEvent, 'date' | 'title'>): string {
	const label = rotaryYearLabel(event.date);
	if (isSideEvent(event.title)) return shiftRotaryYearLabel(label, 1);
	// Held in the second half of the calendar year = past the 1 July cutoff, so step back to the ending year.
	if (isHandoverEvent(event.title) && new Date(event.date).getUTCMonth() >= 6) return shiftRotaryYearLabel(label, -1);
	return label;
}

/** Start year parsed out of a `rotaryYearLabel`/`eventYearLabel` output ("AR 2025/2026" -> 2025). */
function yearLabelStartYear(yearLabel: string): number {
	return Number(yearLabel.match(/^AR (\d{4})\//)?.[1] ?? 0);
}

/**
 * Buckets events into Rotary-year groups (preserving each event's position within its group),
 * with groups ordered most recent Rotary year first — upcoming events can put a later Rotary
 * year before an earlier one still has past events listed, so groups are keyed by label rather
 * than assumed contiguous, and explicitly sorted rather than left in first-seen order.
 */
export function groupEventsByYear(events: DistrictEvent[]): EventYearGroup[] {
	const groups = new Map<string, DistrictEvent[]>();
	for (const event of events) {
		const yearLabel = eventYearLabel(event);
		const bucket = groups.get(yearLabel);
		if (bucket) bucket.push(event);
		else groups.set(yearLabel, [event]);
	}
	return Array.from(groups, ([yearLabel, events]) => ({ yearLabel, events })).sort(
		(a, b) => yearLabelStartYear(b.yearLabel) - yearLabelStartYear(a.yearLabel),
	);
}
