<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as m from '$lib/paraglide/messages';
	let { children }: { children: Snippet } = $props();
</script>

<div class="page workshop-overview">
	<header class="sign">
		<div class="mount">
			<svg class="sign-cable" viewBox="0 0 150 48" fill="none" aria-hidden="true"
				><path d="M6 2h109q22 0 22 17v28" stroke="#13131d" stroke-width="5" /><path
					d="M6 1h109q22 0 22 18v28"
					stroke="#776170"
					stroke-width="1.5"
				/></svg
			>
			<h1>{m.nav_projects()}</h1>
		</div>
		<p>{m.projects_intro()}</p>
	</header>
	<div class="room-contents">{@render children()}</div>
	<div class="room-floor" aria-hidden="true">
		<svg viewBox="0 0 1120 88" preserveAspectRatio="none" fill="none"
			><path
				d="M0 23H1120M0 61H1120M140 0 84 88M280 0 247 88M420 0 409 88M560 0V88M700 0 712 88M840 0 875 88M980 0 1038 88"
				stroke="#a17b9245"
			/><path d="M0 24H1120M0 62H1120" stroke="#080e1b88" /></svg
		>
	</div>
</div>

<style>
	.workshop-overview {
		position: relative;
		isolation: isolate;
		max-width: 72rem;
		padding: 1.5rem 1rem 0;
		--fg-muted: #d2bdcd;
	}
	.workshop-overview::before {
		content: '';
		position: absolute;
		z-index: -1;
		inset: -2rem -1rem 2rem;
		background: radial-gradient(ellipse at 50% 10%, #df5eaf1f, #df5eaf08 35%, transparent 65%);
		pointer-events: none;
	}
	.sign {
		text-align: center;
		margin: 0 auto 2.75rem;
	}
	.mount {
		position: relative;
		isolation: isolate;
		width: fit-content;
		max-width: 100%;
		margin: 0 auto 1rem;
		padding: 1rem 2rem;
		background: linear-gradient(120deg, #38303c, #26222e 75%);
		border: 1px solid #73556c;
		border-radius: 0.25rem;
		box-shadow:
			0 9px 9px #120e1a88,
			inset 1px 1px 1px #b6899f33,
			0 0 50px #fa5ab218;
	}
	.mount::before,
	.mount::after {
		content: '';
		position: absolute;
		top: -7px;
		bottom: -7px;
		width: 9px;
		background: linear-gradient(
			#9d8793,
			#524653 12px,
			transparent 13px calc(100% - 12px),
			#8c7884 calc(100% - 11px),
			#514250
		);
		filter: drop-shadow(1px 3px 2px #0a0b12);
		pointer-events: none;
	}
	.mount::before {
		left: 12px;
	}
	.mount::after {
		right: 12px;
	}
	.sign-cable {
		position: absolute;
		width: 150px;
		height: 48px;
		top: -47px;
		right: 3px;
		z-index: -1;
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
		position: relative;
		isolation: isolate;
		height: 5.5rem;
		margin: 2rem -1rem 0;
		border-top: 0.85rem solid #51363d;
		border-image: linear-gradient(#a18380, #5b4244 25%, #2f2633 80%, #13101c) 1;
		background:
			linear-gradient(#151621aa, transparent 30%),
			linear-gradient(110deg, #353341, #282331 60%, #322432);
		box-shadow: 0 -1px 0 #bb83a43d;
	}
	.room-floor svg {
		width: 100%;
		height: 100%;
	}
	.room-floor::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(ellipse at 20% 0%, #7cdfdd30, #7cdfdd0b 36%, transparent 60%);
		opacity: 0.6;
		transition: opacity 220ms ease;
	}
	.workshop-overview:has(:global(.studio-entrance:focus-visible)) .room-floor::after {
		opacity: 1;
	}
	@media (hover: hover) {
		.workshop-overview:has(:global(.studio-entrance:hover)) .room-floor::after {
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.room-floor::after {
			transition: none;
		}
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
