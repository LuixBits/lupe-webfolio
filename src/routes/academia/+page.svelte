<script lang="ts">
	import { academia, publications } from '$lib/content/academia';
	import ProjectGrid from '$lib/content/ProjectGrid.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<svelte:head><title>{m.nav_academia()} — Lupe</title></svelte:head>

<div class="page">
	<h1>{m.nav_academia()}</h1>

	<section id="research" class="section">
		<h2>{m.nav_academia_research()}</h2>
		<ProjectGrid projects={academia} base="/academia" />
	</section>

	<section id="publications" class="section">
		<h2>{m.nav_academia_publications()}</h2>
		<ProjectGrid projects={publications} base="/academia" />
	</section>
</div>
