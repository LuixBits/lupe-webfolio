<script lang="ts">
	import { projects, projectsByCategory } from '$lib/content/projects';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import OverviewRoom from '$lib/projects/overview/OverviewRoom.svelte';
	import StudioEntrance from '$lib/projects/overview/StudioEntrance.svelte';
	import ProjectCase from '$lib/projects/overview/ProjectCase.svelte';

	const locale = getLocale();
	const studio = projects.find((project) => project.channel && project.featured);
	const displays = [
		{ id: 'opensource', label: m.nav_projects_opensource },
		{ id: 'web', label: m.nav_projects_web }
	] as const;
</script>

<svelte:head>
	<title>{m.nav_projects()} — Lupe</title>
	<meta name="description" content={m.meta_desc_projects()} />
</svelte:head>

{#snippet cases(category: 'youtube' | 'opensource' | 'web')}
	{@const items = projectsByCategory(category).filter((project) => project !== studio)}
	{#if items.length}
		<ul class="cases">
			{#each items as project (project.slug)}<li><ProjectCase {project} {locale} /></li>{/each}
		</ul>
	{/if}
{/snippet}

<OverviewRoom>
	<section id="youtube" class="project-display studio">
		<h2>{m.nav_projects_youtube()}</h2>
		{#if studio}<StudioEntrance project={studio} {locale} />{/if}
		{@render cases('youtube')}
	</section>
	<div class="display-counter">
		{#each displays as display (display.id)}
			<section id={display.id} class="project-display">
				<h2>{display.label()}</h2>
				{@render cases(display.id)}
			</section>
		{/each}
	</div>
</OverviewRoom>

<style>
	.project-display {
		min-width: 0;
		scroll-margin-top: 2rem;
	}
	.project-display h2 {
		font-size: var(--fs-h2);
		margin: 0 0 1rem;
	}
	.studio {
		display: flex;
		flex-direction: column;
	}
	.display-counter {
		position: relative;
		isolation: isolate;
		display: grid;
		gap: 2.5rem;
		align-content: start;
		padding-inline: 0.7rem;
	}
	.display-counter::before {
		content: '';
		position: absolute;
		z-index: -1;
		inset: 3.5rem -0.2rem -1.25rem;
		border: 1px solid #a4818973;
		border-top: 0;
		border-bottom: 1rem solid #543c35;
		border-radius: 3px;
		background:
			linear-gradient(115deg, #688c961a, transparent 35%, #b7759510 76%, #a896ac18), #15182555;
		box-shadow:
			inset 4px 0 0 #a77e6755,
			inset -4px 0 0 #a77e6755,
			8px 12px 20px #0b0b1955;
		pointer-events: none;
	}
	.display-counter::after {
		content: '';
		position: absolute;
		z-index: -1;
		left: 6%;
		right: 6%;
		bottom: -2.2rem;
		height: 1rem;
		border-inline: 1rem solid #28232d;
		pointer-events: none;
	}
	.cases {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
		gap: 1.6rem 1.25rem;
		padding: 0;
		margin: 0;
	}
	.cases li {
		position: relative;
		isolation: isolate;
		display: grid;
		min-width: 0;
		padding: 0 0.6rem 1.2rem;
		background: linear-gradient(#bd9371, #7e5b48 20%, #593b30 78%, #2c2228) bottom / 100% 0.85rem
			no-repeat;
		box-shadow: 0 12px 12px -6px #0c0c19b3;
	}
	.cases li::before {
		content: '';
		position: absolute;
		z-index: -1;
		inset: 20% 0 -1.9rem;
		background: linear-gradient(
			90deg,
			transparent 7%,
			#292432 7% calc(7% + 9px),
			transparent calc(7% + 10px) calc(93% - 10px),
			#292432 calc(93% - 9px) 93%,
			transparent 93%
		);
		pointer-events: none;
	}
	.cases li::after {
		content: '';
		position: absolute;
		left: 7%;
		right: 7%;
		bottom: -1.7rem;
		height: 5px;
		background:
			radial-gradient(circle at 4px 50%, #a494a0 1px, #17131d 2px, transparent 3px),
			radial-gradient(circle at calc(100% - 4px) 50%, #a494a0 1px, #17131d 2px, transparent 3px);
		pointer-events: none;
	}
	.studio .cases {
		margin-top: 2rem;
	}
	@media (max-width: 40rem) {
		.display-counter {
			padding-inline: 4px;
		}
		.cases li {
			padding-inline: 8px;
		}
	}
</style>
