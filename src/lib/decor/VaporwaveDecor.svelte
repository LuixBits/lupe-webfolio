<script lang="ts">
  import { onMount } from 'svelte';

  let {} = $props();

  let root = $state<HTMLDivElement>();

  // Deterministic pseudo-random from index — SSR output === client output.
  const hash = (n: number) => {
    const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  const PALETTE = [
    'var(--vapor-grid, #ff5ed1)',
    'var(--vapor-sun, #ffd36e)',
    'var(--accent, #ff5ed1)'
  ];

  // Neon particles kept in the outer left/right edge bands (center column stays clear).
  const particles = Array.from({ length: 26 }, (_, i) => {
    const h1 = hash(i + 1);
    const h2 = hash(i + 101);
    const h3 = hash(i + 201);
    const left = i % 2 === 0;
    return {
      x: +(left ? 1.5 + h1 * 10 : 88.5 + h1 * 10).toFixed(2),
      y: +(4 + h2 * 92).toFixed(2),
      s: +(2 + h3 * 3.2).toFixed(2),
      c: i % 3
    };
  });

  onMount(() => {
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Calm static composition — no JS motion.
      return;
    }

    let alive = true;
    let ctx: { revert: () => void } | undefined;
    let removeMove: () => void = () => {};

    (async () => {
      const g: any = await import('gsap');
      const gsap = g.gsap ?? g.default;
      if (!alive || !root) return;

      ctx = gsap.context(() => {
        // Slow vertical drift + gentle sway on each solid.
        root!.querySelectorAll<HTMLElement>('[data-drift]').forEach((el, i) => {
          const amp = parseFloat(el.dataset.drift ?? '10');
          gsap.to(el, {
            y: i % 2 === 0 ? amp : -amp,
            rotation: i % 2 === 0 ? 2.2 : -2.2,
            duration: 5.5 + (i % 5) * 1.4,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.4
          });
        });

        // Particle twinkle + rise.
        root!.querySelectorAll<HTMLElement>('.particle, .sparkle').forEach((el, i) => {
          gsap.to(el, {
            opacity: 0.15,
            duration: 1.6 + (i % 4) * 0.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: (i % 7) * 0.5
          });
          gsap.to(el, {
            y: -(8 + (i % 5) * 7),
            duration: 8 + (i % 6) * 1.6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });

        // Slow continuous spin (laserdisc).
        root!.querySelectorAll<HTMLElement>('[data-spin]').forEach((el) => {
          gsap.to(el, {
            rotation: 360,
            duration: parseFloat(el.dataset.spin ?? '60'),
            ease: 'none',
            repeat: -1,
            transformOrigin: '50% 50%'
          });
        });

        // Occasional glitch twitch on the retro window slices.
        root!.querySelectorAll<HTMLElement>('.glitch-jitter').forEach((el, i) => {
          gsap
            .timeline({ repeat: -1, repeatDelay: 3.6 + i * 1.35, delay: 1.2 + i * 0.7 })
            .to(el, { x: 3, duration: 0.09, ease: 'steps(1)' })
            .to(el, { x: -2.5, duration: 0.09, ease: 'steps(1)' })
            .to(el, { x: 0, duration: 0.09, ease: 'steps(1)' });
        });

        // Grid breathes faintly.
        gsap.to(root!.querySelectorAll('.grid-glow'), {
          opacity: 0.24,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });

        // Mouse parallax per depth layer.
        const layers = Array.from(root!.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => ({
          d: parseFloat(el.dataset.depth ?? '0.02'),
          qx: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power2.out' }),
          qy: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power2.out' })
        }));

        const onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          for (const l of layers) {
            l.qx(nx * l.d * 500);
            l.qy(ny * l.d * 500);
          }
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        removeMove = () => window.removeEventListener('mousemove', onMove);
      }, root);
    })();

    return () => {
      alive = false;
      removeMove();
      ctx?.revert();
    };
  });
</script>

<div class="vapor-decor" bind:this={root} aria-hidden="true">
  <!-- corner halos -->
  <div class="halo halo-tr"></div>
  <div class="halo halo-bl"></div>

  <!-- edge grid glow, bottom corners -->
  <div class="grid-glow gl"></div>
  <div class="grid-glow gr"></div>

  <!-- side hairline glows -->
  <div class="side-glow left"></div>
  <div class="side-glow right"></div>

  <!-- chrome ringed planet — top right -->
  <div class="px item planet-pos" data-depth="0.03">
    <div class="drift" data-drift="14">
      <svg viewBox="0 0 260 208" fill="none">
        <defs>
          <linearGradient id="vw-planet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--vapor-sun, #ffd36e)" />
            <stop offset="0.48" stop-color="var(--accent, #ff5ed1)" />
            <stop offset="1" stop-color="var(--slice-bg, #7b4bd6)" />
          </linearGradient>
          <mask id="vw-slits">
            <rect x="0" y="0" width="260" height="208" fill="white" />
            <rect x="0" y="116" width="260" height="3" fill="black" />
            <rect x="0" y="126" width="260" height="4" fill="black" />
            <rect x="0" y="137" width="260" height="5" fill="black" />
            <rect x="0" y="149" width="260" height="6" fill="black" />
          </mask>
        </defs>
        <!-- ring, far side -->
        <g transform="rotate(-14 130 104)">
          <path d="M 34 104 A 96 24 0 0 1 226 104" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="1.4" opacity="0.6" />
          <path d="M 50 104 A 80 18 0 0 1 210 104" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="0.8" opacity="0.35" />
        </g>
        <!-- chrome sunset sphere with slit bands -->
        <circle cx="130" cy="104" r="58" fill="url(#vw-planet)" mask="url(#vw-slits)" opacity="0.9" />
        <circle cx="130" cy="104" r="58" stroke="var(--vapor-sun, #ffd36e)" stroke-width="1" opacity="0.45" />
        <ellipse cx="112" cy="82" rx="17" ry="9" fill="var(--vapor-sun, #ffd36e)" opacity="0.3" transform="rotate(-24 112 82)" />
        <!-- ring, near side -->
        <g transform="rotate(-14 130 104)">
          <path d="M 34 104 A 96 24 0 0 0 226 104" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="1.4" opacity="0.9" />
          <path d="M 50 104 A 80 18 0 0 0 210 104" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="0.8" opacity="0.5" />
          <circle cx="42" cy="106" r="2.4" fill="var(--vapor-sun, #ffd36e)" opacity="0.9" />
        </g>
      </svg>
    </div>
  </div>

  <!-- wireframe globe — top left -->
  <div class="px item globe-pos" data-depth="0.02">
    <div class="drift" data-drift="10">
      <svg viewBox="0 0 120 120" fill="none">
        <defs>
          <radialGradient id="vw-globe" cx="0.35" cy="0.3" r="0.85">
            <stop offset="0" stop-color="var(--vw-cyan)" stop-opacity="0.26" />
            <stop offset="0.5" stop-color="var(--vapor-grid, #ff5ed1)" stop-opacity="0.1" />
            <stop offset="1" stop-color="var(--slice-bg, #7b4bd6)" stop-opacity="0.24" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="46" fill="url(#vw-globe)" />
        <ellipse cx="44" cy="38" rx="13" ry="7" fill="#ffffff" opacity="0.12" transform="rotate(-28 44 38)" />
        <circle cx="60" cy="60" r="46" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="1.2" />
        <ellipse cx="60" cy="60" rx="16" ry="46" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="0.8" opacity="0.55" />
        <ellipse cx="60" cy="60" rx="33" ry="46" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="0.8" opacity="0.4" />
        <line x1="60" y1="14" x2="60" y2="106" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="0.8" opacity="0.45" />
        <ellipse cx="60" cy="60" rx="46" ry="13" stroke="var(--vapor-sun, #ffd36e)" stroke-width="0.9" opacity="0.7" />
        <ellipse cx="60" cy="38" rx="40" ry="9" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="0.8" opacity="0.45" />
        <ellipse cx="60" cy="82" rx="40" ry="9" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="0.8" opacity="0.45" />
      </svg>
    </div>
  </div>

  <!-- wireframe pyramid — bottom left -->
  <div class="px item pyr-pos" data-depth="0.045">
    <div class="drift" data-drift="12">
      <svg viewBox="0 0 120 115" fill="none" stroke-linejoin="round">
        <path d="M 14 86 L 60 10 L 72 104 Z" fill="var(--vapor-grid, #ff5ed1)" opacity="0.09" />
        <path d="M 60 10 L 106 80 L 72 104 Z" fill="var(--vapor-sun, #ffd36e)" opacity="0.14" />
        <path d="M 14 86 L 60 10 L 106 80 M 60 10 L 72 104 M 14 86 L 72 104 L 106 80" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="1.2" />
        <path d="M 14 86 L 48 62 L 106 80 M 48 62 L 60 10" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="0.8" stroke-dasharray="3 4" opacity="0.45" />
        <circle cx="60" cy="10" r="2" fill="var(--vapor-sun, #ffd36e)" stroke="none" opacity="0.9" />
      </svg>
    </div>
  </div>

  <!-- wireframe cube — lower right -->
  <div class="px item cube-pos" data-depth="0.035">
    <div class="drift" data-drift="10">
      <svg viewBox="0 0 110 100" fill="none" stroke-linejoin="round">
        <path d="M 18 38 L 44 20 L 96 20 L 70 38 Z" fill="var(--vapor-sun, #ffd36e)" opacity="0.12" />
        <path d="M 70 38 L 96 20 L 96 72 L 70 90 Z" fill="var(--vapor-sun, #ffd36e)" opacity="0.05" />
        <rect x="18" y="38" width="52" height="52" fill="var(--vapor-grid, #ff5ed1)" opacity="0.05" />
        <path d="M 18 38 L 70 38 L 70 90 L 18 90 Z M 18 38 L 44 20 L 96 20 L 70 38 M 96 20 L 96 72 L 70 90" stroke="var(--vapor-sun, #ffd36e)" stroke-width="1.1" />
        <path d="M 44 20 L 44 72 L 96 72 M 44 72 L 18 90" stroke="var(--vapor-sun, #ffd36e)" stroke-width="0.7" stroke-dasharray="3 4" opacity="0.45" />
      </svg>
    </div>
  </div>

  <!-- crescent — mid right edge -->
  <div class="px item mid cres-pos" data-depth="0.02">
    <div class="drift" data-drift="8">
      <svg viewBox="0 0 60 60" fill="none">
        <path d="M 38 5 A 26 26 0 1 0 38 55 A 27 27 0 0 1 38 5 Z" fill="var(--vapor-sun, #ffd36e)" fill-opacity="0.3" stroke="var(--vapor-sun, #ffd36e)" stroke-width="1" opacity="0.85" />
      </svg>
    </div>
  </div>

  <!-- marble bust with laurel + plinth, RGB-split rim — mid left -->
  <div class="px item bust-pos" data-depth="0.028">
    <div class="drift" data-drift="9">
      <svg viewBox="0 0 150 196" fill="none">
        <defs>
          <linearGradient id="vw-marble" x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0" stop-color="#f8f2ff" />
            <stop offset="0.5" stop-color="#cbb4ee" />
            <stop offset="1" stop-color="#6a48ad" />
          </linearGradient>
          <linearGradient id="vw-plinth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#cbb4ee" />
            <stop offset="1" stop-color="#472573" />
          </linearGradient>
          <!-- closed silhouette: crown → nape → shoulder → bust cut → chest → profile -->
          <g id="vw-bust-solid">
            <path d="M 66 40 C 58 30 64 18 76 16 C 84 8 100 8 108 18 C 118 22 122 34 118 44 C 122 56 120 70 112 78 C 112 88 108 94 104 98 C 104 108 108 116 116 122 C 124 130 130 142 131 154 C 106 172 66 176 44 169 C 60 166 76 158 84 146 C 88 138 88 132 85 126 C 78 124 72 121 68 116 C 70 111 68 107 63 105 C 58 103 57 99 61 95 C 57 93 57 90 61 87 C 57 85 57 82 60 79 L 52 76 L 62 58 C 61 53 62 47 66 40 Z" />
            <path d="M 104 84 C 112 80 120 86 118 95 C 116 103 106 105 101 99 Z" />
          </g>
          <path id="vw-leaf" d="M 0 0 Q 4.5 -3.2 9 -0.5 Q 4.5 2.5 0 0 Z" />
        </defs>
        <!-- RGB-split rim ghosts -->
        <use href="#vw-bust-solid" fill="var(--vw-cyan)" transform="translate(-3 0)" opacity="0.5" />
        <use href="#vw-bust-solid" fill="var(--vapor-grid, #ff5ed1)" transform="translate(3 1.5)" opacity="0.5" />
        <!-- marble body -->
        <use href="#vw-bust-solid" fill="url(#vw-marble)" fill-opacity="0.95" stroke="#efe4ff" stroke-width="1" stroke-opacity="0.85" stroke-linejoin="round" />
        <!-- hair mass wash: crown band from the hairline back to the nape -->
        <path d="M 66 40 C 58 30 64 18 76 16 C 84 8 100 8 108 18 C 118 22 122 34 118 44 C 122 56 120 70 112 78 C 112 84 110 90 106 94 C 102 88 100 78 100 68 C 94 58 86 52 78 48 C 72 45 68 42 66 40 Z" fill="#5a35a0" opacity="0.28" />
        <!-- back-of-hair / nape shadow wash -->
        <path d="M 106 20 C 114 24 118 34 115 44 C 118 56 117 68 110 77 C 110 86 107 92 103 97 C 104 88 104 80 102 72 C 106 62 107 50 104 40 C 106 32 106 25 106 20 Z" fill="#55309a" opacity="0.32" />
        <!-- under-jaw / neck shadow -->
        <path d="M 84 127 C 87 133 87 139 83 146 C 77 155 66 162 55 166 C 69 164 80 156 86 146 C 90 138 89 131 84 127 Z" fill="#4d2b8f" opacity="0.4" />
        <!-- marble veins -->
        <g stroke="#8f6fc8" stroke-width="0.6" opacity="0.45" fill="none" stroke-linecap="round">
          <path d="M 98 128 C 102 138 100 150 92 158" />
          <path d="M 64 150 C 70 154 74 159 75 164" />
        </g>
        <!-- carved details: brow, eye, lips, hair waves, bun swirl, drapery -->
        <g fill="none" stroke="#6b46ab" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.9" opacity="0.8">
          <path d="M 64 56 C 68 53 74 53 78 55" stroke-width="1" />
          <path d="M 67 63 C 70 61 75 61 78 63" opacity="0.8" />
          <path d="M 61 91 C 64 90 66 90 68 91" opacity="0.7" />
          <path d="M 70 30 C 78 24 90 24 97 30" opacity="0.75" />
          <path d="M 74 40 C 82 33 94 34 101 41" opacity="0.6" />
          <path d="M 80 50 C 87 44 97 45 103 51" opacity="0.45" />
          <path d="M 107 90 C 111 87 115 91 112 96" opacity="0.6" />
          <path d="M 70 150 C 78 156 92 158 104 154" opacity="0.45" />
        </g>
        <!-- gold laurel across the crown -->
        <path d="M 64.5 37 C 68.5 21 85 11.5 99.5 13.5 C 110 15 115.5 23 116 34" stroke="var(--vapor-sun, #ffd36e)" stroke-width="0.8" opacity="0.55" />
        <g fill="var(--vapor-sun, #ffd36e)" opacity="0.78">
          <use href="#vw-leaf" transform="translate(65.5 32) rotate(-70)" />
          <use href="#vw-leaf" transform="translate(69.5 23.5) rotate(-50)" />
          <use href="#vw-leaf" transform="translate(76.5 17) rotate(-28)" />
          <use href="#vw-leaf" transform="translate(86 13.4) rotate(-8)" />
          <use href="#vw-leaf" transform="translate(95.5 13) rotate(8)" />
          <use href="#vw-leaf" transform="translate(104 15.5) rotate(30)" />
          <use href="#vw-leaf" transform="translate(110.5 21.5) rotate(52)" />
          <use href="#vw-leaf" transform="translate(114 29) rotate(70)" />
        </g>
        <circle cx="91" cy="11" r="1.3" fill="var(--vapor-sun, #ffd36e)" opacity="0.9" />
        <!-- stepped plinth with neon rim-light edges -->
        <path d="M 59 172 L 115 172 L 118 180 L 56 180 Z" fill="url(#vw-plinth)" opacity="0.85" />
        <path d="M 52 180 L 122 180 L 122 187 L 52 187 Z" fill="#221045" opacity="0.92" />
        <path d="M 49 187 L 125 187 L 125 194 L 49 194 Z" fill="url(#vw-plinth)" opacity="0.7" />
        <path d="M 59 172 L 115 172" stroke="var(--vapor-sun, #ffd36e)" stroke-width="0.9" opacity="0.75" />
        <path d="M 49 187 L 125 187" stroke="var(--vw-cyan)" stroke-width="0.7" opacity="0.45" />
        <path d="M 56 180 L 52 180 L 52 187 L 49 187 L 49 194" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="0.8" opacity="0.5" />
        <path d="M 118 180 L 122 180 L 122 187 L 125 187 L 125 194" stroke="var(--vw-cyan)" stroke-width="0.8" opacity="0.5" />
      </svg>
    </div>
  </div>

  <!-- cracked laserdisc with rainbow sheen — upper right -->
  <div class="px item disc-pos" data-depth="0.042">
    <div class="drift" data-drift="8">
      <svg viewBox="0 0 140 140" fill="none" data-spin="72">
        <mask id="vw-disc-ring">
          <circle cx="70" cy="70" r="61" fill="white" />
          <circle cx="70" cy="70" r="17" fill="black" />
        </mask>
        <circle cx="70" cy="70" r="62" fill="#31175e" fill-opacity="0.45" stroke="#e6dbff" stroke-width="1.2" opacity="0.95" />
        <!-- iridescent sheen sectors, masked to the annulus -->
        <g mask="url(#vw-disc-ring)">
          <path d="M 70 70 L 70 9 A 61 61 0 0 1 95.8 14.7 Z" fill="var(--vapor-grid, #ff5ed1)" opacity="0.26" />
          <path d="M 70 70 L 95.8 14.7 A 61 61 0 0 1 120 35 Z" fill="var(--vapor-sun, #ffd36e)" opacity="0.18" />
          <path d="M 70 70 L 120 35 A 61 61 0 0 1 130.1 59.4 Z" fill="var(--vw-cyan)" opacity="0.24" />
          <path d="M 70 70 L 116.7 109.2 A 61 61 0 0 1 100.5 122.8 Z" fill="var(--vapor-grid, #ff5ed1)" opacity="0.16" />
          <path d="M 70 70 L 100.5 122.8 A 61 61 0 0 1 44.2 125.3 Z" fill="var(--vw-cyan)" opacity="0.2" />
          <path d="M 70 70 L 44.2 125.3 A 61 61 0 0 1 23.3 109.2 Z" fill="var(--vapor-sun, #ffd36e)" opacity="0.16" />
          <path d="M 70 70 L 9.2 64.7 A 61 61 0 0 1 17.2 39.5 Z" fill="var(--vapor-grid, #ff5ed1)" opacity="0.18" />
          <path d="M 70 70 L 17.2 39.5 A 61 61 0 0 1 44.2 14.7 Z" fill="var(--vw-cyan)" opacity="0.15" />
        </g>
        <!-- grooves -->
        <circle cx="70" cy="70" r="56" stroke="#d9c9ff" stroke-width="0.6" opacity="0.25" />
        <circle cx="70" cy="70" r="50" stroke="#d9c9ff" stroke-width="0.6" opacity="0.2" />
        <circle cx="70" cy="70" r="44" stroke="#d9c9ff" stroke-width="0.5" stroke-dasharray="1.5 3" opacity="0.25" />
        <circle cx="70" cy="70" r="37" stroke="#d9c9ff" stroke-width="0.6" opacity="0.16" />
        <circle cx="70" cy="70" r="30" stroke="#d9c9ff" stroke-width="0.5" stroke-dasharray="1 2.5" opacity="0.2" />
        <circle cx="70" cy="70" r="23" stroke="#d9c9ff" stroke-width="0.6" opacity="0.25" />
        <!-- hub -->
        <circle cx="70" cy="70" r="15" stroke="var(--vapor-sun, #ffd36e)" stroke-width="1" opacity="0.8" />
        <circle cx="70" cy="70" r="6.5" fill="#180a33" stroke="#d9c9ff" stroke-width="0.9" opacity="0.95" />
        <!-- specular arcs -->
        <path d="M 28 46 A 49 49 0 0 1 46 28" stroke="#ffffff" stroke-width="1.4" opacity="0.5" stroke-linecap="round" />
        <path d="M 112 92 A 49 49 0 0 1 96 110" stroke="#ffffff" stroke-width="1.2" opacity="0.35" stroke-linecap="round" />
        <!-- crack + glint -->
        <path d="M 116 36 L 101 50 L 106 57 L 90 64 L 84 70" stroke="#ffffff" stroke-width="1" opacity="0.85" />
        <path d="M 101 50 L 96 43" stroke="#ffffff" stroke-width="0.8" opacity="0.6" />
        <path d="M 90 64 L 92 72" stroke="#ffffff" stroke-width="0.7" opacity="0.5" />
        <path d="M 113 33 l 5 5 M 118 33 l -5 5" stroke="var(--vw-cyan)" stroke-width="0.8" opacity="0.9" />
      </svg>
    </div>
  </div>

  <!-- glitchy retro window with striped sunset — mid right -->
  <div class="px item win-pos" data-depth="0.03">
    <div class="drift" data-drift="8">
      <svg viewBox="0 0 150 122" fill="none">
        <defs>
          <linearGradient id="vw-winsun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--vapor-sun, #ffd36e)" />
            <stop offset="1" stop-color="var(--vapor-grid, #ff5ed1)" />
          </linearGradient>
          <clipPath id="vw-winclip"><rect x="9" y="33" width="128" height="72" /></clipPath>
        </defs>
        <!-- ghost frame (pink offset, twitches) -->
        <g class="glitch-jitter" opacity="0.35">
          <rect x="12" y="18" width="130" height="92" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="1.1" />
        </g>
        <rect x="8" y="14" width="130" height="92" rx="2" stroke="var(--vw-cyan)" stroke-width="1.2" fill="#1d0d40" fill-opacity="0.6" />
        <line x1="8" y1="32" x2="138" y2="32" stroke="var(--vw-cyan)" stroke-width="1" />
        <!-- close box + title stripes -->
        <rect x="14" y="19" width="9" height="9" stroke="var(--vw-cyan)" stroke-width="0.9" />
        <path d="M 30 21 H 132 M 30 24.5 H 132 M 30 28 H 132" stroke="var(--vw-cyan)" stroke-width="0.7" opacity="0.5" />
        <!-- inside: striped sun on a horizon grid -->
        <g clip-path="url(#vw-winclip)">
          <circle cx="73" cy="88" r="26" fill="url(#vw-winsun)" opacity="0.85" />
          <rect x="45" y="72" width="56" height="2" fill="#1d0d40" opacity="0.9" />
          <rect x="44" y="78" width="58" height="2.6" fill="#1d0d40" opacity="0.9" />
          <rect x="44" y="83.5" width="58" height="3.2" fill="#1d0d40" opacity="0.9" />
          <rect x="9" y="88" width="128" height="20" fill="#1d0d40" opacity="0.88" />
          <line x1="9" y1="88" x2="137" y2="88" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="0.9" opacity="0.85" />
          <path d="M 73 88 L 38 106 M 73 88 L 108 106 M 73 88 L 73 106 M 73 88 L 20 100 M 73 88 L 126 100" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="0.6" opacity="0.4" />
          <path d="M 9 94 H 137 M 9 100 H 137" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="0.5" opacity="0.3" />
        </g>
        <!-- glitch slice bars -->
        <rect class="glitch-jitter" x="26" y="50" width="52" height="2.4" fill="var(--vw-cyan)" opacity="0.35" />
        <rect class="glitch-jitter" x="70" y="62" width="48" height="2" fill="var(--vapor-grid, #ff5ed1)" opacity="0.35" />
        <!-- cursor -->
        <path d="M 112 84 l 0 12 3 -3 2.6 5 2.4 -1.2 -2.6 -5 4 -0.6 Z" fill="#efe6ff" opacity="0.9" />
      </svg>
    </div>
  </div>

  <!-- low-poly dolphin leap — mid left -->
  <div class="px item dolph-pos" data-depth="0.03">
    <div class="drift" data-drift="12">
      <svg viewBox="0 0 140 124" fill="none" stroke-linejoin="round">
        <defs>
          <path id="vw-dolphin" d="M 128 102 L 112 88 L 98 80 L 86 76 L 72 94 L 76 72 L 56 64 L 38 58 L 26 50 L 8 60 L 14 48 L 6 34 L 24 46 L 44 42 L 60 38 L 76 20 L 78 38 L 94 48 L 106 62 L 118 84 Z" />
          <linearGradient id="vw-dolphbody" x1="0" y1="0" x2="1" y2="0.7">
            <stop offset="0" stop-color="var(--vw-cyan)" />
            <stop offset="1" stop-color="var(--vapor-grid, #ff5ed1)" />
          </linearGradient>
        </defs>
        <!-- pink ghost offset -->
        <use href="#vw-dolphin" fill="var(--vapor-grid, #ff5ed1)" transform="translate(2.4 1.8)" opacity="0.3" />
        <!-- gradient body wash under the facets -->
        <use href="#vw-dolphin" fill="url(#vw-dolphbody)" fill-opacity="0.16" />
        <!-- full faceted skin, lit from above -->
        <g stroke="none">
          <path d="M 6 34 L 24 46 L 14 48 Z" fill="var(--vw-cyan)" opacity="0.22" />
          <path d="M 14 48 L 24 46 L 26 50 Z" fill="var(--vapor-grid, #ff5ed1)" opacity="0.16" />
          <path d="M 14 48 L 26 50 L 8 60 Z" fill="var(--vw-cyan)" opacity="0.1" />
          <path d="M 24 46 L 44 42 L 38 58 Z" fill="var(--vw-cyan)" opacity="0.18" />
          <path d="M 24 46 L 38 58 L 26 50 Z" fill="var(--vapor-grid, #ff5ed1)" opacity="0.1" />
          <path d="M 44 42 L 60 38 L 38 58 Z" fill="var(--vapor-sun, #ffd36e)" opacity="0.12" />
          <path d="M 60 38 L 56 64 L 38 58 Z" fill="var(--vw-cyan)" opacity="0.12" />
          <path d="M 60 38 L 76 20 L 78 38 Z" fill="var(--vapor-grid, #ff5ed1)" opacity="0.28" />
          <path d="M 60 38 L 78 38 L 56 64 Z" fill="var(--vw-cyan)" opacity="0.2" />
          <path d="M 78 38 L 76 72 L 56 64 Z" fill="var(--vapor-grid, #ff5ed1)" opacity="0.12" />
          <path d="M 76 72 L 86 76 L 72 94 Z" fill="var(--vw-cyan)" opacity="0.16" />
          <path d="M 78 38 L 86 76 L 76 72 Z" fill="var(--vapor-sun, #ffd36e)" opacity="0.1" />
          <path d="M 78 38 L 94 48 L 86 76 Z" fill="var(--vw-cyan)" opacity="0.22" />
          <path d="M 94 48 L 106 62 L 98 80 Z" fill="var(--vapor-grid, #ff5ed1)" opacity="0.15" />
          <path d="M 94 48 L 98 80 L 86 76 Z" fill="var(--vw-cyan)" opacity="0.12" />
          <path d="M 106 62 L 118 84 L 112 88 Z" fill="var(--vw-cyan)" opacity="0.24" />
          <path d="M 106 62 L 112 88 L 98 80 Z" fill="var(--vapor-sun, #ffd36e)" opacity="0.12" />
          <path d="M 118 84 L 128 102 L 112 88 Z" fill="var(--vapor-grid, #ff5ed1)" opacity="0.22" />
        </g>
        <!-- facet linework -->
        <path d="M 24 46 L 14 48 M 14 48 L 26 50 M 24 46 L 26 50 M 24 46 L 38 58 M 44 42 L 38 58 M 60 38 L 38 58 M 60 38 L 56 64 M 60 38 L 78 38 M 78 38 L 56 64 M 78 38 L 76 72 M 78 38 L 86 76 M 94 48 L 86 76 M 94 48 L 98 80 M 106 62 L 98 80 M 106 62 L 112 88 M 76 72 L 86 76 M 112 88 L 118 84" stroke="var(--vw-cyan)" stroke-width="0.7" opacity="0.5" />
        <!-- main outline -->
        <use href="#vw-dolphin" stroke="var(--vw-cyan)" stroke-width="1.3" opacity="0.95" />
        <!-- eye -->
        <circle cx="105" cy="70.5" r="1.9" fill="#0d2b45" opacity="0.9" />
        <circle cx="105.6" cy="69.9" r="0.7" fill="#eafcff" opacity="0.95" />
        <!-- speed streaks off the flukes -->
        <path d="M 2 27 l 9 -2 M 1 41 l 8 -1" stroke="var(--vw-cyan)" stroke-width="0.8" opacity="0.35" stroke-linecap="round" />
        <!-- splash arcs + droplets where it will strike the water -->
        <path d="M 104 114 q 14 3 28 -2" stroke="var(--vw-cyan)" stroke-width="1" opacity="0.5" stroke-linecap="round" />
        <path d="M 92 108 q 9 3 18 1" stroke="var(--vw-cyan)" stroke-width="0.8" opacity="0.35" stroke-linecap="round" />
        <circle cx="121" cy="107" r="1.2" fill="var(--vw-cyan)" opacity="0.55" />
        <circle cx="133" cy="108" r="0.9" fill="var(--vw-cyan)" opacity="0.4" />
        <circle cx="99" cy="103" r="0.9" fill="var(--vw-cyan)" opacity="0.35" />
      </svg>
    </div>
  </div>

  <!-- cassette tape — faint, floats above the title band -->
  <div class="px item mid cass-pos" data-depth="0.015">
    <div class="drift" data-drift="7">
      <svg viewBox="0 0 122 80" fill="none">
        <rect x="3" y="5" width="116" height="70" rx="7" stroke="var(--vapor-sun, #ffd36e)" stroke-width="1.2" fill="#2a1254" fill-opacity="0.55" />
        <rect x="13" y="13" width="96" height="30" rx="3.5" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="0.9" opacity="0.8" />
        <rect x="13.5" y="13.5" width="95" height="6" fill="var(--vapor-grid, #ff5ed1)" opacity="0.3" />
        <path d="M 20 24 H 56 M 20 27.5 H 42" stroke="#d9c9ff" stroke-width="1.4" opacity="0.3" />
        <rect x="32" y="24" width="58" height="16" rx="8" stroke="#d9c9ff" stroke-width="0.8" opacity="0.7" />
        <circle cx="46" cy="32" r="5.5" stroke="var(--vapor-sun, #ffd36e)" stroke-width="1" opacity="0.9" />
        <circle cx="76" cy="32" r="5.5" stroke="var(--vapor-sun, #ffd36e)" stroke-width="1" opacity="0.9" />
        <path d="M 46 28.5 v 2 M 43 33.8 l 1.7 -1 M 49 33.8 l -1.7 -1 M 76 28.5 v 2 M 73 33.8 l 1.7 -1 M 79 33.8 l -1.7 -1" stroke="var(--vapor-sun, #ffd36e)" stroke-width="0.8" opacity="0.8" />
        <path d="M 26 75 L 33 58 L 89 58 L 96 75" stroke="var(--vapor-sun, #ffd36e)" stroke-width="0.9" opacity="0.7" />
        <circle cx="41" cy="66" r="1.8" stroke="#d9c9ff" stroke-width="0.7" opacity="0.6" />
        <circle cx="61" cy="66" r="2.4" stroke="#d9c9ff" stroke-width="0.7" opacity="0.6" />
        <circle cx="81" cy="66" r="1.8" stroke="#d9c9ff" stroke-width="0.7" opacity="0.6" />
        <circle cx="9" cy="11" r="1.7" stroke="#d9c9ff" stroke-width="0.7" opacity="0.55" />
        <circle cx="113" cy="11" r="1.7" stroke="#d9c9ff" stroke-width="0.7" opacity="0.55" />
        <circle cx="9" cy="69" r="1.7" stroke="#d9c9ff" stroke-width="0.7" opacity="0.55" />
        <circle cx="113" cy="69" r="1.7" stroke="#d9c9ff" stroke-width="0.7" opacity="0.55" />
      </svg>
    </div>
  </div>

  <!-- palm silhouettes — bottom right, rim-lit -->
  <div class="px item palm-pos" data-depth="0.05">
    <div class="drift" data-drift="5">
      <svg viewBox="0 0 190 210" stroke-linejoin="round">
        <g fill="#1b0c3a" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="1" opacity="0.92" stroke-opacity="0.5">
          <!-- tall palm -->
          <path d="M 98 210 C 100 160 104 120 114 82 L 124 84 C 112 122 110 162 112 210 Z" />
          <path d="M 119 78 C 100 58 70 50 44 56 C 72 58 96 68 116 84 Z" />
          <path d="M 119 78 C 96 74 68 80 52 96 C 76 86 100 84 118 88 Z" />
          <path d="M 119 78 C 112 56 116 34 130 20 C 122 40 122 60 126 78 Z" />
          <path d="M 119 78 C 136 58 160 50 182 56 C 158 60 138 70 124 86 Z" />
          <path d="M 121 80 C 144 76 168 84 182 100 C 160 90 138 88 122 90 Z" />
          <path d="M 121 82 C 136 92 146 108 148 126 C 138 108 128 96 116 90 Z" />
          <path d="M 117 82 C 102 90 92 104 88 120 C 96 104 106 94 118 90 Z" />
          <circle cx="113" cy="87" r="4" />
          <circle cx="122" cy="90" r="3.4" />
          <!-- short palm -->
          <path d="M 30 210 C 32 184 36 162 46 144 L 54 146 C 44 164 42 186 42 210 Z" />
          <path d="M 50 141 C 36 128 18 122 2 126 C 20 128 36 136 48 146 Z" />
          <path d="M 50 140 C 46 124 50 108 60 98 C 54 112 54 128 56 140 Z" />
          <path d="M 51 141 C 62 128 78 122 94 126 C 78 128 64 136 54 146 Z" />
          <path d="M 52 143 C 64 146 74 154 78 166 C 70 156 62 150 52 148 Z" />
          <path d="M 48 143 C 38 148 32 156 30 168 C 36 158 42 150 50 147 Z" />
        </g>
        <!-- trunk ridges -->
        <path d="M 103 192 l 9 -2 M 104 176 l 9 -2 M 106 158 l 9 -2 M 108 140 l 9 -2 M 110 122 l 9 -2 M 35 196 l 8 -2 M 37 180 l 8 -2 M 40 164 l 8 -2" stroke="var(--vapor-grid, #ff5ed1)" stroke-width="0.7" opacity="0.35" fill="none" />
      </svg>
    </div>
  </div>

  <!-- celestial sparkles -->
  <div class="px item mid sp1" data-depth="0.05">
    <svg class="sparkle" viewBox="0 0 16 16"><path d="M8 0 Q9.3 6.7 16 8 Q9.3 9.3 8 16 Q6.7 9.3 0 8 Q6.7 6.7 8 0 Z" fill="var(--vapor-sun, #ffd36e)" /></svg>
  </div>
  <div class="px item sp2" data-depth="0.05">
    <svg class="sparkle" viewBox="0 0 16 16"><path d="M8 0 Q9.3 6.7 16 8 Q9.3 9.3 8 16 Q6.7 9.3 0 8 Q6.7 6.7 8 0 Z" fill="var(--vapor-grid, #ff5ed1)" /></svg>
  </div>
  <div class="px item mid sp3" data-depth="0.055">
    <svg class="sparkle" viewBox="0 0 16 16"><path d="M8 0 Q9.3 6.7 16 8 Q9.3 9.3 8 16 Q6.7 9.3 0 8 Q6.7 6.7 8 0 Z" fill="var(--vapor-sun, #ffd36e)" /></svg>
  </div>

  <!-- drifting neon particles, edge bands only -->
  <div class="particles" data-depth="0.015">
    {#each particles as p}
      <span
        class="particle"
        style={`left:${p.x}%; top:${p.y}%; width:${p.s}px; height:${p.s}px; background:${PALETTE[p.c]}; box-shadow:0 0 ${(p.s * 2.5).toFixed(1)}px ${PALETTE[p.c]};`}
      ></span>
    {/each}
  </div>
</div>

<style>
  .vapor-decor {
    position: fixed;
    inset: 0;
    z-index: 6;
    pointer-events: none;
    overflow: hidden;
    contain: strict;
    --vw-cyan: #67e8f9;
  }

  .px {
    position: absolute;
    will-change: transform;
  }
  .drift {
    will-change: transform;
  }

  svg {
    display: block;
    width: 100%;
    height: auto;
  }

  /* ---- positioned art, clustered to edges/corners ---- */
  .item {
    opacity: 0.6;
  }
  .planet-pos {
    top: 4%;
    right: 2.5%;
    width: clamp(9.5rem, 17vw, 15.5rem);
    opacity: 0.8;
  }
  .globe-pos {
    top: 6%;
    left: 3%;
    width: clamp(5rem, 9vw, 8.5rem);
    opacity: 0.5;
  }
  .pyr-pos {
    bottom: 9%;
    left: 4%;
    width: clamp(5.5rem, 10vw, 9.5rem);
    opacity: 0.55;
  }
  .cube-pos {
    bottom: 18%;
    right: 5%;
    width: clamp(4.5rem, 8vw, 7.5rem);
    opacity: 0.5;
  }
  .cres-pos {
    top: 44%;
    right: 2%;
    width: clamp(2rem, 3vw, 3rem);
    opacity: 0.6;
  }
  .bust-pos {
    top: 36%;
    left: 3%;
    width: clamp(6.5rem, 10.5vw, 9.5rem);
    opacity: 0.78;
    filter: drop-shadow(0 0 9px rgba(207, 180, 240, 0.25));
  }
  .disc-pos {
    top: 28%;
    right: 3.5%;
    width: clamp(5.5rem, 8.5vw, 8rem);
    opacity: 0.75;
  }
  .win-pos {
    top: 54%;
    right: 9%;
    width: clamp(6rem, 9.5vw, 9rem);
    opacity: 0.6;
  }
  .dolph-pos {
    top: 61%;
    left: 5.5%;
    width: clamp(5.75rem, 8.5vw, 8.25rem);
    opacity: 0.8;
    filter: drop-shadow(0 0 8px rgba(103, 232, 249, 0.28));
  }
  .cass-pos {
    top: 4%;
    left: 53%;
    width: clamp(4.5rem, 6.5vw, 6.25rem);
    opacity: 0.4;
    filter: blur(0.4px);
  }
  .palm-pos {
    bottom: -2%;
    right: 13%;
    width: clamp(8rem, 13vw, 12rem);
    opacity: 0.75;
    filter: drop-shadow(0 0 9px rgba(255, 94, 209, 0.2));
  }
  .palm-pos .drift {
    transform-origin: 50% 100%;
  }
  .sp1 { top: 30%; left: 8.5%; width: 0.9rem; opacity: 0.85; }
  .sp2 { bottom: 30%; right: 3%; width: 0.75rem; opacity: 0.8; }
  .sp3 { top: 13%; left: 13%; width: 0.6rem; opacity: 0.7; }

  /* ---- corner halos ---- */
  .halo {
    position: absolute;
    border-radius: 50%;
  }
  .halo-tr {
    top: -8rem;
    right: -8rem;
    width: 34rem;
    height: 34rem;
    background: radial-gradient(closest-side, var(--slice-bg, #7b4bd6), transparent 70%);
    opacity: 0.22;
  }
  .halo-bl {
    bottom: -10rem;
    left: -10rem;
    width: 30rem;
    height: 30rem;
    background: radial-gradient(closest-side, var(--vapor-grid, #ff5ed1), transparent 70%);
    opacity: 0.08;
  }

  /* ---- perspective grid glow, bottom corners only ---- */
  .grid-glow {
    position: absolute;
    bottom: -3rem;
    height: 30vh;
    width: 46vw;
    background-image:
      repeating-linear-gradient(to right, var(--vapor-grid, #ff5ed1) 0 1px, transparent 1px 42px),
      repeating-linear-gradient(to top, var(--vapor-grid, #ff5ed1) 0 1px, transparent 1px 34px);
    transform: perspective(30rem) rotateX(60deg);
    opacity: 0.14;
  }
  .grid-glow.gl {
    left: -6vw;
    transform-origin: bottom left;
    -webkit-mask-image: radial-gradient(115% 125% at 0% 100%, #000 25%, transparent 70%);
    mask-image: radial-gradient(115% 125% at 0% 100%, #000 25%, transparent 70%);
  }
  .grid-glow.gr {
    right: -6vw;
    transform-origin: bottom right;
    -webkit-mask-image: radial-gradient(115% 125% at 100% 100%, #000 25%, transparent 70%);
    mask-image: radial-gradient(115% 125% at 100% 100%, #000 25%, transparent 70%);
  }

  /* ---- hairline side glows framing the page ---- */
  .side-glow {
    position: absolute;
    top: 12%;
    bottom: 12%;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--vapor-grid, #ff5ed1), transparent);
    opacity: 0.22;
  }
  .side-glow.left { left: 1.25rem; }
  .side-glow.right { right: 1.25rem; }

  /* ---- particles ---- */
  .particles {
    position: absolute;
    inset: 0;
  }
  .particle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.65;
    will-change: transform, opacity;
  }

  /* Keep the centered ~46rem content column clear on narrower viewports. */
  @media (max-width: 72rem) {
    .mid { display: none; }
    .planet-pos { width: 12vw; opacity: 0.5; }
    .globe-pos, .pyr-pos, .cube-pos { opacity: 0.35; }
    .sp1, .sp3 { display: none; }
    .win-pos { display: none; }
    .bust-pos, .dolph-pos { opacity: 0.35; }
    .disc-pos { width: 9vw; opacity: 0.5; }
    .palm-pos { width: 13vw; opacity: 0.5; }
  }
  @media (max-width: 48rem) {
    .item { opacity: 0.3; }
    .grid-glow { height: 18vh; opacity: 0.1; }
    .side-glow { display: none; }
    .bust-pos, .dolph-pos, .disc-pos { display: none; }
    .palm-pos { width: 5.75rem; right: 4%; opacity: 0.35; filter: none; }
  }
</style>