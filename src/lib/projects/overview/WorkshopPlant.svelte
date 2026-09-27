<script lang="ts">
	const id = $props.id();
</script>

<svg class="plant" viewBox="0 0 260 550" fill="none" aria-hidden="true">
	<defs>
		<linearGradient
			id={`${id}-leaf`}
			x1="-32"
			y1="-105"
			x2="38"
			y2="-15"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#97bda0" /><stop offset=".45" stop-color="#608f80" /><stop
				offset="1"
				stop-color="#305f65"
			/>
		</linearGradient>
		<linearGradient
			id={`${id}-clay`}
			x1="71"
			y1="452"
			x2="204"
			y2="469"
			gradientUnits="userSpaceOnUse"
		>
			<stop stop-color="#bc8b6f" /><stop offset=".25" stop-color="#a67561" /><stop
				offset=".7"
				stop-color="#7c5350"
			/><stop offset="1" stop-color="#5b3f4a" />
		</linearGradient>
		<g id={`${id}-frond`}>
			<path
				d="M0 0C-24-27-54-75-31-103q19-20 34-2c14-25 49-8 46 21C48-38 13-17 0 0Z"
				fill={`url(#${id}-leaf)`}
				stroke="#98b4a0"
				stroke-width="1.5"
			/>
			<path
				d="M0 0Q11-47 1-96M3-21-19-42M7-40-25-63M7-58-20-87M7-20l26-27M8-40l31-28M7-58l30-29"
				stroke="#335e61"
				stroke-width="1.2"
			/>
			<path d="M-1-6Q7-49-1-94M-29-99q-14 17-1 48" stroke="#c2d5a3" stroke-width="1" opacity=".6" />
		</g>
	</defs>
	<ellipse cx="136" cy="527" rx="88" ry="15" fill="#100d21" opacity=".35" />
	<!-- Curved petioles connect each overlapping leaf to the main stem. -->
	<path
		d="M135 429q-6-65 0-144t-6-165m4 125-13-20m14 52 5-40m-4 98-13-13m14 55 10-19"
		stroke="#536e66"
		stroke-width="6"
		stroke-linecap="round"
	/>
	<path d="M132 420q-7-64 0-135t-5-164" stroke="#b0b789" stroke-width="2" />
	<use href={`#${id}-frond`} transform="translate(129 136) rotate(-8) scale(.78 .9)" />
	<use href={`#${id}-frond`} transform="translate(131 231) rotate(41) scale(.94 1.04)" />
	<use href={`#${id}-frond`} transform="translate(124 243) rotate(-57) scale(.94 1.08)" />
	<use href={`#${id}-frond`} transform="translate(141 311) rotate(52) scale(1.02 1.04)" />
	<use href={`#${id}-frond`} transform="translate(129 342) rotate(-68) scale(.88 1.03)" />
	<use href={`#${id}-frond`} transform="translate(142 385) rotate(63) scale(.85 .94)" />
	<path
		d="M133 388q-57-74-61-32 6 29 61 32Z"
		fill="#688c7b"
		stroke="#a2b69c"
		stroke-width="1.5"
	/><path d="m87 359 46 29" stroke="#385f5b" />
	<ellipse cx="135" cy="516" rx="69" ry="13" fill="#543d44" stroke="#a27566" stroke-width="2" />
	<path d="M66 509v9q69 25 138 0v-9" fill="#78504e" stroke="#b18a6a" stroke-width="2" />
	<path
		d="m72 415 20 89q42 15 88 0l20-89Z"
		fill={`url(#${id}-clay)`}
		stroke="#ac826a"
		stroke-width="2"
	/>
	<path
		d="M83 433q53 13 106 0m-103 16q48 13 99 0m-96 17q47 12 92 0m-88 17q42 10 84 0"
		stroke="#d3a784"
		stroke-width="1"
		opacity=".25"
	/>
	<path d="m85 433 13 60" stroke="#deb28b" stroke-width="3" stroke-linecap="round" opacity=".42" />
	<path d="M66 406v17q68 28 138-1v-16" fill="#996d58" stroke="#c69b77" stroke-width="2" />
	<ellipse cx="135" cy="407" rx="70" ry="19" fill="#bb8c6b" stroke="#d3aa86" stroke-width="2" />
	<ellipse cx="135" cy="407" rx="57" ry="12" fill="#3c3437" />
	<path d="M83 407q53-16 105 0" stroke="#6b514a" stroke-width="3" />
	<path d="M135 407v-22" stroke="#8da27b" stroke-width="5" />
	<g fill="#9b8468"
		><ellipse cx="109" cy="407" rx="3" ry="1.5" /><ellipse
			cx="158"
			cy="412"
			rx="4"
			ry="1.5"
		/><ellipse cx="171" cy="404" rx="2" ry="1" /></g
	>
</svg>
