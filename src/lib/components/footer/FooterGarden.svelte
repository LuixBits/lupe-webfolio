<script lang="ts">
	/*
	 * The bottom of everything (garden footer — the About page's finale).
	 *
	 * The page descends sky → forest → soil → rock; this strip is where the
	 * descent ENDS: darkness under the bedrock, where the tree's last roots
	 * converge on the glowing SEED it once grew from ("wo es begann" — the
	 * deepest point of the page is the oldest). Smooth dark rock masses
	 * (amorphous curves, safe to stretch full-width) frame a fixed-size
	 * center vignette: three roots reaching down to a small amber seed with
	 * an embryo curl, its glow rim-lighting the nearest rock edges. A dim
	 * ammonite and a quartz seam keep the fossil language, lit faintly from
	 * the seed's side. The only motion is the seed's slow breathing glow.
	 */

	/* rock silhouette crests (viewBox 1200x92 visible; the bar hides y>=92,
	   so every shape that matters stays above that line) */
	const CREST_1 = 'M 0 26 C 80 12 190 34 320 24 C 460 14 550 38 700 26 C 850 14 1010 36 1200 20';
	const CREST_2 = 'M 0 58 C 110 42 250 66 410 54 C 560 42 690 70 850 56 C 990 44 1110 62 1200 50';
	const CREST_3 = 'M 0 86 C 130 72 290 92 460 82 C 630 72 770 94 940 82 C 1070 74 1150 84 1200 78';
	const close = (crest: string) => `${crest} L 1200 156 L 0 156 Z`;
</script>

{#snippet ammonite()}
	<g>
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

{#snippet crystals()}
	<g>
		<path class="crys" d="M 8 30 L 2 12 L 12 4 L 16 14 L 14 30 Z" />
		<path class="crys crys-b" d="M 18 30 L 16 8 L 24 0 L 30 10 L 27 30 Z" />
		<path class="crys" d="M 30 30 L 31 16 L 38 10 L 42 20 L 39 30 Z" />
		<path class="crys-facet" d="M 12 4 L 11 30 M 24 0 L 23 30 M 38 10 L 36 30" />
	</g>
{/snippet}

<div class="depths" aria-hidden="true">
	<!-- smooth dark rock masses, deepening to the bar's near-black -->
	<svg class="masses" viewBox="0 0 1200 156" preserveAspectRatio="none">
		<rect class="join" width="1200" height="40" />
		<path class="mass-1" d={close(CREST_1)} />
		<path class="mass-2" d={close(CREST_2)} />
		<path class="mass-3" d={close(CREST_3)} />
	</svg>

	<!-- the center vignette: roots reaching the glowing seed (fixed size) -->
	<svg class="heart" viewBox="0 0 520 156" width="520" height="156" style="left:50%;">
		<defs>
			<radialGradient id="fg-seedglow" cx="0.5" cy="0.5" r="0.5">
				<stop offset="0" stop-color="#ffce6a" stop-opacity="0.55" />
				<stop offset="0.5" stop-color="#f2a94e" stop-opacity="0.2" />
				<stop offset="1" stop-color="#f2a94e" stop-opacity="0" />
			</radialGradient>
		</defs>

		<!-- glow pool behind everything -->
		<ellipse class="glow" cx="260" cy="58" rx="150" ry="58" fill="url(#fg-seedglow)" />

		<!-- the last three roots, converging on the seed -->
		<path class="root r-a" d="M 222 -2 C 218 12 230 24 238 34 C 244 41 250 46 254 50" />
		<path class="root r-b" d="M 260 -2 C 262 12 258 26 260 40 C 261 46 260 50 260 53" />
		<path class="root r-c" d="M 300 -2 C 302 10 288 24 276 36 C 270 42 266 46 265 50" />
		<path
			class="root-hair"
			d="M 236 24 q -8 4 -11 9 M 264 32 q 7 3 9 8 M 246 40 q -6 3 -8 7 M 276 28 q 8 2 11 6"
		/>

		<!-- rock rims catching the seed's light -->
		<path class="rim" d="M 148 58 C 184 48 214 46 240 50" />
		<path class="rim" d="M 282 49 C 310 46 342 50 374 60" />
		<path class="rim rim-2" d="M 180 82 C 220 74 300 74 342 83" />

		<!-- THE SEED — an amber drop with its embryo curl, breathing light -->
		<g class="seedg" transform="translate(260 62) scale(1.3) translate(-260 -62)">
			<ellipse class="seed-halo" cx="260" cy="62" rx="26" ry="19" />
			<path
				class="seed"
				d="M 260 46 C 271 50 276 60 273 70 C 270 78 250 78 247 70 C 244 60 249 50 260 46 Z"
			/>
			<path class="seed-curl" d="M 260 54 C 265 56 266 62 262 66 C 258 69 253 66 255 62" />
			<circle class="seed-spark" cx="256" cy="56" r="1.4" />
		</g>

		<!-- companions of the seed, lit from its side -->
		<g class="side" transform="translate(150 66)">{@render ammonite()}</g>
		<g class="side" transform="translate(352 58)">{@render crystals()}</g>
	</svg>
</div>

<style>
	.depths {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.depths svg {
		display: block;
	}
	.masses {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	/* top matches the page's deepest rock; each mass darker toward the bar */
	.join {
		fill: #9e937f;
	}
	.mass-1 {
		fill: #6f6656;
	}
	.mass-2 {
		fill: #474135;
	}
	.mass-3 {
		fill: #241f18;
	}

	.heart {
		position: absolute;
		top: 0;
		margin-left: -260px;
	}
	.root {
		fill: none;
		stroke: #453f2c;
		stroke-linecap: round;
	}
	.r-a {
		stroke-width: 4.4;
	}
	.r-b {
		stroke-width: 3.4;
	}
	.r-c {
		stroke-width: 4;
	}
	.root-hair {
		fill: none;
		stroke: #453f2c;
		stroke-width: 1.2;
		stroke-linecap: round;
		opacity: 0.7;
	}
	.rim {
		fill: none;
		stroke: #c8a25f;
		stroke-width: 1.6;
		stroke-linecap: round;
		opacity: 0.4;
	}
	.rim-2 {
		opacity: 0.22;
	}
	.seed-halo {
		fill: #ffce6a;
		opacity: 0.22;
	}
	.seed {
		fill: #f2a94e;
		stroke: #b06e1e;
		stroke-width: 1;
	}
	.seed-curl {
		fill: none;
		stroke: #8a5312;
		stroke-width: 1.4;
		stroke-linecap: round;
	}
	.seed-spark {
		fill: #fff3d0;
	}

	.fossil-line {
		fill: none;
		stroke: #8d8168;
		stroke-width: 1.4;
		stroke-linecap: round;
		opacity: 0.6;
	}
	.fossil-rib {
		fill: none;
		stroke: #8d8168;
		stroke-width: 0.9;
		stroke-linecap: round;
		opacity: 0.45;
	}
	.crys {
		fill: #6e6753;
		stroke: #9c8f6c;
		stroke-width: 0.8;
		stroke-linejoin: round;
		opacity: 0.9;
	}
	.crys-b {
		fill: #7d745c;
	}
	.crys-facet {
		fill: none;
		stroke: #b7a87d;
		stroke-width: 0.7;
		opacity: 0.55;
	}

	/* the seed breathes; everything else keeps the stillness of the deep */
	@media (prefers-reduced-motion: no-preference) {
		.glow,
		.seed-halo {
			animation: seed-breathe 5.2s ease-in-out infinite;
		}
		.seed-spark {
			animation: seed-spark 5.2s ease-in-out infinite;
		}
	}
	@keyframes seed-breathe {
		0%,
		100% {
			opacity: 0.22;
		}
		50% {
			opacity: 0.5;
		}
	}
	@keyframes seed-spark {
		0%,
		100% {
			opacity: 0.7;
		}
		50% {
			opacity: 1;
		}
	}
</style>
