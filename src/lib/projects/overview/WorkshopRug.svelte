<div class="rug" aria-hidden="true">
	<svg viewBox="0 0 900 170" preserveAspectRatio="none" fill="none">
		<path d="M9 14h882v142H9Z" stroke="#baa1b3" stroke-width="2" />
		<path d="M20 22h860v126H20Z" stroke="#413652" stroke-width="9" />
		<path d="M27 28h846v114H27Z" stroke="#87b0ae" stroke-width="2" opacity=".65" />
		{#each [90, 270, 450, 630, 810] as x}
			<path d={`M${x} 43l55 42-55 42-55-42Z`} fill="#594059" stroke="#a07c95" stroke-width="3" />
			<path d={`M${x} 63l29 22-29 22-29-22Z`} stroke="#bda390" stroke-width="3" opacity=".6" />
		{/each}
		{#each [180, 360, 540, 720] as x}
			<path d={`M${x} 70l15 15-15 15-15-15Z`} fill="#81a6a4" opacity=".7" />
		{/each}
		{#each [30, 45, 60, 75, 90, 105, 120, 135] as y}
			<path d={`M2 ${y}h12m872 0h12`} stroke="#b9a0a5" stroke-width="2" />
		{/each}
	</svg>
</div>
