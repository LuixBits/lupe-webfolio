<script lang="ts">
  let {
    corner = 'top-right',
    sectionId = 'projects',
    variant = 'corner'
  }: { corner?: string; sectionId?: string | null; variant?: 'corner' | 'hub' } = $props();

  // The scene is authored for the top-right corner (vanishing point at 340,0)
  // and mirrored into the other corners with a flip transform.
  const FLIP: Record<string, string> = {
    'top-right': 'none',
    'top-left': 'scaleX(-1)',
    'bottom-right': 'scaleY(-1)',
    'bottom-left': 'scale(-1)'
  };
  const flip = $derived(FLIP[corner] ?? 'none');

  // Stable id for SVG defs (gradients/clips) — unique per instance, SSR-safe.
  const uid = $props.id();

  // ---- deterministic geometry (SSR-safe, no browser APIs) ----
  const CX = 340;
  const CY = 0;
  const HORIZON_R = 212;

  function polar(deg: number, r: number): [number, number] {
    const a = (deg * Math.PI) / 180;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  }
  function p(deg: number, r: number): string {
    const [x, y] = polar(deg, r);
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  // Jagged wireframe ridge along an arc around the corner, closed at its base arc.
  function ridgePath(radii: number[], a0: number, a1: number, base: number): string {
    const step = (a1 - a0) / (radii.length - 1);
    const line = radii.map((r, i) => p(a0 + i * step, r)).join(' L ');
    return `M ${p(a0, base)} L ${line} L ${p(a1, base)} A ${base} ${base} 0 0 0 ${p(a0, base)} Z`;
  }

  // Ridges dip into a valley around 135° so the sun rises between two flanking
  // peaks instead of being buried behind them.
  const backRidge = ridgePath(
    [214, 172, 190, 158, 184, 196, 206, 210, 204, 194, 178, 158, 186, 170, 214],
    91, 179, 214
  );
  const frontRidge = ridgePath(
    [210, 186, 198, 174, 192, 200, 206, 204, 198, 178, 196, 182, 210],
    91, 179, 210
  );

  // ---- retro sun, in the same coordinate system as the grid ----
  // Centered on the corner's 135° diagonal, just inside the horizon circle, so
  // the banded disc is cut by the same arc the grid planes recede to. Its
  // lower limb hides behind the horizon + ridge foothills: a rising sun.
  const SUN_R = 58;
  const [rawX, rawY] = polar(135, 204);
  const sunX = +rawX.toFixed(1);
  const sunY = +rawY.toFixed(1);
  // Filled bands are 8 units tall on a 12-unit rhythm; the strip starts one
  // full period above the disc so a 0 -> 12px translate loops seamlessly.
  const bandYs = Array.from({ length: 14 }, (_, i) => 60 + i * 12);

  // Perspective rays converging on the corner (computed once).
  const rays = (() => {
    let s = '';
    for (let a = 93; a <= 177; a += 7) {
      s += `M ${p(a, 150)} L ${p(a, 545)} `;
    }
    return s;
  })();

  // Geometric radii (ratio 1.2) so a scale(1 -> 1.2) loop is perfectly seamless.
  const arcRadii = Array.from({ length: 8 }, (_, i) => +(147 * 1.2 ** i).toFixed(1));

  // ================= hub variant: full-square vaporwave poster =================
  // 800x500 stage, preserveAspectRatio slice — crops gracefully, never stretches.
  // Horizon at y=285 (57%), sun centered-ish above it, grid floor below running
  // to the vanishing point. The wheel overlays this square's bottom-left corner,
  // so all key motifs (sun, peaks, palm crowns) live center/right/top.

  /** Deterministic 0..1 hash — no Math.random anywhere (same recipe as CosmosScene). */
  function mix(n: number): number {
    let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
    x ^= x >>> 13;
    x = Math.imul(x, 0xc2b2ae35);
    x ^= x >>> 16;
    return (x >>> 0) / 4294967296;
  }

  const HZN = 285;
  const SUN = { x: 430, y: 210, r: 100 };

  // Slats cut out of the sun's lower half, widening downward (classic poster sun).
  const sunSlats: [number, number][] = [
    [188, 3],
    [203, 4.5],
    [220, 6],
    [239, 8],
    [260, 10.5],
    [283, 13]
  ];

  // Sky scatter: dots + a few four-point sparkles, kept off the sun's face.
  function sparklePath(x: number, y: number, s: number): string {
    return `M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s} Z`;
  }
  const hubStars = (() => {
    const out: { x: number; y: number; r: number; d: number; t: number; big: boolean }[] = [];
    for (let i = 0; i < 60 && out.length < 26; i++) {
      const x = +(18 + 764 * mix(900 + i * 7)).toFixed(1);
      const y = +(14 + 236 * mix(901 + i * 7)).toFixed(1);
      const dx = x - SUN.x;
      const dy = y - SUN.y;
      if (dx * dx + dy * dy < 126 * 126) continue; // keep the sun's face clean
      out.push({
        x,
        y,
        r: +(0.8 + 1.3 * mix(902 + i * 7)).toFixed(2),
        d: +(-6 * mix(903 + i * 7)).toFixed(2),
        t: +(2.6 + 3.4 * mix(904 + i * 7)).toFixed(2),
        big: mix(905 + i * 7) > 0.8
      });
    }
    return out;
  })();

  // Perspective floor: rays fanning from the vanishing point + horizontal rows
  // in geometric progression (ratio 1.3) so a scale(1 -> 1.3) loop about the
  // vanishing point reads as an endless forward scroll.
  const hubRays = (() => {
    let s = '';
    for (let a = 14; a <= 166.5; a += 9.5) {
      const rad = (a * Math.PI) / 180;
      s += `M 400 285.5 L ${(400 + 640 * Math.cos(rad)).toFixed(1)} ${(285 + 640 * Math.sin(rad)).toFixed(1)} `;
    }
    return s;
  })();
  const hubRows = Array.from({ length: 15 }, (_, i) => +(HZN + 5.5 * 1.3 ** i).toFixed(1))
    .map((y) => `M -400 ${y} L 1200 ${y}`)
    .join(' ');
</script>

{#if variant === 'hub'}
<div class="vapor-hub" aria-hidden="true" data-section={sectionId ?? undefined}>
  <svg class="poster" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
    <defs>
      <!-- dusk sky: near-black zenith warming to accent haze at the horizon -->
      <linearGradient id="{uid}-hsky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={HZN}>
        <stop offset="0" class="hs-sky-a" />
        <stop offset="0.46" class="hs-sky-b" />
        <stop offset="0.82" class="hs-sky-c" />
        <stop offset="1" class="hs-sky-d" />
      </linearGradient>
      <linearGradient id="{uid}-hground" gradientUnits="userSpaceOnUse" x1="0" y1={HZN} x2="0" y2="500">
        <stop offset="0" class="hs-gr-a" />
        <stop offset="0.3" class="hs-gr-b" />
        <stop offset="1" class="hs-gr-c" />
      </linearGradient>
      <linearGradient
        id="{uid}-hsun"
        gradientUnits="userSpaceOnUse"
        x1={SUN.x}
        y1={SUN.y - SUN.r}
        x2={SUN.x}
        y2={SUN.y + SUN.r}
      >
        <stop class="stop-gold" offset="0" />
        <stop class="stop-gold" offset="0.4" />
        <stop class="stop-pink" offset="1" />
      </linearGradient>
      <radialGradient id="{uid}-hglow">
        <stop class="stop-glow-a" offset="0" />
        <stop class="stop-glow-b" offset="0.45" />
        <stop class="stop-glow-c" offset="0.75" />
      </radialGradient>
      <radialGradient id="{uid}-hpool">
        <stop class="hs-pool-a" offset="0" />
        <stop class="stop-glow-c" offset="1" />
      </radialGradient>
      <!-- horizon strip: pink flanks flaring to gold beneath the sun -->
      <linearGradient id="{uid}-hzn" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="800" y2="0">
        <stop offset="0" class="hs-hz-edge" />
        <stop offset="0.26" class="hs-hz-pink" />
        <stop offset="0.54" class="hs-hz-gold" />
        <stop offset="0.8" class="hs-hz-pink" />
        <stop offset="1" class="hs-hz-edge" />
      </linearGradient>
      <!-- classic sun: disc with widening slats sliced out of its lower half -->
      <mask id="{uid}-hsunm" maskUnits="userSpaceOnUse" x="320" y="100" width="220" height="220">
        <circle cx={SUN.x} cy={SUN.y} r={SUN.r} fill="#fff" />
        {#each sunSlats as [y, h] (y)}
          <rect x="322" y={y} width="216" height={h} fill="#000" />
        {/each}
      </mask>
      <!-- grid fades out as it meets the horizon so the scroll loop is seamless -->
      <linearGradient id="{uid}-hfadeg" gradientUnits="userSpaceOnUse" x1="0" y1={HZN} x2="0" y2="510">
        <stop offset="0" stop-color="#fff" stop-opacity="0" />
        <stop offset="0.14" stop-color="#fff" stop-opacity="1" />
        <stop offset="1" stop-color="#fff" stop-opacity="1" />
      </linearGradient>
      <mask id="{uid}-hfade" maskUnits="userSpaceOnUse" x="-400" y="280" width="1600" height="240">
        <rect x="-400" y={HZN} width="1600" height="225" fill="url(#{uid}-hfadeg)" />
      </mask>
      <!-- one palm, reused mirrored+scaled: crown at origin, trunk to y≈320 -->
      <g id="{uid}-palm">
        <path
          class="palm-fill"
          d="M -3 2 C 6 84 20 190 34 318 L 50 320 C 32 192 16 82 7 -2 Z
             M 0 0 C -4 -34 2 -62 14 -84 C 10 -56 8 -30 6 -2 Z
             M 2 0 C 26 -30 52 -44 84 -46 C 56 -30 32 -12 8 6 Z
             M 4 2 C 36 -6 72 2 98 24 C 68 16 36 12 6 10 Z
             M 4 6 C 32 16 56 36 68 66 C 46 46 24 28 2 12 Z
             M -2 0 C -24 -32 -48 -46 -80 -48 C -52 -30 -28 -12 -6 6 Z
             M -4 2 C -34 -8 -68 -2 -94 18 C -64 12 -34 10 -6 10 Z
             M -4 6 C -28 18 -48 38 -58 64 C -38 44 -18 26 0 12 Z"
        />
        <circle class="palm-fill" cx="-6" cy="5" r="5" />
        <circle class="palm-fill" cx="6" cy="8" r="4.5" />
      </g>
    </defs>

    <!-- sky -->
    <rect x="0" y="0" width="800" height={HZN + 1} fill="url(#{uid}-hsky)" />

    <!-- star field -->
    <g class="hstars">
      {#each hubStars as st, i (i)}
        {#if st.big}
          <path
            class="hstar hspark"
            d={sparklePath(st.x, st.y, 3 + st.r * 2.4)}
            style={`--t:${st.t}s; --d:${st.d}s`}
          />
        {:else}
          <circle class="hstar" cx={st.x} cy={st.y} r={st.r} style={`--t:${st.t}s; --d:${st.d}s`} />
        {/if}
      {/each}
    </g>

    <!-- sunset haze streaks balancing the left sky -->
    <g class="hhaze">
      <path class="hz-gold" d="M 126 166 H 238" />
      <path class="hz-pink" d="M 158 182 H 250" />
      <path class="hz-gold" d="M 560 96 H 642" />
    </g>

    <!-- the sun: soft halo, banded disc; ground rect below covers its set limb -->
    <circle class="hsun-glow" cx={SUN.x} cy={SUN.y} r="205" fill="url(#{uid}-hglow)" />
    <circle cx={SUN.x} cy={SUN.y} r={SUN.r} fill="url(#{uid}-hsun)" mask="url(#{uid}-hsunm)" />
    <!-- thin cloud bar drifting across the sun's face -->
    <path class="hcloud" d="M 352 170 H 556" />

    <!-- wireframe ranges seated on the horizon, complete peaks at both sides -->
    <g class="hridges">
      <path class="ridge-back" d="M 18 285 L 82 234 L 122 258 L 187 210 L 258 285 Z" />
      <path class="ridge-back" d="M 540 285 L 606 238 L 648 260 L 712 220 L 780 285 Z" />
      <path class="ridge-ghost" d="M 60 285 L 132 240 L 175 262 L 236 226 L 300 285 Z" transform="translate(2 -1.4)" />
      <path class="ridge-front" d="M 60 285 L 132 240 L 175 262 L 236 226 L 300 285 Z" />
      <path class="ridge-ghost" d="M 588 285 L 650 246 L 690 264 L 742 238 L 786 285 Z" transform="translate(2 -1.4)" />
      <path class="ridge-front" d="M 588 285 L 650 246 L 690 264 L 742 238 L 786 285 Z" />
    </g>

    <!-- floor -->
    <rect x="0" y={HZN} width="800" height={500 - HZN} fill="url(#{uid}-hground)" />
    <ellipse cx={SUN.x} cy={HZN + 18} rx="195" ry="36" fill="url(#{uid}-hpool)" class="hpool" />
    <g mask="url(#{uid}-hfade)">
      <path class="hrays-glow" d={hubRays} />
      <path class="hrays" d={hubRays} />
      <g class="hflow">
        <path class="hrows-glow" d={hubRows} vector-effect="non-scaling-stroke" />
        <path class="hrows" d={hubRows} vector-effect="non-scaling-stroke" />
      </g>
    </g>

    <!-- horizon strip -->
    <path class="hzn-haze" d="M 0 285 L 800 285" stroke="url(#{uid}-hzn)" />
    <path class="hzn-core" d="M 0 285 L 800 285" stroke="url(#{uid}-hzn)" />

    <!-- foreground palms: tall one right, small mirrored one far left; the
         bottom-left inner corner (under the wheel) stays clear of key motifs -->
    <g class="hsway hsway-a">
      <use href="#{uid}-palm" transform="translate(655 200)" />
    </g>
    <g class="hsway hsway-b">
      <use href="#{uid}-palm" transform="translate(100 250) scale(-0.72 0.72)" />
    </g>
  </svg>

  <!-- drifting neon motes -->
  <div class="hp hp1"></div>
  <div class="hp hp2"></div>
  <div class="hp hp3"></div>

  <!-- CRT scanlines -->
  <div class="hub-scan"></div>
</div>
{:else}
<div class="vapor-corner" aria-hidden="true" data-section={sectionId ?? undefined}>
  <div class="scene" style:transform={flip}>
    <!-- sky halo seating the radial menu -->
    <div class="halo"></div>

    <!-- fixed-aspect stage pinned to the corner: everything drawn here shares
         the 340x340 viewBox, so sun, ridges and grid can never drift apart -->
    <div class="art">
      <svg class="skyline" viewBox="0 0 340 340">
        <defs>
          <!-- gold cap leads toward the corner sky; magenta sinks to the
               horizon. Defined in scene space so every mirrored corner keeps
               the bright limb on the visible, rising side of the sun. -->
          <linearGradient
            id="{uid}-sun"
            gradientUnits="userSpaceOnUse"
            x1={sunX}
            y1={sunY - SUN_R}
            x2={sunX}
            y2={sunY + SUN_R}
          >
            <stop class="stop-gold" offset="0" />
            <stop class="stop-gold" offset="0.34" />
            <stop class="stop-pink" offset="1" />
          </linearGradient>
          <radialGradient id="{uid}-glow">
            <stop class="stop-glow-a" offset="0" />
            <stop class="stop-glow-b" offset="0.45" />
            <stop class="stop-glow-c" offset="0.72" />
          </radialGradient>
          <!-- sky side of the horizon circle: the sun may not cross it -->
          <clipPath id="{uid}-sky"><circle cx={CX} cy={CY} r={HORIZON_R - 0.6} /></clipPath>
          <clipPath id="{uid}-disc"><circle cx={sunX} cy={sunY} r={SUN_R} /></clipPath>
        </defs>

        <!-- glow is unclipped: it spills past the horizon as haze on the grid -->
        <circle class="sun-glow" cx={sunX} cy={sunY} r="115" fill="url(#{uid}-glow)" />

        <!-- banded sun: gradient rects clipped to disc ∩ sky -->
        <g clip-path="url(#{uid}-sky)">
          <g clip-path="url(#{uid}-disc)">
            <g class="sun-bands">
              {#each bandYs as y (y)}
                <rect x="132" y={y} width="130" height="8" fill="url(#{uid}-sun)" />
              {/each}
            </g>
          </g>
        </g>

        <!-- wireframe mountain ranges seated on the horizon arc, in front of
             the sun's lower limb -->
        <g class="ridges">
          <path class="ridge-back" d={backRidge} />
          <path class="ridge-ghost" d={frontRidge} transform="translate(1.6 -1.1)" />
          <path class="ridge-front" d={frontRidge} />
          <circle class="horizon" cx={CX} cy={CY} r={HORIZON_R} />
        </g>
      </svg>

      <!-- neon grid plane scrolling outward from the horizon -->
      <svg class="grid" viewBox="0 0 340 340">
        <path class="rays-glow" d={rays} />
        <path class="rays" d={rays} />
        <g class="arcs arcs-glow">
          {#each arcRadii as r (r)}
            <circle cx={CX} cy={CY} {r} />
          {/each}
        </g>
        <g class="arcs arcs-line">
          {#each arcRadii as r (r)}
            <circle cx={CX} cy={CY} {r} />
          {/each}
        </g>
      </svg>
    </div>

    <!-- drifting neon motes -->
    <div class="particle p1"></div>
    <div class="particle p2"></div>
    <div class="particle p3"></div>

    <!-- CRT scanlines -->
    <div class="scan"></div>
  </div>
</div>
{/if}

<style>
  .vapor-corner {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
    /* lets the scene scale to its mount, not the viewport (hub quadrants
       are half-screen panels) */
    container-type: size;
  }

  .scene {
    /* single scale knob for the whole composition */
    --k: 1;
    position: absolute;
    inset: 0;
    /* dusk sky radiating from the corner, dissolving into the page */
    background: radial-gradient(
      circle calc(var(--k) * 481px) at 100% 0%,
      color-mix(in srgb, var(--slice-bg, #7b4bd6) 55%, var(--bg, #241046)) 0px,
      var(--bg, #241046) calc(var(--k) * 210px),
      color-mix(in srgb, var(--bg, #241046) 60%, transparent) calc(var(--k) * 340px),
      transparent calc(var(--k) * 460px)
    );
    /* whole scene emanates from the corner and fades out */
    -webkit-mask-image: radial-gradient(
      circle calc(var(--k) * 481px) at 100% 0%,
      #000 0 calc(var(--k) * 300px),
      transparent calc(var(--k) * 468px)
    );
    mask-image: radial-gradient(
      circle calc(var(--k) * 481px) at 100% 0%,
      #000 0 calc(var(--k) * 300px),
      transparent calc(var(--k) * 468px)
    );
  }

  /* shrink gracefully on small mounts/viewports — geometry scales as one */
  @container (max-width: 620px) or (max-height: 620px) {
    .scene {
      --k: 0.78;
    }
  }
  @container (max-width: 460px) or (max-height: 460px) {
    .scene {
      --k: 0.6;
    }
  }
  @container (max-width: 340px) or (max-height: 340px) {
    .scene {
      --k: 0.48;
    }
  }

  .scene > * {
    position: absolute;
  }

  /* ---- corner halo behind the menu ---- */
  .halo {
    inset: 0;
    background: radial-gradient(
      circle calc(var(--k) * 250px) at 100% 0%,
      color-mix(in srgb, var(--slice-bg, #7b4bd6) 65%, transparent) 0%,
      color-mix(in srgb, var(--accent, #ff5ed1) 18%, transparent) 55%,
      transparent 100%
    );
  }

  /* ---- shared stage: one viewBox, one scale, zero drift ---- */
  .art {
    top: 0;
    right: 0;
    width: calc(var(--k) * 340px);
    height: calc(var(--k) * 340px);
  }

  .skyline,
  .grid {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  /* ---- retro sun ---- */
  .sun-glow {
    transform-box: fill-box;
    transform-origin: center;
    animation: glowpulse 5.5s ease-in-out infinite alternate;
  }

  .sun-bands {
    animation: bands 6s linear infinite;
  }

  .stop-gold {
    stop-color: var(--vapor-sun, #ffd36e);
  }

  .stop-pink {
    stop-color: var(--accent, #ff5ed1);
  }

  .stop-glow-a {
    stop-color: color-mix(in srgb, var(--vapor-sun, #ffd36e) 50%, transparent);
  }

  .stop-glow-b {
    stop-color: color-mix(in srgb, var(--accent, #ff5ed1) 26%, transparent);
  }

  .stop-glow-c {
    stop-color: transparent;
  }

  /* ---- mountains ---- */
  .ridges {
    filter: drop-shadow(0 0 6px color-mix(in srgb, var(--accent, #ff5ed1) 40%, transparent));
  }

  .ridge-back {
    fill: color-mix(in srgb, var(--bg, #241046) 90%, var(--slice-bg, #7b4bd6));
    stroke: color-mix(in srgb, var(--accent, #ff5ed1) 55%, var(--slice-bg, #7b4bd6));
    stroke-width: 1;
    opacity: 0.92;
  }

  .ridge-ghost {
    fill: none;
    stroke: var(--vapor-sun, #ffd36e);
    stroke-width: 1;
    opacity: 0.4; /* chromatic offset ghost */
  }

  .ridge-front {
    fill: color-mix(in srgb, var(--bg, #241046) 80%, var(--slice-bg, #7b4bd6));
    stroke: var(--vapor-grid, #ff5ed1);
    stroke-width: 1.3;
  }

  .horizon {
    fill: none;
    stroke: var(--vapor-sun, #ffd36e);
    stroke-width: 1.6;
    opacity: 0.85;
  }

  /* ---- neon grid ---- */
  .grid {
    /* reveal the plane only beyond the horizon; a touch dimmer near it */
    -webkit-mask-image: radial-gradient(
      circle calc(var(--k) * 481px) at 100% 0%,
      transparent 0 calc(var(--k) * 204px),
      rgba(0, 0, 0, 0.55) calc(var(--k) * 238px),
      #000 calc(var(--k) * 305px)
    );
    mask-image: radial-gradient(
      circle calc(var(--k) * 481px) at 100% 0%,
      transparent 0 calc(var(--k) * 204px),
      rgba(0, 0, 0, 0.55) calc(var(--k) * 238px),
      #000 calc(var(--k) * 305px)
    );
  }

  .grid path,
  .grid circle {
    fill: none;
  }

  .rays {
    stroke: color-mix(in srgb, var(--vapor-grid, #ff5ed1) 85%, transparent);
    stroke-width: 1;
  }

  .rays-glow {
    stroke: var(--vapor-grid, #ff5ed1);
    stroke-width: 3.2;
    opacity: 0.14;
  }

  .arcs {
    transform-box: view-box;
    transform-origin: 340px 0px;
    animation: arcflow 3.4s linear infinite;
  }

  .arcs-line circle {
    stroke: var(--vapor-grid, #ff5ed1);
    stroke-width: 0.9;
    opacity: 0.85;
  }

  .arcs-glow circle {
    stroke: var(--vapor-grid, #ff5ed1);
    stroke-width: 3.4;
    opacity: 0.16;
  }

  /* ---- particles ---- */
  .particle {
    border-radius: 50%;
    opacity: 0;
    will-change: transform, opacity;
  }

  .p1 {
    width: 5px;
    height: 5px;
    right: calc(var(--k) * 150px);
    top: calc(var(--k) * 150px);
    background: var(--accent, #ff5ed1);
    box-shadow: 0 0 10px 2px color-mix(in srgb, var(--accent, #ff5ed1) 75%, transparent);
    animation: drift1 11s linear infinite;
  }

  .p2 {
    width: 4px;
    height: 4px;
    right: calc(var(--k) * 195px);
    top: calc(var(--k) * 92px);
    background: var(--vapor-sun, #ffd36e);
    box-shadow: 0 0 9px 2px color-mix(in srgb, var(--vapor-sun, #ffd36e) 70%, transparent);
    animation: drift2 14s linear infinite;
    animation-delay: -4s;
  }

  .p3 {
    width: 3px;
    height: 3px;
    right: calc(var(--k) * 92px);
    top: calc(var(--k) * 200px);
    background: var(--vapor-grid, #ff5ed1);
    box-shadow: 0 0 8px 2px color-mix(in srgb, var(--vapor-grid, #ff5ed1) 70%, transparent);
    animation: drift3 9.5s linear infinite;
    animation-delay: -7s;
  }

  /* ---- CRT scanlines ---- */
  .scan {
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0 2px,
      color-mix(in srgb, var(--bg, #241046) 55%, transparent) 2px 3.5px
    );
    opacity: 0.5;
  }

  /* ---- motion ---- */
  @keyframes arcflow {
    from { transform: scale(1); }
    to   { transform: scale(1.2); }
  }

  @keyframes bands {
    from { transform: translateY(0); }
    to   { transform: translateY(12px); }
  }

  @keyframes glowpulse {
    from { opacity: 0.7; transform: scale(1); }
    to   { opacity: 1; transform: scale(1.06); }
  }

  @keyframes drift1 {
    0%   { transform: translate(calc(var(--k) * 70px), calc(var(--k) * -70px)); opacity: 0; }
    12%  { opacity: 0.9; }
    80%  { opacity: 0.5; }
    100% { transform: translate(calc(var(--k) * -80px), calc(var(--k) * 80px)); opacity: 0; }
  }

  @keyframes drift2 {
    0%   { transform: translate(calc(var(--k) * 60px), calc(var(--k) * -40px)); opacity: 0; }
    15%  { opacity: 0.8; }
    82%  { opacity: 0.4; }
    100% { transform: translate(calc(var(--k) * -70px), calc(var(--k) * 60px)); opacity: 0; }
  }

  @keyframes drift3 {
    0%   { transform: translate(calc(var(--k) * 40px), calc(var(--k) * -55px)); opacity: 0; }
    14%  { opacity: 0.85; }
    80%  { opacity: 0.45; }
    100% { transform: translate(calc(var(--k) * -60px), calc(var(--k) * 70px)); opacity: 0; }
  }

  /* ================= hub variant: full-square poster ================= */
  .vapor-hub {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
  }

  .poster {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  /* sky gradient stops */
  .hs-sky-a {
    stop-color: color-mix(in srgb, var(--bg, #241046) 55%, #05010e);
  }
  .hs-sky-b {
    stop-color: var(--bg, #241046);
  }
  .hs-sky-c {
    stop-color: color-mix(in srgb, var(--slice-bg, #7b4bd6) 42%, var(--bg, #241046));
  }
  .hs-sky-d {
    stop-color: color-mix(in srgb, var(--accent, #ff5ed1) 34%, var(--bg, #241046));
  }

  /* floor gradient stops */
  .hs-gr-a {
    stop-color: color-mix(in srgb, var(--accent, #ff5ed1) 26%, var(--bg, #241046));
  }
  .hs-gr-b {
    stop-color: color-mix(in srgb, var(--bg, #241046) 82%, #06021a);
  }
  .hs-gr-c {
    stop-color: color-mix(in srgb, var(--bg, #241046) 55%, #05010e);
  }

  .hs-pool-a {
    stop-color: color-mix(in srgb, var(--vapor-sun, #ffd36e) 30%, transparent);
  }

  /* horizon strip stops */
  .hs-hz-edge {
    stop-color: transparent;
  }
  .hs-hz-pink {
    stop-color: color-mix(in srgb, var(--vapor-grid, #ff5ed1) 75%, transparent);
  }
  .hs-hz-gold {
    stop-color: var(--vapor-sun, #ffd36e);
  }

  /* stars */
  .hstar {
    fill: color-mix(in srgb, var(--fg, #ffe9ff) 85%, transparent);
    animation: htwinkle var(--t, 3.4s) ease-in-out infinite alternate;
    animation-delay: var(--d, 0s);
  }
  .hspark {
    fill: color-mix(in srgb, var(--vapor-sun, #ffd36e) 88%, transparent);
  }

  /* sunset haze streaks + cloud bar */
  .hhaze path,
  .hcloud {
    fill: none;
    stroke-linecap: round;
  }
  .hz-gold {
    stroke: color-mix(in srgb, var(--vapor-sun, #ffd36e) 42%, transparent);
    stroke-width: 2.2;
  }
  .hz-pink {
    stroke: color-mix(in srgb, var(--accent, #ff5ed1) 45%, transparent);
    stroke-width: 2;
  }
  .hcloud {
    stroke: color-mix(in srgb, var(--bg, #241046) 86%, #05010e);
    stroke-width: 5;
    opacity: 0.9;
    animation: hclouddrift 26s ease-in-out infinite alternate;
  }

  /* sun */
  .hsun-glow {
    transform-box: fill-box;
    transform-origin: center;
    animation: glowpulse 6.5s ease-in-out infinite alternate;
  }

  /* mountains share the corner ridge palette */
  .hridges {
    filter: drop-shadow(0 0 6px color-mix(in srgb, var(--accent, #ff5ed1) 35%, transparent));
  }

  /* floor glow pool beneath the sun */
  .hpool {
    opacity: 0.55;
    animation: hpoolpulse 6.5s ease-in-out infinite alternate;
  }

  /* perspective grid */
  .hrays,
  .hrays-glow,
  .hrows,
  .hrows-glow {
    fill: none;
  }
  .hrays {
    stroke: color-mix(in srgb, var(--vapor-grid, #ff5ed1) 66%, transparent);
    stroke-width: 1;
  }
  .hrays-glow {
    stroke: var(--vapor-grid, #ff5ed1);
    stroke-width: 3.2;
    opacity: 0.1;
  }
  .hrows {
    stroke: color-mix(in srgb, var(--vapor-grid, #ff5ed1) 85%, transparent);
    stroke-width: 1;
  }
  .hrows-glow {
    stroke: var(--vapor-grid, #ff5ed1);
    stroke-width: 3.4;
    opacity: 0.15;
  }
  .hflow {
    transform-box: view-box;
    transform-origin: 400px 285px;
    animation: hubflow 4.6s linear infinite;
  }

  /* horizon line */
  .hzn-haze {
    fill: none;
    stroke-width: 7;
    opacity: 0.3;
  }
  .hzn-core {
    fill: none;
    stroke-width: 1.7;
    opacity: 0.9;
    animation: hznshimmer 7s ease-in-out infinite alternate;
  }

  /* palms */
  .palm-fill {
    fill: color-mix(in srgb, var(--bg, #241046) 42%, #05010e);
    stroke: color-mix(in srgb, var(--accent, #ff5ed1) 42%, transparent);
    stroke-width: 0.9;
    stroke-linejoin: round;
  }
  .hsway {
    transform-box: fill-box;
    transform-origin: 50% 100%;
  }
  .hsway-a {
    animation: hsway 8s ease-in-out infinite alternate;
  }
  .hsway-b {
    animation: hsway 9.5s ease-in-out infinite alternate;
    animation-delay: -4s;
  }

  /* drifting neon motes */
  .hp {
    position: absolute;
    border-radius: 50%;
    opacity: 0;
    will-change: transform, opacity;
  }
  .hp1 {
    width: 5px;
    height: 5px;
    right: 12%;
    top: 16%;
    background: var(--accent, #ff5ed1);
    box-shadow: 0 0 10px 2px color-mix(in srgb, var(--accent, #ff5ed1) 75%, transparent);
    animation: hdrift1 13s linear infinite;
  }
  .hp2 {
    width: 4px;
    height: 4px;
    left: 26%;
    top: 11%;
    background: var(--vapor-sun, #ffd36e);
    box-shadow: 0 0 9px 2px color-mix(in srgb, var(--vapor-sun, #ffd36e) 70%, transparent);
    animation: hdrift2 16s linear infinite;
    animation-delay: -6s;
  }
  .hp3 {
    width: 3px;
    height: 3px;
    right: 30%;
    top: 34%;
    background: var(--vapor-grid, #ff5ed1);
    box-shadow: 0 0 8px 2px color-mix(in srgb, var(--vapor-grid, #ff5ed1) 70%, transparent);
    animation: hdrift3 11s linear infinite;
    animation-delay: -3s;
  }

  /* CRT scanlines over the whole poster */
  .hub-scan {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0 2.6px,
      color-mix(in srgb, #05010e 45%, transparent) 2.6px 3.6px
    );
    opacity: 0.3;
  }

  @keyframes hubflow {
    from { transform: scale(1); }
    to   { transform: scale(1.3); }
  }

  @keyframes htwinkle {
    from { opacity: 0.3; }
    to   { opacity: 1; }
  }

  @keyframes hznshimmer {
    from { opacity: 0.7; }
    to   { opacity: 1; }
  }

  @keyframes hpoolpulse {
    from { opacity: 0.4; }
    to   { opacity: 0.65; }
  }

  @keyframes hsway {
    from { transform: rotate(-0.7deg); }
    to   { transform: rotate(0.9deg); }
  }

  @keyframes hclouddrift {
    from { transform: translateX(-9px); }
    to   { transform: translateX(11px); }
  }

  @keyframes hdrift1 {
    0%   { transform: translate(30px, -24px); opacity: 0; }
    12%  { opacity: 0.9; }
    80%  { opacity: 0.5; }
    100% { transform: translate(-46px, 30px); opacity: 0; }
  }

  @keyframes hdrift2 {
    0%   { transform: translate(-26px, -14px); opacity: 0; }
    15%  { opacity: 0.8; }
    82%  { opacity: 0.4; }
    100% { transform: translate(40px, 26px); opacity: 0; }
  }

  @keyframes hdrift3 {
    0%   { transform: translate(18px, -26px); opacity: 0; }
    14%  { opacity: 0.85; }
    80%  { opacity: 0.45; }
    100% { transform: translate(-32px, 28px); opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .arcs,
    .sun-bands,
    .sun-glow,
    .particle,
    .hflow,
    .hstar,
    .hsun-glow,
    .hpool,
    .hzn-core,
    .hsway,
    .hcloud,
    .hp {
      animation: none !important;
    }
    .particle {
      transform: none;
      opacity: 0.45;
    }
    .hp {
      transform: none;
      opacity: 0.4;
    }
  }
</style>
