<script lang="ts">
	import { albums } from '$lib/content/hobbies';
	import { resolveLocalized } from '$lib/content/schema';
	import { getLocale } from '$lib/paraglide/runtime';
	import Gallery from '$lib/content/Gallery.svelte';
	import * as m from '$lib/paraglide/messages';
	const locale = getLocale();
</script>

<svelte:head><title>{m.nav_hobbies()} — Lupe</title></svelte:head>

<div class="page">
	<h1>{m.nav_hobbies()}</h1>

	{#each albums as album (album.slug)}
		<section id={album.slug} class="section">
			<h2>{resolveLocalized(album.title, locale)}</h2>
			<p class="lead">{resolveLocalized(album.intro, locale)}</p>
			<Gallery media={album.media} />
		</section>
	{/each}
</div>
