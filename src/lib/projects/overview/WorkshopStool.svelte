<script lang="ts">
	const id = $props.id();
</script>

<svg aria-hidden="true" class="stool" viewBox="0 0 270 360" fill="none">
	<defs>
		<linearGradient
			id={`${id}-wood`}
			x1="69"
			y1="34"
			x2="194"
			y2="97"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#d8ad79" /><stop offset=".5" stop-color="#b9865b" /><stop
				offset="1"
				stop-color="#8b5d47"
			/>
		</linearGradient>
		<linearGradient
			id={`${id}-edge`}
			x1="46"
			y1="76"
			x2="229"
			y2="107"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#a17457" /><stop offset=".4" stop-color="#745041" /><stop
				offset="1"
				stop-color="#4c3940"
			/>
		</linearGradient>
		<linearGradient
			id={`${id}-steel`}
			x1="58"
			y1="170"
			x2="211"
			y2="198"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#7eb4b3" /><stop offset=".12" stop-color="#3f5360" /><stop
				offset=".6"
				stop-color="#68707a"
			/><stop offset="1" stop-color="#a67f9b" />
		</linearGradient>
	</defs>
	<ellipse cx="137" cy="332" rx="114" ry="18" fill="#140f22" opacity=".35" />
	<!-- Far legs and the back half of the foot ring sit behind the front frame. -->
	<path
		d="m102 96-26 209m92-213 28 212"
		stroke="#242630"
		stroke-width="12"
		stroke-linecap="round"
	/>
	<path d="m102 102-25 194m91-198 27 197" stroke="#66717c" stroke-width="3" />
	<path d="M65 251q69-42 138-2" stroke="#1c222e" stroke-width="11" />
	<path d="M65 248q69-42 138-2" stroke={`url(#${id}-steel)`} stroke-width="4" />
	<path
		d="m79 94-37 231m145-232 41 231"
		stroke="#1d202c"
		stroke-width="15"
		stroke-linecap="round"
	/>
	<path
		d="m77 98-36 221m144-220 40 220"
		stroke={`url(#${id}-steel)`}
		stroke-width="5"
		stroke-linecap="round"
	/>
	<path d="M65 250q67 41 138-1" stroke="#161c28" stroke-width="12" />
	<path d="M65 247q67 41 138-1" stroke={`url(#${id}-steel)`} stroke-width="5" />
	<path d="M76 113q58 21 112-1" stroke="#242631" stroke-width="10" />
	<path d="M80 112q54 18 104-1" stroke="#848183" stroke-width="2" />
	<g fill="#a1a9a7" stroke="#34313c" stroke-width="1.5">
		<circle cx="78" cy="116" r="4" /><circle cx="187" cy="115" r="4" />
		<circle cx="63" cy="251" r="3.5" /><circle cx="207" cy="250" r="3.5" />
	</g>
	<path
		d="M44 69v22c6 41 180 41 183 0V69Z"
		fill={`url(#${id}-edge)`}
		stroke="#624c43"
		stroke-width="2"
	/>
	<path d="M47 90c12 36 160 36 177 0" stroke="#cd9970" stroke-width="2" opacity=".65" />
	<ellipse
		cx="135"
		cy="68"
		rx="92"
		ry="34"
		fill={`url(#${id}-wood)`}
		stroke="#ddba8c"
		stroke-width="2"
	/>
	<ellipse cx="135" cy="66" rx="81" ry="26" stroke="#795740" stroke-width="1.5" />
	<g stroke="#72523e" stroke-width="1" opacity=".55">
		<path
			d="M64 60q51-20 139-4M58 70q61-23 151-3M74 82q77-22 118-4M90 89q42-12 77-5M104 44q53 4 74 7"
		/>
		<path d="M120 60c-32-6-38 8-7 9 31 2 33-7 7-9Zm-15 5q9-5 19 0" />
	</g>
	<path
		d="m75 53 20-5m74 35 25-5M51 75l11 7"
		stroke="#f0c99b"
		stroke-width="2"
		stroke-linecap="round"
	/>
	<path
		d="m36 322-1 10q7 5 16 0v-9m171-1v10q8 5 16-1l-2-9M69 299v9q6 4 14 0v-9m107 0v9q6 4 14 0l-1-9"
		fill="#272531"
		stroke="#645960"
	/>
</svg>
