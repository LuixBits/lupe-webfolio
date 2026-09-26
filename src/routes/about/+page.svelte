<script lang="ts">
	import { onMount } from 'svelte';
	import { about } from '$lib/content/about';
	import { resolveLocalized, type Chapter } from '$lib/content/schema';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import Garden from '$lib/garden/Garden.svelte';
	import TreeLayer from '$lib/garden/tree/TreeLayer.svelte';
	import LivingLine from '$lib/garden/LivingLine.svelte';
	import { revealOnce } from '$lib/garden/reveal';

	const locale = getLocale();

	// Grove reveal state. `hydrated` gates the hidden `pending` state to the
	// client, so SSR/no-JS readers always get a fully grown grove; each chapter
	// flips to `in` once, the first time it scrolls into view.
	let hydrated = $state(false);
	let revealed = $state<Record<string, boolean>>({});
	onMount(() => {
		hydrated = true;
	});
	const bioParas = $derived(resolveLocalized(about.bio, locale).split('\n\n'));
	// A drop cap mangles opening contractions ("I'm" → giant "I'" + orphaned
	// "m"), so only grant it when the first word survives ::first-letter intact.
	const dropcapOk = $derived(!/^\p{L}['’]/u.test(bioParas[0] ?? ''));

	// The descent: the page is one tree, crown (today) to underground (where
	// it began). Content order in about.ts is the page order; these split it
	// at the ground line.
	const UNDERGROUND = new Set(['roots', 'mycelium']);
	// Desktop weave: which side of the central trunk each block sits on.
	const SIDE: Record<string, 'l' | 'r'> = {
		pioneer: 'r',
		branches: 'l',
		roots: 'r',
		mycelium: 'l'
	};
	const canopyChapters = $derived(about.chapters.filter((c) => !UNDERGROUND.has(c.id)));
	const undergroundChapters = $derived(about.chapters.filter((c) => UNDERGROUND.has(c.id)));

	// Circled figure markers, pinned over the portrait in the bower — herbarium
	// annotations of the specimen "Luiz Perren". Hand-tuned % of the bower box.
	const FIG_POS = [
		{ x: 26, y: 27 },
		{ x: 76, y: 47 },
		{ x: 42, y: 79 }
	];
	const figs = $derived(about.highlights.slice(0, FIG_POS.length));
</script>

<svelte:head
	><title>{m.nav_about()} — {about.name}</title><meta
		name="description"
		content={m.meta_desc_about()}
	/></svelte:head
>

<!-- `living` swaps the static borders for grown LivingLines (JS only, so
     SSR/no-JS keeps plain borders). -->
<div class="page page--folio" class:living={hydrated}>
	<!-- THE TREE: one procedural organism spanning the whole page. It measures
	     every [data-tree] anchor and grows a trunk, crown, an embracing limb
	     per content block, roots, and a root to the seeds. Behind the prose.
	     A second sparse instance stacks ABOVE the content: the branches and
	     tufts that grip each card's corners (plus butterfly + ladybug). -->
	<TreeLayer seed="about-tree" grown={revealed} arrive={hydrated} />
	<TreeLayer seed="about-tree-grip" overlay grown={revealed} arrive={hydrated} />

	<!-- Everything above ground hangs off the trunk in the left gutter.
	     Scrolling down descends it — and travels back in time. -->
	<div class="tree" data-tree="treewrap">
		<section id="bio" class="section folio">
			<div class="folio-text" data-tree="bio">
				<p class="eyebrow">{m.about_folio_eyebrow()} · {about.name}</p>
				<h1 data-tree="title">{m.nav_about()}</h1>
				<p class="lead">{resolveLocalized(about.role, locale)}</p>
				{#each bioParas as para, i (i)}
					<p class="bio-para" class:dropcap={i === 0 && dropcapOk}>{para}</p>
				{/each}
			</div>

			<figure class="plate">
				<div class="bower-box" data-tree="portrait">
					<div class="portrait">
						{#if about.portrait}
							<img
								src={about.portrait.src}
								width={about.portrait.width}
								height={about.portrait.height}
								alt={resolveLocalized(about.portrait.alt, locale)}
							/>
						{:else}
							<!-- Leafy stand-in until a real photo lands — see the commented
							     `portrait` field in lib/content/about.ts. -->
							<svg class="portrait-placeholder" viewBox="0 0 240 300" aria-hidden="true">
								<defs>
									<radialGradient id="pp-light" cx="0.5" cy="0.35" r="0.7">
										<stop offset="0" stop-color="#fffbe8" stop-opacity="0.8" />
										<stop offset="1" stop-color="#fffbe8" stop-opacity="0" />
									</radialGradient>
								</defs>
								<rect
									width="240"
									height="300"
									fill="color-mix(in srgb, var(--garden-leaf, #6bbf7b) 14%, var(--bg, #eef5ef))"
								/>
								<ellipse cx="120" cy="105" rx="120" ry="110" fill="url(#pp-light)" />
								<circle
									cx="120"
									cy="112"
									r="44"
									fill="color-mix(in srgb, var(--garden-stem, #3f6d4e) 30%, var(--bg, #eef5ef))"
								/>
								<path
									d="M34 300 C 48 214 82 178 120 178 C 158 178 192 214 206 300 Z"
									fill="color-mix(in srgb, var(--garden-stem, #3f6d4e) 30%, var(--bg, #eef5ef))"
								/>
								<path
									d="M120 66 C 122 58 126 54 131 52"
									fill="none"
									stroke="var(--garden-stem, #3f6d4e)"
									stroke-width="2"
									stroke-linecap="round"
								/>
								<g transform="translate(120 66) rotate(-16) scale(1.15)">
									<path
										d="M0 0 C 5 -4 5 -12 0 -16 C -5 -12 -5 -4 0 0 Z"
										fill="var(--garden-leaf, #6bbf7b)"
									/>
								</g>
								<g transform="translate(133 55) rotate(26) scale(0.9)">
									<path
										d="M0 0 C 5 -4 5 -12 0 -16 C -5 -12 -5 -4 0 0 Z"
										fill="color-mix(in srgb, var(--garden-leaf, #6bbf7b) 55%, var(--garden-stem, #3f6d4e))"
									/>
								</g>
							</svg>
						{/if}
					</div>
					<svg class="pollen" viewBox="0 0 240 300" aria-hidden="true">
						<circle class="mote" cx="58" cy="94" r="1.7" />
						<circle class="mote" cx="178" cy="66" r="1.3" />
						<circle class="mote" cx="196" cy="170" r="1.5" />
						<circle class="mote" cx="44" cy="226" r="1.2" />
						<circle class="mote" cx="160" cy="258" r="1.6" />
					</svg>
					{#each figs as h, i (i)}
						<a
							class="fig"
							href="#note-{i}"
							style="left:{FIG_POS[i].x}%; top:{FIG_POS[i].y}%"
							aria-label={`${i + 1}: ${resolveLocalized(h.title, locale)}`}
						>
							<span class="fig-dot" style="animation-delay:{1.2 + i * 0.5}s" aria-hidden="true"
								>{i + 1}</span
							>
						</a>
					{/each}
				</div>
				<figcaption class="plate-label">
					<span class="latin">{about.name}</span>
					<span class="det">{m.about_plate_det()}</span>
				</figcaption>
			</figure>
		</section>

		{#if about.highlights.length}
			<section
				class="section notes-section side-l"
				aria-labelledby="notes-h"
				data-tree="notes"
				use:revealOnce={() => (revealed['notes'] = true)}
			>
				<h2 id="notes-h" class="living-h2">
					{m.about_notes_title()}<LivingLine seed="ul-notes" />
				</h2>
				<ol class="notes">
					{#each about.highlights as h, i (i)}
						<li id="note-{i}" style="--d:{i}">
							<span class="fig-dot fig-dot--static" aria-hidden="true">{i + 1}</span>
							<div class="note-body">
								<LivingLine variant="stem" seed="note-{i}" delay={340 + i * 80} />
								<h3>{resolveLocalized(h.title, locale)}</h3>
								<p>{resolveLocalized(h.body, locale)}</p>
							</div>
						</li>
					{/each}
				</ol>
			</section>
		{/if}

		<section id="grove" class="section grove-head side-l" aria-labelledby="grove-h">
			<h2 id="grove-h" class="living-h2">
				{m.about_grove_title()}<LivingLine seed="ul-grove" />
			</h2>
			<p class="seeds-hint">{m.about_grove_hint()}</p>
		</section>

		{#each canopyChapters as ch (ch.id)}
			{@render chapterBlock(ch)}
		{/each}
	</div>

	<!-- UNDERGROUND: past the ground line, time runs deepest — roots, the
	     mycelium network, and finally seeds to take with you. -->
	<div class="underground">
		<div
			class="ground"
			data-tree="ground"
			aria-hidden="true"
			use:revealOnce={() => (revealed['ground'] = true)}
		>
			<LivingLine variant="soil" seed="ground" thickness={2.5} />
		</div>
		{#each undergroundChapters as ch (ch.id)}
			{@render chapterBlock(ch)}
		{/each}

		<section
			id="contact"
			class="section contact-plot side-r"
			data-tree="contact"
			use:revealOnce={() => (revealed['contact'] = true)}
		>
			<h2 class="living-h2">{m.nav_about_contact()}<LivingLine seed="ul-contact" /></h2>
			<p class="seeds-hint">{m.about_seeds_hint()}</p>
			<ul class="packets">
				{#each about.links as l, i (l.url)}
					<li>
						<a
							class="packet"
							href={l.url}
							target={l.url.startsWith('http') ? '_blank' : undefined}
							rel={l.url.startsWith('http') ? 'noopener' : undefined}
						>
							<LivingLine
								variant="frame"
								seed="packet-{i}"
								radii={{ tl: 3, tr: 3, br: 9, bl: 9 }}
								delay={i * 150}
							/>
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

	{#snippet chapterBlock(ch: Chapter)}
		{@const paras = resolveLocalized(ch.body, locale).split('\n\n')}
		<section
			class="chapter chapter--{ch.id} side-{SIDE[ch.id] ?? 'l'}"
			class:pending={hydrated && !revealed[ch.id]}
			class:in={!!revealed[ch.id]}
			use:revealOnce={() => (revealed[ch.id] = true)}
			aria-labelledby="grove-{ch.id}"
			data-tree="ch-{ch.id}"
		>
			<p class="kicker sprout" style="--d:0">{resolveLocalized(ch.kicker, locale)}</p>
			<h3 id="grove-{ch.id}" class="sprout" style="--d:1">
				{resolveLocalized(ch.title, locale)}
			</h3>
			{#if ch.id === 'pioneer'}
				<!-- Floated before the prose so the paragraphs wrap around the tree. -->
				<div class="pioneer-fig sprout" style="--d:2" aria-hidden="true">
					<!-- Params picked by bbox scan: fills 240×300 as a tall birch-like
					     pioneer; smaller leaves keep the dense crown readable. -->
					<Garden
						seed="about-pioneer-4"
						width={240}
						height={300}
						originX={120}
						originY={294}
						heading={0}
						iterations={5}
						step={4.4}
						angle={36}
						leafScale={0.5}
						strokeWidth={4.4}
						duration={4200}
						start={!!revealed[ch.id]}
					/>
				</div>
			{/if}
			{#each paras as para, pi (pi)}
				<p class="chapter-para sprout" style="--d:{2 + pi}">{para}</p>
			{/each}
			{#if ch.sprouts.length}
				<ul class="leafcards">
					{#each ch.sprouts as s, si (si)}
						<li class="leafcard sprout" style="--d:{2 + paras.length + si}">
							<LivingLine
								variant="frame"
								seed="card-{ch.id}-{si}"
								radii={si % 2 === 0
									? { tl: 6, tr: 34, br: 6, bl: 34 }
									: { tl: 34, tr: 6, br: 34, bl: 6 }}
								grow={!!revealed[ch.id]}
								delay={(2 + paras.length + si) * 95 + 250}
							/>
							<h4>{resolveLocalized(s.title, locale)}</h4>
							<p>{resolveLocalized(s.body, locale)}</p>
						</li>
					{/each}
				</ul>
			{/if}
			{#if ch.id === 'roots'}
				<!-- The root grammar grows narrow, so the system is composed: a deep
				     taproot plus two slanted flankers sharing the same soil point. -->
				<div class="rootbed" aria-hidden="true">
					<div class="bed-layer">
						<Garden
							seed="about-roots-6"
							width={320}
							height={190}
							originX={160}
							originY={4}
							variant="root"
							iterations={5}
							step={3}
							strokeWidth={3.4}
							duration={3400}
							start={!!revealed[ch.id]}
						/>
					</div>
					<div class="bed-layer">
						<Garden
							seed="about-roots-east"
							width={320}
							height={190}
							originX={160}
							originY={4}
							variant="root"
							heading={142}
							step={4}
							duration={2800}
							start={!!revealed[ch.id]}
						/>
					</div>
					<div class="bed-layer">
						<Garden
							seed="about-roots-west"
							width={320}
							height={190}
							originX={160}
							originY={4}
							variant="root"
							heading={226}
							step={3.3}
							duration={3800}
							start={!!revealed[ch.id]}
						/>
					</div>
				</div>
			{:else if ch.id === 'mycelium'}
				<div class="mycelium-bed" aria-hidden="true">
					<!-- Wide 620-unit canvas so the two networks root far apart and
					     reach toward each other, almost touching mid-bed. -->
					<div class="bed-layer">
						<Garden
							seed="about-mycelium-east-2"
							width={620}
							height={150}
							originX={110}
							originY={8}
							variant="root"
							heading={115}
							step={7.5}
							duration={3200}
							start={!!revealed[ch.id]}
						/>
					</div>
					<div class="bed-layer">
						<Garden
							seed="about-mycelium-west-1"
							width={620}
							height={150}
							originX={510}
							originY={8}
							variant="root"
							heading={245}
							step={7.5}
							duration={3600}
							start={!!revealed[ch.id]}
						/>
					</div>
				</div>
			{/if}
		</section>
	{/snippet}
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
			/* wide gap: the trunk rises through this corridor */
			gap: 6.5rem;
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

	/* ---- the bower: a square of woven branches and leaves holding the
	   portrait (the Opening component draws the frame + foliage) ---- */
	.bower-box {
		position: relative;
		aspect-ratio: 4 / 5;
	}
	.portrait {
		position: absolute;
		inset: 10px;
		border-radius: 12px;
		overflow: hidden;
		background: color-mix(in srgb, var(--garden-leaf, #6bbf7b) 12%, var(--bg));
		box-shadow: inset 0 0 36px -10px color-mix(in srgb, #16301f 45%, transparent);
	}
	.portrait img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.portrait-placeholder {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
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

	/* ---- the tree: sky above, crown, trunk gutter, ground, underground ---- */
	.page--folio {
		position: relative;
	}
	/* (sky + soil atmosphere painted by the TreeLayer itself) */
	/* THE TREE LAYER: one full-bleed organism painted behind all content —
	   it also paints the whole atmosphere journey (sky → forest → soil →
	   rock), so the page itself stays transparent to it. */
	.page--folio {
		padding-top: 9.5rem; /* headroom for the canopy */
	}
	.page--folio > :global(.tree-layer) {
		position: absolute;
		/* overshoot main's padding so no app-background band shows above the
		   sky or between the page's rock and the footer's bedrock */
		top: -2.5rem;
		bottom: -2.5rem;
		left: 50%;
		transform: translateX(-50%);
		width: 100vw;
		z-index: -1;
	}
	/* the grip instance rides ABOVE the cards (still under the wheel/scene) */
	.page--folio > :global(.tree-layer.is-over) {
		z-index: 3;
	}
	/* THE TREE + UNDERGROUND: a wide gutter carries the trunk; every content
	   block hangs off it. */
	.tree,
	.underground {
		position: relative;
		padding-left: clamp(4.5rem, 10vw, 7rem);
	}
	.underground {
		padding-bottom: 1rem;
		margin-bottom: 2rem;
	}
	/* (soil/rock atmosphere painted by the TreeLayer) */
	/* GROUND: the soil line where the trunk meets the earth. */
	.ground {
		position: relative;
		height: 34px;
		margin: -1.5rem 0 2.5rem calc(-1 * clamp(2.6rem, 8vw, 4.25rem));
	}
	.ground > :global(.living-line) {
		position: absolute;
		inset: 0;
		--line-op: 0.95;
	}
	/* content cards: field-notebook sheets floating in the tree — warm paper,
	   a fine double rule (border + offset outline, the herbarium-sheet
	   language), leaf-lobed corners alternating by side, layered shadow. */
	.folio-text,
	.notes-section,
	.grove-head,
	.contact-plot,
	.chapter {
		position: relative;
		padding: 1.35rem 1.5rem 1.25rem;
		border-radius: 6px 22px;
		background:
			radial-gradient(120% 85% at 28% 0%, rgba(255, 252, 238, 0.85), rgba(255, 252, 238, 0) 62%),
			linear-gradient(
				color-mix(in srgb, var(--bg) 45%, white),
				color-mix(in srgb, var(--bg) 68%, white)
			);
		border: 1px solid color-mix(in srgb, var(--garden-stem, var(--accent)) 32%, transparent);
		outline: 1px solid color-mix(in srgb, var(--garden-stem, var(--accent)) 15%, transparent);
		outline-offset: 4px;
		box-shadow:
			0 1px 2px color-mix(in srgb, #16301f 16%, transparent),
			0 28px 46px -30px color-mix(in srgb, #16301f 55%, transparent);
	}
	.side-r {
		border-radius: 22px 6px;
	}
	/* underground sheets: older paper, earth-toned rule */
	.underground .chapter,
	.contact-plot {
		background:
			radial-gradient(120% 85% at 28% 0%, rgba(255, 250, 232, 0.8), rgba(255, 250, 232, 0) 62%),
			linear-gradient(#f9f2df, #efe5cc);
		border-color: color-mix(in srgb, #6b5535 42%, transparent);
		outline-color: color-mix(in srgb, #6b5535 20%, transparent);
		box-shadow:
			0 1px 2px color-mix(in srgb, #2b2114 20%, transparent),
			0 28px 46px -30px color-mix(in srgb, #2b2114 60%, transparent);
	}
	.folio-text {
		margin: 0 -1.35rem;
	}
	.notes-section {
		margin-left: -1.35rem;
		margin-right: -1.35rem;
	}
	/* a small leaf glyph opens every kicker */
	.kicker::before {
		content: '';
		display: inline-block;
		width: 0.62em;
		height: 0.95em;
		margin-right: 0.55em;
		vertical-align: -0.14em;
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-6 -17 12 18'%3E%3Cpath d='M0 0 C 5 -4 5 -12 0 -16 C -5 -12 -5 -4 0 0 Z' fill='%233f6d4e'/%3E%3C/svg%3E")
			center / contain no-repeat;
	}
	/* chapter titles carry a short hand-set rule */
	.chapter h3::after {
		content: '';
		display: block;
		width: 3.2rem;
		height: 2px;
		margin-top: 0.5rem;
		border-radius: 2px;
		background: color-mix(in srgb, var(--garden-stem, var(--accent)) 70%, transparent);
	}
	.underground .chapter h3::after {
		background: color-mix(in srgb, #6b5535 70%, transparent);
	}
	/* the desktop weave: blocks alternate around the central trunk.
	   (.page--folio prefix so these outrank the base block rules below) */
	@media (min-width: 900px) {
		.page--folio .tree,
		.page--folio .underground {
			padding-left: 1.25rem;
			padding-right: 1.25rem;
		}
		.page--folio .notes-section,
		.page--folio .grove-head,
		.page--folio .contact-plot,
		.page--folio .chapter {
			max-width: calc(27rem + 2.7rem);
			margin-left: 0;
			margin-right: 0;
		}
		.page--folio .chapter {
			margin-bottom: 5.5rem;
		}
		.page--folio .grove-head {
			max-width: calc(24rem + 2.7rem);
		}
		.page--folio .side-l {
			margin-right: auto !important;
		}
		.page--folio .side-r {
			margin-left: auto !important;
		}
	}
	.grove-head {
		margin-bottom: 1.25rem;
	}
	.chapter {
		position: relative;
		max-width: calc(38rem + 2.7rem);
		margin: 0 -1.35rem 4.75rem;
		scroll-margin-top: 7rem;
	}
	.chapter:last-child {
		margin-bottom: 1rem;
	}
	.kicker {
		margin: 0 0 0.4rem;
		font-size: 0.72rem;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--garden-stem, var(--accent)) 78%, var(--fg));
	}
	.chapter h3 {
		margin: 0 0 0.9rem;
		font-size: var(--fs-h2);
		font-style: italic;
		font-weight: 620;
	}
	.chapter-para {
		margin: 0 0 1rem;
	}

	/* leaf-shaped passion cards */
	.leafcards {
		list-style: none;
		margin: 1.3rem 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(13.5rem, 1fr));
		gap: 0.9rem;
	}
	.leafcard {
		position: relative;
		padding: 0.95rem 1.1rem;
		background: color-mix(in srgb, var(--bg) 55%, white);
		border: 1px solid color-mix(in srgb, var(--garden-stem, var(--accent)) 30%, transparent);
		/* px, not rem: the LivingLine frame path must match these corners */
		border-radius: 6px 34px;
		box-shadow: 0 10px 22px -18px color-mix(in srgb, var(--garden-stem, #3f6d4e) 60%, transparent);
	}
	.leafcard:nth-child(even) {
		border-radius: 34px 6px;
	}
	.leafcard h4 {
		margin: 0 0 0.3rem;
		font-size: 1rem;
	}
	.leafcard p {
		margin: 0;
		font-size: 0.92rem;
		color: var(--fg-muted);
	}

	/* roots chapter footer: a soil line the root system descends from */
	.rootbed {
		position: relative;
		height: 175px;
		margin-top: 0.6rem;
		overflow: clip;
		/* underground palette: paler than the canopy above */
		--garden-stem: #6f927d;
		-webkit-mask-image: linear-gradient(#000 50%, transparent);
		mask-image: linear-gradient(#000 50%, transparent);
	}

	/* mycelium: two muted root systems interleaving under their own soil line */
	.mycelium-bed {
		position: relative;
		height: 150px;
		margin-top: 0.6rem;
		overflow: clip;
		--garden-stem: #93b2a0;
		--garden-leaf: #b9d8c2;
		-webkit-mask-image: linear-gradient(#000 45%, transparent);
		mask-image: linear-gradient(#000 45%, transparent);
	}
	.bed-layer {
		position: absolute;
		inset: 0;
	}

	/* pioneer tree: prose wraps around the growing specimen */
	.pioneer-fig {
		position: relative;
		width: min(280px, 78vw);
		height: 320px;
		margin: 0.4rem auto 1rem;
	}
	.pioneer-fig::before {
		content: '';
		position: absolute;
		inset: -4% -12% 6%;
		background: radial-gradient(closest-side, rgba(255, 243, 201, 0.7), transparent 80%);
	}
	.chapter--pioneer::after {
		content: '';
		display: block;
		clear: both;
	}
	@media (min-width: 900px) {
		.pioneer-fig {
			float: right;
			width: 185px;
			height: 235px;
			margin: -1.4rem -0.4rem 0.5rem 1.2rem;
		}
	}
	/* Phones: slimmer gutter, tighter veils, less canopy headroom. */
	@media (max-width: 720px) {
		.page--folio {
			padding-top: 7rem;
		}
		.tree,
		.underground {
			padding-left: 3.4rem;
		}
		.folio-text,
		.notes-section,
		.chapter {
			padding: 0.9rem 0.95rem;
		}
		.folio-text {
			margin: 0 -0.95rem;
		}
		.notes-section,
		.chapter {
			margin-left: -0.95rem;
			margin-right: -0.95rem;
		}
	}

	/* ---- living structural lines. Once hydrated (`.living`), the static CSS
	   borders turn transparent and LivingLine draws grown wood in their place;
	   SSR/no-JS never gets `.living`, so plain borders remain. ---- */
	.living .section h2 {
		border-bottom-color: transparent;
	}
	.living .leafcard,
	.living .packet {
		border-color: transparent;
	}
	.living .note-body {
		border-left-color: transparent;
	}
	.living-h2 {
		position: relative;
	}
	.living-h2 > :global(.living-line) {
		position: absolute;
		left: 0;
		right: 0;
		top: calc(100% - 9px);
		height: 30px;
		--line-op: 0.9;
	}
	.leafcard > :global(.living-line),
	.packet > :global(.living-line) {
		position: absolute;
		inset: 0;
		--line-op: 0.6;
	}
	.note-body {
		position: relative;
	}
	.note-body > :global(.living-line) {
		position: absolute;
		left: -4px;
		top: 2px;
		bottom: 2px;
		width: 14px;
		--line-op: 0.7;
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

	/* ---- grove growth. Hidden state exists only client-side (`pending` is
	   gated on hydration) and only when motion is welcome, so SSR, no-JS and
	   reduced-motion readers always meet a fully grown grove. ---- */
	@media (prefers-reduced-motion: no-preference) {
		.chapter.pending .sprout {
			opacity: 0;
		}
		.chapter.in .sprout {
			animation: sprout-up 620ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
			animation-delay: calc(var(--d, 0) * 95ms);
		}
		.chapter.in .leafcard {
			animation-name: leaf-unfurl;
			transform-origin: 12% 88%;
		}
		.chapter.in .pioneer-fig::before {
			animation: dapple-in 1600ms ease 500ms backwards;
		}
	}
	@keyframes sprout-up {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
	}
	@keyframes leaf-unfurl {
		from {
			opacity: 0;
			transform: translateY(10px) rotate(-4deg) scale(0.88);
		}
	}
	@keyframes dapple-in {
		from {
			opacity: 0;
		}
	}
</style>
