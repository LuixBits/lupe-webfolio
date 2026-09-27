<script lang="ts">
	let { project = 'roomplan-nvim' }: { project?: string } = $props();
	const id = $props.id();
	// Shape reference: https://dygma.com/products/dygma-defy-purple-white
	// Keep the sculpted outline, full thumb fans and deep palm pads legible at room scale.
	const columns = [
		{ x: 20, y: 31, rows: 4 },
		{ x: 47, y: 28, rows: 4 },
		{ x: 74, y: 15, rows: 4 },
		{ x: 101, y: 10, rows: 4 },
		{ x: 128, y: 17, rows: 4 },
		{ x: 155, y: 25, rows: 4 },
		{ x: 182, y: 45, rows: 3 }
	];
	const thumbs = [
		{ x: 108, y: 143, w: 35, h: 22, angle: 7 },
		{ x: 146, y: 151, w: 29, h: 23, angle: 15 },
		{ x: 179, y: 164, w: 25, h: 25, angle: 28 },
		{ x: 205, y: 185, w: 24, h: 29, angle: 36 },
		{ x: 107, y: 171, w: 30, h: 25, angle: 11 },
		{ x: 141, y: 180, w: 26, h: 25, angle: 18 },
		{ x: 171, y: 196, w: 25, h: 25, angle: 29 },
		{ x: 195, y: 228, w: 35, h: 24, angle: -26 }
	];
</script>

<!-- A deep phosphor terminal and split keyboard, with a separate stack of study cards. -->
<svg class="station-art" viewBox="0 0 640 490" fill="none" aria-hidden="true">
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
			><stop stop-color="#e5dace" /><stop offset=".45" stop-color="#bab4bd" /><stop
				offset="1"
				stop-color="#7c7589"
			/></linearGradient
		>
		<pattern id={`${id}-scan`} width="5" height="5" patternUnits="userSpaceOnUse"
			><path d="M0 1h5" stroke="#96d8b2" stroke-opacity=".055" /></pattern
		>
		<linearGradient id={`${id}-pad`} x2=".4" y2="1">
			<stop stop-color="#564b63" /><stop offset="1" stop-color="#282330" />
		</linearGradient>
		<path
			id={`${id}-defy-outline`}
			d="M13 30q0-13 14-13h39q5-14 20-14h9q3-9 15-9h16q8 0 11 9l34 7q13 2 17 13l18 7q13 5 13 20v81q-1 19 11 42 13 22 9 54-2 14-20 22l-22 10q-9 5-14 18l-11 30q-4 14-20 13L12 291q-14-2-14-17l9-98q1-16 6-29Z"
		/>
		<g id={`${id}-keycap`}>
			<rect x="-1" y="1" width="25" height="28" rx="4" fill="#281c38" opacity=".55" />
			<rect width="23" height="25" rx="3" fill="#282331" stroke="#e5d6de" stroke-width=".6" />
			<rect x="2" y="1" width="19" height="20" rx="2.5" fill={`url(#${id}-key)`} />
			<path d="M5 3h13" stroke="#c8bacf" opacity=".24" />
		</g>
	</defs>
	<ellipse cx="265" cy="465" rx="224" ry="18" fill="#151022" opacity=".25" />
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
	<g data-screen-content={project}>
		{#if project === 'neorg-flashcards'}
			<!-- A review card replaces the plan inside the same editor split. -->
			<rect x="180" y="96" width="113" height="91" rx="3" fill="#355f51" stroke="#84bc99" />
			<rect x="186" y="102" width="113" height="91" rx="3" fill="#5c896d" stroke="#a5d3a6" />
			<rect x="192" y="108" width="113" height="91" rx="3" fill="#bdd6ab" stroke="#d9ecc2" />
			<path d="M203 121h35m-35 7h16" stroke="#60826b" stroke-width="2" />
			<path
				d="M238 144q0-10 11-10t11 9q0 6-10 11v7"
				stroke="#305c4c"
				stroke-width="4"
				stroke-linecap="round"
			/>
			<circle cx="250" cy="172" r="2.5" fill="#305c4c" />
			<path d="M203 186h35m6 0h21m6 0h21" stroke="#749277" stroke-width="2" />
			{#each [226, 239, 252, 265, 278] as x, index}
				<circle cx={x} cy="208" r="2.5" fill={index === 1 ? '#e5cc90' : '#527c65'} />
			{/each}
		{:else}
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
		{/if}
	</g>
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
	<!-- Cables meet behind the two halves; the keyboard sits in front of the terminal base. -->
	<path d="M223 310v26m-6 8q-36 1-40-30m57 30q37 1 43-32" stroke="#181925" stroke-width="6" />
	<path d="M223 310v26m-6 8q-36 1-40-30m57 30q37 1 43-32" stroke="#8b8197" stroke-width="1.2" />
	<path d="m224 331 14 16-14 8-14-8Z" fill="#5b426e" stroke="#b59aca" />
	{#snippet keyboardHalf()}
		<use
			href={`#${id}-defy-outline`}
			transform="translate(0 9)"
			fill="#191622"
			stroke="#25212e"
			stroke-width="3"
		/>
		<use
			href={`#${id}-defy-outline`}
			transform="translate(0 5)"
			fill="#472c66"
			stroke="#b484c5"
			stroke-width="2"
		/>
		<use
			href={`#${id}-defy-outline`}
			fill={`url(#${id}-purple)`}
			stroke="#bfa1db"
			stroke-width="1.7"
		/>
		<path d="m15 158 83 13m-84-5 80 13m-81-5 78 13m-79-5 73 12" stroke="#d6b0eb" opacity=".1" />
		{#each columns as column, col}
			{#each Array(column.rows) as _, row}
				<use href={`#${id}-keycap`} x={column.x} y={column.y + row * 28} />
				{#if col === 3 && row === 2}
					<path
						d={`M${column.x + 8} ${column.y + row * 28 + 18}h7`}
						stroke="#c8abc9"
						stroke-width="1.6"
					/>
				{/if}
			{/each}
		{/each}
		{#each thumbs as key, index}
			<g transform={`translate(${key.x} ${key.y}) rotate(${key.angle})`}>
				<rect
					x="-1"
					y="2"
					width={key.w + 2}
					height={key.h + 3}
					rx="4"
					fill="#251831"
					opacity=".6"
				/>
				<rect
					width={key.w}
					height={key.h}
					rx="3"
					fill="#302637"
					stroke="#e2c9dd"
					stroke-width=".7"
				/>
				<rect x="2" y="1" width={key.w - 4} height={key.h - 5} rx="2.5" fill={`url(#${id}-key)`} />
				<path d={`M5 3h${key.w - 10}`} stroke="#d6bbdc" opacity=".25" />
				{#if index === 2}<path d="M9 18h7" stroke="#c8abc9" stroke-width="1.6" />{/if}
			</g>
		{/each}
		<path
			d="M23 191q-9-2-10 10L5 273q-1 9 10 11l135 24q10 2 14-9l13-44q3-10-4-19l-16-24Z"
			fill="#211e2a"
			stroke="#362742"
			stroke-width="2"
		/>
		<path
			d="M24 187q-9-2-10 10l-8 71q-1 9 10 11l133 24q10 2 14-9l13-44q3-10-4-19l-16-24Z"
			fill={`url(#${id}-pad)`}
			stroke="#706174"
			stroke-width="1.2"
		/>
		<path d="M21 194q-2-2-3 7l-7 65q-1 7 7 9l130 23" stroke="#a494a5" opacity=".2" />
	{/snippet}

	<g data-station-hardware="keyboard">
		<g transform="translate(25 296) rotate(5) scale(.78 .52)">{@render keyboardHalf()}</g>
		<g transform="translate(440 296) rotate(-5) scale(-.78 .52)">{@render keyboardHalf()}</g>
	</g>

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
