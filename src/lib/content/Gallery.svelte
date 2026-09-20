<script lang="ts">
	import { resolveLocalized, type MediaItem } from './schema';
	import { getLocale } from '$lib/paraglide/runtime';
	import Video from './Video.svelte';

	let { media }: { media: MediaItem[] } = $props();
	const locale = getLocale();
</script>

<div class="gallery">
	{#each media as item (item.id)}
		<figure>
			{#if item.kind === 'video'}
				<Video video={{ id: item.id, title: item.caption ? resolveLocalized(item.caption, locale) : item.id, provider: item.provider ?? 'file', src: item.src, poster: item.poster }} />
			{:else}
				<img src={item.src} alt={item.caption ? resolveLocalized(item.caption, locale) : ''} loading="lazy" />
			{/if}
			{#if item.caption}
				<figcaption>{resolveLocalized(item.caption, locale)}</figcaption>
			{/if}
		</figure>
	{/each}
</div>

<style>
	.gallery {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
	}
	figure {
		margin: 0;
	}
	img {
		width: 100%;
		height: auto;
		border-radius: 10px;
		display: block;
	}
	figcaption {
		margin-top: 0.4rem;
		font-size: 0.85rem;
		color: var(--fg-muted);
	}
</style>
