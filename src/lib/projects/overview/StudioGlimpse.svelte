<script lang="ts">
	const id = $props.id();
</script>

<svg class="studio-art" viewBox="0 0 540 460" fill="none" aria-hidden="true">
	<defs>
		<radialGradient id={`${id}-tvspill`}>
			<stop stop-color="#85e6e0" stop-opacity=".33" />
			<stop offset="1" stop-color="#85e6e0" stop-opacity="0" />
		</radialGradient>
		<linearGradient id={`${id}-glass`} x2=".3" y2="1">
			<stop stop-color="#396477" />
			<stop offset="1" stop-color="#102331" />
		</linearGradient>
		<linearGradient id={`${id}-deskwood`} x2="0" y2="1">
			<stop stop-color="#ad8059" />
			<stop offset="1" stop-color="#624435" />
		</linearGradient>
	</defs>
	<ellipse class="screen-glow" cx="270" cy="240" rx="250" ry="195" fill={`url(#${id}-tvspill)`} />
	<ellipse cx="295" cy="443" rx="219" ry="16" fill="#111c2b" opacity=".3" />
	<path d="M55 344 438 332 530 371 112 389Z" fill="#bd966e" />
	<path d="m112 389 418-18v20l-418 20Z" fill={`url(#${id}-deskwood)`} />
	<path d="m70 356 42 33v22l-42-24Z" fill="#614438" />
	<path d="M128 409v51m355-68-3 67" stroke="#4c3c38" stroke-width="18" />
	<g transform="translate(96 115) rotate(-3)">
		<path d="M6 13 41 0h233l24 20v193l-25 14H7Z" fill="#505b5c" stroke="#98a19a" />
		<rect
			y="16"
			width="279"
			height="213"
			rx="21"
			fill="#292f37"
			stroke="#716f68"
			stroke-width="3"
		/>
		<rect x="15" y="31" width="229" height="170" rx="25" fill="#101c23" />
		<rect x="25" y="40" width="208" height="150" rx="22" fill={`url(#${id}-glass)`} />
		<path d="M44 49q73-8 163 0" stroke="#b3eddb" stroke-opacity=".2" stroke-width="3" />
		<path d="M258 48v130m-6-130v130m12-130v130" stroke="#151c25" stroke-width="2" />
		<circle cx="261" cy="202" r="7" fill="#6a6a66" />
		<circle cx="32" cy="214" r="2" fill="#bcf3ce" />
		<path
			d="M100 104h50m-50 8h90m-90 8h110"
			stroke="#9bf5ee"
			stroke-opacity=".6"
			stroke-width="3"
		/>
	</g>
	<path d="M433 340 404 256l39-68" stroke="#171e29" stroke-width="13" />
	<path d="M431 338 403 256l39-68" stroke="#c5b299" stroke-width="4" />
	<circle cx="404" cy="256" r="9" fill="#41464d" stroke="#b5a990" />
	<path d="M441 177q22-10 32 12l16 39q-19 19-50 8Z" fill="#43444a" stroke="#aaa08d" />
	<path d="M443 235q23 3 42-8" stroke="#f6d79b" stroke-width="4" />
	<ellipse cx="434" cy="344" rx="34" ry="7" fill="#151e28" />
	<path d="M257 366q8 48 85 28t52 62" stroke="#141721" stroke-width="6" />
	<path d="m140 352 100-7 54 15-110 9Z" fill="#625c82" />
	<path d="m154 353 79-5m-65 10 79-5" stroke="#bcaddb" stroke-width="3" />
	<!-- A framed print rests on the far wall above the lamp. -->
	<g transform="translate(383 33) rotate(4)">
		<path d="M8 5 45-13 83 5" stroke="#8b8e9b" stroke-width="1.5" />
		<path d="M6 6h95v119H6Z" fill="#121c2e" opacity=".45" />
		<path d="M0 0h94v118H0Z" fill="#a5938b" stroke="#ddbfab" stroke-width="2" />
		<path d="M8 8h78v100H8Z" fill="#26263f" stroke="#635267" stroke-width="2" />
		<circle cx="57" cy="41" r="21" fill="#d6a1b5" />
		<path d="M34 43h46m-45 6h44m-40 7h36" stroke="#59445f" stroke-width="2" />
		<path d="m8 77 24-19 23 22 12-12 19 9v31H8Z" fill="#516677" />
		<path d="m8 93 22-15 27 23 29-16v23H8Z" fill="#28394c" />
		<path d="M0 117h94" stroke="#554b5f" stroke-width="3" />
	</g>
</svg>
