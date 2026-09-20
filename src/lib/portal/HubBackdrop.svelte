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
			<Scene corner={q.corner} sectionId={q.section} variant="hub" />
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
		/* The seam: a luminous hairline where the four worlds touch. */
		gap: 2px;
		background: linear-gradient(
			135deg,
			rgba(235, 242, 255, 0.28),
			rgba(235, 242, 255, 0.12) 45%,
			rgba(235, 242, 255, 0.28)
		);
		pointer-events: none;
	}
	/* Full-bleed themed panels — no frame, no rounding. Each panel breathes its
	   accent into the seam along its inner edges, so the cross reads as four
	   worlds glowing against a thin light joint. */
	.quad {
		position: relative;
		overflow: hidden;
		background: var(--bg);
	}
	.quad::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.55;
		animation: seam-breathe 10s ease-in-out infinite;
	}
	/* Inner edges per corner: top-left touches right+bottom, and so on. */
	.quad[data-corner='top-left']::after {
		background:
			linear-gradient(to left, color-mix(in srgb, var(--accent) 34%, transparent), transparent 30px),
			linear-gradient(to top, color-mix(in srgb, var(--accent) 34%, transparent), transparent 30px);
	}
	.quad[data-corner='top-right']::after {
		background:
			linear-gradient(to right, color-mix(in srgb, var(--accent) 34%, transparent), transparent 30px),
			linear-gradient(to top, color-mix(in srgb, var(--accent) 34%, transparent), transparent 30px);
	}
	.quad[data-corner='bottom-left']::after {
		background:
			linear-gradient(to left, color-mix(in srgb, var(--accent) 34%, transparent), transparent 30px),
			linear-gradient(to bottom, color-mix(in srgb, var(--accent) 34%, transparent), transparent 30px);
	}
	.quad[data-corner='bottom-right']::after {
		background:
			linear-gradient(to right, color-mix(in srgb, var(--accent) 34%, transparent), transparent 30px),
			linear-gradient(to bottom, color-mix(in srgb, var(--accent) 34%, transparent), transparent 30px);
	}
	.quad:nth-child(2)::after {
		animation-delay: -2.5s;
	}
	.quad:nth-child(3)::after {
		animation-delay: -5s;
	}
	.quad:nth-child(4)::after {
		animation-delay: -7.5s;
	}
	@keyframes seam-breathe {
		0%,
		100% {
			opacity: 0.4;
		}
		50% {
			opacity: 0.75;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.quad::after {
			animation: none;
		}
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
