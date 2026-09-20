<script lang="ts">
	let { corner = 'top-left', sectionId = 'academia' }: { corner?: string; sectionId?: string | null } =
		$props();

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
</script>

<div class="water-corner" aria-hidden="true" data-section={sectionId}>
	<div class="scene" style:transform={flip}>
		<!-- Deep-water wash + wavefronts + foam arc -->
		<svg class="layer" viewBox="0 0 340 340" preserveAspectRatio="xMidYMid slice">
			<defs>
				<radialGradient id="{uid}-wash" cx="0" cy="0" r="340" gradientUnits="userSpaceOnUse">
					<stop offset="0" style="stop-color: var(--slice-bg, #6cc3d6)" stop-opacity="0.5" />
					<stop offset="0.42" style="stop-color: var(--water-deep, #2b9cba)" stop-opacity="0.26" />
					<stop offset="1" style="stop-color: var(--water-deep, #2b9cba)" stop-opacity="0" />
				</radialGradient>
				<filter id="{uid}-soft" x="-30%" y="-30%" width="160%" height="160%">
					<feGaussianBlur stdDeviation="1.1" />
				</filter>
			</defs>

			<rect x="0" y="0" width="340" height="340" fill="url(#{uid}-wash)" />

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

	/* ---- reduced motion: freeze into a calm still-water tableau --- */
	@media (prefers-reduced-motion: reduce) {
		.ripple,
		.foam-swell,
		.foam-arc,
		.speck,
		.caustic,
		.bubble-track,
		.bubble {
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
	}
</style>