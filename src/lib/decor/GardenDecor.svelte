<script lang="ts">
  import { onMount } from 'svelte';

  let {} = $props();

  let root = $state<HTMLDivElement | null>(null);

  // Hand-drawn leaf: origin at the stem base, tip sweeping toward +x.
  const LEAF =
    'M0 0 C 7 -13, 24 -18, 38 -7 C 40 -5.4, 40 -3.2, 38 -2 C 24 6.5, 8 6, 0 0 Z';
  const RIB = 'M3 -0.6 C 13 -5.5, 25 -8, 35 -5.2';

  // Deterministic pseudo-random derived from an index (SSR === client).
  const hash = (i: number, salt = 0): number => {
    const n = Math.sin(i * 127.1 + salt * 311.7 + 43.13) * 43758.5453;
    return n - Math.floor(n);
  };

  // Leaves placed by hand along the corner branch stems.
  const branchLeaves = [
    { x: 64, y: 18, r: -42, s: 1.15, line: false, o: 0.85, flip: false },
    { x: 108, y: 36, r: 66, s: 0.9, line: true, o: 1, flip: true },
    { x: 158, y: 62, r: -28, s: 1.25, line: false, o: 0.7, flip: false },
    { x: 204, y: 96, r: 84, s: 0.85, line: false, o: 0.9, flip: true },
    { x: 240, y: 142, r: -6, s: 1.1, line: true, o: 1, flip: false },
    { x: 272, y: 196, r: 102, s: 0.8, line: false, o: 0.75, flip: true },
    { x: 296, y: 252, r: 12, s: 1.0, line: false, o: 0.9, flip: false },
    { x: 316, y: 312, r: 118, s: 0.7, line: true, o: 1, flip: true },
    { x: 168, y: 62, r: -52, s: 0.7, line: true, o: 1, flip: false },
    { x: 216, y: 108, r: 30, s: 0.75, line: false, o: 0.6, flip: true }
  ];

  // --- Fern frond: pinnae generated along a bezier rachis. ---------------
  const pinnaPath = (L: number, w: number): string => {
    const lobes = 5;
    let d = 'M0 0';
    for (let i = 0; i < lobes; i++) {
      const x1 = (L * (i + 1)) / lobes;
      const mx = (L * (i + 0.5)) / lobes;
      const h = w * Math.sin((Math.PI * (i + 0.7)) / (lobes + 1));
      const ey = i === lobes - 1 ? 0 : -h * 0.3;
      d += ` Q ${mx.toFixed(1)} ${(-h).toFixed(1)} ${x1.toFixed(1)} ${ey.toFixed(1)}`;
    }
    for (let i = lobes - 1; i >= 0; i--) {
      const x0 = (L * i) / lobes;
      const mx = (L * (i + 0.5)) / lobes;
      const h = w * 0.8 * Math.sin((Math.PI * (i + 0.55)) / (lobes + 1));
      const ey = i === 0 ? 0 : h * 0.3;
      d += ` Q ${mx.toFixed(1)} ${h.toFixed(1)} ${x0.toFixed(1)} ${ey.toFixed(1)}`;
    }
    return d + ' Z';
  };

  // Rachis rooted at the left viewport edge, reaching toward the middle.
  const fernPinnae = (() => {
    const P0 = [-8, 190], P1 = [70, 180], P2 = [150, 138], P3 = [232, 66];
    const out: { x: number; y: number; a: number; d: string; rib: number; o: number }[] = [];
    const n = 12;
    for (let k = 0; k < n; k++) {
      for (const side of [1, -1]) {
        const t = 0.07 + (k + (side === 1 ? 0 : 0.5)) * (0.87 / n);
        const mt = 1 - t;
        const x = mt * mt * mt * P0[0] + 3 * mt * mt * t * P1[0] + 3 * mt * t * t * P2[0] + t * t * t * P3[0];
        const y = mt * mt * mt * P0[1] + 3 * mt * mt * t * P1[1] + 3 * mt * t * t * P2[1] + t * t * t * P3[1];
        const dx = 3 * mt * mt * (P1[0] - P0[0]) + 6 * mt * t * (P2[0] - P1[0]) + 3 * t * t * (P3[0] - P2[0]);
        const dy = 3 * mt * mt * (P1[1] - P0[1]) + 6 * mt * t * (P2[1] - P1[1]) + 3 * t * t * (P3[1] - P2[1]);
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
        const L = (46 - 34 * t) * (0.92 + hash(k, 21 + side) * 0.16);
        out.push({
          x: +x.toFixed(1),
          y: +y.toFixed(1),
          a: +(ang + side * (64 - t * 26)).toFixed(1),
          d: pinnaPath(L, 8.6 - 4.8 * t),
          rib: +(L * 0.92).toFixed(1),
          o: +(0.55 + hash(k, 24 + side) * 0.3).toFixed(2)
        });
      }
    }
    return out;
  })();

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let disposed = false;
    let ctx: { revert: () => void } | undefined;
    let onMove: ((e: MouseEvent) => void) | undefined;

    (async () => {
      const g = await import('gsap');
      const gsap = g.gsap ?? g.default;
      if (disposed || !root) return;
      const el = root;

      ctx = gsap.context(() => {
        // Corner branches sway from their anchored corners.
        gsap.to('.branch--tl .art', {
          rotation: 1.7,
          transformOrigin: '0% 0%',
          duration: 9,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
        gsap.to('.branch--br .art', {
          rotation: -1.7,
          transformOrigin: '100% 100%',
          duration: 11,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.4
        });
        gsap.to('.tendril--tr .art', {
          rotation: 2.6,
          transformOrigin: '100% 0%',
          duration: 8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0.7
        });
        gsap.to('.tendril--bl .art', {
          rotation: -2.6,
          transformOrigin: '0% 100%',
          duration: 10,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 2.1
        });

        // Two leaves let go and tumble down the margins.
        el.querySelectorAll<HTMLElement>('.fall').forEach((node, i) => {
          gsap.set(node, { autoAlpha: 0 });
          const dur = 15 + i * 7;
          const tl = gsap.timeline({
            repeat: -1,
            delay: 2 + i * 8,
            repeatDelay: 4 + i * 3
          });
          tl.set(node, { y: '-46vh', x: 0, rotation: 20 + i * 140 })
            .to(node, { y: '66vh', duration: dur, ease: 'none' }, 0)
            .to(node, { rotation: `+=${150 + i * 60}`, duration: dur, ease: 'sine.inOut' }, 0)
            .to(node, {
              x: `+=${26 + i * 10}`,
              duration: dur / 5,
              yoyo: true,
              repeat: 4,
              ease: 'sine.inOut'
            }, 0)
            .to(node, { autoAlpha: 0.5, duration: 2 }, 0.3)
            .to(node, { autoAlpha: 0, duration: 2.5 }, dur - 2.5);
        });

        // Edge-rooted foliage sways from where it enters the viewport.
        gsap.to('.fern .art', {
          rotation: 1.9,
          transformOrigin: '2% 80%',
          duration: 9,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0.5
        });
        gsap.to('.sprig .art', {
          rotation: -2.2,
          transformOrigin: '100% 14%',
          duration: 10.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.6
        });

        // Perched butterfly settles its wings now and then.
        const flap = gsap.timeline({ repeat: -1, repeatDelay: 3.2, delay: 1.5 });
        flap.to('.fern .wing', {
          scaleX: 0.45,
          transformOrigin: '0% 50%',
          duration: 0.32,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 5
        });

        // Gentle mouse parallax on desktop pointers.
        if (window.matchMedia('(pointer: fine)').matches) {
          const movers = Array.from(
            el.querySelectorAll<HTMLElement>('[data-depth]')
          ).map((n) => ({
            depth: parseFloat(n.dataset.depth || '1'),
            x: gsap.quickTo(n, 'x', { duration: 1.3, ease: 'power2.out' }),
            y: gsap.quickTo(n, 'y', { duration: 1.3, ease: 'power2.out' })
          }));
          onMove = (e: MouseEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            for (const m of movers) {
              m.x(nx * 7 * m.depth);
              m.y(ny * 5 * m.depth);
            }
          };
          window.addEventListener('mousemove', onMove, { passive: true });
        }
      }, el);
    })();

    return () => {
      disposed = true;
      if (onMove) window.removeEventListener('mousemove', onMove);
      ctx?.revert();
    };
  });
</script>

{#snippet leafArt(line: boolean, opacity: number)}
  <svg class="art" viewBox="-3 -21 46 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    {#if line}
      <path d={LEAF} stroke="var(--garden-leaf, #6bbf7b)" stroke-width="1.5" />
    {:else}
      <path d={LEAF} fill="var(--garden-leaf, #6bbf7b)" opacity={opacity} />
    {/if}
    <path d={RIB} stroke="var(--garden-stem, #3f6d4e)" stroke-width="1" opacity="0.55" />
  </svg>
{/snippet}

{#snippet branchArt()}
  <svg class="art" viewBox="0 0 460 420" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- main arching stem -->
    <path
      d="M-6 4 C 96 28, 196 84, 254 172 C 300 242, 322 300, 330 366"
      stroke="var(--garden-stem, #3f6d4e)"
      stroke-width="3"
      stroke-linecap="round"
    />
    <!-- secondary offshoot -->
    <path
      d="M118 44 C 170 54, 210 86, 228 132 C 240 164, 242 196, 236 224"
      stroke="var(--garden-stem, #3f6d4e)"
      stroke-width="1.8"
      stroke-linecap="round"
      opacity="0.8"
    />
    <!-- curling tendril at the tip -->
    <path
      d="M330 366 C 336 386, 352 396, 368 390 C 382 384, 384 368, 372 362 C 362 357, 352 364, 356 374"
      stroke="var(--accent, #4f8a63)"
      stroke-width="1.6"
      stroke-linecap="round"
    />
    <!-- berries at the offshoot's end -->
    <circle cx="236" cy="230" r="4" fill="var(--accent, #4f8a63)" />
    <circle cx="246" cy="240" r="2.6" fill="var(--accent, #4f8a63)" opacity="0.7" />
    <circle cx="228" cy="240" r="1.8" fill="var(--accent, #4f8a63)" opacity="0.5" />
    {#each branchLeaves as L}
      <g
        transform={`translate(${L.x} ${L.y}) rotate(${L.r}) scale(${L.s} ${
          L.flip ? -L.s : L.s
        })`}
      >
        {#if L.line}
          <path d={LEAF} stroke="var(--garden-leaf, #6bbf7b)" stroke-width="1.4" />
        {:else}
          <path d={LEAF} fill="var(--garden-leaf, #6bbf7b)" opacity={L.o} />
        {/if}
        <path d={RIB} stroke="var(--garden-stem, #3f6d4e)" stroke-width="1" opacity="0.5" />
      </g>
    {/each}
  </svg>
{/snippet}

{#snippet tendrilArt()}
  <svg class="art" viewBox="0 0 250 210" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- soft celestial disc tucked into the corner -->
    <circle cx="222" cy="18" r="78" fill="var(--slice-bg, #7fb08a)" opacity="0.14" />
    <circle
      cx="222"
      cy="18"
      r="96"
      stroke="var(--slice-bg, #7fb08a)"
      stroke-width="1"
      stroke-dasharray="1 7"
      stroke-linecap="round"
      opacity="0.6"
    />
    <!-- curling vine -->
    <path
      d="M252 28 C 198 36, 154 54, 124 86 C 98 114, 94 144, 110 158 C 124 170, 144 164, 148 148 C 151 134, 140 124, 128 130 C 120 134, 118 144, 124 150"
      stroke="var(--accent, #4f8a63)"
      stroke-width="1.8"
      stroke-linecap="round"
    />
    <path
      d="M200 40 C 180 58, 168 78, 164 100"
      stroke="var(--garden-stem, #3f6d4e)"
      stroke-width="1.2"
      stroke-linecap="round"
      opacity="0.7"
    />
    <g transform="translate(164 100) rotate(118) scale(0.8)">
      <path d={LEAF} fill="var(--garden-leaf, #6bbf7b)" opacity="0.8" />
      <path d={RIB} stroke="var(--garden-stem, #3f6d4e)" stroke-width="1" opacity="0.5" />
    </g>
    <g transform="translate(146 70) rotate(-140) scale(0.62 -0.62)">
      <path d={LEAF} stroke="var(--garden-leaf, #6bbf7b)" stroke-width="1.4" />
      <path d={RIB} stroke="var(--garden-stem, #3f6d4e)" stroke-width="1" opacity="0.5" />
    </g>
    <circle cx="112" cy="162" r="3" fill="var(--accent, #4f8a63)" opacity="0.85" />
  </svg>
{/snippet}

{#snippet wingArt()}
  <path
    d="M1.6 -3.5 C 7 -15, 20 -21, 26 -15 C 30 -10, 24 -3.5, 12 -1.6 Z"
    fill="var(--sub-bg, #d9a441)"
    opacity="0.9"
  />
  <path
    d="M1.6 -3.5 C 7 -15, 20 -21, 26 -15 C 30 -10, 24 -3.5, 12 -1.6 Z"
    stroke="var(--sub-active, #c48f2f)"
    stroke-width="0.9"
  />
  <path
    d="M1.6 -0.5 C 9 0.5, 16 4, 14.5 10.5 C 13 15.5, 5.5 13.5, 2 6.5 Z"
    fill="var(--accent, #4f8a63)"
    opacity="0.55"
  />
  <path
    d="M1.6 -0.5 C 9 0.5, 16 4, 14.5 10.5 C 13 15.5, 5.5 13.5, 2 6.5 Z"
    stroke="var(--garden-stem, #3f6d4e)"
    stroke-width="0.8"
    opacity="0.6"
  />
  <path
    d="M3 -3.5 C 9 -8, 15 -11, 21 -13 M3 -2.6 C 10 -5, 16 -6.5, 23 -8"
    stroke="var(--sub-active, #c48f2f)"
    stroke-width="0.6"
    opacity="0.7"
  />
  <circle cx="20" cy="-12" r="1.5" fill="var(--garden-stem, #3f6d4e)" opacity="0.55" />
{/snippet}

{#snippet fernArt()}
  <svg class="art" viewBox="-20 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- rachis rooted at the left edge, tapering into a curled tip -->
    <path
      d="M-32 193 L -8 190 C 70 180, 150 138, 232 66"
      stroke="var(--garden-stem, #3f6d4e)"
      stroke-width="2.6"
      stroke-linecap="round"
    />
    <path
      d="M232 66 c 11 -6 18 0 13 7 c -4 5 -11 2 -8 -3"
      stroke="var(--accent, #4f8a63)"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    {#each fernPinnae as p}
      <g transform={`translate(${p.x} ${p.y}) rotate(${p.a})`}>
        <path d={p.d} fill="var(--garden-leaf, #6bbf7b)" opacity={p.o} />
        <path
          d={`M1.5 0 L ${p.rib} 0`}
          stroke="var(--garden-stem, #3f6d4e)"
          stroke-width="0.8"
          opacity="0.4"
        />
      </g>
    {/each}
    <!-- butterfly perched on the curled tip -->
    <g transform="translate(241 51) rotate(-9) scale(0.92)">
      <g class="wing">{@render wingArt()}</g>
      <g transform="scale(-1 1)"><g class="wing">{@render wingArt()}</g></g>
      <ellipse cx="0" cy="0" rx="1.7" ry="7.2" fill="var(--garden-stem, #3f6d4e)" />
      <circle cx="0" cy="-8.6" r="2" fill="var(--garden-stem, #3f6d4e)" />
      <path
        d="M-1 -9.8 C -4 -14, -7 -16, -10 -16.6 M1 -9.8 C 4 -14, 7 -16, 10 -16.6"
        stroke="var(--garden-stem, #3f6d4e)"
        stroke-width="0.7"
        stroke-linecap="round"
      />
      <circle cx="-10" cy="-16.6" r="0.8" fill="var(--garden-stem, #3f6d4e)" />
      <circle cx="10" cy="-16.6" r="0.8" fill="var(--garden-stem, #3f6d4e)" />
    </g>
  </svg>
{/snippet}

{#snippet sprigArt()}
  <svg class="art" viewBox="0 0 250 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- stem rooted at the right edge, arcing toward the middle -->
    <path
      d="M266 22 C 180 32, 120 50, 76 82 C 58 96, 47 110, 43 122"
      stroke="var(--garden-stem, #3f6d4e)"
      stroke-width="2.2"
      stroke-linecap="round"
    />
    <path
      d="M43 122 c -3 11 5 18 12 14 c 6 -4 4 -12 -3 -10"
      stroke="var(--accent, #4f8a63)"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <g transform="translate(196 32) rotate(120) scale(0.95)">
      <path d={LEAF} fill="var(--garden-leaf, #6bbf7b)" opacity="0.85" />
      <path d={RIB} stroke="var(--garden-stem, #3f6d4e)" stroke-width="1" opacity="0.5" />
    </g>
    <g transform="translate(150 44) rotate(-125) scale(0.8 -0.8)">
      <path d={LEAF} stroke="var(--garden-leaf, #6bbf7b)" stroke-width="1.4" />
      <path d={RIB} stroke="var(--garden-stem, #3f6d4e)" stroke-width="1" opacity="0.5" />
    </g>
    <g transform="translate(108 62) rotate(115) scale(0.85)">
      <path d={LEAF} fill="var(--garden-leaf, #6bbf7b)" opacity="0.7" />
      <path d={RIB} stroke="var(--garden-stem, #3f6d4e)" stroke-width="1" opacity="0.5" />
    </g>
    <g transform="translate(76 84) rotate(-140) scale(0.65 -0.65)">
      <path d={LEAF} stroke="var(--garden-leaf, #6bbf7b)" stroke-width="1.4" />
      <path d={RIB} stroke="var(--garden-stem, #3f6d4e)" stroke-width="1" opacity="0.5" />
    </g>
    <circle cx="52" cy="106" r="3" fill="var(--accent, #4f8a63)" opacity="0.85" />
    <circle cx="60" cy="113" r="2" fill="var(--accent, #4f8a63)" opacity="0.6" />
  </svg>
{/snippet}

<div class="garden" bind:this={root} aria-hidden="true">
  <div class="corner branch--tl" data-depth="1.5">{@render branchArt()}</div>
  <div class="corner branch--br" data-depth="1.2">{@render branchArt()}</div>
  <div class="corner tendril--tr" data-depth="2">{@render tendrilArt()}</div>
  <div class="corner tendril--bl" data-depth="1.7">{@render tendrilArt()}</div>

  <div class="fall" style="left:6.5%; top:34%; width:26px;">
    {@render leafArt(false, 0.85)}
  </div>
  <div class="fall" style="left:91%; top:30%; width:21px;">
    {@render leafArt(true, 1)}
  </div>

  <div class="piece fern" data-depth="1.4">{@render fernArt()}</div>
  <div class="piece sprig" data-depth="1.6">{@render sprigArt()}</div>
</div>

<style>
  .garden {
    position: fixed;
    inset: 0;
    z-index: 6;
    pointer-events: none;
    overflow: hidden;
    contain: strict;
  }

  .art {
    display: block;
    width: 100%;
    height: auto;
    will-change: transform;
  }

  .corner {
    position: absolute;
  }

  .branch--tl {
    top: -6px;
    left: -8px;
    width: clamp(170px, 26vw, 400px);
    opacity: 0.85;
  }

  .branch--br {
    bottom: -6px;
    right: -8px;
    width: clamp(150px, 23vw, 360px);
    opacity: 0.7;
  }

  .branch--br .art {
    transform: scale(-1, -1);
  }

  .tendril--tr {
    top: -4px;
    right: -6px;
    width: clamp(120px, 15vw, 230px);
    opacity: 0.8;
  }

  .tendril--bl {
    bottom: -4px;
    left: -6px;
    width: clamp(110px, 13vw, 210px);
    opacity: 0.65;
  }

  .tendril--bl .art {
    transform: scale(-1, -1);
  }

  .fall,
  .piece {
    position: absolute;
  }

  .fall {
    opacity: 0.35;
  }

  .fern {
    left: -14px;
    top: 33%;
    width: clamp(160px, 18vw, 260px);
    opacity: 0.9;
  }

  .sprig {
    right: -14px;
    top: 52%;
    width: clamp(130px, 15vw, 210px);
    opacity: 0.85;
  }

  @media (max-width: 1100px) {
    .fern {
      width: 130px;
      opacity: 0.7;
      top: 40%;
    }

    .sprig {
      width: 108px;
      opacity: 0.6;
    }
  }

  @media (max-width: 720px) {
    .garden {
      opacity: 0.55;
    }

    .fern,
    .sprig {
      display: none;
    }
  }
</style>
