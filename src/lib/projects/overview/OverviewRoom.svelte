<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as m from '$lib/paraglide/messages';
	let { children }: { children: Snippet } = $props();
</script>

<div class="page workshop-overview">
	<header class="sign">
		<div class="mount"><h1>{m.nav_projects()}</h1></div>
		<p>{m.projects_intro()}</p>
	</header>
	<div class="room-contents">{@render children()}</div>
	<div class="room-floor" aria-hidden="true"></div>
</div>

<style>
	.workshop-overview {
		position: relative;
		isolation: isolate;
		max-width: 72rem;
		padding: 1.5rem 1rem 0;
		--fg-muted: #d2bdcd;
	}
	.sign {
		text-align: center;
		margin: 0 auto 2.75rem;
	}
	.mount {
		width: fit-content;
		max-width: 100%;
		margin: 0 auto 1rem;
		padding: 1rem 2rem;
		background: #27222e;
		border: 1px solid #73556c;
		border-radius: 0.25rem;
	}
	.sign h1 {
		margin: 0;
		color: #ffecfa;
		text-shadow:
			0 0 6px #ffafd7,
			0 0 24px #ff5ed199;
	}
	.sign p {
		font-size: var(--fs-body);
		margin: 0;
		color: var(--fg-muted);
	}
	.room-contents {
		display: grid;
		grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
		gap: 2.4rem 2.5rem;
		align-items: start;
	}
	.room-floor {
		height: 3.5rem;
		margin: 2rem -1rem 0;
		border-top: 0.8rem solid #51363d;
		background: #211d2a;
	}
	@media (max-width: 70rem) {
		.room-contents {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 40rem) {
		.workshop-overview {
			padding: 0.5rem 0 0;
		}
		.sign {
			margin-bottom: 2rem;
		}
		.mount {
			padding: 0.9rem 1.2rem;
		}
		.room-floor {
			margin-inline: 0;
		}
	}
</style>
