<script lang="ts">
	import { resolveLocalized, type Project } from '$lib/content/schema';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import WebfolioModel from './WebfolioModel.svelte';
	import OrbitApparatus from './OrbitApparatus.svelte';
	import PlanningTable from './PlanningTable.svelte';
	import ProjectCover from './ProjectCover.svelte';
	let { project, locale }: { project: Project; locale: string } = $props();
</script>

<a
	class="project-link"
	class:portfolio-link={project.slug === 'lupe-webfolio'}
	class:orbit-link={project.slug === 'orbit-toy'}
	class:planning-link={project.slug === 'scrumpoker'}
	id={`tape-${project.slug}`}
	data-project-tape={project.slug}
	data-project-kind="case"
	href={localizeHref(`/projects/${project.slug}`)}
>
	<div class="project-object" data-project-object>
		{#if project.slug === 'lupe-webfolio'}<WebfolioModel
			/>{:else if project.slug === 'orbit-toy'}<OrbitApparatus
			/>{:else if project.slug === 'scrumpoker'}<PlanningTable />{:else}<div class="fallback-case">
				<ProjectCover {project} />
			</div>{/if}
	</div>
	<div class="station-timber" aria-hidden="true"></div>
	<div class="station-front">
		<div class="paper">
			<h3>{resolveLocalized(project.title, locale)}</h3>
			<p>{resolveLocalized(project.tagline, locale)}</p>
			<span class="action"
				>{project.slug === 'scrumpoker' ? m.workshop_sample_open() : m.workshop_project_open()}
				<span aria-hidden="true">→</span></span
			>
		</div>
	</div>
</a>
