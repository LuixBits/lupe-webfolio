<script lang="ts">
  /*
   * Rolling-meadow footer strip (garden theme).
   *
   * Architecture: the hills are a horizontally-stretched SVG (preserveAspectRatio
   * "none") so the landscape always fills the full width with no horizontal crop.
   * The flora (flower clusters, grass tufts, butterfly, sun) are small fixed-size
   * SVGs positioned with CSS percentages, so they never distort and are never
   * sliced at the strip edges — their stems sink into the dark near hill, which
   * shares the bar's --hub-bg so the strip merges seamlessly into the footer bar.
   * Everything is hand-placed and deterministic; animation is pure CSS.
   */

  const TAU = Math.PI * 2;

  /* dandelion-clock spokes */
  const SPOKES = Array.from({ length: 12 }, (_, k) => ({
    x: +(Math.cos((k / 12) * TAU) * 10).toFixed(1),
    y: +(Math.sin((k / 12) * TAU) * 10).toFixed(1)
  }));

  const P8 = [0, 1, 2, 3, 4, 5, 6, 7];

  /* grass blade: quadratic curve from the base, tip rounded by the linecap */
  const blade = (x: number, base: number, lean: number, h: number) =>
    `M ${x} ${base} Q ${+(x + lean * 0.35).toFixed(1)} ${+(base - h * 0.6).toFixed(1)} ${x + lean} ${base - h}`;

  /* hill silhouettes (viewBox 1200x156; the bar covers y >= 92) */
  const FAR_CREST =
    'M 0 52 C 80 44 150 40 260 44 C 380 48 430 56 560 52 C 660 48 720 38 840 40 C 960 42 1060 52 1200 46';
  const MID_CREST =
    'M 0 66 C 100 60 170 56 290 60 C 400 64 480 72 610 68 C 730 64 800 56 930 58 C 1040 60 1120 66 1200 62';
  const NEAR_CREST =
    'M 0 80 C 90 74 170 68 300 72 C 430 76 490 84 620 80 C 740 76 810 68 930 70 C 1040 72 1120 80 1200 76';
  const close = (crest: string) => `${crest} L 1200 156 L 0 156 Z`;

  /* small grass tufts along the near-hill crest (left %, bottom px) */
  const TUFTS = [
    { l: 5, b: 66, d: 5.6, del: -1.2, sc: 1, hideSm: false },
    { l: 13, b: 74, d: 6.1, del: -2.7, sc: 0.85, hideSm: true },
    { l: 22, b: 72, d: 6.4, del: -3.1, sc: 0.9, hideSm: false },
    { l: 40, b: 66, d: 5.2, del: -0.6, sc: 1.1, hideSm: true },
    { l: 47, b: 64, d: 6.6, del: -1.9, sc: 0.9, hideSm: true },
    { l: 59, b: 66, d: 6.9, del: -2.4, sc: 1, hideSm: false },
    { l: 66, b: 74, d: 5.4, del: -3.8, sc: 0.9, hideSm: true },
    { l: 77, b: 72, d: 5.9, del: -4.2, sc: 0.85, hideSm: true },
    { l: 86, b: 72, d: 6.3, del: -0.9, sc: 0.9, hideSm: true },
    { l: 94, b: 67, d: 6.2, del: -1.8, sc: 1, hideSm: false }
  ];

  /* drifting pollen motes (left %, bottom px, size px, duration s, delay s) */
  const MOTES = [
    { l: 16, b: 86, s: 4, d: 12, del: -3 },
    { l: 28, b: 98, s: 3, d: 10, del: -7 },
    { l: 44, b: 80, s: 4, d: 13, del: -1 },
    { l: 62, b: 102, s: 3, d: 11, del: -5 },
    { l: 71, b: 84, s: 3, d: 9.5, del: -8 },
    { l: 88, b: 96, s: 4, d: 12.5, del: -4 }
  ];
</script>

{#snippet leafShape(x: number, y: number, a: number, s: number, flip: boolean)}
  <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s} ${flip ? -s : s})`}>
    <path class="leaf-fill" d="M 0 0 C 6 -6 15 -8 21 -3 C 15 3 6 4 0 0 Z" />
    <path class="leaf-rib" d="M 2 -1 C 8 -3 14 -3.5 19 -2.8" />
  </g>
{/snippet}

{#snippet daisy(x: number, y: number, s: number)}
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {#each P8 as k}
      <ellipse class="petal" cx="0" cy="-6" rx="2.4" ry="6" transform={`rotate(${k * 45})`} />
    {/each}
    <circle class="disc" r="3.1" />
    <circle class="disc-dot" r="1.3" />
  </g>
{/snippet}

{#snippet tulip(x: number, y: number, s: number)}
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      class="tulip"
      d="M 0 2.2 C -7.2 -1.6 -7.8 -12.5 -1.6 -17 L 0 -13.8 L 1.6 -17 C 7.8 -12.5 7.2 -1.6 0 2.2 Z"
    />
    <path class="tulip-rib" d="M -4.6 -3 C -5 -8 -3.6 -12.6 -1.6 -15" />
    <path class="tulip-rib" d="M 4.6 -3 C 5 -8 3.6 -12.6 1.6 -15" />
  </g>
{/snippet}

{#snippet seedhead(x: number, y: number, s: number)}
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {#each SPOKES as p}
      <line class="spoke" x1="0" y1="0" x2={p.x} y2={p.y} />
      <circle class="puff" cx={p.x} cy={p.y} r="2" />
    {/each}
    <circle class="seed-core" r="2.2" />
  </g>
{/snippet}

{#snippet bell(x: number, y: number, a: number)}
  <g transform={`translate(${x} ${y}) rotate(${a})`}>
    <path
      class="bell"
      d="M 0 0 C -3.2 0.5 -4 3.6 -3 6.4 L -1.5 5.5 L 0 6.6 L 1.5 5.5 L 3 6.4 C 4 3.6 3.2 0.5 0 0 Z"
    />
  </g>
{/snippet}

{#snippet wingPair()}
  <path class="wing" d="M -1.2 -4 C -7 -12 -16 -14 -18.5 -8.5 C -20 -4 -14 -0.5 -1.2 -0.5 Z" />
  <path class="wing" d="M -1.2 0.5 C -11 0.5 -16 5 -13.5 10 C -11 13.5 -4 10 -1.2 3.5 Z" />
  <circle class="wing-dot" cx="-12" cy="-7.5" r="1.6" />
  <circle class="wing-dot" cx="-8.5" cy="6" r="1.1" />
{/snippet}

{#snippet tuftShape()}
  <ellipse class="mound" cx="15" cy="40" rx="13" ry="5" />
  <path class="blade-lite" d={blade(7, 40, -4, 20)} />
  <path class="blade-dark" d={blade(14, 40, 4, 30)} />
  <path class="blade-lite" d={blade(22, 40, -4, 23)} />
{/snippet}

<div class="meadow" aria-hidden="true">
  <!-- low sun, behind the hills -->
  <svg class="sun" viewBox="-30 -30 60 60" width="60" height="60">
    <circle class="sun-core" r="13" />
    <circle class="sun-ring" r="20" />
  </svg>

  <!-- rolling hills; stretched to any width, merging into the bar colour -->
  <svg class="hills" viewBox="0 0 1200 156" preserveAspectRatio="none">
    <path class="hill-far" d={close(FAR_CREST)} />
    <path class="hill-mid" d={close(MID_CREST)} />
    <path class="hill-near" d={close(NEAR_CREST)} />
    <path class="crest-rim" d={NEAR_CREST} vector-effect="non-scaling-stroke" />
  </svg>

  <!-- grass tufts rooted on the near-hill crest -->
  {#each TUFTS as t}
    <svg
      class="tuft"
      class:hide-sm={t.hideSm}
      viewBox="0 0 30 40"
      width="30"
      height="40"
      style={`left:${t.l}%; bottom:${t.b}px; --swd:${t.d}s; --swdel:${t.del}s; --tsc:${t.sc};`}
    >
      <g class="flora">{@render tuftShape()}</g>
    </svg>
  {/each}

  <!-- cluster A: tulip & daisies -->
  <svg class="cluster c-a hide-sm" viewBox="0 0 96 70" width="96" height="70" style="left:12%; --swd:6.8s; --swdel:-1.4s; bottom:73px;">
    <ellipse class="mound" cx="48" cy="70" rx="44" ry="8" />
    <g class="flora">
      <path class="blade-lite" d={blade(14, 70, -8, 24)} />
      <path class="blade-dark" d={blade(24, 70, 7, 32)} />
      <path class="blade-dark" d={blade(64, 70, 9, 28)} />
      <path class="blade-lite" d={blade(84, 70, -7, 20)} />
      <path class="stem" d="M 38 70 Q 33 46 34 25" />
      {@render leafShape(36, 56, -160, 0.85, true)}
      {@render leafShape(37, 46, -30, 0.75, false)}
      {@render tulip(34, 25, 1)}
      <path class="stem" d="M 58 70 Q 62 55 61 40" />
      {@render leafShape(60, 55, -20, 0.7, false)}
      {@render daisy(61, 40, 1)}
      <path class="stem" d="M 76 70 Q 79 62 78 54" />
      {@render daisy(78, 54, 0.65)}
    </g>
  </svg>

  <!-- cluster F: lone bellflower amid grass -->
  <svg class="cluster c-f hide-sm" viewBox="0 0 64 56" width="64" height="56" style="left:20%; --swd:6.4s; --swdel:-2.9s; bottom:74px;">
    <ellipse class="mound" cx="32" cy="56" rx="28" ry="7" />
    <g class="flora">
      <path class="blade-lite" d={blade(10, 56, -6, 22)} />
      <path class="blade-dark" d={blade(20, 56, 5, 30)} />
      <path class="stem" d="M 30 56 Q 32 42 34 30" />
      {@render leafShape(31, 46, -160, 0.55, true)}
      <path class="pedicel" d="M 31.5 44 Q 29 43.5 27.5 45" />
      {@render bell(27.5, 45, -14)}
      <path class="pedicel" d="M 34 30 Q 35.5 28 37.5 27.5" />
      {@render bell(37.5, 27.5, 10)}
      <path class="blade-dark" d={blade(44, 56, 6, 26)} />
      <path class="blade-lite" d={blade(54, 56, -5, 18)} />
    </g>
  </svg>

  <!-- cluster B: dandelion clock & bellflower -->
  <svg class="cluster c-b" viewBox="0 0 90 72" width="90" height="72" style="left:30%; --swd:7.6s; --swdel:-3s; bottom:70px;">
    <ellipse class="mound" cx="45" cy="72" rx="40" ry="8" />
    <g class="flora">
      <path class="blade-dark" d={blade(12, 72, -6, 22)} />
      <path class="blade-lite" d={blade(44, 72, 8, 30)} />
      <path class="blade-dark" d={blade(78, 72, 7, 24)} />
      <path class="stem" d="M 30 72 Q 25 50 26 30" />
      {@render leafShape(28, 54, -160, 0.8, true)}
      {@render leafShape(29, 44, -25, 0.7, false)}
      {@render seedhead(26, 30, 1)}
      <path class="stem" d="M 58 72 Q 61 54 64 38" />
      {@render leafShape(60, 60, -160, 0.6, true)}
      <path class="pedicel" d="M 60.5 54 Q 57.5 53.5 55.5 55.5" />
      {@render bell(55.5, 55.5, -16)}
      <path class="pedicel" d="M 63 45 Q 66 44 68 45.5" />
      {@render bell(68, 45.5, 14)}
      <path class="pedicel" d="M 64 38 Q 63.5 35.5 62 34" />
      {@render bell(62, 34, -6)}
    </g>
  </svg>

  <!-- cluster G: small tulip & daisy in the dip -->
  <svg class="cluster c-g" viewBox="0 0 72 62" width="72" height="62" style="left:41%; --swd:7.3s; --swdel:-1.1s; bottom:62px;">
    <ellipse class="mound" cx="36" cy="62" rx="32" ry="7" />
    <g class="flora">
      <path class="blade-dark" d={blade(12, 62, -6, 20)} />
      <path class="stem" d="M 26 62 Q 23 46 24 32" />
      {@render leafShape(25, 48, -160, 0.65, true)}
      {@render tulip(24, 32, 0.85)}
      <path class="blade-lite" d={blade(34, 62, 4, 16)} />
      <path class="stem" d="M 44 62 Q 47 52 46 42" />
      {@render daisy(46, 42, 0.7)}
      <path class="blade-lite" d={blade(56, 62, 7, 24)} />
    </g>
  </svg>

  <!-- cluster C: daisies with a ladybug on a blade -->
  <svg class="cluster c-c" viewBox="0 0 104 64" width="104" height="64" style="left:50%; --swd:6.2s; --swdel:-0.8s; bottom:64px;">
    <ellipse class="mound" cx="52" cy="64" rx="48" ry="8" />
    <g class="flora">
      <path class="blade-dark" d={blade(16, 64, -8, 24)} />
      <path class="blade-lite" d={blade(28, 64, 6, 18)} />
      <path class="stem" d="M 40 64 Q 35 46 36 26" />
      {@render leafShape(38, 48, -160, 0.85, true)}
      {@render leafShape(38, 38, -25, 0.75, false)}
      {@render daisy(36, 26, 1)}
      <path class="stem" d="M 58 64 Q 62 54 61 42" />
      {@render daisy(61, 42, 0.75)}
      <path class="blade-lite lb-blade" d="M 72 64 Q 90 46 100 38" />
      <g transform="translate(88 43) rotate(-42)">
        <ellipse class="lb-body" cx="0" cy="0" rx="4.4" ry="3.4" />
        <circle class="lb-head" cx="4" cy="-0.3" r="1.8" />
        <path class="lb-split" d="M -0.4 -3.2 L 0 3.2" />
        <circle class="lb-spot" cx="-2.4" cy="-1.4" r="0.8" />
        <circle class="lb-spot" cx="-1.6" cy="1.6" r="0.7" />
        <circle class="lb-spot" cx="1.4" cy="-1.7" r="0.7" />
        <circle class="lb-spot" cx="1.8" cy="1.4" r="0.6" />
        <path class="lb-feeler" d="M 5.2 -1.6 Q 6.6 -2.6 6.8 -3.8" />
        <path class="lb-feeler" d="M 5.6 0.4 Q 7.2 0.4 8 -0.4" />
      </g>
      <path class="blade-dark" d={blade(86, 64, -6, 16)} />
    </g>
  </svg>

  <!-- cluster D: tall tulip, bud & small seedhead -->
  <svg class="cluster c-d" viewBox="0 0 92 72" width="92" height="72" style="left:68%; --swd:7.1s; --swdel:-2.2s; bottom:74px;">
    <ellipse class="mound" cx="46" cy="72" rx="42" ry="8" />
    <g class="flora">
      <path class="blade-dark" d={blade(12, 72, -7, 22)} />
      <path class="stem" d="M 30 72 Q 26 48 28 26" />
      {@render leafShape(29, 52, -160, 0.9, true)}
      {@render leafShape(30, 40, -28, 0.8, false)}
      {@render tulip(28, 26, 1)}
      <path class="stem" d="M 46 72 Q 49 58 48 44" />
      <path class="bud" transform="translate(48 44)" d="M 0 1.5 C -4.5 -1.5 -4 -9.5 0 -12.5 C 4 -9.5 4.5 -1.5 0 1.5 Z" />
      <path class="bud-rib" d="M 48 33 Q 47 38 48 44" />
      <path class="blade-lite" d={blade(58, 72, 6, 24)} />
      <path class="stem" d="M 68 72 Q 72 58 71 42" />
      {@render leafShape(70, 58, -22, 0.65, false)}
      {@render seedhead(71, 42, 0.8)}
      <path class="blade-dark" d={blade(82, 72, 6, 26)} />
    </g>
  </svg>

  <!-- cluster H: daisy & seedhead pair -->
  <svg class="cluster c-h hide-sm" viewBox="0 0 80 64" width="80" height="64" style="left:75.5%; --swd:6.6s; --swdel:-3.4s; bottom:74px;">
    <ellipse class="mound" cx="40" cy="64" rx="36" ry="7" />
    <g class="flora">
      <path class="blade-dark" d={blade(14, 64, -7, 24)} />
      <path class="stem" d="M 30 64 Q 26 46 27 28" />
      {@render leafShape(28, 48, -160, 0.7, true)}
      {@render leafShape(28, 40, -25, 0.6, false)}
      {@render daisy(27, 28, 0.9)}
      <path class="blade-lite" d={blade(42, 64, 6, 20)} />
      <path class="stem" d="M 52 64 Q 56 52 55 40" />
      {@render seedhead(55, 40, 0.7)}
      <path class="blade-lite" d={blade(66, 64, 6, 26)} />
      <path class="blade-dark" d={blade(74, 64, -4, 16)} />
    </g>
  </svg>

  <!-- cluster E: tall grasses & small daisies -->
  <svg class="cluster c-e hide-sm" viewBox="0 0 84 58" width="84" height="58" style="left:82%; --swd:5.9s; --swdel:-4s; bottom:71px;">
    <ellipse class="mound" cx="42" cy="58" rx="38" ry="7" />
    <g class="flora">
      <path class="blade-dark" d={blade(14, 58, -9, 30)} />
      <path class="blade-lite" d={blade(26, 58, 7, 38)} />
      <path class="stem" d="M 34 58 Q 31 46 32 34" />
      {@render daisy(32, 34, 0.6)}
      <path class="blade-dark" d={blade(42, 58, -6, 26)} />
      <path class="stem" d="M 52 58 Q 55 50 54 40" />
      {@render daisy(54, 40, 0.55)}
      <path class="blade-lite" d={blade(58, 58, 9, 34)} />
      <path class="blade-dark" d={blade(72, 58, 4, 20)} />
    </g>
  </svg>

  <!-- butterfly, drifting above the meadow -->
  <svg class="butterfly" viewBox="-20 -17 40 34" width="52" height="44">
    <g class="wing">{@render wingPair()}</g>
    <g transform="scale(-1 1)"><g class="wing">{@render wingPair()}</g></g>
    <ellipse class="bf-body" cx="0" cy="0.5" rx="1.7" ry="6" />
    <circle class="bf-head" cx="0" cy="-6.5" r="2" />
    <path class="bf-feeler" d="M -0.8 -7.8 Q -3 -11 -5 -12" />
    <path class="bf-feeler" d="M 0.8 -7.8 Q 3 -11 5 -12" />
  </svg>

  <!-- pollen motes -->
  {#each MOTES as m}
    <span
      class="mote"
      style={`left:${m.l}%; bottom:${m.b}px; width:${m.s}px; height:${m.s}px; animation-duration:${m.d}s; animation-delay:${m.del}s;`}
    ></span>
  {/each}
</div>

<style>
  .meadow {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .meadow svg {
    display: block;
  }

  /* ---- hills ---- */
  .hills {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .hill-far {
    fill: var(--slice-bg, #7fb08a);
    opacity: 0.3;
  }
  .hill-mid {
    fill: var(--accent, #4f8a63);
    opacity: 0.5;
  }
  .hill-near {
    fill: var(--hub-bg, #2f4f3a);
  }
  .crest-rim {
    fill: none;
    stroke: var(--garden-leaf, #6bbf7b);
    stroke-width: 1.5;
    opacity: 0.4;
  }

  /* ---- sun ---- */
  .sun {
    position: absolute;
    left: max(34px, 7%);
    top: 6px;
    margin-left: -30px;
  }
  .sun-core {
    fill: var(--accent, #4f8a63);
    opacity: 0.22;
  }
  .sun-ring {
    fill: none;
    stroke: var(--accent, #4f8a63);
    stroke-width: 1;
    stroke-dasharray: 1 6.85;
    stroke-linecap: round;
    opacity: 0.55;
    transform-box: view-box;
    transform-origin: 50% 50%;
    animation: spin 80s linear infinite;
  }

  /* ---- flora placement ---- */
  .cluster,
  .tuft {
    position: absolute;
  }
  .cluster.c-a { margin-left: -48px; }
  .cluster.c-b { margin-left: -45px; }
  .cluster.c-c { margin-left: -52px; }
  .cluster.c-d { margin-left: -46px; }
  .cluster.c-e { margin-left: -42px; }
  .cluster.c-f { margin-left: -32px; }
  .cluster.c-g { margin-left: -36px; }
  .cluster.c-h { margin-left: -40px; }
  .tuft {
    margin-left: -15px;
    transform: scale(var(--tsc, 1));
    transform-origin: 50% 100%;
  }

  /* gentle sway, rooted at the ground */
  .flora {
    transform-box: view-box;
    transform-origin: 50% 100%;
    animation: sway var(--swd, 6.5s) ease-in-out var(--swdel, 0s) infinite alternate;
  }

  /* ---- flora colours ---- */
  .mound {
    fill: var(--hub-bg, #2f4f3a);
  }
  .stem {
    fill: none;
    stroke: var(--garden-stem, #3f6d4e);
    stroke-width: 1.8;
    stroke-linecap: round;
  }
  .blade-dark {
    fill: none;
    stroke: var(--garden-stem, #3f6d4e);
    stroke-width: 2;
    stroke-linecap: round;
  }
  .blade-lite {
    fill: none;
    stroke: var(--garden-leaf, #6bbf7b);
    stroke-width: 1.9;
    stroke-linecap: round;
    opacity: 0.85;
  }
  .leaf-fill {
    fill: var(--garden-leaf, #6bbf7b);
    opacity: 0.9;
  }
  .leaf-rib {
    fill: none;
    stroke: var(--garden-stem, #3f6d4e);
    stroke-width: 0.7;
    opacity: 0.55;
  }
  .petal {
    fill: color-mix(in srgb, var(--bg, #eef5ef) 45%, white);
    stroke: var(--accent, #4f8a63);
    stroke-width: 0.5;
  }
  .disc {
    fill: var(--accent, #4f8a63);
  }
  .disc-dot {
    fill: var(--garden-leaf, #6bbf7b);
  }
  .tulip {
    fill: color-mix(in srgb, var(--slice-bg, #7fb08a) 40%, white);
    stroke: var(--accent, #4f8a63);
    stroke-width: 0.8;
    stroke-linejoin: round;
  }
  .tulip-rib {
    fill: none;
    stroke: var(--accent, #4f8a63);
    stroke-width: 0.6;
    opacity: 0.55;
  }
  .bud {
    fill: var(--garden-leaf, #6bbf7b);
  }
  .bud-rib {
    fill: none;
    stroke: var(--garden-stem, #3f6d4e);
    stroke-width: 0.8;
    opacity: 0.6;
  }
  .spoke {
    stroke: var(--garden-stem, #3f6d4e);
    stroke-width: 0.9;
    opacity: 0.75;
  }
  .puff {
    fill: color-mix(in srgb, var(--bg, #eef5ef) 50%, white);
    stroke: var(--accent, #4f8a63);
    stroke-width: 0.5;
  }
  .seed-core {
    fill: var(--garden-stem, #3f6d4e);
  }
  .pedicel {
    fill: none;
    stroke: var(--garden-stem, #3f6d4e);
    stroke-width: 1;
    stroke-linecap: round;
  }
  .bell {
    fill: color-mix(in srgb, var(--slice-bg, #7fb08a) 40%, white);
    stroke: var(--accent, #4f8a63);
    stroke-width: 0.7;
    stroke-linejoin: round;
  }

  /* ---- ladybug ---- */
  .lb-body {
    fill: #bf5a45;
  }
  .lb-head,
  .lb-spot {
    fill: color-mix(in srgb, var(--hub-bg, #2f4f3a) 45%, black);
  }
  .lb-split,
  .lb-feeler {
    fill: none;
    stroke: color-mix(in srgb, var(--hub-bg, #2f4f3a) 45%, black);
    stroke-width: 0.6;
    stroke-linecap: round;
  }

  /* ---- butterfly ---- */
  .butterfly {
    position: absolute;
    left: 59%;
    bottom: 88px;
    margin-left: -26px;
    animation: bf-bob 6.5s ease-in-out infinite;
  }
  .wing {
    fill: color-mix(in srgb, var(--bg, #eef5ef) 45%, white);
    stroke: var(--accent, #4f8a63);
    stroke-width: 0.7;
    stroke-linejoin: round;
    transform-box: view-box;
    transform-origin: 50% 50%;
    animation: bf-flap 3.2s ease-in-out infinite;
  }
  .wing-dot {
    fill: var(--accent, #4f8a63);
    opacity: 0.75;
    stroke: none;
  }
  .bf-body,
  .bf-head {
    fill: var(--garden-stem, #3f6d4e);
  }
  .bf-feeler {
    fill: none;
    stroke: var(--garden-stem, #3f6d4e);
    stroke-width: 0.6;
    stroke-linecap: round;
  }

  /* ---- pollen ---- */
  .mote {
    position: absolute;
    border-radius: 50%;
    background: var(--garden-leaf, #6bbf7b);
    opacity: 0;
    animation: mote-rise 12s ease-in-out infinite;
  }

  @keyframes sway {
    from {
      transform: rotate(-1.3deg);
    }
    to {
      transform: rotate(1.3deg);
    }
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes bf-flap {
    0%,
    100% {
      transform: scaleX(1);
    }
    50% {
      transform: scaleX(0.68);
    }
  }
  @keyframes bf-bob {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-6px) rotate(2.5deg);
    }
  }
  @keyframes mote-rise {
    0% {
      transform: translateY(6px);
      opacity: 0;
    }
    30% {
      opacity: 0.5;
    }
    70% {
      opacity: 0.3;
    }
    100% {
      transform: translateY(-30px);
      opacity: 0;
    }
  }

  @media (max-width: 560px) {
    .meadow svg.hide-sm {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sun-ring,
    .flora,
    .butterfly,
    .wing,
    .mote {
      animation: none;
    }
    .mote {
      opacity: 0.35;
    }
  }
</style>
