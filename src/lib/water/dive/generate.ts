/** Dive-specific procedural geometry. Pure data + path strings, no DOM —
 *  DiveLayer.svelte decides where things go. Shared generic helpers
 *  (taperedPath, smoothOpen, blobPath…) come from the tree's generate.ts;
 *  everything here is water vocabulary. */

import { smoothOpen, taperedPath, type Pt } from '$lib/garden/tree/generate';

const f1 = (n: number) => +n.toFixed(1);

/** Sample a centerline x(y) into points from y0 to y1 (inclusive). */
export function sampleLine(xAt: (y: number) => number, y0: number, y1: number, step = 90): Pt[] {
	const pts: Pt[] = [];
	const n = Math.max(3, Math.ceil((y1 - y0) / step));
	for (let i = 0; i <= n; i++) {
		const y = y0 + ((y1 - y0) * i) / n;
		pts.push({ x: xAt(y), y });
	}
	return pts;
}

/** The sounding line as a tapered rope polygon + a 1px sun-side highlight. */
export function ropeGeometry(
	xAt: (y: number) => number,
	y0: number,
	y1: number
): { d: string; hi: string } {
	const pts = sampleLine(xAt, y0, y1, 80);
	return {
		d: taperedPath(pts, 3.2, 1.8),
		hi: `M${smoothOpen(pts.map((p) => ({ x: p.x - 0.9, y: p.y })))}`
	};
}

/** The plumb lead (Lot) — the classic five-sided sounding weight, tip down,
 *  authored around (0,0) at the rope's end. */
export function leadPath(s = 1): string {
	const p: Pt[] = [
		{ x: 0, y: 18 * s },
		{ x: 6.5 * s, y: 6 * s },
		{ x: 4.5 * s, y: 0 },
		{ x: -4.5 * s, y: 0 },
		{ x: -6.5 * s, y: 6 * s }
	];
	return `M${p.map((q) => `${f1(q.x)} ${f1(q.y)}`).join(' L ')} Z`;
}

/** A short cord from the line's knot to a card corner, sagging with its own
 *  weight. */
export function cordPath(from: Pt, to: Pt, sag = 7): string {
	const mx = (from.x + to.x) / 2;
	const my = Math.max(from.y, to.y) + sag;
	return `M${f1(from.x)} ${f1(from.y)} Q ${f1(mx)} ${f1(my)} ${f1(to.x)} ${f1(to.y)}`;
}

/** A closed smooth ellipse loop as a CSS offset-path (four cubic arcs) —
 *  the koi swim loops. Starts at the right-most point, winds clockwise. */
export function ellipseLoop(cx: number, cy: number, rx: number, ry: number): string {
	const k = 0.5523;
	const x0 = f1(cx + rx);
	const x1 = f1(cx - rx);
	const yT = f1(cy - ry);
	const yB = f1(cy + ry);
	const kx = f1(rx * k);
	const ky = f1(ry * k);
	return (
		`M${x0} ${f1(cy)}` +
		`C${x0} ${f1(cy + ky)} ${f1(cx + kx)} ${yB} ${f1(cx)} ${yB}` +
		`C${f1(cx - kx)} ${yB} ${x1} ${f1(cy + ky)} ${x1} ${f1(cy)}` +
		`C${x1} ${f1(cy - ky)} ${f1(cx - kx)} ${yT} ${f1(cx)} ${yT}` +
		`C${f1(cx + kx)} ${yT} ${x0} ${f1(cy - ky)} ${x0} ${f1(cy)}Z`
	);
}
