import type { Metric } from 'web-vitals';

function report(metric: Metric): void {
	window.trackEvent?.('web_vitals', {
		metric_name: metric.name,
		// CLS is a unitless score (~0.1): scale it so GA4's integer-friendly aggregation keeps its precision.
		metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
		metric_rating: metric.rating,
	});
}

/** Reports LCP, INP and CLS of the current page view as GA4 `web_vitals` events. The library is imported
 * dynamically so it is only downloaded once GA is allowed to run (see whenGaReady). */
export async function reportWebVitals(): Promise<void> {
	const { onLCP, onINP, onCLS } = await import('web-vitals');
	onLCP(report);
	onINP(report);
	onCLS(report);
}
