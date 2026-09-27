<script lang="ts">
	/** THE ZOOM — you didn't open a page, you stepped aboard. A fixed
	 *  full-viewport backdrop turns each /cv/<slug> into the craft itself,
	 *  seen from above at deck height: boats become their own planking
	 *  (gunwales at the edges, pond water beyond them, the vessel's gear
	 *  lying about, the mooring line you arrived on cleated at the top),
	 *  the education crafts become the lily pad's surface floating in the
	 *  pond. The hull name is painted faintly across the deck. Content
	 *  scrolls over it like papers spread on the planks. One gentle
	 *  landing zoom on entry; reduced motion arrives already ashore. */
	import Koi from '$lib/water/Koi.svelte';
	import Seigaiha from '$lib/water/Seigaiha.svelte';
	import Crane from '$lib/water/pond/Crane.svelte';

	let { slug, name }: { slug: string; name: string } = $props();

	const BOAT_PAL: Record<string, { a: string; b: string; seam: string; rail: string }> = {
		siga: { a: '#6f4f38', b: '#654731', seam: '#3a2718', rail: '#46311f' },
		neptun: { a: '#5f7686', b: '#566d7d', seam: '#33434e', rail: '#3d5260' },
		armee: { a: '#73734f', b: '#6a6a48', seam: '#42422c', rail: '#4c4c33' },
		emvs: { a: '#7d6c56', b: '#73634f', seam: '#463a2c', rail: '#52452f' }
	};
	const pal = $derived(BOAT_PAL[slug]);
	const world: 'boat' | 'pad' = $derived(pal ? 'boat' : 'pad');
	// ten planks between the gunwales
	const PLANKS = Array.from({ length: 10 }, (_, i) => 176 + i * 84.8);
	const nameSize = $derived(name.length <= 4 ? 230 : name.length <= 6 ? 170 : 120);
</script>

{#snippet coil(s: number)}
	<g class="ab-coil" transform="scale({s})">
		<ellipse rx="46" ry="30" />
		<ellipse rx="30" ry="19" />
		<ellipse rx="15" ry="9" />
		<path class="ab-coil-end" d="M 40 -12 Q 60 -22 64 -40" />
	</g>
{/snippet}

{#snippet crateTop(w: number, h: number)}
	<rect class="ab-crate" x={-w / 2} y={-h / 2} width={w} height={h} rx="6" />
	<path
		class="ab-crate-seam"
		d="M {-w / 2 + 10} {-h / 6} H {w / 2 - 10} M {-w / 2 + 10} {h / 6} H {w / 2 - 10}"
	/>
	<path class="ab-cord" d="M 0 {-h / 2 - 4} V {h / 2 + 4} M {-w / 2 - 4} 0 H {w / 2 + 4}" />
	<circle class="ab-cord-knot" r="7" />
{/snippet}

{#snippet dew(s: number)}
	<g transform="scale({s})">
		<ellipse class="ab-dew" rx="16" ry="11" />
		<ellipse class="ab-dew-hi" cx="-4" cy="-3" rx="5" ry="3.2" />
	</g>
{/snippet}

{#snippet lotusTop(s: number)}
	<g transform="scale({s})">
		{#each [0, 60, 120, 180, 240, 300] as a (a)}
			<path
				class="ab-petal"
				transform="rotate({a})"
				d="M 0 0 C -14 -16 -14 -38 0 -52 C 14 -38 14 -16 0 0 Z"
			/>
		{/each}
		{#each [30, 90, 150, 210, 270, 330] as a (a)}
			<path
				class="ab-petal ab-petal--in"
				transform="rotate({a})"
				d="M 0 0 C -10 -12 -10 -28 0 -38 C 10 -28 10 -12 0 0 Z"
			/>
		{/each}
		<circle class="ab-lotus-core" r="10" />
	</g>
{/snippet}

{#snippet stakeSign(label: string, tilt: number)}
	<g transform="rotate({tilt})">
		<path class="ab-stake" d="M 0 46 L 2 -18" />
		<rect class="ab-sign" x="-52" y="-46" width="104" height="30" rx="4" />
		<text class="ab-sign-text" y="-25">{label}</text>
		<circle class="ab-nail" cx="-44" cy="-31" r="1.8" />
		<circle class="ab-nail" cx="44" cy="-31" r="1.8" />
	</g>
{/snippet}

<div class="aboard aboard--{world}" aria-hidden="true">
	<svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
		<defs>
			<linearGradient id="ab-water" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="#b9e0ea" />
				<stop offset="1" stop-color="#8ccadb" />
			</linearGradient>
			<radialGradient id="ab-dawn" cx="0.5" cy="0" r="1">
				<stop offset="0" stop-color="#f4efe2" stop-opacity="0.34" />
				<stop offset="0.55" stop-color="#f4efe2" stop-opacity="0.1" />
				<stop offset="1" stop-color="#f4efe2" stop-opacity="0" />
			</radialGradient>
			<Seigaiha pid="ab-sg" />
		</defs>

		<g class="ab-cam">
			{#if world === 'boat'}
				<!-- pond water past the gunwales -->
				<rect width="1200" height="800" fill="url(#ab-water)" />
				<rect class="ab-sgp" x="-40" y="60" width="200" height="34" rx="12" fill="url(#ab-sg)" />
				<rect class="ab-sgp" x="1060" y="560" width="190" height="30" rx="12" fill="url(#ab-sg)" />
				<g class="ab-wv">
					<path d="M 52 240 Q 62 232 72 240 Q 82 232 92 240" />
					<path d="M 66 620 Q 75 613 84 620 Q 93 613 102 620" />
					<path d="M 1102 180 Q 1111 173 1120 180 Q 1129 173 1138 180" />
					<path d="M 1090 700 Q 1099 693 1108 700 Q 1117 693 1126 700" />
				</g>
				<g transform="translate(1122 330) rotate(-14)">
					<ellipse class="ab-ripple" cx="-2" cy="9" rx="46" ry="9" />
					<Koi
						robe={slug === 'neptun' ? 'hi' : 'kohaku'}
						scale={0.5}
						motion="tail"
						shadow={false}
						wag={2.4}
					/>
				</g>

				<!-- the hull: gunwales and planking -->
				<rect x="150" y="0" width="900" height="800" fill={pal.b} />
				{#each PLANKS as px, i (px)}
					<rect x={px} y="0" width="84.8" height="800" fill={i % 2 ? pal.a : pal.b} />
					<path class="ab-seam" d="M {px} 0 V 800" style="stroke:{pal.seam}" />
					<circle class="ab-nail" cx={px + 42} cy={90 + ((i * 173) % 620)} r="2.6" />
					<circle class="ab-nail" cx={px + 42} cy={130 + ((i * 271) % 580)} r="2.6" />
				{/each}
				<path class="ab-seam" d="M 1026 0 V 800" style="stroke:{pal.seam}" />
				<path
					class="ab-grain"
					d="M 220 160 C 260 240 240 380 268 470 M 700 90 C 736 210 716 330 748 450 M 470 420 C 500 520 486 640 512 740"
				/>
				<ellipse class="ab-knot2" cx="386" cy="560" rx="9" ry="14" />
				<ellipse class="ab-knot2" cx="812" cy="238" rx="8" ry="12" />
				<rect class="ab-rail" x="150" y="0" width="30" height="800" style="fill:{pal.rail}" />
				<rect class="ab-rail" x="1020" y="0" width="30" height="800" style="fill:{pal.rail}" />
				<path class="ab-foam" d="M 143 0 V 800" />
				<path class="ab-foam" d="M 1057 0 V 800" />

				<!-- the line you arrived on, cleated -->
				<path class="ab-rope" d="M 588 0 C 596 34 590 62 600 92" />
				<g transform="translate(600 104)">
					<rect class="ab-cl-base" x="-24" y="4" width="48" height="10" rx="3" />
					<path class="ab-cl-horn" d="M -30 0 C -39 -1 -42 -9 -36 -12 L -12 -12 L -12 0 Z" />
					<path class="ab-cl-horn" d="M 30 0 C 39 -1 42 -9 36 -12 L 12 -12 L 12 0 Z" />
					<rect class="ab-cl-post" x="-12" y="-13" width="24" height="18" rx="3" />
				</g>

				<!-- painted hull name, worn into the deck -->
				<text class="ab-name" x="600" y="520" style="font-size:{nameSize}px">{name}</text>

				<!-- the craft's own gear -->
				{#if slug === 'siga'}
					<g transform="translate(242 142) rotate(-5)">{@render crateTop(170, 124)}</g>
					<g transform="translate(836 620) rotate(4)">{@render crateTop(132, 102)}</g>
					<g transform="translate(276 664)">{@render coil(1)}</g>
					<g transform="translate(892 140)">
						<circle class="ab-lamp-glow" r="34" />
						<circle class="ab-lamp" r="15" />
						<circle class="ab-lamp-flame" r="5" />
					</g>
				{:else if slug === 'neptun'}
					<g transform="translate(0 0)">
						<path class="ab-shaft" d="M 360 130 L 880 380" />
						<path
							class="ab-tines"
							d="M 880 380 L 948 396 M 892 356 L 952 372 M 868 404 L 944 422"
						/>
						<circle class="ab-butt" cx="360" cy="130" r="7" />
					</g>
					<g transform="translate(320 640)">{@render coil(0.9)}</g>
					<g transform="translate(262 402)">
						<circle class="ab-bucket" r="34" />
						<circle class="ab-bucket-in" r="24" />
						<path class="ab-bucket-handle" d="M -32 -10 Q 0 -46 32 -10" />
					</g>
				{:else if slug === 'armee'}
					<g transform="translate(830 200) rotate(-7) scale(2.1)"><Crane /></g>
					<g transform="translate(330 630) rotate(3)">
						<rect class="ab-blanket" x="-78" y="-52" width="156" height="104" rx="10" />
						<path class="ab-blanket-fold" d="M -78 -18 H 78 M -78 16 H 78" />
					</g>
					<g transform="translate(300 150)">
						<rect class="ab-pack" x="-46" y="-32" width="92" height="64" rx="9" />
						<path class="ab-pack-strap" d="M -18 -32 V 32 M 18 -32 V 32" />
					</g>
				{:else if slug === 'emvs'}
					<g transform="translate(0 0) rotate(2 246 400)">
						<path class="ab-shaft" d="M 246 150 L 258 690" />
						<ellipse class="ab-blade" cx="243" cy="112" rx="26" ry="52" />
					</g>
					<g transform="translate(788 300) rotate(-3)">
						<rect class="ab-patch" x="-64" y="-46" width="128" height="92" rx="7" />
						<path
							class="ab-patch-stitch"
							d="M -55 -37 H 55 M -55 37 H 55 M -55 -37 V 37 M 55 -37 V 37"
						/>
						{#each [[-42, -22], [0, -26], [40, -20], [-38, 24], [4, 28], [42, 22]] as [rx, ry], i (i)}
							<circle class="ab-rivet" cx={rx} cy={ry} r="3.4" />
						{/each}
					</g>
					<g transform="translate(858 648)">{@render coil(0.82)}</g>
					<path
						class="ab-wear"
						d="M 420 120 C 442 260 430 400 452 540 M 660 240 C 680 380 670 520 690 660"
					/>
				{/if}
			{:else}
				<!-- the pond, and the pad you stand on -->
				<rect width="1200" height="800" fill="url(#ab-water)" />
				<rect class="ab-sgp" x="30" y="60" width="300" height="36" rx="13" fill="url(#ab-sg)" />
				<rect class="ab-sgp" x="880" y="680" width="290" height="34" rx="13" fill="url(#ab-sg)" />
				<g class="ab-wv">
					<path d="M 130 200 Q 140 192 150 200 Q 160 192 170 200" />
					<path d="M 1060 160 Q 1069 153 1078 160 Q 1087 153 1096 160" />
					<path d="M 1090 560 Q 1099 553 1108 560 Q 1117 553 1126 560" />
					<path d="M 90 660 Q 99 653 108 660 Q 117 653 126 660" />
				</g>
				<ellipse class="ab-ring" cx="1050" cy="260" rx="46" ry="14" />
				<ellipse class="ab-ring" cx="140" cy="600" rx="38" ry="12" />

				<!-- the great pad -->
				<g transform="translate(600 470) scale(1 0.82)">
					<g transform="rotate(18)">
						<path class="ab-pad" d="M0 0L537.6 -218.4A560 560 0 1 0 537.6 218.4Z" />
					</g>
					{#each [-150, -100, -55, -12, 30, 75, 125, 165] as a (a)}
						<path
							class="ab-vein"
							d="M 0 0 L {520 * Math.cos((a * Math.PI) / 180)} {520 *
								Math.sin((a * Math.PI) / 180)}"
						/>
					{/each}
					<circle class="ab-pad-eye" r="16" />
				</g>
				<path class="ab-pad-rim" d="M 140 640 A 505 420 0 0 1 240 220" />

				{#if slug === 'hslu'}
					<g transform="translate(918 262)">{@render lotusTop(1.9)}</g>
					<g transform="translate(346 208) rotate(-16)">
						<path
							class="ab-tombo-wing"
							d="M 0 -2 L -26 -16 M 0 -2 L -23 8 M 5 -2 L 31 -16 M 5 -2 L 28 8"
						/>
						<path class="ab-tombo-body" d="M -3 0 L 25 4" />
						<circle class="ab-tombo-eye" cx="-6" cy="-1" r="3.4" />
					</g>
					<g transform="translate(112 560)">{@render stakeSign('HSLU', -7)}</g>
					<g transform="translate(760 620)">{@render dew(1.2)}</g>
					<g transform="translate(420 660)">{@render dew(0.9)}</g>
					<g transform="translate(736 170)">{@render dew(0.8)}</g>
				{:else}
					<!-- schule: the young pad alongside, both in bloom -->
					<g transform="translate(268 688) scale(1 0.8)">
						<g transform="rotate(-24)">
							<path class="ab-pad ab-pad--young" d="M0 0L216 -87.8A225 225 0 1 0 216 87.8Z" />
						</g>
						{#each [-120, -60, 0, 60, 130] as a (a)}
							<path
								class="ab-vein"
								d="M 0 0 L {200 * Math.cos((a * Math.PI) / 180)} {200 *
									Math.sin((a * Math.PI) / 180)}"
							/>
						{/each}
					</g>
					<g transform="translate(902 296)">{@render lotusTop(1.35)}</g>
					<g transform="translate(268 664)">{@render lotusTop(0.95)}</g>
					<g transform="translate(1010 540)">{@render stakeSign('EFZ · BM', 6)}</g>
					<g transform="translate(760 180)">{@render dew(0.85)}</g>
					<g transform="translate(700 640)">{@render dew(1.05)}</g>
				{/if}

				<text class="ab-name ab-name--pad" x="600" y="500" style="font-size:{nameSize}px"
					>{name}</text
				>
			{/if}

			<!-- the same morning light as the pond -->
			<rect width="1200" height="800" fill="url(#ab-dawn)" />
		</g>
	</svg>
</div>

<style>
	.aboard {
		position: absolute;
		top: 0;
		left: 50%;
		translate: -50% 0;
		width: 100vw;
		/* at least the viewport above the jetty; at most the whole article */
		height: max(100%, calc(100svh - 156px));
		z-index: -1;
		pointer-events: none;
	}
	.aboard svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	/* ---- shared water ---- */
	.ab-sgp {
		opacity: 0.5;
	}
	.ab-wv path {
		fill: none;
		stroke: #eefafd;
		stroke-width: 2;
		stroke-linecap: round;
		opacity: 0.6;
	}
	.ab-ripple {
		fill: none;
		stroke: rgba(255, 255, 255, 0.65);
		stroke-width: 1.6;
	}
	.ab-ring {
		fill: none;
		stroke: rgba(255, 255, 255, 0.55);
		stroke-width: 1.5;
	}

	/* ---- deck ---- */
	.ab-seam {
		fill: none;
		stroke-width: 2.6;
		opacity: 0.85;
	}
	.ab-grain {
		fill: none;
		stroke: rgba(24, 14, 6, 0.14);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.ab-knot2 {
		fill: rgba(24, 14, 6, 0.3);
	}
	.ab-rail {
		stroke: rgba(16, 9, 4, 0.55);
		stroke-width: 1.5;
	}
	.ab-foam {
		fill: none;
		stroke: #eefafd;
		stroke-width: 3;
		stroke-dasharray: 16 12;
		stroke-linecap: round;
		opacity: 0.65;
	}
	.ab-nail {
		fill: rgba(20, 12, 5, 0.45);
	}
	.ab-rope {
		fill: none;
		stroke: #c9a86a;
		stroke-width: 7;
		stroke-linecap: round;
	}
	.ab-cl-base {
		fill: #2f3a42;
	}
	.ab-cl-horn,
	.ab-cl-post {
		fill: #46545e;
		stroke: #232c33;
		stroke-width: 1.4;
	}

	.ab-name {
		fill: rgba(20, 11, 4, 0.1);
		font-family: var(--font-display, Georgia);
		font-weight: 700;
		letter-spacing: 0.06em;
		text-anchor: middle;
	}
	.ab-name--pad {
		fill: rgba(16, 42, 32, 0.12);
	}

	/* ---- gear ---- */
	.ab-crate {
		fill: #a8865f;
		stroke: #5c4527;
		stroke-width: 2.4;
	}
	.ab-crate-seam {
		fill: none;
		stroke: #5c4527;
		stroke-width: 1.6;
		opacity: 0.6;
	}
	.ab-cord {
		fill: none;
		stroke: #c43f2a;
		stroke-width: 4;
		stroke-linecap: round;
	}
	.ab-cord-knot {
		fill: #c43f2a;
	}
	.ab-coil ellipse {
		fill: none;
		stroke: #c9a86a;
		stroke-width: 6;
	}
	.ab-coil-end {
		fill: none;
		stroke: #c9a86a;
		stroke-width: 5;
		stroke-linecap: round;
	}
	.ab-lamp-glow {
		fill: #ffd98c;
		opacity: 0.26;
	}
	.ab-lamp {
		fill: #f6dfae;
		stroke: #b98a4a;
		stroke-width: 2;
	}
	.ab-lamp-flame {
		fill: #f2b04a;
	}
	.ab-shaft {
		fill: none;
		stroke: #4a3524;
		stroke-width: 9;
		stroke-linecap: round;
	}
	.ab-tines {
		fill: none;
		stroke: #37535f;
		stroke-width: 7;
		stroke-linecap: round;
	}
	.ab-butt {
		fill: #37535f;
	}
	.ab-bucket {
		fill: #8a6a4d;
		stroke: #4a3524;
		stroke-width: 2.4;
	}
	.ab-bucket-in {
		fill: #6a4c37;
		stroke: #3a2718;
		stroke-width: 1.6;
	}
	.ab-bucket-handle {
		fill: none;
		stroke: #4a3524;
		stroke-width: 3.5;
		stroke-linecap: round;
	}
	.ab-blanket {
		fill: #5d5d44;
		stroke: #3d3d2b;
		stroke-width: 2;
	}
	.ab-blanket-fold {
		fill: none;
		stroke: #3d3d2b;
		stroke-width: 1.6;
		opacity: 0.7;
	}
	.ab-pack {
		fill: #6f6f52;
		stroke: #3d3d2b;
		stroke-width: 2;
	}
	.ab-pack-strap {
		fill: none;
		stroke: #3d3d2b;
		stroke-width: 3;
		opacity: 0.8;
	}
	.ab-blade {
		fill: #8a6a4d;
		stroke: #4a3524;
		stroke-width: 2.4;
	}
	.ab-patch {
		fill: #93826d;
		stroke: #453a2e;
		stroke-width: 2.2;
	}
	.ab-patch-stitch {
		fill: none;
		stroke: #453a2e;
		stroke-width: 1.4;
		stroke-dasharray: 7 5;
		opacity: 0.8;
	}
	.ab-rivet {
		fill: #453a2e;
	}
	.ab-wear {
		fill: none;
		stroke: rgba(24, 14, 6, 0.16);
		stroke-width: 10;
		stroke-linecap: round;
	}

	/* ---- pad ---- */
	.ab-pad {
		fill: #4f8d76;
		stroke: #35664f;
		stroke-width: 4;
		stroke-opacity: 0.65;
	}
	.ab-pad--young {
		fill: #58967e;
	}
	.ab-vein {
		fill: none;
		stroke: #cfe8d9;
		stroke-width: 2.6;
		opacity: 0.3;
	}
	.ab-pad-eye {
		fill: #35664f;
		opacity: 0.5;
	}
	.ab-pad-rim {
		fill: none;
		stroke: #dff0e6;
		stroke-width: 3;
		opacity: 0.35;
		stroke-linecap: round;
	}
	.ab-dew {
		fill: rgba(223, 244, 250, 0.5);
		stroke: rgba(255, 255, 255, 0.75);
		stroke-width: 1.6;
	}
	.ab-dew-hi {
		fill: rgba(255, 255, 255, 0.85);
	}
	.ab-petal {
		fill: #e7a8ba;
		stroke: #c97a92;
		stroke-width: 1.4;
		stroke-opacity: 0.6;
	}
	.ab-petal--in {
		fill: #f2c1cd;
	}
	.ab-lotus-core {
		fill: #edcd7f;
	}
	.ab-tombo-wing {
		fill: none;
		stroke: rgba(90, 130, 150, 0.75);
		stroke-width: 2.6;
		stroke-linecap: round;
	}
	.ab-tombo-body {
		fill: none;
		stroke: #b5533c;
		stroke-width: 4.4;
		stroke-linecap: round;
	}
	.ab-tombo-eye {
		fill: #2c3a44;
	}
	.ab-stake {
		fill: none;
		stroke: #6d5334;
		stroke-width: 6;
		stroke-linecap: round;
	}
	.ab-sign {
		fill: #efe5cc;
		stroke: #6d5334;
		stroke-width: 2.2;
	}
	.ab-sign-text {
		fill: #2c241b;
		font:
			600 19px var(--font-display, Georgia),
			serif;
		letter-spacing: 0.06em;
		text-anchor: middle;
	}

	/* ---- the landing ---- */
	@media (prefers-reduced-motion: no-preference) {
		.ab-cam {
			transform-box: view-box;
			transform-origin: 50% 42%;
			animation: ab-land 1100ms cubic-bezier(0.22, 0.75, 0.25, 1) both;
		}
	}
	@keyframes ab-land {
		from {
			transform: scale(1.16);
		}
		to {
			transform: scale(1);
		}
	}
</style>
