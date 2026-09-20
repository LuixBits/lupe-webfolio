<script lang="ts">
	import ProjectDetail from '$lib/content/ProjectDetail.svelte';
	import * as m from '$lib/paraglide/messages';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<ProjectDetail project={data.project} backHref="/projects" backLabel={m.nav_projects()} />
