<script lang="ts">
	import { menuState } from '$lib/dock.svelte';
	import GardenScene from './GardenScene.svelte';
	import WaterScene from './WaterScene.svelte';
	import VaporwaveScene from './VaporwaveScene.svelte';
	import CosmosScene from './CosmosScene.svelte';

	const scenes = {
		garden: GardenScene,
		water: WaterScene,
		vaporwave: VaporwaveScene,
		cosmos: CosmosScene
	};

	const Scene = $derived(scenes[menuState.themeName]);
</script>

{#if menuState.docked}
	<div class="corner-scene" data-corner={menuState.corner} aria-hidden="true">
		<Scene corner={menuState.corner} sectionId={menuState.sectionId} />
	</div>
{/if}

<style>
	/* A square hugging the docked corner, behind the (crisp) menu. Larger than
	   the menu quarter and masked so the scene dissolves toward its inner edges
	   — no hard canvas border shows. */
	.corner-scene {
		position: fixed;
		width: clamp(360px, 48vmin, 620px);
		height: clamp(360px, 48vmin, 620px);
		z-index: 12;
		pointer-events: none;
		overflow: visible;
	}
	.corner-scene[data-corner='bottom-left'] {
		bottom: 0;
		left: 0;
		-webkit-mask-image: radial-gradient(135% 135% at 0% 100%, #000 42%, transparent 80%);
		mask-image: radial-gradient(135% 135% at 0% 100%, #000 42%, transparent 80%);
	}
	.corner-scene[data-corner='top-left'] {
		top: 0;
		left: 0;
		-webkit-mask-image: radial-gradient(135% 135% at 0% 0%, #000 42%, transparent 80%);
		mask-image: radial-gradient(135% 135% at 0% 0%, #000 42%, transparent 80%);
	}
	.corner-scene[data-corner='top-right'] {
		top: 0;
		right: 0;
		-webkit-mask-image: radial-gradient(135% 135% at 100% 0%, #000 42%, transparent 80%);
		mask-image: radial-gradient(135% 135% at 100% 0%, #000 42%, transparent 80%);
	}
	.corner-scene[data-corner='bottom-right'] {
		bottom: 0;
		right: 0;
		-webkit-mask-image: radial-gradient(135% 135% at 100% 100%, #000 42%, transparent 80%);
		mask-image: radial-gradient(135% 135% at 100% 100%, #000 42%, transparent 80%);
	}
</style>
