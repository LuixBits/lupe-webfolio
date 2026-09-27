<script lang="ts">
	/** Deck variant C — the RIGGING: a mooring rope strung between two
	 *  year-posts (the pond's knot language, one deck closer), and the
	 *  chapter's papers hang from it at different depths — role tag, the
	 *  story sheet with its stamp, the skill tags with the takeaway note.
	 *  On narrow screens the tags rack into a column, string stubs kept. */
	import { resolveLocalized, resolveSpan, type Station, type Vessel } from '$lib/content/schema';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	let { vessel, stations }: { vessel: Vessel; stations: Station[] } = $props();
	const locale = getLocale();
	const s = $derived(stations[0]);
	const yearOf = (v: number) => String(Math.floor(v));
</script>

<section class="rig">
	<h2 class="rig-h">{m.cv_rigging()}</h2>

	<!-- the rope between the era's two year-posts -->
	<div class="rig-scene" aria-hidden="true">
		<svg viewBox="0 0 640 118" preserveAspectRatio="xMidYMid meet">
			<g transform="translate(36 0)">
				<rect class="rg-post" x="-6" y="16" width="12" height="102" rx="2.5" />
				<ellipse class="rg-post-top" cx="0" cy="16" rx="6" ry="2.4" />
				<rect class="rg-sign" x="-24" y="34" width="48" height="21" rx="2" />
				<text class="rg-year" x="0" y="49">{yearOf(s.start)}</text>
				<circle class="rg-nail" cx="-19" cy="44.5" r="1.1" />
				<circle class="rg-nail" cx="19" cy="44.5" r="1.1" />
			</g>
			<g transform="translate(604 0)">
				<rect class="rg-post" x="-6" y="16" width="12" height="102" rx="2.5" />
				<ellipse class="rg-post-top" cx="0" cy="16" rx="6" ry="2.4" />
				<rect class="rg-sign" x="-24" y="34" width="48" height="21" rx="2" />
				<text class="rg-year" x="0" y="49">{s.end ? yearOf(s.end) : m.cv_today()}</text>
				<circle class="rg-nail" cx="-19" cy="44.5" r="1.1" />
				<circle class="rg-nail" cx="19" cy="44.5" r="1.1" />
			</g>
			<path class="rg-rope" d="M 42 26 C 200 62 440 60 598 24" />
			<path class="rg-wrap" d="M 40 21 L 46 30 M 594 28 L 600 19" />
			<!-- the hang strings, down to the tags -->
			<g class="rg-string">
				<path d="M 93 36 C 92 70 93 96 93 118" />
				<path d="M 320 52 C 320 84 320 102 320 118" />
				<path d="M 550 36 C 551 72 550 98 550 118" />
			</g>
			<g class="rg-knot">
				<path d="M 87 34 Q 93 41 99 34" />
				<path d="M 314 50 Q 320 57 326 50" />
				<path d="M 544 34 Q 550 41 556 34" />
			</g>
		</svg>
	</div>

	<div class="rig-row">
		<article class="rtag" style="--rot:-1.3deg; --drop:0rem">
			<span class="rtag-hole" aria-hidden="true"></span>
			<div class="rtag-sway" style="--d:0s">
				<p class="rtag-kicker">
					{s.track === 'education' ? m.cv_education() : m.cv_positions()}
				</p>
				<h3 class="rtag-role">{resolveLocalized(s.role, locale)}</h3>
				<p class="rtag-line">
					{resolveSpan(s.span, locale)}
					{#if s.duration}· {resolveLocalized(s.duration, locale)}{/if}
				</p>
				{#if s.location || s.pensum}
					<ul class="rtag-chips">
						{#if s.location}<li>{resolveLocalized(s.location, locale)}</li>{/if}
						{#if s.pensum}<li>
								{s.pensum === 'full' ? m.cv_pensum_full() : m.cv_pensum_part()}
							</li>{/if}
					</ul>
				{/if}
			</div>
		</article>

		<article class="rtag rtag--sheet" style="--rot:0.8deg; --drop:1.1rem">
			<span class="rtag-hole" aria-hidden="true"></span>
			<div class="rtag-sway" style="--d:-2.6s">
				{#if s.story}<p class="rtag-hand">{resolveLocalized(s.story, locale)}</p>{/if}
				<p class="rtag-stamp">
					<span>{m.cv_moored()}</span>
					<span class="rtag-stamp-yrs"
						>{yearOf(s.start)} – {s.end ? yearOf(s.end) : m.cv_today()}</span
					>
				</p>
			</div>
		</article>

		<article class="rtag" style="--rot:-0.8deg; --drop:0.45rem">
			<span class="rtag-hole" aria-hidden="true"></span>
			<div class="rtag-sway" style="--d:-4.4s">
				<p class="rtag-kicker">{m.cv_skills()}</p>
				{#if s.skills.length}
					<ul class="rtag-skills">
						{#each s.skills as sk, j (j)}
							<li>{resolveLocalized(sk, locale)}</li>
						{/each}
					</ul>
				{/if}
				{#if s.takeaway}
					<p class="rtag-take">
						<em>{m.cv_takeaway()}</em> — {resolveLocalized(s.takeaway, locale)}
					</p>
				{/if}
			</div>
		</article>
	</div>
</section>

<style>
	.rig {
		--paper: #f7f1de;
		--ink: #2c241b;
		--ink-muted: #6b5f4d;
		--seal: #c43f2a;
		margin-top: 1.6rem;
	}
	.rig-h {
		font-size: var(--fs-h2);
		margin: 0 0 0.6rem;
		border-bottom: 1px solid color-mix(in srgb, var(--slice-bg) 45%, transparent);
		padding-bottom: 0.35rem;
	}
	.rig-scene svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.rg-post {
		fill: #6a4c37;
		stroke: #382718;
		stroke-width: 1;
	}
	.rg-post-top {
		fill: #8a6a4d;
		stroke: #382718;
		stroke-width: 0.9;
	}
	.rg-sign {
		fill: #efe5cc;
		stroke: #6d5334;
		stroke-width: 1;
	}
	.rg-year {
		fill: var(--ink);
		font:
			600 13px var(--font-display, Georgia),
			serif;
		letter-spacing: 0.05em;
		text-anchor: middle;
		font-variant-numeric: tabular-nums;
	}
	.rg-nail {
		fill: #8a7358;
	}
	.rg-rope {
		fill: none;
		stroke: #c9a86a;
		stroke-width: 2.6;
		stroke-linecap: round;
	}
	.rg-wrap {
		fill: none;
		stroke: #b3915a;
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.rg-string path {
		fill: none;
		stroke: #8a6a42;
		stroke-width: 1.5;
		opacity: 0.85;
	}
	.rg-knot path {
		fill: none;
		stroke: #6d5334;
		stroke-width: 1.8;
		stroke-linecap: round;
	}

	.rig-row {
		display: grid;
		grid-template-columns: 1.1fr 1.45fr 1.1fr;
		gap: 1.1rem;
		align-items: start;
		margin-top: -2px;
		padding: 0 0.2rem;
	}
	.rtag {
		position: relative;
		margin-top: var(--drop, 0rem);
		padding: 1rem 1.05rem 0.95rem;
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
		clip-path: polygon(0 0.9rem, 0.9rem 0, 100% 0, 100% 100%, 0 100%);
	}
	.rtag-hole {
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
	.rtag-sway {
		padding-top: 0.55rem;
	}
	.rtag-kicker {
		margin: 0 0 0.35rem;
		font-size: 0.62rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	.rtag-role {
		margin: 0 0 0.3rem;
		font-size: 1.02rem;
		line-height: 1.3;
	}
	.rtag-line {
		margin: 0 0 0.5rem;
		font-size: 0.82rem;
		font-variant-numeric: tabular-nums;
		color: var(--ink-muted);
	}
	.rtag-chips,
	.rtag-skills {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		font-size: 0.75rem;
	}
	.rtag-chips li {
		padding: 0.08rem 0.55rem;
		border: 1px solid color-mix(in srgb, var(--ink) 22%, transparent);
		border-radius: 999px;
		color: var(--ink-muted);
		background: color-mix(in srgb, var(--paper) 55%, white);
	}
	.rtag-skills li {
		padding: 0.1rem 0.55rem;
		background: color-mix(in srgb, var(--paper) 40%, white);
		border: 1px solid color-mix(in srgb, var(--ink) 22%, transparent);
		border-radius: 2px 7px 2px 7px;
	}
	.rtag-hand {
		margin: 0 0 0.7rem;
		font:
			italic 0.95rem/1.55 var(--font-display, Georgia),
			serif;
	}
	.rtag-take {
		margin: 0.6rem 0 0;
		font-size: 0.82rem;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.rtag-take em {
		font-style: normal;
		font-weight: 700;
		color: var(--seal);
		letter-spacing: 0.04em;
	}
	.rtag-stamp {
		width: 4.9rem;
		height: 4.9rem;
		margin: 0.4rem 0 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.08rem;
		text-align: center;
		text-transform: uppercase;
		font-size: 0.52rem;
		letter-spacing: 0.15em;
		color: var(--seal);
		border: 2px solid var(--seal);
		border-radius: 50%;
		box-shadow:
			inset 0 0 0 3px transparent,
			inset 0 0 0 4px color-mix(in srgb, var(--seal) 60%, transparent);
		rotate: 6deg;
		opacity: 0.82;
	}
	.rtag-stamp-yrs {
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.04em;
		font-size: 0.56rem;
	}

	@media (max-width: 640px) {
		.rig-row {
			grid-template-columns: 1fr;
			row-gap: 1.2rem;
		}
		.rtag {
			margin-top: 0;
		}
	}

	/* the papers stir on the line; reduced motion: a still drying day */
	@media (prefers-reduced-motion: no-preference) {
		.rtag-sway {
			animation: rg-sway 6.8s ease-in-out var(--d, 0s) infinite alternate;
			transform-origin: 50% -1.2rem;
		}
	}
	@keyframes rg-sway {
		from {
			transform: rotate(-0.5deg);
		}
		to {
			transform: rotate(0.55deg);
		}
	}
</style>
