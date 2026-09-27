<script lang="ts">
	/** The vermilion torii standing in the water — the owner's call: the
	 *  gate stays red (myōjin silhouette, canonical 140×186 box, waterline
	 *  at y≈118), with a small glass lamp hung from the nuki over the 2013
	 *  chip and the slit-broken mirror reflection. `pid` keeps defs ids
	 *  unique per instance. */
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
		<path class="t-main" d="M25.6 24L34.4 24L29.2 118L19.4 118Z" />
		<path class="t-main" d="M105.6 24L114.4 24L120.6 118L110.8 118Z" />
		<path class="t-main" d="M66.4 24.5H73.6V47H66.4Z" />
		<path class="t-main" d="M7.5 47H132.5V55.5H7.5Z" />
		<path class="t-dark" d="M10.5 15.5H129.5V24.5H10.5Z" />
		<path class="t-dark" d="M1 2C36 9 104 9 139 2L136.5 14.5C104 20 36 20 3.5 14.5Z" />
		<!-- the lamp on its short rope under the nuki -->
		<path class="t-rope" d="M70 55.5L70 64" />
		<circle class="t-lamp-glow" cx="70" cy="71" r="9" />
		<ellipse class="t-lamp" cx="70" cy="71.5" rx="4.2" ry="5.2" />
		<rect
			class="t-lamp-cap"
			x="-2.4"
			y="-7.9"
			width="4.8"
			height="2.2"
			rx="0.8"
			transform="translate(70 71.5)"
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
		fill: #e04530;
	}
	.t-dark {
		fill: #c4321f;
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
