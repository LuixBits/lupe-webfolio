<script lang="ts">
	import { onMount } from 'svelte';
	import Garden from '$lib/garden/Garden.svelte';
	import type { DockPosition } from '$lib/radial-menu/types';

	let {
		corner = 'bottom-left',
		sectionId = 'about'
	}: { corner?: DockPosition; sectionId?: string | null } = $props();

	const SIZE = 340;

	// The direction that points into the viewport from each corner, and the
	// scene-local origin (the corner the plant roots at). Growth aims inward, so
	// the menu reads as melting into a corner that then sprouts.
	const INWARD: Record<string, number> = {
		'bottom-left': 45,
		'top-left': 135,
		'top-right': 225,
		'bottom-right': 315
	};
	const ORIGIN: Record<string, { x: number; y: number }> = {
		'bottom-left': { x: 0, y: SIZE },
		'top-left': { x: 0, y: 0 },
		'top-right': { x: SIZE, y: 0 },
		'bottom-right': { x: SIZE, y: SIZE }
	};

	const heading = $derived(INWARD[corner] ?? 45);
	const origin = $derived(ORIGIN[corner] ?? { x: 0, y: SIZE });

	// Puddle blobs march inward from the corner along the inward heading; the
	// gooey filter fuses them into one liquid mass — the "melt".
	const rad = $derived(((heading - 90) * Math.PI) / 180);
	const blobs = $derived([
		{ r: 48, d: 0 },
		{ r: 34, d: 42 },
		{ r: 22, d: 78 },
		{ r: 13, d: 108 }
	].map((b) => ({
		r: b.r,
		cx: origin.x + Math.cos(rad) * b.d,
		cy: origin.y + Math.sin(rad) * b.d
	})));

	let grown = $state(false);
	onMount(() => {
		grown = true;
	});
</script>

<div class="garden-scene" style="--ox:{origin.x}px; --oy:{origin.y}px;">
	<svg class="melt" class:grown width="100%" height="100%" viewBox="0 0 {SIZE} {SIZE}">
		<g filter="url(#gooey)">
			{#each blobs as b, i (i)}
				<circle cx={b.cx} cy={b.cy} r={b.r} fill="var(--slice-active, #4f8a63)" />
			{/each}
		</g>
	</svg>

	<div class="plant" class:grown>
		<Garden
			seed={sectionId ?? 'about'}
			width={SIZE}
			height={SIZE}
			originX={origin.x}
			originY={origin.y}
			{heading}
			variant="branch"
		/>
	</div>
</div>

<style>
	.garden-scene {
		position: absolute;
		inset: 0;
	}
	.melt,
	.plant {
		position: absolute;
		inset: 0;
	}
	/* Melt swells out of the corner. transform-origin follows the root corner. */
	.melt {
		transform-origin: var(--ox) var(--oy);
		transform: scale(0.2);
		opacity: 0;
		transition:
			transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 500ms ease;
	}
	.melt.grown {
		transform: scale(1);
		opacity: 0.9;
	}
	.plant {
		opacity: 0;
		transition: opacity 600ms ease 250ms;
	}
	.plant.grown {
		opacity: 1;
	}
	@media (prefers-reduced-motion: reduce) {
		.melt,
		.plant {
			transition: none;
			transform: none;
			opacity: 0.9;
		}
	}
</style>
