<script lang="ts">
	/** Reusable SVG filter defs — render once near the root, reference by id.
	 *
	 *  #gooey  : blur → alpha-contrast. Nearby shapes fuse into one liquid mass,
	 *            so slices collapsing toward a corner read as *melting*.
	 *  #{id}-wobble : animated turbulence displacement for a molten, breathing edge. */
	let { id = 'gooey', strength = 8 }: { id?: string; strength?: number } = $props();
</script>

<svg class="filter-defs" width="0" height="0" aria-hidden="true" focusable="false">
	<defs>
		<filter id={id}>
			<feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blur" />
			<feColorMatrix
				in="blur"
				mode="matrix"
				values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
				result="goo"
			/>
			<feBlend in="SourceGraphic" in2="goo" />
		</filter>
		<filter id={`${id}-wobble`}>
			<feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" result="noise">
				<animate
					attributeName="baseFrequency"
					dur="18s"
					values="0.010;0.016;0.010"
					repeatCount="indefinite"
				/>
			</feTurbulence>
			<feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
		</filter>
	</defs>
</svg>

<style>
	.filter-defs {
		position: absolute;
		pointer-events: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.filter-defs :global(animate) {
			display: none;
		}
	}
</style>
