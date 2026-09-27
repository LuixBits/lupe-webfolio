<script lang="ts">
	/** »Der Anlegesteg« — the whole CV as one pond at dawn, composed like a
	 *  woodblock print. Time is distance: the SIGA flagship rides big in the
	 *  foreground, the beginnings wait small and hazy by the far torii, and
	 *  one mooring current ties every craft to the "heute" bollard. Every
	 *  vessel is a real link — step aboard for the Logbuch.
	 *
	 *  Two fixed compositions share the same fleet: the wide PANORAMA and,
	 *  under 700px, the vertical QUAY. Both render (SSR-safe, links work
	 *  without JS); a media query shows one. Print devices on purpose:
	 *  kumo cloud bars, kasumi mist, seigaiha patches, dash-stylized
	 *  reflections, and the artist's seal in the corner. */
	import { onMount } from 'svelte';
	import { cvPdf, HULL_NAME, vessels, vesselStations } from '$lib/content/cv';
	import { resolveLocalized, resolveSpan, type Vessel as VesselT } from '$lib/content/schema';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import { prefersReducedMotion } from '$lib/garden/reveal';
	import Koi from '../Koi.svelte';
	import Seigaiha from '../Seigaiha.svelte';
	import Torii from './Torii.svelte';
	import Vessel from './Vessel.svelte';

	const locale = getLocale();

	/** A closed smooth ellipse loop for CSS offset-path (four cubic arcs). */
	const loop = (cx: number, cy: number, rx: number, ry: number) => {
		const k = 0.5523;
		return (
			`M${cx + rx} ${cy}` +
			`C${cx + rx} ${cy + ry * k} ${cx + rx * k} ${cy + ry} ${cx} ${cy + ry}` +
			`C${cx - rx * k} ${cy + ry} ${cx - rx} ${cy + ry * k} ${cx - rx} ${cy}` +
			`C${cx - rx} ${cy - ry * k} ${cx - rx * k} ${cy - ry} ${cx} ${cy - ry}` +
			`C${cx + rx * k} ${cy - ry} ${cx + rx} ${cy - ry * k} ${cx + rx} ${cy}Z`
		);
	};

	interface Moor {
		slug: VesselT['slug'];
		x: number;
		y: number;
		s: number;
		/** float-tag offset from the mooring point */
		tx: number;
		ty: number;
		haze?: boolean;
	}
	// the panorama: newest large in front-left, oldest small by the far gate
	const PANO: Moor[] = [
		{ slug: 'siga', x: 330, y: 378, s: 1.18, tx: 168, ty: 26 },
		{ slug: 'hslu', x: 575, y: 306, s: 0.92, tx: 118, ty: 30 },
		{ slug: 'neptun', x: 755, y: 252, s: 0.8, tx: -128, ty: 20 },
		{ slug: 'armee', x: 890, y: 208, s: 0.68, tx: -118, ty: 18, haze: true },
		{ slug: 'emvs', x: 985, y: 176, s: 0.58, tx: -136, ty: 32, haze: true }
	];

	// the quay: the same fleet re-moored down a vertical line for phones
	const QUAY: Moor[] = [
		{ slug: 'siga', x: 215, y: 226, s: 0.95, tx: 118, ty: 4 },
		{ slug: 'hslu', x: 200, y: 398, s: 0.95, tx: 128, ty: -6 },
		{ slug: 'neptun', x: 225, y: 552, s: 0.95, tx: -132, ty: -6 },
		{ slug: 'armee', x: 205, y: 692, s: 0.95, tx: 122, ty: -8 },
		{ slug: 'emvs', x: 175, y: 812, s: 0.9, tx: -108, ty: -32 }
	];

	const byId = new Map(vessels.map((v) => [v.slug, v]));
	const vOf = (slug: VesselT['slug']) => byId.get(slug)!;
	const label = (v: VesselT) =>
		`${v.org} · ${resolveSpan(v.span, locale)} — ${vesselStations(v)
			.map((s) => resolveLocalized(s.role, locale))
			.join(', ')}`;

	/* ---- the play: one hungry free koi, the surfacing namazu, and the
	 * Flaschenpost. Positions are per-layout; only the visible svg receives
	 * pointer events, and all listeners attach post-mount (reduced motion
	 * keeps the harbor still and skips the games). ---- */
	interface PlaySpots {
		waterY: number;
		fkHome: { x: number; y: number };
		namazu: { x: number; y: number; s: number };
		bottle: { x: number; y: number };
	}
	const PLAY: Record<'pano' | 'quay', PlaySpots> = {
		pano: {
			waterY: 120,
			fkHome: { x: 505, y: 452 },
			namazu: { x: 1085, y: 464, s: 1 },
			bottle: { x: 700, y: 468 }
		},
		quay: {
			waterY: 110,
			fkHome: { x: 310, y: 640 },
			namazu: { x: 66, y: 336, s: 0.82 },
			bottle: { x: 330, y: 592 }
		}
	};

	let mode = $state<'pano' | 'quay'>('pano');
	let instant = $state(false);
	let fk = $state({ x: PLAY.pano.fkHome.x, y: PLAY.pano.fkHome.y, a: 0 });
	let pellets = $state<{ id: number; x: number; y: number }[]>([]);
	let nzGaze = $state(0);
	let nzBlink = $state(false);
	let calmN = $state(0);
	let panoSvg = $state<SVGSVGElement | null>(null);
	let quaySvg = $state<SVGSVGElement | null>(null);
	let blinkT: ReturnType<typeof setTimeout> | undefined;
	let homeT: ReturnType<typeof setTimeout> | undefined;

	const activeSvg = () => (mode === 'pano' ? panoSvg : quaySvg);

	/** client → viewBox coords of the active layout. */
	function svgPoint(cx: number, cy: number): { x: number; y: number } | null {
		const svg = activeSvg();
		const ctm = svg?.getScreenCTM();
		if (!svg || !ctm) return null;
		const pt = new DOMPoint(cx, cy).matrixTransform(ctm.inverse());
		return { x: pt.x, y: pt.y };
	}

	function namazuClick() {
		calmN += 1;
		nzBlink = true;
		clearTimeout(blinkT);
		blinkT = setTimeout(() => (nzBlink = false), 950);
	}

	onMount(() => {
		instant = prefersReducedMotion();
		const mq = window.matchMedia('(min-width: 700px)');
		const applyMode = () => {
			mode = mq.matches ? 'pano' : 'quay';
			const h = PLAY[mode].fkHome;
			fk = { x: h.x, y: h.y, a: 0 };
		};
		applyMode();
		mq.addEventListener('change', applyMode);
		if (instant) return () => mq.removeEventListener('change', applyMode);

		// feed the koi: a click on open water drops a pellet
		let lastFeed = 0;
		let pelletN = 0;
		const onClick = (e: MouseEvent) => {
			const t = e.target as Element | null;
			if (!t || typeof t.closest !== 'function') return;
			if (!t.closest('.pond')) return;
			if (t.closest('a,[role=button]')) return;
			const now = performance.now();
			if (now - lastFeed < 1500) return;
			const p = svgPoint(e.clientX, e.clientY);
			if (!p) return;
			const spots = PLAY[mode];
			if (p.y < spots.waterY + 18) return;
			lastFeed = now;
			const id = ++pelletN;
			pellets = [...pellets, { id, x: p.x, y: p.y }];
			setTimeout(() => (pellets = pellets.filter((q) => q.id !== id)), 2000);
			// the free koi turns and glides to meet it where it settles
			const ty = p.y + 22;
			const ang = (Math.atan2(ty - fk.y, p.x - fk.x) * 180) / Math.PI;
			const nose = 34;
			fk = {
				x: p.x - Math.cos((ang * Math.PI) / 180) * nose,
				y: ty - Math.sin((ang * Math.PI) / 180) * nose,
				a: ang
			};
			clearTimeout(homeT);
			homeT = setTimeout(() => {
				const h = PLAY[mode].fkHome;
				fk = { x: h.x, y: h.y, a: 0 };
			}, 6000);
		};

		// the namazu's eyes follow the cursor (fine pointers only)
		let moveRaf = 0;
		let mx = 0;
		let my = 0;
		const applyGaze = () => {
			moveRaf = 0;
			const nz = PLAY[mode].namazu;
			const p = svgPoint(mx, my);
			if (!p) return;
			nzGaze = (Math.atan2(p.y - (nz.y - 15), p.x - nz.x) * 180) / Math.PI;
		};
		const onMove = (e: PointerEvent) => {
			mx = e.clientX;
			my = e.clientY;
			if (!moveRaf) moveRaf = requestAnimationFrame(applyGaze);
		};
		window.addEventListener('click', onClick);
		if (window.matchMedia('(pointer: fine)').matches)
			window.addEventListener('pointermove', onMove, { passive: true });

		return () => {
			mq.removeEventListener('change', applyMode);
			window.removeEventListener('click', onClick);
			window.removeEventListener('pointermove', onMove);
			if (moveRaf) cancelAnimationFrame(moveRaf);
			clearTimeout(blinkT);
			clearTimeout(homeT);
		};
	});
</script>

{#snippet kumo(w: number)}
	<rect class="kumo" x="0" y="-7" width={w} height="14" rx="7" />
	<rect class="kumo" x={w * 0.28} y="-15" width={w * 0.5} height="12" rx="6" />
{/snippet}

{#snippet kasumi(w: number)}
	<rect class="kasumi" x="0" y="0" width={w} height="11" rx="5.5" />
	<rect class="kasumi k2" x={w * 0.18} y="9" width={w * 0.62} height="8" rx="4" />
{/snippet}

{#snippet birds()}
	<g class="birds">
		<path d="M0 0 q 4 -4 8 0 M8 0 q 4 -4 8 0" />
		<path transform="translate(27 -9) scale(0.85)" d="M0 0 q 4 -4 8 0 M8 0 q 4 -4 8 0" />
		<path transform="translate(52 4) scale(0.7)" d="M0 0 q 4 -4 8 0 M8 0 q 4 -4 8 0" />
	</g>
{/snippet}

{#snippet bollard()}
	<rect class="bl-post" x="-6.5" y="-36" width="13" height="38" rx="2.5" />
	<ellipse class="bl-top" cx="0" cy="-36" rx="6.5" ry="2.6" />
	<path class="bl-rope" d="M -7 -26 Q 0 -22 7 -26 M -7 -20 Q 0 -16 7 -20" />
	<g class="vx-reflect2">
		<path d="M -8 8 L 7 8" style="stroke-width:3" />
		<path d="M -5 13 L 4 13" style="stroke-width:2.2" />
	</g>
	<g transform="translate(15 -30) rotate(4)">
		<path class="uk-tie" d="M -8 6 Q -12 2 -15 4" />
		<rect class="uk-tag" x="-6" y="-8" width="46" height="17" rx="2.5" />
		<text class="uk-text" x="17" y="4">{m.cv_today()}</text>
	</g>
{/snippet}

<!-- an uki float with its washi span-tag -->
{#snippet uki(span: string)}
	<ellipse class="uk-float" cx="0" cy="0" rx="7" ry="3" />
	<path class="uk-tie" d="M 0 -2 L 0 -8" />
	<rect
		class="uk-tag"
		x={-(span.length * 5.4 + 10) / 2}
		y="-24"
		width={span.length * 5.4 + 10}
		height="16"
		rx="2.5"
	/>
	<text class="uk-text" x="0" y="-12.5">{span}</text>
{/snippet}

{#snippet seal()}
	<g class="seal" transform="rotate(-2)">
		<rect x="-13" y="-13" width="26" height="26" rx="4" />
		<text y="4.5">LP</text>
	</g>
{/snippet}

<!-- the namazu, surfaced: dome, googly eyes, whiskers lying on the water.
     In myth he shakes the earth; petted here, he keeps the sea calm. -->
{#snippet namazuShape()}
	<ellipse class="nz-ripple" cx="0" cy="0" rx="36" ry="6.5" />
	<ellipse class="nz-under" cx="0" cy="6" rx="27" ry="5" />
	<path class="nz-head" d="M -28 2 C -28 -10 -14 -16 0 -16 C 14 -16 28 -10 28 2 Z" />
	<circle class="nz-head" cx="-11" cy="-14" r="6" />
	<circle class="nz-head" cx="11" cy="-14" r="6" />
	<path class="nz-whisker" d="M -24 -4 Q -38 -9 -50 -4 M -22 -1 Q -33 0 -42 4" />
	<path class="nz-whisker" d="M 24 -4 Q 38 -9 50 -4 M 22 -1 Q 33 0 42 4" />
	<circle class="nz-eyeball" cx="-11" cy="-14.5" r="3.6" />
	<circle class="nz-eyeball" cx="11" cy="-14.5" r="3.6" />
	<g transform="translate(-11 -14.5)">
		<g class="nz-pupil" style="transform: rotate({nzGaze}deg)"><circle cx="1.5" r="1.8" /></g>
	</g>
	<g transform="translate(11 -14.5)">
		<g class="nz-pupil" style="transform: rotate({nzGaze}deg)"><circle cx="1.5" r="1.8" /></g>
	</g>
	<circle class="nz-glint" cx="-12.4" cy="-15.9" r="0.8" />
	<circle class="nz-glint" cx="9.6" cy="-15.9" r="0.8" />
	<ellipse class="nz-lid" class:blink={nzBlink} cx="-11" cy="-14.5" rx="4" ry="3.8" />
	<ellipse class="nz-lid" class:blink={nzBlink} cx="11" cy="-14.5" rx="4" ry="3.8" />
	<circle class="nz-nostril" cx="-4" cy="-9" r="0.9" />
	<circle class="nz-nostril" cx="4" cy="-9" r="0.9" />
{/snippet}

<!-- die Flaschenpost, adrift: half-lowered glass, the CV rolled inside -->
{#snippet bottleShape(tagText: string)}
	<ellipse class="nz-ripple" cx="0" cy="2" rx="34" ry="5.5" />
	<g transform="rotate(-10)">
		<path
			class="bt-glass"
			d="M -22 2 L 14 2 Q 21 2 21 -5 Q 21 -12 14 -12 L -22 -12 Q -29 -12 -29 -5 Q -29 2 -22 2 Z"
		/>
		<path class="bt-paper" d="M -17 -2 L 6 -2 L 8 -9 L -15 -9 Z" />
		<path class="bt-neck" d="M 21 -3 L 31 -3 L 31 -8 L 21 -8 Z" />
		<path class="bt-cork" d="M 31 -1.8 L 38 -1.8 L 38 -9.5 L 31 -9.5 Z" />
		<path class="bt-shine" d="M -24 -9 Q -4 -12 16 -10" />
	</g>
	<g transform="translate(8 18) rotate(-2)">
		<path class="uk-tie" d="M 12 -14 Q 4 -10 -2 -8" />
		<rect
			class="uk-tag"
			x={-(tagText.length * 5.4 + 10) / 2}
			y="-8"
			width={tagText.length * 5.4 + 10}
			height="16"
			rx="2.5"
		/>
		<text class="uk-text" x="0" y="3.5">{tagText}</text>
	</g>
{/snippet}

<!-- per-layout play: the hungry free koi, pellets, namazu and bottle -->
{#snippet play(key: 'pano' | 'quay')}
	{@const sp = PLAY[key]}
	{#if mode === key}
		<g class="free-koi" style="transform: translate({fk.x}px, {fk.y}px)">
			<g
				class="fk-pose"
				style="transform: rotate({fk.a}deg) scale(1, {Math.abs(fk.a) > 90 ? -1 : 1})"
			>
				<Koi robe="asagi" scale={0.42} motion="tail" shadow={false} wag={2} />
			</g>
		</g>
		{#each pellets as pl (pl.id)}
			<circle class="pellet" cx={pl.x} cy={pl.y} r="2.8" />
		{/each}
	{/if}
	<g transform="translate({sp.namazu.x} {sp.namazu.y}) scale({sp.namazu.s})">
		{#if calmN > 0 && mode === key}
			{#key calmN}
				<g class="calm-burst" aria-hidden="true">
					<circle class="calm-b" cx="-8" cy="-20" r="2" style="--cd:0ms" />
					<circle class="calm-b" cx="4" cy="-24" r="1.5" style="--cd:140ms" />
					<circle class="calm-b" cx="12" cy="-19" r="1.2" style="--cd:260ms" />
					<text class="calm-text" y="-34">{m.cv_namazu_calm()}</text>
				</g>
			{/key}
		{/if}
		<g
			class="namazu-hit"
			role="button"
			tabindex="0"
			aria-label={m.cv_namazu_label()}
			onclick={namazuClick}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					namazuClick();
				}
			}}
		>
			{@render namazuShape()}
		</g>
	</g>
	<g transform="translate({sp.bottle.x} {sp.bottle.y})">
		{#if cvPdf}
			<a class="bottle-link" href={cvPdf} download aria-label={m.cv_pdf_label()}>
				{@render bottleShape(m.cv_pdf_label())}
			</a>
		{:else}
			<g class="bob" style="--bd:8.4s">{@render bottleShape(m.cv_pdf_placeholder())}</g>
		{/if}
	</g>
{/snippet}

<div class="pond" role="group" aria-label={m.cv_moor_hint()}>
	<!-- ============ THE PANORAMA (≥700px) ============ -->
	<svg bind:this={panoSvg} class="pano" viewBox="0 0 1200 528" preserveAspectRatio="xMidYMid meet">
		<defs>
			<linearGradient id="pd-sky" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="#f4efe2" />
				<stop offset="0.72" stop-color="#efeee2" />
				<stop offset="1" stop-color="#dcebe9" />
			</linearGradient>
			<linearGradient id="pd-water" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="#cfeaf0" />
				<stop offset="0.35" stop-color="#abdbe6" />
				<stop offset="1" stop-color="#7cc2d6" />
			</linearGradient>
			<linearGradient id="pd-out" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="#e8f4f8" stop-opacity="0" />
				<stop offset="1" stop-color="#e8f4f8" />
			</linearGradient>
			<radialGradient id="pd-sun">
				<stop offset="0" stop-color="#f9edd0" stop-opacity="0.95" />
				<stop offset="0.45" stop-color="#f6e6bb" stop-opacity="0.5" />
				<stop offset="1" stop-color="#f6e6bb" stop-opacity="0" />
			</radialGradient>
			<Seigaiha pid="pd-sg" />
		</defs>

		<!-- sky: bokashi wash, sun over the gate, kumo bars, a skein of birds -->
		<rect width="1200" height="120" fill="url(#pd-sky)" />
		<circle cx="1004" cy="60" r="46" fill="url(#pd-sun)" />
		<circle class="sun-core" cx="1004" cy="60" r="19" />
		<g transform="translate(120 52)">{@render kumo(150)}</g>
		<g transform="translate(430 28)">{@render kumo(110)}</g>
		<g transform="translate(505 66)">{@render birds()}</g>
		<path
			class="ridge r1"
			d="M0 120 C 130 108 280 115 430 108 C 580 102 720 113 880 107 C 1000 103 1110 111 1200 106 L 1200 120 Z"
		/>
		<path
			class="ridge r2"
			d="M0 120 C 180 113 360 117 540 113 C 720 109 900 116 1080 112 L 1200 114 L 1200 120 Z"
		/>

		<!-- the water -->
		<rect y="120" width="1200" height="408" fill="url(#pd-water)" />
		<path class="horizon" d="M0 120 L 1200 120" />
		<rect class="sg-patch" x="40" y="121" width="300" height="34" rx="10" fill="url(#pd-sg)" />
		<rect class="sg-patch p2" x="600" y="121" width="240" height="26" rx="9" fill="url(#pd-sg)" />
		<rect class="sg-patch p3" x="1010" y="121" width="190" height="30" rx="9" fill="url(#pd-sg)" />
		<rect class="sg-patch p4" x="180" y="394" width="300" height="30" rx="10" fill="url(#pd-sg)" />

		<!-- the far gate, where the current begins -->
		<g transform="translate(1042 55) scale(0.55)">
			<Torii pid="pd-torii" />
		</g>
		<text class="origin-cap" x="1080" y="156">{m.cv_origin()}</text>

		<!-- kasumi mist crossing the far water -->
		<g class="drift-a" transform="translate(400 144)">{@render kasumi(430)}</g>

		<!-- the mooring current: one line from the gate to today -->
		<path
			class="current"
			d="M 1080 132 C 1050 150 1020 164 985 180 C 950 196 922 200 890 212 C 850 226 800 238 755 256 C 700 276 640 290 575 310 C 500 336 420 354 330 382 C 262 402 202 426 158 446"
		/>

		<!-- koi passing beneath the surface -->
		<g class="under">
			<Koi
				robe="kohaku"
				scale={0.72}
				motion="tail"
				shadow={false}
				wag={2.4}
				swim={{ path: loop(330, 424, 175, 24), dur: 84, rest: '30%' }}
			/>
		</g>
		<g class="under u2">
			<Koi
				robe="asagi"
				scale={0.5}
				motion="tail"
				shadow={false}
				wag={2}
				swim={{ path: loop(660, 360, 150, 20), dur: 66, rest: '62%', delay: -21 }}
			/>
		</g>
		<g class="under u3">
			<Koi
				robe="hi"
				scale={0.34}
				motion="tail"
				shadow={false}
				wag={1.8}
				swim={{ path: loop(880, 238, 72, 11), dur: 48, rest: '12%', delay: -9 }}
			/>
		</g>

		<!-- the fleet, moored along it (each craft is a real doorway) -->
		{#each PANO as sp, i (sp.slug)}
			{@const v = vOf(sp.slug)}
			<circle class="moor-knot" cx={sp.x} cy={sp.y} r="2" />
			<a
				class="craft"
				class:haze={sp.haze}
				style="--i:{i}"
				href={localizeHref(`/cv/${sp.slug}`)}
				aria-label={label(v)}
			>
				<g transform="translate({sp.x} {sp.y}) scale({sp.s})">
					<ellipse class="craft-ring" cx="0" cy="4" rx="105" ry="17" />
					<g class="bob" style="--bd:{6.4 + i * 0.9}s; --bdel:{-i * 2.1}s">
						<Vessel slug={sp.slug} name={HULL_NAME[sp.slug]} />
					</g>
				</g>
			</a>
			<g
				class="uki"
				transform="translate({sp.x + sp.tx} {sp.y + sp.ty}) scale({Math.max(0.72, sp.s * 0.8)})"
			>
				{@render uki(resolveSpan(v.span, locale))}
			</g>
		{/each}

		<!-- the "heute" bollard the current ends on -->
		<g transform="translate(152 448)">{@render bollard()}</g>

		<!-- quiet rings; near mist floating over the middle distance -->
		<g transform="translate(520 208)">
			<ellipse class="ring" rx="30" ry="7" style="--rd:0s" />
			<ellipse class="ring" rx="30" ry="7" style="--rd:4s" />
		</g>
		<g class="drift-b" transform="translate(690 230)">{@render kasumi(360)}</g>

		{@render play('pano')}

		<rect y="498" width="1200" height="30" fill="url(#pd-out)" />

		<!-- the print is signed -->
		<g transform="translate(1152 494)">{@render seal()}</g>
	</svg>

	<!-- ============ THE QUAY (<700px): the same harbor, walked down ============ -->
	<svg bind:this={quaySvg} class="quay" viewBox="0 0 420 940" preserveAspectRatio="xMidYMid meet">
		<defs>
			<linearGradient id="pq-sky" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="#f4efe2" />
				<stop offset="1" stop-color="#dcebe9" />
			</linearGradient>
			<linearGradient id="pq-out" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="#e8f4f8" stop-opacity="0" />
				<stop offset="1" stop-color="#e8f4f8" />
			</linearGradient>
			<radialGradient id="pq-sun">
				<stop offset="0" stop-color="#f9edd0" stop-opacity="0.95" />
				<stop offset="0.45" stop-color="#f6e6bb" stop-opacity="0.5" />
				<stop offset="1" stop-color="#f6e6bb" stop-opacity="0" />
			</radialGradient>
			<linearGradient id="pq-water" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="#cfeaf0" />
				<stop offset="0.3" stop-color="#abdbe6" />
				<stop offset="1" stop-color="#7cc2d6" />
			</linearGradient>
			<Seigaiha pid="pq-sg" />
		</defs>

		<rect width="420" height="110" fill="url(#pq-sky)" />
		<circle cx="352" cy="48" r="34" fill="url(#pq-sun)" />
		<circle class="sun-core" cx="352" cy="48" r="15" />
		<g transform="translate(36 42)">{@render kumo(96)}</g>
		<g transform="translate(180 64) scale(0.85)">{@render birds()}</g>
		<path
			class="ridge r1"
			d="M0 110 C 70 102 160 106 250 101 C 330 98 380 104 420 101 L 420 110 Z"
		/>
		<rect y="110" width="420" height="830" fill="url(#pq-water)" />
		<path class="horizon" d="M0 110 L 420 110" />
		<rect class="sg-patch" x="16" y="111" width="170" height="26" rx="8" fill="url(#pq-sg)" />
		<rect class="sg-patch p2" x="290" y="111" width="120" height="22" rx="8" fill="url(#pq-sg)" />

		<!-- the current walks the quay: today up top, the gate at the bottom -->
		<path
			class="current"
			d="M 74 164 C 130 180 180 196 215 226 C 250 258 230 320 200 398 C 176 462 196 500 225 552 C 250 596 232 640 205 692 C 182 736 168 772 175 812 C 182 852 226 878 268 896"
		/>
		<g transform="translate(70 168)">{@render bollard()}</g>

		<g class="under">
			<Koi
				robe="kohaku"
				scale={0.44}
				motion="tail"
				shadow={false}
				wag={2.2}
				swim={{ path: loop(300, 314, 72, 13), dur: 58, rest: '30%' }}
			/>
		</g>
		<g class="under u2">
			<Koi
				robe="hi"
				scale={0.32}
				motion="tail"
				shadow={false}
				wag={1.9}
				swim={{ path: loop(120, 624, 62, 11), dur: 46, rest: '64%', delay: -13 }}
			/>
		</g>

		{#each QUAY as sp, i (sp.slug)}
			{@const v = vOf(sp.slug)}
			<circle class="moor-knot" cx={sp.x} cy={sp.y} r="2" />
			<a class="craft" style="--i:{i}" href={localizeHref(`/cv/${sp.slug}`)} aria-label={label(v)}>
				<g transform="translate({sp.x} {sp.y}) scale({sp.s})">
					<ellipse class="craft-ring" cx="0" cy="4" rx="112" ry="20" />
					<g class="bob" style="--bd:{6.6 + i * 0.8}s; --bdel:{-i * 1.9}s">
						<Vessel slug={sp.slug} name={HULL_NAME[sp.slug]} />
					</g>
				</g>
			</a>
			<g class="uki" transform="translate({sp.x + sp.tx} {sp.y + sp.ty}) scale(0.86)">
				{@render uki(resolveSpan(v.span, locale))}
			</g>
		{/each}

		<g class="drift-a" transform="translate(60 476)">{@render kasumi(300)}</g>
		<g transform="translate(330 470)">
			<ellipse class="ring" rx="24" ry="6" style="--rd:0s" />
			<ellipse class="ring" rx="24" ry="6" style="--rd:4.5s" />
		</g>

		<!-- the far gate closes the walk -->
		<g transform="translate(266 838) scale(0.52)">
			<Torii pid="pq-torii" />
		</g>
		<text class="origin-cap" x="252" y="928">{m.cv_origin()}</text>

		{@render play('quay')}

		<rect y="908" width="420" height="32" fill="url(#pq-out)" />
		<g transform="translate(382 916)">{@render seal()}</g>
	</svg>
</div>

<style>
	.pond {
		display: block;
	}
	.pond svg {
		display: block;
		width: 100%;
		height: auto;
	}
	/* two compositions, one visible: the panorama wide, the quay on phones */
	.pond .quay {
		display: none;
	}
	@media (max-width: 699.9px) {
		.pond .pano {
			display: none;
		}
		.pond .quay {
			display: block;
		}
	}

	/* ---- sky ---- */
	.sun-core {
		fill: #f8ecd0;
		opacity: 0.9;
	}
	.kumo {
		fill: #f0e3c2;
		opacity: 0.75;
	}
	.birds path {
		fill: none;
		stroke: #6b7c85;
		stroke-width: 1.4;
		stroke-linecap: round;
		opacity: 0.6;
	}
	.ridge.r1 {
		fill: #dfe9e6;
		opacity: 0.9;
	}
	.ridge.r2 {
		fill: #cbdcd9;
		opacity: 0.85;
	}
	.horizon {
		stroke: rgba(255, 255, 255, 0.8);
		stroke-width: 1.4;
	}

	/* ---- water dressing ---- */
	.sg-patch {
		opacity: 0.4;
	}
	.sg-patch.p2 {
		opacity: 0.28;
	}
	.sg-patch.p3 {
		opacity: 0.34;
	}
	.sg-patch.p4 {
		opacity: 0.22;
	}
	.kasumi {
		fill: #fbf7ec;
		opacity: 0.5;
	}
	.kasumi.k2 {
		opacity: 0.32;
	}
	.origin-cap {
		font:
			italic 12.5px var(--font-display, Georgia),
			serif;
		fill: #14424f;
		text-anchor: middle;
		opacity: 0.85;
	}
	.current {
		fill: none;
		stroke: #eef8f8;
		stroke-width: 2.2;
		stroke-linecap: round;
		stroke-dasharray: 2 9;
		opacity: 0.85;
	}
	.moor-knot {
		fill: #eef8f8;
		opacity: 0.9;
	}

	/* ---- craft links ---- */
	a.craft {
		outline: none;
		cursor: pointer;
	}
	.craft-ring {
		fill: transparent;
		stroke: #ffffff;
		stroke-width: 1.6;
		opacity: 0;
	}
	.craft.haze {
		opacity: 0.82;
	}
	.craft:hover .craft-ring,
	.craft:focus-visible .craft-ring {
		opacity: 0.75;
	}
	.craft:focus-visible .craft-ring {
		stroke-dasharray: 6 6;
	}
	.uki {
		pointer-events: none;
	}
	.uk-float {
		fill: #c9a86a;
		stroke: #8a6a42;
		stroke-width: 0.9;
	}
	.uk-tie {
		fill: none;
		stroke: #8a6a42;
		stroke-width: 1;
		opacity: 0.85;
	}
	.uk-tag {
		fill: #f5efdf;
		stroke: rgba(44, 36, 27, 0.45);
		stroke-width: 0.9;
	}
	.uk-text {
		fill: #2c241b;
		font: 11px var(--font-body, sans-serif);
		font-variant-numeric: tabular-nums;
		text-anchor: middle;
	}

	/* ---- the bollard ---- */
	.bl-post {
		fill: #6a4c37;
		stroke: #382718;
		stroke-width: 1;
	}
	.bl-top {
		fill: #8a6a4d;
		stroke: #382718;
		stroke-width: 0.9;
	}
	.bl-rope {
		fill: none;
		stroke: #c9a86a;
		stroke-width: 2.4;
		opacity: 0.95;
	}
	.vx-reflect2 path {
		fill: none;
		stroke: rgba(24, 60, 74, 0.3);
		stroke-linecap: round;
	}

	/* ---- life ---- */
	.under {
		opacity: 0.55;
	}
	.ring {
		fill: none;
		stroke: #ffffff;
		stroke-width: 1.3;
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
	}

	/* ---- the play ---- */
	.pellet {
		fill: #8a6a42;
		stroke: #5c4527;
		stroke-width: 0.8;
	}
	.nz-ripple {
		fill: none;
		stroke: #ffffff;
		stroke-width: 1.3;
		opacity: 0.55;
	}
	.nz-under {
		fill: rgba(24, 60, 74, 0.25);
	}
	.nz-head {
		fill: #3a4c58;
		stroke: #24333d;
		stroke-width: 1.1;
	}
	.nz-whisker {
		fill: none;
		stroke: rgba(210, 226, 232, 0.8);
		stroke-width: 1.4;
		stroke-linecap: round;
	}
	.nz-eyeball {
		fill: #dfe9ee;
	}
	.nz-pupil circle {
		fill: #10181d;
	}
	.nz-glint {
		fill: #f4fbfd;
		pointer-events: none;
	}
	.nz-lid {
		fill: #3a4c58;
		transform: scaleY(0);
		transform-box: fill-box;
		transform-origin: center 12%;
	}
	.nz-nostril {
		fill: #24333d;
		opacity: 0.85;
	}
	.namazu-hit {
		pointer-events: auto;
		cursor: pointer;
		outline: none;
	}
	.namazu-hit:focus-visible .nz-ripple {
		stroke-dasharray: 5 5;
		opacity: 1;
	}
	.calm-b {
		fill: none;
		stroke: #ffffff;
		stroke-width: 1.2;
		opacity: 0;
	}
	.calm-text {
		fill: #14424f;
		font:
			italic 600 13px var(--font-display, Georgia),
			serif;
		text-anchor: middle;
		opacity: 0;
	}
	.bottle-link {
		pointer-events: auto;
		cursor: pointer;
		outline: none;
	}
	.bottle-link:focus-visible .bt-glass {
		stroke: #14424f;
		stroke-width: 2;
	}
	.bt-glass {
		fill: rgba(140, 190, 170, 0.42);
		stroke: #7fae9c;
		stroke-width: 1.2;
	}
	.bt-shine {
		fill: none;
		stroke: #eaf6ef;
		stroke-width: 1;
		opacity: 0.6;
	}
	.bt-paper {
		fill: #efe5cc;
		stroke: #b3a582;
		stroke-width: 0.7;
	}
	.bt-neck {
		fill: rgba(140, 190, 170, 0.45);
		stroke: #7fae9c;
		stroke-width: 1.1;
	}
	.bt-cork {
		fill: #8a6a4d;
		stroke: #5c4527;
		stroke-width: 0.9;
	}

	/* ---- the seal ---- */
	.seal rect {
		fill: #c43f2a;
		stroke: rgba(126, 36, 23, 0.7);
		stroke-width: 1.4;
	}
	.seal text {
		fill: #f5efdf;
		font:
			600 12px var(--font-display, Georgia),
			serif;
		letter-spacing: 0.04em;
		text-anchor: middle;
	}

	/* ---- motion: an unhurried harbor. Everything here is slow, tiny and
	   optional; reduced motion holds a finished print. ---- */
	@media (prefers-reduced-motion: no-preference) {
		.craft {
			animation: pd-arrive 800ms ease backwards;
			animation-delay: calc(var(--i, 0) * 130ms);
		}
		.bob {
			animation: pd-bob var(--bd, 7s) ease-in-out var(--bdel, 0s) infinite alternate;
		}
		.craft:hover .bob,
		.craft:focus-visible .bob {
			animation-play-state: paused;
			translate: 0 -2.5px;
			transition: translate 300ms ease;
		}
		.drift-a {
			animation: pd-drift 34s ease-in-out infinite alternate;
		}
		.drift-b {
			animation: pd-drift 26s ease-in-out -12s infinite alternate-reverse;
		}
		.ring {
			animation: pd-ring 9s ease-out var(--rd, 0s) infinite;
		}
		.free-koi {
			transition: transform 1300ms cubic-bezier(0.3, 0.75, 0.3, 1);
		}
		.fk-pose {
			transition: transform 800ms ease;
		}
		.pellet {
			animation: pd-pellet 1.8s ease-in forwards;
		}
		.nz-lid {
			transition: transform 400ms ease;
		}
		.nz-lid.blink {
			transform: scaleY(1);
		}
		.calm-b {
			animation: pd-calm-b 1.3s ease-out var(--cd, 0ms) forwards;
		}
		.calm-text {
			animation: pd-calm-text 1.7s ease-out 120ms forwards;
		}
	}
	@keyframes pd-pellet {
		from {
			translate: 0 0;
			opacity: 1;
		}
		to {
			translate: 0 34px;
			opacity: 0;
		}
	}
	@keyframes pd-calm-b {
		from {
			opacity: 0.85;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(-24px);
		}
	}
	@keyframes pd-calm-text {
		0% {
			opacity: 0;
			transform: translateY(6px);
		}
		18% {
			opacity: 1;
			transform: translateY(-2px);
		}
		70% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translateY(-22px);
		}
	}
	@keyframes pd-arrive {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
	@keyframes pd-bob {
		from {
			transform: translateY(-1.7px);
		}
		to {
			transform: translateY(1.9px);
		}
	}
	@keyframes pd-drift {
		from {
			transform: translate(-16px, 0);
		}
		to {
			transform: translate(18px, 0);
		}
	}
	@keyframes pd-ring {
		0% {
			transform: scale(0.25);
			opacity: 0;
		}
		10% {
			opacity: 0.5;
		}
		70% {
			opacity: 0.12;
		}
		100% {
			transform: scale(1.3);
			opacity: 0;
		}
	}
</style>
