/** Name of the window event CookieConsent dispatches once `window.gtag` is defined (i.e. after consent). */
export const GA_READY_EVENT = 'ga:ready';

/** Runs `callback` once GA4 is usable: immediately if consent was already given and gtag exists, otherwise
 * when the visitor accepts cookies on this page. If they never accept, `callback` never runs — callers that
 * lazy-load anything (e.g. web-vitals) therefore cost non-consenting visitors nothing. */
export function whenGaReady(callback: () => void): void {
	if (typeof window.gtag === 'function') {
		callback();
		return;
	}
	window.addEventListener(GA_READY_EVENT, callback, { once: true });
}
