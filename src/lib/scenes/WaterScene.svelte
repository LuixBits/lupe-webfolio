<script lang="ts">
	let {
		corner = 'top-left',
		sectionId = 'cv',
		variant = 'corner'
	}: { corner?: string; sectionId?: string | null; variant?: 'corner' | 'hub' } = $props();

	// Unique id prefix for SVG defs (SSR-safe, collision-free across instances)
	const uid = $props.id();

	// The scene is authored for the top-left corner; other corners are mirrored.
	const FLIPS: Record<string, string> = {
		'top-left': 'scale(1, 1)',
		'top-right': 'scale(-1, 1)',
		'bottom-left': 'scale(1, -1)',
		'bottom-right': 'scale(-1, -1)'
	};
	const flip = $derived(FLIPS[corner] ?? FLIPS['top-left']);

	// Deterministic PRNG (mulberry32) — identical output on server & client, no hydration drift.
	function mulberry32(seed: number) {
		return () => {
			seed |= 0;
			seed = (seed + 0x6d2b79f5) | 0;
			let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}
	const rand = mulberry32(0x5eaf00d);

	// Concentric wavefronts radiating from the corner.
	const ripples = Array.from({ length: 6 }, (_, i) => ({
		delay: i * 1.5,
		dur: 9,
		accent: i % 3 === 2
	}));

	// Bubbles drifting inward from the corner, each with its own wobble.
	const bubbles = Array.from({ length: 12 }, () => {
		const angle = ((10 + rand() * 70) * Math.PI) / 180;
		const dist = 185 + rand() * 145;
		return {
			size: 3.5 + rand() * 9,
			dx: Math.cos(angle) * dist,
			dy: Math.sin(angle) * dist,
			dur: 7 + rand() * 6,
			delay: -(rand() * 13), // negative: mid-flight on first paint
			wob: 2 + rand() * 5,
			wdur: 1.6 + rand() * 1.8,
			op: 0.35 + rand() * 0.4
		};
	});

	// Foam specks scattered along the quarter-arc that hugs the radial menu.
	const specks = Array.from({ length: 10 }, () => {
		const a = ((6 + rand() * 78) * Math.PI) / 180;
		const r = 158 + rand() * 30;
		return {
			x: Math.cos(a) * r,
			y: Math.sin(a) * r,
			s: 1 + rand() * 1.9,
			delay: -(rand() * 4),
			dur: 2.4 + rand() * 2.2
		};
	});

	// ---- Japanese pond vocabulary (shared by hub & corner variants) --------
	// Koi authored in local coords, nose pointing +x, ~130 units long.
	const KOI_BODY =
		'M62 0C62 -6.6 54 -11.8 44 -14C28 -17.4 8 -17.2 -10 -13C-24 -9.7 -33 -6.4 -39 -3.4C-40.6 -2.6 -40.6 2.6 -39 3.4C-33 6.4 -24 9.7 -10 13C8 17.2 28 17.4 44 14C54 11.8 62 6.6 62 0Z';
	const KOI_TAIL =
		'M-35 -2.5C-44 -8 -52 -16 -64 -21C-60 -14 -61 -8 -57 -3C-62 1 -61 8 -67 15C-56 13 -45 7 -35 2.5Z';
	const KOI_FIN = 'M36 11C31 19 22 26 12 28C17 21 21 15 25 10C28 9 33 9.5 36 11Z';
	const KOI_DORSAL = 'M-16 0C-23 -1.6 -33 -1.6 -38 0C-33 1.6 -23 1.6 -16 0Z';

	type KoiPatch = { cx: number; cy: number; rx: number; ry: number; rot: number };
	const KOI_STYLES: Record<string, { body: string; patch: string; patches: KoiPatch[] }> = {
		// white koi with vermilion patches
		kohaku: {
			body: '#f7fbfc',
			patch: '#e0603c',
			patches: [
				{ cx: 30, cy: -4, rx: 17, ry: 13, rot: -14 },
				{ cx: -6, cy: 5, rx: 15, ry: 11, rot: 10 },
				{ cx: -30, cy: -3, rx: 9, ry: 7, rot: -6 }
			]
		},
		// warm orange koi with deeper saddles
		hi: {
			body: '#e07a3f',
			patch: '#c05028',
			patches: [
				{ cx: 18, cy: 2, rx: 19, ry: 12, rot: 8 },
				{ cx: -24, cy: -4, rx: 10, ry: 7, rot: -10 }
			]
		},
		// blue-grey koi with orange cheeks (asagi)
		asagi: {
			body: 'color-mix(in srgb, var(--water-deep, #2b9cba) 46%, #eaf3f6)',
			patch: '#e0603c',
			patches: [
				{ cx: 44, cy: 8, rx: 7, ry: 4.5, rot: 20 },
				{ cx: 44, cy: -8, rx: 7, ry: 4.5, rot: -20 }
			]
		}
	};

	// Smooth closed swim loops (four cubic arcs ≈ ellipse). Directions vary.
	const SWIM_A =
		'M700 300C700 358 606 405 490 405C374 405 280 358 280 300C280 242 374 195 490 195C606 195 700 242 700 300Z';
	const SWIM_B =
		'M150 385C150 349 217 320 300 320C383 320 450 349 450 385C450 421 383 450 300 450C217 450 150 421 150 385Z';
	const SWIM_C =
		'M730 150C730 180 672 205 600 205C528 205 470 180 470 150C470 120 528 95 600 95C672 95 730 120 730 150Z';
	// Deep silhouette koi: a wide lazy loop through the empty mid-water.
	const SWIM_D =
		'M660 330C660 380 553 420 420 420C287 420 180 380 180 330C180 280 287 240 420 240C553 240 660 280 660 330Z';
	// Corner variant: a full circle around the corner; only the visible quarter shows.
	const SWIM_CORNER = 'M250 0A250 250 0 1 1 -250 0A250 250 0 1 1 250 0Z';

	// A momiji (maple) leaf as the classic textile motif: a fan of seven
	// pointed lobes joined at the base, plus a short stem.
	const MOMIJI_PETAL = 'M0 0C3 -5 4 -10 0 -17C-4 -10 -3 -5 0 0Z';
	const MOMIJI_LOBES = [
		{ a: -84, s: 0.55 },
		{ a: -56, s: 0.75 },
		{ a: -28, s: 0.9 },
		{ a: 0, s: 1 },
		{ a: 28, s: 0.9 },
		{ a: 56, s: 0.75 },
		{ a: 84, s: 0.55 }
	];

	// Lily-pad veins avoid the notch (notch is around local 0°).
	const PAD_VEINS = [45, 90, 135, 180, 225, 270, 315].map((a) => ({
		x: Math.cos((a * Math.PI) / 180) * 44,
		y: Math.sin((a * Math.PI) / 180) * 44
	}));
	const LOTUS_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
	const PETAL = 'M0 0C7 -7 8.5 -19 0 -27C-8.5 -19 -7 -7 0 0Z';

	// Hub bubbles: independent deterministic stream.
	const rand2 = mulberry32(0x0b0bb1e5);
	const hubBubbles = Array.from({ length: 9 }, () => ({
		x: 90 + rand2() * 680,
		r: 2 + rand2() * 3.4,
		dur: 9 + rand2() * 7,
		delay: -(rand2() * 16),
		dx: (rand2() - 0.5) * 44,
		rise: 360 + rand2() * 80
	}));
</script>

<!-- Seigaiha (overlapping fan-wave) pattern. Rows painted bottom-up so each
     row of fans is occluded by the row above — the classic scale look. -->
{#snippet seigaihaDefs(pid: string)}
	<g id="{pid}-fan">
		<circle r="22" class="sg-fill" />
		<circle r="22" class="sg-ring" fill="none" />
		<circle r="16.5" class="sg-ring" fill="none" />
		<circle r="11" class="sg-ring" fill="none" />
		<circle r="5.5" class="sg-ring" fill="none" />
	</g>
	<pattern id={pid} width="44" height="22" patternUnits="userSpaceOnUse">
		<use href="#{pid}-fan" x="22" y="33" />
		<use href="#{pid}-fan" x="0" y="22" />
		<use href="#{pid}-fan" x="44" y="22" />
		<use href="#{pid}-fan" x="22" y="11" />
		<use href="#{pid}-fan" x="0" y="0" />
		<use href="#{pid}-fan" x="44" y="0" />
		<use href="#{pid}-fan" x="22" y="-11" />
	</pattern>
{/snippet}

<!-- A koi (top view). kid keeps clip ids unique; styleKey picks the robe. -->
{#snippet koiFish(kid: string, styleKey: string)}
	{@const cfg = KOI_STYLES[styleKey]}
	<g class="koi-fig">
		<ellipse class="koi-shadow" cx="-4" cy="15" rx="46" ry="9" filter="url(#{uid}-soft2)" />
		<g class="koi-tail"><path class="koi-skin" d={KOI_TAIL} style="fill:{cfg.body}" /></g>
		<path class="koi-fin fin-r" d={KOI_FIN} />
		<g transform="scale(1 -1)"><path class="koi-fin fin-l" d={KOI_FIN} /></g>
		<path class="koi-skin" d={KOI_BODY} style="fill:{cfg.body}" />
		<clipPath id="{uid}-kc-{kid}"><path d={KOI_BODY} /></clipPath>
		<g clip-path="url(#{uid}-kc-{kid})">
			{#each cfg.patches as p, i (i)}
				<ellipse
					class="koi-patch"
					cx={p.cx}
					cy={p.cy}
					rx={p.rx}
					ry={p.ry}
					transform="rotate({p.rot} {p.cx} {p.cy})"
					style="fill:{cfg.patch}"
				/>
			{/each}
		</g>
		<path class="koi-dorsal" d={KOI_DORSAL} />
		<path class="koi-spine" d="M52 0C34 -2 6 -2.4 -20 -1" />
		<circle class="koi-eye" cx="49" cy="-7" r="1.8" />
		<circle class="koi-eye" cx="49" cy="7" r="1.8" />
	</g>
{/snippet}

<!-- A seaweed strand, authored pointing up with its root at the origin. -->
{#snippet momijiLeaf()}
	<g>
		{#each MOMIJI_LOBES as l, i (i)}
			<path class="mo-lobe" transform="rotate({l.a}) scale({l.s})" d={MOMIJI_PETAL} />
		{/each}
		<path class="mo-stem" d="M0 0C0.5 4 0 7 -1.5 11" />
	</g>
{/snippet}

{#snippet weedTall()}
	<g>
		<path class="w-stem" d="M0 0C-7 -26 8 -48 -2 -74C-7 -88 -1 -100 2 -110" />
		<path class="w-blade" d="M-3 -28C-15 -33 -24 -44 -26 -58C-15 -51 -7 -41 -3 -28Z" />
		<path class="w-blade" d="M2 -46C13 -52 20 -63 21 -77C11 -69 4 -59 2 -46Z" />
		<path class="w-blade" d="M-2 -66C-12 -71 -18 -81 -19 -93C-10 -86 -4 -77 -2 -66Z" />
		<path class="w-blade" d="M1 -84C9 -89 14 -97 15 -108C7 -101 3 -93 1 -84Z" />
		<circle class="w-tip" cx="2" cy="-112" r="2" />
	</g>
{/snippet}

{#if variant === 'hub'}
	<!-- Full-square Japanese pond: seigaiha surface, koi, pads, weeds, light. -->
	<div class="water-hub" aria-hidden="true" data-section={sectionId}>
		<svg class="pond" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
			<defs>
				{@render seigaihaDefs(`${uid}-sg`)}
				<linearGradient id="{uid}-depth" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" style="stop-color: var(--water-foam, #cdeef6)" stop-opacity="0.5" />
					<stop offset="0.34" style="stop-color: var(--water-foam, #cdeef6)" stop-opacity="0.08" />
					<stop offset="1" style="stop-color: var(--water-deep, #2b9cba)" stop-opacity="0.42" />
				</linearGradient>
				<linearGradient id="{uid}-ray" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stop-color="#ffffff" stop-opacity="0.5" />
					<stop offset="0.75" stop-color="#ffffff" stop-opacity="0" />
				</linearGradient>
				<linearGradient id="{uid}-bandfade" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0.5" stop-color="#fff" />
					<stop offset="1" stop-color="#fff" stop-opacity="0" />
				</linearGradient>
				<mask id="{uid}-bandmask">
					<rect x="0" y="0" width="800" height="100" fill="url(#{uid}-bandfade)" />
				</mask>
				<filter id="{uid}-soft2" x="-60%" y="-60%" width="220%" height="220%">
					<feGaussianBlur stdDeviation="4" />
				</filter>
			</defs>

			<rect width="800" height="500" fill="url(#{uid}-depth)" />

			<!-- light rays slanting in from the upper right -->
			<g class="rays">
				<path class="ray r1" d="M488 -8L552 -8L420 512L340 512Z" fill="url(#{uid}-ray)" />
				<path class="ray r2" d="M600 -8L646 -8L540 512L480 512Z" fill="url(#{uid}-ray)" />
				<path class="ray r3" d="M702 -8L736 -8L664 512L614 512Z" fill="url(#{uid}-ray)" />
			</g>

			<!-- pond floor -->
			<g class="floor">
				<path class="sand" d="M0 500L0 472C120 460 258 478 400 471C540 464 676 480 800 469L800 500Z" />
				<ellipse class="pebble" cx="180" cy="487" rx="26" ry="6" />
				<ellipse class="pebble" cx="320" cy="492" rx="20" ry="5" />
				<ellipse class="pebble" cx="520" cy="490" rx="34" ry="7" />
				<ellipse class="pebble" cx="622" cy="486" rx="18" ry="5" />
				<g transform="translate(238 482)">
					<ellipse class="stone" cx="0" cy="0" rx="30" ry="14" />
					<ellipse class="stone" cx="34" cy="6" rx="18" ry="9" />
					<ellipse class="stone-light" cx="-9" cy="-6" rx="14" ry="6" />
				</g>
			</g>

			<!-- a big koi gliding far below, only its shadow visible -->
			<g class="koi-mover deep" style="offset-path: path('{SWIM_D}'); --swim:96s; --rest:38%; --kd:-30s">
				<g class="deep-koi" transform="scale(1.35)" filter="url(#{uid}-soft2)">
					<path d={KOI_TAIL} />
					<path d={KOI_BODY} />
				</g>
			</g>

			<!-- quiet surface rings -->
			<g class="ringset" transform="translate(556 108)">
				<ellipse class="ring" rx="46" ry="15" style="--rd:0s" />
				<ellipse class="ring" rx="46" ry="15" style="--rd:3.4s" />
			</g>
			<g class="ringset" transform="translate(332 198)">
				<ellipse class="ring" rx="38" ry="12" style="--rd:1.6s" />
				<ellipse class="ring" rx="38" ry="12" style="--rd:5s" />
			</g>

			<!-- the koi, each on its own slow loop -->
			<g class="koi-mover" style="offset-path: path('{SWIM_A}'); --swim:76s; --rest:12%; --kd:0s">
				<g class="koi" transform="scale(1.05)" style="--wag:2.1s">{@render koiFish('a', 'kohaku')}</g>
			</g>
			<g class="koi-mover" style="offset-path: path('{SWIM_B}'); --swim:57s; --rest:55%; --kd:-21s">
				<g class="koi" transform="scale(0.78)" style="--wag:1.8s">{@render koiFish('b', 'hi')}</g>
			</g>
			<g class="koi-mover" style="offset-path: path('{SWIM_C}'); --swim:47s; --rest:30%; --kd:-9s">
				<g class="koi" transform="scale(0.52)" style="--wag:1.5s">{@render koiFish('c', 'asagi')}</g>
			</g>

			<!-- seigaiha surface band, drifting gently -->
			<g class="sea-band" mask="url(#{uid}-bandmask)">
				<rect class="band-tile" x="-16" y="-4" width="832" height="100" fill="url(#{uid}-sg)" />
			</g>

			<!-- floating pads & a lotus, riding on the surface -->
			<g transform="translate(642 100)">
				<g class="pad" style="--pd:0s">
					<ellipse class="pad-shadow" cx="5" cy="8" rx="55" ry="17" filter="url(#{uid}-soft2)" />
					<g transform="rotate(28)">
						<path class="pad-leaf" d="M0 0L49.9 -20.2A52 52 0 1 0 49.9 20.2Z" />
						<g class="pad-veins">
							{#each PAD_VEINS as v, i (i)}
								<line x1="0" y1="0" x2={v.x.toFixed(1)} y2={v.y.toFixed(1)} />
							{/each}
						</g>
					</g>
				</g>
			</g>
			<g transform="translate(728 154) scale(0.62)">
				<g class="pad" style="--pd:-4.5s">
					<ellipse class="pad-shadow" cx="5" cy="8" rx="55" ry="17" filter="url(#{uid}-soft2)" />
					<g transform="rotate(150)">
						<path class="pad-leaf" d="M0 0L49.9 -20.2A52 52 0 1 0 49.9 20.2Z" />
						<g class="pad-veins">
							{#each PAD_VEINS as v, i (i)}
								<line x1="0" y1="0" x2={v.x.toFixed(1)} y2={v.y.toFixed(1)} />
							{/each}
						</g>
					</g>
				</g>
			</g>
			<!-- momiji leaves drifting on the surface -->
			<g transform="translate(304 176)">
				<g class="pad" style="--pd:-6.5s">
					<ellipse class="leaf-ring" rx="34" ry="11" />
					<g class="momiji-g" transform="rotate(140) scale(1.45)">{@render momijiLeaf()}</g>
				</g>
			</g>
			<g transform="translate(386 234)">
				<g class="pad" style="--pd:-3.1s">
					<g class="momiji-g dim" transform="rotate(-65) scale(1.05)">{@render momijiLeaf()}</g>
				</g>
			</g>

			<g transform="translate(556 62) scale(0.85)">
				<g class="pad lotus" style="--pd:-2.2s">
					<ellipse class="pad-shadow" cx="3" cy="6" rx="26" ry="9" filter="url(#{uid}-soft2)" />
					{#each LOTUS_ANGLES as a (a)}
						<path class="petal outer" transform="rotate({a})" d={PETAL} />
					{/each}
					{#each LOTUS_ANGLES as a (a)}
						<path class="petal inner" transform="rotate({a + 22.5}) scale(0.6)" d={PETAL} />
					{/each}
					<circle class="lotus-core" r="5.5" />
				</g>
			</g>

			<!-- swaying weeds rooted in the sand -->
			<g class="weeds">
				<g transform="translate(74 486) scale(1.25)">
					<g class="weed" style="--wd:7s; --wdl:0s">{@render weedTall()}</g>
				</g>
				<g transform="translate(118 492) scale(-0.9 0.9)">
					<g class="weed" style="--wd:8.4s; --wdl:-3s">{@render weedTall()}</g>
				</g>
				<g transform="translate(214 490) scale(0.68)">
					<g class="weed" style="--wd:7.8s; --wdl:-6.1s">{@render weedTall()}</g>
				</g>
				<g transform="translate(280 494) scale(-0.5 0.5)">
					<g class="weed" style="--wd:6.8s; --wdl:-2.7s">{@render weedTall()}</g>
				</g>
				<g transform="translate(432 494) scale(0.75)">
					<g class="weed" style="--wd:7.6s; --wdl:-1.4s">{@render weedTall()}</g>
				</g>
				<g transform="translate(470 496) scale(-0.55 0.55)">
					<g class="weed" style="--wd:6.4s; --wdl:-4.2s">{@render weedTall()}</g>
				</g>
				<g transform="translate(660 494) scale(0.8)">
					<g class="weed" style="--wd:8.8s; --wdl:-2.2s">{@render weedTall()}</g>
				</g>
				<g transform="translate(700 490) scale(1.45)">
					<g class="weed" style="--wd:7.2s; --wdl:-5.6s">{@render weedTall()}</g>
				</g>
				<g transform="translate(748 494) scale(-1.05 1.05)">
					<g class="weed" style="--wd:9s; --wdl:-0.8s">{@render weedTall()}</g>
				</g>
			</g>

			<!-- small bubble trails -->
			<g class="hbubbles">
				{#each hubBubbles as b, i (i)}
					<g transform="translate({b.x.toFixed(1)} 470)">
						<circle
							class="hb"
							r={b.r.toFixed(2)}
							style="--d:{b.dur.toFixed(2)}s; --dl:{b.delay.toFixed(2)}s; --hx:{b.dx.toFixed(
								1
							)}px; --rise:{-b.rise.toFixed(0)}px"
						/>
					</g>
				{/each}
			</g>
		</svg>

		<!-- soft caustic shimmer over the pond -->
		<div class="caustic hub-c1"></div>
		<div class="caustic hub-c2"></div>
	</div>
{:else}
	<div class="water-corner" aria-hidden="true" data-section={sectionId}>
		<div class="scene" style:transform={flip}>
			<!-- Deep-water wash + wavefronts + foam arc -->
			<svg class="layer" viewBox="0 0 340 340" preserveAspectRatio="xMidYMid slice">
				<defs>
					{@render seigaihaDefs(`${uid}-sgc`)}
					<radialGradient id="{uid}-wash" cx="0" cy="0" r="340" gradientUnits="userSpaceOnUse">
						<stop offset="0" style="stop-color: var(--slice-bg, #6cc3d6)" stop-opacity="0.5" />
						<stop offset="0.42" style="stop-color: var(--water-deep, #2b9cba)" stop-opacity="0.26" />
						<stop offset="1" style="stop-color: var(--water-deep, #2b9cba)" stop-opacity="0" />
					</radialGradient>
					<radialGradient id="{uid}-cfR" cx="0" cy="0" r="330" gradientUnits="userSpaceOnUse">
						<stop offset="0.1" stop-color="#fff" stop-opacity="0.9" />
						<stop offset="0.75" stop-color="#fff" stop-opacity="0.35" />
						<stop offset="1" stop-color="#fff" stop-opacity="0" />
					</radialGradient>
					<mask id="{uid}-cfade"><rect width="340" height="340" fill="url(#{uid}-cfR)" /></mask>
					<filter id="{uid}-soft" x="-30%" y="-30%" width="160%" height="160%">
						<feGaussianBlur stdDeviation="1.1" />
					</filter>
					<filter id="{uid}-soft2" x="-60%" y="-60%" width="220%" height="220%">
						<feGaussianBlur stdDeviation="4" />
					</filter>
				</defs>

				<rect x="0" y="0" width="340" height="340" fill="url(#{uid}-wash)" />

				<!-- faint seigaiha texture radiating out from the corner -->
				<rect
					class="sg-corner"
					x="0"
					y="0"
					width="340"
					height="340"
					fill="url(#{uid}-sgc)"
					mask="url(#{uid}-cfade)"
				/>

				<!-- expanding ripples -->
				{#each ripples as r, i (i)}
					<circle
						class="ripple"
						class:accent={r.accent}
						style="--rd:{r.delay}s; --rdur:{r.dur}s; --i:{i + 1};"
						cx="0"
						cy="0"
						r="300"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
				{/each}

				<!-- foam band framing the quarter-disc menu -->
				<g class="foam-swell" filter="url(#{uid}-soft)">
					<path
						class="foam-arc foam-a"
						d="M 170 0 A 170 170 0 0 1 0 170"
						fill="none"
					/>
					<path
						class="foam-arc foam-b"
						d="M 182 0 A 182 182 0 0 1 0 182"
						fill="none"
					/>
					{#each specks as p, i (i)}
						<circle
							class="speck"
							style="--sd:{p.delay}s; --sdur:{p.dur}s;"
							cx={p.x.toFixed(1)}
							cy={p.y.toFixed(1)}
							r={p.s.toFixed(2)}
						/>
					{/each}
				</g>

				<!-- a lone koi patrolling beyond the foam ring -->
				<g
					class="koi-mover"
					style="offset-path: path('{SWIM_CORNER}'); --swim:46s; --rest:12%; --kd:-6s"
				>
					<g class="koi" transform="scale(0.52)" style="--wag:1.7s">{@render koiFish('k', 'kohaku')}</g>
				</g>

				<!-- weed sprigs fringing the wheel -->
				<g transform="translate(212 122) rotate(120) scale(0.8)">
					<g class="weed" style="--wd:6.5s; --wdl:-2s">{@render weedTall()}</g>
				</g>
				<g transform="translate(148 210) rotate(145) scale(0.72)">
					<g class="weed" style="--wd:8s; --wdl:-5s">{@render weedTall()}</g>
				</g>
			</svg>

			<!-- soft caustic shimmer -->
			<div class="caustic c1"></div>
			<div class="caustic c2"></div>
			<div class="caustic c3"></div>

			<!-- rising bubbles -->
			<div class="layer bubbles">
				{#each bubbles as b, i (i)}
					<div
						class="bubble-track"
						style="--dx:{b.dx.toFixed(1)}px; --dy:{b.dy.toFixed(1)}px; --dur:{b.dur.toFixed(
							2
						)}s; --delay:{b.delay.toFixed(2)}s; --op:{b.op.toFixed(2)};"
					>
						<div
							class="bubble"
							style="width:{b.size.toFixed(1)}px; height:{b.size.toFixed(
								1
							)}px; --wob:{b.wob.toFixed(1)}px; --wdur:{b.wdur.toFixed(2)}s;"
						></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.water-corner {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		contain: layout paint style;
	}

	.scene,
	.layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	/* ---- ripples -------------------------------------------------- */
	.ripple {
		stroke: var(--water-foam, #cdeef6);
		stroke-width: 1.4;
		opacity: 0;
		transform-origin: 0 0;
		animation: ripple var(--rdur, 9s) cubic-bezier(0.17, 0.55, 0.45, 0.95) infinite;
		animation-delay: var(--rd, 0s);
		will-change: transform, opacity;
	}
	.ripple.accent {
		stroke: var(--accent, #2b9cba);
		stroke-width: 1;
	}
	@keyframes ripple {
		0% {
			transform: scale(0.04);
			opacity: 0;
		}
		9% {
			opacity: 0.55;
		}
		60% {
			opacity: 0.22;
		}
		100% {
			transform: scale(1.12);
			opacity: 0;
		}
	}

	/* ---- foam ----------------------------------------------------- */
	.foam-swell {
		transform-origin: 0 0;
		animation: swell 6.5s ease-in-out infinite alternate;
	}
	@keyframes swell {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.022);
		}
	}
	.foam-arc {
		stroke: var(--water-foam, #cdeef6);
		stroke-linecap: round;
	}
	.foam-a {
		stroke-width: 3;
		stroke-dasharray: 3 15;
		opacity: 0.75;
		animation: foamDrift 22s linear infinite;
	}
	.foam-b {
		stroke-width: 5;
		stroke-dasharray: 2 26;
		opacity: 0.3;
		animation: foamDrift 30s linear infinite reverse;
	}
	@keyframes foamDrift {
		to {
			stroke-dashoffset: -288;
		}
	}
	.speck {
		fill: var(--water-foam, #cdeef6);
		transform-box: fill-box;
		transform-origin: center;
		opacity: 0.25;
		animation: speckle var(--sdur, 3s) ease-in-out infinite alternate;
		animation-delay: var(--sd, 0s);
	}
	@keyframes speckle {
		from {
			opacity: 0.12;
			transform: scale(0.8);
		}
		to {
			opacity: 0.8;
			transform: scale(1.35);
		}
	}

	/* ---- caustic shimmer ------------------------------------------ */
	.caustic {
		position: absolute;
		border-radius: 50%;
		filter: blur(26px);
		mix-blend-mode: screen;
		will-change: transform;
	}
	.c1 {
		left: -34px;
		top: -26px;
		width: 150px;
		height: 112px;
		background: var(--water-foam, #cdeef6);
		opacity: 0.16;
		animation: driftA 11s ease-in-out infinite alternate;
	}
	.c2 {
		left: 26px;
		top: 48px;
		width: 190px;
		height: 148px;
		background: var(--slice-bg, #6cc3d6);
		opacity: 0.12;
		animation: driftB 15s ease-in-out infinite alternate;
	}
	.c3 {
		left: 120px;
		top: 130px;
		width: 130px;
		height: 130px;
		background: var(--accent, #2b9cba);
		opacity: 0.09;
		animation: driftA 13s ease-in-out infinite alternate-reverse;
	}
	@keyframes driftA {
		from {
			transform: translate(0, 0) scale(1);
		}
		to {
			transform: translate(26px, 20px) scale(1.16);
		}
	}
	@keyframes driftB {
		from {
			transform: translate(0, 0) scale(1.08);
		}
		to {
			transform: translate(-18px, 26px) scale(0.94);
		}
	}

	/* ---- bubbles -------------------------------------------------- */
	.bubble-track {
		position: absolute;
		left: 0;
		top: 0;
		opacity: 0;
		animation: rise var(--dur, 9s) linear var(--delay, 0s) infinite;
		will-change: transform, opacity;
	}
	@keyframes rise {
		0% {
			transform: translate(5px, 5px) scale(0.5);
			opacity: 0;
		}
		12% {
			opacity: var(--op, 0.5);
		}
		78% {
			opacity: var(--op, 0.5);
		}
		100% {
			transform: translate(var(--dx, 200px), var(--dy, 200px)) scale(1);
			opacity: 0;
		}
	}
	.bubble {
		border-radius: 50%;
		border: 1px solid var(--water-foam, #cdeef6);
		background: radial-gradient(
			circle at 32% 28%,
			var(--water-foam, #cdeef6) 0%,
			transparent 58%
		);
		animation: wob var(--wdur, 2s) ease-in-out infinite alternate;
	}
	@keyframes wob {
		from {
			transform: translateX(calc(var(--wob, 3px) * -1));
		}
		to {
			transform: translateX(var(--wob, 3px));
		}
	}

	/* ---- Japanese pond: shared pieces ----------------------------- */
	.sg-fill {
		fill: color-mix(in srgb, var(--slice-bg, #6cc3d6) 30%, var(--bg, #e8f4f8));
	}
	.sg-ring {
		stroke: var(--water-deep, #2b9cba);
		stroke-opacity: 0.5;
		stroke-width: 1.3;
	}
	.sg-corner {
		opacity: 0.2;
	}

	.koi-mover {
		offset-rotate: auto;
		animation: swim var(--swim, 60s) linear infinite;
		animation-delay: var(--kd, 0s);
		will-change: transform;
	}
	@keyframes swim {
		from {
			offset-distance: 0%;
		}
		to {
			offset-distance: 100%;
		}
	}
	.koi-shadow {
		fill: var(--water-deep, #2b9cba);
		opacity: 0.18;
	}
	.koi-skin {
		stroke: color-mix(in srgb, var(--water-deep, #2b9cba) 45%, transparent);
		stroke-width: 1;
	}
	.koi-patch {
		opacity: 0.92;
	}
	.koi-fin {
		fill: rgba(255, 255, 255, 0.6);
		stroke: color-mix(in srgb, var(--water-deep, #2b9cba) 35%, transparent);
		stroke-width: 0.8;
		transform-box: fill-box;
		transform-origin: 100% 0%;
		animation: finwave calc(var(--wag, 2s) * 1.6) ease-in-out infinite alternate;
	}
	.fin-l {
		animation-delay: calc(var(--wag, 2s) * -0.8);
	}
	@keyframes finwave {
		from {
			transform: rotate(-9deg);
		}
		to {
			transform: rotate(7deg);
		}
	}
	.koi-tail {
		transform-box: fill-box;
		transform-origin: 96% 45%;
		animation: tailwag var(--wag, 2s) ease-in-out infinite alternate;
	}
	@keyframes tailwag {
		from {
			transform: rotate(-7deg);
		}
		to {
			transform: rotate(7deg);
		}
	}
	.koi-dorsal {
		fill: color-mix(in srgb, var(--water-deep, #2b9cba) 55%, transparent);
		opacity: 0.5;
	}
	.koi-spine {
		fill: none;
		stroke: color-mix(in srgb, var(--water-deep, #2b9cba) 60%, transparent);
		stroke-width: 0.7;
		opacity: 0.5;
	}
	.koi-eye {
		fill: #14343d;
	}

	.weed {
		transform-box: fill-box;
		transform-origin: 50% 100%;
		animation: weedsway var(--wd, 7s) ease-in-out infinite alternate;
		animation-delay: var(--wdl, 0s);
	}
	@keyframes weedsway {
		from {
			transform: rotate(-2.6deg);
		}
		to {
			transform: rotate(2.8deg);
		}
	}
	.w-stem {
		fill: none;
		stroke: var(--water-deep, #2b9cba);
		stroke-width: 2.4;
		stroke-linecap: round;
		opacity: 0.55;
	}
	.w-blade {
		fill: var(--accent, #2b9cba);
		fill-opacity: 0.4;
		stroke: var(--water-deep, #2b9cba);
		stroke-width: 0.7;
		stroke-opacity: 0.35;
	}
	.w-tip {
		fill: var(--water-foam, #cdeef6);
		opacity: 0.8;
	}

	/* ---- hub pond ------------------------------------------------- */
	.water-hub {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		contain: layout paint style;
	}
	.pond {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.sand {
		fill: var(--water-deep, #2b9cba);
		opacity: 0.2;
	}
	.pebble {
		fill: var(--water-deep, #2b9cba);
		opacity: 0.17;
	}
	.stone {
		fill: var(--water-deep, #2b9cba);
		opacity: 0.3;
	}
	.stone-light {
		fill: var(--water-foam, #cdeef6);
		opacity: 0.2;
	}
	.deep-koi path {
		fill: var(--water-deep, #2b9cba);
		opacity: 0.22;
	}
	.momiji-g .mo-lobe {
		fill: #cd5b45;
	}
	.momiji-g .mo-stem {
		fill: none;
		stroke: #a34433;
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.momiji-g {
		opacity: 0.9;
	}
	.momiji-g.dim {
		opacity: 0.7;
	}
	.momiji-g.dim .mo-lobe {
		fill: #d97a54;
	}
	.leaf-ring {
		fill: none;
		stroke: var(--water-deep, #2b9cba);
		stroke-width: 1.2;
		opacity: 0.3;
	}
	.rays {
		animation: raysway 24s ease-in-out infinite alternate;
		will-change: transform, opacity;
	}
	.ray {
		opacity: 0.11;
	}
	.r2 {
		opacity: 0.08;
	}
	.r3 {
		opacity: 0.06;
	}
	@keyframes raysway {
		from {
			transform: translateX(-8px);
			opacity: 0.7;
		}
		to {
			transform: translateX(10px);
			opacity: 1;
		}
	}
	.ring {
		fill: none;
		stroke: var(--water-foam, #cdeef6);
		stroke-width: 1.6;
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		animation: ringpulse 7.5s ease-out infinite;
		animation-delay: var(--rd, 0s);
	}
	@keyframes ringpulse {
		0% {
			transform: scale(0.18);
			opacity: 0;
		}
		12% {
			opacity: 0.5;
		}
		70% {
			opacity: 0.14;
		}
		100% {
			transform: scale(1.15);
			opacity: 0;
		}
	}
	.sea-band {
		opacity: 0.85;
	}
	.band-tile {
		animation: bandDrift 30s ease-in-out infinite alternate;
		will-change: transform;
	}
	@keyframes bandDrift {
		from {
			transform: translateX(-8px);
		}
		to {
			transform: translateX(8px);
		}
	}
	.pad {
		transform-box: fill-box;
		transform-origin: center;
		animation: padbob 10s ease-in-out infinite alternate;
		animation-delay: var(--pd, 0s);
	}
	@keyframes padbob {
		from {
			transform: rotate(-2.4deg) translateY(0px);
		}
		to {
			transform: rotate(2.2deg) translateY(3px);
		}
	}
	.pad-shadow {
		fill: var(--water-deep, #2b9cba);
		opacity: 0.16;
	}
	.pad-leaf {
		fill: #4f8d76;
		fill-opacity: 0.92;
		stroke: #35664f;
		stroke-width: 1.2;
		stroke-opacity: 0.55;
	}
	.pad-veins line {
		stroke: #cfe8d9;
		stroke-width: 1;
		opacity: 0.4;
	}
	.petal {
		fill: #e7a8ba;
		stroke: #c97a92;
		stroke-width: 0.7;
		stroke-opacity: 0.5;
	}
	.petal.inner {
		fill: #f2c1cd;
	}
	.lotus-core {
		fill: #edcd7f;
	}
	.hb {
		fill: none;
		stroke: var(--water-foam, #cdeef6);
		stroke-width: 1;
		opacity: 0;
		animation: hubrise var(--d, 12s) linear var(--dl, 0s) infinite;
		will-change: transform, opacity;
	}
	@keyframes hubrise {
		0% {
			transform: translate(0, 0);
			opacity: 0;
		}
		12% {
			opacity: 0.5;
		}
		80% {
			opacity: 0.4;
		}
		100% {
			transform: translate(var(--hx, 10px), var(--rise, -400px));
			opacity: 0;
		}
	}
	.hub-c1 {
		left: 58%;
		top: 6%;
		width: 34%;
		height: 30%;
		background: var(--water-foam, #cdeef6);
		opacity: 0.14;
		animation: driftA 14s ease-in-out infinite alternate;
	}
	.hub-c2 {
		left: 30%;
		top: 45%;
		width: 28%;
		height: 32%;
		background: var(--slice-bg, #6cc3d6);
		opacity: 0.1;
		animation: driftB 18s ease-in-out infinite alternate;
	}

	/* ---- reduced motion: freeze into a calm still-water tableau --- */
	@media (prefers-reduced-motion: reduce) {
		.ripple,
		.foam-swell,
		.foam-arc,
		.speck,
		.caustic,
		.bubble-track,
		.bubble,
		.koi-mover,
		.koi-tail,
		.koi-fin,
		.pad,
		.weed,
		.ring,
		.rays,
		.band-tile,
		.hb {
			animation: none !important;
		}
		.ripple {
			opacity: 0.14;
			transform: scale(calc(var(--i, 1) * 0.16));
		}
		.speck {
			opacity: 0.4;
		}
		.bubble-track {
			opacity: 0.3;
			transform: translate(calc(var(--dx, 200px) * 0.55), calc(var(--dy, 200px) * 0.55));
		}
		.koi-mover {
			offset-distance: var(--rest, 15%);
		}
		.ring {
			opacity: 0.16;
			transform: scale(0.7);
		}
		.hb {
			opacity: 0.28;
			transform: translate(calc(var(--hx, 10px) * 0.5), calc(var(--rise, -400px) * 0.45));
		}
	}
</style>
