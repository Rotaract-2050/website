import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getArchiveEvents } from '../../lib/events';
import { getDistrictNews } from '../../lib/news';
import { RSS_CHANNELS, NEWS_FEED_LIMIT, eventToRssItem, newsToRssItem, sortByPubDateDesc } from '../../lib/rss';

const LANG = 'en';

export const GET: APIRoute = async ({ site }) => {
	const [events, news] = await Promise.all([getArchiveEvents(), getDistrictNews(NEWS_FEED_LIMIT)]);
	const items = sortByPubDateDesc([
		...events.map((event) => eventToRssItem(event, LANG)),
		...news.map((article) => newsToRssItem(article, LANG)),
	]);

	return rss({
		title: RSS_CHANNELS.combined[LANG].title,
		description: RSS_CHANNELS.combined[LANG].description,
		site: site!,
		trailingSlash: false,
		items,
	});
};
