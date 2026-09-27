<script lang="ts">
	const id = $props.id();
</script>

<svg viewBox="0 0 400 280" fill="none" aria-hidden="true">
	<defs>
		<linearGradient id={`${id}-wood`} x2="0" y2="1"
			><stop stop-color="#bd9479" /><stop offset=".2" stop-color="#906954" /><stop
				offset="1"
				stop-color="#493748"
			/></linearGradient
		>
		<linearGradient id={`${id}-board`} x2="1" y2="1"
			><stop stop-color="#619d85" /><stop offset="1" stop-color="#2b5d64" /></linearGradient
		>
	</defs>
	<!-- The brackets and cable give the books and board a real shelf to sit on. -->
	<path d="M44 228v46m0-42 49 20m224-24v46m0-42-49 20" stroke="#151d2d" stroke-width="12" />
	<path d="M44 231v42m273-42v42" stroke="#8d8192" stroke-width="3" />
	<path d="M25 215h339l28 14H8Z" fill="#c19a7a" stroke="#dbc0a1" />
	<path d="M8 229h384v17H8Z" fill={`url(#${id}-wood)`} stroke="#725369" />
	<path d="M14 233h371" stroke="#e4b78d" opacity=".55" />
	<!-- Worn cloth spines; the symbols are illustrative book-cover lettering. -->
	<g transform="translate(30 74)">
		<path d="M0 8 10 0h29v139H0Z" fill="#34475e" stroke="#80949b" stroke-width="2" />
		<path d="M5 18h29m-29 7h29m-29 93h29m-29 7h29" stroke="#a4a6b5" stroke-width="2" />
		<path d="M9 8h25" stroke="#d3ceba" stroke-width="5" />
		<text x="19" y="80" fill="#e1cdb6" text-anchor="middle" font-size="25" font-family="monospace"
			>C</text
		>
	</g>
	<g transform="translate(71 96) rotate(-3 15 120)">
		<rect width="34" height="120" rx="3" fill="#927385" stroke="#c59aad" stroke-width="2" />
		<path d="M5 13h24m-24 8h24m-24 81h24m-24 6h24" stroke="#d0b7bc" />
		<text x="17" y="76" fill="#efdbca" text-anchor="middle" font-size="21" font-family="monospace"
			>{`{}`}</text
		>
	</g>
	<g transform="translate(110 79) rotate(-11 18 137)">
		<rect width="39" height="139" rx="3" fill="#64755e" stroke="#b4bd8d" stroke-width="2" />
		<path d="M6 15h27m-27 108h27" stroke="#d3c29a" stroke-width="3" />
		<path d="m11 58 17 12-17 12m2 9h18" stroke="#e5d6b6" stroke-width="4" />
	</g>
	<!-- A little development board on a tilted acrylic stand. -->
	<g transform="translate(185 73) rotate(5)">
		<path
			d="M8 122 0 142h144l-17-20"
			fill="#758098"
			opacity=".5"
			stroke="#bcc5cc"
			stroke-width="2"
		/>
		<rect
			width="135"
			height="123"
			rx="6"
			fill={`url(#${id}-board)`}
			stroke="#91b6a0"
			stroke-width="2"
		/>
		<g fill="#303a40" stroke="#a3a995" stroke-width="2"
			><circle cx="9" cy="9" r="4" /><circle cx="126" cy="9" r="4" /><circle
				cx="9"
				cy="114"
				r="4"
			/><circle cx="126" cy="114" r="4" /></g
		>
		<path
			d="M20 17h82v15H74v24m-55-2v42h34m42-38h22v36H92m-51-62V18m23 77v15h49"
			stroke="#a3ba75"
			stroke-width="2"
		/>
		<rect x="38" y="43" width="45" height="43" rx="2" fill="#1c313c" stroke="#c1c2a0" />
		<path
			d="M43 39v-8m8 8v-8m8 8v-8m8 8v-8m8 8v-8M43 89v8m8-8v8m8-8v8m8-8v8m8-8v8M34 49h-8m8 8h-8m8 8h-8m8 8h-8m61-24h8m-8 8h8m-8 8h8m-8 8h8"
			stroke="#d2c791"
			stroke-width="3"
		/>
		<rect x="107" y="39" width="32" height="23" fill="#a8b6b0" stroke="#d0dbcc" stroke-width="2" />
		<rect x="109" y="73" width="30" height="35" fill="#9faea9" stroke="#d0dbcc" stroke-width="2" />
		<path d="M116 44h21v11h-21Zm0 34h21v10h-21Zm0 17h21v8h-21Z" fill="#32444c" />
		<rect x="17" y="104" width="31" height="13" fill="#293440" /><path
			d="M20 108h25m-25 5h25"
			stroke="#c7ba89"
			stroke-dasharray="2 3"
			stroke-width="2"
		/>
		<circle cx="15" cy="31" r="3" fill="#d2ed9e" />
	</g>
	<!-- A tin of loose keycaps with a NixOS sticker. -->
	<g transform="translate(311 164)">
		<ellipse cx="29" cy="52" rx="32" ry="7" fill="#171c2f" opacity=".45" />
		<path d="M0 0h56v45q-27 15-56 0Z" fill="#675075" stroke="#c697b7" stroke-width="2" />
		<ellipse cx="28" rx="28" ry="8" fill="#30283e" stroke="#b592a6" stroke-width="2" />
		<path
			d="m8 0 3-21 22 4-3 19m1-4 11-14 16 12-13 12"
			fill="#c1bfc9"
			stroke="#e0d7d6"
			stroke-width="2"
		/>
		<image href="/media/projects/luixbits/nix-snowflake.svg" x="13" y="13" width="28" height="28" />
	</g>
</svg>
