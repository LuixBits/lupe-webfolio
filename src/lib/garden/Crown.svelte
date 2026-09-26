<script lang="ts">
	import { onMount } from 'svelte';
	import { hashSeed, rng } from './lsystem';
	import { prefersReducedMotion } from './reveal';

	let { seed = 'crown' }: { seed?: string } = $props();

	/* The canopy: the top of the tree the page descends. Two long boughs arc
	 * in from the upper corners with leaves hung along them, plus a few tufts
	 * dangling straight from the top edge. Draws once on load (the crown is
	 * where you arrive); pure CSS transitions, geometry rebuilt per width. */

	const LEAF_D = 'M0 0 C 5 -4 5 -12 0 -16 C -5 -12 -5 -4 0 0 Z';

	type Pt = [number, number];
	interface CanopyLeaf {
		x: number;
		y: number;
		a: number;
		s: number;
		dark: boolean;
		t: number;
	}
	interface Tuft {
		d: string;
		l: number;
		t: number;
		leaves: CanopyLeaf[];
	}

	let root = $state<HTMLDivElement | null>(null);
	let W = $state(0);
	let H = $state(0);
	let arcA = $state('');
	let arcB = $state('');
	let arcALen = $state(0);
	let arcBLen = $state(0);
	let arcAEl = $state<SVGPathElement | null>(null);
	let arcBEl = $state<SVGPathElement | null>(null);
	let leaves = $state<CanopyLeaf[]>([]);
	let tufts = $state<Tuft[]>([]);
	let armed = $state(false);
	let ready = $state(false);
	let instant = $state(false);

	function cubicPt(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
		const u = 1 - t;
		return [
			u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
			u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]
		];
	}

	function hang(
		rand: () => number,
		p0: Pt,
		p1: Pt,
		p2: Pt,
		p3: Pt,
		count: number,
		tOffset: number
	): CanopyLeaf[] {
		const out: CanopyLeaf[] = [];
		for (let i = 0; i < count; i++) {
			const t = Math.min(
				1,
				Math.max(0, 0.06 + (0.9 * i) / Math.max(1, count - 1) + (rand() - 0.5) * 0.05)
			);
			const [bx, by] = cubicPt(p0, p1, p2, p3, t);
			const [ax, ay] = cubicPt(p0, p1, p2, p3, Math.min(1, t + 0.02));
			const tangent = (Math.atan2(ay - by, ax - bx) * 180) / Math.PI;
			const side = rand() > 0.2 ? 1 : -1;
			out.push({
				x: +(bx + (rand() - 0.5) * 12).toFixed(1),
				y: +(by + (rand() - 0.25) * 14).toFixed(1),
				a: +(tangent + 90 + side * (24 + 46 * rand())).toFixed(1),
				s: +(1.1 + rand() * 1.0).toFixed(2),
				dark: rand() > 0.55,
				t: tOffset + t
			});
		}
		return out;
	}

	function build(w: number, h: number) {
		const rand = rng(hashSeed(`${seed}:${Math.round(w)}`));
		const A: [Pt, Pt, Pt, Pt] = [
			[-40, h * 0.1],
			[w * 0.22, h * 0.36],
			[w * 0.45, h * 0.56],
			[w * 0.66, h * 0.48]
		];
		const B: [Pt, Pt, Pt, Pt] = [
			[w + 40, h * 0.06],
			[w * 0.78, h * 0.24],
			[w * 0.58, h * 0.44],
			[w * 0.4, h * 0.38]
		];
		arcA = `M${A[0][0]} ${A[0][1].toFixed(1)} C ${A[1][0].toFixed(1)} ${A[1][1].toFixed(1)}, ${A[2][0].toFixed(1)} ${A[2][1].toFixed(1)}, ${A[3][0].toFixed(1)} ${A[3][1].toFixed(1)}`;
		arcB = `M${B[0][0]} ${B[0][1].toFixed(1)} C ${B[1][0].toFixed(1)} ${B[1][1].toFixed(1)}, ${B[2][0].toFixed(1)} ${B[2][1].toFixed(1)}, ${B[3][0].toFixed(1)} ${B[3][1].toFixed(1)}`;
		const lv = [
			...hang(rand, ...A, Math.max(9, Math.round(w / 105)), 0),
			...hang(rand, ...B, Math.max(7, Math.round(w / 135)), 0.18)
		];
		// dangling tufts from the top edge between the boughs
		const tf: Tuft[] = [];
		const nT = Math.max(2, Math.round(w / 340));
		for (let i = 0; i < nT; i++) {
			const x = w * (0.18 + (0.68 * i) / Math.max(1, nT - 1) + (rand() - 0.5) * 0.08);
			const len = 20 + rand() * 26;
			const bend = (rand() - 0.5) * 18;
			const t = 0.35 + rand() * 0.4;
			const tipX = x + bend;
			const tipY = len;
			tf.push({
				d: `M${x.toFixed(1)} -4 Q ${(x + bend * 0.4).toFixed(1)} ${(len * 0.55).toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}`,
				l: len * 1.5,
				t,
				leaves: [0, 1].map((k) => ({
					x: +(tipX + (rand() - 0.5) * 8).toFixed(1),
					y: +(tipY - k * (7 + rand() * 6)).toFixed(1),
					a: +((rand() - 0.5) * 70 + (k ? -20 : 165)).toFixed(1),
					s: +(0.85 + rand() * 0.5).toFixed(2),
					dark: rand() > 0.5,
					t: t + 0.12 + k * 0.06
				}))
			});
		}
		leaves = lv;
		tufts = tf;
	}

	$effect(() => {
		if (arcAEl && arcA) arcALen = arcAEl.getTotalLength();
	});
	$effect(() => {
		if (arcBEl && arcB) arcBLen = arcBEl.getTotalLength();
	});
	$effect(() => {
		if (arcALen > 0 && arcBLen > 0) requestAnimationFrame(() => (ready = true));
	});

	onMount(() => {
		if (prefersReducedMotion()) instant = true;
		armed = true;
		const ro = new ResizeObserver((entries) => {
			const w = Math.round(entries[0].contentRect.width);
			const h = Math.round(entries[0].contentRect.height);
			if (w > 4 && Math.abs(w - W) > 2) {
				W = w;
				H = Math.max(h, 60);
				build(w, Math.max(h, 60));
			}
		});
		if (root) ro.observe(root);
		return () => ro.disconnect();
	});
</script>

<div class="crown" class:on={armed} class:ready class:instant bind:this={root} aria-hidden="true">
	{#if W > 0 && arcA}
		<svg viewBox="0 0 {W} {Math.max(H, 1)}">
			<path
				class="bough"
				bind:this={arcAEl}
				d={arcA}
				fill="none"
				stroke-width="5.5"
				stroke-linecap="round"
				style="--len:{arcALen.toFixed(1)}; --del:0ms"
			/>
			<path
				class="bough bough--thin"
				bind:this={arcBEl}
				d={arcB}
				fill="none"
				stroke-width="4"
				stroke-linecap="round"
				style="--len:{arcBLen.toFixed(1)}; --del:180ms"
			/>
			{#each tufts as tuft, i (i)}
				<path
					class="tuftstem"
					d={tuft.d}
					fill="none"
					stroke-width="2"
					stroke-linecap="round"
					style="--tw:{tuft.l.toFixed(1)}; --td:{Math.round(tuft.t * 1200)}ms"
				/>
			{/each}
			{#each [...leaves, ...tufts.flatMap((tf) => tf.leaves)] as l, i (i)}
				<g transform="translate({l.x} {l.y}) rotate({l.a}) scale({l.s})">
					<path
						class="leafp"
						class:dark={l.dark}
						d={LEAF_D}
						style="--ld:{Math.round(l.t * 1200 + 160)}ms"
					/>
				</g>
			{/each}
		</svg>
	{/if}
</div>

<style>
	.crown {
		display: block;
		pointer-events: none;
	}
	svg {
		display: block;
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.bough,
	.tuftstem {
		stroke: var(--garden-stem, #3f6d4e);
		opacity: 0;
	}
	.bough {
		stroke-dasharray: var(--len);
		stroke-dashoffset: var(--len);
	}
	.tuftstem {
		stroke-dasharray: var(--tw);
		stroke-dashoffset: var(--tw);
	}
	.ready .bough,
	.ready .tuftstem {
		opacity: 1;
	}
	.ready .bough {
		transition: stroke-dashoffset 1200ms cubic-bezier(0.33, 1, 0.68, 1) var(--del);
	}
	.ready .tuftstem {
		transition: stroke-dashoffset 520ms ease-out var(--td);
	}
	.on .bough,
	.on .tuftstem {
		stroke-dashoffset: 0;
	}
	.leafp {
		fill: var(--garden-leaf, #6bbf7b);
		opacity: 0.95;
		transform: scale(0);
		transform-box: fill-box;
		transform-origin: 50% 100%;
	}
	.leafp.dark {
		fill: color-mix(in srgb, var(--garden-leaf, #6bbf7b) 55%, var(--garden-stem, #3f6d4e));
	}
	.ready .leafp {
		transition: transform 640ms cubic-bezier(0.22, 1, 0.36, 1) var(--ld);
	}
	.on .leafp {
		transform: scale(1);
	}
	.instant .bough,
	.instant .tuftstem {
		transition: none;
		stroke-dashoffset: 0;
		opacity: 1;
	}
	.instant .leafp {
		transition: none;
		transform: scale(1);
	}
</style>
