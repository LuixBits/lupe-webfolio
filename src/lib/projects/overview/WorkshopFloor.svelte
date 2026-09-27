<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import WorkshopDrawers from './WorkshopDrawers.svelte';
	import WorkshopStool from './WorkshopStool.svelte';
	import WorkshopBasket from './WorkshopBasket.svelte';
	import WorkshopCatArt from './WorkshopCatArt.svelte';
	import WorkshopPlant from './WorkshopPlant.svelte';
	import WorkshopRug from './WorkshopRug.svelte';
	import { roomActivity, useWorkshopState } from './workshop-state.svelte';
	let { ready }: { ready: boolean } = $props();
	const id = $props.id();
	const roomState = useWorkshopState();
	let gaze = $state(0);
	let catBounds: DOMRect | undefined;
	function look(event: PointerEvent) {
		if (event.pointerType !== 'mouse' || !roomState.catAwake || !catBounds) return;
		gaze = Math.max(
			-4,
			Math.min(4, ((event.clientX - catBounds.left) / catBounds.width - 0.5) * 8)
		);
	}
</script>

<div class="underbench drawer-cabinet" data-workshop="underbench">
	<svg
		class="cable-floor"
		viewBox="0 0 1400 480"
		preserveAspectRatio="none"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M1050 0q-170 220 37 276t-128 134q-148-4-91-75 73-53 200 78"
			stroke="#171c29"
			stroke-width="9"
		/>
		<path
			d="M1050 0q-170 220 37 276t-128 134q-148-4-91-75 73-53 200 78"
			stroke="#82777c"
			stroke-width="2"
		/>
		<path d="m1067 414 55 7 4-19-55-7Z" fill="#c6b29a" /><path
			d="m1124 405 18 3m-20 3 18 4"
			stroke="#aeaea2"
			stroke-width="4"
		/>
	</svg>
	<WorkshopDrawers {ready} />
	<WorkshopStool /><WorkshopBasket />
</div>
<div class="floor ambient-zone" use:roomActivity data-workshop="floor">
	<svg
		class="floor-grid"
		viewBox="0 0 1440 350"
		preserveAspectRatio="none"
		fill="none"
		aria-hidden="true"
	>
		<defs>
			<linearGradient id={`${id}-floor-neon`}>
				<stop stop-color="#9bddd9" /><stop offset=".36" stop-color="#b19ccc" />
				<stop offset="1" stop-color="#ed79cf" />
			</linearGradient>
		</defs>
		<path
			d="M0 14h1440M0 42h1440M0 83h1440M0 141h1440M0 224h1440M0 342h1440M600 0 0 350M640 0 240 350M680 0 480 350M720 0v350M760 0 960 350M800 0 1200 350M840 0l600 350"
			stroke={`url(#${id}-floor-neon)`}
		/>
	</svg>
	<WorkshopRug />
	<button
		class="cat"
		class:awake={roomState.catAwake}
		type="button"
		disabled={!ready}
		aria-pressed={roomState.catAwake}
		aria-label={roomState.catAwake ? m.workshop_cat_rest() : m.workshop_cat_wake()}
		style={`--cat-gaze:${gaze}deg`}
		onpointerenter={(event) => {
			catBounds = event.currentTarget.getBoundingClientRect();
		}}
		onpointermove={look}
		onpointerleave={() => {
			gaze = 0;
			catBounds = undefined;
		}}
		onclick={() => (roomState.catAwake = !roomState.catAwake)}><WorkshopCatArt /></button
	>
	<WorkshopPlant />
</div>
