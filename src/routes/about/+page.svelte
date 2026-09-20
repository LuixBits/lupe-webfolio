<script lang="ts">
	import { about } from '$lib/content/about';
	import { resolveLocalized } from '$lib/content/schema';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	const locale = getLocale();
	const bioParas = $derived(resolveLocalized(about.bio, locale).split('\n\n'));
</script>

<svelte:head><title>{m.nav_about()} — {about.name}</title></svelte:head>

<div class="page">
	<section id="bio" class="section">
		<p class="eyebrow">{about.name}</p>
		<h1>{m.nav_about()}</h1>
		<p class="lead">{resolveLocalized(about.role, locale)}</p>
		{#each bioParas as para, i (i)}
			<p>{para}</p>
		{/each}
	</section>

	{#if about.highlights.length}
		<section class="section">
			<ul class="highlights">
				{#each about.highlights as h, i (i)}
					<li>
						<h3>{resolveLocalized(h.title, locale)}</h3>
						<p>{resolveLocalized(h.body, locale)}</p>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<section id="contact" class="section">
		<h2>{m.nav_about_contact()}</h2>
		<ul class="links">
			{#each about.links as l (l.url)}
				<li><a href={l.url} target="_blank" rel="noopener">{l.label}</a></li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.highlights {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
	}
	.highlights li {
		padding: 1.1rem 1.2rem;
		border: 1px solid color-mix(in srgb, var(--slice-bg) 45%, transparent);
		border-radius: 12px;
		background: color-mix(in srgb, var(--slice-bg) 12%, transparent);
	}
	.highlights h3 {
		margin: 0 0 0.4rem;
		font-size: var(--fs-h3);
	}
	.highlights p {
		margin: 0;
		color: var(--fg-muted);
		font-size: 0.95rem;
	}
</style>
