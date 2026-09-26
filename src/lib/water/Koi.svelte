<script lang="ts">
	/** One parametric koi (top view), extracted from WaterScene. Renders a
	 *  <g> — it must sit inside an <svg>. With `swim` it glides along a CSS
	 *  offset-path loop (`rest` = the offset-distance it parks at under
	 *  reduced motion); without `swim` the parent owns positioning and only
	 *  the tail/fins wag. The contact shadow is a radial gradient, not a blur
	 *  filter, so a moving koi never repaints a filter region. */
	import { KOI_BODY, KOI_TAIL, KOI_FIN, KOI_DORSAL, KOI_ROBES, type KoiRobe } from './koi';

	let {
		robe = 'kohaku',
		scale = 1,
		wag = 2,
		swim,
		shadow = true
	}: {
		robe?: KoiRobe;
		scale?: number;
		/** Tail-wag period in seconds. */
		wag?: number;
		/** A closed CSS offset-path loop to swim; dur in seconds. */
		swim?: { path: string; dur: number; rest: string; delay?: number };
		shadow?: boolean;
	} = $props();

	const uid = $props.id();
	const cfg = $derived(KOI_ROBES[robe]);
</script>

{#snippet fig()}
	<g class="koi" transform="scale({scale})" style="--wag:{wag}s">
		{#if shadow}
			<radialGradient id="{uid}-ks">
				<stop offset="0" stop-color="var(--water-deep, #2b9cba)" stop-opacity="0.22" />
				<stop offset="0.7" stop-color="var(--water-deep, #2b9cba)" stop-opacity="0.12" />
				<stop offset="1" stop-color="var(--water-deep, #2b9cba)" stop-opacity="0" />
			</radialGradient>
			<ellipse class="koi-shadow" cx="-4" cy="15" rx="46" ry="9" fill="url(#{uid}-ks)" />
		{/if}
		<g class="koi-tail"><path class="koi-skin" d={KOI_TAIL} style="fill:{cfg.body}" /></g>
		<path class="koi-fin fin-r" d={KOI_FIN} />
		<g transform="scale(1 -1)"><path class="koi-fin fin-l" d={KOI_FIN} /></g>
		<path class="koi-skin" d={KOI_BODY} style="fill:{cfg.body}" />
		<clipPath id="{uid}-kc"><path d={KOI_BODY} /></clipPath>
		<g clip-path="url(#{uid}-kc)">
			{#each cfg.patches as p, i (i)}
				<ellipse
					class="koi-patch"
					cx={p.cx}
					cy={p.cy}
					rx={p.rx}
					ry={p.ry}
					transform="rotate({p.rot} {p.cx} {p.cy})"
					style="fill:{cfg.patch}"
				/>
			{/each}
		</g>
		<path class="koi-dorsal" d={KOI_DORSAL} />
		<path class="koi-spine" d="M52 0C34 -2 6 -2.4 -20 -1" />
		<circle class="koi-eye" cx="49" cy="-7" r="1.8" />
		<circle class="koi-eye" cx="49" cy="7" r="1.8" />
	</g>
{/snippet}

{#if swim}
	<g
		class="koi-mover"
		style="offset-path: path('{swim.path}'); --swim:{swim.dur}s; --rest:{swim.rest}; --kd:{swim.delay ??
			0}s"
	>
		{@render fig()}
	</g>
{:else}
	{@render fig()}
{/if}

<style>
	.koi-mover {
		/* the reduced-motion / pre-animation resting spot on the loop */
		offset-distance: var(--rest, 0%);
		offset-rotate: auto;
	}
	.koi-skin {
		stroke: color-mix(in srgb, var(--water-deep, #2b9cba) 45%, transparent);
		stroke-width: 1;
	}
	.koi-patch {
		opacity: 0.92;
	}
	.koi-fin {
		fill: rgba(255, 255, 255, 0.6);
		stroke: color-mix(in srgb, var(--water-deep, #2b9cba) 35%, transparent);
		stroke-width: 0.8;
		transform-box: fill-box;
		transform-origin: 100% 0%;
	}
	.koi-dorsal {
		fill: color-mix(in srgb, var(--water-deep, #2b9cba) 55%, transparent);
		opacity: 0.5;
	}
	.koi-spine {
		fill: none;
		stroke: color-mix(in srgb, var(--water-deep, #2b9cba) 60%, transparent);
		stroke-width: 0.7;
		opacity: 0.5;
	}
	.koi-eye {
		fill: #14343d;
	}
	.koi-tail {
		transform-box: fill-box;
		transform-origin: 96% 45%;
	}
	@media (prefers-reduced-motion: no-preference) {
		.koi-mover {
			animation: koi-swim var(--swim, 60s) linear infinite;
			animation-delay: var(--kd, 0s);
		}
		.koi-tail {
			animation: koi-tailwag var(--wag, 2s) ease-in-out infinite alternate;
		}
		.koi-fin {
			animation: koi-finwave calc(var(--wag, 2s) * 1.6) ease-in-out infinite alternate;
		}
		.fin-l {
			animation-delay: calc(var(--wag, 2s) * -0.8);
		}
	}
	@keyframes koi-swim {
		from {
			offset-distance: 0%;
		}
		to {
			offset-distance: 100%;
		}
	}
	@keyframes koi-tailwag {
		from {
			transform: rotate(-7deg);
		}
		to {
			transform: rotate(7deg);
		}
	}
	@keyframes koi-finwave {
		from {
			transform: rotate(-9deg);
		}
		to {
			transform: rotate(7deg);
		}
	}
</style>
