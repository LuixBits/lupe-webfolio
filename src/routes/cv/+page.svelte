<script lang="ts">
	import { research, publications } from '$lib/content/cv';
	import ProjectGrid from '$lib/content/ProjectGrid.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<svelte:head><title>{m.nav_cv()} — Lupe</title></svelte:head>

<div class="page">
	<h1>{m.nav_cv()}</h1>

	<section id="research" class="section">
		<h2>{m.nav_cv_research()}</h2>
		<ProjectGrid projects={research} base="/cv" />
	</section>

	<section id="publications" class="section">
		<h2>{m.nav_cv_publications()}</h2>
		<ProjectGrid projects={publications} base="/cv" />
	</section>
</div>
