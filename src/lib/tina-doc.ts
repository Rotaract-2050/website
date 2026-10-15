import { requestWithMetadata } from '@tinacms/astro';

export type TinaDocResult = Awaited<ReturnType<typeof requestWithMetadata<any>>>;

/**
 * Fetch one Tina document for a page's frontmatter. Returns the full `requestWithMetadata` result (needed by
 * `tinaField` visual editing) or `null` if the document does not exist.
 *
 * Why in page frontmatter: `Astro.rewrite()` / status / headers only work before the response starts streaming,
 * so a "not found" decision made inside a component produces a blank 200. Pages call this, then
 * `return Astro.rewrite(<404 url>)` on null, and pass the result to the view component as a prop.
 *
 * `requestWithMetadata` logs a warning and returns `undefined` for a missing doc (it does not throw); the
 * try/catch covers the case where it does throw.
 */
export async function fetchTinaDoc(request: Promise<any>, key: string): Promise<TinaDocResult | null> {
	try {
		const r = await requestWithMetadata(request, { priority: 'primary' });
		return r?.data?.[key] ? r : null;
	} catch {
		return null;
	}
}
