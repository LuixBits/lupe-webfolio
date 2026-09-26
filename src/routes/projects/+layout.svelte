<script lang="ts">
	import { onDestroy, onMount, setContext, untrack, type Snippet } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { deLocalizeUrl } from '$lib/paraglide/runtime';
	import PowerOn from '$lib/projects/PowerOn.svelte';
	import { projectNavigation } from '$lib/projects/navigation';

	let { children }: { children: Snippet } = $props();
	let moving = $state(false);
	let sequence = 0;
	let animations: Animation[] = [];
	let departing: HTMLElement | undefined;
	const enterOnShelf = untrack(() => deLocalizeUrl(page.url).pathname === '/projects');
	setContext(projectNavigation, {
		get moving() {
			return moving;
		}
	});

	function clearTransition() {
		animations.forEach((animation) => animation.cancel());
		animations = [];
		departing?.remove();
		departing = undefined;
		moving = false;
		delete document.documentElement.dataset.projectTransition;
	}
	function tapeFor(slug: string) {
		return document.querySelector<HTMLAnchorElement>(
			`#main [data-project-tape="${CSS.escape(slug)}"]`
		);
	}
	function originWithin(element: HTMLElement, tape?: HTMLElement | null) {
		if (!tape) return '50% 35%';
		const frame = element.getBoundingClientRect();
		const target = tape.getBoundingClientRect();
		return `${target.left - frame.left + target.width / 2}px ${target.top - frame.top + target.height / 2}px`;
	}

	onNavigate((navigation) => {
		const from = navigation.from && deLocalizeUrl(navigation.from.url).pathname;
		const to = navigation.to && deLocalizeUrl(navigation.to.url).pathname;
		if (!from || !to || from === to || !from.startsWith('/projects') || !to.startsWith('/projects'))
			return;
		const returning = to === '/projects';
		const slug = (returning ? from : to).split('/')[2];
		if (!slug) return;
		const thisSequence = ++sequence;
		clearTransition();
		const focusTape = () => {
			if (returning) tapeFor(slug)?.focus({ preventScroll: true });
		};
		if (matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate)
			return focusTape;

		// Keep only the departing shelf in a fixed, inert layer. Its original
		// viewport position survives the router's scroll reset. The real links,
		// URLs and scroll history remain entirely under SvelteKit's control.
		const oldPage = document.querySelector<HTMLElement>('#main .page');
		if (from === '/projects' && oldPage) {
			const rect = oldPage.getBoundingClientRect();
			const origin = originWithin(oldPage, tapeFor(slug));
			departing = oldPage.cloneNode(true) as HTMLElement;
			departing.inert = true;
			departing.setAttribute('aria-hidden', 'true');
			departing.querySelectorAll('[id], [data-project-tape]').forEach((element) => {
				element.removeAttribute('id');
				element.removeAttribute('data-project-tape');
			});
			Object.assign(departing.style, {
				position: 'fixed',
				left: `${rect.left}px`,
				top: `${rect.top}px`,
				width: `${rect.width}px`,
				height: `${rect.height}px`,
				maxWidth: 'none',
				margin: '0',
				zIndex: '15',
				pointerEvents: 'none',
				transformOrigin: origin
			});
			document.body.append(departing);
		}
		moving = true;
		document.documentElement.dataset.projectTransition = returning ? 'return' : 'open';

		return () => {
			if (thisSequence !== sequence) return;
			const nextPage = document.querySelector<HTMLElement>('#main .page');
			if (!nextPage) {
				clearTransition();
				return;
			}
			const origin = returning ? originWithin(nextPage, tapeFor(slug)) : '50% 35%';
			if (departing)
				animations.push(
					departing.animate(
						[
							{ transform: 'scale(1)', opacity: 1 },
							{ transform: 'scale(1.8)', opacity: 0 }
						],
						{ duration: 640, easing: 'cubic-bezier(.22,.75,.2,1)', fill: 'both' }
					)
				);
			animations.push(
				nextPage.animate(
					[
						{ transform: `scale(${returning ? 1.25 : 0.94})`, transformOrigin: origin, opacity: 0 },
						{ transform: 'scale(1)', transformOrigin: origin, opacity: 1 }
					],
					{
						duration: returning ? 640 : 470,
						delay: returning ? 0 : 170,
						easing: 'cubic-bezier(.22,.75,.2,1)',
						fill: 'both'
					}
				)
			);
			Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
				if (sequence !== thisSequence) return;
				clearTransition();
				focusTape();
			});
		};
	});
	onMount(() => {
		const preference = matchMedia('(prefers-reduced-motion: reduce)');
		const stop = () => {
			if (preference.matches) {
				sequence += 1;
				clearTransition();
			}
		};
		preference.addEventListener('change', stop);
		return () => preference.removeEventListener('change', stop);
	});
	onDestroy(() => {
		if (typeof document === 'undefined') return;
		sequence += 1;
		clearTransition();
	});
</script>

{#if enterOnShelf}<PowerOn viewport />{/if}
{@render children()}
