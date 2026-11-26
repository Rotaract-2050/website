import { defineMiddleware } from 'astro:middleware';
import { isEditMode } from '@tinacms/astro/is-edit-mode';

// Opt-outs from the Workers Cache route rules in astro.config.mjs.
export const onRequest = defineMiddleware(async (context, next) => {
	// API responses are per-request; Tina edit-mode pages carry editor markup that must never reach visitors.
	if (isEditMode(context.request) || context.url.pathname.startsWith('/api/')) context.cache.set(false);

	const response = await next();
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
