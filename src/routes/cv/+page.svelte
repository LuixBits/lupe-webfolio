<script lang="ts">
	import { research, publications, education, positions } from '$lib/content/cv';
	import { resolveLocalized, resolveSpan } from '$lib/content/schema';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	const locale = getLocale();
	// Unique id prefix for SVG defs (SSR-safe, mirrors WaterScene).
	const uid = $props.id();

	// The silhouette koi crossing the water column: fixed literals only —
	// identical output on server & client, no hydration drift.
	const KOI_RUNS = [
		{ top: '22%', w: '6.4rem', dur: '80s', delay: '-34s', rest: '40rem', flip: false },
		{ top: '58%', w: '4.6rem', dur: '55s', delay: '-12s', rest: '5rem', flip: true }
	];
	// Lily-pad rotations per research card (fixed, cycled by index).
	const PAD_ROTS = [24, 132, -40];
</script>

<svelte:head><title>{m.nav_cv()} — Lupe</title><meta name="description" content={m.meta_desc_cv()} /></svelte:head>

<!-- Seigaiha fan pattern (same construction as the wheel's cv slice + WaterScene):
     rows painted bottom-up so each row of fans is occluded by the row above. -->
{#snippet seigaihaDefs(pid: string)}
	<g id="{pid}-fan">
		<circle r="22" class="sg-fill" />
		<circle r="22" class="sg-ring" fill="none" />
		<circle r="16.5" class="sg-ring" fill="none" />
		<circle r="11" class="sg-ring" fill="none" />
		<circle r="5.5" class="sg-ring" fill="none" />
	</g>
	<pattern id={pid} width="44" height="22" patternUnits="userSpaceOnUse">
		<use href="#{pid}-fan" x="22" y="33" />
		<use href="#{pid}-fan" x="0" y="22" />
		<use href="#{pid}-fan" x="44" y="22" />
		<use href="#{pid}-fan" x="22" y="11" />
		<use href="#{pid}-fan" x="0" y="0" />
		<use href="#{pid}-fan" x="44" y="0" />
		<use href="#{pid}-fan" x="22" y="-11" />
	</pattern>
{/snippet}

<!-- Top-view koi silhouette: teardrop body, two pectoral fins, forked tail,
     two darker patches. Nose points +x; flipped via a mirrored wrapper. -->
{#snippet koiShadow()}
	<svg class="skoi-svg" viewBox="-36 -19 68 38" aria-hidden="true">
		<g class="skoi-fig">
			<g class="skoi-tail">
				<path
					d="M-16 0C-22 -3 -26 -8 -32 -11C-29 -6 -29 -3 -27 0C-29 3 -29 6 -32 11C-26 8 -22 3 -16 0Z"
				/>
			</g>
			<path d="M14 7C11 12 6 15 1 16C4 12 7 9 9 7C11 6.6 13 6.6 14 7Z" />
			<path d="M14 -7C11 -12 6 -15 1 -16C4 -12 7 -9 9 -7C11 -6.6 13 -6.6 14 -7Z" />
			<path d="M28 0C28 -5 20 -9.5 8 -10C-4 -10.5 -14 -6 -18 0C-14 6 -4 10.5 8 10C20 9.5 28 5 28 0Z" />
			<circle class="skoi-spot" cx="12" cy="-2" r="4.5" />
			<circle class="skoi-spot" cx="-4" cy="3.5" r="3.5" />
		</g>
	</svg>
{/snippet}

<!-- Vermilion myōjin torii standing in the water: kasagi with upturned ends
     over a straight shimaki, nuki through two inward-leaning pillars, small
     gakuzuka strut. A mirrored, gradient-masked copy below the waterline is
     its reflection; foam rings settle the pillars into the surface. -->
{#snippet torii(pid: string)}
	<svg class="torii-svg" viewBox="0 0 140 186" aria-hidden="true">
		<defs>
			<linearGradient id="{pid}-fade" x1="0" y1="120" x2="0" y2="182" gradientUnits="userSpaceOnUse">
				<stop offset="0" stop-color="#fff" stop-opacity="0.62" />
				<stop offset="1" stop-color="#fff" stop-opacity="0" />
			</linearGradient>
			<mask id="{pid}-mask">
				<rect x="0" y="116" width="140" height="70" fill="url(#{pid}-fade)" />
				<!-- thin slits: the surface chop breaking the mirror image -->
				<rect x="0" y="128" width="140" height="2" fill="#000" opacity="0.9" />
				<rect x="0" y="139" width="140" height="2.6" fill="#000" opacity="0.8" />
				<rect x="0" y="153" width="140" height="3" fill="#000" opacity="0.7" />
			</mask>
			<g id="{pid}-gate">
				<path class="t-main" d="M25.6 24L34.4 24L29.2 118L19.4 118Z" />
				<path class="t-main" d="M105.6 24L114.4 24L120.6 118L110.8 118Z" />
				<path class="t-main" d="M66.4 24.5H73.6V47H66.4Z" />
				<path class="t-main" d="M7.5 47H132.5V55.5H7.5Z" />
				<path class="t-dark" d="M10.5 15.5H129.5V24.5H10.5Z" />
				<path class="t-dark" d="M1 2C36 9 104 9 139 2L136.5 14.5C104 20 36 20 3.5 14.5Z" />
			</g>
		</defs>
		<use href="#{pid}-gate" />
		<!-- mask on the outer group, mirror on the inner: keeps the fade
		     anchored to the waterline instead of flipping with the copy -->
		<g mask="url(#{pid}-mask)">
			<g transform="translate(0 182.9) scale(1 -0.55)">
				<use href="#{pid}-gate" />
			</g>
		</g>
		<g class="t-ring" fill="none">
			<ellipse cx="24.3" cy="119" rx="17" ry="3.2" />
			<ellipse cx="115.7" cy="119" rx="17" ry="3.2" />
		</g>
		<g class="t-collar">
			<ellipse cx="24.3" cy="118" rx="10" ry="2.5" />
			<ellipse cx="115.7" cy="118" rx="10" ry="2.5" />
		</g>
	</svg>
{/snippet}

<!-- Notched lily-pad disc peeking from behind a card corner. -->
{#snippet lilypad(rot: number)}
	<svg class="pad-svg" viewBox="-56 -56 112 112" aria-hidden="true">
		<g transform="rotate({rot})">
			<path class="pad-leaf" d="M0 0L49.9 -20.2A52 52 0 1 0 49.9 20.2Z" />
			<g class="pad-veins">
				<line x1="0" y1="0" x2="-31" y2="-31" />
				<line x1="0" y1="0" x2="0" y2="-44" />
				<line x1="0" y1="0" x2="-44" y2="0" />
				<line x1="0" y1="0" x2="-31" y2="31" />
				<line x1="0" y1="0" x2="0" y2="44" />
			</g>
		</g>
	</svg>
{/snippet}

<div class="page pond">
	<!-- shared defs: the seigaiha pattern both wave bands reference -->
	<svg class="defs" aria-hidden="true" focusable="false">
		<defs>{@render seigaihaDefs(`${uid}-sg`)}</defs>
	</svg>

	<header class="surface">
		<h1>{m.nav_cv()}</h1>
		<div class="band-wrap" aria-hidden="true">
			<svg class="band band--surface">
				<rect class="band-tile" x="-48" y="0" width="150%" height="88" fill="url(#{uid}-sg)" />
			</svg>
		</div>
		<!-- the floating gate, standing out in the open water to the right -->
		<div class="torii torii--surface" aria-hidden="true">
			{@render torii(`${uid}-tg`)}
		</div>
	</header>

	<div class="water-column">
		<!-- the water deepens with depth = time -->
		<div class="depth-tint" aria-hidden="true"></div>

		<!-- silhouette koi crossing behind the cards -->
		<div class="koi-layer" aria-hidden="true">
			{#each KOI_RUNS as k (k.top)}
				{#if k.flip}
					<div class="mirror">
						<div
							class="skoi"
							style="top:{k.top}; width:{k.w}; --kdur:{k.dur}; --kdel:{k.delay}; --krest:{k.rest}"
						>
							{@render koiShadow()}
						</div>
					</div>
				{:else}
					<div
						class="skoi"
						style="top:{k.top}; width:{k.w}; --kdur:{k.dur}; --kdel:{k.delay}; --krest:{k.rest}"
					>
						{@render koiShadow()}
					</div>
				{/if}
			{/each}
		</div>

		<!-- the sounding line: a depth gauge with year graduations -->
		<div class="rail" aria-hidden="true"></div>

		<section id="research" class="section zone zone--midwater">
			<h2>{m.nav_cv_research()}</h2>
			<ol class="entries">
				{#each research as p, i (p.slug)}
					<li class="entry entry--float" style="--d:{i}">
						<span class="tick" aria-hidden="true">
							<i class="dot"></i>
							<span class="year">{p.year}</span>
						</span>
						<span class="stem" aria-hidden="true"></span>
						<div class="bobwrap">
							<span class="pad-peek" aria-hidden="true">
								{@render lilypad(PAD_ROTS[i % PAD_ROTS.length])}
							</span>
							<a class="card" href={localizeHref(`/cv/${p.slug}`)}>
								<h3>{resolveLocalized(p.title, locale)}</h3>
								<p class="tagline">{resolveLocalized(p.tagline, locale)}</p>
								<ul class="chips">
									<li class="chip chip-year">{p.year}</li>
									{#each p.tags as t (t)}<li class="chip">{t}</li>{/each}
								</ul>
							</a>
						</div>
					</li>
				{/each}
			</ol>
		</section>

		<!-- thermocline: a faint wave stratum dividing mid-water from the bed -->
		<div class="thermocline" aria-hidden="true">
			<svg class="band band--thermo">
				<rect class="band-tile still" x="-48" y="0" width="150%" height="26" fill="url(#{uid}-sg)" />
			</svg>
			<!-- a second gate far off on the thermocline: small and washed pale -->
			<div class="torii torii--far">
				{@render torii(`${uid}-tf`)}
			</div>
		</div>

		<section id="publications" class="section zone zone--bed">
			<h2>
				<span>{m.nav_cv_publications()}</span>
				<span class="h2-koi" aria-hidden="true">{@render koiShadow()}</span>
			</h2>
			<ol class="entries">
				{#each publications as p (p.slug)}
					<li class="entry entry--tablet">
						<span class="tick" aria-hidden="true">
							<i class="dot"></i>
							<span class="year">{p.year}</span>
						</span>
						<span class="stem" aria-hidden="true"></span>
						<div class="bobwrap">
							<a class="card card--tablet" href={localizeHref(`/cv/${p.slug}`)}>
								<h3>{resolveLocalized(p.title, locale)}</h3>
								<p class="venue">{resolveLocalized(p.tagline, locale)}</p>
							</a>
						</div>
						<ul class="chips chips--links">
							<li class="chip chip-year">{p.year}</li>
							{#each p.links as l (l.url)}
								<li>
									<a class="chip chip-link" href={l.url} target="_blank" rel="noopener">{l.label}</a>
								</li>
							{/each}
						</ul>
					</li>
				{/each}
			</ol>

			<!-- bedrock: education + positions as compact sediment strata -->
			<div class="bedrock">
				<h3 class="eyebrow stratum-title">{m.cv_education()}</h3>
				<ul class="strata">
					{#each education as e, i (i)}
						<li>
							<span class="span">{resolveSpan(e.span, locale)}</span>
							<span class="what">
								<strong>{resolveLocalized(e.degree, locale)}</strong>
								<span class="where">· {e.institution}</span>
								{#if e.note}<span class="note">{resolveLocalized(e.note, locale)}</span>{/if}
							</span>
						</li>
					{/each}
				</ul>

				<h3 class="eyebrow stratum-title">{m.cv_positions()}</h3>
				<ul class="strata">
					{#each positions as pos, i (i)}
						<li>
							<span class="span">{resolveSpan(pos.span, locale)}</span>
							<span class="what">
								<strong>{resolveLocalized(pos.role, locale)}</strong>
								<span class="where">· {pos.org}</span>
								{#if pos.note}<span class="note">{resolveLocalized(pos.note, locale)}</span>{/if}
							</span>
						</li>
					{/each}
				</ul>
			</div>
		</section>
	</div>
</div>

<style>
	/* How far the pond spills past the text column into the empty right space:
	   up to 16rem, but never past ~0.75rem from the viewport edge. Percentages
	   resolve against the (identical-width) column wherever this is used. */
	.pond {
		--bleed: max(calc(50% - 50vw + 0.75rem), -16rem);
		--rail-x: 1.75rem;
		--gutter: 3.5rem;
	}

	.defs {
		position: absolute;
		width: 0;
		height: 0;
		overflow: hidden;
	}

	/* ---- surface: title + seigaiha band --------------------------------- */
	.surface {
		position: relative;
	}
	.surface h1 {
		margin-bottom: 0.75rem;
		/* Keep the title clear of the top-left docked wheel when the column
		   drifts toward the viewport edge (nothing at desktop widths). */
		margin-left: clamp(0rem, calc(17rem - 50vw + 50%), 17rem);
	}
	.band {
		display: block;
		overflow: hidden;
	}
	.band-wrap {
		width: calc(100% - var(--bleed));
		-webkit-mask-image: linear-gradient(to right, #000 82%, transparent);
		mask-image: linear-gradient(to right, #000 82%, transparent);
	}
	.band--surface {
		width: 100%;
		height: 64px;
		opacity: 0.85;
		-webkit-mask-image: linear-gradient(to bottom, #000 40%, transparent);
		mask-image: linear-gradient(to bottom, #000 40%, transparent);
	}
	.sg-fill {
		fill: color-mix(in srgb, var(--slice-bg) 30%, var(--bg));
	}
	.sg-ring {
		stroke: var(--water-deep);
		stroke-opacity: 0.5;
		stroke-width: 1.3;
	}

	/* ---- torii gates ------------------------------------------------------ */
	.torii {
		position: absolute;
		pointer-events: none;
	}
	.torii-svg {
		display: block;
		width: 100%;
		height: auto;
	}
	/* Standing in the surface band's open water; the reflection runs on
	   below the header into the top of the water column. */
	.torii--surface {
		width: 9.5rem;
		right: calc(var(--bleed) + 4.5rem);
		bottom: -2.6rem;
	}
	/* Far-off echo on the thermocline: small, washed toward the water. */
	.torii--far {
		width: 3.9rem;
		right: calc(var(--bleed) + 8.5rem);
		bottom: -1.05rem;
		opacity: 0.34;
	}
	.t-main {
		fill: #e04530;
	}
	.t-dark {
		fill: #c4321f;
	}
	.t-ring ellipse {
		stroke: color-mix(in srgb, var(--water-deep) 45%, transparent);
		stroke-width: 1.4;
	}
	.t-collar ellipse {
		fill: var(--water-foam);
		stroke: color-mix(in srgb, var(--water-deep) 35%, transparent);
		stroke-width: 1;
	}

	/* ---- the water column ------------------------------------------------ */
	.water-column {
		position: relative;
		margin-top: 1.25rem;
	}
	.depth-tint {
		position: absolute;
		top: 0;
		bottom: 0;
		left: -1.25rem;
		right: var(--bleed);
		background: linear-gradient(
			to bottom,
			transparent,
			color-mix(in srgb, var(--water-deep) 4%, transparent) 35%,
			color-mix(in srgb, var(--water-deep) 12%, transparent)
		);
		border-radius: 0 0 1.25rem 1.25rem;
		-webkit-mask-image: linear-gradient(to right, transparent, #000 4%, #000 78%, transparent);
		mask-image: linear-gradient(to right, transparent, #000 4%, #000 78%, transparent);
		z-index: 0;
		pointer-events: none;
	}

	/* ---- sounding line (rail + plumb) ------------------------------------ */
	.rail {
		position: absolute;
		top: 0.35rem;
		bottom: 0;
		left: var(--rail-x);
		width: 2px;
		margin-left: -1px;
		background: color-mix(in srgb, var(--water-deep) 35%, transparent);
		z-index: 1;
		pointer-events: none;
	}
	.rail::after {
		/* the sounding lead resting on the bed */
		content: '';
		position: absolute;
		left: 50%;
		bottom: -2px;
		transform: translateX(-50%);
		width: 11px;
		height: 15px;
		background: color-mix(in srgb, var(--water-deep) 48%, transparent);
		clip-path: polygon(50% 100%, 100% 32%, 76% 0, 24% 0, 0 32%);
	}

	/* ---- zones ----------------------------------------------------------- */
	.zone {
		position: relative;
		z-index: 2;
	}
	.zone h2 {
		margin-left: var(--gutter);
	}
	.zone--bed h2 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}
	.h2-koi {
		width: 2.9rem;
		flex: none;
		transform: scaleX(-1) rotate(4deg);
	}
	.h2-koi .skoi-svg {
		opacity: 0.4;
	}

	.entries {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 1.15rem;
	}
	.entry {
		position: relative;
		display: grid;
		grid-template-columns: var(--gutter) minmax(0, 1fr);
		align-items: start;
	}
	.tick {
		grid-column: 1;
		grid-row: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 1.15rem;
		position: relative;
		z-index: 1;
	}
	.dot {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: var(--bg);
		border: 2px solid var(--accent);
	}
	.tick .year {
		margin-top: 0.35rem;
		font-size: 0.74rem;
		color: var(--fg-muted);
		font-variant-numeric: tabular-nums;
		background: color-mix(in srgb, var(--bg) 72%, transparent);
		padding: 0.05rem 0.25rem;
		border-radius: 4px;
	}
	.stem {
		/* the tether from the card back to the sounding line */
		position: absolute;
		left: calc(var(--rail-x) + 0.35rem);
		width: calc(var(--gutter) - var(--rail-x) - 0.35rem);
		top: 1.55rem;
		height: 1px;
		background: color-mix(in srgb, var(--water-deep) 30%, transparent);
	}

	/* ---- cards ----------------------------------------------------------- */
	.bobwrap {
		grid-column: 2;
		grid-row: 1;
		position: relative;
	}
	.pad-peek {
		position: absolute;
		top: -1.05rem;
		left: -0.95rem;
		width: 3.7rem;
		z-index: 0;
		pointer-events: none;
	}
	.pad-svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.pad-leaf {
		fill: color-mix(in srgb, var(--slice-bg) 30%, transparent);
		stroke: color-mix(in srgb, var(--water-deep) 35%, transparent);
		stroke-width: 1.5;
	}
	.pad-veins line {
		stroke: color-mix(in srgb, var(--water-deep) 30%, transparent);
		stroke-width: 1.5;
	}

	.card {
		position: relative;
		z-index: 1;
		display: block;
		padding: 1.05rem 1.25rem;
		border: 1px solid color-mix(in srgb, var(--slice-bg) 55%, transparent);
		border-radius: 12px;
		background: color-mix(in srgb, var(--slice-bg) 14%, transparent);
		color: inherit;
		text-decoration: none;
		transition:
			transform 0.15s ease,
			border-color 0.15s ease;
	}
	.card:hover,
	.card:focus-visible {
		border-color: var(--accent);
		outline: none;
	}
	.card:hover h3,
	.card:focus-visible h3 {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}
	.card::after {
		/* one ripple ring per hover */
		content: '';
		position: absolute;
		inset: -2px;
		border-radius: inherit;
		border: 1.5px solid var(--water-foam);
		opacity: 0;
		pointer-events: none;
	}
	.card h3 {
		margin: 0 0 0.3rem;
		font-size: var(--fs-h3);
	}
	.tagline {
		margin: 0 0 0.75rem;
		color: var(--fg-muted);
		font-size: 0.95rem;
	}

	/* publications: stone tablets on the bed */
	.card--tablet {
		border-radius: 8px;
		border-color: color-mix(in srgb, var(--water-deep) 30%, transparent);
		background: linear-gradient(
			color-mix(in srgb, var(--slice-bg) 20%, transparent),
			color-mix(in srgb, var(--water-deep) 12%, transparent)
		);
		box-shadow: inset 0 1px 0 color-mix(in srgb, var(--water-foam) 55%, transparent);
	}
	.venue {
		margin: 0;
		font-family: var(--font-display);
		font-style: italic;
		font-size: 0.98rem;
		color: var(--fg-muted);
	}

	/* ---- pebble chips ----------------------------------------------------- */
	.chips {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
	}
	.chip {
		display: inline-block;
		padding: 0.1rem 0.55rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--slice-bg) 30%, transparent);
	}
	.chip-year {
		display: none; /* the year lives on the rail tick; chip form is mobile-only */
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.chips--links {
		grid-column: 2;
		grid-row: 2;
		margin-top: 0.55rem;
	}
	.chip-link {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.28rem;
		padding: 0.28rem 0.7rem;
		background: transparent;
		border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
		color: var(--accent);
		text-decoration: none;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;
	}
	.chip-link::before {
		/* invisible tap-target extension: the anchor's hit area reaches
		   44x44px even though the pebble itself stays small */
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: max(100%, 2.75rem);
		height: max(100%, 2.75rem);
	}
	.chip-link::after {
		/* outward arrow: marks the pebble as a link, unlike the inert chips */
		content: '\2197\FE0E';
		font-size: 0.9em;
		line-height: 1;
	}
	.chip-link:hover,
	.chip-link:focus-visible {
		background: color-mix(in srgb, var(--accent) 14%, transparent);
		border-color: var(--accent);
		outline: none;
	}

	/* ---- thermocline ------------------------------------------------------ */
	.thermocline {
		position: relative;
		z-index: 1;
		margin: -1.25rem 0 1.75rem;
	}
	.band--thermo {
		width: calc(100% - var(--bleed));
		height: 26px;
		opacity: 0.3;
		-webkit-mask-image: linear-gradient(to right, transparent, #000 14%, #000 82%, transparent);
		mask-image: linear-gradient(to right, transparent, #000 14%, #000 82%, transparent);
	}

	/* ---- bedrock strata ---------------------------------------------------- */
	.bedrock {
		margin: 2.75rem 0 0 var(--gutter);
	}
	.stratum-title {
		font-family: var(--font-display);
		font-weight: 600;
		margin-bottom: 0.35rem;
	}
	.strata {
		list-style: none;
		padding: 0;
		margin: 0 0 1.75rem;
	}
	.strata li {
		display: grid;
		grid-template-columns: 6.25rem minmax(0, 1fr);
		gap: 0.85rem;
		padding: 0.6rem 0;
		border-top: 1px solid color-mix(in srgb, var(--water-deep) 22%, transparent);
	}
	.strata li:last-child {
		border-bottom: 1px solid color-mix(in srgb, var(--water-deep) 22%, transparent);
	}
	.strata .span {
		font-size: 0.8rem;
		color: var(--fg-muted);
		font-variant-numeric: tabular-nums;
		padding-top: 0.2rem;
		white-space: nowrap;
	}
	.strata .what strong {
		font-weight: 600;
	}
	.strata .where {
		color: var(--fg-muted);
	}
	.strata .note {
		display: block;
		font-size: 0.85rem;
		color: var(--fg-muted);
		font-style: italic;
	}

	/* ---- koi layer --------------------------------------------------------- */
	.koi-layer {
		position: absolute;
		top: 0;
		bottom: 0;
		left: -1.25rem;
		right: var(--bleed);
		overflow: hidden;
		contain: paint;
		z-index: 1;
		pointer-events: none;
	}
	.mirror {
		position: absolute;
		inset: 0;
		transform: scaleX(-1);
	}
	.skoi {
		position: absolute;
		left: 0;
		/* static resting spot = the reduced-motion tableau; animation overrides it */
		transform: translateX(var(--krest, 14rem));
	}
	.skoi-svg {
		display: block;
		width: 100%;
		height: auto;
		opacity: 0.12;
	}
	.skoi-fig path,
	.skoi-fig circle {
		fill: color-mix(in srgb, var(--water-deep) 60%, var(--fg));
	}
	.skoi-spot {
		fill-opacity: 0.55;
	}

	/* ---- motion (all of it lives here; base state is the calm tableau) ---- */
	@media (prefers-reduced-motion: no-preference) {
		.skoi {
			animation: swimAcross var(--kdur, 60s) linear infinite;
			animation-delay: var(--kdel, 0s);
			will-change: transform;
		}
		.skoi-svg {
			opacity: 0.16;
		}
		.skoi-tail {
			transform-box: fill-box;
			transform-origin: 100% 50%;
			animation: tailSway 1.9s ease-in-out infinite alternate;
		}
		.entry--float .bobwrap {
			animation: bob 8s ease-in-out infinite alternate;
			animation-delay: calc(var(--d, 0) * -2.7s);
			will-change: transform;
		}
		.card:hover,
		.card:focus-visible {
			transform: translateY(-2px);
		}
		.card:hover::after,
		.card:focus-visible::after {
			animation: rippleRing 0.9s ease-out forwards;
		}
		.band--surface .band-tile {
			animation: bandDrift 30s ease-in-out infinite alternate;
		}
	}
	@keyframes swimAcross {
		from {
			transform: translateX(-9rem);
		}
		to {
			transform: translateX(64rem);
		}
	}
	@keyframes tailSway {
		from {
			transform: rotate(-7deg);
		}
		to {
			transform: rotate(7deg);
		}
	}
	@keyframes bob {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(-3px);
		}
	}
	@keyframes rippleRing {
		from {
			opacity: 0.9;
			transform: scale(0.85);
		}
		to {
			opacity: 0;
			transform: scale(1.06);
		}
	}
	@keyframes bandDrift {
		from {
			transform: translateX(-14px);
		}
		to {
			transform: translateX(14px);
		}
	}

	/* ---- mobile ------------------------------------------------------------ */
	@media (max-width: 700px) {
		.pond {
			--rail-x: 1rem;
			--gutter: 2rem;
		}
		.band--surface {
			height: 46px;
		}
		.torii--surface {
			width: 5.25rem;
			right: 0.25rem;
			bottom: -1.4rem;
		}
		.torii--far {
			display: none;
		}
		.zone--bed h2 {
			justify-content: flex-start;
		}
		.koi-layer {
			display: none;
		}
		.stem {
			display: none;
		}
		.tick .year {
			display: none;
		}
		.chip-year {
			display: inline-block;
		}
		.pad-peek {
			width: 3.1rem;
			left: -0.6rem;
		}
		.bedrock {
			margin-left: var(--gutter);
		}
		.strata li {
			grid-template-columns: 5rem minmax(0, 1fr);
			gap: 0.6rem;
		}
	}
	@media (max-width: 560px) {
		/* Narrow phones: every horizontal rem is measure the cards need back.
		   The rail stays centered under the tick dots (half the gutter). */
		.pond {
			--rail-x: 0.625rem;
			--gutter: 1.25rem;
		}
		/* The shrunken wheel still owns the top-left corner: drop the title
		   fully below it instead of squeezing it sideways. */
		.surface {
			padding-top: calc(min(86vw, 400px) * 0.45);
		}
		.surface h1 {
			margin-left: 0;
		}
		/* Bedrock strata: the 5rem year column starves the text at this width —
		   stack the span above the degree/role line and pull the block left. */
		.bedrock {
			margin-left: 0.5rem;
		}
		.strata li {
			grid-template-columns: 1fr;
			gap: 0.1rem;
		}
		.strata .span {
			padding-top: 0;
		}
	}
</style>
