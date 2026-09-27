<script lang="ts">
	const id = $props.id();
</script>

<svg viewBox="0 0 320 180" fill="none" aria-hidden="true">
	<defs>
		<linearGradient
			id={`${id}-fur`}
			x1="105"
			y1="46"
			x2="218"
			y2="158"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#e2b180" /><stop offset=".48" stop-color="#c88b5f" /><stop
				offset="1"
				stop-color="#8d5a4d"
			/>
		</linearGradient>
		<linearGradient
			id={`${id}-face`}
			x1="77"
			y1="43"
			x2="114"
			y2="140"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#e9bd8d" /><stop offset="1" stop-color="#c38b66" />
		</linearGradient>
		<linearGradient
			id={`${id}-tail`}
			x1="253"
			y1="98"
			x2="163"
			y2="155"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#bc7c54" /><stop offset=".65" stop-color="#cb9669" /><stop
				offset="1"
				stop-color="#eed0a0"
			/>
		</linearGradient>
	</defs>
	<ellipse cx="170" cy="153" rx="124" ry="14" fill="#1c142a" opacity=".25" />
	<ellipse cx="166" cy="151" rx="105" ry="8" fill="#2e2030" opacity=".32" />
	<g class="cat-body" data-workshop-animated>
		<!-- Shoulder, flank and tucked hind leg share one resting silhouette. -->
		<path
			d="M92 117C80 80 112 49 158 46c60-7 109 18 118 53 12 43-19 57-66 54l-107-4Z"
			fill={`url(#${id}-fur)`}
			stroke="#68493f"
			stroke-width="2"
		/>
		<path d="M127 122q24-26 58-7t51 27q-59 14-109-1Z" fill="#e4b88a" opacity=".7" />
		<path
			d="M137 49q18 14 16 36l-8-5q1-16-15-27m34-8q21 13 25 39l-10-5q-3-18-20-31m39 4q24 13 27 36l-10-5q-5-17-21-24m39 12q18 10 24 27l-12-4-17-20"
			fill="#935e46"
			opacity=".8"
		/>
		<path
			d="M141 52q68-15 106 29"
			stroke="#f3d29a"
			stroke-width="2"
			stroke-linecap="round"
			opacity=".65"
		/>
		<path d="M222 103c-25-5-36 13-29 32" stroke="#98664e" stroke-width="2" stroke-linecap="round" />
		<path
			d="M116 128q36-9 42 7t-33 13H88q-11-6-3-14Z"
			fill="#deb18b"
			stroke="#996d57"
			stroke-width="1.5"
		/>
		<path d="M94 136q-4 5-1 10m9-10q-3 5-1 10" stroke="#aa7a61" stroke-width="1.3" />
		<g class="cat-head">
			<path
				d="M56 73 52 36q18 4 31 20 17-4 32 2l27-20-1 44q12 20-2 40c-15 21-58 25-78 6-16-14-16-39-5-55Z"
				fill={`url(#${id}-face)`}
				stroke="#835b49"
				stroke-width="2"
				stroke-linejoin="round"
			/>
			<path d="m59 47 6 26 13-12Zm76 3-16 15 14 10Z" fill="#b97b76" />
			<path d="m62 51 4 16m66-11-8 10" stroke="#f2c4a1" stroke-width="2" stroke-linecap="round" />
			<path
				d="m82 61 7 20 6-13 6 13 9-19-5 4-4 8-6-13-6 12-3-10Zm-28 29 13 7-16 1m0 7 15 2-12 6m88-23-15 8 16-1m0 9-15 1 12 6"
				fill="#9e674b"
			/>
			<path d="M75 111q12-9 22-2 12-8 24 0 0 19-24 21-22-1-22-19Z" fill="#edcaa1" />
			<g class="closed-eye" stroke="#544039" stroke-width="2.6" stroke-linecap="round">
				<path d="M66 98q8 7 17 0m28 0q8 6 16-1" />
			</g>
			<g class="open-eye">
				<path
					d="M64 97q10-11 21 0-9 10-21 0Zm44 0q10-11 21-1-9 10-21 1Z"
					fill="#b8cf9d"
					stroke="#654536"
					stroke-width="1.5"
				/>
				<path d="M75 92v9m44-10v9" stroke="#354137" stroke-width="3" stroke-linecap="round" />
				<circle cx="77" cy="94" r="1.2" fill="#fff5db" /><circle
					cx="121"
					cy="93"
					r="1.2"
					fill="#fff5db"
				/>
			</g>
			<path d="M91 110q6-3 12 0l-6 6Z" fill="#9a6260" />
			<path
				d="M97 116v4m-8 1q4 4 8-1 5 4 9-1"
				stroke="#8c6152"
				stroke-width="1.4"
				stroke-linecap="round"
			/>
			<path
				d="m70 113-32-5m31 11-35 2m89-9 29-7m-28 13 33 2"
				stroke="#f3d5b1"
				stroke-width="1.3"
				stroke-linecap="round"
			/>
			<path
				d="m71 127 7 5m47-6-8 7"
				stroke="#ffe1b8"
				stroke-width="2"
				stroke-linecap="round"
				opacity=".65"
			/>
		</g>
	</g>
	<g class="tail">
		<path
			d="M258 100c29 43-5 57-41 48-28-7-47-1-62-8"
			stroke="#795244"
			stroke-width="28"
			stroke-linecap="round"
		/>
		<path
			d="M258 98c29 43-5 57-41 48-28-7-47-1-62-8"
			stroke={`url(#${id}-tail)`}
			stroke-width="23"
			stroke-linecap="round"
		/>
		<path
			d="m267 118-18 5m12 16-12-11m-10 22-3-15m-20 10 2-11"
			stroke="#96634c"
			stroke-width="5"
			stroke-linecap="round"
		/>
		<path
			d="M166 140q32-2 55 5"
			stroke="#f4c999"
			stroke-width="1.5"
			stroke-linecap="round"
			opacity=".7"
		/>
	</g>
</svg>
