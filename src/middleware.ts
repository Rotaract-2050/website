import { defineMiddleware } from 'astro:middleware';
import { isEditMode } from '@tinacms/astro/is-edit-mode';
import { trackTinaReads } from './lib/tina-health';

// Last good copy of each public page, for when the Tina backend (one VPS) is unreachable: a page rendered then
// has empty lists or turns into a 404, which is worse than slightly old content. Cache API is per data center and
// may evict, so this is best effort; Workers Cache (astro.config.mjs) still serves the 10-minute fresh copy first.
// shortcut: per-colo Cache API, upgrade to KV if outages last longer than a colo keeps the copies.
const STALE_TTL = 7 * 24 * 60 * 60;
// Query params that change what a page renders (events archive/calendar filters). Anything else (utm_*, fbclid…)
// maps to the same copy, and only requests made of these params get saved, so random query strings can't fill
// the cache with copies.
// Values validated with the same formats the blocks accept (EventsArchive, EventsCalendar), so `?anno=1`, `?anno=2`…
// can't create copies either.
const PAGE_PARAMS: Record<string, RegExp> = {
	anno: /^\d{4}-\d{4}$/,
	day: /^\d{4}-\d{2}-\d{2}$/,
	month: /^\d{4}-\d{2}$/,
	kind: /^(all|rotaract|interact|rotary|scadenze)$/,
};
const IGNORED_PARAMS = /^(utm_|mc_)|^(fbclid|gclid|msclkid|refresh)$/;
function staleKey(url: URL): { key: Request; saveable: boolean } {
	const kept = new URLSearchParams();
	let saveable = true;
	for (const [k, v] of [...url.searchParams].sort(([a], [b]) => a.localeCompare(b))) {
		if (Object.hasOwn(PAGE_PARAMS, k)) {
			kept.append(k, v);
			if (!PAGE_PARAMS[k].test(v)) saveable = false;
		} else if (!IGNORED_PARAMS.test(k)) saveable = false;
	}
	const search = kept.size ? `?${kept}` : '';
	return { key: new Request(`${url.origin}/__last-good${url.pathname}${search}`), saveable };
}
let warnedNoWaitUntil = false;

// Opt-outs from the Workers Cache route rules in astro.config.mjs, plus the last-good-copy fallback.
export const onRequest = defineMiddleware(async (context, next) => {
	const editMode = isEditMode(context.request);
	const isApi = context.url.pathname.startsWith('/api/');
	// API responses are per-request; Tina edit-mode pages carry editor markup that must never reach visitors.
	if (editMode || isApi) context.cache.set(false);
	const publicPage = context.request.method === 'GET' && !editMode && !isApi && typeof caches !== 'undefined';

	let response: Response;
	if (publicPage) {
		// Buffer the page: components query Tina while the body streams, so only a fully rendered page tells
		// whether a read failed.
		// A render can also throw outright when the data it expected never came (e.g. no settings document).
		const { result, backendFailed } = await trackTinaReads(async () => {
			try {
				const r = await next();
				return new Response(await r.arrayBuffer(), r);
			} catch (error) {
				return error as Error;
			}
		});
		const cache = (caches as unknown as { default: Cache }).default;
		const { key, saveable } = staleKey(context.url);
		if (backendFailed) {
			context.cache.set(false);
			const stale = await cache.match(key).catch(() => undefined);
			// Logged so an outage (or an expired Access service token, which looks the same) shows up in Workers logs
			// instead of hiding behind week-old pages.
			if (stale) {
				console.warn('[last-good] CMS unreachable, served last good copy', context.url.pathname);
				const copy = new Response(stale.body, stale);
				copy.headers.set('X-Last-Good-Copy', '1');
				copy.headers.set('Cache-Control', 'no-store');
				return copy;
			}
			console.error('[last-good] CMS unreachable, no copy to serve', context.url.pathname);
		}
		if (result instanceof Error) throw result; // no copy to fall back on: let Astro render its error page
		response = result;
		if (!backendFailed && saveable && response.status === 200 && !response.headers.has('Set-Cookie')) {
			// The site sets no per-request headers (no CSP nonce, no cookies on pages), so the copy is safe to replay.
			const copy = new Response(response.clone().body, response);
			copy.headers.set('Cache-Control', `max-age=${STALE_TTL}`);
			const saved = cache.put(key, copy).catch(() => {});
			if (context.locals.cfContext) context.locals.cfContext.waitUntil(saved);
			else {
				if (!warnedNoWaitUntil) console.warn('[last-good] no cfContext.waitUntil, saving copies inline');
				warnedNoWaitUntil = true;
				await saved;
			}
		}
	} else {
		response = await next();
	}

	// Only cache successes: a 404/500 from a transient Tina outage would otherwise stick for the whole TTL.
	if (response.status !== 200) context.cache.set(false);

	// Edit mode is detected from Sec-Fetch-Dest (iframe inside /admin), which the cache key ignores:
	// without Vary the Tina iframe would be served the cached public page and lose click-to-edit.
	// Error pages re-enter the middleware, hence the check.
	if (!response.headers.get('Vary')?.includes('Sec-Fetch-Dest')) {
		try {
			response.headers.append('Vary', 'Sec-Fetch-Dest');
		} catch {
			// Redirect responses have immutable headers; they're never cached anyway (non-200).
		}
	}
	return response;
});
