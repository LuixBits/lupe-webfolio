<script lang="ts">
	const id = $props.id();
</script>

<!-- A decorative glimpse through the doorway. No player, media request or control. -->
<svg viewBox="0 0 420 310" fill="none" aria-hidden="true">
	<defs>
		<linearGradient id={`${id}-wall`} x2="1" y2="1">
			<stop stop-color="#20232f" /><stop offset=".65" stop-color="#44313a" /><stop
				offset="1"
				stop-color="#28202b"
			/>
		</linearGradient>
		<radialGradient id={`${id}-blue`}
			><stop stop-color="#91ded9" stop-opacity=".4" /><stop
				offset=".5"
				stop-color="#65aec7"
				stop-opacity=".14"
			/><stop offset="1" stop-color="#65aec7" stop-opacity="0" /></radialGradient
		>
		<radialGradient id={`${id}-warm`}
			><stop stop-color="#ffc982" stop-opacity=".48" /><stop
				offset=".48"
				stop-color="#eead6f"
				stop-opacity=".15"
			/><stop offset="1" stop-color="#eead6f" stop-opacity="0" /></radialGradient
		>
		<linearGradient id={`${id}-wood`} x2="0" y2="1"
			><stop stop-color="#b18a64" /><stop offset=".17" stop-color="#6d4b37" /><stop
				offset=".72"
				stop-color="#513629"
			/><stop offset="1" stop-color="#281f24" /></linearGradient
		>
		<linearGradient id={`${id}-cabinet`} x2=".6" y2="1"
			><stop stop-color="#636c77" /><stop offset=".18" stop-color="#41444f" /><stop
				offset="1"
				stop-color="#23252e"
			/></linearGradient
		>
		<linearGradient id={`${id}-glass`} x2=".25" y2="1"
			><stop stop-color="#335563" /><stop offset=".45" stop-color="#152635" /><stop
				offset="1"
				stop-color="#101620"
			/></linearGradient
		>
		<linearGradient id={`${id}-door`} x2="1" y2="0"
			><stop stop-color="#5c4f60" /><stop offset=".2" stop-color="#403647" /><stop
				offset="1"
				stop-color="#211e2b"
			/></linearGradient
		>
		<pattern id={`${id}-vents`} width="5" height="5" patternUnits="userSpaceOnUse"
			><path d="M0 1h5" stroke="#151720" stroke-width="2" /><path
				d="M0 3h5"
				stroke="#6c6973"
				stroke-width=".5"
			/></pattern
		>
		<pattern id={`${id}-scan`} width="4" height="3" patternUnits="userSpaceOnUse"
			><path d="M0 .5h4" stroke="#bbe6e6" stroke-opacity=".07" /></pattern
		>
	</defs>
	<path d="M0 0H420V310H0Z" fill={`url(#${id}-wall)`} />
	<path d="M17 26H418M17 28H418" stroke="#9a7085" stroke-opacity=".18" />
	<path d="M398 0V239L420 266" stroke="#15121f" stroke-width="3" />
	<ellipse class="blue-light" cx="197" cy="152" rx="212" ry="149" fill={`url(#${id}-blue)`} />
	<ellipse cx="342" cy="175" rx="110" ry="133" fill={`url(#${id}-warm)`} />
	<!-- Wooden support, feet and cable put the monitor in the same room as the workbench. -->
	<path d="M62 244H407L418 253H51Z" fill="#967359" />
	<rect
		x="51"
		y="253"
		width="367"
		height="16"
		rx="2"
		fill={`url(#${id}-wood)`}
		stroke="#bc8a61"
		stroke-opacity=".4"
	/>
	<path d="M64 258h335m-318 5h301" stroke="#d0a780" stroke-opacity=".19" />
	<path d="M75 269V310M393 269V310" stroke="#181720" stroke-width="14" />
	<path d="M273 237c16 10 3 24 13 35s-4 27 15 38" stroke="#15151f" stroke-width="4" />
	<ellipse cx="188" cy="250" rx="105" ry="7" fill="#110f1b" opacity=".75" />
	<!-- Chunky 660:510 cabinet proportions, simplified for this distant view. -->
	<g transform="translate(86 78) scale(.345)">
		<path d="M607 41l34-24q9 0 9 13v402q0 17-14 22l-29 16Z" fill="#1d1e27" stroke="#676171" />
		<path d="M39 31 68 10 627 8q13 0 15 10l-29 23Z" fill="#657b7b" stroke="#8b9a9e" />
		<path
			d="M43 28H584q32 0 36 36l4 357q0 32-30 39L52 466q-32 0-34-31L13 63q-1-33 30-35Z"
			fill={`url(#${id}-cabinet)`}
			stroke="#8a8590"
			stroke-width="2"
		/>
		<path
			d="M94 51q200-8 430 0 29 2 32 37l3 291q-4 35-34 37-215 9-433-1-28-3-29-35L60 88q1-33 34-37Z"
			fill="#10151e"
			stroke="#4e5762"
			stroke-width="3"
		/>
		<rect x="87" y="69" width="446" height="333" rx="38" fill={`url(#${id}-glass)`} />
		<rect x="87" y="69" width="446" height="333" rx="38" fill={`url(#${id}-scan)`} />
		<path d="M115 81Q96 83 96 107v56" stroke="#b9f9f1" stroke-opacity=".24" stroke-width="4" />
		<path d="M121 392Q310 400 502 392" stroke="#c8f2ed" stroke-opacity=".15" stroke-width="3" />
		<path d="M167 238h260m-221 11h183" stroke="#94d9d6" stroke-opacity=".55" stroke-width="2" />
		<rect x="30" y="94" width="20" height="282" rx="5" fill={`url(#${id}-vents)`} />
		<rect x="570" y="90" width="28" height="285" rx="5" fill={`url(#${id}-vents)`} />
		<circle cx="84" cy="440" r="4" fill="#a9e3bf" />
		<path d="M434 437h79" stroke="#646774" stroke-width="10" />
		<circle cx="574" cy="436" r="8" fill="#0f1520" stroke="#686674" />
		<path d="M63 465h62l-3 13H61ZM520 461h62v13h-59Z" fill="#12121a" />
	</g>
	<!-- Lamp: warm spill on the plaster and its own pool on the support. -->
	<ellipse cx="338" cy="248" rx="74" ry="12" fill={`url(#${id}-warm)`} />
	<path d="M331 241 312 205 346 160" stroke="#171821" stroke-width="9" stroke-linejoin="round" />
	<path d="M330 239 316 205 349 161" stroke="#827775" stroke-width="2" />
	<circle cx="316" cy="205" r="5" fill="#34343e" stroke="#a28f7e" />
	<path d="M341 150q7-10 17-2l18 28q-11 10-30 8Z" fill="#3c3d48" stroke="#928584" />
	<path d="M346 184q17 3 30-8" stroke="#ffcd8a" stroke-width="3" />
	<ellipse cx="333" cy="245" rx="23" ry="5" fill="#25242f" stroke="#9c8472" />
	<!-- Already open: only the narrow edge of the door interrupts the view. -->
	<g class="door-panel" data-door-panel>
		<path d="M4 3 63 28V286L4 310Z" fill={`url(#${id}-door)`} stroke="#928093" />
		<path d="M14 20 53 38V275l-39 16Z" stroke="#a798aa" stroke-opacity=".2" />
		<path d="M4 3V310" stroke="#b6bcba" stroke-width="3" />
		<path d="M10 59v22m0 149v23" stroke="#b6a399" stroke-width="6" />
		<path d="M48 160v15m0-12-16-3" stroke="#080f19" stroke-width="6" stroke-linecap="round" />
		<path d="M48 160v13m0-10-15-3" stroke="#c1b59f" stroke-width="3" stroke-linecap="round" />
		<path d="M59 29V282" stroke="#95e6e2" stroke-opacity=".3" />
	</g>
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	.door-panel {
		transform-origin: 4px 155px;
		transition: transform 220ms ease;
	}
	.blue-light {
		opacity: 0.7;
		transition: opacity 220ms ease;
	}
	:global(.studio-entrance:focus-visible) .door-panel {
		transform: scaleX(0.72);
	}
	:global(.studio-entrance:focus-visible) .blue-light {
		opacity: 1;
	}
	@media (hover: hover) {
		:global(.studio-entrance:hover) .door-panel {
			transform: scaleX(0.72);
		}
		:global(.studio-entrance:hover) .blue-light {
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.door-panel,
		.blue-light {
			transition: none;
		}
		:global(.studio-entrance:hover) .door-panel,
		:global(.studio-entrance:focus-visible) .door-panel {
			transform: none;
		}
	}
</style>
