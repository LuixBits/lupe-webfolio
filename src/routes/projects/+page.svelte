<script lang="ts">
	import { onMount } from 'svelte';
	import { projects, projectsByCategory } from '$lib/content/projects';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import OverviewRoom from '$lib/projects/overview/OverviewRoom.svelte';
	import StudioEntrance from '$lib/projects/overview/StudioEntrance.svelte';
	import ProjectStation from '$lib/projects/overview/ProjectStation.svelte';
	import NightWindow from '$lib/projects/overview/NightWindow.svelte';
	import WorkshopTools from '$lib/projects/overview/WorkshopTools.svelte';
	import WorkshopLampArt from '$lib/projects/overview/WorkshopLampArt.svelte';
	import { roomActivity, useWorkshopState } from '$lib/projects/overview/workshop-state.svelte';
	const locale = getLocale();
	const studio = projects.find((project) => project.channel && project.featured);
	const roomState = useWorkshopState();
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
</script>

<svelte:head
	><title>{m.nav_projects()} — Lupe</title><meta
		name="description"
		content={m.meta_desc_projects()}
	/></svelte:head
>
<OverviewRoom>
	<div class="upper-room">
		<div class="window-light" aria-hidden="true"></div>
		<section class="studio-bay" id="youtube" aria-labelledby="youtube-title">
			<h2 class="category" id="youtube-title">{m.nav_projects_youtube()}</h2>
			{#if studio}<StudioEntrance project={studio} {locale} />{/if}
			{#each projectsByCategory('youtube').filter((project) => project !== studio) as project (project.slug)}<div
					class="extra-station"
				>
					<ProjectStation {project} {locale} />
				</div>{/each}
		</section>
		<div class="window-bay">
			<div class="ambient-zone window-zone" use:roomActivity><NightWindow /></div>
			<section class="portfolio-station" id="opensource" aria-labelledby="opensource-title">
				<h2 class="category" id="opensource-title">{m.nav_projects_opensource()}</h2>
				{#each projectsByCategory('opensource') as project (project.slug)}<div
						class="model-station"
					>
						<ProjectStation {project} {locale} />
					</div>{/each}
			</section>
		</div>
	</div>
	<section class="workbench" id="web" data-workshop="bench" aria-labelledby="web-title">
		<div class="pegboard" aria-hidden="true"></div>
		<div class="lamp-halo" aria-hidden="true"></div>
		<button
			class="work-lamp"
			type="button"
			data-workshop="lamp"
			disabled={!ready}
			aria-pressed={roomState.lampOn}
			aria-label={roomState.lampOn ? m.workshop_lamp_off() : m.workshop_lamp_on()}
			title={roomState.lampOn ? m.workshop_lamp_off() : m.workshop_lamp_on()}
			onclick={() => (roomState.lampOn = !roomState.lampOn)}><WorkshopLampArt /></button
		>
		<div class="bench-header">
			<div>
				<h2 id="web-title">{m.nav_projects_web()}</h2>
				<p>{m.workshop_web_intro()}</p>
			</div>
			<WorkshopTools />
		</div>
		<ul class="stations">
			{#each projectsByCategory('web') as project (project.slug)}<li
					class="station ambient-zone"
					class:orbit={project.slug === 'orbit-toy'}
					class:scrum={project.slug === 'scrumpoker'}
					use:roomActivity
				>
					<ProjectStation {project} {locale} />
				</li>{/each}
		</ul>
		<div class="desktop" aria-hidden="true"></div>
	</section>
</OverviewRoom>
