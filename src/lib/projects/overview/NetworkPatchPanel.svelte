<script lang="ts">
	const id = $props.id();
	const cables = [
		{ x: 72, to: 94, color: '#7ccec8', drop: 68 },
		{ x: 160, to: 204, color: '#d792c4', drop: 81 },
		{ x: 292, to: 314, color: '#a398d6', drop: 69 },
		{ x: 380, to: 424, color: '#d8af80', drop: 85 }
	];
</script>

<svg viewBox="0 0 580 130" fill="none" aria-hidden="true">
	<defs>
		<linearGradient id={`${id}-metal`} x2="0" y2="1">
			<stop stop-color="#7e7d92" />
			<stop offset=".12" stop-color="#535669" />
			<stop offset=".86" stop-color="#343849" />
			<stop offset="1" stop-color="#777085" />
		</linearGradient>
		<pattern id={`${id}-grille`} width="7" height="6" patternUnits="userSpaceOnUse">
			<circle cx="3" cy="3" r="1.5" fill="#1b202e" />
		</pattern>
	</defs>
	<rect x="5" y="16" width="570" height="106" rx="4" fill="#121222" opacity=".7" />
	<!-- Rack ears and screws attach both units to the cabinet's mounting rails. -->
	{#each [8, 74] as y}
		<rect {y} width="580" height="43" rx="3" fill={`url(#${id}-metal)`} stroke="#9590a6" />
		<path d={`M25 ${y + 2}v39m529-39v39`} stroke="#222638" stroke-width="2" />
		{#each [12, 568] as x}
			<circle cx={x} cy={y + 21} r="4" fill="#242936" stroke="#a3a3b0" />
			<path d={`m${x - 2} ${y + 22} 4-2`} stroke="#a6a7b7" />
		{/each}
	{/each}
	<rect x="43" y="17" width="365" height="25" rx="2" fill="#252636" stroke="#858096" />
	{#each [0, 1, 2, 3, 4, 5, 6, 7] as port}
		<path d={`M${58 + port * 44} 22h29v15h-9v4h-11v-4h-9Z`} fill="#111b29" stroke="#9596a6" />
		<path d={`M${63 + port * 44} 25h19`} stroke="#c1b592" stroke-width="2" stroke-dasharray="1 2" />
	{/each}
	<rect x="431" y="17" width="105" height="25" fill={`url(#${id}-grille)`} />
	<!-- A shallow server under the patch panel; the network has a visible physical path. -->
	<rect x="48" y="84" width="394" height="22" rx="3" fill="#202a3c" stroke="#718193" />
	{#each [94, 204, 314, 424] as x}
		<rect x={x - 11} y="86" width="23" height="12" rx="1" fill="#131e2c" stroke="#8a91a1" />
		<circle cx={x - 17} cy="92" r="2" fill="#b5d7aa" />
	{/each}
	{#each [464, 496] as x}
		<circle cx={x} cy="95" r="13" fill={`url(#${id}-grille)`} stroke="#9395a5" />
		<circle cx={x} cy="95" r="9" stroke="#686f81" />
		<path d={`M${x - 12} 95h24m-12-12v24`} stroke="#333a4e" />
	{/each}
	<circle cx="533" cy="95" r="5" fill="#212f3e" stroke="#9ccfc8" />
	<path d="M533 89v6" stroke="#9ccfc8" stroke-width="1.5" />
	{#each cables as cable}
		<path
			d={`M${cable.x} 38v9C${cable.x} ${cable.drop + 18} ${cable.to} ${cable.drop + 18} ${cable.to} 88`}
			stroke="#111622"
			stroke-width="8"
		/>
		<path
			d={`M${cable.x} 38v9C${cable.x} ${cable.drop + 18} ${cable.to} ${cable.drop + 18} ${cable.to} 88`}
			stroke={cable.color}
			stroke-width="4"
		/>
		<rect
			x={cable.x - 6}
			y="28"
			width="12"
			height="16"
			rx="2"
			fill={cable.color}
			stroke="#d6d5ce"
		/>
		<rect
			x={cable.to - 5}
			y="83"
			width="10"
			height="15"
			rx="2"
			fill={cable.color}
			stroke="#c5c6c6"
		/>
	{/each}
	<path d="M35 119h510" stroke="#a592b1" stroke-opacity=".45" />
</svg>
