<script lang="ts">
	import { resolveLocalized, type Project } from './schema';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import Video from './Video.svelte';

	let { project, backHref, backLabel }: { project: Project; backHref: string; backLabel: string } =
		$props();
	const locale = getLocale();
</script>

<article class="page">
	<a class="back" href={localizeHref(backHref)}>← {backLabel}</a>
	<h1>{resolveLocalized(project.title, locale)}</h1>
	<p class="tagline">{resolveLocalized(project.tagline, locale)}</p>
	<p class="meta">{project.year}{#if project.tags.length} · {project.tags.join(' · ')}{/if}</p>

	<p class="body">{resolveLocalized(project.body, locale)}</p>

	{#if project.videos.length}
		<h2>Videos</h2>
		<div class="videos">
			{#each project.videos as v (v.id)}<Video video={v} />{/each}
		</div>
	{/if}

	{#if project.links.length}
		<h2>Links</h2>
		<ul class="links">
			{#each project.links as l (l.url)}
				<li><a href={l.url} target="_blank" rel="noopener">{l.label}</a> <span class="rel">{l.rel}</span></li>
			{/each}
		</ul>
	{/if}

	{#if project.sources.length}
		<h2>Sources</h2>
		<ul class="links">
			{#each project.sources as s (s.id)}
				<li>
					<a href={s.url} target="_blank" rel="noopener">{s.title}</a>
					{#if s.author}— {s.author}{/if}{#if s.year} ({s.year}){/if}
					<span class="rel">{s.kind}</span>
				</li>
			{/each}
		</ul>
	{/if}
</article>

<style>
	.tagline {
		font-size: 1.15rem;
		color: var(--fg-muted);
		margin: 0 0 0.25rem;
	}
	.meta {
		font-size: 0.85rem;
		color: var(--accent);
		margin: 0 0 1.5rem;
	}
	.videos {
		display: grid;
		gap: 1rem;
	}
	.links {
		padding-left: 1.1rem;
	}
	.rel {
		font-size: 0.75rem;
		color: var(--fg-muted);
	}
	h2 {
		margin-top: 2rem;
	}
</style>
