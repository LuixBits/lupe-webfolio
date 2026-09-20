/** Deterministic L-system → turtle geometry for the "growing plant" effect.
 *
 *  A seeded L-system expands an axiom under production rules, then a turtle
 *  walks the resulting string emitting line segments (branches/roots) and leaf
 *  anchors. Output is pure data — the renderer (Garden.svelte) decides how to
 *  animate it (stroke-dashoffset draw-on, spring-scaled leaves).
 *
 *  Deterministic on `seed`, so a given page always grows the same plant. */

export interface Segment {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	/** Branch depth (0 = trunk/primary root). Drives stroke width + draw order. */
	depth: number;
	/** Cumulative path length up to the *start* of this segment, for staggered growth. */
	distance: number;
}

export interface Leaf {
	x: number;
	y: number;
	/** Heading in degrees the leaf points along. */
	angle: number;
	depth: number;
	distance: number;
}

export interface Plant {
	segments: Segment[];
	leaves: Leaf[];
	/** Total drawn length — lets the renderer normalise growth timing to [0,1]. */
	totalLength: number;
}

export interface LSystemOptions {
	axiom: string;
	rules: Record<string, string>;
	/** Turn angle in degrees for + / − commands. */
	angle: number;
	iterations: number;
	/** Length of one F step (shrinks with depth). */
	step: number;
	/** Initial heading in degrees (0 = up, 180 = down for roots). */
	heading?: number;
	/** Random angle wobble (deg) applied per turn, seeded — keeps it organic. */
	jitter?: number;
	seed?: number;
}

/** mulberry32 — tiny fast seeded PRNG. Deterministic given the seed. */
function rng(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Turn a string into a numeric seed (so page slugs can seed their own plant). */
export function hashSeed(input: string): number {
	let h = 2166136261;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

function expand(axiom: string, rules: Record<string, string>, iterations: number): string {
	let s = axiom;
	for (let i = 0; i < iterations; i++) {
		let next = '';
		for (const ch of s) next += rules[ch] ?? ch;
		s = next;
	}
	return s;
}

interface TurtleState {
	x: number;
	y: number;
	heading: number;
	depth: number;
	step: number;
}

/** Generate plant geometry starting from (originX, originY). */
export function growPlant(
	originX: number,
	originY: number,
	opts: LSystemOptions
): Plant {
	const { axiom, rules, angle, iterations, step } = opts;
	const heading = opts.heading ?? 0;
	const jitter = opts.jitter ?? 0;
	const rand = rng(opts.seed ?? 1);

	const commands = expand(axiom, rules, iterations);
	const segments: Segment[] = [];
	const leaves: Leaf[] = [];

	let state: TurtleState = { x: originX, y: originY, heading, depth: 0, step };
	const stack: TurtleState[] = [];
	let distance = 0;

	const wobble = () => (jitter ? (rand() * 2 - 1) * jitter : 0);

	for (const cmd of commands) {
		switch (cmd) {
			case 'F':
			case 'G': {
				const rad = ((state.heading - 90) * Math.PI) / 180;
				const len = state.step;
				const x2 = state.x + Math.cos(rad) * len;
				const y2 = state.y + Math.sin(rad) * len;
				segments.push({ x1: state.x, y1: state.y, x2, y2, depth: state.depth, distance });
				distance += len;
				state = { ...state, x: x2, y: y2 };
				break;
			}
			case '+':
				state = { ...state, heading: state.heading + angle + wobble() };
				break;
			case '-':
				state = { ...state, heading: state.heading - angle + wobble() };
				break;
			case 'L':
				leaves.push({ x: state.x, y: state.y, angle: state.heading, depth: state.depth, distance });
				break;
			case '[':
				stack.push({ ...state });
				// Children are thinner and shorter — reads as a real branch taper.
				state = { ...state, depth: state.depth + 1, step: state.step * 0.72 };
				break;
			case ']': {
				const popped = stack.pop();
				if (popped) state = popped;
				break;
			}
		}
	}

	return { segments, leaves, totalLength: distance };
}

/** A tuned preset that reads as an upward branching sprig with leaves. */
export const BRANCH_PRESET: Omit<LSystemOptions, 'seed'> = {
	axiom: 'X',
	rules: {
		X: 'F[+X L][-X L]FX',
		F: 'FF'
	},
	angle: 25,
	iterations: 4,
	step: 6,
	heading: 0,
	jitter: 6
};

/** Same grammar aimed downward with a wider fan — roots creeping into a corner. */
export const ROOT_PRESET: Omit<LSystemOptions, 'seed'> = {
	axiom: 'X',
	rules: {
		X: 'F[++X][--X]FX',
		F: 'FF'
	},
	angle: 32,
	iterations: 4,
	step: 6,
	heading: 180,
	jitter: 9
};
