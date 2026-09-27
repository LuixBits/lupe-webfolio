<script lang="ts">
	const id = $props.id();
</script>

<!-- An illustrative working drawing, with no claim to real home dimensions. -->
<svg class="floor-plan" viewBox="0 0 300 254" fill="none" aria-hidden="true">
	<defs>
		<linearGradient
			id={`${id}-paper`}
			x1="24"
			y1="15"
			x2="266"
			y2="231"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#f2e5c9" /><stop offset=".7" stop-color="#ddcfae" /><stop
				offset="1"
				stop-color="#c8b794"
			/>
		</linearGradient>
		<pattern id={`${id}-grid`} width="12" height="12" patternUnits="userSpaceOnUse">
			<path d="M12 0H0v12" stroke="#688e91" stroke-width=".5" opacity=".22" />
		</pattern>
	</defs>
	<path d="m31 20 251 6-10 219-250-9Z" fill="#84795f" opacity=".35" />
	<path d="m20 20 254-8 8 220-254 9Z" fill="#b9c3bb" stroke="#e1d9bf" />
	<path
		d="M25 14h227l24 24v192H25Z"
		fill={`url(#${id}-paper)`}
		stroke="#f5ead3"
		stroke-width="1.5"
	/>
	<path d="M36 27h211l16 15v176H36Z" fill={`url(#${id}-grid)`} />
	<path d="m253 14-2 26 25-2Z" fill="#b6a888" /><path d="M252 14v23h24" fill="#f8ead0" />
	<g stroke="#41606a" stroke-linejoin="round">
		<path
			d="M61 56h174v128H61Zm77 0v50m0 29v49m-77-60h49m28 0h97m-50 0v25m0 28v7"
			stroke-width="5"
		/>
		<path
			d="M136 78h4v24h-4M84 54h39v4H84m115-4h24v4h-24m10 124h22v4h-22"
			stroke="#a6c5c0"
			stroke-width="3"
		/>
		<path
			d="M138 106h-29a29 29 0 0 0 29 29m-28-11V95a29 29 0 0 0-29 29m104 25h-27a27 27 0 0 0 27 27"
			stroke-width="1"
		/>
		<!-- Desk and chair, sofa, bed and a small washroom. -->
		<path d="M72 68h52v14H72Zm18 3h20v8H90m-11 1v7m39-7v7" stroke-width="1.4" fill="#d8c9a6" />
		<path d="M94 88h13v12H94Zm-2 13h17m-9 0v7m-7 0h14" stroke-width="1.2" />
		<path
			d="M152 70h63v28h-63Zm7 0v22h50V70m-25 7v15m-32 6v6m63-6v6"
			stroke-width="1.5"
			fill="#b4c0ab"
		/>
		<path d="M174 107h25v9h-25" stroke-width="1.2" />
		<path
			d="M73 138h48v35H73Zm3 3h18v10H76m22-10h18v10H98m-25 13h48"
			stroke-width="1.4"
			fill="#c9c1b6"
		/>
		<path d="M198 136h25v10h-25Zm6 1v7m-7 12h25v17h-25Zm5 3h15v11h-15Z" stroke-width="1.2" />
		<!-- Dimension chains stay graphical, without decorative microtype. -->
		<path
			d="M60 43h176M61 38v10m77-10v10m97-10v10M49 55v129m-5-128h10m-10 68h10m-10 60h10M61 196h174m-174-5v10m124-10v10m50-10v10"
			stroke-width=".8"
		/>
		<path d="m58 46 6-6m71 6 6-6m91 6 6-6m-192 19 6-6m-6 74 6-6m-6 66 6-6" stroke-width="1.2" />
	</g>
	<path d="m244 75 6-21 6 21-6-5Z" fill="#476771" /><path d="M250 69v20" stroke="#476771" />
	<path
		d="M45 212h61m11 0h26m44-4h56v12h-56Zm28 0v12"
		stroke="#738789"
		stroke-width=".8"
		opacity=".65"
	/>
	<path d="m45 31 5 179m99-182 2 182" stroke="#fff8e4" stroke-width="1" opacity=".45" />
	<path
		d="m106 7 62 1-1 17-61-2Z"
		fill="#c4a1b1"
		fill-opacity=".58"
		stroke="#e1bfc4"
		stroke-opacity=".45"
	/>
	<path d="m108 9 58 1" stroke="#f3d6ce" opacity=".5" />
</svg>

<style>
	.floor-plan {
		display: block;
		width: 100%;
		height: auto;
		filter: drop-shadow(3px 5px 3px #090a1355);
		transform: rotate(-5deg);
	}
</style>
