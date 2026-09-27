<script lang="ts">
	/*
	 * The bottom of the dive (CV footer — »Der Tauchgang«'s finale).
	 *
	 * The page descends dawn sky → sunlit water → twilight → midnight → the
	 * seabed where the koi eggs glow; this strip is where the descent ENDS:
	 * the abyss under the bed. Smooth dark dune masses (amorphous curves,
	 * safe to stretch full-width) frame a fixed-size center vignette where
	 * the egg-light's tendrils reach down out of the page above — thin amber
	 * filaments, a faint glow, slow motes, rim-lit stones. The exact Seed-
	 * footer recipe, retold in water. Quiet motion only; reduced motion gets
	 * a still scene.
	 */

	// dune crests (viewBox 1200×156 visible; the bar hides y>=92)
	const CREST_1 = 'M 0 24 C 90 12 200 32 330 22 C 470 12 560 36 710 24 C 860 12 1020 34 1200 18';
	const CREST_2 = 'M 0 56 C 120 42 260 64 420 52 C 570 40 700 68 860 54 C 1000 42 1120 60 1200 48';
	const CREST_3 = 'M 0 86 C 140 72 300 92 470 82 C 640 72 780 94 950 82 C 1080 74 1150 84 1200 78';
	const close = (crest: string) => `${crest} L 1200 156 L 0 156 Z`;
</script>

<div class="abyss" aria-hidden="true">
	<!-- smooth dune masses, deepening to the bar's near-black indigo -->
	<svg class="masses" viewBox="0 0 1200 156" preserveAspectRatio="none">
		<rect class="join" width="1200" height="40" />
		<path class="mass-1" d={close(CREST_1)} />
		<path class="mass-2" d={close(CREST_2)} />
		<path class="mass-3" d={close(CREST_3)} />
	</svg>

	<!-- the center vignette: the egg-light reaching down (fixed size) -->
	<svg class="heart" viewBox="0 0 520 156" width="520" height="156" style="left:50%;">
		<defs>
			<radialGradient id="fa-eggglow" cx="0.5" cy="0" r="0.9">
				<stop offset="0" stop-color="#ffce6a" stop-opacity="0.34" />
				<stop offset="0.55" stop-color="#f2a94e" stop-opacity="0.12" />
				<stop offset="1" stop-color="#f2a94e" stop-opacity="0" />
			</radialGradient>
		</defs>

		<!-- glow spilling down from the clutch above the seam -->
		<ellipse class="glow" cx="260" cy="8" rx="150" ry="64" fill="url(#fa-eggglow)" />

		<!-- the tendrils, arriving from the page -->
		<path class="tendril t-a" d="M 226 -2 C 222 16 230 30 238 44 C 243 52 247 58 249 64" />
		<path class="tendril t-b" d="M 260 -2 C 262 14 258 30 260 46 C 261 54 260 60 260 66" />
		<path class="tendril t-c" d="M 296 -2 C 298 12 286 28 276 42 C 271 49 267 55 266 61" />
		<circle class="tendril-tip" cx="249" cy="65" r="1.9" />
		<circle class="tendril-tip" cx="260" cy="67" r="1.6" />
		<circle class="tendril-tip" cx="266" cy="62" r="1.8" />

		<!-- faint current lines carrying the light sideways -->
		<path class="fila" d="M 244 58 C 224 62 206 58 190 64 C 180 67 172 66 164 70" />
		<path class="fila" d="M 276 58 C 296 62 314 58 332 64 C 344 68 354 66 364 71" />

		<!-- rim-lit stones flanking the seam -->
		<g class="side" transform="translate(150 62)">
			<ellipse class="peb" cx="0" cy="4" rx="13" ry="7" />
			<path class="peb-lit" d="M -10 1 Q -2 -4 9 1" />
			<ellipse class="peb peb-b" cx="21" cy="7" rx="8" ry="4.6" />
			<path class="peb-lit" d="M 15 5 Q 21 2 27 5" />
		</g>
		<g class="side" transform="translate(352 60)">
			<ellipse class="peb peb-b" cx="0" cy="5" rx="10" ry="5.5" />
			<path class="peb-lit" d="M -7 2 Q 0 -2 8 2" />
			<ellipse class="peb" cx="17" cy="8" rx="7" ry="4" />
		</g>

		<!-- a sleeping fry, and motes of light rising toward the eggs -->
		<g class="side" transform="translate(300 74) rotate(6)">
			<ellipse class="fry" rx="3.6" ry="1.7" />
			<path class="fry" d="M-3.4 0L-6.2 -1.8C-5.6 -0.7 -5.6 0.7 -6.2 1.8Z" />
		</g>
		<circle class="mote m-1" cx="240" cy="52" r="1.4" />
		<circle class="mote m-2" cx="276" cy="46" r="1.1" />
		<circle class="mote m-3" cx="258" cy="40" r="1" />
	</svg>
</div>

<style>
	.abyss {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.abyss svg {
		display: block;
	}
	.masses {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	/* top matches the page's abyss ink; each dune darker toward the bar */
	.join {
		fill: #04141f;
	}
	.mass-1 {
		fill: #041019;
	}
	.mass-2 {
		fill: #030d15;
	}
	.mass-3 {
		fill: #020910;
	}

	.heart {
		position: absolute;
		top: 0;
		margin-left: -260px;
	}
	.tendril {
		fill: none;
		stroke: #d8b268;
		stroke-linecap: round;
		opacity: 0.4;
	}
	.t-a {
		stroke-width: 1.4;
	}
	.t-b {
		stroke-width: 1.1;
	}
	.t-c {
		stroke-width: 1.3;
	}
	.tendril-tip {
		fill: #ffc76a;
		opacity: 0.8;
	}
	.fila {
		fill: none;
		stroke: #d8b268;
		stroke-width: 0.9;
		stroke-linecap: round;
		opacity: 0.28;
	}
	.peb {
		fill: #0d2531;
	}
	.peb-b {
		fill: #0a1f2a;
	}
	.peb-lit {
		fill: none;
		stroke: #c8a25f;
		stroke-width: 1.1;
		stroke-linecap: round;
		opacity: 0.4;
	}
	.fry {
		fill: #38596a;
		opacity: 0.8;
	}
	.mote {
		fill: #ffe1a0;
		opacity: 0.3;
	}

	/* the glow breathes, motes drift up toward the clutch — slow and quiet */
	@media (prefers-reduced-motion: no-preference) {
		.glow {
			animation: fa-breathe 5.4s ease-in-out infinite;
		}
		.mote {
			animation: fa-mote 11s ease-in-out infinite;
		}
		.m-2 {
			animation-duration: 13s;
			animation-delay: -4s;
		}
		.m-3 {
			animation-duration: 9s;
			animation-delay: -7s;
		}
	}
	@keyframes fa-breathe {
		0%,
		100% {
			opacity: 0.65;
		}
		50% {
			opacity: 1;
		}
	}
	@keyframes fa-mote {
		0%,
		100% {
			transform: translateY(0);
			opacity: 0;
		}
		18% {
			opacity: 0.5;
		}
		60% {
			opacity: 0.3;
		}
		90% {
			transform: translateY(-18px);
			opacity: 0;
		}
	}
</style>
