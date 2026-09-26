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
		position: relative;
		isolation: isolate;
		display: grid;
		min-width: 0;
		padding: 0 0.6rem 1.2rem;
		background: linear-gradient(#bd9371, #7e5b48 20%, #593b30 78%, #2c2228) bottom / 100% 0.85rem
			no-repeat;
		box-shadow: 0 12px 12px -6px #0c0c19b3;
	}
	.cases li::before {
		content: '';
		position: absolute;
		z-index: -1;
		inset: 20% 0 -1.9rem;
		background: linear-gradient(
			90deg,
			transparent 7%,
			#292432 7% calc(7% + 9px),
			transparent calc(7% + 10px) calc(93% - 10px),
			#292432 calc(93% - 9px) 93%,
			transparent 93%
		);
		pointer-events: none;
	}
	.cases li::after {
		content: '';
		position: absolute;
		left: 7%;
		right: 7%;
		bottom: -1.7rem;
		height: 5px;
		background:
			radial-gradient(circle at 4px 50%, #a494a0 1px, #17131d 2px, transparent 3px),
			radial-gradient(circle at calc(100% - 4px) 50%, #a494a0 1px, #17131d 2px, transparent 3px);
		pointer-events: none;
	}
	.studio .cases {
		margin-top: 2rem;
	}
</style>
