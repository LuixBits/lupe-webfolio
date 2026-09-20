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
	// Positions match the wheel exactly: About top-left, Projects top-right,
	// Hobbies bottom-left, CV bottom-right — each scene emanating from that
	// quadrant's outer corner. Non-interactive: the radial menu is the only
	// navigation. Grid order is row-major TL, TR, BL, BR.
	const layout: { section: string; corner: DockPosition }[] = [
		{ section: 'about', corner: 'top-left' },
		{ section: 'projects', corner: 'top-right' },
		{ section: 'hobbies', corner: 'bottom-left' },
		{ section: 'cv', corner: 'bottom-right' }
	];

	const quadrants = layout.map((q) => {
		const theme = getThemeForSection(q.section) as ThemeName;
		return { ...q, theme, Scene: scenes[theme] };
	});
</script>

<div class="hub-backdrop" aria-hidden="true">
	{#each quadrants as q (q.section)}
		{@const Scene = q.Scene}
		<div class="quad" data-theme={q.theme} data-corner={q.corner}>
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
	/* Each panel is filled with a soft themed wash — a gentle glow near its outer
	   corner easing into the theme background. No mask/vignette, so the square
	   reads as fully filled (the scene detail sits on top, near the corner). */
	.quad {
		position: relative;
		overflow: hidden;
		background: var(--bg);
	}
	.quad[data-corner='top-left'] {
		background: radial-gradient(150% 150% at 0% 0%, color-mix(in srgb, var(--accent) 26%, var(--bg)), var(--bg) 82%);
	}
	.quad[data-corner='top-right'] {
		background: radial-gradient(150% 150% at 100% 0%, color-mix(in srgb, var(--accent) 26%, var(--bg)), var(--bg) 82%);
	}
	.quad[data-corner='bottom-left'] {
		background: radial-gradient(150% 150% at 0% 100%, color-mix(in srgb, var(--accent) 26%, var(--bg)), var(--bg) 82%);
	}
	.quad[data-corner='bottom-right'] {
		background: radial-gradient(150% 150% at 100% 100%, color-mix(in srgb, var(--accent) 26%, var(--bg)), var(--bg) 82%);
	}
</style>
