<script lang="ts">
	import { tick } from 'svelte';
	import * as m from '$lib/paraglide/messages';
	import FloorPlan from '$lib/projects/workbench/FloorPlan.svelte';
	import { useWorkshopState } from './workshop-state.svelte';
	let { ready }: { ready: boolean } = $props();
	const roomState = useWorkshopState();
	let playing = $state(false);
	let playButton = $state<HTMLButtonElement>();
	let stopButton = $state<HTMLButtonElement>();
	$effect(() => {
		if (!roomState.tabletOpen) playing = false;
	});
	async function play() {
		playing = true;
		await tick();
		stopButton?.focus({ preventScroll: true });
	}
	async function stop() {
		playing = false;
		await tick();
		playButton?.focus({ preventScroll: true });
	}
	function closeOnEscape(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		const drawer =
			event.target instanceof Element
				? event.target.closest<HTMLDetailsElement>('.drawer-unit')
				: null;
		if (!drawer?.open) return;
		event.preventDefault();
		drawer.open = false;
		drawer.querySelector('summary')?.focus({ preventScroll: true });
	}
</script>

<svelte:window onkeydown={closeOnEscape} />

<div class="drawers interactive-drawers">
	<details class="drawer-unit" data-drawer="sketch" bind:open={roomState.drawerOpen}>
		<summary
			class="drawer sketch-handle"
			aria-label={roomState.drawerOpen ? m.workshop_drawer_close() : m.workshop_drawer_open()}
			title={roomState.drawerOpen ? m.workshop_drawer_close() : m.workshop_drawer_open()}
			><span aria-hidden="true">I</span></summary
		>
		<div class="drawer-content sketch-tray" role="region" aria-label={m.workshop_sketch()}>
			<div class="drawer-sketch">
				<FloorPlan /><span class="sketch-pencil" aria-hidden="true"></span>
			</div>
		</div>
	</details>
	<details class="drawer-unit" data-drawer="parts" bind:open={roomState.partsOpen}>
		<summary
			class="drawer parts-handle"
			aria-label={roomState.partsOpen ? m.workshop_parts_close() : m.workshop_parts_open()}
			title={roomState.partsOpen ? m.workshop_parts_close() : m.workshop_parts_open()}
			><span aria-hidden="true">II</span></summary
		>
		<div class="drawer-content parts-tray" role="region" aria-label={m.workshop_parts()}>
			<svg viewBox="0 0 320 210" fill="none" aria-hidden="true">
				<path
					d="M198 27q-48 17-34 63t54 12q32-37 60-6t-13 58q-51 18-28-38"
					stroke="#282633"
					stroke-width="10"
				/>
				<path
					d="M198 27q-48 17-34 63t54 12q32-37 60-6t-13 58q-51 18-28-38"
					stroke="#98a0a8"
					stroke-width="2"
				/>
				<path d="m192 17 26 6-6 22-26-7Z" fill="#b6a4bc" stroke="#d9cdb8" />
				<g transform="translate(24 35) rotate(-9)">
					<path d="M0 7 10 0h44l9 8v50H0Z" fill="#675675" stroke="#c0a8c4" stroke-width="2" />
					<path d="M8 7h47v38H8Z" fill="#b8a1c6" />
					<path d="M18 16v20m22-20v20M18 26h22" stroke="#47364e" stroke-width="3" />
				</g>
				<g transform="translate(97 73) rotate(12)">
					<path d="M0 7 10 0h44l9 8v50H0Z" fill="#5b7678" stroke="#a4d8cb" stroke-width="2" />
					<path d="M8 7h47v38H8Z" fill="#a0c6b9" />
					<path d="M22 16h17m-7 0v15q0 10-12 4" stroke="#355758" stroke-width="3" />
				</g>
				<path d="m31 133 107 32-10 30-107-32Z" fill="#404d49" stroke="#89a594" stroke-width="2" />
				<path d="m38 150 21 6m10 3 21 6m11 3 21 6" stroke="#ddb986" stroke-width="9" />
				<path d="m212 179 55 3m-51 6 36 2" stroke="#d7bf9d" stroke-width="4" />
				<circle cx="278" cy="49" r="15" stroke="#bc98a5" stroke-width="5" /><circle
					cx="278"
					cy="49"
					r="6"
					fill="#4b3843"
				/>
			</svg>
		</div>
	</details>
	<details class="drawer-unit" data-drawer="tablet" bind:open={roomState.tabletOpen}>
		<summary
			class="drawer tablet-handle"
			aria-label={roomState.tabletOpen ? m.workshop_tablet_close() : m.workshop_tablet_open()}
			title={roomState.tabletOpen ? m.workshop_tablet_close() : m.workshop_tablet_open()}
			><span aria-hidden="true">III</span></summary
		>
		<div class="drawer-content tablet-tray" role="region" aria-label={m.workshop_tablet()}>
			<div class="drawer-tablet">
				<div class="tablet-screen">
					{#if playing}
						<iframe
							src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
							title="Rick Astley — Never Gonna Give You Up"
							allow="autoplay; encrypted-media; picture-in-picture"
							allowfullscreen
							referrerpolicy="strict-origin-when-cross-origin"
						></iframe>
					{:else}
						<button
							class="tablet-play"
							type="button"
							disabled={!ready}
							onclick={play}
							bind:this={playButton}
						>
							<svg viewBox="0 0 70 70" aria-hidden="true"
								><circle
									cx="35"
									cy="35"
									r="31"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								/><path d="m28 20 23 15-23 15Z" fill="currentColor" /></svg
							>
							<span>{m.tv_play_video()}</span>
						</button>
					{/if}
				</div>
			</div>
			{#if playing}
				<div class="tablet-controls">
					<button type="button" onclick={stop} bind:this={stopButton}
						>{m.workshop_tablet_stop()}</button
					><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener"
						>{m.workshop_tablet_external()} <span aria-hidden="true">↗</span></a
					>
				</div>
			{/if}
			<noscript
				><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">{m.tv_play_video()}</a></noscript
			>
		</div>
	</details>
</div>
