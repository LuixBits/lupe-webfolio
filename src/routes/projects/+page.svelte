<script lang="ts">
	import { projectsByCategory } from '$lib/content/projects';
	import ProjectGrid from '$lib/content/ProjectGrid.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<svelte:head><title>{m.nav_projects()} — Lupe</title></svelte:head>

<div class="page">
	<h1>{m.nav_projects()}</h1>

	<section id="youtube" class="section">
		<h2>{m.nav_projects_youtube()}</h2>
		<ProjectGrid projects={projectsByCategory('youtube')} base="/projects" />
	</section>

	<section id="opensource" class="section">
		<h2>{m.nav_projects_opensource()}</h2>
		<ProjectGrid projects={projectsByCategory('opensource')} base="/projects" />
	</section>

	<section id="web" class="section">
		<h2>{m.nav_projects_web()}</h2>
		<ProjectGrid projects={projectsByCategory('web')} base="/projects" />
	</section>
</div>
