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
            l.qx(nx * l.d * 900);
            l.qy(ny * l.d * 900);
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
  }
  @media (max-width: 48rem) {
    .item { opacity: 0.3; }
    .grid-glow { height: 18vh; opacity: 0.1; }
    .side-glow { display: none; }
  }
</style>