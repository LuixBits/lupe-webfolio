<script lang="ts">
	/** Deck variant B — the CARGO MANIFEST: the berth grows into the whole
	 *  page. The craft rides its water large, and the information hangs
	 *  off the boat itself — strings run from the oar, the hull patch, the
	 *  stern and the mooring post down to knots at the water's edge, and
	 *  the manifest tags hang from those knots. On narrow screens the tags
	 *  rack up in column but keep their string stubs. */
	import { HULL_NAME } from '$lib/content/cv';
	import { resolveLocalized, resolveSpan, type Station, type Vessel } from '$lib/content/schema';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import Koi from '$lib/water/Koi.svelte';
	import Vessel_ from '$lib/water/pond/Vessel.svelte';

	let { vessel, stations }: { vessel: Vessel; stations: Station[] } = $props();
	const locale = getLocale();
	const s = $derived(stations[0]);
</script>

<section class="cargo">
	<h2 class="cargo-h">{m.cv_manifest()}</h2>

	<!-- the berth, grown into the hero: your boat, moored to its post -->
	<div class="cargo-scene" aria-hidden="true">
		<svg viewBox="0 0 640 250" preserveAspectRatio="xMidYMid meet">
			<defs>
				<linearGradient id="cg-sky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stop-color="#f4efe2" />
					<stop offset="1" stop-color="#dceef2" />
				</linearGradient>
				<linearGradient id="cg-water" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stop-color="#cfeaf0" />
					<stop offset="0.5" stop-color="#a5d8e4" />
					<stop offset="1" stop-color="#8ecbdb" />
				</linearGradient>
			</defs>
			<rect width="640" height="96" fill="url(#cg-sky)" />
			<rect y="96" width="640" height="154" fill="url(#cg-water)" />
			<path class="cg-horizon" d="M 0 96 L 640 96" />

			<!-- the mooring post, holding her -->
			<g transform="translate(560 96)">
				<rect class="cg-post" x="-7" y="-30" width="14" height="34" rx="2.5" />
				<ellipse class="cg-post-top" cx="0" cy="-30" rx="7" ry="2.6" />
				<path class="cg-wrap" d="M -7.5 -21 Q 0 -17 7.5 -21 M -7.5 -14 Q 0 -10 7.5 -14" />
				<path class="cg-reflect" d="M -8 8 L 7 8 M -5 13 L 4 13" />
			</g>
			<path class="cg-rope" d="M 402 100 C 460 116 510 112 553 88" />

			<!-- the craft herself, big -->
			<g transform="translate(300 118) scale(1.9)">
				<g class="cg-bob"><Vessel_ slug={vessel.slug} name={HULL_NAME[vessel.slug]} /></g>
			</g>

			<!-- life around her -->
			<g transform="translate(96 168)" opacity="0.75">
				<g class="cg-koi"
					><Koi robe="asagi" scale={0.34} motion="tail" shadow={false} wag={2.1} /></g
				>
			</g>
			<g class="wv">
				<path d="M 52 128 Q 60 123.5 68 128 Q 76 123.5 84 128" />
				<path d="M 480 150 Q 488 145.5 496 150 Q 504 145.5 512 150" />
				<path d="M 590 200 Q 598 195.5 606 200 Q 614 195.5 622 200" />
			</g>

			<!-- the tag strings, paid out to the water's edge -->
			<g class="cg-string">
				<path d="M 201 92 C 172 150 100 208 76 246" />
				<path d="M 256 126 C 258 170 259 212 258 246" />
				<path d="M 399 92 C 408 150 420 205 424 246" />
				<path d="M 560 112 C 564 160 568 210 570 246" />
			</g>
			<g class="cg-knot">
				<circle cx="76" cy="246" r="3" />
				<circle cx="258" cy="246" r="3" />
				<circle cx="424" cy="246" r="3" />
				<circle cx="570" cy="246" r="3" />
			</g>
		</svg>
	</div>

	<!-- the manifest: what hangs on those strings -->
	<div class="cargo-row">
		<article class="ctag" style="--rot:-1.6deg">
			<span class="ctag-hole" aria-hidden="true"></span>
			<div class="ctag-sway" style="--d:0s">
				<p class="ctag-kicker">
					{s.track === 'education' ? m.cv_education() : m.cv_positions()}
				</p>
				<h3 class="ctag-role">{resolveLocalized(s.role, locale)}</h3>
				<p class="ctag-line">
					{resolveSpan(s.span, locale)}
					{#if s.duration}· {resolveLocalized(s.duration, locale)}{/if}
				</p>
			</div>
		</article>

		<article class="ctag ctag--sheet" style="--rot:0.9deg">
			<span class="ctag-hole" aria-hidden="true"></span>
			<div class="ctag-sway" style="--d:-2.2s">
				{#if s.org !== vessel.org}<p class="ctag-kicker">{s.org}</p>{/if}
				{#if s.story}<p class="ctag-hand">{resolveLocalized(s.story, locale)}</p>{/if}
			</div>
		</article>

		<article class="ctag" style="--rot:-0.9deg">
			<span class="ctag-hole" aria-hidden="true"></span>
			<div class="ctag-sway" style="--d:-4.1s">
				<p class="ctag-kicker">{m.cv_skills()}</p>
				{#if s.skills.length}
					<ul class="ctag-skills">
						{#each s.skills as sk, j (j)}
							<li>{resolveLocalized(sk, locale)}</li>
						{/each}
					</ul>
				{/if}
			</div>
		</article>

		<article class="ctag" style="--rot:1.4deg">
			<span class="ctag-hole" aria-hidden="true"></span>
			<div class="ctag-sway" style="--d:-1.3s">
				<p class="ctag-kicker ctag-kicker--seal">{m.cv_takeaway()}</p>
				{#if s.takeaway}<p class="ctag-take">{resolveLocalized(s.takeaway, locale)}</p>{/if}
			</div>
		</article>
	</div>
</section>

<style>
	.cargo {
		--paper: #f7f1de;
		--ink: #2c241b;
		--ink-muted: #6b5f4d;
		--seal: #c43f2a;
		margin-top: 1.6rem;
	}
	.cargo-h {
		font-size: var(--fs-h2);
		margin: 0 0 0.9rem;
		border-bottom: 1px solid color-mix(in srgb, var(--slice-bg) 45%, transparent);
		padding-bottom: 0.35rem;
	}

	.cargo-scene {
		border-radius: 14px 5px 0 0;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--water-deep) 30%, transparent);
		border-bottom: none;
		box-shadow: 0 22px 40px -28px rgba(4, 40, 52, 0.5);
	}
	.cargo-scene svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.cg-horizon {
		stroke: rgba(255, 255, 255, 0.75);
		stroke-width: 1.6;
	}
	.cg-post {
		fill: #6a4c37;
		stroke: #382718;
		stroke-width: 1;
	}
	.cg-post-top {
		fill: #8a6a4d;
		stroke: #382718;
		stroke-width: 0.9;
	}
	.cg-wrap {
		fill: none;
		stroke: #c9a86a;
		stroke-width: 2.4;
		stroke-linecap: round;
	}
	.cg-rope {
		fill: none;
		stroke: #c9a86a;
		stroke-width: 2.2;
		stroke-linecap: round;
		opacity: 0.95;
	}
	.cg-reflect {
		fill: none;
		stroke: rgba(24, 60, 74, 0.3);
		stroke-linecap: round;
		stroke-width: 2.6;
	}
	.wv path {
		fill: none;
		stroke: #eefafd;
		stroke-width: 1.6;
		stroke-linecap: round;
		opacity: 0.55;
	}
	.cg-string path {
		fill: none;
		stroke: #8a6a42;
		stroke-width: 1.6;
		opacity: 0.85;
	}
	.cg-knot circle {
		fill: #6d5334;
	}

	/* the tags racked under their knots */
	.cargo-row {
		display: grid;
		grid-template-columns: 1.05fr 1.5fr 1.1fr 1fr;
		gap: 1rem;
		align-items: start;
		padding: 0 0.2rem;
	}
	.ctag {
		position: relative;
		margin-top: -0.2rem;
		padding: 1rem 1rem 0.9rem;
		color: var(--ink);
		background:
			repeating-linear-gradient(
				0deg,
				transparent 0 13px,
				color-mix(in srgb, var(--ink) 2%, transparent) 13px 14px
			),
			var(--paper);
		border: 1px solid color-mix(in srgb, var(--ink) 30%, transparent);
		border-radius: 3px 10px 6px 10px;
		box-shadow:
			0 1px 2px rgba(4, 20, 31, 0.15),
			0 20px 38px -26px rgba(4, 20, 31, 0.55);
		rotate: var(--rot, 0deg);
		transform-origin: 50% -1rem;
		/* the punched corner */
		clip-path: polygon(0 0.9rem, 0.9rem 0, 100% 0, 100% 100%, 0 100%);
	}
	.ctag-hole {
		position: absolute;
		top: 0.55rem;
		left: 50%;
		translate: -50% 0;
		width: 0.5rem;
		height: 0.5rem;
		border: 2px solid #8a6a42;
		border-radius: 50%;
		background: var(--bg);
	}
	.ctag-sway {
		padding-top: 0.55rem;
	}
	.ctag-kicker {
		margin: 0 0 0.35rem;
		font-size: 0.62rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	.ctag-kicker--seal {
		color: var(--seal);
		font-weight: 700;
	}
	.ctag-role {
		margin: 0 0 0.3rem;
		font-size: 1.05rem;
		line-height: 1.3;
	}
	.ctag-line {
		margin: 0;
		font-size: 0.82rem;
		font-variant-numeric: tabular-nums;
		color: var(--ink-muted);
	}
	.ctag-hand {
		margin: 0;
		font:
			italic 0.95rem/1.55 var(--font-display, Georgia),
			serif;
	}
	.ctag-take {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.5;
	}
	.ctag-skills {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		font-size: 0.75rem;
	}
	.ctag-skills li {
		padding: 0.1rem 0.55rem;
		background: color-mix(in srgb, var(--paper) 40%, white);
		border: 1px solid color-mix(in srgb, var(--ink) 22%, transparent);
		border-radius: 2px 7px 2px 7px;
	}

	@media (max-width: 720px) {
		.cargo-row {
			grid-template-columns: 1fr 1fr;
			row-gap: 1.2rem;
		}
	}
	@media (max-width: 460px) {
		.cargo-row {
			grid-template-columns: 1fr;
		}
	}

	/* she bobs, the koi passes, the tags stir — reduced motion: all still */
	@media (prefers-reduced-motion: no-preference) {
		.cg-bob {
			animation: cg-bob 7s ease-in-out infinite alternate;
		}
		.cg-koi {
			animation: cg-koi 12s ease-in-out infinite alternate;
		}
		.ctag-sway {
			animation: cg-sway 6.4s ease-in-out var(--d, 0s) infinite alternate;
			transform-origin: 50% -1.2rem;
		}
	}
	@keyframes cg-bob {
		from {
			transform: translateY(-1.4px);
		}
		to {
			transform: translateY(1.6px);
		}
	}
	@keyframes cg-koi {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(52px);
		}
	}
	@keyframes cg-sway {
		from {
			transform: rotate(-0.5deg);
		}
		to {
			transform: rotate(0.55deg);
		}
	}
</style>
