<script lang="ts">
	import { albums } from '$lib/content/hobbies';
	import { resolveLocalized } from '$lib/content/schema';
	import { getLocale } from '$lib/paraglide/runtime';
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import Eyepiece from '$lib/hobbies/Eyepiece.svelte';
	import * as m from '$lib/paraglide/messages';

	const locale = getLocale();

	/* ---- Deterministic pseudo-randoms (same pattern as CosmosScene) -------- */
	/** 0..1 hash — no Math.random anywhere; SSR and client render identically. */
	function mix(n: number): number {
		let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
		x ^= x >>> 13;
		x = Math.imul(x, 0xc2b2ae35);
		x ^= x >>> 16;
		return (x >>> 0) / 4294967296;
	}
	/** FNV-1a seed from a string (album slug / media id). */
	function seedOf(s: string): number {
		let h = 0x811c9dc5;
		for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
		return h >>> 0;
	}

	/* ---- Sky-map constellation glyphs (one per album, seeded by slug) ------ */
	type GlyphStar = { x: number; y: number; r: number; maj: boolean };
	function glyphFor(slug: string, count: number): GlyphStar[] {
		const seed = seedOf(slug);
		const n = Math.max(4, count + 2);
		// "Major" stars = the logged media items, spread evenly along the figure.
		const majIdx = new Set(
			Array.from({ length: Math.min(count, n) }, (_, k) => Math.floor(((k + 0.5) * n) / count))
		);
		const pts: GlyphStar[] = [];
		for (let i = 0; i < n; i++) {
			const x = 8 + (48 * i) / (n - 1) + (mix(seed + i * 7) - 0.5) * 7;
			const y = 9 + 22 * mix(seed + i * 13);
			pts.push({
				x: +x.toFixed(1),
				y: +y.toFixed(1),
				r: majIdx.has(i) ? 2.2 : +(1.1 + 0.5 * mix(seed + i * 29)).toFixed(2),
				maj: majIdx.has(i)
			});
		}
		return pts;
	}
	const glyphs = albums.map((a) => glyphFor(a.slug, a.media.length));

	const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

	/* ---- Eyepiece open state lives in shallow-routing history state --------
	 *  pushState on open means the hardware/browser Back button closes the
	 *  dialog (popstate reverts page.state → component unmounts) instead of
	 *  leaving the page; Esc / ✕ / backdrop call history.back() for symmetry. */
	type EyeState = { album: string; index: number };
	const eye = $derived((page.state as { eyepiece?: EyeState }).eyepiece);
	const eyeAlbumIdx = $derived(eye ? albums.findIndex((a) => a.slug === eye.album) : -1);

	let trigger: HTMLElement | null = null;
	function openPlate(slug: string, index: number, e: MouseEvent) {
		trigger = e.currentTarget as HTMLElement;
		pushState('', { eyepiece: { album: slug, index } });
	}
	// Restore focus to the plate that opened the eyepiece once it closes.
	$effect(() => {
		if (!eye && trigger) {
			trigger.focus();
			trigger = null;
		}
	});
</script>

<svelte:head><title>{m.nav_hobbies()} — Lupe</title><meta name="description" content={m.meta_desc_hobbies()} /></svelte:head>

<div class="page page--atlas">
	<header class="atlas-head">
		<p class="eyebrow">{m.hobbies_eyebrow()}</p>
		<h1>{m.nav_hobbies()}</h1>

		<!-- In-world anchor nav mirroring the radial submenu's deep links. -->
		<nav class="skymap" aria-label={m.hobbies_skymap()}>
			{#each albums as album, ai (album.slug)}
				<a href={'#' + album.slug}>
					<svg viewBox="0 0 64 40" aria-hidden="true">
						<polyline class="gline" points={glyphs[ai].map((p) => `${p.x},${p.y}`).join(' ')} />
						{#each glyphs[ai] as p, gi (gi)}
							<circle class="gstar" class:maj={p.maj} cx={p.x} cy={p.y} r={p.r} />
						{/each}
					</svg>
					<span>{resolveLocalized(album.title, locale)}</span>
				</a>
			{/each}
		</nav>
	</header>

	{#each albums as album, ai (album.slug)}
		{@const imgs = album.media.filter((x) => x.kind === 'image').length}
		{@const vids = album.media.length - imgs}
		{@const desig = ROMAN[ai] ?? String(ai + 1)}
		<section id={album.slug} class="chart">
			<header class="chart-head">
				<span class="designation" aria-hidden="true">{desig}</span>
				<h2>{resolveLocalized(album.title, locale)}</h2>
				<p class="lead">{resolveLocalized(album.intro, locale)}</p>
				{#if album.media.length > 0}
					<p class="meta">
						{#if imgs > 0}<span>{m.hobbies_plates()} × {imgs}</span>{/if}
						{#if imgs > 0 && vids > 0}<span aria-hidden="true"> · </span>{/if}
						{#if vids > 0}<span>{m.hobbies_signals()} × {vids}</span>{/if}
					</p>
				{/if}
			</header>

			<!-- Contact sheet: the album's plates as a numbered archive grid. -->
			<ol class="archive">
				{#each album.media as item, i (item.id)}
					{@const cap = item.caption ? resolveLocalized(item.caption, locale) : undefined}
					<li class="cell" class:wide={item.featured}>
						<button
							type="button"
							class="plate"
							aria-label={`${m.eyepiece_open()} ${desig}·${i + 1}${cap ? ` — ${cap}` : ''}`}
							onclick={(e) => openPlate(album.slug, i, e)}
						>
							{#if item.kind === 'image' && item.image}
								<img
									src={item.image.thumb ?? item.image.src}
									width={item.image.width}
									height={item.image.height}
									alt=""
									style={`aspect-ratio: ${item.image.width} / ${item.image.height}`}
									loading={ai === 0 && i < 2 ? 'eager' : 'lazy'}
									decoding="async"
								/>
							{:else}
								<span class="signal" aria-hidden="true">
									<span class="tri">▸</span>
								</span>
							{/if}
							<span class="tag" aria-hidden="true">
								<span class="tag-star">{item.kind === 'video' ? '▸' : '✶'}</span>
								{desig}·{i + 1}
							</span>
						</button>
					</li>
				{/each}
			</ol>
		</section>
	{/each}
</div>

{#if eye && eyeAlbumIdx >= 0}
	<Eyepiece
		album={albums[eyeAlbumIdx]}
		designation={ROMAN[eyeAlbumIdx] ?? String(eyeAlbumIdx + 1)}
		start={eye.index}
		{locale}
		onclose={() => history.back()}
	/>
{/if}

<style>
	/* Widen the atlas so the archive grid breathes; text stays at measure. */
	.page--atlas {
		max-width: 64rem;
	}

	/* ---- Page head: log title + sky-map legend (top-left; wheel docks top-right) */
	.atlas-head {
		max-width: 46rem;
		margin-bottom: 3.25rem;
	}
	.atlas-head h1 {
		margin: 0 0 1rem;
	}
	.skymap {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.skymap a {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		/* Chips may shrink below their label's width on narrow phones … */
		min-width: 0;
		max-width: 100%;
		padding: 0.45rem 0.95rem 0.45rem 0.55rem;
		border: 1px solid color-mix(in srgb, var(--cosmos-star, #cfe6ff) 28%, transparent);
		background: color-mix(in srgb, var(--hub-bg, #14143c) 55%, transparent);
		color: var(--fg-muted);
		text-decoration: none;
		transition:
			border-color 200ms ease,
			color 200ms ease,
			transform 200ms ease;
	}
	.skymap a:hover,
	.skymap a:focus-visible {
		border-color: color-mix(in srgb, var(--accent, #7fd4ff) 80%, transparent);
		color: var(--fg);
		transform: translateY(-2px);
	}
	.skymap svg {
		width: 3.5rem;
		height: 2.2rem;
		display: block;
		flex: none;
	}
	.skymap .gline {
		fill: none;
		stroke: color-mix(in srgb, var(--cosmos-star, #cfe6ff) 45%, transparent);
		stroke-width: 0.7;
		stroke-linejoin: round;
	}
	.skymap .gstar {
		fill: var(--cosmos-star, #cfe6ff);
	}
	.skymap .gstar.maj {
		fill: var(--accent, #7fd4ff);
	}
	.skymap a span {
		/* … with the label ellipsizing rather than pushing past the viewport. */
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: var(--fs-small);
		text-transform: uppercase;
		letter-spacing: 0.14em;
	}

	/* ---- One chart per album --------------------------------------------- */
	.chart {
		scroll-margin-top: 6rem; /* anchored sections clear the fixed menu */
		margin: 0 0 4rem;
	}
	/* Meridian motif, turned divider between charts. */
	.chart + .chart::before {
		content: '';
		display: block;
		height: 1px;
		margin: 0 0 3.25rem;
		background-image: repeating-linear-gradient(
			to right,
			color-mix(in srgb, var(--cosmos-star, #cfe6ff) 32%, transparent) 0 6px,
			transparent 6px 14px
		);
		-webkit-mask-image: linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
		mask-image: linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
	}
	.chart-head {
		position: relative;
		max-width: 46rem;
		padding-left: 4.1rem;
	}
	.designation {
		position: absolute;
		left: 0;
		top: 0.1rem;
		display: grid;
		place-items: center;
		width: 2.7rem;
		height: 2.7rem;
		border: 1px solid color-mix(in srgb, var(--cosmos-star, #cfe6ff) 35%, transparent);
		background: color-mix(in srgb, var(--hub-bg, #14143c) 60%, transparent);
		font-family: var(--font-display, inherit);
		font-weight: 700;
		font-size: 1.3rem;
		line-height: 1;
		color: color-mix(in srgb, var(--cosmos-star, #cfe6ff) 75%, transparent);
		letter-spacing: 0.06em;
		user-select: none;
	}
	/* Corner tick echoing the plate frames. */
	.designation::before {
		content: '';
		position: absolute;
		top: -1px;
		left: -1px;
		width: 8px;
		height: 8px;
		border: 1px solid color-mix(in srgb, var(--accent, #7fd4ff) 85%, transparent);
		border-right: 0;
		border-bottom: 0;
	}
	.chart-head h2 {
		font-size: var(--fs-h2);
		margin: 0 0 0.5rem;
	}
	.chart-head .lead {
		margin: 0 0 0.55rem;
	}
	.meta {
		margin: 0;
		font-size: var(--fs-small);
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--fg-muted);
	}
	/* Graduated survey rule under the head, fading out to the right. */
	.chart-head::after {
		content: '';
		display: block;
		height: 7px;
		margin-top: 1rem;
		background-image: repeating-linear-gradient(
			to right,
			color-mix(in srgb, var(--cosmos-star, #cfe6ff) 38%, transparent) 0 1px,
			transparent 1px 12px
		);
		-webkit-mask-image: linear-gradient(to right, #000 55%, transparent 100%);
		mask-image: linear-gradient(to right, #000 55%, transparent 100%);
	}

	/* ---- Archive contact sheet -------------------------------------------- */
	.archive {
		list-style: none;
		margin: 0;
		padding: 1.5rem 0 0.25rem;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.55rem;
	}
	.cell.wide {
		grid-column: span 2;
	}

	/* One plate = one ≥44px tap target; whole frame is the button. */
	.plate {
		position: relative;
		display: block;
		width: 100%;
		margin: 0;
		padding: 0.35rem;
		border: 1px solid color-mix(in srgb, var(--cosmos-star, #cfe6ff) 32%, transparent);
		background: color-mix(in srgb, var(--hub-bg, #14143c) 78%, transparent);
		cursor: pointer;
		font: inherit;
		color: inherit;
		text-align: left;
		transition:
			border-color 200ms ease,
			transform 200ms ease;
	}
	.plate:hover,
	.plate:focus-visible {
		border-color: color-mix(in srgb, var(--cosmos-star, #cfe6ff) 70%, transparent);
		transform: translateY(-2px);
	}
	/* Astrometric corner ticks; they grow on hover/focus (8 → 12px). */
	.plate::before,
	.plate::after {
		content: '';
		position: absolute;
		width: 8px;
		height: 8px;
		border: 1px solid color-mix(in srgb, var(--accent, #7fd4ff) 85%, transparent);
		pointer-events: none;
		transition:
			width 200ms ease,
			height 200ms ease;
	}
	.plate::before {
		top: -1px;
		left: -1px;
		border-right: 0;
		border-bottom: 0;
	}
	.plate::after {
		bottom: -1px;
		right: -1px;
		border-left: 0;
		border-top: 0;
	}
	.plate:hover::before,
	.plate:hover::after,
	.plate:focus-visible::before,
	.plate:focus-visible::after {
		width: 12px;
		height: 12px;
	}
	.plate img {
		display: block;
		width: 100%;
		height: auto;
	}

	/* Video cells: a dark signal plate — nothing loads until the eyepiece tap. */
	.signal {
		display: grid;
		place-items: center;
		width: 100%;
		aspect-ratio: 8 / 5;
		background:
			radial-gradient(60% 75% at 50% 38%, color-mix(in srgb, var(--accent, #7fd4ff) 10%, transparent), transparent 72%),
			color-mix(in srgb, var(--hub-bg, #14143c) 55%, #000);
	}
	.signal .tri {
		display: grid;
		place-items: center;
		width: 2.6rem;
		height: 2.6rem;
		padding-left: 0.2rem;
		border: 1px solid color-mix(in srgb, var(--accent, #7fd4ff) 70%, transparent);
		border-radius: 50%;
		font-size: 1.15rem;
		line-height: 1;
		color: var(--accent, #7fd4ff);
	}

	/* Plate number, printed in the frame's lower-left corner. */
	.tag {
		position: absolute;
		left: 0.65rem;
		bottom: 0.65rem;
		padding: 0.14rem 0.42rem;
		background: color-mix(in srgb, var(--hub-bg, #14143c) 40%, rgba(0, 0, 0, 0.55));
		font-size: var(--fs-small);
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: var(--cosmos-star, #cfe6ff);
		white-space: nowrap;
	}
	.tag-star {
		color: var(--accent, #7fd4ff);
	}

	/* ---- Wider screens ----------------------------------------------------- */
	@media (min-width: 720px) {
		.archive {
			grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
			grid-auto-flow: dense;
			gap: 0.8rem;
		}
		/* Featured plates take a 2×2 block; neighbours pack around them. */
		.cell.wide {
			grid-row: span 2;
		}
		.cell.wide .plate {
			height: 100%;
			display: flex;
			flex-direction: column;
		}
		.cell.wide .plate img {
			flex: 1;
			min-height: 0;
			object-fit: cover;
		}
	}

	/* ---- Mobile head tweaks ------------------------------------------------ */
	@media (max-width: 720px) {
		.atlas-head {
			margin-bottom: 2.5rem;
		}
		.skymap a {
			padding: 0.35rem 0.75rem 0.35rem 0.45rem;
		}
		.skymap svg {
			width: 2.9rem;
			height: 1.85rem;
		}
		.chart-head {
			padding-left: 3rem;
		}
		.designation {
			width: 2.2rem;
			height: 2.2rem;
			font-size: 1.05rem;
		}
	}

	/* ---- Narrowest phones: quieter chip tracking so long labels fit -------- */
	@media (max-width: 360px) {
		.skymap a {
			padding-right: 0.6rem;
		}
		.skymap a span {
			letter-spacing: 0.08em;
		}
		.archive {
			gap: 0.45rem;
		}
	}

	/* ---- Reduced motion: still sky, cues stay legible ---------------------- */
	@media (prefers-reduced-motion: reduce) {
		.plate,
		.plate::before,
		.plate::after,
		.skymap a {
			transition: none;
		}
		.plate:hover,
		.plate:focus-visible,
		.skymap a:hover,
		.skymap a:focus-visible {
			transform: none;
		}
	}
</style>
