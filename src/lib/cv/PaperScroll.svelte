<script lang="ts">
	/** Kakemono scroll reader — a full research paper as a hanging scroll:
	 *  cord + wooden rod up top, washi paper column with brocade bands, hanko
	 *  stamps for the artefact links, and a sticky bottom roller the paper
	 *  appears to unroll from as you scroll (pure position:sticky — no JS,
	 *  reduced-motion safe). Washi palette is page-local (paper is paper in a
	 *  light world). */
	import { resolveLocalized, type Figure, type Project } from '$lib/content/schema';
	import { about } from '$lib/content/about';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import Hanko from './Hanko.svelte';

	let { project, backHref }: { project: Project; backHref: string } = $props();

	const locale = getLocale();
	const uid = $props.id();
	const paper = $derived(project.paper!);

	const paras = (s: string) =>
		s
			.split(/\n{2,}/)
			.map((p) => p.trim())
			.filter(Boolean);

	const figById = $derived(new Map(paper.figures.map((f) => [f.id, f])));
	/** Figure numbers in placement order: section placements first, then any
	 *  figure no section references (rendered after the last section). */
	const figNo = $derived.by(() => {
		const order = new Map<string, number>();
		let n = 1;
		for (const s of paper.sections)
			for (const id of s.figures) if (figById.has(id) && !order.has(id)) order.set(id, n++);
		for (const f of paper.figures) if (!order.has(f.id)) order.set(f.id, n++);
		return order;
	});
	const unplaced = $derived(
		paper.figures.filter((f) => !paper.sections.some((s) => s.figures.includes(f.id)))
	);

	const HANKO_TILTS = [-2, 1.6, -1.2, 2.1];
	const linkHankos = $derived(
		[
			{ key: 'pdf', href: paper.links.pdf, glyph: 'PDF', label: m.paper_links_pdf() },
			{ key: 'doi', href: paper.links.doi, glyph: 'DOI', label: m.paper_links_doi() },
			{ key: 'code', href: paper.links.code, glyph: '{ }', label: m.paper_links_code() },
			{ key: 'talk', href: paper.links.talk, glyph: '▶︎', label: m.paper_links_talk() }
		].filter((l) => l.href)
	);

	// BibTeX copy — progressive enhancement: the <pre> below stays selectable
	// when the clipboard API is unavailable. SSR-safe (runs only on click).
	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;
	async function copyBibtex() {
		if (!paper.bibtex) return;
		try {
			await navigator.clipboard.writeText(paper.bibtex);
			copied = true;
			clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = false), 1600);
		} catch {
			/* no clipboard — the packet's <pre> is the fallback */
		}
	}
	$effect(() => () => clearTimeout(copyTimer));
</script>

<svelte:head>
	<title>{resolveLocalized(project.title, locale)} — Lupe</title>
</svelte:head>

{#snippet woodblock(f: Figure)}
	<figure class="woodblock">
		<img
			src={f.image.src}
			width={f.image.width}
			height={f.image.height}
			alt={resolveLocalized(f.image.alt, locale)}
			loading="lazy"
			decoding="async"
			style="aspect-ratio: {f.image.width} / {f.image.height}"
		/>
		<figcaption>
			<span class="fig-seal">{m.paper_fig()} {figNo.get(f.id)}</span>
			{#if f.caption}{resolveLocalized(f.caption, locale)}{/if}
		</figcaption>
	</figure>
{/snippet}

<article class="page scrollwrap">
	<!-- shared defs: the seigaiha pattern the brocade bands reference -->
	<svg class="defs" aria-hidden="true" focusable="false">
		<defs>
			<g id="{uid}-fan">
				<circle r="22" class="sg-fill" />
				<circle r="22" class="sg-ring" fill="none" />
				<circle r="16.5" class="sg-ring" fill="none" />
				<circle r="11" class="sg-ring" fill="none" />
				<circle r="5.5" class="sg-ring" fill="none" />
			</g>
			<pattern id="{uid}-sg" width="44" height="22" patternUnits="userSpaceOnUse">
				<use href="#{uid}-fan" x="22" y="33" />
				<use href="#{uid}-fan" x="0" y="22" />
				<use href="#{uid}-fan" x="44" y="22" />
				<use href="#{uid}-fan" x="22" y="11" />
				<use href="#{uid}-fan" x="0" y="0" />
				<use href="#{uid}-fan" x="44" y="0" />
				<use href="#{uid}-fan" x="22" y="-11" />
			</pattern>
		</defs>
	</svg>

	<!-- the one exit: back to the pond -->
	<a class="back" href={localizeHref(backHref)}>← {m.paper_back()}</a>

	<!-- cord, knot and top rod the scroll hangs from -->
	<div class="hang" aria-hidden="true">
		<svg class="torii-mini" viewBox="0 0 140 120">
			<path class="t-main" d="M25.6 24L34.4 24L29.2 118L19.4 118Z" />
			<path class="t-main" d="M105.6 24L114.4 24L120.6 118L110.8 118Z" />
			<path class="t-main" d="M66.4 24.5H73.6V47H66.4Z" />
			<path class="t-main" d="M7.5 47H132.5V55.5H7.5Z" />
			<path class="t-dark" d="M10.5 15.5H129.5V24.5H10.5Z" />
			<path class="t-dark" d="M1 2C36 9 104 9 139 2L136.5 14.5C104 20 36 20 3.5 14.5Z" />
		</svg>
		<svg class="cord" viewBox="0 0 160 46">
			<line x1="80" y1="0" x2="80" y2="7" />
			<path d="M10 44 L80 8 L150 44" fill="none" />
			<circle cx="80" cy="8" r="3.4" class="knot" />
		</svg>
		<div class="rod"></div>
	</div>

	<div class="paper">
		<div class="brocade brocade--top" aria-hidden="true">
			<svg><rect x="-44" y="-4" width="200%" height="200%" fill="url(#{uid}-sg)" /></svg>
		</div>

		<div class="pbody">
			<header class="phead">
				<h1>{resolveLocalized(project.title, locale)}</h1>
				<p class="authors">
					{#each paper.authors as a, i (a)}
						{#if i > 0}<span class="adot">·</span>{/if}
						{#if a === about.name}<strong>{a}</strong>{:else}<span>{a}</span>{/if}
					{/each}
				</p>
				<p class="venue">{resolveLocalized(paper.venue, locale)} · {project.year}</p>
				{#if paper.status === 'sample'}
					<p class="sample-note">{m.paper_sample_note()}</p>
				{/if}
			</header>

			{#if linkHankos.length || paper.bibtex}
				<div class="hanko-row">
					{#each linkHankos as l, i (l.key)}
						<Hanko
							glyph={l.glyph}
							label={l.label}
							href={l.href}
							tilt={HANKO_TILTS[i % HANKO_TILTS.length]}
						/>
					{/each}
					{#if paper.bibtex}
						<Hanko
							glyph={copied ? '✓' : 'BIB'}
							label={copied ? m.paper_copied() : m.paper_cite()}
							onclick={copyBibtex}
							tilt={1.2}
						/>
					{/if}
					<span class="sr" aria-live="polite">{copied ? m.paper_copied() : ''}</span>
				</div>
			{/if}

			<section class="psec">
				<h2 class="peyebrow">
					<span class="stick" aria-hidden="true">{m.paper_abstract()}</span>{m.paper_abstract()}
				</h2>
				{#each paras(resolveLocalized(paper.abstract, locale)) as p (p)}
					<p class="prose prose--lead">{p}</p>
				{/each}
			</section>

			{#each paper.sections as s (s.id)}
				<section class="psec">
					<h2>
						<span class="stick" aria-hidden="true">{resolveLocalized(s.heading, locale)}</span
						>{resolveLocalized(s.heading, locale)}
					</h2>
					{#each paras(resolveLocalized(s.body, locale)) as p (p)}
						<p class="prose">{p}</p>
					{/each}
					{#each s.figures as fid (fid)}
						{#if figById.has(fid)}{@render woodblock(figById.get(fid)!)}{/if}
					{/each}
				</section>
			{/each}

			{#each unplaced as f (f.id)}
				{@render woodblock(f)}
			{/each}

			{#if paper.results.length}
				<section class="psec">
					<h2 class="peyebrow">
						<span class="stick" aria-hidden="true">{m.paper_results()}</span>{m.paper_results()}
					</h2>
					<ul class="pebbles">
						{#each paper.results as r (r.value)}
							<li>
								<span class="rvalue">{r.value}</span>
								<span class="rlabel">{resolveLocalized(r.label, locale)}</span>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			{#if paper.bibtex}
				<details class="cite-packet">
					<summary><span class="tab">BibTeX</span></summary>
					<pre>{paper.bibtex}</pre>
					<button type="button" class="copy" onclick={copyBibtex}>
						{copied ? m.paper_copied() : m.paper_copy()}
					</button>
				</details>
			{/if}
		</div>

		<div class="brocade brocade--bottom" aria-hidden="true">
			<svg><rect x="-44" y="-4" width="200%" height="200%" fill="url(#{uid}-sg)" /></svg>
		</div>
	</div>

	<!-- the bottom roller: sticky at the viewport bottom, so the paper reads
	     as unrolling out of it; settles into place at the scroll's end -->
	<div class="roller" aria-hidden="true">
		<div class="curl"></div>
		<div class="bulge"></div>
		<div class="rod rod--roller"></div>
	</div>
</article>

<style>
	.scrollwrap {
		/* washi palette — page-local by design (paper is paper in a light world) */
		--paper: #f5efdf;
		--ink: #2c241b;
		--ink-muted: #6b5f4d;
		--seal: #c43f2a;
		--wood-hi: #6a4c37;
		--wood-lo: #382718;
		--overhang: clamp(0.5rem, 2vw, 1.15rem);
		--ppad: clamp(1.05rem, 5vw, 2.75rem);
		position: relative;
	}
	.defs {
		position: absolute;
		width: 0;
		height: 0;
		overflow: hidden;
	}
	.sg-fill {
		/* same as the brocade base — each fan row occludes the row behind it */
		fill: color-mix(in srgb, #2b9cba 38%, #23343a);
	}
	.sg-ring {
		stroke: var(--paper);
		stroke-opacity: 0.32;
		stroke-width: 1.3;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* ---- cord + rods ------------------------------------------------------ */
	.hang {
		position: relative;
		margin: 0.4rem calc(-1 * var(--overhang)) -0.4rem;
		z-index: 2;
	}
	.cord {
		display: block;
		width: clamp(7rem, 34vw, 10rem);
		height: auto;
		margin: 0 auto -0.2rem;
	}
	.cord line,
	.cord path {
		stroke: color-mix(in srgb, var(--ink) 72%, var(--seal));
		stroke-width: 2.4;
		stroke-linecap: round;
	}
	.cord .knot {
		fill: color-mix(in srgb, var(--ink) 72%, var(--seal));
		stroke: none;
	}
	.rod {
		position: relative;
		height: 0.85rem;
		border-radius: 999px;
		background: linear-gradient(var(--wood-hi), var(--wood-lo) 72%);
		box-shadow: 0 2px 4px color-mix(in srgb, var(--ink) 28%, transparent);
	}
	.rod::before,
	.rod::after {
		/* round finials proud of the rod ends */
		content: '';
		position: absolute;
		top: 50%;
		width: 1.05rem;
		height: 1.05rem;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 30%, var(--wood-hi), var(--wood-lo) 75%);
		transform: translateY(-50%);
	}
	.rod::before {
		left: -0.45rem;
	}
	.rod::after {
		right: -0.45rem;
	}
	.torii-mini {
		display: none;
	}

	/* ---- the paper -------------------------------------------------------- */
	.paper {
		position: relative;
		z-index: 1;
		background:
			repeating-linear-gradient(
				0deg,
				transparent 0 13px,
				color-mix(in srgb, var(--ink) 2%, transparent) 13px 14px
			),
			var(--paper);
		color: var(--ink);
		border-inline: 1px solid color-mix(in srgb, var(--ink) 14%, transparent);
		box-shadow: 0 1.4rem 2.6rem -1.4rem color-mix(in srgb, #0d3b47 55%, transparent);
	}
	.brocade {
		height: 2.1rem;
		background: color-mix(in srgb, #2b9cba 38%, #23343a);
		border-block: 1px solid color-mix(in srgb, var(--ink) 42%, transparent);
		overflow: hidden;
	}
	.brocade svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	.brocade--bottom {
		height: 1.6rem;
	}

	.pbody {
		padding: 1.7rem var(--ppad) 2.6rem;
	}

	/* ---- header ----------------------------------------------------------- */
	.phead h1 {
		font-size: clamp(1.45rem, 4.6vw, 2.05rem);
		line-height: 1.18;
		margin: 0 0 0.8rem;
		color: var(--ink);
	}
	.authors {
		margin: 0 0 0.2rem;
		font-size: 0.95rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 0.45rem;
	}
	.authors strong {
		font-weight: 700;
	}
	.adot {
		color: var(--ink-muted);
	}
	.venue {
		margin: 0;
		font-family: var(--font-display);
		font-style: italic;
		font-size: 0.98rem;
		color: var(--ink-muted);
	}
	.sample-note {
		margin: 0.55rem 0 0;
		font-size: 0.82rem;
		font-style: italic;
		color: var(--ink-muted);
		border-left: 3px solid color-mix(in srgb, var(--seal) 55%, transparent);
		padding-left: 0.55rem;
	}

	/* ---- hanko row -------------------------------------------------------- */
	.hanko-row {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 0.4rem 0.5rem;
		margin: 1.35rem 0 0.3rem;
		padding-top: 1.15rem;
		border-top: 1px solid color-mix(in srgb, var(--ink) 16%, transparent);
	}

	/* ---- sections --------------------------------------------------------- */
	.psec {
		margin-top: 2.1rem;
	}
	.psec h2 {
		position: relative;
		font-size: 1.22rem;
		font-weight: 600;
		line-height: 1.25;
		margin: 0 0 0.65rem;
		color: var(--ink);
	}
	.psec h2::before {
		/* small vermilion brush-tick */
		content: '';
		display: inline-block;
		width: 0.95rem;
		height: 0.3rem;
		margin-right: 0.5rem;
		background: var(--seal);
		border-radius: 999px 2px 999px 2px;
		transform: rotate(-4deg) translateY(-0.14em);
		opacity: 0.85;
	}
	.psec h2.peyebrow {
		font-family: var(--font-body);
		font-size: 0.74rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.28em;
		color: var(--ink-muted);
	}
	.psec h2.peyebrow::before {
		width: 0.7rem;
		height: 0.26rem;
	}
	.prose {
		margin: 0 0 1rem;
		font-size: 1.02rem;
		line-height: 1.68;
	}
	.prose--lead {
		font-size: 1.06rem;
	}
	.prose:last-child {
		margin-bottom: 0;
	}

	/* the left selvage: section labels floating on the pond (desktop only) */
	.stick {
		display: none;
	}

	/* ---- figures ---------------------------------------------------------- */
	.woodblock {
		margin: 1.5rem 0 1.9rem;
	}
	.woodblock:last-child {
		margin-bottom: 0;
	}
	.woodblock img {
		display: block;
		width: 100%;
		height: auto;
		border: 3px double color-mix(in srgb, var(--ink) 62%, transparent);
		background: var(--paper);
	}
	.woodblock figcaption {
		margin-top: 0.5rem;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--ink-muted);
	}
	.fig-seal {
		display: inline-block;
		margin-right: 0.45rem;
		padding: 0 0.32rem;
		border: 1px solid color-mix(in srgb, var(--seal) 55%, transparent);
		border-radius: 2px;
		color: var(--seal);
		font-weight: 700;
		font-size: 0.76rem;
		letter-spacing: 0.05em;
	}

	/* ---- stat pebbles ------------------------------------------------------ */
	.pebbles {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem;
	}
	.pebbles li {
		padding: 0.85rem 0.9rem 0.75rem;
		text-align: center;
		background: color-mix(in srgb, var(--ink) 4%, var(--paper));
		border: 1px solid color-mix(in srgb, var(--ink) 18%, transparent);
		border-radius: 1.3rem 1.5rem 1.4rem 1.6rem;
	}
	.rvalue {
		display: block;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.5rem;
		line-height: 1.15;
	}
	.rlabel {
		font-size: 0.78rem;
		color: var(--ink-muted);
	}

	/* ---- cite packet ------------------------------------------------------- */
	.cite-packet {
		margin-top: 2.2rem;
	}
	.cite-packet summary {
		list-style: none;
		display: inline-block;
		cursor: pointer;
	}
	.cite-packet summary::-webkit-details-marker {
		display: none;
	}
	.tab {
		/* folded-corner washi tab */
		display: inline-block;
		padding: 0.62rem 1.05rem 0.58rem;
		background: color-mix(in srgb, var(--ink) 6%, var(--paper));
		border: 1px solid color-mix(in srgb, var(--ink) 26%, transparent);
		clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.06em;
	}
	.cite-packet summary::after {
		content: '▾\FE0E';
		margin-left: 0.4rem;
		color: var(--ink-muted);
		font-size: 0.85rem;
	}
	.cite-packet[open] summary::after {
		content: '▴\FE0E';
	}
	.cite-packet summary:hover .tab {
		border-color: color-mix(in srgb, var(--ink) 45%, transparent);
	}
	.cite-packet summary:focus-visible {
		outline: 2px solid var(--seal);
		outline-offset: 2px;
	}
	.cite-packet pre {
		margin: 0.7rem 0 0;
		padding: 0.9rem 1rem;
		background: color-mix(in srgb, var(--ink) 5%, var(--paper));
		border: 1px solid color-mix(in srgb, var(--ink) 20%, transparent);
		overflow-x: auto;
		font-family: ui-monospace, 'Cascadia Mono', 'Menlo', monospace;
		font-size: 0.8rem;
		line-height: 1.55;
	}
	.copy {
		margin-top: 0.65rem;
		min-height: 2.75rem;
		padding: 0.45rem 1rem;
		border: 1px solid color-mix(in srgb, var(--seal) 70%, transparent);
		border-radius: 4px;
		background: none;
		color: var(--seal);
		font: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
	}
	.copy:hover,
	.copy:focus-visible {
		background: color-mix(in srgb, var(--seal) 10%, transparent);
	}
	.copy:focus-visible {
		outline: 2px solid var(--seal);
		outline-offset: 2px;
	}

	/* ---- the sticky roller ------------------------------------------------- */
	.roller {
		position: sticky;
		bottom: 0;
		z-index: 4;
		margin-top: -1rem;
		pointer-events: none;
	}
	.curl {
		height: 0.85rem;
		background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--ink) 20%, transparent));
	}
	.bulge {
		height: 1.05rem;
		margin-bottom: -0.35rem;
		background:
			linear-gradient(
				to bottom,
				color-mix(in srgb, var(--ink) 10%, var(--paper)),
				var(--paper) 40%,
				color-mix(in srgb, var(--ink) 22%, var(--paper))
			);
		border: 1px solid color-mix(in srgb, var(--ink) 24%, transparent);
		border-radius: 999px;
		box-shadow: inset 0 -3px 0 color-mix(in srgb, var(--ink) 10%, transparent);
	}
	.rod--roller {
		margin-inline: calc(-1 * var(--overhang));
	}

	/* ---- desktop ----------------------------------------------------------- */
	@media (min-width: 980px) {
		.torii-mini {
			display: block;
			position: absolute;
			right: -3.4rem;
			bottom: -0.4rem;
			width: 5.2rem;
			height: auto;
			z-index: -1;
			opacity: 0.55;
		}
		.t-main {
			fill: #e04530;
		}
		.t-dark {
			fill: #c4321f;
		}
		.stick {
			display: block;
			position: absolute;
			top: 0.18em;
			right: calc(100% + var(--ppad) + 0.7rem);
			width: max-content;
			max-width: 8.5rem;
			text-align: right;
			font-family: var(--font-body);
			font-size: 0.66rem;
			font-weight: 600;
			font-style: normal;
			text-transform: uppercase;
			letter-spacing: 0.14em;
			line-height: 1.3;
			color: var(--fg-muted);
		}
		.stick::after {
			/* tick from the label toward the paper's selvage */
			content: '';
			position: absolute;
			left: calc(100% + 0.35rem);
			top: 0.55em;
			width: 0.6rem;
			height: 1px;
			background: color-mix(in srgb, var(--water-deep, #2b9cba) 55%, transparent);
		}
		.woodblock {
			margin-inline: -1.15rem;
		}
	}

	/* ---- narrow phones ------------------------------------------------------ */
	@media (max-width: 360px) {
		.pebbles {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	/* ---- motion (base state is the calm, hung tableau) ---------------------- */
	@media (prefers-reduced-motion: no-preference) {
		.hang {
			animation: hangBob 7s ease-in-out infinite alternate;
			will-change: transform;
		}
	}
	@keyframes hangBob {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(1.5px);
		}
	}
</style>
