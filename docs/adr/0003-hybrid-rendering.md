# ADR-0003: Hybrid rendering — accessible SVG nav + WebGL decorative layer

- Status: accepted
- Date: 2026-09-20

## Context

The radial menu should "melt into the corner" and sprout leaves/roots. That
spectacle wants GPU/liquid effects, but navigation must stay accessible and
server-rendered. One substrate can't do both well.

## Decision

Split into layers:

1. **SVG/DOM nav** (`RadialMenu.svelte`) — real ARIA menu, keyboard nav, SSR,
   themable via CSS vars. The nav's correctness never depends on the GPU.
2. **SVG effects** — a gooey filter (`GooeyFilter.svelte`) fuses slices into a
   liquid melt; the generative garden (`Garden.svelte`) draws with
   stroke-reveal. Works everywhere, no GPU needed.
3. **WebGL decorative layer** (`EffectsCanvas.svelte`, Pixi.js) — a metaball
   melt field behind everything. `aria-hidden`, feature-detected, and skipped
   under `prefers-reduced-motion`.

## Consequences

- Graceful degradation: kill layer 3 and the design still stands.
- Pixi is dynamically imported (SSR-safe, off the critical path).
- **Upgrade seam:** layer 3 currently approximates metaballs with
  blur + ColorMatrix. Swapping in a raymarched metaball fragment shader
  (Pixi Filter / Mesh+Shader) is a future step, isolated to that one file.

## Alternatives rejected

- Full WebGL (Threlte) for everything — nav a11y/SSR would ride on the GPU.
- SVG-only — caps the "wow" ceiling the brief explicitly asked for.
