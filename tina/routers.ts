// Router functions for Tina collections whose slug isn't derived from the default (folder path)
// behavior — each maps a document's breadcrumbs to the public URL it should open to when an
// editor clicks "View" in the Tina admin. See references/tina.md for the pattern.

// Pages are a single file (IT + EN fields together, like clubs/zones/news/events/resources) —
// the router just jumps to the IT (default-locale) route, same as clubs/zones get no router
// override at all. "home" is the one page-specific special case: it maps to `/`, not `/home`.
export const pageRouter = ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) => {
	const slug = document._sys.breadcrumbs.join('/');
	return slug === 'home' ? '/' : `/${slug}`;
};

// news/events are single files (IT + EN fields together, like clubs/zones) — the router just
// jumps to the IT (default-locale) route, same as clubs/zones get no router override at all.
export const newsRouter = ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) => {
	const slug = document._sys.breadcrumbs.join('/');
	return `/news/${slug}`;
};

// Events are single files (IT + EN fields together, like news) with a real detail page —
// the router jumps to it directly.
export const eventsRouter = ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) => {
	const slug = document._sys.breadcrumbs.join('/');
	return `/eventi/${slug}`;
};

// Resources (knowledge base articles, e.g. il Cerimoniale) are single files (IT + EN fields
// together, same reasoning as news/events) with a real detail page under /formazione/<slug>.
export const resourcesRouter = ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) => {
	const slug = document._sys.breadcrumbs.join('/');
	return `/formazione/${slug}`;
};

// Same shape as eventsRouter, isolated collection for the Interact sub-section (own detail
// route under /interact/eventi/<slug> — see src/pages/interact/eventi/[year]/[slug].astro).
export const interactEventsRouter = ({ document }: { document: { _sys: { breadcrumbs: string[] } } }) => {
	const slug = document._sys.breadcrumbs.join('/');
	return `/interact/eventi/${slug}`;
};
