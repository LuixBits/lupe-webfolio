<script lang="ts">
  // Decorative vaporwave footer crest — no props required.
  let {} = $props();
  // SSR-stable unique id for SVG defs (gradient + band mask).
  const uid = $props.id();
</script>

<div class="vw-crest" aria-hidden="true">
  <!-- purple sky haze above the horizon -->
  <div class="sky"></div>

  <!-- twinkling stars -->
  <div class="star s1"></div>
  <div class="star s2"></div>
  <div class="star s3"></div>
  <div class="star s4"></div>
  <div class="star s5"></div>

  <!-- sun bloom -->
  <div class="sun-glow"></div>

  <!-- banded synthwave sun -->
  <svg class="sun" viewBox="0 0 100 66" preserveAspectRatio="xMidYMax meet">
    <defs>
      <linearGradient id="{uid}-sunGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style="stop-color: var(--vapor-sun, #ffd36e)" />
        <stop offset="0.55" style="stop-color: var(--vapor-sun, #ffd36e)" />
        <stop offset="1" style="stop-color: var(--accent, #ff5ed1)" />
      </linearGradient>
      <mask id="{uid}-bands">
        <rect x="0" y="0" width="100" height="66" fill="#fff" />
        <g class="bands">
          <rect x="0" y="33" width="100" height="2" fill="#000" />
          <rect x="0" y="42" width="100" height="3" fill="#000" />
          <rect x="0" y="52" width="100" height="4" fill="#000" />
          <rect x="0" y="63" width="100" height="5" fill="#000" />
        </g>
      </mask>
    </defs>
    <circle
      cx="50"
      cy="36"
      r="33"
      fill="url(#{uid}-sunGrad)"
      mask="url(#{uid}-bands)"
    />
  </svg>

  <!-- receding neon grid floor -->
  <div class="floor-wrap">
    <div class="floor">
      <div class="floor-lines"></div>
    </div>
  </div>

  <!-- glowing horizon line -->
  <div class="horizon"></div>

  <!-- CRT scanlines -->
  <div class="scanlines"></div>
</div>

<style>
  .vw-crest {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    contain: strict;
    /* horizon sits 82px above the bottom → crest lives in the top ~92px */
    --vw-horizon: 82px;
  }

  /* ---------- sky ---------- */
  .sky {
    position: absolute;
    left: 0;
    right: 0;
    bottom: var(--vw-horizon);
    height: 74px;
    background: linear-gradient(
      to top,
      color-mix(in oklab, var(--slice-bg, #7b4bd6) 34%, transparent),
      color-mix(in oklab, var(--bg, #241046) 20%, transparent) 55%,
      transparent
    );
  }

  /* ---------- stars ---------- */
  .star {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--vapor-sun, #ffd36e);
    box-shadow: 0 0 6px 1px
      color-mix(in oklab, var(--vapor-sun, #ffd36e) 60%, transparent);
    opacity: 0.7;
    animation: twinkle 3.6s ease-in-out infinite;
  }
  .s1 { left: 12%; top: 14px; animation-delay: 0s; }
  .s2 { left: 26%; top: 34px; width: 2px; height: 2px; animation-delay: -1.2s; }
  .s3 { left: 71%; top: 20px; animation-delay: -2.1s; }
  .s4 {
    left: 85%;
    top: 40px;
    width: 2px;
    height: 2px;
    background: var(--vapor-grid, #ff5ed1);
    box-shadow: 0 0 6px 1px
      color-mix(in oklab, var(--vapor-grid, #ff5ed1) 60%, transparent);
    animation-delay: -0.6s;
  }
  .s5 { left: 40%; top: 8px; width: 2px; height: 2px; animation-delay: -2.8s; }

  @keyframes twinkle {
    0%, 100% { opacity: 0.25; transform: scale(0.8); }
    50% { opacity: 0.9; transform: scale(1); }
  }

  /* ---------- sun ---------- */
  .sun-glow {
    position: absolute;
    left: 50%;
    bottom: calc(var(--vw-horizon) - 52px);
    width: 220px;
    height: 190px;
    transform: translateX(-50%);
    background: radial-gradient(
      closest-side,
      color-mix(in oklab, var(--vapor-sun, #ffd36e) 34%, transparent),
      color-mix(in oklab, var(--accent, #ff5ed1) 18%, transparent) 45%,
      transparent 72%
    );
    animation: breathe 7s ease-in-out infinite;
    will-change: opacity;
  }

  @keyframes breathe {
    0%, 100% { opacity: 0.75; }
    50% { opacity: 1; }
  }

  .sun {
    position: absolute;
    left: 50%;
    bottom: var(--vw-horizon);
    width: 100px;
    height: 66px;
    transform: translateX(-50%);
    filter: drop-shadow(
      0 0 10px color-mix(in oklab, var(--vapor-sun, #ffd36e) 55%, transparent)
    );
  }

  .bands {
    animation: band-shift 6s ease-in-out infinite alternate;
  }

  @keyframes band-shift {
    from { transform: translateY(0); }
    to { transform: translateY(2.5px); }
  }

  /* ---------- grid floor ---------- */
  .floor-wrap {
    position: absolute;
    left: -14%;
    right: -14%;
    bottom: 0;
    height: var(--vw-horizon);
    overflow: hidden;
    perspective: 190px;
    perspective-origin: 50% 0%;
    mask-image: linear-gradient(
      to right,
      transparent,
      #000 14%,
      #000 86%,
      transparent
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent,
      #000 14%,
      #000 86%,
      transparent
    );
  }

  .floor {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 340px;
    transform: rotateX(58deg);
    transform-origin: 50% 0%;
    overflow: hidden;
    /* pink bloom rising from the horizon across the floor */
    background: linear-gradient(
      to bottom,
      color-mix(in oklab, var(--vapor-grid, #ff5ed1) 30%, transparent),
      color-mix(in oklab, var(--slice-bg, #7b4bd6) 14%, transparent) 30%,
      transparent 62%
    );
  }

  .floor-lines {
    position: absolute;
    left: 0;
    right: 0;
    top: -56px;
    height: calc(100% + 56px);
    background-image:
      /* soft under-glow for the horizontal lines */
      repeating-linear-gradient(
        to bottom,
        color-mix(in oklab, var(--vapor-grid, #ff5ed1) 35%, transparent) 0 5px,
        transparent 5px 56px
      ),
      /* crisp horizontal lines (these travel toward the viewer) */
      repeating-linear-gradient(
        to bottom,
        var(--vapor-grid, #ff5ed1) 0 2px,
        transparent 2px 56px
      ),
      /* soft under-glow for the vertical lines */
      repeating-linear-gradient(
        to right,
        color-mix(in oklab, var(--vapor-grid, #ff5ed1) 30%, transparent) 0 5px,
        transparent 5px 72px
      ),
      /* crisp vertical lines (converge to the vanishing point) */
      repeating-linear-gradient(
        to right,
        var(--vapor-grid, #ff5ed1) 0 2px,
        transparent 2px 72px
      );
    animation: floor-travel 2.8s linear infinite;
    will-change: transform;
  }

  @keyframes floor-travel {
    from { transform: translateY(0); }
    to { transform: translateY(56px); }
  }

  /* ---------- horizon ---------- */
  .horizon {
    position: absolute;
    left: 4%;
    right: 4%;
    bottom: calc(var(--vw-horizon) - 1px);
    height: 2px;
    background: linear-gradient(
      to right,
      transparent,
      var(--vapor-grid, #ff5ed1) 22%,
      var(--vapor-sun, #ffd36e) 50%,
      var(--vapor-grid, #ff5ed1) 78%,
      transparent
    );
    box-shadow:
      0 0 10px 1px color-mix(in oklab, var(--vapor-grid, #ff5ed1) 65%, transparent),
      0 0 26px 4px color-mix(in oklab, var(--accent, #ff5ed1) 30%, transparent);
  }

  /* ---------- scanlines ---------- */
  .scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      color-mix(in oklab, var(--hub-bg, #160a30) 65%, transparent) 0 1px,
      transparent 1px 4px
    );
    opacity: 0.22;
    mix-blend-mode: multiply;
  }

  /* ---------- reduced motion: freeze everything ---------- */
  @media (prefers-reduced-motion: reduce) {
    .star,
    .sun-glow,
    .bands,
    .floor-lines {
      animation: none;
    }
    .star {
      opacity: 0.6;
      transform: none;
    }
  }
</style>
