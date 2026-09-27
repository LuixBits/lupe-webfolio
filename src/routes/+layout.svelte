<script lang="ts">
	// Self-hosted fonts (Fontsource): same-origin woff2 with font-display swap —
	// replaces the render-blocking Google Fonts stylesheet (~2.2s on mobile).
	import '@fontsource-variable/fraunces/opsz.css';
	import '@fontsource-variable/fraunces/opsz-italic.css';
	import '@fontsource-variable/nunito-sans';
	import '@fontsource/spectral/400.css';
	import '@fontsource/spectral/400-italic.css';
	import '@fontsource/spectral/500.css';
	import '@fontsource/spectral/700.css';
	import '@fontsource/shippori-mincho/400.css';
	import '@fontsource/shippori-mincho/600.css';
	import '@fontsource/shippori-mincho/700.css';
	import '@fontsource-variable/karla';
	import '@fontsource/righteous';
	import '@fontsource/space-mono';
	import '@fontsource/space-mono/700.css';
	import '@fontsource-variable/space-grotesk';
	import '@fontsource-variable/sora';
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
	import WorkshopWall from '$lib/projects/workbench/WorkshopWall.svelte';
	import { deLocalizeUrl } from '$lib/paraglide/runtime';
	import CornerScene from '$lib/scenes/CornerScene.svelte';
	import GooeyFilter from '$lib/effects/GooeyFilter.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
	import { menu, sectionIdForUrl } from '$lib/radial-menu/menu';
	import { getThemeForSection, dataThemeForSection } from '$lib/themes';
	import type { LayoutData } from './$types';

	let { children, data }: { children?: import('svelte').Snippet; data: LayoutData } = $props();

	// Everything follows the route (SSR-correct, no flash). The radial menu is the
	// single navigation: centered on `/` (hub), glided to the section's corner on
	// a section route. Opening a section is one smooth motion — the theme cross-
	// fades, the menu glides to its corner, and the content flies in (no swap).
	const section = $derived(sectionIdForUrl(page.url));
	const dataTheme = $derived(dataThemeForSection(section));
	const showContent = $derived(section !== null);
	const workbench = $derived(deLocalizeUrl(page.url).pathname === '/projects/my-channel');
	const overview = $derived(deLocalizeUrl(page.url).pathname === '/projects');
	// Keep the Projects layout alive between shelf/detail routes so its camera
	// transition can follow real navigation. Other sections keep their entrance.
	const contentKey = $derived(
		section === 'projects'
			? page.url.pathname.replace(/\/projects(?:\/.*)?$/, '/projects')
			: page.url.pathname
	);

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
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => (reduced = preference.matches);
		update();
		preference.addEventListener('change', update);
		return () => preference.removeEventListener('change', update);
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

<div class="app" class:workbench class:overview data-theme={dataTheme}>
	<a href="#main" class="skip">{m.skip_to_content()}</a>

	<GooeyFilter />

	{#if showContent && section}
		<!-- Section ambience (behind content): botanical/celestial decor + scene.
		     Each fixed layer gets its own fixed inset-0 wrapper so the transition
		     transform doesn't re-anchor the fixed children. -->
		<div
			class="layer layer--decor"
			class:room-wall={workbench || overview}
			in:scale={settleIn}
			out:fade={{ duration: reduced ? 0 : 220 }}
		>
			{#if workbench || overview}<WorkshopWall />{:else}<Decor
					theme={getThemeForSection(section)}
				/>{/if}
		</div>
		{#if !workbench && !overview}
			<div
				class="layer layer--scene"
				in:scale={settleIn}
				out:fade={{ duration: reduced ? 0 : 220 }}
			>
				<CornerScene />
			</div>
		{/if}
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
	<div class="navigation-placement" class:ledge={overview}>
		<RadialMenu
			items={menu}
			label={m.menu_label()}
			backLabel={m.menu_back()}
			overviewLedge={overview}
		/>
	</div>

	<main id="main">
		{#key contentKey}
			<div
				class="page-shell"
				in:drop={{
					y: 26,
					from: 0.975,
					duration: section === 'projects' ? 0 : 560,
					delay: section === 'projects' ? 0 : 150
				}}
				out:fade={{ duration: 180 }}
			>
				{@render children?.()}
			</div>
		{/key}
	</main>

	{#if showContent && section}
		<Footer
			theme={getThemeForSection(section)}
			{dockCorner}
			year={data.year}
			variant={overview ? 'overview' : workbench ? 'workbench' : 'default'}
		>
			{#snippet actions()}
				<LocaleSwitcher />
			{/snippet}
		</Footer>
	{/if}
</div>

<style>
	.app.workbench {
		position: relative;
		--bg: #241924;
		--footer-bar-bg: #19131b;
		--fg-muted: #c9b3cb;
	}
	.app.overview {
		position: relative;
		--bg: #24153c;
		--footer-bar-bg: #180f29;
		--fg-muted: #d6bfeb;
	}
	.overview main {
		container-type: inline-size;
		padding: 0;
	}
	.navigation-placement {
		z-index: 20;
	}
	@media (max-width: 60rem), (max-height: 560px) {
		.navigation-placement.ledge {
			position: relative;
			flex: none;
			height: 8rem;
			border-bottom: 1px solid #72526366;
			background: linear-gradient(90deg, #36273666, transparent 60%);
		}
		.overview main {
			padding: 0;
		}
	}
	.app {
		min-height: 100vh;
		min-height: 100svh;
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
	.layer--decor.room-wall {
		position: absolute;
	}
	.layer--scene {
		z-index: 12;
	}
	/* Phones: the corner scene is nearly viewport-sized there — ambience must
	   sit UNDER the copy, not on top of it. */
	@media (max-width: 560px), (max-height: 560px) {
		.layer--scene {
			z-index: 9;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.app {
			transition: none;
		}
	}
</style>
