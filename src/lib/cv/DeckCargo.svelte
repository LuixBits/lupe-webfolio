<script lang="ts">
	/** Deck variant B — the CARGO MANIFEST: you stand on the deck
	 *  (DeckAboard is the boat itself), and the chapter's papers hang
	 *  from the cargo spar overhead — role, story, skills, carried-
	 *  forward, each tied by its own string. On narrow screens the tags
	 *  rack up in column but keep their string stubs. */
	import { resolveLocalized, resolveSpan, type Station, type Vessel } from '$lib/content/schema';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	let { vessel, stations }: { vessel: Vessel; stations: Station[] } = $props();
	const locale = getLocale();
	const s = $derived(stations[0]);
</script>

<section class="cargo">
	<h2 class="cargo-h">{m.cv_manifest()}</h2>

	<!-- the cargo spar overhead, lines paid down to the papers -->
	<div class="cargo-spar" aria-hidden="true">
		<svg viewBox="0 0 640 84" preserveAspectRatio="xMidYMid meet">
			<path class="sp-bar" d="M 8 16 L 632 12" />
			<path class="sp-wrap" d="M 30 8 L 36 22 M 604 6 L 610 20" />
			<g class="cg-string">
				<path d="M 76 15.6 C 76 40 76 62 76 84" />
				<path d="M 258 14.4 C 258 40 258 62 258 84" />
				<path d="M 424 13.4 C 424 40 424 62 424 84" />
				<path d="M 570 12.5 C 570 40 570 62 570 84" />
			</g>
			<g class="sp-knot">
				<path d="M 70 13 Q 76 21 82 13" />
				<path d="M 252 12 Q 258 20 264 12" />
				<path d="M 418 11 Q 424 19 430 11" />
				<path d="M 564 10 Q 570 18 576 10" />
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
		color: #f6efdd;
		text-shadow: 0 1px 2px rgba(20, 10, 5, 0.45);
		border-bottom: 1px solid rgba(246, 239, 221, 0.4);
		padding-bottom: 0.35rem;
	}

	.cargo-spar svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.sp-bar {
		fill: none;
		stroke: #4a3524;
		stroke-width: 7;
		stroke-linecap: round;
	}
	.sp-wrap {
		fill: none;
		stroke: #c9a86a;
		stroke-width: 2.6;
		stroke-linecap: round;
	}
	.cg-string path {
		fill: none;
		stroke: #8a6a42;
		stroke-width: 1.8;
		opacity: 0.9;
	}
	.sp-knot path {
		fill: none;
		stroke: #6d5334;
		stroke-width: 2.2;
		stroke-linecap: round;
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
		background: rgba(26, 17, 9, 0.4);
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

	/* the papers stir on their lines — reduced motion: all still */
	@media (prefers-reduced-motion: no-preference) {
		.ctag-sway {
			animation: cg-sway 6.4s ease-in-out var(--d, 0s) infinite alternate;
			transform-origin: 50% -1.2rem;
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
