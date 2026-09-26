<script lang="ts">
	import { onMount } from 'svelte';
	import { hashSeed, rng } from '$lib/garden/lsystem';
	import { prefersReducedMotion } from '$lib/garden/reveal';
	import { type Pt } from '$lib/garden/tree/generate';
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

	let root = $state<HTMLDivElement | null>(null);
	let W = $state(0);
	let H = $state(0);
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

		// ---------- the sounding line ----------
		const lineTop = waterY - 26; // the rope leaves the boat's gunwale
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
			const tag = tags[first.id];
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
				</defs>

				<!-- the whole water column, dawn air to abyss ink -->
				<rect width={W} height={Math.max(H, 1)} fill="url(#{uid}-atmo)" />

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
			</svg>
		{/if}
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
</style>
