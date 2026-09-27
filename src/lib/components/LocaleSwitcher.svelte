<script lang="ts">
	import { getLocale, setLocale, locales, deLocalizeUrl } from '$lib/paraglide/runtime';
	import { markProjectLocaleChange } from '$lib/projects/navigation';

	// Paraglide's setLocale updates the URL/cookie and reloads into the chosen
	// locale, so the whole tree (menu + content) re-renders translated.
	const current = getLocale();
</script>

<div class="locale" role="group" aria-label="Language">
	{#each locales as loc (loc)}
		<button
			type="button"
			class:active={loc === current}
			aria-pressed={loc === current}
			onclick={() => {
				if (loc !== current && deLocalizeUrl(new URL(location.href)).pathname === '/projects')
					markProjectLocaleChange();
				setLocale(loc);
			}}
		>
			{loc.toUpperCase()}
		</button>
	{/each}
</div>

<style>
	/* Sits on the dark footer bar (--hub-bg): light text, light active pill. */
	.locale {
		display: inline-flex;
		gap: 0.25rem;
		padding: 0.15rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--on-hub) 16%, transparent);
	}
	button {
		border: 0;
		background: transparent;
		color: color-mix(in srgb, var(--on-hub) 96%, transparent);
		font: inherit;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		padding: 0.2rem 0.6rem;
		min-height: 2.5rem; /* comfortable touch target; pill look kept by radius */
		min-width: 2.75rem;
		border-radius: 999px;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}
	button:hover,
	button:focus-visible {
		color: var(--on-hub);
		outline: none;
	}
	:global([data-theme='vaporwave']) button {
		font-size: var(--fs-small);
	}
	button.active {
		background: var(--on-hub);
		color: var(--hub-bg);
	}
</style>
