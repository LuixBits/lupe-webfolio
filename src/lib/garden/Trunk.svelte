<script lang="ts">
	import { onMount } from 'svelte';
	import { hashSeed, rng } from './lsystem';

	let {
		seed = 'trunk',
		/** Fraction of the viewport height where the growing tip rides. */
		tip = 0.78
	}: { seed?: string; tip?: number } = $props();

	/* The trunk you scroll along: a tapering filled stem (thin at the crown,
	 * thick toward the ground) with a bark sheen, tick marks, and side boughs
	 * carrying leaves. Revealed top-down by ONE clip-path inset updated per
	 * rAF-throttled scroll frame — scrolling back up retracts it. Geometry is
	 * seeded + rebuilt per resize; nothing animates while idle. */

	const W = 76; // viewBox width of the gutter strip (rendered 1:1 px)
	const CX = 38;
	const LEAF_D = 'M0 0 C 5 -4 5 -12 0 -16 C -5 -12 -5 -4 0 0 Z';

	interface Bough {
		d: string;
		leaves: { x: number; y: number; a: number; s: number }[];
	}

	let root = $state<HTMLDivElement | null>(null);
	let H = $state(0);
	let bodyD = $state('');
	let sheenD = $state('');
	let ticks = $state<string[]>([]);
	let boughs = $state<Bough[]>([]);
	let progress = $state(0);

	function build(h: number) {
		const rand = rng(hashSeed(`${seed}:${Math.round(h)}`));
		// Wandering centerline, sampled coarsely; width tapers downward.
		const n = Math.max(6, Math.round(h / 88));
		const pts: { x: number; y: number }[] = [];
		for (let i = 0; i <= n; i++) {
			const t = i / n;
			pts.push({ x: CX + (rand() * 2 - 1) * 5, y: t * h });
		}
		const half = (t: number) => 2.6 + 3.6 * t;
		// Smooth the sampled edges with midpoint quadratics so the bark curves
		// instead of kinking at every sample.
		const smooth = (edge: { x: number; y: number }[]): string => {
			let out = `${edge[0].x.toFixed(1)} ${edge[0].y.toFixed(1)}`;
			for (let i = 1; i < edge.length - 1; i++) {
				const mx = (edge[i].x + edge[i + 1].x) / 2;
				const my = (edge[i].y + edge[i + 1].y) / 2;
				out += ` Q ${edge[i].x.toFixed(1)} ${edge[i].y.toFixed(1)}, ${mx.toFixed(1)} ${my.toFixed(1)}`;
			}
			const last = edge[edge.length - 1];
			out += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
			return out;
		};
		const leftPts = pts.map((p, i) => ({ x: p.x - half(i / n), y: p.y }));
		const rightPts = [...pts].reverse().map((p, i) => ({ x: p.x + half((n - i) / n), y: p.y }));
		bodyD = `M${smooth(leftPts)} L ${smooth(rightPts)} Z`;
		sheenD = `M${smooth(pts.map((p) => ({ x: p.x - 1.2, y: p.y })))}`;
		// bark ticks
		const tk: string[] = [];
		const nT = Math.max(4, Math.round(h / 210));
		for (let i = 0; i < nT; i++) {
			const t = 0.12 + (0.8 * i) / Math.max(1, nT - 1) + (rand() - 0.5) * 0.06;
			const y = t * h;
			const x = CX + (rand() * 2 - 1) * 2.6;
			const len = 8 + rand() * 9;
			tk.push(
				`M${x.toFixed(1)} ${y.toFixed(1)} q ${(rand() * 2 - 1).toFixed(1)} ${(len / 2).toFixed(1)} 0 ${len.toFixed(1)}`
			);
		}
		ticks = tk;
		// side boughs with leaves, alternating
		const bs: Bough[] = [];
		const nB = Math.max(3, Math.round(h / 185));
		for (let i = 0; i < nB; i++) {
			const t = 0.08 + (0.86 * i) / Math.max(1, nB - 1) + (rand() - 0.5) * 0.05;
			const y = t * h;
			const side = i % 2 === 0 ? 1 : -1;
			const x0 = CX + side * half(t) * 0.7;
			const reach = 14 + rand() * 14;
			const drop = 6 + rand() * 12;
			const tipX = x0 + side * reach;
			const tipY = y + drop;
			bs.push({
				d: `M${x0.toFixed(1)} ${y.toFixed(1)} Q ${(x0 + side * reach * 0.55).toFixed(1)} ${(y + drop * 0.3).toFixed(1)}, ${tipX.toFixed(1)} ${tipY.toFixed(1)}`,
				leaves: Array.from({ length: 1 + (rand() > 0.55 ? 1 : 0) }, (_, k) => ({
					x: +(tipX + side * (k * 4 - 1)).toFixed(1),
					y: +(tipY - k * 6).toFixed(1),
					a: +(side * (52 + rand() * 40) + (rand() - 0.5) * 20).toFixed(1),
					s: +(0.55 + rand() * 0.3).toFixed(2),
					// deterministic per bough
					k
				})).map(({ x, y, a, s }) => ({ x, y, a, s }))
			});
		}
		boughs = bs;
	}

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

<div class="trunk" bind:this={root} aria-hidden="true">
	{#if bodyD}
		<div
			class="trunk-clip"
			style="clip-path: inset(0 -40px {((1 - progress) * 100).toFixed(2)}% -40px)"
		>
			<svg viewBox="0 0 {W} {Math.max(H, 1)}">
				<path d={bodyD} fill="var(--garden-stem, #3f6d4e)" opacity="0.92" />
				<path
					d={sheenD}
					fill="none"
					stroke="color-mix(in srgb, #ffffff 30%, var(--garden-stem, #3f6d4e))"
					stroke-width="1.6"
					stroke-linecap="round"
					opacity="0.5"
				/>
				{#each ticks as t, i (i)}
					<path
						d={t}
						fill="none"
						stroke="color-mix(in srgb, #16301f 45%, var(--garden-stem, #3f6d4e))"
						stroke-width="1.1"
						stroke-linecap="round"
						opacity="0.35"
					/>
				{/each}
				{#each boughs as b, i (i)}
					<path
						d={b.d}
						fill="none"
						stroke="var(--garden-stem, #3f6d4e)"
						stroke-width="2.2"
						stroke-linecap="round"
						opacity="0.9"
					/>
					{#each b.leaves as l, k (k)}
						<g transform="translate({l.x} {l.y}) rotate({l.a}) scale({l.s})">
							<path d={LEAF_D} fill="var(--garden-leaf, #6bbf7b)" opacity="0.92" />
						</g>
					{/each}
				{/each}
			</svg>
		</div>
	{/if}
</div>

<style>
	.trunk {
		position: absolute;
		inset: 0 auto 0 0;
		width: 76px;
		pointer-events: none;
	}
	.trunk-clip {
		position: absolute;
		inset: 0;
	}
	svg {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
</style>
