<script lang="ts">
	/** Water-theme footer decoration: layered parallax wave bands with an
	 *  out-of-phase bob + shared swell. Fills its container (inset:0). */
	const W = 1200;
	const H = 200;

	function waveBand(amp: number, baseline: number, phase: number): string {
		const steps = 24;
		const seg = W / steps;
		const surface = (i: number) => {
			const a = (i / steps) * Math.PI * 2 + phase;
			return baseline + amp * Math.cos(a) + amp * 0.28 * Math.sin(a * 2.3 + 1.1);
		};
		let d = `M0 ${surface(0).toFixed(2)}`;
		for (let i = 1; i <= steps * 2; i++) {
			d += ` Q${((i - 0.5) * seg).toFixed(2)} ${surface(i - 0.5).toFixed(2)} ${(i * seg).toFixed(2)} ${surface(i).toFixed(2)}`;
		}
		d += ` L${W * 2} ${H} L0 ${H} Z`;
		return d;
	}

	const layers = [
		{ d: waveBand(14, 96, 0), fill: 'color-mix(in srgb, var(--slice-bg) 55%, transparent)', opacity: 0.55, duration: 26, reverse: true, bob: 3, bobDur: 9 },
		{ d: waveBand(20, 108, 1.7), fill: 'color-mix(in srgb, var(--slice-bg) 80%, transparent)', opacity: 0.7, duration: 19, reverse: false, bob: 4, bobDur: 7.5 },
		{ d: waveBand(26, 122, 3.4), fill: 'color-mix(in srgb, var(--accent) 70%, var(--slice-bg))', opacity: 0.85, duration: 13, reverse: true, bob: 5, bobDur: 6 },
		{ d: waveBand(30, 140, 5), fill: 'var(--accent)', opacity: 1, duration: 9, reverse: false, bob: 6, bobDur: 5 }
	];
	const front = layers[layers.length - 1];
</script>

<div class="wave">
	<div class="swell">
		{#each layers as layer, i (i)}
			<div class="bobber" style="--bob:{layer.bob}px; --bob-dur:{layer.bobDur}s; animation-delay:{(-layer.bobDur * 0.5 * i).toFixed(2)}s;">
				<div class="drift" style="--dur:{layer.duration}s; animation-direction:{layer.reverse ? 'reverse' : 'normal'}; animation-delay:{(-layer.duration * 0.37 * (i + 1)).toFixed(2)}s;">
					<svg class="layer" viewBox="0 0 {W * 2} {H}" preserveAspectRatio="none" style="--op:{layer.opacity};">
						<path d={layer.d} fill={layer.fill} />
					</svg>
				</div>
			</div>
		{/each}
		<div class="bobber" style="--bob:{front.bob}px; --bob-dur:{front.bobDur}s; animation-delay:{(-front.bobDur * 0.5 * (layers.length - 1)).toFixed(2)}s;">
			<div class="drift crest" style="--dur:{front.duration}s; animation-direction:{front.reverse ? 'reverse' : 'normal'}; animation-delay:{(-front.duration * 0.37 * layers.length).toFixed(2)}s;">
				<svg class="layer" viewBox="0 0 {W * 2} {H}" preserveAspectRatio="none">
					<path d={front.d} fill="none" stroke="color-mix(in srgb, var(--accent) 55%, white)" stroke-width="2" vector-effect="non-scaling-stroke" opacity="0.55" />
				</svg>
			</div>
		</div>
	</div>
</div>

<style>
	.wave {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}
	.swell {
		position: absolute;
		inset: 0;
		animation: swell 11s ease-in-out infinite;
		will-change: transform;
	}
	.bobber {
		position: absolute;
		inset: 0;
		animation: bob var(--bob-dur, 6s) ease-in-out infinite;
		will-change: transform;
	}
	.drift {
		position: absolute;
		inset: 0;
		width: 200%;
		left: 0;
		animation: drift var(--dur) linear infinite;
		will-change: transform;
	}
	.layer {
		display: block;
		width: 100%;
		height: 100%;
		opacity: var(--op, 1);
	}
	.crest {
		mix-blend-mode: screen;
	}
	@keyframes drift {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			transform: translate3d(-50%, 0, 0);
		}
	}
	@keyframes swell {
		0%,
		100% {
			transform: translate3d(0, 7px, 0);
		}
		50% {
			transform: translate3d(0, -7px, 0);
		}
	}
	@keyframes bob {
		0%,
		100% {
			transform: translate3d(0, var(--bob, 4px), 0);
		}
		50% {
			transform: translate3d(0, calc(-1 * var(--bob, 4px)), 0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.swell,
		.bobber,
		.drift {
			animation: none;
		}
	}
</style>
