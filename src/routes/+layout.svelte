<script lang="ts">
	import '../app.css';
	import '$lib/themes.css';
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { fly, fade } from 'svelte/transition';
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
	import type { LayoutData } from './$types';

	let { children, data }: { children?: import('svelte').Snippet; data: LayoutData } = $props();

	// Everything follows the route (SSR-correct, no flash). The radial menu is the
	// single navigation: centered on `/` (hub), glided to the section's corner on
	// a section route. Opening a section is one smooth motion — the theme cross-
	// fades, the menu glides to its corner, and the content flies in (no swap).
	const section = $derived(sectionIdForPath(page.url.pathname));
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
</script>

<div class="app" data-theme={dataTheme}>
	<a href="#main" class="skip">{m.skip_to_content()}</a>

	<GooeyFilter />

	{#if showContent && section}
		<!-- Section ambience (behind content): botanical/celestial decor + scene. -->
		<Decor theme={getThemeForSection(section)} />
		<CornerScene />
	{:else}
		<!-- Home: the four segment-aligned scene squares sit behind the wheel. -->
		<div in:fade={{ duration: 300 }} out:fade={{ duration: 250 }}>
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
				in:fly={{ y: 20, duration: 500, easing: cubicOut, delay: 120 }}
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
	@media (prefers-reduced-motion: reduce) {
		.app {
			transition: none;
		}
	}
</style>
