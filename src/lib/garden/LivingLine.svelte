<script lang="ts">
	import { onMount } from 'svelte';
	import { hashSeed, rng } from './lsystem';
	import { prefersReducedMotion, revealOnce } from './reveal';

	interface Radii {
		tl: number;
		tr: number;
		br: number;
		bl: number;
	}

	let {
		variant = 'underline',
		seed = 'line',
		grow = undefined,
		delay = 0,
		radii = { tl: 6, tr: 34, br: 6, bl: 34 },
		thickness
	}: {
		/** 'underline' — wavy branch with twigs + hanging leaves (section rules);
		 *  'frame' — draws around a card's rounded box, leaf at the round corner;
		 *  'stem' — short vertical stem with side leaves (list dividers);
		 *  'soil' — horizontal soil line with root hairs, no leaves. */
		variant?: 'underline' | 'frame' | 'stem' | 'soil';
		seed?: string;
		/** undefined → self-observe (draw on first scroll-into-view);
		 *  boolean → external gate (e.g. a chapter's reveal state). */
		grow?: boolean;
		/** ms offset once triggered — stagger against sibling animations. */
		delay?: number;
		/** Corner radii in px for 'frame'; must match the box's border-radius. */
		radii?: Radii;
		thickness?: number;
	} = $props();

	/* A structural line that grows like wood instead of appearing: the main
	 * path draws via a one-shot stroke-dashoffset transition, side twigs draw
	 * as its tip passes them, leaves pop after. No rAF anywhere — the class
	 * flip is the only JS; the browser runs (and ends) every animation. The
	 * static CSS border underneath stays for SSR/no-JS and is hidden by the
	 * page only once hydrated. */

	const LEAF_D = 'M0 0 C 5 -4 5 -12 0 -16 C -5 -12 -5 -4 0 0 Z';

	interface Twig {
		d: string;
		l: number;
		t: number;
	}
	interface LeafArt {
		x: number;
		y: number;
		a: number;
		s: number;
		t: number;
	}

	let root = $state<HTMLSpanElement | null>(null);
	let pathEl = $state<SVGPathElement | null>(null);
	let W = $state(0);
	let H = $state(0);
	let d = $state('');
	let len = $state(0);
	let twigs = $state<Twig[]>([]);
	let leaves = $state<LeafArt[]>([]);
	let armed = $state(false);
	let ready = $state(false);
	let instant = $state(false);

	const stroke = $derived(thickness ?? (variant === 'frame' ? 1.5 : 2));
	const drawMs = $derived(variant === 'frame' ? 1200 : variant === 'stem' ? 700 : 950);
	const vbW = $derived(variant === 'stem' ? 14 : Math.max(W, 1));
	const vbH = $derived(variant === 'frame' || variant === 'stem' ? Math.max(H, 1) : 30);

	function build(w: number, h: number) {
		const rand = rng(hashSeed(`${seed}:${Math.round(w)}x${Math.round(h)}`));
		const tw: Twig[] = [];
		const lv: LeafArt[] = [];
		if (variant === 'underline' || variant === 'soil') {
			const y = 6;
			let dd = `M1 ${(y + (rand() - 0.5)).toFixed(1)}`;
			const steps = Math.max(2, Math.round(w / 110));
			for (let i = 1; i <= steps; i++) {
				const x = 1 + ((w - 2) * i) / steps;
				const cx = 1 + ((w - 2) * (i - 0.5)) / steps;
				dd += ` Q ${cx.toFixed(1)} ${(y + (rand() * 2 - 1) * 2.6).toFixed(1)}, ${x.toFixed(1)} ${(y + (rand() * 2 - 1) * 1.6).toFixed(1)}`;
			}
			d = dd;
			const nT = Math.max(2, Math.round(w / 170));
			for (let i = 0; i < nT; i++) {
				const t = 0.14 + (0.78 * i) / Math.max(1, nT - 1) + (rand() - 0.5) * 0.07;
				const x = 1 + (w - 2) * t;
				const down = variant === 'soil' || rand() > 0.28;
				const tl = 6 + rand() * 6;
				tw.push({
					d: `M${x.toFixed(1)} ${y} q ${(rand() * 6 - 3).toFixed(1)} ${((down ? 1 : -1) * tl * 0.6).toFixed(1)} ${(rand() * 8 - 4).toFixed(1)} ${((down ? 1 : -1) * tl).toFixed(1)}`,
					l: tl * 1.6,
					t
				});
			}
			if (variant === 'underline') {
				const nL = Math.min(6, Math.max(2, Math.round(w / 200)));
				for (let i = 0; i < nL; i++) {
					const t = 0.12 + (0.8 * i) / Math.max(1, nL - 1) + (rand() - 0.5) * 0.06;
					lv.push({
						x: +(1 + (w - 2) * t).toFixed(1),
						y: y + 1.5,
						a: +(180 + (rand() * 2 - 1) * 38).toFixed(1),
						s: +(0.5 + rand() * 0.22).toFixed(2),
						t
					});
				}
			}
		} else if (variant === 'stem') {
			const x = 5;
			let dd = `M${x} 1`;
			const steps = Math.max(2, Math.round(h / 46));
			for (let i = 1; i <= steps; i++) {
				const yy = 1 + ((h - 2) * i) / steps;
				const cy = 1 + ((h - 2) * (i - 0.5)) / steps;
				dd += ` Q ${(x + (rand() * 2 - 1) * 2.4).toFixed(1)} ${cy.toFixed(1)}, ${(x + (rand() * 2 - 1) * 1.4).toFixed(1)} ${yy.toFixed(1)}`;
			}
			d = dd;
			const nL = h > 64 ? 2 : 1;
			for (let i = 0; i < nL; i++) {
				const t = nL === 1 ? 0.55 : 0.3 + 0.45 * i + (rand() - 0.5) * 0.1;
				lv.push({
					x,
					y: +(1 + (h - 2) * t).toFixed(1),
					a: +(-104 + rand() * 26).toFixed(1),
					s: +(0.42 + rand() * 0.16).toFixed(2),
					t
				});
			}
		} else {
			const ins = 1;
			const { tl, tr, br, bl } = radii;
			const x2 = w - ins;
			const y2 = h - ins;
			// A tendril climbing from the bottom-left corner, clockwise.
			d = [
				`M${ins} ${y2 - bl}`,
				`L${ins} ${ins + tl}`,
				`A${tl} ${tl} 0 0 1 ${ins + tl} ${ins}`,
				`L${x2 - tr} ${ins}`,
				`A${tr} ${tr} 0 0 1 ${x2} ${ins + tr}`,
				`L${x2} ${y2 - br}`,
				`A${br} ${br} 0 0 1 ${x2 - br} ${y2}`,
				`L${ins + bl} ${y2}`,
				`A${bl} ${bl} 0 0 1 ${ins} ${y2 - bl}`
			].join(' ');
			// One leaf sprouting off the roundest top corner.
			const topRight = tr >= tl;
			const r = Math.max(tr, tl, 4);
			lv.push({
				x: +(topRight ? x2 - r * 0.29 : ins + r * 0.29).toFixed(1),
				y: +(ins + r * 0.29).toFixed(1),
				a: topRight ? 38 : -38,
				s: 0.62,
				t: topRight ? 0.55 : 0.28
			});
		}
		twigs = tw;
		leaves = lv;
	}

	// Measure once per rebuild; enable transitions only on the NEXT frame so
	// the dashoffset jump to "hidden" never animates as an un-draw.
	$effect(() => {
		if (!pathEl || !d) return;
		len = pathEl.getTotalLength();
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
			const r = entries[0].contentRect;
			const w = Math.round(r.width);
			const h = Math.round(r.height);
			if (w > 4 && (Math.abs(w - W) > 2 || Math.abs(h - H) > 2)) {
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

<span class="living-line" class:on={armed} class:ready class:instant bind:this={root} aria-hidden="true">
	{#if d && W > 0}
		<svg viewBox="0 0 {vbW} {vbH}">
			<path
				class="main"
				bind:this={pathEl}
				{d}
				fill="none"
				stroke-width={stroke}
				stroke-linecap="round"
				style="--len:{len.toFixed(1)}; --dur:{drawMs}ms; --del:{delay}ms"
			/>
			{#each twigs as t, i (i)}
				<path
					class="twig"
					d={t.d}
					fill="none"
					stroke-linecap="round"
					style="--tw:{t.l.toFixed(1)}; --td:{Math.round(delay + drawMs * t.t)}ms"
				/>
			{/each}
			{#each leaves as l, i (i)}
				<g transform="translate({l.x} {l.y}) rotate({l.a}) scale({l.s})">
					<path class="leafp" d={LEAF_D} style="--ld:{Math.round(delay + drawMs * l.t + 140)}ms" />
				</g>
			{/each}
		</svg>
	{/if}
</span>

<style>
	.living-line {
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
	.main {
		stroke: var(--line-stroke, var(--garden-stem, #3f6d4e));
		stroke-dasharray: var(--len);
		stroke-dashoffset: var(--len);
		opacity: 0;
	}
	.ready .main {
		opacity: var(--line-op, 0.85);
		transition: stroke-dashoffset var(--dur) cubic-bezier(0.33, 1, 0.68, 1) var(--del);
	}
	.on .main {
		stroke-dashoffset: 0;
	}
	.twig {
		stroke: var(--line-stroke, var(--garden-stem, #3f6d4e));
		stroke-width: 1.3;
		stroke-dasharray: var(--tw);
		stroke-dashoffset: var(--tw);
		opacity: 0;
	}
	.ready .twig {
		opacity: calc(var(--line-op, 0.85) * 0.85);
		transition: stroke-dashoffset 480ms ease-out var(--td);
	}
	.on .twig {
		stroke-dashoffset: 0;
	}
	.leafp {
		fill: var(--line-leaf, var(--garden-leaf, #6bbf7b));
		transform: scale(0);
		transform-box: fill-box;
		transform-origin: 50% 100%;
		opacity: 0.92;
	}
	.ready .leafp {
		transition: transform 620ms cubic-bezier(0.22, 1, 0.36, 1) var(--ld);
	}
	.on .leafp {
		transform: scale(1);
	}
	/* Reduced motion: fully grown, no transitions, first paint. */
	.instant .main,
	.instant .twig {
		transition: none;
		stroke-dashoffset: 0;
		opacity: var(--line-op, 0.85);
	}
	.instant .twig {
		opacity: calc(var(--line-op, 0.85) * 0.85);
	}
	.instant .leafp {
		transition: none;
		transform: scale(1);
	}
</style>
