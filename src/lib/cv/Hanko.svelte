<script lang="ts">
	/** One hanko seal stamp — a square vermilion impression with a carved
	 *  glyph and a printed label beneath. Renders an <a> when `href` is
	 *  given (external artefact links), a <button> otherwise (BibTeX copy).
	 *  The whole control is the tap target (≥44px square seal + label). */
	let {
		glyph,
		label,
		href,
		onclick,
		tilt = 0
	}: {
		glyph: string;
		label: string;
		href?: string;
		onclick?: () => void;
		tilt?: number;
	} = $props();
</script>

{#if href}
	<a class="hanko" {href} target="_blank" rel="noopener">
		<span class="seal" style="--tilt:{tilt}deg" aria-hidden="true">{glyph}</span>
		<span class="hlabel hlabel--out">{label}</span>
	</a>
{:else}
	<button class="hanko" type="button" {onclick}>
		<span class="seal" style="--tilt:{tilt}deg" aria-hidden="true">{glyph}</span>
		<span class="hlabel">{label}</span>
	</button>
{/if}

<style>
	.hanko {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 0.32rem;
		padding: 0.1rem 0.2rem 0.2rem;
		border: 0;
		background: none;
		font: inherit;
		color: var(--ink-muted, #6b5f4d);
		text-decoration: none;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	.seal {
		position: relative;
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		background: var(--seal, #c43f2a);
		color: var(--paper, #f5efdf);
		/* slightly irregular corners: a hand-carved stone, not a UI chip */
		border-radius: 9px 12px 8px 11px;
		box-shadow:
			inset 0 0 0 2px color-mix(in srgb, var(--paper, #f5efdf) 52%, transparent),
			inset 0 0 0 5px color-mix(in srgb, #7e2417 30%, transparent);
		font-family: var(--font-display, Georgia, serif);
		font-weight: 600;
		font-size: 0.76rem;
		letter-spacing: 0.03em;
		transform: rotate(var(--tilt, 0deg));
	}
	.seal::after {
		/* the ink ripple ring, fired on press */
		content: '';
		position: absolute;
		inset: -4px;
		border-radius: inherit;
		border: 1.5px solid var(--seal, #c43f2a);
		opacity: 0;
		pointer-events: none;
	}
	.hlabel {
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		line-height: 1.2;
	}
	.hlabel--out::after {
		/* outward arrow: marks the stamp as an external link */
		content: '\2197\FE0E';
		font-size: 0.85em;
		margin-left: 0.15em;
	}
	.hanko:hover .seal,
	.hanko:focus-visible .seal {
		background: color-mix(in srgb, var(--seal, #c43f2a) 88%, #7e2417);
	}
	.hanko:hover .hlabel,
	.hanko:focus-visible .hlabel {
		color: var(--ink, #2c241b);
	}
	.hanko:focus-visible {
		outline: 2px solid var(--seal, #c43f2a);
		outline-offset: 2px;
		border-radius: 8px;
	}
	@media (prefers-reduced-motion: no-preference) {
		.seal {
			transition: transform 0.12s ease;
		}
		.hanko:active .seal {
			transform: rotate(var(--tilt, 0deg)) scale(0.94);
		}
		.hanko:active .seal::after {
			animation: stampRing 0.55s ease-out forwards;
		}
	}
	@keyframes stampRing {
		from {
			opacity: 0.85;
			transform: scale(0.88);
		}
		to {
			opacity: 0;
			transform: scale(1.18);
		}
	}
</style>
