<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { projectNavigation, type ProjectNavigation } from '../navigation';
	import WorkshopSideWalls from '../overview/WorkshopSideWalls.svelte';
	import WorkshopStool from '../overview/WorkshopStool.svelte';
	import WorkshopPlant from '../overview/WorkshopPlant.svelte';
	let { children }: { children: Snippet } = $props();
	const navigation = getContext<ProjectNavigation | undefined>(projectNavigation);
	const id = $props.id();
</script>

<!-- Keep the complete room inside .page so doorway transitions carry its walls too. -->
<div class="studio-room">
	<WorkshopSideWalls ready={!navigation?.moving} />
	<div class="receiving-wall" aria-hidden="true"></div>
	<div class="ceiling-rail" aria-hidden="true"></div>
	<div class="room-content">{@render children()}</div>
	<div class="studio-floor" aria-hidden="true">
		<div class="skirting"></div>
		<svg class="floor-grid" viewBox="0 0 2000 350" preserveAspectRatio="none" fill="none">
			<defs>
				<linearGradient id={`${id}-floor`}>
					<stop stop-color="#73c9d2" /><stop offset=".5" stop-color="#a496c7" /><stop
						offset="1"
						stop-color="#e87bce"
					/>
				</linearGradient>
			</defs>
			<path
				d="M0 14h2000M0 42h2000M0 83h2000M0 141h2000M0 224h2000M0 342h2000M780 0 0 350M835 0 250 350M890 0 500 350M945 0 750 350M1000 0v350M1055 0l195 350M1110 0l390 350M1165 0l585 350M1220 0l780 350"
				stroke={`url(#${id}-floor)`}
			/>
		</svg>
		<div class="bench-frame"><span></span><span></span></div>
		<svg class="floor-lead" viewBox="0 0 680 260" fill="none">
			<path
				d="M58 0v54c0 91 119 7 146 67 28 65-168 130-173 53-7-94 474-10 544 34"
				stroke="#0d1424"
				stroke-width="8"
			/>
			<path
				d="M57 0v54c0 91 119 7 146 67 28 65-168 130-173 53-7-94 474-10 544 34"
				stroke="#686077"
				stroke-width="2"
			/>
			<g transform="translate(559 192) rotate(15)"
				><rect width="42" height="26" rx="5" fill="#3b334d" stroke="#8c7c95" /><path
					d="M42 7h12m-12 12h12"
					stroke="#c8c5b5"
					stroke-width="4"
				/><path d="M9 5v16m7-16v16" stroke="#151d2e" stroke-width="2" /></g
			>
		</svg>
		<div class="studio-stool"><WorkshopStool /></div>
		<div class="studio-plant"><WorkshopPlant /></div>
	</div>
</div>

<style>
	.studio-room {
		position: relative;
		isolation: isolate;
		container: studio-room / inline-size;
		background: #28213c;
	}
	.receiving-wall {
		position: absolute;
		z-index: -1;
		inset: 0 0 350px;
		pointer-events: none;
		background:
			radial-gradient(ellipse 55% 38% at 14% 27%, #669fcc25, transparent),
			radial-gradient(ellipse 40% 34% at 89% 22%, #dc65bd22, transparent),
			linear-gradient(110deg, #24233b, #373047 53%, #292238);
		box-shadow:
			inset 12px 0 22px #070e224d,
			inset -12px 0 22px #070e224d;
	}
	.receiving-wall::after {
		content: '';
		position: absolute;
		inset: 0;
		background: url('/media/projects/luixbits/plaster.svg');
		opacity: 0.2;
	}
	.ceiling-rail {
		position: absolute;
		inset: 0 0 auto;
		height: 88px;
		pointer-events: none;
		background: linear-gradient(
			#171829 0%,
			#222039 60%,
			#484059 62%,
			#21233a 65%,
			#34374b 83%,
			#72899b80 85%,
			#27223b 88%,
			#ff93da38 89%,
			transparent 93%
		);
		box-shadow: 0 14px 24px #0f112524;
	}
	.room-content {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 1280px;
		margin-inline: auto;
		padding: 6.8rem 40px 0;
	}
	.studio-floor {
		position: relative;
		height: 350px;
		background:
			radial-gradient(ellipse at 68% 0, #96577920, transparent 55%),
			linear-gradient(#201d32, #372842);
		box-shadow: inset 0 26px 35px #100e2466;
	}
	.skirting {
		position: absolute;
		inset: -24px 0 auto;
		height: 24px;
		background: linear-gradient(#887181, #342a3d 3px, #1e1c2e 16px, #6b546c 18px, #15172b 22px);
		box-shadow: 0 9px 13px #15132999;
	}
	.floor-grid {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0.25;
	}
	.bench-frame {
		position: absolute;
		top: 0;
		left: calc(50% + var(--studio-clearance, 0px) / 2);
		width: calc(min(1180px, 100cqw - 100px) - var(--studio-clearance, 0px));
		height: 215px;
		transform: translateX(-50%);
		border: 13px solid #262c39;
		border-top: 0;
		border-bottom-width: 9px;
		box-shadow:
			inset 2px 0 #799191,
			2px 0 #6f5f73;
	}
	.bench-frame span {
		position: absolute;
		top: 0;
		width: 19px;
		height: 250px;
		background: linear-gradient(90deg, #171d2e, #7c727d 22%, #3a3345 42%, #151b2c);
		box-shadow: 4px 8px 6px #11102255;
	}
	.bench-frame span:first-child {
		left: -25px;
		transform: rotate(3deg);
	}
	.bench-frame span:last-child {
		right: -25px;
		transform: rotate(-3deg);
	}
	.floor-lead {
		position: absolute;
		left: 25%;
		top: 0;
		width: 45%;
		height: 260px;
	}
	.studio-stool {
		position: absolute;
		bottom: -5px;
		left: 35%;
		width: 230px;
	}
	.studio-plant {
		position: absolute;
		bottom: 6px;
		right: 5%;
		width: 170px;
	}
	.studio-stool :global(svg),
	.studio-plant :global(svg) {
		display: block;
		width: 100%;
		height: auto;
	}
	@container studio-room (min-width: 65rem) and (max-width: 109.99rem) {
		.room-content {
			padding-top: 7rem;
		}
		.room-content :global(.back-remote) {
			margin-bottom: 5.5rem;
		}
	}
	@container studio-room (max-width: 64.99rem) {
		.room-content {
			padding: 5rem 32px 0;
		}
		.ceiling-rail {
			height: 52px;
		}
		.studio-stool {
			left: 24%;
		}
	}
	@container studio-room (max-width: 40rem) {
		.room-content {
			padding: 4rem 12px 0;
		}
		.studio-stool {
			width: 175px;
			left: 3%;
			bottom: 10px;
		}
		.studio-plant {
			width: 115px;
			right: 1%;
		}
		.floor-lead {
			width: 90%;
			left: 5%;
		}
	}
	/* Match the navigation's viewport breakpoint, including when text is enlarged. */
	@media (min-width: 60.01rem) and (min-height: 561px) {
		.room-content,
		.studio-floor {
			--studio-clearance: max(0px, calc(200px - (100cqw - min(100cqw, 1280px)) / 2));
		}
		.room-content {
			padding-left: calc(40px + var(--studio-clearance));
		}
		.room-content :global(.back-remote) {
			margin-left: calc(-1 * var(--studio-clearance));
		}
	}
</style>
