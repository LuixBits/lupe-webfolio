<script lang="ts">
	const id = $props.id();
</script>

<svg aria-hidden="true" class="basket" viewBox="0 0 240 210" fill="none">
	<defs>
		<linearGradient
			id={`${id}-wicker`}
			x1="34"
			y1="100"
			x2="207"
			y2="161"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#ae8e69" /><stop offset=".5" stop-color="#856e53" /><stop
				offset="1"
				stop-color="#544b48"
			/>
		</linearGradient>
		<linearGradient id={`${id}-paper`}
			><stop stop-color="#74918e" /><stop offset=".32" stop-color="#d5dac7" /><stop
				offset="1"
				stop-color="#82978e"
			/></linearGradient
		>
		<clipPath id={`${id}-weave`}><path d="m37 85 166 1-19 105q-62 20-129-1Z" /></clipPath>
	</defs>
	<ellipse cx="120" cy="195" rx="94" ry="12" fill="#171224" opacity=".35" />
	<path d="M38 78q80-24 166 0v17H37Z" fill="#494044" stroke="#ad9274" stroke-width="3" />
	<g transform="rotate(-14 75 105)">
		<path d="M53 26h35v103H53Z" fill={`url(#${id}-paper)`} stroke="#bac4b4" />
		<ellipse cx="70.5" cy="26" rx="17.5" ry="5.5" fill="#dddcc7" stroke="#76918c" />
		<ellipse cx="71" cy="26" rx="9" ry="2.8" stroke="#8da39b" /><path
			d="M76 28v56m-16-30h18m-18 15h18"
			stroke="#577e85"
			opacity=".6"
		/>
	</g>
	<g transform="rotate(7 133 107)">
		<path d="M107 12h38v113h-38Z" fill={`url(#${id}-paper)`} stroke="#bac4b4" />
		<ellipse cx="126" cy="12" rx="19" ry="6" fill="#e3d9bd" stroke="#839b93" /><ellipse
			cx="127"
			cy="12"
			rx="10"
			ry="3"
			stroke="#99a69a"
		/>
		<path d="M133 17v69m-18-42h13v21h-13" stroke="#547b84" opacity=".6" />
		<path d="M107 75h38v6h-38Z" fill="#b2869f" />
	</g>
	<g transform="rotate(21 180 100)"
		><path d="M171 37h18v88h-18Z" fill="#b69467" stroke="#d6b786" /><path
			d="M172 45h8m-8 9h5m-5 9h8m-8 9h5m-5 9h8m-8 9h5"
			stroke="#725a4b"
		/></g
	>
	<path
		d="m37 85 166 1-19 105q-62 20-129-1Z"
		fill={`url(#${id}-wicker)`}
		stroke="#ac906e"
		stroke-width="3"
	/>
	<g clip-path={`url(#${id}-weave)`}>
		{#each [47, 64, 81, 98, 115, 132, 149, 166, 183, 200] as x}
			<path
				d={`M${x} 85 ${120 + (x - 120) * 0.78} 197`}
				stroke="#3e393b"
				stroke-width="5"
				opacity=".5"
			/>
			<path
				d={`M${x + 2} 85 ${122 + (x - 120) * 0.78} 197`}
				stroke="#ccb18a"
				stroke-width="2"
				opacity=".7"
			/>
		{/each}
		{#each [100, 115, 130, 145, 160, 175, 190] as y}
			<path d={`M30 ${y}q90 22 180 0`} stroke="#c1a27c" stroke-width="5" />
			<path d={`M30 ${y + 3}q90 22 180 0`} stroke="#51463f" stroke-width="2" />
		{/each}
	</g>
	<path d="M37 85q82 25 166 1" stroke="#594c45" stroke-width="10" /><path
		d="M37 82q82 25 166 1"
		stroke="#c4aa80"
		stroke-width="5"
	/>
	<path d="m103 118 32 2-1 15-32-2Z" fill="#7d554f" stroke="#c19b7a" /><path
		d="m110 125 17 1"
		stroke="#d3b58b"
	/>
</svg>
