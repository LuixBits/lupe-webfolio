<script lang="ts">
	import { getThemeForSection, type ThemeName } from '$lib/themes';
	import GardenScene from '$lib/scenes/GardenScene.svelte';
	import WaterScene from '$lib/scenes/WaterScene.svelte';
	import VaporwaveScene from '$lib/scenes/VaporwaveScene.svelte';
	import CosmosScene from '$lib/scenes/CosmosScene.svelte';
	import type { DockPosition } from '$lib/radial-menu/types';

	const scenes = {
		garden: GardenScene,
		water: WaterScene,
		vaporwave: VaporwaveScene,
		cosmos: CosmosScene
	};

	// The four hub quadrants — the wheel's segments extended into the backdrop.
	// Positions match the wheel exactly (menu order about/academia/projects/
	// hobbies → wedges top-right / bottom-right / bottom-left / top-left), and
	// each scene emanates from that quadrant's outer corner. Non-interactive:
	// the radial menu is the only navigation. Grid order is row-major TL,TR,BL,BR.
	const layout: { section: string; corner: DockPosition }[] = [
		{ section: 'hobbies', corner: 'top-left' },
		{ section: 'about', corner: 'top-right' },
		{ section: 'projects', corner: 'bottom-left' },
		{ section: 'academia', corner: 'bottom-right' }
	];

	const quadrants = layout.map((q) => {
		const theme = getThemeForSection(q.section) as ThemeName;
		return { ...q, theme, Scene: scenes[theme] };
	});
</script>

<div class="hub-backdrop" aria-hidden="true">
	{#each quadrants as q (q.section)}
		{@const Scene = q.Scene}
		<div class="quad" data-theme={q.theme}>
			<Scene corner={q.corner} sectionId={q.section} />
		</div>
	{/each}
</div>

<style>
	.hub-backdrop {
		position: fixed;
		inset: 0;
		z-index: 4; /* behind the radial menu (z20) and content */
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 1px;
		background: rgba(255, 255, 255, 0.14); /* the dividing cross */
		pointer-events: none;
	}
	.quad {
		position: relative;
		overflow: hidden;
		background: var(--bg);
	}
</style>
