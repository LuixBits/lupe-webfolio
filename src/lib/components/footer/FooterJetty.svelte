<script lang="ts">
	/*
	 * The jetty (CV footer — »Der Anlegesteg«'s namesake).
	 *
	 * You have been standing on it the whole time: the pond above runs INTO
	 * this footer — a band of open water with small wave marks laps against
	 * the dock's edge board in a foam scallop, pile heads poke through
	 * where the posts carry the deck, and only then come the weathered
	 * plank rows (board joints, knots, grain — all stretch-safe). A
	 * fixed-size center vignette holds the worked details: the mooring
	 * rope arriving out of the water onto its bolted cleat, the spare line
	 * coiled, a glass harbor lamp still lit, and a straw hat someone set
	 * down to watch the koi. Quiet motion only (the lamp breathes);
	 * reduced motion holds still.
	 */

	// the foam scallop where water meets the edge board (20 crests × 60)
	const FOAM =
		'M 0 26 ' +
		Array.from({ length: 20 }, (_, i) => `Q ${i * 60 + 30} 21.5 ${(i + 1) * 60} 26`).join(' ');
</script>

<div class="jetty" aria-hidden="true">
	<!-- water, edge board, piles, planks — edge to edge -->
	<svg class="planks" viewBox="0 0 1200 156" preserveAspectRatio="none">
		<defs>
			<linearGradient id="jt-water" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="#e8f4f8" />
				<stop offset="1" stop-color="#b7dde8" />
			</linearGradient>
		</defs>

		<!-- the pond continues in -->
		<rect class="wtr" x="0" y="0" width="1200" height="26" fill="url(#jt-water)" />
		<g class="wv">
			<path d="M 138 12 Q 145 8 152 12 Q 159 8 166 12" />
			<path d="M 412 16 Q 419 12 426 16 Q 433 12 440 16" />
			<path d="M 752 10 Q 759 6 766 10 Q 773 6 780 10" />
			<path d="M 1002 15 Q 1009 11 1016 15 Q 1023 11 1030 15" />
		</g>
		<path class="foam" d={FOAM} />

		<!-- the edge board, wet along its lip -->
		<rect class="edge" x="0" y="26" width="1200" height="12" />
		<path class="sheen" d="M 0 28.5 L 1200 28.5" />
		<path class="gap" d="M 0 38 L 1200 38" />

		<!-- pile heads carrying the deck -->
		{#each [70, 250, 950, 1130] as px (px)}
			<ellipse class="pile" cx={px} cy="27" rx="10" ry="7" />
			<ellipse class="pile-ring" cx={px} cy="27" rx="5.5" ry="3.6" />
		{/each}

		<!-- the plank rows -->
		<rect class="pk pk-1" x="0" y="40" width="1200" height="38" />
		<rect class="pk pk-2" x="0" y="80" width="1200" height="36" />
		<rect class="pk pk-3" x="0" y="118" width="1200" height="38" />
		<path class="gap" d="M 0 79 L 1200 79 M 0 117 L 1200 117" />
		<path class="joint" d="M 300 42 L 300 76 M 780 42 L 780 76 M 1080 42 L 1080 76" />
		<path class="joint" d="M 150 82 L 150 114 M 560 82 L 560 114 M 960 82 L 960 114" />
		<path class="joint" d="M 420 120 L 420 152 M 860 120 L 860 152 M 1160 120 L 1160 152" />
		<path
			class="grain"
			d="M 0 58 C 160 54 320 62 480 58 C 640 54 800 62 960 58 C 1060 55 1140 59 1200 57"
		/>
		<path class="grain" d="M 0 98 C 200 94 400 102 600 98 C 800 94 1000 102 1200 98" />
		<path
			class="grain"
			d="M 0 138 C 180 134 360 142 540 138 C 720 134 900 142 1080 138 L 1200 137"
		/>
		<g class="knot">
			<ellipse cx="200" cy="60" rx="4" ry="2.6" />
			<ellipse class="knot-ring" cx="200" cy="60" rx="6.5" ry="4" />
			<ellipse cx="1010" cy="66" rx="3.4" ry="2.2" />
			<ellipse class="knot-ring" cx="1010" cy="66" rx="5.6" ry="3.5" />
			<ellipse cx="250" cy="134" rx="4" ry="2.6" />
			<ellipse class="knot-ring" cx="250" cy="134" rx="6.5" ry="4" />
			<ellipse cx="970" cy="142" rx="3.4" ry="2.2" />
			<ellipse class="knot-ring" cx="970" cy="142" rx="5.6" ry="3.5" />
			<ellipse cx="560" cy="146" rx="3" ry="2" />
		</g>
	</svg>

	<!-- the worked center: rope out of the water, cleat, coil, lamp, hat -->
	<svg class="heart" viewBox="0 0 520 156" width="520" height="156" style="left:50%;">
		<!-- the mooring rope arrives through the water band -->
		<path class="rope" d="M 262 -2 C 258 16 266 30 260 44 C 256 53 250 58 244 61" />
		<!-- the cleat, bolted to the planks -->
		<g transform="translate(238 66)">
			<rect class="cl-base" x="-16" y="2" width="32" height="7" rx="2" />
			<path class="cl-horn" d="M -20 0 C -26 -1 -28 -6 -24 -8 L -8 -8 L -8 0 Z" />
			<path class="cl-horn" d="M 20 0 C 26 -1 28 -6 24 -8 L 8 -8 L 8 0 Z" />
			<rect class="cl-post" x="-8" y="-9" width="16" height="12" rx="2" />
			<circle class="nail" cx="-12" cy="6" r="1.4" />
			<circle class="nail" cx="12" cy="6" r="1.4" />
		</g>
		<!-- the spare line, coiled -->
		<g transform="translate(292 78)">
			<ellipse class="coil" rx="20" ry="8" />
			<ellipse class="coil" rx="13" ry="5" />
			<ellipse class="coil" rx="6.5" ry="2.6" />
			<path class="rope" d="M 18 -4 Q 28 -10 30 -18" />
		</g>
		<!-- the glass harbor lamp, still lit -->
		<g transform="translate(360 70)">
			<circle class="lm-glow" r="26" />
			<ellipse class="lm-body" rx="10" ry="12" />
			<ellipse class="lm-flame" cy="2" rx="3" ry="4.5" />
			<rect class="lm-cap" x="-5" y="-17.5" width="10" height="4" rx="1.6" />
			<path class="lm-handle" d="M -4.5 -17.5 C -4.5 -23.5 4.5 -23.5 4.5 -17.5" />
			<rect class="lm-cap" x="-6" y="10.5" width="12" height="3" rx="1.4" />
		</g>
		<!-- the straw hat, set down for the evening watch -->
		<g transform="translate(170 80)">
			<ellipse class="ht-brim" rx="24" ry="8.5" />
			<ellipse class="ht-stitch" rx="18.5" ry="6.3" />
			<ellipse class="ht-crown" cy="-5.5" rx="12.5" ry="6.8" />
			<path class="ht-band" d="M -12.5 -5 Q 0 0.5 12.5 -5" />
		</g>
		<!-- a few honest nails -->
		<circle class="nail" cx="120" cy="48" r="1.5" />
		<circle class="nail" cx="120" cy="96" r="1.5" />
		<circle class="nail" cx="420" cy="52" r="1.5" />
		<circle class="nail" cx="420" cy="100" r="1.5" />
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
	.wv path {
		fill: none;
		stroke: #f2fbfd;
		stroke-width: 1.6;
		stroke-linecap: round;
		opacity: 0.6;
	}
	.foam {
		fill: none;
		stroke: #dff2f6;
		stroke-width: 2.2;
		stroke-linecap: round;
		opacity: 0.85;
	}
	.edge {
		fill: #6b5138;
	}
	.sheen {
		fill: none;
		stroke: #8a6a4a;
		stroke-width: 2;
		opacity: 0.8;
	}
	.pile {
		fill: #533e2a;
		stroke: #2a1d12;
		stroke-width: 1.5;
	}
	.pile-ring {
		fill: #5d452f;
		stroke: #3a2b1c;
		stroke-width: 1;
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
	.joint {
		stroke: #2a1d12;
		stroke-width: 2;
		opacity: 0.55;
	}
	.grain {
		fill: none;
		stroke: #3a2b1c;
		stroke-width: 1.4;
		opacity: 0.8;
	}
	.knot ellipse {
		fill: #3a2b1c;
		opacity: 0.8;
	}
	.knot .knot-ring {
		fill: none;
		stroke: #3a2b1c;
		stroke-width: 1;
		opacity: 0.5;
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
	.lm-glow {
		fill: #ffd98c;
		opacity: 0.2;
	}
	.lm-body {
		fill: #f6dfae;
		stroke: #b98a4a;
		stroke-width: 1.2;
	}
	.lm-flame {
		fill: #f2b04a;
		opacity: 0.9;
	}
	.lm-cap {
		fill: #5c4527;
	}
	.lm-handle {
		fill: none;
		stroke: #5c4527;
		stroke-width: 1.8;
		stroke-linecap: round;
	}
	.ht-brim {
		fill: #d9bd82;
		stroke: #a8895c;
		stroke-width: 1;
	}
	.ht-stitch {
		fill: none;
		stroke: #b89a5e;
		stroke-width: 1;
		opacity: 0.6;
	}
	.ht-crown {
		fill: #cfae6d;
		stroke: #a8895c;
		stroke-width: 1;
	}
	.ht-band {
		fill: none;
		stroke: #b0432f;
		stroke-width: 2.2;
		stroke-linecap: round;
	}

	/* the lamp breathes; nothing else moves */
	@media (prefers-reduced-motion: no-preference) {
		.lm-glow {
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
