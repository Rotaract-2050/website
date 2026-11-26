import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';

// Same-origin proxy between the Tina admin (browser) and the self-hosted backend on the VPS. The backend sits
// behind Cloudflare Access and only accepts the Worker's service token, so editors never reach it directly;
// keeping everything on this origin also keeps the Auth.js session cookie first-party.
// Not cached: middleware.ts opts every /api/* response out of the Workers Cache.
export const ALL: APIRoute = async ({ request, params, url }) => {
	if (!env.TINA_BACKEND_URL) return new Response('Tina backend not configured', { status: 503 });

	const headers = new Headers(request.headers);
	headers.delete('host');
	headers.set('CF-Access-Client-Id', env.CF_ACCESS_CLIENT_ID);
	headers.set('CF-Access-Client-Secret', env.CF_ACCESS_CLIENT_SECRET);

	const target = `${env.TINA_BACKEND_URL}/api/tina/${params.path ?? ''}${url.search}`;
	const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
	try {
		const upstream = await fetch(target, {
			method: request.method,
			headers,
			body: hasBody ? request.body : undefined,
			// Auth.js answers sign-in/callback with redirects (and Set-Cookie): hand them to the browser untouched.
			redirect: 'manual',
		});
		return new Response(upstream.body, upstream);
	} catch {
		return new Response(JSON.stringify({ error: 'Tina backend unreachable' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
