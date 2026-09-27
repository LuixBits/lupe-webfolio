<script lang="ts">
	const id = $props.id();
</script>

<!-- Architectural planes stretch with the doorway; the furniture keeps its own proportions. -->
<svg
	class="studio-recess"
	viewBox="0 0 600 900"
	preserveAspectRatio="none"
	fill="none"
	aria-hidden="true"
>
	<defs>
		<linearGradient id={`${id}-back`} x2=".9" y2="1">
			<stop stop-color="#242a40" /><stop offset=".5" stop-color="#32354a" /><stop
				offset="1"
				stop-color="#25263b"
			/>
		</linearGradient>
		<linearGradient id={`${id}-left`}>
			<stop stop-color="#101a2a" /><stop offset="1" stop-color="#405363" />
		</linearGradient>
		<linearGradient id={`${id}-floor`} x2=".2" y2="1">
			<stop stop-color="#1a2234" /><stop offset="1" stop-color="#4b4556" />
		</linearGradient>
		<radialGradient id={`${id}-light`}>
			<stop stop-color="#94e2db" stop-opacity=".19" /><stop
				offset="1"
				stop-color="#94e2db"
				stop-opacity="0"
			/>
		</radialGradient>
	</defs>
	<path d="M0 0h600l-72 69L78 87Z" fill="#161a2d" />
	<path d="M78 87 528 69v541L78 640Z" fill={`url(#${id}-back)`} />
	<path d="M0 0 78 87v553L0 900Z" fill={`url(#${id}-left)`} />
	<path d="m600 0-72 69v541l72 290Z" fill="#1a2035" />
	<path d="m0 900 78-260 450-30 72 290Z" fill={`url(#${id}-floor)`} />
	<path
		d="m0 31 78 73 450-18 72-29M78 87v553m450-571v541"
		stroke="#7d8398"
		stroke-opacity=".38"
		stroke-width="2"
	/>
	<path d="m0 55 78 45 450-20" stroke="#85c8cc" stroke-opacity=".3" stroke-width="3" />
	<path d="M78 615 528 585v25L78 640Z" fill="#151c2d" stroke="#61717d" stroke-width="2" />
	<path d="m0 869 78-254M528 585l72 277" stroke="#526471" stroke-width="5" />
	<path
		d="M19 839h566M41 764l525-9M63 691l484-15M65 900l96-265m53 265 43-271m84 271-4-277m129 277-27-284"
		stroke="#b4a2b2"
		stroke-opacity=".15"
		stroke-width="2"
	/>
	<ellipse cx="245" cy="570" rx="225" ry="262" fill={`url(#${id}-light)`} />
	<path d="M0 891h600v9H0Z" fill="#918582" />
	<path d="M0 891h600" stroke="#b3ddd1" stroke-opacity=".65" stroke-width="3" />
</svg>
