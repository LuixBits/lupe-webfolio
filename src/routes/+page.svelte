<script lang="ts">
	import * as m from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>{m.site_title()} — {m.tagline()}</title>
<meta name="description" content={m.meta_desc_home()} /></svelte:head>

<!-- The hub (home) is the centered radial menu alone; page content only appears
     once a section is docked. A visually-hidden heading keeps the page titled
     for assistive tech and SEO. -->
<h1 class="sr-only">{m.home_welcome()}</h1>

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
