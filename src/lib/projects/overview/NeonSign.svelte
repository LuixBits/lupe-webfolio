<script lang="ts">
	let { text, color = 'pink' }: { text: string; color?: 'pink' | 'cyan' | 'violet' } = $props();
	// Original single-line tube lettering. The semantic heading lives in HTML.
	const letters: Record<string, string> = {
		A: 'M2 38 15 2 28 38M7 25h16',
		B: 'M3 38V2h12q13 0 13 9t-13 9H3m12 0q14 0 14 9t-14 9H3',
		C: 'M28 6Q19-1 10 3T2 20q0 20 26 14',
		D: 'M3 38V2h9q18 0 18 18T12 38Z',
		E: 'M28 2H3v36h25M3 20h20',
		F: 'M28 2H3v36M3 20h20',
		G: 'M28 6Q2-7 2 20t26 15V22H17',
		H: 'M3 2v36M27 2v36M3 20h24',
		I: 'M6 2h18M15 2v36M6 38h18',
		J: 'M8 2h19v24q0 18-21 10l-3-6',
		K: 'M3 2v36M27 2 3 24m8-9 17 23',
		L: 'M3 2v36h25',
		M: 'M2 38V2l13 19L28 2v36',
		N: 'M3 38V2l24 36V2',
		O: 'M15 2Q2 2 2 20t13 18q13 0 13-18T15 2Z',
		P: 'M3 38V2h12q13 0 13 10T15 22H3',
		Q: 'M15 2Q2 2 2 20t13 18q13 0 13-18T15 2Zm4 27 11 13',
		R: 'M3 38V2h12q13 0 13 10T15 22H3m12 0 14 16',
		S: 'M27 5Q3-5 3 11q0 9 12 9t12 10Q27 45 3 35',
		T: 'M2 2h26M15 2v36',
		U: 'M3 2v24q0 12 12 12t12-12V2',
		V: 'M2 2 15 38 28 2',
		W: 'M1 2 7 38l8-21 8 21 6-36',
		X: 'M2 2 28 38M28 2 2 38',
		Y: 'M2 2 15 20 28 2M15 20v18',
		Z: 'M2 2h26L2 38h26'
	};
	const glyphs = $derived([...text.toUpperCase()]);
	const width = $derived(glyphs.length * 40 + 20);
</script>

<span class="neon-sign neon-{color}" style={`--sign-width:${width / 54}em`} aria-hidden="true">
	<svg viewBox={`0 0 ${width} 64`} fill="none">
		<g stroke-linecap="round" stroke-linejoin="round">
			{#each glyphs as glyph, i}
				<g transform={`translate(${i * 40 + 15} 11)`}>
					<path d={letters[glyph] ?? ''} stroke="#130f21" stroke-width="9" />
					<path class="tube-halo" d={letters[glyph] ?? ''} stroke="currentColor" stroke-width="7" />
					<path d={letters[glyph] ?? ''} stroke="currentColor" stroke-width="3.5" />
					<path d={letters[glyph] ?? ''} stroke="#fff3fc" stroke-width="1.15" />
				</g>
			{/each}
		</g>
	</svg>
</span>

<style>
	.neon-sign {
		display: inline-block;
		vertical-align: middle;
		width: var(--sign-width);
		max-width: 100%;
		color: #ff78d6;
	}
	.neon-cyan {
		color: #72f0e7;
	}
	.neon-violet {
		color: #bfa0ff;
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		filter: drop-shadow(0 0 6px currentColor);
	}
	.tube-halo {
		opacity: 0.18;
	}
</style>
