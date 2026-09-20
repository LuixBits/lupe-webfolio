<script lang="ts">
  import { onMount } from 'svelte';

  let {} = $props();

  // Deterministic pseudo-random from an index hash (SSR === client)
  const rand = (i: number, salt = 0): number => {
    let t = (i + 1) * 374761393 + (salt + 1) * 668265263;
    t = (t ^ (t >>> 13)) * 1274126177;
    t = (t ^ (t >>> 16)) >>> 0;
    return t / 4294967296;
  };

  type Star = { x: number; y: number; r: number; o: number; tw: number; td: number };

  // Edge-biased star fields: keep the ~46rem centered content column clear
  const makeStars = (count: number, salt: number, rMin: number, rMax: number): Star[] =>
    Array.from({ length: count }, (_, i) => {
      const u = rand(i, salt);
      const v = rand(i, salt + 7);
      const band = rand(i, salt + 13);
      let x: number;
      let y: number;
      if (band < 0.62) {
        // left / right vertical bands
        x = u < 0.5 ? u * 2 * 24 : 76 + (u - 0.5) * 2 * 24;
        y = v * 100;
      } else {
        // top / bottom horizontal bands
        x = u * 100;
        y = band < 0.81 ? v * 12 : 88 + v * 12;
      }
      return {
        x,
        y,
        r: rMin + rand(i, salt + 3) * (rMax - rMin),
        o: 0.25 + rand(i, salt + 5) * 0.55,
        tw: 2.6 + rand(i, salt + 11) * 4.2,
        td: rand(i, salt + 17) * 5
      };
    });

  const starsFar = makeStars(46, 1, 0.5, 1.1);
  const starsMid = makeStars(26, 2, 0.9, 1.6);
  const starsNear = makeStars(14, 3, 1.3, 2.2);

  // Small 4-point sparkles near the corners (deterministic)
  const glints = [
    { x: 130, y: 200, s: 1.0 },
    { x: 1330, y: 640, s: 0.8 },
    { x: 90, y: 620, s: 0.7 },
    { x: 1230, y: 320, s: 0.9 },
    { x: 320, y: 60, s: 0.65 }
  ];

  // Little constellation, top-left corner
  const constel = [
    [96, 96],
    [158, 138],
    [216, 108],
    [262, 166],
    [318, 152]
  ] as const;
  const constelPoints = constel.map((p) => p.join(',')).join(' ');

  let root: HTMLDivElement;

  onMount(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return; // calm static composition

    let alive = true;
    let ctx: { revert: () => void } | null = null;
    let onMove: ((e: PointerEvent) => void) | null = null;

    (async () => {
      const g = await import('gsap');
      const gsap = (g as any).gsap ?? (g as any).default;
      if (!alive || !root || !gsap) return;

      ctx = gsap.context(() => {
        // Slow celestial drift
        gsap.to('.planet-drift', { y: 12, duration: 13, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to('.moon-drift', { y: -10, x: 4, duration: 16, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to('.moonlet-drift', { y: 8, x: 5, duration: 11, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to('.wisp-a', { x: 18, duration: 26, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to('.wisp-b', { x: -22, y: -10, duration: 30, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to('.wisp-c', { y: 14, duration: 22, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to('.glint', {
          scale: 0.65,
          transformOrigin: '50% 50%',
          duration: 3.4,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          stagger: 0.9
        });

        // A slow comet crossing the upper-left frame
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 12, delay: 2.5 });
        tl.fromTo('.comet', { x: -160, y: 40, opacity: 0 }, { x: 470, y: 190, duration: 8, ease: 'none' }, 0)
          .to('.comet', { opacity: 0.9, duration: 1.4, ease: 'power1.in' }, 0)
          .to('.comet', { opacity: 0, duration: 1.6, ease: 'power1.out' }, 6.2);

        // Gentle mouse parallax, layered by depth
        const mk = (sel: string, d: number) => ({
          x: gsap.quickTo(sel, 'x', { duration: 1.2, ease: 'power2.out' }),
          y: gsap.quickTo(sel, 'y', { duration: 1.2, ease: 'power2.out' }),
          d
        });
        const layers = [mk('.layer-far', 6), mk('.layer-mid', 13), mk('.layer-near', 22)];
        onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          for (const l of layers) {
            l.x(-nx * l.d * 2);
            l.y(-ny * l.d * 2);
          }
        };
        window.addEventListener('pointermove', onMove, { passive: true });
      }, root);
    })();

    return () => {
      alive = false;
      if (onMove) window.removeEventListener('pointermove', onMove);
      ctx?.revert(); // kills every tween created in the context
    };
  });
</script>

<div class="cosmos" bind:this={root} aria-hidden="true">
  <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="cdl-planet" cx="34%" cy="30%" r="80%">
        <stop offset="0%" stop-color="var(--accent, #7fd4ff)" stop-opacity="0.85" />
        <stop offset="46%" stop-color="var(--cosmos-nebula, #7c5cff)" stop-opacity="0.45" />
        <stop offset="100%" stop-color="var(--bg, #0b0b2a)" stop-opacity="0.95" />
      </radialGradient>
      <radialGradient id="cdl-moon" cx="38%" cy="34%" r="75%">
        <stop offset="0%" stop-color="var(--cosmos-star, #cfe6ff)" stop-opacity="0.55" />
        <stop offset="70%" stop-color="var(--cosmos-star, #cfe6ff)" stop-opacity="0.12" />
        <stop offset="100%" stop-color="var(--bg, #0b0b2a)" stop-opacity="0.9" />
      </radialGradient>
      <radialGradient id="cdl-halo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="var(--accent, #7fd4ff)" stop-opacity="0.28" />
        <stop offset="100%" stop-color="var(--accent, #7fd4ff)" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="cdl-tail" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="var(--cosmos-glint, #ff8ad9)" stop-opacity="0" />
        <stop offset="62%" stop-color="var(--cosmos-glint, #ff8ad9)" stop-opacity="0.35" />
        <stop offset="100%" stop-color="var(--cosmos-star, #cfe6ff)" stop-opacity="0.95" />
      </linearGradient>
      <filter id="cdl-soft" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="22" />
      </filter>
    </defs>

    <!-- ============ FAR LAYER: nebula wisps + faint stars ============ -->
    <g class="layer-far">
      <path
        class="wisp-a"
        d="M -80 210 C 90 240, 150 330, 70 430 C 10 500, 60 570, -60 610 Z"
        fill="var(--cosmos-nebula, #7c5cff)"
        opacity="0.12"
        filter="url(#cdl-soft)"
      />
      <path
        class="wisp-b"
        d="M 1520 560 C 1360 570, 1300 660, 1370 740 C 1420 800, 1360 880, 1520 900 Z"
        fill="var(--cosmos-nebula, #7c5cff)"
        opacity="0.11"
        filter="url(#cdl-soft)"
      />
      <path
        class="wisp-c"
        d="M 260 -60 C 330 30, 480 20, 560 -40 C 480 -70, 330 -90, 260 -60 Z"
        fill="var(--cosmos-glint, #ff8ad9)"
        opacity="0.07"
        filter="url(#cdl-soft)"
      />
      <!-- wide orbital arc grazing the top-right corner -->
      <path
        d="M 1010 -40 A 430 430 0 0 0 1480 330"
        fill="none"
        stroke="var(--accent, #7fd4ff)"
        stroke-width="1"
        opacity="0.16"
      />
      {#each starsFar as s, i (i)}
        <circle
          class="star"
          cx={s.x * 14.4}
          cy={s.y * 9}
          r={s.r}
          fill="var(--cosmos-star, #cfe6ff)"
          style={`opacity:${s.o};--o:${s.o};--tw:${s.tw}s;--td:${s.td}s`}
        />
      {/each}
    </g>

    <!-- ============ MID LAYER: moon, moonlet, constellation ============ -->
    <g class="layer-mid">
      {#each starsMid as s, i (i)}
        <circle
          class="star"
          cx={s.x * 14.4}
          cy={s.y * 9}
          r={s.r}
          fill="var(--cosmos-star, #cfe6ff)"
          style={`opacity:${s.o};--o:${s.o};--tw:${s.tw}s;--td:${s.td}s`}
        />
      {/each}

      <!-- constellation, top-left -->
      <g opacity="0.5">
        <polyline
          points={constelPoints}
          fill="none"
          stroke="var(--cosmos-star, #cfe6ff)"
          stroke-width="0.8"
          opacity="0.45"
        />
        {#each constel as p, i (i)}
          <circle cx={p[0]} cy={p[1]} r={i === 2 ? 2.6 : 1.8} fill="var(--cosmos-star, #cfe6ff)" opacity="0.85" />
        {/each}
      </g>

      <!-- moon, bottom-left corner -->
      <g class="moon-drift">
        <g transform="translate(160 764)">
          <circle r="70" fill="url(#cdl-halo)" />
          <circle r="46" fill="url(#cdl-moon)" />
          <circle r="46" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="1" opacity="0.4" />
          <!-- terminator line -->
          <path d="M 8 -45.3 A 46 46 0 0 1 8 45.3 A 60 46 0 0 0 8 -45.3 Z"
            fill="var(--bg, #0b0b2a)" opacity="0.55" />
          <!-- craters, editorial line work -->
          <circle cx="-14" cy="-10" r="8" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.8" opacity="0.35" />
          <circle cx="-2" cy="18" r="5" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.8" opacity="0.3" />
          <circle cx="-26" cy="14" r="3.4" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.7" opacity="0.28" />
        </g>
      </g>

      <!-- tiny ringed moonlet, mid-left edge -->
      <g class="moonlet-drift">
        <g transform="translate(58 386) rotate(-24)">
          <ellipse rx="30" ry="8.5" fill="none" stroke="var(--cosmos-glint, #ff8ad9)" stroke-width="0.9" opacity="0.4" />
          <circle r="13" fill="url(#cdl-moon)" />
          <circle r="13" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.8" opacity="0.45" />
          <path d="M -30 0 A 30 8.5 0 0 0 30 0" fill="none" stroke="var(--cosmos-glint, #ff8ad9)" stroke-width="0.9" opacity="0.6" />
        </g>
      </g>
    </g>

    <!-- ============ NEAR LAYER: ringed planet, comet, glints ============ -->
    <g class="layer-near">
      {#each starsNear as s, i (i)}
        <circle
          class="star"
          cx={s.x * 14.4}
          cy={s.y * 9}
          r={s.r}
          fill="var(--cosmos-star, #cfe6ff)"
          style={`opacity:${s.o};--o:${s.o};--tw:${s.tw}s;--td:${s.td}s`}
        />
      {/each}

      <!-- ringed planet, top-right corner -->
      <g class="planet-drift">
        <g transform="translate(1252 132) rotate(-16)">
          <circle r="112" fill="url(#cdl-halo)" />
          <!-- back half of rings -->
          <path d="M -118 0 A 118 30 0 0 1 118 0" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="1.1" opacity="0.35" />
          <path d="M -134 0 A 134 37 0 0 1 134 0" fill="none" stroke="var(--accent, #7fd4ff)" stroke-width="0.8" opacity="0.22" />
          <!-- body -->
          <circle r="68" fill="url(#cdl-planet)" opacity="0.9" />
          <circle r="68" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="1" opacity="0.35" />
          <!-- latitude line work -->
          <path d="M -63 -24 A 90 34 0 0 1 63 -24" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.8" opacity="0.28" />
          <path d="M -67 6 A 96 30 0 0 1 67 6" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.8" opacity="0.24" />
          <path d="M -58 34 A 80 26 0 0 1 58 34" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.8" opacity="0.2" />
          <!-- front half of rings -->
          <path d="M -118 0 A 118 30 0 0 0 118 0" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="1.4" opacity="0.65" />
          <path d="M -134 0 A 134 37 0 0 0 134 0" fill="none" stroke="var(--accent, #7fd4ff)" stroke-width="0.9" opacity="0.4" />
          <path d="M -150 0 A 150 44 0 0 0 150 0" fill="none" stroke="var(--cosmos-glint, #ff8ad9)" stroke-width="0.7" opacity="0.25" />
        </g>
      </g>

      <!-- comet: outer g is GSAP-translated, inner g sets travel angle -->
      <g transform="translate(240 90)">
        <g class="comet" opacity="0">
          <g transform="rotate(15)">
            <path d="M -128 0 L 0 -2.6 L 0 2.6 Z" fill="url(#cdl-tail)" />
            <circle r="7" fill="var(--cosmos-glint, #ff8ad9)" opacity="0.25" />
            <circle r="3" fill="var(--cosmos-star, #cfe6ff)" />
          </g>
        </g>
      </g>

      <!-- four-point sparkles -->
      {#each glints as p, i (i)}
        <path
          class="glint"
          d="M 0 -7 L 1.6 -1.6 L 7 0 L 1.6 1.6 L 0 7 L -1.6 1.6 L -7 0 L -1.6 -1.6 Z"
          transform={`translate(${p.x} ${p.y}) scale(${p.s})`}
          fill="var(--cosmos-glint, #ff8ad9)"
          opacity="0.55"
        />
      {/each}
    </g>
  </svg>
</div>

<style>
  .cosmos {
    position: fixed;
    inset: 0;
    z-index: 6;
    pointer-events: none;
    overflow: hidden;
    contain: strict;
  }

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .layer-far,
  .layer-mid,
  .layer-near {
    will-change: transform;
  }

  /* CSS twinkle only when motion is welcome; GSAP handles the rest */
  @media (prefers-reduced-motion: no-preference) {
    .star {
      animation: twinkle var(--tw, 3s) ease-in-out var(--td, 0s) infinite alternate;
    }
  }

  @keyframes twinkle {
    from {
      opacity: var(--o, 0.6);
    }
    to {
      opacity: calc(var(--o, 0.6) * 0.3);
    }
  }
</style>