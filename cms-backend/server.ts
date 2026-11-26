// Self-hosted Tina backend (runs on the District VPS, never on the Worker). Plain node:http: TinaNodeBackend is a
// (req, res) Node handler and only needs `req.body` pre-parsed for /gql.
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { TinaNodeBackend } from '@tinacms/datalayer';
import databaseClient from '../tina/__generated__/databaseClient';
import { Auth } from '@auth/core';
import { AUTH_BASE_PATH, AUTH_URL, authConfig, authProvider } from './auth';

const PORT = Number(process.env.PORT || 4001);
const MAX_BODY = 10 * 1024 * 1024;

const tina = TinaNodeBackend({ authProvider, databaseClient });

function readBody(req: IncomingMessage): Promise<string> {
	return new Promise((resolve, reject) => {
		let size = 0;
		const chunks: Buffer[] = [];
		req.on('data', (c: Buffer) => {
			size += c.length;
			if (size > MAX_BODY) {
				reject(Object.assign(new Error('body too large'), { status: 413 }));
				req.destroy();
			} else chunks.push(c);
		});
		req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
		req.on('error', reject);
	});
}

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
