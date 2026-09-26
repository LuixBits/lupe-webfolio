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
		<path
			d="M75 235c12-14 61-16 79-2l14 16c-23 12-79 12-107 1Z"
			fill="url(#bench-lamp-metal)"
			stroke="#817671"
			stroke-width="1.5"
		/>
		<path d="M65 248c28 9 69 9 98-1" stroke="#b0987d" stroke-width="1.5" opacity=".5" />
	</svg>
	<span class="lamp-switch" aria-hidden="true">
		<svg viewBox="0 0 20 20" fill="none"
			><path
				d="M10 3v6m-4-4a6 6 0 1 0 8 0"
				stroke="currentColor"
				stroke-width="1.7"
				stroke-linecap="round"
			/></svg
		>
	</span>
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
	.lamp-switch {
		position: absolute;
		left: 49%;
		top: 81.5%;
		display: grid;
		place-items: center;
		width: 22px;
		height: 20px;
		border: 1px solid #c5b295;
		border-radius: 4px;
		background: #26272c;
		color: #d2c3b0;
		box-shadow: 0 2px 0 #0f1118;
	}
	.lamp-switch svg {
		width: 13px;
		height: 13px;
	}
	.lit .lamp-switch {
		color: #ffe5b2;
		box-shadow:
			0 2px 0 #0f1118,
			0 0 8px #f0b56c59;
	}
	.desk-lamp:hover .lamp-switch {
		background: #53504d;
		border-color: #ffe5b2;
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
