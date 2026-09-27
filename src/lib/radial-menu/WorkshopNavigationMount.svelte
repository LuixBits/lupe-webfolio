<script lang="ts">
	let { size }: { size: number } = $props();
	const id = $props.id();
	const outline =
		'M0-212A212 212 0 0 1 212 0Q212 14 198 14H80A81 81 0 1 1-14-80V-198Q-14-212 0-212Z';
</script>

<!-- The plate belongs to the Projects quarter and its Back knob; no extra hit target. -->
<g
	class="workshop-navigation-mount"
	transform={`translate(${size / 2} ${size / 2}) scale(${size / 400})`}
	aria-hidden="true"
	pointer-events="none"
>
	<defs>
		<linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
			<stop stop-color="#a38fa8" /><stop offset=".25" stop-color="#57465f" />
			<stop offset=".7" stop-color="#35283e" /><stop offset="1" stop-color="#746079" />
		</linearGradient>
		<linearGradient id={`${id}-rim`} x2=".8" y2="1">
			<stop stop-color="#c894bd" /><stop offset=".5" stop-color="#7b668d" />
			<stop offset="1" stop-color="#88aaa9" />
		</linearGradient>
	</defs>
	<path
		d={outline}
		transform="translate(3 9)"
		fill="#130e20"
		fill-opacity=".65"
		stroke="#130e20"
		stroke-width="7"
	/>
	<path d={outline} transform="translate(0 4)" fill="#272032" stroke="#302334" stroke-width="3" />
	<path d={outline} fill={`url(#${id}-metal)`} stroke={`url(#${id}-rim)`} stroke-width="2" />
	<path d="M0-202A202 202 0 0 1 202 0" stroke="#e1b4dc" stroke-opacity=".6" stroke-width="2" />
	<circle r="74" stroke="#c89cc1" stroke-opacity=".45" />
	{#each [[4, -202], [202, -4], [-51, 51]] as [x, y]}
		<circle cx={x} cy={y} r="4" fill="#282337" stroke="#b7a3b8" />
		<path d={`M${x - 2} ${y + 2}l4-4`} stroke="#b7a3b8" stroke-width="1.2" />
	{/each}
</g>
