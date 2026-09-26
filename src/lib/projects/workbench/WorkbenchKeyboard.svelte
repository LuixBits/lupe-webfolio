<script lang="ts">
	// Original drawing, using the Defy's column stagger, thumb fans and palm pads.
	// Shape reference: https://dygma.com/products/dygma-defy-purple-white
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

<svg
	class="keyboard"
	data-keyboard="dygma-defy"
	viewBox="0 0 540 260"
	fill="none"
	aria-hidden="true"
>
	<defs>
		<linearGradient id="bench-defy-purple" x1="0" y1="0" x2=".75" y2="1">
			<stop stop-color="#b391e0" /><stop offset=".18" stop-color="#8254b4" /><stop
				offset=".6"
				stop-color="#753cab"
			/><stop offset="1" stop-color="#40235f" />
		</linearGradient>
		<linearGradient id="bench-defy-cap" x1="0" y1="0" x2=".35" y2="1">
			<stop stop-color="#686274" /><stop offset=".5" stop-color="#484554" /><stop
				offset="1"
				stop-color="#36333f"
			/>
		</linearGradient>
		<linearGradient id="bench-defy-pad" x1="0" y1="0" x2=".35" y2="1">
			<stop stop-color="#45404d" /><stop offset=".6" stop-color="#302d38" /><stop
				offset="1"
				stop-color="#23212c"
			/>
		</linearGradient>
		<path
			id="bench-defy-outline"
			d="M13 30q0-13 14-13h39q5-14 20-14h9q3-9 15-9h16q8 0 11 9l34 7q13 2 17 13l18 7q13 5 13 20v81q-1 19 11 42 13 22 9 54-2 14-20 22l-22 10q-9 5-14 18l-11 30q-4 14-20 13L12 291q-14-2-14-17l9-98q1-16 6-29Z"
		/>
		<clipPath id="bench-defy-surface">
			<use href="#bench-defy-outline" transform="translate(14 16) rotate(7 116 120) scale(1 .69)" />
			<use
				href="#bench-defy-outline"
				transform="translate(526 16) rotate(-7 -116 120) scale(-1 .69)"
			/>
		</clipPath>
		<radialGradient id="bench-defy-light" gradientUnits="userSpaceOnUse" cx="85" cy="160" r="460">
			<stop stop-color="#ffe3b2" stop-opacity=".38" />
			<stop offset=".3" stop-color="#ffd49a" stop-opacity=".25" />
			<stop offset=".62" stop-color="#f3bb79" stop-opacity=".09" />
			<stop offset="1" stop-color="#f3bb79" stop-opacity="0" />
		</radialGradient>
	</defs>

	{#snippet half()}
		<use
			href="#bench-defy-outline"
			transform="translate(0 9)"
			fill="#191622"
			stroke="#25212e"
			stroke-width="3"
		/>
		<use
			href="#bench-defy-outline"
			transform="translate(0 5)"
			fill="#472c66"
			stroke="#cd7ee4"
			stroke-width="2"
		/>
		<use
			href="#bench-defy-outline"
			fill="url(#bench-defy-purple)"
			stroke="#bfa1db"
			stroke-width="1.7"
		/>
		<path d="m15 158 83 13m-84-5 80 13m-81-5 78 13m-79-5 73 12" stroke="#d6b0eb" opacity=".1" />
		{#each columns as column, col}
			{#each Array(column.rows) as _, row}
				<g transform={`translate(${column.x} ${column.y + row * 28})`}>
					<rect x="-1" y="1" width="25" height="28" rx="4" fill="#281c38" opacity=".55" />
					<rect width="23" height="25" rx="3" fill="#282331" stroke="#aaa0b5" stroke-width=".6" />
					<rect x="2" y="1" width="19" height="20" rx="2.5" fill="url(#bench-defy-cap)" />
					<path d="M5 3h13" stroke="#c8bacf" opacity=".24" />
					{#if col === 3 && row === 2}<path d="M8 18h7" stroke="#c8abc9" stroke-width="1.6" />{/if}
				</g>
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
					stroke="#b3a1bb"
					stroke-width=".7"
				/>
				<rect
					x="2"
					y="1"
					width={key.w - 4}
					height={key.h - 5}
					rx="2.5"
					fill="url(#bench-defy-cap)"
				/>
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
			fill="url(#bench-defy-pad)"
			stroke="#706174"
			stroke-width="1.2"
		/>
		<path d="M21 194q-2-2-3 7l-7 65q-1 7 7 9l130 23" stroke="#a494a5" opacity=".2" />
	{/snippet}

	<g transform="translate(14 16) rotate(7 116 120)">
		<g transform="scale(1 .69)">{@render half()}</g>
	</g>
	<g transform="translate(526 16) rotate(-7 -116 120)">
		<g transform="scale(-1 .69)">{@render half()}</g>
	</g>
	<rect
		class="keyboard-light"
		width="540"
		height="260"
		fill="url(#bench-defy-light)"
		clip-path="url(#bench-defy-surface)"
	/>
</svg>

<style>
	.keyboard {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		filter: drop-shadow(3px 9px 4px #110b1c99);
		transform: rotate(-2deg);
	}
	.keyboard-light {
		opacity: var(--lamp-glow);
		mix-blend-mode: screen;
		transition: opacity 500ms ease;
	}
	@media (prefers-reduced-motion: reduce) {
		.keyboard-light {
			transition: none;
		}
	}
</style>
