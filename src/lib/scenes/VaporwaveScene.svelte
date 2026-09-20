<script lang="ts">
  let {
    corner = 'top-right',
    sectionId = 'projects'
  }: { corner?: string; sectionId?: string | null } = $props();

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
</script>

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

  @media (prefers-reduced-motion: reduce) {
    .arcs,
    .sun-bands,
    .sun-glow,
    .particle {
      animation: none !important;
    }
    .particle {
      transform: none;
      opacity: 0.45;
    }
  }
</style>
