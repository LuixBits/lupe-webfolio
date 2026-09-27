<script lang="ts">
	/** Aboard a vessel — the detail page behind each craft on the CV pond.
	 *  A small water band up top carries the SAME art as the pond (you
	 *  really boarded that boat), then the Logbuch: one washi slip per
	 *  station lived at this organisation. */
	import { HULL_NAME, vesselStations } from '$lib/content/cv';
	import { resolveLocalized, resolveSpan, type Station, type Vessel } from '$lib/content/schema';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import Koi from '$lib/water/Koi.svelte';
	import Vessel_ from '$lib/water/pond/Vessel.svelte';
	import Crane from '$lib/water/pond/Crane.svelte';
	import Hanko from './Hanko.svelte';

	let { vessel }: { vessel: Vessel } = $props();

	const locale = getLocale();
	const stations = $derived(vesselStations(vessel));
	const orgLabel = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
	const GLYPH: Record<string, string> = { siga: 'SIGA', hslu: 'HSLU', neptun: 'PN', emvs: 'EMVs' };
	const desc = $derived(
		`${vessel.org} — ${stations.map((s) => resolveLocalized(s.role, locale)).join(' · ')} (${resolveSpan(vessel.span, locale)})`
	);
</script>

<svelte:head>
	<title>{vessel.org} — Lupe</title>
	<meta name="description" content={desc} />
</svelte:head>

{#snippet slip(s: Station)}
	<article class="slip" class:slip--edu={s.track === 'education'}>
		<span class="track-tag" aria-hidden="true"
			>{s.track === 'education' ? m.cv_education() : m.cv_positions()}</span
		>
		<h3 class="role">{resolveLocalized(s.role, locale)}</h3>
		<p class="span-line">
			<span>{resolveSpan(s.span, locale)}</span>
			{#if s.duration}<span class="dur">· {resolveLocalized(s.duration, locale)}</span>{/if}
		</p>
		{#if s.location || s.pensum || s.mode}
			<ul class="chips">
				{#if s.location}<li class="chip">{resolveLocalized(s.location, locale)}</li>{/if}
				{#if s.pensum}<li class="chip">
						{s.pensum === 'full' ? m.cv_pensum_full() : m.cv_pensum_part()}
					</li>{/if}
				{#if s.mode}<li class="chip">{resolveLocalized(s.mode, locale)}</li>{/if}
			</ul>
		{/if}
		{#if s.skills.length}
			<ul class="skills" aria-label={m.cv_skills()}>
				{#each s.skills as sk, i (i)}
					<li class="skill-chip">{resolveLocalized(sk, locale)}</li>
				{/each}
			</ul>
		{/if}
		{#if s.id === 'armee'}
			<svg class="slip-crane" viewBox="0 0 66 46" aria-hidden="true"><Crane /></svg>
		{/if}
		{#if s.detail}
			<div class="stamps">
				<Hanko
					glyph="巻"
					label={resolveLocalized(s.role, locale)}
					href={localizeHref(`/cv/${s.detail}`)}
					tilt={1.8}
				/>
			</div>
		{/if}
	</article>
{/snippet}

<article class="page deck">
	<a class="back" href={localizeHref('/cv')}>← {m.paper_back()}</a>

	<!-- the mooring band: the very craft you boarded, riding its water -->
	<div class="berth" aria-hidden="true">
		<svg viewBox="0 0 640 190" preserveAspectRatio="xMidYMid meet">
			<defs>
				<linearGradient id="deck-sky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stop-color="#f4efe2" />
					<stop offset="1" stop-color="#dceef2" />
				</linearGradient>
				<linearGradient id="deck-water" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stop-color="#cfeaf0" />
					<stop offset="1" stop-color="#8ecbdb" />
				</linearGradient>
			</defs>
			<rect width="640" height="112" fill="url(#deck-sky)" />
			<rect y="112" width="640" height="78" fill="url(#deck-water)" />
			<path class="berth-line" d="M 0 112 L 640 112" />
			<g class="berth-ring">
				<ellipse cx="320" cy="118" rx="120" ry="9" />
				<ellipse cx="320" cy="118" rx="78" ry="6" />
			</g>
			<g transform="translate(320 112)">
				<g class="berth-bob"><Vessel_ slug={vessel.slug} name={HULL_NAME[vessel.slug]} /></g>
			</g>
			<g transform="translate(120 152)" opacity="0.75">
				<g class="berth-koi">
					<Koi robe="asagi" scale={0.34} motion="tail" shadow={false} wag={2.1} />
				</g>
			</g>
			<text class="berth-tag" x="576" y="128">{resolveSpan(vessel.span, locale)}</text>
		</svg>
	</div>

	<header class="deck-head">
		<p class="eyebrow">{m.cv_aboard()}</p>
		<h1>{vessel.org}</h1>
		{#if vessel.note}<p class="note">{resolveLocalized(vessel.note, locale)}</p>{/if}
	</header>

	<h2 class="logbook-h">{m.cv_logbook()}</h2>
	<div class="slips">
		{#each stations as s (s.id)}
			{@render slip(s)}
		{/each}
	</div>

	{#if vessel.url}
		<div class="org-stamp">
			<Hanko
				glyph={GLYPH[vessel.slug] ?? vessel.org}
				label={orgLabel(vessel.url)}
				href={vessel.url}
				tilt={-1.6}
			/>
		</div>
	{/if}
</article>

<style>
	.deck {
		--paper: #f5efdf;
		--ink: #2c241b;
		--ink-muted: #6b5f4d;
		--seal: #c43f2a;
		max-width: 44rem;
	}
	.back {
		display: inline-block;
		margin-bottom: 1rem;
		color: var(--fg-muted);
		text-decoration: none;
	}
	.back:hover {
		color: var(--accent);
	}

	/* ---- the berth band ---- */
	.berth {
		border-radius: 14px 5px 14px 5px;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--water-deep) 30%, transparent);
		box-shadow: 0 22px 40px -28px rgba(4, 40, 52, 0.7);
	}
	.berth svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.berth-line {
		stroke: rgba(255, 255, 255, 0.75);
		stroke-width: 1.6;
	}
	.berth-ring ellipse {
		fill: none;
		stroke: rgba(255, 255, 255, 0.5);
		stroke-width: 1.2;
	}
	.berth-tag {
		font:
			italic 13px var(--font-display, Georgia),
			serif;
		fill: #14424f;
		text-anchor: end;
		opacity: 0.85;
	}

	.deck-head {
		margin: 1.4rem 0 0.4rem;
	}
	.deck-head h1 {
		margin: 0 0 0.2rem;
	}
	.deck-head .note {
		margin: 0;
		color: var(--fg-muted);
		font-variant-numeric: tabular-nums;
	}
	.logbook-h {
		font-size: var(--fs-h2);
		margin: 1.6rem 0 1rem;
		border-bottom: 1px solid color-mix(in srgb, var(--slice-bg) 45%, transparent);
		padding-bottom: 0.35rem;
	}

	/* ---- washi slips (the pond's paper language) ---- */
	.slips {
		display: grid;
		gap: 1.4rem;
	}
	.slip {
		position: relative;
		padding: 1.1rem 1.3rem 1.15rem;
		background:
			repeating-linear-gradient(
				0deg,
				transparent 0 13px,
				color-mix(in srgb, var(--ink) 2%, transparent) 13px 14px
			),
			var(--paper);
		color: var(--ink);
		border: 1px solid color-mix(in srgb, var(--ink) 32%, transparent);
		border-radius: 10px 4px 12px 4px;
		box-shadow:
			0 1px 2px rgba(4, 20, 31, 0.15),
			0 20px 38px -26px rgba(4, 20, 31, 0.55);
	}
	.slip--edu {
		border-radius: 4px 10px 4px 12px;
	}
	.track-tag {
		position: absolute;
		top: -0.72rem;
		right: 0.9rem;
		font-size: 0.62rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-muted);
		background: #efe5cc;
		border: 1px solid color-mix(in srgb, var(--ink) 28%, transparent);
		border-radius: 2px 6px 2px 6px;
		padding: 0.06rem 0.5rem;
	}
	.role {
		margin: 0 0 0.35rem;
		font-size: var(--fs-h3);
		line-height: 1.25;
		color: var(--ink);
	}
	.span-line {
		margin: 0 0 0.55rem;
		font-size: 0.84rem;
		font-variant-numeric: tabular-nums;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}
	.span-line .dur {
		color: var(--ink-muted);
	}
	.chips,
	.skills {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		font-size: 0.75rem;
	}
	.chips {
		margin-bottom: 0.55rem;
	}
	.chip {
		padding: 0.08rem 0.55rem;
		border: 1px solid color-mix(in srgb, var(--ink) 22%, transparent);
		border-radius: 999px;
		color: var(--ink-muted);
		background: color-mix(in srgb, var(--paper) 55%, white);
	}
	.skill-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.34rem;
		padding: 0.12rem 0.55rem 0.12rem 0.4rem;
		border: 1px solid color-mix(in srgb, var(--ink) 20%, transparent);
		border-radius: 3px 8px 3px 8px;
		color: var(--ink);
		background: color-mix(in srgb, var(--paper) 40%, white);
	}
	.skill-chip::before {
		content: '';
		width: 0.5em;
		height: 0.5em;
		flex: none;
		background: var(--seal);
		border-radius: 1.5px 3px 1.5px 3px;
		opacity: 0.85;
	}
	.slip-crane {
		position: absolute;
		top: -1.5rem;
		left: 1.1rem;
		width: 3.2rem;
		height: auto;
		transform: rotate(-3deg);
	}
	.stamps,
	.org-stamp {
		display: flex;
		justify-content: flex-end;
		margin-top: 0.4rem;
	}
	.org-stamp {
		margin-top: 1.4rem;
	}

	/* the berth breathes; reduced motion holds still water */
	@media (prefers-reduced-motion: no-preference) {
		.berth-bob {
			animation: deck-bob 7s ease-in-out infinite alternate;
		}
		.berth-koi {
			animation: deck-koi 11s ease-in-out infinite alternate;
		}
	}
	@keyframes deck-bob {
		from {
			transform: translateY(-1.6px);
		}
		to {
			transform: translateY(1.8px);
		}
	}
	@keyframes deck-koi {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(46px);
		}
	}
</style>
