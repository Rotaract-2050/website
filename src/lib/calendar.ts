import ical from 'node-ical';
import type { ParameterValue } from 'node-ical';

const ICS_URL = 'https://calendar.google.com/calendar/ical/admin%40rotaract2050.org/public/basic.ics';
export const CALENDAR_VIEW_URL = 'https://calendar.google.com/calendar/embed?src=admin%40rotaract2050.org&ctz=Europe%2FRome';
export const CALENDAR_SUBSCRIBE_URL = 'https://calendar.google.com/calendar/render?cid=admin%40rotaract2050.org';

export interface DistrictEvent {
	uid: string;
	start: Date;
	allDay: boolean;
	summary: string;
	location: string;
}

export type CalendarResult = { ok: true; events: DistrictEvent[] } | { ok: false };

const CACHE_TTL_MS = 15 * 60 * 1000;
let cache: { fetchedAt: number; events: DistrictEvent[] } | null = null;

function textValue(value: ParameterValue | undefined): string {
	if (!value) return '';
	return typeof value === 'string' ? value : value.val;
}

async function fetchEvents(): Promise<DistrictEvent[]> {
	const data = await ical.async.fromURL(ICS_URL);
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

/** All district events (past and future) from the public Google Calendar (admin@rotaract2050.org), fetched per-request and cached briefly to avoid hammering Google on every homepage view. Callers filter for "upcoming" themselves — a month view still needs past days of the current month. */
export async function getDistrictEvents(): Promise<CalendarResult> {
	const now = Date.now();
	if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
		return { ok: true, events: cache.events };
	}

	try {
		const events = await fetchEvents();
		cache = { fetchedAt: now, events };
		return { ok: true, events };
	} catch {
		if (cache) return { ok: true, events: cache.events };
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
