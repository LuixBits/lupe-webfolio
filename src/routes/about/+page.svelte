<script lang="ts">
	import { about } from '$lib/content/about';
	import { resolveLocalized } from '$lib/content/schema';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import Garden from '$lib/garden/Garden.svelte';

	const locale = getLocale();
	const bioParas = $derived(resolveLocalized(about.bio, locale).split('\n\n'));
	// A drop cap mangles opening contractions ("I'm" → giant "I'" + orphaned
	// "m"), so only grant it when the first word survives ::first-letter intact.
	const dropcapOk = $derived(!/^\p{L}['’]/u.test(bioParas[0] ?? ''));

	// Circled figure markers pinned to real features of the specimen (low-left
	// leaf cluster, rightmost branch, crown) — hand-tuned % of the plate art
	// box, safe because growPlant(seed 'about') is pure + seeded, so server and
	// client render the identical plant on every visit.
	const FIG_POS = [
		{ x: 33, y: 68.5 },
		{ x: 64, y: 54.5 },
		{ x: 46.5, y: 21 }
	];
	const figs = $derived(about.highlights.slice(0, FIG_POS.length));
</script>

<svelte:head><title>{m.nav_about()} — {about.name}</title></svelte:head>

<div class="page page--folio">
	<section id="bio" class="section folio">
		<div class="folio-text">
			<p class="eyebrow">{m.about_folio_eyebrow()} · {about.name}</p>
			<h1>{m.nav_about()}</h1>
			<p class="lead">{resolveLocalized(about.role, locale)}</p>
			{#each bioParas as para, i (i)}
				<p class="bio-para" class:dropcap={i === 0 && dropcapOk}>{para}</p>
			{/each}
		</div>

		<figure class="plate">
			<div class="plate-paper">
				<span class="tape tape--tl" aria-hidden="true"></span>
				<span class="tape tape--tr" aria-hidden="true"></span>
				<span class="tape tape--bl" aria-hidden="true"></span>
				<span class="tape tape--br" aria-hidden="true"></span>
				<div class="plate-art">
					<Garden
						seed="about"
						width={240}
						height={260}
						originX={112}
						originY={246}
						heading={0}
						variant="branch"
						duration={2600}
					/>
					<svg class="pollen" viewBox="0 0 240 260" aria-hidden="true">
						<circle class="mote" cx="58" cy="84" r="1.7" />
						<circle class="mote" cx="178" cy="60" r="1.3" />
						<circle class="mote" cx="196" cy="150" r="1.5" />
						<circle class="mote" cx="44" cy="196" r="1.2" />
						<circle class="mote" cx="160" cy="222" r="1.6" />
					</svg>
					{#each figs as h, i (i)}
						<a
							class="fig"
							href="#note-{i}"
							style="left:{FIG_POS[i].x}%; top:{FIG_POS[i].y}%"
							aria-label={resolveLocalized(h.title, locale)}
						>
							<span class="fig-dot" style="animation-delay:{1.2 + i * 0.5}s" aria-hidden="true"
								>{i + 1}</span
							>
						</a>
					{/each}
				</div>
			</div>
			<figcaption class="plate-label">
				<span class="latin">{about.name}</span>
				<span class="det">{m.about_plate_det()}</span>
			</figcaption>
		</figure>
	</section>

	{#if about.highlights.length}
		<section class="section" aria-labelledby="notes-h">
			<h2 id="notes-h">{m.about_notes_title()}</h2>
			<ol class="notes">
				{#each about.highlights as h, i (i)}
					<li id="note-{i}" style="--d:{i}">
						<span class="fig-dot fig-dot--static" aria-hidden="true">{i + 1}</span>
						<div class="note-body">
							<h3>{resolveLocalized(h.title, locale)}</h3>
							<p>{resolveLocalized(h.body, locale)}</p>
						</div>
					</li>
				{/each}
			</ol>
		</section>
	{/if}

	<section id="contact" class="section">
		<h2>{m.nav_about_contact()}</h2>
		<p class="seeds-hint">{m.about_seeds_hint()}</p>
		<ul class="packets">
			{#each about.links as l (l.url)}
				<li>
					<a
						class="packet"
						href={l.url}
						target={l.url.startsWith('http') ? '_blank' : undefined}
						rel={l.url.startsWith('http') ? 'noopener' : undefined}
					>
						<span class="flap" aria-hidden="true"></span>
						<svg class="seeds" viewBox="0 0 64 40" aria-hidden="true">
							<ellipse cx="18" cy="22" rx="3.1" ry="5.4" transform="rotate(-24 18 22)" />
							<ellipse cx="32" cy="18" rx="3.1" ry="5.4" transform="rotate(10 32 18)" />
							<ellipse cx="46" cy="23" rx="3.1" ry="5.4" transform="rotate(32 46 23)" />
							<ellipse cx="27" cy="30" rx="2.5" ry="4.4" transform="rotate(-52 27 30)" />
						</svg>
						<span class="packet-label">{l.label}</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	/* ---- folio layout: widen ONLY this page so the plate earns real estate ---- */
	.folio {
		display: grid;
		gap: 2.25rem;
		align-items: start;
	}
	/* Below the wide breakpoint the plate leads — the pressed specimen is the
	   hero moment — and text follows. */
	.plate {
		order: -1;
		width: 100%;
		max-width: 23rem;
		margin: 0 auto;
	}
	@media (min-width: 1100px) {
		.page--folio {
			max-width: 64rem;
		}
		.folio {
			grid-template-columns: minmax(0, 1fr) 23rem;
			gap: 3.5rem;
		}
		.plate {
			order: 0;
			margin: 0.5rem 0 0;
		}
	}

	/* ---- prose ---- */
	.folio-text .bio-para {
		margin: 0 0 1rem;
	}
	.bio-para.dropcap::first-letter {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 3.3em;
		line-height: 0.78;
		float: left;
		padding: 0.08em 0.14em 0 0;
		color: var(--garden-stem, var(--accent));
	}

	/* ---- the specimen sheet ---- */
	.plate-paper {
		position: relative;
		padding: 1.3rem 1.3rem 0.6rem;
		background: color-mix(in srgb, var(--bg) 60%, white);
		border: 1px solid color-mix(in srgb, var(--garden-stem, var(--accent)) 35%, transparent);
		outline: 1px solid color-mix(in srgb, var(--garden-stem, var(--accent)) 22%, transparent);
		outline-offset: 5px;
		border-radius: 2px;
		box-shadow: 0 22px 44px -26px color-mix(in srgb, var(--garden-stem, #3f6d4e) 55%, transparent);
	}
	.plate-art {
		position: relative;
		aspect-ratio: 240 / 260;
	}
	.pollen {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.mote {
		fill: var(--garden-leaf, var(--accent));
		opacity: 0.45;
	}

	/* mounting tape across each corner */
	.tape {
		position: absolute;
		width: 3.3rem;
		height: 1rem;
		background: color-mix(in srgb, var(--slice-bg) 30%, transparent);
		box-shadow: 0 1px 2px color-mix(in srgb, var(--garden-stem, #3f6d4e) 12%, transparent);
		z-index: 3;
	}
	.tape--tl {
		top: -0.1rem;
		left: -1.15rem;
		transform: rotate(-45deg);
	}
	.tape--tr {
		top: -0.1rem;
		right: -1.15rem;
		transform: rotate(45deg);
	}
	.tape--bl {
		bottom: -0.1rem;
		left: -1.15rem;
		transform: rotate(45deg);
	}
	.tape--br {
		bottom: -0.1rem;
		right: -1.15rem;
		transform: rotate(-45deg);
	}

	/* herbarium determination label */
	.plate-label {
		position: relative;
		z-index: 2;
		width: fit-content;
		max-width: 85%;
		margin: -1.1rem 1.4rem 0 auto;
		padding: 0.5rem 1rem 0.45rem;
		display: grid;
		gap: 0.05rem;
		background: color-mix(in srgb, var(--bg) 42%, white);
		border: 1px solid color-mix(in srgb, var(--garden-stem, var(--accent)) 40%, transparent);
		box-shadow: 0 8px 20px -12px color-mix(in srgb, var(--garden-stem, #3f6d4e) 55%, transparent);
	}
	.latin {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 600;
		font-size: 1.02rem;
	}
	.det {
		font-size: 0.68rem;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--fg-muted);
	}

	/* ---- circled figure markers (plate + notes share the look) ---- */
	.fig {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 2.75rem;
		height: 2.75rem;
		display: grid;
		place-items: center;
		text-decoration: none;
	}
	.fig-dot {
		width: 1.65rem;
		height: 1.65rem;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-family: var(--font-display);
		font-size: 0.8rem;
		font-weight: 600;
		line-height: 1;
		color: var(--garden-stem, var(--accent));
		background: color-mix(in srgb, var(--bg) 52%, white);
		border: 1px solid color-mix(in srgb, var(--garden-stem, var(--accent)) 55%, transparent);
		box-shadow: 0 1px 4px color-mix(in srgb, var(--garden-stem, #3f6d4e) 25%, transparent);
		transition:
			transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
			border-color 200ms ease;
	}
	.fig:hover .fig-dot,
	.fig:focus-visible .fig-dot {
		transform: scale(1.15);
		border-color: var(--garden-stem, var(--accent));
	}
	.fig:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
		border-radius: 50%;
	}
	.fig-dot--static {
		flex: none;
	}

	/* ---- notes on cultivation ---- */
	.notes {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.35rem;
	}
	.notes li {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1rem;
		align-items: start;
		padding: 0.7rem 0.8rem;
		border-radius: 10px;
		scroll-margin-top: 7rem;
		transition: background-color 400ms ease;
	}
	.notes li:target {
		background: color-mix(in srgb, var(--slice-bg) 20%, transparent);
	}
	.note-body {
		border-left: 2px dotted color-mix(in srgb, var(--garden-stem, var(--accent)) 45%, transparent);
		padding-left: 1.05rem;
	}
	.note-body h3 {
		margin: 0.1rem 0 0.35rem;
		font-size: var(--fs-h3);
	}
	.note-body p {
		margin: 0;
		color: var(--fg-muted);
		font-size: 0.95rem;
	}

	/* ---- seed packets ---- */
	.seeds-hint {
		font-family: var(--font-display);
		font-style: italic;
		color: var(--fg-muted);
		margin: 0 0 1.2rem;
	}
	.packets {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 1.1rem;
	}
	.packet {
		position: relative;
		display: grid;
		justify-items: center;
		gap: 0.25rem;
		width: 9.5rem;
		max-width: calc(50vw - 4.5rem); /* two-up even on narrow phones */
		padding: 1.7rem 1rem 0.95rem;
		background: color-mix(in srgb, var(--bg) 55%, white);
		border: 1px solid color-mix(in srgb, var(--garden-stem, var(--accent)) 35%, transparent);
		border-radius: 3px 3px 9px 9px;
		text-decoration: none;
		color: var(--fg);
		box-shadow: 0 12px 26px -18px color-mix(in srgb, var(--garden-stem, #3f6d4e) 60%, transparent);
		transition:
			transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 220ms ease;
	}
	.packet:hover,
	.packet:focus-visible {
		transform: rotate(-1.5deg) translateY(-2px);
		box-shadow: 0 16px 30px -18px color-mix(in srgb, var(--garden-stem, #3f6d4e) 70%, transparent);
	}
	.flap {
		position: absolute;
		inset: 0 0 auto 0;
		height: 1.05rem;
		background: color-mix(in srgb, var(--slice-bg) 32%, transparent);
		clip-path: polygon(0 0, 100% 0, 100% 55%, 50% 100%, 0 55%);
	}
	.seeds {
		width: 3.1rem;
		height: auto;
	}
	.seeds ellipse {
		fill: var(--garden-stem, var(--accent));
		opacity: 0.85;
		transition: transform 220ms ease;
	}
	.packet:hover .seeds ellipse {
		transform: translateY(-1px);
	}
	.packet-label {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.98rem;
	}

	/* ---- motion (all of it) — stilled under reduced motion; Garden itself
	   snaps to fully grown there, leaving a complete pressed specimen. ---- */
	@media (prefers-reduced-motion: no-preference) {
		.fig .fig-dot {
			animation: fig-in 520ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
		}
		.notes li {
			animation: rise 480ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
			animation-delay: calc(320ms + var(--d, 0) * 80ms);
		}
		.mote {
			animation: drift-a 9s ease-in-out infinite alternate;
		}
		.mote:nth-of-type(2) {
			animation: drift-b 7s ease-in-out infinite alternate;
			animation-delay: -2.4s;
		}
		.mote:nth-of-type(3) {
			animation: drift-a 11s ease-in-out infinite alternate;
			animation-delay: -5s;
		}
		.mote:nth-of-type(4) {
			animation: drift-b 8.2s ease-in-out infinite alternate;
			animation-delay: -1.1s;
		}
		.mote:nth-of-type(5) {
			animation: drift-a 10s ease-in-out infinite alternate;
			animation-delay: -6.6s;
		}
	}
	@keyframes fig-in {
		from {
			opacity: 0;
			transform: scale(0.4);
		}
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
	}
	@keyframes drift-a {
		to {
			transform: translate(7px, -8px);
		}
	}
	@keyframes drift-b {
		to {
			transform: translate(-6px, 8px);
		}
	}
</style>
