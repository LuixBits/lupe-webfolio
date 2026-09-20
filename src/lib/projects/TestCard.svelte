<script lang="ts">
	/** Themed CRT test card — pure CSS colour bars in the vaporwave palette.
	 *  Shown when a channel has no live picture (standby poster) or when a
	 *  project has no media at all. Deterministic, no external assets. */
	let {
		title,
		line = ''
	}: {
		/** Mono line printed on the black lower field. */
		title: string;
		/** Optional second, smaller line (e.g. a hostname). */
		line?: string;
	} = $props();
</script>

<div class="card">
	<div class="bars" aria-hidden="true"></div>
	<div class="strip" aria-hidden="true"></div>
	<div class="plate">
		<span class="t">{title}</span>
		{#if line}<span class="l">{line}</span>{/if}
	</div>
	<span class="ring" aria-hidden="true"></span>
</div>

<style>
	.card {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-rows: 46% 10% 1fr;
		background: #05010d;
		overflow: hidden;
	}
	/* Seven full-height colour bars, SMPTE order remapped to the theme. */
	.bars {
		background: linear-gradient(
			90deg,
			#efe9f4 0 14.28%,
			var(--vapor-sun, #ffd36e) 0 28.57%,
			var(--sub-bg, #35e6e6) 0 42.85%,
			#38e089 0 57.14%,
			var(--accent, #ff5ed1) 0 71.42%,
			#ff4f6d 0 85.71%,
			var(--slice-bg, #7b4bd6) 0 100%
		);
	}
	/* Reversed castellation strip under the bars. */
	.strip {
		background: linear-gradient(
			90deg,
			var(--slice-bg, #7b4bd6) 0 14.28%,
			#05010d 0 28.57%,
			var(--accent, #ff5ed1) 0 42.85%,
			#05010d 0 57.14%,
			var(--sub-bg, #35e6e6) 0 71.42%,
			#05010d 0 85.71%,
			#efe9f4 0 100%
		);
	}
	.plate {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		gap: 0.15rem;
		padding-top: clamp(0.3rem, 1.6vw, 0.6rem);
		text-align: center;
	}
	.t {
		font-family: var(--font-body);
		font-size: clamp(0.62rem, 2.4vw, 0.78rem);
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: #efe9f4;
		max-width: 90%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.l {
		font-family: var(--font-body);
		font-size: 0.56rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-muted);
		max-width: 90%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	/* Faint monoscope ring, like a PM5544 alignment circle. */
	.ring {
		position: absolute;
		top: 50%;
		left: 50%;
		width: min(62%, 15rem);
		aspect-ratio: 1;
		translate: -50% -50%;
		border: 1px solid rgba(255, 255, 255, 0.22);
		border-radius: 50%;
		pointer-events: none;
	}
</style>
