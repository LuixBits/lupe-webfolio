# Handoff — lupe-webfolio

A themed **radial-menu portfolio**. SvelteKit + **Svelte 5 (runes)**, adapter-node.
Repo: `LuixBits/lupe-webfolio` (`main`). Read this before picking up work.

## ⚠️ Work visually

All look-and-feel work must be done **with a browser** — run the app, look at
it, iterate. Never push CSS you haven't looked at. On the owner's machine the
setup quirks (NixOS Playwright → system chromium, ports) are in the assistant's
project memory. `npm run check` must stay at 0 errors.

## Run it

```bash
npm install
npm run dev            # Vite prints the port (5173 is often taken by a tunnel)
# or: npm run check / npm run build
```
Node 22. Paraglide (i18n) messages compile to `src/lib/paraglide/` (git-ignored)
on dev/build; if `$lib/paraglide/*` is missing run
`npx @inlang/paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide`.

## Interaction model

- **Home (`/`) = the hub:** four full-bleed themed scene squares (About
  top-left · Projects top-right · Hobbies bottom-left · CV bottom-right) with a
  luminous hairline seam where they meet, and the **radial wheel centered on
  top** as the **only navigation**. Hovering a wedge opens a **second row of
  sub-segments as an outer ring** confined to that wedge's quarter (clickable
  deep links). This ring-on-hover behavior is an explicit owner decision.
- **Click a segment →** "drop into the environment": the hub zooms past the
  camera, the section's world settles in, the wheel glides to a corner (docked
  sub-nav: sub-segments subdivide the quarter + curved **Back** hub), content
  drops in. Route-driven + SSR-safe; locale-prefixed URLs (`/de/...`) are
  delocalized before section matching everywhere (layout, wheel, hooks).
- Sections: `/about`, `/projects`, `/hobbies`, `/cv` (sub-links anchor into
  each page).

## Architecture map

- `routes/+layout.svelte` — theme from route, hub vs section, the zoom/settle
  transitions, fixed-layer wrappers (`.layer` divs keep transforms from
  re-anchoring fixed children).
- Layer order: hub backdrop z4 < decor z6 < **footer z8 (ground plane)** <
  content z10 < corner scene z12 < wheel z20.
- `lib/themes.ts` / `themes.css` — 4 themes (garden/water/vaporwave/cosmos),
  `data-theme` palette + fonts per route. about=garden, cv=water,
  projects=vaporwave, hobbies=cosmos.
- `lib/radial-menu/` — the wheel: per-wedge themed art + typography, sheen/glow
  SVG filters, outer hover ring, docked subdivision, jewel Back hub.
- `lib/scenes/*` — per-theme scenes with `variant="hub"` (full-square hub
  composition) vs `variant="corner"` (docked section look). Garden corner is
  scaled 0.78 in `CornerScene.svelte` so the L-system never sprawls over text.
- `lib/decor/*` — per-theme floating decor (GSAP mouse-parallax, deliberately
  gentle — the owner dislikes wobble; hub has NO mouse effect).
- `lib/components/footer/*` — four bespoke footers (meadow / Hokusai wave /
  outrun car / planet horizon). Rule: **no SVG sliced mid-shape at the edges**.
- `routes/*/+page.svelte` — each section has a bespoke presentation:
  About = Herbarium Folio + **Grove walk**, Projects = VHS rental wall,
  Hobbies = Star Atlas, CV = Sounding Line (depth-as-time). CV's
  education/positions live in `lib/content/cv.ts`.
- **Grove walk (About)**: chapters grow into view on scroll — a shared
  IntersectionObserver (`lib/garden/reveal.ts`) flips per-chapter classes,
  CSS does the animating (transform/opacity one-shots); a margin vine
  (`lib/garden/Spine.svelte`) draws via stroke-dashoffset scrubbed to scroll
  (retracts on scroll-up, by design). `Garden.svelte` gained `start` (grow
  when revealed) + preset overrides (`step`/`iterations`/`angle`/`leafScale`/
  `strokeWidth`) — plant params were picked by bbox-scanning seeds (the
  L-system is deterministic). SSR/no-JS/reduced-motion always get a fully
  grown page: the hidden `pending` state exists only client-side under
  `prefers-reduced-motion: no-preference`.
- **Living structural lines** (`lib/garden/LivingLine.svelte`): the About
  page's section rules, card/packet borders, note dividers, and soil lines
  are grown wood — seeded wavy paths drawing via stroke-dashoffset with
  twigs + leaves popping along them (variants: underline / frame / stem /
  soil; self-observing or `grow`-gated; pure CSS transitions, no rAF). The
  static CSS borders remain underneath as the SSR/no-JS fallback and are
  hidden only once hydrated (`.living` class on the page). Frame radii are
  authored in px and MUST match each box's CSS `border-radius`.
- `lib/content/*` — typed + Zod-validated bilingual content.

## Owner to fill (placeholder content)

- Real projects (shelves show ghost "rental slot" placeholders), real hobby
  photos/videos (Rick Astley + stock shots are placeholders), CV
  `education[]`/`positions[]` entries (marked "— placeholder"), and the About
  page's optional herbarium fields (epithet/since/link notes — see
  `routes/about/+page.svelte` fallbacks).
- About `chapters[]` in `lib/content/about.ts` (roots / passions / mycelium /
  ADHD-as-pioneer): structure + ids are load-bearing, but the prose is
  assistant-written placeholder voice — owner should rewrite in their own
  words (en + de).

## Known open items

- Mobile: the docked wheel overlays content mid-scroll on narrow screens
  (site-wide pattern; consider fading/shrinking the docked wheel on scroll).
- Handoff-era open question, still unconfirmed: the wheel docks to the corner
  **opposite** its hub quadrant — confirm the owner wants that end position.
- Optional i18n nicety: singular `hobbies_plate`/`hobbies_signal` keys would
  let plate captions read "Plate I·1" instead of glyphs.

## Deploy & versioning

Committed per milestone; push to `main`. Live at **https://luizperren.dev** via
a systemd `webfolio` unit (adapter-node on `127.0.0.1:3001`) behind Traefik +
Cloudflare. Redeploy = `npm run build` then `sudo systemctl restart webfolio`
(on the server). Full infra notes in the server's config repo / project memory.
