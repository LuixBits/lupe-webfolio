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

  const fernPinnae = (() => {
    const P0 = [30, 250], P1 = [18, 152], P2 = [64, 66], P3 = [148, 26];
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
        const L = (50 - 38 * t) * (0.92 + hash(k, 21 + side) * 0.16);
        out.push({
          x: +x.toFixed(1),
          y: +y.toFixed(1),
          a: +(ang + side * (64 - t * 26)).toFixed(1),
          d: pinnaPath(L, 7.5 - 4.5 * t),
          rib: +(L * 0.92).toFixed(1),
          o: +(0.55 + hash(k, 24 + side) * 0.3).toFixed(2)
        });
      }
    }
    return out;
  })();

  // --- Fiddlehead: a young frond curled into a spiral. --------------------
  const fiddle = (() => {
    const cx = 32, cy = 26, steps = 40, turns = 2.15;
    const nubs: { x: number; y: number; r: number }[] = [];
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const f = i / steps;
      const th = Math.PI * 0.75 + f * turns * Math.PI * 2;
      const r = 15.5 * (1 - f * 0.92);
      const x = cx + Math.cos(th) * r;
      const y = cy + Math.sin(th) * r;
      if (i === 0) {
        d = `M10 96 C 14 70 ${(x - 5).toFixed(1)} ${(y + 15).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
      } else {
        d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      if (i > 1 && i < steps - 6 && i % 5 === 0) {
        nubs.push({
          x: +(cx + Math.cos(th) * (r + 2.6)).toFixed(1),
          y: +(cy + Math.sin(th) * (r + 2.6)).toFixed(1),
          r: +(2.2 * (1 - f * 0.75)).toFixed(2)
        });
      }
    }
    return { d, nubs };
  })();

  // --- Dandelion clock: spokes with pappus fans, a few already gone. ------
  const dSpokes = (() => {
    const out: { x1: number; y1: number; x2: number; y2: number; a: number }[] = [];
    const N = 17;
    const gone = new Set([3, 4, 11]);
    for (let i = 0; i < N; i++) {
      if (gone.has(i)) continue;
      const a = (i / N) * Math.PI * 2 - Math.PI / 2 + (hash(i, 31) - 0.5) * 0.16;
      const r = 23 + hash(i, 32) * 3.5;
      out.push({
        x1: +(Math.cos(a) * 4.5).toFixed(1),
        y1: +(Math.sin(a) * 4.5).toFixed(1),
        x2: +(Math.cos(a) * r).toFixed(1),
        y2: +(Math.sin(a) * r).toFixed(1),
        a: +((a * 180) / Math.PI).toFixed(1)
      });
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

        // New foliage sways from its rooted base.
        gsap.to('.fern .art', {
          rotation: 2.4,
          transformOrigin: '18% 96%',
          duration: 8.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0.5
        });
        gsap.to('.fiddle .art', {
          rotation: -3.5,
          transformOrigin: '18% 94%',
          duration: 9.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.8
        });
        gsap.to('.dandelion .stalk', {
          rotation: 2.6,
          transformOrigin: '50% 96%',
          duration: 7.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.1
        });

        // Dandelion seeds detach and sail toward the top corner.
        el.querySelectorAll<HTMLElement>('.seed').forEach((node, i) => {
          const inner = node.querySelector<HTMLElement>('.art');
          const dur = 12 + i * 5;
          gsap.set(node, { autoAlpha: 0 });
          const tl = gsap.timeline({
            repeat: -1,
            delay: 2.5 + i * 7,
            repeatDelay: 6 + i * 3
          });
          tl.set(node, { x: 0, y: 0, rotation: 0 })
            .to(node, { autoAlpha: 0.75, duration: 1.6 }, 0)
            .to(node, {
              x: 70 + i * 40,
              y: -(110 + i * 50),
              duration: dur,
              ease: 'sine.inOut'
            }, 0)
            .to(node, { rotation: 24 + i * 18, duration: dur }, 0)
            .to(node, { autoAlpha: 0, duration: 2.2 }, dur - 2.2);
          if (inner) {
            gsap.to(inner, {
              x: 9,
              duration: 2.6 + i,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1
            });
          }
        });

        // Butterfly: lazy figure-eight drift + flap-and-glide wingbeats.
        const fl = el.querySelector<HTMLElement>('.flutter .art');
        if (fl) {
          gsap.to(fl, { x: 26, duration: 7.3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
          gsap.to(fl, { y: 18, duration: 4.9, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: -2.2 });
          gsap.to(fl, { rotation: 10, duration: 5.7, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: -1.4 });
          const flap = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
          flap.to('.flutter .wing', {
            scaleX: 0.3,
            transformOrigin: '0% 50%',
            duration: 0.3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: 5
          });
        }

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

{#snippet fernArt()}
  <svg class="art" viewBox="-36 0 226 264" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- rachis, tapering into a curled tip -->
    <path
      d="M30 250 C 18 152, 64 66, 148 26"
      stroke="var(--garden-stem, #3f6d4e)"
      stroke-width="2.4"
      stroke-linecap="round"
    />
    <path
      d="M148 26 c 9 -4 15 2 11 8 c -3 5 -9 3 -8 -2"
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
  </svg>
{/snippet}

{#snippet fiddleArt()}
  <svg class="art" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d={fiddle.d}
      stroke="var(--garden-stem, #3f6d4e)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    {#each fiddle.nubs as nb}
      <circle cx={nb.x} cy={nb.y} r={nb.r} fill="var(--garden-leaf, #6bbf7b)" opacity="0.8" />
    {/each}
    <!-- two small basal leaflets -->
    <path
      d="M13 80 c -7 -2 -11 -7 -12 -13 c 6 1 10 6 12 13"
      fill="var(--garden-leaf, #6bbf7b)"
      opacity="0.55"
    />
    <path
      d="M15 66 c 7 -3 9 -9 8 -15 c -6 2 -9 8 -8 15"
      fill="var(--garden-leaf, #6bbf7b)"
      opacity="0.45"
    />
  </svg>
{/snippet}

{#snippet seedArt()}
  <svg class="art" viewBox="-8 -8 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 12 L0 2"
      stroke="var(--garden-stem, #3f6d4e)"
      stroke-width="0.9"
      stroke-linecap="round"
      opacity="0.8"
    />
    <ellipse cx="0" cy="12" rx="1.1" ry="2" fill="var(--sub-active, #c48f2f)" opacity="0.85" />
    <path
      d="M0 2 L-6 -4 M0 2 L-3 -5.6 M0 2 L0 -6.4 M0 2 L3 -5.6 M0 2 L6 -4"
      stroke="var(--slice-bg, #7fb08a)"
      stroke-width="0.8"
      stroke-linecap="round"
      opacity="0.9"
    />
  </svg>
{/snippet}

{#snippet shroomArt()}
  <svg class="art" viewBox="0 0 124 92" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gd-cap" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#dcaa53" />
        <stop offset="1" stop-color="#b3812e" />
      </linearGradient>
      <linearGradient id="gd-cap2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#c9964a" />
        <stop offset="1" stop-color="#a37427" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="86" rx="44" ry="4" fill="var(--garden-stem, #3f6d4e)" opacity="0.12" />
    <!-- big mushroom -->
    <path d="M44 56 C 43 68, 44 78, 46 85 L 58 85 C 60 76, 60 66, 59 56 Z" fill="#ece4cb" />
    <path
      d="M45 58 C 44 68, 45 77, 47 84"
      stroke="#c9bd9a"
      stroke-width="1"
      opacity="0.8"
    />
    <path
      d="M24 54 C 22 34, 40 22, 52 22 C 66 22, 80 34, 78 54 C 60 60, 40 60, 24 54 Z"
      fill="url(#gd-cap)"
    />
    <path
      d="M24 54 C 40 60, 62 60, 78 54"
      stroke="#8a6420"
      stroke-width="1.2"
      opacity="0.55"
    />
    <path
      d="M31 55 L 43 51 M 40 57 L 47 52 M 51 58 L 51 52 M 62 57 L 56 52 M 71 55 L 60 51"
      stroke="#8a6420"
      stroke-width="0.9"
      opacity="0.4"
    />
    <path
      d="M31 35 C 33 28, 41 24, 47 24"
      stroke="#f0d9a0"
      stroke-width="2"
      stroke-linecap="round"
      opacity="0.55"
    />
    <ellipse cx="40" cy="33" rx="3" ry="2" fill="#f2e8cf" opacity="0.85" />
    <ellipse cx="58" cy="29" rx="2.2" ry="1.5" fill="#f2e8cf" opacity="0.8" />
    <ellipse cx="66" cy="41" rx="2.6" ry="1.8" fill="#f2e8cf" opacity="0.8" />
    <ellipse cx="33" cy="44" rx="2" ry="1.4" fill="#f2e8cf" opacity="0.7" />
    <!-- medium mushroom -->
    <path d="M92 62 C 92 70, 93 78, 95 84 L 103 84 C 104 77, 104 69, 103 62 Z" fill="#ece4cb" />
    <path
      d="M84 62 C 84 48, 94 42, 98 42 C 106 42, 112 50, 111 62 C 102 66, 92 66, 84 62 Z"
      fill="url(#gd-cap2)"
    />
    <path d="M84 62 C 92 66, 103 66, 111 62" stroke="#8a6420" stroke-width="1" opacity="0.5" />
    <ellipse cx="96" cy="50" rx="2" ry="1.4" fill="#f2e8cf" opacity="0.8" />
    <!-- button mushroom -->
    <path d="M17 68 L 17 79 L 24 79 L 24 68 Z" fill="#ece4cb" />
    <path
      d="M12 68 C 12 60, 18 56, 21 56 C 26 56, 30 61, 30 68 C 24 71, 17 71, 12 68 Z"
      fill="url(#gd-cap2)"
      opacity="0.92"
    />
    <!-- grass tufts -->
    <path
      d="M6 85 C 8 72, 6 64, 10 56 M14 86 C 18 76, 16 68, 22 62"
      stroke="var(--garden-leaf, #6bbf7b)"
      stroke-width="1.4"
      stroke-linecap="round"
      opacity="0.7"
    />
    <path
      d="M112 84 C 110 72, 114 66, 110 58 M118 85 C 121 75, 119 70, 123 64"
      stroke="var(--garden-leaf, #6bbf7b)"
      stroke-width="1.4"
      stroke-linecap="round"
      opacity="0.5"
    />
    <circle cx="72" cy="84" r="1.2" fill="var(--accent, #4f8a63)" opacity="0.5" />
    <circle cx="36" cy="86" r="1" fill="var(--accent, #4f8a63)" opacity="0.4" />
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

{#snippet butterflyArt()}
  <svg class="art" viewBox="-30 -26 60 52" fill="none" xmlns="http://www.w3.org/2000/svg">
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

  <div class="piece fern" data-depth="1.6">{@render fernArt()}</div>
  <div class="piece fiddle" data-depth="1.2">{@render fiddleArt()}</div>
  <div class="piece dandelion" data-depth="1.4">
    <svg class="art stalk" viewBox="0 0 124 196" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M62 48 C 57 92, 68 134, 60 188"
        stroke="var(--garden-stem, #3f6d4e)"
        stroke-width="2"
        stroke-linecap="round"
        opacity="0.9"
      />
      <!-- toothed basal leaves -->
      <path
        d="M60 186 C 48 178, 36 166, 30 148 L 38 153 L 33 138 L 42 145 L 39 130 L 47 140 C 52 154, 56 170, 60 182 Z"
        fill="var(--garden-leaf, #6bbf7b)"
        opacity="0.5"
      />
      <path
        d="M61 186 C 72 176, 82 164, 86 148 L 79 153 L 83 139 L 75 146 L 77 132 L 70 142 C 66 156, 63 170, 61 180 Z"
        fill="var(--garden-leaf, #6bbf7b)"
        opacity="0.38"
      />
      <g transform="translate(62 44)">
        <circle
          r="30"
          stroke="var(--slice-bg, #7fb08a)"
          stroke-width="1"
          stroke-dasharray="1 6"
          stroke-linecap="round"
          opacity="0.35"
        />
        {#each dSpokes as s}
          <path
            d={`M${s.x1} ${s.y1} L${s.x2} ${s.y2}`}
            stroke="var(--garden-stem, #3f6d4e)"
            stroke-width="0.8"
            opacity="0.45"
          />
          <g
            transform={`translate(${s.x2} ${s.y2}) rotate(${s.a})`}
            stroke="var(--slice-bg, #7fb08a)"
            stroke-width="0.8"
            stroke-linecap="round"
            opacity="0.85"
          >
            <path d="M0 0 L6.4 -4.6 M0 0 L7 -2.2 M0 0 L7.4 0 M0 0 L7 2.2 M0 0 L6.4 4.6" />
          </g>
        {/each}
        <circle r="3.4" fill="var(--sub-active, #c48f2f)" opacity="0.9" />
        <circle r="1.6" fill="var(--sub-bg, #d9a441)" />
      </g>
    </svg>
    <div class="seed seed--a">{@render seedArt()}</div>
    <div class="seed seed--b">{@render seedArt()}</div>
  </div>
  <div class="piece shrooms" data-depth="1.1">{@render shroomArt()}</div>
  <div class="piece flutter" data-depth="2.4">{@render butterflyArt()}</div>
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
  .fall,
  .piece {
    position: absolute;
  }

  .fall {
    opacity: 0.35;
  }

  .fern {
    left: 1%;
    top: 36%;
    width: clamp(130px, 14vw, 208px);
    opacity: 0.92;
  }

  .fiddle {
    left: 13.5%;
    top: 63%;
    width: clamp(34px, 3.8vw, 56px);
    opacity: 0.65;
    filter: blur(0.5px);
  }

  .dandelion {
    left: 80%;
    top: 23%;
    width: clamp(80px, 9vw, 130px);
    opacity: 0.9;
  }

  .seed {
    position: absolute;
    left: 54%;
    top: 12%;
    width: 15px;
    opacity: 0.55;
  }

  .seed--b {
    left: 36%;
    top: 20%;
    width: 13px;
  }

  .shrooms {
    left: 15%;
    top: 84%;
    width: clamp(70px, 8vw, 116px);
    opacity: 0.9;
  }

  .flutter {
    left: 77.5%;
    top: 6%;
    width: clamp(34px, 3.6vw, 52px);
    opacity: 0.92;
  }

  @media (max-width: 1100px) {
    .fern {
      width: 96px;
      opacity: 0.55;
      top: 44%;
    }

    .flutter {
      display: none;
    }

    .shrooms {
      left: 2%;
      top: 87%;
      width: 84px;
    }

    .dandelion {
      left: 82.5%;
      width: 88px;
    }
  }

  @media (max-width: 720px) {
    .garden {
      opacity: 0.55;
    }

    .leaf {
      scale: 0.75;
    }

    .fern,
    .fiddle,
    .seed {
      display: none;
    }

    .dandelion {
      width: 62px;
      left: 77%;
      top: 16%;
    }

    .shrooms {
      width: 58px;
      left: 4%;
      top: 86%;
    }
  }
</style>
