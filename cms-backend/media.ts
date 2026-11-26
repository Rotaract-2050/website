import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { readBody } from './body';

// Repo-backed media for the self-hosted admin (Tina refuses `media.tina` without Tina Cloud). Files stay in
// public/uploads/ of the website repo, as before: uploads and deletes are commits through the GitHub contents API,
// mirrored at once into this container's checkout so the media manager lists and previews them before the next
// sync. The site serves them as static assets after its next deploy, exactly like Tina Cloud's repo media did.
// Mounted by TinaNodeBackend as a secure extra route: only signed-in editors get here (see auth.ts).

const UPLOADS = resolve('public/uploads');
const MAX_UPLOAD = 20 * 1024 * 1024;
const TYPES: Record<string, string> = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.avif': 'image/avif',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.pdf': 'application/pdf',
};
export const ACCEPTED_EXTENSIONS = Object.keys(TYPES);

const GH = {
	owner: process.env.GITHUB_OWNER || 'Rotaract-2050',
	repo: process.env.GITHUB_REPO || 'website',
	branch: process.env.GITHUB_BRANCH || 'main',
	token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN || '',
};

class HttpError extends Error {
	constructor(
		readonly status: number,
		message: string,
	) {
		super(message);
	}
}

/**
 * Turn a client-supplied path into a safe one inside public/uploads: no "." / ".." / hidden segments, no
 * backslashes or control characters, and it must resolve under public/uploads. Lenient on purpose, since existing
 * files have spaces and parentheses; new names go through safeFilename. Returns the path relative to public/uploads.
 */
export function safeRelative(input: string): string {
	let decoded: string;
	try {
		decoded = decodeURIComponent(input);
	} catch {
		throw new HttpError(400, 'invalid path encoding');
	}
	const segments = decoded.split('/').filter(Boolean);
	for (const s of segments) {
		if (s.startsWith('.') || /[\\\x00-\x1f\x7f]/.test(s)) throw new HttpError(400, `invalid path segment "${s}"`);
	}
	const rel = segments.join('/');
	const abs = resolve(UPLOADS, rel);
	if (abs !== UPLOADS && !abs.startsWith(UPLOADS + sep)) throw new HttpError(400, 'path escapes uploads');
	return rel;
}

/** Same spirit as Tina's own sanitizeFilename: spaces → dashes, anything outside the safe set dropped, lowercase ext. */
export function safeFilename(name: string): string {
	const ext = extname(name).toLowerCase();
	const base = name
		.slice(0, name.length - ext.length)
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/\s+/g, '-')
		.replace(/[^A-Za-z0-9._-]/g, '')
		.replace(/-+/g, '-')
		.replace(/^[.-]+|[.-]+$/g, '');
	if (!TYPES[ext]) throw new HttpError(415, `file type ${ext || '(none)'} not allowed`);
	return `${base || 'file'}${ext}`;
}

const toMedia = (directory: string, filename: string) => {
	const rel = directory ? `${directory}/${filename}` : filename;
	// src is what gets saved in content (served by the site); the preview goes through the backend, so a file
	// uploaded a minute ago shows up before the site has redeployed.
	const preview = encodeURI(`/api/tina/media/raw/${rel}`);
	return {
		type: 'file' as const,
		id: rel,
		filename,
		directory,
		src: `/uploads/${rel}`,
		thumbnails: { '75x75': preview, '400x400': preview, '1000x1000': preview },
	};
};

async function github(method: string, path: string, body?: unknown) {
	if (!GH.token) throw new HttpError(503, 'GitHub token not configured');
	const res = await fetch(`https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/public/uploads/${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${GH.token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'rotaract2050-cms',
		},
		body: body ? JSON.stringify(body) : undefined,
	});
	if (res.status === 404 && method === 'GET') return null;
	if (!res.ok) throw new HttpError(502, `GitHub ${method} ${res.status}: ${(await res.text()).slice(0, 200)}`);
	return res.json() as Promise<{ sha?: string }>;
}

async function currentSha(rel: string): Promise<string | undefined> {
	const meta = await github('GET', `${rel}?ref=${encodeURIComponent(GH.branch)}`);
	return meta?.sha;
}

async function list(url: URL) {
	const directory = safeRelative(url.searchParams.get('directory') || '');
	const offset = Math.max(0, Number(url.searchParams.get('offset')) || 0);
	const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 20));
	const entries = await readdir(join(UPLOADS, directory), { withFileTypes: true }).catch(() => []);
	const visible = entries.filter((e) => !e.name.startsWith('.'));
	const dirs = visible.filter((e) => e.isDirectory()).map((e) => e.name).sort();
	const files = visible.filter((e) => e.isFile() && TYPES[extname(e.name).toLowerCase()]).map((e) => e.name).sort();
	const all = [
		...dirs.map((name) => ({ type: 'dir' as const, id: directory ? `${directory}/${name}` : name, filename: name, directory })),
		...files.map((name) => toMedia(directory, name)),
	];
	const items = all.slice(offset, offset + limit);
	return { items, nextOffset: offset + limit < all.length ? offset + limit : undefined };
}

async function upload(req: IncomingMessage, rawPath: string) {
	const parts = safeRelative(rawPath).split('/');
	const filename = safeFilename(parts.pop() || '');
	const directory = parts.join('/');
	const rel = directory ? `${directory}/${filename}` : filename;
	const content = await readBody(req, MAX_UPLOAD);
	if (!content.length) throw new HttpError(400, 'empty file');
	await github('PUT', rel, {
		message: `Upload ${rel} with TinaCMS`,
		content: content.toString('base64'),
		branch: GH.branch,
		sha: await currentSha(rel), // overwrite when a file with that name already exists
	});
	await mkdir(join(UPLOADS, directory), { recursive: true });
	await writeFile(join(UPLOADS, rel), content);
	return toMedia(directory, filename);
}

async function remove(rawPath: string) {
	const rel = safeRelative(rawPath);
	const sha = await currentSha(rel);
	if (sha) await github('DELETE', rel, { message: `Delete ${rel} with TinaCMS`, sha, branch: GH.branch });
	await rm(join(UPLOADS, rel), { force: true });
	return { ok: true };
}

function json(res: ServerResponse, status: number, body: unknown) {
	res.statusCode = status;
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(body));
}

/** TinaNodeBackend extra route `media`: /api/tina/media/{list,raw/<path>,upload/<path>,file/<path>}. */
export async function mediaHandler(req: IncomingMessage, res: ServerResponse): Promise<void> {
	const url = new URL(req.url || '/', 'http://localhost');
	const [, action = '', ...rest] = url.pathname.replace(/^\/api\/tina\//, '').split('/');
	const path = rest.join('/');
	try {
		if (req.method === 'GET' && action === 'list') return json(res, 200, await list(url));
		if (req.method === 'GET' && action === 'raw') {
			const rel = safeRelative(path);
			const type = TYPES[extname(rel).toLowerCase()];
			if (!type) throw new HttpError(404, 'not found');
			const data = await readFile(join(UPLOADS, rel)).catch(() => null);
			if (!data) throw new HttpError(404, 'not found');
			res.statusCode = 200;
			res.setHeader('Content-Type', type);
			// SVG/PDF served from the site's origin: never let them run as a document there.
			res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox");
			res.setHeader('X-Content-Type-Options', 'nosniff');
			res.setHeader('Cache-Control', 'private, max-age=60');
			res.end(data);
			return;
		}
		if (req.method === 'POST' && action === 'upload') return json(res, 200, await upload(req, path));
		if (req.method === 'DELETE' && action === 'file') return json(res, 200, await remove(path));
		throw new HttpError(404, 'not found');
	} catch (e) {
		const status = e instanceof HttpError ? e.status : (e as { status?: number }).status || 500;
		if (status >= 500) console.error(e);
		json(res, status, { message: status >= 500 && !(e instanceof HttpError) ? 'internal error' : (e as Error).message });
	}
}
