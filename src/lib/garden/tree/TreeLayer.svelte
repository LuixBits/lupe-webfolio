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
	let squirrel = $state<{ x: number; y: number; flip: boolean } | null>(null);
	let worm = $state<{ x: number; y: number } | null>(null);
	let flyers = $state<{ x: number; y: number; dur: number; delay: number }[]>([]);
	let butterfly = $state<{ x: number; y: number } | null>(null);
	let ladybug = $state<{ x: number; y: number; a: number } | null>(null);

	const uid = $derived(`tl-${hashSeed(seed).toString(36)}`);
	const clipHeight = $derived(Math.max(0, trunkTopYS + (groundYS + 70 - trunkTopYS) * progress));
	const underClipH = $derived(Math.max(0, (H - groundYS + 60) * underProgress));

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
				{ a: 97, l: 310 },
				{ a: 116, l: 255 },
				{ a: 138, l: 205 },
				{ a: 158, l: 168 },
				{ a: 178, l: 155 },
				{ a: 199, l: 172 },
				{ a: 220, l: 215 },
				{ a: 243, l: 265 },
				{ a: 263, l: 320 }
			];
			const spread = 0.62 + Math.min(1, W / 1200) * 0.38;
			rootSpecs.forEach((sp, i) => {
				const g = taperedBranch(
					rand,
					sp.a + (rand() * 2 - 1) * 5,
					sp.l * (0.85 + rand() * 0.3) * spread * (0.55 + sizeK * 0.45),
					(14 + rand() * 7) * sizeK,
					1.1,
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
					rootlet(lx, b.cy, lx > xMain ? 116 : 244, 32 + rand() * 28, 3.2);
				}
				pts.push({ x: xMain + off * 0.3 + (rand() * 2 - 1) * 12, y: endY });
				runs.push({ d: taperedPath(pts, w0, 1.5) });
			};
			if (under.length) {
				mkRun(0, 11, under, H - 34);
				mkRun(-46, 7, under.slice(0, 2), (under[1] ?? under[0]).y1 + 60);
				mkRun(50, 6, under.slice(0, 1), under[0].y1 + 70);
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
			if (myc) {
				worm = {
					x: f(myc.cx < xMain ? myc.x1 + 90 : myc.x0 - 120),
					y: f(myc.cy + 40)
				};
			}
			const sqY = (a['notes']?.y1 ?? bendY1) + 90;
			const sqT = Math.min(1, Math.max(0, (sqY - trunkTopY) / (groundY - trunkTopY)));
			const sqSide = rand() > 0.5 ? 1 : -1;
			squirrel = {
				x: f(trunkXAt(sqY) + sqSide * (14 + 32 * sqT) * sizeK * 0.8),
				y: f(sqY),
				flip: sqSide < 0
			};
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
		<path class="sq-tail" d="M -3 -3 C -14 -4 -19 -14 -12 -21 C -6 -26 2 -22 1 -15" />
	</g>
	<path
		class="sq-body"
		d="M 0 0 C 8 1 12.5 -5 10 -12 C 8 -17 2 -18.5 -1.5 -14.5 C -4.5 -10.5 -3.5 -3.5 0 0 Z"
	/>
	<ellipse class="sq-belly" cx="3.2" cy="-7.6" rx="3.2" ry="4.6" />
	<circle class="sq-body" cx="8.6" cy="-15.6" r="4.1" />
	<path class="sq-ear" d="M 6.4 -18.8 l 1.2 -3.6 l 2.6 2.6 z" />
	<circle class="sq-eye" cx="9.8" cy="-16.4" r="0.9" />
	<path class="sq-paw" d="M 6.5 -8.5 q 3 0.5 4 2.5" />
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

{#snippet flyerShape()}
	<path class="flyer-w" d="M0 0 Q 6 -5 12 0 M12 0 Q 18 -5 24 0" />
	<path class="flyer-w" d="M34 14 Q 39 10 44 14 M44 14 Q 49 10 54 14" />
{/snippet}

{#snippet bflyShape()}
	<g class="bf-wing">
		<path d="M -1 -3 C -8 -11 -17 -12 -18 -6.5 C -19 -2 -12 0 -1 -0.5 Z" />
		<path d="M -1 0.8 C -9 1 -13 5 -11 8.8 C -9 11.8 -3 9 -1 3.6 Z" />
	</g>
	<g transform="scale(-1 1)" class="bf-wing">
		<path d="M -1 -3 C -8 -11 -17 -12 -18 -6.5 C -19 -2 -12 0 -1 -0.5 Z" />
		<path d="M -1 0.8 C -9 1 -13 5 -11 8.8 C -9 11.8 -3 9 -1 3.6 Z" />
	</g>
	<ellipse class="bf-body" rx="1.5" ry="5.4" />
	<circle class="bf-body" cy="-6" r="1.7" />
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
						<g class="bflyg">{@render bflyShape()}</g>
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
				{#each strata as sd, i (i)}
					<path d={sd} class="stratum" fill="none" />
				{/each}
				{#each rocks as r, i (i)}
					<g transform="translate({r.x} {r.y})">
						<path d={r.d} fill={r.fill} opacity="0.85" />
						<path d={r.d2} fill="#b3a892" opacity="0.45" transform="translate(-4 -5)" />
					</g>
				{/each}

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
					{#if squirrel}
						<g transform="translate({squirrel.x} {squirrel.y}) scale({squirrel.flip ? -1 : 1} 1)">
							{@render squirrelShape()}
						</g>
					{/if}
					{#each zones.filter((z) => z.clipped) as z (z.key)}
						<g class="zone" class:on={zoneOn(z)}>
							{#each z.units as u, i (i)}{@render unitG(u)}{/each}
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
				{#if worm}
					<g class="zone" class:on={isOn('mycelium')}>
						<g transform="translate({worm.x} {worm.y})">
							<g class="grow" style="--gd:600ms"><g class="wormg">{@render wormShape()}</g></g>
						</g>
					</g>
				{/if}
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
		stroke: #8a6544;
		stroke-width: 7;
		stroke-linecap: round;
	}
	.sq-body {
		fill: #96714d;
	}
	.sq-belly {
		fill: #c8a87e;
	}
	.sq-ear {
		fill: #8a6544;
	}
	.sq-eye {
		fill: #2c2417;
	}
	.sq-paw {
		fill: none;
		stroke: #6f5236;
		stroke-width: 1.2;
		stroke-linecap: round;
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
	.bf-wing {
		fill: #f2f7ec;
		stroke: #4f8a63;
		stroke-width: 0.7;
	}
	.bf-body {
		fill: #3f6d4e;
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
		.bf-wing {
			animation: tl-flap 2.8s ease-in-out infinite;
			transform-origin: 0px 0px;
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
