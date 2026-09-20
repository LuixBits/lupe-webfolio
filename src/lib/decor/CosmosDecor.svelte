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

  // Star-chart ring (astrolabe) tick marks — pure trig of fixed indices, deterministic
  const chartTicks = Array.from({ length: 48 }, (_, i) => {
    const a = (i * Math.PI * 2) / 48;
    const major = i % 4 === 0;
    const r0 = major ? 96 : 101;
    return {
      x1: Math.cos(a) * r0,
      y1: Math.sin(a) * r0,
      x2: Math.cos(a) * 108,
      y2: Math.sin(a) * 108,
      major
    };
  });

  // Dust particles trailing the comet (local coords, tail extends toward -x)
  const cometDust = Array.from({ length: 9 }, (_, i) => {
    const x = -16 - rand(i, 21) * 100;
    return {
      x,
      y: (rand(i, 23) - 0.5) * 2 * (2.5 + -x * 0.055),
      r: 0.7 + rand(i, 29) * 1.2,
      o: 0.2 + rand(i, 31) * 0.5
    };
  });

  // Drone motor positions (top-down X-frame)
  const motors = [
    [-38, -38],
    [38, -38],
    [38, 38],
    [-38, 38]
  ] as const;

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

        // Hobby props: drone hovers, rotors spin, LEDs pulse
        gsap.to('.drone-hover', {
          y: 10,
          x: -6,
          rotation: 2,
          transformOrigin: '50% 50%',
          duration: 5.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut'
        });
        gsap.to('.rotor', { rotation: 360, duration: 1.8, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
        gsap.to('.led', { opacity: 0.2, duration: 1.15, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.55 });

        // Origami crane drifts like paper on a thermal
        gsap.to('.crane-drift', {
          y: 9,
          rotation: 3,
          transformOrigin: '50% 50%',
          duration: 8,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut'
        });

        // Owl: gentle branch sway + a blink every few seconds
        gsap.to('.owl-drift', { y: -5, duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        const blink = gsap.timeline({ repeat: -1, repeatDelay: 4.6, delay: 3.2 });
        blink
          .to('.owl-eye', { opacity: 0.12, duration: 0.09, ease: 'power1.in' })
          .to('.owl-eye', { opacity: 0.95, duration: 0.16, ease: 'power1.out' });

        // Star-chart rete creeps around; telescope objective breathes
        gsap.to('.chart-rete', { rotation: 360, duration: 160, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
        gsap.to('.scope-glow', {
          scale: 0.8,
          opacity: 0.55,
          transformOrigin: '50% 50%',
          duration: 4.2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut'
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
            l.x(-nx * l.d * 1.1);
            l.y(-ny * l.d * 1.1);
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
      <!-- brushed metal for the telescope tube (runs across the tube's height) -->
      <linearGradient id="cdl-tube" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--cosmos-star, #cfe6ff)" stop-opacity="0.5" />
        <stop offset="40%" stop-color="var(--cosmos-nebula, #7c5cff)" stop-opacity="0.3" />
        <stop offset="100%" stop-color="var(--bg, #0b0b2a)" stop-opacity="0.92" />
      </linearGradient>
      <!-- shell material for the drone body / owl plumage -->
      <radialGradient id="cdl-shell" cx="35%" cy="28%" r="90%">
        <stop offset="0%" stop-color="var(--cosmos-star, #cfe6ff)" stop-opacity="0.45" />
        <stop offset="55%" stop-color="var(--cosmos-nebula, #7c5cff)" stop-opacity="0.26" />
        <stop offset="100%" stop-color="var(--bg, #0b0b2a)" stop-opacity="0.95" />
      </radialGradient>
      <!-- hot glow core for owl eyes / camera lens -->
      <radialGradient id="cdl-eye" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
        <stop offset="32%" stop-color="var(--accent, #7fd4ff)" stop-opacity="0.8" />
        <stop offset="100%" stop-color="var(--accent, #7fd4ff)" stop-opacity="0" />
      </radialGradient>
      <!-- moonlit paper for the origami crane -->
      <linearGradient id="cdl-paper" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="var(--cosmos-star, #cfe6ff)" stop-opacity="0.34" />
        <stop offset="100%" stop-color="var(--cosmos-nebula, #7c5cff)" stop-opacity="0.16" />
      </linearGradient>
      <filter id="cdl-blur1" x="-15%" y="-15%" width="130%" height="130%">
        <feGaussianBlur stdDeviation="0.7" />
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

      <!-- star-chart ring (astrolabe), left margin — far, faint, slightly soft -->
      <g opacity="0.3" filter="url(#cdl-blur1)">
        <g transform="translate(175 555)">
          <circle r="112" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="1" />
          <circle r="96" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.7" opacity="0.7" />
          <circle r="104" fill="none" stroke="var(--cosmos-nebula, #7c5cff)" stroke-width="15" opacity="0.16" />
          {#each chartTicks as t, i (i)}
            <line
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="var(--cosmos-star, #cfe6ff)"
              stroke-width={t.major ? 1 : 0.5}
              opacity={t.major ? 0.9 : 0.5}
            />
          {/each}
          {#each [45, 135, 225, 315] as a (a)}
            <path
              d="M -6 0 L 0 3 L 6 0 L 0 -3 Z"
              transform={`rotate(${a}) translate(104 0)`}
              fill="var(--accent, #7fd4ff)"
              opacity="0.8"
            />
          {/each}
          <!-- offset ecliptic circle -->
          <circle cx="12" cy="-10" r="52" fill="none" stroke="var(--cosmos-glint, #ff8ad9)" stroke-width="0.7" opacity="0.5" />
          <!-- rotating rete: dashed sky circle, rule lines, pointer arm, chart stars -->
          <g class="chart-rete">
            <circle r="68" fill="none" stroke="var(--accent, #7fd4ff)" stroke-width="0.8" stroke-dasharray="3 6" opacity="0.8" />
            <line x1="-96" y1="0" x2="96" y2="0" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.7" opacity="0.55" />
            <line x1="0" y1="-96" x2="0" y2="96" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.7" opacity="0.3" />
            <path d="M 88 0 L -22 4.5 L -38 0 L -22 -4.5 Z" fill="var(--cosmos-glint, #ff8ad9)" opacity="0.5" />
            <path d="M 34 -22 Q 0 8 -18 40" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.5" opacity="0.45" />
            <circle cx="34" cy="-22" r="2" fill="var(--cosmos-star, #cfe6ff)" opacity="0.9" />
            <circle cx="-18" cy="40" r="1.6" fill="var(--cosmos-star, #cfe6ff)" opacity="0.8" />
            <circle cx="-42" cy="-30" r="1.4" fill="var(--cosmos-glint, #ff8ad9)" opacity="0.85" />
          </g>
        </g>
      </g>
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

      <!-- night owl on a branch, right edge (wildlife) -->
      <g class="owl-drift">
        <g transform="translate(1398 676)">
          <!-- branch entering from the right edge -->
          <path
            d="M 50 26 C 22 21, -6 24, -32 18 C -42 15.5, -50 17, -58 21"
            fill="none"
            stroke="var(--cosmos-star, #cfe6ff)"
            stroke-width="2"
            stroke-linecap="round"
            opacity="0.45"
          />
          <path
            d="M -32 18 C -38 25, -48 29, -58 30"
            fill="none"
            stroke="var(--cosmos-star, #cfe6ff)"
            stroke-width="1"
            stroke-linecap="round"
            opacity="0.3"
          />
          <g transform="translate(-12 2)">
            <!-- silhouette: ear tufts, head, plump body -->
            <path
              d="M -19 -53 C -14.5 -51 -11.5 -48.5 -10 -45 C -16 -43 -20 -37 -21.5 -29 C -24 -11 -21 5 -12 12 C -5 17 9 17 15 12 C 23 5 25 -11 22.5 -29 C 21 -37 17 -43 11 -45 C 12.5 -48.5 15.5 -51 20 -53 C 15.5 -51.5 11 -49.5 8 -48.5 C 3.5 -50.5 -4.5 -50.5 -9 -48.5 C -12 -49.5 -16.5 -51.5 -19 -53 Z"
              fill="url(#cdl-shell)"
              stroke="var(--cosmos-star, #cfe6ff)"
              stroke-width="1"
              opacity="0.9"
            />
            <!-- moonlit rim on the left flank -->
            <path
              d="M -21.5 -29 C -24 -11 -21 5 -12 12"
              fill="none"
              stroke="var(--accent, #7fd4ff)"
              stroke-width="0.9"
              opacity="0.5"
            />
            <!-- facial discs + glowing eyes -->
            <circle cx="-7" cy="-37" r="8.5" fill="var(--bg, #0b0b2a)" opacity="0.35" />
            <circle cx="7" cy="-37" r="8.5" fill="var(--bg, #0b0b2a)" opacity="0.35" />
            <circle cx="-7" cy="-37" r="8.5" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.7" opacity="0.45" />
            <circle cx="7" cy="-37" r="8.5" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.7" opacity="0.45" />
            <circle class="owl-eye" cx="-7" cy="-37" r="4.6" fill="url(#cdl-eye)" opacity="0.95" />
            <circle class="owl-eye" cx="7" cy="-37" r="4.6" fill="url(#cdl-eye)" opacity="0.95" />
            <circle cx="-7" cy="-37" r="1.2" fill="#ffffff" opacity="0.95" />
            <circle cx="7" cy="-37" r="1.2" fill="#ffffff" opacity="0.95" />
            <!-- beak -->
            <path d="M -2.4 -30 L 0 -23.5 L 2.4 -30 Z" fill="var(--cosmos-star, #cfe6ff)" opacity="0.7" />
            <!-- chest chevrons -->
            <g fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.7" opacity="0.32">
              <path d="M -11 -14 q 3.5 3.5 7 0 q 3.5 3.5 7 0 q 3.5 3.5 7 0" />
              <path d="M -9 -6 q 3.5 3.5 7 0 q 3.5 3.5 7 0" />
              <path d="M -7 2 q 3.5 3.5 7 0" />
            </g>
            <!-- folded wing line -->
            <path d="M 15 -30 C 20 -18 19 -2 12 10" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.8" opacity="0.4" />
            <!-- talons over the branch -->
            <path d="M -7 13 q -1.5 4 0 6 M -3 14 q -1.5 4 0 6 M 4 14 q 1.5 4 0 6" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="1" stroke-linecap="round" opacity="0.55" />
          </g>
        </g>
      </g>

      <!-- origami crane gliding through the top-centre stars -->
      <g class="crane-drift">
        <g transform="translate(680 78) rotate(-8)">
          <circle r="46" fill="url(#cdl-halo)" opacity="0.5" />
          <!-- far wing -->
          <polygon
            points="-4,-6 -34,-52 12,-4"
            fill="var(--cosmos-nebula, #7c5cff)"
            opacity="0.28"
            stroke="var(--cosmos-star, #cfe6ff)"
            stroke-width="0.7"
            stroke-opacity="0.35"
          />
          <!-- tail -->
          <polygon
            points="26,-2 58,-20 30,6"
            fill="url(#cdl-paper)"
            stroke="var(--cosmos-star, #cfe6ff)"
            stroke-width="0.7"
            stroke-opacity="0.5"
          />
          <!-- neck + beak -->
          <polygon
            points="-26,-3 -57,-33 -53,-36 -20,3"
            fill="url(#cdl-paper)"
            stroke="var(--cosmos-star, #cfe6ff)"
            stroke-width="0.7"
            stroke-opacity="0.5"
          />
          <polygon points="-57,-33 -68,-36.5 -53,-36" fill="var(--cosmos-star, #cfe6ff)" opacity="0.55" />
          <!-- body -->
          <polygon
            points="-28,0 0,-10 32,0 2,14"
            fill="url(#cdl-paper)"
            stroke="var(--cosmos-star, #cfe6ff)"
            stroke-width="0.8"
            stroke-opacity="0.6"
          />
          <!-- near wing -->
          <polygon
            points="-8,-4 22,-58 30,-52 14,2"
            fill="var(--cosmos-star, #cfe6ff)"
            opacity="0.3"
            stroke="var(--cosmos-star, #cfe6ff)"
            stroke-width="0.8"
            stroke-opacity="0.55"
          />
          <!-- fold creases -->
          <path d="M -28 0 L 2 14 M 0 -10 L 2 14" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.5" opacity="0.35" />
          <!-- head glint -->
          <circle cx="-55" cy="-34" r="1.4" fill="var(--accent, #7fd4ff)" opacity="0.9" />
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
            <!-- ion tail: thin, straighter, cooler -->
            <path d="M -118 -7 L 0 -0.8 L 0 0.8 Z" fill="var(--accent, #7fd4ff)" opacity="0.28" />
            <path d="M -128 0 L 0 -2.6 L 0 2.6 Z" fill="url(#cdl-tail)" />
            <!-- dust particles shed along the tail -->
            {#each cometDust as d, i (i)}
              <circle cx={d.x} cy={d.y} r={d.r} fill="var(--cosmos-star, #cfe6ff)" opacity={d.o} />
            {/each}
            <circle r="7" fill="var(--cosmos-glint, #ff8ad9)" opacity="0.25" />
            <circle r="3" fill="var(--cosmos-star, #cfe6ff)" />
          </g>
        </g>
      </g>

      <!-- quadcopter drone, right margin (top-down X-frame) -->
      <g class="drone-hover">
        <g transform="translate(1185 350) rotate(18)">
          <!-- arms: dark underlay + light centerline -->
          <path
            d="M -13 -10 L -34 -34 M 13 -10 L 34 -34 M 13 10 L 34 34 M -13 10 L -34 34"
            stroke="var(--bg, #0b0b2a)"
            stroke-width="6"
            stroke-linecap="round"
            opacity="0.75"
          />
          <path
            d="M -13 -10 L -34 -34 M 13 -10 L 34 -34 M 13 10 L 34 34 M -13 10 L -34 34"
            stroke="var(--cosmos-star, #cfe6ff)"
            stroke-width="1.2"
            stroke-linecap="round"
            opacity="0.55"
          />
          <!-- motors + spinning props -->
          {#each motors as m, i (i)}
            <g transform={`translate(${m[0]} ${m[1]})`}>
              <circle r="24" fill="var(--accent, #7fd4ff)" opacity="0.05" />
              <circle r="24" fill="none" stroke="var(--accent, #7fd4ff)" stroke-width="0.6" stroke-dasharray="1.5 5" opacity="0.35" />
              <circle r="4.2" fill="var(--bg, #0b0b2a)" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.9" opacity="0.9" />
              <g class="rotor" transform={`rotate(${i * 45})`}>
                <ellipse rx="22" ry="2.6" fill="var(--cosmos-star, #cfe6ff)" opacity="0.42" />
                <ellipse rx="2.6" ry="22" fill="var(--cosmos-star, #cfe6ff)" opacity="0.16" />
              </g>
              <circle r="1.6" fill="var(--cosmos-glint, #ff8ad9)" opacity="0.9" />
            </g>
          {/each}
          <!-- body shell -->
          <rect x="-16" y="-13" width="32" height="26" rx="9" fill="url(#cdl-shell)" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="1" opacity="0.95" />
          <path d="M -9 -13 L -9 13 M 9 -13 L 9 13" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.6" opacity="0.3" />
          <!-- camera gimbal lens -->
          <circle r="6.5" fill="var(--bg, #0b0b2a)" opacity="0.8" />
          <circle r="6.5" fill="none" stroke="var(--accent, #7fd4ff)" stroke-width="0.9" opacity="0.6" />
          <circle r="3.6" fill="url(#cdl-eye)" />
          <circle r="1.2" fill="#ffffff" opacity="0.9" />
          <!-- nav LEDs: front magenta, rear cyan -->
          <circle class="led" cx="-13" cy="-9" r="1.5" fill="var(--cosmos-glint, #ff8ad9)" opacity="0.9" />
          <circle class="led" cx="13" cy="-9" r="1.5" fill="var(--cosmos-glint, #ff8ad9)" opacity="0.9" />
          <circle class="led" cx="-13" cy="9" r="1.5" fill="var(--accent, #7fd4ff)" opacity="0.9" />
          <circle class="led" cx="13" cy="9" r="1.5" fill="var(--accent, #7fd4ff)" opacity="0.9" />
        </g>
      </g>

      <!-- refractor telescope on a tripod, bottom-right (astrophotography) -->
      <g class="telescope">
        <g transform="translate(1216 688)">
          <!-- tripod -->
          <g stroke="var(--cosmos-star, #cfe6ff)" stroke-linecap="round" fill="none">
            <path d="M 0 2 L -56 166" stroke-width="1.6" opacity="0.6" />
            <path d="M 0 2 L 10 170" stroke-width="1.6" opacity="0.6" />
            <path d="M 0 2 L 46 158" stroke-width="1.6" opacity="0.6" />
            <path d="M -28 86 L 5 88 L 23 82 Z" stroke-width="0.8" opacity="0.4" />
            <path d="M 0 2 L 0 -16" stroke-width="2" opacity="0.65" />
          </g>
          <!-- mount head + tension knob -->
          <rect x="-7" y="-26" width="14" height="12" rx="3" fill="var(--bg, #0b0b2a)" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="1" opacity="0.85" />
          <circle cx="10" cy="-20" r="3" fill="none" stroke="var(--cosmos-glint, #ff8ad9)" stroke-width="0.9" opacity="0.6" />
          <!-- optical tube assembly, aimed up-right -->
          <g transform="translate(0 -22) rotate(-36)">
            <!-- dotted sight-line to a waiting star -->
            <line
              class="sightline"
              x1="132"
              y1="0"
              x2="215"
              y2="0"
              stroke="var(--accent, #7fd4ff)"
              stroke-width="1"
              stroke-dasharray="2 7"
              opacity="0.5"
            />
            <path
              class="glint"
              d="M 0 -7 L 1.6 -1.6 L 7 0 L 1.6 1.6 L 0 7 L -1.6 1.6 L -7 0 L -1.6 -1.6 Z"
              transform="translate(226 0) scale(0.75)"
              fill="var(--cosmos-star, #cfe6ff)"
              opacity="0.8"
            />
            <!-- glow at the objective -->
            <circle class="scope-glow" cx="126" cy="0" r="18" fill="url(#cdl-halo)" />
            <!-- back cell -->
            <rect x="-72" y="-10" width="12" height="20" rx="3" fill="var(--bg, #0b0b2a)" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.9" opacity="0.8" />
            <!-- main tube -->
            <rect x="-62" y="-12" width="146" height="24" rx="6" fill="url(#cdl-tube)" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="1" opacity="0.9" />
            <path d="M -18 -12 L -18 12 M 34 -12 L 34 12" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.6" opacity="0.25" />
            <!-- dew shield + objective -->
            <rect x="76" y="-15.5" width="46" height="31" rx="5" fill="url(#cdl-tube)" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="1" opacity="0.9" />
            <path d="M 84 -15.5 L 84 15.5" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.7" opacity="0.35" />
            <ellipse cx="122" cy="0" rx="3" ry="15.5" fill="var(--accent, #7fd4ff)" opacity="0.18" />
            <ellipse cx="122" cy="0" rx="3" ry="15.5" fill="none" stroke="var(--accent, #7fd4ff)" stroke-width="0.8" opacity="0.55" />
            <!-- finder scope on top -->
            <rect x="14" y="-27" width="40" height="9" rx="4" fill="var(--bg, #0b0b2a)" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.8" opacity="0.8" />
            <path d="M 22 -18 L 22 -12 M 46 -18 L 46 -12" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="1" opacity="0.5" />
            <circle cx="54.5" cy="-22.5" r="1.6" fill="var(--accent, #7fd4ff)" opacity="0.7" />
            <!-- focuser + eyepiece hanging back down -->
            <g transform="translate(-66 6) rotate(36)">
              <rect x="-3.5" y="0" width="7" height="14" rx="2" fill="var(--bg, #0b0b2a)" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.8" opacity="0.8" />
              <circle cx="-6" cy="7" r="2.6" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.7" opacity="0.5" />
              <circle cx="6" cy="7" r="2.6" fill="none" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.7" opacity="0.5" />
              <circle cx="0" cy="17" r="4" fill="var(--bg, #0b0b2a)" stroke="var(--cosmos-star, #cfe6ff)" stroke-width="0.9" opacity="0.85" />
              <circle cx="0" cy="17" r="1.6" fill="var(--accent, #7fd4ff)" opacity="0.75" />
            </g>
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

    /* dashes crawl outward along the telescope's line of sight */
    .sightline {
      animation: dashdrift 26s linear infinite;
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

  @keyframes dashdrift {
    to {
      stroke-dashoffset: -180;
    }
  }
</style>