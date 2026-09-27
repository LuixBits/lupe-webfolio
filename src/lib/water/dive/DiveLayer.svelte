<script lang="ts">
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages';
	import { hashSeed, rng } from '$lib/garden/lsystem';
	import { prefersReducedMotion } from '$lib/garden/reveal';
	import { blobPath, smoothOpen, taperedBranch, type Pt } from '$lib/garden/tree/generate';
	import Garden from '$lib/garden/Garden.svelte';
	import Koi from '../Koi.svelte';
	import type { KoiRobe } from '../koi';
	import Seigaiha from '../Seigaiha.svelte';
	import { ropeGeometry, leadPath, cordPath, ellipseLoop } from './generate';

	let {
		seed = 'cv-dive',
		grown = {},
		arrive = false,
		tip = 0.86,
		overlay = false,
		tags = {},
		pdf
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
		/** The Flaschenpost target (the CV as PDF). Undefined → placeholder tag. */
		pdf?: string;
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

	interface KoiCast {
		gate: string;
		robe: KoiRobe;
		scale: number;
		path: string;
		dur: number;
		rest: string;
		delay: number;
		wag: number;
	}
	interface Lantern {
		x: number;
		y: number;
		s: number;
		gate: string;
	}

	let root = $state<HTMLDivElement | null>(null);
	let W = $state(0);
	let H = $state(0);
	let surface = $state<Surface | null>(null);
	let koiCast = $state<KoiCast[]>([]);
	let school = $state<{ path: string; gate: string } | null>(null);
	let fry = $state<{ path: string; gate: string } | null>(null);
	let lanterns = $state<Lantern[]>([]);
	let glowPools = $state<{ cx: number; cy: number; rx: number; ry: number; gate: string }[]>([]);
	let crossTies = $state<{ d: string; gate: string }[]>([]);
	let algae = $state<{ x: number; y: number; d: string }[]>([]);
	let bubbleCols = $state<{ d: string; dur: number; delay: number }[]>([]);
	let ringset = $state<{ x: number; y: number } | null>(null);
	let stems = $state<{ d: string; tx: number; ty: number; tuft: string }[]>([]);
	let kelpBeds = $state<
		{
			x: number;
			y: number;
			seed: string;
			step: number;
			flip: boolean;
			stem: string;
			leaf: string;
			gate: string;
			sway: number;
			sdel: number;
		}[]
	>([]);
	interface OverlayData {
		compHome: Pt;
		free: { home: Pt; robe: KoiRobe; scale: number }[];
		namazu: Pt | null;
		bottle: Pt | null;
	}
	let odata = $state<OverlayData | null>(null);
	let compY = $state(0);
	let compUp = $state(false);
	let fkPos = $state<{ x: number; y: number; a: number }[]>([]);
	let pellets = $state<{ id: number; x: number; y: number }[]>([]);
	let nzGaze = $state(0);
	let nzBlink = $state(false);
	let calmN = $state(0);
	let layerPageTop = 0;
	let layerLeft = 0;
	let blinkT: ReturnType<typeof setTimeout> | undefined;
	const homeT: (ReturnType<typeof setTimeout> | undefined)[] = [undefined, undefined];

	let seabed = $state<{
		sand1: string;
		sand2: string;
		sand3: string;
		crests: string[];
		stones: { x: number; y: number; d: string; rim: string }[];
		toriiX: number;
		toriiY: number;
		toriiS: number;
		moss: { x: number; y: number; d: string }[];
		barnacles: { x: number; y: number }[];
		eggsX: number;
		eggsY: number;
		eggs: { x: number; y: number; r: number }[];
		tendrils: string[];
	} | null>(null);
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
	const compX = $derived(lineParams ? lineXOf(lineParams, compY) + 30 : 0);

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
		layerPageTop = lr.top + window.scrollY;
		layerLeft = lr.left;
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

		// ---------- life: koi cast, kelp, school, fry, lanterns, ties ----------
		{
			const siga = a['st-siga-dev'];
			const tra = a['st-siga-trainee'];
			const ma = a['st-hslu-ma'];
			const bsc = a['st-hslu-bsc'];
			const nep = a['st-neptun'];
			const arm = a['st-armee'];
			const efz = a['st-efz'];
			const leh = a['st-emvs-lehre'];
			const bmA = a['st-bm'];

			// koi cast: era by size and robe — the biggest kohaku circles the
			// newest station, twilight swims asagi, the deep is left to the fry
			const cast: KoiCast[] = [];
			const cx0 = (x: number) => Math.min(W - 70, Math.max(70, x));
			const addKoi = (
				gate: string,
				robe: KoiRobe,
				scale: number,
				cx: number,
				cy: number,
				rx: number,
				ry: number,
				dur: number,
				rest: string,
				delay = 0
			) => {
				const x = cx0(cx);
				cast.push({
					gate,
					robe,
					scale,
					path: ellipseLoop(x, cy, Math.max(50, Math.min(rx, x - 40, W - 40 - x)), ry),
					dur,
					rest,
					delay,
					wag: 1.7 + scale
				});
			};
			if (siga)
				addKoi(
					'siga-dev',
					'kohaku',
					1.02,
					central ? siga.x0 - 250 : W * 0.42,
					siga.y0 + 44,
					175,
					54,
					78,
					'12%'
				);
			if (tra) addKoi('siga-trainee', 'hi', 0.6, tra.cx, tra.y1 + 66, 165, 38, 58, '55%', -21);
			if (ma) {
				addKoi(
					'hslu-ma',
					'asagi',
					0.56,
					central ? ma.x0 - 130 : W * 0.3,
					ma.cy,
					110,
					30,
					64,
					'30%',
					-9
				);
				addKoi(
					'hslu-ma',
					'asagi',
					0.48,
					lineXAt(ma.y0 - 66) + 40,
					ma.y0 - 64,
					140,
					26,
					70,
					'72%',
					-33
				);
			}
			if (arm)
				addKoi(
					'armee',
					'hi',
					0.42,
					central ? arm.x0 - 140 : W * 0.34,
					arm.cy + 8,
					95,
					24,
					52,
					'40%',
					-12
				);
			koiCast = cast;

			// the fish school: five silhouettes, ONE shared loop
			school = bsc
				? {
						path: ellipseLoop(cx0(lineXAt(bsc.y1 + 70)), bsc.y1 + 66, central ? 230 : 130, 42),
						gate: 'hslu-bsc'
					}
				: null;
			// the fry cluster, near the bottom of everything
			fry =
				efz && bmA
					? {
							path: ellipseLoop(
								cx0(lineXAt((efz.y0 + bmA.y1) / 2)),
								(efz.y0 + bmA.y1) / 2,
								central ? 120 : 90,
								70
							),
							gate: 'efz'
						}
					: null;

			// tōrō lanterns: one at the twilight band, two lighting the midnight trio
			const lts: Lantern[] = [];
			const lx = (x: number) => Math.min(W - 42, Math.max(42, x));
			if (bsc)
				lts.push({
					x: lx(central ? bsc.x0 - 95 : W - 64),
					y: bsc.y1 + 6,
					s: 0.92,
					gate: 'hslu-bsc'
				});
			if (efz)
				lts.push({ x: lx(central ? efz.x0 - 88 : W - 58), y: efz.y1 + 8, s: 1, gate: 'efz' });
			if (leh)
				lts.push({
					x: lx(central ? leh.x1 + 64 : W - 92),
					y: leh.y1 + 30,
					s: 0.82,
					gate: 'emvs-lehre'
				});
			lanterns = lts;

			// warm glow pools behind the midnight slips (paper lit by the tōrō)
			glowPools = (
				[
					[efz, 'efz'],
					[bmA, 'bm'],
					[leh, 'emvs-lehre']
				] as [Anchor | undefined, string][]
			)
				.filter((g2): g2 is [Anchor, string] => !!g2[0])
				.map(([s2, gate]) => ({
					cx: f(s2.cx),
					cy: f(s2.cy),
					rx: f((s2.x1 - s2.x0) * 0.74),
					ry: f((s2.y1 - s2.y0) * 0.95),
					gate
				}));

			// cross-currents: a faint bubble-trail arc tying each concurrent pair
			const tiesL: { d: string; gate: string }[] = [];
			const tie = (l: Anchor, r: Anchor, gate: string) => {
				if (!central) return;
				const y0b = Math.max(l.y0, r.y0) + 24;
				tiesL.push({
					d: `M ${f(l.x1 + 8)} ${f(y0b + 14)} Q ${f((l.x1 + r.x0) / 2)} ${f(y0b - 36)} ${f(r.x0 - 8)} ${f(y0b + 6)}`,
					gate
				});
			};
			if (ma && tra) tie(ma, tra, 'hslu-ma');
			if (bsc && nep) tie(bsc, nep, 'hslu-bsc');
			crossTies = tiesL;

			// the rope grows algae wisps below ~58% depth — the line ages
			const alg: { x: number; y: number; d: string }[] = [];
			const aTop = waterY + (bedY - waterY) * 0.58;
			const nAlg = 9;
			for (let i = 0; i < nAlg; i++) {
				const y = aTop + ((bedY - 70 - aTop) * i) / (nAlg - 1) + (rand() * 2 - 1) * 18;
				const side = i % 2 === 0 ? 1 : -1;
				const g2 = taperedBranch(
					rand,
					90 * side + (rand() * 2 - 1) * 30,
					9 + rand() * 11,
					3,
					0.8,
					5
				);
				alg.push({ x: f(lineXAt(y) + side * 1.5), y: f(y), d: g2.d });
			}
			algae = alg;

			// two dashed bubble columns rising through the midnight zone —
			// dozens of bubbles for two paths (dashoffset loop)
			const cols: { d: string; dur: number; delay: number }[] = [];
			if (efz && bmA) {
				for (const [k, off] of [
					[0, central ? -190 : -60],
					[1, central ? 205 : 70]
				] as const) {
					const bx = cx0(lineXAt(efz.cy) + off);
					const yB = bmA.y1 + 60;
					const yT = efz.y0 - 110;
					const pts: Pt[] = [];
					for (let i2 = 0; i2 <= 8; i2++) {
						const t = i2 / 8;
						pts.push({ x: bx + Math.sin(t * 5 + k * 2) * 9, y: yB + (yT - yB) * t });
					}
					cols.push({ d: `M${smoothOpen(pts)}`, dur: 8 + k * 2.6, delay: -k * 3.2 });
				}
			}
			bubbleCols = cols;

			// quiet surface rings near the first pad
			ringset = surface ? { x: cx0(surface.boatX - 350), y: waterY + 7 } : null;

			// lily stems dangling from the floating pads, root tufts at the tips
			const stm: { d: string; tx: number; ty: number; tuft: string }[] = [];
			if (surface) {
				for (const pd of surface.pads.filter((p2) => !p2.edge)) {
					for (const dx of [-8, 7]) {
						const len = 60 + rand() * 55;
						const sway = (rand() * 2 - 1) * 22;
						const ex = pd.x + dx + sway;
						const ey = pd.y + len;
						stm.push({
							d: `M ${f(pd.x + dx)} ${f(pd.y + 4)} C ${f(pd.x + dx + sway * 0.3)} ${f(pd.y + len * 0.4)} ${f(ex - sway * 0.4)} ${f(pd.y + len * 0.7)} ${f(ex)} ${f(ey)}`,
							tx: f(ex),
							ty: f(ey),
							tuft: `M -4 0 q 4 ${f(3 + rand() * 3)} 8 0 M -3 2 q 3 ${f(2 + rand() * 2)} 6 0`
						});
					}
				}
			}
			stems = stm;

			// kelp beds bracketing the column (flanks on desktop, the free right
			// edge on narrow layouts), taller and darker with depth
			const beds: typeof kelpBeds = [];
			const flankL = central ? wrap.x0 / 2 - 70 : -999;
			const flankR = central ? (wrap.x1 + W) / 2 - 60 : W - 130;
			const bed = (
				x: number,
				yBottom: number,
				seed2: string,
				step: number,
				flip: boolean,
				stem: string,
				leaf: string,
				gate: string,
				sdel: number
			) => {
				if (x < -140 || x > W - 20) return;
				beds.push({
					x: f(x),
					y: f(yBottom - 310),
					seed: seed2,
					step,
					flip,
					stem,
					leaf,
					gate,
					sway: 8 + Math.abs(sdel),
					sdel
				});
			};
			const upStem = '#2f7d72';
			const upLeaf = 'rgba(70, 152, 132, 0.85)';
			const dpStem = '#1f5c55';
			const dpLeaf = 'rgba(48, 118, 104, 0.85)';
			if (ma) {
				bed(flankL - 40, ma.y1 + 60, 'dive-kelp-a', 10, false, upStem, upLeaf, 'hslu-ma', 0);
				if (central)
					bed(
						flankR + 20,
						ma.y1 + 80,
						'dive-kelp-b',
						11.5,
						true,
						upStem,
						upLeaf,
						'siga-trainee',
						-2.6
					);
			}
			if (bsc) {
				bed(flankL - 90, bsc.y1 + 90, 'dive-kelp-c', 12, true, dpStem, dpLeaf, 'hslu-bsc', -1.2);
				if (central) {
					bed(flankL + 60, bsc.y1 + 60, 'dive-kelp-d', 9, false, dpStem, dpLeaf, 'hslu-bsc', -3.8);
					bed(flankR - 50, bsc.y1 + 76, 'dive-kelp-e', 11, false, dpStem, dpLeaf, 'neptun', -5);
					bed(flankR + 70, bsc.y1 + 50, 'dive-kelp-f', 8.5, true, dpStem, dpLeaf, 'neptun', -2);
				} else {
					bed(flankR, bsc.y1 + 60, 'dive-kelp-e', 9.5, true, dpStem, dpLeaf, 'neptun', -4);
				}
			}
			kelpBeds = beds;
		}

		// ---------- the seabed: sand, stones, the sunken gate, the eggs ----------
		{
			const mkDune = (yBase: number, amp: number, n: number) => {
				const pts: Pt[] = [];
				for (let i = 0; i <= n; i++)
					pts.push({ x: (W * i) / n, y: yBase + (rand() * 2 - 1) * amp });
				return `M -20 ${f(yBase + amp)} L${smoothOpen(pts)} L ${W + 20} ${f(yBase + amp)} L ${W + 20} ${H + 60} L -20 ${H + 60} Z`;
			};
			const leadX = lineXAt(bedY);
			// the clutch rests where the plumb lead lands — the line ends where
			// it all began — which is also where the footer's glow waits below.
			// The sunken gate stands beside it.
			const toriiS = central ? 0.92 : 0.7;
			// the lead rests just BESIDE the clutch — never on top of it
			const eggsX = central ? leadX + 34 : Math.max(W * 0.5, leadX + 60);
			const eggsY = bedY + 4;
			const tx = central ? Math.max(28, eggsX - 330) : Math.min(W - 145 * toriiS, eggsX + 96);
			const toriiY = bedY + 24 - 118 * toriiS;
			const eggs: { x: number; y: number; r: number }[] = [];
			for (let i = 0; i < 9; i++) {
				const ang = (i / 9) * Math.PI * 2 + rand() * 0.6;
				const rr = 4 + rand() * 14;
				eggs.push({
					x: f(Math.cos(ang) * rr * 1.9),
					y: f(Math.sin(ang) * rr * 0.55 - 3),
					r: +(4.4 + rand() * 2.6).toFixed(1)
				});
			}
			// the egg-light's filaments: short irregular wisps seeping down into
			// the abyss, converging on the footer's waiting glow
			const tendrils: string[] = [];
			for (let i = 0; i < 5; i++) {
				const sx = eggsX + (i - 2) * 21 + (rand() * 2 - 1) * 9;
				const len = 22 + rand() * Math.min(110, H - bedY - 30);
				const s1 = (rand() * 2 - 1) * 15;
				tendrils.push(
					`M ${f(sx)} ${f(bedY + 6)} C ${f(sx + s1)} ${f(bedY + len * 0.45)} ${f(sx - s1 * 0.5)} ${f(bedY + len * 0.8)} ${f(sx + s1 * 0.25)} ${f(bedY + len)}`
				);
			}
			const stones: { x: number; y: number; d: string; rim: string }[] = [];
			const nSt = central ? 7 : 5;
			for (let i = 0; i < nSt; i++) {
				const sx = W * ((i + 0.3 + rand() * 0.5) / nSt);
				if (Math.abs(sx - eggsX) < 60) continue;
				const size = 9 + rand() * 16;
				stones.push({
					x: f(sx),
					y: f(bedY + 8 + rand() * 10),
					d: blobPath(rand, size, size * (0.5 + rand() * 0.2), 8),
					rim: `M ${f(-size * 0.7)} ${f(-size * 0.28)} Q 0 ${f(-size * 0.72)} ${f(size * 0.66)} ${f(-size * 0.3)}`
				});
			}
			const moss = [
				{ x: f(tx + 24 * toriiS), y: f(toriiY + 16 * toriiS), d: blobPath(rand, 9, 4.5, 7) },
				{ x: f(tx + 112 * toriiS), y: f(toriiY + 52 * toriiS), d: blobPath(rand, 7, 3.6, 7) },
				{ x: f(tx + 62 * toriiS), y: f(toriiY + 8 * toriiS), d: blobPath(rand, 6, 3, 6) }
			];
			const barnacles = Array.from({ length: 5 }, () => ({
				x: f(tx + (14 + rand() * 112) * toriiS),
				y: f(toriiY + (30 + rand() * 80) * toriiS)
			}));
			// ---------- the overlay's furniture: companions + creatures ----------
			{
				const siga = a['st-siga-dev'];
				const free: OverlayData['free'] = [
					{
						home: { x: Math.max(80, W * 0.3), y: waterY + (bedY - waterY) * 0.2 },
						robe: 'hi',
						scale: 0.52
					},
					{
						// beyond the right bank on desktop — parked in open water,
						// never resting on a card
						home: { x: Math.min(W - 80, wrap.x1 + 76), y: waterY + (bedY - waterY) * 0.5 },
						robe: 'kohaku',
						scale: 0.44
					}
				];
				odata = {
					compHome: { x: 0, y: siga ? siga.y0 + 80 : waterY + 150 },
					free,
					// narrow beds are crowded: the namazu tucks in FRONT of the
					// sunken gate's feet (a fish resting under the torii)
					namazu: central
						? { x: Math.min(W - 92, eggsX + 255), y: bedY + 14 }
						: { x: Math.min(W - 72, eggsX + 108), y: bedY + 22 },
					bottle: central
						? { x: Math.max(56, eggsX - 530), y: bedY + 12 }
						: { x: Math.max(46, eggsX - 122), y: bedY + 22 }
				};
				if (instant || compY === 0) compY = odata.compHome.y;
				if (fkPos.length === 0) fkPos = free.map((f2) => ({ x: f2.home.x, y: f2.home.y, a: 0 }));
			}

			seabed = {
				sand1: mkDune(bedY - 4, 7, 9),
				sand2: mkDune(bedY + 10, 6, 8),
				sand3: mkDune(bedY + 24, 5, 7),
				crests: [
					`M ${f(W * 0.12)} ${f(bedY + 8)} q 40 -8 84 -2`,
					`M ${f(W * 0.62)} ${f(bedY + 20)} q 46 -9 92 -2`
				],
				stones,
				toriiX: f(tx),
				toriiY: f(toriiY),
				toriiS,
				moss,
				barnacles,
				eggsX: f(eggsX),
				eggsY: f(eggsY),
				eggs,
				tendrils
			};
		}
	}

	const isOn = (key: string) => instant || (key === 'surface' ? arrive : !!grown[key]);

	function namazuClick() {
		calmN += 1;
		nzBlink = true;
		clearTimeout(blinkT);
		blinkT = setTimeout(() => (nzBlink = false), 950);
	}

	onMount(() => {
		instant = prefersReducedMotion();
		let raf = 0;
		const update = () => {
			raf = 0;
			if (!root) return;
			const r = root.getBoundingClientRect();
			if (r.height < 1) return;
			if (overlay) {
				// the companion koi rides the line at your viewport — the ONLY
				// per-frame overlay work is this one transform target
				if (instant || !lineParams) return;
				const viewTop = -r.top;
				let t2 = Math.min(bedYS - 70, Math.max(waterYS + 85, viewTop + window.innerHeight * 0.52));
				t2 = Math.max(viewTop + 120, Math.min(viewTop + window.innerHeight - 140, t2));
				if (Math.abs(t2 - compY) > 6) {
					compUp = t2 < compY;
					compY = t2;
				}
				return;
			}
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

		if (!instant) {
			window.addEventListener('scroll', schedule, { passive: true });
			window.addEventListener('resize', schedule, { passive: true });
		}
		if (instant) {
			progress = 1;
			underProgress = 1;
		}

		// ---- feed the koi: a click in open water drops a pellet; the nearest
		// free koi glides to it (state + CSS transition — no rAF chase) ----
		let lastFeed = 0;
		let pelletN = 0;
		const onClick = (e: MouseEvent) => {
			const t = e.target as HTMLElement | null;
			if (!t || typeof t.closest !== 'function') return;
			if (
				t.closest(
					'a,button,[role=button],input,textarea,select,nav,svg,.station,.bank-head,.sky,.origin'
				)
			)
				return;
			const now = performance.now();
			if (now - lastFeed < 1500) return;
			const x = e.clientX - layerLeft;
			const y = e.clientY + window.scrollY - layerPageTop;
			if (y < waterYS + 40 || y > bedYS - 16 || x < 20 || x > W - 20) return;
			lastFeed = now;
			const id = ++pelletN;
			pellets = [...pellets, { id, x, y }];
			setTimeout(() => (pellets = pellets.filter((p2) => p2.id !== id)), 2100);
			let best = 0;
			let bd = Infinity;
			fkPos.forEach((p2, i2) => {
				const d2 = (p2.x - x) ** 2 + (p2.y - y) ** 2;
				if (d2 < bd) {
					bd = d2;
					best = i2;
				}
			});
			const p3 = fkPos[best];
			const ty2 = y + 36; // meet the pellet where it settles
			const ang = (Math.atan2(ty2 - p3.y, x - p3.x) * 180) / Math.PI;
			const nose = 64 * (odata?.free[best].scale ?? 0.5);
			fkPos[best] = {
				x: x - Math.cos((ang * Math.PI) / 180) * nose,
				y: ty2 - Math.sin((ang * Math.PI) / 180) * nose,
				a: ang
			};
			clearTimeout(homeT[best]);
			homeT[best] = setTimeout(() => {
				const h2 = odata?.free[best]?.home;
				if (h2) fkPos[best] = { x: h2.x, y: h2.y, a: 0 };
			}, 7000);
		};

		// ---- the namazu's eye follows the cursor (fine pointers only) ----
		let moveRaf = 0;
		let mx = 0;
		let my = 0;
		const applyGaze = () => {
			moveRaf = 0;
			const nz = odata?.namazu;
			if (!nz) return;
			const px = mx - layerLeft;
			const py = my + window.scrollY - layerPageTop;
			nzGaze = (Math.atan2(py - (nz.y - 14), px - (nz.x - 26)) * 180) / Math.PI;
		};
		const onMove = (e: PointerEvent) => {
			mx = e.clientX;
			my = e.clientY;
			if (!moveRaf) moveRaf = requestAnimationFrame(applyGaze);
		};
		const finePointer = window.matchMedia('(pointer: fine)').matches;
		if (overlay && !instant) {
			window.addEventListener('click', onClick);
			if (finePointer) window.addEventListener('pointermove', onMove, { passive: true });
		}

		return () => {
			ro.disconnect();
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			window.removeEventListener('click', onClick);
			window.removeEventListener('pointermove', onMove);
			if (raf) cancelAnimationFrame(raf);
			if (buildRaf) cancelAnimationFrame(buildRaf);
			if (moveRaf) cancelAnimationFrame(moveRaf);
			clearTimeout(blinkT);
			for (const t2 of homeT) clearTimeout(t2);
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

<!-- Die Flaschenpost: a corked green-glass bottle leaning on a stone, a
     rolled paper inside, a washi tag on a string naming its cargo. -->
{#snippet bottle(label: string)}
	<ellipse class="bt-stone" cx="-16" cy="4" rx="20" ry="9" />
	<path class="bt-stone-rim" d="M -30 0 Q -16 -6 -2 0" />
	<g transform="rotate(-14)">
		<path
			class="bt-glass"
			d="M -2 0 L 40 0 Q 48 0 48 -8 Q 48 -16 40 -16 L -2 -16 Q -10 -16 -10 -8 Q -10 0 -2 0 Z"
		/>
		<path class="bt-paper" d="M 4 -4 L 30 -4 L 32 -12 L 6 -12 Z" />
		<path class="bt-glass2" d="M -6 -12 Q 16 -15 44 -13" />
		<path class="bt-neck" d="M 48 -5 L 60 -5 L 60 -11 L 48 -11 Z" />
		<path class="bt-cork" d="M 60 -3.6 L 68 -3.6 L 68 -12.4 L 60 -12.4 Z" />
	</g>
	<!-- the tag lies on the sand below the neck, clear of the origin caption -->
	<g transform="translate(18 16) rotate(-3)">
		<rect class="bt-tag" x="-4" y="-9" width={label.length * 5.6 + 12} height="17" rx="2.5" />
		<text class="bt-tag-text" x={(label.length * 5.6 + 4) / 2} y="3.5">{label}</text>
	</g>
	<path class="bt-string" d="M 52 -14 Q 40 2 24 8" />
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

<!-- the base instance is pure decoration (aria-hidden); the overlay hosts
     real interactive elements, so only its decorative groups are hidden -->
<div
	class="dive-layer"
	class:is-over={overlay}
	class:instant
	bind:this={root}
	aria-hidden={overlay ? undefined : 'true'}
>
	{#if W > 0 && lineParams}
		{#if overlay}
			<svg viewBox="0 0 {W} {Math.max(H, 1)}">
				<!-- the two free koi — they may cross the cards: you are IN the water -->
				{#if odata}
					<g aria-hidden="true">
						{#each fkPos as p2, i2 (i2)}
							<g class="free-koi" style="transform: translate({p2.x}px, {p2.y}px)">
								<g
									class="fk-pose"
									style="transform: rotate({p2.a}deg) scale(1, {Math.abs(p2.a) > 90 ? -1 : 1})"
								>
									<g class="fk-bob" style="--fkdel:{i2 * -3.2}s">
										<Koi
											robe={odata.free[i2].robe}
											scale={odata.free[i2].scale}
											motion="tail"
											shadow={false}
											wag={2.3}
										/>
									</g>
								</g>
							</g>
						{/each}
						{#each pellets as pl (pl.id)}
							<circle class="pellet" cx={pl.x} cy={pl.y} r="3.1" />
						{/each}

						<!-- the asagi companion: dives with you, riding the line -->
						<g class="companion" style="transform: translate({compX}px, {compY}px)">
							<g class="comp-pose" class:up={compUp}>
								<Koi robe="asagi" scale={0.5} motion="tail" shadow={false} wag={1.9} />
							</g>
						</g>
					</g>
				{/if}

				<!-- the namazu, half-buried beside the origin. In myth he shakes
				     the earth; petted here, he keeps the sea calm instead. -->
				{#if odata?.namazu}
					<g transform="translate({odata.namazu.x} {odata.namazu.y})">
						<g class="zone" class:on={isOn('origin')}>
							<g class="grow" style="--gd:350ms">
								<g aria-hidden="true">
									<path
										class="nz-body"
										d="M -48 4 C -44 -16 -22 -26 6 -24 C 32 -22 46 -12 48 2 C 50 -4 54 -12 60 -16 C 62 -6 60 4 54 8 C 30 13 -28 13 -48 4 Z"
									/>
									<path class="nz-belly" d="M -44 5 C -30 9 20 10 46 7 C 20 12 -26 12 -44 5 Z" />
									<path class="nz-fin" d="M -4 -24 C 2 -32 14 -32 20 -26" />
									<path class="nz-mouth" d="M -48 -2 Q -38 2 -26 1" />
									<path
										class="nz-barbel"
										d="M -46 -8 q -16 -3 -24 7 M -43 -12 q -14 -9 -24 -9 M -34 -3 q -10 4 -13 11"
									/>
									<ellipse class="nz-eyeball" cx="-26" cy="-14" rx="5.2" ry="4.8" />
									<g transform="translate(-26 -14)">
										<g class="nz-pupil" style="transform: rotate({nzGaze}deg)">
											<circle cx="2" cy="0" r="2.3" />
										</g>
									</g>
									<circle class="nz-glint" cx="-27.6" cy="-15.8" r="0.9" />
									<ellipse class="nz-lid" class:blink={nzBlink} cx="-26" cy="-14" rx="5.4" ry="5" />
									<path class="nz-sand" d="M -54 8 Q -30 2 0 6 T 58 6 L 58 16 L -54 16 Z" />
								</g>
								{#if calmN > 0}
									{#key calmN}
										<g class="calm-burst" aria-hidden="true">
											<circle class="calm-b" cx="-30" cy="-22" r="2.2" style="--cd:0ms" />
											<circle class="calm-b" cx="-22" cy="-26" r="1.6" style="--cd:140ms" />
											<circle class="calm-b" cx="-36" cy="-27" r="1.3" style="--cd:260ms" />
											<text class="calm-text" y="-38">{m.cv_namazu_calm()}</text>
										</g>
									{/key}
								{/if}
								<g
									class="namazu-hit"
									role="button"
									tabindex="0"
									aria-label={m.cv_namazu_label()}
									onclick={namazuClick}
									onkeydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											namazuClick();
										}
									}}
								>
									<rect class="hitbox" x="-62" y="-34" width="128" height="48" rx="12" />
								</g>
							</g>
						</g>
					</g>
				{/if}

				<!-- die Flaschenpost: the CV in a bottle, resting against a stone -->
				{#if odata?.bottle}
					<g transform="translate({odata.bottle.x} {odata.bottle.y})">
						<g class="zone" class:on={isOn('origin')}>
							<g class="grow" style="--gd:500ms">
								{#if pdf}
									<a class="bottle-link" href={pdf} download aria-label={m.cv_pdf_label()}>
										{@render bottle(m.cv_pdf_label())}
									</a>
								{:else}
									{@render bottle(m.cv_pdf_placeholder())}
								{/if}
							</g>
						</g>
					</g>
				{/if}
			</svg>
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
					<radialGradient id="{uid}-pool">
						<stop offset="0" stop-color="#ffcf6e" stop-opacity="0.17" />
						<stop offset="0.6" stop-color="#f2a94e" stop-opacity="0.08" />
						<stop offset="1" stop-color="#f2a94e" stop-opacity="0" />
					</radialGradient>
					<radialGradient id="{uid}-lglow">
						<stop offset="0" stop-color="#ffd98c" stop-opacity="0.5" />
						<stop offset="1" stop-color="#ffd98c" stop-opacity="0" />
					</radialGradient>
					<radialGradient id="{uid}-eglow">
						<stop offset="0" stop-color="#ffce6a" stop-opacity="0.5" />
						<stop offset="0.5" stop-color="#f2a94e" stop-opacity="0.18" />
						<stop offset="1" stop-color="#f2a94e" stop-opacity="0" />
					</radialGradient>
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

				<!-- warm tōrō light pooling behind the midnight slips -->
				{#each glowPools as gp, i (i)}
					<g class="zone" class:on={isOn(gp.gate)}>
						<ellipse
							class="glow-pool fade"
							cx={gp.cx}
							cy={gp.cy}
							rx={gp.rx}
							ry={gp.ry}
							fill="url(#{uid}-pool)"
						/>
					</g>
				{/each}

				{#if ringset}
					<!-- quiet rings settling on the surface -->
					<g class="zone" class:on={isOn('surface')}>
						<g transform="translate({ringset.x} {ringset.y})">
							<ellipse class="ring" rx="38" ry="10" style="--rd:0s" />
							<ellipse class="ring" rx="38" ry="10" style="--rd:3.6s" />
						</g>
					</g>
				{/if}

				<!-- lily stems trailing down from the pads, root tufts at the tips -->
				<g class="zone" class:on={isOn('surface')}>
					{#each stems as st2, i (i)}
						<g class="fade" style="--gd:{500 + i * 120}ms">
							<path class="stem-line" d={st2.d} />
							<g transform="translate({st2.tx} {st2.ty})">
								<path class="stem-tuft" d={st2.tuft} />
							</g>
						</g>
					{/each}
				</g>

				<!-- cross-currents tying each concurrent pair of stations -->
				{#each crossTies as t, i (i)}
					<g class="zone" class:on={isOn(t.gate)}>
						<path class="cross-tie fade" d={t.d} />
					</g>
				{/each}

				<!-- the koi cast: era by size — kohaku at today, asagi in twilight -->
				{#each koiCast as k, i (i)}
					<g class="zone" class:on={isOn(k.gate)}>
						<g class="fade" style="--gd:300ms">
							<Koi
								robe={k.robe}
								scale={k.scale}
								wag={k.wag}
								motion="tail"
								shadow={false}
								swim={{ path: k.path, dur: k.dur, rest: k.rest, delay: k.delay }}
							/>
						</g>
					</g>
				{/each}

				<!-- the twilight school: five silhouettes, one shared loop -->
				{#if school}
					<g class="zone" class:on={isOn(school.gate)}>
						<g class="fade" style="--gd:350ms">
							<g
								class="shoal-mover"
								style="offset-path: path('{school.path}'); --swim:96s; --rest:22%"
							>
								{#each [[0, 0, 1], [20, -9, 0.9], [38, 5, 0.82], [15, 11, 0.78], [33, -16, 0.7]] as [fx, fy, fs], i2 (i2)}
									<g transform="translate({fx} {fy}) scale({fs})">
										<path
											class="shoal-fish"
											d="M8 0C8 -2.6 4.4 -4.4 0 -4.4C-3.6 -4.4 -6.6 -2.4 -7.6 0C-6.6 2.4 -3.6 4.4 0 4.4C4.4 4.4 8 2.6 8 0Z"
										/>
										<path class="shoal-fish" d="M-7 0L-11.5 -3.5C-10.4 -1.4 -10.4 1.4 -11.5 3.5Z" />
									</g>
								{/each}
							</g>
						</g>
					</g>
				{/if}

				<!-- fry, hatched where everything began -->
				{#if fry}
					<g class="zone" class:on={isOn(fry.gate)}>
						<g class="fade" style="--gd:400ms">
							<g
								class="shoal-mover"
								style="offset-path: path('{fry.path}'); --swim:110s; --rest:64%"
							>
								{#each [[0, 0], [11, -5], [21, 3], [8, 7], [17, -10], [27, -3]] as [fx, fy], i2 (i2)}
									<g transform="translate({fx} {fy})">
										<ellipse class="fry-b" rx="3.2" ry="1.5" />
										<path class="fry-b" d="M-3 0L-5.4 -1.6C-4.9 -0.6 -4.9 0.6 -5.4 1.6Z" />
									</g>
								{/each}
							</g>
						</g>
					</g>
				{/if}

				{#if seabed}
					<!-- the seabed: dune bands, the moss-dark sunken gate, and the
					     clutch of koi eggs glowing where the current begins -->
					<path class="sand s1" d={seabed.sand1} />
					<g transform="translate({seabed.toriiX} {seabed.toriiY}) scale({seabed.toriiS})">
						<path class="st-main" d="M25.6 24L34.4 24L29.2 118L19.4 118Z" />
						<path class="st-main" d="M105.6 24L114.4 24L120.6 118L110.8 118Z" />
						<path class="st-main" d="M66.4 24.5H73.6V47H66.4Z" />
						<path class="st-main" d="M7.5 47H132.5V55.5H7.5Z" />
						<path class="st-dark" d="M10.5 15.5H129.5V24.5H10.5Z" />
						<path class="st-dark" d="M1 2C36 9 104 9 139 2L136.5 14.5C104 20 36 20 3.5 14.5Z" />
					</g>
					{#each seabed.moss as ms, i (i)}
						<g transform="translate({ms.x} {ms.y})"><path class="st-moss" d={ms.d} /></g>
					{/each}
					{#each seabed.barnacles as bn, i (i)}
						<circle class="st-barnacle" cx={bn.x} cy={bn.y} r="1.4" />
					{/each}
					<path class="sand s2" d={seabed.sand2} />
					{#each seabed.stones as sn, i (i)}
						<g transform="translate({sn.x} {sn.y})">
							<path class="bed-stone" d={sn.d} />
							<path class="bed-stone-rim" d={sn.rim} />
						</g>
					{/each}

					<!-- the origin: koi eggs under the gate — the Seed's mirror -->
					<g class="zone" class:on={isOn('origin')}>
						<g transform="translate({seabed.eggsX} {seabed.eggsY})">
							<g class="grow" style="--gd:150ms">
								<ellipse class="egg-glow" rx="110" ry="48" fill="url(#{uid}-eglow)" />
								<ellipse class="egg-hollow" rx="42" ry="13" cy="5" />
								<circle class="egg-ring er1" r="17" />
								<circle class="egg-ring er2" r="17" />
								{#each seabed.eggs as e, i (i)}
									<g transform="translate({e.x} {e.y})">
										<circle class="egg" r={e.r} />
										<circle class="egg-embryo" cx={-e.r * 0.24} cy={-e.r * 0.18} r={e.r * 0.34} />
									</g>
								{/each}
								<circle class="egg-spark" cx="-6" cy="-7" r="1.4" />
								<circle class="egg-spark sp2" cx="9" cy="-3" r="1.1" />
								<circle class="egg-mote em1" cx="-16" cy="-14" r="1.4" />
								<circle class="egg-mote em2" cx="14" cy="-18" r="1.1" />
								<!-- the one hatchling, first of the current -->
								<g transform="translate(30 -14) rotate(-14)">
									<ellipse class="fry-b" rx="3.4" ry="1.6" />
									<path class="fry-b" d="M-3.2 0L-5.8 -1.7C-5.2 -0.6 -5.2 0.6 -5.8 1.7Z" />
								</g>
							</g>
						</g>
					</g>
					<path class="sand s3" d={seabed.sand3} />
					{#each seabed.crests as cr2, i (i)}
						<path class="sand-crest" d={cr2} />
					{/each}

					<!-- the egg-light's tendrils reach on below the bed, revealed by
					     your deepest descent (the under-clip) -->
					<g clip-path="url(#{uid}-uclip)">
						{#each seabed.tendrils as td, i (i)}
							<path class="egg-tendril" d={td} />
						{/each}
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
					{#each algae as al, i (i)}
						<g transform="translate({al.x} {al.y})">
							<path class="algae" d={al.d} />
						</g>
					{/each}
					{#if leadPos}
						<g transform="translate({leadPos.x} {leadPos.y - 17})">
							<path class="lead" d={leadPath(1.15)} />
							<path class="lead-hi" d="M -2.6 2.2 L -1.4 14.5" />
						</g>
					{/if}
				</g>

				<!-- sunken stone lanterns, their fireboxes still warm -->
				{#each lanterns as lt, i (i)}
					<g class="zone" class:on={isOn(lt.gate)}>
						<g transform="translate({lt.x} {lt.y}) scale({lt.s})">
							<g class="grow" style="--gd:200ms">
								<circle class="lantern-glow" cy="-33" r="30" fill="url(#{uid}-lglow)" />
								<path class="toro-stone" d="M -13 0 L 13 0 L 10 -6 L -10 -6 Z" />
								<path class="toro-stone" d="M -3.5 -6 L 3.5 -6 L 3 -22 L -3 -22 Z" />
								<path class="toro-stone" d="M -8 -22 L 8 -22 L 6.5 -27 L -6.5 -27 Z" />
								<path class="toro-box" d="M -7 -27 L 7 -27 L 7 -40 L -7 -40 Z" />
								<path class="toro-window" d="M -3.6 -29 L 3.6 -29 L 3.6 -38 L -3.6 -38 Z" />
								<path
									class="toro-roof"
									d="M -14 -40 C -8 -48 8 -48 14 -40 C 8 -43.5 -8 -43.5 -14 -40 Z"
								/>
								<path class="toro-curl" d="M -14 -40 q -2.5 -1 -3 -3.4 M 14 -40 q 2.5 -1 3 -3.4" />
								<circle class="toro-hoju" cy="-49.5" r="2.5" />
							</g>
						</g>
					</g>
				{/each}

				<!-- two dashed bubble columns: dozens of bubbles for two paths -->
				{#each bubbleCols as bc, i (i)}
					<path class="bubble-col" d={bc.d} style="--bdur:{bc.dur}s; --bdel:{bc.delay}s" />
				{/each}

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
		<!-- kelp beds bracketing the column, deterministic L-system strands -->
		{#each kelpBeds as b (b.seed)}
			<div
				class="kelp-bed"
				class:flip={b.flip}
				style="left:{b.x}px; top:{b.y}px; --garden-stem:{b.stem}; --garden-leaf:{b.leaf}"
			>
				<div class="kelp-sway" style="--sd:{b.sway}s; --sdel:{b.sdel}s">
					<Garden
						seed={b.seed}
						width={130}
						height={310}
						originX={65}
						originY={304}
						variant="kelp"
						step={b.step}
						leafScale={0.85}
						strokeWidth={3.2}
						duration={3400}
						start={instant || !!grown[b.gate]}
					/>
				</div>
			</div>
		{/each}
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

	/* ---- life ---- */
	.glow-pool {
		pointer-events: none;
	}
	.ring {
		fill: none;
		stroke: #e8f6f9;
		stroke-width: 1.5;
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
	}
	.instant .ring {
		opacity: 0.16;
		transform: scale(0.7);
	}
	.stem-line {
		fill: none;
		stroke: #35664f;
		stroke-width: 1.6;
		stroke-linecap: round;
		opacity: 0.7;
	}
	.stem-tuft {
		fill: none;
		stroke: #2c5642;
		stroke-width: 1.1;
		stroke-linecap: round;
		opacity: 0.8;
	}
	.cross-tie {
		fill: none;
		stroke: #cdeef6;
		stroke-width: 2.2;
		stroke-linecap: round;
		stroke-dasharray: 0 9;
		opacity: 0.4;
	}
	.shoal-mover {
		offset-rotate: auto;
		offset-distance: var(--rest, 0%);
	}
	.shoal-fish {
		fill: #123a49;
		opacity: 0.55;
	}
	.fry-b {
		fill: #bfe4ef;
		opacity: 0.6;
	}
	.algae {
		fill: #2f5a4c;
		opacity: 0.9;
	}
	.toro-stone {
		fill: #45525c;
		stroke: #29333b;
		stroke-width: 1;
		stroke-linejoin: round;
	}
	.toro-box {
		fill: #505f6a;
		stroke: #29333b;
		stroke-width: 1;
	}
	.toro-window {
		fill: #ffd98c;
		opacity: 0.9;
	}
	.toro-roof {
		fill: #3c4650;
		stroke: #29333b;
		stroke-width: 1;
		stroke-linejoin: round;
	}
	.toro-curl {
		fill: none;
		stroke: #3c4650;
		stroke-width: 2;
		stroke-linecap: round;
	}
	.toro-hoju {
		fill: #556270;
		stroke: #29333b;
		stroke-width: 0.8;
	}
	.lantern-glow {
		pointer-events: none;
	}
	.bubble-col {
		fill: none;
		stroke: #cdeef6;
		stroke-width: 2.6;
		stroke-linecap: round;
		stroke-dasharray: 0 27;
		opacity: 0.38;
	}

	/* ---- the seabed ---- */
	.sand.s1 {
		fill: #143646;
	}
	.sand.s2 {
		fill: #0e2a39;
	}
	.sand.s3 {
		fill: #091f2c;
	}
	.sand-crest {
		fill: none;
		stroke: #2e5f70;
		stroke-width: 1.3;
		stroke-linecap: round;
		opacity: 0.35;
	}
	.bed-stone {
		fill: #14323f;
	}
	.bed-stone-rim {
		fill: none;
		stroke: #3a6a7d;
		stroke-width: 1.2;
		stroke-linecap: round;
		opacity: 0.55;
	}
	/* the sunken gate: vermilion long drowned to moss-dark wood */
	.st-main {
		fill: #5a4a44;
	}
	.st-dark {
		fill: #47393a;
	}
	.st-moss {
		fill: #2e4d3c;
		opacity: 0.9;
	}
	.st-barnacle {
		fill: #9db3ba;
		opacity: 0.5;
	}
	/* the eggs — amber light in the dark, the Seed's mirror */
	.egg-hollow {
		fill: #02090e;
		opacity: 0.55;
	}
	.egg {
		fill: #f2a94e;
		stroke: #b06e1e;
		stroke-width: 0.8;
	}
	.egg-embryo {
		fill: #8a5312;
		opacity: 0.85;
	}
	.egg-spark {
		fill: #fff3d0;
	}
	.egg-ring {
		fill: none;
		stroke: #ffce6a;
		stroke-width: 1;
		opacity: 0.14;
		transform-box: fill-box;
		transform-origin: center;
	}
	.egg-mote {
		fill: #ffe1a0;
		opacity: 0.3;
	}
	.egg-tendril {
		fill: none;
		stroke: #d8b268;
		stroke-width: 0.9;
		stroke-linecap: round;
		opacity: 0.26;
	}

	/* ---- the overlay companions ---- */
	.comp-pose {
		transform: rotate(90deg);
	}
	.comp-pose.up {
		transform: rotate(-90deg);
	}
	.instant .comp-pose {
		transform: rotate(0deg);
	}
	.pellet {
		fill: #8a6a42;
		stroke: #5c4527;
		stroke-width: 0.8;
	}
	.instant .pellet {
		opacity: 0.85;
	}

	/* ---- the namazu ---- */
	.nz-body {
		fill: #2c3a44;
		stroke: #1a252d;
		stroke-width: 1.1;
		stroke-linejoin: round;
	}
	.nz-belly {
		fill: #3d4f5b;
		opacity: 0.9;
	}
	.nz-fin {
		fill: none;
		stroke: #1a252d;
		stroke-width: 2.4;
		stroke-linecap: round;
	}
	.nz-mouth {
		fill: none;
		stroke: #1a252d;
		stroke-width: 1.3;
		stroke-linecap: round;
		opacity: 0.9;
	}
	.nz-barbel {
		fill: none;
		stroke: rgba(157, 179, 186, 0.75);
		stroke-width: 1.5;
		stroke-linecap: round;
	}
	.nz-glint {
		fill: #f4fbfd;
		opacity: 0.9;
		pointer-events: none;
	}
	.nz-eyeball {
		fill: #dfe9ee;
	}
	.nz-pupil circle {
		fill: #10181d;
	}
	.nz-lid {
		fill: #2c3a44;
		transform: scaleY(0);
		transform-box: fill-box;
		transform-origin: center 15%;
	}
	.nz-sand {
		fill: #091f2c;
	}
	.namazu-hit {
		pointer-events: auto;
		cursor: pointer;
		outline: none;
	}
	.hitbox {
		fill: transparent;
	}
	.namazu-hit:focus-visible .hitbox {
		stroke: #cdeef6;
		stroke-width: 1.6;
		stroke-dasharray: 5 5;
	}
	.calm-b {
		fill: none;
		stroke: #cdeef6;
		stroke-width: 1.2;
		opacity: 0;
	}
	.calm-text {
		fill: #cdeef6;
		font:
			italic 600 13px var(--font-display, Georgia),
			serif;
		text-anchor: middle;
		opacity: 0;
	}
	.instant .calm-text,
	.instant .calm-b {
		opacity: 0.85;
	}

	/* ---- die Flaschenpost ---- */
	.bottle-link {
		pointer-events: auto;
		cursor: pointer;
		outline: none;
	}
	.bottle-link:focus-visible .bt-glass {
		stroke: #cdeef6;
		stroke-width: 2;
	}
	.bt-stone {
		fill: #14323f;
	}
	.bt-stone-rim {
		fill: none;
		stroke: #3a6a7d;
		stroke-width: 1.1;
		stroke-linecap: round;
		opacity: 0.55;
	}
	.bt-glass {
		fill: rgba(140, 190, 170, 0.3);
		stroke: #9fc4b4;
		stroke-width: 1.2;
	}
	.bt-glass2 {
		fill: none;
		stroke: #cfe8dc;
		stroke-width: 1;
		opacity: 0.5;
	}
	.bt-paper {
		fill: #efe5cc;
		stroke: #b3a582;
		stroke-width: 0.7;
	}
	.bt-neck {
		fill: rgba(140, 190, 170, 0.32);
		stroke: #9fc4b4;
		stroke-width: 1.1;
	}
	.bt-cork {
		fill: #8a6a4d;
		stroke: #5c4527;
		stroke-width: 0.9;
	}
	.bt-string {
		fill: none;
		stroke: #c9bd9d;
		stroke-width: 1;
		opacity: 0.8;
	}
	.bt-tag {
		fill: #f5efdf;
		stroke: rgba(44, 36, 27, 0.45);
		stroke-width: 0.8;
	}
	.bt-tag-text {
		fill: #2c241b;
		font: 10px var(--font-body, sans-serif);
		letter-spacing: 0.02em;
		text-anchor: middle;
	}

	/* ---- kelp beds (HTML layer over the svg, still behind the cards) ---- */
	.kelp-bed {
		position: absolute;
		width: 130px;
		height: 310px;
	}
	.kelp-bed.flip {
		transform: scaleX(-1);
	}
	.kelp-sway {
		width: 100%;
		height: 100%;
		transform-origin: 50% 100%;
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
		.shoal-mover {
			animation: dv-swim var(--swim, 90s) linear infinite;
		}
		.ring {
			animation: dv-ringpulse 8s ease-out var(--rd, 0s) infinite;
		}
		.bubble-col {
			animation: dv-bubbleflow var(--bdur, 9s) linear var(--bdel, 0s) infinite;
		}
		.kelp-sway {
			animation: dv-kelp var(--sd, 8s) ease-in-out var(--sdel, 0s) infinite alternate;
		}
		.egg-glow {
			animation: dv-egg-breathe 5.4s ease-in-out infinite;
		}
		.egg-spark {
			animation: dv-egg-spark 5.4s ease-in-out infinite;
		}
		.egg-spark.sp2 {
			animation-delay: 2.7s;
		}
		.egg-ring.er1 {
			animation: dv-egg-ring 7.5s ease-out infinite;
		}
		.egg-ring.er2 {
			animation: dv-egg-ring 7.5s ease-out 3.75s infinite;
		}
		.egg-mote {
			animation: dv-egg-mote 12s ease-in-out infinite;
		}
		.egg-mote.em2 {
			animation-duration: 10s;
			animation-delay: -5s;
		}
		.companion {
			transition: transform 750ms cubic-bezier(0.3, 0.8, 0.3, 1);
		}
		.comp-pose {
			transition: transform 650ms ease;
		}
		.free-koi {
			transition: transform 1500ms cubic-bezier(0.3, 0.75, 0.3, 1);
		}
		.fk-pose {
			transition: transform 900ms ease;
		}
		.fk-bob {
			animation: dv-fkbob 6.5s ease-in-out var(--fkdel, 0s) infinite alternate;
		}
		.pellet {
			animation: dv-pellet 1.9s ease-in forwards;
		}
		.nz-lid {
			transition: transform 400ms ease;
		}
		.nz-lid.blink {
			transform: scaleY(1);
		}
		.calm-b {
			animation: dv-calm-b 1.3s ease-out var(--cd, 0ms) forwards;
		}
		.calm-text {
			animation: dv-calm-text 1.7s ease-out 120ms forwards;
		}
	}
	@keyframes dv-fkbob {
		from {
			transform: translateY(-3.5px);
		}
		to {
			transform: translateY(3.5px);
		}
	}
	@keyframes dv-pellet {
		from {
			translate: 0 0;
			opacity: 1;
		}
		to {
			translate: 0 44px;
			opacity: 0;
		}
	}
	@keyframes dv-calm-b {
		from {
			opacity: 0.85;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(-26px);
		}
	}
	@keyframes dv-calm-text {
		0% {
			opacity: 0;
			transform: translateY(6px);
		}
		18% {
			opacity: 1;
			transform: translateY(-2px);
		}
		70% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translateY(-24px);
		}
	}
	@keyframes dv-egg-breathe {
		0%,
		100% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
	}
	@keyframes dv-egg-spark {
		0%,
		100% {
			opacity: 0.7;
		}
		50% {
			opacity: 1;
		}
	}
	@keyframes dv-egg-ring {
		0% {
			transform: scale(0.7);
			opacity: 0;
		}
		16% {
			opacity: 0.3;
		}
		100% {
			transform: scale(2.2);
			opacity: 0;
		}
	}
	@keyframes dv-egg-mote {
		0%,
		100% {
			transform: translateY(0);
			opacity: 0;
		}
		18% {
			opacity: 0.55;
		}
		60% {
			opacity: 0.35;
		}
		90% {
			transform: translateY(-22px);
			opacity: 0;
		}
	}
	@keyframes dv-swim {
		from {
			offset-distance: 0%;
		}
		to {
			offset-distance: 100%;
		}
	}
	@keyframes dv-ringpulse {
		0% {
			transform: scale(0.2);
			opacity: 0;
		}
		10% {
			opacity: 0.45;
		}
		70% {
			opacity: 0.12;
		}
		100% {
			transform: scale(1.2);
			opacity: 0;
		}
	}
	@keyframes dv-bubbleflow {
		to {
			stroke-dashoffset: -162;
		}
	}
	@keyframes dv-kelp {
		from {
			transform: rotate(-1.5deg);
		}
		to {
			transform: rotate(1.6deg);
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
