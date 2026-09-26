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
	const sourceLink = $derived(project.links.find((link) => link.rel === 'source'));
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
				<h1 id="channel-title">{title}</h1>
			</header>
			<p class="tagline">{resolveLocalized(project.tagline, locale)}</p>
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
						{#if video.poster}<img
								class="thumbnail"
								src={video.poster}
								width="1280"
								height="720"
								alt=""
								loading="lazy"
							/>{/if}
						<span class="tape-copy">
							<span class="video-title">{video.title}</span>
							{#if video.duration}<span class="duration">{duration(video.duration)}</span>{/if}
						</span>
						<svg
							class="selection-mark"
							class:visible={videoIndex === index}
							viewBox="0 0 24 24"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="m5 12 4 4 10-10"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				{/each}
			</div>
			<a class="channel-link" href={channel.url} target="_blank" rel="noopener">
				<span>{m.channel_visit()}</span><span aria-hidden="true">↗</span>
			</a>
		</section>
	</div>

	<section class="liner" aria-labelledby="channel-about">
		<svg class="coffee-ring" viewBox="0 0 180 160" fill="none" aria-hidden="true">
			<g stroke="#87552e" stroke-linecap="round" stroke-linejoin="round">
				<path
					d="M146 55c8 23 2 47-15 64-20 20-57 24-85 5C22 108 14 85 23 61c9-25 32-39 59-39 26-1 49 11 62 27"
					stroke-width="7"
					opacity="0.17"
				/>
				<path
					d="M140 45c15 21 14 48-1 65m-8 11c-21 17-55 20-81 4M36 113c-17-17-21-38-12-57m9-17c13-12 30-18 47-19"
					stroke-width="2.5"
					opacity="0.4"
				/>
				<path
					d="M137 53c11 22 6 47-13 62-19 16-47 18-71 3-22-13-29-34-21-54m16-27c17-10 40-12 58-4"
					stroke-width="3"
					opacity="0.13"
				/>
				<path d="m50 127 9 4m61-3 8-5M23 68l-2 10" stroke-width="4" opacity="0.25" />
			</g>
			<g fill="#87552e" opacity="0.18">
				<ellipse cx="148" cy="130" rx="4" ry="2.5" transform="rotate(-28 148 130)" />
				<circle cx="157" cy="120" r="1.5" />
				<ellipse cx="35" cy="140" rx="2.5" ry="1.4" />
			</g>
		</svg>
		<div class="salutation">
			<h2 id="channel-about">Hello nerds.</h2>
			<div class="nix-sticker">
				<img src="/media/projects/luixbits/nix-snowflake.svg" width="80" height="80" alt="" />
				<span>I use NixOS, btw.</span>
			</div>
		</div>
		<div class="description">
			{#each paragraphs as paragraph}<p>{paragraph}</p>{/each}
		</div>
		{#if sourceLink}
			<footer class="liner-footer">
				<a class="liner-source" href={sourceLink.url} target="_blank" rel="noopener">
					<svg class="ink-arrow" viewBox="0 0 90 35" fill="none" aria-hidden="true">
						<path
							d="M4 6c13 23 43 24 77 9m-13-5 15 4-9 12"
							stroke="currentColor"
							stroke-width="1.7"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span>{m.channel_code_link()}</span><span aria-hidden="true">↗</span>
				</a>
				<span class="signature">Luix</span>
			</footer>
		{/if}
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
		gap: 0.7rem;
		min-height: 44px;
		margin: 0.75rem auto 0;
		padding: 0.3rem 0.5rem;
		color: var(--fg-muted);
		font-size: var(--fs-small);
		text-underline-offset: 4px;
	}
	.watch-link:hover {
		color: var(--fg);
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
	h1 {
		margin: 0;
		font-size: var(--fs-h1);
		line-height: var(--lh-tight);
		text-shadow:
			-1px 0 #35e6e6,
			1px 1px #ff5ed1;
	}
	.tagline {
		color: var(--fg-muted);
		font-size: var(--fs-body);
		line-height: var(--lh-body);
		margin: 1rem 0 1.5rem;
	}
	.instruction {
		margin: 0 0 0.8rem;
		font-size: var(--fs-body);
		color: var(--fg);
		line-height: var(--lh-body);
	}
	.tape-list {
		display: grid;
		gap: 0.6rem;
	}
	.programme-tape {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		position: relative;
		width: 100%;
		padding: 0.85rem;
		border: 1px solid #b29bd633;
		border-left: 3px solid #6a507e;
		border-radius: 3px;
		background: linear-gradient(100deg, #171028d9, #28173cb3);
		box-shadow:
			0 3px 0 #140a2580,
			inset 0 1px 0 #ffffff08;
		text-align: left;
		color: var(--fg);
		font: inherit;
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
	.thumbnail {
		width: 5.5rem;
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
	.video-title {
		display: block;
		font-size: var(--fs-body);
		line-height: var(--lh-body);
	}
	.duration {
		display: block;
		margin-top: 0.3rem;
		color: var(--fg-muted);
		font-size: var(--fs-small);
	}
	.selection-mark {
		flex: none;
		width: 1.25rem;
		height: 1.25rem;
		visibility: hidden;
		color: var(--fg);
	}
	.selection-mark.visible {
		visibility: visible;
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
		font-size: var(--fs-body);
		color: var(--fg);
		text-decoration: none;
	}
	.channel-link:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	button:focus-visible,
	a:focus-visible {
		outline: 2px solid var(--sub-bg);
		outline-offset: 4px;
	}
	.liner {
		position: relative;
		isolation: isolate;
		display: grid;
		grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
		gap: 1.3rem 2rem;
		margin: 3rem 0 0;
		padding: 2.5rem 3rem;
		color: #34243f;
		border: 1px solid #f8e3c5;
		border-radius: 3px 3px 12px 3px;
		background: #f7e9d3;
		box-shadow:
			5px 7px 0 #160b2780,
			0 18px 35px #09051445;
	}
	.coffee-ring {
		position: absolute;
		z-index: -1;
		right: 0.25rem;
		bottom: 0.5rem;
		width: 9rem;
		height: 8rem;
		opacity: 0.65;
		transform: rotate(-12deg);
		pointer-events: none;
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
	.liner::after {
		content: '';
		position: absolute;
		inset: 0 auto 0 1.5rem;
		border-left: 1px solid #59415726;
		pointer-events: none;
	}
	.liner h2 {
		font-size: var(--fs-h2);
		line-height: var(--lh-tight);
		color: inherit;
		margin: 0;
		padding: 0;
		border: 0;
	}
	.nix-sticker {
		position: relative;
		display: grid;
		justify-items: center;
		gap: 0.35rem;
		width: fit-content;
		max-width: 100%;
		margin: 1.6rem 0 0 0.4rem;
		padding: 0.8rem 1.2rem 0.9rem;
		border: 5px solid #fffaf0;
		border-radius: 42% 44% 22% 24% / 34% 38% 18% 20%;
		background: linear-gradient(145deg, #f5f7ff, #dae5f5);
		box-shadow:
			0 0 0 1px #463a4930,
			1px 3px 2px #463a4926,
			3px 6px 8px #463a491a;
		transform: rotate(-6deg);
	}
	.nix-sticker::after {
		content: '';
		position: absolute;
		right: 0.15rem;
		bottom: -0.15rem;
		width: 1.4rem;
		height: 0.9rem;
		border-radius: 80% 0 80% 0;
		background: linear-gradient(150deg, #c7cede 10%, #fffaf0 58%);
		box-shadow: -1px -1px 1px #463a4917;
		transform: rotate(-12deg);
	}
	.nix-sticker img {
		display: block;
		width: 5rem;
		height: 5rem;
	}
	.nix-sticker span {
		font-size: var(--fs-body);
		line-height: var(--lh-body);
		color: #34466d;
		text-align: center;
	}
	.description p {
		margin: 0;
		font-size: var(--fs-body);
		line-height: var(--lh-body);
	}
	.description p + p {
		margin-top: 1rem;
	}
	.liner-footer {
		grid-column: 1 / -1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.4rem 1rem;
		border-top: 1px dashed #59415766;
		padding-top: 0.7rem;
	}
	.liner-source {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		min-height: 44px;
		max-width: 100%;
		padding: 0.3rem 0;
		font-size: var(--fs-body);
		color: inherit;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 4px;
	}
	.liner-source:hover {
		text-decoration-thickness: 2px;
	}
	.liner-source:focus-visible {
		outline-color: #34243f;
	}
	.ink-arrow {
		flex: none;
		width: 4rem;
		height: 1.75rem;
		color: #814166;
	}
	.signature {
		margin-left: auto;
		padding: 0 0.3rem;
		font-family: Georgia, serif;
		font-size: var(--fs-h3);
		font-style: italic;
		line-height: var(--lh-body);
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
			gap: 1.5rem;
		}
		.programme {
			padding: 0 0.7rem;
		}
		.avatar {
			width: 3.7rem;
		}
		.thumbnail {
			width: 4rem;
		}
		.programme-tape {
			padding: 0.75rem 0.5rem;
			gap: 0.65rem;
		}
		.selection-mark {
			width: 1rem;
			height: 1rem;
		}
		.liner {
			grid-template-columns: 1fr;
			gap: 1.5rem;
			margin: 2.2rem 0.4rem 0;
			padding: 2rem 1.5rem;
		}
		.liner::after {
			left: 0.65rem;
		}
		.ink-arrow {
			width: 2rem;
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
