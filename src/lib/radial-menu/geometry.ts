/** Radial-menu geometry helpers.
 *
 *  Angles are in degrees, measured clockwise from 12 o'clock (−90° offset), so
 *  slice 0 starts at the top. All functions are pure — no DOM, safe for SSR. */

export interface Point {
	x: number;
	y: number;
}

export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): Point {
	const rad = ((angleDeg - 90) * Math.PI) / 180;
	return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Path for an annular sector (a ring slice with a hole in the middle). The
 *  hollow center leaves room for a hub/logo and reads as a modern radial dial,
 *  unlike the classic pie wedge that collapses to the origin. */
export function annularSector(
	cx: number,
	cy: number,
	rInner: number,
	rOuter: number,
	startAngle: number,
	endAngle: number
): string {
	const largeArc = endAngle - startAngle > 180 ? 1 : 0;
	const oStart = polarToCartesian(cx, cy, rOuter, startAngle);
	const oEnd = polarToCartesian(cx, cy, rOuter, endAngle);
	const iEnd = polarToCartesian(cx, cy, rInner, endAngle);
	const iStart = polarToCartesian(cx, cy, rInner, startAngle);
	return [
		`M ${oStart.x} ${oStart.y}`,
		`A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${oEnd.x} ${oEnd.y}`,
		`L ${iEnd.x} ${iEnd.y}`,
		`A ${rInner} ${rInner} 0 ${largeArc} 0 ${iStart.x} ${iStart.y}`,
		'Z'
	].join(' ');
}

/** Solid pie wedge from the center out to radius `r`. This is the shape the
 *  menu is built from: N wedges tile a full circle with no gaps, so 4 wedges
 *  each fill exactly a 90° quarter — which is what lands in a viewport corner
 *  when the menu docks. */
export function wedge(
	cx: number,
	cy: number,
	r: number,
	startAngle: number,
	endAngle: number
): string {
	const largeArc = endAngle - startAngle > 180 ? 1 : 0;
	const start = polarToCartesian(cx, cy, r, startAngle);
	const end = polarToCartesian(cx, cy, r, endAngle);
	return [
		`M ${cx} ${cy}`,
		`L ${start.x} ${start.y}`,
		`A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
		'Z'
	].join(' ');
}

/** Midpoint of a slice, at the given radius — where a label or icon sits. */
export function centroid(cx: number, cy: number, r: number, midAngle: number): Point {
	return polarToCartesian(cx, cy, r, midAngle);
}

/** An arc path for curved text along a slice (a `<textPath>` baseline). The arc
 *  direction flips on the lower half so the text always reads upright rather
 *  than upside-down. Center the text with startOffset="50%" + text-anchor middle. */
export function labelArc(
	cx: number,
	cy: number,
	r: number,
	startAngle: number,
	endAngle: number
): string {
	const mid = (startAngle + endAngle) / 2;
	const upper = mid < 90 || mid > 270;
	const a0 = upper ? startAngle : endAngle;
	const a1 = upper ? endAngle : startAngle;
	const p0 = polarToCartesian(cx, cy, r, a0);
	const p1 = polarToCartesian(cx, cy, r, a1);
	const large = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
	const sweep = upper ? 1 : 0;
	return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} ${sweep} ${p1.x} ${p1.y}`;
}

/** A straight radial baseline (inner→outer along `angle`) for text that runs
 *  lengthwise down a wedge. Flips direction when the outward direction points
 *  left (screen-x negative, i.e. angle in (180°, 360°)) so text stays upright. */
export function radialPath(
	cx: number,
	cy: number,
	rInner: number,
	rOuter: number,
	angle: number
): string {
	const a = ((angle % 360) + 360) % 360;
	const flip = a > 180;
	const inner = polarToCartesian(cx, cy, rInner, angle);
	const outer = polarToCartesian(cx, cy, rOuter, angle);
	return flip
		? `M ${outer.x} ${outer.y} L ${inner.x} ${inner.y}`
		: `M ${inner.x} ${inner.y} L ${outer.x} ${outer.y}`;
}
