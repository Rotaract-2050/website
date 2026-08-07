import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getDistrictNews } from '../../lib/news';
import { RSS_CHANNELS, NEWS_FEED_LIMIT, newsToRssItem } from '../../lib/rss';

const LANG = 'it';

export const GET: APIRoute = async ({ site }) => {
	const news = await getDistrictNews(NEWS_FEED_LIMIT);
	const items = news.map((article) => newsToRssItem(article, LANG));

	return rss({
		title: RSS_CHANNELS.news[LANG].title,
		description: RSS_CHANNELS.news[LANG].description,
		site: site!,
		trailingSlash: false,
		items,
	});
};
