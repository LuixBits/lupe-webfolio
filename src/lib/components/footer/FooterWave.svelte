<script lang="ts">
	/** Water-theme footer decoration: a Hokusai-inspired great-wave finale.
	 *  Three parallax bands — a faint far swell, a seigaiha-patterned water
	 *  body, and a deep-indigo front wave with curling crests, foam claws and
	 *  spray — plus a koi leaping between the crests. All geometry is
	 *  hand-authored on a 1200-unit period and duplicated for a seamless
	 *  -50% drift loop; constants only, so SSR and client render identically.
	 *  The front band's gradient bottoms out on var(--hub-bg) so the water
	 *  merges into the footer bar — a deliberate ground, nothing sliced. */

	const P = 1200; // one wave period, in user units
	const H = 156; // deco height = waveHeight (92) + barHeight (64)

	// --- surface lines (one period; start/end tangents match for a seamless loop) ---
	const farSurface =
		'M0,44 C30,40 90,30 170,26 C250,22 330,26 410,36 C480,44 550,50 630,49 C710,48 790,36 870,28 C950,21 1030,24 1100,33 C1130,37 1170,48 1200,44';
	const midSurface =
		'M0,58 C30,54 90,48 170,47 C250,46 320,52 410,58 C500,64 570,66 650,62 C730,58 800,50 880,47 C960,44 1040,48 1110,54 C1140,57 1170,62 1200,58';
	const frontSurface =
		'M0,92 C30,90 60,85 100,81 C135,78 175,85 215,90 C240,93 258,93 270,93 C330,94 370,82 405,62 C435,45 455,28 478,20 C495,15 510,15 525,17 C565,21 605,40 650,64 C700,90 740,94 790,94 C840,94 870,82 908,66 C940,53 960,44 985,43 C1010,44 1032,53 1062,68 C1110,85 1170,94 1200,92';
	const closeBand = ` L${P},${H} L0,${H} Z`;

	// --- breaking crest lips (filled with the same gradient, so they merge
	//     into the mound; the gap they leave open is the barrel window) ---
	const bigLip =
		'M572,26 C498,2 418,6 380,38 C366,52 370,66 386,72 C400,77 411,69 407,58 C405,50 418,44 440,42 C490,38 532,38 560,44 C566,40 570,42 572,46 Z';
	const bigLipFoam = 'M572,26 C498,2 418,6 380,38 C366,52 370,66 386,72';
	const smallLip =
		'M1018,48 C972,28 928,30 906,48 C897,58 900,70 912,74 C922,77 930,70 927,62 C925,55 936,51 952,51 C978,50 998,53 1010,56 C1014,53 1016,51 1018,48 Z';
	const smallLipFoam = 'M1018,48 C972,28 928,30 906,48 C900,55 899,62 904,68';
	const crestCap = 'M525,17 C555,19 580,28 600,38';

	// Hokusai finger-foam claw, pointing down-left from its origin.
	const CLAW = 'M0,0 C-8,1 -14,8 -14,17 C-10,9 -4,5 4,4 Z';
	const claws = [
		// big crest: fingers at the hook tip, wrapping the curl
		{ x: 372, y: 50, s: 1.1, a: -10 },
		{ x: 374, y: 62, s: 0.95, a: 15 },
		{ x: 385, y: 70, s: 0.8, a: 40 },
		// big crest: foam drips from the crown into the dark face
		{ x: 420, y: 30, s: 0.9, a: -15 },
		{ x: 455, y: 24, s: 0.95, a: -20 },
		{ x: 492, y: 20, s: 0.85, a: -25 },
		{ x: 528, y: 22, s: 0.75, a: -25 },
		// small crest
		{ x: 900, y: 58, s: 0.8, a: -15 },
		{ x: 903, y: 68, s: 0.65, a: 20 },
		{ x: 940, y: 34, s: 0.7, a: -25 },
		{ x: 972, y: 32, s: 0.65, a: -25 }
	];
	// foam streaks combed down the wave faces
	const streaks = [
		'M310,92 C345,88 378,70 408,50',
		'M452,86 C470,64 484,44 498,30',
		'M560,34 C590,46 618,60 642,74',
		'M852,90 C876,78 898,66 914,56'
	];
	const spray = [
		{ x: 352, y: 42, r: 3.2 },
		{ x: 334, y: 55, r: 2.6 },
		{ x: 360, y: 66, r: 2.4 },
		{ x: 318, y: 68, r: 1.9 },
		{ x: 342, y: 30, r: 2.2 },
		{ x: 372, y: 22, r: 1.8 },
		{ x: 300, y: 78, r: 1.5 },
		{ x: 888, y: 40, r: 2.2 },
		{ x: 872, y: 50, r: 1.7 },
		{ x: 858, y: 60, r: 1.3 },
		{ x: 902, y: 30, r: 1.5 }
	];

	// --- seigaiha (blue-sea-wave) fan pattern: staggered rows of concentric
	//     rings, each disc over-painting the row above (classic occlusion) ---
	const SEI_ROW = 20;
	const SEI_R = [23, 17, 11, 5];
	const seiCenters: Array<[number, number]> = [];
	for (let row = -1; row <= 3; row++) {
		const y = row * SEI_ROW;
		const xs = row % 2 !== 0 ? [-20, 20, 60] : [0, 40];
		for (const x of xs) seiCenters.push([x, y]);
	}

	// --- koi, leaping between the crests (own 140x90 viewBox, fully inside) ---
	const koiBody =
		'M18,20 C36,13 58,17 76,29 C90,38 99,48 106,60 C115,55 123,47 127,36 C129,47 127,57 121,64 C127,67 132,72 134,78 C126,77 118,76 111,72 C95,64 82,56 68,47 C52,37 34,31 20,32 C13,30 13,24 18,20 Z';
</script>

<div class="wave">
	<div class="band" style="--bob:2px; --bob-dur:13s;">
		<div class="drift" style="--dur:84s; animation-delay:-31s;">
			<svg viewBox="0 0 {P * 2} {H}" preserveAspectRatio="none">
				<defs>
					<g id="fw-far">
						<path d={farSurface + closeBand} fill="var(--fw-far)" />
					</g>
				</defs>
				<use href="#fw-far" />
				<use href="#fw-far" x={P} />
			</svg>
		</div>
	</div>

	<div class="band" style="--bob:3px; --bob-dur:10s; animation-delay:-4s;">
		<div class="drift" style="--dur:56s; animation-delay:-12s;">
			<svg viewBox="0 0 {P * 2} {H}" preserveAspectRatio="none">
				<defs>
					<pattern id="fw-sei" width="40" height="40" patternUnits="userSpaceOnUse">
						{#each seiCenters as [cx, cy], i (i)}
							<circle {cx} {cy} r={SEI_R[0] + 1.2} fill="var(--fw-mid)" />
							{#each SEI_R as r (r)}
								<circle {cx} {cy} {r} fill="none" stroke="var(--fw-sei-line)" stroke-width="1.8" />
							{/each}
						{/each}
					</pattern>
					<g id="fw-mid-g">
						<path d={midSurface + closeBand} fill="var(--fw-mid)" />
						<path d={midSurface + closeBand} fill="url(#fw-sei)" />
						<path d={midSurface} transform="translate(0,7)" fill="none" stroke="var(--fw-foam)" stroke-width="1.4" opacity="0.3" />
						<path d={midSurface} fill="none" stroke="var(--fw-foam)" stroke-width="2.2" opacity="0.85" />
					</g>
				</defs>
				<use href="#fw-mid-g" />
				<use href="#fw-mid-g" x={P} />
			</svg>
		</div>
	</div>

	<div class="koi">
		<svg viewBox="0 0 140 90">
			<defs>
				<clipPath id="fw-koi-clip"><path d={koiBody} /></clipPath>
			</defs>
			<!-- splash arc + droplets where the tail left the water -->
			<path d="M96,86 q14,5 28,1" fill="none" stroke="var(--fw-foam)" stroke-width="1.6" opacity="0.55" />
			<circle cx="118" cy="80" r="2" fill="var(--fw-foam)" opacity="0.8" />
			<circle cx="128" cy="84" r="1.6" fill="var(--fw-foam)" opacity="0.7" />
			<circle cx="104" cy="82" r="2.2" fill="var(--fw-foam)" opacity="0.6" />
			<!-- pectoral fin below the body -->
			<path d="M44,34 C40,44 32,50 22,52 C30,44 34,38 36,33 Z" fill="var(--fw-koi)" stroke="var(--fw-ink)" stroke-width="0.8" opacity="0.9" />
			<!-- body -->
			<path d={koiBody} fill="var(--fw-koi)" stroke="var(--fw-ink)" stroke-width="1.6" />
			<g clip-path="url(#fw-koi-clip)">
				<circle cx="33" cy="26" r="8" fill="var(--fw-foam)" opacity="0.95" />
				<circle cx="76" cy="37" r="10" fill="var(--fw-foam)" opacity="0.95" />
				<circle cx="101" cy="59" r="6" fill="var(--fw-foam)" opacity="0.95" />
				<path d="M60,32 q7,4 13,2 M56,40 q7,4 13,2 M72,42 q7,3 13,1" fill="none" stroke="var(--fw-ink)" stroke-width="1" opacity="0.4" />
			</g>
			<!-- dorsal fin -->
			<path d="M60,17 C68,9 80,10 88,18 C79,15 69,15 62,20 Z" fill="var(--fw-koi)" stroke="var(--fw-ink)" stroke-width="0.8" />
			<!-- gill, eye, mouth -->
			<path d="M36,22 C40,26 42,30 42,34" fill="none" stroke="var(--fw-ink)" stroke-width="1.1" opacity="0.6" />
			<circle cx="30" cy="24" r="2.4" fill="var(--fw-ink)" />
			<path d="M14,26 q3,2 6,2" fill="none" stroke="var(--fw-ink)" stroke-width="1" opacity="0.6" />
		</svg>
	</div>

	<div class="band" style="--bob:3px; --bob-dur:8s; animation-delay:-2s;">
		<div class="drift" style="--dur:34s; animation-delay:-9s;">
			<svg viewBox="0 0 {P * 2} {H}" preserveAspectRatio="none">
				<defs>
					<linearGradient id="fw-deep" x1="0" y1="18" x2="0" y2="104" gradientUnits="userSpaceOnUse">
						<stop offset="0" stop-color="var(--fw-deep-top)" />
						<stop offset="1" stop-color="var(--hub-bg)" />
					</linearGradient>
					<g id="fw-front-g">
						<path d={frontSurface + closeBand} fill="url(#fw-deep)" />
						<path d={bigLip} fill="url(#fw-deep)" />
						<path d={smallLip} fill="url(#fw-deep)" />
						<path d={frontSurface} fill="none" stroke="var(--fw-foam)" stroke-width="1.5" opacity="0.4" />
						<path d={crestCap} fill="none" stroke="var(--fw-foam)" stroke-width="2" opacity="0.4" stroke-linecap="round" />
						<path d={bigLipFoam} fill="none" stroke="var(--fw-foam)" stroke-width="12" opacity="0.25" stroke-linecap="round" />
						<path d={bigLipFoam} fill="none" stroke="var(--fw-foam)" stroke-width="6.5" opacity="0.95" stroke-linecap="round" />
						<path d={smallLipFoam} fill="none" stroke="var(--fw-foam)" stroke-width="9" opacity="0.25" stroke-linecap="round" />
						<path d={smallLipFoam} fill="none" stroke="var(--fw-foam)" stroke-width="5" opacity="0.95" stroke-linecap="round" />
						{#each streaks as d (d)}
							<path {d} fill="none" stroke="var(--fw-foam)" stroke-width="2" opacity="0.22" stroke-linecap="round" />
						{/each}
						{#each claws as c, i (i)}
							<g transform="translate({c.x} {c.y}) rotate({c.a}) scale({c.s})">
								<path d={CLAW} fill="var(--fw-foam)" opacity="0.95" />
							</g>
						{/each}
						{#each spray as s, i (i)}
							<circle cx={s.x} cy={s.y} r={s.r} fill="var(--fw-foam)" opacity="0.8" />
						{/each}
					</g>
				</defs>
				<use href="#fw-front-g" />
				<use href="#fw-front-g" x={P} />
			</svg>
		</div>
	</div>
</div>

<style>
	.wave {
		position: absolute;
		inset: 0;
		overflow: hidden;
		--fw-foam: var(--water-foam);
		--fw-far: color-mix(in srgb, var(--water-deep) 48%, transparent);
		--fw-mid: color-mix(in srgb, var(--water-deep) 85%, var(--hub-bg));
		--fw-sei-line: color-mix(in srgb, var(--water-foam) 55%, transparent);
		--fw-deep-top: color-mix(in srgb, var(--water-deep) 36%, var(--hub-bg));
		--fw-ink: color-mix(in srgb, var(--hub-bg) 70%, var(--water-deep));
		--fw-koi: color-mix(in srgb, var(--accent) 78%, var(--hub-bg));
	}
	.band {
		position: absolute;
		inset: 0;
		animation: bob var(--bob-dur, 9s) ease-in-out infinite;
		will-change: transform;
	}
	.drift {
		position: absolute;
		inset: 0;
		width: 200%;
		min-width: 2400px;
		animation: drift var(--dur, 40s) linear infinite;
		will-change: transform;
	}
	.drift svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	.koi {
		position: absolute;
		left: 56%;
		top: 8px;
		width: 96px;
		animation: leap 9s ease-in-out infinite;
		will-change: transform;
	}
	.koi svg {
		display: block;
		width: 100%;
		height: auto;
	}
	@keyframes drift {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			transform: translate3d(-50%, 0, 0);
		}
	}
	@keyframes bob {
		0%,
		100% {
			transform: translate3d(0, var(--bob, 3px), 0);
		}
		50% {
			transform: translate3d(0, calc(-1 * var(--bob, 3px)), 0);
		}
	}
	@keyframes leap {
		0%,
		100% {
			transform: translate3d(0, 3px, 0) rotate(2deg);
		}
		50% {
			transform: translate3d(0, -4px, 0) rotate(-3deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.band,
		.drift,
		.koi {
			animation: none;
		}
	}
</style>
