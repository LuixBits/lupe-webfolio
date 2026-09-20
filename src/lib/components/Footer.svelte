<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ThemeName } from '$lib/themes';
	import FooterWave from './footer/FooterWave.svelte';
	import FooterGarden from './footer/FooterGarden.svelte';
	import FooterVaporwave from './footer/FooterVaporwave.svelte';
	import FooterCosmos from './footer/FooterCosmos.svelte';

	let {
		/** Active theme — selects the footer's decoration (water = the wave). */
		theme = 'garden',
		/** The corner the radial menu is docked to, so the bar can clear it. */
		dockCorner = null,
		actions,
		branding,
		links,
		barHeight = 64,
		waveHeight = 92,
		/** Copyright year (server-computed to avoid a New-Year hydration mismatch). */
		year = new Date().getFullYear()
	}: {
		theme?: ThemeName;
		dockCorner?: string | null;
		actions?: Snippet;
		branding?: Snippet;
		links?: Snippet;
		barHeight?: number;
		waveHeight?: number;
		year?: number;
	} = $props();

	// Only the bottom-docked corners overlap the footer; reserve space there so
	// the docked menu quarter never covers the bar content (e.g. the switcher).
	const clearLeft = $derived(dockCorner === 'bottom-left' ? '13rem' : '0px');
	const clearRight = $derived(dockCorner === 'bottom-right' ? '13rem' : '0px');

	const decorations = {
		garden: FooterGarden,
		water: FooterWave,
		vaporwave: FooterVaporwave,
		cosmos: FooterCosmos
	};
	const Decoration = $derived(decorations[theme] ?? FooterGarden);
</script>

<footer
	class="footer"
	style="--bar-h:{barHeight}px; --wave-h:{waveHeight}px; --clear-l:{clearLeft}; --clear-r:{clearRight};"
>
	<!-- Theme decoration cresting above the bar. Purely decorative. -->
	<div class="deco" aria-hidden="true">
		<Decoration />
	</div>

	<div class="bar">
		<div class="bar-left">
			{#if branding}
				{@render branding()}
			{:else}
				<span class="copy">&copy; {year} Luiz Perren</span>
			{/if}
		</div>

		<nav class="bar-center" aria-label="Footer links">
			{#if links}
				{@render links()}
			{/if}
		</nav>

		<div class="bar-right">
			{#if actions}
				{@render actions()}
			{/if}
		</div>
	</div>
</footer>

<style>
	.footer {
		position: relative;
		padding-top: var(--wave-h);
		color: var(--on-hub);
		isolation: isolate;
	}
	.deco {
		position: absolute;
		inset: 0 0 auto 0;
		height: calc(var(--wave-h) + var(--bar-h));
		margin-bottom: -1px;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
	}
	.bar {
		position: relative;
		z-index: 1;
		min-height: var(--bar-h);
		background: var(--hub-bg);
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem clamp(1rem, 4vw, 2.5rem);
		padding-left: calc(clamp(1rem, 4vw, 2.5rem) + var(--clear-l, 0px));
		padding-right: calc(clamp(1rem, 4vw, 2.5rem) + var(--clear-r, 0px));
	}
	.bar-left {
		justify-self: start;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
		font-size: 0.85rem;
		color: color-mix(in srgb, var(--on-hub) 90%, transparent);
	}
	.copy {
		white-space: nowrap;
		letter-spacing: 0.02em;
	}
	.bar-center {
		justify-self: center;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 0;
	}
	.bar-right {
		justify-self: end;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 0;
	}
	@media (max-width: 34rem) {
		.bar {
			grid-template-columns: 1fr auto;
		}
		.bar-center {
			display: none;
		}
	}
</style>
