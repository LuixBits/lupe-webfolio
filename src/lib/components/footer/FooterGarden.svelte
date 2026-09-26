<script lang="ts">
	/*
	 * Bedrock footer strip (garden theme — the About page's tree ends here).
	 *
	 * The page above descends sky → forest → soil; this strip is the solid rock
	 * the descent bottoms out on. Same architecture as the old meadow: the
	 * strata are a horizontally-stretched SVG (preserveAspectRatio "none") so
	 * the rock always fills the full width, while the accents (boulders,
	 * fossils, crystals, root tips) are small fixed-size SVGs positioned with
	 * CSS percentages — never distorted, never sliced at the edges. The top
	 * band's colour matches the page's deepest rock tone and the bottom band
	 * matches the bar's --footer-bar-bg, so page → strip → bar is one
	 * continuous mass. Rock keeps still: the only motion is a slow crystal
	 * glint.
	 */

	/* strata seams (viewBox 1200x156; the bar covers y >= 92) */
	const SEAM_1 = 'M 0 36 C 110 30 220 40 360 35 C 500 30 610 42 760 36 C 900 31 1050 39 1200 34';
	const SEAM_2 = 'M 0 74 C 130 68 260 78 420 73 C 570 68 690 80 860 74 C 990 70 1110 76 1200 72';
	const SEAM_3 =
		'M 0 112 C 120 106 280 116 440 111 C 600 106 740 118 900 112 C 1030 108 1130 114 1200 110';
	const close = (seam: string) => `${seam} L 1200 156 L 0 156 Z`;

	/* fine cracks running off the seams (stretched with the strata) */
	const CRACKS = [
		'M 180 36 q 8 14 2 26 q -5 10 2 18',
		'M 620 74 q -7 12 -2 22',
		'M 940 35 q 6 12 1 22 q -4 9 3 17',
		'M 402 112 q 6 10 2 20',
		'M 1060 74 q 7 11 3 24'
	];

	/* mineral flecks (left %, bottom px, radius) — hand-placed, deterministic */
	const FLECKS = [
		{ l: 8, b: 96, r: 1.6 },
		{ l: 14, b: 52, r: 1.3 },
		{ l: 26, b: 78, r: 1.5 },
		{ l: 33, b: 34, r: 1.2 },
		{ l: 47, b: 60, r: 1.6 },
		{ l: 58, b: 96, r: 1.2 },
		{ l: 63, b: 42, r: 1.5 },
		{ l: 78, b: 84, r: 1.3 },
		{ l: 90, b: 58, r: 1.6 },
		{ l: 96, b: 100, r: 1.2 }
	];
</script>

{#snippet boulder(s: number)}
	<g transform={`scale(${s})`}>
		<path
			class="rock-body"
			d="M 6 30 C 2 18 10 6 26 4 C 42 2 54 10 56 20 C 58 28 52 32 40 32 L 14 32 C 9 32 7 31.5 6 30 Z"
		/>
		<path class="rock-lite" d="M 12 14 C 18 7 30 4.5 40 7" />
		<path class="rock-crack" d="M 30 8 q 3 8 -1 14 q -3 5 1 9" />
		<ellipse class="rock-base" cx="30" cy="32" rx="27" ry="3.4" />
		<path
			class="rock-body rock-small"
			d="M 52 24 C 52 18 58 14 64 16 C 70 18 71 26 66 30 L 56 30 Z"
		/>
		<path class="rock-lite" d="M 56 19 C 59 16.5 63 16 66 17.5" />
	</g>
{/snippet}

{#snippet ammonite()}
	<!-- fossil spiral pressed into the stone -->
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
	<!-- a leaf imprint from long before the tree above -->
	<g class="fossil">
		<path class="fossil-line" d="M 0 26 C 4 16 10 8 22 0" />
		{#each [22, 19, 16, 13, 10, 7, 4] as yy, i}
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
	<!-- the last of the tree's roots, reaching down into the rock -->
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
	<!-- strata; stretched to any width, merging page-rock into the bar colour -->
	<svg class="strata" viewBox="0 0 1200 156" preserveAspectRatio="none">
		<rect class="band-join" width="1200" height="60" />
		<path class="band-1" d={close(SEAM_1)} />
		<path class="band-2" d={close(SEAM_2)} />
		<path class="band-3" d={close(SEAM_3)} />
		<path class="seam-lite" d={SEAM_1} vector-effect="non-scaling-stroke" />
		<path class="seam" d={SEAM_2} vector-effect="non-scaling-stroke" />
		<path class="seam" d={SEAM_3} vector-effect="non-scaling-stroke" />
		{#each CRACKS as c, i (i)}
			<path class="crack" d={c} vector-effect="non-scaling-stroke" />
		{/each}
	</svg>

	<!-- the tree's root tips entering the rock, under the trunk's line -->
	<svg class="accent roots-in" viewBox="0 0 126 72" width="126" height="72" style="left:50%;">
		{@render rootTips()}
	</svg>

	<!-- boulders resting in the strata -->
	<svg class="accent" viewBox="0 0 76 36" width="76" height="36" style="left:16%; bottom:56px;">
		{@render boulder(1)}
	</svg>
	<svg
		class="accent hide-sm"
		viewBox="0 0 76 36"
		width="60"
		height="28"
		style="left:70%; bottom:40px;"
	>
		{@render boulder(0.8)}
	</svg>
	<svg
		class="accent hide-sm"
		viewBox="0 0 76 36"
		width="46"
		height="22"
		style="left:88%; bottom:78px;"
	>
		{@render boulder(0.6)}
	</svg>

	<!-- fossils pressed into the mid band -->
	<svg
		class="accent hide-sm"
		viewBox="-18 -18 36 30"
		width="42"
		height="35"
		style="left:33%; bottom:66px;"
	>
		{@render ammonite()}
	</svg>
	<svg class="accent" viewBox="-10 -10 40 40" width="44" height="44" style="left:58%; bottom:34px;">
		{@render fernFossil()}
	</svg>

	<!-- a seam of quartz, catching what little light reaches down here -->
	<svg class="accent" viewBox="0 0 44 31" width="44" height="31" style="left:81%; bottom:52px;">
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

	/* ---- strata ---- */
	.strata {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	/* top band matches the page's deepest rock tone — a seamless join */
	.band-join {
		fill: #9e937f;
	}
	.band-1 {
		fill: #877c68;
	}
	.band-2 {
		fill: #675e4e;
	}
	/* bottom band matches --footer-bar-bg so the strip melts into the bar */
	.band-3 {
		fill: #3a352c;
	}
	.seam,
	.seam-lite {
		fill: none;
		stroke-width: 1.3;
	}
	.seam {
		stroke: #2f2a20;
		opacity: 0.3;
	}
	.seam-lite {
		stroke: #c9bda1;
		opacity: 0.45;
	}
	.crack {
		fill: none;
		stroke: #2f2a20;
		stroke-width: 1.1;
		stroke-linecap: round;
		opacity: 0.35;
	}

	/* ---- accents ---- */
	.accent {
		position: absolute;
	}
	.accent[style*='left:16%'] {
		margin-left: -38px;
	}
	.roots-in {
		top: -2px;
		margin-left: -84px;
	}

	.rock-body {
		fill: #7d7361;
		stroke: #4a4337;
		stroke-width: 1;
		stroke-linejoin: round;
	}
	.rock-small {
		fill: #736a58;
	}
	.rock-lite {
		fill: none;
		stroke: #a89b82;
		stroke-width: 1.4;
		stroke-linecap: round;
		opacity: 0.8;
	}
	.rock-crack {
		fill: none;
		stroke: #453e33;
		stroke-width: 0.9;
		stroke-linecap: round;
		opacity: 0.7;
	}
	.rock-base {
		fill: #322d24;
		opacity: 0.55;
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
