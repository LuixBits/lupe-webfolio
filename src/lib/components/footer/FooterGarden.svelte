<script lang="ts">
	/*
	 * The bottom of everything (garden footer — the About page's finale).
	 *
	 * The page descends sky → forest → soil → rock; this strip is where the
	 * descent ENDS: darkness under the bedrock, where the tree's last roots
	 * converge on the glowing SEED it once grew from ("wo es begann" — the
	 * deepest point of the page is the oldest). Smooth dark rock masses
	 * (amorphous curves, safe to stretch full-width) frame a fixed-size
	 * center vignette: three roots reaching down into a dark hollow where an
	 * amber seed with an embryo curl rests — glowing tips where they touch
	 * it, golden mycelium filaments carrying its light into the rock, rings
	 * of light slowly widening, motes drifting up. Rim-lit pebbles and a
	 * quartz seam flank it. All motion is slow and quiet (breathe / ring /
	 * mote), and reduced-motion gets a still scene.
	 */

	/* rock silhouette crests (viewBox 1200x92 visible; the bar hides y>=92,
	   so every shape that matters stays above that line) */
	const CREST_1 = 'M 0 26 C 80 12 190 34 320 24 C 460 14 550 38 700 26 C 850 14 1010 36 1200 20';
	const CREST_2 = 'M 0 58 C 110 42 250 66 410 54 C 560 42 690 70 850 56 C 990 44 1110 62 1200 50';
	const CREST_3 = 'M 0 86 C 130 72 290 92 460 82 C 630 72 770 94 940 82 C 1070 74 1150 84 1200 78';
	const close = (crest: string) => `${crest} L 1200 156 L 0 156 Z`;
</script>

{#snippet pebbles()}
	<g>
		<ellipse class="peb" cx="0" cy="4" rx="13" ry="7" />
		<path class="peb-lit" d="M -10 1 Q -2 -4 9 1" />
		<ellipse class="peb peb-b" cx="20" cy="7" rx="8" ry="4.6" />
		<path class="peb-lit" d="M 14 5 Q 20 2 26 5" />
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

		<!-- the hollow: a dark chamber cradling the seed -->
		<ellipse class="cavity" cx="260" cy="66" rx="58" ry="24" />

		<!-- the last three roots, converging on the seed -->
		<path class="root r-a" d="M 222 -2 C 218 12 230 24 238 34 C 244 41 250 46 254 50" />
		<path class="root r-b" d="M 260 -2 C 262 12 258 26 260 40 C 261 46 260 50 260 53" />
		<path class="root r-c" d="M 300 -2 C 302 10 288 24 276 36 C 270 42 266 46 265 50" />
		<path
			class="root-hair"
			d="M 236 24 q -8 4 -11 9 M 264 32 q 7 3 9 8 M 246 40 q -6 3 -8 7 M 276 28 q 8 2 11 6"
		/>
		<!-- the tips glow where they touch the seed's light -->
		<circle class="root-tip" cx="254.5" cy="51" r="2.1" />
		<circle class="root-tip" cx="260" cy="54" r="1.8" />
		<circle class="root-tip" cx="265" cy="51" r="2.1" />

		<!-- golden mycelium filaments carrying the seed's light into the rock -->
		<path class="fila" d="M 244 64 C 224 66 208 62 192 68 C 182 71 174 70 166 74" />
		<path class="fila" d="M 276 64 C 296 68 312 62 330 68 C 342 72 352 70 362 75" />
		<path class="fila fila-2" d="M 250 72 C 238 78 224 78 212 84" />
		<path class="fila fila-2" d="M 270 72 C 284 78 298 80 310 86" />
		<path class="fila fila-2" d="M 260 74 C 258 80 262 84 260 89" />

		<!-- rock rims catching the seed's light -->
		<path class="rim" d="M 148 58 C 184 48 214 46 240 50" />
		<path class="rim" d="M 282 49 C 310 46 342 50 374 60" />
		<path class="rim rim-2" d="M 180 82 C 220 74 300 74 342 83" />

		<!-- slow rings of light widening out of the seed -->
		<circle class="ring ring-1" cx="260" cy="62" r="17" />
		<circle class="ring ring-2" cx="260" cy="62" r="17" />

		<!-- THE SEED — an amber drop with its embryo curl, breathing light -->
		<g class="seedg" transform="translate(260 62) scale(1.3) translate(-260 -62)">
			<ellipse class="seed-halo" cx="260" cy="62" rx="26" ry="19" />
			<path
				class="seed"
				d="M 260 46 C 271 50 276 60 273 70 C 270 78 250 78 247 70 C 244 60 249 50 260 46 Z"
			/>
			<path class="seed-vein" d="M 260 47 C 259 54 259 64 260 75" />
			<path
				class="seed-curl"
				d="M 259 52 C 266 53 269 60 265 66 C 261.5 71 254 69 253.5 63.5 C 253.2 60 256 57.5 258.5 59 C 260.5 60.3 260.3 63 258.6 63.8"
			/>
			<circle class="seed-spark" cx="255.5" cy="55" r="1.5" />
			<circle class="seed-spark spark-2" cx="263" cy="68" r="1" />
		</g>

		<!-- motes of light rising from the hollow -->
		<circle class="mote m-1" cx="240" cy="58" r="1.5" />
		<circle class="mote m-2" cx="276" cy="54" r="1.2" />
		<circle class="mote m-3" cx="256" cy="50" r="1" />
		<circle class="mote m-4" cx="290" cy="62" r="1.3" />

		<!-- companions of the seed, lit from its side -->
		<g class="side" transform="translate(142 62)">{@render pebbles()}</g>
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
	.cavity {
		fill: #17120c;
		opacity: 0.5;
	}
	.root-tip {
		fill: #ffc76a;
		opacity: 0.85;
	}
	.fila {
		fill: none;
		stroke: #d8b268;
		stroke-width: 1;
		stroke-linecap: round;
		opacity: 0.38;
	}
	.fila-2 {
		stroke-width: 0.8;
		opacity: 0.26;
	}
	.ring {
		fill: none;
		stroke: #ffce6a;
		stroke-width: 1.1;
		opacity: 0.14;
		transform-origin: 260px 62px;
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
	.seed-vein {
		fill: none;
		stroke: #ffe1a0;
		stroke-width: 0.9;
		stroke-linecap: round;
		opacity: 0.7;
	}
	.seed-curl {
		fill: none;
		stroke: #8a5312;
		stroke-width: 1.5;
		stroke-linecap: round;
	}
	.seed-spark {
		fill: #fff3d0;
	}
	.mote {
		fill: #ffe1a0;
		opacity: 0.3;
	}
	.peb {
		fill: #55503f;
	}
	.peb-b {
		fill: #4a4536;
	}
	.peb-lit {
		fill: none;
		stroke: #c8a25f;
		stroke-width: 1.2;
		stroke-linecap: round;
		opacity: 0.4;
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

	/* the seed breathes, rings widen, motes drift up — slow, quiet, mystic;
	   everything else keeps the stillness of the deep */
	@media (prefers-reduced-motion: no-preference) {
		.glow,
		.seed-halo {
			animation: seed-breathe 5.2s ease-in-out infinite;
		}
		.seed-spark {
			animation: seed-spark 5.2s ease-in-out infinite;
		}
		.spark-2 {
			animation-delay: 2.6s;
		}
		.ring-1 {
			animation: seed-ring 7s ease-out infinite;
		}
		.ring-2 {
			animation: seed-ring 7s ease-out 3.5s infinite;
		}
		.mote {
			animation: seed-mote 11s ease-in-out infinite;
		}
		.m-2 {
			animation-duration: 13s;
			animation-delay: -4s;
		}
		.m-3 {
			animation-duration: 9s;
			animation-delay: -7s;
		}
		.m-4 {
			animation-duration: 14s;
			animation-delay: -10s;
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
	@keyframes seed-ring {
		0% {
			transform: scale(0.75);
			opacity: 0;
		}
		18% {
			opacity: 0.3;
		}
		100% {
			transform: scale(2.1);
			opacity: 0;
		}
	}
	@keyframes seed-mote {
		0%,
		100% {
			transform: translateY(0);
			opacity: 0;
		}
		18% {
			opacity: 0.55;
		}
		60% {
			opacity: 0.35;
		}
		90% {
			transform: translateY(-20px);
			opacity: 0;
		}
	}
</style>
