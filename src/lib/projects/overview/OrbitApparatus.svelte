<script lang="ts">
	const id = $props.id();
</script>

<svg class="station-art" viewBox="0 0 550 455" fill="none" aria-hidden="true">
	<defs>
		<radialGradient id={`${id}-orbglow`}>
			<stop stop-color="#8bd9da" stop-opacity=".4" />
			<stop offset="1" stop-color="#8bd9da" stop-opacity="0" />
		</radialGradient>
	</defs>
	<ellipse cx="250" cy="242" rx="220" ry="205" fill={`url(#${id}-orbglow)`} />
	<path d="M67 344 162 311h246l73 49-121 37Z" fill="#596574" stroke="#aeb7b0" stroke-width="2" />
	<path
		d="M67 344v41l293 41 121-41v-25l-121 37Z"
		fill="#353947"
		stroke="#89828a"
		stroke-width="2"
	/>
	<path
		d="M104 353V138q0-103 140-103T407 147v204"
		fill="#bbefed0c"
		stroke="#94c3cc"
		stroke-width="3"
	/>
	<path
		d="M117 302V153q0-89 72-99"
		stroke="#d4eddf"
		stroke-opacity=".25"
		stroke-width="8"
		stroke-linecap="round"
	/>
	<ellipse cx="255" cy="342" rx="130" ry="25" fill="#151f2b" />
	<g class="orbit-core" data-workshop-animated>
		<ellipse
			cx="250"
			cy="215"
			rx="137"
			ry="42"
			transform="rotate(-27 250 215)"
			stroke="#f582d2"
			stroke-width="2"
		/>
		<ellipse
			cx="250"
			cy="215"
			rx="116"
			ry="63"
			transform="rotate(32 250 215)"
			stroke="#82e5e3"
			stroke-width="1.5"
		/>
		<path
			d="m250 141 69 39v77l-69 40-67-40v-77Z M183 180l67 41 69-41m-69 41v76m0-156v80"
			stroke="#bce9e4"
			stroke-width="2"
		/>
		<circle cx="139" cy="278" r="5" fill="#f2cda1" />
		<circle cx="366" cy="163" r="4" fill="#fac8da" />
		<circle cx="294" cy="194" r="2" fill="#ddf8e7" />
	</g>
	<circle cx="416" cy="377" r="10" fill="#a3ada5" />
	<circle cx="383" cy="386" r="5" fill="#9ae3d0" />
	<path d="M145 379l130 18m-130-12 130 18" stroke="#1c222f" stroke-width="2" />
	<path d="M470 377q80 13 29 64" stroke="#1b202b" stroke-width="6" />
</svg>
