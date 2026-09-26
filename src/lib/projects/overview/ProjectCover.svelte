<script lang="ts">
	import type { Project } from '$lib/content/schema';
	import TapeArtwork from '../TapeArtwork.svelte';
	let { project }: { project: Project } = $props();
	const id = $props.id();
	const dots = Array.from({ length: 44 }, (_, n) => ({
		x: 32 + ((n * 67) % 256),
		y: 12 + ((n * 37) % 156),
		r: n % 5 === 0 ? 1.6 : 0.7
	}));
</script>

<!-- Original printed cover art, not a representation of an app screenshot. -->
<svg viewBox="0 0 320 180" fill="none" aria-hidden="true">
	<defs>
		<linearGradient id={`${id}-paper`} x2="1" y2="1"
			><stop stop-color="#343442" /><stop offset="1" stop-color="#151c2d" /></linearGradient
		>
		<radialGradient id={`${id}-halo`}
			><stop stop-color="#b876aa" stop-opacity=".3" /><stop
				offset="1"
				stop-color="#b876aa"
				stop-opacity="0"
			/></radialGradient
		>
		<linearGradient id={`${id}-line`}
			><stop stop-color="#82e3df" /><stop offset=".55" stop-color="#ccd9ec" /><stop
				offset="1"
				stop-color="#ed99d0"
			/></linearGradient
		>
		<pattern id={`${id}-grain`} width="6" height="6" patternUnits="userSpaceOnUse"
			><circle cx="1" cy="1" r=".6" fill="#e6dccc" opacity=".08" /></pattern
		>
	</defs>
	<path d="M0 0H320V180H0Z" fill={`url(#${id}-paper)`} />
	<ellipse cx="175" cy="104" rx="170" ry="105" fill={`url(#${id}-halo)`} />
	{#if project.slug === 'lupe-webfolio'}
		<!-- Four worlds around the same wheel; the radial portfolio's existing motif. -->
		<g transform="translate(161 90)">
			<path d="M-5-5H-78A78 78 0 0 1-5-78Z" fill="#819582" opacity=".8" />
			<path d="M5-5V-78A78 78 0 0 1 78-5Z" fill="#b97bad" opacity=".8" />
			<path d="M5 5h73A78 78 0 0 1 5 78Z" fill="#609899" opacity=".8" />
			<path d="M-5 5v73A78 78 0 0 1-78 5Z" fill="#777baf" opacity=".8" />
			<circle r="79" stroke="#eee3cf" stroke-opacity=".55" /><circle
				r="49"
				fill="#252b3b"
				stroke="#e8d9c7"
			/>
			<path d="M0-49v33m16 16h33M0 16v33M-49 0h33" stroke="#aee7df" />
			<circle r="16" fill="#94c5c4" stroke="#eef5d8" /><circle r="8" fill="#233340" />
			<path
				d="M-53-16q-22-22 0-46m-2 25-11-10m13 2 9-12M26-52h29m-29 8h29m-29 8h29M31 32q8-13 16 0t16 0m-32 9q8-13 16 0t16 0"
				stroke="#e4e6d1"
				stroke-opacity=".65"
			/>
			<path d="m-37 30 3 7 7 1-6 5 1 7-6-4-7 3 3-7-5-5 7-1Z" fill="#f1dfc5" opacity=".75" />
		</g>
		<path d="M18 30h33m-33 7h18M265 143h37m-19 7h19" stroke="#a7b8c5" stroke-opacity=".5" />
	{:else if project.slug === 'orbit-toy'}
		{#each dots as dot, i (i)}<circle
				cx={dot.x}
				cy={dot.y}
				r={dot.r}
				fill={i % 3 ? '#9fdedb' : '#f0bcdf'}
				opacity={0.22 + (i % 4) * 0.17}
			/>{/each}
		<g transform="translate(163 91)">
			<ellipse rx="121" ry="32" transform="rotate(-22)" stroke="#cc86ba" stroke-opacity=".6" />
			<ellipse rx="92" ry="43" transform="rotate(44)" stroke="#8dccd5" stroke-opacity=".65" />
			<path
				d="M0-53 48-26V30L0 58-48 30V-26Z"
				fill="#96e3e511"
				stroke={`url(#${id}-line)`}
				stroke-width="1.5"
			/>
			<path
				d="m-48-26 48 28 48-28M0 2V58M0-53V2m-48 28L0 2l48 28"
				stroke="#9be3df"
				stroke-opacity=".65"
			/>
			{#each [-24, 0, 24] as x}
				{#each [-12, 12, 36] as y}<circle
						cx={x}
						cy={y - Math.abs(x) * 0.55}
						r="1.5"
						fill="#d9f5ed"
					/>{/each}
			{/each}
			<circle cx="109" cy="-39" r="4" fill="#ffe3bd" /><circle
				cx="-44"
				cy="-54"
				r="2.5"
				fill="#bbdff4"
			/>
		</g>
	{:else if project.slug === 'scrumpoker'}
		<ellipse cx="169" cy="148" rx="104" ry="12" fill="#0b1021" opacity=".6" />
		<g transform="rotate(-22 123 92)">
			<rect x="82" y="25" width="81" height="127" rx="6" fill="#785070" stroke="#cda6bd" />
			<rect x="90" y="33" width="65" height="111" rx="3" stroke="#d9b2c4" stroke-opacity=".6" />
			<path
				d="m93 60 49 74m-49-53 35 53m-34-31 20 31m-9-86 40 60m-28-60 28 42"
				stroke="#b185a7"
				stroke-opacity=".5"
			/>
		</g>
		<g transform="rotate(13 196 88)">
			<rect x="149" y="23" width="81" height="127" rx="6" fill="#ecdfc4" stroke="#fff0d3" />
			<path d="m190 58 19 30-19 30-19-30Z" fill="#7a526e" />
			<path d="m161 36 4 7-4 7-4-7Zm57 87 4 7-4 7-4-7Z" fill="#7a526e" />
			<circle cx="190" cy="89" r="7" stroke="#c698a7" />
		</g>
		<path d="M34 70h18m-9-9v18M265 103h18m-9-9v18" stroke="#d8b4cd" stroke-opacity=".4" />
	{:else}
		<foreignObject x="90" y="20" width="140" height="140"><TapeArtwork {project} /></foreignObject>
	{/if}
	<path d="M0 0H320V180H0Z" fill={`url(#${id}-grain)`} />
	<path d="M1 1H319V179H1Z" stroke="#dfd9dc" stroke-opacity=".2" />
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
