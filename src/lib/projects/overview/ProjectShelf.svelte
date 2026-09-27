<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolveLocalized, type Project } from '$lib/content/schema';
	import { localizeHref } from '$lib/paraglide/runtime';
	import ProjectStatus from '../ProjectStatus.svelte';
	import TapeArtwork from '../TapeArtwork.svelte';
	import NeonSign from './NeonSign.svelte';
	import NetworkPatchPanel from './NetworkPatchPanel.svelte';
	let {
		id,
		title,
		intro,
		projects,
		locale,
		color = 'cyan',
		housing = 'shelf',
		children
	}: {
		id: string;
		title: string;
		intro: string;
		projects: Project[];
		locale: string;
		color?: 'pink' | 'cyan' | 'violet';
		housing?: 'shelf' | 'network-cabinet';
		children: Snippet<[string]>;
	} = $props();
	let hoveredProject = $state<string | null>(null);
	let focusedProject = $state<string | null>(null);
	const preview = $derived(hoveredProject ?? focusedProject ?? projects[0]?.slug ?? '');
</script>

<section
	class="project-shelf"
	class:network-cabinet={housing === 'network-cabinet'}
	{id}
	aria-labelledby={`${id}-title`}
	style={`--station-neon:${color === 'pink' ? '#e997d5' : color === 'violet' ? '#b4a5f0' : '#9bdfdf'}`}
>
	{#if housing === 'network-cabinet'}
		<div class="cabinet-fittings" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
	{/if}
	<header class="shelf-heading">
		<h2 id={`${id}-title`}>
			<span class="workshop-sr-only">{title}</span><NeonSign text={title} {color} />
		</h2>
		<p>{intro}</p>
	</header>
	<div class="shelf-scene" data-project-preview={preview} aria-hidden="true">
		{@render children(preview)}
	</div>
	{#if housing === 'network-cabinet'}
		<div class="network-panel" aria-hidden="true"><NetworkPatchPanel /></div>
	{/if}
	<div class="shelf-timber" aria-hidden="true"></div>
	<ul class="project-files">
		{#each projects as project (project.slug)}
			<li>
				<a
					class="project-file"
					class:previewing={preview === project.slug && !!(hoveredProject || focusedProject)}
					id={`tape-${project.slug}`}
					data-project-tape={project.slug}
					data-project-kind="case"
					href={localizeHref(`/projects/${project.slug}`)}
					onpointerenter={(event) => {
						if (event.pointerType !== 'touch') hoveredProject = project.slug;
					}}
					onpointerleave={() => (hoveredProject = null)}
					onpointercancel={() => (hoveredProject = null)}
					onfocus={() => {
						focusedProject = project.slug;
						// Keyboard movement takes over even if the pointer still rests on another file.
						hoveredProject = null;
					}}
					onblur={() => (focusedProject = null)}
				>
					<span class="file-emblem" data-project-object><TapeArtwork {project} /></span>
					<div class="file-copy">
						<h3>{resolveLocalized(project.title, locale)}</h3>
						<p>{resolveLocalized(project.tagline, locale)}</p>
						<ProjectStatus {project} />
					</div>
					<span class="file-arrow" aria-hidden="true">↗</span>
				</a>
			</li>
		{/each}
	</ul>
</section>
