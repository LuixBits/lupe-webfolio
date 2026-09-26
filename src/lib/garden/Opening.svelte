<script lang="ts">
	import { onMount } from 'svelte';
	import { hashSeed, rng } from './lsystem';
	import { prefersReducedMotion, revealOnce } from './reveal';

	let {
		seed = 'opening',
		variant = 'sparse',
		grow = undefined,
		delay = 0,
		bough = false,
		light = true
	}: {
		seed?: string;
		/** 'nest' — lush leaves all around (the bio bush); 'sparse' — corners
		 *  and a few edges (chapter openings); 'bower' — a woven branch frame
		 *  with corner bursts (the portrait). */
		variant?: 'nest' | 'sparse' | 'bower';
		/** undefined → self-observe; boolean → external gate. */
		grow?: boolean;
		delay?: number;
		/** Draw a connector bough from the left edge toward the trunk gutter. */
		bough?: boolean;
		/** Soft pool of light behind the content — the gap in the foliage. */
		light?: boolean;
	} = $props();

	/* An "opening": the space in the tree a content block sits in. Purely
	 * decorative and absolutely positioned by the page (usually inset a little
	 * OUTSIDE the block), it surrounds the content with foliage: leaves along
	 * the edges (denser at corners), an optional woven branch frame (bower),
	 * a pool of light, and an optional bough reaching toward the trunk. One
	 * shared observer + CSS one-shots, same contract as LivingLine. */

	const LEAF_D = 'M0 0 C 5 -4 5 -12 0 -16 C -5 -12 -5 -4 0 0 Z';

	interface EdgeLeaf {
		x: number;
		y: number;
		a: number;
		s: number;
		dark: boolean;
		d: number; // transition delay ms (pre-jittered)
	}

	let root = $state<HTMLDivElement | null>(null);
	let W = $state(0);
	let H = $state(0);
	let leaves = $state<EdgeLeaf[]>([]);
	let frameD = $state('');
	let frameD2 = $state('');
	let frameLen = $state(0);
	let frameEl = $state<SVGPathElement | null>(null);
	let boughD = $state('');
	let armed = $state(false);
	let ready = $state(false);
	let instant = $state(false);

	const uid = $derived(`op-${hashSeed(seed).toString(36)}`);

	/** Ends-dense position along one edge. */
	function biased(rand: () => number): number {
		const v = rand();
		return v < 0.5 ? Math.pow(v * 2, 1.5) / 2 : 1 - Math.pow((1 - v) * 2, 1.5) / 2;
	}

	function wavyRect(rand: () => number, w: number, h: number, inset: number, r: number): string {
		// A rounded rect with a hand-drawn wobble per side segment — woven
		// branches, not a picture frame.
		const x1 = inset;
		const y1 = inset;
		const x2 = w - inset;
		const y2 = h - inset;
		const wob = () => (rand() * 2 - 1) * 4.2;
		const seg = (fx: number, fy: number, tx: number, ty: number) => {
			const mx = (fx + tx) / 2 + (Math.abs(tx - fx) > Math.abs(ty - fy) ? 0 : wob());
			const my = (fy + ty) / 2 + (Math.abs(tx - fx) > Math.abs(ty - fy) ? wob() : 0);
			return ` Q ${mx.toFixed(1)} ${my.toFixed(1)}, ${tx.toFixed(1)} ${ty.toFixed(1)}`;
		};
		return (
			`M${x1} ${(y2 - r).toFixed(1)}` +
			seg(x1, y2 - r, x1, y1 + r) +
			` Q ${x1} ${y1}, ${(x1 + r).toFixed(1)} ${y1}` +
			seg(x1 + r, y1, x2 - r, y1) +
			` Q ${x2} ${y1}, ${x2} ${(y1 + r).toFixed(1)}` +
			seg(x2, y1 + r, x2, y2 - r) +
			` Q ${x2} ${y2}, ${(x2 - r).toFixed(1)} ${y2}` +
			seg(x2 - r, y2, x1 + r, y2) +
			` Q ${x1} ${y2}, ${x1} ${(y2 - r).toFixed(1)}`
		);
	}

	function build(w: number, h: number) {
		const rand = rng(hashSeed(`${seed}:${Math.round(w)}x${Math.round(h)}`));
		const peri = 2 * (w + h);
		const count =
			variant === 'nest'
				? Math.min(34, Math.max(16, Math.round(peri / 95)))
				: variant === 'bower'
					? Math.min(40, Math.max(20, Math.round(peri / 80)))
					: Math.min(14, Math.max(6, Math.round(peri / 190)));
		const lv: EdgeLeaf[] = [];
		// Distribute per edge, proportional to its length, ends-dense.
		const edges: { len: number; base: number }[] = [
			{ len: w, base: 0 }, // top
			{ len: h, base: 90 }, // right
			{ len: w, base: 180 }, // bottom
			{ len: h, base: 270 } // left
		];
		for (let e = 0; e < 4; e++) {
			const n = Math.max(1, Math.round((count * edges[e].len) / peri));
			for (let i = 0; i < n; i++) {
				const u = biased(rand);
				let x = 0;
				let y = 0;
				if (e === 0) {
					x = u * w;
					y = 0;
				} else if (e === 1) {
					x = w;
					y = u * h;
				} else if (e === 2) {
					x = u * w;
					y = h;
				} else {
					x = 0;
					y = u * h;
				}
				const inward = rand() < 0.12;
				lv.push({
					x: +(x + (rand() - 0.5) * 10).toFixed(1),
					y: +(y + (rand() - 0.5) * 10).toFixed(1),
					a: +(edges[e].base + (inward ? 180 : 0) + (rand() * 2 - 1) * 34).toFixed(1),
					s: +((variant === 'sparse' ? 0.45 : 0.55) + rand() * 0.42).toFixed(2),
					dark: rand() > 0.6,
					d: Math.round(delay + rand() * 680)
				});
			}
		}
		if (variant === 'bower') {
			frameD = wavyRect(rand, w, h, 2, 14);
			frameD2 = wavyRect(rand, w, h, 6.5, 11);
			// leaf bursts fanning out of each corner of the weave
			const corners: [number, number, number][] = [
				[0, 0, -135],
				[w, 0, -45],
				[w, h, 45],
				[0, h, 135]
			];
			for (const [cx, cy, base] of corners) {
				const n = 3;
				for (let k = 0; k < n; k++) {
					lv.push({
						x: +(cx + (rand() - 0.5) * 8).toFixed(1),
						y: +(cy + (rand() - 0.5) * 8).toFixed(1),
						a: +(base + 90 + (k - 1) * 30 + (rand() - 0.5) * 14).toFixed(1),
						s: +(0.72 + rand() * 0.3).toFixed(2),
						dark: rand() > 0.5,
						d: Math.round(delay + 260 + rand() * 480)
					});
				}
			}
		} else {
			frameD = '';
			frameD2 = '';
		}
		leaves = lv;
		if (bough) {
			const y = h * (0.22 + rand() * 0.3);
			boughD = `M2 ${y.toFixed(1)} C ${-18 - rand() * 8} ${(y + 4).toFixed(1)}, ${-34 - rand() * 8} ${(y + 10).toFixed(1)}, ${(-52 - rand() * 12).toFixed(1)} ${(y + 8 + rand() * 10).toFixed(1)}`;
		} else {
			boughD = '';
		}
	}

	$effect(() => {
		if (frameEl && frameD) frameLen = frameEl.getTotalLength();
	});
	$effect(() => {
		if (!W) return;
		if (variant === 'bower' && !frameLen) return;
		requestAnimationFrame(() => (ready = true));
	});
	$effect(() => {
		if (grow === true) armed = true;
	});

	onMount(() => {
		if (prefersReducedMotion()) {
			instant = true;
			armed = true;
		}
		const ro = new ResizeObserver((entries) => {
			const w = Math.round(entries[0].contentRect.width);
			const h = Math.round(entries[0].contentRect.height);
			if (w > 4 && h > 4 && (Math.abs(w - W) > 3 || Math.abs(h - H) > 3)) {
				W = w;
				H = h;
				build(w, h);
			}
		});
		if (root) ro.observe(root);
		let handle: ReturnType<typeof revealOnce> | undefined;
		if (grow === undefined && !instant && root) {
			handle = revealOnce(root, () => (armed = true));
		}
		return () => {
			ro.disconnect();
			if (handle && typeof handle === 'object') handle.destroy?.();
		};
	});
</script>

<div class="opening" class:on={armed} class:ready class:instant bind:this={root} aria-hidden="true">
	{#if W > 0}
		<svg viewBox="0 0 {W} {Math.max(H, 1)}">
			{#if light}
				<defs>
					<radialGradient id="{uid}-light" cx="0.5" cy="0.42" r="0.62">
						<stop offset="0" stop-color="#fffbe8" stop-opacity="0.55" />
						<stop offset="1" stop-color="#fffbe8" stop-opacity="0" />
					</radialGradient>
				</defs>
				<ellipse
					class="pool"
					cx={W / 2}
					cy={H / 2}
					rx={W * 0.66}
					ry={H * 0.7}
					fill="url(#{uid}-light)"
					style="--pd:{delay}ms"
				/>
			{/if}
			{#if boughD}
				<path
					class="bough"
					d={boughD}
					fill="none"
					stroke-width="2.6"
					stroke-linecap="round"
					style="--bd:{delay}ms"
				/>
			{/if}
			{#if frameD}
				<path
					class="frame"
					bind:this={frameEl}
					d={frameD}
					fill="none"
					stroke-width="2.6"
					stroke-linecap="round"
					style="--len:{frameLen.toFixed(1)}; --fd:{delay}ms"
				/>
				<path
					class="frame frame--inner"
					d={frameD2}
					fill="none"
					stroke-width="1.6"
					stroke-linecap="round"
					style="--len:{frameLen.toFixed(1)}; --fd:{delay + 260}ms"
				/>
			{/if}
			{#each leaves as l, i (i)}
				<g transform="translate({l.x} {l.y}) rotate({l.a}) scale({l.s})">
					<path class="leafp" class:dark={l.dark} d={LEAF_D} style="--ld:{l.d}ms" />
				</g>
			{/each}
		</svg>
	{/if}
</div>

<style>
	.opening {
		display: block;
		position: absolute;
		inset: 0;
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
	.pool {
		opacity: 0;
	}
	.ready .pool {
		transition: opacity 1500ms ease var(--pd);
	}
	.on .pool {
		opacity: 1;
	}
	.bough {
		stroke: var(--garden-stem, #3f6d4e);
		stroke-dasharray: 90;
		stroke-dashoffset: 90;
		opacity: 0.9;
	}
	.ready .bough {
		transition: stroke-dashoffset 560ms ease-out var(--bd);
	}
	.on .bough {
		stroke-dashoffset: 0;
	}
	.frame {
		stroke: var(--garden-stem, #3f6d4e);
		stroke-dasharray: var(--len);
		stroke-dashoffset: var(--len);
		opacity: 0;
	}
	.frame--inner {
		opacity: 0;
	}
	.ready .frame {
		opacity: 0.85;
		transition: stroke-dashoffset 1400ms cubic-bezier(0.33, 1, 0.68, 1) var(--fd);
	}
	.ready .frame--inner {
		opacity: 0.45;
	}
	.on .frame {
		stroke-dashoffset: 0;
	}
	.leafp {
		fill: var(--garden-leaf, #6bbf7b);
		opacity: 0.92;
		transform: scale(0);
		transform-box: fill-box;
		transform-origin: 50% 100%;
	}
	.leafp.dark {
		fill: color-mix(in srgb, var(--garden-leaf, #6bbf7b) 55%, var(--garden-stem, #3f6d4e));
	}
	.ready .leafp {
		transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1) var(--ld);
	}
	.on .leafp {
		transform: scale(1);
	}
	.instant .pool {
		transition: none;
		opacity: 1;
	}
	.instant .bough,
	.instant .frame {
		transition: none;
		stroke-dashoffset: 0;
	}
	.instant .frame {
		opacity: 0.85;
	}
	.instant .frame--inner {
		opacity: 0.45;
	}
	.instant .leafp {
		transition: none;
		transform: scale(1);
	}
</style>
