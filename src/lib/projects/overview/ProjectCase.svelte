<script lang="ts">
	import { resolveLocalized, type Project } from '$lib/content/schema';
	import { localizeHref } from '$lib/paraglide/runtime';
	import TapeArtwork from '../TapeArtwork.svelte';
	let { project, locale }: { project: Project; locale: string } = $props();
</script>

<a
	class="project-case"
	id={`tape-${project.slug}`}
	data-project-tape={project.slug}
	data-project-kind="case"
	href={localizeHref(`/projects/${project.slug}`)}
>
	<span class="cover" aria-hidden="true"><TapeArtwork {project} /></span>
	<div class="paper-label">
		<h3>{resolveLocalized(project.title, locale)}</h3>
		<p>{resolveLocalized(project.tagline, locale)}</p>
	</div>
</a>

<style>
	.project-case {
		position: relative;
		isolation: isolate;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		padding: 1rem;
		background: #302d38;
		border: 1px solid #776174;
		color: #332b3b;
		text-decoration: none;
		scroll-margin-top: 2rem;
	}
	.cover {
		display: block;
		flex: none;
		width: 5rem;
		height: 5rem;
		color: #8de4dd;
	}
	.paper-label {
		flex: 1;
		padding: 0.7rem 0.8rem;
		background: #ece0c7;
	}
	.paper-label h3 {
		margin: 0 0 0.35rem;
		font-size: var(--fs-h3);
	}
	.paper-label p {
		margin: 0;
		font-size: var(--fs-body);
		line-height: 1.5;
		overflow-wrap: anywhere;
	}
	.project-case:focus-visible {
		outline: 3px solid var(--sub-bg);
		outline-offset: 5px;
	}
	@media (min-width: 70rem) {
		:global(#opensource) .project-case {
			flex-direction: row;
			align-items: center;
		}
	}
	@media (max-width: 40rem) {
		.project-case {
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			padding: 0.65rem;
		}
		.cover {
			width: 3.75rem;
			height: 3.75rem;
		}
		.paper-label {
			flex-basis: 11rem;
		}
	}
</style>
