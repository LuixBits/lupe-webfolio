<script lang="ts">
  import { onMount } from 'svelte';

  let { seed = 7 }: { seed?: number } = $props();

  let rootEl: HTMLDivElement | undefined = $state(undefined);

  const TAU = Math.PI * 2;

  /* umbel geometry for the allium head */
  const RING = Array.from({ length: 11 }, (_, k) => ({
    x: Math.cos((k / 11) * TAU) * 9.5,
    y: Math.sin((k / 11) * TAU) * 9.5
  }));

  const PETALS = [0, 1, 2, 3, 4, 5, 6, 7];

  /* seed-spray filaments */
  const FILS = [-52, -26, 0, 26, 52].map((deg) => {
    const r = (deg * Math.PI) / 180;
    const ex = Math.sin(r) * 14;
    const ey = -Math.cos(r) * 14;
    return {
      d: `M 0 0 Q ${(ex * 0.35).toFixed(1)} ${(ey * 0.6).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`,
      ex,
      ey
    };
  });

  const STARS = [
    { x: 1042, y: 24, s: 1 },
    { x: 1118, y: 50, s: 0.65 },
    { x: 968, y: 44, s: 0.55 },
    { x: 296, y: 30, s: 0.6 }
  ];

  /* deterministic hash-based pseudo-random: SSR output === client output */
  function makeRnd(sd: number) {
    return (i: number, s: number) => {
      let x = ((i + 1) * 374761393 + (s + 1) * 668265263 + (sd + 1) * 974711) >>> 0;
      x = ((x ^ (x >>> 13)) * 1274126177) >>> 0;
      return ((x ^ (x >>> 16)) % 10000) / 10000;
    };
  }

  const qp = (a: number, c: number, b: number, t: number) =>
    (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;
  const qd = (a: number, c: number, b: number, t: number) => 2 * (1 - t) * (c - a) + 2 * t * (b - c);

  function build(sd: number) {
    const rnd = makeRnd(sd);

    const plants = Array.from({ length: 8 }, (_, i) => {
      const x0 = 58 + i * 155 + (rnd(i, 1) - 0.5) * 64;
      const hgt = 74 + rnd(i, 2) * 40;
      const lean = (rnd(i, 3) - 0.5) * 46;
      const y0 = 144;
      const x1 = x0 + lean;
      const y1 = y0 - hgt;
      const cx = x0 + lean * 0.2;
      const cy = y0 - hgt * 0.55;
      const leaves = [0.36, 0.6].map((t, j) => {
        const lx = qp(x0, cx, x1, t);
        const ly = qp(y0, cy, y1, t);
        const tang = (Math.atan2(qd(y0, cy, y1, t), qd(x0, cx, x1, t)) * 180) / Math.PI;
        const side = (i + j) % 2 === 0 ? 1 : -1;
        return {
          x: lx,
          y: ly,
          a: tang + side * 62,
          s: 0.75 + rnd(i, 10 + j) * 0.5,
          flip: side < 0
        };
      });
      return {
        i,
        d: `M ${x0.toFixed(1)} ${y0} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`,
        tipX: x1,
        tipY: y1,
        kind: i % 4,
        leaves,
        delay: rnd(i, 6) * 0.9,
        sway: 1.1 + rnd(i, 7) * 1.5,
        sw: 1.4 + rnd(i, 8) * 0.5
      };
    });

    const hedge = (salt: number, base: number, amp: number) => {
      let d = `M 0 156 L 0 ${base}`;
      const n = 14;
      const w = 1200 / n;
      for (let k = 0; k < n; k++) {
        const bh = amp * (0.55 + rnd(k, salt) * 0.85);
        d += ` Q ${(k * w + w / 2).toFixed(0)} ${(base - bh).toFixed(1)} ${((k + 1) * w).toFixed(0)} ${base}`;
      }
      return d + ' L 1200 156 Z';
    };

    const pollen = Array.from({ length: 12 }, (_, i) => ({
      x: 40 + rnd(i, 20) * 1120,
      y: 34 + rnd(i, 21) * 96,
      r: 1 + rnd(i, 22) * 1.5,
      o: 0.25 + rnd(i, 23) * 0.4
    }));

    const blades = Array.from({ length: 12 }, (_, i) => {
      const bx = 24 + rnd(i, 70) * 1152;
      const bl = (rnd(i, 71) - 0.5) * 26;
      const bh = 20 + rnd(i, 72) * 26;
      return {
        d: `M ${bx.toFixed(1)} 157 Q ${(bx + bl * 0.4).toFixed(1)} ${(157 - bh * 0.6).toFixed(1)} ${(bx + bl).toFixed(1)} ${(157 - bh).toFixed(1)}`
      };
    });

    const nearLeaves = Array.from({ length: 6 }, (_, i) => ({
      x: 60 + rnd(i, 40) * 1080,
      rot: (rnd(i, 41) - 0.5) * 46,
      s: 0.65 + rnd(i, 42) * 0.7,
      dark: i % 2 === 0
    }));

    return {
      plants,
      pollen,
      blades,
      nearLeaves,
      hedgeFar: hedge(30, 108, 26),
      hedgeMid: hedge(31, 126, 22)
    };
  }

  const data = $derived(build(seed));

  onMount(() => {
    let disposed = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const g = await import('gsap');
      const gsap = g.gsap ?? g.default;
      if (disposed || !rootEl) return;
      /* reduced motion: keep the calm, fully-grown static composition */
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const root = rootEl;
      const rnd = makeRnd(seed);
      const plants = data.plants;
      let onMove: ((e: MouseEvent) => void) | null = null;

      const ctx = gsap.context(() => {
        /* ---- growth-in (plays once, then the garden stays grown) ---- */
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        tl.from(root.querySelectorAll('.hedge-far'), { y: 20, opacity: 0, duration: 1 }, 0);
        tl.from(root.querySelectorAll('.hedge-mid'), { y: 24, opacity: 0, duration: 1 }, 0.15);
        tl.from(
          root.querySelectorAll('.celestial'),
          { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 1.3, stagger: 0.1 },
          0.4
        );

        plants.forEach((p) => {
          const stem = root.querySelector(`.stem-${p.i}`) as SVGPathElement | null;
          if (!stem) return;
          const len = stem.getTotalLength();
          const t0 = 0.25 + p.delay;
          tl.fromTo(
            stem,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 1.15, ease: 'power2.inOut' },
            t0
          );
          tl.from(
            root.querySelectorAll(`.p${p.i} .leaf`),
            { scale: 0, transformOrigin: '0% 50%', duration: 0.55, ease: 'back.out(1.7)', stagger: 0.16 },
            t0 + 0.5
          );
          tl.from(
            root.querySelectorAll(`.p${p.i} .bloom`),
            { scale: 0, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(1.8)' },
            t0 + 0.95
          );
        });

        tl.from(
          root.querySelectorAll('.blade'),
          { scaleY: 0, transformOrigin: '50% 100%', duration: 0.7, stagger: 0.05 },
          0.4
        );
        tl.from(
          root.querySelectorAll('.near-leaf'),
          { scale: 0, transformOrigin: '50% 100%', duration: 0.85, ease: 'back.out(1.4)', stagger: 0.12 },
          0.55
        );

        /* ---- perpetual gentle sway ---- */
        plants.forEach((p) => {
          gsap.to(root.querySelectorAll(`.p${p.i}`), {
            rotation: p.sway,
            transformOrigin: '50% 100%',
            duration: 2.8 + rnd(p.i, 60) * 1.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 2 + p.delay
          });
        });
        gsap.to(root.querySelectorAll('.near-leaf'), {
          rotation: '+=2.6',
          transformOrigin: '50% 100%',
          duration: 3.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.35,
          delay: 2
        });
        gsap.to(root.querySelectorAll('.blade'), {
          rotation: 2.2,
          transformOrigin: '50% 100%',
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.2,
          delay: 1.6
        });
        gsap.to(root.querySelectorAll('.sun-ring'), {
          rotation: 360,
          transformOrigin: '50% 50%',
          duration: 90,
          repeat: -1,
          ease: 'none'
        });

        /* ---- drifting pollen ---- */
        root.querySelectorAll('.pollen').forEach((el, i) => {
          gsap.set(el, { opacity: 0 });
          gsap.to(el, {
            y: -(26 + rnd(i, 50) * 34),
            x: (rnd(i, 51) - 0.5) * 36,
            duration: 8 + rnd(i, 52) * 6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: rnd(i, 54) * 3
          });
          gsap.fromTo(
            el,
            { opacity: 0 },
            {
              opacity: 0.25 + rnd(i, 23) * 0.4,
              duration: 2.2 + rnd(i, 53) * 2,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: 1.2 + rnd(i, 55) * 3
            }
          );
        });

        /* ---- subtle mouse parallax, depth-graded per layer ---- */
        const layers = ['far', 'mid', 'near'].map((k) => root.querySelector(`.layer-${k}`));
        const amounts = [10, 22, 36];
        const setters = layers.map((l) =>
          l ? gsap.quickTo(l, 'x', { duration: 1, ease: 'power3.out' }) : null
        );
        onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          setters.forEach((s, i) => s && s(nx * amounts[i]));
        };
        window.addEventListener('mousemove', onMove, { passive: true });
      }, root);

      cleanup = () => {
        if (onMove) window.removeEventListener('mousemove', onMove);
        ctx.revert();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  });
</script>

<div class="garden" bind:this={rootEl} aria-hidden="true">
  <svg viewBox="0 0 1200 156" preserveAspectRatio="xMidYMax slice" role="presentation" focusable="false">
    <!-- far layer: hedgerow horizon + quiet celestial marks -->
    <g class="layer layer-far">
      <g class="celestial sun" transform="translate(150 38)">
        <circle class="sun-core" r="15" />
        <circle class="sun-ring" r="22" />
      </g>
      {#each STARS as st}
        <path
          class="celestial star"
          transform={`translate(${st.x} ${st.y}) scale(${st.s})`}
          d="M 0 -3.2 L 0.9 -0.9 L 3.2 0 L 0.9 0.9 L 0 3.2 L -0.9 0.9 L -3.2 0 L -0.9 -0.9 Z"
        />
      {/each}
      <path class="hedge-far" d={data.hedgeFar} />
    </g>

    <!-- mid layer: the flowering bed -->
    <g class="layer layer-mid">
      <path class="hedge-mid" d={data.hedgeMid} />
      {#each data.plants as p (p.i)}
        <g class={`plant p${p.i}`}>
          <path class={`stem stem-${p.i}`} d={p.d} stroke-width={p.sw} />
          {#each p.leaves as l}
            <g
              class="leaf"
              transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.a.toFixed(1)}) scale(${l.s.toFixed(2)} ${(l.flip ? -l.s : l.s).toFixed(2)})`}
            >
              <path class="leaf-fill" d="M 0 0 C 6 -6 15 -8 21 -3 C 15 3 6 4 0 0 Z" />
              <path class="leaf-rib" d="M 2 -1 C 8 -3 14 -3.5 19 -2.8" />
            </g>
          {/each}
          <g class="bloom" transform={`translate(${p.tipX.toFixed(1)} ${p.tipY.toFixed(1)})`}>
            {#if p.kind === 0}
              {#each PETALS as k}
                <ellipse class="petal" cx="0" cy="-6.5" rx="2.5" ry="6.5" transform={`rotate(${k * 45})`} />
              {/each}
              <circle class="disc" r="3.2" />
            {:else if p.kind === 1}
              {#each RING as pt}
                <line class="spoke" x1="0" y1="0" x2={pt.x.toFixed(1)} y2={pt.y.toFixed(1)} />
                <circle class="floret" cx={pt.x.toFixed(1)} cy={pt.y.toFixed(1)} r="1.9" />
              {/each}
              <circle class="disc" r="2" />
            {:else if p.kind === 2}
              <path class="sepal" d="M 0 1 C -6 -1 -9 -7 -8 -12 C -3.5 -9 -1 -4 0 1 Z" />
              <path class="sepal" d="M 0 1 C 6 -1 9 -7 8 -12 C 3.5 -9 1 -4 0 1 Z" />
              <path class="tulip" d="M 0 2 C -7 -2 -7.5 -13 0 -17 C 7.5 -13 7 -2 0 2 Z" />
              <path class="tulip-rib" d="M 0 -14 C -1.6 -9 -1.6 -4 0 -0.5" />
            {:else}
              {#each FILS as f}
                <path class="filament" d={f.d} />
                <circle class="floret" cx={f.ex.toFixed(1)} cy={f.ey.toFixed(1)} r="1.6" />
              {/each}
            {/if}
          </g>
        </g>
      {/each}
    </g>

    <!-- near layer: foreground silhouette leaves and grass blades -->
    <g class="layer layer-near">
      {#each data.blades as b}
        <path class="blade" d={b.d} />
      {/each}
      {#each data.nearLeaves as n}
        <g
          class="near-leaf"
          transform={`translate(${n.x.toFixed(1)} 158) rotate(${n.rot.toFixed(1)}) scale(${n.s.toFixed(2)})`}
        >
          <path class={n.dark ? 'nl-dark' : 'nl-mid'} d="M 0 0 C -15 -16 -17 -42 -2 -60 C 13 -42 11 -16 0 0 Z" />
          <path class="nl-rib" d="M -1 -6 C -3.5 -22 -3.5 -40 -2 -54" />
        </g>
      {/each}
    </g>

    <!-- pollen motes -->
    <g class="layer layer-pollen">
      {#each data.pollen as d}
        <circle class="pollen" cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={d.r.toFixed(2)} opacity={d.o.toFixed(2)} />
      {/each}
    </g>
  </svg>
</div>

<style>
  .garden {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .garden svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  .hedge-far {
    fill: var(--slice-bg, #7fb08a);
    opacity: 0.28;
  }
  .hedge-mid {
    fill: var(--slice-bg, #7fb08a);
    opacity: 0.45;
  }
  .sun-core {
    fill: var(--accent, #4f8a63);
    opacity: 0.14;
  }
  .sun-ring {
    fill: none;
    stroke: var(--accent, #4f8a63);
    stroke-width: 1;
    stroke-dasharray: 1 7;
    stroke-linecap: round;
    opacity: 0.55;
  }
  .star {
    fill: var(--accent, #4f8a63);
    opacity: 0.5;
  }
  .stem {
    fill: none;
    stroke: var(--garden-stem, #3f6d4e);
    stroke-linecap: round;
  }
  .leaf-fill {
    fill: var(--garden-leaf, #6bbf7b);
    opacity: 0.92;
  }
  .leaf-rib {
    fill: none;
    stroke: var(--garden-stem, #3f6d4e);
    stroke-width: 0.7;
    opacity: 0.55;
  }
  .petal {
    fill: var(--slice-bg, #7fb08a);
    stroke: var(--accent, #4f8a63);
    stroke-width: 0.6;
    opacity: 0.95;
  }
  .disc {
    fill: var(--hub-bg, #2f4f3a);
  }
  .spoke {
    stroke: var(--garden-stem, #3f6d4e);
    stroke-width: 0.7;
    opacity: 0.7;
  }
  .floret {
    fill: var(--accent, #4f8a63);
  }
  .tulip {
    fill: var(--accent, #4f8a63);
  }
  .tulip-rib {
    fill: none;
    stroke: var(--slice-bg, #7fb08a);
    stroke-width: 0.8;
    opacity: 0.8;
  }
  .sepal {
    fill: var(--garden-leaf, #6bbf7b);
    opacity: 0.85;
  }
  .filament {
    fill: none;
    stroke: var(--garden-stem, #3f6d4e);
    stroke-width: 0.9;
  }
  .blade {
    fill: none;
    stroke: var(--garden-stem, #3f6d4e);
    stroke-width: 1.3;
    stroke-linecap: round;
    opacity: 0.65;
  }
  .nl-dark {
    fill: var(--hub-bg, #2f4f3a);
    opacity: 0.9;
  }
  .nl-mid {
    fill: var(--garden-stem, #3f6d4e);
    opacity: 0.85;
  }
  .nl-rib {
    fill: none;
    stroke: var(--garden-leaf, #6bbf7b);
    stroke-width: 0.9;
    opacity: 0.5;
  }
  .pollen {
    fill: var(--garden-leaf, #6bbf7b);
  }
</style>
