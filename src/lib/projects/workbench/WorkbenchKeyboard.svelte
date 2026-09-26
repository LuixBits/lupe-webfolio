<svg class="keyboard" viewBox="0 0 440 164" fill="none" aria-hidden="true">
	<defs>
		<linearGradient id="bench-keyboard-shell" x2="0" y2="1">
			<stop stop-color="#ad9c88" /><stop offset="1" stop-color="#645a54" />
		</linearGradient>
	</defs>
	<path d="M29 13h381l25 127-12 15H16L5 140Z" fill="#211c22" stroke="#242029" stroke-width="3" />
	<path
		d="M29 13h381l23 123H7Z"
		fill="url(#bench-keyboard-shell)"
		stroke="#c8b69c"
		stroke-width="2"
	/>
	<path d="M34 27h370l16 91H20Z" fill="#3a3338" stroke="#65584d" stroke-width="2" />
	{#each [0, 1, 2, 3] as row}
		{#each Array(14) as _, col}
			<rect
				x={32 + col * 26 - row * 2}
				y={31 + row * 21}
				width="22"
				height="17"
				rx="2"
				fill={row === 0 && col === 0 ? '#bd8b87' : col > 11 ? '#837e81' : '#c3b59f'}
				stroke="#5e5551"
				stroke-width="1.5"
			/>
			<path d={`M${35 + col * 26 - row * 2} ${34 + row * 21}h16`} stroke="#ead7b5" opacity=".32" />
		{/each}
	{/each}
	<path
		d="M28 117h35v13H25Zm42 0h31v13H69Zm38 0h187l1 13H107Zm196 0h28v13h-27Zm35 0h31v13h-29Zm39 0h30l3 13h-31Z"
		fill="#a99785"
		stroke="#61554e"
		stroke-width="1.5"
	/>
	<path d="M124 120h151" stroke="#d9c4a6" opacity=".5" />
	<path d="M432 139H9" stroke="#d3b895" opacity=".35" />
	<rect x="362" y="17" width="7" height="3" rx="1" fill="#93b79a" />
	<rect x="375" y="17" width="7" height="3" rx="1" fill="#454a40" />
	<rect x="388" y="17" width="7" height="3" rx="1" fill="#454a40" />
	<path d="m38 146 53 1m233-1 36 1" stroke="#807268" opacity=".65" />
</svg>

<style>
	.keyboard {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		filter: drop-shadow(2px 10px 5px #09081166);
		transform: rotate(-3deg);
	}
</style>
