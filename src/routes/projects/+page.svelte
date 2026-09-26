<script lang="ts">
	import { projects, projectsByCategory } from '$lib/content/projects';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import OverviewRoom from '$lib/projects/overview/OverviewRoom.svelte';
	import StudioEntrance from '$lib/projects/overview/StudioEntrance.svelte';
	import ProjectCase from '$lib/projects/overview/ProjectCase.svelte';

	const locale = getLocale();
	const studio = projects.find((project) => project.channel && project.featured);
	const displays = [
		{ id: 'youtube', label: m.nav_projects_youtube },
		{ id: 'opensource', label: m.nav_projects_opensource },
		{ id: 'web', label: m.nav_projects_web }
	] as const;
</script>

<svelte:head>
	<title>{m.nav_projects()} — Lupe</title>
	<meta name="description" content={m.meta_desc_projects()} />
</svelte:head>

<OverviewRoom>
	{#each displays as display (display.id)}
		{@const cases = projectsByCategory(display.id).filter((project) => project !== studio)}
		<section id={display.id} class:studio={display.id === 'youtube'} class="project-display">
			<h2>{display.label()}</h2>
			{#if display.id === 'youtube' && studio}
				<StudioEntrance project={studio} {locale} />
			{/if}
			{#if cases.length}
				<ul class="cases">
					{#each cases as project (project.slug)}
						<li><ProjectCase {project} {locale} /></li>
					{/each}
				</ul>
			{/if}
		</section>
	{/each}
</OverviewRoom>

<style>
	.project-display {
		min-width: 0;
		scroll-margin-top: 2rem;
	}
	.project-display h2 {
		font-size: var(--fs-h2);
		margin: 0 0 1rem;
	}
	.studio {
		grid-row: span 2;
	}
	.cases {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
		gap: 1.6rem 1.25rem;
		padding: 0;
		margin: 0;
	}
	.cases li {
		display: grid;
		min-width: 0;
		padding: 0 0.6rem 0.65rem;
		border-bottom: 0.65rem solid #624737;
	}
	.studio .cases {
		margin-top: 2rem;
	}
</style>
