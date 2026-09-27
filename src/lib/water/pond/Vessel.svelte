<script lang="ts">
	/** THE FLEET — one bespoke craft per organisation, shared by the pond
	 *  scene and the detail-page hero. Local coords: the waterline is y=0,
	 *  the craft is centered on x=0. Work floats (boats), education grows
	 *  (lily pads); a completed degree blooms.
	 *
	 *  - siga    the flagship wasen: two lashed cargo crates (the two roles)
	 *            tied with a red mizuhiki cord, koinobori off the stern, a
	 *            lit chōchin at the bow — she works early.
	 *  - hslu    the lotus raft: MA and BSc pads, both in bloom, a stake
	 *            sign, a dragonfly (tombo — the victory insect) resting.
	 *  - neptun  a light skiff with a trident boat-hook — the god's tool.
	 *  - armee   a spartan olive punt, the origami crane on its prow.
	 *  - emvs    the weathered apprentice rowboat, oar shipped, towing two
	 *            small school pads with young blossoms.
	 *
	 *  All decorative: parents label the link. `reflect` draws the stylized
	 *  woodblock reflection (three broken dashes, no masks). */
	import Crane from './Crane.svelte';

	let {
		slug,
		name,
		reflect = true
	}: {
		slug: 'siga' | 'hslu' | 'neptun' | 'armee' | 'emvs' | 'schule';
		/** Hull lettering (the boat's painted name). */
		name?: string;
		reflect?: boolean;
	} = $props();

	// stylized reflection widths per craft (half-widths of the three dashes)
	const REFLECT: Record<string, number> = {
		siga: 78,
		hslu: 60,
		neptun: 48,
		armee: 40,
		emvs: 44,
		schule: 46
	};
	const rw = $derived(REFLECT[slug] ?? 50);
</script>

<!-- a lashed cargo crate, base at (0,0), w×h upward -->
{#snippet crate(w: number, h: number)}
	<rect class="vx-crate" x={-w / 2} y={-h} width={w} height={h} rx="1.5" />
	<path class="vx-crate-line" d="M {-w / 2} {-h * 0.55} L {w / 2} {-h * 0.55}" />
	<path class="vx-lash" d="M {-w * 0.24} 0 L {-w * 0.24} {-h} M {w * 0.24} 0 L {w * 0.24} {-h}" />
	<path class="vx-lash" d="M {-w / 2} {-h * 0.16} L {w / 2} {-h * 0.9}" />
{/snippet}

<!-- a lily pad lying on the water (squashed notched disc), r = radius -->
{#snippet pad(r: number, rot: number)}
	<g transform="scale(1 0.42) rotate({rot})">
		<path class="vx-pad" d="M0 0L{r * 0.96} {-r * 0.39}A{r} {r} 0 1 0 {r * 0.96} {r * 0.39}Z" />
		<path
			class="vx-pad-vein"
			d="M 0 0 L {-r * 0.7} {-r * 0.55} M 0 0 L {-r * 0.85} {r * 0.2} M 0 0 L {-r * 0.3} {r * 0.8}"
		/>
	</g>
{/snippet}

<!-- a lotus bloom standing on the pad, base at (0,0) -->
{#snippet lotus(s: number)}
	<g transform="scale({s})">
		<path class="vx-petal p-side" d="M 0 0 C -9 -3 -13 -12 -10 -20 C -4 -16 -1 -9 0 0 Z" />
		<path class="vx-petal p-side" d="M 0 0 C 9 -3 13 -12 10 -20 C 4 -16 1 -9 0 0 Z" />
		<path class="vx-petal" d="M 0 0 C -6 -8 -6 -18 0 -24 C 6 -18 6 -8 0 0 Z" />
		<circle class="vx-lotus-core" cy="-7" r="2.4" />
	</g>
{/snippet}

<!-- the dragonfly (tombo), perched: body along +x, wings crossed -->
{#snippet tombo()}
	<path class="vx-tombo-wing" d="M 0 -1 L -9 -6 M 0 -1 L -8 3 M 2 -1 L 11 -6 M 2 -1 L 10 3" />
	<path class="vx-tombo-body" d="M -1 0 L 9 1.5" />
	<circle class="vx-tombo-eye" cx="-2" cy="-0.4" r="1.2" />
{/snippet}

<g class="vessel vessel--{slug}" aria-hidden="true">
	{#if slug === 'siga'}
		<!-- the stern mast: yard with the sail furled, signal pennants flying -->
		<path class="vx-pole" d="M -76 -12 L -71 -84" />
		<path class="vx-yard" d="M -89 -52 L -55 -58" />
		<path
			class="vx-sail"
			d="M -87 -51 C -80 -44 -63 -45 -57 -56 C -62 -49 -68 -47 -73 -47 C -79 -47 -84 -48 -87 -51 Z"
		/>
		<path class="vx-sail-tie" d="M -80 -49 L -79 -44 M -71 -47 L -70 -42 M -63 -50 L -62 -45" />
		<g class="pn-sway" style="--kdur:4.6s">
			<path class="vx-pennant" d="M -71 -82 L -46 -77 L -55 -73 L -46 -69 L -71 -72 Z" />
		</g>
		<!-- cargo: the two roles, lashed and tied together -->
		<g transform="translate(28 -8)">{@render crate(46, 30)}</g>
		<g transform="translate(-26 -8)">{@render crate(38, 24)}</g>
		<path class="vx-mizu" d="M -46 -18 C -22 -30 26 -32 52 -22" />
		<path class="vx-mizu mz2" d="M -46 -15 C -22 -27 26 -29 52 -19" />
		<circle class="vx-mizu-knot" cx="2" cy="-27.5" r="2.6" />
		<!-- hull -->
		<path
			class="vx-hull"
			d="M -92 -16 C -78 4 -40 11 4 11 C 46 11 76 4 94 -23 C 76 -8 46 -3 4 -3 C -40 -3 -72 -6 -92 -16 Z"
		/>
		<path class="vx-plank" d="M -82 -10 C -50 -1 40 2 80 -9" />
		<path class="vx-sheer" d="M -84 -13 C -60 -6 -36 -4 4 -4 C 44 -4 70 -8 88 -20" />
		<path class="vx-stem" d="M 94 -23 C 90 -15 85 -10 78 -7" />
		{#if name}<text class="vx-name" x="4" y="7">{name}</text>{/if}
		<!-- the lit lamp at the bow -->
		<path class="vx-pole" d="M 80 -8 L 92 -30" />
		<g transform="translate(94 -26)">
			<circle class="vx-chochin-glow" r="12" />
			<ellipse class="vx-chochin" rx="5.2" ry="6.4" />
			<rect class="vx-chochin-cap" x="-2.6" y="-8.4" width="5.2" height="2.2" rx="0.8" />
		</g>
	{:else if slug === 'hslu'}
		<!-- the stake sign -->
		<path class="vx-stake" d="M -58 6 L -56 -34" />
		<path class="vx-stake" style="stroke-width:1.7" d="M -58 -8 L -70 -30" />
		<rect class="vx-sign" x="-78" y="-48.8" width="44" height="16.5" rx="2" />
		<circle class="vx-nail" cx="-74" cy="-40.5" r="0.9" />
		<circle class="vx-nail" cx="-38" cy="-40.5" r="0.9" />
		{#if name}<text class="vx-name vx-name--sign" x="-56" y="-37">{name}</text>{/if}
		<!-- two pads in bloom: MA (big) + BSc -->
		<g transform="translate(-14 0)">
			{@render pad(46, 24)}
			<g transform="translate(-4 -2)">{@render lotus(1)}</g>
			<g transform="translate(-2 -27) rotate(-18)">{@render tombo()}</g>
		</g>
		<g transform="translate(44 4)">
			{@render pad(31, 150)}
			<g transform="translate(2 -1)">{@render lotus(0.62)}</g>
		</g>
		<path class="vx-cord" d="M 12 2 Q 22 7 32 3" />
	{:else if slug === 'neptun'}
		<path
			class="vx-hull vx-hull--neptun"
			d="M -52 -12 C -42 3 -18 8 4 8 C 26 8 44 3 54 -14 C 42 -5 26 -2 4 -2 C -18 -2 -38 -4 -52 -12 Z"
		/>
		<path class="vx-plank" d="M -44 -8 C -20 -1 24 0 46 -7" />
		<path
			class="vx-sheer"
			style="stroke:#8fa9ba"
			d="M -47 -10 C -34 -4 -16 -3 4 -3 C 24 -3 38 -6 49 -12"
		/>
		<!-- the trident boat-hook, shipped across the gunwale -->
		<path class="vx-pole" d="M -38 -4 L 34 -30" />
		<path class="vx-trident" d="M 34 -30 L 42 -33 M 36 -35 L 42 -33 M 34 -27 L 42 -33" />
		{#if name}<text class="vx-name vx-name--small" x="0" y="5">{name}</text>{/if}
	{:else if slug === 'armee'}
		<g transform="translate(8 -32) scale(0.62)"><Crane /></g>
		<path class="vx-hull vx-hull--armee" d="M -46 -15 L -40 8 L 38 8 L 46 -17 L 37 -6 L -37 -6 Z" />
		<path class="vx-plank" d="M -36 1 L 34 1" />
		<path class="vx-sheer" style="stroke:#93936f" d="M -34 -7 L 34 -7" />
		<rect class="vx-pack" x="-30" y="-13" width="16" height="7" rx="2.5" />
		{#if name}<text class="vx-name vx-name--small" x="0" y="4">{name}</text>{/if}
	{:else if slug === 'emvs'}
		<path
			class="vx-hull vx-hull--emvs"
			d="M -58 -13 C -48 3 -22 9 2 9 C 24 9 42 3 52 -15 C 42 -6 24 -2 2 -2 C -22 -2 -44 -5 -58 -13 Z"
		/>
		<rect class="vx-patch" x="-30" y="-1" width="14" height="7" rx="1" />
		<path class="vx-plank" d="M -48 -8 C -24 -1 22 0 44 -8" />
		<path
			class="vx-sheer"
			style="stroke:#a08d75"
			d="M -53 -11 C -38 -5 -20 -3 2 -3 C 22 -3 38 -6 47 -13"
		/>
		<!-- the shipped oar -->
		<path class="vx-pole" d="M -44 -16 L 30 -4" />
		<path class="vx-oar" d="M -44 -16 C -52 -18 -56 -16 -58 -12 C -54 -10 -49 -11 -44 -16 Z" />
		{#if name}<text class="vx-name vx-name--small" x="0" y="5">{name}</text>{/if}
	{:else if slug === 'schule'}
		<!-- the school years: two young pads under their own stake sign -->
		<path class="vx-stake" d="M -48 6 L -46 -30" />
		<path class="vx-stake" style="stroke-width:1.7" d="M -48 -6 L -60 -26" />
		<rect class="vx-sign" x="-75" y="-44.8" width="58" height="16.5" rx="2" />
		<circle class="vx-nail" cx="-71" cy="-36.5" r="0.9" />
		<circle class="vx-nail" cx="-21" cy="-36.5" r="0.9" />
		{#if name}<text class="vx-name vx-name--sign" x="-46" y="-33">{name}</text>{/if}
		<g transform="translate(-8 0)">
			{@render pad(30, 32)}
			<g transform="translate(-2 -1)">{@render lotus(0.62)}</g>
		</g>
		<g transform="translate(40 4)">
			{@render pad(22, 170)}
			<g transform="translate(1 -1)">{@render lotus(0.46)}</g>
		</g>
		<path class="vx-cord" d="M 14 2 Q 22 6 30 3" />
	{/if}

	{#if reflect}
		<!-- the woodblock reflection: three broken dashes, nothing masked -->
		<g class="vx-reflect">
			<path d="M {-rw} 7 L {rw * 0.72} 7" style="stroke-width:3.4" />
			<path d="M {-rw * 0.6} 13 L {rw * 0.5} 13" style="stroke-width:2.6" />
			<path d="M {-rw * 0.3} 19 L {rw * 0.26} 19" style="stroke-width:2" />
		</g>
	{/if}
</g>

<style>
	.vx-hull {
		fill: #6a4c37;
		stroke: #382718;
		stroke-width: 1.1;
		stroke-linejoin: round;
	}
	.vx-hull--neptun {
		fill: #587082;
		stroke: #2f4250;
	}
	.vx-hull--armee {
		fill: #6f6f52;
		stroke: #3d3d2b;
	}
	.vx-hull--emvs {
		fill: #7a6a58;
		stroke: #453a2e;
	}
	.vx-patch {
		fill: #93826d;
		stroke: #453a2e;
		stroke-width: 0.8;
	}
	.vx-plank {
		fill: none;
		stroke: rgba(30, 20, 12, 0.4);
		stroke-width: 1;
	}
	.vx-stem {
		fill: none;
		stroke: #382718;
		stroke-width: 1.3;
		stroke-linecap: round;
		opacity: 0.7;
	}
	.vx-pole {
		fill: none;
		stroke: #4a3524;
		stroke-width: 2;
		stroke-linecap: round;
	}
	.vx-oar {
		fill: #8a6a4d;
		stroke: #4a3524;
		stroke-width: 0.9;
	}
	.vx-trident {
		fill: none;
		stroke: #37535f;
		stroke-width: 1.8;
		stroke-linecap: round;
	}
	.vx-crate {
		fill: #a8865f;
		stroke: #5c4527;
		stroke-width: 1;
	}
	.vx-crate-line {
		fill: none;
		stroke: #5c4527;
		stroke-width: 0.8;
		opacity: 0.6;
	}
	.vx-lash {
		fill: none;
		stroke: #6d5334;
		stroke-width: 1.1;
		opacity: 0.85;
	}
	.vx-mizu,
	.vx-mizu.mz2 {
		fill: none;
		stroke: #c43f2a;
		stroke-width: 1.7;
		stroke-linecap: round;
	}
	.vx-mizu.mz2 {
		stroke: #93291a;
		stroke-width: 1.2;
	}
	.vx-mizu-knot {
		fill: #c43f2a;
	}
	.vx-pack {
		fill: #5d5d44;
		stroke: #3d3d2b;
		stroke-width: 0.8;
	}
	.vx-name {
		fill: #f3e8d2;
		font:
			600 14px var(--font-display, Georgia),
			serif;
		letter-spacing: 0.08em;
		text-anchor: middle;
		paint-order: stroke;
		stroke: rgba(40, 24, 12, 0.5);
		stroke-width: 2;
	}
	.vx-name--small {
		font-size: 12px;
	}
	.vx-name--sign {
		fill: #2c241b;
		stroke: none;
		font-size: 11.2px;
		letter-spacing: 0.08em;
	}
	.vx-stake {
		fill: none;
		stroke: #6d5334;
		stroke-width: 2.6;
		stroke-linecap: round;
	}
	.vx-sign {
		fill: #efe5cc;
		stroke: #6d5334;
		stroke-width: 1;
	}
	.vx-pad {
		fill: #4f8d76;
		fill-opacity: 0.94;
		stroke: #35664f;
		stroke-width: 1.4;
		stroke-opacity: 0.6;
	}
	.vx-pad-vein {
		fill: none;
		stroke: #cfe8d9;
		stroke-width: 1.2;
		opacity: 0.4;
	}
	.vx-petal {
		fill: #e7a8ba;
		stroke: #c97a92;
		stroke-width: 0.7;
		stroke-opacity: 0.6;
	}
	.vx-petal.p-side {
		fill: #f2c1cd;
	}
	.vx-lotus-core {
		fill: #edcd7f;
	}
	.vx-tombo-wing {
		fill: none;
		stroke: rgba(90, 130, 150, 0.75);
		stroke-width: 1;
		stroke-linecap: round;
	}
	.vx-tombo-body {
		fill: none;
		stroke: #b5533c;
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.vx-tombo-eye {
		fill: #2c3a44;
	}
	.vx-cord {
		fill: none;
		stroke: #6b5a3f;
		stroke-width: 1.3;
		stroke-linecap: round;
		opacity: 0.9;
	}
	.vx-yard {
		fill: none;
		stroke: #4a3524;
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.vx-sail {
		fill: #e8d6ab;
		stroke: #a8895c;
		stroke-width: 0.9;
	}
	.vx-sail-tie {
		fill: none;
		stroke: #8a6a42;
		stroke-width: 1;
		opacity: 0.9;
	}
	.vx-pennant {
		fill: #c2543f;
		stroke: #93392a;
		stroke-width: 0.8;
		stroke-linejoin: round;
	}
	.vx-sheer {
		fill: none;
		stroke: #b08a5e;
		stroke-width: 1.1;
		stroke-linecap: round;
		opacity: 0.75;
	}
	.vx-nail {
		fill: #8a7358;
	}
	.vx-chochin {
		fill: #f6dfae;
		stroke: #b98a4a;
		stroke-width: 1;
	}
	.vx-chochin-cap {
		fill: #5c4527;
	}
	.vx-chochin-glow {
		fill: #ffd98c;
		opacity: 0.28;
	}
	.vx-reflect path {
		fill: none;
		stroke: rgba(24, 60, 74, 0.3);
		stroke-linecap: round;
	}

	/* the pennants stir; the water rocks nothing else here — vessels bob via
	   the scene so hero + pond can pace themselves */
	@media (prefers-reduced-motion: no-preference) {
		.pn-sway {
			animation: vx-sway var(--kdur, 4s) ease-in-out var(--kd, 0s) infinite alternate;
		}
	}
	@keyframes vx-sway {
		from {
			transform: skewX(-1.4deg);
		}
		to {
			transform: skewX(1.6deg);
		}
	}
</style>
