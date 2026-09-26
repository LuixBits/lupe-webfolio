<script lang="ts">
	import { tick } from 'svelte';
	import { resolveLocalized, type Project } from '$lib/content/schema';
	import * as m from '$lib/paraglide/messages';
	import CounterTv from './CounterTv.svelte';

	let { project, locale }: { project: Project; locale: string } = $props();
	let player = $state<CounterTv>();
	let deck = $state<HTMLDivElement>();
	let videoIndex = $state(0);
	const channel = $derived(project.channel);
	const title = $derived(resolveLocalized(project.title, locale));
	const paragraphs = $derived(resolveLocalized(project.body, locale).split(/\n\s*\n/));
	const selectedVideo = $derived(project.videos[videoIndex]);
	const watchUrl = $derived(
		selectedVideo?.provider === 'youtube'
			? `https://www.youtube.com/watch?v=${selectedVideo.src}`
			: channel?.url
	);

	function duration(seconds: number) {
		return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
	}
	async function loadTape(index: number) {
		player?.selectVideo(index);
		await tick();
		if (!deck) return;
		const bounds = deck.getBoundingClientRect();
		if (bounds.top < 0 || bounds.bottom > window.innerHeight) {
			deck.scrollIntoView({
				block: 'center',
				behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
					? 'instant'
					: 'smooth'
			});
			player?.focusPlay();
		}
	}
</script>

{#if channel}
	<div class="channel-counter">
		<div class="deckcol" id="channel-player" bind:this={deck}>
			<CounterTv {project} {locale} bind:this={player} bind:videoIndex />
			{#if watchUrl}
				<a class="watch-link" href={watchUrl} target="_blank" rel="noopener">
					{m.channel_watch_youtube()} <span aria-hidden="true">↗</span>
				</a>
			{/if}
		</div>

		<section class="programme" aria-labelledby="channel-title">
			<header class="masthead">
				{#if channel.avatar}
					<div class="avatar">
						<img
							src={channel.avatar.src}
							width={channel.avatar.width}
							height={channel.avatar.height}
							alt={resolveLocalized(channel.avatar.alt, locale)}
						/>
					</div>
				{/if}
				<div>
					<p class="eyebrow">YOUTUBE · {channel.handle}</p>
					<h1 id="channel-title">{title}</h1>
				</div>
			</header>
			<p class="tagline">{resolveLocalized(project.tagline, locale)}</p>
			<div class="guide-heading">
				<h2>{m.channel_programme()}</h2>
				<span aria-hidden="true">{String(project.videos.length).padStart(2, '0')} · VHS</span>
			</div>
			<p class="instruction">{m.channel_choose_tape()}</p>
			<div class="tape-list" role="group" aria-label={m.channel_programme()}>
				{#each project.videos as video, index (video.id)}
					<button
						type="button"
						class="programme-tape"
						class:selected={videoIndex === index}
						aria-pressed={videoIndex === index}
						aria-controls="channel-player"
						aria-label={m.channel_load_video({ title: video.title })}
						onclick={() => loadTape(index)}
					>
						<span class="tape-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
						{#if video.poster}<img
								class="thumbnail"
								src={video.poster}
								width="1280"
								height="720"
								alt=""
								loading="lazy"
							/>{/if}
						<span class="tape-copy">
							<strong>{video.title}</strong>
							<span class="tape-meta">
								{#if video.duration}<span>{duration(video.duration)}</span>{/if}
								{#if videoIndex === index}<span class="loaded"
										><i aria-hidden="true"></i>{m.channel_loaded()}</span
									>{/if}
							</span>
						</span>
						<span class="load-arrow" aria-hidden="true">↳</span>
					</button>
				{/each}
			</div>
			<a class="channel-link" href={channel.url} target="_blank" rel="noopener">
				<span>{m.channel_visit()}</span><span aria-hidden="true">↗</span>
			</a>
		</section>
	</div>

	<section class="liner" aria-labelledby="channel-about">
		<div class="liner-spine" aria-hidden="true">LUIXBITS · SIDE B</div>
		<div class="liner-content">
			<header class="liner-header">
				<p class="eyebrow">{m.channel_about()}</p>
				<span class="format-stamp" aria-hidden="true">VHS <span>STEREO</span></span>
			</header>
			<div class="liner-columns">
				<div class="salutation">
					<h2 id="channel-about">Hello<br />nerds<span>.</span></h2>
					<span class="handwritten">{m.channel_from_workbench()}</span>
					<svg class="ink-arrow" viewBox="0 0 130 35" fill="none" aria-hidden="true">
						<path
							d="M4 8c32 27 72 24 115 5m-13-4 15 3-9 12"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
				<div class="description">
					{#each paragraphs as paragraph}<p>{paragraph}</p>{/each}
				</div>
			</div>
			<footer class="liner-footer">
				<span class="topics">{project.tags.join(' / ')}</span>
				<span class="signature">Luix</span>
			</footer>
		</div>
	</section>
{/if}

<style>
	.channel-counter {
		display: grid;
		gap: 2.5rem;
		align-items: center;
	}
	.deckcol {
		min-width: 0;
		scroll-margin-top: 1.5rem;
	}
	.watch-link {
		display: flex;
		width: fit-content;
		align-items: center;
		gap: 1rem;
		min-height: 44px;
		margin: 0.4rem auto 0;
		padding: 0.3rem 0.5rem;
		color: var(--fg-muted);
		font-size: 0.68rem;
		text-underline-offset: 4px;
	}
	.watch-link:hover {
		color: var(--sub-bg);
	}
	.programme {
		min-width: 0;
		padding: 1rem 0;
	}
	.masthead {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.avatar {
		flex: none;
		width: 4.4rem;
		padding: 4px;
		border: 1px solid #35e6e66e;
		border-radius: 7px;
		background: #100920;
		box-shadow: 4px 4px 0 #ff5ed11f;
		transform: rotate(-4deg);
	}
	.avatar img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 3px;
	}
	.eyebrow {
		margin: 0;
		font-size: 0.61rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}
	.masthead .eyebrow {
		color: var(--sub-bg);
	}
	h1 {
		margin: 0.2rem 0 0;
		font-size: clamp(2.6rem, 4.4vw, 3.7rem);
		line-height: 1;
		text-shadow:
			-2px 0 #35e6e6,
			2px 1px #ff5ed1;
	}
	.tagline {
		color: var(--fg-muted);
		font-size: 0.95rem;
		line-height: 1.6;
		margin: 1.1rem 0 1.6rem;
	}
	.guide-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.8rem;
		padding-bottom: 0.6rem;
		border-bottom: 1px solid #ff5ed163;
	}
	.guide-heading h2 {
		margin: 0;
		padding: 0;
		border: 0;
		font-family: var(--font-body);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.17em;
		color: var(--fg);
	}
	.guide-heading > span {
		font-size: 0.56rem;
		letter-spacing: 0.12em;
		color: var(--accent);
		white-space: nowrap;
	}
	.instruction {
		margin: 0.65rem 0 1rem;
		font-size: 0.7rem;
		color: var(--fg-muted);
		line-height: 1.6;
	}
	.tape-list {
		display: grid;
		gap: 0.5rem;
	}
	.programme-tape {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		position: relative;
		width: 100%;
		padding: 0.7rem;
		border: 1px solid #b29bd633;
		border-left: 3px solid #6a507e;
		border-radius: 3px;
		background: linear-gradient(100deg, #171028d9, #28173cb3);
		box-shadow:
			0 3px 0 #140a2580,
			inset 0 1px 0 #ffffff08;
		text-align: left;
		color: var(--fg);
		font-family: var(--font-body);
		cursor: pointer;
		transition:
			border-color 160ms,
			background 160ms,
			transform 160ms,
			box-shadow 160ms;
	}
	.programme-tape:hover {
		border-color: #ff5ed1a6;
		background: #42203fe6;
		transform: translateX(-3px);
		box-shadow: 3px 3px 0 #ff5ed11f;
	}
	.programme-tape.selected {
		border-color: #35e6e66e;
		border-left-color: var(--sub-bg);
		background: linear-gradient(110deg, #17353be0, #1b1938d9);
		box-shadow:
			-5px 0 16px #35e6e613,
			inset 0 1px 0 #ffffff12;
	}
	.programme-tape:active {
		transform: translate(0, 1px);
	}
	.tape-number {
		flex: none;
		align-self: flex-start;
		padding-top: 0.1rem;
		font-size: 0.6rem;
		color: var(--fg-muted);
	}
	.selected .tape-number {
		color: var(--sub-bg);
	}
	.thumbnail {
		width: 4.7rem;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		flex: none;
		border-radius: 2px;
		box-shadow: 0 0 0 1px #ffffff1a;
	}
	.tape-copy {
		min-width: 0;
		flex: 1;
	}
	.tape-copy strong {
		display: block;
		font-size: 0.75rem;
		line-height: 1.5;
		font-weight: 400;
	}
	.tape-meta {
		display: flex;
		gap: 0.65rem;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 0.35rem;
		min-height: 0.8rem;
		color: var(--fg-muted);
		font-size: 0.52rem;
		letter-spacing: 0.06em;
	}
	.loaded {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--sub-bg);
		text-transform: uppercase;
	}
	.loaded i {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: currentColor;
		box-shadow: 0 0 6px currentColor;
	}
	.load-arrow {
		color: var(--fg-muted);
		font-size: 1rem;
	}
	.selected .load-arrow,
	.programme-tape:hover .load-arrow {
		color: var(--sub-bg);
	}
	.channel-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		min-height: 44px;
		margin-top: 1rem;
		padding: 0.75rem 0;
		border-bottom: 1px dashed #c8a6ef6b;
		font-size: 0.75rem;
		color: var(--vapor-sun);
		text-decoration: none;
	}
	.channel-link:hover {
		color: var(--fg);
		border-bottom-color: var(--vapor-sun);
	}
	.channel-link > span:last-child {
		font-size: 1.1rem;
	}
	button:focus-visible,
	a:focus-visible {
		outline: 2px solid var(--sub-bg);
		outline-offset: 4px;
	}
	.liner {
		position: relative;
		display: flex;
		margin: 3rem 0 0;
		color: #34243f;
		border: 1px solid #f8e3c5;
		border-radius: 3px 3px 12px 3px;
		background: linear-gradient(104deg, #ead9be, #fff0d7 48%, #eee0c8 49%, #f7e9d3 51%, #f5e6ce);
		box-shadow:
			5px 7px 0 #160b2780,
			0 18px 35px #09051445;
	}
	.liner::before {
		content: '';
		position: absolute;
		top: -0.6rem;
		left: 17%;
		width: 5rem;
		height: 1.3rem;
		background: #e0bedbbd;
		border-inline: 2px dotted #bb97ae77;
		transform: rotate(-5deg);
		box-shadow: 0 1px 3px #36264014;
	}
	.liner-spine {
		flex: none;
		width: 2.2rem;
		padding: 1.3rem 0.6rem;
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		text-align: center;
		border-left: 1px solid #59415740;
		font-size: 0.57rem;
		font-weight: 700;
		letter-spacing: 0.22em;
	}
	.liner-content {
		flex: 1;
		min-width: 0;
		padding: 1.6rem 2.1rem 1.2rem;
	}
	.liner-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 0.8rem;
		border-bottom: 1px solid #59415766;
	}
	.liner-header .eyebrow {
		color: #78415d;
	}
	.format-stamp {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		border: 1.5px solid currentColor;
		padding: 0.2rem 0.35rem;
		font-weight: 700;
		font-size: 0.7rem;
		transform: rotate(3deg);
	}
	.format-stamp span {
		border-left: 1px solid currentColor;
		padding-left: 0.4rem;
		font-size: 0.4rem;
		letter-spacing: 0.08em;
	}
	.liner-columns {
		display: grid;
		grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
		gap: 2rem;
		padding: 1.5rem 0;
	}
	.salutation h2 {
		font-size: clamp(2.4rem, 5.2vw, 4.3rem);
		line-height: 0.98;
		color: #392446;
		margin: 0 0 1rem;
		padding: 0;
		border: 0;
	}
	.salutation h2 span {
		color: #a5366f;
	}
	.handwritten {
		display: block;
		transform: rotate(-4deg);
		color: #814166;
		font:
			italic 1.15rem Georgia,
			serif;
	}
	.ink-arrow {
		width: 8rem;
		height: 2rem;
		margin: 0.7rem 0 0 1.5rem;
		color: #814166;
	}
	.description p {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.8;
	}
	.description p + p {
		margin-top: 1rem;
	}
	.liner-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		border-top: 1px dashed #59415766;
		padding-top: 0.8rem;
	}
	.topics {
		font-size: 0.59rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		line-height: 1.8;
	}
	.signature {
		font:
			italic 1.5rem Georgia,
			serif;
		transform: rotate(-8deg);
	}
	@media (min-width: 65rem) {
		.channel-counter {
			grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
		}
	}
	@media (min-width: 40rem) and (max-width: 64.99rem) {
		.deckcol {
			max-width: 42rem;
			width: 100%;
			margin-inline: auto;
		}
		.tape-list {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (max-width: 40rem) {
		.channel-counter {
			gap: 1.3rem;
		}
		.programme {
			padding: 0 0.7rem;
		}
		.avatar {
			width: 3.7rem;
		}
		h1 {
			font-size: 2.7rem;
		}
		.masthead .eyebrow {
			font-size: 0.53rem;
		}
		.thumbnail {
			width: 3.8rem;
		}
		.programme-tape {
			padding: 0.65rem 0.5rem;
			gap: 0.5rem;
		}
		.tape-copy strong {
			font-size: 0.68rem;
		}
		.liner {
			margin: 2.2rem 0.4rem 0;
		}
		.liner-spine {
			width: 1.4rem;
			padding-inline: 0.3rem;
			font-size: 0.48rem;
		}
		.liner-content {
			padding: 1.2rem 1rem;
		}
		.liner-header .eyebrow {
			font-size: 0.52rem;
		}
		.liner-columns {
			grid-template-columns: 1fr;
			gap: 1.4rem;
		}
		.salutation h2 {
			font-size: 3.2rem;
		}
		.salutation {
			position: relative;
		}
		.handwritten {
			font-size: 1.05rem;
		}
		.ink-arrow {
			display: none;
		}
		.description p {
			font-size: 0.8rem;
		}
		.topics {
			font-size: 0.53rem;
		}
	}
	@media (max-width: 23rem) {
		.load-arrow {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.programme-tape {
			transition: none;
		}
		.programme-tape:hover {
			transform: none;
		}
	}
</style>
