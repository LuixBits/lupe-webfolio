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

  // Anchor slots hug the edges; the ~46rem center column stays clear.
  const slots = [
    { x: 4.5, y: 20 },
    { x: 10, y: 46 },
    { x: 5, y: 72 },
    { x: 93, y: 26 },
    { x: 88.5, y: 52 },
    { x: 94, y: 78 },
    { x: 16, y: 6.5 },
    { x: 84, y: 10 },
    { x: 13, y: 93 },
    { x: 87, y: 90 }
  ];

  const leaves = slots.map((s, i) => ({
    x: +(s.x + (hash(i, 1) - 0.5) * 3).toFixed(2),
    y: +(s.y + (hash(i, 2) - 0.5) * 4).toFixed(2),
    r: Math.round((hash(i, 3) - 0.5) * 160),
    w: Math.round(30 + hash(i, 4) * 30),
    o: +(0.3 + hash(i, 5) * 0.3).toFixed(2),
    line: hash(i, 6) > 0.55,
    depth: 1 + Math.round(hash(i, 7) * 2)
  }));

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

        // Scattered edge leaves breathe and drift in place.
        el.querySelectorAll<HTMLElement>('.leaf .art').forEach((node, i) => {
          const d = 4.5 + hash(i, 11) * 4.5;
          gsap.to(node, {
            y: `+=${(6 + hash(i, 12) * 9).toFixed(1)}`,
            rotation: `+=${((hash(i, 13) - 0.5) * 16).toFixed(1)}`,
            duration: d,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: -d * hash(i, 14)
          });
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
              m.x(nx * 13 * m.depth);
              m.y(ny * 9 * m.depth);
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

<div class="garden" bind:this={root} aria-hidden="true">
  <div class="corner branch--tl" data-depth="1.5">{@render branchArt()}</div>
  <div class="corner branch--br" data-depth="1.2">{@render branchArt()}</div>
  <div class="corner tendril--tr" data-depth="2">{@render tendrilArt()}</div>
  <div class="corner tendril--bl" data-depth="1.7">{@render tendrilArt()}</div>

  {#each leaves as L}
    <div
      class="leaf"
      data-depth={L.depth}
      style={`left:${L.x}%; top:${L.y}%; width:${L.w}px; opacity:${L.o}; transform:rotate(${L.r}deg);`}
    >
      {@render leafArt(L.line, 0.9)}
    </div>
  {/each}

  <div class="fall" style="left:6.5%; top:34%; width:26px;">
    {@render leafArt(false, 0.85)}
  </div>
  <div class="fall" style="left:91%; top:30%; width:21px;">
    {@render leafArt(true, 1)}
  </div>
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

  .leaf,
  .fall {
    position: absolute;
  }

  .fall {
    opacity: 0.35;
  }

  @media (max-width: 720px) {
    .garden {
      opacity: 0.55;
    }

    .leaf {
      scale: 0.75;
    }
  }
</style>
