import type { Action } from 'svelte/action';

/** Grow-on-reveal plumbing: ONE IntersectionObserver shared by every chapter
 *  on the page. Each element registers a callback that fires the first time
 *  it enters the viewport, then is unobserved — zero cost while idle.
 *
 *  Under prefers-reduced-motion the callback fires immediately, so consumers
 *  land in their fully-grown state without ever animating. Actions never run
 *  during SSR, so server HTML stays fully visible (no-JS users see a grown
 *  grove, never a hidden one). */

let observer: IntersectionObserver | undefined;
const callbacks = new WeakMap<Element, () => void>();

function ensureObserver(): IntersectionObserver {
	observer ??= new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				observer!.unobserve(entry.target);
				const cb = callbacks.get(entry.target);
				callbacks.delete(entry.target);
				cb?.();
			}
		},
		// Fire once any part of the element clears the bottom ~15% of the
		// viewport — ratio thresholds misfire on chapters taller than a screen.
		{ rootMargin: '0px 0px -15% 0px' }
	);
	return observer;
}

export function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** `use:revealOnce={cb}` — run `cb` the first time the element scrolls into
 *  view (immediately under reduced motion). */
export const revealOnce: Action<Element, () => void> = (node, cb) => {
	let current = cb;
	if (prefersReducedMotion()) {
		current();
		return;
	}
	callbacks.set(node, () => current());
	ensureObserver().observe(node);
	return {
		update(next: () => void) {
			current = next;
		},
		destroy() {
			observer?.unobserve(node);
			callbacks.delete(node);
		}
	};
};
