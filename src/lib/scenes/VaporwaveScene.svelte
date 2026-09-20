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
  // Keep the sun's gold-to-magenta gradient upright in bottom corners.
  const sunFix = $derived(corner.startsWith('bottom') ? 'scaleY(-1)' : 'none');

  // ---- deterministic geometry (SSR-safe, no browser APIs) ----
  const CX = 340;
  const CY = 0;

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

  const backRidge = ridgePath(
    [214, 168, 192, 152, 186, 162, 198, 146, 182, 166, 202, 158, 190, 176, 214],
    91, 179, 214
  );
  const frontRidge = ridgePath(
    [210, 184, 198, 168, 192, 174, 200, 160, 188, 172, 202, 180, 210],
    91, 179, 210
  );

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

    <!-- banded retro sun rising from behind the menu -->
    <div class="sun-glow"></div>
    <div class="sun" style:transform={sunFix}></div>

    <!-- wireframe mountain ranges on the horizon arc -->
    <svg class="mountains" viewBox="0 0 340 340">
      <path class="ridge-back" d={backRidge} />
      <path class="ridge-ghost" d={frontRidge} transform="translate(1.6 -1.1)" />
      <path class="ridge-front" d={frontRidge} />
      <circle class="horizon" cx={CX} cy={CY} r="212" />
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
  }

  .scene {
    position: absolute;
    inset: 0;
    /* dusk sky radiating from the corner, dissolving into the page */
    background: radial-gradient(
      circle 481px at 100% 0%,
      color-mix(in srgb, var(--slice-bg, #7b4bd6) 55%, var(--bg, #241046)) 0px,
      var(--bg, #241046) 210px,
      color-mix(in srgb, var(--bg, #241046) 60%, transparent) 340px,
      transparent 460px
    );
    /* whole scene emanates from the corner and fades out */
    -webkit-mask-image: radial-gradient(circle 481px at 100% 0%, #000 0 300px, transparent 468px);
    mask-image: radial-gradient(circle 481px at 100% 0%, #000 0 300px, transparent 468px);
  }

  .scene > * {
    position: absolute;
  }

  /* ---- corner halo behind the menu ---- */
  .halo {
    inset: 0;
    background: radial-gradient(
      circle 250px at 100% 0%,
      color-mix(in srgb, var(--slice-bg, #7b4bd6) 65%, transparent) 0%,
      color-mix(in srgb, var(--accent, #ff5ed1) 18%, transparent) 55%,
      transparent 100%
    );
  }

  /* ---- retro sun ---- */
  .sun-glow {
    left: 119px;
    top: -9px;
    width: 230px;
    height: 230px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--vapor-sun, #ffd36e) 50%, transparent) 0%,
      color-mix(in srgb, var(--accent, #ff5ed1) 26%, transparent) 45%,
      transparent 70%
    );
    animation: glowpulse 5.5s ease-in-out infinite alternate;
  }

  .sun {
    left: 179px;
    top: 51px;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: linear-gradient(
      to bottom,
      var(--vapor-sun, #ffd36e) 0%,
      var(--vapor-sun, #ffd36e) 32%,
      var(--accent, #ff5ed1) 100%
    );
    -webkit-mask-image: repeating-linear-gradient(to bottom, #000 0 8px, transparent 8px 12px);
    mask-image: repeating-linear-gradient(to bottom, #000 0 8px, transparent 8px 12px);
    animation: bands 6s linear infinite;
  }

  /* ---- mountains ---- */
  .mountains,
  .grid {
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  .mountains {
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
      circle 481px at 100% 0%,
      transparent 0 204px,
      rgba(0, 0, 0, 0.55) 238px,
      #000 305px
    );
    mask-image: radial-gradient(
      circle 481px at 100% 0%,
      transparent 0 204px,
      rgba(0, 0, 0, 0.55) 238px,
      #000 305px
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
    right: 150px;
    top: 150px;
    background: var(--accent, #ff5ed1);
    box-shadow: 0 0 10px 2px color-mix(in srgb, var(--accent, #ff5ed1) 75%, transparent);
    animation: drift1 11s linear infinite;
  }

  .p2 {
    width: 4px;
    height: 4px;
    right: 195px;
    top: 92px;
    background: var(--vapor-sun, #ffd36e);
    box-shadow: 0 0 9px 2px color-mix(in srgb, var(--vapor-sun, #ffd36e) 70%, transparent);
    animation: drift2 14s linear infinite;
    animation-delay: -4s;
  }

  .p3 {
    width: 3px;
    height: 3px;
    right: 92px;
    top: 200px;
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
    from { -webkit-mask-position: 0 0; mask-position: 0 0; }
    to   { -webkit-mask-position: 0 12px; mask-position: 0 12px; }
  }

  @keyframes glowpulse {
    from { opacity: 0.7; transform: scale(1); }
    to   { opacity: 1; transform: scale(1.06); }
  }

  @keyframes drift1 {
    0%   { transform: translate(70px, -70px); opacity: 0; }
    12%  { opacity: 0.9; }
    80%  { opacity: 0.5; }
    100% { transform: translate(-80px, 80px); opacity: 0; }
  }

  @keyframes drift2 {
    0%   { transform: translate(60px, -40px); opacity: 0; }
    15%  { opacity: 0.8; }
    82%  { opacity: 0.4; }
    100% { transform: translate(-70px, 60px); opacity: 0; }
  }

  @keyframes drift3 {
    0%   { transform: translate(40px, -55px); opacity: 0; }
    14%  { opacity: 0.85; }
    80%  { opacity: 0.45; }
    100% { transform: translate(-60px, 70px); opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .arcs,
    .sun,
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