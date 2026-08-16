import type { TinaMarkdownContent } from 'tinacms/dist/rich-text/static';

// Reimplementation of `sanitizeUrl` from `@tinacms/mdx` (same allowlist/normalization
// logic as tinacms/dist/rich-text/static.js's own `a`/`img` handling), instead of
// importing that package directly. `@tinacms/mdx` pulls in the full remark/mdast MDX
// parsing toolchain; merely having it in a page's static module graph (even unused at
// runtime) throws `ReferenceError: document is not defined` under this project's
// Cloudflare Workers dev runtime (workerd) — confirmed by bisection: swapping this one
// import for a no-op fixed the homepage, which was crashing solely because
// BlockItem.astro statically imports ResourceArchive.astro (used by the formazione
// page) for every page's block-rendering switch, regardless of which blocks a given
// page actually uses.
const ALLOWED_URL_SCHEMES = ['http', 'https', 'mailto', 'tel', 'xref'];
function sanitizeUrl(url: string): string {
	if (!url) return '';
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		// Relative URL (no scheme to validate) — pass through unchanged, same as upstream.
		return url;
	}
	const scheme = parsed.protocol.slice(0, -1);
	if (!ALLOWED_URL_SCHEMES.includes(scheme)) return '';
	if (parsed.pathname === '/') {
		return url.endsWith('/') ? parsed.href : `${parsed.origin}${parsed.search}${parsed.hash}`;
	}
	return parsed.href;
}

// Renders Tina rich-text to an HTML string without going through React/@astrojs/react.
// `<StaticTinaMarkdown content={...} />` (Tina's own React renderer, used as JSX in an
// .astro template) throws `ReferenceError: document is not defined` under this project's
// Cloudflare Workers dev runtime (workerd) — reproducible for every field of this type,
// and severe enough that merely having a component that imports it anywhere in a
// statically-reachable module graph corrupts Astro dev's route table for every route,
// not just the one rendering it (confirmed by isolating it behind a dedicated throwaway
// route: even that alone broke unrelated pages). Root cause not identified after
// investigation — something in @astrojs/react's renderer-selection pipeline, since a
// bare `ReactDOMServer.renderToStaticMarkup()` call with no Astro JSX involved works
// fine on this same runtime.
//
// This is a plain reimplementation of tinacms/dist/rich-text/static.js's node-handling
// switch (react-free), covering the node types Tina's schema can actually produce.
// `sanitizeUrl` is imported from the same `@tinacms/mdx` package Tina's own renderer
// uses for `a`/`img` URLs, so link/image sanitization behaves identically.

type Node = TinaMarkdownContent & { [key: string]: unknown };

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function renderChildren(nodes: Node[] | undefined): string {
	if (!nodes) return '';
	return nodes.map(renderNode).join('');
}

function renderLeaf(node: Node): string {
	let html = escapeHtml(typeof node.text === 'string' ? node.text : '');
	if (node.code) html = `<code>${html}</code>`;
	if (node.strikethrough) html = `<s>${html}</s>`;
	if (node.underline) html = `<u>${html}</u>`;
	if (node.italic) html = `<em>${html}</em>`;
	if (node.bold) html = `<strong>${html}</strong>`;
	return html;
}

function renderCodeBlock(node: Node): string {
	let code = '';
	if (Array.isArray(node.children)) {
		code = (node.children as Node[])
			.map((line) => (Array.isArray(line.children) ? (line.children as Node[]).map((t) => (typeof t.text === 'string' ? t.text : '')).join('') : ''))
			.join('\n');
	} else if (typeof node.value === 'string') {
		code = node.value;
	}
	return `<pre><code>${escapeHtml(code)}</code></pre>`;
}

function renderTable(node: Node): string {
	const rows = (node.children as Node[]) ?? [];
	const rowsHtml = rows
		.map((row) => {
			const cells = (row.children as Node[]) ?? [];
			const cellsHtml = cells.map((cell) => `<td>${renderChildren(cell.children as Node[])}</td>`).join('');
			return `<tr>${cellsHtml}</tr>`;
		})
		.join('');
	return `<table><tbody>${rowsHtml}</tbody></table>`;
}

function renderNode(node: Node): string {
	switch (node.type) {
		case 'h1':
		case 'h2':
		case 'h3':
		case 'h4':
		case 'h5':
		case 'h6':
		case 'p':
		case 'ul':
		case 'ol':
		case 'li':
			return `<${node.type}>${renderChildren(node.children as Node[])}</${node.type}>`;
		case 'lic':
			return renderChildren(node.children as Node[]);
		case 'blockquote':
		case 'block_quote':
			return `<blockquote>${renderChildren(node.children as Node[])}</blockquote>`;
		case 'img': {
			const url = sanitizeUrl(typeof node.url === 'string' ? node.url : '');
			const alt = typeof node.alt === 'string' ? escapeHtml(node.alt) : '';
			return `<img src="${escapeHtml(url)}" alt="${alt}" />`;
		}
		case 'a': {
			const url = sanitizeUrl(typeof node.url === 'string' ? node.url : '');
			return `<a href="${escapeHtml(url)}">${renderChildren(node.children as Node[])}</a>`;
		}
		case 'code_block':
			return renderCodeBlock(node);
		case 'hr':
			return '<hr />';
		case 'break':
			return '<br />';
		case 'text':
			return renderLeaf(node);
		case 'table':
			return renderTable(node);
		case 'html':
		case 'html_inline':
			// CMS-authored raw HTML block from Tina's editor, same as StaticTinaMarkdown's own
			// handling — not arbitrary user input.
			return typeof node.value === 'string' ? node.value : '';
		case 'invalid_markdown':
			return `<pre>${escapeHtml(typeof node.value === 'string' ? node.value : '')}</pre>`;
		case 'maybe_mdx':
			return '';
		default:
			return typeof node.text === 'string' ? renderLeaf(node) : '';
	}
}

export function renderTinaMarkdown(content: TinaMarkdownContent | TinaMarkdownContent[] | null | undefined): string {
	if (!content) return '';
	const nodes = (Array.isArray(content) ? content : (content as Node).children) as Node[] | undefined;
	if (!nodes) return '';
	return nodes.map(renderNode).join('');
}

/**
 * Plain text of a Tina rich-text field, for client-side full-text search over article bodies
 * (see ResourceArchive.astro) — not for display. Strips tags from the same sanitized HTML
 * `renderTinaMarkdown` produces, so it's safe to drop straight into a `data-*` attribute.
 */
export function extractPlainText(content: TinaMarkdownContent | TinaMarkdownContent[] | null | undefined): string {
	return renderTinaMarkdown(content)
		.replace(/<[^>]+>/g, ' ')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
		.replace(/\s+/g, ' ')
		.trim();
}
