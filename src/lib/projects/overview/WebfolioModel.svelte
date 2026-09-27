<script lang="ts">
	const id = $props.id();
</script>

<svg class="world-model" viewBox="0 0 580 340" fill="none" aria-hidden="true">
	<defs>
		<linearGradient id={`${id}-tray`} x2="0" y2="1">
			<stop stop-color="#b1946d" />
			<stop offset="1" stop-color="#605052" />
		</linearGradient>
	</defs>
	<path d="M18 267 226 160 559 238 360 326Z" fill="#45404a" stroke="#cab795" stroke-width="2" />
	<path d="M18 267v20l342 53v-14m0 14 199-87v-15" fill="#766050" stroke="#332b34" />
	<path d="m34 258 192-90 303 71-179 77Z" fill={`url(#${id}-tray)`} />
	<path d="m79 220 179-81 93 70-150 81Z" fill="#68754f" />
	<path d="m259 139 245 72-153-2Z" fill="#6d8991" />
	<path d="m351 209 153 2-148 94-155-15Z" fill="#514667" />
	<path
		d="M159 240v-92q-17-38-44-51m43 83q45-51 83-66m-82 116q-34-38-78-42"
		stroke="#685443"
		stroke-width="14"
		stroke-linecap="round"
	/>
	<g class="model-leaves" fill="#80ac75" stroke="#4f7756" stroke-width="5">
		<ellipse cx="108" cy="89" rx="50" ry="28" transform="rotate(-15 108 89)" />
		<ellipse cx="191" cy="79" rx="48" ry="31" />
		<ellipse cx="240" cy="105" rx="44" ry="27" />
		<ellipse cx="73" cy="167" rx="37" ry="21" />
	</g>
	<path
		d="M297 159q24-16 48 1t51 3 50 5m-169 5q24-16 50 1t50 4 48 6"
		stroke="#bce3d7"
		stroke-width="4"
	/>
	<path d="m376 131 15-28 23 18-12 21Z" fill="#e79671" />
	<path d="m397 122 20-12-3 19Z" fill="#bc715d" />
	<path
		d="m261 238 36-29 51 12v42l-37 18-50-11Z"
		fill="#ac6a9a"
		stroke="#f4c6d5"
		stroke-width="2"
	/>
	<path d="M280 238v-13l34 8v31l-35-8Z" fill="#342944" />
	<path d="M327 240h8m-8 8h8" stroke="#bce7df" stroke-width="2" />
	<circle cx="427" cy="221" r="25" fill="#c7a38d" />
	<ellipse
		cx="427"
		cy="221"
		rx="43"
		ry="9"
		transform="rotate(-26 427 221)"
		stroke="#e2c7a5"
		stroke-width="5"
	/>
	<path d="m376 279 2-9 3 9 8 2-8 2-3 9-2-9-9-2Z" fill="#f6dfae" />
	<path d="M185 294 281 276l72 15-97 23Z" fill="#eadaba" />
	<circle cx="273" cy="292" r="6" fill="#638b8c" />
</svg>
