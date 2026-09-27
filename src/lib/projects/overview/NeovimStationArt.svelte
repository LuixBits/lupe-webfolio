<script lang="ts">
	const id = $props.id();
	const columns = [
		{ x: 18, y: 26 },
		{ x: 42, y: 22 },
		{ x: 66, y: 15 },
		{ x: 90, y: 12 },
		{ x: 114, y: 18 }
	];
</script>

<!-- A deep phosphor terminal and split keyboard, with a separate stack of study cards. -->
<svg class="station-art" viewBox="0 0 640 440" fill="none" aria-hidden="true">
	<defs>
		<linearGradient
			id={`${id}-case`}
			x1="64"
			y1="27"
			x2="354"
			y2="289"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#e6d4b4" /><stop offset=".45" stop-color="#bdad95" /><stop
				offset="1"
				stop-color="#8e8180"
			/>
		</linearGradient>
		<linearGradient id={`${id}-side`}
			><stop stop-color="#8d7a72" /><stop offset="1" stop-color="#524650" /></linearGradient
		>
		<radialGradient id={`${id}-glass`} cx=".45" cy=".45" r=".8"
			><stop stop-color="#20453e" /><stop offset="1" stop-color="#0c1d24" /></radialGradient
		>
		<linearGradient id={`${id}-purple`} x2=".3" y2="1"
			><stop stop-color="#b899d7" /><stop offset=".3" stop-color="#895dad" /><stop
				offset="1"
				stop-color="#482f61"
			/></linearGradient
		>
		<linearGradient id={`${id}-key`} x2="0" y2="1"
			><stop stop-color="#7f718e" /><stop offset=".45" stop-color="#514958" /><stop
				offset="1"
				stop-color="#34313f"
			/></linearGradient
		>
		<pattern id={`${id}-scan`} width="5" height="5" patternUnits="userSpaceOnUse"
			><path d="M0 1h5" stroke="#96d8b2" stroke-opacity=".055" /></pattern
		>
	</defs>
	<ellipse cx="265" cy="394" rx="224" ry="22" fill="#151022" opacity=".25" />
	<!-- Side depth, vents and a low swivel base give the terminal its own silhouette. -->
	<path
		d="M352 33 416 64l-6 198-57 25Z"
		fill={`url(#${id}-side)`}
		stroke="#ac9190"
		stroke-width="2"
	/>
	<path d="m358 39 47 29-3 175-43 21Z" stroke="#493d48" stroke-width="3" />
	{#each [82, 96, 110, 124, 138, 152, 166, 180, 194, 208] as y}<path
			d={`m372 ${y} 25 10`}
			stroke="#342f3d"
			stroke-width="5"
		/><path d={`m372 ${y + 2} 25 10`} stroke="#bb9a90" stroke-opacity=".3" />{/each}
	<path d="M167 272v24q59 17 123-1v-24" fill="#6b625e" stroke="#b8a997" stroke-width="2" />
	<path d="m157 295-27 14v12h183v-13l-23-13Z" fill="#80766e" stroke="#c9baa1" stroke-width="2" />
	<path d="M132 309h177" stroke="#ead6b2" stroke-opacity=".65" />
	<path
		d="M69 28h274q18 0 20 22l-5 219q-1 17-20 18H61q-20-1-19-23l8-216q1-20 19-20Z"
		fill={`url(#${id}-case)`}
		stroke="#dfc8ae"
		stroke-width="2"
	/>
	<path
		d="M73 45h252q20 0 20 19l-3 171q0 17-17 18H75q-19-1-18-19l4-168q0-21 12-21Z"
		fill="#605953"
		stroke="#95867c"
		stroke-width="3"
	/>
	<path
		d="M86 59q112-7 226-1 14 1 15 16l-2 150q0 12-14 13-116 5-227-1-11-1-10-15l3-145q0-15 9-17Z"
		fill={`url(#${id}-glass)`}
		stroke="#27312f"
		stroke-width="4"
	/>
	<path d="M86 64q110-8 224-1M80 75l-3 92" stroke="#d2e8cf" stroke-opacity=".3" stroke-width="2" />
	<!-- An editor split: short buffer lines, a room drawing and a bottom status strip. -->
	<path d="M91 80h49m-49 9h70" stroke="#87c2a2" stroke-width="3" opacity=".8" />
	<path d="M166 76v141" stroke="#497c6e" />
	{#each [108, 120, 132, 144, 156, 168, 180, 192] as y, i}
		<path
			d={`M91 ${y}h7m8 0h${[41, 31, 50, 29, 42, 35, 46, 21][i]}`}
			stroke={i === 3 ? '#e5cc90' : '#76b99b'}
			stroke-width="2"
			opacity=".8"
		/>
	{/each}
	<path
		d="M174 94h128v111H174Zm0 67h58m0-67v39m0 24v48m70-53h-36"
		stroke="#94d7b2"
		stroke-width="2.5"
	/>
	<path
		d="M232 133q24 0 24 24h-24m-47-52h31v43h-31Zm59 60h46v24h-46Z"
		stroke="#d8dc9b"
		stroke-width="1.5"
	/>
	<path d="M89 219h217" stroke="#315e52" stroke-width="10" /><path
		d="M92 219h30m8 0h23m112 0h36"
		stroke="#acd9b4"
		stroke-width="2"
	/>
	<rect x="151" y="188" width="6" height="9" fill="#c7e9ac" />
	<path d="M78 71h245v164H78Z" fill={`url(#${id}-scan)`} />
	<path d="M82 68h94l-77 165H81Z" fill="#d5ead5" opacity=".035" />
	<path d="M70 268h95m-95 5h95" stroke="#7f766b" stroke-width="2" />
	<rect x="277" y="262" width="26" height="13" rx="2" fill="#766866" stroke="#ceb4a0" />
	<circle cx="324" cy="267" r="4" fill="#98d6b1" /><circle
		cx="324"
		cy="267"
		r="7"
		stroke="#a4d8b5"
		stroke-opacity=".2"
	/>
	<path d="M179 317q-4 20 39 22t33 26" stroke="#1b1a25" stroke-width="5" /><path
		d="M179 317q-4 20 39 22t33 26"
		stroke="#928091"
		stroke-width="1"
	/>
	{#snippet keyboardHalf()}
		<path
			d="M10 8 129 2q13 1 18 16l10 53 30 32-21 31-151-20Q2 112 3 96Z"
			fill="#272030"
			stroke="#44334d"
			stroke-width="5"
			transform="translate(0 6)"
		/>
		<path
			d="M10 8 129 2q13 1 18 16l10 53 30 32-21 31-151-20Q2 112 3 96Z"
			fill={`url(#${id}-purple)`}
			stroke="#c8a6dc"
			stroke-width="1.5"
		/>
		{#each columns as col, c}{#each [0, 1, 2] as row}
				<g transform={`translate(${col.x} ${col.y + row * 22})`}>
					<rect y="3" width="20" height="20" rx="3" fill="#2a2234" />
					<rect
						width="20"
						height="18"
						rx="3"
						fill={`url(#${id}-key)`}
						stroke="#a191b2"
						stroke-width=".7"
					/>
					<path d="M4 3h12" stroke="#c5b4d6" stroke-opacity=".5" />
					{#if c === 2 && row === 2}<path d="M7 13h6" stroke="#ddd0d9" stroke-width="1.5" />{/if}
				</g>
			{/each}{/each}
		{#each [{ x: 124, y: 83, a: 12 }, { x: 148, y: 91, a: 27 }, { x: 120, y: 108, a: 12 }, { x: 144, y: 117, a: 27 }] as key}
			<g transform={`translate(${key.x} ${key.y}) rotate(${key.a})`}
				><rect y="3" width="22" height="18" rx="3" fill="#282033" /><rect
					width="22"
					height="16"
					rx="3"
					fill="#9a80b3"
					stroke="#c4acd4"
				/><path d="M4 3h14" stroke="#e0c8e6" stroke-opacity=".6" /></g
			>
		{/each}
		<path d="m19 88 85 8-4 27-84-13Z" fill="#4b3a59" stroke="#a389b3" stroke-width=".8" />
		<path d="m24 94 74 8" stroke="#cfafd6" stroke-opacity=".2" />
	{/snippet}
	<g transform="translate(25 323) rotate(-7) scale(1 .7)">{@render keyboardHalf()}</g>
	<g transform="translate(426 323) rotate(7) scale(-1 .7)">{@render keyboardHalf()}</g>
	<!-- Printed study cards have thickness, a binding clip and a folded corner. -->
	<g transform="translate(467 161) rotate(8)">
		<path d="M-8 8h123v179H-8Z" fill="#987e9c" stroke="#c8b0b4" /><path
			d="M-4 4h123v179H-4Z"
			fill="#bcaaa5"
		/>
		<path d="M0 0h101l18 18v161H0Z" fill="#edddbd" stroke="#b49d89" stroke-width="2" /><path
			d="M101 0v19h18"
			fill="#c5b097"
		/>
		<path d="M15 42h82m-82 10h60m-60 15h77" stroke="#7e7380" stroke-width="3" />
		<path d="M15 82h85" stroke="#c397a6" />
		<path d="M20 99h20v20H20Zm0 35h20v20H20Z" stroke="#778e82" stroke-width="1.5" /><path
			d="m23 108 6 6 13-17"
			stroke="#557d72"
			stroke-width="2.5"
		/>
		<path d="M51 104h45m-45 10h31m-31 25h42m-42 10h28" stroke="#9f8e8f" stroke-width="2" />
		<path
			d="M43-4v27q0 10-7 10t-7-10V2q0-14 10-14T49 2v31"
			stroke="#666373"
			stroke-width="3"
		/><path d="M43-4v27q0 10-7 10" stroke="#c5bbc4" stroke-width="1" />
	</g>
	<path d="m477 391 91-39" stroke="#c0a3c5" stroke-width="7" stroke-linecap="round" /><path
		d="m477 391-12 6 8-12Z"
		fill="#dcc6a5"
	/>
</svg>
