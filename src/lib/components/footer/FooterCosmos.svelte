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
		y: number; // px from top (band is ~156px tall, motif focused in top ~92px)
		r: number;
		o: number; // peak opacity
		d: number; // twinkle duration (s)
		dl: number; // negative delay to desync (s)
		hue: Hue;
	}

	const rand = mulberry32(982451653);

	const stars: Star[] = Array.from({ length: 72 }, () => {
		const x = rand() * 100;
		// Bias toward the upper sky, letting a few settle near the crest line.
		const y = 5 + Math.pow(rand(), 1.4) * 95;
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

	const crestFront =
		'M0,104 C120,84 210,62 360,66 C520,71 570,98 720,96 C880,94 925,58 1080,60 C1240,62 1330,92 1440,84 L1440,156 L0,156 Z';
	const crestFrontEdge =
		'M0,104 C120,84 210,62 360,66 C520,71 570,98 720,96 C880,94 925,58 1080,60 C1240,62 1330,92 1440,84';
	const crestBack =
		'M0,92 C160,110 280,68 440,76 C600,84 705,56 880,63 C1055,70 1180,100 1320,88 C1372,84 1414,79 1440,76 L1440,156 L0,156 Z';
</script>

<div class="cosmos" aria-hidden="true">
	<!-- soft nebula wash -->
	<div class="neb neb-a"></div>
	<div class="neb neb-b"></div>
	<div class="neb neb-c"></div>

	<!-- layered starfield -->
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

	<!-- occasional shooting stars -->
	<span class="shoot shoot-a"></span>
	<span class="shoot shoot-b"></span>

	<!-- cresting band -->
	<svg class="crest" viewBox="0 0 1440 156" preserveAspectRatio="none" role="presentation" focusable="false">
		<defs>
			<linearGradient id="cosmos-back-fill" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" style="stop-color: var(--accent, #7fd4ff); stop-opacity: 0.16" />
				<stop offset="0.5" style="stop-color: var(--cosmos-nebula, #7c5cff); stop-opacity: 0.22" />
				<stop offset="1" style="stop-color: var(--bg, #0b0b2a); stop-opacity: 0.9" />
			</linearGradient>
			<linearGradient id="cosmos-front-fill" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" style="stop-color: var(--cosmos-nebula, #7c5cff); stop-opacity: 0.45" />
				<stop offset="0.55" style="stop-color: var(--hub-bg, #14143c); stop-opacity: 0.92" />
				<stop offset="1" style="stop-color: var(--hub-bg, #14143c); stop-opacity: 1" />
			</linearGradient>
		</defs>
		<path d={crestBack} fill="url(#cosmos-back-fill)" />
		<path d={crestFront} fill="url(#cosmos-front-fill)" />
		<!-- luminous crest edge: soft halo + crisp line + travelling glint -->
		<path class="edge-halo" d={crestFrontEdge} />
		<path class="edge-line" d={crestFrontEdge} />
		<path class="edge-glint" d={crestFrontEdge} />
	</svg>

	<!-- horizon glow breathing up from the footer bar -->
	<div class="glow"></div>
</div>

<style>
	.cosmos {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		contain: strict;
	}

	/* ---------- nebula ---------- */
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
		top: -34px;
		width: 46%;
		height: 130px;
		background: radial-gradient(
			closest-side,
			color-mix(in srgb, var(--cosmos-nebula, #7c5cff) 50%, transparent),
			transparent 72%
		);
	}
	.neb-b {
		right: 2%;
		top: -18px;
		width: 38%;
		height: 110px;
		background: radial-gradient(
			closest-side,
			color-mix(in srgb, var(--cosmos-glint, #ff8ad9) 34%, transparent),
			transparent 72%
		);
		animation-duration: 46s;
		animation-delay: -14s;
	}
	.neb-c {
		left: 38%;
		top: 8px;
		width: 30%;
		height: 84px;
		background: radial-gradient(
			closest-side,
			color-mix(in srgb, var(--accent, #7fd4ff) 30%, transparent),
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
		fill: var(--accent, #7fd4ff);
	}
	.star.glint {
		fill: var(--cosmos-glint, #ff8ad9);
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

	/* ---------- shooting stars ---------- */
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
		filter: drop-shadow(0 0 6px var(--accent, #7fd4ff));
		opacity: 0;
		will-change: transform, opacity;
	}
	.shoot-a {
		top: 16px;
		animation: shoot 12s linear 2.5s infinite;
	}
	.shoot-b {
		top: 44px;
		width: 84px;
		animation: shoot 19s linear 9s infinite;
	}
	@keyframes shoot {
		0% {
			transform: translate3d(0, 0, 0) rotate(7deg);
			opacity: 0;
		}
		1.5% {
			opacity: 0.9;
		}
		8% {
			transform: translate3d(58vw, 30px, 0) rotate(7deg);
			opacity: 0;
		}
		100% {
			transform: translate3d(58vw, 30px, 0) rotate(7deg);
			opacity: 0;
		}
	}

	/* ---------- crest ---------- */
	.crest {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}
	.edge-halo,
	.edge-line,
	.edge-glint {
		fill: none;
		stroke-linecap: round;
	}
	.edge-halo {
		stroke: var(--cosmos-nebula, #7c5cff);
		stroke-width: 5;
		opacity: 0.38;
		filter: blur(3px);
	}
	.edge-line {
		stroke: var(--accent, #7fd4ff);
		stroke-width: 1.4;
		opacity: 0.75;
	}
	.edge-glint {
		stroke: var(--cosmos-glint, #ff8ad9);
		stroke-width: 2;
		opacity: 0.9;
		stroke-dasharray: 10 1600;
		animation: glide 14s linear infinite;
	}
	@keyframes glide {
		from {
			stroke-dashoffset: 0;
		}
		to {
			stroke-dashoffset: -1610;
		}
	}

	/* ---------- horizon glow ---------- */
	.glow {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 52px;
		height: 74px;
		background: radial-gradient(
			62% 100% at 50% 100%,
			color-mix(in srgb, var(--accent, #7fd4ff) 24%, transparent),
			color-mix(in srgb, var(--cosmos-nebula, #7c5cff) 10%, transparent) 55%,
			transparent 78%
		);
		animation: breathe 9s ease-in-out infinite;
	}
	@keyframes breathe {
		0%,
		100% {
			opacity: 0.65;
		}
		50% {
			opacity: 1;
		}
	}

	/* ---------- reduced motion: freeze into a calm still sky ---------- */
	@media (prefers-reduced-motion: reduce) {
		.neb,
		.star,
		.glow,
		.edge-glint {
			animation: none;
		}
		.star {
			opacity: calc(var(--o, 0.7) * 0.8);
			transform: none;
		}
		.edge-glint {
			stroke-dasharray: none;
			opacity: 0.25;
		}
		.glow {
			opacity: 0.8;
		}
		.shoot {
			display: none;
		}
	}
</style>