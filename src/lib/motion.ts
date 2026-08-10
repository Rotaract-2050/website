import { animate, inView, type AnimationOptions, type DOMKeyframesDefinition } from 'motion';

// Mirrors --motion-duration-*/--motion-easing-* in src/styles/global.css. CSS custom
// properties aren't readable from a JS animation option, so these two have to be kept
// in sync by hand if the tokens in global.css ever change.
export const m3Duration = { short: 0.15, medium: 0.25, long: 0.4 } as const;
export const m3Easing = {
	standard: [0.2, 0, 0, 1],
	emphasized: [0.3, 0, 0.1, 1],
	decelerate: [0, 0, 0, 1],
	accelerate: [0.3, 0, 1, 1],
} as const;

export function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Caps the stagger delay after `max` items so a long single-column list on mobile
// doesn't leave the 20th card waiting seconds before it animates in. Use as the
// `delay` option of animate().
export function cappedStagger(stepSeconds: number, max = 4) {
	return (i: number) => Math.min(i, max) * stepSeconds;
}

// Motion's WAAPI animate() commits the final keyframe as a literal inline style once
// it finishes (see motion-dom's NativeAnimation onfinish -> setStyle), so a card that
// also has a CSS `:hover { transform: ... }` rule would have that rule permanently
// outranked by the leftover inline `transform` after its entrance animation completes.
// Clearing the inline style below hands transform/opacity back to the stylesheet -
// safe here because every keyframe set in this file ends at the identity value
// (scale/translate at rest, opacity 1), same as having no inline style at all.
function clearAnimatedInlineStyles(el: Element) {
	if (!(el instanceof HTMLElement)) return;
	el.style.transform = '';
	el.style.opacity = '';
}

// For content that's always visible on first paint (e.g. the Hero, above the fold):
// animate in on load, no scroll trigger.
export function revealOnLoad(target: Element | Element[], keyframes: DOMKeyframesDefinition, options: AnimationOptions = {}) {
	if (prefersReducedMotion()) return;
	const items = Array.isArray(target) ? target : [target];
	const controls = animate(items, keyframes, { duration: m3Duration.long, ease: m3Easing.decelerate, ...options });
	controls.then(() => items.forEach((el) => {
		el.removeAttribute('data-anim-hide');
		clearAnimatedInlineStyles(el);
	}));
}

// For content below the fold: hide immediately (matches the data-reveal system's own
// "hide as soon as the script runs, long before the user scrolls there" approach - see
// initScrollReveal in BaseLayout.astro), then animate once the container scrolls into
// view. `targets` can be the whole set of items in a grid for a staggered entrance.
export function revealOnScroll(
	container: Element,
	targets: Element | Element[],
	keyframes: DOMKeyframesDefinition,
	options: AnimationOptions = {}
) {
	if (prefersReducedMotion()) return;
	const items = Array.isArray(targets) ? targets : [targets];
	if (items.length === 0) return;

	items.forEach((el) => el.setAttribute('data-anim-hide', 'true'));

	const stop = inView(
		container,
		() => {
			const controls = animate(items, keyframes, { duration: m3Duration.medium, ease: m3Easing.emphasized, ...options });
			controls.then(() => items.forEach((el) => {
				el.removeAttribute('data-anim-hide');
				clearAnimatedInlineStyles(el);
			}));
			stop();
		},
		// -10% bottom margin: element must be scrolled 10% into the viewport before it
		// triggers, so the reveal doesn't fire the instant a card's top edge peeks in.
		{ margin: '0px 0px -10% 0px' }
	);
}
