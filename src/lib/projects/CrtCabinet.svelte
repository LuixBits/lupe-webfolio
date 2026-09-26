<script lang="ts">
	// Original SVG cabinet from the approved motion study. Its screen is a real
	// opening, so HTML media can sit behind it without being painted over.
	let { id, powered = true }: { id: string; powered?: boolean } = $props();
</script>

<svg class="tv-chrome" viewBox="0 0 660 510" fill="none" aria-hidden="true">
	<defs>
		<linearGradient
			id={`${id}-body`}
			x1="20"
			y1="25"
			x2="570"
			y2="470"
			gradientUnits="userSpaceOnUse"
			><stop stop-color="#50545e" /><stop offset=".14" stop-color="#3a3d46" /><stop
				offset=".7"
				stop-color="#292c32"
			/><stop offset="1" stop-color="#22252b" /></linearGradient
		>
		<linearGradient
			id={`${id}-side`}
			x1="607"
			y1="80"
			x2="647"
			y2="80"
			gradientUnits="userSpaceOnUse"
			><stop stop-color="#2b2933" /><stop offset="1" stop-color="#17171f" /></linearGradient
		>
		<linearGradient
			id={`${id}-rim`}
			x1="80"
			y1="60"
			x2="520"
			y2="420"
			gradientUnits="userSpaceOnUse"
			><stop stop-color="#101118" /><stop offset=".46" stop-color="#24262c" /><stop
				offset=".8"
				stop-color="#4b4e52"
			/><stop offset="1" stop-color="#5c5c61" /></linearGradient
		>
		<linearGradient id={`${id}-top`} x1="48" y1="18" x2="600" y2="34" gradientUnits="userSpaceOnUse"
			><stop stop-color="#6a888b" /><stop offset=".4" stop-color="#555863" /><stop
				offset="1"
				stop-color="#7d546b"
			/></linearGradient
		>
		<pattern id={`${id}-speaker`} width="4" height="5" patternUnits="userSpaceOnUse"
			><path d="M0 1h4" stroke="#11141a" stroke-width="2" /><path
				d="M0 3h4"
				stroke="#4f5157"
				stroke-width=".5"
			/></pattern
		>
		<pattern id={`${id}-vents`} width="7" height="6" patternUnits="userSpaceOnUse"
			><path d="M1 0v6" stroke="#090b11" stroke-width="2" /></pattern
		>
	</defs>
	<path
		d="M606 41L641 17Q650 18 650 30V432Q650 449 636 454L607 470Z"
		fill={`url(#${id}-side)`}
		stroke="#4c3e4e"
	/>
	<path
		d="M39 31L68 10L627 8Q640 8 642 18L613 41Z"
		fill={`url(#${id}-top)`}
		stroke="#6c6675"
		stroke-width=".7"
	/>
	<path d="M624 61L641 49V362L624 374Z" fill={`url(#${id}-vents)`} opacity=".7" />
	<path
		fill-rule="evenodd"
		d="M43 28H584Q616 28 620 64L624 421Q624 453 594 460L52 466Q20 466 18 435L13 63Q12 30 43 28ZM118 68Q88 69 88 99V371Q88 401 119 402H503Q533 401 533 371V99Q533 69 502 68Z"
		fill={`url(#${id}-body)`}
		stroke="#76727e"
		stroke-width="1.2"
	/>
	<path d="M43 34H582Q608 34 611 64" stroke="#bfd2d2" stroke-opacity=".35" />
	<path d="M23 432Q23 458 53 458L594 453" stroke="#0e1017" stroke-width="3" />
	<path
		fill-rule="evenodd"
		d="M94 51Q294 43 524 51Q553 53 556 88L559 379Q555 414 525 416Q310 425 92 415Q64 412 63 380L60 88Q61 55 94 51ZM118 68Q88 69 88 99V371Q88 401 119 402H503Q533 401 533 371V99Q533 69 502 68Z"
		fill={`url(#${id}-rim)`}
		stroke="#17191f"
		stroke-width="1.3"
	/>
	<path
		d="M119 68H502Q533 69 533 99V371Q533 401 502 402H119Q88 401 88 371V99Q88 69 119 68Z"
		stroke="#070b0e"
		stroke-width="3"
	/>
	<path d="M112 74Q94 77 94 102V146" stroke="#cce2e8" stroke-opacity=".14" stroke-width="2" />
	<path d="M120 400Q314 408 502 399" stroke="#dad7d5" stroke-opacity=".18" />
	<rect
		x="30"
		y="94"
		width="20"
		height="282"
		rx="5"
		fill={`url(#${id}-speaker)`}
		stroke="#25262e"
	/>
	<rect
		x="570"
		y="90"
		width="28"
		height="285"
		rx="5"
		fill={`url(#${id}-speaker)`}
		stroke="#25262e"
	/>
	<text
		x="97"
		y="441"
		fill="#b2b5b9"
		font-family="Arial,sans-serif"
		font-weight="bold"
		font-size="11"
		letter-spacing="2.5">LUPE</text
	>
	<text
		x="149"
		y="441"
		fill="#777d86"
		font-family="Arial,sans-serif"
		font-size="5.5"
		letter-spacing="1.2">STEREO · COLOUR MONITOR</text
	>
	<circle cx="84" cy="440" r="2.6" fill={powered ? '#8bcda3' : '#35463c'} />
	<rect
		x="420"
		y="431"
		width="58"
		height="14"
		rx="2"
		fill="#21242a"
		stroke="#5a5d63"
		stroke-width=".8"
	/>
	<path d="M449 432v12" stroke="#13151a" /><text
		x="431"
		y="441"
		fill="#a3a5ae"
		font-family="Arial"
		font-size="8">−</text
	><text x="459" y="441" fill="#a3a5ae" font-family="Arial" font-size="8">+</text>
	<rect
		x="489"
		y="431"
		width="51"
		height="14"
		rx="2"
		fill="#21242a"
		stroke="#5a5d63"
		stroke-width=".8"
	/>
	<text x="499" y="440" fill="#7e8590" font-family="Arial" font-size="5.5" letter-spacing="1"
		>INPUT</text
	>
	<circle cx="573" cy="437" r="4" fill="#161821" stroke="#444854" />
	<path d="M63 465H125L122 478H61ZM520 461H582L582 474H523Z" fill="#13151b" stroke="#323640" />
</svg>

<style>
	.tv-chrome {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 2;
	}
</style>
