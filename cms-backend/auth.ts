import { timingSafeEqual } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import { Auth, type AuthConfig } from '@auth/core';
import Google from '@auth/core/providers/google';
import type { BackendAuthProvider } from '@tinacms/datalayer';
import { parse, type DocumentNode } from 'graphql';
import { isEditor } from './editors-db';

function required(name: string, minLength = 1): string {
	const v = process.env[name] || '';
	if (v.length < minLength) throw new Error(`${name} missing${minLength > 1 ? ` or shorter than ${minLength} chars` : ''}`);
	return v;
}

const READ_TOKEN = required('TINA_READ_TOKEN', 32);
// Public origin of the site this backend serves (prod or the preview alias). Auth.js builds its callback URLs from
// it; taken from config instead of request headers so nothing a client sends can redirect the OAuth flow.
export const AUTH_URL = new URL(required('AUTH_URL')).origin;
const ALLOWED_DOMAIN = (process.env.ALLOWED_GOOGLE_DOMAIN || 'rotaract2050.org').toLowerCase();
// EDITORS=domain: every verified account of ALLOWED_DOMAIN may edit (District decision, 2026-11-26).
// EDITORS=allowlist (default): only the emails in Mongo cms_editors, see editors.ts.
const WHOLE_DOMAIN = process.env.EDITORS === 'domain';

const inDomain = (email: string | null | undefined) => !!email && email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
const canEdit = async (email: string | null | undefined) => inDomain(email) && (WHOLE_DOMAIN || (await isEditor(email)));

export const AUTH_BASE_PATH = '/api/tina/auth';

export const authConfig: AuthConfig = {
	basePath: AUTH_BASE_PATH,
	secret: required('AUTH_SECRET', 32),
	trustHost: true, // requests are rebuilt on AUTH_URL in server.ts, so the "host" Auth.js sees is ours
	// Whole-domain mode has no list to remove someone from: access ends when their Workspace account is suspended,
	// and a session outlives that by at most maxAge, so keep it to a day there.
	session: { strategy: 'jwt', maxAge: (WHOLE_DOMAIN ? 1 : 7) * 24 * 60 * 60 },
	providers: [
		Google({
			clientId: required('AUTH_GOOGLE_ID'),
			clientSecret: required('AUTH_GOOGLE_SECRET'),
			// `hd` only preselects the Workspace account in Google's picker; the real check is in signIn below.
			authorization: { params: { hd: ALLOWED_DOMAIN, prompt: 'select_account' } },
		}),
	],
	callbacks: {
		async signIn({ account, profile }) {
			return (
				account?.provider === 'google' &&
				profile?.email_verified === true &&
				String(profile.hd || '').toLowerCase() === ALLOWED_DOMAIN &&
				(await canEdit(profile.email))
			);
		},
	},
};

function sameSecret(a: string, b: string) {
	const x = Buffer.from(a);
	const y = Buffer.from(b);
	return x.length === y.length && timingSafeEqual(x, y);
}

/** True only for a document made of query operations (plus fragments): no mutation, no subscription. */
export function isReadOnly(query: unknown): boolean {
	if (typeof query !== 'string') return false;
	let doc: DocumentNode;
	try {
		doc = parse(query);
	} catch {
		return false;
	}
	return doc.definitions.every(
		(d) => d.kind === 'FragmentDefinition' || (d.kind === 'OperationDefinition' && d.operation === 'query'),
	);
}

async function sessionEmail(req: IncomingMessage): Promise<string | null> {
	const res = await Auth(
		new Request(`${AUTH_URL}${AUTH_BASE_PATH}/session`, { headers: { cookie: req.headers.cookie || '' } }),
		authConfig,
	);
	if (!res.ok) return null;
	const session = (await res.json().catch(() => null)) as { user?: { email?: string } } | null;
	return session?.user?.email || null;
}

type Req = IncomingMessage & { body?: { query?: unknown } };

export const authProvider: BackendAuthProvider = {
	isAuthorized: async (req: Req) => {
		// The Worker's runtime reads: read-only token, and only for query documents.
		const key = req.headers['x-api-key'];
		if (typeof key === 'string' && sameSecret(key, READ_TOKEN)) {
			return isReadOnly(req.body?.query)
				? { isAuthorized: true }
				: { isAuthorized: false, errorCode: 403, errorMessage: 'read token cannot run mutations' };
		}
		// Editors in the admin: Google session cookie. Allowlist re-checked on every request, so removing an editor
		// takes effect immediately instead of when their session expires.
		const email = await sessionEmail(req);
		if (!email) return { isAuthorized: false, errorCode: 401, errorMessage: 'Unauthorized' };
		if (!(await canEdit(email))) return { isAuthorized: false, errorCode: 403, errorMessage: 'Forbidden' };
		return { isAuthorized: true };
	},
};
