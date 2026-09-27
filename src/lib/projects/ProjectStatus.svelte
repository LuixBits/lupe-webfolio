<script lang="ts">
	import type { Project } from '$lib/content/schema';
	import * as m from '$lib/paraglide/messages';
	let { project }: { project: Project } = $props();
</script>

{#if project.status}
	<p class="project-status">
		{project.status === 'upcoming'
			? m.workshop_upcoming()
			: project.status === 'in-development'
				? m.workshop_in_development()
				: m.workshop_sample_preview()}
	</p>
{/if}

<style>
	.project-status {
		font: inherit;
		font-size: var(--fs-small);
		margin: 0.5rem 0 0;
		color: inherit;
	}
</style>
