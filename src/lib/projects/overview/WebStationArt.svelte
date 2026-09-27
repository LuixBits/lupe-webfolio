<script lang="ts">
	import WebfolioModel from './WebfolioModel.svelte';
	let { project }: { project: string } = $props();
	const id = $props.id();
</script>

{#if project === 'scrumpoker' || project === 'team-feed'}
	<!-- Small physical studies share the cabinet's display plinth. -->
	<svg
		class="world-model"
		viewBox="0 0 580 340"
		fill="none"
		aria-hidden="true"
		data-screen-content={project}
	>
		<defs>
			<linearGradient id={`${id}-wood`} x2="0" y2="1">
				<stop stop-color="#c9aa87" /><stop offset="1" stop-color="#735362" />
			</linearGradient>
			<linearGradient id={`${id}-felt`} x2=".3" y2="1">
				<stop stop-color="#547b7a" /><stop offset="1" stop-color="#2e4b61" />
			</linearGradient>
			<linearGradient id={`${id}-paper`} x2=".6" y2="1">
				<stop stop-color="#f5e4c5" /><stop offset="1" stop-color="#ccb1b6" />
			</linearGradient>
		</defs>
		<path d="M18 267 226 160 559 238 360 326Z" fill="#45404a" stroke="#cab795" stroke-width="2" />
		<path d="M18 267v20l342 53v-14m0 14 199-87v-15" fill="#766050" stroke="#332b34" />
		<path d="m34 258 192-90 303 71-179 77Z" fill={`url(#${id}-wood)`} />
		{#if project === 'scrumpoker'}
			<ellipse cx="291" cy="239" rx="201" ry="58" fill="#261e35" opacity=".4" />
			<path d="M94 198v19c0 96 400 96 400 0v-19" fill="#715963" stroke="#c6a193" stroke-width="2" />
			<ellipse
				cx="294"
				cy="198"
				rx="200"
				ry="69"
				fill="#b49a85"
				stroke="#e5c8ab"
				stroke-width="3"
			/>
			<ellipse
				cx="294"
				cy="195"
				rx="184"
				ry="57"
				fill={`url(#${id}-felt)`}
				stroke="#e8cdb4"
				stroke-width="2"
			/>
			<ellipse
				cx="294"
				cy="193"
				rx="166"
				ry="43"
				stroke="#93b3a0"
				stroke-opacity=".45"
				stroke-dasharray="3 6"
			/>
			{#each [{ x: 181, y: 88, angle: -12, number: 3 }, { x: 257, y: 58, angle: 3, number: 5 }, { x: 344, y: 91, angle: 16, number: 8 }] as card}
				<g transform={`translate(${card.x} ${card.y}) rotate(${card.angle})`}>
					<rect x="5" y="7" width="70" height="107" rx="7" fill="#182638" opacity=".35" />
					<rect
						width="70"
						height="107"
						rx="7"
						fill={`url(#${id}-paper)`}
						stroke="#f2d7c4"
						stroke-width="2"
					/>
					<rect x="7" y="7" width="56" height="93" rx="4" stroke="#ae8098" />
					{#if card.number === 3}
						<path
							d="M25 32h23v21H31m17 0v22H25"
							stroke="#69516f"
							stroke-width="6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					{:else if card.number === 5}
						<path
							d="M48 32H25v21h23v22H25"
							stroke="#69516f"
							stroke-width="6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					{:else}
						<path
							d="M25 32h23v43H25Zm0 21h23"
							stroke="#69516f"
							stroke-width="6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					{/if}
					<path d="M28 89h16" stroke="#c192ac" stroke-width="2" />
				</g>
			{/each}
			{#each [[119, 205], [188, 239], [306, 255], [426, 237], [469, 191]] as [x, y], index}
				<ellipse cx={x} cy={y + 4} rx="18" ry="10" fill="#2b2d47" />
				<ellipse
					cx={x}
					cy={y}
					rx="18"
					ry="10"
					fill={index % 2 ? '#ba8bb0' : '#8fc5b3'}
					stroke="#e6c9ca"
					stroke-width="1.5"
				/>
				<path d={`M${x - 7} ${y}h14`} stroke="#465065" stroke-width="2" />
			{/each}
		{:else}
			<ellipse cx="286" cy="270" rx="180" ry="31" fill="#2a203b" opacity=".35" />
			<!-- Layered documents and reply bubbles echo the shared feed. -->
			<g transform="translate(103 43) skewY(-5)">
				<path d="M0 0h310l15 13v231l-15 9H0Z" fill="#71647e" stroke="#b3a5c0" stroke-width="2" />
				<rect width="310" height="239" rx="8" fill="#242c45" stroke="#c1b1d0" stroke-width="3" />
				<path d="M1 28h307" stroke="#73627f" stroke-width="2" />
				{#each [15, 27, 39] as x}<circle cx={x} cy="14" r="3" fill="#bd9bbc" />{/each}
				<rect x="78" y="9" width="178" height="10" rx="5" fill="#434059" />
				<path
					d="M25 48h10m-10 21h10m-10 21h10m-10 21h10m15-72v183"
					stroke="#7c91aa"
					stroke-width="3"
				/>
				{#each [44, 139] as y, index}
					<rect
						x="61"
						{y}
						width="230"
						height="83"
						rx="5"
						fill={index ? '#c7d7cc' : '#e3d5bf'}
						stroke="#f0dcd0"
					/>
					<circle cx="80" cy={y + 19} r="8" fill={index ? '#637f8c' : '#9b708e'} />
					<path
						d={`M98 ${y + 14}h87m-87 9h49M75 ${y + 40}h198m-198 9h157`}
						stroke="#7b7787"
						stroke-width="3"
					/>
					<path d={`M75 ${y + 59}h16v10h-10l-6 5Z`} fill="#668a8f" />
					<path d={`M98 ${y + 64}h33m90 0h52`} stroke="#92839b" stroke-width="2" />
				{/each}
			</g>
			<path d="m399 232 56-14 27 17-58 16Z" fill="#c4a5b7" stroke="#efd3d5" stroke-width="2" />
			<path d="m424 251 1 20 17-26" fill="#c4a5b7" stroke="#efd3d5" stroke-width="2" />
			<path d="m414 233 23-6m-13 13 23-6" stroke="#5b5878" stroke-width="2" />
		{/if}
	</svg>
{:else}
	<WebfolioModel />
{/if}
