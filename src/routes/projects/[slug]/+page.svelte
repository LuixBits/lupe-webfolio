<script lang="ts">
	// THE COUNTER TV — bespoke project detail for /projects: a CRT playback deck
	// on the rental counter plus the tape's printed sleeve sheet below/beside it.
	// (ProjectDetail.svelte remains untouched for the CV route.)
	import CounterTv from '$lib/projects/CounterTv.svelte';
	import { resolveLocalized } from '$lib/content/schema';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const locale = getLocale();

	const project = $derived(data.project);
	const title = $derived(resolveLocalized(project.title, locale));
	const tagline = $derived(resolveLocalized(project.tagline, locale));
	const body = $derived(resolveLocalized(project.body, locale));
	/* Sample marker: the authored base-locale body self-identifies stand-in
	   entries ("Sample entry — …"). Quiet note rendered on the sleeve; it
	   disappears the moment real copy replaces the sample text. */
	const isSample = $derived(/^sample/i.test(resolveLocalized(project.body, 'en')));

	/* Lending card: authored links plus the demo URL (deduped by URL). */
	const cardLinks = $derived.by(() => {
		const rows = project.links.map((l) => ({ label: l.label, url: l.url, rel: l.rel }));
		const demoUrl = project.demo?.url;
		if (demoUrl && !rows.some((r) => r.url === demoUrl)) {
			rows.unshift({ label: m.tv_open_full(), url: demoUrl, rel: 'demo' });
		}
		return rows;
	});
</script>

<svelte:head>
	<title>{title} — {m.nav_projects()} — Lupe</title>
	<meta name="description" content={tagline} />
</svelte:head>

<article class="page vhs-detail">
	<!-- The one exit: rewind this tape back to the shelf. -->
	<a class="rewind" href={localizeHref('/projects')}>
		<span class="rw-glyph" aria-hidden="true">◀◀</span>
		<span class="rw-word" aria-hidden="true">REWIND</span>
		<span class="rw-dest">{m.nav_projects()}</span>
	</a>

	<div class="counter">
		<div class="deckcol">
			<CounterTv {project} {locale} />
		</div>

		<section class="sleeve">
			<header class="masthead">
				<h1>{title}</h1>
				<p class="tagline">{tagline}</p>
			</header>

			<p class="printline">
				<span class="genre">
					{#each project.tags as t, i (t)}{#if i > 0}<span class="sep" aria-hidden="true">/</span
						>{/if}<span class="word">{t}</span>{/each}
				</span>
				<span class="copy">© {project.year}</span>
			</p>

			{#if isSample}
				<p class="sample">{m.tv_sample_note()}</p>
			{/if}

			<p class="synopsis">{body}</p>

			{#if project.stack.length}
				<section class="specs">
					<h2 class="boxhead">{m.tv_ch_specs()}</h2>
					<p class="specline">
						<span class="k">{m.tv_stack()}</span>
						<span class="v"
							>{#each project.stack as s, i (s)}{#if i > 0}<span class="sep" aria-hidden="true"
									>/</span
								>{/if}{s}{/each}</span
						>
					</p>
				</section>
			{/if}

			{#if cardLinks.length}
				<ul class="card">
					{#each cardLinks as l (l.url + l.label)}
						<li>
							<a href={l.url} target="_blank" rel="noopener">
								<span class="lbl">{l.label}</span>
								<span class="rel">{l.rel}</span>
								<span class="ext" aria-hidden="true">↗</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}

			{#if project.sources.length}
				<ul class="card srcs">
					{#each project.sources as s (s.id)}
						<li>
							<a href={s.url} target="_blank" rel="noopener">
								<span class="lbl"
									>{s.title}{#if s.author}&nbsp;— {s.author}{/if}{#if s.year}&nbsp;({s.year}){/if}</span
								>
								<span class="rel">{s.kind}</span>
								<span class="ext" aria-hidden="true">↗</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}

			<footer class="tail" aria-hidden="true">
				<span class="barcode"></span>
				<span class="serial">{project.slug.toUpperCase()} · {project.year}</span>
			</footer>
		</section>
	</div>
</article>

<style>
	/* Same widened column + deep bottom padding as the shelf page: the docked
	   wheel lives bottom-left on /projects, so nothing fixed sits there and the
	   page ends well clear of it. */
	.page.vhs-detail {
		max-width: clamp(46rem, 86vw, 62rem);
		padding-bottom: 7.5rem;
	}

	/* ---------- REWIND — the single exit, styled as a transport key ---------- */
	.rewind {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		min-height: 44px;
		margin: 0 0 1.4rem;
		padding: 0.4rem 0.95rem;
		border-radius: 5px;
		border: 1px solid color-mix(in srgb, black 50%, var(--slice-bg));
		border-bottom-color: black;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--slice-bg) 30%, var(--hub-bg)),
			color-mix(in srgb, var(--hub-bg) 82%, black) 80%
		);
		box-shadow:
			0 3px 0 color-mix(in srgb, black 70%, var(--hub-bg)),
			0 5px 10px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.12);
		font-family: var(--font-body);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--sub-bg);
	}
	.rw-glyph {
		color: var(--accent);
		text-shadow: 0 0 6px color-mix(in srgb, var(--accent) 70%, transparent);
	}
	.rw-dest {
		color: var(--fg-muted);
	}
	.rw-dest::before {
		content: '·';
		margin-right: 0.55rem;
		color: color-mix(in srgb, var(--fg-muted) 55%, transparent);
	}
	.rewind:active {
		transform: translateY(3px);
		box-shadow:
			0 0 0 color-mix(in srgb, black 70%, var(--hub-bg)),
			inset 0 3px 7px rgba(0, 0, 0, 0.6);
	}
	.rewind:hover {
		color: var(--sub-active);
	}
	.rewind:focus-visible {
		outline: 2px solid var(--sub-bg);
		outline-offset: 2px;
	}

	/* ---------- Sleeve sheet: the printed rental insert ---------- */
	.sleeve {
		margin-top: 2rem;
		padding: 1.3rem 1.2rem 1.1rem;
		border-radius: 4px;
		border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
		background: linear-gradient(
			168deg,
			color-mix(in srgb, var(--slice-bg) 22%, var(--bg)),
			var(--bg) 62%
		);
	}
	.masthead h1 {
		margin: 0 0 0.35rem;
		font-size: clamp(1.5rem, 5vw, 2.2rem);
		text-shadow:
			-1px 0 0 var(--sub-bg),
			1px 0 0 var(--accent);
	}
	.tagline {
		margin: 0;
		font-size: 1.02rem;
		line-height: 1.5;
		color: var(--fg-muted);
	}
	.printline {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		margin: 1rem 0 0;
		padding: 0.45rem 0 0;
		border-top: 1px dashed color-mix(in srgb, var(--fg) 24%, transparent);
	}
	.genre {
		font-family: var(--font-body);
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--sub-bg);
	}
	.genre .word {
		white-space: nowrap;
	}
	.sep {
		margin: 0 0.35em;
		color: var(--accent);
		font-weight: 400;
	}
	.copy {
		margin-left: auto;
		font-family: var(--font-body);
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		color: var(--vapor-sun);
		white-space: nowrap;
	}
	/* Quiet sample-tape note — flat print, deliberately unglamorous. */
	.sample {
		margin: 0.9rem 0 0;
		padding-left: 0.65rem;
		border-left: 2px solid color-mix(in srgb, var(--vapor-sun) 55%, transparent);
		font-family: var(--font-body);
		font-size: 0.74rem;
		letter-spacing: 0.05em;
		color: var(--fg-muted);
	}
	.synopsis {
		margin: 1rem 0 0;
		line-height: 1.65;
	}

	/* SPECS box — dashed printed frame, plain text lines (no chips). */
	.specs {
		margin: 1.4rem 0 0;
		padding: 0.75rem 0.85rem 0.8rem;
		border: 1px dashed color-mix(in srgb, var(--sub-bg) 45%, transparent);
		border-radius: 3px;
	}
	.boxhead {
		margin: 0 0 0.4rem;
		border: 0;
		padding: 0;
		font-family: var(--font-body);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: var(--sub-bg);
	}
	.specline {
		margin: 0;
		font-family: var(--font-body);
		font-size: 0.82rem;
		line-height: 1.6;
	}
	.specline .k {
		display: block;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--fg-muted);
		margin-bottom: 0.15rem;
	}
	.specline .v {
		color: var(--fg);
	}

	/* Lending card — full-width ruled rows, like a library slip. */
	.card {
		list-style: none;
		margin: 1.4rem 0 0;
		padding: 0;
	}
	.card li + li {
		border-top: 1px dashed color-mix(in srgb, var(--fg) 18%, transparent);
	}
	.card li:first-child {
		border-top: 1px solid color-mix(in srgb, var(--fg) 26%, transparent);
	}
	.card li:last-child {
		border-bottom: 1px solid color-mix(in srgb, var(--fg) 26%, transparent);
	}
	.card a {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		min-height: 44px;
		padding: 0.6rem 0.15rem;
		text-decoration: none;
		color: var(--fg);
	}
	.card .lbl {
		font-family: var(--font-body);
		font-size: 0.88rem;
		font-weight: 700;
		letter-spacing: 0.04em;
	}
	.card .rel {
		font-family: var(--font-body);
		font-size: 0.62rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-muted);
	}
	.card .ext {
		margin-left: auto;
		color: var(--sub-bg);
	}
	.card a:hover .lbl,
	.card a:focus-visible .lbl {
		color: var(--accent);
	}
	.card a:focus-visible {
		outline: 2px solid var(--sub-bg);
		outline-offset: 2px;
	}
	.card.srcs {
		margin-top: 0.9rem;
	}
	.card.srcs .lbl {
		font-weight: 400;
		font-size: 0.8rem;
		color: var(--fg-muted);
	}

	/* Barcode tail — decorative print, serial is just slug + year. */
	.tail {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		margin-top: 1.5rem;
		padding-top: 0.8rem;
		border-top: 1px dashed color-mix(in srgb, var(--fg) 18%, transparent);
	}
	.barcode {
		width: 7.5rem;
		height: 1.6rem;
		background:
			repeating-linear-gradient(
				90deg,
				var(--fg) 0 2px,
				transparent 2px 5px,
				var(--fg) 5px 6px,
				transparent 6px 11px,
				var(--fg) 11px 14px,
				transparent 14px 16px
			);
		opacity: 0.75;
	}
	.serial {
		font-family: var(--font-body);
		font-size: 0.62rem;
		letter-spacing: 0.22em;
		color: var(--fg-muted);
	}

	/* ---------- Desktop: deck sticks left, sleeve reads right ---------- */
	@media (min-width: 65rem) {
		.counter {
			display: grid;
			grid-template-columns: 57% 1fr;
			gap: 2.4rem;
			align-items: start;
		}
		.deckcol {
			position: sticky;
			top: 5.5rem;
		}
		.sleeve {
			margin-top: 0;
		}
	}
</style>
