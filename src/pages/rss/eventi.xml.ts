import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getArchiveEvents } from '../../lib/events';
import { RSS_CHANNELS, eventToRssItem, sortByPubDateDesc } from '../../lib/rss';

const LANG = 'it';

export const GET: APIRoute = async ({ site }) => {
	const events = await getArchiveEvents();
	const items = sortByPubDateDesc(events.map((event) => eventToRssItem(event, LANG)));

	return rss({
		title: RSS_CHANNELS.events[LANG].title,
		description: RSS_CHANNELS.events[LANG].description,
		site: site!,
		trailingSlash: false,
		items,
	});
};
