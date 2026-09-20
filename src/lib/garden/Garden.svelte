<script lang="ts">
	import { onMount } from 'svelte';
	import { growPlant, hashSeed, BRANCH_PRESET, ROOT_PRESET, type Plant } from './lsystem';

	let {
		seed = 'lupe',
		width = 260,
		height = 260,
		originX = 130,
		originY = 210,
		variant = 'branch',
		heading,
		duration = 2600
	}: {
		seed?: string;
		width?: number;
		height?: number;
		originX?: number;
		originY?: number;
		/** 'branch' grows up with leaves, 'root' creeps down into the corner. */
		variant?: 'branch' | 'root';
		/** Initial growth direction in degrees (0 = up, clockwise). Overrides the
		 *  preset — used to aim growth into the viewport from a docked corner. */
		heading?: number;
		duration?: number;
	} = $props();

	const preset = $derived(variant === 'root' ? ROOT_PRESET : BRANCH_PRESET);
	const plant = $derived<Plant>(
		growPlant(originX, originY, {
			...preset,
			seed: hashSeed(seed),
			...(heading !== undefined ? { heading } : {})
		})
	);

	// 0 → 1 growth. The "frontier" sweeps outward along cumulative path length,
	// revealing branches then leaves in the order the plant actually grew.
	let progress = $state(0);
	const frontier = $derived(progress * plant.totalLength);

	const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			progress = 1;
			return;
		}
		let raf = 0;
		let start = 0;
		const tick = (t: number) => {
			if (!start) start = t;
			const p = Math.min(1, (t - start) / duration);
			progress = easeOut(p);
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});
</script>

<svg class="garden" width="100%" height="100%" viewBox="0 0 {width} {height}" aria-hidden="true">
	{#each plant.segments as s, i (i)}
		{#if s.distance < frontier}
			<line
				x1={s.x1}
				y1={s.y1}
				x2={s.x2}
				y2={s.y2}
				stroke="var(--garden-stem, #3f6d4e)"
				stroke-width={Math.max(0.6, 3 - s.depth * 0.7)}
				stroke-linecap="round"
				opacity={Math.min(1, (frontier - s.distance) / 12)}
			/>
		{/if}
	{/each}
	{#each plant.leaves as leaf, i (i)}
		{#if leaf.distance < frontier}
			<g transform="translate({leaf.x} {leaf.y}) rotate({leaf.angle})">
				<path
					d="M0 0 C 5 -4 5 -12 0 -16 C -5 -12 -5 -4 0 0 Z"
					fill="var(--garden-leaf, #6bbf7b)"
					opacity={Math.min(1, (frontier - leaf.distance) / 20)}
					transform="scale({Math.min(1, (frontier - leaf.distance) / 24)})"
				/>
			</g>
		{/if}
	{/each}
</svg>

<style>
	.garden {
		display: block;
		overflow: visible;
		pointer-events: none;
	}
</style>
