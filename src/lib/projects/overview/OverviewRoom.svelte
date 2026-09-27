<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';
	import * as m from '$lib/paraglide/messages';
	import { projectNavigation, type ProjectNavigation } from '$lib/projects/navigation';
	import { useWorkshopState } from './workshop-state.svelte';
	import WorkshopConnections from './WorkshopConnections.svelte';
	import WorkshopFloor from './WorkshopFloor.svelte';
	import NeonSign from './NeonSign.svelte';
	import './workshop.css';
	import './collections.css';
	let { children }: { children: Snippet } = $props();
	const roomState = useWorkshopState();
	const navigation = getContext<ProjectNavigation>(projectNavigation);
	let ready = $state(false),
		visible = $state(true),
		reduced = $state(true);
	onMount(() => {
		ready = true;
		const preference = matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => {
			reduced = preference.matches;
			visible = !document.hidden;
		};
		update();
		preference.addEventListener('change', update);
		document.addEventListener('visibilitychange', update);
		return () => {
			preference.removeEventListener('change', update);
			document.removeEventListener('visibilitychange', update);
		};
	});
</script>

<div
	class="page workshop-overview"
	class:cool={!roomState.lampOn}
	class:motion-enabled={ready && visible && !reduced && !roomState.paused && !navigation.moving}
	data-workshop-room
>
	<div class="ceiling" aria-hidden="true"></div>
	<WorkshopConnections />
	<header class="room-head">
		<div class="mounted-sign">
			<h1>
				<span class="workshop-sr-only">{m.nav_projects()}</span><NeonSign text={m.nav_projects()} />
			</h1>
		</div>
		<p>{m.projects_intro()}</p>
		<button
			class="motion-switch"
			type="button"
			disabled={!ready || reduced}
			aria-pressed={roomState.paused}
			onclick={() => (roomState.paused = !roomState.paused)}
		>
			{roomState.paused ? m.workshop_motion_resume() : m.workshop_motion_pause()}
		</button>
	</header>
	{@render children()}
	<WorkshopFloor {ready} />
</div>
