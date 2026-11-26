import { AbstractAuthProvider } from 'tinacms';

// Admin-side login for the self-hosted backend: Google Workspace through Auth.js (cms-backend/auth.ts), talking
// to Auth.js's REST endpoints directly. tinacms-authjs would do the same through next-auth/react, at the cost of
// `next` + `next-auth` as peer dependencies of an Astro project; these few fetches are all it does for us.
const BASE = '/api/tina/auth';

type SessionUser = { name?: string | null; email?: string | null; image?: string | null };

async function csrfToken(): Promise<string> {
	const res = await fetch(`${BASE}/csrf`);
	return ((await res.json()) as { csrfToken: string }).csrfToken;
}

// X-Auth-Return-Redirect makes Auth.js answer with { url } instead of a 302 that fetch could not follow cross-origin.
async function postForRedirect(action: string, fields: Record<string, string>): Promise<string> {
	const res = await fetch(`${BASE}/${action}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Auth-Return-Redirect': '1' },
		body: new URLSearchParams({ ...fields, csrfToken: await csrfToken() }),
	});
	return ((await res.json()) as { url: string }).url;
}

export class GoogleAuthJSProvider extends AbstractAuthProvider {
	async authenticate() {
		window.location.href = await postForRedirect('signin/google', { callbackUrl: window.location.href });
		// The page is navigating away to Google; never resolve so the admin doesn't flash an error meanwhile.
		return new Promise(() => {});
	}

	getToken() {
		// Session lives in an http-only cookie on this origin; no bearer token to attach.
		return Promise.resolve({ id_token: '' });
	}

	async getUser(): Promise<SessionUser | false> {
		const res = await fetch(`${BASE}/session`);
		if (!res.ok) return false;
		const session = (await res.json()) as { user?: SessionUser } | null;
		return session?.user || false;
	}

	async authorize() {
		return this.getUser();
	}

	async logout() {
		await postForRedirect('signout', { callbackUrl: '/admin/index.html' });
		window.location.href = '/admin/index.html';
	}
}
