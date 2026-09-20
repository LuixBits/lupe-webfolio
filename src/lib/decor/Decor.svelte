<script lang="ts">
	import type { ThemeName } from '$lib/themes';
	import GardenDecor from './GardenDecor.svelte';
	import WaterDecor from './WaterDecor.svelte';
	import VaporwaveDecor from './VaporwaveDecor.svelte';
	import CosmosDecor from './CosmosDecor.svelte';

	let { theme }: { theme: ThemeName } = $props();

	const layers = {
		garden: GardenDecor,
		water: WaterDecor,
		vaporwave: VaporwaveDecor,
		cosmos: CosmosDecor
	};
	const Layer = $derived(layers[theme]);
</script>

<Layer />
