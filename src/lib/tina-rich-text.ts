import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { StaticTinaMarkdown } from 'tinacms/dist/rich-text/static';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text/static';

// Renders Tina rich-text to a sanitized HTML string via a direct react-dom/server call
// instead of `<StaticTinaMarkdown content={...} />` as JSX in an .astro template. The
// JSX form goes through @astrojs/react's automatic renderer-selection pipeline, which
// throws `ReferenceError: document is not defined` under this project's Cloudflare
// Workers dev runtime (workerd) — reproducible for every field of this type, unrelated
// to which page renders it (confirmed by isolating a raw `ReactDOMServer.renderToStaticMarkup`
// call, which works fine outside that pipeline). Calling react-dom/server directly here
// sidesteps the broken pipeline while still using Tina's own sanitizing renderer
// (StaticTinaMarkdown escapes/sanitizes URLs internally) — this is CMS-authored content
// through Tina's official renderer, not arbitrary unsanitized HTML.
export function renderTinaMarkdown(content: TinaMarkdownContent | TinaMarkdownContent[] | null | undefined): string {
	if (!content) return '';
	return ReactDOMServer.renderToStaticMarkup(React.createElement(StaticTinaMarkdown, { content }));
}

/**
 * Plain text of a Tina rich-text field, for client-side full-text search over article bodies
 * (see ResourceArchive.astro) — not for display. Strips tags from the same sanitized HTML
 * `renderTinaMarkdown` produces, so it's safe to drop straight into a `data-*` attribute.
 */
export function extractPlainText(content: TinaMarkdownContent | TinaMarkdownContent[] | null | undefined): string {
	return renderTinaMarkdown(content)
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}
