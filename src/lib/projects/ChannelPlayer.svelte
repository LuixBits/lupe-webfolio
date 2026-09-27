<script lang="ts">
	import { getContext, tick } from 'svelte';
	import { resolveLocalized, type Project } from '$lib/content/schema';
	import * as m from '$lib/paraglide/messages';
	import CounterTv from './CounterTv.svelte';
	import DeskLamp from './workbench/DeskLamp.svelte';
	import CasioWatch from './workbench/CasioWatch.svelte';
	import WorkbenchKeyboard from './workbench/WorkbenchKeyboard.svelte';
	import FloorPlan from './workbench/FloorPlan.svelte';
	import VideoCassette from './workbench/VideoCassette.svelte';
	import { projectNavigation, type ProjectNavigation } from './navigation';

	let { project, locale }: { project: Project; locale: string } = $props();
	let player = $state<CounterTv>();
	let deck = $state<HTMLDivElement>();
	let videoIndex = $state(0);
	let powered = $state(true);
	let lampLit = $state(true);
	const navigation = getContext<ProjectNavigation | undefined>(projectNavigation);
	const channel = $derived(project.channel);
	const title = $derived(resolveLocalized(project.title, locale));
	const paragraphs = $derived(resolveLocalized(project.body, locale).split(/\n\s*\n/));
	const sourceLink = $derived(project.links.find((link) => link.rel === 'source'));
	const selectedVideo = $derived(project.videos[videoIndex]);
	const watchIndex = $derived(project.videos.findIndex((video) => video.id === 'casio-nixos'));
	const watchVideo = $derived(project.videos[watchIndex]);
	const watchUrl = $derived(
		selectedVideo?.provider === 'youtube'
			? `https://www.youtube.com/watch?v=${selectedVideo.src}`
			: channel?.url
	);

	async function loadTape(index: number, focusPlayer = false) {
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
		if (focusPlayer) player?.focusPlay();
	}
</script>

{#if channel}
	<div
		class="workbench-scene"
		class:screen-lit={powered}
		class:lamp-lit={lampLit}
		class:arriving={navigation?.moving}
	>
		<div class="channel-counter">
			<div class="deckcol" id="channel-player" bind:this={deck}>
				<div class="screen-spill" aria-hidden="true"><div class="spill-light"></div></div>
				<svg class="tv-cable" viewBox="0 0 80 320" fill="none" aria-hidden="true">
					<path
						d="M27 12c-16 33 38 21 35 64l-8 120c-4 46 27 81-8 106"
						stroke="#100f17"
						stroke-width="7"
					/>
					<path
						d="M26 12c-16 33 38 21 35 64l-8 120c-4 46 27 81-8 106"
						stroke="#6b555f"
						stroke-width="2"
					/>
				</svg>
				<CounterTv {project} {locale} bind:this={player} bind:videoIndex bind:powered />
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
						<div class="tape-slot">
							<VideoCassette
								{video}
								selected={videoIndex === index}
								onloadvideo={() => loadTape(index)}
							/>
						</div>
					{/each}
				</div>
				<a class="channel-link" href={channel.url} target="_blank" rel="noopener">
					<span>{m.channel_visit()}</span><span aria-hidden="true">↗</span>
				</a>
			</section>
		</div>

		<div class="desk-surface">
			<div class="lamp-pool" aria-hidden="true"></div>
			<div class="bench-tools">
				<div class="lamp-slot"><DeskLamp bind:lit={lampLit} /></div>
				<div class="keyboard-notes" aria-hidden="true">
					<div class="plan-sheet"><FloorPlan /></div>
					<WorkbenchKeyboard />
				</div>
				{#if watchVideo}
					<div class="watch-slot">
						<CasioWatch
							selected={videoIndex === watchIndex}
							videoTitle={watchVideo.title}
							onloadvideo={() => loadTape(watchIndex, true)}
						/>
					</div>
				{/if}
			</div>
			<section class="liner" aria-labelledby="channel-about">
				<div class="paper-light" aria-hidden="true"></div>
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
		</div>
	</div>
{/if}

<style>
	.workbench-scene {
		position: relative;
		isolation: isolate;
		--lamp-glow: 0;
	}
	.lamp-lit {
		--lamp-glow: 1;
	}
	.channel-counter {
		display: grid;
		gap: 2.5rem;
		align-items: center;
	}
	.deckcol {
		position: relative;
		isolation: isolate;
		min-width: 0;
		scroll-margin-top: 1.5rem;
	}
	.screen-spill {
		position: absolute;
		z-index: -1;
		inset: -7rem 0 -1rem;
		pointer-events: none;
		opacity: 0;
		transition: opacity 850ms ease;
	}
	.screen-lit .screen-spill {
		opacity: 1;
	}
	.spill-light {
		width: 100%;
		height: 100%;
		background: radial-gradient(ellipse at 44% 50%, #54d2da40, #75a1c824 37%, transparent 70%);
		filter: blur(28px);
		animation: room-wakes 1250ms ease-out both;
	}
	.arriving .spill-light {
		animation-play-state: paused;
	}
	.tv-cable {
		position: absolute;
		z-index: -1;
		pointer-events: none;
		right: 0;
		top: 40%;
		width: 12%;
		height: 52%;
	}
	@keyframes room-wakes {
		0%,
		30% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
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
		container: programme / inline-size;
		min-width: 0;
		padding: 1rem 0;
	}
	.masthead {
		position: relative;
		isolation: isolate;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.2rem 1.3rem;
		border: 1px solid #a38caa55;
		border-radius: 6px;
		background: linear-gradient(130deg, #343041cc, #1d1924e6);
		box-shadow:
			0 9px 12px #100c1a66,
			inset 0 1px #e0b8d914,
			0 0 38px #f955c011;
	}
	.masthead::before {
		content: '';
		position: absolute;
		z-index: -1;
		inset: -7px 18px;
		background:
			linear-gradient(#92808b, #534550) left top / 14px 15px no-repeat,
			linear-gradient(#92808b, #534550) right top / 14px 15px no-repeat,
			linear-gradient(#534550, #92808b) left bottom / 14px 15px no-repeat,
			linear-gradient(#534550, #92808b) right bottom / 14px 15px no-repeat;
		border-radius: 4px;
		filter: drop-shadow(0 2px 2px #08070e);
	}
	.masthead::after {
		content: '';
		position: absolute;
		z-index: -2;
		right: 1.3rem;
		top: -4rem;
		width: 3rem;
		height: 4rem;
		border-right: 3px solid #15131c;
		border-top: 3px solid #15131c;
		border-radius: 0 12px 0 0;
		box-shadow: 1px -1px #8a647633;
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
		overflow-wrap: anywhere;
		font-size: var(--fs-h1);
		line-height: var(--lh-tight);
		text-shadow:
			-1px 0 #9bfff9,
			0 0 4px #fff4ff,
			0 0 16px #ff5ed194,
			0 0 35px #ff5ed14d;
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
		position: relative;
		isolation: isolate;
		display: grid;
		gap: 0.6rem;
		padding: 0.9rem 1rem 1.1rem;
		border: 1px solid #89758266;
		border-radius: 4px;
		background: linear-gradient(115deg, #342934, #15151e 55%, #332732);
		box-shadow:
			inset 0 2px 4px #08070d99,
			3px 5px 0 #100e17aa;
	}
	.tape-slot {
		position: relative;
		padding: 0.2rem 0 0.65rem;
		perspective: 900px;
	}
	.tape-slot::after {
		content: '';
		position: absolute;
		z-index: -1;
		left: -0.45rem;
		right: -0.45rem;
		bottom: -0.15rem;
		height: 0.65rem;
		border: 1px solid #77607080;
		border-radius: 2px;
		background: linear-gradient(#715766, #4b3847 2px, #201b27 4px);
		box-shadow: 0 5px 7px #08071080;
		pointer-events: none;
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
	a:focus-visible {
		outline: 2px solid var(--sub-bg);
		outline-offset: 4px;
	}
	.desk-surface {
		container: desk / inline-size;
		position: relative;
		isolation: isolate;
		margin: 3.5rem -1.5rem 0;
		padding: 1rem 1.5rem 2rem;
		border: 1px solid #ad846263;
		border-radius: 4px 4px 2px 2px;
		background:
			repeating-linear-gradient(1deg, #e1b88909 0 1px, transparent 1px 9px),
			linear-gradient(105deg, #51373b, #654737 55%, #49343a);
		box-shadow:
			inset 0 4px 0 #b3896666,
			0 15px 30px #0d0b1680;
	}
	.desk-surface::after {
		content: '';
		position: absolute;
		inset: auto -1px -17px;
		height: 17px;
		border: 1px solid #98725266;
		border-radius: 0 0 4px 4px;
		background: linear-gradient(#8a6348, #51372c 3px, #35262a 13px, #251d25);
		box-shadow: 0 10px 20px #100b1966;
	}
	.lamp-pool {
		position: absolute;
		z-index: 0;
		pointer-events: none;
		inset: 0;
		border-radius: inherit;
		background: radial-gradient(
			ellipse 42% 24rem at 42% 13rem,
			#ffe6bda3 0%,
			#ffdc9c73 20%,
			#f8cb8740 43%,
			#efb66e19 65%,
			#efb66e05 83%,
			#efb66e00 100%
		);
		mix-blend-mode: soft-light;
		opacity: var(--lamp-glow);
		transition: opacity 500ms ease;
	}
	.bench-tools {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr);
		gap: 2rem;
		align-items: end;
		height: 13rem;
		padding: 0 1.4rem;
	}
	.lamp-slot {
		position: relative;
		z-index: 2;
		min-width: 0;
	}
	.keyboard-notes {
		position: relative;
		align-self: end;
		justify-self: center;
		width: min(100%, 30rem);
		margin-bottom: 0.2rem;
	}
	.plan-sheet {
		position: absolute;
		z-index: -1;
		width: 10rem;
		left: -2rem;
		bottom: 4rem;
	}
	.watch-slot {
		position: relative;
		justify-self: end;
		min-width: 0;
		padding-right: 1.5rem;
	}
	.liner {
		position: relative;
		isolation: isolate;
		display: grid;
		grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
		gap: 1.3rem 2rem;
		margin: 1.6rem 0 0;
		padding: 2.5rem 3rem;
		color: #34243f;
		border: 1px solid #f8e3c5;
		border-radius: 3px 3px 12px 3px;
		background: #e6d8c5;
		box-shadow:
			5px 7px 0 #160b2780,
			0 18px 35px #09051445;
	}
	.paper-light {
		position: absolute;
		z-index: -1;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background: radial-gradient(
			ellipse 72% 105% at 32% 0%,
			#fff5dd 0%,
			#fff0d2f2 23%,
			#ffedcdab 44%,
			#ffebca52 65%,
			#ffebca14 82%,
			#ffebca00 100%
		);
		opacity: var(--lamp-glow);
		transition: opacity 500ms ease;
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
		overflow-wrap: anywhere;
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
		flex-wrap: wrap;
		overflow-wrap: anywhere;
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
		font-family: var(--font-body);
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
		.masthead {
			padding: 1rem 0.8rem;
			gap: 0.8rem;
		}
		.masthead::after {
			top: -2rem;
			height: 2rem;
		}
		.tape-list {
			padding: 0.6rem 0.8rem 0.9rem;
		}
		.desk-surface {
			margin: 3rem -0.2rem 0;
			padding: 0.6rem 0.3rem 1.5rem;
		}
		.bench-tools {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			height: auto;
			gap: 0.7rem 1rem;
			padding: 0 0.8rem;
		}
		.keyboard-notes {
			grid-column: 1 / -1;
			grid-row: 2;
			width: min(100%, 26rem);
			margin: 0;
		}
		.plan-sheet {
			width: 7rem;
			left: 0;
			bottom: 2.5rem;
		}
		.lamp-slot {
			width: min(100%, 10rem);
		}
		.watch-slot {
			grid-column: 2;
			grid-row: 1;
			max-width: 100%;
			padding-right: 0.7rem;
		}
		.avatar {
			width: 3.7rem;
		}
		.liner {
			grid-template-columns: minmax(0, 1fr);
			gap: 1.5rem;
			margin: 1.5rem 0.4rem 0;
			padding: min(2rem, 32px) min(1.5rem, 24px);
		}
		.liner::after {
			left: 0.65rem;
		}
		.ink-arrow {
			width: 2rem;
		}
	}
	@media (max-width: 23rem) {
		.programme {
			padding-inline: 0.3rem;
		}
		.tape-list {
			padding: 0.6rem min(0.7rem, 16px) 0.9rem;
		}
	}
	@container programme (max-width: 20rem) {
		.masthead {
			flex-wrap: wrap;
			padding: 16px;
		}
		.avatar {
			width: 60px;
		}
	}
	@container desk (max-width: 12rem) {
		.bench-tools {
			grid-template-columns: minmax(0, 1fr);
			justify-items: center;
			padding-inline: 12px;
			gap: 1rem;
		}
		.lamp-slot {
			max-width: 160px;
		}
		.watch-slot {
			grid-column: 1;
			grid-row: 2;
			justify-self: center;
			width: 65%;
			padding: 0;
		}
		.keyboard-notes {
			grid-row: 3;
		}
		.plan-sheet {
			max-width: 60%;
		}
		.nix-sticker {
			padding-inline: 12px;
			margin-left: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.spill-light {
			animation: none;
		}
		.screen-spill,
		.lamp-pool,
		.paper-light {
			transition: none;
		}
	}
</style>
