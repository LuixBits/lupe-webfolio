<script lang="ts">
	import { projectsByCategory } from '$lib/content/projects';
	import { resolveLocalized, type Project } from '$lib/content/schema';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	const locale = getLocale();

	// BACKSTREET VIDEO — each category is a lit rental shelf, each project a tape.
	const shelves = [
		{ id: 'youtube', no: '01', label: m.nav_projects_youtube },
		{ id: 'opensource', no: '02', label: m.nav_projects_opensource },
		{ id: 'web', no: '03', label: m.nav_projects_web }
	] as const;
</script>

<svelte:head><title>{m.nav_projects()} — Lupe</title></svelte:head>

{#snippet tape(p: Project)}
	<li>
		<a class="tape" href={localizeHref(`/projects/${p.slug}`)}>
			<span class="spine" aria-hidden="true"></span>
			<div class="label">
				<h3>{resolveLocalized(p.title, locale)}</h3>
				<p>{resolveLocalized(p.tagline, locale)}</p>
			</div>
			<span class="window" aria-hidden="true"></span>
			<div class="stickers">
				{#each p.tags as t (t)}<span class="sticker">{t}</span>{/each}
				<span class="copy">© {p.year}</span>
			</div>
			{#if p.featured}<span class="holo">★ {m.projects_featured()}</span>{/if}
		</a>
	</li>
{/snippet}

<div class="page vhs">
	<header class="sign">
		<h1 class="neon">{m.nav_projects()}</h1>
		<p class="strap">{m.projects_intro()}</p>
	</header>

	{#each shelves as s (s.id)}
		{@const items = projectsByCategory(s.id)}
		<section id={s.id} class="section shelf-block">
			<h2 class="channel">
				<span class="ch">CH-{s.no}</span>
				{s.label()}
				<span class="rec" aria-hidden="true"></span>
			</h2>
			<ul class="shelf">
				{#each items as p (p.slug)}
					{@render tape(p)}
				{/each}
				<!-- Empty rental slots pad the last row out to the shelf's 4-up width
				     (only shown when 4 columns actually fit). -->
				{#each { length: (4 - (items.length % 4)) % 4 } as _, i (i)}
					<li class="slot" aria-hidden="true"></li>
				{/each}
			</ul>
			<div class="board" aria-hidden="true"></div>
		</section>
	{/each}
</div>

<style>
	/* Holo-sticker sheen angle (typed so it animates; static where unsupported). */
	@property --vhs-holo {
		syntax: '<angle>';
		inherits: false;
		initial-value: 210deg;
	}

	/* Use the dead right space at 1440px; decor edge bands (z6) stay under z10
	   content. Deep bottom padding keeps the last shelf clear of the bottom-left
	   docked wheel + corner scene haze on short viewports. */
	.page.vhs {
		max-width: clamp(46rem, 86vw, 62rem);
		padding-bottom: 7.5rem;
	}

	/* ---------- The neon storefront sign ---------- */
	.sign {
		text-align: center;
		margin: 0 0 3rem;
	}
	.neon {
		/* Reusable glow states (full / dim) so the keyframes stay readable. */
		--neon-full:
			0 0 6px rgba(255, 255, 255, 0.6),
			0 0 12px var(--accent),
			0 0 32px var(--accent),
			0 0 72px color-mix(in srgb, var(--accent) 55%, transparent),
			1px 1px 0 color-mix(in srgb, var(--sub-bg) 85%, transparent);
		--neon-dim:
			0 0 4px rgba(255, 255, 255, 0.4),
			0 0 9px color-mix(in srgb, var(--accent) 80%, transparent),
			0 0 24px color-mix(in srgb, var(--accent) 80%, transparent),
			0 0 54px color-mix(in srgb, var(--accent) 35%, transparent),
			1px 1px 0 color-mix(in srgb, var(--sub-bg) 65%, transparent);
		margin: 0 0 0.6rem;
		color: #fff;
		letter-spacing: 0.09em;
		/* Steady full glow: the reduced-motion + pre-animation + fallback state. */
		text-shadow: var(--neon-full);
	}
	.strap {
		margin: 0;
		font-size: 0.9rem;
		letter-spacing: 0.08em;
		color: var(--fg-muted);
	}

	/* ---------- Channel headers (override the global .section h2 rule) ---------- */
	.shelf-block .channel {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0 0 1.1rem;
		border-bottom: none;
		padding-bottom: 0;
	}
	.ch {
		font-family: var(--font-body);
		font-weight: 400;
		font-size: 0.7rem;
		letter-spacing: 0.14em;
		color: var(--sub-bg);
		background: color-mix(in srgb, var(--sub-bg) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--sub-bg) 45%, transparent);
		border-radius: 3px;
		padding: 0.1rem 0.5rem;
		transform: translateY(-0.1em);
	}
	.rec {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 8px var(--accent);
		opacity: 0.5;
	}

	/* ---------- The shelf of tapes ---------- */
	.shelf {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
		gap: 1.25rem;
	}
	.shelf li {
		display: block;
	}
	/* Empty rental slot — most tapes are out on loan tonight. Only rendered
	   visible when the shelf actually fits 4 columns (see media query below). */
	.shelf li.slot {
		display: none;
		aspect-ratio: 3 / 4;
		border-radius: 4px;
		border: 1px dashed color-mix(in srgb, var(--slice-bg) 38%, transparent);
		background: color-mix(in srgb, var(--slice-bg) 7%, transparent);
	}
	@media (min-width: 65rem) {
		.shelf li.slot {
			display: block;
		}
	}
	.tape {
		height: 100%;
		position: relative;
		display: grid;
		grid-template-columns: 9px 1fr;
		grid-template-rows: auto 1fr auto;
		aspect-ratio: 3 / 4;
		/* Boxy like a cassette, not the site's soft 12px cards. */
		border-radius: 4px;
		border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
		background: linear-gradient(
			160deg,
			color-mix(in srgb, var(--slice-bg) 30%, var(--bg)),
			var(--bg)
		);
		color: inherit;
		text-decoration: none;
		transition:
			transform 180ms ease-out,
			border-color 180ms ease-out,
			box-shadow 180ms ease-out;
	}
	/* Ribbed grip edge, like the spine of a VHS shell. */
	.spine {
		grid-column: 1;
		grid-row: 1 / 4;
		border-radius: 3px 0 0 3px;
		background: repeating-linear-gradient(
			180deg,
			color-mix(in srgb, var(--slice-bg) 65%, var(--bg)) 0 3px,
			color-mix(in srgb, var(--slice-bg) 22%, var(--bg)) 3px 8px
		);
		border-right: 1px solid color-mix(in srgb, var(--bg) 70%, transparent);
	}
	/* Paper label panel. */
	.label {
		grid-column: 2;
		grid-row: 1;
		align-self: start;
		margin: 1rem 0.85rem 0.5rem;
		padding: 0.55rem 0.65rem;
		background: color-mix(in srgb, var(--fg) 8%, transparent);
		border-radius: 3px;
	}
	.label h3 {
		margin: 0 0 0.3rem;
		font-size: var(--fs-h3);
		transition: text-shadow 180ms ease-out;
	}
	.label p {
		margin: 0;
		font-family: var(--font-body);
		font-size: 0.85rem;
		line-height: 1.45;
		color: var(--fg-muted);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	/* Cassette window: the two spools showing through the shell. */
	.window {
		grid-column: 2;
		grid-row: 2;
		align-self: center;
		height: 2.4rem;
		margin: 0 1.1rem;
		border-radius: 3px;
		border: 1px solid color-mix(in srgb, var(--slice-bg) 35%, transparent);
		background:
			radial-gradient(
				circle at 30% 50%,
				color-mix(in srgb, var(--fg) 30%, transparent) 0 3px,
				color-mix(in srgb, var(--slice-bg) 55%, var(--bg)) 3px 10px,
				transparent 10px
			),
			radial-gradient(
				circle at 70% 50%,
				color-mix(in srgb, var(--fg) 30%, transparent) 0 3px,
				color-mix(in srgb, var(--slice-bg) 55%, var(--bg)) 3px 10px,
				transparent 10px
			),
			color-mix(in srgb, var(--hub-bg) 78%, black);
	}
	/* Hand-slapped tag stickers + © imprint. */
	.stickers {
		grid-column: 2;
		grid-row: 3;
		margin: 0 0.85rem 0.8rem;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
	}
	.sticker {
		font-family: var(--font-body);
		font-size: 0.68rem;
		letter-spacing: 0.04em;
		padding: 0.1rem 0.5rem;
		border-radius: 3px;
	}
	.sticker:nth-of-type(3n + 1) {
		color: var(--sub-bg);
		background: color-mix(in srgb, var(--sub-bg) 16%, transparent);
		border: 1px solid color-mix(in srgb, var(--sub-bg) 45%, transparent);
		rotate: -2deg;
	}
	.sticker:nth-of-type(3n + 2) {
		color: var(--vapor-sun);
		background: color-mix(in srgb, var(--vapor-sun) 14%, transparent);
		border: 1px solid color-mix(in srgb, var(--vapor-sun) 45%, transparent);
		rotate: 2deg;
	}
	.sticker:nth-of-type(3n) {
		color: color-mix(in srgb, var(--accent) 75%, white);
		background: color-mix(in srgb, var(--accent) 16%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
		rotate: -1.5deg;
	}
	.copy {
		margin-left: auto;
		font-family: var(--font-body);
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		color: var(--vapor-sun);
	}
	/* Holographic "Featured" corner sticker, overhanging the shell. */
	.holo {
		position: absolute;
		top: -0.4rem;
		right: -0.4rem;
		padding: 0.16rem 0.45rem;
		font-family: var(--font-body);
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--hub-bg);
		background: conic-gradient(
			from var(--vhs-holo, 210deg),
			var(--vapor-sun),
			var(--accent),
			var(--sub-bg),
			var(--vapor-sun)
		);
		border-radius: 3px;
		rotate: 3deg;
		box-shadow: 0 2px 8px color-mix(in srgb, var(--accent) 45%, transparent);
	}

	/* Hover / focus: pull the tape off the shelf. */
	.tape:hover,
	.tape:focus-visible {
		border-color: color-mix(in srgb, var(--accent) 80%, transparent);
		box-shadow:
			0 14px 30px color-mix(in srgb, var(--accent) 28%, transparent),
			0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent);
	}
	.tape:hover .label h3,
	.tape:focus-visible .label h3 {
		text-shadow:
			-1px 0 0 var(--sub-bg),
			1px 0 0 var(--accent);
	}
	.tape:focus-visible {
		outline: 2px solid var(--sub-bg);
		outline-offset: 2px;
	}

	/* ---------- The lit shelf board (replaces the h2 underline) ---------- */
	.board {
		position: relative;
		height: 10px;
		border-radius: 2px;
		background: color-mix(in srgb, var(--hub-bg) 72%, var(--slice-bg));
		box-shadow:
			0 10px 26px color-mix(in srgb, var(--accent) 35%, transparent),
			0 3px 8px color-mix(in srgb, var(--vapor-sun) 22%, transparent);
	}
	.board::before {
		content: '';
		position: absolute;
		inset: 0 0 auto 0;
		height: 2px;
		border-radius: 2px 2px 0 0;
		background: linear-gradient(90deg, var(--vapor-sun), var(--accent));
	}

	/* ---------- Motion (stilled entirely under prefers-reduced-motion) ---------- */
	@media (prefers-reduced-motion: no-preference) {
		/* One-shot flicker-on lands just after the layout's 560ms drop-in,
		   then a slow hum varies the glow. */
		.neon {
			animation:
				neon-flicker 1.1s linear 0.5s both,
				neon-hum 6s ease-in-out 1.7s infinite alternate;
		}
		.rec {
			opacity: 1;
			animation: rec-blink 1.6s steps(2, jump-none) infinite;
		}
		.holo {
			animation: holo-spin 8s linear infinite;
		}
		.tape:hover,
		.tape:focus-visible {
			transform: translateY(-6px);
		}
	}
	@keyframes neon-flicker {
		0%,
		9% {
			opacity: 0.25;
			text-shadow: none;
		}
		10%,
		13% {
			opacity: 1;
			text-shadow: var(--neon-full);
		}
		14%,
		27% {
			opacity: 0.3;
			text-shadow: none;
		}
		28%,
		35% {
			opacity: 1;
			text-shadow: var(--neon-full);
		}
		36%,
		41% {
			opacity: 0.4;
			text-shadow: none;
		}
		42% {
			opacity: 1;
			text-shadow: var(--neon-dim);
		}
		100% {
			opacity: 1;
			text-shadow: var(--neon-full);
		}
	}
	@keyframes neon-hum {
		from {
			text-shadow: var(--neon-full);
		}
		to {
			text-shadow: var(--neon-dim);
		}
	}
	@keyframes rec-blink {
		from {
			opacity: 1;
		}
		to {
			opacity: 0.15;
		}
	}
	@keyframes holo-spin {
		to {
			--vhs-holo: 570deg;
		}
	}

	/* ---------- Mobile: tapes stacked as a pile of spines ---------- */
	@media (max-width: 40rem) {
		.shelf {
			grid-template-columns: 1fr;
			gap: 0.9rem;
		}
		.tape {
			aspect-ratio: auto;
			grid-template-columns: 1fr;
			grid-template-rows: 8px auto auto;
		}
		.spine {
			grid-column: 1;
			grid-row: 1;
			border-radius: 3px 3px 0 0;
			border-right: none;
			border-bottom: 1px solid color-mix(in srgb, var(--bg) 70%, transparent);
			background: repeating-linear-gradient(
				90deg,
				color-mix(in srgb, var(--slice-bg) 65%, var(--bg)) 0 3px,
				color-mix(in srgb, var(--slice-bg) 22%, var(--bg)) 3px 8px
			);
		}
		.label {
			grid-column: 1;
			grid-row: 2;
			margin: 0.7rem 0.8rem 0.45rem;
		}
		.label p {
			-webkit-line-clamp: 1;
			line-clamp: 1;
		}
		.window {
			display: none;
		}
		.stickers {
			grid-column: 1;
			grid-row: 3;
			margin: 0 0.8rem 0.7rem;
		}
		.holo {
			top: -0.35rem;
			right: 0.5rem;
		}
	}
</style>
