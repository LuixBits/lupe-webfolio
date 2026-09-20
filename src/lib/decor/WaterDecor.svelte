<script lang="ts">
  import { onMount } from 'svelte';

  let {} = $props();

  // --- deterministic pseudo-random (SSR === client) ---
  const frac = (x: number) => x - Math.floor(x);
  const rnd = (i: number, k: number) =>
    frac(Math.sin(i * 127.1 + k * 311.7) * 43758.5453);

  type Bubble = {
    side: 'left' | 'right';
    x: number;
    bottom: number;
    size: number;
    dur: number;
    delay: number;
    drift: number;
  };

  const makeBubbles = (side: 'left' | 'right', n: number, seed: number): Bubble[] =>
    Array.from({ length: n }, (_, j) => {
      const i = seed + j * 7;
      return {
        side,
        x: 2.5 + rnd(i, 1) * 12.5,
        bottom: 4 + rnd(i, 2) * 26,
        size: 4 + rnd(i, 3) * 9,
        dur: 9 + rnd(i, 4) * 7,
        delay: rnd(i, 5) * 9,
        drift: 6 + rnd(i, 6) * 8
      };
    });

  const bubbles: Bubble[] = [...makeBubbles('left', 8, 11), ...makeBubbles('right', 8, 53)];

  // --- Japanese pond vocabulary (koi, seigaiha, momiji) ----------------
  // Koi authored nose-right around the origin, ~130 units long.
  const KOI_BODY =
    'M62 0C62 -6.6 54 -11.8 44 -14C28 -17.4 8 -17.2 -10 -13C-24 -9.7 -33 -6.4 -39 -3.4C-40.6 -2.6 -40.6 2.6 -39 3.4C-33 6.4 -24 9.7 -10 13C8 17.2 28 17.4 44 14C54 11.8 62 6.6 62 0Z';
  const KOI_TAIL =
    'M-35 -2.5C-44 -8 -52 -16 -64 -21C-60 -14 -61 -8 -57 -3C-62 1 -61 8 -67 15C-56 13 -45 7 -35 2.5Z';
  const KOI_FIN = 'M36 11C31 19 22 26 12 28C17 21 21 15 25 10C28 9 33 9.5 36 11Z';

  type KoiPatch = { cx: number; cy: number; rx: number; ry: number; rot: number };
  const KOI_PATCHES: Record<string, KoiPatch[]> = {
    kohaku: [
      { cx: 30, cy: -4, rx: 17, ry: 13, rot: -14 },
      { cx: -6, cy: 5, rx: 15, ry: 11, rot: 10 },
      { cx: -30, cy: -3, rx: 9, ry: 7, rot: -6 }
    ],
    hi: [
      { cx: 18, cy: 2, rx: 19, ry: 12, rot: 8 },
      { cx: -24, cy: -4, rx: 10, ry: 7, rot: -10 }
    ]
  };

  // Momiji leaf: fan of seven pointed lobes plus a stem.
  const MOMIJI_PETAL = 'M0 0C3 -5 4 -10 0 -17C-4 -10 -3 -5 0 0Z';
  const MOMIJI_LOBES = [
    { a: -84, s: 0.55 },
    { a: -56, s: 0.75 },
    { a: -28, s: 0.9 },
    { a: 0, s: 1 },
    { a: 28, s: 0.9 },
    { a: 56, s: 0.75 },
    { a: 84, s: 0.55 }
  ];

  let root = $state<HTMLElement | null>(null);
  let bubbleEls = $state<HTMLElement[]>([]);

  onMount(() => {
    let disposed = false;
    let tweens: any[] = [];
    let removePointer: (() => void) | undefined;
    let gsapRef: any = null;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      // calm static composition — no JS motion at all
      return;
    }

    (async () => {
      const g = await import('gsap');
      const gsap = g.gsap ?? g.default;
      if (disposed || !root) return;
      gsapRef = gsap;

      // --- kelp sway: gentle rotation around the rooted base ---
      const fronds = root.querySelectorAll<SVGGElement>('.frond');
      fronds.forEach((f, i) => {
        const amp = 2 + rnd(i, 3) * 2.4;
        const dur = 4.5 + rnd(i, 5) * 3.5;
        const t = gsap.fromTo(
          f,
          { rotation: -amp, transformOrigin: '50% 100%' },
          {
            rotation: amp,
            transformOrigin: '50% 100%',
            duration: dur,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
          }
        );
        t.progress(rnd(i, 9));
        tweens.push(t);
      });

      // --- rising bubbles ---
      const rise = Math.min(window.innerHeight * 0.55, 520);
      bubbleEls.forEach((el, i) => {
        if (!el) return;
        const b = bubbles[i];
        gsap.set(el, { autoAlpha: 0 });
        const tl = gsap.timeline({ repeat: -1, delay: b.delay });
        tl.fromTo(
          el,
          { y: 0, autoAlpha: 0 },
          { autoAlpha: 0.55, duration: b.dur * 0.22, ease: 'sine.in' },
          0
        );
        tl.to(el, { y: -rise, duration: b.dur, ease: 'none' }, 0);
        tl.to(el, { autoAlpha: 0, duration: b.dur * 0.28, ease: 'sine.out' }, b.dur * 0.72);
        tweens.push(tl);
        const core = el.firstElementChild;
        if (core) {
          const w = gsap.to(core, {
            x: b.drift,
            duration: 2.2 + rnd(i, 11) * 1.6,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
          });
          w.progress(rnd(i, 13));
          tweens.push(w);
        }
      });

      // --- caustic light drift + slow shimmer ---
      root.querySelectorAll<SVGSVGElement>('svg.caustic').forEach((c, i) => {
        const t = gsap.to(c, {
          x: i % 2 ? -28 : 28,
          duration: 14 + i * 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
        t.progress(rnd(i, 17));
        tweens.push(t);
        const o = gsap.to(c, {
          opacity: 0.5,
          duration: 7 + i * 2.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
        tweens.push(o);
      });

      // --- koi glide: slow drift + gentle heading tilt (inner svg, so it
      //     never fights the parallax quickTo on the [data-depth] wrapper) ---
      root.querySelectorAll<SVGSVGElement>('svg.dkoi').forEach((k, i) => {
        const t1 = gsap.to(k, {
          x: i % 2 ? -34 : 34,
          duration: 12 + rnd(i, 31) * 6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
        t1.progress(rnd(i, 33));
        const t2 = gsap.to(k, {
          y: 16 + rnd(i, 35) * 10,
          duration: 8 + rnd(i, 37) * 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
        t2.progress(rnd(i, 39));
        const t3 = gsap.to(k, {
          rotation: i % 2 ? -6 : 6,
          duration: 10 + i * 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
        tweens.push(t1, t2, t3);
      });

      // --- seigaiha medallions: near-imperceptible slow spin ---
      root.querySelectorAll<SVGSVGElement>('.medallion svg').forEach((m, i) => {
        const t = gsap.to(m, {
          rotation: i % 2 ? 360 : -360,
          duration: 260 + i * 60,
          ease: 'none',
          repeat: -1
        });
        tweens.push(t);
      });

      // --- momiji: floating on the water, bobbing and slowly turning ---
      root.querySelectorAll<HTMLElement>('.momiji-leaf').forEach((l, i) => {
        const t1 = gsap.to(l, {
          y: -7 - rnd(i, 41) * 6,
          duration: 5 + rnd(i, 43) * 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
        t1.progress(rnd(i, 45));
        const t2 = gsap.to(l, {
          rotation: i % 2 ? 14 : -12,
          duration: 9 + rnd(i, 47) * 5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
        t2.progress(rnd(i, 49));
        const t3 = gsap.to(l, {
          x: i % 2 ? -26 : 30,
          duration: 14 + rnd(i, 51) * 6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
        t3.progress(rnd(i, 53));
        tweens.push(t1, t2, t3);
      });

      // --- gentle mouse parallax on depth layers ---
      const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-depth]'));
      const qts = layers.map((el) => {
        const d = parseFloat(el.dataset.depth || '10');
        return {
          x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'sine.out' }),
          y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'sine.out' }),
          d
        };
      });
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        for (const q of qts) {
          q.x(nx * q.d);
          q.y(ny * q.d * 0.6);
        }
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      removePointer = () => window.removeEventListener('pointermove', onMove);
    })();

    return () => {
      disposed = true;
      removePointer?.();
      tweens.forEach((t) => t.kill());
      if (gsapRef && root) gsapRef.killTweensOf(root.querySelectorAll('*'));
    };
  });
</script>

{#snippet kelp(idp: string)}
  <svg class="kelp" viewBox="0 0 320 460" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <path id="{idp}-blade" d="M0 0 C 22 -14 46 -12 60 2 C 44 12 18 10 0 0 Z" />
    </defs>

    <!-- seabed -->
    <ellipse class="pebble" cx="120" cy="452" rx="34" ry="9" />
    <ellipse class="pebble" cx="196" cy="456" rx="48" ry="11" />
    <ellipse class="pebble" cx="70" cy="456" rx="26" ry="8" />

    <!-- undulating ribbon kelp -->
    <g class="frond">
      <path
        class="ribbon"
        d="M56 460 C 68 418 38 386 58 348 C 76 314 48 282 64 246 C 72 226 62 204 70 184 C 72 178 78 176 82 180 C 74 202 86 224 78 248 C 64 284 94 316 76 352 C 60 386 90 420 78 460 Z"
      />
    </g>

    <!-- tall central frond -->
    <g class="frond">
      <path class="stem" d="M150 460 C 142 402 164 356 150 300 C 138 252 166 204 152 150 C 144 118 158 86 148 44" />
      <use href="#{idp}-blade" class="blade" transform="translate(148 414) rotate(-16)" />
      <use href="#{idp}-blade" class="blade" transform="translate(152 366) rotate(14) scale(-0.95 0.95)" />
      <use href="#{idp}-blade" class="blade" transform="translate(150 316) rotate(-20) scale(0.9)" />
      <use href="#{idp}-blade" class="blade" transform="translate(148 268) rotate(16) scale(-0.85 0.85)" />
      <use href="#{idp}-blade" class="blade" transform="translate(155 218) rotate(-18) scale(0.78)" />
      <use href="#{idp}-blade" class="blade" transform="translate(151 172) rotate(12) scale(-0.68 0.68)" />
      <use href="#{idp}-blade" class="blade" transform="translate(150 128) rotate(-16) scale(0.58)" />
      <use href="#{idp}-blade" class="blade" transform="translate(149 88) rotate(10) scale(-0.46 0.46)" />
      <circle class="tipdot" cx="148" cy="40" r="2.4" />
    </g>

    <!-- leaning left frond -->
    <g class="frond">
      <path class="stem" d="M92 460 C 86 418 70 382 78 334 C 84 296 62 260 72 216 C 76 196 70 180 74 162" />
      <use href="#{idp}-blade" class="blade" transform="translate(86 410) rotate(-14) scale(0.7)" />
      <use href="#{idp}-blade" class="blade" transform="translate(78 360) rotate(18) scale(-0.66 0.66)" />
      <use href="#{idp}-blade" class="blade" transform="translate(76 306) rotate(-16) scale(0.6)" />
      <use href="#{idp}-blade" class="blade" transform="translate(68 252) rotate(14) scale(-0.52 0.52)" />
      <use href="#{idp}-blade" class="blade" transform="translate(73 200) rotate(-12) scale(0.44)" />
      <circle class="tipdot" cx="74" cy="158" r="2" />
    </g>

    <!-- right frond -->
    <g class="frond">
      <path class="stem" d="M212 460 C 220 420 238 388 228 340 C 220 300 244 262 232 220 C 226 198 238 172 230 142" />
      <use href="#{idp}-blade" class="blade" transform="translate(216 416) rotate(-15) scale(0.8)" />
      <use href="#{idp}-blade" class="blade" transform="translate(230 372) rotate(16) scale(-0.74 0.74)" />
      <use href="#{idp}-blade" class="blade" transform="translate(226 322) rotate(-18) scale(0.68)" />
      <use href="#{idp}-blade" class="blade" transform="translate(232 274) rotate(14) scale(-0.6 0.6)" />
      <use href="#{idp}-blade" class="blade" transform="translate(234 226) rotate(-14) scale(0.52)" />
      <use href="#{idp}-blade" class="blade" transform="translate(232 182) rotate(12) scale(-0.42 0.42)" />
      <circle class="tipdot" cx="230" cy="138" r="2.2" />
    </g>

    <!-- sea grass -->
    <g class="frond">
      <path class="stem thin" d="M120 460 C 116 428 130 406 122 376" />
      <path class="stem thin" d="M176 460 C 182 430 168 410 178 380" />
      <path class="stem thin" d="M138 460 C 134 424 148 400 140 368" />
      <path class="stem thin" d="M246 460 C 250 434 240 416 248 392" />
    </g>

    <!-- reeds with cattail heads -->
    <g class="frond">
      <path class="stem" d="M272 460C276 402 268 352 274 302C277 274 272 252 275 234" />
      <ellipse class="cattail" cx="275" cy="220" rx="4.5" ry="15" />
      <path class="stem thin" d="M292 460C288 416 296 382 290 346" />
      <path class="reed-leaf" d="M274 388C284 362 296 348 310 340C300 364 288 378 276 392Z" />
    </g>
    <g class="frond">
      <path class="stem thin" d="M256 460C260 422 252 396 258 366" />
      <ellipse class="cattail" cx="258" cy="354" rx="3.4" ry="11" />
    </g>

    <!-- tiny anchored bubbles -->
    <circle class="seed" cx="160" cy="330" r="3" />
    <circle class="seed" cx="98" cy="250" r="2.2" />
    <circle class="seed" cx="236" cy="200" r="2.6" />
  </svg>
{/snippet}

{#snippet caustic()}
  <svg class="caustic" viewBox="0 0 600 220" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    <path class="cw1" d="M0 60 C 70 22 140 98 210 60 C 280 22 350 98 420 60 C 490 22 545 92 600 60" />
    <path class="cw2" d="M0 118 C 80 84 130 152 215 118 C 300 84 355 150 435 118 C 505 92 555 140 600 118" />
    <path class="cw3" d="M0 172 C 60 140 150 200 235 168 C 320 136 380 198 460 168 C 525 144 565 190 600 172" />
    <path class="cw2" d="M20 34 C 90 78 170 12 250 52 C 330 92 410 26 490 62 C 540 84 575 66 600 44" />
    <path class="cw3" d="M0 92 C 85 128 160 60 250 96 C 335 130 415 66 500 100 C 545 118 575 104 600 88" />
  </svg>
{/snippet}

{#snippet koiSvg(kid: string, robe: string, flip: boolean)}
  <svg class="dkoi dk-{robe}" viewBox="-84 -42 168 84" xmlns="http://www.w3.org/2000/svg">
    <g transform="scale({flip ? -1 : 1} 1)">
      <g class="k-tail"><path class="k-skin" d={KOI_TAIL} /></g>
      <path class="k-fin" d={KOI_FIN} />
      <g transform="scale(1 -1)"><path class="k-fin k-fin-l" d={KOI_FIN} /></g>
      <path class="k-skin" d={KOI_BODY} />
      <clipPath id="wdk-{kid}"><path d={KOI_BODY} /></clipPath>
      <g clip-path="url(#wdk-{kid})">
        {#each KOI_PATCHES[robe] as p, i (i)}
          <ellipse
            class="k-patch"
            cx={p.cx}
            cy={p.cy}
            rx={p.rx}
            ry={p.ry}
            transform="rotate({p.rot} {p.cx} {p.cy})"
          />
        {/each}
      </g>
      <circle class="k-eye" cx="49" cy="-7" r="1.8" />
      <circle class="k-eye" cx="49" cy="7" r="1.8" />
    </g>
  </svg>
{/snippet}

{#snippet medallion(mid: string)}
  <svg class="med" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <g id="wmd-{mid}-fan">
        <circle r="22" class="med-fill" />
        <circle r="22" class="med-line" fill="none" />
        <circle r="16.5" class="med-line" fill="none" />
        <circle r="11" class="med-line" fill="none" />
        <circle r="5.5" class="med-line" fill="none" />
      </g>
      <pattern id="wmd-{mid}" width="44" height="22" patternUnits="userSpaceOnUse">
        <use href="#wmd-{mid}-fan" x="22" y="33" />
        <use href="#wmd-{mid}-fan" x="0" y="22" />
        <use href="#wmd-{mid}-fan" x="44" y="22" />
        <use href="#wmd-{mid}-fan" x="22" y="11" />
        <use href="#wmd-{mid}-fan" x="0" y="0" />
        <use href="#wmd-{mid}-fan" x="44" y="0" />
        <use href="#wmd-{mid}-fan" x="22" y="-11" />
      </pattern>
      <clipPath id="wmd-{mid}-clip"><circle cx="60" cy="60" r="52" /></clipPath>
    </defs>
    <circle cx="60" cy="60" r="56" class="med-ring-outer" />
    <g clip-path="url(#wmd-{mid}-clip)"><rect width="120" height="120" fill="url(#wmd-{mid})" /></g>
    <circle cx="60" cy="60" r="52" class="med-ring" />
  </svg>
{/snippet}

{#snippet momiji()}
  <svg class="momiji-svg" viewBox="-20 -20 40 40" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(15)">
      {#each MOMIJI_LOBES as l, i (i)}
        <path class="mo-lobe" transform="rotate({l.a}) scale({l.s})" d={MOMIJI_PETAL} />
      {/each}
      <path class="mo-stem" d="M0 0C0.5 4 0 7 -1.5 11" />
    </g>
  </svg>
{/snippet}

<div class="water-decor" aria-hidden="true" bind:this={root}>
  <!-- soft submerged light glows, corners only -->
  <div class="glow g-tl" data-depth="6"></div>
  <div class="glow g-br" data-depth="6"></div>

  <!-- drifting caustics, top corners -->
  <div class="caustic-wrap c-tl" data-depth="14">{@render caustic()}</div>
  <div class="caustic-wrap c-tr" data-depth="10">{@render caustic()}</div>

  <!-- seigaiha medallions stamped in the margins -->
  <div class="medallion m-tr" data-depth="9">{@render medallion('a')}</div>
  <div class="medallion m-l" data-depth="7">{@render medallion('b')}</div>

  <!-- koi gliding through the margins -->
  <div class="deco-koi koi-right" data-depth="16">{@render koiSvg('a', 'kohaku', true)}</div>
  <div class="deco-koi koi-left" data-depth="20">{@render koiSvg('b', 'hi', false)}</div>

  <!-- momiji drifting on the water -->
  <div class="leaf-field" data-depth="12">
    <div class="momiji-leaf ml-a">{@render momiji()}</div>
    <div class="momiji-leaf ml-b">{@render momiji()}</div>
    <div class="momiji-leaf ml-c">{@render momiji()}</div>
  </div>

  <!-- rising bubbles along the side edges -->
  <div class="bubble-field" data-depth="8">
    {#each bubbles as b, i}
      <div
        class="bubble"
        bind:this={bubbleEls[i]}
        style={`${b.side}:${b.x}%;bottom:${b.bottom}%;width:${b.size}px;height:${b.size}px;`}
      >
        <span></span>
      </div>
    {/each}
  </div>

  <!-- kelp clusters rooted at the bottom corners -->
  <div class="cluster left" data-depth="18">{@render kelp('kL')}</div>
  <div class="cluster right" data-depth="12">{@render kelp('kR')}</div>
</div>

<style>
  .water-decor {
    position: fixed;
    inset: 0;
    z-index: 6;
    pointer-events: none;
    overflow: hidden;
    contain: strict;
  }

  /* --- corner glows --- */
  .glow {
    position: absolute;
    width: 34vw;
    height: 34vw;
    max-width: 30rem;
    max-height: 30rem;
    border-radius: 50%;
    background: radial-gradient(closest-side, var(--water-foam, #cdeef6), transparent 72%);
    opacity: 0.13;
    will-change: transform;
  }
  .g-tl { top: -12vw; left: -12vw; }
  .g-br { bottom: -14vw; right: -12vw; opacity: 0.1; }

  /* --- caustics --- */
  .caustic-wrap {
    position: absolute;
    width: clamp(200px, 24vw, 360px);
    will-change: transform;
  }
  .c-tl { top: 1.25rem; left: -2.25rem; }
  .c-tr { top: 3.25rem; right: -2.25rem; transform: scaleX(-1); }
  svg.caustic {
    display: block;
    width: 100%;
    height: auto;
    opacity: 0.28;
    filter: blur(0.6px);
    will-change: transform, opacity;
  }
  svg.caustic path {
    stroke: var(--water-foam, #cdeef6);
    fill: none;
    stroke-linecap: round;
  }
  .cw1 { stroke-width: 1.4; opacity: 0.55; }
  .cw2 { stroke-width: 1.1; opacity: 0.38; }
  .cw3 { stroke-width: 0.9; opacity: 0.26; }

  /* --- bubbles --- */
  .bubble-field {
    position: absolute;
    inset: 0;
    will-change: transform;
  }
  .bubble {
    position: absolute;
    opacity: 0.35; /* calm static fallback when motion is reduced */
    will-change: transform, opacity;
  }
  .bubble span {
    display: block;
    width: 100%;
    height: 100%;
    border: 1px solid var(--water-foam, #cdeef6);
    border-radius: 50%;
    background: radial-gradient(circle at 34% 30%, var(--water-foam, #cdeef6), transparent 46%);
    will-change: transform;
  }

  /* --- kelp clusters --- */
  .cluster {
    position: absolute;
    bottom: -0.75rem;
    width: clamp(160px, 21vw, 320px);
    will-change: transform;
  }
  .cluster.left { left: -1.25rem; }
  .cluster.right { right: -1.25rem; opacity: 0.9; }
  .cluster.right svg.kelp { transform: scaleX(-1); }
  svg.kelp {
    display: block;
    width: 100%;
    height: auto;
  }

  .frond { will-change: transform; }
  .stem {
    stroke: var(--water-deep, #2b9cba);
    stroke-width: 2.2;
    stroke-linecap: round;
    fill: none;
    opacity: 0.75;
  }
  .stem.thin {
    stroke-width: 1.3;
    opacity: 0.55;
  }
  .blade {
    fill: var(--accent, #2b9cba);
    fill-opacity: 0.26;
    stroke: var(--water-deep, #2b9cba);
    stroke-width: 0.9;
    stroke-opacity: 0.45;
  }
  .ribbon {
    fill: var(--slice-bg, #6cc3d6);
    fill-opacity: 0.35;
    stroke: var(--water-deep, #2b9cba);
    stroke-opacity: 0.35;
    stroke-width: 1;
  }
  .pebble {
    fill: var(--water-deep, #2b9cba);
    opacity: 0.14;
  }
  .tipdot {
    fill: var(--water-foam, #cdeef6);
    opacity: 0.85;
  }
  .seed {
    stroke: var(--water-foam, #cdeef6);
    fill: none;
    stroke-width: 1;
    opacity: 0.65;
  }

  .cattail {
    fill: #8a6a48;
    opacity: 0.55;
  }
  .reed-leaf {
    fill: var(--water-deep, #2b9cba);
    opacity: 0.25;
  }

  /* --- koi in the margins --- */
  .deco-koi {
    position: absolute;
    width: clamp(110px, 11vw, 170px);
    will-change: transform;
  }
  .koi-right { right: 2.5%; top: 32%; }
  .koi-left { left: 2%; top: 58%; }
  svg.dkoi {
    display: block;
    width: 100%;
    height: auto;
    opacity: 0.92;
    will-change: transform;
  }
  .k-skin {
    stroke: rgba(30, 95, 111, 0.4);
    stroke-width: 1;
  }
  .dk-kohaku .k-skin { fill: #f7fbfc; }
  .dk-kohaku .k-patch { fill: #e0603c; }
  .dk-hi .k-skin { fill: #e07a3f; }
  .dk-hi .k-patch { fill: #c05028; }
  .k-patch { opacity: 0.92; }
  .k-fin {
    fill: rgba(255, 255, 255, 0.6);
    stroke: rgba(30, 95, 111, 0.35);
    stroke-width: 0.8;
    transform-box: fill-box;
    transform-origin: 100% 0%;
    animation: dfin 3.4s ease-in-out infinite alternate;
  }
  .k-fin-l { animation-delay: -1.6s; }
  .k-tail {
    transform-box: fill-box;
    transform-origin: 96% 45%;
    animation: dwag 2.1s ease-in-out infinite alternate;
  }
  @keyframes dwag {
    from { transform: rotate(-6deg); }
    to { transform: rotate(6deg); }
  }
  @keyframes dfin {
    from { transform: rotate(-8deg); }
    to { transform: rotate(6deg); }
  }
  .k-eye { fill: #14343d; }

  /* --- seigaiha medallions --- */
  .medallion {
    position: absolute;
    width: clamp(90px, 9vw, 140px);
    opacity: 0.3;
    will-change: transform;
  }
  .m-tr { top: 11%; right: 4%; }
  .m-l { top: 40%; left: 3.5%; }
  svg.med {
    display: block;
    width: 100%;
    height: auto;
    will-change: transform;
  }
  .med-fill { fill: var(--bg, #e8f4f8); }
  .med-line {
    stroke: var(--water-deep, #2b9cba);
    stroke-opacity: 0.55;
    stroke-width: 1.3;
  }
  .med-ring {
    fill: none;
    stroke: var(--water-deep, #2b9cba);
    stroke-opacity: 0.5;
    stroke-width: 1.6;
  }
  .med-ring-outer {
    fill: var(--bg, #e8f4f8);
    fill-opacity: 0.5;
    stroke: var(--water-deep, #2b9cba);
    stroke-opacity: 0.3;
    stroke-width: 1;
  }

  /* --- momiji leaves --- */
  .leaf-field {
    position: absolute;
    inset: 0;
    will-change: transform;
  }
  .momiji-leaf {
    position: absolute;
    opacity: 0.85;
    will-change: transform;
  }
  .ml-a { left: 10%; bottom: 12%; width: 34px; }
  .ml-b { right: 15%; bottom: 7%; width: 26px; }
  .ml-c { right: 6%; bottom: 25%; width: 30px; }
  .momiji-svg {
    display: block;
    width: 100%;
    height: auto;
  }
  .mo-lobe { fill: #cd5b45; }
  .ml-b .mo-lobe { fill: #d97a54; }
  .mo-stem {
    fill: none;
    stroke: #a34433;
    stroke-width: 1.4;
    stroke-linecap: round;
  }

  @media (prefers-reduced-motion: reduce) {
    .k-tail,
    .k-fin {
      animation: none !important;
    }
  }

  @media (max-width: 950px) {
    .deco-koi,
    .medallion,
    .momiji-leaf { display: none; }
  }

  @media (max-width: 700px) {
    .cluster { width: clamp(120px, 34vw, 180px); }
    .c-tr { display: none; }
    .caustic-wrap { width: clamp(160px, 44vw, 240px); }
    .bubble:nth-child(3n) { display: none; }
  }
</style>