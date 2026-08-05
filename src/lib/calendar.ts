import ical from 'node-ical';
import type { ParameterValue } from 'node-ical';

export const DEFAULT_CALENDAR_ID = 'admin@rotaract2050.org';

/** Google Calendar's public URLs for a given calendar ID (an email-shaped ID, e.g. `admin@rotaract2050.org` — found in Google Calendar settings under "Integrate calendar"). */
export function calendarUrls(calendarId: string = DEFAULT_CALENDAR_ID) {
	const encoded = encodeURIComponent(calendarId);
	return {
		icsUrl: `https://calendar.google.com/calendar/ical/${encoded}/public/basic.ics`,
		viewUrl: `https://calendar.google.com/calendar/embed?src=${encoded}&ctz=Europe%2FRome`,
		subscribeUrl: `https://calendar.google.com/calendar/render?cid=${encoded}`,
	};
}

export interface DistrictEvent {
	uid: string;
	start: Date;
	allDay: boolean;
	summary: string;
	location: string;
}

export type CalendarResult = { ok: true; events: DistrictEvent[] } | { ok: false };

const CACHE_TTL_MS = 15 * 60 * 1000;
let cache: { calendarId: string; fetchedAt: number; events: DistrictEvent[] } | null = null;

function textValue(value: ParameterValue | undefined): string {
	if (!value) return '';
	return typeof value === 'string' ? value : value.val;
}

async function fetchEvents(calendarId: string): Promise<DistrictEvent[]> {
	const data = await ical.async.fromURL(calendarUrls(calendarId).icsUrl);
	const events: DistrictEvent[] = [];

	for (const component of Object.values(data)) {
		if (!component || component.type !== 'VEVENT') continue;
		events.push({
			uid: component.uid,
			start: new Date(component.start),
			allDay: component.datetype === 'date' || Boolean(component.start.dateOnly),
			summary: textValue(component.summary),
			location: textValue(component.location),
		});
	}

	return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}

/**
 * All district events (past and future) from the district's public Google Calendar (editable
 * per-block in Tina, defaults to admin@rotaract2050.org), fetched per-request and cached briefly
 * to avoid hammering Google on every homepage view. Callers filter for "upcoming" themselves — a
 * month view still needs past days of the current month.
 *
 * Pass `forceRefresh: true` to bypass the cache (EventsCalendar.astro does this for `?refresh` in
 * the URL) — handy right after editing the calendar, instead of waiting out the TTL.
 */
export async function getDistrictEvents(options?: { calendarId?: string; forceRefresh?: boolean }): Promise<CalendarResult> {
	const calendarId = options?.calendarId || DEFAULT_CALENDAR_ID;
	const now = Date.now();
	if (!options?.forceRefresh && cache && cache.calendarId === calendarId && now - cache.fetchedAt < CACHE_TTL_MS) {
		return { ok: true, events: cache.events };
	}

	try {
		const events = await fetchEvents(calendarId);
		cache = { calendarId, fetchedAt: now, events };
		return { ok: true, events };
	} catch {
		if (cache && cache.calendarId === calendarId) return { ok: true, events: cache.events };
		return { ok: false };
	}
}

/** Local calendar date (Europe/Rome) of an event, as a YYYY-MM-DD key for grouping into day cells. */
export function eventDateKey(event: DistrictEvent): string {
	if (event.allDay) {
		const y = event.start.getFullYear();
		const m = String(event.start.getMonth() + 1).padStart(2, '0');
		const d = String(event.start.getDate()).padStart(2, '0');
		return `${y}-${m}-${d}`;
	}
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Rome',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(event.start);
}
