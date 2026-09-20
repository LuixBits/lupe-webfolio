<script lang="ts">
	import '../app.css';
	import '$lib/themes.css';
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import RadialMenu from '$lib/radial-menu/RadialMenu.svelte';
	import HubBackdrop from '$lib/portal/HubBackdrop.svelte';
	import Decor from '$lib/decor/Decor.svelte';
	import CornerScene from '$lib/scenes/CornerScene.svelte';
	import GooeyFilter from '$lib/effects/GooeyFilter.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
	import { menu, sectionIdForPath } from '$lib/radial-menu/menu';
	import { getThemeForSection, dataThemeForSection } from '$lib/themes';
	import { deLocalizeUrl } from '$lib/paraglide/runtime';
	import type { LayoutData } from './$types';

	let { children, data }: { children?: import('svelte').Snippet; data: LayoutData } = $props();

	// Everything follows the route (SSR-correct, no flash). The radial menu is the
	// single navigation: centered on `/` (hub), glided to the section's corner on
	// a section route. Opening a section is one smooth motion — the theme cross-
	// fades, the menu glides to its corner, and the content flies in (no swap).
	// Strip the locale prefix (/de/...) before matching, like hooks.server does —
	// otherwise German section pages would render in hub mode.
	const section = $derived(sectionIdForPath(deLocalizeUrl(page.url).pathname));
	const dataTheme = $derived(dataThemeForSection(section));
	const showContent = $derived(section !== null);

	// Which corner each section docks to (matches RadialMenu), so the footer can
	// clear the menu quarter on the bottom corners.
	const DOCK_CORNER: Record<string, string> = {
		projects: 'bottom-left',
		cv: 'top-left',
		hobbies: 'top-right',
		about: 'bottom-right'
	};
	const dockCorner = $derived(section ? (DOCK_CORNER[section] ?? null) : null);

	// Mirror the theme onto <html> so background / overscroll is themed too.
	$effect(() => {
		document.documentElement.dataset.theme = dataTheme;
	});

	// Zero out the cinematic motion when the user prefers reduced motion.
	let reduced = $state(false);
	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	// Opening a section reads as dropping INTO its world, not a crossfade: the
	// hub grows past the camera as it fades (you fly through the clicked square)
	// while the new environment settles from slightly-small to full size, and
	// the content drops in with a touch of depth (translate + scale).
	const zoomPast = $derived({ start: 1.07, duration: reduced ? 0 : 420, easing: cubicOut });
	const settleIn = $derived({ start: 0.94, duration: reduced ? 0 : 640, easing: cubicOut });

	function drop(_node: Element, { y = 26, from = 0.975, duration = 560, delay = 0 } = {}) {
		return {
			delay,
			duration: reduced ? 0 : duration,
			easing: cubicOut,
			css: (t: number, u: number) =>
				`transform: translateY(${u * y}px) scale(${from + (1 - from) * t}); opacity: ${t};`
		};
	}
</script>

<div class="app" data-theme={dataTheme}>
	<a href="#main" class="skip">{m.skip_to_content()}</a>

	<GooeyFilter />

	{#if showContent && section}
		<!-- Section ambience (behind content): botanical/celestial decor + scene.
		     Each fixed layer gets its own fixed inset-0 wrapper so the transition
		     transform doesn't re-anchor the fixed children. -->
		<div class="layer layer--decor" in:scale={settleIn} out:fade={{ duration: reduced ? 0 : 220 }}>
			<Decor theme={getThemeForSection(section)} />
		</div>
		<div class="layer layer--scene" in:scale={settleIn} out:fade={{ duration: reduced ? 0 : 220 }}>
			<CornerScene />
		</div>
	{:else}
		<!-- Home: the four segment-aligned scene squares sit behind the wheel. The
		     hub flies past the camera on the way in to a section, and settles back
		     from above when you return. -->
		<div class="layer layer--hub" in:scale={zoomPast} out:scale={zoomPast}>
			<HubBackdrop />
		</div>
	{/if}

	<!-- The one navigation: centered on home (over the squares), glides to the
	     corner on a section. -->
	<RadialMenu items={menu} label={m.menu_label()} backLabel={m.menu_back()} />

	<main id="main">
		{#key page.url.pathname}
			<div
				class="page-shell"
				in:drop={{ y: 26, from: 0.975, duration: 560, delay: 150 }}
				out:fade={{ duration: 180 }}
			>
				{@render children?.()}
			</div>
		{/key}
	</main>

	{#if showContent && section}
		<Footer theme={getThemeForSection(section)} {dockCorner} year={data.year}>
			{#snippet actions()}
				<LocaleSwitcher />
			{/snippet}
		</Footer>
	{/if}
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		color: var(--fg);
		/* Theme cross-fade as you move between sections. */
		transition:
			background-color 600ms ease,
			color 600ms ease;
	}
	main {
		position: relative;
		z-index: 10; /* content sits above the fixed decor layer (z-index 6) */
		flex: 1;
	}
	/* Fixed-inset wrappers for the fixed ambience layers: transforms applied here
	   scale the whole layer about the viewport center without re-anchoring the
	   fixed-position children (the wrapper becomes their containing block). */
	.layer {
		position: fixed;
		inset: 0;
		pointer-events: none;
	}
	.layer--hub {
		z-index: 4;
	}
	.layer--decor {
		z-index: 6;
	}
	.layer--scene {
		z-index: 12;
	}
	@media (prefers-reduced-motion: reduce) {
		.app {
			transition: none;
		}
	}
</style>
