<script lang="ts">
	let { project = 'noctalia-plugins' }: { project?: string } = $props();
	const id = $props.id();
</script>

<!-- A slim desktop display, small tower, metal digital watch and glass-topped mouse. -->
<svg class="station-art" viewBox="0 0 640 440" fill="none" aria-hidden="true">
	<defs>
		<linearGradient id={`${id}-metal`} x2=".8" y2="1"
			><stop stop-color="#9b9ba7" /><stop offset=".2" stop-color="#4b465a" /><stop
				offset=".65"
				stop-color="#2c293d"
			/><stop offset="1" stop-color="#756178" /></linearGradient
		>
		<linearGradient id={`${id}-stand`}
			><stop stop-color="#b4b8c2" /><stop offset=".3" stop-color="#5d687b" /><stop
				offset=".6"
				stop-color="#b9bac3"
			/><stop offset="1" stop-color="#584d65" /></linearGradient
		>
		<linearGradient id={`${id}-sky`} x2="0" y2="1"
			><stop stop-color="#222345" /><stop offset=".62" stop-color="#705079" /><stop
				offset="1"
				stop-color="#ba6d93"
			/></linearGradient
		>
		<linearGradient id={`${id}-sun`} x2="0" y2="1"
			><stop stop-color="#f9d39c" /><stop offset="1" stop-color="#e997b4" /></linearGradient
		>
		<linearGradient id={`${id}-silver`}
			><stop stop-color="#5c6470" /><stop offset=".19" stop-color="#d4d4c8" /><stop
				offset=".38"
				stop-color="#8999a2"
			/><stop offset=".72" stop-color="#d2c6c3" /><stop
				offset="1"
				stop-color="#615c70"
			/></linearGradient
		>
		<linearGradient id={`${id}-glass`} x2=".8" y2="1"
			><stop stop-color="#f8eee5" /><stop offset=".45" stop-color="#e3e4e7" /><stop
				offset="1"
				stop-color="#b5afc6"
			/></linearGradient
		>
		<clipPath id={`${id}-screen`}><rect x="13" y="13" width="414" height="222" rx="4" /></clipPath>
	</defs>
	<ellipse cx="334" cy="405" rx="265" ry="19" fill="#100f20" opacity=".3" />
	<path d="M109 296c-48 60 43 71 100 45s87-52 127-27" stroke="#151523" stroke-width="6" /><path
		d="M109 296c-48 60 43 71 100 45s87-52 127-27"
		stroke="#858795"
		stroke-width="1.4"
	/>
	<!-- A vented mini tower sits beside, rather than inside, the display. -->
	<path
		d="m32 130 71-15 28 15v191l-28 12-71-13Z"
		fill="#343044"
		stroke="#8b7f98"
		stroke-width="2"
	/>
	<path d="m103 115 28 15v191l-28 12Z" fill="#201f30" />
	<path d="M44 142h46v150H44Z" fill="#242636" stroke="#54546b" />
	{#each [153, 163, 173, 183, 193, 203, 213, 223, 233, 243, 253, 263, 273, 283] as y}<path
			d={`M48 ${y}h37`}
			stroke="#6c7689"
			stroke-width="2"
			opacity=".65"
		/>{/each}
	<circle cx="66" cy="309" r="6" fill="#1d2430" stroke="#7ed6d1" stroke-width="1.7" /><path
		d="M66 303v5"
		stroke="#b7efe0"
	/><path d="m109 149 14 6m-14 10 14 6m-14 10 14 6" stroke="#514158" stroke-width="3" />
	<!-- A swept metal arm holds a wide panel; its base has a visible bevel. -->
	<path
		d="m344 249-9 57 22 38h61l-32-51 8-48Z"
		fill={`url(#${id}-stand)`}
		stroke="#9c9faf"
		stroke-width="2"
	/>
	<path d="m355 274-5 28 23 34" stroke="#d2d0d4" stroke-width="2" />
	<path
		d="m304 341 125-5 42 25-14 10-165-5-8-10Z"
		fill="#514b63"
		stroke="#a9a0b6"
		stroke-width="1.5"
	/>
	<path d="m304 341 125-5 42 25-173-4Z" fill={`url(#${id}-stand)`} /><path
		d="m303 359 153 6"
		stroke="#c3b8c6"
		stroke-opacity=".7"
	/>
	<g transform="translate(151 24) skewY(3)">
		<path d="M437 8 450 0v249l-13 3Z" fill="#212132" stroke="#69647c" />
		<rect
			width="440"
			height="253"
			rx="9"
			fill={`url(#${id}-metal)`}
			stroke="#aab1c1"
			stroke-width="2"
		/>
		<rect x="8" y="8" width="424" height="232" rx="7" fill="#0c1526" />
		<g clip-path={`url(#${id}-screen)`}>
			<rect x="13" y="13" width="414" height="222" fill={`url(#${id}-sky)`} />
			<circle cx="250" cy="99" r="49" fill={`url(#${id}-sun)`} />
			<path
				d="M198 111h104m-104 12h104m-104 12h104m-104 12h104"
				stroke="#735079"
				stroke-width="4"
			/>
			<path
				d="m13 172 58-49 62 52 42-29 69 40 65-44 119 39v54H13Z"
				fill="#3a345b"
				stroke="#af84b6"
			/>
			<path
				d="M13 195h414m-414 16h414m-414 21h414M187 190l-90 45m125-45-23 45m54-45 46 45m-11-45 105 45"
				stroke="#a970ad"
				stroke-width="1"
				opacity=".65"
			/>
			<!-- A compact shell panel and widgets suggest the desktop collection. -->
			<rect x="24" y="23" width="392" height="13" rx="6" fill="#172534" fill-opacity=".9" />
			<path d="M36 29h17m5 0h12m12 0h12m280 0h12m8 0h9" stroke="#a0b7bf" stroke-width="2" />
			<circle cx="353" cy="29" r="3" fill="#bd9fda" /><circle
				cx="364"
				cy="29"
				r="3"
				fill="#75c8bd"
			/>
			<g data-screen-content={project}>
				{#if project === 'magic-mouse'}
					<!-- An illustrated device study; the upcoming app has no released UI yet. -->
					<rect
						x="73"
						y="51"
						width="281"
						height="149"
						rx="10"
						fill="#19253a"
						fill-opacity=".95"
						stroke="#a49ac4"
						stroke-width="1.5"
					/>
					<path d="M88 68h78m131 0h12m9 0h12M88 78h251" stroke="#7984a4" stroke-width="2" />
					<ellipse cx="170" cy="178" rx="48" ry="9" fill="#0d1528" opacity=".65" />
					<path
						d="M143 108q3-18 24-18 23 0 28 18l12 48q4 23-28 26-31 1-34-19Z"
						fill={`url(#${id}-glass)`}
						stroke="#e6d8ef"
						stroke-width="1.5"
					/>
					<path
						d="M148 112q10-21 32-13m-23 12 3 17"
						stroke="#fff5ee"
						stroke-width="2"
						stroke-linecap="round"
					/>
					<path
						d="M222 101h47m-47 9h72m-72 39h56m-56 10h83"
						stroke="#8494b0"
						stroke-width="3"
						stroke-linecap="round"
					/>
					<path
						d="m218 128 8 5 14-15m-17 61h47m9 0h22"
						stroke="#b79acd"
						stroke-width="3"
						stroke-linecap="round"
					/>
					<circle cx="312" cy="105" r="8" stroke="#87b8c8" stroke-dasharray="3 4" />
				{:else}
					<rect
						x="33"
						y="57"
						width="108"
						height="107"
						rx="8"
						fill="#182235"
						fill-opacity=".9"
						stroke="#8594b0"
						stroke-opacity=".6"
					/>
					<rect x="42" y="67" width="90" height="32" rx="4" fill="#434059" />
					<path d="M51 77h47m-47 10h62" stroke="#c4d3d4" stroke-width="2" />
					{#each [48, 76, 104] as x}<rect
							{x}
							y="110"
							width="20"
							height="19"
							rx="4"
							fill="#65627e"
						/><circle cx={x + 10} cy="119" r="4" stroke="#b7c9cc" />{/each}
					<path d="M46 145h77" stroke="#3c4d61" stroke-width="5" stroke-linecap="round" /><path
						d="M46 145h44"
						stroke="#80ccc6"
						stroke-width="5"
						stroke-linecap="round"
					/>
				{/if}
			</g>
			<rect x="179" y="216" width="108" height="13" rx="6" fill="#1a2638" />
			{#each [191, 208, 225, 242, 259, 276] as x}<rect
					{x}
					y="220"
					width="7"
					height="6"
					rx="2"
					fill="#bdadd5"
				/>{/each}
			<path d="M18 15h151L39 235H18Z" fill="#e2e7f4" opacity=".035" />
		</g>
		<circle cx="222" cy="6" r="1.6" fill="#181927" /><path
			d="M202 247h40"
			stroke="#9d9aad"
			stroke-width="1.4"
		/><circle cx="418" cy="247" r="1.6" fill="#8ad7c8" />
		<path d="M9 2h421" stroke="#c4d7dc" stroke-opacity=".7" />
	</g>
	<!-- The watch has linked metal straps, pushers, a chamfered bezel and a real 4:20 face. -->
	<g data-station-hardware="watch" transform="translate(142 280) rotate(-19) scale(.88)">
		<ellipse cx="45" cy="115" rx="55" ry="56" fill="#171525" opacity=".25" />
		<path
			d="M22 4q23-8 45 0v156q-25 9-47-1Z"
			fill={`url(#${id}-silver)`}
			stroke="#a1a3a9"
			stroke-width="1.5"
		/>
		{#each [9, 18, 27, 36, 129, 138, 147, 156] as y}<path
				d={`M24 ${y}h40`}
				stroke="#434851"
				stroke-width="3"
			/><path d={`M25 ${y - 2}h39`} stroke="#dde0d6" stroke-width="1" />{/each}
		<path d="M-4 67h7v14h-7m92-15h7v15h-7m0 21h7v11h-7" fill="#bbc1c2" stroke="#454452" />
		<path
			d="M13 40h61l14 13v58l-13 14H12L0 112V54Z"
			fill={`url(#${id}-silver)`}
			stroke="#e0d8d0"
			stroke-width="1.5"
		/>
		<path
			d="M17 46h54l11 12v48l-12 12H17L7 106V58Z"
			fill="#293441"
			stroke="#606e78"
			stroke-width="1.5"
		/>
		<rect
			x="13"
			y="61"
			width="62"
			height="38"
			rx="3"
			fill="#b9c7ac"
			stroke="#d4c6a1"
			stroke-width="2"
		/>
		<path d="M18 54h22m17 0h12M18 107h18m7 0h12m5 0h10" stroke="#c7bdaf" stroke-width="1.3" />
		<path
			d="M20 69v11h10m0-11v23m11-21h10v9H41v11h10m8-20h10v20H59Z"
			stroke="#354a45"
			stroke-width="2.1"
			stroke-linejoin="round"
		/>
		<circle cx="35.5" cy="77" r="1.2" fill="#354a45" /><circle
			cx="35.5"
			cy="85"
			r="1.2"
			fill="#354a45"
		/>
		<path d="M17 64h52" stroke="#eff0cc" stroke-width="2" opacity=".45" />
	</g>
	<!-- The Magic Mouse has one uninterrupted glass surface, with no scroll wheel. -->
	<g data-station-hardware="mouse" transform="translate(495 311) rotate(-17) scale(.77 .72)">
		<ellipse cx="51" cy="147" rx="61" ry="13" fill="#151425" opacity=".32" />
		<rect y="7" width="106" height="146" rx="47" fill="#6f7182" stroke="#353743" stroke-width="2" />
		<rect
			x="1"
			width="104"
			height="147"
			rx="47"
			fill={`url(#${id}-glass)`}
			stroke="#ede9ee"
			stroke-width="1.5"
		/>
		<path d="M14 41C14 13 36 7 50 7" stroke="#fffaf1" stroke-width="3" stroke-linecap="round" />
		<path d="M11 115q5 27 43 27 31-1 43-25" stroke="#a99cb5" stroke-width="1.3" />
		<path d="M95 52v51q0 17-10 26" stroke="#d998cc" stroke-width="2" opacity=".5" />
	</g>
</svg>
