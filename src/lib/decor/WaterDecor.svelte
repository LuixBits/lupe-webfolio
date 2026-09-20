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

<div class="water-decor" aria-hidden="true" bind:this={root}>
  <!-- soft submerged light glows, corners only -->
  <div class="glow g-tl" data-depth="6"></div>
  <div class="glow g-br" data-depth="6"></div>

  <!-- drifting caustics, top corners -->
  <div class="caustic-wrap c-tl" data-depth="14">{@render caustic()}</div>
  <div class="caustic-wrap c-tr" data-depth="10">{@render caustic()}</div>

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

  @media (max-width: 700px) {
    .cluster { width: clamp(120px, 34vw, 180px); }
    .c-tr { display: none; }
    .caustic-wrap { width: clamp(160px, 44vw, 240px); }
    .bubble:nth-child(3n) { display: none; }
  }
</style>