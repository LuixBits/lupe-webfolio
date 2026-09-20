<script lang="ts">
	/** THE COUNTER TV — the playback deck on the rental counter. One CRT screen
	 *  shows whichever channel is tuned: STILLS (scroll-snap screenshot reel),
	 *  VIDEO (poster → tap → embed), DEMO (test card → TUNE IN mounts the
	 *  sandboxed build, EJECT tears it down). At most one heavy surface exists
	 *  at a time; nothing third-party loads before an explicit tap.
	 *  With no media at all the set idles on a themed test card. */
	import { onMount , untrack } from 'svelte';
	import { resolveLocalized, type Project } from '$lib/content/schema';
	import * as m from '$lib/paraglide/messages';
	import VcrKey from './VcrKey.svelte';
	import TestCard from './TestCard.svelte';

	let { project, locale }: { project: Project; locale: string } = $props();

	const shots = $derived(project.screenshots);
	const video = $derived(project.videos[0]);
	const demo = $derived(project.demo);
	const titleText = $derived(resolveLocalized(project.title, locale));

	type ChannelId = 'stills' | 'video' | 'demo';
	/** Only channels with content exist on this set. */
	const channels = $derived.by(() => {
		const list: { id: ChannelId; label: () => string }[] = [];
		if (shots.length) list.push({ id: 'stills', label: m.tv_ch_stills });
		if (video) list.push({ id: 'video', label: m.tv_ch_video });
		if (demo && (demo.embed || demo.url)) list.push({ id: 'demo', label: m.tv_ch_demo });
		return list;
	});

	/* Deterministic default channel: first available (self-hosted stills win).
	   Set once at init, identical on SSR and client — no flash. */
	let active = $state<ChannelId | 'none'>(
		untrack(() => (channels.length ? channels[0].id : 'none'))
	);

	/** Heavy surfaces exist only after an explicit tap. */
	let liveVideo = $state(false);
	let liveDemo = $state(false);
	let stillIdx = $state(0);
	let reelEl = $state<HTMLDivElement | null>(null);
	let reduced = $state(false);
	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	function tune(id: ChannelId) {
		if (id === active) return;
		active = id;
		// Channel change is the kill switch: any live iframe is torn down.
		liveVideo = false;
		liveDemo = false;
		stillIdx = 0;
	}
	function eject() {
		liveVideo = false;
		liveDemo = false;
	}
	function onReelScroll() {
		if (!reelEl || reelEl.clientWidth === 0) return;
		stillIdx = Math.min(
			shots.length - 1,
			Math.max(0, Math.round(reelEl.scrollLeft / reelEl.clientWidth))
		);
	}
	function goTo(i: number) {
		if (!reelEl) return;
		const next = Math.min(shots.length - 1, Math.max(0, i));
		reelEl.scrollTo({ left: next * reelEl.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
	}

	const liveNow = $derived((active === 'video' && liveVideo) || (active === 'demo' && liveDemo));
	const activeIdx = $derived(channels.findIndex((c) => c.id === active));
	/* CRT OSD strings are diegetic hardware text (PLAY / STILL / CH-01), the
	   same in every locale — like the burned-in OSD of a real deck. */
	const chBug = $derived(activeIdx >= 0 ? `CH-0${activeIdx + 1}` : 'AV-1');
	const transport = $derived(
		active === 'stills'
			? 'STILL ▸▸'
			: active === 'demo' && liveDemo
				? 'PLAY ▸ LIVE SIGNAL'
				: liveNow
					? 'PLAY ▸'
					: 'STANDBY'
	);
	const osdCaption = $derived.by(() => {
		if (active === 'stills') {
			const c = shots[stillIdx]?.caption;
			return c ? resolveLocalized(c, locale) : '';
		}
		return '';
	});

	const videoEmbedSrc = $derived(
		!video
			? ''
			: video.provider === 'youtube'
				? `https://www.youtube-nocookie.com/embed/${video.src}?autoplay=1&rel=0`
				: video.provider === 'vimeo'
					? `https://player.vimeo.com/video/${video.src}?autoplay=1`
					: video.src
	);
</script>

<section class="deck" aria-label={titleText}>
	<div class="bezel">
		<div class="screen">
			{#key active + (liveNow ? '-live' : '')}
				<div class="feed">
					{#if active === 'stills'}
						<div class="reel" bind:this={reelEl} onscroll={onReelScroll}>
							{#each shots as f, i (f.id)}
								<figure class="slide">
									<img
										src={f.image.src}
										width={f.image.width}
										height={f.image.height}
										alt={resolveLocalized(f.image.alt, locale)}
										loading={i === 0 ? 'eager' : 'lazy'}
										decoding="async"
										style:aspect-ratio="{f.image.width} / {f.image.height}"
										draggable="false"
									/>
								</figure>
							{/each}
						</div>
					{:else if active === 'video' && video}
						{#if liveVideo}
							{#if video.provider === 'file'}
								<!-- svelte-ignore a11y_media_has_caption -->
								<video class="signal" controls autoplay poster={video.poster}>
									<source src={video.src} />
								</video>
							{:else}
								<iframe
									class="signal"
									src={videoEmbedSrc}
									title={video.title}
									allow="autoplay; encrypted-media; picture-in-picture"
									allowfullscreen
								></iframe>
							{/if}
						{:else}
							<TestCard title={video.title} />
							<div class="actions">
								<button class="cta" type="button" onclick={() => (liveVideo = true)}>
									▶ {m.tv_tune_in()}
								</button>
							</div>
						{/if}
					{:else if active === 'demo' && demo}
						{#if liveDemo && demo.embed}
							<iframe
								class="signal"
								src={demo.embed.src}
								title={resolveLocalized(demo.embed.title, locale)}
								sandbox="allow-scripts allow-same-origin allow-pointer-lock"
							></iframe>
						{:else}
							<TestCard title={demo.embed ? resolveLocalized(demo.embed.title, locale) : titleText} />
							<div class="actions">
								{#if demo.embed}
									<button class="cta" type="button" onclick={() => (liveDemo = true)}>
										▶ {m.tv_tune_in()}
									</button>
								{/if}
								{#if demo.url}
									<a class="cta ghost" href={demo.url} target="_blank" rel="noopener">
										{m.tv_open_full()} ↗
									</a>
								{/if}
							</div>
						{/if}
					{:else}
						<TestCard title={titleText} line="NO SIGNAL" />
					{/if}
				</div>
			{/key}

			<span class="osd tl">{transport}</span>
			<span class="osd tr">{chBug}</span>
			{#if osdCaption}<span class="osd bl">{osdCaption}</span>{/if}
			{#if active === 'stills' && shots.length > 1}
				<span class="osd br">IMG {stillIdx + 1}/{shots.length}</span>
			{/if}

			<span class="glass" aria-hidden="true"></span>
			<span class="insert-blue" aria-hidden="true"></span>
			<span class="insert-noise" aria-hidden="true"></span>
		</div>
		<div class="chin">
			<span class="brand">LUPE · CRT-2600</span>
			<span class="power" aria-hidden="true"></span>
		</div>
	</div>

	{#if channels.length}
		<div class="panel" role="group" aria-label="CH-01 – CH-0{channels.length}">
			{#each channels as c, i (c.id)}
				<VcrKey
					sub={`CH-0${i + 1}`}
					label={c.label()}
					latching
					active={active === c.id}
					onclick={() => tune(c.id)}
				/>
			{/each}
			{#if active === 'stills' && shots.length > 1}
				<span class="spacer" aria-hidden="true"></span>
				<VcrKey tone="trk" sub="TRK" label="−" onclick={() => goTo(stillIdx - 1)} />
				<VcrKey tone="trk" sub="TRK" label="+" onclick={() => goTo(stillIdx + 1)} />
			{/if}
			{#if liveNow}
				<span class="spacer" aria-hidden="true"></span>
				<VcrKey tone="eject" sub="⏏" label={m.tv_eject()} onclick={eject} />
			{/if}
		</div>
	{/if}

	{#if active === 'stills' && shots.length > 1}
		<div class="thumbs">
			{#each shots as f, i (f.id)}
				<button
					type="button"
					class="thumb"
					class:cur={i === stillIdx}
					onclick={() => goTo(i)}
					aria-label="IMG {i + 1}"
				>
					<img
						src={f.image.thumb ?? f.image.src}
						width={f.image.width}
						height={f.image.height}
						alt=""
						loading="lazy"
						decoding="async"
					/>
				</button>
			{/each}
		</div>
	{/if}
</section>

<style>
	/* ---------- Cabinet ---------- */
	.bezel {
		border-radius: 16px;
		padding: clamp(0.7rem, 2.4vw, 1.1rem) clamp(0.7rem, 2.4vw, 1.1rem) 0.45rem;
		border: 1px solid color-mix(in srgb, black 45%, var(--slice-bg));
		background: linear-gradient(
			165deg,
			color-mix(in srgb, var(--slice-bg) 22%, var(--hub-bg)),
			color-mix(in srgb, var(--hub-bg) 84%, black) 70%
		);
		box-shadow:
			0 18px 38px rgba(0, 0, 0, 0.5),
			0 0 0 1px rgba(0, 0, 0, 0.35),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}
	.screen {
		position: relative;
		aspect-ratio: 16 / 10;
		border-radius: 10px;
		overflow: hidden;
		background: #05010d;
		border: 1px solid rgba(0, 0, 0, 0.8);
	}
	.chin {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.4rem 0.25rem 0.3rem;
	}
	.brand {
		font-family: var(--font-body);
		font-size: 0.56rem;
		font-weight: 700;
		letter-spacing: 0.3em;
		color: color-mix(in srgb, var(--fg-muted) 60%, transparent);
	}
	.power {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--sub-bg);
		box-shadow: 0 0 7px var(--sub-bg);
	}

	/* ---------- Feed layers ---------- */
	.feed {
		position: absolute;
		inset: 0;
		z-index: 1;
	}
	.signal {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
		background: #000;
	}

	/* Stills reel: scroll-snap strip inside the CRT. */
	.reel {
		position: absolute;
		inset: 0;
		display: flex;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		overscroll-behavior-x: contain;
	}
	.reel::-webkit-scrollbar {
		display: none;
	}
	.slide {
		flex: 0 0 100%;
		margin: 0;
		scroll-snap-align: center;
	}
	.slide img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		user-select: none;
	}

	/* Poster-state actions (over the test card, under the glass). */
	.actions {
		position: absolute;
		inset: auto 0 6%;
		z-index: 2;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		padding: 0 0.8rem;
	}
	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		min-height: 44px;
		padding: 0.5rem 1.15rem;
		border-radius: 5px;
		border: 1px solid color-mix(in srgb, var(--accent) 75%, black);
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--accent) 82%, white),
			color-mix(in srgb, var(--accent) 78%, black)
		);
		color: #1c0316;
		font-family: var(--font-body);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		text-decoration: none;
		cursor: pointer;
		box-shadow:
			0 3px 0 color-mix(in srgb, black 65%, var(--accent)),
			0 6px 14px rgba(0, 0, 0, 0.5);
	}
	.cta:active {
		transform: translateY(3px);
		box-shadow: 0 0 0 color-mix(in srgb, black 65%, var(--accent));
	}
	.cta.ghost {
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.13), rgba(0, 0, 0, 0.35));
		border-color: color-mix(in srgb, var(--sub-bg) 65%, black);
		color: var(--sub-bg);
		box-shadow:
			0 3px 0 rgba(0, 0, 0, 0.7),
			0 6px 14px rgba(0, 0, 0, 0.5);
	}
	.cta:focus-visible {
		outline: 2px solid var(--sub-bg);
		outline-offset: 2px;
	}

	/* ---------- OSD ---------- */
	.osd {
		position: absolute;
		z-index: 3;
		font-family: var(--font-body);
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--sub-bg);
		text-shadow:
			0 0 4px color-mix(in srgb, var(--sub-bg) 80%, transparent),
			1px 1px 0 rgba(0, 0, 0, 0.8);
		pointer-events: none;
		max-width: 78%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.osd.tl {
		top: 0.55rem;
		left: 0.7rem;
	}
	.osd.tr {
		top: 0.55rem;
		right: 0.7rem;
		color: #7dff9a;
		text-shadow:
			0 0 4px rgba(125, 255, 154, 0.8),
			1px 1px 0 rgba(0, 0, 0, 0.8);
	}
	.osd.bl {
		bottom: 0.55rem;
		left: 0.7rem;
	}
	.osd.br {
		bottom: 0.55rem;
		right: 0.7rem;
	}

	/* ---------- Glass: scanlines + vignette (static) ---------- */
	.glass {
		position: absolute;
		inset: 0;
		z-index: 4;
		pointer-events: none;
		border-radius: inherit;
		background:
			linear-gradient(160deg, rgba(255, 255, 255, 0.09), transparent 34%),
			repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0 1px, transparent 1px 3px);
		box-shadow: inset 0 0 3.2rem rgba(0, 0, 0, 0.55);
	}

	/* ---------- One-shot tape-insert static (~600ms, CSS only) ----------
	   Hidden at rest; the sequence only ever plays inside no-preference, so
	   reduced-motion and SSR both land directly on the poster state. */
	.insert-blue,
	.insert-noise {
		position: absolute;
		inset: 0;
		z-index: 6;
		opacity: 0;
		pointer-events: none;
	}
	.insert-blue {
		background: #1626d8;
	}
	.insert-noise {
		background:
			repeating-radial-gradient(
				circle at 17% 31%,
				rgba(255, 255, 255, 0.5) 0 1px,
				transparent 1px 3px
			),
			repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.25) 0 1px, transparent 1px 3px),
			#0b0b12;
	}

	/* ---------- Front panel: channel keys ---------- */
	.panel {
		display: flex;
		align-items: stretch;
		gap: 0.55rem;
		margin-top: 0.6rem;
		padding: 0.55rem 0.6rem 0.65rem;
		border-radius: 9px;
		border: 1px solid color-mix(in srgb, black 45%, var(--slice-bg));
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--hub-bg) 88%, black),
			color-mix(in srgb, var(--hub-bg) 70%, black)
		);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07);
		overflow-x: auto;
		scrollbar-width: none;
	}
	.panel::-webkit-scrollbar {
		display: none;
	}
	.spacer {
		flex: 1 0 0.4rem;
	}

	/* ---------- Desktop thumbnail strip (stills channel) ---------- */
	.thumbs {
		display: none;
	}
	@media (min-width: 65rem) {
		.thumbs {
			display: flex;
			gap: 0.5rem;
			margin-top: 0.6rem;
		}
		.thumb {
			flex: 0 0 auto;
			width: 5.4rem;
			padding: 2px;
			border-radius: 4px;
			border: 1px solid color-mix(in srgb, var(--slice-bg) 45%, transparent);
			background: color-mix(in srgb, var(--hub-bg) 80%, black);
			cursor: pointer;
			opacity: 0.6;
			transition:
				opacity 140ms ease-out,
				border-color 140ms ease-out;
		}
		.thumb img {
			display: block;
			width: 100%;
			height: auto;
			border-radius: 2px;
		}
		.thumb.cur {
			opacity: 1;
			border-color: var(--accent);
			box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 45%, transparent);
		}
		.thumb:hover {
			opacity: 1;
		}
		.thumb:focus-visible {
			outline: 2px solid var(--sub-bg);
			outline-offset: 2px;
			opacity: 1;
		}
	}

	/* ---------- Motion (entirely inside no-preference) ---------- */
	@media (prefers-reduced-motion: no-preference) {
		/* Insert sequence: blue screen → static burst → picture. Once per load. */
		.insert-blue {
			animation: tv-insert-blue 620ms steps(1, jump-none) both;
		}
		.insert-noise {
			animation: tv-insert-noise 620ms steps(5, jump-none) both;
		}
		/* 220ms tracking glitch every time the channel (or live state) changes,
		   then a slow 1px vertical tracking wobble on the tube content. */
		.feed {
			animation:
				tv-glitch 220ms steps(3, jump-none) 1,
				tv-wobble 8s steps(2, jump-none) 1s infinite;
		}
		.feed::after {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			top: -30%;
			height: 26%;
			z-index: 2;
			pointer-events: none;
			background: repeating-linear-gradient(
				0deg,
				rgba(255, 255, 255, 0.2) 0 2px,
				transparent 2px 5px
			);
			animation: tv-band 220ms linear both;
		}
	}
	@keyframes tv-insert-blue {
		0%,
		24% {
			opacity: 1;
		}
		25%,
		100% {
			opacity: 0;
		}
	}
	@keyframes tv-insert-noise {
		0%,
		24% {
			opacity: 0;
		}
		25% {
			opacity: 1;
			background-position:
				0 0,
				0 0;
		}
		60% {
			opacity: 1;
			background-position:
				7px 13px,
				0 2px;
		}
		95% {
			opacity: 1;
			background-position:
				-11px 5px,
				0 1px;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes tv-glitch {
		0% {
			transform: translateX(-4px);
			filter: saturate(3) hue-rotate(14deg);
		}
		55% {
			transform: translateX(3px);
			filter: saturate(1.6);
		}
		100% {
			transform: none;
			filter: none;
		}
	}
	@keyframes tv-band {
		from {
			opacity: 0.75;
		}
		to {
			top: 104%;
			opacity: 0;
		}
	}
	@keyframes tv-wobble {
		0%,
		100% {
			translate: 0 0;
		}
		50% {
			translate: 0 1px;
		}
	}
</style>
