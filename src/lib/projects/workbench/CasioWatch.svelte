<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	let {
		selected = false,
		videoTitle,
		onloadvideo
	}: {
		selected?: boolean;
		videoTitle: string;
		onloadvideo: () => void;
	} = $props();
</script>

<button
	class="casio-watch"
	class:selected
	type="button"
	onclick={onloadvideo}
	aria-label={m.channel_load_video({ title: videoTitle })}
	aria-pressed={selected}
	aria-controls="channel-player"
	title={m.workbench_watch_hint()}
>
	<svg viewBox="0 0 160 280" fill="none" aria-hidden="true">
		<defs>
			<linearGradient
				id="bench-watch-case"
				x1="25"
				y1="75"
				x2="125"
				y2="205"
				gradientUnits="userSpaceOnUse"
			>
				<stop stop-color="#555664" /><stop offset=".3" stop-color="#232936" /><stop
					offset=".7"
					stop-color="#121924"
				/><stop offset="1" stop-color="#494752" />
			</linearGradient>
		</defs>
		<path
			d="M49 6q31-7 62 0l5 266q-36 7-71 0Z"
			fill="#171b25"
			stroke="#57565d"
			stroke-width="1.5"
		/>
		{#each [17, 28, 39, 50, 61, 216, 227, 238, 249, 260] as y}
			<path d={`M52 ${y}h57`} stroke="#080e16" stroke-width="5" />
			<path d={`M53 ${y - 2}h55`} stroke="#42444e" stroke-width="1.5" />
		{/each}
		<path
			d="M12 112h8v23h-8zm128-1h8v25h-8zm0 49h8v17h-8z"
			fill="#92918c"
			stroke="#20232a"
			stroke-width="2"
		/>
		<path
			d="M34 73h92l14 14v101l-16 18H35l-16-18V88Z"
			fill="url(#bench-watch-case)"
			stroke="#969189"
			stroke-width="2"
		/>
		<path d="M39 81h82l11 13v87l-13 16H42l-14-15V96Z" stroke="#687781" stroke-width="1.5" />
		<rect
			x="35"
			y="100"
			width="91"
			height="65"
			rx="5"
			fill="#131f26"
			stroke="#c0a977"
			stroke-width="2"
		/>
		<rect class="lcd" x="40" y="106" width="81" height="53" rx="2" fill="#a8b69b" />
		<path d="M43 109h74v9H43z" fill="#e9f0ca" opacity=".18" />
		<path d="M40 174h17m14 0h19m14 0h15" stroke="#a49072" stroke-width="2" />
		<path d="M38 185h15m15 0h21m15 0h17" stroke="#545b69" stroke-width="4" />
	</svg>
	<span class="watch-brand" aria-hidden="true">CASIO</span>
	<span class="watch-screen" aria-hidden="true">4:20</span>
	<span class="watch-hint" aria-hidden="true">{m.workbench_watch_hint()}</span>
</button>

<style>
	.casio-watch {
		font: inherit;
		position: relative;
		display: block;
		width: 8rem;
		max-width: 100%;
		flex: none;
		padding: 0;
		border: 0;
		border-radius: 12px;
		background: none;
		cursor: pointer;
		transform: rotate(13deg);
		filter: drop-shadow(4px 7px 3px #0b0b1377);
		-webkit-tap-highlight-color: transparent;
	}
	.casio-watch > svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.watch-brand {
		position: absolute;
		top: 28.7%;
		left: 20%;
		width: 60%;
		font: 700 var(--fs-small) var(--font-body);
		line-height: 1;
		color: #e0d9c5;
		text-align: center;
	}
	.watch-screen {
		position: absolute;
		top: 40%;
		left: 25%;
		width: 51%;
		height: 14%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		font: 700 var(--fs-small) var(--font-body);
		color: #24392e;
		line-height: 1;
	}
	.lcd {
		transition: fill 180ms;
	}
	.casio-watch:hover .lcd,
	.casio-watch:focus-visible .lcd,
	.selected .lcd {
		fill: #c0edc6;
	}
	.casio-watch:active {
		transform: rotate(13deg) translateY(2px);
	}
	.casio-watch:focus-visible {
		outline: 2px solid var(--sub-bg);
		outline-offset: 6px;
	}
	.watch-hint {
		position: absolute;
		top: 46%;
		right: calc(100% + 0.7rem);
		width: max-content;
		max-width: 12rem;
		padding: 0.55rem 0.7rem;
		border: 1px solid #bba286;
		border-radius: 3px;
		background: #f7e9d3;
		color: #34243f;
		font: var(--fs-small) / var(--lh-body) var(--font-body);
		transform: rotate(-13deg);
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
	}
	.casio-watch:hover .watch-hint,
	.casio-watch:focus-visible .watch-hint {
		opacity: 1;
		visibility: visible;
	}
	@media (prefers-reduced-motion: reduce) {
		.lcd {
			transition: none;
		}
	}
	@media (max-width: 40rem) {
		.casio-watch {
			width: clamp(6rem, 27vw, 7rem);
		}
	}
</style>
