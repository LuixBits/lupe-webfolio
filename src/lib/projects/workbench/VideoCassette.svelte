<script lang="ts">
	import type { Video } from '$lib/content/schema';
	import * as m from '$lib/paraglide/messages';

	let {
		video,
		selected = false,
		onloadvideo
	}: { video: Video; selected?: boolean; onloadvideo: () => void } = $props();
	const runtime = $derived(
		video.duration == null
			? ''
			: `${Math.floor(video.duration / 60)}:${String(Math.floor(video.duration % 60)).padStart(2, '0')}`
	);
</script>

<button
	type="button"
	class="programme-tape"
	class:selected
	aria-pressed={selected}
	aria-controls="channel-player"
	aria-label={m.channel_load_video({ title: video.title })}
	aria-describedby={runtime ? `cassette-runtime-${video.id}` : undefined}
	onclick={onloadvideo}
>
	<span class="cassette-case">
		<span class="dust-flap" aria-hidden="true"></span>
		<span class="cassette-label">
			<span class="video-title">{video.title}</span>
			<span class="label-end">
				<svg class="selection-mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="m4 12 5 5L21 5"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				{#if runtime}<span class="duration" id={`cassette-runtime-${video.id}`}>{runtime}</span
					>{/if}
			</span>
		</span>
		<span class="tape-window" aria-hidden="true">
			{#snippet reel(radius: number)}
				<svg class="reel" viewBox="0 0 44 44" fill="none">
					<circle cx="22" cy="22" r="20" fill="#101015" stroke="#504957" />
					<circle cx="22" cy="22" r={radius} fill="#30262b" stroke="#776062" stroke-width=".8" />
					<circle cx="22" cy="22" r={radius - 2} stroke="#a3877940" stroke-width=".7" />
					<g class="reel-hub">
						<circle cx="22" cy="22" r="11" fill="#c6c0b1" stroke="#e2d9c7" />
						{#each [0, 60, 120, 180, 240, 300] as angle}
							<path d="M20 12h4l-1 5h-2Z" fill="#3d3840" transform={`rotate(${angle} 22 22)`} />
						{/each}
						<circle cx="22" cy="22" r="4" fill="#1c1b24" stroke="#958c87" />
					</g>
					<path d="M7 14c5-9 19-12 28-2" stroke="#e9d7c0" opacity=".13" />
				</svg>
			{/snippet}
			{@render reel(18)}
			<span class="tape-ribbon"></span>
			{@render reel(14)}
		</span>
		{#if video.poster}
			<span class="tape-art" aria-hidden="true">
				<img src={video.poster} width="1280" height="720" alt="" loading="lazy" />
			</span>
		{/if}
		<span class="case-fasteners" aria-hidden="true"></span>
	</span>
</button>

<style>
	.programme-tape {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		padding: 0;
		border: 0;
		border-radius: 6px;
		background: none;
		color: #302836;
		font: inherit;
		text-align: left;
		cursor: pointer;
		perspective: 900px;
		-webkit-tap-highlight-color: transparent;
	}
	.cassette-case {
		position: relative;
		isolation: isolate;
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 0.35rem;
		padding: 0.85rem 1rem 0.35rem;
		border: 1px solid #655866;
		border-radius: 6px 6px 4px 4px;
		background:
			repeating-linear-gradient(0deg, #ffffff04 0 1px, transparent 1px 4px),
			linear-gradient(130deg, #37323d, #22202a 52%, #2f2835);
		box-shadow:
			0 5px 0 #12121a,
			1px 6px 0 #5d4e5e,
			3px 10px 9px #08071099,
			inset 1px 1px #ffffff16;
		transform-origin: 55% 80%;
		transition:
			transform 280ms cubic-bezier(0.2, 0.7, 0.2, 1),
			box-shadow 280ms,
			border-color 180ms;
	}
	.cassette-case::before,
	.cassette-case::after {
		content: '';
		position: absolute;
		top: 1.3rem;
		bottom: 0.75rem;
		width: 5px;
		border-radius: 1px;
		background: repeating-linear-gradient(#080b1266 0 2px, #8272833d 2px 3px);
	}
	.cassette-case::before {
		left: 4px;
	}
	.cassette-case::after {
		right: 4px;
	}
	.dust-flap {
		position: absolute;
		top: 2px;
		left: 9%;
		right: 9%;
		height: 8px;
		border: 1px solid #0e1019;
		border-top-color: #89768766;
		border-radius: 1px 1px 3px 3px;
		background: linear-gradient(#514452, #26212e);
	}
	.cassette-label {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.6rem;
		flex: 1;
		min-height: 2.8rem;
		padding: 0.35rem 0.7rem;
		border: 1px solid #c8baa2;
		border-left: 3px solid #95839f;
		border-radius: 2px;
		background: #e9dec7;
		box-shadow:
			0 1px 2px #0007,
			inset 0 0 0 2px #f9edd534;
	}
	.video-title {
		display: block;
		font-size: var(--fs-body);
		line-height: var(--lh-body);
		overflow-wrap: anywhere;
	}
	.label-end {
		display: flex;
		flex-direction: column;
		align-items: end;
		justify-content: space-between;
		align-self: stretch;
		gap: 0.3rem;
	}
	.duration {
		font-size: var(--fs-small);
		line-height: var(--lh-body);
		font-variant-numeric: tabular-nums;
		color: #65525f;
	}
	.selection-mark {
		width: 1.1rem;
		height: 1.1rem;
		visibility: hidden;
		color: #365e55;
	}
	.selected .selection-mark {
		visibility: visible;
	}
	.tape-window {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.35rem;
		width: calc(100% - 5.1rem);
		margin: 0 0.2rem;
		padding: 0.1rem 0.4rem;
		border: 1px solid #6d627080;
		border-radius: 7px;
		background: linear-gradient(145deg, #090d16, #272531 70%, #39303b);
		box-shadow: inset 0 2px 3px #0008;
	}
	.tape-window::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: linear-gradient(
			125deg,
			transparent 15%,
			#ecddff0a 25%,
			transparent 37% 68%,
			#ecddff0d 80%,
			transparent 90%
		);
		pointer-events: none;
	}
	.reel {
		display: block;
		flex: none;
		width: 1.55rem;
		height: 1.55rem;
	}
	.reel-hub {
		transform-origin: 22px 22px;
		transition: transform 450ms cubic-bezier(0.2, 0.7, 0.3, 1);
	}
	.tape-art {
		position: absolute;
		z-index: 1;
		right: 1.05rem;
		bottom: -0.2rem;
		display: block;
		width: 4.1rem;
		padding: 2px 2px 4px;
		border: 1px solid #efe6ce;
		border-radius: 1px 1px 3px 1px;
		background: #e8dcc4;
		box-shadow:
			1px 2px 2px #09081188,
			2px 4px 4px #09081140;
		transform: rotate(4deg);
	}
	.tape-art img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}
	.tape-ribbon {
		display: block;
		flex: 1;
		height: 0.45rem;
		border-block: 1px solid #826b6740;
		background: linear-gradient(#443039, #1c1820);
	}
	.case-fasteners {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(circle, #17131d 1px, #8f8289 1px 2px, transparent 2.5px) 6px 6px / 5px 5px
				no-repeat,
			radial-gradient(circle, #17131d 1px, #8f8289 1px 2px, transparent 2.5px) calc(100% - 6px)
				6px / 5px 5px no-repeat,
			radial-gradient(circle, #17131d 1px, #8f8289 1px 2px, transparent 2.5px) 6px
				calc(100% - 5px) / 5px 5px no-repeat,
			radial-gradient(circle, #17131d 1px, #8f8289 1px 2px, transparent 2.5px) calc(100% - 6px)
				calc(100% - 5px) / 5px 5px no-repeat;
	}
	.selected .cassette-case {
		border-color: #8dc1bb;
		box-shadow:
			0 5px 0 #13151b,
			1px 6px 0 #7a9e9d,
			3px 10px 9px #08071099,
			inset 1px 1px #ffffff16;
	}
	.programme-tape:focus-visible {
		outline: 2px solid var(--sub-bg);
		outline-offset: 6px;
		z-index: 2;
	}
	.programme-tape:focus-visible .cassette-case {
		transform: translateY(-3px) rotateX(3deg) rotateY(-3deg);
	}
	@media (hover: hover) and (pointer: fine) {
		.programme-tape:hover {
			z-index: 2;
		}
		.programme-tape:hover .cassette-case {
			transform: translate3d(-2px, -4px, 10px) rotateX(5deg) rotateY(-5deg) rotateZ(-0.7deg);
			border-color: #c4a3c4;
			box-shadow:
				0 6px 0 #14121a,
				1px 7px 0 #8d748c,
				7px 17px 13px #080710aa,
				inset 1px 1px #ffffff21;
		}
		.programme-tape:hover .reel-hub {
			transform: rotate(48deg);
		}
	}
	.programme-tape:focus-visible .reel-hub {
		transform: rotate(48deg);
	}
	.programme-tape:active .cassette-case {
		transform: translateY(1px);
	}
	@media (max-width: 40rem) {
		.cassette-case {
			padding-inline: 0.85rem;
		}
		.cassette-label {
			padding: 0.35rem 0.5rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.cassette-case,
		.reel-hub {
			transition: none;
		}
		.programme-tape:is(:hover, :focus-visible, :active) .cassette-case,
		.programme-tape:is(:hover, :focus-visible) .reel-hub {
			transform: none;
		}
	}
</style>
