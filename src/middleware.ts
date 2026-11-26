import { defineMiddleware } from 'astro:middleware';
import { isEditMode } from '@tinacms/astro/is-edit-mode';
import { trackTinaReads } from './lib/tina-health';

// Last good copy of each public page, for when the Tina backend (one VPS) is unreachable: a page rendered then
// has empty lists or turns into a 404, which is worse than slightly old content. Cache API is per data center and
// may evict, so this is best effort; Workers Cache (astro.config.mjs) still serves the 10-minute fresh copy first.
// shortcut: per-colo Cache API, upgrade to KV if outages last longer than a colo keeps the copies.
const STALE_TTL = 7 * 24 * 60 * 60;
const staleKey = (url: URL) => new Request(`${url.origin}/__last-good${url.pathname}${url.search}`);

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
		if (backendFailed) {
			context.cache.set(false);
			const stale = await cache.match(staleKey(context.url)).catch(() => undefined);
			if (stale) {
				const copy = new Response(stale.body, stale);
				copy.headers.set('X-Last-Good-Copy', '1');
				copy.headers.set('Cache-Control', 'no-store');
				return copy;
			}
		}
		if (result instanceof Error) throw result; // no copy to fall back on: let Astro render its error page
		response = result;
		if (!backendFailed && response.status === 200 && !response.headers.has('Set-Cookie')) {
			const copy = new Response(response.clone().body, response);
			copy.headers.set('Cache-Control', `max-age=${STALE_TTL}`);
			const saved = cache.put(staleKey(context.url), copy).catch(() => {});
			if (context.locals.cfContext) context.locals.cfContext.waitUntil(saved);
			else await saved;
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
