<script lang="ts">
	import type { Video } from './schema';

	let { video }: { video: Video } = $props();

	const embedSrc = $derived(
		video.provider === 'youtube'
			? `https://www.youtube-nocookie.com/embed/${video.src}`
			: video.provider === 'vimeo'
				? `https://player.vimeo.com/video/${video.src}`
				: video.src
	);
</script>

{#if video.provider === 'file'}
	<video controls preload="metadata" poster={video.poster}>
		<source src={video.src} />
	</video>
{:else}
	<div class="frame">
		<iframe
			src={embedSrc}
			title={video.title}
			loading="lazy"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	</div>
{/if}

<style>
	.frame {
		position: relative;
		aspect-ratio: 16 / 9;
	}
	.frame iframe,
	video {
		width: 100%;
		height: 100%;
		border: 0;
		border-radius: 10px;
	}
	video {
		aspect-ratio: 16 / 9;
		background: #000;
	}
</style>
