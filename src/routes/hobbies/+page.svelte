<script lang="ts">
	import { albums } from '$lib/content/hobbies';
	import { resolveLocalized } from '$lib/content/schema';
	import { getLocale } from '$lib/paraglide/runtime';
	import Video from '$lib/content/Video.svelte';
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

	/* ---- Decorative observation-log fictions, seeded by media id ----------- */
	const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
	function coords(id: string): string {
		const s = seedOf(id);
		const raH = Math.floor(mix(s) * 24);
		const raM = Math.floor(mix(s + 1) * 60);
		const sign = mix(s + 2) < 0.5 ? '−' : '+';
		const decD = Math.floor(mix(s + 3) * 89);
		return `RA ${raH}h ${String(raM).padStart(2, '0')}m · DEC ${sign}${String(decD).padStart(2, '0')}°`;
	}
	const twinkleDelay = (id: string) => +(mix(seedOf(id) + 9) * 4).toFixed(2);
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
		<section id={album.slug} class="chart">
			<header class="chart-head">
				<span class="designation" aria-hidden="true">{ROMAN[ai] ?? String(ai + 1)}</span>
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

			<ol class="plates">
				{#each album.media as item, i (item.id)}
					{@const cap = item.caption ? resolveLocalized(item.caption, locale) : undefined}
					<li
						class="plate"
						class:flip={(ai + i) % 2 === 1}
						style={`--td:${twinkleDelay(item.id)}s`}
					>
						<span class="node" aria-hidden="true"></span>
						<figure>
							<div class="frame">
								{#if item.kind === 'video'}
									<Video
										video={{
											id: item.id,
											title: cap ?? item.id,
											provider: item.provider ?? 'file',
											src: item.src,
											poster: item.poster
										}}
									/>
								{:else}
									<img src={item.src} alt={cap ?? ''} loading="lazy" />
								{/if}
							</div>
							<figcaption>
								<span class="plate-id"
									>{item.kind === 'video' ? '▸' : '✶'} {ROMAN[ai] ?? String(ai + 1)}·{i + 1}</span
								>
								<span class="coords" aria-hidden="true">{coords(item.id)}</span>
								{#if cap}<span class="cap">{cap}</span>{/if}
							</figcaption>
						</figure>
					</li>
				{/each}
			</ol>
		</section>
	{/each}
</div>

<style>
	/* Widen the atlas so charts can straddle the meridian; text stays at measure. */
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
		margin: 0 0 4.5rem;
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

	/* ---- Plate column with the declination meridian (spine) --------------- */
	.plates {
		list-style: none;
		margin: 0;
		padding: 2.5rem 0 0.5rem;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 2.75rem;
	}
	.plates::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 1px;
		background-image: repeating-linear-gradient(
			to bottom,
			color-mix(in srgb, var(--cosmos-star, #cfe6ff) 30%, transparent) 0 6px,
			transparent 6px 14px
		);
		-webkit-mask-image: linear-gradient(to bottom, transparent, #000 2rem, #000 calc(100% - 2rem), transparent);
		mask-image: linear-gradient(to bottom, transparent, #000 2rem, #000 calc(100% - 2rem), transparent);
		animation: spine-drift 60s linear infinite;
	}
	@keyframes spine-drift {
		to {
			background-position: 0 140px;
		}
	}

	.plate {
		position: relative;
	}
	/* Connector: node on the spine → plate frame. */
	.plate::before {
		content: '';
		position: absolute;
		top: 1.5rem;
		left: 50%;
		width: 2.6rem;
		height: 1px;
		background: linear-gradient(
			to right,
			color-mix(in srgb, var(--cosmos-star, #cfe6ff) 60%, transparent),
			color-mix(in srgb, var(--cosmos-star, #cfe6ff) 14%, transparent)
		);
		opacity: 0.5;
		transition: opacity 200ms ease;
	}
	.plate.flip::before {
		left: auto;
		right: 50%;
		background: linear-gradient(
			to left,
			color-mix(in srgb, var(--cosmos-star, #cfe6ff) 60%, transparent),
			color-mix(in srgb, var(--cosmos-star, #cfe6ff) 14%, transparent)
		);
	}
	.plate:hover::before,
	.plate:focus-within::before {
		opacity: 1;
	}

	/* Twinkling star node pinned to the spine; 4-point glint blooms on hover. */
	.node {
		position: absolute;
		top: 1.5rem;
		left: 50%;
		width: 7px;
		height: 7px;
		margin: -3.5px 0 0 -3.5px;
		border-radius: 50%;
		background: var(--cosmos-star, #cfe6ff);
		box-shadow: 0 0 8px 1px color-mix(in srgb, var(--cosmos-star, #cfe6ff) 65%, transparent);
		animation: node-twinkle 4s ease-in-out infinite alternate;
		animation-delay: var(--td, 0s);
	}
	@keyframes node-twinkle {
		from {
			opacity: 0.45;
		}
		to {
			opacity: 1;
		}
	}
	.node::before,
	.node::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		border-radius: 1px;
		background: var(--cosmos-glint, #ff8ad9);
		transform: translate(-50%, -50%) scale(0);
		transition: transform 200ms ease;
	}
	.node::before {
		width: 1.5px;
		height: 22px;
	}
	.node::after {
		width: 22px;
		height: 1.5px;
	}
	.plate:hover .node::before,
	.plate:hover .node::after,
	.plate:focus-within .node::before,
	.plate:focus-within .node::after {
		transform: translate(-50%, -50%) scale(1);
	}

	/* Plates alternate sides of the meridian; figure floats up on hover. */
	.plate figure {
		margin: 0;
		width: calc(50% - 2.6rem);
		margin-left: auto;
		transition: transform 200ms ease;
	}
	.plate.flip figure {
		margin-left: 0;
		margin-right: auto;
	}
	.plate:hover figure,
	.plate:focus-within figure {
		transform: translateY(-2px);
	}

	/* Astrometric plate frame: hairline + corner ticks; decor glows through. */
	.frame {
		position: relative;
		padding: 0.55rem;
		border: 1px solid color-mix(in srgb, var(--cosmos-star, #cfe6ff) 35%, transparent);
		background: color-mix(in srgb, var(--hub-bg, #14143c) 78%, transparent);
		transition: border-color 200ms ease;
	}
	.plate:hover .frame,
	.plate:focus-within .frame {
		border-color: color-mix(in srgb, var(--cosmos-star, #cfe6ff) 70%, transparent);
	}
	.frame::before,
	.frame::after {
		content: '';
		position: absolute;
		width: 12px;
		height: 12px;
		border: 1px solid color-mix(in srgb, var(--accent, #7fd4ff) 85%, transparent);
		pointer-events: none;
	}
	.frame::before {
		top: -1px;
		left: -1px;
		border-right: 0;
		border-bottom: 0;
	}
	.frame::after {
		bottom: -1px;
		right: -1px;
		border-left: 0;
		border-top: 0;
	}
	.frame img {
		display: block;
		width: 100%;
		height: auto;
	}
	/* Video.svelte rounds its media; square it off inside the plate frame. */
	.frame :global(iframe),
	.frame :global(video) {
		border-radius: 0;
	}

	/* Caption block: log-entry voice. */
	figcaption {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.3rem 0.9rem;
		padding: 0.6rem 0.15rem 0;
	}
	.plate-id,
	.coords {
		font-size: var(--fs-small);
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--fg-muted);
		white-space: nowrap;
	}
	.plate-id {
		color: var(--accent, #7fd4ff);
	}
	.cap {
		flex-basis: 100%;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--fg);
		opacity: 0.88;
	}

	/* ---- Mobile: meridian becomes a left rail, plates go full-width -------- */
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
		.plates {
			gap: 2.25rem;
		}
		.plates::before {
			left: 0.45rem;
		}
		.node {
			left: 0.45rem;
		}
		.plate::before,
		.plate.flip::before {
			left: 0.45rem;
			right: auto;
			width: 1.6rem;
			background: linear-gradient(
				to right,
				color-mix(in srgb, var(--cosmos-star, #cfe6ff) 60%, transparent),
				color-mix(in srgb, var(--cosmos-star, #cfe6ff) 14%, transparent)
			);
		}
		.plate figure,
		.plate.flip figure {
			width: auto;
			margin: 0 0 0 2rem;
		}
		.coords {
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 100%;
		}
	}

	/* ---- Small phones: shallower rail indent so plates keep their width ---- */
	@media (max-width: 560px) {
		.plate::before,
		.plate.flip::before {
			width: 0.7rem;
		}
		.plate figure,
		.plate.flip figure {
			margin-left: 1rem;
		}
		.frame {
			padding: 0.4rem;
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
	}

	/* ---- Reduced motion: still sky, cues stay legible ---------------------- */
	@media (prefers-reduced-motion: reduce) {
		.plates::before,
		.node {
			animation: none;
		}
		.plate:hover figure,
		.plate:focus-within figure,
		.skymap a:hover,
		.skymap a:focus-visible {
			transform: none;
		}
		.node::before,
		.node::after {
			transition: none;
		}
	}
</style>
