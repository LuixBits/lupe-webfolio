<script lang="ts">
	/*
	 * Bedrock footer strip (garden theme — the About page's tree ends here).
	 *
	 * PROPER STONE this time: the mass is built from individually fitted
	 * rocks. A seamless SVG <pattern> tile (mortar channels at both tile
	 * edges, so it repeats invisibly) carries four courses of seeded,
	 * irregular stones — each with a top-light edge, an under-shadow, cracks
	 * on some, speckles on others — deeper courses darker and chunkier. The
	 * pattern tiles 1:1 at any viewport width (no stretching, no distorted
	 * shapes). The top course matches the page's deepest rock tone and the
	 * bottom course melts into the bar's --footer-bar-bg. Accents (fossils, a
	 * quartz seam, the tree's last root tips) sit on top as fixed-size SVGs.
	 * Rock keeps still: the only motion is the slow crystal glint.
	 */
	import { hashSeed, rng } from '$lib/garden/lsystem';

	const TILE_W = 340;
	const TILE_H = 156;

	interface Stone {
		d: string;
		lite: string;
		shade: string;
		crack: string | null;
		fill: string;
		specks: { x: number; y: number; r: number }[];
	}

	const STONES: Stone[] = (() => {
		const rand = rng(hashSeed('footer-bedrock'));
		const out: Stone[] = [];
		const courses = [
			{ y0: -6, h: 38, fills: ['#9e937f', '#948979', '#a29681'] },
			{ y0: 28, h: 34, fills: ['#867b68', '#7d7263', '#8d816d'] },
			{ y0: 58, h: 36, fills: ['#6a6151', '#615948', '#71675a'] },
			{ y0: 90, h: 70, fills: ['#4b4438', '#443e33', '#524a3d'] }
		];
		for (const c of courses) {
			let x = 3 + rand() * 10;
			while (x < TILE_W - 40) {
				const w = Math.min(46 + rand() * 52, TILE_W - 4 - x);
				const y0 = c.y0 + (rand() - 0.5) * 4;
				const y1 = y0 + c.h - 4 - rand() * 3;
				const j = () => (rand() * 2 - 1) * 3.4;
				// an irregular rounded block: eight jittered corner/edge points
				const p = [
					[x + 4 + j(), y0 + j()],
					[x + w * 0.5, y0 - 2 + j()],
					[x + w - 4 + j(), y0 + j()],
					[x + w + j() * 0.5, y0 + (y1 - y0) * 0.5],
					[x + w - 4 + j(), y1 + j()],
					[x + w * 0.5, y1 + 2 + j()],
					[x + 4 + j(), y1 + j()],
					[x + j() * 0.5, y0 + (y1 - y0) * 0.5]
				];
				const mid = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
				let d = `M${mid(p[7], p[0])[0].toFixed(1)} ${mid(p[7], p[0])[1].toFixed(1)}`;
				for (let i = 0; i < 8; i++) {
					const m = mid(p[i], p[(i + 1) % 8]);
					d += ` Q ${p[i][0].toFixed(1)} ${p[i][1].toFixed(1)}, ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
				}
				d += ' Z';
				const lite = `M ${(x + 6).toFixed(1)} ${(y0 + 4).toFixed(1)} Q ${(x + w * 0.45).toFixed(1)} ${(y0 - 0.5).toFixed(1)}, ${(x + w - 8).toFixed(1)} ${(y0 + 3.5).toFixed(1)}`;
				const shade = `M ${(x + 8).toFixed(1)} ${(y1 - 3).toFixed(1)} Q ${(x + w * 0.55).toFixed(1)} ${(y1 + 1).toFixed(1)}, ${(x + w - 6).toFixed(1)} ${(y1 - 4).toFixed(1)}`;
				const crack =
					rand() > 0.62
						? `M ${(x + w * (0.3 + rand() * 0.4)).toFixed(1)} ${y0.toFixed(1)} q ${(rand() * 8 - 4).toFixed(1)} ${((y1 - y0) * 0.4).toFixed(1)} ${(rand() * 10 - 5).toFixed(1)} ${((y1 - y0) * 0.8).toFixed(1)}`
						: null;
				const specks = Array.from({ length: rand() > 0.5 ? 3 : 2 }, () => ({
					x: +(x + 8 + rand() * (w - 16)).toFixed(1),
					y: +(y0 + 6 + rand() * (y1 - y0 - 12)).toFixed(1),
					r: +(0.8 + rand() * 0.9).toFixed(1)
				}));
				out.push({
					d,
					lite,
					shade,
					crack,
					fill: c.fills[Math.floor(rand() * c.fills.length)],
					specks
				});
				x += w + 4 + rand() * 5;
			}
		}
		return out;
	})();
</script>

{#snippet ammonite()}
	<g class="fossil">
		<path
			d="M 0 0
         a 3 3 0 0 1 6 0
         a 6 6 0 0 1 -12 0
         a 9 9 0 0 1 18 0
         a 12 12 0 0 1 -24 0
         a 15 15 0 0 1 30 0"
			class="fossil-line"
		/>
		<path d="M 3 -1 L 5 -4 M -4.5 3 L -7 5.5 M 7 4 L 10 6.5 M -9 -5 L -12 -8" class="fossil-rib" />
	</g>
{/snippet}

{#snippet fernFossil()}
	<g class="fossil">
		<path class="fossil-line" d="M 0 26 C 4 16 10 8 22 0" />
		{#each [22, 19, 16, 13, 10, 7, 4] as yy, i (yy)}
			<path
				class="fossil-rib"
				d={`M ${3 + i * 3} ${yy} q ${-5 + i * 0.4} ${-3.5} ${-7 + i * 0.6} ${-8}`}
			/>
			<path
				class="fossil-rib"
				d={`M ${3 + i * 3} ${yy} q ${6 - i * 0.4} ${-2} ${8 - i * 0.6} ${-7}`}
			/>
		{/each}
	</g>
{/snippet}

{#snippet crystals()}
	<g>
		<path class="crys" d="M 8 30 L 2 12 L 12 4 L 16 14 L 14 30 Z" />
		<path class="crys crys-b" d="M 18 30 L 16 8 L 24 0 L 30 10 L 27 30 Z" />
		<path class="crys" d="M 30 30 L 31 16 L 38 10 L 42 20 L 39 30 Z" />
		<path class="crys-facet" d="M 12 4 L 11 30 M 24 0 L 23 30 M 38 10 L 36 30" />
		<path class="crys-glint" d="M 16 8 L 24 0 L 30 10 L 27 30 L 23 30 Z" />
	</g>
{/snippet}

{#snippet rootTips()}
	<g>
		<path class="tip tip-a" d="M 30 -2 C 28 14 34 26 30 44 C 28 54 31 62 29 70" />
		<path class="tip tip-b" d="M 62 -2 C 64 12 58 22 62 38 C 64 48 60 54 62 60" />
		<path class="tip tip-c" d="M 96 -2 C 97 10 92 20 95 34 C 97 42 94 48 95 52" />
		<path
			class="tip-hair"
			d="M 29 30 q -6 3 -9 8 M 31 52 q 5 3 7 8 M 61 26 q -5 3 -8 7 M 95 24 q 5 2 7 6"
		/>
	</g>
{/snippet}

<div class="bedrock" aria-hidden="true">
	<svg class="strata" width="100%" height="100%">
		<defs>
			<pattern id="fg-rockpat" width={TILE_W} height={TILE_H} patternUnits="userSpaceOnUse">
				<rect width={TILE_W} height={TILE_H} fill="#4f473a" />
				{#each STONES as st, i (i)}
					<path d={st.d} fill={st.fill} />
					<path d={st.lite} class="st-lite" fill="none" />
					<path d={st.shade} class="st-shade" fill="none" />
					{#if st.crack}
						<path d={st.crack} class="st-crack" fill="none" />
					{/if}
					{#each st.specks as sp, k (k)}
						<circle cx={sp.x} cy={sp.y} r={sp.r} class="st-speck" />
					{/each}
				{/each}
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#fg-rockpat)" />
	</svg>

	<!-- the tree's root tips entering the rock, under the trunk's line -->
	<svg class="accent roots-in" viewBox="0 0 126 72" width="126" height="72" style="left:50%;">
		{@render rootTips()}
	</svg>

	<!-- fossils pressed between the stones -->
	<svg
		class="accent hide-sm"
		viewBox="-18 -18 36 30"
		width="42"
		height="35"
		style="left:30%; bottom:64px;"
	>
		{@render ammonite()}
	</svg>
	<svg class="accent" viewBox="-10 -10 40 40" width="44" height="44" style="left:60%; bottom:36px;">
		{@render fernFossil()}
	</svg>

	<!-- a quartz seam, catching what little light reaches down here -->
	<svg class="accent" viewBox="0 0 44 31" width="44" height="31" style="left:82%; bottom:52px;">
		{@render crystals()}
	</svg>
</div>

<style>
	.bedrock {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.bedrock svg {
		display: block;
	}
	.strata {
		position: absolute;
		inset: 0;
	}
	.st-lite {
		stroke: #c3b69c;
		stroke-width: 1.6;
		stroke-linecap: round;
		opacity: 0.5;
	}
	.st-shade {
		stroke: #2e2920;
		stroke-width: 1.8;
		stroke-linecap: round;
		opacity: 0.4;
	}
	.st-crack {
		stroke: #2e2920;
		stroke-width: 1;
		stroke-linecap: round;
		opacity: 0.5;
	}
	.st-speck {
		fill: #c3b69c;
		opacity: 0.35;
	}

	.accent {
		position: absolute;
	}
	.roots-in {
		top: -2px;
		margin-left: -84px;
	}

	.fossil-line {
		fill: none;
		stroke: #cabfa4;
		stroke-width: 1.5;
		stroke-linecap: round;
		opacity: 0.6;
	}
	.fossil-rib {
		fill: none;
		stroke: #cabfa4;
		stroke-width: 0.9;
		stroke-linecap: round;
		opacity: 0.45;
	}

	.crys {
		fill: #d9d2c0;
		stroke: #8f866f;
		stroke-width: 0.8;
		stroke-linejoin: round;
		opacity: 0.9;
	}
	.crys-b {
		fill: #e6e0d1;
	}
	.crys-facet {
		fill: none;
		stroke: #a79d85;
		stroke-width: 0.7;
		opacity: 0.7;
	}
	.crys-glint {
		fill: #fffdf2;
		opacity: 0.15;
		animation: glint 7s ease-in-out infinite;
	}

	.tip {
		fill: none;
		stroke: #453f2c;
		stroke-linecap: round;
	}
	.tip-a {
		stroke-width: 4;
	}
	.tip-b {
		stroke-width: 3;
	}
	.tip-c {
		stroke-width: 2.2;
	}
	.tip-hair {
		fill: none;
		stroke: #453f2c;
		stroke-width: 1.1;
		stroke-linecap: round;
		opacity: 0.7;
	}

	@keyframes glint {
		0%,
		100% {
			opacity: 0.12;
		}
		50% {
			opacity: 0.5;
		}
	}

	@media (max-width: 560px) {
		.bedrock svg.hide-sm {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.crys-glint {
			animation: none;
			opacity: 0.3;
		}
	}
</style>
