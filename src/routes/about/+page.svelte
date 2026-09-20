<script lang="ts">
	import { about } from '$lib/content/about';
	import { resolveLocalized } from '$lib/content/schema';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	const locale = getLocale();
</script>

<svelte:head><title>{m.nav_about()} — {about.name}</title></svelte:head>

<div class="page">
	<section id="bio" class="section">
		<p class="eyebrow">{about.name}</p>
		<h1>{m.nav_about()}</h1>
		<p class="lead">{resolveLocalized(about.role, locale)}</p>
		<p>{resolveLocalized(about.bio, locale)}</p>
	</section>

	<section id="contact" class="section">
		<h2>{m.nav_about_contact()}</h2>
		<ul class="links">
			{#each about.links as l (l.url)}
				<li><a href={l.url} target="_blank" rel="noopener">{l.label}</a></li>
			{/each}
		</ul>
	</section>
</div>
