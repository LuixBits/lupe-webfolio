<script lang="ts">
	import { resolveLocalized, type Project } from '$lib/content/schema';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	let { project, locale }: { project: Project; locale: string } = $props();
</script>

<a
	class="studio-entrance"
	id={`tape-${project.slug}`}
	data-project-tape={project.slug}
	data-project-kind="studio"
	href={localizeHref(`/projects/${project.slug}`)}
>
	<div class="entrance-copy">
		<h3>{resolveLocalized(project.title, locale)}</h3>
		<p>{resolveLocalized(project.tagline, locale)}</p>
	</div>
	<div class="aperture" data-project-aperture aria-hidden="true"></div>
	<span class="action">{m.projects_enter_studio()} <span aria-hidden="true">→</span></span>
</a>

<style>
	.studio-entrance {
		position: relative;
		isolation: isolate;
		display: flex;
		flex-direction: column;
		min-height: 33rem;
		padding: 2rem;
		color: var(--fg);
		text-decoration: none;
		background: #191b28;
		border: 0.65rem solid #514252;
		scroll-margin-top: 2rem;
	}
	.entrance-copy h3 {
		font-size: var(--fs-h2);
		margin: 0 0 0.5rem;
	}
	.entrance-copy p {
		font-size: var(--fs-body);
		color: var(--fg-muted);
		margin: 0;
	}
	.aperture {
		min-height: 12rem;
		flex: 1;
	}
	.action {
		font-size: var(--fs-body);
		color: #c5f4ee;
	}
	.studio-entrance:focus-visible {
		outline: 3px solid var(--sub-bg);
		outline-offset: 6px;
	}
	@media (max-width: 70rem) {
		.studio-entrance {
			min-height: 24rem;
		}
	}
	@media (max-width: 40rem) {
		.studio-entrance {
			padding: 1.25rem;
		}
	}
</style>
