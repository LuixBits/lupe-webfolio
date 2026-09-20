<script lang="ts">
  // Decorative vaporwave footer crest — no props required.
  let {} = $props();
  // SSR-stable unique id for SVG defs (gradients + band mask).
  const uid = $props.id();
</script>

<div class="vw-crest" aria-hidden="true">
  <!-- purple sky haze above the horizon -->
  <div class="sky"></div>
  <!-- warm sun-gradient band hugging the horizon -->
  <div class="sky-warm"></div>

  <!-- horizontal synth-cloud streaks (fade out at both ends) -->
  <div class="cloud c1"></div>
  <div class="cloud c2"></div>
  <div class="cloud c3"></div>

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

  <!-- palm silhouettes standing on the grid (complete, base mounds included) -->
  <svg class="palms" viewBox="0 0 200 152" preserveAspectRatio="xMidYMax meet">
    <g class="palm palm-a">
      <ellipse class="mound" cx="62" cy="146" rx="17" ry="4" />
      <path
        class="trunk"
        d="M 55 146 C 56 116 52 84 55 56 L 63 54 C 61 86 64 116 69 146 Z"
      />
      <g transform="translate(58 53)">
        <g class="fronds">
          <path class="frond" transform="rotate(-82)"
            d="M 0 0 C 12 -12 30 -14 45 -4 C 31 -10 16 -6 3 3 Z" />
          <path class="frond" transform="rotate(-56)"
            d="M 0 0 C 12 -13 30 -13 46 0 C 32 -8 16 -6 3 3 Z" />
          <path class="frond" transform="rotate(-28)"
            d="M 0 0 C 12 -13 30 -13 46 0 C 32 -8 16 -6 3 3 Z" />
          <path class="frond" transform="rotate(-4)"
            d="M 0 0 C 12 -13 30 -13 47 2 C 32 -8 16 -6 3 3 Z" />
          <path class="frond" transform="rotate(18)"
            d="M 0 0 C 12 -12 28 -11 43 4 C 30 -6 15 -5 3 3 Z" />
          <g transform="scale(-1 1)">
            <path class="frond" transform="rotate(-58)"
              d="M 0 0 C 12 -13 30 -13 46 0 C 32 -8 16 -6 3 3 Z" />
            <path class="frond" transform="rotate(-30)"
              d="M 0 0 C 12 -13 30 -13 46 0 C 32 -8 16 -6 3 3 Z" />
            <path class="frond" transform="rotate(-5)"
              d="M 0 0 C 12 -13 30 -13 47 2 C 32 -8 16 -6 3 3 Z" />
            <path class="frond" transform="rotate(17)"
              d="M 0 0 C 12 -12 28 -11 43 4 C 30 -6 15 -5 3 3 Z" />
          </g>
        </g>
      </g>
    </g>
    <g class="palm palm-b" transform="translate(104 42) scale(0.72)">
      <ellipse class="mound" cx="62" cy="147" rx="16" ry="4" />
      <path
        class="trunk"
        d="M 56 147 C 55 118 58 86 55 57 L 63 55 C 67 87 65 118 68 147 Z"
      />
      <g transform="translate(59 54)">
        <g class="fronds">
          <path class="frond" transform="rotate(-84)"
            d="M 0 0 C 12 -12 30 -14 44 -4 C 30 -10 15 -6 3 3 Z" />
          <path class="frond" transform="rotate(-52)"
            d="M 0 0 C 12 -13 30 -13 45 0 C 31 -8 15 -6 3 3 Z" />
          <path class="frond" transform="rotate(-22)"
            d="M 0 0 C 12 -13 30 -13 45 1 C 31 -8 15 -6 3 3 Z" />
          <path class="frond" transform="rotate(8)"
            d="M 0 0 C 12 -12 28 -11 42 4 C 29 -6 14 -5 3 3 Z" />
          <g transform="scale(-1 1)">
            <path class="frond" transform="rotate(-54)"
              d="M 0 0 C 12 -13 30 -13 45 0 C 31 -8 15 -6 3 3 Z" />
            <path class="frond" transform="rotate(-24)"
              d="M 0 0 C 12 -13 30 -13 45 1 C 31 -8 15 -6 3 3 Z" />
            <path class="frond" transform="rotate(10)"
              d="M 0 0 C 12 -12 28 -11 42 4 C 29 -6 14 -5 3 3 Z" />
          </g>
        </g>
      </g>
    </g>
  </svg>

  <!-- outrun car cruising the grid: complete silhouette, neon rim light -->
  <div class="car-drift">
    <div class="car-bob">
      <svg class="car" viewBox="0 0 300 84" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="{uid}-rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" style="stop-color: var(--vapor-sun, #ffd36e)" />
            <stop offset="0.45" style="stop-color: var(--accent, #ff5ed1)" />
            <stop offset="1" style="stop-color: var(--vapor-grid, #ff5ed1)" />
          </linearGradient>
          <linearGradient id="{uid}-streak" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" style="stop-color: #ff3b6f" stop-opacity="0.9" />
            <stop offset="1" style="stop-color: #ff3b6f" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="{uid}-glass" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" style="stop-color: var(--sub-bg, #35e6e6)" stop-opacity="0.65" />
            <stop offset="1" style="stop-color: var(--slice-bg, #7b4bd6)" stop-opacity="0.35" />
          </linearGradient>
          <radialGradient id="{uid}-under" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" style="stop-color: var(--accent, #ff5ed1)" stop-opacity="0.65" />
            <stop offset="1" style="stop-color: var(--accent, #ff5ed1)" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- neon underglow + wheel contact shadows ground the car on the road -->
        <ellipse class="underglow" cx="126" cy="77" rx="108" ry="5.5" fill="url(#{uid}-under)" />
        <ellipse class="wshadow" cx="58" cy="77.5" rx="15" ry="2.4" />
        <ellipse class="wshadow" cx="196" cy="77.5" rx="15" ry="2.4" />

        <!-- tail-light streaks trailing behind (deliberate fade, never clipped) -->
        <g class="streaks">
          <rect x="243" y="37.5" width="52" height="1.6" rx="0.8" fill="url(#{uid}-streak)" />
          <rect x="245" y="43" width="42" height="1.3" rx="0.65" fill="url(#{uid}-streak)" opacity="0.65" />
        </g>

        <!-- body silhouette -->
        <path
          class="body"
          d="M 14 59 L 9 52 Q 8 47 17 46 C 40 43.5 75 40.5 106 38.5 L 112 37.5
             L 134 24 Q 139 22.5 145 22.5 L 161 22.5 Q 168 23 174 26 L 191 31.5
             L 236 34 L 241 36 L 242 47 L 238 56 L 212 59
             A 17 17 0 0 0 180 59 L 74 59 A 17 17 0 0 0 42 59 L 14 59 Z"
        />
        <!-- glasshouse -->
        <path
          class="glass"
          fill="url(#{uid}-glass)"
          d="M 117 36.8 L 135 25.7 Q 140 24.2 146 24.2 L 160 24.2
             Q 167 24.7 172 27.2 L 186 31.6 L 176 33 L 122 36.4 Z"
        />
        <path class="pillar" d="M 137 25.2 L 121 36.5" />
        <!-- door strakes -->
        <g class="strakes">
          <path d="M 104 46 L 176 44" />
          <path d="M 106 50 L 178 48" />
          <path d="M 108 54 L 180 52" />
        </g>
        <!-- closed pop-up headlight seam + front marker -->
        <path class="seam" d="M 21 45.4 L 36 44.6" />
        <circle class="marker" cx="10.5" cy="49.5" r="1.1" />
        <!-- neon rim light along the top profile -->
        <path
          class="rim-line"
          d="M 9 52 Q 8 47 17 46 C 40 43.5 75 40.5 106 38.5 L 112 37.5
             L 134 24 Q 139 22.5 145 22.5 L 161 22.5 Q 168 23 174 26 L 191 31.5
             L 236 34 L 241 36"
          fill="none"
          stroke="url(#{uid}-rim)"
        />
        <!-- cyan rocker glow -->
        <path class="rocker" d="M 77 58.6 L 177 58.6" />
        <!-- glowing tail-lights on the rear face -->
        <rect class="tail-light" x="240.2" y="36.8" width="2.4" height="4" rx="0.9" />
        <rect class="tail-light" x="240.4" y="42.4" width="2.4" height="4" rx="0.9" />

        <!-- wheels -->
        <g class="wheel">
          <circle class="tire" cx="58" cy="64" r="12.5" />
          <circle class="rim" cx="58" cy="64" r="7" />
          <g transform="translate(58 64)">
            <g class="spokes">
              <line x1="0" y1="-2.2" x2="0" y2="-6.2" />
              <line transform="rotate(72)" x1="0" y1="-2.2" x2="0" y2="-6.2" />
              <line transform="rotate(144)" x1="0" y1="-2.2" x2="0" y2="-6.2" />
              <line transform="rotate(216)" x1="0" y1="-2.2" x2="0" y2="-6.2" />
              <line transform="rotate(288)" x1="0" y1="-2.2" x2="0" y2="-6.2" />
            </g>
          </g>
          <circle class="hub" cx="58" cy="64" r="1.5" />
        </g>
        <g class="wheel">
          <circle class="tire" cx="196" cy="64" r="12.5" />
          <circle class="rim" cx="196" cy="64" r="7" />
          <g transform="translate(196 64)">
            <g class="spokes">
              <line x1="0" y1="-2.2" x2="0" y2="-6.2" />
              <line transform="rotate(72)" x1="0" y1="-2.2" x2="0" y2="-6.2" />
              <line transform="rotate(144)" x1="0" y1="-2.2" x2="0" y2="-6.2" />
              <line transform="rotate(216)" x1="0" y1="-2.2" x2="0" y2="-6.2" />
              <line transform="rotate(288)" x1="0" y1="-2.2" x2="0" y2="-6.2" />
            </g>
          </g>
          <circle class="hub" cx="196" cy="64" r="1.5" />
        </g>
      </svg>
    </div>
  </div>

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

  .sky-warm {
    position: absolute;
    left: 0;
    right: 0;
    bottom: var(--vw-horizon);
    height: 34px;
    background: linear-gradient(
      to top,
      color-mix(in oklab, var(--vapor-sun, #ffd36e) 18%, transparent),
      color-mix(in oklab, var(--accent, #ff5ed1) 9%, transparent) 55%,
      transparent
    );
  }

  /* ---------- synth clouds ---------- */
  .cloud {
    position: absolute;
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(
      to right,
      transparent,
      color-mix(in oklab, var(--accent, #ff5ed1) 55%, transparent) 30%,
      color-mix(in oklab, var(--accent, #ff5ed1) 55%, transparent) 70%,
      transparent
    );
    opacity: 0.38;
  }
  .c1 { left: 13%; top: 22px; width: min(180px, 20vw); }
  .c2 { left: 60%; top: 32px; width: min(200px, 22vw); }
  .c3 { right: 4%; top: 7px; width: min(130px, 15vw); opacity: 0.3; }

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
    left: 77%;
    top: 12px;
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

  /* ---------- palms ---------- */
  .palms {
    position: absolute;
    /* keep clear of the bottom-left docked radial menu at narrow widths */
    left: clamp(230px, 21%, 420px);
    bottom: 66px;
    width: 112px;
    height: auto;
  }
  .palm .trunk,
  .palm .frond,
  .palm .mound {
    fill: #170a2e;
  }
  .palm .mound {
    opacity: 0.9;
  }
  .fronds {
    transform-box: fill-box;
    transform-origin: 50% 100%;
    animation: sway 9s ease-in-out infinite alternate;
  }
  .palm-b .fronds {
    animation-duration: 11s;
    animation-delay: -4s;
  }

  @keyframes sway {
    from { transform: rotate(-1.4deg); }
    to { transform: rotate(1.4deg); }
  }

  @media (max-width: 47.5rem) {
    .palms { display: none; }
    .c1 { display: none; }
  }

  /* ---------- outrun car ---------- */
  .car-drift {
    position: absolute;
    right: 3.5%;
    bottom: 63px;
    width: clamp(142px, 22vw, 230px);
    animation: drift 16s ease-in-out infinite alternate;
    will-change: transform;
  }
  .car-bob {
    animation: bob 2.6s ease-in-out infinite alternate;
    will-change: transform;
  }
  .car {
    display: block;
    width: 100%;
    height: auto;
  }

  @keyframes drift {
    from { transform: translateX(-12px); }
    to { transform: translateX(8px); }
  }
  @keyframes bob {
    from { transform: translateY(0); }
    to { transform: translateY(-1.2px); }
  }

  .car .body {
    fill: #14082b;
    stroke: color-mix(in oklab, var(--slice-bg, #7b4bd6) 45%, transparent);
    stroke-width: 0.6;
  }
  .car .pillar {
    stroke: #14082b;
    stroke-width: 1.6;
    fill: none;
  }
  .car .strakes path {
    stroke: color-mix(in oklab, var(--accent, #ff5ed1) 40%, transparent);
    stroke-width: 1.1;
    stroke-linecap: round;
    fill: none;
  }
  .car .seam {
    stroke: color-mix(in oklab, var(--sub-bg, #35e6e6) 45%, transparent);
    stroke-width: 0.9;
    stroke-linecap: round;
    fill: none;
  }
  .car .marker {
    fill: var(--vapor-sun, #ffd36e);
    opacity: 0.9;
  }
  .car .rim-line {
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
    filter: drop-shadow(
      0 0 3.5px color-mix(in oklab, var(--accent, #ff5ed1) 70%, transparent)
    );
  }
  .car .rocker {
    stroke: var(--sub-bg, #35e6e6);
    stroke-width: 1.2;
    stroke-linecap: round;
    fill: none;
    opacity: 0.85;
    filter: drop-shadow(
      0 0 3px color-mix(in oklab, var(--sub-bg, #35e6e6) 70%, transparent)
    );
  }
  .car .tail-light {
    fill: #ff3b6f;
    filter: drop-shadow(0 0 4px #ff2d6a);
    animation: tail-pulse 3.2s ease-in-out infinite;
  }
  .car .streaks {
    animation: tail-pulse 3.2s ease-in-out infinite;
  }

  @keyframes tail-pulse {
    0%, 100% { opacity: 0.75; }
    50% { opacity: 1; }
  }

  .car .wshadow {
    fill: #08031a;
    opacity: 0.75;
  }
  .car .tire {
    fill: #0a0518;
    stroke: #2a1650;
    stroke-width: 1;
  }
  .car .rim {
    fill: #120a2a;
    stroke: var(--sub-bg, #35e6e6);
    stroke-width: 1.3;
    filter: drop-shadow(
      0 0 3px color-mix(in oklab, var(--sub-bg, #35e6e6) 60%, transparent)
    );
  }
  .car .spokes {
    transform-box: fill-box;
    transform-origin: center;
    animation: spin 1.6s linear infinite;
  }
  .car .spokes line {
    stroke: color-mix(in oklab, var(--sub-bg, #35e6e6) 75%, transparent);
    stroke-width: 1.2;
    stroke-linecap: round;
  }
  .car .hub {
    fill: var(--sub-bg, #35e6e6);
    opacity: 0.9;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
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
    .floor-lines,
    .fronds,
    .car-drift,
    .car-bob,
    .car .tail-light,
    .car .streaks,
    .car .spokes {
      animation: none;
    }
    .star {
      opacity: 0.6;
      transform: none;
    }
  }
</style>
