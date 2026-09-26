<script lang="ts">
	import { getContext, tick, untrack } from 'svelte';
	import { resolveLocalized, type Project } from '$lib/content/schema';
	import * as m from '$lib/paraglide/messages';
	import CrtCabinet from './CrtCabinet.svelte';
	import PowerOn from './PowerOn.svelte';
	import TapeArtwork from './TapeArtwork.svelte';
	import { projectNavigation, type ProjectNavigation } from './navigation';

	let { project, locale }: { project: Project; locale: string } = $props();
	const navigation = getContext<ProjectNavigation | undefined>(projectNavigation);
	const shots = $derived(project.screenshots);
	const demo = $derived(project.demo?.embed);
	const title = $derived(resolveLocalized(project.title, locale));
	type Channel = 'stills' | 'video' | 'demo';
	const channels = $derived.by(() => {
		const list: { id: Channel; label: string }[] = [];
		if (shots.length) list.push({ id: 'stills', label: m.tv_ch_stills() });
		if (project.videos.length) list.push({ id: 'video', label: m.tv_ch_video() });
		if (demo) list.push({ id: 'demo', label: m.tv_ch_demo() });
		return list;
	});
	let active = $state<Channel>(untrack(() => channels[0]?.id ?? 'video'));
	let powered = $state(true);
	let live = $state(false);
	let stillIdx = $state(0);
	let videoIdx = $state(0);
	let signalVersion = $state(0);
	let revealDuration = $state(820);
	let shell = $state<HTMLDivElement>();
	let playButton = $state<HTMLButtonElement>();
	let hintLabel = $state<HTMLSpanElement>();
	let hintPath = $state('');
	let hintViewBox = $state('0 0 660 510');
	const video = $derived(project.videos[videoIdx]);
	const showHint = $derived(powered && !live && active !== 'stills');
	const feedTitle = $derived(
		active === 'video'
			? (video?.title ?? title)
			: demo
				? resolveLocalized(demo.title, locale)
				: title
	);
	const transport = $derived(
		!powered
			? 'OFF'
			: live
				? 'PLAY ▸'
				: active === 'stills'
					? `IMG ${stillIdx + 1}/${shots.length}`
					: 'STANDBY'
	);
	const videoSrc = $derived(
		!video
			? ''
			: video.provider === 'youtube'
				? `https://www.youtube-nocookie.com/embed/${video.src}?autoplay=1&rel=0`
				: video.provider === 'vimeo'
					? `https://player.vimeo.com/video/${video.src}?autoplay=1`
					: video.src
	);
	const demoRatio = $derived.by(() => {
		const parts = (demo?.aspect ?? '16 / 9').split('/').map(Number);
		const ratio = parts[0] / (parts[1] ?? 1);
		return Number.isFinite(ratio) && ratio > 0 ? ratio : 16 / 9;
	});

	function measureHint() {
		if (!shell || !playButton || !hintLabel) return;
		const frame = shell.getBoundingClientRect();
		const button = playButton.getBoundingClientRect();
		const label = hintLabel.getBoundingClientRect();
		if (!frame.width || !frame.height) return;
		const x = label.left - frame.left + label.width / 2;
		const y = label.bottom - frame.top + 5;
		const endX = button.right - frame.left + 7;
		const endY = button.top - frame.top + button.height / 2;
		hintViewBox = `0 0 ${frame.width} ${frame.height}`;
		hintPath = `M${x} ${y}C${x + 30} ${y + 50} ${endX + frame.width * 0.18} ${endY + 24} ${endX} ${endY}M${endX + 11} ${endY - 5}L${endX} ${endY}L${endX + 10} ${endY + 7}`;
	}
	$effect(() => {
		if (!showHint || !shell || !playButton || !hintLabel) return;
		const observer = new ResizeObserver(measureHint);
		observer.observe(shell);
		observer.observe(playButton);
		observer.observe(hintLabel);
		const frame = requestAnimationFrame(measureHint);
		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	});
	function tune(channel: Channel) {
		if (active === channel && powered) return;
		active = channel;
		powered = true;
		live = false;
		stillIdx = 0;
		revealDuration = 460;
		signalVersion += 1;
	}
	function power() {
		powered = !powered;
		live = false;
		revealDuration = 820;
		signalVersion += 1;
	}
	async function eject() {
		live = false;
		await tick();
		playButton?.focus({ preventScroll: true });
	}
	function nextVideo(direction: number) {
		videoIdx = (videoIdx + direction + project.videos.length) % project.videos.length;
		live = false;
		revealDuration = 460;
		signalVersion += 1;
	}
</script>

<section class="deck" aria-label={title}>
	<div class="shell" bind:this={shell}>
		<div class="screen" class:idle={!live} class:off={!powered}>
			{#if powered}
				{#if active === 'stills' && shots[stillIdx]}
					{@const shot = shots[stillIdx]}
					<img
						class="still"
						src={shot.image.src}
						width={shot.image.width}
						height={shot.image.height}
						alt={resolveLocalized(shot.image.alt, locale)}
						decoding="async"
					/>
					<span class="osd top">STILL · {stillIdx + 1}/{shots.length}</span>
					{#if shot.caption}<span class="osd caption">{resolveLocalized(shot.caption, locale)}</span
						>{/if}
				{:else if active === 'video' && live && video}
					{#if video.provider === 'file'}
						<!-- svelte-ignore a11y_media_has_caption -->
						<video class="file-video" controls autoplay poster={video.poster}
							><source src={video.src} /></video
						>
					{:else}
						<div class="signal-frame" style:--signal-ratio={16 / 9}>
							<iframe
								class="signal"
								src={videoSrc}
								title={video.title}
								allow="autoplay; encrypted-media; picture-in-picture"
								allowfullscreen
							></iframe>
						</div>
					{/if}
				{:else if active === 'demo' && live && demo}
					<div class="signal-frame" style:--signal-ratio={demoRatio}>
						<iframe
							class="signal"
							src={demo.src}
							title={resolveLocalized(demo.title, locale)}
							sandbox="allow-scripts allow-same-origin allow-pointer-lock"
							allowfullscreen
						></iframe>
					</div>
				{:else}
					<span class="osd top">AV 1 · READY</span>
					<div class="poster">
						{#if active === 'video' && video?.poster}<img
								class="poster-image"
								src={video.poster}
								alt=""
							/>{/if}
						<div class="poster-art"><TapeArtwork {project} /></div>
						<p class="feed-title">{feedTitle}</p>
						<button class="play" type="button" bind:this={playButton} onclick={() => (live = true)}
							><span aria-hidden="true">▶</span>
							{active === 'demo' ? m.tv_play_demo() : m.tv_play_video()}</button
						>
					</div>
				{/if}
				{#key signalVersion}
					<PowerOn duration={revealDuration} delay={navigation?.moving ? 640 : 0} />
				{/key}
			{/if}
			<span class="glass" aria-hidden="true"></span>
		</div>
		<CrtCabinet id={`crt-${project.slug}`} {powered} />
		<button
			class="power"
			type="button"
			onclick={power}
			aria-label={powered ? m.tv_power_off() : m.tv_power_on()}
			aria-pressed={powered}><span aria-hidden="true">⏻</span></button
		>
		{#if showHint}
			<span class="play-hint" bind:this={hintLabel} aria-hidden="true">{m.tv_press_play()}</span>
			<svg class="hint-line" viewBox={hintViewBox} fill="none" aria-hidden="true"
				><path
					d={hintPath}
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/></svg
			>
		{/if}
	</div>

	<div class="recorder">
		<span class="brand" aria-hidden="true">LUPE · VIDEO CASSETTE RECORDER</span>
		<div class="transport">
			<span class="slot" aria-hidden="true">VHS · HQ</span>
			<output class="display" aria-live="polite">{transport}</output>
			{#if active === 'stills' && shots.length > 1 && powered}
				<button
					type="button"
					class="hardware small"
					aria-label={m.tv_previous_image()}
					onclick={() => (stillIdx = (stillIdx - 1 + shots.length) % shots.length)}
					><span aria-hidden="true">◀</span></button
				>
				<button
					type="button"
					class="hardware small"
					aria-label={m.tv_next_image()}
					onclick={() => (stillIdx = (stillIdx + 1) % shots.length)}
					><span aria-hidden="true">▶</span></button
				>
			{/if}
			<button
				type="button"
				class="hardware small eject"
				onclick={eject}
				aria-label={m.tv_eject()}
				disabled={!live}><span aria-hidden="true">⏏</span></button
			>
		</div>
		{#if channels.length > 1}
			<div class="channels" role="group" aria-label={m.tv_channels()}>
				{#each channels as channel, i (channel.id)}
					<button
						type="button"
						class="hardware channel"
						aria-pressed={powered && active === channel.id}
						onclick={() => tune(channel.id)}
						><span class="channel-number" aria-hidden="true">0{i + 1}</span>{channel.label}<span
							class="led"
							aria-hidden="true"
						></span></button
					>
				{/each}
			</div>
		{/if}
	</div>
	<div class="counter-top" aria-hidden="true"></div>
	{#if active === 'stills' && shots.length > 1 && powered}
		<div class="thumbs" role="group" aria-label={m.tv_ch_stills()}>
			{#each shots as shot, i (shot.id)}<button
					type="button"
					class:current={stillIdx === i}
					aria-label={m.tv_image_number({ number: i + 1 })}
					aria-pressed={stillIdx === i}
					onclick={() => (stillIdx = i)}
					><img
						src={shot.image.thumb ?? shot.image.src}
						width={shot.image.width}
						height={shot.image.height}
						alt=""
						loading="lazy"
					/></button
				>{/each}
		</div>
	{/if}
	{#if active === 'video' && project.videos.length > 1 && powered}
		<div class="video-selection">
			<button
				class="hardware"
				type="button"
				onclick={() => nextVideo(-1)}
				aria-label={m.tv_previous_video()}>◀</button
			><span>{videoIdx + 1} / {project.videos.length} · {video?.title}</span><button
				class="hardware"
				type="button"
				onclick={() => nextVideo(1)}
				aria-label={m.tv_next_video()}>▶</button
			>
		</div>
	{/if}
</section>

<style>
	.deck {
		position: relative;
		isolation: isolate;
		min-width: 0;
		padding-top: 2.8rem;
	}
	.shell {
		position: relative;
		aspect-ratio: 660 / 510;
		filter: drop-shadow(0 20px 21px #0007);
	}
	.screen {
		position: absolute;
		left: 13.3333%;
		top: 13.3333%;
		width: 67.4242%;
		height: 65.4902%;
		background: #080a10;
		border-radius: 8% / 7%;
		overflow: hidden;
		z-index: 1;
		display: grid;
		place-items: center;
		container-type: size;
	}
	.screen.off {
		background: radial-gradient(ellipse, #242831, #070a0d 85%);
	}
	.glass {
		position: absolute;
		inset: 0;
		z-index: 4;
		pointer-events: none;
		border-radius: inherit;
		background: linear-gradient(130deg, #ffffff0b, transparent 24%, transparent 73%, #88c3d205);
		box-shadow: inset 0 0 18px #0008;
	}
	.idle .glass {
		background:
			linear-gradient(130deg, #ffffff0b, transparent 24%, transparent 73%, #88c3d205),
			repeating-linear-gradient(transparent 0 3px, #0002 3px 4px);
	}
	.off .glass {
		background: linear-gradient(130deg, #ffffff10, transparent 44%);
	}
	.still,
	.file-video {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 0;
		object-fit: contain;
	}
	.signal-frame {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		width: min(100cqw, calc(100cqh * var(--signal-ratio)));
		height: min(100cqh, calc(100cqw / var(--signal-ratio)));
	}
	.signal {
		display: block;
		border: 0;
		width: 100%;
		height: 100%;
		background: #080a10;
	}
	.poster {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: clamp(0.5rem, 2cqw, 1rem);
		padding: 12%;
		text-align: center;
		background: radial-gradient(ellipse at 50% 70%, #4b2c5366, transparent 75%);
	}
	.poster-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.25;
	}
	.poster-art {
		position: relative;
		flex: none;
		width: clamp(2rem, 18cqw, 5rem);
		height: clamp(2rem, 18cqw, 5rem);
		color: var(--sub-bg);
	}
	.feed-title {
		position: relative;
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(0.8rem, 4.8cqw, 1.3rem);
		line-height: 1.2;
		color: #efe9f4;
		max-width: 100%;
	}
	.play {
		position: relative;
		z-index: 5;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.65em;
		min-height: 44px;
		padding: 0.65em 1.3em;
		border: 0;
		border-radius: 3px;
		background: #eaddc7;
		box-shadow: 0 3px 0 #8f8374;
		font-family: var(--font-body);
		font-size: clamp(0.6rem, 2.8cqw, 0.8rem);
		font-weight: 700;
		color: #25232a;
		cursor: pointer;
	}
	.play:active {
		transform: translateY(2px);
		box-shadow: 0 1px 0 #8f8374;
	}
	.osd {
		position: absolute;
		z-index: 3;
		left: 5%;
		color: #94eab1;
		font-family: var(--font-body);
		font-size: clamp(0.48rem, 2.3cqw, 0.65rem);
		letter-spacing: 0.08em;
		text-shadow: 0 0 4px #9eeaac6b;
		pointer-events: none;
	}
	.osd.top {
		top: 5%;
	}
	.caption {
		bottom: 5%;
		max-width: 88%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		background: #0006;
		padding: 0.12em 0.4em;
	}
	.power {
		position: absolute;
		z-index: 3;
		left: 9.4%;
		top: 86.3%;
		transform: translate(-50%, -50%);
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		background: transparent;
		padding: 0;
		cursor: pointer;
	}
	.power span {
		display: grid;
		place-items: center;
		min-width: 22px;
		width: 4.5cqw;
		max-width: 32px;
		height: 16px;
		border-radius: 3px;
		background: linear-gradient(#51545a, #292c30);
		border: 1px solid #191a1c;
		font:
			10px Arial,
			sans-serif;
		color: #c9d1d4;
	}
	.power:active span {
		background: #191b20;
	}
	.play-hint {
		position: absolute;
		right: 1.5%;
		top: -2.5rem;
		transform: rotate(-8deg);
		font:
			italic 1.05rem Georgia,
			serif;
		color: #f7d89c;
		z-index: 5;
		pointer-events: none;
	}
	.hint-line {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
		z-index: 5;
		color: #f7d89c;
	}
	.recorder {
		position: relative;
		margin: -4% 5% 0 3%;
		padding: 1.2rem 0.85rem 0.55rem;
		border: 1px solid #51515d;
		border-radius: 4px;
		background: linear-gradient(#41434b, #252730 10%, #22242c 80%, #13151c);
		box-shadow: 0 12px 20px #0006;
	}
	.brand {
		position: absolute;
		top: 0.3rem;
		left: 0.85rem;
		color: #aaa7b3;
		font-size: 0.38rem;
		letter-spacing: 0.15em;
	}
	.transport {
		display: flex;
		gap: 0.35rem;
		align-items: center;
	}
	.slot {
		flex: 1;
		background: #111319;
		box-shadow: inset 0 2px 3px #0008;
		border-bottom: 1px solid #4c4d55;
		height: 22px;
		color: #8c8695;
		font-size: 0.4rem;
		letter-spacing: 0.13em;
		text-align: center;
		padding: 5px;
	}
	.display {
		margin-left: auto;
		padding: 0.4rem 0.6rem;
		color: #a3ebc6;
		background: #0c1716;
		border: 1px solid #343e3d;
		letter-spacing: 0.12em;
		font-size: 0.6rem;
		text-shadow: 0 0 8px #a3ebc633;
		white-space: nowrap;
	}
	.hardware {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		min-height: 44px;
		padding: 0.45rem 0.7rem;
		border: 1px solid #11131c;
		border-bottom: 3px solid #101018;
		border-radius: 3px;
		background: linear-gradient(#50515a, #2e2e39);
		color: #e2dce7;
		font: 700 0.65rem var(--font-body);
		cursor: pointer;
	}
	.hardware.small {
		width: 44px;
		padding: 0;
		flex: none;
	}
	.hardware:active,
	.hardware[aria-pressed='true'] {
		background: linear-gradient(#202129, #32333d);
		box-shadow: inset 0 2px 5px #0008;
	}
	.hardware:disabled {
		opacity: 0.35;
		cursor: default;
	}
	.channels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 0.65rem;
		padding-top: 0.65rem;
		border-top: 1px solid #51515b66;
	}
	.channel-number {
		font-size: 0.48rem;
		color: #9aadb7;
	}
	.led {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #1a272c;
	}
	.hardware[aria-pressed='true'] .led {
		background: var(--sub-bg);
		box-shadow: 0 0 6px var(--sub-bg);
	}
	.counter-top {
		position: relative;
		height: 13px;
		margin: 0 0 0;
		background: linear-gradient(#55545b, #282630 4px, #1b1924 5px);
		box-shadow: 0 14px 26px #0008;
		z-index: -1;
	}
	.counter-top::before {
		content: '';
		position: absolute;
		top: 1px;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, var(--sub-bg), #b5cad067, var(--accent));
		box-shadow: 0 0 16px #96ced833;
	}
	.thumbs {
		display: flex;
		gap: 0.6rem;
		padding: 0.9rem 0.5rem 0.5rem;
		overflow-x: auto;
	}
	.thumbs button {
		width: 5.4rem;
		min-height: 44px;
		flex: none;
		padding: 3px;
		border-radius: 4px;
		border: 1px solid #82679a;
		background: var(--hub-bg);
		opacity: 0.65;
		cursor: pointer;
	}
	.thumbs button.current {
		opacity: 1;
		border-color: var(--accent);
		box-shadow: 0 0 9px color-mix(in srgb, var(--accent) 35%, transparent);
	}
	.thumbs img {
		display: block;
		width: 100%;
		height: auto;
	}
	.video-selection {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin: 1rem 0.5rem 0;
		font-size: 0.7rem;
		color: var(--fg-muted);
	}
	.video-selection span {
		flex: 1;
	}
	button:focus-visible {
		outline: 2px solid var(--sub-bg);
		outline-offset: 4px;
	}
	@media (max-width: 40rem) {
		.recorder {
			padding: 1.2rem 0.55rem 0.45rem;
		}
		.brand {
			left: 0.55rem;
			font-size: 0.33rem;
		}
		.transport {
			gap: 0.2rem;
		}
		.display {
			font-size: 0.5rem;
			padding: 0.35rem;
		}
		.slot {
			min-width: 0;
			font-size: 0.3rem;
		}
		.hardware {
			font-size: 0.58rem;
			padding: 0.4rem;
		}
		.poster {
			padding: 10%;
			gap: 0.45rem;
		}
		.play {
			padding: 0.4rem 0.7rem;
		}
		.play-hint {
			right: 3%;
			font-size: 0.95rem;
		}
	}
</style>
