<script lang="ts">
	import { projectsByCategory } from '$lib/content/projects';
	import { resolveLocalized, type Project } from '$lib/content/schema';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import TapeArtwork from '$lib/projects/TapeArtwork.svelte';

	const locale = getLocale();

	// BACKSTREET VIDEO — each category is a lit rental shelf, each project a tape.
	const shelves = [
		{ id: 'youtube', label: m.nav_projects_youtube },
		{ id: 'opensource', label: m.nav_projects_opensource },
		{ id: 'web', label: m.nav_projects_web }
	] as const;
</script>

<svelte:head
	><title>{m.nav_projects()} — Lupe</title><meta
		name="description"
		content={m.meta_desc_projects()}
	/></svelte:head
>

{#snippet tape(p: Project)}
	<li>
		<a
			class="tape"
			id={`tape-${p.slug}`}
			data-project-tape={p.slug}
			href={localizeHref(`/projects/${p.slug}`)}
		>
			<span class="spine" aria-hidden="true"></span>
			<div class="label">
				<h3>{resolveLocalized(p.title, locale)}</h3>
				<p>{resolveLocalized(p.tagline, locale)}</p>
			</div>
			<span class="window" aria-hidden="true"
				><span class="artwork"><TapeArtwork project={p} /></span></span
			>
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
		<section
			id={s.id}
			class="section shelf-block"
			style:--shelf-light={s.id === 'opensource'
				? 'var(--sub-bg)'
				: s.id === 'web'
					? 'var(--vapor-sun)'
					: 'var(--accent)'}
		>
			<h2 class="channel">
				{s.label()}
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
	/* Use the dead right space at 1440px; decor edge bands (z6) stay under z10
	   content. Deep bottom padding keeps the last shelf clear of the bottom-left
	   docked wheel + corner scene haze on short viewports. */
	.page.vhs {
		max-width: clamp(46rem, 86vw, 62rem);
		padding-bottom: 7.5rem;
	}
	.shelf-block {
		position: relative;
		isolation: isolate;
	}
	.shelf-block::before {
		content: '';
		position: absolute;
		inset: 2rem -1.5rem -1rem;
		z-index: -1;
		background: radial-gradient(
			ellipse at 50% 95%,
			color-mix(in srgb, var(--shelf-light) 17%, transparent),
			transparent 70%
		);
		pointer-events: none;
	}

	/* ---------- The neon storefront sign ---------- */
	.sign {
		text-align: center;
		margin: 0 0 3rem;
	}
	.neon {
		/* Reusable glow states (full / dim) so the keyframes stay readable. */
		--neon-full:
			0 0 6px rgba(255, 255, 255, 0.6), 0 0 12px var(--accent), 0 0 32px var(--accent),
			0 0 72px color-mix(in srgb, var(--accent) 55%, transparent),
			1px 1px 0 color-mix(in srgb, var(--sub-bg) 85%, transparent);
		--neon-dim:
			0 0 4px rgba(255, 255, 255, 0.4), 0 0 9px color-mix(in srgb, var(--accent) 80%, transparent),
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
		font-size: var(--fs-body);
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
		display: grid;
	}
	/* Empty rental slot — most tapes are out on loan tonight. Only rendered
	   visible when the shelf actually fits 4 columns (see media query below). */
	.shelf li.slot {
		display: none;
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
		scroll-margin-top: 7rem;
		height: auto;
		min-height: 20rem;
		position: relative;
		display: grid;
		grid-template-columns: 9px 1fr;
		grid-template-rows: auto minmax(8rem, 1fr);
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
		box-shadow:
			5px 4px 0 color-mix(in srgb, var(--hub-bg) 90%, black),
			9px 12px 20px #0003,
			inset 1px 1px 0 #fff1;
		transition:
			transform 180ms ease-out,
			border-color 180ms ease-out,
			box-shadow 180ms ease-out;
	}
	/* Ribbed grip edge, like the spine of a VHS shell. */
	.spine {
		grid-column: 1;
		grid-row: 1 / 3;
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
		font-size: var(--fs-body);
		line-height: var(--lh-body);
		color: var(--fg-muted);
	}
	/* Each tape has its own cover art; the neon room stays visible around it. */
	.window {
		grid-column: 2;
		grid-row: 2;
		align-self: center;
		display: grid;
		place-items: center;
		height: 6.25rem;
		margin: 0.5rem 1.1rem;
		border-radius: 3px;
		border: 1px solid color-mix(in srgb, var(--shelf-light) 24%, transparent);
		background:
			radial-gradient(
				ellipse at 50% 70%,
				color-mix(in srgb, var(--shelf-light) 15%, transparent),
				transparent 80%
			),
			color-mix(in srgb, var(--hub-bg) 78%, black);
	}
	.artwork {
		width: 4.4rem;
		height: 4.4rem;
		color: var(--shelf-light);
		filter: drop-shadow(0 0 10px color-mix(in srgb, var(--shelf-light) 40%, transparent));
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
			0 10px 30px color-mix(in srgb, var(--shelf-light) 40%, transparent),
			0 3px 8px color-mix(in srgb, var(--vapor-sun) 22%, transparent);
	}
	.board::before {
		content: '';
		position: absolute;
		inset: 0 0 auto 0;
		height: 2px;
		border-radius: 2px 2px 0 0;
		background: linear-gradient(90deg, var(--vapor-sun), var(--accent));
		box-shadow: 0 0 9px var(--shelf-light);
	}
	.board::after {
		content: '';
		position: absolute;
		inset: 10px 2.5% auto;
		height: 8px;
		background: linear-gradient(
			90deg,
			var(--hub-bg) 0 8px,
			transparent 8px calc(100% - 8px),
			var(--hub-bg) calc(100% - 8px)
		);
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

	/* ---------- Mobile: tapes stacked as a pile of spines ---------- */
	@media (max-width: 40rem) {
		.shelf {
			grid-template-columns: 1fr;
			gap: 0.9rem;
		}
		.tape {
			min-height: 0;
			grid-template-columns: 1fr;
			grid-template-rows: 8px auto;
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
		.window {
			display: none;
		}
	}
</style>
