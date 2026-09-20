/** Tiny hex-color helpers — pure string math, SSR-safe, no deps. Used to derive
 *  wedge gradients / sub-slice tints from each section's signature colour. */

function hexToRgb(hex: string): [number, number, number] {
	const h = hex.replace('#', '');
	const s = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
	const n = parseInt(s, 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
	const c = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
	return `#${c(r)}${c(g)}${c(b)}`;
}

/** Blend `a` toward `b` by t (0 = a, 1 = b). */
export function mix(a: string, b: string, t: number): string {
	const [ar, ag, ab] = hexToRgb(a);
	const [br, bg, bb] = hexToRgb(b);
	return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

export function lighten(c: string, t: number): string {
	return mix(c, '#ffffff', t);
}

/** Darken toward ink (deep blue-black) rather than pure black — keeps hues warm. */
export function darken(c: string, t: number): string {
	return mix(c, '#10131a', t);
}
