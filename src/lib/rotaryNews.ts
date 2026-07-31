export interface RotaryNewsItem {
	title: string;
	link: string;
	pubDate: Date;
}

export type RotaryNewsResult = { ok: true; items: RotaryNewsItem[] } | { ok: false };

/**
 * REFRESH CADENCE — how often the ticker's content actually changes:
 *
 * 1. This module holds an in-memory cache with a 30-minute TTL, refreshed on the next
 *    request after it expires. That's a best-effort optimization only: the site runs as
 *    Netlify Functions (`output: 'server'` in astro.config.mjs), and serverless function
 *    instances get recycled/cold-started outside our control. On a low-traffic site most
 *    requests likely hit a cold instance (module-level `cache` reset to null), so in
 *    practice every request may re-fetch — there is no cross-request guarantee here.
 * 2. That re-fetch is itself bounded by rotary.org's own CDN: as of writing, rotary.org/rss.xml
 *    is served with `Cache-Control: public, max-age=14400` (4 hours) — so regardless of how
 *    often *we* poll it, the feed's actual content does not change more often than every ~4h.
 *
 * Net effect: expect new Rotary International items to show up within a few hours of
 * publication, not instantly — there is no push/webhook, only polling on page view. No
 * rebuild or deploy is needed for new items to appear (unlike Tina-edited content, this
 * block's data never touches the git repo).
 */
const CACHE_TTL_MS = 30 * 60 * 1000;
let cache: { feedUrl: string; fetchedAt: number; items: RotaryNewsItem[] } | null = null;

function extractTag(block: string, tag: string): string {
	const match = block.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))<\\/${tag}>`));
	return (match?.[1] ?? match?.[2] ?? '').trim();
}

/**
 * Minimal RSS 2.0 item parser. The feed this block targets (rotary.org, and similar
 * WordPress/CMS RSS exports) only needs title/link/pubDate, so a small regex extractor
 * avoids pulling in a full XML parser dependency for three flat fields.
 */
function parseRssItems(xml: string): RotaryNewsItem[] {
	const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

	return blocks
		.map((block) => ({
			title: extractTag(block, 'title'),
			link: extractTag(block, 'link'),
			pubDate: new Date(extractTag(block, 'pubDate')),
		}))
		.filter((item): item is RotaryNewsItem => Boolean(item.title) && Boolean(item.link) && !Number.isNaN(item.pubDate.getTime()))
		.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

async function fetchFeed(feedUrl: string): Promise<RotaryNewsItem[]> {
	const response = await fetch(feedUrl);
	if (!response.ok) throw new Error(`Feed responded ${response.status}`);
	return parseRssItems(await response.text());
}

/**
 * Latest items from an external RSS feed (default: Rotary International's rotary.org/rss.xml),
 * fetched per-request and cached briefly to avoid hammering the source on every homepage view.
 * Items without a parsable pubDate (some feeds mix in evergreen/nav entries alongside dated
 * articles) are dropped so only genuine dated news survives, then sorted newest first.
 */
export async function getRotaryNews(feedUrl: string, limit: number): Promise<RotaryNewsResult> {
	const now = Date.now();
	if (cache && cache.feedUrl === feedUrl && now - cache.fetchedAt < CACHE_TTL_MS) {
		return { ok: true, items: cache.items.slice(0, limit) };
	}

	try {
		const items = await fetchFeed(feedUrl);
		cache = { feedUrl, fetchedAt: now, items };
		return { ok: true, items: items.slice(0, limit) };
	} catch {
		if (cache && cache.feedUrl === feedUrl) return { ok: true, items: cache.items.slice(0, limit) };
		return { ok: false };
	}
}
