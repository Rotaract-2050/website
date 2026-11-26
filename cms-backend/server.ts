// Self-hosted Tina backend (runs on the District VPS, never on the Worker). Plain node:http: TinaNodeBackend is a
// (req, res) Node handler and only needs `req.body` pre-parsed for /gql.
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { TinaNodeBackend } from '@tinacms/datalayer';
import databaseClient from '../tina/__generated__/databaseClient';
import { Auth } from '@auth/core';
import { AUTH_BASE_PATH, AUTH_URL, authConfig, authProvider } from './auth';
import { readBody as readRaw } from './body';
import { mediaHandler } from './media';
import { isOurPush, queueReindex, validSignature } from './reindex';

const PORT = Number(process.env.PORT || 4001);
const MAX_BODY = 10 * 1024 * 1024;

// `media` rides on TinaNodeBackend's secure extra routes, so it gets the same isAuthorized gate as /gql.
const tina = TinaNodeBackend({
	authProvider: { ...authProvider, extraRoutes: { media: { secure: true, handler: mediaHandler } } },
	databaseClient,
});

const readBody = async (req: IncomingMessage) => (await readRaw(req, MAX_BODY)).toString('utf8');

// Auth.js speaks Web Request/Response: rebuild the request on the public site origin (AUTH_URL), answer, copy back.
async function handleAuth(req: IncomingMessage, res: ServerResponse) {
	const headers = new Headers();
	for (const [k, v] of Object.entries(req.headers)) {
		if (typeof v === 'string' && !['host', 'content-length', 'connection'].includes(k)) headers.set(k, v);
	}
	const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
	const response = await Auth(
		new Request(`${AUTH_URL}${req.url}`, { method: req.method, headers, body: hasBody ? await readBody(req) : undefined }),
		authConfig,
	);
	res.statusCode = response.status;
	response.headers.forEach((v, k) => k !== 'set-cookie' && res.setHeader(k, v));
	const cookies = response.headers.getSetCookie();
	if (cookies.length) res.setHeader('Set-Cookie', cookies);
	res.end(Buffer.from(await response.arrayBuffer()));
}

function send(res: ServerResponse, status: number, body: unknown) {
	res.statusCode = status;
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
	const path = new URL(req.url || '/', 'http://localhost').pathname;
	try {
		if (path === '/health') return send(res, 200, { ok: true });
		if (path === '/api/hooks/github' && req.method === 'POST') {
			const raw = await readBody(req);
			const signature = req.headers['x-hub-signature-256'];
			if (!validSignature(raw, typeof signature === 'string' ? signature : undefined)) {
				return send(res, 401, { error: 'bad signature' });
			}
			const event = req.headers['x-github-event'];
			if (!isOurPush(typeof event === 'string' ? event : undefined, raw)) return send(res, 200, { ignored: true });
			queueReindex();
			return send(res, 202, { queued: true });
		}
		if (path.startsWith(`${AUTH_BASE_PATH}/`)) return await handleAuth(req, res);
		if (!path.startsWith('/api/tina/')) return send(res, 404, { error: 'not found' });

		if (req.method === 'POST' && (req.headers['content-type'] || '').includes('application/json')) {
			const raw = await readBody(req);
			(req as IncomingMessage & { body?: unknown }).body = raw ? JSON.parse(raw) : {};
		}
		res.setHeader('Content-Type', 'application/json');
		await tina(req, res);
	} catch (e) {
		const status = (e as { status?: number }).status || (e instanceof SyntaxError ? 400 : 500);
		if (status === 500) console.error(e);
		if (!res.headersSent) send(res, status, { error: status === 500 ? 'internal error' : (e as Error).message });
	}
});

server.listen(PORT, () => console.log(`tina backend listening on :${PORT}`));
