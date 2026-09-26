<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { hashSeed, rng } from '../lsystem';
	import { prefersReducedMotion } from '../reveal';
	import { blobPath, taperedBranch, taperedPath, bowerRing, smoothOpen, type Pt } from './generate';

	let {
		seed = 'about-tree',
		grown = {},
		arrive = false,
		tip = 0.86,
		overlay = false
	}: {
		seed?: string;
		/** Per-zone growth flags from the page: chapter ids + 'notes' + 'contact'. */
		grown?: Record<string, boolean>;
		/** Flips true once the page mounts — the crown unfurls on arrival. */
		arrive?: boolean;
		/** Viewport fraction where the trunk's growing tip rides. */
		tip?: number;
		/** Overlay mode: a second, sparse instance the page stacks ABOVE the
		 *  content — the branches and tufts that grip each card's corners, plus
		 *  the butterfly and the ladybug. No trunk, no scroll work. */
		overlay?: boolean;
	} = $props();
	// (tip default lives in the destructure above; 0.86 keeps the growth edge
	// near the fold so the flat clip line rarely sits mid-screen)

	/* THE TREE. One procedural organism spanning the whole page: it measures
	 * every [data-tree] anchor in the page, then grows a trunk down the
	 * gutter, a crown around the title/bio/portrait, a limb that embraces
	 * each content block, roots at the ground line, and one long root that
	 * reaches the seed packets.
	 *
	 * Growth mechanics: every branch/foliage unit is a nested <g> whose inner
	 * .grow group scales from ~0 about its own junction (transform-origin in
	 * USER units, 0px 0px = the junction), so limbs visibly extend out of
	 * their parent, staggered by generation — pure CSS one-shots. The trunk
	 * is revealed by a single SVG clip rect scrubbed to scroll (retracts on
	 * scroll-up). Ambient: gentle foliage sway, a few drifting leaves, and
	 * clumps that rustle when the cursor brushes them. Reduced motion: the
	 * whole tree stands fully grown and still. */

	const LEAF_D = 'M0 0 C 5 -4 5 -12 0 -16 C -5 -12 -5 -4 0 0 Z';

	interface Leaf {
		x: number;
		y: number;
		a: number;
		s: number;
		dark: boolean;
	}
	interface Clump {
		back: string;
		front: string;
		hi: string;
		frontOff: Pt;
		hiOff: Pt;
		leaves: Leaf[];
		sway: number;
	}
	interface Unit {
		x: number;
		y: number;
		delay: number;
		branch?: string;
		stroke?: { d: string; w: number };
		off?: Pt;
		clump?: Clump;
		ci?: number;
		children: Unit[];
	}
	interface Zone {
		key: string;
		clipped: boolean;
		units: Unit[];
		/** Growth gate when it differs from `key` (overlay grips share gates). */
		gate?: string;
	}

	let root = $state<HTMLDivElement | null>(null);
	let W = $state(0);
	let H = $state(0);
	let zones = $state<Zone[]>([]);
	let trunkD = $state('');
	let sheenD = $state('');
	let rimLD = $state('');
	let rimRD = $state('');
	let fissures = $state<{ d: string; light: boolean; w: number }[]>([]);
	let knots = $state<{ x: number; y: number; r: number }[]>([]);
	let woodX0 = $state(0);
	let woodX1 = $state(100);
	let bark = $state<string[]>([]);
	let atmoStops = $state<{ o: number; c: string }[]>([]);
	let rocks = $state<{ x: number; y: number; d: string; d2: string; fill: string }[]>([]);
	let strata = $state<string[]>([]);
	let airmotes = $state<{ x: number; y: number; r: number; dur: number; delay: number }[]>([]);
	let falls = $state<{ x: number; y: number; dur: number; delay: number }[]>([]);
	let trunkTopYS = $state(0);
	let groundYS = $state(0);
	let progress = $state(0);
	let underProgress = $state(0);
	let instant = $state(false);
	// the living details
	let moss = $state<{ x: number; y: number; d: string; d2: string }[]>([]);
	let deepRuns = $state<{ d: string }[]>([]);
	let mushrooms = $state<{ x: number; y: number; s: number; flip: boolean }[]>([]);
	let perches = $state<{ x: number; y: number; flip: boolean; delay: number }[]>([]);
	let trunkParams = $state<{
		xTop: number;
		xMain: number;
		bendY0: number;
		bendY1: number;
		phase: number;
		sizeK: number;
		topY: number;
		groundY: number;
	} | null>(null);
	let sqY = $state(0);
	let sqRun = $state(false);
	let sqDir = $state<'up' | 'down'>('up');
	let forestRows = $state<
		{ cls: string; trees: { x: number; y: number; d: string; dh: string; trunk: boolean }[] }[]
	>([]);
	let grassBandBack = $state('');
	let grassBandFront = $state('');
	let deer = $state<{ y: number; startX: number; ww: number } | null>(null);
	let colony = $state<{
		x: number;
		y: number;
		entrance: string;
		tunnels: { d: string; ants: { dur: number; delay: number; rev: boolean }[] }[];
		chambers: { x: number; y: number; d: string; kind: 'nursery' | 'food' | 'queen' }[];
		larvae: { x: number; y: number; a: number }[];
		seeds: { x: number; y: number; a: number }[];
		staticAnts: { x: number; y: number; a: number; s: number }[];
	} | null>(null);
	let grassTufts = $state<
		{
			x: number;
			kind: 'grass' | 'daisy' | 'bell' | 'seed';
			s: number;
			sd: number;
			sdel: number;
			flip: boolean;
			delay: number;
		}[]
	>([]);
	let logPiece = $state<{ x: number; rot: number } | null>(null);
	let fallenLeaves = $state<{ x: number; y: number; a: number; s: number }[]>([]);
	let worms = $state<{ x: number; y: number; s: number; gate: string; delay: number }[]>([]);
	let flyers = $state<{ x: number; y: number; dur: number; delay: number }[]>([]);
	let butterfly = $state<{ x: number; y: number } | null>(null);
	let ladybug = $state<{ x: number; y: number; a: number } | null>(null);

	const uid = $derived(`tl-${hashSeed(seed).toString(36)}`);
	const clipHeight = $derived(Math.max(0, trunkTopYS + (groundYS + 70 - trunkTopYS) * progress));
	const underClipH = $derived(Math.max(0, (H - groundYS + 60) * underProgress));

	let sqCool = 0;
	let sqRunT: ReturnType<typeof setTimeout> | undefined;

	// rustle bookkeeping (decorative, managed outside Svelte state)
	let rustlePts: { ci: number; x: number; y: number }[] = [];
	let rustleEls = new Map<number, Element>();
	const rustleCool = new Map<number, number>();
	let layerPageTop = 0;
	let layerLeft = 0;
	let ciCounter = 0;

	interface Anchor {
		x0: number;
		y0: number;
		x1: number;
		y1: number;
		cx: number;
		cy: number;
	}

	type TrunkParams = NonNullable<typeof trunkParams>;
	function trunkXOf(p: TrunkParams, y: number): number {
		const b = Math.min(1, Math.max(0, (y - p.bendY0) / (p.bendY1 - p.bendY0)));
		const bs = b * b * (3 - 2 * b);
		return (
			p.xTop +
			(p.xMain - p.xTop) * bs +
			Math.sin(((y - p.topY) / Math.max(1, p.groundY - p.topY)) * Math.PI * 1.3 + p.phase) *
				9 *
				p.sizeK
		);
	}
	function halfWOf(p: TrunkParams, y: number): number {
		const t = Math.min(1, Math.max(0, (y - p.topY) / (p.groundY - p.topY)));
		return (14 + 32 * t) * p.sizeK;
	}
	const sqX = $derived(
		trunkParams ? trunkXOf(trunkParams, sqY) + halfWOf(trunkParams, sqY) * 0.74 : 0
	);

	function measure(): Record<string, Anchor> | null {
		const parent = root?.parentElement;
		if (!root || !parent) return null;
		const lr = root.getBoundingClientRect();
		if (lr.width < 10 || lr.height < 10) return null;
		layerPageTop = lr.top + window.scrollY;
		layerLeft = lr.left;
		const out: Record<string, Anchor> = {};
		for (const el of parent.querySelectorAll<HTMLElement>('[data-tree]')) {
			const r = el.getBoundingClientRect();
			out[el.dataset.tree!] = {
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
		const bio = a['bio'];
		const wrap = a['treewrap'];
		const ground = a['ground'];
		if (!bio || !wrap || !ground) return;
		const rand = rng(hashSeed(`${seed}:${W}x${H}`));
		ciCounter = 0;
		rustlePts = [];

		const gutter = Math.max(40, bio.x0 - wrap.x0);
		// Desktop weave: the trunk rises through the corridor between bio and
		// portrait, content alternating around it. Narrow layouts fall back to
		// the left-gutter trunk.
		const portrait0 = a['portrait'];
		const central = !!(portrait0 && portrait0.x0 - bio.x1 > 70);
		const sizeK = central ? 1 : Math.min(1, Math.max(0.52, gutter / 100));
		const trunkTopY = Math.max(26, bio.y0 - 175);
		const groundY = ground.cy;
		trunkTopYS = trunkTopY;
		groundYS = groundY;
		// The trunk CURVES: it rises through the bio|portrait corridor in the
		// crown, then bends to the page's center for the weave, so it never
		// hides behind the side blocks. Every attachment asks trunkXAt for the
		// bark's true x at its height. A soft S-wiggle keeps it alive.
		const xTop = central ? (bio.x1 + portrait0.x0) / 2 : wrap.x0 + gutter * 0.52;
		const xMain = central ? (wrap.x0 + wrap.x1) / 2 : xTop;
		const bendY0 = Math.max(bio.y1, portrait0 ? portrait0.y1 : bio.y1) + 10;
		const bendY1 = bendY0 + 280;
		// phase must NOT come from this instance's rand stream: the overlay
		// instance recomputes trunkXAt and both must agree exactly.
		const sPhase = (hashSeed(`phase:${W}x${H}`) % 628) / 100;
		const trunkXAt = (y: number) => {
			const b = Math.min(1, Math.max(0, (y - bendY0) / (bendY1 - bendY0)));
			const bs = b * b * (3 - 2 * b);
			return (
				xTop +
				(xMain - xTop) * bs +
				Math.sin(((y - trunkTopY) / Math.max(1, groundY - trunkTopY)) * Math.PI * 1.3 + sPhase) *
					9 *
					sizeK
			);
		};

		trunkParams = {
			xTop,
			xMain,
			bendY0,
			bendY1,
			phase: sPhase,
			sizeK,
			topY: trunkTopY,
			groundY
		};

		const f = (n: number) => +n.toFixed(1);

		// ---------- helpers ----------
		function mkClump(size: number, sway: number): Clump {
			const rx = size;
			const ry = size * (0.62 + rand() * 0.16);
			const leaves: Leaf[] = [];
			// tiny clumps read cleaner as pure lobed masses — edge leaves on a
			// small body look like flippers
			const nl = size < 20 ? 0 : Math.round(size / 9);
			for (let i = 0; i < nl; i++) {
				const ang = rand() * Math.PI * 2;
				const rr = 0.92 + rand() * 0.14;
				leaves.push({
					x: f(Math.cos(ang) * rx * rr),
					y: f(Math.sin(ang) * ry * rr),
					a: f((ang * 180) / Math.PI + 90 + (rand() - 0.5) * 32),
					s: +(0.34 + rand() * 0.28).toFixed(2),
					dark: rand() > 0.5
				});
			}
			return {
				back: blobPath(rand, rx, ry, 12),
				front: blobPath(rand, rx * 0.84, ry * 0.8, 11),
				hi: blobPath(rand, rx * 0.46, ry * 0.42, 9),
				frontOff: { x: f(-rx * 0.1), y: f(-ry * 0.16) },
				hiOff: { x: f(-rx * 0.2), y: f(-ry * 0.3) },
				leaves,
				sway
			};
		}

		function clumpUnit(
			x: number,
			y: number,
			size: number,
			delay: number,
			sway = 9 + rand() * 4
		): Unit {
			const ci = ciCounter++;
			return {
				x: f(x),
				y: f(y),
				delay: Math.round(delay),
				clump: mkClump(size, sway),
				ci,
				children: []
			};
		}

		/** Track a clump's absolute position for the cursor rustle. */
		function reg(u: Unit, ax: number, ay: number) {
			if (u.clump && u.ci !== undefined) rustlePts.push({ ci: u.ci, x: ax + u.x, y: ay + u.y });
			for (const c of u.children) reg(c, ax + u.x, ay + u.y);
		}

		/** Recursive limb: tapered branch, children sprouting from tip + mid. */
		function limb(angle: number, len: number, w0: number, depth: number, delay: number): Unit {
			const g = taperedBranch(rand, angle, len, w0, Math.max(1.3, w0 * 0.3), len * 0.14);
			const u: Unit = { x: 0, y: 0, delay: Math.round(delay), branch: g.d, children: [] };
			if (depth >= 2 || w0 < 6.5) {
				u.children.push(clumpUnit(g.end.x, g.end.y, 24 + w0 * 3 + rand() * 14, 280 + rand() * 160));
			} else {
				const kids = 2 + (rand() > 0.55 ? 1 : 0);
				for (let k = 0; k < kids; k++) {
					const at = k === 0 ? g.end : g.mid;
					const baseA = k === 0 ? g.endAngle : g.midAngle;
					const spread = k === 1 ? (rand() > 0.5 ? 36 : -36) : 0;
					const child = limb(
						baseA + spread + (rand() * 2 - 1) * 30,
						len * (0.58 + rand() * 0.16),
						w0 * 0.55,
						depth + 1,
						230 + rand() * 150
					);
					child.x = f(at.x);
					child.y = f(at.y);
					u.children.push(child);
				}
				if (rand() > 0.45)
					u.children.push(clumpUnit(g.mid.x, g.mid.y, 18 + w0 * 2.2, 360 + rand() * 140));
			}
			return u;
		}

		const zs: Zone[] = [];

		// ---------- OVERLAY instance: the wood that grips the cards ----------
		if (overlay) {
			const gripSpecs: [string, string][] = [
				['bio', 'crown'],
				['portrait', 'crown'],
				['notes', 'notes'],
				['ch-pioneer', 'pioneer'],
				['ch-branches', 'branches'],
				['ch-roots', 'roots'],
				['ch-mycelium', 'mycelium'],
				['contact', 'contact']
			];
			for (const [key, gate] of gripSpecs) {
				const s = a[key];
				if (!s) continue;
				const leftSide = s.cx < trunkXAt(s.cy);
				const nearX = leftSide ? s.x1 : s.x0;
				const dir = leftSide ? -1 : 1;
				const units: Unit[] = [];
				// wood tracing the card's top edge in from its near corner
				const topLen = Math.min((s.x1 - s.x0) * 0.55, 250);
				const gTop = taperedBranch(rand, leftSide ? 274 : 88, topLen, 7, 1.8, 5);
				units.push({
					x: f(nearX - dir * 6),
					y: f(s.y0 + 5),
					delay: 80,
					branch: gTop.d,
					children: [clumpUnit(gTop.end.x, gTop.end.y - 2, 13 + rand() * 5, 260, 7)]
				});
				// a short grip down the near edge
				const gSide = taperedBranch(
					rand,
					178 + dir * 5 + (rand() * 2 - 1) * 4,
					55 + rand() * 35,
					5.5,
					1.4,
					6
				);
				units.push({
					x: f(nearX + dir * 2),
					y: f(s.y0 + 10),
					delay: 200,
					branch: gSide.d,
					children: []
				});
				// a tuft sitting ON the near corner + a sprig crossing it
				units.push(clumpUnit(nearX - dir * 12, s.y0 - 3, 16 + rand() * 6, 320));
				const sprig = taperedBranch(rand, leftSide ? 232 : 128, 34 + rand() * 14, 3, 1, 6);
				units.push({
					x: f(nearX),
					y: f(s.y0 + 4),
					delay: 380,
					branch: sprig.d,
					children: [clumpUnit(sprig.end.x, sprig.end.y, 10 + rand() * 4, 300, 0)]
				});
				// a lighter tuft leaning on the far corner
				units.push(clumpUnit(leftSide ? s.x0 + 14 : s.x1 - 14, s.y0 - 4, 12 + rand() * 5, 460, 8));
				zs.push({ key: `grip-${key}`, gate, clipped: false, units });
			}
			const p0 = a['portrait'];
			if (p0) butterfly = { x: f(p0.x1 - 14), y: f(p0.y0 - 26) };
			const n0 = a['notes'];
			if (n0) {
				const lb = n0.cx < trunkXAt(n0.cy);
				ladybug = { x: f(lb ? n0.x1 - 64 : n0.x0 + 64), y: f(n0.y0 + 3), a: lb ? -8 : 8 };
			}
			zones = zs;
			return;
		}

		// ---------- trunk (absolute coords, tapered, buttressed base) ----------
		{
			const n = Math.max(6, Math.round((groundY - trunkTopY) / 120));
			const cl: Pt[] = [];
			for (let i = 0; i <= n; i++) {
				const t = i / n;
				const y = trunkTopY + (groundY - trunkTopY) * t;
				cl.push({ x: trunkXAt(y) + (rand() * 2 - 1) * 3.5 * sizeK, y });
			}
			const halfW = (t: number) => (14 + 32 * t) * sizeK * (1 + Math.max(0, t - 0.92) * 8);
			const L: Pt[] = [];
			const R: Pt[] = [];
			for (let i = 0; i <= n; i++) {
				const t = i / n;
				const p0 = cl[Math.max(0, i - 1)];
				const p1 = cl[Math.min(n, i + 1)];
				const dx = p1.x - p0.x;
				const dy = p1.y - p0.y;
				const dl = Math.hypot(dx, dy) || 1;
				const nx = -dy / dl;
				const ny = dx / dl;
				L.push({ x: cl[i].x + nx * halfW(t), y: cl[i].y + ny * halfW(t) });
				R.push({ x: cl[i].x - nx * halfW(t), y: cl[i].y - ny * halfW(t) });
			}
			R.reverse();
			trunkD = `M${smoothOpen(L)} L ${smoothOpen(R)} Z`;
			// WOOD: a horizontal light-to-shadow gradient across the trunk's
			// span (sun from the left), plus curve-following rims, a highlight
			// streak, long bark fissures, growth ticks and a pair of knots —
			// layered so the cylinder reads 3D.
			woodX0 = Math.min(...cl.map((p) => p.x)) - halfW(1);
			woodX1 = Math.max(...cl.map((p) => p.x)) + halfW(1);
			rimLD = `M${smoothOpen(L)}`;
			rimRD = `M${smoothOpen(R)}`;
			sheenD = `M${smoothOpen(cl.map((p, i) => ({ x: p.x - halfW(i / n) * 0.38, y: p.y })))}`;
			const fis: { d: string; light: boolean; w: number }[] = [];
			[-0.55, -0.2, 0.14, 0.5, -0.36, 0.32].forEach((off, k) => {
				const pts: Pt[] = [];
				for (let i = 0; i <= n; i++) {
					const t = i / n;
					const y = trunkTopY + (groundY - trunkTopY) * t;
					pts.push({ x: trunkXAt(y) + off * halfW(t) * 1.45 + (rand() * 2 - 1) * 2.4, y });
				}
				fis.push({
					d: `M${smoothOpen(pts)}`,
					light: k >= 4,
					w: +(k >= 4 ? 1.6 : 1.1 + rand()).toFixed(1)
				});
			});
			fissures = fis;
			knots = [0.3, 0.62].map((kt) => {
				const t = kt + (rand() - 0.5) * 0.06;
				const y = trunkTopY + (groundY - trunkTopY) * t;
				return {
					x: f(trunkXAt(y) + (rand() * 2 - 1) * halfW(t) * 0.35),
					y: f(y),
					r: +(4 + rand() * 3).toFixed(1)
				};
			});
			const bk: string[] = [];
			const nB = Math.max(6, Math.round((groundY - trunkTopY) / 170));
			for (let i = 0; i < nB; i++) {
				const t = 0.12 + (0.8 * i) / Math.max(1, nB - 1) + (rand() - 0.5) * 0.05;
				const y = trunkTopY + (groundY - trunkTopY) * t;
				const x = trunkXAt(y) + (rand() * 2 - 1) * halfW(t) * 0.55;
				const l = 14 + rand() * 20;
				bk.push(`M${f(x)} ${f(y)} q ${f((rand() * 2 - 1) * 3)} ${f(l / 2)} 0 ${f(l)}`);
			}
			bark = bk;
			// moss cushions clinging to the bark — this tree is OLD
			const ms: typeof moss = [];
			const nM = Math.max(5, Math.round((groundY - trunkTopY) / 280));
			for (let i = 0; i < nM; i++) {
				const t = 0.1 + (0.8 * i) / Math.max(1, nM - 1) + (rand() - 0.5) * 0.06;
				const y = trunkTopY + (groundY - trunkTopY) * t;
				const side = i % 2 === 0 ? -1 : 1;
				const x = trunkXAt(y) + side * halfW(t) * 0.9;
				ms.push({
					x: f(x),
					y: f(y),
					d: blobPath(rand, 8 + rand() * 7, 5 + rand() * 3, 8),
					d2: blobPath(rand, 5 + rand() * 4, 3 + rand() * 2, 7)
				});
			}
			moss = ms;
		}

		// ---------- atmosphere: sky → forest greens/yellows → soil → rock ----
		{
			const g = Math.min(0.92, groundY / H);
			const st = (o: number, c: string) => ({ o: +Math.min(1, Math.max(0, o)).toFixed(4), c });
			atmoStops = [
				st(0, '#c7ddef'),
				st(Math.min(0.08, g * 0.2), '#dbe8e9'),
				st(Math.min(0.15, g * 0.35), '#eef5ef'),
				st(g * 0.5, '#e9f1dd'),
				st(g * 0.8, '#ebefcd'),
				st(g - 0.02, '#e4d8ad'),
				st(g - 0.002, '#d5c194'),
				st(g + 0.004, '#b1976f'),
				st(g + 0.12, '#a48b6b'),
				st(Math.min(0.97, g + 0.5), '#93826f'),
				st(1, '#9e937f')
			];
			// buried stones — bigger and greyer the deeper they sit
			const rk: typeof rocks = [];
			const nR = Math.min(24, Math.max(12, Math.round(W / 105)));
			const fills = ['#958a77', '#89806f', '#9d9280', '#8b8274'];
			for (let i = 0; i < nR; i++) {
				const t = Math.pow(rand(), 1.3);
				const size = 12 + rand() * 24 + t * 28;
				rk.push({
					x: f(W * rand()),
					y: f(groundY + 70 + Math.max(60, H - groundY - 180) * t),
					d: blobPath(rand, size, size * (0.58 + rand() * 0.2), 9),
					d2: blobPath(rand, size * 0.48, size * 0.3, 8),
					fill: fills[Math.floor(rand() * fills.length)]
				});
			}
			rocks = rk;
			// faint strata seams in the earth
			const sl: string[] = [];
			for (const tt of [0.34, 0.64]) {
				const y = groundY + (H - groundY) * tt;
				const pts: Pt[] = [];
				const nS = Math.max(6, Math.round(W / 220));
				for (let i = 0; i <= nS; i++) pts.push({ x: (W * i) / nS, y: y + (rand() * 2 - 1) * 15 });
				sl.push(`M${smoothOpen(pts)}`);
			}
			strata = sl;
			// drifting light motes under the canopy
			airmotes = Array.from({ length: 9 }, () => ({
				x: f(W * (0.1 + rand() * 0.8)),
				y: f(140 + rand() * 230),
				r: +(1.5 + rand() * 1.1).toFixed(1),
				dur: +(10 + rand() * 8).toFixed(1),
				delay: +(-14 * rand()).toFixed(1)
			}));
			// ---------- distant forest: three SOFT misty rows on the horizon.
			// Each tree is a halo blob under a canopy blob (fuzzy edge without
			// any filter) on a rounded trunk; colors sit barely off the sky. --
			const horizon = trunkTopY + 150;
			const rowSpecs = [
				{
					cls: 'frow3',
					y: horizon - 26,
					n: Math.max(6, Math.round(W / 190)),
					rx: 26,
					trunk: false
				},
				{ cls: 'frow2', y: horizon - 8, n: Math.max(5, Math.round(W / 240)), rx: 34, trunk: true },
				{ cls: 'frow1', y: horizon + 14, n: Math.max(4, Math.round(W / 320)), rx: 42, trunk: true }
			];
			forestRows = rowSpecs.map((r2) => ({
				cls: r2.cls,
				trees: Array.from({ length: r2.n }, (_, i) => {
					const rx = r2.rx + rand() * r2.rx * 0.8;
					return {
						x: f(W * ((i + 0.2 + rand() * 0.6) / r2.n)),
						y: f(r2.y - rand() * 16),
						d: blobPath(rand, rx, rx * (0.6 + rand() * 0.15), 10),
						dh: blobPath(rand, rx * 1.3, rx * 0.85, 9),
						trunk: r2.trunk
					};
				})
			}));
			// ---------- the grassy verge where trunk becomes root ----------
			// two filled, spiky grass silhouettes replace the old thin line
			const mkBand = (hMin: number, hMax: number, step: number) => {
				const pts: string[] = [`M 0 ${f(groundY + 9)}`];
				let gx = 0;
				while (gx < W) {
					const spikeH = hMin + rand() * (hMax - hMin);
					const lean2 = (rand() * 2 - 1) * 3.5;
					pts.push(`L ${f(gx + step * 0.5 + lean2)} ${f(groundY - spikeH)}`);
					pts.push(`L ${f(gx + step)} ${f(groundY + 2 - rand() * 3)}`);
					gx += step;
				}
				pts.push(`L ${f(W)} ${f(groundY + 9)} Z`);
				return pts.join(' ');
			};
			grassBandBack = mkBand(9, 20, 13);
			grassBandFront = mkBand(5, 13, 9);
			const tufts: typeof grassTufts = [];
			const nG = Math.max(16, Math.round(W / 52));
			for (let i = 0; i < nG; i++) {
				const x = W * ((i + rand() * 0.8) / nG);
				const roll = rand();
				tufts.push({
					x: f(x),
					kind: roll > 0.86 ? 'daisy' : roll > 0.74 ? 'bell' : roll > 0.64 ? 'seed' : 'grass',
					s: +(0.75 + rand() * 0.5).toFixed(2),
					sd: +(5.4 + rand() * 2.4).toFixed(1),
					sdel: +(-6 * rand()).toFixed(1),
					flip: rand() > 0.5,
					delay: Math.round(i * 55 + rand() * 120)
				});
			}
			grassTufts = tufts;
			logPiece = {
				x: f(xMain + (rand() > 0.5 ? 1 : -1) * (240 + rand() * 90)),
				rot: +((rand() * 2 - 1) * 4).toFixed(1)
			};
			// a doe ambling slowly across the verge, behind the trunk
			deer = { y: f(groundY - 1), startX: f(W * 0.3), ww: Math.round(W + 340) };
			fallenLeaves = Array.from({ length: 5 }, () => ({
				x: f(W * (0.08 + rand() * 0.84)),
				y: f(groundY - 3 - rand() * 4),
				a: f(80 + rand() * 40 * (rand() > 0.5 ? 1 : -1)),
				s: +(0.7 + rand() * 0.4).toFixed(2)
			}));
		}

		const perchList: { x: number; y: number; flip: boolean; delay: number }[] = [];

		// ---------- crown ----------
		{
			const units: Unit[] = [];
			const crownBase = trunkTopY + 26;
			const reachK = Math.min(1, W / 950);
			const angles = central ? [-64, -38, -12, 14, 40, 64] : [-56, -28, -6, 22, 48];
			angles.forEach((ang, i) => {
				const u = limb(
					ang + (rand() * 2 - 1) * 8,
					(175 + rand() * 110) * reachK + 70,
					22 * sizeK,
					0,
					i * 150
				);
				const uy = crownBase + i * 5;
				u.x = f(trunkXAt(uy) + (rand() * 2 - 1) * 4);
				u.y = f(uy);
				units.push(u);
			});
			// canopy masses crowding (and cropped by) the top edge — you stand
			// under the crown, so it reads as one connected mass
			const nc = Math.max(5, Math.round(W / 210));
			for (let i = 0; i < nc; i++) {
				const cx = W * (0.03 + (0.94 * i) / Math.max(1, nc - 1) + (rand() - 0.5) * 0.04);
				units.push(clumpUnit(cx, -18 + rand() * 88, 74 + rand() * 78, 160 + i * 80));
			}
			// the leaf bush around the bio block
			const title = a['title'];
			const bx0 = bio.x0;
			const bx1 = bio.x1;
			const topXs = [0.25, 0.55, 0.85];
			for (const tx of topXs) {
				const x = bx0 + (bx1 - bx0) * tx;
				if (!title || x > title.x1 + 30 || bio.y0 - 12 < title.y0 - 20)
					units.push(clumpUnit(x, bio.y0 - 10 + rand() * 8, 26 + rand() * 16, 420 + rand() * 300));
			}
			units.push(
				clumpUnit(
					bx0 - 14,
					bio.y0 + (bio.y1 - bio.y0) * (0.3 + rand() * 0.15),
					24 + rand() * 12,
					520
				)
			);
			units.push(
				clumpUnit(
					bx0 - 12,
					bio.y0 + (bio.y1 - bio.y0) * (0.68 + rand() * 0.1),
					20 + rand() * 12,
					640
				)
			);
			// bottom corners of the bush, hugging the veil
			units.push(clumpUnit(bx0 + 22, bio.y1 - 4, 24 + rand() * 12, 700));
			units.push(clumpUnit(bx1 - 40, bio.y1 - 2, 20 + rand() * 12, 780));
			// the bush's trunk-side cheek, tucked into the corridor
			units.push(
				clumpUnit(bx1 + 8, bio.y0 + (bio.y1 - bio.y0) * (0.4 + rand() * 0.2), 21 + rand() * 10, 600)
			);
			// the topmost branch: a bough the title sits on (reaches left when
			// the trunk is central, right in gutter mode)
			if (title) {
				const jx = trunkXAt(title.y1 + 8);
				const leftward = title.cx < jx;
				const reach = Math.max(70, Math.abs((leftward ? title.x0 - 16 : title.x1 + 16) - jx));
				const g = taperedBranch(rand, leftward ? 269 : 91, reach * 1.02, 15 * sizeK + 3, 2.4, 14);
				const u: Unit = {
					x: f(jx),
					y: f(title.y1 + 8),
					delay: 320,
					branch: g.d,
					children: [
						clumpUnit(g.mid.x, g.mid.y - 4, 15, 380, 0),
						clumpUnit(g.end.x, g.end.y - 2, 21, 520)
					]
				};
				units.push(u);
				perchList.push({
					x: f(jx + g.mid.x),
					y: f(title.y1 + 8 + g.mid.y - 2),
					flip: !leftward,
					delay: 1.4
				});
			}
			// the bower: a holding limb + woven ring + corner clumps
			const portrait = a['portrait'];
			if (portrait) {
				const pw = portrait.x1 - portrait.x0;
				const ph = portrait.y1 - portrait.y0;
				const hx = trunkXAt(crownBase);
				const dx = portrait.x0 + 12 - hx;
				const dy = portrait.y0 - 6 - crownBase;
				const hold = taperedBranch(
					rand,
					(Math.atan2(dy, dx) * 180) / Math.PI + 90,
					Math.hypot(dx, dy) * 1.02,
					14 * sizeK + 3,
					3,
					30
				);
				units.push({ x: f(hx), y: f(crownBase), delay: 240, branch: hold.d, children: [] });
				const ring = bowerRing(rand, pw, ph, 8, 24);
				const ring2 = bowerRing(rand, pw, ph, 1.5, 20);
				const bower: Unit = {
					x: f(portrait.cx),
					y: f(portrait.cy),
					delay: 640,
					stroke: { d: ring, w: 6.5 },
					off: { x: -pw / 2, y: -ph / 2 },
					children: [
						{
							x: 0,
							y: 0,
							delay: 240,
							stroke: { d: ring2, w: 3 },
							off: { x: -pw / 2, y: -ph / 2 },
							children: []
						},
						clumpUnit(-pw / 2, -ph / 2, 20, 340),
						clumpUnit(pw / 2, -ph / 2, 24, 430),
						clumpUnit(pw / 2, ph / 2, 18, 520),
						clumpUnit(-pw / 2, ph / 2, 22, 610)
					]
				};
				units.push(bower);
				perchList.push({ x: f(portrait.x0 + 34), y: f(portrait.y0 - 12), flip: false, delay: 4.2 });
			}
			zs.push({ key: 'crown', clipped: false, units });
		}

		// ---------- one embracing limb per content block ----------
		const sections: [string, string][] = [
			['notes', 'notes'],
			['ch-pioneer', 'pioneer'],
			['ch-branches', 'branches']
		];
		for (const [anchorKey, zoneKey] of sections) {
			const s = a[anchorKey];
			if (!s) continue;
			// Trees reach UP: the bough starts lower on the trunk and rises out
			// through the corridor to the block's near shoulder, then keeps
			// going — a twig along the top edge, an upward shoot past it, and a
			// draping twig onto the shoulder. Left/right mirrors by which side
			// of the trunk the block sits on.
			const left = s.cx < trunkXAt(s.cy);
			const nearX = left ? s.x1 - 34 : s.x0 + 34;
			const farX = left ? s.x0 + 26 : s.x1 - 26;
			const jy = s.y0 + 78;
			const jx = trunkXAt(jy);
			const tgt = { x: nearX, y: s.y0 - 16 };
			const dx = tgt.x - jx;
			const dy = tgt.y - jy;
			const main = taperedBranch(
				rand,
				(Math.atan2(dy, dx) * 180) / Math.PI + 90,
				Math.hypot(dx, dy) * 1.02,
				Math.max(16, (14 + 30 * ((jy - trunkTopY) / (groundY - trunkTopY))) * sizeK * 0.85),
				3,
				30
			);
			const u: Unit = { x: f(jx), y: f(jy), delay: 0, branch: main.d, children: [] };
			// twig running along the block's top edge toward its far corner
			const twig = taperedBranch(
				rand,
				(left ? 272 : 92) + (rand() * 2 - 1) * 4,
				(s.x1 - s.x0) * 0.6,
				6.5,
				1.6,
				6
			);
			const twigU: Unit = {
				x: f(main.end.x),
				y: f(main.end.y),
				delay: 300,
				branch: twig.d,
				children: []
			};
			twigU.children.push(clumpUnit(twig.end.x, twig.end.y - 2, 18 + rand() * 8, 360));
			u.children.push(twigU);
			// upward shoot past the block — the bough keeps reaching for light
			const shoot = taperedBranch(
				rand,
				(left ? 322 : 38) + (rand() * 2 - 1) * 10,
				62 + rand() * 42,
				4.5,
				1.3,
				12
			);
			const shootU: Unit = {
				x: f(main.end.x),
				y: f(main.end.y),
				delay: 430,
				branch: shoot.d,
				children: []
			};
			shootU.children.push(clumpUnit(shoot.end.x, shoot.end.y, 21 + rand() * 10, 300));
			u.children.push(shootU);
			// draping twig onto the near shoulder
			const droop = taperedBranch(
				rand,
				(left ? 186 : 174) + (rand() * 2 - 1) * 6,
				46 + rand() * 26,
				4,
				1.2,
				10
			);
			const droopU: Unit = {
				x: f(main.mid.x),
				y: f(main.mid.y),
				delay: 380,
				branch: droop.d,
				children: []
			};
			droopU.children.push(clumpUnit(droop.end.x, droop.end.y, 14 + rand() * 6, 300, 7));
			u.children.push(droopU);
			u.children.push(clumpUnit(main.end.x, main.end.y - 6, 26 + rand() * 10, 460));
			u.children.push(clumpUnit(main.mid.x, main.mid.y - 8, 18 + rand() * 8, 560));
			// tuft resting on the block's far top corner
			u.children.push(clumpUnit(farX - jx, s.y0 - jy + 2, 17 + rand() * 8, 640));
			// COUNTER-BOUGH: the tree keeps branching into the open side across
			// from the block, so the weave never leaves half the page bare.
			const cjy = s.y0 + (s.y1 - s.y0) * (0.35 + rand() * 0.3);
			const counter = limb(
				(left ? 52 : -52) + (rand() * 2 - 1) * 10,
				(120 + rand() * 90) * Math.min(1, W / 950),
				Math.max(14, 17 * sizeK),
				0,
				160
			);
			counter.x = f(trunkXAt(cjy));
			counter.y = f(cjy);
			zs.push({ key: zoneKey, clipped: true, units: [u, counter] });
		}

		// ---------- roots + the long root to the seeds ----------
		// Gated on the GROUND anchor's own reveal (not the roots chapter, which
		// sits lower) so the burst is visible right when the trunk arrives.
		{
			// FAR AND WIDE: nine roots, the shallow outer ones running long and
			// nearly horizontal through the topsoil, the middle ones diving,
			// each with two generations of side-roots — a real root plate.
			const baseX = trunkXAt(groundY);
			const units: Unit[] = [];
			const rootSpecs = [
				{ a: 92, l: 540 },
				{ a: 99, l: 460 },
				{ a: 116, l: 400 },
				{ a: 138, l: 330 },
				{ a: 158, l: 260 },
				{ a: 178, l: 235 },
				{ a: 199, l: 268 },
				{ a: 220, l: 340 },
				{ a: 243, l: 415 },
				{ a: 261, l: 470 },
				{ a: 268, l: 560 }
			];
			const spread = 0.62 + Math.min(1, W / 1200) * 0.38;
			rootSpecs.forEach((sp, i) => {
				const g = taperedBranch(
					rand,
					sp.a + (rand() * 2 - 1) * 5,
					sp.l * (0.85 + rand() * 0.3) * spread * (0.55 + sizeK * 0.45),
					(20 + rand() * 9) * sizeK,
					1.4,
					sp.l * 0.16
				);
				const u: Unit = {
					x: f(baseX + (i - 4) * 6 * sizeK),
					y: f(groundY - 6),
					delay: i * 90,
					branch: g.d,
					children: []
				};
				const sub = taperedBranch(
					rand,
					g.endAngle + (rand() > 0.5 ? 18 : -18),
					sp.l * 0.4 * spread,
					3.2,
					0.8,
					12
				);
				const subU: Unit = {
					x: f(g.end.x),
					y: f(g.end.y),
					delay: 300,
					branch: sub.d,
					children: []
				};
				const sub2 = taperedBranch(
					rand,
					sub.endAngle + (rand() > 0.5 ? 16 : -16),
					sp.l * 0.2 * spread,
					1.6,
					0.5,
					8
				);
				subU.children.push({
					x: f(sub.end.x),
					y: f(sub.end.y),
					delay: 260,
					branch: sub2.d,
					children: []
				});
				u.children.push(subU);
				if (sp.l > 190) {
					const midSub = taperedBranch(
						rand,
						g.midAngle + (rand() > 0.5 ? 34 : -34),
						sp.l * 0.3 * spread,
						2.6,
						0.7,
						10
					);
					u.children.push({
						x: f(g.mid.x),
						y: f(g.mid.y),
						delay: 380,
						branch: midSub.d,
						children: []
					});
				}
				units.push(u);
			});
			zs.push({ key: 'ground', clipped: false, units });
		}
		{
			const contact = a['contact'];
			if (contact) {
				const baseX = trunkXAt(groundY);
				const cx0 = contact.cx < baseX ? contact.x0 - 20 : contact.x0 - 26;
				const dx = cx0 - baseX;
				const dy = contact.y0 + 20 - groundY;
				const g = taperedBranch(
					rand,
					(Math.atan2(dy, dx) * 180) / Math.PI + 90,
					Math.hypot(dx, dy) * 1.03,
					6.5 * sizeK + 1.5,
					1,
					44
				);
				const u: Unit = { x: f(baseX), y: f(groundY + 4), delay: 0, branch: g.d, children: [] };
				u.children.push(clumpUnit(g.end.x, g.end.y, 12, 500, 0));
				zs.push({ key: 'contact', clipped: false, units: [u] });
			}
		}

		// ---------- deep root runs: weaving AROUND the underground blocks,
		// down to the footer's waiting root tips (revealed by the under-clip
		// as you descend) ----------
		{
			const runs: { d: string }[] = [];
			const under = ['ch-roots', 'ch-mycelium', 'contact']
				.map((k) => a[k])
				.filter((b): b is Anchor => !!b);
			const laneFor = (b: Anchor, off: number) =>
				b.cx < xMain ? b.x1 + 60 + off : b.x0 - 60 - off;
			const rootlet = (bx: number, by: number, ang: number, len: number, w: number) => {
				const r1 = ((ang - 90) * Math.PI) / 180;
				const mx = bx + Math.cos(r1) * len * 0.5 + (rand() * 2 - 1) * 6;
				const my = by + Math.sin(r1) * len * 0.5;
				runs.push({
					d: taperedPath(
						[
							{ x: bx, y: by },
							{ x: mx, y: my },
							{ x: bx + Math.cos(r1) * len, y: by + Math.sin(r1) * len + len * 0.15 }
						],
						w,
						0.6
					)
				});
			};
			const mkRun = (off: number, w0: number, blocks: Anchor[], endY: number) => {
				const pts: Pt[] = [{ x: xMain + off * 0.4, y: groundY + 8 }];
				for (const b of blocks) {
					const lx = laneFor(b, Math.abs(off) * 0.5) + (rand() * 2 - 1) * 8;
					pts.push({ x: lx, y: b.y0 - 26 });
					pts.push({ x: lx + (rand() * 2 - 1) * 12, y: b.cy });
					pts.push({ x: lx + (rand() * 2 - 1) * 8, y: b.y1 + 26 });
					rootlet(lx, b.cy, lx > xMain ? 116 : 244, 40 + rand() * 34, 4.6);
				}
				pts.push({ x: xMain + off * 0.3 + (rand() * 2 - 1) * 12, y: endY });
				runs.push({ d: taperedPath(pts, w0, 1.5) });
			};
			if (under.length) {
				mkRun(0, 17, under, H - 34);
				mkRun(-46, 11, under.slice(0, 2), (under[1] ?? under[0]).y1 + 60);
				mkRun(50, 9, under.slice(0, 1), under[0].y1 + 70);
				mkRun(96, 8, under.slice(0, 2), (under[1] ?? under[0]).y1 + 120);
			}
			deepRuns = runs;
			// mushrooms at the buttress; a worm beside the mycelium block
			const baseX2 = trunkXAt(groundY);
			mushrooms = [-46, -24, 36].map((ox, i) => ({
				x: f(baseX2 + ox * (0.8 + sizeK * 0.4)),
				y: f(groundY - 2),
				s: +(0.75 + rand() * 0.45).toFixed(2),
				flip: i % 2 === 1
			}));
			const myc = a['ch-mycelium'];
			worms = [];
			if (myc)
				worms.push({
					x: f(myc.cx < xMain ? myc.x1 + 90 : myc.x0 - 120),
					y: f(myc.cy + 40),
					s: 1,
					gate: 'mycelium',
					delay: 0
				});
			worms.push({
				x: f(Math.min(W - 80, xMain + 300)),
				y: f(groundY + 230),
				s: 0.85,
				gate: 'roots',
				delay: 3
			});
			worms.push({
				x: f(Math.max(60, xMain - 200)),
				y: f(groundY + 660),
				s: 0.9,
				gate: 'mycelium',
				delay: 6
			});
			// ---------- the ant colony: chambers, tunnels, larvae, workers ----
			if (central) {
				const rootsCard = a['ch-roots'];
				const laneL = rootsCard ? rootsCard.x0 - 60 : xMain - 160;
				const cx0 = Math.max(150, laneL - 250);
				const cy0 = groundY + 150;
				const ch = (
					dx: number,
					dy: number,
					rx: number,
					ry: number,
					kind: 'nursery' | 'food' | 'queen'
				) => ({
					x: f(cx0 + dx),
					y: f(cy0 + dy),
					d: blobPath(rand, rx, ry, 10),
					kind
				});
				const chambers = [
					ch(-70, 60, 44, 26, 'nursery'),
					ch(70, 96, 36, 22, 'food'),
					ch(-6, 176, 50, 30, 'queen')
				];
				const t1 = `M ${f(cx0 + 4)} ${f(groundY - 2)} C ${f(cx0 - 10)} ${f(cy0 - 40)}, ${f(cx0 + 14)} ${f(cy0 - 10)}, ${f(cx0 - 2)} ${f(cy0 + 18)} C ${f(cx0 - 16)} ${f(cy0 + 40)}, ${f(cx0 - 50)} ${f(cy0 + 44)}, ${f(cx0 - 66)} ${f(cy0 + 56)}`;
				const t2 = `M ${f(cx0 - 40)} ${f(cy0 + 70)} C ${f(cx0)} ${f(cy0 + 84)}, ${f(cx0 + 30)} ${f(cy0 + 78)}, ${f(cx0 + 62)} ${f(cy0 + 92)}`;
				const t3 = `M ${f(cx0 - 60)} ${f(cy0 + 78)} C ${f(cx0 - 50)} ${f(cy0 + 120)}, ${f(cx0 - 30)} ${f(cy0 + 140)}, ${f(cx0 - 8)} ${f(cy0 + 168)}`;
				const t4 = `M ${f(cx0 + 60)} ${f(cy0 + 108)} C ${f(cx0 + 44)} ${f(cy0 + 140)}, ${f(cx0 + 24)} ${f(cy0 + 156)}, ${f(cx0 + 4)} ${f(cy0 + 172)}`;
				colony = {
					x: f(cx0),
					y: f(cy0),
					entrance: `M ${f(cx0 - 16)} ${f(groundY + 1)} Q ${f(cx0 + 4)} ${f(groundY - 13)} ${f(cx0 + 24)} ${f(groundY + 1)} Z`,
					tunnels: [
						{
							d: t1,
							ants: [
								{ dur: 16, delay: -2, rev: false },
								{ dur: 21, delay: -11, rev: true }
							]
						},
						{ d: t2, ants: [{ dur: 13, delay: -5, rev: false }] },
						{
							d: t3,
							ants: [
								{ dur: 18, delay: -8, rev: true },
								{ dur: 24, delay: -1, rev: false }
							]
						},
						{ d: t4, ants: [{ dur: 15, delay: -6, rev: false }] }
					],
					chambers,
					larvae: Array.from({ length: 5 }, (_, i) => ({
						x: f(cx0 - 88 + i * 11 + rand() * 4),
						y: f(cy0 + 62 + (i % 2) * 7),
						a: f((rand() * 2 - 1) * 40)
					})),
					seeds: Array.from({ length: 3 }, (_, i) => ({
						x: f(cx0 + 56 + i * 12),
						y: f(cy0 + 98 + (i % 2) * 6),
						a: f(rand() * 180)
					})),
					staticAnts: [
						{ x: f(cx0 - 62), y: f(cy0 + 56), a: 20, s: 1 },
						{ x: f(cx0 - 44), y: f(cy0 + 68), a: -30, s: 1 },
						{ x: f(cx0 + 48), y: f(cy0 + 90), a: 10, s: 1 },
						{ x: f(cx0 - 2), y: f(cy0 + 178), a: 0, s: 1.9 },
						{ x: f(cx0 + 18), y: f(cy0 + 170), a: -20, s: 1 }
					]
				};
			} else {
				colony = null;
			}
			if (!sqY) sqY = (a['notes']?.y1 ?? bendY1) + 90;
			flyers = [
				{ x: f(W * 0.6), y: 66, dur: 36, delay: -8 },
				{ x: f(W * 0.26), y: 108, dur: 47, delay: -22 }
			];
			perches = perchList;
		}

		// drifting leaves released from the canopy
		falls = Array.from({ length: 6 }, (_, i) => ({
			x: f(W * (0.1 + 0.16 * i) + (rand() - 0.5) * 110),
			y: f(90 + rand() * 60),
			dur: 26 + i * 7 + rand() * 6,
			delay: -(rand() * 30)
		}));

		for (const z of zs) for (const u of z.units) reg(u, 0, 0);
		zones = zs;
	}

	function refreshRustleEls() {
		rustleEls = new Map();
		if (!root) return;
		for (const el of root.querySelectorAll('[data-ci]')) {
			rustleEls.set(+(el as HTMLElement).dataset.ci!, el);
		}
	}

	const isOn = (key: string) => instant || (key === 'crown' ? arrive : !!grown[key]);
	const zoneOn = (z: Zone) => isOn(z.gate ?? z.key);

	onMount(() => {
		instant = prefersReducedMotion();
		let raf = 0;
		const update = () => {
			raf = 0;
			if (!root) return;
			const r = root.getBoundingClientRect();
			if (r.height < 1) return;
			const span = Math.max(1, groundYS - trunkTopYS);
			const tipY = window.innerHeight * tip - r.top;
			progress = instant ? 1 : Math.min(1, Math.max(0, (tipY - trunkTopYS) / span));
			underProgress = instant
				? 1
				: Math.min(1, Math.max(0, (tipY - groundYS) / Math.max(1, H - groundYS)));
			// keep the squirrel in view (it never crosses the ground)
			if (!instant && trunkParams && sqY) {
				const viewTop = window.scrollY - layerPageTop;
				const lo = Math.max(trunkParams.topY + 90, viewTop + 90);
				const hi = Math.min(trunkParams.groundY - 70, viewTop + window.innerHeight - 150);
				if (lo < hi) {
					if (sqY < lo) {
						sqY = lo;
						sqDir = 'down';
						sqRun = true;
						clearTimeout(sqRunT);
						sqRunT = setTimeout(() => (sqRun = false), 720);
					} else if (sqY > hi) {
						sqY = hi;
						sqDir = 'up';
						sqRun = true;
						clearTimeout(sqRunT);
						sqRunT = setTimeout(() => (sqRun = false), 720);
					}
				}
			}
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
				void tick().then(refreshRustleEls);
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

		// cursor rustle — desktop pointers only
		let moveRaf = 0;
		let mx = 0;
		let my = 0;
		const onMove = (e: PointerEvent) => {
			mx = e.clientX;
			my = e.clientY;
			if (!moveRaf) moveRaf = requestAnimationFrame(applyRustle);
		};
		const applyRustle = () => {
			moveRaf = 0;
			const px = mx - layerLeft;
			const py = my + window.scrollY - layerPageTop;
			const now = performance.now();
			// the squirrel bolts along the trunk, away from the cursor
			if (trunkParams && sqY) {
				const dx2 = px - sqX;
				const dy2 = py - sqY;
				if (dx2 * dx2 + dy2 * dy2 < 230 * 230 && (sqCool ?? 0) < now) {
					sqCool = now + 500;
					let dir = py > sqY ? -1 : 1;
					const viewTop = window.scrollY - layerPageTop;
					const lo = Math.max(trunkParams.topY + 90, viewTop + 90);
					const hi = Math.min(trunkParams.groundY - 70, viewTop + window.innerHeight - 150);
					let target = sqY + dir * 230;
					if (target < lo || target > hi) {
						dir = -dir;
						target = sqY + dir * 230;
					}
					sqY = Math.min(hi, Math.max(lo, target));
					sqDir = dir < 0 ? 'up' : 'down';
					sqRun = true;
					clearTimeout(sqRunT);
					sqRunT = setTimeout(() => (sqRun = false), 720);
				}
			}
			for (const t of rustlePts) {
				const d2 = (t.x - px) * (t.x - px) + (t.y - py) * (t.y - py);
				if (d2 < 120 * 120 && (rustleCool.get(t.ci) ?? 0) < now) {
					rustleCool.set(t.ci, now + 1500);
					const el = rustleEls.get(t.ci);
					if (el) {
						el.classList.add('rustle');
						setTimeout(() => el.classList.remove('rustle'), 750);
					}
				}
			}
		};
		const finePointer = window.matchMedia('(pointer: fine)').matches;
		if (!instant && !overlay && finePointer)
			window.addEventListener('pointermove', onMove, { passive: true });

		return () => {
			ro.disconnect();
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			window.removeEventListener('pointermove', onMove);
			if (raf) cancelAnimationFrame(raf);
			if (buildRaf) cancelAnimationFrame(buildRaf);
			if (moveRaf) cancelAnimationFrame(moveRaf);
		};
	});
</script>

{#snippet unitG(u: Unit)}
	<g transform="translate({u.x} {u.y})">
		<g class="grow" style="--gd:{u.delay}ms">
			{#if u.branch}
				<path d={u.branch} class="wood" />
			{/if}
			{#if u.stroke}
				<g transform={u.off ? `translate(${u.off.x} ${u.off.y})` : undefined}>
					<path d={u.stroke.d} class="woodline" stroke-width={u.stroke.w} />
				</g>
			{/if}
			{#if u.clump}
				<g class="clump" data-ci={u.ci}>
					<g
						class="sway"
						class:still={!u.clump.sway}
						style="--sd:{u.clump.sway || 9}s; --sdel:{-((u.ci ?? 0) % 7) * 1.4}s"
					>
						<path d={u.clump.back} class="fol folB" />
						<path
							d={u.clump.front}
							class="fol folF"
							transform="translate({u.clump.frontOff.x} {u.clump.frontOff.y})"
						/>
						<path
							d={u.clump.hi}
							class="fol folH"
							transform="translate({u.clump.hiOff.x} {u.clump.hiOff.y})"
						/>
						{#each u.clump.leaves as l, i (i)}
							<g transform="translate({l.x} {l.y}) rotate({l.a}) scale({l.s})">
								<path d={LEAF_D} class="leafp" class:dark={l.dark} />
							</g>
						{/each}
					</g>
				</g>
			{/if}
			{#each u.children as c, i (i)}
				{@render unitG(c)}
			{/each}
		</g>
	</g>
{/snippet}

{#snippet birdShape()}
	<path class="bird-body" d="M0 0 C -7 -1 -10 -6 -7 -10 C -4 -13 2 -13 4 -9 C 6 -6 5 -2 1 0 Z" />
	<path class="bird-tail" d="M -6 -6 L -14 -3.4 L -13 -6.6 L -6 -8.4 Z" />
	<circle class="bird-body" cx="4.2" cy="-11" r="3.1" />
	<path class="bird-beak" d="M 7 -11.4 l 3.4 1 l -3.4 1.5 z" />
	<circle class="bird-eye" cx="4.9" cy="-11.5" r="0.7" />
	<path class="bird-leg" d="M -1 0 L -1 2.6 M 2 0 L 2 2.6" />
{/snippet}

{#snippet squirrelShape()}
	<g class="sq-tailg">
		<path class="sq-tail" d="M 6 3 C 15 1 20 -7 18 -16 C 16 -24 8 -28 3 -24 C -1 -20 1 -14 6 -14" />
		<path class="sq-tail2" d="M 7 0 C 13 -1 16 -7 15 -13" />
	</g>
	<circle class="sq-hip" cx="0.5" cy="-5.5" r="6" />
	<path
		class="sq-body"
		d="M 5 -3 C 6.5 -10 4.5 -18 0 -22 C -3.5 -25 -8 -23.5 -8.5 -19.5 C -9 -15 -7 -9 -4.5 -4 C -3 -1 3 0 5 -3 Z"
	/>
	<path class="sq-belly" d="M -5.5 -4.5 C -7.5 -9 -7.5 -15 -5 -19 C -3 -15 -3 -9 -3.5 -4.5 Z" />
	<circle class="sq-body" cx="-4.2" cy="-24.5" r="4.6" />
	<path
		class="sq-body"
		d="M -8.4 -23.2 C -9.6 -23.6 -9.8 -24.8 -8.8 -25.4 C -8 -25.8 -7.2 -25.2 -7.4 -24.2 Z"
	/>
	<path class="sq-ear" d="M -3.4 -28.6 l 1.4 -4 l 2.8 3.2 z" />
	<path class="sq-earIn" d="M -2.6 -28.8 l 0.8 -2.2 l 1.6 1.8 z" />
	<circle class="sq-eye" cx="-6" cy="-25.2" r="1.15" />
	<circle class="sq-glint" cx="-6.4" cy="-25.6" r="0.42" />
	<circle class="sq-nosetip" cx="-9.3" cy="-24.7" r="0.7" />
	<path class="sq-paw" d="M -8.6 -16 q -3.6 0.4 -4.6 3 M -7.6 -10.5 q -3.8 0.6 -4.8 3.2" />
	<path class="sq-foot" d="M -2 -0.4 q -4.4 1.2 -7 0.4" />
{/snippet}

{#snippet deerShape()}
	<path class="deer-tail" d="M -30 -33 q -4 1 -5 4.5 q 3 1 5 -0.5 Z" />
	<path
		class="deer-body"
		d="M -28 -25 C -31 -33 -25 -39 -13 -40 C -1 -41 9 -39 15 -35 C 21 -32 23 -27 21 -23 C 19 -19 13 -17.5 5 -17.5 L -17 -17.5 C -24 -17.5 -27 -20 -28 -25 Z"
	/>
	<g class="deer-legsA">
		<path class="deer-leg" d="M 13 -19 C 14.5 -13 13.5 -6.5 14.5 -1" />
		<path class="deer-leg" d="M -19 -18 C -21 -12 -20.5 -6 -21.5 -1" />
	</g>
	<g class="deer-legsB">
		<path class="deer-leg" d="M 17 -19 C 19 -13 18.5 -6.5 19.5 -1" />
		<path class="deer-leg" d="M -23 -18 C -25.5 -12 -25 -6 -26 -1" />
	</g>
	<path
		class="deer-hoof"
		d="M 13.4 -1 l 2.6 0 M -22.7 -1 l 2.6 0 M 18.4 -1 l 2.6 0 M -27.2 -1 l 2.6 0"
	/>
	<path class="deer-neck" d="M 14 -35 C 18 -43 22 -50 27 -54 L 32 -49 C 28 -44 26 -39 25 -34 Z" />
	<circle class="deer-body" cx="30.5" cy="-54" r="4.6" />
	<path
		class="deer-muzzle"
		d="M 34 -55.5 C 37.5 -55.5 39.5 -54 39.5 -52.6 C 39.5 -51.4 37.5 -50.8 34.5 -51.2 Z"
	/>
	<path
		class="deer-ear"
		d="M 27.5 -58 C 25.5 -62.5 26.5 -65 29 -65.5 C 30.5 -63 30.5 -60 29.5 -57.5 Z"
	/>
	<path
		class="deer-ear"
		d="M 32.5 -58.5 C 33.5 -63 36 -64.5 38 -63.5 C 37.5 -60.5 35.5 -58 33.5 -57 Z"
	/>
	<circle class="deer-eye" cx="32.4" cy="-55.4" r="1" />
	<circle class="deer-nose" cx="39" cy="-52.9" r="0.9" />
	<path class="deer-belly" d="M -14 -17.5 C -8 -15.5 0 -15.5 5 -17.5 Z" />
{/snippet}

{#snippet antShape()}
	<ellipse class="ant-b" cx="-3" cy="0" rx="2.3" ry="1.5" />
	<circle class="ant-b" cx="0.4" cy="0" r="1.15" />
	<circle class="ant-b" cx="2.6" cy="0" r="1.35" />
	<path
		class="ant-l"
		d="M -0.5 -1 l -1.4 -1.8 M 0.6 -1 l 0.4 -2 M 1.4 -0.8 l 1.6 -1.6 M -0.5 1 l -1.4 1.8 M 0.6 1 l 0.4 2 M 1.4 0.8 l 1.6 1.6"
	/>
	<path class="ant-l" d="M 3.4 -0.8 q 1.2 -0.8 1.6 -1.6 M 3.4 0.8 q 1.2 0.8 1.6 1.6" />
{/snippet}

{#snippet wormShape()}
	<path class="worm" d="M0 0 q 7 -7 14 0 q 7 7 14 0" />
	<circle class="worm-head" cx="28" cy="0" r="3" />
	<circle class="worm-eye" cx="29" cy="-1" r="0.7" />
{/snippet}

{#snippet mushroomShape()}
	<path class="mu-stem" d="M -2.2 0 L -1.7 -7.5 Q 0 -9.5 1.7 -7.5 L 2.2 0 Z" />
	<path class="mu-cap" d="M -8 -7 Q 0 -16 8 -7 Q 0 -3.6 -8 -7 Z" />
	<circle class="mu-spot" cx="-3" cy="-9.4" r="1.1" />
	<circle class="mu-spot" cx="2.4" cy="-10.6" r="0.9" />
{/snippet}

{#snippet grassShape()}
	<path class="gr-b1" d="M -8 0 Q -9.5 -11 -14 -17" />
	<path class="gr-b2" d="M -3 0 Q -3 -14 -6 -22" />
	<path class="gr-b1" d="M 2 0 Q 3.5 -12 8 -19" />
	<path class="gr-b2" d="M 7 0 Q 8.5 -8 13 -12" />
{/snippet}

{#snippet daisyShape()}
	<path class="gr-b2" d="M -6 0 Q -7 -9 -10 -14" />
	<path class="gr-stem" d="M 0 0 Q 1 -10 0.5 -18" />
	<g transform="translate(0.5 -20)">
		{#each [0, 45, 90, 135, 180, 225, 270, 315] as pa (pa)}
			<ellipse class="gr-petal" cx="0" cy="-4.6" rx="1.9" ry="4.6" transform="rotate({pa})" />
		{/each}
		<circle class="gr-disc" r="2.4" />
	</g>
	<path class="gr-b1" d="M 5 0 Q 6 -7 9 -11" />
{/snippet}

{#snippet bellShape()}
	<path class="gr-b1" d="M -5 0 Q -6 -8 -9 -12" />
	<path class="gr-stem" d="M 0 0 Q -1 -9 0 -15 Q 1.5 -17 3.5 -17.5" />
	<g transform="translate(4 -16.5) rotate(14)">
		<path
			class="gr-bell"
			d="M 0 0 C -3 0.5 -3.8 3.4 -2.8 6 L -1.4 5.2 L 0 6.2 L 1.4 5.2 L 2.8 6 C 3.8 3.4 3 0.5 0 0 Z"
		/>
	</g>
	<path class="gr-b2" d="M 4 0 Q 5 -6 8 -9" />
{/snippet}

{#snippet seedShape()}
	<path class="gr-stem" d="M 0 0 Q 0.5 -8 0 -15" />
	<g transform="translate(0 -17)">
		{#each [0, 45, 90, 135, 180, 225, 270, 315] as pa (pa)}
			<line
				class="gr-spoke"
				x1="0"
				y1="0"
				x2={7 * Math.cos((pa * Math.PI) / 180)}
				y2={7 * Math.sin((pa * Math.PI) / 180)}
			/>
			<circle
				class="gr-puff"
				cx={7 * Math.cos((pa * Math.PI) / 180)}
				cy={7 * Math.sin((pa * Math.PI) / 180)}
				r="1.5"
			/>
		{/each}
		<circle class="gr-core" r="1.6" />
	</g>
	<path class="gr-b1" d="M -5 0 Q -6 -7 -9 -10" />
{/snippet}

{#snippet logShape()}
	<path
		class="log-body"
		d="M -34 0 C -36 -4 -36 -10 -33 -13 L 26 -16 C 30 -12 30 -4 27 -1 L -34 0 Z"
	/>
	<ellipse class="log-end" cx="27" cy="-8.5" rx="4.6" ry="7.6" />
	<ellipse class="log-ring" cx="27" cy="-8.5" rx="2.6" ry="4.4" />
	<ellipse class="log-core" cx="27" cy="-8.5" rx="1" ry="1.7" />
	<path class="log-crack" d="M -26 -3 q 8 -1.5 14 -0.5 M -12 -11 q 9 -1 15 0.5" />
	<path class="log-stub" d="M -6 -13 L -2 -20 L 2 -19 L 0 -12.5 Z" />
	<path class="gr-b2" d="M 30 -2 Q 32 -8 36 -11" />
	<path class="gr-b1" d="M -38 0 Q -40 -7 -44 -10" />
{/snippet}

{#snippet flyerShape()}
	<path class="flyer-w" d="M0 0 Q 6 -5 12 0 M12 0 Q 18 -5 24 0" />
	<path class="flyer-w" d="M34 14 Q 39 10 44 14 M44 14 Q 49 10 54 14" />
{/snippet}

{#snippet bflyWing()}
	<path class="bf-fore" d="M -1.5 -2 C -10 -13 -22 -14.5 -24.5 -6.5 C -26 -1 -16 2 -1.5 0.6 Z" />
	<path class="bf-hind" d="M -1.5 1.6 C -12 1 -18.5 6 -16 11.2 C -13.5 15.5 -5 12.8 -1.5 5.6 Z" />
	<circle class="bf-spot" cx="-15" cy="-6.4" r="2.3" />
	<circle class="bf-spot2" cx="-10" cy="6.8" r="1.4" />
	<path
		class="bf-vein"
		d="M -3.5 -2.4 C -10 -7 -16 -9 -21 -8 M -3.5 -0.6 C -10 -1.4 -15 0 -18.5 2"
	/>
{/snippet}

{#snippet bflyShape()}
	<g class="bf-wingL">{@render bflyWing()}</g>
	<g transform="scale(-1 1)"><g class="bf-wingR">{@render bflyWing()}</g></g>
	<ellipse class="bf-body" rx="1.4" ry="5.8" />
	<circle class="bf-body" cy="-6.6" r="1.8" />
	<path class="bf-ant" d="M -0.8 -7.8 Q -3.2 -11.5 -5.6 -12.4 M 0.8 -7.8 Q 3.2 -11.5 5.6 -12.4" />
	<circle class="bf-antTip" cx="-5.8" cy="-12.5" r="0.7" />
	<circle class="bf-antTip" cx="5.8" cy="-12.5" r="0.7" />
{/snippet}

{#snippet ladybugShape()}
	<ellipse class="lbg-body" rx="4.4" ry="3.4" />
	<circle class="lbg-head" cx="4" cy="0" r="1.8" />
	<path class="lbg-line" d="M -3.8 0 L 3 0" />
	<circle class="lbg-spot" cx="-2" cy="-1.4" r="0.8" />
	<circle class="lbg-spot" cx="-1.2" cy="1.5" r="0.7" />
	<circle class="lbg-spot" cx="1.4" cy="-1.5" r="0.7" />
	<path class="lbg-feeler" d="M 5.2 -1.2 Q 6.6 -2.4 7 -3.6 M 5.4 1 Q 7 1.4 7.8 0.6" />
{/snippet}

<div
	class="tree-layer"
	class:is-over={overlay}
	class:instant
	bind:this={root}
	data-progress={progress.toFixed(3)}
	aria-hidden="true"
>
	{#if W > 0 && (overlay ? zones.length > 0 : !!trunkD)}
		{#if overlay}
			<!-- THE GRIP LAYER: wood + tufts stacked ABOVE the content -->
			<svg viewBox="0 0 {W} {Math.max(H, 1)}">
				{#each zones as z (z.key)}
					<g class="zone" class:on={zoneOn(z)}>
						{#each z.units as u, i (i)}{@render unitG(u)}{/each}
					</g>
				{/each}
				{#if butterfly}
					<g transform="translate({butterfly.x} {butterfly.y})">
						<g class="bfly-x"><g class="bfly-y"><g class="bflyg">{@render bflyShape()}</g></g></g>
					</g>
				{/if}
				{#if ladybug}
					<g transform="translate({ladybug.x} {ladybug.y}) rotate({ladybug.a})">
						{@render ladybugShape()}
					</g>
				{/if}
			</svg>
		{:else}
			<svg viewBox="0 0 {W} {Math.max(H, 1)}">
				<defs>
					<clipPath id="{uid}-clip">
						<rect class="trunk-clip-rect" x="0" y="0" width={W} height={clipHeight} />
					</clipPath>
					<clipPath id="{uid}-uclip">
						<rect x="0" y={groundYS - 4} width={W} height={underClipH} />
					</clipPath>
					<linearGradient
						id="{uid}-wood"
						gradientUnits="userSpaceOnUse"
						x1={woodX0}
						y1="0"
						x2={woodX1}
						y2="0"
					>
						<stop offset="0" stop-color="#8f8663" />
						<stop offset="0.28" stop-color="#6e6949" />
						<stop offset="0.55" stop-color="#4f4d33" />
						<stop offset="1" stop-color="#33321f" />
					</linearGradient>
					<linearGradient id="{uid}-atmo" x1="0" y1="0" x2="0" y2="1">
						{#each atmoStops as s, i (i)}
							<stop offset={s.o} stop-color={s.c} />
						{/each}
					</linearGradient>
				</defs>

				<!-- the atmosphere journey: sky → forest → soil → rock -->
				<rect width={W} height={Math.max(H, 1)} fill="url(#{uid}-atmo)" />
				<!-- distant forest: three soft misty rows on the horizon -->
				{#each forestRows as row (row.cls)}
					<g class={row.cls}>
						{#each row.trees as ft, i (i)}
							<g transform="translate({ft.x} {ft.y})">
								{#if ft.trunk}
									<rect x="-2.8" y="8" width="5.6" height="34" rx="2.6" class="ftrunk" />
								{/if}
								<path d={ft.dh} class="fhalo" />
								<path d={ft.d} class="fcrown" />
							</g>
						{/each}
					</g>
				{/each}

				<!-- the doe, ambling the verge behind the trunk -->
				{#if deer}
					<g class="zone" class:on={isOn('ground')}>
						<g transform="translate(0 {deer.y})">
							<g
								class="deer-walk"
								style="--ww:{deer.ww}px; transform: translateX({instant ? deer.startX : 0}px)"
							>
								<g class="deer-bob"><g transform="scale(1.35)">{@render deerShape()}</g></g>
							</g>
						</g>
					</g>
				{/if}

				{#each strata as sd, i (i)}
					<path d={sd} class="stratum" fill="none" />
				{/each}
				{#each rocks as r, i (i)}
					<g transform="translate({r.x} {r.y})">
						<path d={r.d} fill={r.fill} opacity="0.85" />
						<path d={r.d2} fill="#b3a892" opacity="0.45" transform="translate(-4 -5)" />
					</g>
				{/each}

				<!-- the ant colony: chambers and tunnels cut into the soil -->
				{#if colony}
					<g class="zone" class:on={isOn('roots')}>
						<path d={colony.entrance} class="ant-mound" />
						{#each colony.tunnels as t, i (i)}
							<path d={t.d} class="ant-tunnel" fill="none" />
							<path d={t.d} class="ant-tunnel2" fill="none" />
						{/each}
						{#each colony.chambers as c2, i (i)}
							<g transform="translate({c2.x} {c2.y})">
								<path d={c2.d} class="ant-chamber" />
							</g>
						{/each}
						{#each colony.larvae as lv2, i (i)}
							<ellipse
								cx={lv2.x}
								cy={lv2.y}
								rx="4.2"
								ry="2.6"
								transform="rotate({lv2.a} {lv2.x} {lv2.y})"
								class="ant-larva"
							/>
						{/each}
						{#each colony.seeds as sd2, i (i)}
							<ellipse
								cx={sd2.x}
								cy={sd2.y}
								rx="4.6"
								ry="2.4"
								transform="rotate({sd2.a} {sd2.x} {sd2.y})"
								class="ant-seed"
							/>
						{/each}
						{#each colony.staticAnts as an, i (i)}
							<g transform="translate({an.x} {an.y}) rotate({an.a}) scale({an.s})">
								{@render antShape()}
							</g>
						{/each}
						{#each colony.tunnels as t, ti (ti)}
							{#each t.ants as an, ai (ai)}
								<g
									class="ant-move"
									style="offset-path: path('{t.d}'); --ad:{an.dur}s; --adel:{an.delay}s; animation-direction:{an.rev
										? 'reverse'
										: 'normal'}"
								>
									{@render antShape()}
								</g>
							{/each}
						{/each}
					</g>
				{/if}

				<!-- deep root runs weaving around the underground blocks, revealed
			     downward by your own descent -->
				<g clip-path="url(#{uid}-uclip)">
					{#each deepRuns as run, i (i)}
						<path d={run.d} class="rootrun" />
					{/each}
				</g>

				<!-- underground next: roots + the root to the seeds -->
				{#each zones.filter((z) => z.key === 'ground' || z.key === 'contact') as z (z.key)}
					<g class="zone zone--under" class:on={zoneOn(z)}>
						{#each z.units as u, i (i)}{@render unitG(u)}{/each}
					</g>
				{/each}

				<!-- trunk + its section limbs, revealed by the scroll clip -->
				<g clip-path="url(#{uid}-clip)">
					<path d={trunkD} fill="url(#{uid}-wood)" />
					<path d={rimLD} class="rimL" fill="none" />
					<path d={rimRD} class="rimR" fill="none" />
					<path d={sheenD} class="sheen" fill="none" />
					{#each fissures as fi, i (i)}
						<path d={fi.d} class={fi.light ? 'fisL' : 'fisD'} stroke-width={fi.w} fill="none" />
					{/each}
					{#each bark as b, i (i)}
						<path d={b} class="bark" fill="none" />
					{/each}
					{#each knots as k, i (i)}
						<g transform="translate({k.x} {k.y})">
							<ellipse rx={k.r} ry={k.r * 1.7} class="knotO" />
							<ellipse rx={k.r * 0.45} ry={k.r * 0.8} class="knotI" />
						</g>
					{/each}
					{#each moss as m, i (i)}
						<g transform="translate({m.x} {m.y})">
							<path d={m.d} class="mossB" />
							<path d={m.d2} class="mossF" transform="translate(-2 -3)" />
						</g>
					{/each}
					{#if trunkParams && sqY}
						<g
							class="sq-holder"
							class:running={sqRun}
							style="transform: translate({sqX}px, {sqY}px)"
						>
							<g class="sq-pose" class:headdown={sqRun && sqDir === 'down'}>
								<g transform="scale(1.18)">{@render squirrelShape()}</g>
							</g>
						</g>
					{/if}
					{#each zones.filter((z) => z.clipped) as z (z.key)}
						<g class="zone" class:on={zoneOn(z)}>
							{#each z.units as u, i (i)}{@render unitG(u)}{/each}
						</g>
					{/each}
				</g>

				<!-- the grassy verge where trunk turns to root -->
				<g class="zone" class:on={isOn('ground')}>
					<path d={grassBandBack} class="grassBack" />
					<path d={grassBandFront} class="grassFront" />
					{#if logPiece}
						<g transform="translate({logPiece.x} {groundYS - 4}) rotate({logPiece.rot})">
							<g class="grow" style="--gd:260ms">{@render logShape()}</g>
						</g>
					{/if}
					{#each grassTufts as t, i (i)}
						<g transform="translate({t.x} {groundYS - 1}) scale({t.flip ? -t.s : t.s} {t.s})">
							<g class="grow" style="--gd:{t.delay}ms">
								<g class="sway" style="--sd:{t.sd}s; --sdel:{t.sdel}s">
									{#if t.kind === 'daisy'}{@render daisyShape()}
									{:else if t.kind === 'bell'}{@render bellShape()}
									{:else if t.kind === 'seed'}{@render seedShape()}
									{:else}{@render grassShape()}{/if}
								</g>
							</g>
						</g>
					{/each}
					{#each fallenLeaves as fl2, i (i)}
						<g transform="translate({fl2.x} {fl2.y}) rotate({fl2.a}) scale({fl2.s})">
							<path d={LEAF_D} class="leafp dark" opacity="0.8" />
						</g>
					{/each}
				</g>

				<!-- the crown, over the trunk's top -->
				{#each zones.filter((z) => z.key === 'crown') as z (z.key)}
					<g class="zone" class:on={zoneOn(z)}>
						{#each z.units as u, i (i)}{@render unitG(u)}{/each}
						{#each perches as b, i (i)}
							<g transform="translate({b.x} {b.y}) scale({b.flip ? -1 : 1} 1)">
								<g class="grow" style="--gd:1150ms">
									<g class="birdg" style="--bd:{b.delay}s">{@render birdShape()}</g>
								</g>
							</g>
						{/each}
						{#each falls as fl, i (i)}
							<g class="fall" style="--fd:{fl.dur}s; --fdel:{fl.delay}s">
								<g transform="translate({fl.x} {fl.y}) scale(1.15)">
									<path d={LEAF_D} class="leafp" />
								</g>
							</g>
						{/each}
					</g>
				{/each}

				<!-- light motes drifting under the canopy -->
				{#each airmotes as mt, i (i)}
					<circle
						class="airmote"
						cx={mt.x}
						cy={mt.y}
						r={mt.r}
						style="--md:{mt.dur}s; --mdel:{mt.delay}s"
					/>
				{/each}

				<!-- distant birds riding the breeze -->
				{#each flyers as fl, i (i)}
					<g transform="translate({fl.x} {fl.y})">
						<g class="flyerg" style="--fd2:{fl.dur}s; --fdel2:{fl.delay}s">{@render flyerShape()}</g
						>
					</g>
				{/each}

				<!-- mushrooms at the buttress; a worm turning the mycelium's soil -->
				<g class="zone" class:on={isOn('ground')}>
					{#each mushrooms as mu, i (i)}
						<g transform="translate({mu.x} {mu.y}) scale({mu.flip ? -mu.s : mu.s} {mu.s})">
							<g class="grow" style="--gd:{700 + i * 160}ms">{@render mushroomShape()}</g>
						</g>
					{/each}
				</g>
				{#each worms as w2, i (i)}
					<g class="zone" class:on={isOn(w2.gate)}>
						<g transform="translate({w2.x} {w2.y}) scale({w2.s})">
							<g class="grow" style="--gd:600ms">
								<g class="wormg" style="--wdel:{w2.delay}s">
									<g class="wormwig">{@render wormShape()}</g>
								</g>
							</g>
						</g>
					</g>
				{/each}
			</svg>
		{/if}
	{/if}
</div>

<style>
	.tree-layer {
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

	/* ---- wood + foliage palette. Boughs and roots are bark-brown olive so
	   the tree reads as WOOD; only foliage stays leaf-green. ---- */
	.wood {
		fill: #4e4c33;
	}
	.zone--under .wood {
		fill: #453f2b;
	}
	.rimL {
		stroke: #bfb289;
		stroke-width: 2;
		stroke-linecap: round;
		opacity: 0.4;
	}
	.rimR {
		stroke: #1d2012;
		stroke-width: 2.6;
		stroke-linecap: round;
		opacity: 0.5;
	}
	.sheen {
		stroke: #b3a678;
		stroke-width: 3;
		stroke-linecap: round;
		opacity: 0.3;
	}
	.fisD {
		stroke: #262418;
		stroke-linecap: round;
		opacity: 0.42;
	}
	.fisL {
		stroke: #a89c72;
		stroke-linecap: round;
		opacity: 0.24;
	}
	.bark {
		stroke: #241f14;
		stroke-width: 1.5;
		stroke-linecap: round;
		opacity: 0.4;
	}
	.knotO {
		fill: #2c2a1a;
		opacity: 0.55;
	}
	.knotI {
		fill: #171509;
		opacity: 0.6;
	}
	.mossB {
		fill: #4d6c43;
		opacity: 0.92;
	}
	.mossF {
		fill: #6f9557;
		opacity: 0.9;
	}
	.rootrun {
		fill: #443e2b;
		opacity: 0.96;
	}
	/* ---- creatures ---- */
	.bird-body {
		fill: #3a4030;
	}
	.bird-tail {
		fill: #2e3325;
	}
	.bird-beak {
		fill: #c9a24a;
	}
	.bird-eye {
		fill: #e8ecd8;
	}
	.bird-leg {
		stroke: #6b5b35;
		stroke-width: 1;
	}
	.sq-tail {
		fill: none;
		stroke: #8a6142;
		stroke-width: 8.5;
		stroke-linecap: round;
	}
	.sq-tail2 {
		fill: none;
		stroke: #b08a5e;
		stroke-width: 3.2;
		stroke-linecap: round;
		opacity: 0.85;
	}
	.sq-body {
		fill: #96714d;
	}
	.sq-belly {
		fill: #cfae82;
	}
	.sq-ear {
		fill: #8a6142;
	}
	.sq-earIn {
		fill: #c79b6f;
	}
	.sq-eye {
		fill: #241d12;
	}
	.sq-glint {
		fill: #f4ead8;
	}
	.sq-nose {
		fill: none;
		stroke: #4f3a24;
		stroke-width: 1;
		stroke-linecap: round;
	}
	.sq-paw,
	.sq-foot {
		fill: none;
		stroke: #6f5236;
		stroke-width: 1.4;
		stroke-linecap: round;
	}
	.sq-pose {
		transform-origin: -1px -12px;
	}
	/* soft misty forest rows — halo under crown gives a fuzzy edge, colors
	   sit barely off the sky so they read as distance, not graphics */
	.frow3 .fcrown {
		fill: #dbe5d8;
		opacity: 0.55;
	}
	.frow3 .fhalo {
		fill: #e4ece2;
		opacity: 0.35;
	}
	.frow2 .fcrown {
		fill: #ccdac8;
		opacity: 0.6;
	}
	.frow2 .fhalo {
		fill: #d9e4d6;
		opacity: 0.38;
	}
	.frow2 .ftrunk {
		fill: #b4c3ae;
		opacity: 0.5;
	}
	.frow1 .fcrown {
		fill: #bccfb6;
		opacity: 0.62;
	}
	.frow1 .fhalo {
		fill: #cfdeca;
		opacity: 0.4;
	}
	.frow1 .ftrunk {
		fill: #a3b59b;
		opacity: 0.55;
	}
	/* the dense grass silhouettes on the verge */
	.grassBack {
		fill: #43704d;
		opacity: 0.9;
	}
	.grassFront {
		fill: #6aaa6d;
		opacity: 0.92;
	}
	/* the doe */
	.deer-body,
	.deer-neck {
		fill: #b3906a;
	}
	.deer-chest {
		fill: #d8c3a0;
	}
	.deer-belly {
		fill: #d8c3a0;
	}
	.deer-tail {
		fill: #a5825c;
	}
	.deer-leg {
		fill: none;
		stroke: #a07f58;
		stroke-width: 2.8;
		stroke-linecap: round;
	}
	.deer-hoof {
		stroke: #4a3b28;
		stroke-width: 2.6;
		stroke-linecap: round;
	}
	.deer-muzzle {
		fill: #c4a67e;
	}
	.deer-ear {
		fill: #b3906a;
		stroke: #8d6f4c;
		stroke-width: 0.6;
	}
	.deer-eye,
	.deer-nose {
		fill: #2a211a;
	}
	/* the ant colony */
	.ant-mound {
		fill: #9a8563;
		stroke: #6d5a41;
		stroke-width: 1;
	}
	.ant-tunnel {
		stroke: #866f52;
		stroke-width: 8;
		stroke-linecap: round;
	}
	.ant-tunnel2 {
		stroke: #755f44;
		stroke-width: 3.4;
		stroke-linecap: round;
		opacity: 0.7;
	}
	.ant-chamber {
		fill: #866f52;
		stroke: #5f4d38;
		stroke-width: 1.2;
	}
	.ant-larva {
		fill: #ece0c6;
		stroke: #c9b997;
		stroke-width: 0.7;
	}
	.ant-seed {
		fill: #d9c9a1;
		stroke: #a99366;
		stroke-width: 0.6;
	}
	.ant-b {
		fill: #35291d;
	}
	.ant-l {
		fill: none;
		stroke: #35291d;
		stroke-width: 0.55;
		stroke-linecap: round;
	}
	.gr-b1 {
		fill: none;
		stroke: #6bbf7b;
		stroke-width: 2;
		stroke-linecap: round;
		opacity: 0.9;
	}
	.gr-b2 {
		fill: none;
		stroke: #3f6d4e;
		stroke-width: 2.1;
		stroke-linecap: round;
	}
	.gr-stem {
		fill: none;
		stroke: #3f6d4e;
		stroke-width: 1.7;
		stroke-linecap: round;
	}
	.gr-petal {
		fill: #fbfdf4;
		stroke: #4f8a63;
		stroke-width: 0.5;
	}
	.gr-disc {
		fill: #d9a441;
	}
	.gr-bell {
		fill: #cfe2f2;
		stroke: #4f8a63;
		stroke-width: 0.7;
		stroke-linejoin: round;
	}
	.gr-spoke {
		stroke: #3f6d4e;
		stroke-width: 0.8;
		opacity: 0.75;
	}
	.gr-puff {
		fill: #f4f8ea;
		stroke: #4f8a63;
		stroke-width: 0.45;
	}
	.gr-core {
		fill: #3f6d4e;
	}
	.log-body {
		fill: #6d5b41;
		stroke: #4a3d2a;
		stroke-width: 1;
		stroke-linejoin: round;
	}
	.log-end {
		fill: #a68d64;
		stroke: #4a3d2a;
		stroke-width: 0.9;
	}
	.log-ring {
		fill: none;
		stroke: #7c6746;
		stroke-width: 1;
	}
	.log-core {
		fill: #4a3d2a;
	}
	.log-crack {
		fill: none;
		stroke: #443723;
		stroke-width: 1;
		stroke-linecap: round;
		opacity: 0.7;
	}
	.log-stub {
		fill: #5d4c35;
		stroke: #443723;
		stroke-width: 0.8;
	}
	.worm {
		fill: none;
		stroke: #c08e77;
		stroke-width: 4.5;
		stroke-linecap: round;
	}
	.worm-head {
		fill: #c08e77;
	}
	.worm-eye {
		fill: #3a2b22;
	}
	.mu-stem {
		fill: #e9ddc3;
		stroke: #b9a982;
		stroke-width: 0.6;
	}
	.mu-cap {
		fill: #b3552e;
		stroke: #7e3c20;
		stroke-width: 0.7;
	}
	.mu-spot {
		fill: #f2e6cf;
	}
	.flyer-w {
		fill: none;
		stroke: #4c5a45;
		stroke-width: 1.7;
		stroke-linecap: round;
		opacity: 0.55;
	}
	.bf-fore {
		fill: #f4e9c6;
		stroke: #a8732c;
		stroke-width: 0.8;
		stroke-linejoin: round;
	}
	.bf-hind {
		fill: #eaf2dc;
		stroke: #4f8a63;
		stroke-width: 0.7;
		stroke-linejoin: round;
	}
	.bf-spot {
		fill: #a8732c;
		opacity: 0.85;
	}
	.bf-spot2 {
		fill: #4f8a63;
		opacity: 0.7;
	}
	.bf-vein {
		fill: none;
		stroke: #a8732c;
		stroke-width: 0.55;
		opacity: 0.6;
	}
	.bf-body {
		fill: #3f4030;
	}
	.bf-ant {
		fill: none;
		stroke: #3f4030;
		stroke-width: 0.7;
		stroke-linecap: round;
	}
	.bf-antTip {
		fill: #3f4030;
	}
	.lbg-body {
		fill: #bf5a45;
	}
	.lbg-head,
	.lbg-spot {
		fill: #2c2417;
	}
	.lbg-line,
	.lbg-feeler {
		stroke: #2c2417;
		stroke-width: 0.6;
		fill: none;
	}
	.stratum {
		stroke: #6f6455;
		stroke-width: 1.5;
		opacity: 0.14;
	}
	.airmote {
		fill: #fff6d8;
		opacity: 0;
	}
	.woodline {
		fill: none;
		stroke: color-mix(in srgb, var(--garden-stem, #3f6d4e) 88%, #20301f);
		stroke-linecap: round;
	}
	.folB {
		fill: color-mix(in srgb, var(--garden-leaf, #6bbf7b) 50%, var(--garden-stem, #3f6d4e));
		opacity: 0.96;
	}
	.folF {
		fill: var(--garden-leaf, #6bbf7b);
		opacity: 0.94;
	}
	.folH {
		fill: color-mix(in srgb, var(--garden-leaf, #6bbf7b) 68%, #f4ffe8);
		opacity: 0.85;
	}
	.leafp {
		fill: color-mix(in srgb, var(--garden-leaf, #6bbf7b) 72%, #ffffff);
		opacity: 0.95;
	}
	.leafp.dark {
		fill: color-mix(in srgb, var(--garden-leaf, #6bbf7b) 55%, var(--garden-stem, #3f6d4e));
	}

	/* ---- growth: every unit scales out of its junction ---- */
	.grow {
		transform: scale(0.02);
		transform-origin: 0px 0px;
	}
	.zone.on .grow {
		transform: scale(1);
		transition: transform var(--gt, 900ms) cubic-bezier(0.32, 1.18, 0.45, 1) var(--gd, 0ms);
	}
	.instant .grow {
		transition: none;
		transform: scale(1);
	}

	/* ---- ambient life (stilled under reduced motion) ---- */
	@media (prefers-reduced-motion: no-preference) {
		.sway {
			animation: tl-sway var(--sd, 9s) ease-in-out var(--sdel, 0s) infinite alternate;
			transform-origin: 0px 0px;
		}
		.sway.still {
			animation-name: none;
		}
		:global(.clump.rustle) .sway {
			animation: tl-rustle 720ms cubic-bezier(0.3, 0.9, 0.4, 1);
		}
		.fall {
			animation: tl-fall var(--fd, 30s) linear var(--fdel, 0s) infinite;
			opacity: 0;
		}
		.airmote {
			animation: tl-mote var(--md, 12s) ease-in-out var(--mdel, 0s) infinite;
		}
		.birdg {
			animation: tl-hop 11s ease-in-out var(--bd, 0s) infinite;
		}
		.sq-tailg {
			animation: tl-swish 7s ease-in-out infinite alternate;
			transform-origin: 0px 0px;
		}
		.flyerg {
			animation: tl-drift var(--fd2, 38s) ease-in-out var(--fdel2, 0s) infinite alternate;
		}
		.wormg {
			animation: tl-inch 8s ease-in-out infinite;
		}
		.bflyg {
			animation: tl-bob 6.5s ease-in-out infinite;
		}
		.bfly-x {
			animation: tl-wanderx 10.5s ease-in-out infinite alternate;
		}
		.bfly-y {
			animation: tl-wandery 6.8s ease-in-out infinite alternate;
		}
		.bf-wingL,
		.bf-wingR {
			animation: tl-flap 2.6s ease-in-out infinite;
			transform-origin: 0px 0px;
		}
		.sq-holder {
			transition: transform 660ms cubic-bezier(0.3, 0.85, 0.3, 1);
		}
		.deer-walk {
			animation: tl-deerwalk 150s linear infinite;
		}
		.deer-bob {
			animation: tl-deerbob 1.15s ease-in-out infinite;
		}
		.deer-legsA {
			animation: tl-deerleg 1.15s ease-in-out infinite alternate;
			transform-origin: 0px -18px;
		}
		.deer-legsB {
			animation: tl-deerleg 1.15s ease-in-out -0.575s infinite alternate-reverse;
			transform-origin: 0px -18px;
		}
		.ant-move {
			animation: tl-antgo var(--ad, 18s) linear var(--adel, 0s) infinite;
			offset-rotate: auto;
		}
		.wormwig {
			animation: tl-wormwig 2.1s ease-in-out infinite alternate;
			transform-origin: 14px 0px;
		}
		.sq-pose {
			transition: transform 220ms ease;
		}
		.sq-pose.headdown {
			transform: rotate(180deg);
		}
		.sq-holder.running .sq-tailg {
			animation-duration: 0.9s;
		}
	}
	@keyframes tl-wanderx {
		from {
			transform: translateX(-34px);
		}
		to {
			transform: translateX(30px);
		}
	}
	@keyframes tl-wandery {
		from {
			transform: translateY(-20px);
		}
		to {
			transform: translateY(16px);
		}
	}
	@keyframes tl-hop {
		0%,
		86%,
		100% {
			transform: translateY(0);
		}
		89% {
			transform: translateY(-3px);
		}
		92% {
			transform: translateY(0);
		}
		95% {
			transform: translateY(-2px);
		}
	}
	@keyframes tl-swish {
		from {
			transform: rotate(-4deg);
		}
		to {
			transform: rotate(7deg);
		}
	}
	@keyframes tl-drift {
		from {
			transform: translate(-44px, 0);
		}
		to {
			transform: translate(62px, -14px);
		}
	}
	@keyframes tl-inch {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(5px);
		}
	}
	@keyframes tl-deerwalk {
		from {
			transform: translateX(-170px);
		}
		to {
			transform: translateX(var(--ww, 1600px));
		}
	}
	@keyframes tl-deerbob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-1.6px);
		}
	}
	@keyframes tl-deerleg {
		from {
			transform: rotate(-7deg);
		}
		to {
			transform: rotate(7deg);
		}
	}
	@keyframes tl-antgo {
		from {
			offset-distance: 0%;
		}
		to {
			offset-distance: 100%;
		}
	}
	@keyframes tl-wormwig {
		from {
			transform: rotate(-4deg);
		}
		to {
			transform: rotate(4.5deg);
		}
	}
	@keyframes tl-bob {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		50% {
			transform: translate(4px, -7px) rotate(3deg);
		}
	}
	@keyframes tl-flap {
		0%,
		100% {
			transform: scaleX(1);
		}
		50% {
			transform: scaleX(0.55);
		}
	}
	@keyframes tl-mote {
		0% {
			transform: translateY(0);
			opacity: 0;
		}
		18% {
			opacity: 0.6;
		}
		62% {
			opacity: 0.28;
		}
		100% {
			transform: translateY(-54px);
			opacity: 0;
		}
	}
	@keyframes tl-sway {
		from {
			transform: rotate(-1.1deg);
		}
		to {
			transform: rotate(1.3deg);
		}
	}
	@keyframes tl-rustle {
		0% {
			transform: rotate(0deg) scale(1);
		}
		35% {
			transform: rotate(2.4deg) scale(1.025);
		}
		70% {
			transform: rotate(-1.4deg) scale(1.01);
		}
		100% {
			transform: rotate(0deg) scale(1);
		}
	}
	@keyframes tl-fall {
		0% {
			transform: translate(0, 0) rotate(0deg);
			opacity: 0;
		}
		6% {
			opacity: 0.85;
		}
		80% {
			opacity: 0.85;
		}
		100% {
			transform: translate(-130px, 62vh) rotate(-230deg);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fall {
			display: none;
		}
		.airmote {
			opacity: 0.35;
		}
	}
</style>
