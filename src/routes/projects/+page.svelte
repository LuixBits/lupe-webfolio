<script lang="ts">
	import { onMount } from 'svelte';
	import { projects, projectsByCategory } from '$lib/content/projects';
	import { resolveLocalized } from '$lib/content/schema';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import OverviewRoom from '$lib/projects/overview/OverviewRoom.svelte';
	import StudioEntrance from '$lib/projects/overview/StudioEntrance.svelte';
	import ProjectStation from '$lib/projects/overview/ProjectStation.svelte';
	import ProjectShelf from '$lib/projects/overview/ProjectShelf.svelte';
	import NeonSign from '$lib/projects/overview/NeonSign.svelte';
	import NightWindow from '$lib/projects/overview/NightWindow.svelte';
	import WebStationArt from '$lib/projects/overview/WebStationArt.svelte';
	import NeovimStationArt from '$lib/projects/overview/NeovimStationArt.svelte';
	import DesktopStationArt from '$lib/projects/overview/DesktopStationArt.svelte';
	import OrbitApparatus from '$lib/projects/overview/OrbitApparatus.svelte';
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

<svelte:head>
	<title>{m.nav_projects()} — Lupe</title>
	<meta name="description" content={m.meta_desc_projects()} />
</svelte:head>
<OverviewRoom>
	<div class="upper-room">
		<div class="window-light" aria-hidden="true"></div>
		<section class="studio-bay" id="youtube" aria-labelledby="youtube-title">
			<h2 class="category" id="youtube-title">
				<span class="workshop-sr-only">{m.nav_projects_youtube()}</span><NeonSign
					text={m.nav_projects_youtube()}
					color="cyan"
				/>
			</h2>
			{#if studio}<StudioEntrance project={studio} {locale} />{/if}
			{#each projectsByCategory('youtube').filter((project) => project !== studio) as project (project.slug)}
				<div class="extra-station"><ProjectStation {project} {locale} /></div>
			{/each}
		</section>
		<div class="window-bay">
			<div class="window-zone"><NightWindow /></div>
			<!-- Keep the old category fragment useful after moving Webfolio into Web. -->
			<span id="opensource" aria-hidden="true"></span>
			<ProjectShelf
				id="web"
				title={m.nav_projects_web()}
				intro={m.workshop_web_intro()}
				projects={projectsByCategory('web')}
				{locale}
				color="pink"
				housing="network-cabinet"
			>
				{#snippet children(preview)}<WebStationArt project={preview} />{/snippet}
			</ProjectShelf>
		</div>
	</div>
	<div class="workbench collection-bench" data-workshop="bench">
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
		<div class="bench-tools" aria-hidden="true"><WorkshopTools /></div>
		<div class="collection-stations">
			<ProjectShelf
				id="neovim"
				title={m.nav_projects_neovim()}
				intro={m.workshop_neovim_intro()}
				projects={projectsByCategory('neovim')}
				{locale}
			>
				{#snippet children(preview)}<NeovimStationArt project={preview} />{/snippet}
			</ProjectShelf>
			<ProjectShelf
				id="desktop"
				title={m.nav_projects_desktop()}
				intro={m.workshop_desktop_intro()}
				projects={projectsByCategory('desktop')}
				{locale}
				color="violet"
			>
				{#snippet children(preview)}<DesktopStationArt project={preview} />{/snippet}
			</ProjectShelf>
		</div>
		<aside
			class="workshop-experiments ambient-zone"
			id="experiments"
			use:roomActivity
			aria-label={m.workshop_experiments()}
		>
			{#each projectsByCategory('experiments') as project (project.slug)}
				<a
					id={`tape-${project.slug}`}
					data-project-tape={project.slug}
					data-project-kind="case"
					href={localizeHref(`/projects/${project.slug}`)}
				>
					<span class="prototype-art" data-project-object><OrbitApparatus /></span>
					<span
						><strong>{resolveLocalized(project.title, locale)}</strong><span class="prototype-note"
							>{m.workshop_sample_preview()} <span aria-hidden="true">↗</span></span
						></span
					>
				</a>
			{/each}
		</aside>
		<div class="desktop" aria-hidden="true"></div>
	</div>
</OverviewRoom>
