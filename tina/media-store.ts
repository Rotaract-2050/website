import { sanitizeFilename } from 'tinacms';
import type { Media, MediaList, MediaListOptions, MediaStore, MediaUploadOptions } from 'tinacms';

// Admin side of the repo-backed media store served by cms-backend/media.ts (Tina's own `media.tina` only works
// with Tina Cloud). Same layout and same `/uploads/...` paths saved in content as before.
const BASE = '/api/tina/media';

const clean = (dir: string) => dir.replace(/^\/+|\/+$/g, '');
const encodePath = (path: string) => path.split('/').map(encodeURIComponent).join('/');

async function ok<T>(res: Response): Promise<T> {
	if (!res.ok) {
		const body = (await res.json().catch(() => null)) as { message?: string } | null;
		throw new Error(body?.message || `Media request failed (${res.status})`);
	}
	return res.json() as Promise<T>;
}

export class RepoMediaStore implements MediaStore {
	accept = 'image/*,application/pdf';
	maxSize = 20 * 1024 * 1024;

	async persist(files: MediaUploadOptions[]): Promise<Media[]> {
		const uploaded: Media[] = [];
		for (const { directory, file } of files) {
			const dir = clean(directory);
			const path = encodePath(dir ? `${dir}/${sanitizeFilename(file.name)}` : sanitizeFilename(file.name));
			uploaded.push(await ok<Media>(await fetch(`${BASE}/upload/${path}`, { method: 'POST', body: file })));
		}
		return uploaded;
	}

	async delete(media: Media): Promise<void> {
		const dir = clean(media.directory);
		await ok(await fetch(`${BASE}/file/${encodePath(dir ? `${dir}/${media.filename}` : media.filename)}`, { method: 'DELETE' }));
	}

	async list(options?: MediaListOptions): Promise<MediaList> {
		const q = new URLSearchParams({
			directory: clean(options?.directory || ''),
			limit: String(options?.limit || 20),
			offset: String(options?.offset || 0),
		});
		const list = await ok<MediaList>(await fetch(`${BASE}/list?${q}`));
		return options?.filesOnly ? { ...list, items: list.items.filter((i) => i.type === 'file') } : list;
	}
}
