<script lang="ts">
	let {} = $props();

	// Deterministic PRNG so the starfield is identical on server and client
	// (SSR-safe: no Math.random() hydration mismatch, no browser globals).
	function mulberry32(seed: number): () => number {
		return () => {
			seed |= 0;
			seed = (seed + 0x6d2b79f5) | 0;
			let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	type Hue = 'star' | 'accent' | 'glint';
	interface Star {
		x: number; // percentage across the band
		y: number; // px from top (band is 156px tall; sky occupies the top ~92px)
		r: number;
		o: number; // peak opacity
		d: number; // twinkle duration (s)
		dl: number; // negative delay to desync (s)
		hue: Hue;
	}

	const rand = mulberry32(982451653);

	const stars: Star[] = Array.from({ length: 84 }, () => {
		const x = rand() * 100;
		// Bias toward the upper sky; stars low near the center are hidden by the
		// (opaque) planet limb, which is exactly where they should disappear.
		const y = 3 + Math.pow(rand(), 1.3) * 92;
		const r = 0.6 + rand() * 1.4;
		const roll = rand();
		return {
			x,
			y,
			r,
			o: 0.35 + rand() * 0.6,
			d: 2.8 + rand() * 4.6,
			dl: -rand() * 8,
			hue: roll > 0.93 ? 'glint' : roll > 0.8 ? 'accent' : 'star'
		};
	});

	// Planetary limb: one clean arc cresting at mid-band (y=40 at 50%) and
	// dipping BELOW the footer bar (y=92) near both edges (~3.5% in from each
	// side), so the horizon rises out of the bar and sets back into it — the
	// silhouette never gets sliced by the strip's left/right edges.
	const limb = 'M0,100 Q720,-20 1440,100';
	const limbFill = 'M0,100 Q720,-20 1440,100 L1440,156 L0,156 Z';
	// Faint contour ridges echoing the curvature (both also exit behind the bar).
	const ridgeA = 'M0,112 Q720,4 1440,112';
	const ridgeB = 'M0,122 Q720,26 1440,122';

	// Hand-placed craters — every one sits fully between the limb and the bar
	// top (y=92), so nothing is ever clipped. y grows toward the viewer.
	const craters = [
		{ x: 202, y: 82, rx: 30, ry: 8 },
		{ x: 352, y: 84, rx: 14, ry: 4.5 },
		{ x: 500, y: 62, rx: 24, ry: 7 },
		{ x: 634, y: 60, rx: 42, ry: 12 },
		{ x: 760, y: 50, rx: 15, ry: 4 },
		{ x: 920, y: 74, rx: 20, ry: 6 },
		{ x: 1054, y: 68, rx: 28, ry: 8.5 },
		{ x: 1240, y: 82, rx: 18, ry: 6 }
	];
</script>

<div class="cosmos" aria-hidden="true">
	<!-- sky: nebula wash + starfield, masked so it fades out toward the top
	     edge (organic dissolve, no hard line where the footer begins) -->
	<div class="sky">
		<div class="neb neb-a"></div>
		<div class="neb neb-b"></div>
		<div class="neb neb-c"></div>

		<svg class="stars" width="100%" height="100%" role="presentation" focusable="false">
			{#each stars as s}
				<circle
					class="star {s.hue}"
					cx="{s.x}%"
					cy={s.y}
					r={s.r}
					style="--o:{s.o}; --d:{s.d}s; --dl:{s.dl}s"
				/>
			{/each}
		</svg>

		<!-- a few larger four-point sparkles -->
		<svg class="sparkle sp-a" viewBox="0 0 12 12" width="11" height="11">
			<path d="M6,0 L7.3,4.7 L12,6 L7.3,7.3 L6,12 L4.7,7.3 L0,6 L4.7,4.7 Z" />
		</svg>
		<svg class="sparkle sp-b" viewBox="0 0 12 12" width="13" height="13">
			<path d="M6,0 L7.3,4.7 L12,6 L7.3,7.3 L6,12 L4.7,7.3 L0,6 L4.7,4.7 Z" />
		</svg>
		<svg class="sparkle sp-c" viewBox="0 0 12 12" width="9" height="9">
			<path d="M6,0 L7.3,4.7 L12,6 L7.3,7.3 L6,12 L4.7,7.3 L0,6 L4.7,4.7 Z" />
		</svg>
	</div>

	<!-- occasional meteors, high in the sky -->
	<span class="shoot shoot-a"></span>
	<span class="shoot shoot-b"></span>

	<!-- atmospheric glow rising behind the crest -->
	<div class="glow"></div>

	<!-- planet limb: opaque surface, craters, luminous atmosphere edge -->
	<svg class="terrain" viewBox="0 0 1440 156" preserveAspectRatio="none" role="presentation" focusable="false">
		<defs>
			<linearGradient id="fc-ground" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" style="stop-color: color-mix(in srgb, var(--cosmos-nebula, #c94848) 58%, var(--hub-bg, #0e1226))" />
				<stop offset="0.3" style="stop-color: color-mix(in srgb, var(--cosmos-nebula, #c94848) 24%, var(--hub-bg, #0e1226))" />
				<stop offset="0.75" style="stop-color: var(--hub-bg, #0e1226)" />
				<stop offset="1" style="stop-color: var(--hub-bg, #0e1226)" />
			</linearGradient>
		</defs>

		<path d={limbFill} fill="url(#fc-ground)" />
		<path class="ridge" d={ridgeA} />
		<path class="ridge ridge-far" d={ridgeB} />

		{#each craters as c}
			<g class="crater">
				<ellipse class="crater-rim" cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} />
				<ellipse class="crater-bowl" cx={c.x} cy={c.y + c.ry * 0.24} rx={c.rx * 0.9} ry={c.ry * 0.8} />
				<ellipse class="crater-floor" cx={c.x} cy={c.y + c.ry * 0.34} rx={c.rx * 0.55} ry={c.ry * 0.45} />
			</g>
		{/each}

		<!-- luminous limb: soft halo + crisp line + travelling glint -->
		<path class="edge-halo" d={limb} />
		<path class="edge-line" d={limb} />
		<path class="edge-glint" d={limb} />
	</svg>

	<!-- observatory on the crest (fixed-size overlay: never stretches, and its
	     ground pad tapers off naturally on the surface) -->
	<svg class="dome" viewBox="0 0 132 46" width="132" height="46" role="presentation" focusable="false">
		<defs>
			<linearGradient id="fc-beam" x1="0" y1="1" x2="0" y2="0">
				<stop offset="0" style="stop-color: var(--accent, #ff7a67); stop-opacity: 0.34" />
				<stop offset="0.75" style="stop-color: var(--accent, #ff7a67); stop-opacity: 0.05" />
				<stop offset="1" style="stop-color: var(--accent, #ff7a67); stop-opacity: 0" />
			</linearGradient>
		</defs>

		<!-- light spilling from the open shutter, fading to nothing upward -->
		<polygon class="beam" points="52.6,17 59.4,17 66,2 50,2" fill="url(#fc-beam)" />

		<!-- ground terrace (tapers to nothing at both ends) -->
		<ellipse class="sil" cx="64" cy="43.6" rx="44" ry="2.2" />

		<!-- dome building -->
		<rect class="sil" x="40" y="30" width="32" height="14" />
		<path class="sil" d="M40,30 A16,15 0 0 1 72,30 Z" />
		<!-- open shutter slit with interior glow -->
		<path class="slit" d="M52.6,15.4 L59.4,15.4 L60.6,30 L51.4,30 Z" />
		<line class="slit-glow" x1="56" y1="16" x2="56" y2="29.4" />
		<!-- catwalk ring + moonlit dome edge -->
		<rect class="lit" x="37.6" y="28.9" width="36.8" height="1.6" rx="0.8" />
		<path class="rim-light" d="M41.6,27.5 A15,14 0 0 1 52.4,16" />
		<!-- beacon -->
		<circle class="beacon" cx="49.6" cy="16.6" r="1.2" />

		<!-- low annex wing + lit windows -->
		<rect class="sil" x="72" y="36" width="30" height="8" />
		<rect class="win" x="79.6" y="38.6" width="2.2" height="2.2" />
		<rect class="win" x="87.6" y="38.6" width="2.2" height="2.2" />
		<!-- small equipment hut on the other side -->
		<rect class="sil" x="27" y="38" width="12" height="6" />
		<rect class="door" x="31.6" y="40" width="2.4" height="4" />
	</svg>

	<!-- small radio dish further along the horizon -->
	<svg class="dish" viewBox="0 0 54 26" width="54" height="26" role="presentation" focusable="false">
		<ellipse class="sil" cx="27" cy="24.6" rx="12" ry="1.6" />
		<path class="sil" d="M24,25 L26,13.5 L30,13.5 L32,25 Z" />
		<g transform="rotate(-32 28 11)">
			<ellipse class="sil" cx="28" cy="11" rx="12.5" ry="4" />
			<ellipse class="dish-rim" cx="28" cy="11" rx="12.5" ry="4" />
			<line class="feed" x1="28" y1="11" x2="28" y2="2.6" />
			<circle class="feed-tip" cx="28" cy="2.4" r="1" />
		</g>
	</svg>

	<!-- a satellite drifting slowly across the sky -->
	<svg class="sat" viewBox="0 0 58 22" width="58" height="22" role="presentation" focusable="false">
		<line class="sat-strut" x1="21" y1="11.5" x2="37" y2="11.5" />
		<rect class="panel" x="1" y="8" width="20" height="7" rx="1" />
		<rect class="panel" x="37" y="8" width="20" height="7" rx="1" />
		<line class="cell" x1="8" y1="8.6" x2="8" y2="14.4" />
		<line class="cell" x1="14.5" y1="8.6" x2="14.5" y2="14.4" />
		<line class="cell" x1="43.5" y1="8.6" x2="43.5" y2="14.4" />
		<line class="cell" x1="50" y1="8.6" x2="50" y2="14.4" />
		<rect class="body" x="23" y="6.5" width="12" height="10" rx="2" />
		<line class="antenna" x1="29" y1="6.5" x2="29" y2="2.6" />
		<circle class="ping" cx="29" cy="2.2" r="1.2" />
	</svg>
</div>

<style>
	.cosmos {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		contain: strict;
	}

	/* ---------- sky (masked: dissolves toward the top edge) ---------- */
	.sky {
		position: absolute;
		inset: 0;
		-webkit-mask-image: linear-gradient(to bottom, transparent, #000 32px);
		mask-image: linear-gradient(to bottom, transparent, #000 32px);
	}

	.neb {
		position: absolute;
		border-radius: 50%;
		filter: blur(26px);
		mix-blend-mode: screen;
		will-change: transform;
		animation: drift 38s ease-in-out infinite alternate;
	}
	.neb-a {
		left: 4%;
		top: -18px;
		width: 46%;
		height: 120px;
		background: radial-gradient(
			closest-side,
			color-mix(in srgb, var(--cosmos-nebula, #c94848) 46%, transparent),
			transparent 72%
		);
	}
	.neb-b {
		right: 2%;
		top: -8px;
		width: 38%;
		height: 104px;
		background: radial-gradient(
			closest-side,
			color-mix(in srgb, var(--cosmos-glint, #ffab7a) 30%, transparent),
			transparent 72%
		);
		animation-duration: 46s;
		animation-delay: -14s;
	}
	.neb-c {
		left: 38%;
		top: 6px;
		width: 30%;
		height: 80px;
		background: radial-gradient(
			closest-side,
			color-mix(in srgb, var(--cosmos-dust, #7668c4) 26%, transparent),
			transparent 72%
		);
		animation-duration: 30s;
		animation-delay: -7s;
	}
	@keyframes drift {
		from {
			transform: translate3d(0, 0, 0) scale(1);
		}
		to {
			transform: translate3d(3.5%, 7px, 0) scale(1.08);
		}
	}

	/* ---------- stars ---------- */
	.stars {
		position: absolute;
		inset: 0;
		display: block;
	}
	.star {
		fill: var(--cosmos-star, #cfe6ff);
		opacity: var(--o, 0.7);
		transform-box: fill-box;
		transform-origin: center;
		animation: twinkle var(--d, 4s) ease-in-out var(--dl, 0s) infinite;
	}
	.star.accent {
		fill: var(--accent, #ff7a67);
	}
	.star.glint {
		fill: var(--cosmos-glint, #ffab7a);
	}
	@keyframes twinkle {
		0%,
		100% {
			opacity: calc(var(--o, 0.7) * 0.22);
			transform: scale(0.85);
		}
		50% {
			opacity: var(--o, 0.7);
			transform: scale(1.2);
		}
	}

	.sparkle {
		position: absolute;
		fill: var(--cosmos-star, #cfe6ff);
		animation: sparkle 7s ease-in-out infinite;
	}
	.sp-a {
		left: 11%;
		top: 22px;
	}
	.sp-b {
		left: 44%;
		top: 13px;
		fill: var(--accent, #ff7a67);
		animation-delay: -2.6s;
		animation-duration: 9s;
	}
	.sp-c {
		left: 86%;
		top: 27px;
		fill: var(--cosmos-glint, #ffab7a);
		animation-delay: -5s;
		animation-duration: 8s;
	}
	@keyframes sparkle {
		0%,
		100% {
			opacity: 0.25;
			transform: scale(0.8) rotate(0deg);
		}
		50% {
			opacity: 0.95;
			transform: scale(1.1) rotate(24deg);
		}
	}

	/* ---------- meteors (fade in/out mid-flight, never popped at an edge) ---------- */
	.shoot {
		position: absolute;
		left: -8%;
		width: 110px;
		height: 2px;
		border-radius: 2px;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in srgb, var(--cosmos-star, #cfe6ff) 85%, transparent) 60%,
			var(--cosmos-star, #cfe6ff)
		);
		filter: drop-shadow(0 0 6px var(--accent, #ff7a67));
		opacity: 0;
		will-change: transform, opacity;
	}
	.shoot-a {
		top: 12px;
		animation: shoot 13s linear 2.5s infinite;
	}
	.shoot-b {
		top: 28px;
		width: 84px;
		animation: shoot 21s linear 9s infinite;
	}
	@keyframes shoot {
		0% {
			transform: translate3d(0, 0, 0) rotate(6deg);
			opacity: 0;
		}
		1.5% {
			opacity: 0.9;
		}
		8% {
			transform: translate3d(58vw, 14px, 0) rotate(6deg);
			opacity: 0;
		}
		100% {
			transform: translate3d(58vw, 14px, 0) rotate(6deg);
			opacity: 0;
		}
	}

	/* ---------- atmosphere glow behind the crest ---------- */
	.glow {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 64px;
		height: 104px;
		background: radial-gradient(
			52% 100% at 57% 100%,
			color-mix(in srgb, var(--accent, #ff7a67) 26%, transparent),
			color-mix(in srgb, var(--cosmos-nebula, #c94848) 12%, transparent) 55%,
			transparent 78%
		);
		animation: breathe 9s ease-in-out infinite;
	}
	@keyframes breathe {
		0%,
		100% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
	}

	/* ---------- planet surface ---------- */
	.terrain {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}
	.ridge {
		fill: none;
		stroke: color-mix(in srgb, var(--cosmos-star, #cfe6ff) 14%, transparent);
		stroke-width: 1;
	}
	.ridge-far {
		stroke: color-mix(in srgb, var(--cosmos-star, #cfe6ff) 8%, transparent);
	}
	.crater-rim {
		fill: color-mix(in srgb, var(--cosmos-star, #cfe6ff) 22%, transparent);
	}
	.crater-bowl {
		fill: color-mix(in srgb, #050516 62%, transparent);
	}
	.crater-floor {
		fill: color-mix(in srgb, var(--cosmos-nebula, #c94848) 16%, transparent);
	}
	.edge-halo,
	.edge-line,
	.edge-glint {
		fill: none;
		stroke-linecap: round;
	}
	.edge-halo {
		stroke: var(--cosmos-nebula, #c94848);
		stroke-width: 6;
		opacity: 0.42;
		filter: blur(4px);
	}
	.edge-line {
		stroke: var(--accent, #ff7a67);
		stroke-width: 1.5;
		opacity: 0.8;
	}
	.edge-glint {
		stroke: var(--cosmos-glint, #ffab7a);
		stroke-width: 2;
		opacity: 0.9;
		stroke-dasharray: 12 1600;
		animation: glide 16s linear infinite;
	}
	@keyframes glide {
		from {
			stroke-dashoffset: 0;
		}
		to {
			stroke-dashoffset: -1612;
		}
	}

	/* ---------- observatory (crest sits at y≈42 at 60% across; ground 46) ---------- */
	.dome {
		position: absolute;
		left: calc(60% - 66px);
		top: 2px;
		overflow: visible;
	}
	.dish {
		position: absolute;
		left: calc(30% - 27px);
		top: 28px;
	}
	.sil {
		fill: color-mix(in srgb, var(--hub-bg, #0e1226) 36%, #030314);
	}
	.slit {
		fill: color-mix(in srgb, var(--accent, #ff7a67) 30%, #081020);
	}
	.slit-glow {
		stroke: var(--accent, #ff7a67);
		stroke-width: 1.6;
		stroke-linecap: round;
		opacity: 0.8;
	}
	.lit {
		fill: color-mix(in srgb, var(--cosmos-star, #cfe6ff) 20%, #081020);
	}
	.rim-light {
		fill: none;
		stroke: color-mix(in srgb, var(--cosmos-star, #cfe6ff) 45%, transparent);
		stroke-width: 1;
		stroke-linecap: round;
	}
	.beacon {
		fill: var(--cosmos-glint, #ffab7a);
		animation: beacon 5s ease-in-out infinite;
	}
	@keyframes beacon {
		0%,
		100% {
			opacity: 0.25;
		}
		50% {
			opacity: 1;
		}
	}
	.beam {
		animation: beam 11s ease-in-out infinite;
		transform-origin: 56px 17px;
	}
	@keyframes beam {
		0%,
		100% {
			opacity: 0.55;
		}
		50% {
			opacity: 1;
		}
	}
	.win {
		fill: var(--accent, #ff7a67);
		opacity: 0.6;
	}
	.door {
		fill: #01010a;
	}
	.dish-rim {
		fill: none;
		stroke: color-mix(in srgb, var(--accent, #ff7a67) 45%, transparent);
		stroke-width: 0.8;
	}
	.feed {
		stroke: color-mix(in srgb, var(--cosmos-star, #cfe6ff) 55%, #081020);
		stroke-width: 1.1;
		stroke-linecap: round;
	}
	.feed-tip {
		fill: var(--accent, #ff7a67);
		opacity: 0.8;
	}

	/* ---------- satellite drifting across (fades in/out mid-sky) ---------- */
	.sat {
		position: absolute;
		left: 18%;
		top: 2px; /* high lane: clears the dish (top 28) and the dome apex */
		--sat-drift: 36vw; /* stops short of the observatory before fading out */
		transform: rotate(-6deg);
		opacity: 0;
		will-change: transform, opacity;
		animation: sat-drift 76s linear infinite;
	}
	@media (max-width: 40rem) {
		.sat {
			--sat-drift: 18vw;
		}
	}
	.panel {
		fill: color-mix(in srgb, var(--cosmos-star, #cfe6ff) 55%, #102a44);
		opacity: 0.85;
	}
	.cell {
		stroke: color-mix(in srgb, #041022 80%, transparent);
		stroke-width: 1;
	}
	.sat-strut {
		stroke: color-mix(in srgb, var(--cosmos-star, #cfe6ff) 70%, transparent);
		stroke-width: 1.4;
	}
	.body {
		fill: var(--cosmos-star, #cfe6ff);
		opacity: 0.92;
	}
	.antenna {
		stroke: var(--cosmos-star, #cfe6ff);
		stroke-width: 1;
		opacity: 0.85;
	}
	.ping {
		fill: var(--cosmos-glint, #ffab7a);
		animation: beacon 3s ease-in-out infinite;
	}
	/* Materialises inside the strip and dissolves before reaching the far side —
	   the silhouette is never caught sliced at an edge. */
	@keyframes sat-drift {
		0% {
			transform: translate3d(0, 3px, 0) rotate(-6deg);
			opacity: 0;
		}
		6% {
			opacity: 0.9;
		}
		42% {
			opacity: 0.9;
		}
		50% {
			transform: translate3d(var(--sat-drift, 36vw), -2px, 0) rotate(-6deg);
			opacity: 0;
		}
		100% {
			transform: translate3d(var(--sat-drift, 36vw), -2px, 0) rotate(-6deg);
			opacity: 0;
		}
	}

	/* ---------- reduced motion: a calm still sky ---------- */
	@media (prefers-reduced-motion: reduce) {
		.neb,
		.star,
		.sparkle,
		.glow,
		.edge-glint,
		.beacon,
		.beam,
		.ping {
			animation: none;
		}
		.star {
			opacity: calc(var(--o, 0.7) * 0.8);
			transform: none;
		}
		.sparkle {
			opacity: 0.6;
			transform: none;
		}
		.edge-glint {
			stroke-dasharray: none;
			opacity: 0.25;
		}
		.glow {
			opacity: 0.8;
		}
		.beacon {
			opacity: 0.7;
		}
		.beam {
			opacity: 0.55;
		}
		.shoot {
			display: none;
		}
		/* satellite parks fully visible in the western sky */
		.sat {
			animation: none;
			opacity: 0.9;
		}
	}
</style>
