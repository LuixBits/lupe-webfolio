<script lang="ts">
	import { onMount } from 'svelte';

	let {
		viewport = false,
		duration = 820,
		delay = 0
	}: {
		viewport?: boolean;
		duration?: number;
		delay?: number;
	} = $props();
	let active = $state(false);
	let startDelay = $state(0);

	// SSR and reduced motion start with the complete picture. Every animation
	// ends and removes its overlay; it never blocks a link or a player control.
	onMount(() => {
		const preference = matchMedia('(prefers-reduced-motion: reduce)');
		if (preference.matches) return;
		startDelay = delay;
		active = true;
		const timer = window.setTimeout(() => (active = false), duration + startDelay + 40);
		const stop = () => {
			if (preference.matches) active = false;
		};
		preference.addEventListener('change', stop);
		return () => {
			clearTimeout(timer);
			preference.removeEventListener('change', stop);
		};
	});
</script>

{#if active}
	<div
		class="power-on"
		class:viewport
		style:--power-duration="{duration}ms"
		style:--power-delay="{startDelay}ms"
		aria-hidden="true"
	>
		<span class="shutter top"></span><span class="shutter bottom"></span><span class="line"></span>
	</div>
{/if}

<style>
	.power-on {
		position: absolute;
		inset: 0;
		z-index: 8;
		overflow: hidden;
		border-radius: inherit;
		pointer-events: none;
	}
	.viewport {
		position: fixed;
		z-index: 30;
		border-radius: 0;
	}
	.shutter {
		position: absolute;
		left: 0;
		right: 0;
		height: 50%;
		background: #08090f;
		animation: open var(--power-duration) cubic-bezier(0.22, 0.75, 0.2, 1) var(--power-delay) both;
	}
	.top {
		top: 0;
		transform-origin: top;
	}
	.bottom {
		bottom: 0;
		transform-origin: bottom;
	}
	.line {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 2px;
		background: #d9fff7;
		box-shadow:
			0 0 20px #8cfaeb,
			0 0 5px #fff;
		animation: beam var(--power-duration) ease-out var(--power-delay) both;
	}
	@keyframes open {
		0%,
		32% {
			transform: scaleY(1);
		}
		100% {
			transform: scaleY(0);
		}
	}
	@keyframes beam {
		0% {
			transform: scaleX(0.005);
			opacity: 0;
		}
		26% {
			transform: scaleX(0.8);
			opacity: 1;
		}
		52% {
			transform: scaleX(1);
			opacity: 1;
		}
		100% {
			transform: scaleX(1);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.power-on {
			display: none;
		}
	}
</style>
