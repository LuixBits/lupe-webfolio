<script lang="ts">
	/** The old wooden harbor gate standing in the water — two weathered
	 *  posts, a heavy cap beam with corner knees, a tie beam, and a small
	 *  lamp hung between them (the light that marks the channel in). Same
	 *  canonical 140×186 box as ever (waterline at y≈118), with the
	 *  slit-broken mirror reflection. `pid` keeps defs ids unique. */
	let { pid, reflection = true }: { pid: string; reflection?: boolean } = $props();
</script>

<defs>
	<linearGradient id="{pid}-fade" x1="0" y1="120" x2="0" y2="182" gradientUnits="userSpaceOnUse">
		<stop offset="0" stop-color="#fff" stop-opacity="0.62" />
		<stop offset="1" stop-color="#fff" stop-opacity="0" />
	</linearGradient>
	<mask id="{pid}-mask">
		<rect x="0" y="116" width="140" height="70" fill="url(#{pid}-fade)" />
		<rect x="0" y="128" width="140" height="2" fill="#000" opacity="0.9" />
		<rect x="0" y="139" width="140" height="2.6" fill="#000" opacity="0.8" />
		<rect x="0" y="153" width="140" height="3" fill="#000" opacity="0.7" />
	</mask>
	<g id="{pid}-gate">
		<!-- posts, slightly splayed into the pond bed -->
		<path class="t-main" d="M25.6 18L34.4 18L29.2 118L19.4 118Z" />
		<path class="t-main" d="M105.6 18L114.4 18L120.6 118L110.8 118Z" />
		<!-- corner knees under the cap -->
		<path class="t-dark" d="M33.5 18L33.5 32L47 18Z" />
		<path class="t-dark" d="M106.5 18L106.5 32L93 18Z" />
		<!-- tie beam -->
		<path class="t-main" d="M10 50H130V57.5H10Z" />
		<!-- cap beam, overhanging, weathered -->
		<path class="t-dark" d="M6 8L134 8L130 18L10 18Z" />
		<path class="t-grain" d="M12 12 H 128 M16 15 H 124" />
		<!-- the channel lamp on its short rope -->
		<path class="t-rope" d="M70 18L70 29" />
		<circle class="t-lamp-glow" cx="70" cy="36.5" r="10" />
		<ellipse class="t-lamp" cx="70" cy="37" rx="4.6" ry="5.6" />
		<rect
			class="t-lamp-cap"
			x="-2.6"
			y="-8.6"
			width="5.2"
			height="2.4"
			rx="0.9"
			transform="translate(70 37)"
		/>
	</g>
</defs>
<use href="#{pid}-gate" />
{#if reflection}
	<g mask="url(#{pid}-mask)">
		<g transform="translate(0 182.9) scale(1 -0.55)">
			<use href="#{pid}-gate" />
		</g>
	</g>
{/if}
<g class="t-ring" fill="none">
	<ellipse cx="24.3" cy="119" rx="17" ry="3.2" />
	<ellipse cx="115.7" cy="119" rx="17" ry="3.2" />
</g>
<g class="t-collar">
	<ellipse cx="24.3" cy="118" rx="10" ry="2.5" />
	<ellipse cx="115.7" cy="118" rx="10" ry="2.5" />
</g>

<style>
	.t-main {
		fill: #6a4c37;
		stroke: #382718;
		stroke-width: 1;
		stroke-linejoin: round;
	}
	.t-dark {
		fill: #533e2a;
		stroke: #382718;
		stroke-width: 1;
		stroke-linejoin: round;
	}
	.t-grain {
		fill: none;
		stroke: #3a2b1c;
		stroke-width: 0.8;
		opacity: 0.6;
	}
	.t-rope {
		fill: none;
		stroke: #4a3524;
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.t-lamp {
		fill: #f6dfae;
		stroke: #b98a4a;
		stroke-width: 1;
	}
	.t-lamp-cap {
		fill: #5c4527;
	}
	.t-lamp-glow {
		fill: #ffd98c;
		opacity: 0.24;
	}
	.t-ring ellipse {
		stroke: rgba(21, 82, 100, 0.45);
		stroke-width: 1.4;
	}
	.t-collar ellipse {
		fill: #e8f6f9;
		stroke: rgba(21, 82, 100, 0.35);
		stroke-width: 1;
	}
</style>
