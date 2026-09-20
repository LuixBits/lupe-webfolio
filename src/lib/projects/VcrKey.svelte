<script lang="ts">
	/** A chunky physical VCR front-panel key: raised plastic cap, printed legend,
	 *  and an LED slit that lights when the key is latched down. Deliberately
	 *  boxy — this must read as hardware, not as a pill/tab. */
	let {
		label,
		sub = '',
		active = false,
		latching = false,
		tone = 'ch',
		onclick
	}: {
		/** Printed cap legend. */
		label: string;
		/** Small printed line above the legend (e.g. 'CH-01'). */
		sub?: string;
		/** Latched (pressed-in) state — only meaningful for latching keys. */
		active?: boolean;
		/** Expose aria-pressed (channel selectors); momentary keys omit it. */
		latching?: boolean;
		tone?: 'ch' | 'eject' | 'trk';
		onclick?: () => void;
	} = $props();
</script>

<button
	type="button"
	class="key {tone}"
	class:active
	aria-pressed={latching ? active : undefined}
	{onclick}
>
	{#if sub}<span class="sub">{sub}</span>{/if}
	<span class="cap">{label}</span>
	<span class="led" aria-hidden="true"></span>
</button>

<style>
	.key {
		position: relative;
		flex: 0 0 auto;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.14rem;
		min-height: 46px;
		min-width: 3.4rem;
		padding: 0.42rem 0.8rem 0.62rem;
		border-radius: 5px;
		border: 1px solid color-mix(in srgb, black 55%, var(--slice-bg));
		border-bottom-color: black;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--slice-bg) 34%, var(--hub-bg)),
			color-mix(in srgb, var(--hub-bg) 82%, black) 78%
		);
		box-shadow:
			0 3px 0 color-mix(in srgb, black 72%, var(--hub-bg)),
			0 5px 9px rgba(0, 0, 0, 0.45),
			inset 0 1px 0 rgba(255, 255, 255, 0.14);
		color: var(--fg-muted);
		font-family: var(--font-body);
		cursor: pointer;
		transition:
			transform 90ms ease-out,
			box-shadow 90ms ease-out,
			color 90ms ease-out;
	}
	.sub {
		font-size: 0.5rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		color: color-mix(in srgb, var(--sub-bg) 72%, var(--fg-muted));
	}
	.cap {
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		white-space: nowrap;
	}
	/* LED slit under the legend — dark until the key latches. */
	.led {
		width: 1.1rem;
		height: 3px;
		border-radius: 1px;
		background: color-mix(in srgb, black 60%, var(--slice-bg));
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.7);
	}

	/* Pressed-in: the cap travels down, the bevel flattens, the LED lights. */
	.key.active {
		transform: translateY(3px);
		color: #fff;
		box-shadow:
			0 0 0 color-mix(in srgb, black 72%, var(--hub-bg)),
			inset 0 3px 7px rgba(0, 0, 0, 0.65),
			inset 0 -1px 0 rgba(255, 255, 255, 0.06);
	}
	.key.active .led {
		background: var(--accent);
		box-shadow: 0 0 7px var(--accent);
	}
	.key.active .sub {
		color: var(--sub-bg);
	}

	/* Momentary press feedback for non-latching keys. */
	.key:active {
		transform: translateY(3px);
		box-shadow:
			0 0 0 color-mix(in srgb, black 72%, var(--hub-bg)),
			inset 0 3px 7px rgba(0, 0, 0, 0.65);
	}

	.key.eject .cap {
		color: var(--vapor-sun, #ffd36e);
	}
	.key.trk {
		min-width: 3rem;
	}

	.key:hover .cap {
		color: var(--fg);
	}
	.key:focus-visible {
		outline: 2px solid var(--sub-bg);
		outline-offset: 2px;
	}
</style>
