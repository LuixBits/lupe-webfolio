<script lang="ts">
	/** Water-theme footer decoration: a Hokusai-inspired great-wave finale.
	 *  Three parallax bands — a faint far swell, a seigaiha-patterned water
	 *  body, and a deep-indigo front wave authored as a true Kanagawa-style
	 *  breaker: a long concave face sweeping up into an overhanging curl,
	 *  the outline doubling back around a claw tip so the barrel opens as a
	 *  window onto the seigaiha band behind, foam fingers hanging from the
	 *  curl's underside. All geometry is hand-authored on a 1200-unit period
	 *  and duplicated for a seamless -50% drift loop; constants only, so SSR
	 *  and client render identically. The front band's gradient bottoms out
	 *  on var(--hub-bg) so the water merges into the footer bar — a
	 *  deliberate ground, nothing sliced. */

	const P = 1200; // one wave period, in user units
	const H = 156; // deco height = waveHeight (92) + barHeight (64)

	// --- surface lines (one period; start/end tangents match for a seamless loop) ---
	const farSurface =
		'M0,44 C30,40 90,30 170,26 C250,22 330,26 410,36 C480,44 550,50 630,49 C710,48 790,36 870,28 C950,21 1030,24 1100,33 C1130,37 1170,48 1200,44';
	const midSurface =
		'M0,58 C30,54 90,48 170,47 C250,46 320,52 410,58 C500,64 570,66 650,62 C730,58 800,50 880,47 C960,44 1040,48 1110,54 C1140,57 1170,62 1200,58';

	// Front wave outline. Traced left→right, but the path deliberately doubles
	// back at each crest: up the concave face, left along the barrel ceiling,
	// around the claw tip, then right again over the curl's top and down the
	// long back slope — the classic great-wave topology, curl facing the
	// direction of drift.
	const frontSurface =
		// foreground swell into the trough / barrel floor
		'M0,90 C30,90 60,88 95,85 C125,83 150,83 180,86 C210,89 235,93 262,95' +
		' C300,96 340,97 380,97 C420,97 470,97 510,96' +
		// concave face sweeping up-left into the curl's underside (barrel ceiling)
		' C504,78 487,58 455,44 C432,32 405,26 375,25 C346,25 322,30 310,38' +
		// claw: inner edge down to the tip, then around the outside back up
		' C304,43 301,48 303,54 C297,48 295,39 299,31' +
		// top of the curl (subtle scallop) to the crest
		' C309,19 327,13 347,12 C355,12 362,13 369,13 C388,12 409,11 428,13' +
		// long back slope
		' C462,18 492,28 523,42 C556,57 588,71 622,81 C660,92 700,95 735,95' +
		// inter-wave water, then the smaller second breaker (same language)
		' C765,94 792,92 818,91 C836,91 852,92 868,94 C890,95 912,96 935,95' +
		' C930,84 919,70 903,61 C890,54 874,51 858,52 C843,53 831,57 825,62' +
		' C822,66 821,70 823,74 C818,69 817,63 820,57 C827,48 840,42 856,41' +
		' C874,41 890,46 908,55 C930,67 952,79 978,87 C1010,94 1040,95 1068,94' +
		// tail back to the loop seam (flat tangent matches the start)
		' C1100,93 1130,91 1158,90 C1172,90 1186,90 1200,90';
	const closeBand = ` L${P},${H} L0,${H} Z`;

	// In the print the whole overhanging curl arm is a mass of white foam, so
	// each arm is a filled shape: outer top edge from crest to claw tip, back
	// along the barrel ceiling, then a soft boundary up through the dark body
	// to the crest. Fingers (CLAW) overlap its ceiling edge from below.
	const mainCurlArm =
		'M432,15 C410,8 386,8 364,9 C340,10 314,16 299,28 C293,38 295,48 303,55 C301,48 304,43 310,38 C322,30 346,25 375,25 C405,26 432,32 455,44 C452,32 444,21 432,15 Z';
	const smallCurlArm =
		'M871,42 C855,38 838,39 825,46 C817,52 815,60 817,66 C818,70 820,73 823,75 C822,70 821,66 825,62 C831,57 843,53 858,52 C874,51 890,54 903,61 C896,51 884,44 871,42 Z';
	// pale striations combed through the foam arms, following the curl
	const armStriae = [
		'M312,35 C328,27 352,23 380,24',
		'M330,20 C352,15 378,14 404,16',
		'M834,54 C846,50 860,49 876,50'
	];
	// crisp foam up each concave face into the curl
	const mainFaceFoam = 'M510,96 C504,78 487,58 455,44';
	const smallFaceFoam = 'M935,95 C930,84 919,70 903,61';

	// Hokusai finger-foam claw, pointing down-left from its origin.
	const CLAW = 'M0,0 C-8,1 -14,8 -14,17 C-10,9 -4,5 4,4 Z';
	const claws = [
		// big curl: fingers hung along the barrel ceiling, rotating with it
		{ x: 452, y: 46, s: 1.15, a: -35 },
		{ x: 420, y: 33, s: 1.05, a: -25 },
		{ x: 386, y: 28, s: 1.0, a: -15 },
		{ x: 352, y: 27, s: 0.9, a: -5 },
		{ x: 324, y: 31, s: 0.85, a: 10 },
		{ x: 308, y: 41, s: 0.8, a: 30 },
		// small curl
		{ x: 896, y: 60, s: 0.75, a: -30 },
		{ x: 872, y: 53, s: 0.7, a: -15 },
		{ x: 848, y: 53, s: 0.65, a: 0 },
		{ x: 830, y: 58, s: 0.6, a: 20 }
	];
	// striations combed down the back slopes, plus faint foam on the barrel floors
	const streaks = [
		'M470,26 C505,40 545,60 585,76',
		'M515,40 C548,54 583,70 618,83',
		'M560,58 C588,68 618,80 648,88',
		'M916,60 C936,70 958,80 982,88'
	];
	const floorFoam = ['M300,93 C340,90 390,90 440,92', 'M845,92 C868,90 895,90 918,92'];
	const spray = [
		// flung off the big claw, in the direction of travel
		{ x: 285, y: 62, r: 2.6 },
		{ x: 272, y: 72, r: 2.1 },
		{ x: 294, y: 70, r: 1.8 },
		{ x: 258, y: 80, r: 1.6 },
		{ x: 280, y: 50, r: 1.9 },
		{ x: 265, y: 58, r: 1.4 },
		{ x: 300, y: 80, r: 1.3 },
		{ x: 310, y: 22, r: 1.6 },
		// off the small claw
		{ x: 808, y: 80, r: 1.8 },
		{ x: 797, y: 86, r: 1.4 },
		{ x: 815, y: 86, r: 1.2 }
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
						<path d={frontSurface} fill="none" stroke="var(--fw-foam)" stroke-width="1.5" opacity="0.4" />
						{#each claws as c, i (i)}
							<g transform="translate({c.x} {c.y}) rotate({c.a}) scale({c.s})">
								<path d={CLAW} fill="var(--fw-foam)" stroke="var(--fw-mid)" stroke-width="1.1" opacity="0.95" />
							</g>
						{/each}
						<path d={mainCurlArm} fill="var(--fw-foam)" stroke="var(--fw-mid)" stroke-width="1.7" opacity="0.95" />
						<path d={smallCurlArm} fill="var(--fw-foam)" stroke="var(--fw-mid)" stroke-width="1.4" opacity="0.95" />
						{#each armStriae as d (d)}
							<path {d} fill="none" stroke="var(--fw-mid)" stroke-width="1.5" opacity="0.35" stroke-linecap="round" />
						{/each}
						<path d={mainFaceFoam} fill="none" stroke="var(--fw-foam)" stroke-width="8" opacity="0.2" stroke-linecap="round" />
						<path d={mainFaceFoam} fill="none" stroke="var(--fw-foam)" stroke-width="4" opacity="0.9" stroke-linecap="round" />
						<path d={smallFaceFoam} fill="none" stroke="var(--fw-foam)" stroke-width="3.2" opacity="0.9" stroke-linecap="round" />
						{#each streaks as d (d)}
							<path {d} fill="none" stroke="var(--fw-foam)" stroke-width="2" opacity="0.22" stroke-linecap="round" />
						{/each}
						{#each floorFoam as d (d)}
							<path {d} fill="none" stroke="var(--fw-foam)" stroke-width="1.6" opacity="0.3" stroke-linecap="round" />
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
	@media (prefers-reduced-motion: reduce) {
		.band,
		.drift {
			animation: none;
		}
	}
</style>
