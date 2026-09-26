<script lang="ts">
	import { onMount } from 'svelte';
	import { hashSeed, rng } from '$lib/garden/lsystem';
	import { prefersReducedMotion } from '$lib/garden/reveal';
	import { smoothOpen, type Pt } from '$lib/garden/tree/generate';
	import Seigaiha from '../Seigaiha.svelte';
	import { ropeGeometry, leadPath, cordPath } from './generate';

	let {
		seed = 'cv-dive',
		grown = {},
		arrive = false,
		tip = 0.86,
		overlay = false,
		tags = {}
	}: {
		seed?: string;
		/** Per-zone growth flags from the page: station ids + 'waterline' +
		 *  'edu-head'/'work-head' + 'origin'. */
		grown?: Record<string, boolean>;
		/** Flips true once the page mounts — the surface settles on arrival. */
		arrive?: boolean;
		/** Viewport fraction where the paying-out rope's tip rides. */
		tip?: number;
		/** Overlay mode: the sparse second instance stacked ABOVE the content —
		 *  the companion koi and the interactive seabed creatures (Phase 7). */
		overlay?: boolean;
		/** Depth-tag text per station id (page-localized), e.g. '7 m · 2021 – 2024'. */
		tags?: Record<string, string>;
	} = $props();

	/* THE DIVE. One procedural water column spanning the whole page: it
	 * measures every [data-dive] anchor, paints the whole atmosphere (washi
	 * dawn → sunlit aqua → twilight → midnight → abyss ink), and drops the
	 * sounding line from the boat down the middle (desktop weave) or the
	 * left gutter (narrow), knotted and depth-tagged at every station.
	 *
	 * Mechanics are a faithful TreeLayer clone: ResizeObserver → rAF-coalesced
	 * rebuild; one passive scroll listener; per-frame work = exactly two clip
	 * rect heights (the rope pays out as you dive, rewinds as you rise) plus,
	 * in the overlay, one companion transform. Reduced motion: everything
	 * fully drawn and still. */

	interface Anchor {
		x0: number;
		y0: number;
		x1: number;
		y1: number;
		cx: number;
		cy: number;
	}

	interface Knot {
		x: number;
		y: number;
		tag?: string;
		/** Which side the tag sits on (opposite the heavier cord). */
		tagSide: 1 | -1;
		deep: boolean;
	}
	interface Cord {
		d: string;
		gate: string;
	}

	interface Surface {
		boatX: number;
		boatS: number;
		crestX: number;
		crestS: number;
		toriiX: number;
		toriiY: number;
		toriiS: number;
		sunX: number;
		sunY: number;
		ridge1: string;
		ridge2: string;
		rays: string[];
		plungeX: number;
		pads: { x: number; y: number; s: number; rot: number; edge?: boolean; delay: number }[];
	}

	let root = $state<HTMLDivElement | null>(null);
	let W = $state(0);
	let H = $state(0);
	let surface = $state<Surface | null>(null);
	let atmoStops = $state<{ o: number; c: string }[]>([]);
	let ropeD = $state('');
	let ropeHiD = $state('');
	let knots = $state<Knot[]>([]);
	let cords = $state<Cord[]>([]);
	let leadPos = $state<Pt | null>(null);
	let lineTopYS = $state(0);
	let bedYS = $state(0);
	let waterYS = $state(0);
	let progress = $state(0);
	let underProgress = $state(0);
	let instant = $state(false);

	let lineParams = $state<{
		xBoat: number;
		xMid: number;
		bendY0: number;
		bendY1: number;
		phase: number;
		sizeK: number;
		waterY: number;
		bedY: number;
	} | null>(null);

	const uid = $derived(`dl-${hashSeed(seed).toString(36)}${overlay ? 'o' : ''}`);
	const clipHeight = $derived(Math.max(0, lineTopYS + (bedYS + 26 - lineTopYS) * progress));
	const underClipH = $derived(Math.max(0, (H - bedYS + 60) * underProgress));

	const f = (n: number) => +n.toFixed(1);

	type LineParams = NonNullable<typeof lineParams>;
	function lineXOf(p: LineParams, y: number): number {
		const b = Math.min(1, Math.max(0, (y - p.bendY0) / (p.bendY1 - p.bendY0)));
		const bs = b * b * (3 - 2 * b);
		// the current's drift fades in below the bend so the rope leaves the
		// boat clean and only starts snaking once it hangs free
		const amp = 14 * p.sizeK * Math.min(1, Math.max(0, (y - p.waterY) / 420));
		return (
			p.xBoat +
			(p.xMid - p.xBoat) * bs +
			Math.sin(((y - p.waterY) / Math.max(1, p.bedY - p.waterY)) * Math.PI * 2.1 + p.phase) * amp
		);
	}

	function measure(): Record<string, Anchor> | null {
		const parent = root?.parentElement;
		if (!root || !parent) return null;
		const lr = root.getBoundingClientRect();
		if (lr.width < 10 || lr.height < 10) return null;
		const out: Record<string, Anchor> = {};
		for (const el of parent.querySelectorAll<HTMLElement>('[data-dive]')) {
			const r = el.getBoundingClientRect();
			out[el.dataset.dive!] = {
				x0: r.left - lr.left,
				y0: r.top - lr.top,
				x1: r.right - lr.left,
				y1: r.bottom - lr.top,
				cx: (r.left + r.right) / 2 - lr.left,
				cy: (r.top + r.bottom) / 2 - lr.top
			};
		}
		W = Math.round(lr.width);
		H = Math.round(lr.height);
		return out;
	}

	function build(a: Record<string, Anchor>) {
		const wrap = a['divewrap'];
		const sky = a['sky'];
		const waterline = a['waterline'];
		const origin = a['origin'];
		if (!wrap || !sky || !waterline || !origin) return;
		const rand = rng(hashSeed(`${seed}:${W}x${H}`));
		void rand; // seeded stream reserved for scene decor (Phases 4–6)

		// ---------- the world's vertical story ----------
		const waterY = waterline.cy;
		const bedY = Math.min(H - 40, origin.y1 - 24);
		waterYS = waterY;
		bedYS = bedY;

		// ---------- the line's horizontal story ----------
		// Desktop weave: the rope bends from under the boat to the corridor
		// between the banks. Narrow: it bends into the left gutter instead.
		const central = W >= 900;
		const stationEls = Object.keys(a).filter((k) => k.startsWith('st-'));
		const firstCardX0 = stationEls.length ? Math.min(...stationEls.map((k) => a[k].x0)) : wrap.x0;
		const xBoat = central
			? Math.min(W - 200, sky.x1 + 70)
			: Math.min(W - 120, sky.x0 + (sky.x1 - sky.x0) * 0.62);
		const xMid = central ? (wrap.x0 + wrap.x1) / 2 : (wrap.x0 + firstCardX0) / 2;
		const bendY0 = waterY + 30;
		const bendY1 = waterY + 330;
		const sizeK = central ? 1 : 0.55;
		// phase must NOT come from this instance's rand stream: the overlay
		// instance recomputes lineXAt and both must agree exactly.
		const sPhase = (hashSeed(`phase:${W}x${H}`) % 628) / 100;
		const p: LineParams = { xBoat, xMid, bendY0, bendY1, phase: sPhase, sizeK, waterY, bedY };
		lineParams = p;
		const lineXAt = (y: number) => lineXOf(p, y);

		// ---------- atmosphere: washi dawn → sunlit → twilight → abyss ----
		{
			const wl = waterY / H;
			const bd = bedY / H;
			const d = (k: number) => wl + (bd - wl) * k;
			const st = (o: number, c: string) => ({ o: +Math.min(1, Math.max(0, o)).toFixed(4), c });
			atmoStops = [
				st(0, '#f4efe2'),
				st(wl - 0.035, '#eaf3f4'),
				st(wl - 0.001, '#dceef2'),
				st(wl + 0.001, '#cfeaf0'),
				st(d(0.05), '#a6d8e4'),
				st(d(0.22), '#6cc3d6'),
				st(d(0.4), '#3e97b4'),
				st(d(0.56), '#1e6d88'),
				st(d(0.72), '#0e3a52'),
				st(d(0.86), '#092838'),
				st(bd - 0.008, '#061c2a'),
				st(bd + 0.02, '#04141f'),
				st(1, '#04141f')
			];
		}

		// ---------- the surface: boat, torii, sun, ridge, rays, pads ----------
		{
			const toriiS = central ? 1.12 : 0.62;
			const toriiW = 140 * toriiS;
			const toriiX = Math.min(W - toriiW - 24, xBoat + (central ? 200 : 92));
			const sunX = Math.min(W - 64, toriiX + toriiW + 52);
			const sunY = Math.max(44, waterY - (central ? 250 : 215));
			// two far ridge lines on the horizon, palest at the back
			const mkRidge = (h: number, n: number) => {
				const pts: Pt[] = [];
				for (let i = 0; i <= n; i++)
					pts.push({ x: (W * i) / n, y: waterY - 3 - h * (0.4 + rand() * 0.6) });
				return `M0 ${f(waterY - 2)} L${smoothOpen(pts)} L ${W} ${f(waterY - 2)} Z`;
			};
			// light shafts slanting down-left from the sun side
			const rays: string[] = [];
			const depth = Math.min(620, (bedY - waterY) * 0.42);
			for (let i = 0; i < 3; i++) {
				const tx = sunX - 26 - i * (central ? 150 : 88) - rand() * 44;
				const w2 = 34 + i * 14;
				const slant = 150 + i * 42;
				rays.push(
					`M ${f(tx)} ${f(waterY + 2)} L ${f(tx + w2)} ${f(waterY + 2)} L ${f(tx + w2 - slant)} ${f(
						waterY + depth
					)} L ${f(tx - slant - w2 * 0.6)} ${f(waterY + depth)} Z`
				);
			}
			surface = {
				boatX: xBoat,
				boatS: central ? 1 : 0.74,
				crestX: xBoat - (central ? 212 : 148),
				crestS: central ? 0.95 : 0.68,
				toriiX,
				toriiY: waterY - 118 * toriiS,
				toriiS,
				sunX,
				sunY,
				ridge1: mkRidge(32, 9),
				ridge2: mkRidge(16, 7),
				rays,
				plungeX: lineXAt(waterY + 4),
				pads: [
					{ x: xBoat - 408, y: waterY + 9, s: 0.9, rot: 24, delay: 260 },
					{ x: toriiX + toriiW + 34, y: waterY + 13, s: 0.6, rot: 132, delay: 420 },
					{
						x: Math.max(56, xBoat - 540),
						y: waterY + 15,
						s: 0.5,
						rot: -30,
						edge: true,
						delay: 560
					}
				].filter((p2) => p2.x > 34 && p2.x < W - 34)
			};
		}

		// ---------- the sounding line ----------
		const lineTop = waterY - 12; // the rope leaves over the gunwale
		lineTopYS = lineTop;
		const rope = ropeGeometry(lineXAt, lineTop, bedY);
		ropeD = rope.d;
		ropeHiD = rope.hi;
		leadPos = { x: f(lineXAt(bedY)), y: f(bedY) };

		// knots + cords: one knot per station tie point, geometrically merged
		// when two stations share a depth (the concurrent pairs).
		interface Cand {
			id: string;
			y: number;
			anchor: Anchor;
		}
		const cands: Cand[] = stationEls
			.map((k) => ({ id: k.slice(3), y: a[k].y0 + 26, anchor: a[k] }))
			.sort((q, r) => q.y - r.y || (q.anchor.cx < r.anchor.cx ? -1 : 1));
		const ks: Knot[] = [];
		const cs: Cord[] = [];
		// water is dark enough for foam lettering once past the #3e97b4 band
		const deepFrom = waterY + (bedY - waterY) * 0.3;
		// a depth tag must float in open water — never behind a washi slip
		const tagFits = (kx: number, y: number, side: 1 | -1, wpx: number) => {
			const x0 = side === 1 ? kx + 12 : kx - 12 - wpx;
			const x1 = x0 + wpx;
			if (x0 < 4 || x1 > W - 4) return false;
			for (const k of stationEls) {
				const s = a[k];
				if (x0 < s.x1 && x1 > s.x0 && y - 9 < s.y1 && y + 9 > s.y0) return false;
			}
			return true;
		};
		let merged: { y: number; ids: Cand[] } | null = null;
		const flush = () => {
			if (!merged) return;
			// a concurrent pair shares one knot, LIFTED into the open water just
			// above the band so its depth tag has free air on both sides
			let y =
				merged.ids.length > 1 ? Math.min(...merged.ids.map((c) => c.y)) - 40 : merged.ids[0].y;
			const first = merged.ids[0];
			let tag: string | undefined = tags[first.id];
			// preferred side = away from the (first) card
			let side: 1 | -1 = first.anchor.cx < lineXAt(y) ? 1 : -1;
			if (tag) {
				const wpx = tag.length * 6.4 + 30;
				const spot = [0, -40, -80].flatMap((dy) =>
					([side, -side] as (1 | -1)[]).map((s2) => ({ dy, s2 }))
				);
				const hit = spot.find(({ dy, s2 }) => tagFits(lineXAt(y + dy), y + dy, s2, wpx));
				if (hit) {
					y += hit.dy;
					side = hit.s2;
				} else {
					// nowhere to breathe (narrow layouts) — drop the lettering,
					// keep the knot and cords; the band's twin knot still carries it
					tag = undefined;
				}
			}
			const kx = lineXAt(y);
			// cords from the knot to each card's line-facing top corner
			for (const c of merged.ids) {
				const left = c.anchor.cx < kx;
				const corner = {
					x: left ? c.anchor.x1 - 4 : c.anchor.x0 + 4,
					y: c.anchor.y0 + 20
				};
				cs.push({ d: cordPath({ x: kx, y }, corner, 8), gate: c.id });
			}
			ks.push({ x: f(kx), y: f(y), tag, tagSide: side, deep: y > deepFrom });
			merged = null;
		};
		for (const c of cands) {
			if (merged && Math.abs(c.y - merged.y) < 44) merged.ids.push(c);
			else {
				flush();
				merged = { y: c.y, ids: [c] };
			}
		}
		flush();
		knots = ks;
		cords = cs;
	}

	const isOn = (key: string) => instant || (key === 'surface' ? arrive : !!grown[key]);

	onMount(() => {
		instant = prefersReducedMotion();
		let raf = 0;
		const update = () => {
			raf = 0;
			if (!root) return;
			const r = root.getBoundingClientRect();
			if (r.height < 1) return;
			const span = Math.max(1, bedYS - lineTopYS);
			const tipY = window.innerHeight * tip - r.top;
			progress = instant ? 1 : Math.min(1, Math.max(0, (tipY - lineTopYS) / span));
			underProgress = instant
				? 1
				: Math.min(
						1,
						Math.max(
							0,
							(tipY - bedYS) / Math.max(1, H - bedYS - window.innerHeight * (1 - tip) - 60)
						)
					);
		};
		const schedule = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};
		let buildRaf = 0;
		const rebuild = () => {
			buildRaf = 0;
			const anchors = measure();
			if (anchors) {
				build(anchors);
				schedule();
			}
		};
		const ro = new ResizeObserver(() => {
			if (!buildRaf) buildRaf = requestAnimationFrame(rebuild);
		});
		if (root) ro.observe(root);
		rebuild();

		if (!instant && !overlay) {
			window.addEventListener('scroll', schedule, { passive: true });
			window.addEventListener('resize', schedule, { passive: true });
		}
		if (instant) {
			progress = 1;
			underProgress = 1;
		}

		return () => {
			ro.disconnect();
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			if (raf) cancelAnimationFrame(raf);
			if (buildRaf) cancelAnimationFrame(buildRaf);
		};
	});
</script>

<!-- The moored skiff, hull local coords: (0,0) = mid-hull at the waterline,
     bow to the right. The koinobori pole rises from the stern. -->
{#snippet boatShape()}
	<path class="boat-pole" d="M -66 -30 L -62 -102" />
	<!-- animation lives on an INNER group: CSS transform would override the
	     positioning attribute transform if they shared an element -->
	<g transform="translate(-60 -95)">
		<g class="kn-flow" style="--kd:0s; --kdur:4.2s">{@render carpShape('kn-red', 58)}</g>
	</g>
	<g transform="translate(-60 -72) scale(0.8)">
		<g class="kn-flow" style="--kd:-1.9s; --kdur:3.6s">{@render carpShape('kn-blue', 54)}</g>
	</g>
	<path
		class="boat-hull"
		d="M -78 -15 C -66 3 -30 10 4 10 C 40 10 66 3 80 -21 C 64 -8 40 -3 4 -3 C -32 -3 -60 -6 -78 -15 Z"
	/>
	<path class="boat-plank" d="M -70 -10 C -42 -1 34 2 68 -9" />
	<path class="boat-stem" d="M 80 -21 C 76 -14 72 -9 66 -6" />
	<path class="boat-stern" d="M -78 -15 C -74 -9 -70 -5 -64 -3" />
	<ellipse class="boat-wake" cx="0" cy="8" rx="84" ry="4.5" />
	<path class="boat-ring" d="M -96 6 q 10 3 22 3 M 88 4 q -8 4 -18 4" />
{/snippet}

<!-- A carp streamer (koinobori): mouth ring at (0,0), tail forking at +len. -->
{#snippet carpShape(tone: string, len: number)}
	{@const k = len / 58}
	<path
		class="kn-body {tone}"
		d="M 0 -7 C {16 * k} -11 {34 * k} -11 {46 * k} -6 L {58 * k} -12 C {54 * k} -4 {54 * k} 4 {58 *
			k} 12 L {46 * k} 6 C {34 * k} 11 {16 * k} 11 0 7 C -2.5 4 -2.5 -4 0 -7 Z"
	/>
	<ellipse class="kn-mouth" cx="0.5" cy="0" rx="2.4" ry="6.6" />
	<circle class="kn-eye" cx={9 * k} cy="-2" r="1.5" />
	<path class="kn-scale" d="M {16 * k} -6 q {4 * k} 6 0 12 M {27 * k} -7 q {4 * k} 7 0 14" />
{/snippet}

<!-- Vermilion myōjin torii standing in the water (reused geometry): kasagi
     with upturned ends over the shimaki, nuki through leaning pillars; a
     mirrored, slit-masked copy is its reflection; foam rings settle the
     pillars. Local coords: the 140×186 viewBox, waterline at y≈118. -->
{#snippet toriiGate()}
	<use href="#{uid}-tgate" />
	<g mask="url(#{uid}-tmask)">
		<g transform="translate(0 182.9) scale(1 -0.55)">
			<use href="#{uid}-tgate" />
		</g>
	</g>
	<g class="t-ring" fill="none">
		<ellipse cx="24.3" cy="119" rx="17" ry="3.2" />
		<ellipse cx="115.7" cy="119" rx="17" ry="3.2" />
	</g>
	<g class="t-collar">
		<ellipse cx="24.3" cy="118" rx="10" ry="2.5" />
		<ellipse cx="115.7" cy="118" rx="10" ry="2.5" />
	</g>
{/snippet}

<!-- The Hokusai homage: FooterWave's main breaker, rebased to a waterline
     origin (baseline y=0, ×0.62) — long concave face sweeping up under the
     overhanging curl, the outline doubling back around the claw tip, the
     foam arm as its own mass with finger-claws hung from the barrel
     ceiling, spray flung past the tip. Authored curl-LEFT (like the print);
     the layer mirrors it so it breaks over the skiff's stern. -->
{#snippet crestShape()}
	<path
		class="crest-body"
		d="M 31 0 C 27 -11 17 -24 -3 -32 C -17 -40 -34 -43 -53 -44 C -71 -44 -86 -41 -93 -36 C -97 -33 -99 -30 -97 -26 C -101 -30 -102 -35 -100 -40 C -94 -48 -82 -51 -70 -52 C -65 -52 -61 -51 -56 -51 C -45 -52 -32 -53 -20 -51 C 1 -48 20 -42 39 -33 C 60 -24 79 -16 100 -9 C 106 -5 110 -2 112 0 Z"
	/>
	<path
		class="crest-arm"
		d="M -17 -50 C -31 -55 -46 -55 -60 -54 C -74 -53 -91 -50 -100 -42 C -104 -36 -102 -30 -97 -25 C -99 -30 -97 -33 -93 -36 C -86 -41 -71 -44 -53 -44 C -34 -43 -17 -40 -3 -32 C -5 -40 -10 -46 -17 -50 Z"
		transform="translate(0 2.5)"
	/>
	{#each [{ x: -5, y: -31, a: -35, s: 0.85 }, { x: -25, y: -39, a: -25, s: 0.8 }, { x: -46, y: -42, a: -15, s: 0.75 }, { x: -67, y: -43, a: -5, s: 0.7 }, { x: -84, y: -40, a: 10, s: 0.62 }, { x: -95, y: -33, a: 30, s: 0.58 }] as c, i (i)}
		<g transform="translate({c.x} {c.y}) rotate({c.a}) scale({c.s})">
			<path class="crest-claw" d="M0,0 C-8,1 -14,8 -14,17 C-10,9 -4,5 4,4 Z" />
		</g>
	{/each}
	<path
		class="crest-striae"
		d="M -88 -45 C -76 -49 -60 -51 -44 -50 M -79 -38 C -68 -42 -54 -44 -40 -44"
	/>
	<path class="crest-face-soft" d="M 31 0 C 27 -11 17 -24 -3 -32" />
	<path class="crest-face" d="M 31 0 C 27 -11 17 -24 -3 -32" />
	<path class="crest-floor" d="M 34 -1 C 54 -4 76 -5 96 -3" />
	<circle class="crest-spray" cx="-108" cy="-21" r="2.3" />
	<circle class="crest-spray" cx="-116" cy="-15" r="1.7" />
	<circle class="crest-spray" cx="-103" cy="-14" r="1.4" />
	<circle class="crest-spray" cx="-113" cy="-28" r="1.5" />
	<circle class="crest-spray" cx="-122" cy="-9" r="1.2" />
{/snippet}

<!-- Notched lily-pad disc (top view) or its edge-on sliver. -->
{#snippet padShape(rot: number, edge: boolean)}
	{#if edge}
		<ellipse class="pad-edge" cx="0" cy="0" rx="30" ry="3.6" />
		<path class="pad-edge-notch" d="M 20 -1 L 30 -3 L 30 1 Z" />
	{:else}
		<g transform="rotate({rot})">
			<path class="pad-leaf" d="M0 0L49.9 -20.2A52 52 0 1 0 49.9 20.2Z" />
			<g class="pad-veins">
				{#each [45, 90, 135, 180, 225, 270, 315] as va (va)}
					<line
						x1="0"
						y1="0"
						x2={(Math.cos((va * Math.PI) / 180) * 44).toFixed(1)}
						y2={(Math.sin((va * Math.PI) / 180) * 44).toFixed(1)}
					/>
				{/each}
			</g>
		</g>
	{/if}
{/snippet}

<div class="dive-layer" class:is-over={overlay} class:instant bind:this={root} aria-hidden="true">
	{#if W > 0 && lineParams}
		{#if overlay}
			<!-- the companion koi + interactive creatures arrive in Phase 7 -->
			<svg viewBox="0 0 {W} {Math.max(H, 1)}"></svg>
		{:else}
			<svg viewBox="0 0 {W} {Math.max(H, 1)}">
				<defs>
					<clipPath id="{uid}-clip">
						<rect x="0" y="0" width={W} height={clipHeight} />
					</clipPath>
					<clipPath id="{uid}-uclip">
						<rect x="0" y={bedYS - 4} width={W} height={underClipH} />
					</clipPath>
					<linearGradient id="{uid}-atmo" x1="0" y1="0" x2="0" y2="1">
						{#each atmoStops as s, i (i)}
							<stop offset={s.o} stop-color={s.c} />
						{/each}
					</linearGradient>
					<Seigaiha pid="{uid}-sg" />
					<linearGradient id="{uid}-ray" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stop-color="#ffffff" stop-opacity="0.5" />
						<stop offset="0.75" stop-color="#ffffff" stop-opacity="0" />
					</linearGradient>
					<radialGradient id="{uid}-sun">
						<stop offset="0" stop-color="#f9edd0" stop-opacity="0.95" />
						<stop offset="0.45" stop-color="#f6e6bb" stop-opacity="0.5" />
						<stop offset="1" stop-color="#f6e6bb" stop-opacity="0" />
					</radialGradient>
					<linearGradient id="{uid}-bandfade" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0.14" stop-color="#fff" />
						<stop offset="1" stop-color="#fff" stop-opacity="0" />
					</linearGradient>
					{#if surface}
						<mask id="{uid}-bandmask">
							<rect x="0" y={waterYS - 3} width={W} height="60" fill="url(#{uid}-bandfade)" />
						</mask>
						<linearGradient
							id="{uid}-tfade"
							x1="0"
							y1="120"
							x2="0"
							y2="182"
							gradientUnits="userSpaceOnUse"
						>
							<stop offset="0" stop-color="#fff" stop-opacity="0.62" />
							<stop offset="1" stop-color="#fff" stop-opacity="0" />
						</linearGradient>
						<mask id="{uid}-tmask">
							<rect x="0" y="116" width="140" height="70" fill="url(#{uid}-tfade)" />
							<rect x="0" y="128" width="140" height="2" fill="#000" opacity="0.9" />
							<rect x="0" y="139" width="140" height="2.6" fill="#000" opacity="0.8" />
							<rect x="0" y="153" width="140" height="3" fill="#000" opacity="0.7" />
						</mask>
						<g id="{uid}-tgate">
							<path class="t-main" d="M25.6 24L34.4 24L29.2 118L19.4 118Z" />
							<path class="t-main" d="M105.6 24L114.4 24L120.6 118L110.8 118Z" />
							<path class="t-main" d="M66.4 24.5H73.6V47H66.4Z" />
							<path class="t-main" d="M7.5 47H132.5V55.5H7.5Z" />
							<path class="t-dark" d="M10.5 15.5H129.5V24.5H10.5Z" />
							<path class="t-dark" d="M1 2C36 9 104 9 139 2L136.5 14.5C104 20 36 20 3.5 14.5Z" />
						</g>
					{/if}
				</defs>

				<!-- the whole water column, dawn air to abyss ink -->
				<rect width={W} height={Math.max(H, 1)} fill="url(#{uid}-atmo)" />

				{#if surface}
					<!-- dawn sky: the sun over the gate, far ridges on the horizon -->
					<g class="zone" class:on={isOn('surface')}>
						<g class="fade" style="--gd:100ms">
							<circle cx={surface.sunX} cy={surface.sunY} r="58" fill="url(#{uid}-sun)" />
							<circle class="sun-core" cx={surface.sunX} cy={surface.sunY} r="21" />
						</g>
						<path class="ridge r1" d={surface.ridge1} />
						<path class="ridge r2" d={surface.ridge2} />
					</g>

					<!-- underwater light: rays swaying from the sun side -->
					<g class="zone" class:on={isOn('surface')}>
						<g class="rays-g fade" style="--gd:500ms">
							{#each surface.rays as rd, i (i)}
								<path d={rd} fill="url(#{uid}-ray)" class="ray" style="opacity:{0.2 - i * 0.04}" />
							{/each}
						</g>
					</g>

					<!-- the seigaiha surface band, fading down into open water -->
					<g class="zone" class:on={isOn('surface')}>
						<g mask="url(#{uid}-bandmask)" class="fade" style="--gd:250ms">
							<rect
								class="band-tile"
								x="-24"
								y={waterYS - 3}
								width={W + 48}
								height="60"
								fill="url(#{uid}-sg)"
							/>
						</g>
					</g>

					<!-- the Hokusai crest, mirrored so it breaks over the skiff -->
					<g class="zone" class:on={isOn('surface')}>
						<g
							transform="translate({surface.crestX} {waterYS}) scale({-surface.crestS} {surface.crestS})"
						>
							<g class="grow" style="--gd:350ms">{@render crestShape()}</g>
						</g>
					</g>
				{/if}

				<!-- tie cords: each washi slip hangs off the line -->
				{#each cords as c, i (i)}
					<g class="zone" class:on={isOn(c.gate)}>
						<path class="cord fade" d={c.d} />
					</g>
				{/each}

				<!-- the sounding line pays out with your dive (and rewinds) -->
				<g clip-path="url(#{uid}-clip)">
					<path d={ropeD} class="rope" />
					<path d={ropeHiD} class="rope-hi" />
					{#each knots as k, i (i)}
						<g transform="translate({k.x} {k.y})">
							<ellipse class="knot-wrap" rx="4.6" ry="3.4" />
							<ellipse class="knot-core" rx="2.2" ry="1.7" />
							{#if k.tag}
								<text
									class="depth-tag"
									class:deep={k.deep}
									x={k.tagSide * 14}
									y="3.5"
									text-anchor={k.tagSide === 1 ? 'start' : 'end'}>— {k.tag} —</text
								>
							{/if}
						</g>
					{/each}
					{#if leadPos}
						<g transform="translate({leadPos.x} {leadPos.y - 17})">
							<path class="lead" d={leadPath(1.15)} />
							<path class="lead-hi" d="M -2.6 2.2 L -1.4 14.5" />
						</g>
					{/if}
				</g>

				{#if surface}
					<!-- the skiff (over the rope's top), the standing gate, the pads -->
					<g class="zone" class:on={isOn('surface')}>
						<g transform="translate({surface.boatX} {waterYS}) scale({surface.boatS})">
							<g class="grow" style="--gd:150ms">
								<g class="boat-bob">{@render boatShape()}</g>
							</g>
						</g>
					</g>
					<g class="zone" class:on={isOn('surface')}>
						<g transform="translate({surface.toriiX} {surface.toriiY}) scale({surface.toriiS})">
							<g class="fade" style="--gd:50ms">{@render toriiGate()}</g>
						</g>
					</g>
					<g class="zone" class:on={isOn('surface')}>
						{#each surface.pads as pd, i (i)}
							<g transform="translate({pd.x} {pd.y}) scale({pd.s})">
								<g class="grow" style="--gd:{pd.delay}ms">
									<g class="padg" style="--pdel:{-i * 3.4}s">
										{@render padShape(pd.rot, !!pd.edge)}
									</g>
								</g>
							</g>
						{/each}
					</g>

					<!-- the plunge beat: one ring + a burst of bubbles where the
					     line pierces the surface, fired on the waterline reveal -->
					<g class="zone" class:on={isOn('waterline')}>
						<g transform="translate({surface.plungeX} {waterYS + 5})">
							<ellipse class="plunge-ring" rx="16" ry="4.6" />
							{#each [-9, -4, 0, 5, 10] as bx, i (i)}
								<circle
									class="plunge-b"
									cx={bx}
									cy={2 - (i % 3) * 3}
									r={1.4 + (i % 3) * 0.7}
									style="--pd:{i * 140}ms"
								/>
							{/each}
						</g>
					</g>
				{/if}
			</svg>
		{/if}
	{/if}
	{#if !overlay && surface}
		<!-- two soft caustic light patches drifting near the surface -->
		<div class="caustic ca1" style="left:{surface.boatX - 330}px; top:{waterYS + 30}px"></div>
		<div class="caustic ca2" style="left:{surface.toriiX - 60}px; top:{waterYS + 120}px"></div>
	{/if}
</div>

<style>
	.dive-layer {
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

	/* ---- the sounding line: tarred hemp with a pale sun-side strand ---- */
	.rope {
		fill: #3a3022;
	}
	.rope-hi {
		fill: none;
		stroke: #a59062;
		stroke-width: 1;
		stroke-linecap: round;
		opacity: 0.5;
	}
	.knot-wrap {
		fill: #55462f;
	}
	.knot-core {
		fill: #241d12;
	}
	.cord {
		fill: none;
		stroke: #6b5a3f;
		stroke-width: 1.5;
		stroke-linecap: round;
		opacity: 0.9;
	}
	.depth-tag {
		font:
			italic 11px var(--font-display, Georgia),
			serif;
		letter-spacing: 0.06em;
		fill: #114552;
		opacity: 0.85;
	}
	.depth-tag.deep {
		fill: #bfe4ef;
		opacity: 0.8;
	}
	.lead {
		fill: #494f56;
		stroke: #1e2328;
		stroke-width: 1;
		stroke-linejoin: round;
	}
	.lead-hi {
		fill: none;
		stroke: #9aa4ad;
		stroke-width: 1.2;
		stroke-linecap: round;
		opacity: 0.7;
	}

	/* ---- dawn sky (halo fill = the sun gradient, set inline) ---- */
	.sun-core {
		fill: #f8ecd0;
		opacity: 0.9;
	}
	.ridge {
		opacity: 0.55;
	}
	.ridge.r1 {
		fill: #d5e2df;
	}
	.ridge.r2 {
		fill: #c3d6d5;
		opacity: 0.7;
	}
	.ray {
		pointer-events: none;
	}

	/* ---- the torii (vermilion, with its broken reflection) ---- */
	.t-main {
		fill: #e04530;
	}
	.t-dark {
		fill: #c4321f;
	}
	.t-ring ellipse {
		stroke: rgba(21, 82, 100, 0.45);
		stroke-width: 1.4;
	}
	.t-collar ellipse {
		fill: #e8f6f9;
		stroke: rgba(21, 82, 100, 0.35);
		stroke-width: 1;
	}

	/* ---- the skiff + koinobori ---- */
	.boat-hull {
		fill: #6a4c37;
		stroke: #382718;
		stroke-width: 1.1;
		stroke-linejoin: round;
	}
	.boat-plank {
		fill: none;
		stroke: #8a6a4d;
		stroke-width: 1.1;
		opacity: 0.8;
	}
	.boat-stem,
	.boat-stern {
		fill: none;
		stroke: #382718;
		stroke-width: 1.4;
		stroke-linecap: round;
		opacity: 0.7;
	}
	.boat-pole {
		fill: none;
		stroke: #4a3524;
		stroke-width: 2.2;
		stroke-linecap: round;
	}
	.boat-wake {
		fill: rgba(4, 40, 52, 0.16);
	}
	.boat-ring {
		fill: none;
		stroke: #eef8f8;
		stroke-width: 1.3;
		stroke-linecap: round;
		opacity: 0.7;
	}
	.kn-body {
		stroke-width: 1;
		stroke-linejoin: round;
	}
	.kn-body.kn-red {
		fill: #d9604a;
		stroke: #a53d2c;
	}
	.kn-body.kn-blue {
		fill: #5b87a6;
		stroke: #3d617c;
	}
	.kn-mouth {
		fill: none;
		stroke: #f4ead8;
		stroke-width: 1.4;
		opacity: 0.9;
	}
	.kn-eye {
		fill: #f4ead8;
		stroke: #26333a;
		stroke-width: 0.7;
	}
	.kn-scale {
		fill: none;
		stroke: #f4ead8;
		stroke-width: 0.8;
		opacity: 0.55;
	}

	/* ---- the crest (Hokusai homage) ---- */
	.crest-body {
		fill: #1f6076;
		opacity: 0.94;
	}
	.crest-arm,
	.crest-claw {
		fill: #f2fafa;
		stroke: #7fb5c4;
		stroke-width: 1;
		stroke-linejoin: round;
		opacity: 0.95;
	}
	.crest-striae {
		fill: none;
		stroke: #7fb5c4;
		stroke-width: 1.2;
		stroke-linecap: round;
		opacity: 0.5;
	}
	.crest-face-soft {
		fill: none;
		stroke: #f2fafa;
		stroke-width: 7;
		stroke-linecap: round;
		opacity: 0.2;
	}
	.crest-face {
		fill: none;
		stroke: #f2fafa;
		stroke-width: 3.2;
		stroke-linecap: round;
		opacity: 0.9;
	}
	.crest-floor {
		fill: none;
		stroke: #f2fafa;
		stroke-width: 1.5;
		stroke-linecap: round;
		opacity: 0.35;
	}
	.crest-spray {
		fill: #f2fafa;
		opacity: 0.85;
	}

	/* ---- lily pads ---- */
	.pad-leaf {
		fill: #4f8d76;
		fill-opacity: 0.92;
		stroke: #35664f;
		stroke-width: 1.2;
		stroke-opacity: 0.55;
	}
	.pad-veins line {
		stroke: #cfe8d9;
		stroke-width: 1;
		opacity: 0.4;
	}
	.pad-edge {
		fill: #47816c;
		stroke: #35664f;
		stroke-width: 1;
	}
	.pad-edge-notch {
		fill: #35664f;
		opacity: 0.6;
	}

	/* ---- plunge one-shots (invisible unless their zone fires) ---- */
	.plunge-ring,
	.plunge-b {
		opacity: 0;
		fill: none;
		stroke: #eef8f8;
		stroke-width: 1.5;
	}
	.plunge-b {
		fill: #eef8f8;
		stroke: none;
	}

	/* ---- caustic light, drifting slow ---- */
	.caustic {
		position: absolute;
		width: 220px;
		height: 150px;
		border-radius: 50%;
		background: #d9f1f2;
		opacity: 0.1;
		filter: blur(30px);
		mix-blend-mode: screen;
	}

	/* ---- growth: buoyant settle, no overshoot (§ motion language).
	   `.grow` scales/settles about its own translate anchor; `.fade` is the
	   absolute-coordinate variant (cords, tags) — opacity + drift only. ---- */
	:global(.dive-layer .zone .grow) {
		opacity: 0;
		transform: translateY(16px) scale(0.97);
	}
	:global(.dive-layer .zone.on .grow) {
		opacity: 1;
		transform: none;
		transition:
			transform var(--gt, 1100ms) cubic-bezier(0.22, 0.61, 0.21, 1) var(--gd, 0ms),
			opacity var(--gt, 1100ms) ease var(--gd, 0ms);
	}
	.zone .fade {
		opacity: 0;
		translate: 0 10px;
	}
	.zone.on .fade {
		opacity: 0.9;
		translate: 0 0;
		transition:
			translate var(--gt, 1100ms) cubic-bezier(0.22, 0.61, 0.21, 1) var(--gd, 0ms),
			opacity var(--gt, 1100ms) ease var(--gd, 0ms);
	}
	.instant :global(.grow),
	.instant .fade {
		transition: none !important;
		opacity: 1;
		transform: none;
		translate: 0 0;
	}

	/* ---- ambient motion: few, slow, and gone under reduced motion ---- */
	@media (prefers-reduced-motion: no-preference) {
		.boat-bob {
			animation: dv-bob 7s ease-in-out infinite alternate;
		}
		.kn-flow {
			animation: dv-flow var(--kdur, 4s) ease-in-out var(--kd, 0s) infinite alternate;
		}
		.rays-g {
			animation: dv-rays 26s ease-in-out infinite alternate;
		}
		.band-tile {
			animation: dv-band 30s ease-in-out infinite alternate;
		}
		.padg {
			animation: dv-pad 10s ease-in-out var(--pdel, 0s) infinite alternate;
		}
		.caustic.ca1 {
			animation: dv-drift-a 14s ease-in-out infinite alternate;
		}
		.caustic.ca2 {
			animation: dv-drift-b 18s ease-in-out infinite alternate;
		}
		.zone.on .plunge-ring {
			animation: dv-plunge-ring 1.5s ease-out 120ms forwards;
			transform-box: fill-box;
			transform-origin: center;
		}
		.zone.on .plunge-b {
			animation: dv-plunge-b 1.25s ease-out var(--pd, 0ms) forwards;
		}
	}
	@keyframes dv-bob {
		from {
			transform: translateY(-1.6px);
		}
		to {
			transform: translateY(1.9px);
		}
	}
	@keyframes dv-flow {
		from {
			transform: scaleX(1) rotate(0deg);
		}
		to {
			transform: scaleX(0.93) rotate(2.4deg);
		}
	}
	@keyframes dv-rays {
		from {
			transform: translateX(-10px);
		}
		to {
			transform: translateX(12px);
		}
	}
	@keyframes dv-band {
		from {
			transform: translateX(-12px);
		}
		to {
			transform: translateX(12px);
		}
	}
	@keyframes dv-pad {
		from {
			transform: rotate(-2.1deg) translateY(0);
		}
		to {
			transform: rotate(2deg) translateY(2.4px);
		}
	}
	@keyframes dv-drift-a {
		from {
			transform: translate(0, 0) scale(1);
		}
		to {
			transform: translate(30px, 16px) scale(1.12);
		}
	}
	@keyframes dv-drift-b {
		from {
			transform: translate(0, 0) scale(1.06);
		}
		to {
			transform: translate(-24px, 20px) scale(0.95);
		}
	}
	@keyframes dv-plunge-ring {
		from {
			opacity: 0.9;
			transform: scale(0.4);
		}
		to {
			opacity: 0;
			transform: scale(1.9);
		}
	}
	@keyframes dv-plunge-b {
		from {
			opacity: 0.9;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(-30px);
		}
	}
</style>
