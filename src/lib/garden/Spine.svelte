<script lang="ts">
	import { onMount } from 'svelte';
	import { hashSeed, rng } from './lsystem';

	let {
		seed = 'about-spine',
		/** Fraction of the viewport height where the vine's growing tip rides. */
		tip = 0.78
	}: { seed?: string; tip?: number } = $props();

	/* A vine that draws itself down the page margin as the reader scrolls —
	 * its drawn length IS the reading progress. Perf shape: geometry is built
	 * once per resize; each scrolled frame updates ONE dashoffset attribute
	 * plus at most a couple of leaf class toggles (their unfurl is a CSS
	 * transition). No layout writes, one rect read per rAF-throttled frame. */

	const W = 64; // gutter strip width in viewBox units (rendered 1:1 px)
	const LEAF_D = 'M0 0 C 5 -4 5 -12 0 -16 C -5 -12 -5 -4 0 0 Z';

	interface SpineLeaf {
		x: number;
		y: number;
		/** Final rotation of the leaf art. */
		a: number;
		/** Fraction of total vine length where this leaf sits. */
		t: number;
		s: number;
	}

	let root = $state<HTMLDivElement | null>(null);
	let pathEl = $state<SVGPathElement | null>(null);
	let H = $state(0);
	let d = $state('');
	let len = $state(0);
	let leaves = $state<SpineLeaf[]>([]);
	let progress = $state(0);

	/** Wandering cubic down the strip — re-seeded identically every rebuild. */
	function build(h: number) {
		const rand = rng(hashSeed(seed));
		const cx = W * 0.5;
		let x = cx;
		let y = 6;
		let out = `M${x} ${y}`;
		while (y < h - 4) {
			const ny = Math.min(h - 4, y + 150 * (0.85 + rand() * 0.4));
			const nx = cx + (rand() * 2 - 1) * 16;
			const c1x = x + (rand() * 2 - 1) * 13;
			const c2x = nx + (rand() * 2 - 1) * 13;
			out += ` C ${c1x.toFixed(1)} ${(y + (ny - y) * 0.38).toFixed(1)}, ${c2x.toFixed(1)} ${(y + (ny - y) * 0.72).toFixed(1)}, ${nx.toFixed(1)} ${ny.toFixed(1)}`;
			x = nx;
			y = ny;
		}
		d = out;
	}

	// Geometry pass: measure the rendered path once per rebuild, hang leaves
	// along it (alternating sides, angled back up against the growth).
	$effect(() => {
		if (!pathEl || !d) return;
		const L = pathEl.getTotalLength();
		if (!L) return;
		const rand = rng(hashSeed(seed + '-leaves'));
		const n = Math.min(24, Math.max(6, Math.round(H / 140)));
		const out: SpineLeaf[] = [];
		for (let i = 0; i < n; i++) {
			const t = Math.min(0.985, 0.045 + (0.94 * i) / Math.max(1, n - 1) + (rand() - 0.5) * 0.03);
			const p = pathEl.getPointAtLength(L * t);
			const q = pathEl.getPointAtLength(Math.min(L, L * t + 6));
			const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
			const flip = i % 2 === 0;
			out.push({
				x: +p.x.toFixed(1),
				y: +p.y.toFixed(1),
				a: +(ang + (flip ? 215 : -35) + (rand() * 2 - 1) * 14).toFixed(1),
				t,
				s: +(1.05 + rand() * 0.5).toFixed(2)
			});
		}
		len = L;
		leaves = out;
	});

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let raf = 0;
		const update = () => {
			raf = 0;
			if (!root) return;
			const r = root.getBoundingClientRect();
			if (r.height < 1) return;
			progress = Math.min(1, Math.max(0, (window.innerHeight * tip - r.top) / r.height));
		};
		const schedule = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};

		const ro = new ResizeObserver((entries) => {
			const h = Math.round(entries[0].contentRect.height);
			if (h > 0 && Math.abs(h - H) > 2) {
				H = h;
				build(h);
			}
			if (!reduced) schedule();
		});
		if (root) ro.observe(root);

		if (reduced) {
			progress = 1;
			return () => ro.disconnect();
		}
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule, { passive: true });
		schedule();
		return () => {
			ro.disconnect();
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			if (raf) cancelAnimationFrame(raf);
		};
	});
</script>

<div class="spine" bind:this={root} aria-hidden="true">
	<svg viewBox="0 0 {W} {Math.max(H, 1)}" preserveAspectRatio="xMidYMin slice" class:ready={len > 0}>
		{#if d}
			<path
				bind:this={pathEl}
				{d}
				fill="none"
				stroke="var(--garden-stem, #3f6d4e)"
				stroke-width="2.4"
				stroke-linecap="round"
				stroke-dasharray={len || undefined}
				stroke-dashoffset={len ? len * (1 - progress) : undefined}
			/>
			{#each leaves as leaf, i (i)}
				<g transform="translate({leaf.x} {leaf.y}) rotate({leaf.a}) scale({leaf.s})">
					<path class="leaf" class:open={progress >= leaf.t} d={LEAF_D} fill="var(--garden-leaf, #6bbf7b)" />
				</g>
			{/each}
		{/if}
	</svg>
</div>

<style>
	.spine {
		position: absolute;
		inset: 0 auto 0 0;
		width: 64px;
		pointer-events: none;
	}
	svg {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
		opacity: 0;
	}
	svg.ready {
		opacity: 1;
	}
	.leaf {
		transform: scale(0);
		transform-box: fill-box;
		transform-origin: 50% 100%;
		opacity: 0.92;
		transition: transform 680ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.leaf.open {
		transform: scale(1);
	}
	@media (prefers-reduced-motion: reduce) {
		.leaf {
			transition: none;
		}
	}
</style>
