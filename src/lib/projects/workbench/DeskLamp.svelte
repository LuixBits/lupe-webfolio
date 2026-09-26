<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	let { lit = $bindable(true) }: { lit?: boolean } = $props();
</script>

<button
	class="desk-lamp"
	class:lit
	type="button"
	aria-label={lit ? m.workbench_lamp_off() : m.workbench_lamp_on()}
	aria-pressed={lit}
	title={lit ? m.workbench_lamp_off() : m.workbench_lamp_on()}
	onclick={() => (lit = !lit)}
>
	<svg viewBox="0 0 240 280" fill="none" aria-hidden="true">
		<defs>
			<linearGradient
				id="bench-lamp-metal"
				x1="88"
				y1="60"
				x2="156"
				y2="170"
				gradientUnits="userSpaceOnUse"
			>
				<stop stop-color="#91847c" /><stop offset=".35" stop-color="#4d4a50" /><stop
					offset="1"
					stop-color="#24252e"
				/>
			</linearGradient>
			<linearGradient
				id="bench-lamp-shade"
				x1="163"
				y1="36"
				x2="151"
				y2="109"
				gradientUnits="userSpaceOnUse"
			>
				<stop stop-color="#727077" /><stop offset=".35" stop-color="#434450" /><stop
					offset="1"
					stop-color="#212430"
				/>
			</linearGradient>
			<linearGradient id="bench-lamp-base" x1="0" y1="0" x2=".7" y2="1">
				<stop stop-color="#817875" /><stop offset=".45" stop-color="#44424a" /><stop
					offset="1"
					stop-color="#292a35"
				/>
			</linearGradient>
		</defs>
		<ellipse cx="113" cy="261" rx="76" ry="11" fill="#100d16" opacity=".48" />
		<path d="M70 245c-35-9-30-39-9-33 19 5 14 40 63 47" stroke="#15151c" stroke-width="5" />
		<path d="M101 239 54 151l75-93M116 239 70 151l73-88" stroke="#1a1a23" stroke-width="13" />
		<path
			d="M100 236 56 151l75-91M114 236 72 152l70-90"
			stroke="url(#bench-lamp-metal)"
			stroke-width="7"
		/>
		<path d="m63 160 41 55m-37-65 57-73" stroke="#b4a895" stroke-width="1.5" opacity=".65" />
		<path
			d="m66 178 8-2 1 7 7-1 1 7 7-1 1 7 7-1 1 7 7-1"
			stroke="#d4b99a"
			stroke-width="2"
			opacity=".45"
		/>
		<circle cx="64" cy="152" r="13" fill="#35343e" stroke="#8f8178" stroke-width="2" />
		<circle cx="64" cy="152" r="5" fill="#161820" stroke="#b2a492" />
		<path d="m61 154 6-4" stroke="#81776f" stroke-width="2" />
		<circle cx="138" cy="61" r="11" fill="#4b4750" stroke="#a4917e" stroke-width="2" />
		<path d="m139 48 15-6 8 14-17 13" fill="#353540" stroke="#827970" />
		<path
			d="M145 35c12-11 32-12 43-3l21 56c-20 17-46 22-75 13Z"
			fill="url(#bench-lamp-shade)"
			stroke="#8b7e78"
			stroke-width="1.5"
		/>
		<path d="m151 38-8 48m38-50 15 45" stroke="#c4b59c" stroke-width="1.3" opacity=".28" />
		<path d="M134 101c23 8 55 3 75-13" stroke="#161a23" stroke-width="7" />
		<path class="bulb" d="M139 100c20 5 48 1 65-10" stroke="#ffd79b" stroke-width="4" />
		<path d="M55 240v8c0 20 116 20 116 0v-8Z" fill="#20212b" stroke="#77706d" />
		<ellipse
			cx="113"
			cy="240"
			rx="58"
			ry="17"
			fill="url(#bench-lamp-base)"
			stroke="#9b8d80"
			stroke-width="1.4"
		/>
		<path d="M60 244c14 14 81 17 106 1" stroke="#b6a184" opacity=".5" />
		<ellipse cx="108" cy="234" rx="12" ry="4" fill="#252630" stroke="#82766e" />
		<!-- The switch shares the base's perspective instead of floating above it. -->
		<g transform="translate(142 239) rotate(-12) scale(1 .62)">
			<ellipse cy="2" rx="15" ry="14" fill="#141620" />
			<circle r="14" fill="#938272" stroke="#c2ac8e" stroke-width="1.2" />
			<g class="lamp-switch">
				<circle class="switch-face" r="11.5" fill="#2d3038" stroke="#151923" stroke-width="1.5" />
				<path d="M-8-3c2-6 12-8 16-1" stroke="#e2c399" opacity=".35" />
				<path
					class="switch-icon"
					d="M0-7v7m-4.5-4a6 6 0 1 0 9 0"
					stroke="#cbb99e"
					stroke-width="1.7"
					stroke-linecap="round"
				/>
			</g>
		</g>
	</svg>
</button>

<style>
	.desk-lamp {
		position: relative;
		display: block;
		width: 14rem;
		max-width: 100%;
		padding: 0;
		border: 0;
		border-radius: 9px;
		background: none;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	.desk-lamp > svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.bulb {
		opacity: 0.15;
		transition:
			opacity 400ms,
			filter 400ms;
	}
	.lit .bulb {
		opacity: 1;
		filter: drop-shadow(0 3px 7px #ffc77ea6);
	}
	.lit .switch-icon {
		stroke: #ffe5b2;
		filter: drop-shadow(0 0 3px #ffc77e99);
	}
	.desk-lamp:hover .switch-face,
	.desk-lamp:focus-visible .switch-face {
		fill: #5c554d;
		stroke: #c8ae8b;
	}
	.desk-lamp:active .lamp-switch {
		transform: translateY(1px);
	}
	.desk-lamp:focus-visible {
		outline: 2px solid var(--sub-bg);
		outline-offset: 4px;
	}
	@media (prefers-reduced-motion: reduce) {
		.bulb {
			transition: none;
		}
	}
</style>
