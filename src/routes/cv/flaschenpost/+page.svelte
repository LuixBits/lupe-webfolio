<script lang="ts">
	/** Die Flaschenpost — the pond bottle, opened. The corked bottle
	 *  stands beside its unrolled scroll (wooden dowels top and bottom),
	 *  which explains the download and offers the SAME CV printed once
	 *  per world of the site plus a plain sleeve: five little proof
	 *  prints, each a download once `cvPrints[].file` is set, a
	 *  "folgt — placeholder" chip until then. Static print, no motion
	 *  beyond the page's own entrance. */
	import { cvPrints } from '$lib/content/cv';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	const locale = getLocale();
	const t = (v: { en: string; de: string }) => (locale === 'de' ? v.de : v.en);
</script>

<svelte:head>
	<title>{m.cv_fpost_title()} — Lupe</title>
	<meta name="description" content={m.cv_fpost_lead()} />
</svelte:head>

{#snippet swatch(id: string)}
	<svg class="sw sw--{id}" viewBox="0 0 66 88" aria-hidden="true">
		<rect class="sw-page" x="1.5" y="1.5" width="63" height="85" rx="4" />
		{#if id === 'plain'}
			<rect class="pl-photo" x="8" y="9" width="14" height="16" rx="2" />
			<rect class="pl-name" x="27" y="11" width="30" height="4.5" rx="2" />
			<rect class="pl-line" x="27" y="19" width="22" height="3" rx="1.5" />
			{#each [34, 42, 50, 58, 66] as y (y)}
				<rect class="pl-line" x="8" {y} width="50" height="3" rx="1.5" />
			{/each}
			<rect class="pl-line" x="8" y="74" width="34" height="3" rx="1.5" />
		{:else if id === 'garden'}
			<path class="ga-stem" d="M 33 78 C 30 62 36 48 32 32 C 30 24 33 16 32 10" />
			<path class="ga-leaf" d="M 32 30 C 24 26 20 18 24 12 C 31 15 34 22 32 30 Z" />
			<path class="ga-leaf" d="M 33 50 C 41 46 45 38 41 32 C 34 35 31 42 33 50 Z" />
			<circle class="ga-seed" cx="33" cy="79" r="3" />
			{#each [64, 70] as y (y)}
				<rect class="ga-line" x="12" {y} width="18" height="2.4" rx="1.2" />
			{/each}
		{:else if id === 'water'}
			{#each [[16, 62], [33, 70], [50, 62]] as [cx, cy], i (i)}
				<g class="wa-fan">
					<circle {cx} {cy} r="14" />
					<circle {cx} {cy} r="10" />
					<circle {cx} {cy} r="6" />
				</g>
			{/each}
			<g transform="translate(33 20) rotate(-18)">
				<path class="wa-koi" d="M -9 0 C -6 -4.5 6 -4.5 10 0 C 6 4.5 -6 4.5 -9 0 Z" />
				<path class="wa-koi" d="M -9 0 L -14 -4 L -12.5 0 L -14 4 Z" />
				<circle class="wa-koi-patch" cx="3" cy="-1" r="2.6" />
				<circle class="wa-koi-patch" cx="-4" cy="1" r="1.7" />
			</g>
		{:else if id === 'vaporwave'}
			<circle class="vp-sun" cx="33" cy="30" r="15" />
			<rect class="vp-slit" x="18" y="30" width="30" height="2.4" />
			<rect class="vp-slit" x="20" y="36" width="26" height="2" />
			{#each [58, 66, 74] as y (y)}
				<path class="vp-grid" d="M 6 {y} H 60" />
			{/each}
			<path class="vp-grid" d="M 33 54 L 14 82 M 33 54 L 33 82 M 33 54 L 52 82" />
		{:else}
			{#each [[14, 16, 1.6], [46, 12, 1.1], [55, 30, 1.4], [22, 40, 1], [38, 56, 1.5], [12, 66, 1], [50, 72, 1.2]] as [cx, cy, r], i (i)}
				<circle class="co-star" {cx} {cy} {r} />
			{/each}
			<path class="co-glint" d="M 33 26 V 36 M 28 31 H 38" />
			<ellipse class="co-nebula" cx="46" cy="62" rx="12" ry="7" />
		{/if}
	</svg>
{/snippet}

<article class="page fpost">
	<a class="back" href={localizeHref('/cv')}>← {m.paper_back()}</a>

	<div class="fp-scene">
		<!-- the bottle, uncorked at last -->
		<svg class="fp-bottle" viewBox="0 0 240 360" aria-hidden="true">
			<ellipse class="fb-ripple" cx="120" cy="336" rx="86" ry="14" />
			<ellipse class="fb-ripple r2" cx="120" cy="336" rx="56" ry="9" />
			<g transform="rotate(-6 120 220)">
				<!-- cork -->
				<rect class="fb-cork" x="102" y="26" width="36" height="34" rx="6" />
				<path class="fb-cork-grain" d="M 108 34 H 132 M 108 44 H 132 M 108 52 H 132" />
				<!-- neck & body -->
				<path
					class="fb-glass"
					d="M 104 58 L 104 108 C 104 122 76 130 70 152 C 66 166 64 188 64 220 L 64 300 C 64 320 82 330 120 330 C 158 330 176 320 176 300 L 176 220 C 176 188 174 166 170 152 C 164 130 136 122 136 108 L 136 58 Q 120 52 104 58 Z"
				/>
				<!-- the rolled CV inside, tied in red -->
				<g transform="rotate(4 120 240)">
					<rect class="fb-roll" x="92" y="168" width="56" height="136" rx="12" />
					<ellipse class="fb-roll-end" cx="120" cy="170" rx="28" ry="9" />
					<ellipse class="fb-roll-spiral" cx="120" cy="170" rx="16" ry="5" />
					<ellipse class="fb-roll-spiral" cx="120" cy="170" rx="6" ry="2" />
					<path class="fb-tie" d="M 92 236 C 104 242 136 242 148 236" />
					<circle class="fb-tie-knot" cx="120" cy="240" r="3.4" />
				</g>
				<!-- cord at the neck -->
				<path
					class="fb-cord"
					d="M 102 96 C 114 102 126 102 138 96 M 102 103 C 114 109 126 109 138 103"
				/>
				<!-- glass shine -->
				<path class="fb-shine" d="M 84 160 C 78 190 76 240 80 286" />
				<path class="fb-shine s2" d="M 96 132 C 92 142 90 152 89 162" />
			</g>
		</svg>

		<!-- the scroll, unrolled -->
		<section class="fp-scroll">
			<i class="fp-dowel" aria-hidden="true"></i>
			<div class="fp-paper">
				<p class="eyebrow">{m.cv_fpost_eyebrow()}</p>
				<h1>{m.cv_fpost_title()}</h1>
				<p class="lead">{m.cv_fpost_lead()}</p>

				<ul class="fp-prints">
					{#each cvPrints as p (p.id)}
						<li class="print">
							{@render swatch(p.id)}
							<span class="print-label">{t(p.label)}</span>
							<span class="print-note">{t(p.note)}</span>
							{#if p.file}
								<a
									class="fp-dl"
									href={p.file}
									download
									aria-label="{t(p.label)} — {m.cv_pdf_label()}">PDF ↓</a
								>
							{:else}
								<span class="fp-soon">{m.cv_pdf_placeholder()}</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
			<i class="fp-dowel fp-dowel--btm" aria-hidden="true"></i>
		</section>
	</div>
</article>

<style>
	.fpost {
		max-width: 62rem;
		--paper: #f7f1de;
		--ink: #2c241b;
		--ink-muted: #6b5f4d;
		--seal: #c43f2a;
	}
	.back {
		display: inline-block;
		margin-bottom: 1.2rem;
		color: var(--fg-muted);
		text-decoration: none;
	}
	.back:hover {
		color: var(--accent);
	}

	.fp-scene {
		display: grid;
		grid-template-columns: minmax(150px, 220px) 1fr;
		gap: clamp(1rem, 3vw, 2.4rem);
		align-items: center;
	}
	.fp-bottle {
		width: 100%;
		height: auto;
	}

	/* ---- the bottle ---- */
	.fb-ripple {
		fill: none;
		stroke: rgba(43, 156, 186, 0.35);
		stroke-width: 1.6;
	}
	.fb-ripple.r2 {
		stroke-width: 1.2;
		opacity: 0.7;
	}
	.fb-glass {
		fill: rgba(205, 238, 246, 0.4);
		stroke: #6fa9bc;
		stroke-width: 2.4;
		stroke-linejoin: round;
	}
	.fb-cork {
		fill: #b98a5a;
		stroke: #7c5836;
		stroke-width: 1.8;
	}
	.fb-cork-grain {
		fill: none;
		stroke: #7c5836;
		stroke-width: 1;
		opacity: 0.6;
	}
	.fb-roll {
		fill: #f5efdf;
		stroke: #b7a884;
		stroke-width: 1.6;
	}
	.fb-roll-end {
		fill: #efe6cc;
		stroke: #b7a884;
		stroke-width: 1.4;
	}
	.fb-roll-spiral {
		fill: none;
		stroke: #b7a884;
		stroke-width: 1.1;
		opacity: 0.8;
	}
	.fb-tie {
		fill: none;
		stroke: var(--seal);
		stroke-width: 2.4;
	}
	.fb-tie-knot {
		fill: var(--seal);
	}
	.fb-cord {
		fill: none;
		stroke: #8a6a42;
		stroke-width: 2;
	}
	.fb-shine {
		fill: none;
		stroke: rgba(255, 255, 255, 0.75);
		stroke-width: 4;
		stroke-linecap: round;
	}
	.fb-shine.s2 {
		stroke-width: 3;
		opacity: 0.7;
	}

	/* ---- the scroll ---- */
	.fp-dowel {
		display: block;
		height: 20px;
		border-radius: 999px;
		background: linear-gradient(180deg, #8a6a4d, #5c4527 70%);
		border: 1px solid #382718;
		box-shadow: 0 3px 6px rgba(10, 24, 30, 0.3);
		margin: 0 -0.9rem;
	}
	.fp-dowel--btm {
		background: linear-gradient(0deg, #8a6a4d, #5c4527 70%);
	}
	.fp-paper {
		position: relative;
		margin: -4px 0;
		padding: 1.6rem clamp(1.1rem, 3vw, 2.2rem) 1.8rem;
		background:
			repeating-linear-gradient(
				0deg,
				transparent 0 26px,
				color-mix(in srgb, var(--ink) 3%, transparent) 26px 27px
			),
			var(--paper);
		color: var(--ink);
		border-inline: 1px solid color-mix(in srgb, var(--ink) 28%, transparent);
		box-shadow: 0 24px 44px -26px rgba(4, 30, 42, 0.55);
	}
	.eyebrow {
		margin: 0 0 0.3rem;
		font-size: 0.68rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	.fp-paper h1 {
		margin: 0 0 0.5rem;
		color: var(--ink);
	}
	.lead {
		margin: 0 0 1.4rem;
		font:
			italic 1.02rem/1.6 var(--font-display, Georgia),
			serif;
		color: var(--ink-muted);
		max-width: 40rem;
	}

	/* ---- the five proof prints ---- */
	.fp-prints {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(102px, 1fr));
		gap: 1rem;
	}
	.print {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.sw {
		width: 100%;
		height: auto;
		filter: drop-shadow(0 4px 8px rgba(10, 24, 30, 0.22));
		rotate: -0.8deg;
	}
	.print:nth-child(even) .sw {
		rotate: 0.9deg;
	}
	.sw-page {
		stroke-width: 1.5;
	}
	.sw--plain .sw-page {
		fill: #fdfdfa;
		stroke: #b9b3a4;
	}
	.pl-photo {
		fill: none;
		stroke: #a09a8a;
		stroke-width: 1.4;
	}
	.pl-name {
		fill: #6b6558;
	}
	.pl-line {
		fill: #c4beae;
	}
	.sw--garden .sw-page {
		fill: #eef5ef;
		stroke: #7fb08a;
	}
	.ga-stem {
		fill: none;
		stroke: #3f6d4e;
		stroke-width: 2;
		stroke-linecap: round;
	}
	.ga-leaf {
		fill: #6bbf7b;
		stroke: #3f6d4e;
		stroke-width: 0.8;
	}
	.ga-seed {
		fill: #d9a441;
	}
	.ga-line {
		fill: #b9d4bd;
	}
	.sw--water .sw-page {
		fill: #e8f4f8;
		stroke: #6cc3d6;
	}
	.wa-fan circle {
		fill: none;
		stroke: #2b9cba;
		stroke-width: 1.2;
		stroke-opacity: 0.55;
	}
	.wa-koi {
		fill: #f7fbfc;
		stroke: rgba(30, 95, 111, 0.5);
		stroke-width: 0.9;
	}
	.wa-koi-patch {
		fill: #e0603c;
	}
	.sw--vaporwave .sw-page {
		fill: #241046;
		stroke: #7b4bd6;
	}
	.vp-sun {
		fill: #ffd36e;
	}
	.vp-slit {
		fill: #241046;
	}
	.vp-grid {
		fill: none;
		stroke: #ff5ed1;
		stroke-width: 1.2;
		opacity: 0.6;
	}
	.sw--cosmos .sw-page {
		fill: #090c1c;
		stroke: #2b3050;
	}
	.co-star {
		fill: #cfe6ff;
	}
	.co-glint {
		fill: none;
		stroke: #cfe6ff;
		stroke-width: 1.1;
		opacity: 0.9;
	}
	.co-nebula {
		fill: #d14e4e;
		opacity: 0.25;
	}

	.print-label {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 0.92rem;
		margin-top: 0.2rem;
	}
	.print-note {
		font-size: 0.72rem;
		line-height: 1.35;
		color: var(--ink-muted);
	}
	.fp-dl {
		align-self: flex-start;
		margin-top: 0.25rem;
		padding: 0.14rem 0.6rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--paper);
		background: var(--seal);
		border-radius: 3px 8px 3px 8px;
		text-decoration: none;
	}
	.fp-dl:hover {
		background: #a33322;
	}
	.fp-soon {
		align-self: flex-start;
		margin-top: 0.25rem;
		padding: 0.14rem 0.55rem;
		font-size: 0.68rem;
		color: var(--ink-muted);
		border: 1px dashed color-mix(in srgb, var(--ink) 35%, transparent);
		border-radius: 3px 8px 3px 8px;
		background: color-mix(in srgb, var(--paper) 55%, white);
	}

	@media (max-width: 720px) {
		.fp-scene {
			grid-template-columns: 1fr;
		}
		.fp-bottle {
			max-width: 170px;
			margin: 0 auto;
		}
	}
</style>
