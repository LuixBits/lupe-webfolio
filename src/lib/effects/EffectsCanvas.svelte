<script lang="ts">
	import { onMount } from 'svelte';

	/** GPU decorative layer (the "hybrid" tier). Draws soft blobs and fuses them
	 *  with a blur → alpha-contrast filter chain, so the background reads as a
	 *  slow liquid metaball field. Purely decorative: aria-hidden, behind
	 *  everything, and skipped entirely when WebGL is absent or the user prefers
	 *  reduced motion — the SVG layers already carry the whole design without it.
	 *
	 *  Upgrade seam: swap the blur+ColorMatrix approximation for a raymarched
	 *  metaball fragment shader (Pixi Filter / Mesh+Shader) — see ADR-0003. */
	let { active = false }: { active?: boolean } = $props();

	let host: HTMLDivElement;
	// Pixi is dynamically imported (SSR-safe) and typed loosely on purpose —
	// this file is the one intentional `any` island; keep it isolated.
	// Mirror the prop into a ref the long-lived ticker closure can read live.
	let isActive = $state(false);
	$effect(() => {
		isActive = active;
	});

	onMount(() => {
		let disposed = false;
		let destroy = () => {};

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const hasWebGL = (() => {
			try {
				const c = document.createElement('canvas');
				return !!(c.getContext('webgl2') || c.getContext('webgl'));
			} catch {
				return false;
			}
		})();
		if (reduced || !hasWebGL) return;

		(async () => {
			const PIXI: any = await import('pixi.js');
			if (disposed) return;

			const app = new PIXI.Application();
			await app.init({ resizeTo: window, backgroundAlpha: 0, antialias: true });
			if (disposed) {
				app.destroy(true);
				return;
			}
			host.appendChild(app.canvas);

			const layer = new PIXI.Container();
			app.stage.addChild(layer);

			const N = 6;
			const blobs = Array.from({ length: N }, (_, i) => ({
				g: layer.addChild(new PIXI.Graphics()),
				phase: (i / N) * Math.PI * 2,
				r: 60 + i * 9
			}));

			const blur = new PIXI.BlurFilter({ strength: 26, quality: 4 });
			const goo = new PIXI.ColorMatrixFilter();
			// Crank the alpha channel: overlapping blurred blobs snap into one mass.
			goo.matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 26, -11];
			layer.filters = [blur, goo];

			let t = 0;
			app.ticker.add(() => {
				t += 0.008;
				const cx = window.innerWidth / 2;
				const cy = window.innerHeight / 2;
				const drift = isActive ? 240 : 90; // menu docking = wider, livelier melt
				for (const b of blobs) {
					const x = cx + Math.cos(t + b.phase) * drift;
					const y = cy + Math.sin(t * 1.3 + b.phase) * drift;
					b.g.clear();
					b.g.circle(x, y, b.r).fill({ color: 0x6bbf7b, alpha: 0.9 });
				}
			});

			destroy = () => app.destroy(true);
		})();

		return () => {
			disposed = true;
			destroy();
		};
	});
</script>

<div bind:this={host} class="fx" aria-hidden="true"></div>

<style>
	.fx {
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		opacity: 0.5;
	}
	.fx :global(canvas) {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
