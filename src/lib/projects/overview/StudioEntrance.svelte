<script lang="ts">
	import { resolveLocalized, type Project } from '$lib/content/schema';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import StudioGlimpse from './StudioGlimpse.svelte';
	import StudioRecess from './StudioRecess.svelte';
	let { project, locale }: { project: Project; locale: string } = $props();
</script>

<a
	class="door studio-entrance"
	id={`tape-${project.slug}`}
	data-project-tape={project.slug}
	data-project-kind="studio"
	href={localizeHref(`/projects/${project.slug}`)}
>
	<StudioRecess />
	<svg class="door-panel" viewBox="0 0 48 640" preserveAspectRatio="none" aria-hidden="true">
		<g data-door-panel
			><path d="M0 0 43 40V599L0 640Z" fill="#726151" stroke="#b29c80" />
			<path d="m10 32 22 22v528l-22 25Z" fill="#584c46" stroke="#998572" />
			<path d="M1 72v28m0 417v28" stroke="#c5b196" stroke-width="5" />
			<path d="M33 310v23m0-14-18-5" stroke="#deca9f" stroke-width="3" stroke-linecap="round" /></g
		>
	</svg>
	<div class="entrance-copy">
		<h3>{resolveLocalized(project.title, locale)}</h3>
		<p>{resolveLocalized(project.tagline, locale)}</p>
	</div>
	<div class="studio-aperture" data-project-aperture data-project-object><StudioGlimpse /></div>
	<span class="action">{m.projects_enter_studio()} <span aria-hidden="true">→</span></span>
</a>
<div class="door-shadow" aria-hidden="true"></div>
