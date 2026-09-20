<script lang="ts">
	import ProjectDetail from '$lib/content/ProjectDetail.svelte';
	import PaperScroll from '$lib/cv/PaperScroll.svelte';
	import * as m from '$lib/paraglide/messages';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

{#if data.project.paper}
	<PaperScroll project={data.project} backHref="/cv" />
{:else}
	<ProjectDetail project={data.project} backHref="/cv" backLabel={m.nav_cv()} />
{/if}
