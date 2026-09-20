# Lupe — a living webfolio

A frontend-first portfolio built around a **radial menu** that behaves like a
living organism: it sits centered as a hub, then docks to a corner and *melts*
in while a generative garden of leaves and roots grows around it.

Built with **Svelte 5 (runes)** + SvelteKit.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # type-check
npm run build      # production build
```

## Architecture (three layers)

The design deliberately separates the accessible navigation from the spectacle,
so the site fully works even if the GPU layer never loads. See `docs/adr/`.

1. **SVG nav** — `src/lib/radial-menu/`
   Real ARIA menu: annular-sector slices, submenu ring, hover/focus/keyboard
   nav, SSR, themed via CSS custom properties. Pure geometry in `geometry.ts`.
2. **SVG effects**
   - `effects/GooeyFilter.svelte` — blur→alpha-contrast filter that fuses
     slices into a liquid **melt** as they dock.
   - `garden/` — a seeded **L-system** (`lsystem.ts`) generates branches + leaf
     anchors; `Garden.svelte` animates a growth frontier (branches draw on,
     leaves unfurl). Seeded per page → deterministic, unique per section.
3. **WebGL decorative layer** — `effects/EffectsCanvas.svelte` (Pixi.js)
   A metaball melt field behind everything. `aria-hidden`, feature-detected,
   dynamically imported, skipped under `prefers-reduced-motion`.
   _Upgrade seam:_ swap the blur+ColorMatrix approximation for a raymarched
   metaball fragment shader.

Placement is driven by `dock.svelte.ts` (a runes module store); the layout maps
routes → dock position and the CSS transition + gooey filter produce the melt.

## Internationalization

**Paraglide JS** (`@inlang/paraglide-js`). UI strings live in
`messages/{en,de}.json`, compiled to typed getters under `src/lib/paraglide/`
(git-ignored, regenerated on dev/build). Locale resolves URL → cookie → base via
`src/hooks.server.ts` and `src/hooks.ts`.

## Content

Typed TS validated with **Zod** — `src/lib/content/`. Projects carry localized
`title`/`tagline`/`body` plus first-class typed `sources`, `videos`, and `links`.
Malformed content fails at build/dev, not runtime.

## Decisions

Architecture decision records live in [`docs/adr/`](docs/adr/) — runes,
app-not-library, hybrid rendering, Paraglide, typed content, generative garden.
