<script lang="ts">
	/** Ambient margins for the CV corner — the SAME dawn pond as /cv, seen
	 *  from the jetty: a warm morning wash at the top, kumo cloud bars and
	 *  birds in the sky, kasumi mist lying on the water, seigaiha medallions
	 *  stamped in the margins, two koi crossing under the surface inside
	 *  their ripple rings, momiji drifting, small still wave marks. (This
	 *  replaced the dive era's underwater set — kelp, bubbles, caustics —
	 *  which read as an aquarium next to the mooring's surface world.)
	 *  GSAP gives it barely-there drift; reduced motion is a still print. */
	import { onMount } from 'svelte';
	import Koi from '$lib/water/Koi.svelte';

	let {} = $props();

	// deterministic pseudo-random (SSR === client)
	const frac = (x: number) => x - Math.floor(x);
	const rnd = (i: number, k: number) => frac(Math.sin(i * 127.1 + k * 311.7) * 43758.5453);

	let root = $state<HTMLElement | null>(null);

	onMount(() => {
		let disposed = false;
		let tweens: any[] = [];
		let removePointer: (() => void) | undefined;
		let gsapRef: any = null;

		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (mq.matches) {
			// calm static composition — no JS motion at all
			return;
		}

		(async () => {
			const g = await import('gsap');
			const gsap = g.gsap ?? g.default;
			if (disposed || !root) return;
			gsapRef = gsap;

			// clouds and mist slide with the morning air
			root.querySelectorAll<SVGSVGElement>('.kumo-w svg').forEach((c, i) => {
				const t = gsap.to(c, {
					x: i % 2 ? -22 : 22,
					duration: 28 + i * 6,
					ease: 'sine.inOut',
					yoyo: true,
					repeat: -1
				});
				t.progress(rnd(i, 3));
				tweens.push(t);
			});
			root.querySelectorAll<SVGSVGElement>('.mist svg').forEach((c, i) => {
				const t = gsap.to(c, {
					x: i % 2 ? -26 : 26,
					duration: 19 + i * 5,
					ease: 'sine.inOut',
					yoyo: true,
					repeat: -1
				});
				t.progress(rnd(i, 7));
				tweens.push(t);
			});

			// the koi cross their corner of the pond, unhurried
			root.querySelectorAll<SVGSVGElement>('.surface-koi svg').forEach((k, i) => {
				const t1 = gsap.to(k, {
					x: i % 2 ? -32 : 32,
					duration: 13 + rnd(i, 31) * 6,
					ease: 'sine.inOut',
					yoyo: true,
					repeat: -1
				});
				t1.progress(rnd(i, 33));
				const t2 = gsap.to(k, {
					y: 12 + rnd(i, 35) * 8,
					duration: 9 + rnd(i, 37) * 4,
					ease: 'sine.inOut',
					yoyo: true,
					repeat: -1
				});
				t2.progress(rnd(i, 39));
				tweens.push(t1, t2);
			});

			// seigaiha medallions: near-imperceptible slow spin
			root.querySelectorAll<SVGSVGElement>('.medallion svg').forEach((m, i) => {
				const t = gsap.to(m, {
					rotation: i % 2 ? 360 : -360,
					duration: 260 + i * 60,
					ease: 'none',
					repeat: -1
				});
				tweens.push(t);
			});

			// momiji: floating on the water, bobbing and slowly turning
			root.querySelectorAll<HTMLElement>('.momiji-leaf').forEach((l, i) => {
				const t1 = gsap.to(l, {
					y: -7 - rnd(i, 41) * 6,
					duration: 5 + rnd(i, 43) * 3,
					ease: 'sine.inOut',
					yoyo: true,
					repeat: -1
				});
				t1.progress(rnd(i, 45));
				const t2 = gsap.to(l, {
					rotation: i % 2 ? 14 : -12,
					duration: 9 + rnd(i, 47) * 5,
					ease: 'sine.inOut',
					yoyo: true,
					repeat: -1
				});
				t2.progress(rnd(i, 49));
				const t3 = gsap.to(l, {
					x: i % 2 ? -26 : 30,
					duration: 14 + rnd(i, 51) * 6,
					ease: 'sine.inOut',
					yoyo: true,
					repeat: -1
				});
				t3.progress(rnd(i, 53));
				tweens.push(t1, t2, t3);
			});

			// gentle mouse parallax on depth layers
			const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-depth]'));
			const qts = layers.map((el) => {
				const d = parseFloat(el.dataset.depth || '10');
				return {
					x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'sine.out' }),
					y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'sine.out' }),
					d
				};
			});
			const onMove = (e: PointerEvent) => {
				const nx = e.clientX / window.innerWidth - 0.5;
				const ny = e.clientY / window.innerHeight - 0.5;
				for (const q of qts) {
					q.x(nx * q.d);
					q.y(ny * q.d * 0.6);
				}
			};
			window.addEventListener('pointermove', onMove, { passive: true });
			removePointer = () => window.removeEventListener('pointermove', onMove);
		})();

		return () => {
			disposed = true;
			removePointer?.();
			tweens.forEach((t) => t.kill());
			if (gsapRef && root) gsapRef.killTweensOf(root.querySelectorAll('*'));
		};
	});
</script>

{#snippet kumo(w: number)}
	<svg viewBox="0 {-18} {w} 26" style="width:100%" xmlns="http://www.w3.org/2000/svg">
		<rect class="kumo-bar" x="0" y="-7" width={w} height="14" rx="7" />
		<rect class="kumo-bar" x={w * 0.28} y="-15" width={w * 0.5} height="12" rx="6" />
	</svg>
{/snippet}

{#snippet kasumi(w: number)}
	<svg viewBox="0 0 {w} 18" style="width:100%" xmlns="http://www.w3.org/2000/svg">
		<rect class="ka" x="0" y="0" width={w} height="11" rx="5.5" />
		<rect class="ka k2" x={w * 0.18} y="9" width={w * 0.62} height="8" rx="4" />
	</svg>
{/snippet}

{#snippet wavelet(w: number)}
	<svg viewBox="{-w - 2} -8 {2 * w + 4} 20" style="width:100%" xmlns="http://www.w3.org/2000/svg">
		<path class="wv" d="M {-w} 0 Q {-w * 0.5} {-w * 0.34} 0 0 Q {w * 0.5} {-w * 0.34} {w} 0" />
		<path class="wv" d="M {-w * 0.5} 7 Q {-w * 0.1} {7 - w * 0.26} {w * 0.3} 7" />
	</svg>
{/snippet}

{#snippet medallion(mid: string)}
	<svg class="med" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<g id="wmd-{mid}-fan">
				<circle r="22" class="med-fill" />
				<circle r="22" class="med-line" fill="none" />
				<circle r="16.5" class="med-line" fill="none" />
				<circle r="11" class="med-line" fill="none" />
				<circle r="5.5" class="med-line" fill="none" />
			</g>
			<pattern id="wmd-{mid}" width="44" height="22" patternUnits="userSpaceOnUse">
				<use href="#wmd-{mid}-fan" x="22" y="33" />
				<use href="#wmd-{mid}-fan" x="0" y="22" />
				<use href="#wmd-{mid}-fan" x="44" y="22" />
				<use href="#wmd-{mid}-fan" x="22" y="11" />
				<use href="#wmd-{mid}-fan" x="0" y="0" />
				<use href="#wmd-{mid}-fan" x="44" y="0" />
				<use href="#wmd-{mid}-fan" x="22" y="-11" />
			</pattern>
			<clipPath id="wmd-{mid}-clip"><circle cx="60" cy="60" r="52" /></clipPath>
		</defs>
		<circle cx="60" cy="60" r="56" class="med-ring-outer" />
		<g clip-path="url(#wmd-{mid}-clip)"><rect width="120" height="120" fill="url(#wmd-{mid})" /></g>
		<circle cx="60" cy="60" r="52" class="med-ring" />
	</svg>
{/snippet}

{#snippet surfaceKoi(robe: 'kohaku' | 'hi', heading: number, scale: number)}
	<svg viewBox="-88 -52 176 104" style="width:100%" xmlns="http://www.w3.org/2000/svg">
		<ellipse class="ripple" cx="-2" cy="10" rx="56" ry="11" />
		<ellipse class="ripple r2" cx="-2" cy="10" rx="36" ry="7" />
		<g transform="rotate({heading})">
			<Koi {robe} {scale} motion="tail" shadow={false} wag={2.3} />
		</g>
	</svg>
{/snippet}

{#snippet momiji()}
	<svg class="momiji-svg" viewBox="-20 -20 40 40" xmlns="http://www.w3.org/2000/svg">
		<g transform="rotate(15)">
			{#each [{ a: -84, s: 0.55 }, { a: -56, s: 0.75 }, { a: -28, s: 0.9 }, { a: 0, s: 1 }, { a: 28, s: 0.9 }, { a: 56, s: 0.75 }, { a: 84, s: 0.55 }] as l, i (i)}
				<path
					class="mo-lobe"
					transform="rotate({l.a}) scale({l.s})"
					d="M0 0C3 -5 4 -10 0 -17C-4 -10 -3 -5 0 0Z"
				/>
			{/each}
			<path class="mo-stem" d="M0 0C0.5 4 0 7 -1.5 11" />
		</g>
	</svg>
{/snippet}

<div class="water-decor" aria-hidden="true" bind:this={root}>
	<!-- the same morning as the pond: warm light from the top -->
	<div class="dawn"></div>

	<!-- sky: cloud bars and a few birds -->
	<div class="kumo-w k-tl" data-depth="6">{@render kumo(180)}</div>
	<div class="kumo-w k-tr" data-depth="8">{@render kumo(130)}</div>
	<svg class="birds" viewBox="-2 -14 70 22" data-depth="5">
		<path d="M0 0 q 4 -4 8 0 M8 0 q 4 -4 8 0" />
		<path transform="translate(27 -9) scale(0.85)" d="M0 0 q 4 -4 8 0 M8 0 q 4 -4 8 0" />
		<path transform="translate(52 4) scale(0.7)" d="M0 0 q 4 -4 8 0 M8 0 q 4 -4 8 0" />
	</svg>

	<!-- mist lying on the water -->
	<div class="mist mi-a" data-depth="10">{@render kasumi(300)}</div>
	<div class="mist mi-b" data-depth="12">{@render kasumi(230)}</div>

	<!-- seigaiha medallions stamped in the margins -->
	<div class="medallion m-tr" data-depth="9">{@render medallion('a')}</div>
	<div class="medallion m-l" data-depth="7">{@render medallion('b')}</div>

	<!-- koi crossing inside their ripples -->
	<div class="surface-koi koi-right" data-depth="16">
		{@render surfaceKoi('kohaku', -156, 0.62)}
	</div>
	<div class="surface-koi koi-left" data-depth="20">{@render surfaceKoi('hi', 14, 0.5)}</div>

	<!-- momiji drifting on the water -->
	<div class="leaf-field" data-depth="12">
		<div class="momiji-leaf ml-a">{@render momiji()}</div>
		<div class="momiji-leaf ml-b">{@render momiji()}</div>
		<div class="momiji-leaf ml-c">{@render momiji()}</div>
	</div>

	<!-- small still wave marks -->
	<div class="wave-mark wm-a">{@render wavelet(15)}</div>
	<div class="wave-mark wm-b">{@render wavelet(12)}</div>
	<div class="wave-mark wm-c">{@render wavelet(14)}</div>
	<div class="wave-mark wm-d">{@render wavelet(11)}</div>
	<div class="wave-mark wm-e">{@render wavelet(13)}</div>
</div>

<style>
	.water-decor {
		position: fixed;
		inset: 0;
		z-index: 6;
		pointer-events: none;
		overflow: hidden;
		contain: strict;
	}

	/* --- the dawn wash --- */
	.dawn {
		position: absolute;
		inset: 0 0 auto 0;
		height: 44vh;
		background: linear-gradient(
			180deg,
			#f4efe2 0%,
			color-mix(in srgb, #f4efe2 62%, transparent) 42%,
			transparent 100%
		);
	}

	/* --- sky --- */
	.kumo-w {
		position: absolute;
		will-change: transform;
	}
	.k-tl {
		top: 5%;
		left: 17%;
		width: clamp(120px, 13vw, 190px);
	}
	.k-tr {
		top: 7.5%;
		right: 6%;
		width: clamp(90px, 10vw, 140px);
	}
	.kumo-bar {
		fill: #f0e3c2;
		opacity: 0.85;
	}
	.birds {
		position: absolute;
		top: 8%;
		right: 22%;
		width: clamp(46px, 4.5vw, 66px);
	}
	.birds path {
		fill: none;
		stroke: #6b7c85;
		stroke-width: 1.4;
		stroke-linecap: round;
		opacity: 0.55;
	}

	/* --- mist on the water --- */
	.mist {
		position: absolute;
		will-change: transform;
	}
	.mi-a {
		top: 38%;
		left: -3rem;
		width: clamp(200px, 24vw, 340px);
	}
	.mi-b {
		bottom: 22%;
		right: -2.5rem;
		width: clamp(160px, 19vw, 270px);
	}
	.ka {
		fill: #f6f0e0;
		opacity: 0.75;
	}
	.ka.k2 {
		opacity: 0.5;
	}

	/* --- wave marks --- */
	.wave-mark {
		position: absolute;
	}
	.wm-a {
		left: 5%;
		top: 30%;
		width: 34px;
	}
	.wm-b {
		right: 6%;
		top: 52%;
		width: 26px;
	}
	.wm-c {
		left: 8%;
		bottom: 26%;
		width: 30px;
	}
	.wm-d {
		right: 12%;
		bottom: 12%;
		width: 24px;
	}
	.wm-e {
		left: 3%;
		top: 58%;
		width: 28px;
	}
	.wv {
		fill: none;
		stroke: #63b3c9;
		stroke-width: 1.6;
		stroke-linecap: round;
		opacity: 0.5;
	}

	/* --- koi in their ripples --- */
	.surface-koi {
		position: absolute;
		width: clamp(120px, 12vw, 185px);
		will-change: transform;
	}
	.koi-right {
		right: 2.5%;
		top: 33%;
	}
	.koi-left {
		left: 2%;
		top: 62%;
	}
	.surface-koi svg {
		display: block;
		width: 100%;
		height: auto;
		will-change: transform;
	}
	.ripple {
		fill: none;
		stroke: rgba(255, 255, 255, 0.7);
		stroke-width: 1.4;
	}
	.ripple.r2 {
		stroke-width: 1.1;
		opacity: 0.7;
	}

	/* --- seigaiha medallions --- */
	.medallion {
		position: absolute;
		width: clamp(90px, 9vw, 140px);
		opacity: 0.3;
		will-change: transform;
	}
	.m-tr {
		top: 13%;
		right: 4%;
	}
	.m-l {
		top: 42%;
		left: 3.5%;
	}
	svg.med {
		display: block;
		width: 100%;
		height: auto;
		will-change: transform;
	}
	.med-fill {
		fill: var(--bg, #e8f4f8);
	}
	.med-line {
		stroke: var(--water-deep, #2b9cba);
		stroke-opacity: 0.55;
		stroke-width: 1.3;
	}
	.med-ring {
		fill: none;
		stroke: var(--water-deep, #2b9cba);
		stroke-opacity: 0.5;
		stroke-width: 1.6;
	}
	.med-ring-outer {
		fill: var(--bg, #e8f4f8);
		fill-opacity: 0.5;
		stroke: var(--water-deep, #2b9cba);
		stroke-opacity: 0.3;
		stroke-width: 1;
	}

	/* --- momiji leaves --- */
	.leaf-field {
		position: absolute;
		inset: 0;
		will-change: transform;
	}
	.momiji-leaf {
		position: absolute;
		opacity: 0.85;
		will-change: transform;
	}
	.ml-a {
		left: 10%;
		bottom: 14%;
		width: 34px;
	}
	.ml-b {
		right: 15%;
		bottom: 8%;
		width: 26px;
	}
	.ml-c {
		right: 6%;
		bottom: 28%;
		width: 30px;
	}
	.momiji-svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.mo-lobe {
		fill: #cd5b45;
	}
	.ml-b .mo-lobe {
		fill: #d97a54;
	}
	.mo-stem {
		fill: none;
		stroke: #a34433;
		stroke-width: 1.4;
		stroke-linecap: round;
	}

	@media (max-width: 950px) {
		.surface-koi,
		.medallion,
		.momiji-leaf,
		.wm-b,
		.wm-e {
			display: none;
		}
	}
	@media (max-width: 700px) {
		.k-tr,
		.mi-b {
			display: none;
		}
		.kumo-w.k-tl {
			width: clamp(90px, 24vw, 130px);
		}
		.mist.mi-a {
			width: clamp(150px, 42vw, 220px);
		}
	}
</style>
