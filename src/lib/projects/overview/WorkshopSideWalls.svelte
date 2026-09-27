<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { useWorkshopState } from './workshop-state.svelte';
	import WorkshopWallPrint from './WorkshopWallPrint.svelte';
	let { ready }: { ready: boolean } = $props();
	const room = useWorkshopState();
	const id = $props.id();
</script>

{#each ['left', 'right'] as side}
	<aside
		class="side-wall {side}-wall"
		aria-label={side === 'left' ? m.workshop_wall_left() : m.workshop_wall_right()}
	>
		<div class="wall-plaster" aria-hidden="true"></div>
		<svg
			class="wall-ceiling"
			viewBox="0 0 600 88"
			preserveAspectRatio="none"
			fill="none"
			aria-hidden="true"
		>
			<path d="M0 0h600v88Z" fill="#21192e" />
			<path d="M0 0 600 88M0 0 600 46M0 0 600 15" stroke="#735674" stroke-width="2" />
			<path d="M0 0 600 46" stroke="#ca7bac" stroke-opacity=".55" stroke-width="3" />
		</svg>
		<svg
			class="wall-floor"
			viewBox="0 0 600 350"
			preserveAspectRatio="none"
			fill="none"
			aria-hidden="true"
		>
			<path d="M0 350 600 0v350Z" fill="#251a36" />
			<path
				d="M0 350 600 0m-483 350L600 55m-300 295L600 143M0 350h600m-250-141h250m-430 83h430"
				stroke="#bc6daa"
				stroke-opacity=".38"
				stroke-width="1.5"
			/>
			<path d="M0 347 600 0m-600 339L600-8" stroke="#5b465f" stroke-width="5" />
		</svg>
		<div class="corner-post" aria-hidden="true"></div>
		<div class="wall-gallery">
			{#if side === 'left'}
				<figure class="wall-frame machine-print">
					<WorkshopWallPrint kind="machine" />
					<figcaption>{m.workshop_wall_machine()}</figcaption>
				</figure>
				<figure class="wall-frame nix-print">
					<WorkshopWallPrint kind="nix" />
					<figcaption>{m.workshop_wall_nix()}</figcaption>
				</figure>
			{:else}
				<button
					class="wall-frame duck-print"
					type="button"
					disabled={!ready}
					aria-label={room.duckRevealed
						? m.workshop_wall_duck_close()
						: m.workshop_wall_duck_open()}
					aria-describedby={`${id}-duck-caption`}
					aria-pressed={room.duckRevealed}
					onclick={() => (room.duckRevealed = !room.duckRevealed)}
				>
					<WorkshopWallPrint kind="duck" revealed={room.duckRevealed} />
					<span class="print-caption" id={`${id}-duck-caption`} aria-live="polite"
						>{room.duckRevealed ? m.workshop_wall_duck_secret() : m.workshop_wall_duck()}</span
					>
					<span class="turn-print" aria-hidden="true">↻</span>
				</button>
				<figure class="wall-frame coffee-print">
					<WorkshopWallPrint kind="coffee" />
					<figcaption>{m.workshop_wall_coffee()}</figcaption>
				</figure>
			{/if}
		</div>
	</aside>
{/each}

<style>
	.side-wall {
		position: absolute;
		top: 0;
		bottom: 0;
		width: var(--workshop-gutter, 0px);
		container: side-wall / inline-size;
		overflow: clip;
		display: none;
		isolation: isolate;
	}
	@media (min-width: 2001px) {
		.side-wall {
			display: block;
		}
	}
	.left-wall {
		right: 100%;
	}
	.right-wall {
		left: 100%;
	}
	.wall-plaster {
		position: absolute;
		inset: 0;
		clip-path: polygon(0 0, 100% 88px, 100% calc(100% - 350px), 0 100%);
		background:
			radial-gradient(ellipse at 60% 20%, #d466b321, transparent 35%),
			repeating-linear-gradient(
				0deg,
				transparent 0 140px,
				#0d102718 142px,
				transparent 144px 280px
			),
			linear-gradient(90deg, #171427, #3b2848 55%, #271d3b);
	}
	.right-wall .wall-plaster {
		transform: scaleX(-1);
		background:
			radial-gradient(ellipse at 60% 20%, #63afc020, transparent 35%),
			repeating-linear-gradient(
				0deg,
				transparent 0 140px,
				#0d102718 142px,
				transparent 144px 280px
			),
			linear-gradient(90deg, #171427, #302c49 55%, #211e37);
	}
	.wall-ceiling,
	.wall-floor {
		position: absolute;
		width: 100%;
		pointer-events: none;
	}
	.wall-ceiling {
		top: 0;
		height: 88px;
	}
	.wall-floor {
		bottom: 0;
		height: 350px;
	}
	.right-wall .wall-ceiling,
	.right-wall .wall-floor {
		transform: scaleX(-1);
	}
	.corner-post {
		position: absolute;
		top: 88px;
		bottom: 350px;
		width: 9px;
		background: linear-gradient(90deg, #141023, #726078 45%, #31243e 70%, #a183a133);
		box-shadow: -9px 0 24px #110c2470;
	}
	.left-wall .corner-post {
		right: -2px;
	}
	.right-wall .corner-post {
		left: -2px;
		transform: scaleX(-1);
	}
	.wall-gallery {
		display: none;
		position: absolute;
		top: 310px;
		width: min(340px, calc(100% - 400px));
		gap: 450px;
	}
	.left-wall .wall-gallery {
		right: 360px;
	}
	.right-wall .wall-gallery {
		left: 145px;
		top: 450px;
		width: min(360px, calc(100% - 230px));
	}
	@container side-wall (min-width: 38rem) {
		.wall-gallery {
			display: grid;
		}
	}
	.wall-frame {
		position: relative;
		display: block;
		min-width: 0;
		margin: 0;
		padding: 12px;
		border: 11px solid;
		border-color: #a79488 #493c50 #403047 #786075;
		background: #dbcab3;
		box-shadow:
			-13px 17px 18px #0c0c2560,
			inset 0 0 0 2px #7c6b75;
		transform: perspective(950px) rotateY(24deg) rotateZ(-2deg);
		transform-origin: right center;
		text-align: center;
		color: #41314d;
	}
	.right-wall .wall-frame {
		transform: perspective(950px) rotateY(-24deg) rotateZ(2deg);
		transform-origin: left center;
		box-shadow:
			13px 17px 18px #0c0c2560,
			inset 0 0 0 2px #7c6b75;
	}
	.wall-frame::before {
		content: '';
		position: absolute;
		width: 52%;
		height: 32px;
		left: 24%;
		top: -43px;
		background: #9e8f9b;
		clip-path: polygon(0 100%, 50% 0, 100% 100%, 98% 100%, 50% 8%, 2% 100%);
		z-index: -1;
	}
	.wall-frame::after {
		content: '';
		position: absolute;
		inset: -9px;
		border: 1px solid #ceb4b270;
		pointer-events: none;
	}
	.wall-frame :global(svg) {
		display: block;
		width: 100%;
		height: auto;
	}
	figcaption,
	.print-caption {
		display: block;
		padding: 16px 6px 6px;
		font: var(--fs-body)/1.5 var(--font-body);
		overflow-wrap: anywhere;
	}
	.duck-print {
		border-color: #c2a17c #705466 #4d3a51 #aa8b78;
	}
	.duck-print:is(:hover, :focus-visible) {
		background: #f1dfc5;
	}
	.turn-print {
		display: block;
		margin-top: 6px;
		font-size: var(--fs-h3);
		color: #825475;
	}
	.nix-print {
		width: 90%;
		justify-self: end;
	}
	.coffee-print {
		width: 90%;
	}
</style>
