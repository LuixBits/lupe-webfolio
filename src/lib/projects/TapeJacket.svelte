<script lang="ts">
	import type { Project } from '$lib/content/schema';
	import TapeArtwork from './TapeArtwork.svelte';
	let { project }: { project: Project } = $props();
</script>

<div class="jacket" aria-hidden="true">
	<div class="art"><TapeArtwork {project} /></div>
</div>

<style>
	.jacket {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		aspect-ratio: 3/4;
		padding: 10px 10px 10px 14px;
		background: linear-gradient(110deg, #30313a, #17191f 9%, #292a34 12%, #17171d 96%, #41414c 98%);
		border: 1px solid #7d718266;
		border-radius: 3px;
		box-shadow:
			8px 3px 11px #0006,
			inset 1px 1px #ffffff15;
		font-family: var(--font-body);
		color: #f4e8db;
	}
	.jacket::before {
		content: '';
		position: absolute;
		top: 3px;
		bottom: 3px;
		left: -5px;
		width: 6px;
		background: repeating-linear-gradient(#32303a 0 2px, #16151b 2px 4px);
		transform: skewY(-9deg);
		border-radius: 2px 0 0 1px;
	}
	.art {
		height: 3.5rem;
		margin: 5px 0 9px;
		padding: 5px;
		color: var(--sub-bg);
		background: linear-gradient(140deg, #54355c66, #101018);
	}
</style>
