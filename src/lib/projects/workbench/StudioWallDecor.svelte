<script lang="ts">
	import StudioShelfArt from './StudioShelfArt.svelte';
	const id = $props.id();
</script>

<!-- Personal wall art; the programme and its controls remain the reading order. -->
<div class="studio-gallery" aria-hidden="true">
	<div class="linux-corner">
		<figure class="framed-print linux-print">
			<div class="poster-art tux-art">
				<span class="sun-disc"></span>
				<img src="/media/projects/luixbits/tux.svg" width="210" height="249" alt="" />
			</div>
			<figcaption>Linux</figcaption>
		</figure>
		<div class="hardware-shelf"><StudioShelfArt /></div>
	</div>
	<div class="neovim-corner">
		<figure class="framed-print neovim-print">
			<div class="poster-art nvim-art">
				<img src="/media/projects/luixbits/neovim-mark.svg" width="602" height="734" alt="" />
				<svg class="vim-keys" viewBox="0 0 160 38" fill="none">
					{#each ['h', 'j', 'k', 'l'] as key, index}
						<g transform={`translate(${index * 40} 0)`}>
							<rect x="1" y="3" width="34" height="34" rx="3" fill="#526476" stroke="#0b182b" />
							<rect x="1" y="1" width="34" height="29" rx="3" fill="#c4d4c9" stroke="#a7c5ba" />
							<text
								x="18"
								y="23"
								text-anchor="middle"
								fill="#28334e"
								font-family="var(--font-body)"
								font-size="24">{key}</text
							>
						</g>
					{/each}
				</svg>
			</div>
			<figcaption>Neovim <span class="vim-command">:wq</span></figcaption>
		</figure>
		<figure class="sunset-print">
			<svg viewBox="0 0 240 290" fill="none">
				<defs>
					<linearGradient id={`${id}-sky`} x2=".2" y2="1"
						><stop stop-color="#3b315b" /><stop offset="1" stop-color="#a87599" /></linearGradient
					>
					<linearGradient id={`${id}-sun`} x2="0" y2="1"
						><stop stop-color="#ffdda9" /><stop offset="1" stop-color="#f594c6" /></linearGradient
					>
				</defs>
				<path d="M25 25 120 0l95 25" stroke="#9d8b9b" stroke-width="2" />
				<path d="M5 30h230v258H5Z" fill="#100e23" opacity=".3" />
				<path d="M0 20h234v258H0Z" fill="#9f7d79" stroke="#d6b2a1" stroke-width="3" />
				<path d="M12 32h210v234H12Z" fill="#d8b8a0" />
				<path d="M25 45h184v207H25Z" fill={`url(#${id}-sky)`} />
				<circle cx="139" cy="113" r="49" fill={`url(#${id}-sun)`} />
				<path d="M90 117h98m-95 13h90m-82 13h74m-58 12h42" stroke="#8b5e86" stroke-width="4" />
				<path d="m25 192 52-49 60 60 40-33 32 23v59H25Z" fill="#515d84" />
				<path d="m25 225 54-42 68 58 62-27v38H25Z" fill="#2b354f" />
				<path d="m27 79 51-30m-44 7 14-9" stroke="#eee4dc" stroke-width="4" opacity=".12" />
				<path d="M0 278h234" stroke="#514159" stroke-width="5" />
			</svg>
		</figure>
	</div>
</div>

<style>
	.studio-gallery {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 2rem;
		max-width: 620px;
		margin: 0 auto;
		padding: 5rem 24px 4rem;
		pointer-events: none;
	}
	.linux-corner,
	.neovim-corner {
		min-width: 0;
	}
	.framed-print {
		position: relative;
		margin: 0;
		padding: 14px 14px 10px;
		border: 6px solid #534955;
		border-top-color: #938094;
		border-left-color: #9a8294;
		background: #e2d6c1;
		box-shadow:
			2px 3px 0 #201a2b,
			9px 16px 16px #100f2566,
			inset 0 0 0 1px #fff6;
		transform: rotate(-3deg);
	}
	.framed-print::before {
		content: '';
		position: absolute;
		top: -28px;
		left: 25%;
		width: 50%;
		height: 28px;
		clip-path: polygon(0 100%, 50% 0, 100% 100%, 97% 100%, 50% 8%, 3% 100%);
		background: #ad93a4;
	}
	.framed-print::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(118deg, #fff0 15%, #d9f7f011 15% 24%, #fff0 24% 71%, #fce9fe0a 71%);
	}
	.poster-art {
		position: relative;
		isolation: isolate;
		display: grid;
		place-items: center;
		aspect-ratio: 4 / 5;
		overflow: hidden;
	}
	.tux-art {
		background: #2d344c;
	}
	.tux-art::after {
		content: '';
		position: absolute;
		inset: 60% 0 0;
		background: repeating-linear-gradient(0deg, #e48abb30 0 1px, transparent 1px 17px);
		z-index: -1;
	}
	.sun-disc {
		position: absolute;
		z-index: -1;
		top: 8%;
		left: 15%;
		width: 70%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: linear-gradient(#e6b4ac, #a76c9f);
	}
	.tux-art img {
		display: block;
		width: 82%;
		height: auto;
		margin-top: 5%;
		filter: drop-shadow(0 6px 3px #141b2b55);
	}
	figcaption {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.2rem 0.5rem;
		margin-top: 0.6rem;
		color: #322f43;
		font-size: var(--fs-body);
		line-height: var(--lh-tight);
	}
	.linux-print figcaption {
		justify-content: center;
	}
	.neovim-print {
		transform: rotate(2deg);
		background: #d4dfd8;
		border-color: #354a58;
		border-top-color: #759998;
		border-left-color: #94b2a6;
	}
	.nvim-art {
		background: radial-gradient(ellipse at 50% 30%, #3c5865, #172a3b 80%);
		padding: 10%;
		align-content: space-between;
		gap: 12px;
	}
	.nvim-art img {
		display: block;
		width: 62%;
		height: auto;
	}
	.vim-keys {
		display: block;
		width: 100%;
		height: auto;
	}
	.vim-command {
		color: #385b55;
	}
	.hardware-shelf {
		margin: 2rem -10px 0;
	}
	.hardware-shelf :global(svg) {
		display: block;
		width: 100%;
		height: auto;
	}
	.sunset-print {
		margin: 2rem auto 0;
		width: 75%;
		max-width: 190px;
		transform: rotate(4deg);
		filter: drop-shadow(8px 12px 6px #15122c66);
	}
	.sunset-print svg {
		display: block;
		width: 100%;
		height: auto;
	}
	@container studio-room (min-width: 65rem) {
		.studio-gallery {
			position: absolute;
			top: -13rem;
			right: 0;
			width: calc(100cqw - 440px);
			max-width: 820px;
			padding: 0;
			gap: 2rem;
			grid-template-columns: 1.1fr 1fr;
		}
		.linux-corner,
		.neovim-corner {
			display: flex;
			align-items: end;
			gap: 20px;
		}
		.framed-print {
			width: 135px;
			flex: none;
			padding: 8px 8px 7px;
			border-width: 4px;
		}
		figcaption {
			margin-top: 0.3rem;
		}
		.hardware-shelf {
			margin: 0;
			width: 200px;
		}
		.sunset-print {
			width: 110px;
			margin: 0 0 12px;
		}
		.vim-command {
			display: none;
		}
		.nvim-art {
			padding: 8%;
			gap: 8px;
		}
	}
	@container studio-room (min-width: 110rem) {
		.studio-gallery {
			inset: 0 auto auto 50%;
			width: 100cqw;
			max-width: none;
			display: block;
			margin: 0;
			transform: translateX(-50%);
		}
		.linux-corner,
		.neovim-corner {
			position: absolute;
			top: 5rem;
			display: block;
			width: min(240px, calc((100% - 1280px) / 2 - 72px));
		}
		.linux-corner {
			left: 40px;
		}
		.neovim-corner {
			right: 40px;
			top: 8rem;
		}
		.framed-print {
			width: 100%;
			padding: 14px 14px 12px;
			border-width: 6px;
		}
		figcaption {
			margin-top: 0.6rem;
		}
		.vim-command {
			display: inline;
		}
		.hardware-shelf {
			width: calc(100% + 25px);
			margin: 5rem 0 0 -10px;
		}
		.sunset-print {
			width: 80%;
			margin: 5rem auto 0;
		}
		.nvim-art {
			padding: 10%;
			gap: 12px;
		}
	}
	@container studio-room (max-width: 26rem) {
		.studio-gallery {
			gap: 1.2rem;
			padding-inline: 20px;
		}
		.framed-print {
			padding: 8px 8px 7px;
			border-width: 4px;
		}
		.vim-command {
			display: none;
		}
	}
	@container studio-room (max-width: 15rem) {
		.studio-gallery {
			grid-template-columns: minmax(0, 1fr);
			gap: 3rem;
			max-width: 300px;
		}
	}
</style>
