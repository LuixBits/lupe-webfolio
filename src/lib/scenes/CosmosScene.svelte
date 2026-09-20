<script lang="ts">
  let {
    corner = 'bottom-right',
    sectionId = 'hobbies'
  }: { corner?: string; sectionId?: string | null } = $props();

  /** Deterministic 0..1 hash — no Math.random anywhere. */
  function mix(n: number): number {
    let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
    x ^= x >>> 13;
    x = Math.imul(x, 0xc2b2ae35);
    x ^= x >>> 16;
    return (x >>> 0) / 4294967296;
  }

  /** Seed derived from sectionId so each section gets its own (stable) sky. */
  const seed = $derived.by(() => {
    const s = sectionId ?? 'cosmos';
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
    return h >>> 0;
  });

  const uid = $derived(`cz-${(corner || 'br').replace(/[^a-z]/g, '')}-${seed.toString(36)}`);

  type Star = { x: number; y: number; r: number; o: number; d: number; t: number };

  /**
   * Stars are laid out in polar coords around the corner point (340,340),
   * with density biased toward the corner so the field reads as emanating
   * inward from the menu. Design space is bottom-right; a wrapper flip
   * re-aims it for the other corners.
   */
  function layer(base: number, count: number, rMin: number, rMax: number): Star[] {
    const out: Star[] = [];
    for (let i = 0; i < count; i++) {
      const k = base + i * 11;
      const ang = Math.PI + (Math.PI / 2) * mix(seed + k); // 180deg..270deg quadrant
      const rad = 26 + 470 * Math.pow(mix(seed + k + 1), 0.6); // denser near corner
      out.push({
        x: +(340 + rad * Math.cos(ang)).toFixed(1),
        y: +(340 + rad * Math.sin(ang)).toFixed(1),
        r: +(rMin + (rMax - rMin) * mix(seed + k + 2)).toFixed(2),
        o: +(0.35 + 0.6 * mix(seed + k + 3)).toFixed(2),
        d: +(6 * mix(seed + k + 4)).toFixed(2),
        t: +(2.4 + 3.6 * mix(seed + k + 5)).toFixed(2)
      });
    }
    return out;
  }

  const farStars = $derived(layer(1, 46, 0.5, 1.0));
  const midStars = $derived(layer(997, 26, 0.8, 1.5));
  const nearStars = $derived(layer(5003, 13, 1.3, 2.3));

  /** Hand-placed constellation (a small "harp") in the inner sky, away from the menu. */
  const cPts = [
    { x: 92, y: 88 },
    { x: 146, y: 58 },
    { x: 198, y: 92 },
    { x: 182, y: 152 },
    { x: 116, y: 170 },
    { x: 150, y: 120 }
  ];
  const cEdges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 5], [5, 3], [5, 4]
  ];

  /** Scene is authored for bottom-right; mirror it for the other corners. */
  const flip = $derived(
    `scale(${corner.includes('left') ? -1 : 1}, ${corner.includes('top') ? -1 : 1})`
  );
</script>

<div class="cosmos" aria-hidden="true">
  <div class="scene" style={`transform:${flip}`}>
    <svg viewBox="0 0 340 340" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="{uid}-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color: var(--accent, #7fd4ff); stop-opacity: 0.22" />
          <stop offset="45%" style="stop-color: var(--accent, #7fd4ff); stop-opacity: 0.08" />
          <stop offset="100%" style="stop-color: var(--accent, #7fd4ff); stop-opacity: 0" />
        </radialGradient>
        <radialGradient id="{uid}-neb1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color: var(--cosmos-nebula, #7c5cff); stop-opacity: 0.55" />
          <stop offset="55%" style="stop-color: var(--cosmos-nebula, #7c5cff); stop-opacity: 0.2" />
          <stop offset="100%" style="stop-color: var(--cosmos-nebula, #7c5cff); stop-opacity: 0" />
        </radialGradient>
        <radialGradient id="{uid}-neb2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color: var(--cosmos-glint, #ff8ad9); stop-opacity: 0.4" />
          <stop offset="60%" style="stop-color: var(--cosmos-glint, #ff8ad9); stop-opacity: 0.12" />
          <stop offset="100%" style="stop-color: var(--cosmos-glint, #ff8ad9); stop-opacity: 0" />
        </radialGradient>
        <radialGradient id="{uid}-node" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color: var(--cosmos-star, #cfe6ff); stop-opacity: 0.9" />
          <stop offset="40%" style="stop-color: var(--cosmos-star, #cfe6ff); stop-opacity: 0.28" />
          <stop offset="100%" style="stop-color: var(--cosmos-star, #cfe6ff); stop-opacity: 0" />
        </radialGradient>
        <linearGradient id="{uid}-tail" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="-70" y2="-44">
          <stop offset="0%" style="stop-color: var(--cosmos-star, #cfe6ff); stop-opacity: 0.95" />
          <stop offset="35%" style="stop-color: var(--accent, #7fd4ff); stop-opacity: 0.45" />
          <stop offset="100%" style="stop-color: var(--accent, #7fd4ff); stop-opacity: 0" />
        </linearGradient>
        <filter id="{uid}-blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <!-- Accent halo pooling out of the corner, behind the radial menu -->
      <circle cx="340" cy="340" r="170" fill="url(#{uid}-halo)" />

      <!-- Nebula drifting inward from the corner -->
      <g class="neb" filter="url(#{uid}-blur)">
        <ellipse cx="252" cy="248" rx="118" ry="86" fill="url(#{uid}-neb1)" transform="rotate(-32 252 248)" />
        <ellipse cx="200" cy="292" rx="72" ry="46" fill="url(#{uid}-neb2)" transform="rotate(-20 200 292)" />
        <ellipse cx="296" cy="196" rx="60" ry="40" fill="url(#{uid}-neb2)" opacity="0.5" transform="rotate(-40 296 196)" />
      </g>

      <!-- Three parallax star layers -->
      <g class="layer far">
        {#each farStars as s, i (i)}
          <circle
            class="star"
            cx={s.x} cy={s.y} r={s.r}
            style={`--o:${s.o * 0.7}; animation-delay:${s.d}s; animation-duration:${s.t}s`}
          />
        {/each}
      </g>
      <g class="layer mid">
        {#each midStars as s, i (i)}
          <circle
            class="star"
            cx={s.x} cy={s.y} r={s.r}
            style={`--o:${s.o * 0.85}; animation-delay:${s.d}s; animation-duration:${s.t}s`}
          />
        {/each}
      </g>
      <g class="layer near">
        {#each nearStars as s, i (i)}
          <circle
            class="star"
            cx={s.x} cy={s.y} r={s.r}
            style={`--o:${s.o}; animation-delay:${s.d}s; animation-duration:${s.t}s`}
          />
        {/each}
      </g>

      <!-- Constellation with connecting lines -->
      <g class="constellation">
        {#each cEdges as [a, b], i (i)}
          <line class="cline" x1={cPts[a].x} y1={cPts[a].y} x2={cPts[b].x} y2={cPts[b].y} />
        {/each}
        {#each cPts as p, i (i)}
          <circle cx={p.x} cy={p.y} r="4.5" fill="url(#{uid}-node)" />
          <circle
            class="star"
            cx={p.x} cy={p.y} r="1.5"
            style={`--o:0.95; animation-delay:${(mix(seed + i * 31) * 4).toFixed(2)}s; animation-duration:${(3 + mix(seed + i * 37) * 2).toFixed(2)}s`}
          />
        {/each}
      </g>

      <!-- Four-point glints -->
      <path
        class="glint g1"
        d="M0 -6 L1.4 -1.4 L6 0 L1.4 1.4 L0 6 L-1.4 1.4 L-6 0 L-1.4 -1.4 Z"
        transform="translate(236 128)"
      />
      <path
        class="glint g2"
        d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z"
        transform="translate(84 216)"
      />

      <!-- Orbit rings framing the quarter-disc menu at the corner -->
      <circle class="ring r1" cx="340" cy="340" r="128" />
      <circle class="ring r2" cx="340" cy="340" r="154" />

      <!-- Shooting stars streaking toward the corner -->
      <g class="meteor m1">
        <line x1="0" y1="0" x2="-70" y2="-44" stroke="url(#{uid}-tail)" stroke-width="1.8" stroke-linecap="round" />
        <circle cx="0" cy="0" r="1.6" style="fill: var(--cosmos-glint, #ff8ad9)" />
      </g>
      <g class="meteor m2">
        <line x1="0" y1="0" x2="-70" y2="-44" stroke="url(#{uid}-tail)" stroke-width="1.3" stroke-linecap="round" />
        <circle cx="0" cy="0" r="1.2" style="fill: var(--cosmos-star, #cfe6ff)" />
      </g>
    </svg>
  </div>
</div>

<style>
  .cosmos {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    contain: strict;
  }

  .scene {
    position: absolute;
    inset: 0;
    /* Deep-night vignette pooling from the corner (fallback first, color-mix override) */
    background: radial-gradient(
      320px 320px at 100% 100%,
      rgba(11, 11, 42, 0.92) 0%,
      rgba(11, 11, 42, 0.5) 45%,
      rgba(11, 11, 42, 0) 72%
    );
    background: radial-gradient(
      320px 320px at 100% 100%,
      color-mix(in srgb, var(--bg, #0b0b2a) 92%, transparent) 0%,
      color-mix(in srgb, var(--bg, #0b0b2a) 50%, transparent) 45%,
      transparent 72%
    );
  }

  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  /* ---- stars ---- */
  .star {
    fill: var(--cosmos-star, #cfe6ff);
    opacity: var(--o, 0.8);
    animation: twinkle 3s ease-in-out infinite alternate;
  }
  @keyframes twinkle {
    from { opacity: calc(var(--o, 0.8) * 0.3); }
    to { opacity: var(--o, 0.8); }
  }

  /* ---- parallax drift (slow pan, different amplitude per depth) ---- */
  .layer { will-change: transform; }
  .far { animation: drift 34s ease-in-out infinite alternate; --amp: -4px; }
  .mid { animation: drift 24s ease-in-out infinite alternate; --amp: -8px; }
  .near { animation: drift 17s ease-in-out infinite alternate; --amp: -13px; }
  @keyframes drift {
    from { transform: translate(0, 0); }
    to { transform: translate(var(--amp, -6px), var(--amp, -6px)); }
  }

  /* ---- nebula breathing ---- */
  .neb {
    transform-box: fill-box;
    transform-origin: center;
    animation: breathe 16s ease-in-out infinite alternate;
  }
  @keyframes breathe {
    from { transform: scale(1); opacity: 0.85; }
    to { transform: scale(1.07); opacity: 1; }
  }

  /* ---- constellation ---- */
  .cline {
    stroke: var(--cosmos-star, #cfe6ff);
    stroke-width: 0.7;
    stroke-linecap: round;
    animation: linkPulse 9s ease-in-out infinite alternate;
  }
  @keyframes linkPulse {
    from { stroke-opacity: 0.16; }
    to { stroke-opacity: 0.42; }
  }

  /* ---- glints ---- */
  .glint {
    fill: var(--cosmos-glint, #ff8ad9);
    transform-box: fill-box;
    transform-origin: center;
    animation: glint 6s ease-in-out infinite;
  }
  .g2 { animation-delay: 2.7s; animation-duration: 7.5s; }
  @keyframes glint {
    0%, 100% { opacity: 0.15; scale: 0.7; }
    50% { opacity: 0.85; scale: 1; }
  }

  /* ---- corner rings framing the menu ---- */
  .ring {
    fill: none;
    stroke: var(--accent, #7fd4ff);
    transform-box: view-box;
    transform-origin: 100% 100%;
  }
  .r1 {
    stroke-width: 1;
    stroke-opacity: 0.3;
    stroke-dasharray: 3 8;
    animation: spin 70s linear infinite;
  }
  .r2 {
    stroke-width: 0.8;
    stroke-opacity: 0.16;
    stroke-dasharray: 1 12;
    animation: spin 110s linear infinite reverse;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ---- shooting stars ---- */
  .meteor { will-change: transform; }
  .m1 {
    --x0: 20px; --y0: 56px; --x1: 322px; --y1: 246px;
    animation: shoot 11s linear infinite;
    animation-delay: 1.5s;
  }
  .m2 {
    --x0: 116px; --y0: -12px; --x1: 356px; --y1: 139px;
    animation: shoot 17s linear infinite;
    animation-delay: 7s;
  }
  @keyframes shoot {
    0% { transform: translate(var(--x0), var(--y0)); opacity: 0; }
    4% { opacity: 1; }
    11% { transform: translate(var(--x1), var(--y1)); opacity: 0; }
    100% { transform: translate(var(--x1), var(--y1)); opacity: 0; }
  }

  /* ---- reduced motion: freeze the sky ---- */
  @media (prefers-reduced-motion: reduce) {
    .star,
    .layer,
    .neb,
    .cline,
    .glint,
    .ring,
    .meteor {
      animation: none;
    }
    .star { opacity: var(--o, 0.8); }
    .cline { stroke-opacity: 0.3; }
    .glint { opacity: 0.5; }
    .meteor { display: none; }
  }
</style>
