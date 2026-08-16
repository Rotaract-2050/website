/** Any host other than the production one configured as `site` in astro.config.mjs is staging/preview
 * (beta.rotaract2050.org, localhost, Cloudflare preview URLs, ...). Used to keep test traffic out of
 * search indexing and out of Google Analytics until the real domain goes live. */
export function isProdHost(url: URL, site: URL | undefined): boolean {
	return url.hostname === site?.hostname;
}
