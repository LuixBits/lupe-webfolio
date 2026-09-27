<script lang="ts">
	import { onMount } from 'svelte';
	import { cvPdf, stations } from '$lib/content/cv';
	import { resolveLocalized, resolveSpan, type Station } from '$lib/content/schema';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import { revealOnce } from '$lib/garden/reveal';
	import Hanko from '$lib/cv/Hanko.svelte';
	import DiveLayer from '$lib/water/dive/DiveLayer.svelte';

	const locale = getLocale();

	/* »Der Tauchgang« — the CV as one continuous dive. The surface is today,
	 * the seabed is 2013; scrolling is diving. This file is the water column's
	 * CONTENT: washi paper slips in a two-bank weave (Ausbildung left,
	 * Erfahrung right, concurrent stations at the same depth). The world
	 * around them — atmosphere, sounding line, koi — is painted by the
	 * DiveLayer (Phase 3+), which measures every [data-dive] anchor here. */

	// Dive reveal state — the exact About-grove pattern: `hydrated` gates the
	// hidden `pending` state to the client so SSR/no-JS readers always get a
	// fully drawn page; each station settles in once, on first sight.
	let hydrated = $state(false);
	let revealed = $state<Record<string, boolean>>({});
	onMount(() => {
		hydrated = true;
	});

	const byId = new Map(stations.map((s) => [s.id, s]));
	const st = (id: string): Station => byId.get(id)!;

	// The weave, hand-placed (the data is stable and the concurrency IS the
	// page's information design): grid rows = depth bands, edu col 1, work
	// col 3. `r` = desktop row, `mr` = mobile row (single column, depth
	// order), `rspan` for stations that stretch across a whole era.
	const PLACE: Record<string, { r: number; mr: number; rspan?: number }> = {
		siga: { r: 2, mr: 2 }, // the grouped employer panel (dev + trainee)
		'hslu-ma': { r: 2, mr: 3 },
		'hslu-bsc': { r: 3, mr: 4 },
		neptun: { r: 3, mr: 5 },
		armee: { r: 4, mr: 6 },
		efz: { r: 5, mr: 7 },
		'emvs-lehre': { r: 5, mr: 8, rspan: 2 },
		bm: { r: 6, mr: 9 }
	};
	const gridStyle = (key: string) => {
		const p = PLACE[key];
		return `--r:${p.r}; --r2:${p.r + (p.rspan ?? 1)}; --mr:${p.mr}`;
	};

	// Deep stations (armee and below) sit in the midnight zone — aged paper.
	const DEEP = new Set(['armee', 'efz', 'bm', 'emvs-lehre']);

	const workSolo = ['neptun', 'armee', 'emvs-lehre'].map(st);
	const eduAll = ['hslu-ma', 'hslu-bsc', 'efz', 'bm'].map(st);

	const orgLabel = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
	// Short seal glyphs — a hanko face fits 2-4 characters, not a full name.
	const GLYPH: Record<string, string> = {
		SIGA: 'SIGA',
		'Hochschule Luzern': 'HSLU',
		'Projekt Neptun': 'PN'
	};

	// The knots' depth tags: depth ≈ (2026.75 − year) × 3 m — TRUE time-derived
	// numbers (the plan's table), not pixel positions; the layer letters the
	// line with them. Localized here so the layer stays i18n-free.
	const depthTags: Record<string, string> = {
		'siga-dev': `${m.cv_depth_m({ n: 0 })} · 2024 – ${m.cv_today()}`,
		'siga-trainee': `${m.cv_depth_m({ n: 7 })} · 2021 – 2024`,
		'hslu-ma': `${m.cv_depth_m({ n: 7 })} · 2021 – 2024`,
		'hslu-bsc': `${m.cv_depth_m({ n: 15 })} · 2018 – 2021`,
		neptun: `${m.cv_depth_m({ n: 16 })} · 2019 – 2021`,
		armee: `${m.cv_depth_m({ n: 26 })} · 2017 – 2018`,
		efz: `${m.cv_depth_m({ n: 31 })} · 2013 – 2017`,
		'emvs-lehre': `${m.cv_depth_m({ n: 34 })} · 2013 – 2017`,
		bm: `${m.cv_depth_m({ n: 37 })} · 2013 – 2017`
	};
</script>

<svelte:head>
	<title>{m.nav_cv()} — Lupe</title>
	<meta name="description" content={m.meta_desc_cv()} />
</svelte:head>

<!-- A folded origami crane (senbazuru — healing) resting on the army card.
     Deliberately NOT a red cross (protected emblem). -->
{#snippet crane()}
	<svg class="crane" viewBox="0 0 66 46" aria-hidden="true">
		<path class="cr-wing" d="M29 3 L45 28 L15 27 Z" />
		<path class="cr-body" d="M8 34 L30 23 L53 29 L37 42 L15 40 Z" />
		<path class="cr-fold" d="M30 23 L37 42" />
		<path class="cr-body" d="M8 34 L3 15 L7 14 L13 30 Z" />
		<path class="cr-beak" d="M3.6 15.4 L-0 18.5 L5 19 Z" />
		<path class="cr-tail" d="M53 29 L63 21 L56 33 Z" />
	</svg>
{/snippet}

<!-- A red mizuhiki cord knot — ties the two SIGA role slips into one story. -->
{#snippet mizuhiki()}
	<svg class="mizuhiki" viewBox="0 0 76 20" aria-hidden="true">
		<path class="mz-a" d="M4 10 C 16 -2 32 -2 38 10 C 44 22 60 22 72 10" />
		<path class="mz-b" d="M4 10 C 16 22 32 22 38 10 C 44 -2 60 -2 72 10" />
		<circle class="mz-knot" cx="38" cy="10" r="3.1" />
	</svg>
{/snippet}

{#snippet chipsRow(s: Station)}
	{#if s.location || s.pensum || s.mode}
		<ul class="chips">
			{#if s.location}<li class="chip">{resolveLocalized(s.location, locale)}</li>{/if}
			{#if s.pensum}<li class="chip">
					{s.pensum === 'full' ? m.cv_pensum_full() : m.cv_pensum_part()}
				</li>{/if}
			{#if s.mode}<li class="chip">{resolveLocalized(s.mode, locale)}</li>{/if}
		</ul>
	{/if}
{/snippet}

{#snippet skillsRow(s: Station)}
	{#if s.skills.length}
		<ul class="skills" aria-label={m.cv_skills()}>
			{#each s.skills as sk, i (i)}
				<li class="skill-chip">{resolveLocalized(sk, locale)}</li>
			{/each}
		</ul>
	{/if}
{/snippet}

{#snippet spanChip(s: Station)}
	<p class="span-chip">
		<span class="span">{resolveSpan(s.span, locale)}</span>{#if s.duration}<span class="dur"
				>· {resolveLocalized(s.duration, locale)}</span
			>{/if}
	</p>
{/snippet}

{#snippet stationCard(s: Station, side: 'l' | 'r')}
	<article
		class="station side-{side}"
		class:station--deep={DEEP.has(s.id)}
		class:pending={hydrated && !revealed[s.id]}
		class:in={!!revealed[s.id]}
		data-dive="st-{s.id}"
		aria-labelledby="st-{s.id}-h"
		style={gridStyle(s.id)}
		use:revealOnce={() => (revealed[s.id] = true)}
	>
		<span class="track-tag" aria-hidden="true"
			>{s.track === 'education' ? m.cv_education() : m.cv_positions()}</span
		>
		<h3 class="role" id="st-{s.id}-h">{resolveLocalized(s.role, locale)}</h3>
		<p class="org-line">{s.org}</p>
		{@render spanChip(s)}
		{@render chipsRow(s)}
		{@render skillsRow(s)}
		{#if s.id === 'armee'}{@render crane()}{/if}
		{#if s.url}
			<div class="stamps">
				<Hanko glyph={GLYPH[s.org] ?? s.org} label={orgLabel(s.url)} href={s.url} tilt={-1.6} />
			</div>
		{/if}
	</article>
{/snippet}

<div class="page page--dive" class:living={hydrated}>
	<!-- THE DIVE: one procedural water column painted behind the content
	     (atmosphere, sounding line, world), plus a sparse overlay instance
	     above the cards (companions + interactive creatures). -->
	<DiveLayer seed="cv-dive" grown={revealed} arrive={hydrated} tags={depthTags} />
	<DiveLayer
		seed="cv-dive-over"
		overlay
		grown={revealed}
		arrive={hydrated}
		tags={depthTags}
		pdf={cvPdf}
	/>

	<header class="sky" data-dive="sky">
		<p class="eyebrow">{m.cv_eyebrow()}</p>
		<h1>{m.nav_cv()}</h1>
		<p class="lead">{m.cv_lead()}</p>
	</header>

	<!-- the waterline: the hard break between dawn air and water -->
	<div
		class="waterline"
		data-dive="waterline"
		aria-hidden="true"
		use:revealOnce={() => (revealed['waterline'] = true)}
	></div>

	<div class="column" data-dive="divewrap">
		<!-- Erfahrung — the right bank. DOM stays per-track (screen readers hear
		     each bank whole); the grid interleaves both banks by depth. -->
		<section class="bank bank--work" aria-labelledby="experience">
			<h2
				id="experience"
				class="bank-head"
				data-dive="work-head"
				class:pending={hydrated && !revealed['work-head']}
				class:in={!!revealed['work-head']}
				use:revealOnce={() => (revealed['work-head'] = true)}
			>
				{m.cv_positions()}
			</h2>

			<!-- SIGA: one employer, two roles — a grouped washi panel -->
			<article
				class="station station--group side-r"
				class:pending={hydrated && !revealed['siga-dev']}
				class:in={!!revealed['siga-dev']}
				data-dive="st-siga-dev"
				aria-labelledby="st-siga-dev-h"
				style={gridStyle('siga')}
				use:revealOnce={() => (revealed['siga-dev'] = true)}
			>
				<span class="track-tag" aria-hidden="true">{m.cv_positions()}</span>
				<header class="panel-head">
					<p class="org-line org-line--panel">{st('siga-dev').org}</p>
					{#if st('siga-dev').groupNote}
						<p class="group-note">{resolveLocalized(st('siga-dev').groupNote!, locale)}</p>
					{/if}
				</header>
				<div class="slip">
					<h3 class="role" id="st-siga-dev-h">{resolveLocalized(st('siga-dev').role, locale)}</h3>
					{@render spanChip(st('siga-dev'))}
					{@render chipsRow(st('siga-dev'))}
					{@render skillsRow(st('siga-dev'))}
				</div>
				<div class="slip-tie" aria-hidden="true">{@render mizuhiki()}</div>
				<div
					class="slip"
					data-dive="st-siga-trainee"
					use:revealOnce={() => (revealed['siga-trainee'] = true)}
				>
					<h3 class="role">{resolveLocalized(st('siga-trainee').role, locale)}</h3>
					{@render spanChip(st('siga-trainee'))}
					{@render chipsRow(st('siga-trainee'))}
					{@render skillsRow(st('siga-trainee'))}
				</div>
				{#if st('siga-dev').url}
					<div class="stamps">
						<Hanko
							glyph="SIGA"
							label={orgLabel(st('siga-dev').url!)}
							href={st('siga-dev').url}
							tilt={1.4}
						/>
					</div>
				{/if}
			</article>

			{#each workSolo as s (s.id)}
				{@render stationCard(s, 'r')}
			{/each}
		</section>

		<!-- Ausbildung — the left bank -->
		<section class="bank bank--edu" aria-labelledby="education">
			<h2
				id="education"
				class="bank-head"
				data-dive="edu-head"
				class:pending={hydrated && !revealed['edu-head']}
				class:in={!!revealed['edu-head']}
				use:revealOnce={() => (revealed['edu-head'] = true)}
			>
				{m.cv_education()}
			</h2>
			{#each eduAll as s (s.id)}
				{@render stationCard(s, 'l')}
			{/each}
		</section>
	</div>

	<!-- the seabed finale: where the current begins -->
	<section
		class="origin"
		data-dive="origin"
		class:pending={hydrated && !revealed['origin']}
		class:in={!!revealed['origin']}
		use:revealOnce={() => (revealed['origin'] = true)}
	>
		<p class="origin-line">{m.cv_origin()}</p>
	</section>
</div>

<style>
	/* ---- the dive page: washi palette, page-local (paper is paper no matter
	   how dark the water gets — PaperScroll's proven trick) ---- */
	.page--dive {
		--paper: #f5efdf;
		--paper-old: #efe5cc;
		--ink: #2c241b;
		--ink-muted: #6b5f4d;
		--seal: #c43f2a;
		--line-gap: 7rem;
		position: relative;
		padding-top: 9rem;
	}
	/* THE DIVE LAYER: full-bleed behind everything — it paints the whole
	   atmosphere, so the page itself stays transparent to it. Overshoots
	   main's padding so no app-background band shows above the dawn sky or
	   between the abyss and the footer. */
	.page--dive > :global(.dive-layer) {
		position: absolute;
		top: -2.5rem;
		bottom: -2.5rem;
		left: 50%;
		transform: translateX(-50%);
		width: 100vw;
		z-index: -1;
	}
	/* the overlay instance rides ABOVE the cards (under wheel + scene) */
	.page--dive > :global(.dive-layer.is-over) {
		z-index: 3;
	}
	@media (min-width: 900px) {
		.page--dive {
			max-width: 64rem;
		}
	}

	/* ---- sky: title + lead sit center-right, clear of the docked wheel ---- */
	.sky {
		position: relative;
		margin-left: clamp(2.5rem, calc(19rem - 50vw + 50%), 19rem);
		max-width: 34rem;
	}
	.sky .lead {
		margin: 0;
	}

	/* ---- waterline: the ground-line twin; the layer paints the hard break
	   and the seigaiha band here ---- */
	.waterline {
		height: 34px;
		margin: 2.75rem 0 3.25rem;
	}

	/* ---- the two-bank weave. The banks stay whole in the DOM; the grid
	   places both on shared depth rows (concurrent stations side by side).
	   The middle column is the sounding line's corridor. ---- */
	.column {
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: 1.25rem;
		row-gap: clamp(4.5rem, 9vh, 7rem);
		align-items: start;
	}
	.bank {
		display: contents;
	}
	.bank-head {
		grid-row: 1;
		margin: 0;
		font-size: var(--fs-h2);
		scroll-margin-top: 6rem;
		justify-self: start;
		/* a washi label tag, not floating text — readable over any water */
		background:
			repeating-linear-gradient(
				0deg,
				transparent 0 13px,
				color-mix(in srgb, var(--ink) 2%, transparent) 13px 14px
			),
			var(--paper);
		color: var(--ink);
		border: 1px solid color-mix(in srgb, var(--ink) 35%, transparent);
		border-radius: 3px 10px 3px 10px;
		padding: 0.3rem 1.1rem 0.35rem;
		box-shadow: 0 10px 22px -14px rgba(4, 20, 31, 0.6);
	}
	.bank--work .bank-head {
		grid-column: 2;
		justify-self: end;
		border-radius: 10px 3px 10px 3px;
	}
	.bank--edu .bank-head {
		grid-column: 1;
	}

	/* mobile-first: single column right of the left-gutter line; both bank
	   heads share the legend row up top */
	.station {
		grid-column: 1 / -1;
		grid-row: var(--mr);
	}
	@media (min-width: 900px) {
		.column {
			grid-template-columns: minmax(0, 1fr) var(--line-gap) minmax(0, 1fr);
			column-gap: 0;
		}
		.bank--work .bank-head {
			grid-column: 3;
			justify-self: start;
		}
		.station {
			grid-row: var(--r) / var(--r2);
			max-width: 27rem;
			width: 100%;
		}
		/* stations hug the line — the tie cords are short */
		.bank--edu .station {
			grid-column: 1;
			justify-self: end;
		}
		.bank--work .station {
			grid-column: 3;
			justify-self: start;
		}
		/* the MA rides down its row to sit beside its concurrent twin, the
		   SIGA trainee slip (the panel's lower half) */
		.station[data-dive='st-hslu-ma'] {
			align-self: end;
		}
		/* the apprenticeship spans its whole era beside EFZ + BM */
		.station[data-dive='st-emvs-lehre'] {
			align-self: center;
		}
	}

	/* ---- washi station slips ---- */
	.station {
		position: relative;
		padding: 1.15rem 1.35rem 1.2rem;
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
			0 1px 2px rgba(4, 20, 31, 0.18),
			0 24px 44px -26px rgba(4, 20, 31, 0.65);
	}
	.side-r {
		border-radius: 4px 10px 4px 12px;
	}
	.station--deep {
		background:
			repeating-linear-gradient(
				0deg,
				transparent 0 13px,
				color-mix(in srgb, var(--ink) 2.5%, transparent) 13px 14px
			),
			var(--paper-old);
	}
	.role {
		margin: 0 0 0.15rem;
		font-size: var(--fs-h3);
		line-height: 1.25;
		color: var(--ink);
	}
	.org-line {
		margin: 0 0 0.55rem;
		font-family: var(--font-display);
		font-style: italic;
		font-size: 0.95rem;
		color: var(--ink-muted);
	}
	.span-chip {
		margin: 0 0 0.55rem;
		font-size: 0.82rem;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		align-items: baseline;
	}
	.span-chip .dur {
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
	/* mini seal chips: a red hanko tick + the skill (NOT the big Hanko button
	   — that stays reserved for real links) */
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

	/* the little washi tag naming the card's bank */
	.track-tag {
		position: absolute;
		top: -0.72rem;
		font-size: 0.62rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-muted);
		background: var(--paper-old);
		border: 1px solid color-mix(in srgb, var(--ink) 28%, transparent);
		border-radius: 2px 6px 2px 6px;
		padding: 0.06rem 0.5rem;
	}
	.side-l .track-tag {
		left: 0.9rem;
	}
	.side-r .track-tag {
		right: 0.9rem;
	}

	.stamps {
		display: flex;
		justify-content: flex-end;
		margin: 0.35rem -0.35rem -0.55rem 0;
	}

	/* ---- the SIGA group panel: two role slips, one employer ---- */
	.panel-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.65rem;
	}
	.org-line--panel {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 600;
		font-style: normal;
		font-family: var(--font-display);
		color: var(--ink);
	}
	.group-note {
		margin: 0;
		font-size: 0.74rem;
		color: var(--ink-muted);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.slip + .slip-tie {
		margin: 0.8rem 0 0.55rem;
	}
	.slip-tie {
		position: relative;
		display: grid;
		place-items: center;
	}
	.slip-tie::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		border-top: 1px dashed color-mix(in srgb, var(--ink) 30%, transparent);
	}
	.mizuhiki {
		position: relative;
		width: 4.5rem;
		height: 1.2rem;
		background: var(--paper);
	}
	.mz-a,
	.mz-b {
		fill: none;
		stroke-width: 1.9;
		stroke-linecap: round;
	}
	.mz-a {
		stroke: var(--seal);
	}
	.mz-b {
		stroke: color-mix(in srgb, var(--seal) 70%, #5c1710);
	}
	.mz-knot {
		fill: var(--seal);
	}

	/* ---- the origami crane resting on the army card (left corner — the
	   track tag owns the right one) ---- */
	.crane {
		position: absolute;
		top: -1.55rem;
		left: 1.2rem;
		width: 3.4rem;
		height: auto;
		transform: rotate(-3deg);
	}
	.cr-wing {
		fill: #fbf6e8;
		stroke: color-mix(in srgb, var(--ink) 45%, transparent);
		stroke-width: 1;
		stroke-linejoin: round;
	}
	.cr-body,
	.cr-tail {
		fill: #f1e8d2;
		stroke: color-mix(in srgb, var(--ink) 45%, transparent);
		stroke-width: 1;
		stroke-linejoin: round;
	}
	.cr-beak {
		fill: var(--seal);
		stroke: none;
	}
	.cr-fold {
		fill: none;
		stroke: color-mix(in srgb, var(--ink) 30%, transparent);
		stroke-width: 0.8;
	}

	/* ---- the origin: the caption floats over the seabed the layer paints.
	   `.living` (JS present → dark atmosphere) flips it to foam light. ---- */
	.origin {
		position: relative;
		min-height: 16rem;
		margin-top: clamp(5rem, 10vh, 8rem);
		display: grid;
		place-items: end center;
		padding-bottom: 1.5rem;
		scroll-margin-top: 6rem;
	}
	.origin-line {
		margin: 0;
		font-family: var(--font-display);
		font-style: italic;
		font-size: 1.15rem;
		color: var(--fg-muted);
		text-align: center;
	}
	/* with the layer live (.living), the deep is abyss ink — foam writing */
	.living .origin-line {
		color: #cdeef6;
		text-shadow: 0 1px 12px rgba(4, 20, 31, 0.7);
	}

	/* ---- growth: buoyant settle — everything underwater arrives through
	   resistance, no overshoot, and reduced motion lands fully drawn ---- */
	@media (prefers-reduced-motion: no-preference) {
		.pending {
			opacity: 0;
		}
		.in {
			animation: dive-settle 1100ms cubic-bezier(0.22, 0.61, 0.21, 1) backwards;
		}
	}
	@keyframes dive-settle {
		from {
			opacity: 0;
			transform: translateY(16px) scale(0.97);
		}
	}

	/* ---- narrow: gutter mode. The line dives down the left gutter; the
	   cards keep to its right. ---- */
	@media (max-width: 899.9px) {
		.page--dive {
			padding-top: 7.5rem;
		}
		/* clearance so the boat's koinobori pole never pierces the lead */
		.waterline {
			margin-top: 4.5rem;
		}
		.column {
			padding-left: 3.1rem;
		}
		.origin {
			min-height: 13rem;
		}
	}
	@media (max-width: 560px) {
		/* the shrunken wheel still owns the top-left corner: drop the title
		   below it instead of squeezing it sideways */
		.sky {
			margin-left: 0;
			padding-top: calc(min(86vw, 400px) * 0.42);
		}
		.column {
			padding-left: 2.4rem;
		}
	}
</style>
