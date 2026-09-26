/** Shared koi geometry + robe styles, extracted from WaterScene so every
 *  water surface (hub pond, corner scene, the CV dive) swims the same fish.
 *
 *  The koi is authored in local coords, nose pointing +x, ~130 units long
 *  (tail tip ≈ -67 … nose ≈ 62). Koi.svelte renders it; these constants stay
 *  render-free so procedural layers can also consume them directly. */

export const KOI_BODY =
	'M62 0C62 -6.6 54 -11.8 44 -14C28 -17.4 8 -17.2 -10 -13C-24 -9.7 -33 -6.4 -39 -3.4C-40.6 -2.6 -40.6 2.6 -39 3.4C-33 6.4 -24 9.7 -10 13C8 17.2 28 17.4 44 14C54 11.8 62 6.6 62 0Z';
export const KOI_TAIL =
	'M-35 -2.5C-44 -8 -52 -16 -64 -21C-60 -14 -61 -8 -57 -3C-62 1 -61 8 -67 15C-56 13 -45 7 -35 2.5Z';
export const KOI_FIN = 'M36 11C31 19 22 26 12 28C17 21 21 15 25 10C28 9 33 9.5 36 11Z';
export const KOI_DORSAL = 'M-16 0C-23 -1.6 -33 -1.6 -38 0C-33 1.6 -23 1.6 -16 0Z';

export interface KoiPatch {
	cx: number;
	cy: number;
	rx: number;
	ry: number;
	rot: number;
}

export interface KoiRobeStyle {
	body: string;
	patch: string;
	patches: KoiPatch[];
}

export type KoiRobe = 'kohaku' | 'hi' | 'asagi';

export const KOI_ROBES: Record<KoiRobe, KoiRobeStyle> = {
	// white koi with vermilion patches
	kohaku: {
		body: '#f7fbfc',
		patch: '#e0603c',
		patches: [
			{ cx: 30, cy: -4, rx: 17, ry: 13, rot: -14 },
			{ cx: -6, cy: 5, rx: 15, ry: 11, rot: 10 },
			{ cx: -30, cy: -3, rx: 9, ry: 7, rot: -6 }
		]
	},
	// warm orange koi with deeper saddles
	hi: {
		body: '#e07a3f',
		patch: '#c05028',
		patches: [
			{ cx: 18, cy: 2, rx: 19, ry: 12, rot: 8 },
			{ cx: -24, cy: -4, rx: 10, ry: 7, rot: -10 }
		]
	},
	// blue-grey koi with orange cheeks (asagi)
	asagi: {
		body: 'color-mix(in srgb, var(--water-deep, #2b9cba) 46%, #eaf3f6)',
		patch: '#e0603c',
		patches: [
			{ cx: 44, cy: 8, rx: 7, ry: 4.5, rot: 20 },
			{ cx: 44, cy: -8, rx: 7, ry: 4.5, rot: -20 }
		]
	}
};
