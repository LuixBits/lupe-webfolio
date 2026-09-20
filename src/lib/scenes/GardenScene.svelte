<script lang="ts">
	import { onMount } from 'svelte';
	import Garden from '$lib/garden/Garden.svelte';
	import { growPlant, hashSeed, BRANCH_PRESET } from '$lib/garden/lsystem';
	import type { DockPosition } from '$lib/radial-menu/types';

	let {
		corner = 'bottom-left',
		sectionId = 'about',
		variant = 'corner'
	}: { corner?: DockPosition; sectionId?: string | null; variant?: 'corner' | 'hub' } = $props();

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

	/* ---------------- hub variant: full-square meadow ----------------
	 * Design space 1000×625, bottom-anchored (xMidYMax slice) so the ground
	 * always hugs the panel's bottom edge and only sky crops away on wide
	 * panels. The radial wheel covers the panel's bottom-right corner, so the
	 * hero flora lives left/centre and the right side stays low and quiet. */

	const HW = 1000;
	const HH = 625;
	const LEAF_D = 'M0 0 C 5 -4 5 -12 0 -16 C -5 -12 -5 -4 0 0 Z';

	/** Deterministic 0..1 hash — no Math.random anywhere. */
	function mix(n: number): number {
		let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
		x ^= x >>> 13;
		x = Math.imul(x, 0xc2b2ae35);
		x ^= x >>> 16;
		return (x >>> 0) / 4294967296;
	}

	interface HubPlant {
		paths: { d: string; w: number }[];
		leaves: { x: number; y: number; a: number; s: number }[];
	}

	/** L-system plant compiled into one stroke path per branch depth. */
	function hubPlant(seedStr: string, x: number, y: number, step: number): HubPlant {
		const plant = growPlant(x, y, { ...BRANCH_PRESET, step, seed: hashSeed(seedStr) });
		const byDepth: string[][] = [];
		for (const s of plant.segments) {
			const d = Math.min(s.depth, 5);
			(byDepth[d] ??= []).push(
				`M${s.x1.toFixed(1)} ${s.y1.toFixed(1)}L${s.x2.toFixed(1)} ${s.y2.toFixed(1)}`
			);
		}
		const k = step / 6;
		const paths = byDepth
			.map((arr, d) => ({ d: arr?.join('') ?? '', w: Math.max(0.7, (3 - d * 0.7) * k) }))
			.filter((p) => p.d);
		const leaves = plant.leaves.map((l) => ({
			x: +l.x.toFixed(1),
			y: +l.y.toFixed(1),
			a: +l.angle.toFixed(1),
			s: +(0.9 * k).toFixed(2)
		}));
		return { paths, leaves };
	}

	interface Blade {
		d: string;
		w: number;
		o: number;
	}

	interface CanopyLeaf {
		x: number;
		y: number;
		a: number;
		s: number;
		dark: boolean;
	}

	type Pt = [number, number];

	function cubicPt(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
		const u = 1 - t;
		return [
			u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
			u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]
		];
	}

	/** Leaf clusters hung along a cubic branch — the overhanging canopy that
	 *  frames the panel's outer (top-left) corner. */
	function canopyLeaves(
		seedBase: number,
		p0: Pt,
		p1: Pt,
		p2: Pt,
		p3: Pt,
		count: number
	): CanopyLeaf[] {
		const out: CanopyLeaf[] = [];
		for (let i = 0; i < count; i++) {
			const k = seedBase * 173 + i * 9;
			const t = 0.08 + (0.9 * i) / Math.max(1, count - 1) + (mix(k) - 0.5) * 0.06;
			const [bx, by] = cubicPt(p0, p1, p2, p3, Math.min(1, Math.max(0, t)));
			const [ax, ay] = cubicPt(p0, p1, p2, p3, Math.min(1, Math.max(0, t) + 0.02));
			const tangent = (Math.atan2(ay - by, ax - bx) * 180) / Math.PI;
			// hang leaves mostly below the branch, fanning around the tangent
			const side = mix(k + 1) > 0.22 ? 1 : -1;
			out.push({
				x: +(bx + (mix(k + 2) - 0.5) * 14).toFixed(1),
				y: +(by + (mix(k + 3) - 0.3) * 16).toFixed(1),
				a: +(tangent + 90 + side * (25 + 48 * mix(k + 4))).toFixed(1),
				s: +(1.25 + 1.1 * mix(k + 5)).toFixed(2),
				dark: mix(k + 6) > 0.55
			});
		}
		return out;
	}

	/** A tuft of curved grass blades around (cx, baseY). */
	function clump(seedBase: number, cx: number, baseY: number, count: number, h: number, spread = 46): Blade[] {
		const out: Blade[] = [];
		for (let i = 0; i < count; i++) {
			const k = seedBase * 131 + i * 7;
			const dx = (mix(k) - 0.5) * spread;
			const bh = h * (0.55 + 0.6 * mix(k + 1));
			const bend = (mix(k + 2) - 0.38) * 40;
			out.push({
				d: `M${(cx + dx).toFixed(1)} ${baseY}Q${(cx + dx + bend * 0.2).toFixed(1)} ${(baseY - bh * 0.55).toFixed(1)} ${(cx + dx + bend).toFixed(1)} ${(baseY - bh).toFixed(1)}`,
				w: +(1.5 + 1.9 * mix(k + 3)).toFixed(1),
				o: +(0.45 + 0.5 * mix(k + 4)).toFixed(2)
			});
		}
		return out;
	}

	// Overhanging canopy branches framing the top-left (outer) corner.
	const CANOPY_A: [Pt, Pt, Pt, Pt] = [[-40, 14], [150, 46], [270, 92], [430, 96]];
	const CANOPY_B: [Pt, Pt, Pt, Pt] = [[-30, 84], [110, 116], [200, 150], [300, 152]];

	const hub = $derived.by(() => {
		if (variant !== 'hub') return null;
		const hseed = hashSeed(sectionId ?? 'about');
		return {
			uid: `gh-${hseed.toString(36)}`,
			canopyA: canopyLeaves(hseed + 41, ...CANOPY_A, 19),
			canopyB: canopyLeaves(hseed + 42, ...CANOPY_B, 14),
			// plants, back to front
			far: hubPlant('about-far', 610, 514, 4.6),
			right: hubPlant('about-right', 862, 524, 5.2),
			mid: hubPlant('about-companion', 372, 564, 7),
			hero: hubPlant('about-hero', 168, 602, 10.4),
			edge: hubPlant('about-edge', 34, 620, 6),
			// grass, back to front
			backGrass: [
				...clump(hseed + 1, 95, 558, 7, 52),
				...clump(hseed + 2, 335, 556, 6, 46),
				...clump(hseed + 3, 585, 558, 7, 50),
				...clump(hseed + 4, 905, 556, 6, 44)
			],
			frontGrass: [
				...clump(hseed + 11, 62, 622, 8, 78, 60),
				...clump(hseed + 12, 235, 620, 7, 62),
				...clump(hseed + 13, 328, 623, 6, 72),
				...clump(hseed + 14, 486, 621, 8, 66, 56),
				...clump(hseed + 15, 575, 624, 6, 58),
				...clump(hseed + 16, 715, 622, 7, 64),
				...clump(hseed + 17, 872, 623, 7, 56, 54),
				...clump(hseed + 18, 968, 622, 5, 60)
			],
			motes: Array.from({ length: 7 }, (_, i) => ({
				x: +(70 + 850 * mix(hseed + 900 + i * 13)).toFixed(0),
				y: +(210 + 290 * mix(hseed + 901 + i * 13)).toFixed(0),
				r: +(1.4 + 1.2 * mix(hseed + 902 + i * 13)).toFixed(1),
				dur: +(11 + 8 * mix(hseed + 903 + i * 13)).toFixed(1),
				delay: +(-16 * mix(hseed + 904 + i * 13)).toFixed(1)
			}))
		};
	});
</script>

{#snippet plantG(p: HubPlant, cls: string, stem: string, leaf: string, leafOp: number, style = '')}
	<g class={cls} {style}>
		{#each p.paths as pp, i (i)}
			<path d={pp.d} fill="none" stroke={stem} stroke-width={pp.w} stroke-linecap="round" />
		{/each}
		{#each p.leaves as l, i (i)}
			<path
				d={LEAF_D}
				fill={leaf}
				opacity={leafOp}
				transform="translate({l.x} {l.y}) rotate({l.a}) scale({l.s})"
			/>
		{/each}
	</g>
{/snippet}

{#snippet grassG(blades: Blade[], cls: string, stroke: string, style = '')}
	<g class={cls} {style}>
		{#each blades as b, i (i)}
			<path d={b.d} fill="none" stroke={stroke} stroke-width={b.w} opacity={b.o} stroke-linecap="round" />
		{/each}
	</g>
{/snippet}

{#snippet flowerG(x: number, y: number, h: number, lean: number, s: number, style = '')}
	<g class="sway" {style}>
		<path
			d="M{x} {y} Q {x + lean * 0.35} {y - h * 0.55} {x + lean} {y - h}"
			fill="none"
			stroke="var(--garden-stem, #3f6d4e)"
			stroke-width={1.7 * s}
			stroke-linecap="round"
		/>
		<path
			d={LEAF_D}
			fill="var(--garden-leaf, #6bbf7b)"
			opacity="0.85"
			transform="translate({x + lean * 0.18} {y - h * 0.4}) rotate({lean > 0 ? 118 : -118}) scale({0.62 * s})"
		/>
		<g transform="translate({x + lean} {y - h}) scale({s})">
			{#each [0, 72, 144, 216, 288] as a (a)}
				<ellipse
					cx="0"
					cy="-5.4"
					rx="3.1"
					ry="5.7"
					fill="color-mix(in srgb, #ffffff 78%, var(--garden-leaf, #6bbf7b))"
					transform="rotate({a})"
					opacity="0.95"
				/>
			{/each}
			<circle r="2.8" fill="var(--sub-bg, #d9a441)" />
		</g>
	</g>
{/snippet}

{#if variant === 'hub' && hub}
	<div class="garden-hub" aria-hidden="true">
		<svg viewBox="0 0 {HW} {HH}" preserveAspectRatio="xMidYMax slice">
			<defs>
				<linearGradient id="{hub.uid}-sky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stop-color="color-mix(in srgb, #ffffff 40%, var(--bg, #eef5ef))" />
					<stop offset="0.62" stop-color="var(--bg, #eef5ef)" />
					<stop offset="1" stop-color="color-mix(in srgb, var(--garden-leaf, #6bbf7b) 16%, var(--bg, #eef5ef))" />
				</linearGradient>
				<radialGradient id="{hub.uid}-sun" cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stop-color="#fff3c9" stop-opacity="0.6" />
					<stop offset="0.55" stop-color="#fff3c9" stop-opacity="0.22" />
					<stop offset="1" stop-color="#fff3c9" stop-opacity="0" />
				</radialGradient>
				<radialGradient id="{hub.uid}-dapple" cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stop-color="#fffbe8" stop-opacity="0.75" />
					<stop offset="1" stop-color="#fffbe8" stop-opacity="0" />
				</radialGradient>
				<radialGradient id="{hub.uid}-cloud" cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stop-color="#ffffff" stop-opacity="0.85" />
					<stop offset="0.6" stop-color="#ffffff" stop-opacity="0.45" />
					<stop offset="1" stop-color="#ffffff" stop-opacity="0" />
				</radialGradient>
			</defs>

			<!-- sky + soft sun in the panel's outer (top-left) corner -->
			<rect width={HW} height={HH} fill="url(#{hub.uid}-sky)" />
			<ellipse cx="130" cy="55" rx="430" ry="300" fill="url(#{hub.uid}-sun)" />

			<!-- dappled light drifting through the canopy -->
			<g>
				<circle class="dapple" cx="265" cy="170" r="125" fill="url(#{hub.uid}-dapple)" opacity="0.6" />
				<circle class="dapple d2" cx="545" cy="115" r="155" fill="url(#{hub.uid}-dapple)" opacity="0.5" />
				<circle class="dapple d3" cx="790" cy="195" r="105" fill="url(#{hub.uid}-dapple)" opacity="0.55" />
			</g>

			<!-- soft clouds drifting through the mid sky -->
			<g class="cloud">
				<ellipse cx="672" cy="150" rx="118" ry="34" fill="url(#{hub.uid}-cloud)" />
				<ellipse cx="620" cy="164" rx="72" ry="24" fill="url(#{hub.uid}-cloud)" />
				<ellipse cx="730" cy="166" rx="80" ry="22" fill="url(#{hub.uid}-cloud)" />
			</g>
			<g class="cloud c2">
				<ellipse cx="885" cy="252" rx="86" ry="24" fill="url(#{hub.uid}-cloud)" opacity="0.8" />
				<ellipse cx="840" cy="264" rx="52" ry="16" fill="url(#{hub.uid}-cloud)" opacity="0.8" />
			</g>
			<g class="cloud c3">
				<ellipse cx="420" cy="320" rx="70" ry="18" fill="url(#{hub.uid}-cloud)" opacity="0.6" />
			</g>

			<!-- distant hills -->
			<path
				d="M0 398 C 170 364 370 380 545 398 C 720 416 880 402 1000 416 L1000 625 L0 625 Z"
				fill="color-mix(in srgb, var(--accent, #4f8a63) 13%, var(--bg, #eef5ef))"
			/>
			<path
				d="M0 452 C 140 416 330 428 480 452 C 640 476 820 462 1000 472 L1000 625 L0 625 Z"
				fill="color-mix(in srgb, var(--accent, #4f8a63) 22%, var(--bg, #eef5ef))"
			/>

			<!-- hazy tree on the far hill -->
			<g opacity="0.85">
				<path
					d="M746 474 C 745 452 746 440 746 426"
					fill="none"
					stroke="color-mix(in srgb, var(--garden-stem, #3f6d4e) 45%, var(--bg, #eef5ef))"
					stroke-width="5"
					stroke-linecap="round"
				/>
				<ellipse cx="746" cy="406" rx="36" ry="27" fill="color-mix(in srgb, var(--accent, #4f8a63) 38%, var(--bg, #eef5ef))" />
				<ellipse cx="720" cy="420" rx="23" ry="17" fill="color-mix(in srgb, var(--accent, #4f8a63) 34%, var(--bg, #eef5ef))" />
				<ellipse cx="772" cy="422" rx="23" ry="16" fill="color-mix(in srgb, var(--accent, #4f8a63) 34%, var(--bg, #eef5ef))" />
			</g>

			<!-- distant birds riding the breeze -->
			<g class="cloud c4" fill="none" stroke="var(--fg-muted, #3c5346)" stroke-width="1.7" stroke-linecap="round" opacity="0.55">
				<path d="M786 184 Q 792 179 798 184 M798 184 Q 804 179 810 184" />
				<path d="M834 206 Q 839 202 844 206 M844 206 Q 849 202 854 206" />
				<path d="M756 216 Q 760 213 764 216 M764 216 Q 768 213 772 216" />
			</g>

			<!-- far meadow band + back flora -->
			<path
				d="M0 508 C 120 496 260 514 400 506 C 560 498 720 516 860 508 C 920 504 960 508 1000 506 L1000 625 L0 625 Z"
				fill="color-mix(in srgb, var(--garden-leaf, #6bbf7b) 34%, var(--bg, #eef5ef))"
			/>
			{@render plantG(
				hub.far,
				'sway s3',
				'color-mix(in srgb, var(--garden-stem, #3f6d4e) 62%, var(--bg, #eef5ef))',
				'color-mix(in srgb, var(--garden-leaf, #6bbf7b) 68%, var(--bg, #eef5ef))',
				0.85
			)}
			{@render plantG(
				hub.right,
				'sway s4',
				'color-mix(in srgb, var(--garden-stem, #3f6d4e) 62%, var(--bg, #eef5ef))',
				'color-mix(in srgb, var(--garden-leaf, #6bbf7b) 68%, var(--bg, #eef5ef))',
				0.85
			)}
			{@render grassG(
				hub.backGrass,
				'grass-sway g1',
				'color-mix(in srgb, var(--garden-leaf, #6bbf7b) 62%, var(--bg, #eef5ef))'
			)}

			<!-- mid meadow band + companion plant + flowers -->
			<path
				d="M0 558 C 150 542 300 562 460 552 C 620 542 780 564 1000 552 L1000 625 L0 625 Z"
				fill="color-mix(in srgb, var(--garden-leaf, #6bbf7b) 55%, var(--bg, #eef5ef))"
			/>
			{@render plantG(
				hub.mid,
				'sway s2',
				'color-mix(in srgb, var(--garden-stem, #3f6d4e) 84%, var(--bg, #eef5ef))',
				'var(--garden-leaf, #6bbf7b)',
				0.9
			)}
			{@render flowerG(302, 560, 66, 8, 1, 'animation-duration: 6.4s; animation-delay: -1.8s')}
			{@render flowerG(560, 558, 82, -10, 1.12, 'animation-duration: 7.8s; animation-delay: -4.1s')}
			{@render flowerG(766, 510, 62, -8, 0.9, 'animation-duration: 7.1s; animation-delay: -2.9s')}

			<!-- pools of light on the meadow -->
			<ellipse class="dapple d4" cx="690" cy="540" rx="160" ry="42" fill="url(#{hub.uid}-dapple)" opacity="0.5" />
			<ellipse class="dapple d5" cx="300" cy="578" rx="130" ry="34" fill="url(#{hub.uid}-dapple)" opacity="0.45" />

			<!-- near band + hero flora -->
			<path
				d="M0 598 C 180 586 330 602 520 594 C 700 586 860 602 1000 592 L1000 625 L0 625 Z"
				fill="color-mix(in srgb, var(--garden-stem, #3f6d4e) 56%, var(--bg, #eef5ef))"
			/>
			{@render plantG(hub.hero, 'sway s1', 'var(--garden-stem, #3f6d4e)', 'var(--garden-leaf, #6bbf7b)', 0.95)}
			{@render plantG(hub.edge, 'sway s5', 'var(--garden-stem, #3f6d4e)', 'var(--garden-leaf, #6bbf7b)', 0.95)}
			{@render grassG(hub.frontGrass, 'grass-sway g2', 'var(--garden-stem, #3f6d4e)')}

			<!-- two leaves adrift on the breeze -->
			<g class="leaf-drift la">
				<path d={LEAF_D} fill="var(--garden-leaf, #6bbf7b)" opacity="0.9" transform="translate(600 220) rotate(40) scale(1.15)" />
			</g>
			<g class="leaf-drift lb">
				<path d={LEAF_D} fill="color-mix(in srgb, var(--garden-leaf, #6bbf7b) 75%, #d9a441)" opacity="0.85" transform="translate(840 160) rotate(-70) scale(0.95)" />
			</g>

			<!-- overhanging canopy framing the outer corner -->
			<g class="canopy">
				<path
					d="M-40 14 C 150 46 270 92 430 96"
					fill="none"
					stroke="var(--garden-stem, #3f6d4e)"
					stroke-width="6.5"
					stroke-linecap="round"
				/>
				<path
					d="M232 78 Q 268 104 276 138"
					fill="none"
					stroke="var(--garden-stem, #3f6d4e)"
					stroke-width="3.4"
					stroke-linecap="round"
				/>
				<path d={LEAF_D} fill="var(--garden-leaf, #6bbf7b)" opacity="0.95" transform="translate(260 102) rotate(146) scale(1.5)" />
				<path
					d={LEAF_D}
					fill="color-mix(in srgb, var(--garden-leaf, #6bbf7b) 55%, var(--garden-stem, #3f6d4e))"
					opacity="0.95"
					transform="translate(272 124) rotate(178) scale(1.55)"
				/>
				<path d={LEAF_D} fill="var(--garden-leaf, #6bbf7b)" opacity="0.95" transform="translate(277 141) rotate(200) scale(1.4)" />
				<path d={LEAF_D} fill="var(--garden-leaf, #6bbf7b)" opacity="0.95" transform="translate(352 96) rotate(152) scale(1.45)" />
				<path
					d={LEAF_D}
					fill="color-mix(in srgb, var(--garden-leaf, #6bbf7b) 55%, var(--garden-stem, #3f6d4e))"
					opacity="0.95"
					transform="translate(392 100) rotate(120) scale(1.35)"
				/>
				<path
					d="M-30 84 C 110 116 200 150 300 152"
					fill="none"
					stroke="var(--garden-stem, #3f6d4e)"
					stroke-width="4.4"
					stroke-linecap="round"
				/>
				{#each hub.canopyA as l, i (i)}
					<path
						d={LEAF_D}
						fill={l.dark
							? 'color-mix(in srgb, var(--garden-leaf, #6bbf7b) 55%, var(--garden-stem, #3f6d4e))'
							: 'var(--garden-leaf, #6bbf7b)'}
						opacity="0.95"
						transform="translate({l.x} {l.y}) rotate({l.a}) scale({l.s})"
					/>
				{/each}
				{#each hub.canopyB as l, i (i)}
					<path
						d={LEAF_D}
						fill={l.dark
							? 'color-mix(in srgb, var(--garden-leaf, #6bbf7b) 55%, var(--garden-stem, #3f6d4e))'
							: 'var(--garden-leaf, #6bbf7b)'}
						opacity="0.95"
						transform="translate({l.x} {l.y}) rotate({l.a}) scale({l.s})"
					/>
				{/each}
			</g>

			<!-- floating pollen motes -->
			{#each hub.motes as m, i (i)}
				<circle
					class="mote"
					cx={m.x}
					cy={m.y}
					r={m.r}
					fill="#fff6d8"
					style="animation-duration: {m.dur}s; animation-delay: {m.delay}s"
				/>
			{/each}
		</svg>
	</div>
{:else}
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
{/if}

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

	/* ---------------- hub meadow ---------------- */
	.garden-hub {
		position: absolute;
		inset: 0;
	}
	.garden-hub svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}
	/* Gentle breeze: plants and grass pivot around their rooted base. */
	.sway,
	.grass-sway {
		transform-box: fill-box;
		transform-origin: 50% 100%;
		animation: garden-sway 7s ease-in-out infinite alternate;
	}
	.grass-sway {
		animation-name: garden-grass-sway;
	}
	.sway.s1 {
		animation-duration: 8.4s;
	}
	.sway.s2 {
		animation-duration: 7.2s;
		animation-delay: -2.4s;
	}
	.sway.s3 {
		animation-duration: 9.1s;
		animation-delay: -4.6s;
	}
	.sway.s4 {
		animation-duration: 8s;
		animation-delay: -1.3s;
	}
	.sway.s5 {
		animation-duration: 7.7s;
		animation-delay: -3.5s;
	}
	.grass-sway.g1 {
		animation-duration: 5.8s;
		animation-delay: -1.9s;
	}
	.grass-sway.g2 {
		animation-duration: 6.6s;
		animation-delay: -3.2s;
	}
	@keyframes garden-sway {
		from {
			transform: rotate(-1.1deg);
		}
		to {
			transform: rotate(1.3deg);
		}
	}
	@keyframes garden-grass-sway {
		from {
			transform: rotate(-2.1deg) skewX(-1deg);
		}
		to {
			transform: rotate(2.3deg) skewX(1.2deg);
		}
	}
	/* Canopy pivots almost imperceptibly around the corner it grows from. */
	.canopy {
		transform-box: view-box;
		transform-origin: 0% 0%;
		animation: garden-canopy 11s ease-in-out infinite alternate;
	}
	@keyframes garden-canopy {
		from {
			transform: rotate(-0.5deg);
		}
		to {
			transform: rotate(0.7deg);
		}
	}
	.dapple {
		animation: garden-dapple 24s ease-in-out infinite alternate;
	}
	.dapple.d2 {
		animation-duration: 30s;
		animation-delay: -9s;
		animation-direction: alternate-reverse;
	}
	.dapple.d3 {
		animation-duration: 27s;
		animation-delay: -16s;
	}
	.dapple.d4 {
		animation-duration: 21s;
		animation-delay: -5s;
		animation-direction: alternate-reverse;
	}
	.dapple.d5 {
		animation-duration: 26s;
		animation-delay: -13s;
	}
	@keyframes garden-dapple {
		from {
			transform: translate(0, 0);
		}
		to {
			transform: translate(28px, 12px);
		}
	}
	.cloud {
		animation: garden-cloud 44s ease-in-out infinite alternate;
	}
	.cloud.c2 {
		animation-duration: 56s;
		animation-delay: -20s;
		animation-direction: alternate-reverse;
	}
	.cloud.c3 {
		animation-duration: 38s;
		animation-delay: -9s;
	}
	.cloud.c4 {
		animation-duration: 52s;
		animation-delay: -26s;
	}
	@keyframes garden-cloud {
		from {
			transform: translate(-16px, 0);
		}
		to {
			transform: translate(26px, 0);
		}
	}
	.leaf-drift {
		transform-box: fill-box;
		transform-origin: 50% 50%;
		opacity: 0;
		animation: garden-leaf-drift 32s linear infinite;
	}
	.leaf-drift.lb {
		animation-duration: 41s;
		animation-delay: -19s;
	}
	@keyframes garden-leaf-drift {
		0% {
			transform: translate(30px, -20px) rotate(0deg);
			opacity: 0;
		}
		6% {
			opacity: 0.9;
		}
		78% {
			opacity: 0.9;
		}
		100% {
			transform: translate(-190px, 240px) rotate(-200deg);
			opacity: 0;
		}
	}
	.mote {
		opacity: 0;
		animation: garden-mote 14s ease-in-out infinite;
	}
	@keyframes garden-mote {
		0% {
			transform: translateY(0);
			opacity: 0;
		}
		18% {
			opacity: 0.6;
		}
		62% {
			opacity: 0.3;
		}
		100% {
			transform: translateY(-48px);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sway,
		.grass-sway,
		.canopy,
		.dapple,
		.cloud,
		.leaf-drift,
		.mote {
			animation: none;
		}
		.leaf-drift {
			opacity: 0.8;
		}
		.mote {
			opacity: 0.4;
		}
	}
</style>
