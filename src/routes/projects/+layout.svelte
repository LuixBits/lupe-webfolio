<script lang="ts">
	import { onDestroy, onMount, setContext, untrack, type Snippet } from 'svelte';
	import { beforeNavigate, onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { deLocalizeUrl } from '$lib/paraglide/runtime';
	import PowerOn from '$lib/projects/PowerOn.svelte';
	import { createWorkshopState, workshopRoom } from '$lib/projects/overview/workshop-state.svelte';
	import {
		consumeProjectLocaleChange,
		projectNavigation,
		projectTiming
	} from '$lib/projects/navigation';

	let { children }: { children: Snippet } = $props();
	let moving = $state(false);
	let overviewReveal = $state(false);
	let sequence = 0;
	let animations: Animation[] = [];
	let snapshot: HTMLDivElement | undefined;
	let departing: HTMLElement | undefined;
	let selectedClone: HTMLElement | undefined;
	let timeout: ReturnType<typeof setTimeout> | undefined;
	let arrivalTask: ReturnType<typeof setTimeout> | undefined;
	const enterOnOverview = untrack(() => deLocalizeUrl(page.url).pathname === '/projects');
	const positions = new Map<string, { x: number; y: number; width: number }>();
	type Journey = {
		sequence: number;
		slug: string;
		to: string;
		returning: boolean;
		compact: boolean;
		studio: boolean;
		target?: DOMRect;
		frame?: DOMRect;
		popstate: boolean;
	};
	let journey: Journey | undefined;
	setContext(workshopRoom, createWorkshopState());
	setContext(projectNavigation, {
		get moving() {
			return moving;
		}
	});

	function clearTransition() {
		clearTimeout(timeout);
		clearTimeout(arrivalTask);
		animations.forEach((animation) => animation.cancel());
		animations = [];
		snapshot?.remove();
		snapshot = undefined;
		departing = undefined;
		selectedClone = undefined;
		moving = false;
		delete document.documentElement.dataset.projectTransition;
	}
	function interrupt() {
		sequence += 1;
		journey = undefined;
		clearTransition();
	}
	function tapeFor(slug: string) {
		return document.querySelector<HTMLAnchorElement>(
			`#main [data-project-tape="${CSS.escape(slug)}"]`
		);
	}
	function originWithin(element: HTMLElement, target: DOMRect) {
		const frame = element.getBoundingClientRect();
		return `${target.left - frame.left + target.width / 2}px ${target.top - frame.top + target.height / 2}px`;
	}
	function keepSnapshot(oldPage: HTMLElement, slug: string) {
		const frame = oldPage.getBoundingClientRect();
		const computed = getComputedStyle(oldPage);
		departing = oldPage.cloneNode(true) as HTMLElement;
		// A playing tablet belongs to the live room, never to the visual clone.
		departing.querySelectorAll('iframe, video, audio').forEach((media) => media.remove());
		// Inert copies must not join the live drawer's exclusive disclosure group.
		departing.querySelectorAll('details[name]').forEach((drawer) => drawer.removeAttribute('name'));
		// Ambient effects in the larger room must hold their visible frame in
		// the departure snapshot instead of restarting when the clone mounts.
		const originals = oldPage.querySelectorAll<HTMLElement>('[data-workshop-animated]');
		departing.querySelectorAll<HTMLElement>('[data-workshop-animated]').forEach((clone, index) => {
			const style = getComputedStyle(originals[index]);
			clone.style.animation = 'none';
			clone.style.transform = style.transform;
			clone.style.opacity = style.opacity;
		});
		selectedClone =
			departing.querySelector<HTMLElement>(`[data-project-tape="${CSS.escape(slug)}"]`) ??
			undefined;
		// The snapshot leaves the themed app. Preserve inherited materials and
		// type, including route-specific overrides, before appending it to body.
		for (const property of computed) {
			if (property.startsWith('--'))
				departing.style.setProperty(property, computed.getPropertyValue(property));
		}
		for (const property of ['font-family', 'font-size', 'line-height', 'color'])
			departing.style.setProperty(property, computed.getPropertyValue(property));

		// Keep SVG paint references intact with unique IDs. HTML anchors and
		// lookup hooks belong only to the real page, never its visual snapshot.
		const ids = new Map<string, string>();
		departing.querySelectorAll('[id]').forEach((element) => {
			if (element instanceof SVGElement) {
				const next = `project-snapshot-${sequence}-${element.id}`;
				ids.set(element.id, next);
				element.id = next;
			} else element.removeAttribute('id');
		});
		departing.querySelectorAll('*').forEach((element) => {
			element.removeAttribute('data-project-tape');
			for (const attribute of [...element.attributes]) {
				let value = attribute.value.replace(/url\(#([^)]+)\)/g, (match, id) =>
					ids.has(id) ? `url(#${ids.get(id)})` : match
				);
				if (value.startsWith('#') && ids.has(value.slice(1))) value = `#${ids.get(value.slice(1))}`;
				if (value !== attribute.value) element.setAttribute(attribute.name, value);
			}
			if (element instanceof HTMLAnchorElement) {
				element.removeAttribute('href');
				element.tabIndex = -1;
			}
		});
		departing.removeAttribute('id');
		Object.assign(departing.style, {
			position: 'absolute',
			left: `${frame.left}px`,
			top: `${frame.top}px`,
			width: `${frame.width}px`,
			height: `${frame.height}px`,
			maxWidth: 'none',
			margin: '0'
		});
		snapshot = document.createElement('div');
		snapshot.dataset.projectSnapshot = '';
		snapshot.inert = true;
		snapshot.setAttribute('aria-hidden', 'true');
		Object.assign(snapshot.style, {
			position: 'fixed',
			inset: '0',
			zIndex: '15',
			overflow: 'hidden',
			pointerEvents: 'none'
		});
		snapshot.append(departing);
		document.body.append(snapshot);
		return frame;
	}

	beforeNavigate((navigation) => {
		interrupt();
		const from = navigation.from && deLocalizeUrl(navigation.from.url).pathname;
		const to = navigation.to && deLocalizeUrl(navigation.to.url).pathname;
		if (!from || !to || from === to || navigation.willUnload) return;
		overviewReveal = false;
		const opening = from === '/projects' && /^\/projects\/[^/]+$/.test(to);
		const returning = to === '/projects' && /^\/projects\/[^/]+$/.test(from);
		if (!opening && !returning) return;
		// A category selection is normal anchor navigation. Browser Back may
		// legitimately return to a category URL from which a case was selected.
		if (
			returning &&
			navigation.type !== 'popstate' &&
			navigation.to?.url.hash &&
			!navigation.to.url.hash.startsWith('#tape-')
		)
			return;
		const slug = (returning ? from : to).split('/')[2];
		const source = tapeFor(slug);
		const target =
			source?.querySelector<HTMLElement>('[data-project-aperture], [data-project-object]') ??
			source;
		const compact = matchMedia('(max-width: 700px), (max-height: 560px)').matches;
		journey = {
			sequence,
			slug,
			to,
			returning,
			compact,
			studio: slug === 'my-channel',
			popstate: navigation.type === 'popstate',
			target: target?.getBoundingClientRect()
		};
		if (opening) positions.set(slug, { x: scrollX, y: scrollY, width: innerWidth });
		if (matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate)
			return;
		const oldPage = document.querySelector<HTMLElement>('#main .page');
		if (opening && oldPage && source) journey.frame = keepSnapshot(oldPage, slug);
		moving = true;
		document.documentElement.dataset.projectTransition = returning ? 'return' : 'open';
		const thisSequence = sequence;
		navigation.complete.catch(() => {
			if (sequence === thisSequence) interrupt();
		});
		// Failed or stalled route preparation must never strand a snapshot.
		timeout = setTimeout(() => {
			if (sequence === thisSequence) interrupt();
		}, 5000);
	});

	onNavigate((navigation) => {
		const current = journey;
		if (!current || current.to !== (navigation.to && deLocalizeUrl(navigation.to.url).pathname)) {
			if (moving) interrupt();
			return;
		}
		return () => {
			// SvelteKit queues fragment focus in a timer. Measure and restore after
			// that task, so an older hash cannot steal focus or change our origin.
			arrivalTask = setTimeout(() => {
				if (sequence !== current.sequence) return;
				const nextPage = document.querySelector<HTMLElement>('#main .page');
				if (!nextPage || page.error) {
					interrupt();
					return;
				}
				if (current.returning) {
					const saved = positions.get(current.slug);
					// Browser history restores its own scroll. The remote restores the
					// last overview position; direct detail visits retain their hash.
					if (!current.popstate && saved?.width === innerWidth)
						scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
					const link = tapeFor(current.slug);
					if (link) {
						const rect = link.getBoundingClientRect();
						if (rect.bottom < 0 || rect.top > innerHeight)
							link.scrollIntoView({ block: 'center', behavior: 'instant' });
						link.focus({ preventScroll: true });
					}
				}
				if (!moving) {
					clearTransition();
					return;
				}
				clearTimeout(timeout);
				const timing = projectTiming(current.compact, current.returning, current.studio);
				const easing = 'cubic-bezier(.22,.75,.2,1)';
				if (departing && current.target && current.frame) {
					const target = current.target;
					const cx = target.left + target.width / 2;
					const cy = target.top + target.height / 2;
					const dx = innerWidth / 2 - cx;
					const dy = innerHeight / 2 - cy;
					const zoom = current.studio ? (current.compact ? 1.08 : 1.55) : 1.035;
					const travel = current.compact ? 0.12 : current.studio ? 1 : 0.12;
					departing.style.transformOrigin = `${cx - current.frame.left}px ${cy - current.frame.top}px`;
					animations.push(
						departing.animate(
							[
								{ transform: 'translate(0, 0) scale(1)', opacity: 1 },
								{ opacity: 1, offset: 0.18 },
								{
									transform: `translate(${dx * travel}px, ${dy * travel}px) scale(${zoom})`,
									opacity: 0
								}
							],
							{ duration: timing.duration, easing, fill: 'both' }
						)
					);
					const panel = selectedClone?.querySelector<SVGElement>('[data-door-panel]');
					if (panel)
						animations.push(
							panel.animate([{ transform: 'scaleX(.72)' }, { transform: 'scaleX(.5)' }], {
								duration: timing.duration,
								easing,
								fill: 'both'
							})
						);
					else if (selectedClone) {
						const object =
							selectedClone.querySelector<HTMLElement>('[data-project-object]') ?? selectedClone;
						animations.push(
							object.animate(
								[
									{ transform: 'translateY(0) scale(1)' },
									{
										transform: `translateY(${current.compact ? -8 : -22}px) scale(${current.compact ? 1.04 : 1.16})`
									}
								],
								{ duration: timing.duration, easing, fill: 'both' }
							)
						);
					}
				}
				const returnTarget = current.returning
					? tapeFor(current.slug)?.getBoundingClientRect()
					: undefined;
				const origin = returnTarget ? originWithin(nextPage, returnTarget) : '50% 35%';
				animations.push(
					nextPage.animate(
						[
							{
								transform: `scale(${current.returning ? (current.compact ? 1.025 : 1.08) : 0.97})`,
								transformOrigin: origin,
								opacity: 0
							},
							{ transform: 'scale(1)', transformOrigin: origin, opacity: 1 }
						],
						{ duration: timing.arrival, delay: timing.delay, easing, fill: 'both' }
					)
				);
				Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
					if (sequence !== current.sequence) return;
					journey = undefined;
					clearTransition();
				});
			}, 0);
		};
	});

	onMount(() => {
		overviewReveal = enterOnOverview && !consumeProjectLocaleChange();
		const preference = matchMedia('(prefers-reduced-motion: reduce)');
		const stop = () => {
			if (preference.matches) interrupt();
		};
		preference.addEventListener('change', stop);
		window.addEventListener('resize', interrupt);
		window.addEventListener('pagehide', interrupt);
		return () => {
			preference.removeEventListener('change', stop);
			window.removeEventListener('resize', interrupt);
			window.removeEventListener('pagehide', interrupt);
		};
	});
	onDestroy(() => {
		if (typeof document !== 'undefined') interrupt();
	});
</script>

{#if overviewReveal}<PowerOn viewport />{/if}
{@render children()}
