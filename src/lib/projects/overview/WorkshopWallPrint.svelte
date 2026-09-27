<script lang="ts">
	let {
		kind,
		revealed = false
	}: { kind: 'machine' | 'duck' | 'coffee' | 'nix'; revealed?: boolean } = $props();
	const id = $props.id();
</script>

<svg viewBox="0 0 320 310" fill="none" aria-hidden="true">
	<defs>
		<linearGradient id={`${id}-sky`} x2=".3" y2="1">
			<stop stop-color="#281b49" /><stop offset="1" stop-color="#795184" />
		</linearGradient>
		<linearGradient id={`${id}-sun`} x2="0" y2="1">
			<stop stop-color="#ffdaad" /><stop offset="1" stop-color="#ee8fc8" />
		</linearGradient>
		<linearGradient id={`${id}-duck`} x2=".8" y2="1">
			<stop stop-color="#ffe9a2" /><stop offset=".6" stop-color="#e0ae5e" /><stop
				offset="1"
				stop-color="#aa734b"
			/>
		</linearGradient>
	</defs>
	<path d="M0 0h320v310H0Z" fill={`url(#${id}-sky)`} />
	{#if kind === 'machine'}
		<circle cx="243" cy="72" r="45" fill={`url(#${id}-sun)`} />
		<path d="M192 74h98m-98 11h98m-98 14h98m-98 16h98" stroke="#6c467b" stroke-width="4" />
		<path d="m0 204 54-60 43 38 48-53 79 57 38-30 58 29v125H0Z" fill="#362347" />
		<path
			d="M0 259h320m-320 29h320M125 221 52 310m114-89 26 89m14-89 107 89"
			stroke="#c77eac"
			stroke-opacity=".45"
		/>
		<ellipse cx="150" cy="263" rx="113" ry="15" fill="#1b1831" opacity=".5" />
		<path d="m215 97 27 14v125l-28 18Z" fill="#927e83" stroke="#d5baa8" stroke-width="2" />
		<path
			d="M64 92h145q12 0 12 12v135H53V105q0-13 11-13Z"
			fill="#d8c2a4"
			stroke="#ebddbd"
			stroke-width="2"
		/>
		<rect x="67" y="107" width="139" height="103" rx="11" fill="#61545d" />
		<rect
			x="75"
			y="115"
			width="122"
			height="85"
			rx="8"
			fill="#223d41"
			stroke="#9ba695"
			stroke-width="2"
		/>
		<path
			d="m110 157 18 19 37-44"
			stroke="#afe1b9"
			stroke-width="8"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path d="M77 225h46m-46 5h46" stroke="#a28a79" stroke-width="2" /><circle
			cx="193"
			cy="226"
			r="4"
			fill="#83c1b4"
		/>
		<path d="m70 240-20 23h167l-14-23Z" fill="#bfa68f" stroke="#e4ccb2" stroke-width="2" />
		<path d="M91 250h82" stroke="#796678" stroke-width="4" />
	{:else if kind === 'duck'}
		<ellipse cx="160" cy="146" rx="120" ry="130" fill="#384751" stroke="#ba9b70" stroke-width="3" />
		<ellipse cx="160" cy="146" rx="111" ry="120" stroke="#7f9193" stroke-opacity=".35" />
		<path d="M89 241q10-57 73-51 59 4 77 54" fill="#2a253c" />
		<path d="m135 196 26 30 31-29-14 65h-29Z" fill="#e7d8bf" />
		<path
			d="M88 194q-28-4-39-21 0 48 48 60 75 19 127-14 18-14 6-32-12-21-48-18 23-22 21-50-3-46-47-45-45 1-47 43-2 28 18 41-31 3-39 36Z"
			fill={`url(#${id}-duck)`}
			stroke="#8c6947"
			stroke-width="2"
		/>
		<path d="M189 125q37-3 44 11-16 17-43 10Z" fill="#d17d4a" stroke="#915a45" stroke-width="2" />
		<circle cx="173" cy="113" r="5" fill="#302839" /><circle
			cx="175"
			cy="111"
			r="1.6"
			fill="#fff2c7"
		/>
		<path
			d="M106 189q35-24 69 2-9 24-47 20"
			stroke="#b28048"
			stroke-width="3"
			stroke-linecap="round"
		/>
		<path
			d="m153 164 14 10 18-10v25l-18-8-14 8Z"
			fill="#a2547f"
			stroke="#d69aae"
			stroke-width="2"
		/><circle cx="168" cy="178" r="4" fill="#e0b4b0" />
		{#if revealed}
			<path d="m104 91 48-71 50 80Z" fill="#634f91" stroke="#c4a1d7" stroke-width="2" />
			<path d="M93 92q59-18 117 9" stroke="#8d73b5" stroke-width="13" stroke-linecap="round" />
			<path d="m151 48 3-10 4 10 10 3-10 3-4 10-3-10-10-3Z" fill="#f0d29b" />
			<path d="m232 200 31-50" stroke="#d4b496" stroke-width="5" stroke-linecap="round" />
			<path d="m264 143 3-12 4 12 12 4-12 4-4 12-3-12-12-4Z" fill="#b8ece4" />
		{:else}
			<circle cx="174" cy="114" r="16" stroke="#d8cda9" stroke-width="2" />
			<path d="M189 116q19 21 2 44" stroke="#c4b494" stroke-width="1.5" />
		{/if}
	{:else if kind === 'coffee'}
		<circle cx="238" cy="70" r="40" fill="#e1c6b2" /><circle
			cx="254"
			cy="57"
			r="36"
			fill="#51345f"
		/>
		<path
			d="m66 53 2-8 3 8 8 3-8 2-3 8-2-8-8-2Zm185 71 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z"
			fill="#b9dbdd"
		/>
		<path d="M0 249h320v61H0Z" fill="#392844" /><ellipse
			cx="154"
			cy="251"
			rx="98"
			ry="23"
			fill="#b5abb5"
		/>
		<ellipse cx="154" cy="247" rx="88" ry="16" stroke="#e5d8d4" stroke-width="2" />
		<path d="M215 152q52-9 48 35-3 34-53 28" stroke="#d9c7c8" stroke-width="17" />
		<path
			d="M84 143h135l-7 79q-3 22-59 24-56-1-62-25Z"
			fill="#cbbacc"
			stroke="#eee0d4"
			stroke-width="2"
		/>
		<ellipse cx="151" cy="143" rx="68" ry="15" fill="#ece0d5" /><ellipse
			cx="151"
			cy="145"
			rx="59"
			ry="10"
			fill="#53404a"
		/>
		<path
			d="M128 111q-23-18-3-39m33 39q23-20 3-39"
			stroke="#dbc4d0"
			stroke-width="3"
			stroke-linecap="round"
			opacity=".55"
		/>
		<path d="M121 180v37m0-24h44v-17" stroke="#674b78" stroke-width="3" />
		{#each [[121, 180], [121, 217], [165, 176]] as [x, y]}<circle
				cx={x}
				cy={y}
				r="5"
				fill="#a07fae"
				stroke="#674b78"
				stroke-width="2"
			/>{/each}
	{:else}
		<path d="M30 46h260v222H30Z" fill="#293149" stroke="#96aab6" stroke-width="2" />
		<path d="M30 73h260M45 59h6m6 0h6m6 0h6" stroke="#96aab6" stroke-width="2" />
		<image
			href="/media/projects/luixbits/nix-snowflake.svg"
			x="85"
			y="90"
			width="150"
			height="150"
		/>
		<path d="m21 37 45-5 2 20-44 5Zm239 219 44-4 2 22-44 4Z" fill="#d1b29e" opacity=".75" />
		<path d="M91 251h60m8 0h38" stroke="#83b8b9" stroke-width="3" />
	{/if}
	<!-- A static reflection belongs to the print's glass, rather than the whole wall. -->
	<path d="M0 0h113L0 266Z" fill="#f6e6e4" opacity=".035" />
</svg>
