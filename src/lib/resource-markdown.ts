import { marked } from 'marked';

/**
 * Resolves a wikilink target slug to a real URL + fallback label, or `undefined` if the slug
 * doesn't match any known resource (the link then degrades to plain text instead of a 404).
 */
export type WikilinkResolver = (slug: string) => { href: string; label: string } | undefined;

const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/**
 * Resources are authored as plain Markdown (not the site's usual Tina rich-text/WYSIWYG field —
 * see `tina/config.ts`'s `resources.body` description), specifically so editors can type
 * `[[slug]]` / `[[slug|Custom label]]` wikilinks to cross-reference other cards inline while
 * writing, the way a wiki works. This resolves those into ordinary Markdown links before handing
 * the text to `marked`, so from there on they're indistinguishable from a normal `[text](url)`
 * link (same escaping, same rendering).
 */
function resolveWikilinks(markdown: string, resolve: WikilinkResolver): string {
	return markdown.replace(WIKILINK_RE, (_match, rawSlug: string, explicitLabel?: string) => {
		const slug = rawSlug.trim();
		const target = resolve(slug);
		if (!target) return explicitLabel?.trim() ?? slug; // unknown slug: fall back to plain text rather than a broken link
		const label = explicitLabel?.trim() || target.label;
		return `[${label}](${target.href})`;
	});
}

/**
 * Renders a resource's Markdown body to HTML, wikilinks resolved first. `marked` output is CMS
 * editor-authored content (same trust level as the site's other rich-text fields, which also
 * pass raw HTML through untouched — see `renderTinaMarkdown` in `lib/tina-rich-text.ts`), so
 * `set:html`-ing this string at the call site is the same sanctioned exception, not a new one.
 */
export function renderResourceMarkdown(markdown: string | null | undefined, resolve: WikilinkResolver): string {
	if (!markdown) return '';
	const withLinks = resolveWikilinks(markdown, resolve);
	return marked.parse(withLinks, { async: false }) as string;
}

/**
 * Plain text of a resource's Markdown body, for the archive's client-side search (see
 * ResourceArchive.astro) — not for display. Resolves wikilinks first (so a linked card's title
 * is searchable too), then strips Markdown syntax lightly; doesn't need to be pretty, only to
 * contain the real words.
 */
export function extractResourcePlainText(markdown: string | null | undefined, resolve: WikilinkResolver): string {
	if (!markdown) return '';
	return resolveWikilinks(markdown, resolve)
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[#>*_`~]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}
