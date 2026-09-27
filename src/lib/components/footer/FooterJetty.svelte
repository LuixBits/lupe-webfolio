<script lang="ts">
	/*
	 * The jetty (CV footer — »Der Anlegesteg«'s namesake).
	 *
	 * You have been standing on it the whole time: the pond above ends at
	 * this weathered wooden dock. Full-width plank rows (amorphous grain
	 * lines, safe to stretch) run edge to edge; a fixed-size center
	 * vignette holds the worked details — the mooring cleat with the rope
	 * coming up out of the water, its coil, a lit chōchin resting beside a
	 * pair of geta sandals someone stepped out of to watch the koi. The
	 * water laps the jetty's edge along the top. Quiet motion only (the
	 * lantern breathes); reduced motion holds still.
	 */

	// lap line along the jetty's top edge (1200-unit period, stretch-safe)
	const LAP =
		'M 0 7 C 90 3 180 9 290 6 C 400 3 500 9 610 6 C 720 3 820 9 930 6 C 1040 3 1130 8 1200 5';
</script>

<div class="jetty" aria-hidden="true">
	<!-- the planks, edge to edge -->
	<svg class="planks" viewBox="0 0 1200 156" preserveAspectRatio="none">
		<rect class="pk pk-1" x="0" y="8" width="1200" height="50" />
		<rect class="pk pk-2" x="0" y="60" width="1200" height="48" />
		<rect class="pk pk-3" x="0" y="110" width="1200" height="46" />
		<path class="gap" d="M 0 58 L 1200 58 M 0 108 L 1200 108" />
		<path
			class="grain"
			d="M 0 30 C 160 26 320 34 480 30 C 640 26 800 34 960 30 C 1060 27 1140 31 1200 29"
		/>
		<path class="grain" d="M 0 86 C 200 82 400 90 600 86 C 800 82 1000 90 1200 86" />
		<path
			class="grain"
			d="M 0 132 C 180 128 360 136 540 132 C 720 128 900 136 1080 132 L 1200 131"
		/>
		<!-- the water lapping the edge -->
		<rect class="edge" x="0" y="0" width="1200" height="9" />
		<path class="lap" d={LAP} />
	</svg>

	<!-- the worked center: cleat, rope from the pond, chōchin, geta -->
	<svg class="heart" viewBox="0 0 520 156" width="520" height="156" style="left:50%;">
		<!-- the mooring rope arrives from the water above -->
		<path class="rope" d="M 262 -2 C 258 14 266 26 260 40 C 256 49 250 54 244 57" />
		<!-- the cleat, bolted to the planks -->
		<g transform="translate(238 62)">
			<rect class="cl-base" x="-16" y="2" width="32" height="7" rx="2" />
			<path class="cl-horn" d="M -20 0 C -26 -1 -28 -6 -24 -8 L -8 -8 L -8 0 Z" />
			<path class="cl-horn" d="M 20 0 C 26 -1 28 -6 24 -8 L 8 -8 L 8 0 Z" />
			<rect class="cl-post" x="-8" y="-9" width="16" height="12" rx="2" />
			<circle class="nail" cx="-12" cy="6" r="1.4" />
			<circle class="nail" cx="12" cy="6" r="1.4" />
		</g>
		<!-- the spare line, coiled -->
		<g transform="translate(292 74)">
			<ellipse class="coil" rx="20" ry="8" />
			<ellipse class="coil" rx="13" ry="5" />
			<ellipse class="coil" rx="6.5" ry="2.6" />
			<path class="rope" d="M 18 -4 Q 28 -10 30 -18" />
		</g>
		<!-- the chōchin, set down for the evening walk -->
		<g transform="translate(360 66)">
			<circle class="ch-glow" r="26" />
			<ellipse class="ch-body" rx="12" ry="15" />
			<path class="ch-rib" d="M -12 0 L 12 0 M -10.6 -6.5 L 10.6 -6.5 M -10.6 6.5 L 10.6 6.5" />
			<rect class="ch-cap" x="-6" y="-19.5" width="12" height="4.5" rx="1.6" />
			<rect class="ch-cap" x="-6" y="15" width="12" height="4.5" rx="1.6" />
		</g>
		<!-- the geta, stepped out of -->
		<g transform="translate(172 78)">
			<g transform="rotate(-8)">
				<ellipse class="gt-sole" rx="13" ry="5.5" />
				<path class="gt-strap" d="M -6 -3 Q 0 -7 7 -2.6" />
			</g>
			<g transform="translate(26 6) rotate(5)">
				<ellipse class="gt-sole" rx="13" ry="5.5" />
				<path class="gt-strap" d="M -6 -3 Q 0 -7 7 -2.6" />
			</g>
		</g>
		<!-- a few honest nails -->
		<circle class="nail" cx="120" cy="40" r="1.5" />
		<circle class="nail" cx="120" cy="90" r="1.5" />
		<circle class="nail" cx="420" cy="44" r="1.5" />
		<circle class="nail" cx="420" cy="94" r="1.5" />
	</svg>
</div>

<style>
	.jetty {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.jetty svg {
		display: block;
	}
	.planks {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.pk-1 {
		fill: #533e2a;
	}
	.pk-2 {
		fill: #4a3725;
	}
	.pk-3 {
		fill: #423122;
	}
	.gap {
		stroke: #2a1d12;
		stroke-width: 2.5;
	}
	.grain {
		fill: none;
		stroke: #3a2b1c;
		stroke-width: 1.4;
		opacity: 0.8;
	}
	.edge {
		fill: #6b5138;
	}
	.lap {
		fill: none;
		stroke: #bfe0e8;
		stroke-width: 2;
		stroke-linecap: round;
		opacity: 0.55;
	}

	.heart {
		position: absolute;
		top: 0;
		margin-left: -260px;
	}
	.rope {
		fill: none;
		stroke: #c9a86a;
		stroke-width: 3;
		stroke-linecap: round;
		opacity: 0.95;
	}
	.cl-base {
		fill: #2f3a42;
	}
	.cl-horn,
	.cl-post {
		fill: #46545e;
		stroke: #232c33;
		stroke-width: 1;
	}
	.coil {
		fill: none;
		stroke: #c9a86a;
		stroke-width: 3;
		opacity: 0.95;
	}
	.nail {
		fill: #8a7358;
	}
	.ch-glow {
		fill: #ffd98c;
		opacity: 0.2;
	}
	.ch-body {
		fill: #f6dfae;
		stroke: #b98a4a;
		stroke-width: 1.2;
	}
	.ch-rib {
		fill: none;
		stroke: #b98a4a;
		stroke-width: 0.7;
		opacity: 0.7;
	}
	.ch-cap {
		fill: #5c4527;
	}
	.gt-sole {
		fill: #6b5138;
		stroke: #3a2b1c;
		stroke-width: 1;
	}
	.gt-strap {
		fill: none;
		stroke: #b0432f;
		stroke-width: 2;
		stroke-linecap: round;
	}

	/* the lantern breathes; nothing else moves */
	@media (prefers-reduced-motion: no-preference) {
		.ch-glow {
			animation: jy-breathe 5.6s ease-in-out infinite;
		}
	}
	@keyframes jy-breathe {
		0%,
		100% {
			opacity: 0.16;
		}
		50% {
			opacity: 0.3;
		}
	}
</style>
