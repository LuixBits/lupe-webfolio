<script lang="ts">
	const id = $props.id();
</script>

<div class="window">
	<svg aria-hidden="true" viewBox="0 0 540 300" preserveAspectRatio="xMidYMid slice">
		<defs>
			<linearGradient id={`${id}-dusk`} x2="0" y2="1">
				<stop stop-color="#25134d" />
				<stop offset=".65" stop-color="#6d397e" />
				<stop offset="1" stop-color="#cb5899" />
			</linearGradient>
			<linearGradient id={`${id}-sun`} x2="0" y2="1">
				<stop stop-color="#ffd58a" />
				<stop offset=".45" stop-color="#ff9dbb" />
				<stop offset="1" stop-color="#ff5ed1" />
			</linearGradient>
			<mask id={`${id}-sun-stripes`}>
				<circle cx="392" cy="86" r="66" fill="white" />
				<path d="M320 90h145m-145 13h145m-145 17h145m-145 20h145" stroke="black" stroke-width="5" />
			</mask>
		</defs>
		<path d="M0 0h540v300H0Z" fill={`url(#${id}-dusk)`} />
		<circle cx="392" cy="86" r="66" fill={`url(#${id}-sun)`} mask={`url(#${id}-sun-stripes)`} />
		<path
			d="m63 42 2-7 2 7 7 2-7 2-2 7-2-7-7-2Zm182-16 1-4 1 4 4 1-4 1-1 4-1-4-4-1Z"
			fill="#c5ffff"
			opacity=".8"
		/>
		<path
			d="m0 170 60-31 29 10 74-56 53 52 55-27 71 51 43-30 67 33 45-20 43 32v116H0Z"
			fill="#41235e"
		/>
		<path
			d="m0 170 60-31 29 10 74-56 53 52 55-27 71 51 43-30 67 33 45-20 43 32M163 93l-29 94m29-94 35 93m73-68-19 78"
			fill="none"
			stroke="#ed78cf"
			stroke-opacity=".4"
		/>
		<path
			d="M0 162 52 156V102h68v58l65 12V121h51v74l55-23v-68h45v93l43-37v-44h83v62h78v122H0Z"
			fill="#30214e"
		/>
		<path d="M0 236h72v-57h49v56h35v-24h93v30h38v-91h72v83h97v-35h84v102H0Z" fill="#19243c" />
		<path
			d="M72 219v-40h49m166 41v-70h72m97 63v-15h84"
			fill="none"
			stroke="#5edfe4"
			stroke-opacity=".6"
			stroke-width="2"
		/>
		<path
			d="M80 118h10v14H80m20-14h10v14h-10m194-8h9v13h-9m130 0h13v19h-13m-89 36h9v17h-9m-197 35h12v14h-12"
			fill="#ffb5d4"
			opacity=".7"
		/>
		<path d="M0 280 500 0h120L70 300Z" fill="#cce3e8" opacity=".05" />
	</svg>
</div>
