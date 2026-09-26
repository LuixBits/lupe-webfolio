/** Procedural geometry for the About page's full-page tree.
 *
 *  Everything is plain data + path strings; TreeLayer.svelte decides where
 *  things go and how they grow. All randomness is seeded (lsystem's rng), so
 *  a given page layout always grows the identical tree. */

export interface Pt {
	x: number;
	y: number;
}

const f1 = (n: number) => +n.toFixed(1);

/** Open polyline smoothed with midpoint quadratics (no leading M). */
export function smoothOpen(pts: Pt[]): string {
	if (pts.length < 2) return pts.map((p) => `${f1(p.x)} ${f1(p.y)}`).join(' ');
	let out = `${f1(pts[0].x)} ${f1(pts[0].y)}`;
	for (let i = 1; i < pts.length - 1; i++) {
		const mx = (pts[i].x + pts[i + 1].x) / 2;
		const my = (pts[i].y + pts[i + 1].y) / 2;
		out += ` Q ${f1(pts[i].x)} ${f1(pts[i].y)}, ${f1(mx)} ${f1(my)}`;
	}
	const last = pts[pts.length - 1];
	out += ` L ${f1(last.x)} ${f1(last.y)}`;
	return out;
}

/** Closed smoothed path (blob) through the given ring of points. */
export function smoothClosed(pts: Pt[]): string {
	const n = pts.length;
	const mid = (a: Pt, b: Pt): Pt => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
	let out = `M${f1(mid(pts[n - 1], pts[0]).x)} ${f1(mid(pts[n - 1], pts[0]).y)}`;
	for (let i = 0; i < n; i++) {
		const m = mid(pts[i], pts[(i + 1) % n]);
		out += ` Q ${f1(pts[i].x)} ${f1(pts[i].y)}, ${f1(m.x)} ${f1(m.y)}`;
	}
	return out + ' Z';
}

/** An organic leaf-mass silhouette centered on (0,0) — lobed, not round. */
export function blobPath(rand: () => number, rx: number, ry: number, n = 12): string {
	const pts: Pt[] = [];
	for (let i = 0; i < n; i++) {
		const a = (i / n) * Math.PI * 2 + rand() * 0.3;
		const k = 0.6 + rand() * 0.58;
		pts.push({ x: Math.cos(a) * rx * k, y: Math.sin(a) * ry * k });
	}
	return smoothClosed(pts);
}

export interface BranchGeom {
	/** Filled tapered polygon, LOCAL coords, base at (0,0). */
	d: string;
	/** Tip position in the same local coords. */
	end: Pt;
	/** Tip heading in turtle degrees (0 = up, clockwise). */
	endAngle: number;
	/** A point ~55% along the centerline (for mid attachments). */
	mid: Pt;
	/** Heading at the mid point. */
	midAngle: number;
}

/** A curved, tapered branch. Base sits at (0,0); `angleDeg` is the overall
 *  heading in turtle degrees (0 = up, clockwise); `bow` bends it sideways. */
export function taperedBranch(
	rand: () => number,
	angleDeg: number,
	len: number,
	w0: number,
	w1: number,
	bow: number
): BranchGeom {
	const rad = ((angleDeg - 90) * Math.PI) / 180;
	const dir = { x: Math.cos(rad), y: Math.sin(rad) };
	const nrm = { x: -dir.y, y: dir.x };
	const K = 8;
	const b1 = bow * (rand() * 2 - 1);
	const b2 = bow * (rand() * 2 - 1) * 0.45;
	const c: Pt[] = [];
	for (let i = 0; i <= K; i++) {
		const t = i / K;
		const off = Math.sin(t * Math.PI) * b1 + Math.sin(t * Math.PI * 2) * b2;
		c.push({ x: dir.x * len * t + nrm.x * off, y: dir.y * len * t + nrm.y * off });
	}
	const w = (t: number) => Math.max(0.5, w0 + (w1 - w0) * t) / 2;
	const L: Pt[] = [];
	const R: Pt[] = [];
	for (let i = 0; i <= K; i++) {
		const t = i / K;
		const p0 = c[Math.max(0, i - 1)];
		const p1 = c[Math.min(K, i + 1)];
		const dx = p1.x - p0.x;
		const dy = p1.y - p0.y;
		const dl = Math.hypot(dx, dy) || 1;
		const nx = -dy / dl;
		const ny = dx / dl;
		L.push({ x: c[i].x + nx * w(t), y: c[i].y + ny * w(t) });
		R.push({ x: c[i].x - nx * w(t), y: c[i].y - ny * w(t) });
	}
	R.reverse();
	const d = `M${smoothOpen(L)} L ${smoothOpen(R)} Z`;
	const tipA = (Math.atan2(c[K].y - c[K - 1].y, c[K].x - c[K - 1].x) * 180) / Math.PI + 90;
	const mi = Math.round(K * 0.55);
	const midA =
		(Math.atan2(c[mi + 1].y - c[mi - 1].y, c[mi + 1].x - c[mi - 1].x) * 180) / Math.PI + 90;
	return { d, end: c[K], endAngle: tipA, mid: c[mi], midAngle: midA };
}

/** A wobbly rounded-rect ring (the bower) around a w×h box whose top-left is
 *  at (0,0), drawn `pad` px OUTSIDE the box. */
export function bowerRing(
	rand: () => number,
	w: number,
	h: number,
	pad: number,
	r: number
): string {
	const x1 = -pad;
	const y1 = -pad;
	const x2 = w + pad;
	const y2 = h + pad;
	const wob = () => (rand() * 2 - 1) * 5;
	const pts: Pt[] = [];
	const side = (fx: number, fy: number, tx: number, ty: number, n: number) => {
		for (let i = 0; i < n; i++) {
			const t = (i + 0.5) / n;
			const horizontal = Math.abs(tx - fx) > Math.abs(ty - fy);
			pts.push({
				x: fx + (tx - fx) * t + (horizontal ? 0 : wob()),
				y: fy + (ty - fy) * t + (horizontal ? wob() : 0)
			});
		}
	};
	pts.push({ x: x1 + r, y: y1 });
	side(x1 + r, y1, x2 - r, y1, 3);
	pts.push({ x: x2 - r, y: y1 });
	pts.push({ x: x2, y: y1 + r });
	side(x2, y1 + r, x2, y2 - r, 3);
	pts.push({ x: x2, y: y2 - r });
	pts.push({ x: x2 - r, y: y2 });
	side(x2 - r, y2, x1 + r, y2, 3);
	pts.push({ x: x1 + r, y: y2 });
	pts.push({ x: x1, y: y2 - r });
	side(x1, y2 - r, x1, y1 + r, 3);
	pts.push({ x: x1, y: y1 + r });
	return smoothClosed(pts);
}
