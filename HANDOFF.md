# Handoff — lupe-webfolio

A themed **radial-menu portfolio**. SvelteKit + **Svelte 5 (runes)**, adapter-node.
Repo: `LuixBits/lupe-webfolio` (`main`). Read this before picking up work.

For Projects and future illustrated scenes, read
[ADR-0007](docs/adr/0007-handcrafted-projects-scenes.md) and the
[scene-building guide](docs/handcrafted-scenes.md). They record the SVG/CSS
construction, surface lighting, motion, interaction and browser-review methods
used for the LuixBits workbench.

## ⚠️ Work visually

All look-and-feel work must be done **with a browser** — run the app, look at
it, iterate. Never push CSS you haven't looked at. On the owner's machine the
setup quirks (NixOS Playwright → system chromium, ports) are in the assistant's
project memory. `npm run check` must stay at 0 errors.

Projects UI text uses only the shared `--fs-*` scale in `src/app.css`.
Keep useful content and metadata; omit decorative micro-labels, status chips,
channel codes, repeated tags, and serial-number copy. Let the shelves, CRT,
paper textures, and remote-control back link carry the theme.
Keep the paper sleeve's character: topic-related artwork, ink details, and the
author sign-off are welcome. Added labels or links should serve the content.

## Run it

```bash
npm install
npm run dev            # Vite prints the port (5173 is often taken by a tunnel)
# or: npm run check / npm run build
```

Use the dev server for visual iteration. Rebuilding underneath a running
`vite preview` leaves its cached asset filenames stale; restart that preview
after a build, or validate builds in a separate checkout.

Node 22. Paraglide (i18n) messages compile to `src/lib/paraglide/` (git-ignored)
on dev/build; if `$lib/paraglide/*` is missing run
`npx @inlang/paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide`.

## Projects workshop — 2026-09-27

The [inhabited workshop plan](docs/plans/projects-inhabited-workshop.md) is now
integrated into the real `/projects` route. The owner rejected the earlier
compact overview and later asked to restore its relationship to the vaporwave
hub tile. The room now fills the page: studio doorway, sunset window, portfolio
model, workbench apparatus and planning cards, then drawers, stool, rug, plant
and cat. Violet walls, magenta neon, cyan reflections and a perspective floor
grid retain the Projects palette alongside the wooden furniture.

**Use <http://localhost:5173/projects>**, or `/de/projects`, for the current
shared development preview. The old standalone study redirects here. The local
production preview on port 5191 also contains this integrated room; see the
[implementation review](docs/reviews/projects-inhabited-workshop-2026-09-27.md)
for the build, browser checks and temporary artifact paths. The published site
has not been changed. Final visual approval remains with the owner.

All four projects still come from `content/projects.ts`, with localized native
links and the same category and `tape-{slug}` anchors. The Projects layout owns
lamp, pause, cat and drawer state across detail round trips. Return navigation
restores the selected object and scroll, including the lower workbench. Route
snapshots carry the complete room and freeze its ambient SVG frames.

Only visible ambient zones animate; hidden tabs, pause, route motion and reduced
motion stop them. The floor-plan drawer and cat are optional native buttons.
Without JavaScript, the entire static room and project links remain available.
The desktop wheel clears the content; phones and short landscape screens use
its existing normal-flow ledge. The channel player retains explicit Play,
selection, eject, power, lamp, watch and remote behavior.

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
- `lib/components/footer/*` — four bespoke footers (garden = "the Seed":
  smooth dark rock masses framing a fixed-size center vignette where the
  tree's last roots converge on a glowing amber seed — the page's finale /
  Hokusai wave / outrun car / planet horizon). Rule: **no SVG sliced
  mid-shape at the edges** (the garden masses are amorphous curves, safe to
  stretch; the seed vignette is fixed-size and centered). The garden bar
  uses `--footer-bar-bg` (themes.css, near-black #241f18) so it doesn't
  recolor the wheel hub; the strip's top band matches the About page's
  deepest rock tone for a seamless join (the page's TreeLayer overshoots
  main's padding by 2.5rem top+bottom for the same reason).
- `routes/*/+page.svelte` — each section has a bespoke presentation:
  About = Herbarium Folio + **Grove walk**, Projects = after-hours workshop,
  Hobbies = Star Atlas, CV = **»Der Tauchgang«** (one continuous koi-pond
  dive, see its own entry below). CV stations live in `lib/content/cv.ts`
  (`stations[]` + `cvPdf` + `scrolls[]`).
- **LuixBits workbench** (`/projects/my-channel`, including localized routes)
  keeps the Projects palette and CRT but has its own plaster wall, mounted
  neon title, wooden desk, and cable footer. The root layout selects this
  room; the overview has its own workshop entrance, and other detail routes
  keep the rental-wall scenery. Artwork lives in
  `lib/projects/workbench/`. `ChannelPlayer` binds the TV's `powered` state
  to the blue wall glow; the desk lamp toggles its warm pool of light. The
  Casio is one keyboard-accessible button that loads the `casio-nixos` video,
  scrolls to the TV, and focuses Play. Loading a tape does not start a YouTube
  embed. The paper remains an even cream colour with the NixOS sticker and
  coffee ring. Room lighting respects reduced motion.
- **The tree (About)** — the page IS one tree, descended crown→underground;
  scrolling down travels back in time (newest growth up top, oldest parts
  deepest — owner-agreed structure). It is drawn by ONE component,
  `lib/garden/tree/TreeLayer.svelte` (+ `tree/generate.ts`): a full-bleed
  z:-1 layer that measures every `[data-tree]` anchor in the page, then
  procedurally generates the whole organism — canopy masses crowding the top
  edge, a thick tapered trunk (SVG-clip scrubbed to scroll, retracts on
  scroll-up) that rises through the bio|portrait corridor and CURVES to page
  center for the desktop **weave** (content blocks alternate `.side-l` /
  `.side-r` around it; every attachment asks `trunkXAt(y)` for the bark's
  true x), the **topmost branch** the title sits on, a **leaf bush** around
  the bio, a woven **bower** ring around the portrait, one rising limb per
  content block plus a **counter-bough** into the opposite open side,
  buttressed **roots** bursting at the ground line (gated on the ground
  anchor's own reveal), and a long root reaching the seed packets. The layer
  also paints the whole **atmosphere**: sky blue → forest greens/yellows →
  golden grass → soil → rock, with buried stones and strata seams
  underground; blocks sit on light-pool veils tuned stronger below ground. Growth = nested `<g
class="grow">` scaling from its junction (`transform-origin: 0px 0px` in
  user units), staggered per generation; per-block limbs gate on the page's
  `revealed` record (which also tracks 'notes'/'contact'). Interactivity:
  foliage sways gently, clumps **rustle** near the cursor (pointer:fine
  only), three leaves drift from the canopy. Content sits on translucent
  light-pool veils so branches can pass behind without stealing contrast.
  Shared vocabulary: sky · crown/canopy · topmost branch · leaf bush ·
  bower · trunk · limbs · ground/verge · underground. Chapter order lives
  in `content/about.ts`: heartwood(ADHD) → branches → [ground] → roots →
  mycelium. Later additions: a dense two-band grass VERGE at the ground
  line (tufts, daisies/bells/seedheads, four saplings, fallen log +
  leaves, mushrooms, undulating band baselines + a pale feeder-root
  fringe under the turf — no straight edges) — the old thin soil
  LivingLine and the misty horizon treeline are both gone (owner cut the
  treeline); a resting doe lying in the deep grass whose head FOLLOWS
  THE CURSOR (deerGaze state, CSS-transitioned rotate) and flips over
  her shoulder when the cursor passes behind her (deerFlip, hysteresis);
  a recursive branching root plate (rootRec, gravity-biased children,
  depth-tinted `wr0–wr3` wood tones + dark outline underground —
  underground growth WINDS out slowly with no overshoot instead of the
  springy pop, see `.zone--under .grow`) plus
  thick scroll-clipped deep runs; a buried TREASURE CHEST easter egg in
  the roots chapter (click/Enter pops the lid + a "+1 bitcoin" float,
  `btc` counter retriggers via {#key}); an ANT COLONY (chambers with
  larvae/seeds/queen, tunnels with workers animated via CSS offset-path)
  plus three wiggling worms; the deep runs weave in S-curves with side
  twigs and a sheen line (mkRun); and the interactive squirrel (flees
  the cursor along the bark via trunkXOf/halfWOf, viewport-clamped,
  never below ground; solid plume tail that flaps while she bolts —
  `.running .sq-tailg`). The garden footer ("the Seed", see footer
  entry) ends the descent where the tree began.
- **The dive (CV)** — the page IS one dive through a Japanese koi pond:
  the surface is today, the seabed is 2013, scrolling is diving (the
  water twin of the About tree; full plan + resolved decisions in
  `docs/plans/cv-koi-dive.md`). Drawn by `lib/water/dive/DiveLayer.svelte`
  (+ `dive/generate.ts`), a faithful TreeLayer clone: a full-bleed z:-1
  instance measures every `[data-dive]` anchor (required: `divewrap`,
  `sky`, `waterline`, `origin`; plus `st-<id>` per station and the two
  bank heads) and paints the whole world — the atmosphere as ONE computed
  gradient (washi dawn → hard waterline break → sunlit aqua → twilight →
  midnight → abyss ink, stops derived from the measured waterline/bed),
  and the **sounding line**: a tapered rope from the boat that bends to
  the bank corridor (left gutter under 900px), drifts on a dimension-hash
  phase (`lineXAt`), pays out/rewinds via a scroll-scrubbed clip rect
  (O(1): two rect heights per frame), knotted per station with
  collision-aware italic depth tags (true time-derived meters, localized
  by the page) and tie cords zone-gated per reveal. Shared vocabulary:
  **sky · waterline · sunlit · twilight · midnight · seabed · origin**.
  The world: wasen skiff + two koinobori, the Hokusai crest breaking over
  its stern (FooterWave's breaker rebased + mirrored), standing torii
  with slit-masked reflection, seigaiha band, rays/caustics, lily pads
  with trailing stems, a plunge one-shot at the waterline reveal; koi
  cast by era (kohaku at today → asagi twilight → a five-fish school and
  six fry on ONE offset-path each), kelp beds (`KELP_PRESET` +
  `variant="kelp"` in lsystem/Garden, bbox-scanned params), sunken tōrō
  lanterns with warm glow pools behind the deep washi slips, algae on
  the aging rope, dashed-stroke bubble columns; the seabed finale — dune
  bands, the moss-dark sunken torii, and the **koi-egg clutch** (the
  About Seed's mirror) at the plumb lead's landing, its light filaments
  reaching through the under-clip into `FooterAbyss` (route-scoped in
  `Footer.svelte` by delocalized pathname; `/cv/[slug]` keeps the
  Hokusai `FooterWave`). A second sparse DiveLayer instance (z:3, above
  the cards) carries the interactivity: the **asagi companion** riding
  the line at your viewport (nose down diving, turning up when you
  rise), **feed-the-koi** (click open water → pellet sinks, nearest of
  two free koi glides over; 1.5 s cooldown), the **namazu** (eye follows
  the cursor, click/Enter = slow blink + bubbles + "+1 ruhige See" — no
  screen shake, ever) and the **Flaschenpost** (CV-as-PDF bottle;
  placeholder washi tag until `cvPdf` is set, expected at
  `static/media/cv/luiz-perren-cv.pdf`). Page side: washi station slips
  (PaperScroll palette) in a two-bank weave — banks stay whole in the
  DOM (screen readers hear Erfahrung, then Ausbildung; hash anchors
  `#experience`/`#education` sit on the h2s) while a display:contents
  grid interleaves both banks by depth row so concurrent stations sit
  side by side; under 900px one depth-ordered column beside the gutter
  line. SIGA renders as one grouped panel (two role slips + mizuhiki
  cord); the army card carries an origami crane (deliberately NOT a red
  cross). Reduced motion / SSR / no-JS all land fully drawn (koi park at
  their `--rest` offsets, kelp snaps grown, the companion parks beside
  the first station).
- Grove chapters grow into view on scroll — a shared IntersectionObserver
  (`lib/garden/reveal.ts`) flips per-chapter classes, CSS does the animating
  (transform/opacity one-shots). `Garden.svelte` has `start` (grow when
  revealed) + preset overrides (`step`/`iterations`/`angle`/`leafScale`/
  `strokeWidth`) — plant params were picked by bbox-scanning seeds (the
  L-system is deterministic). Openings' decorative layers are z-index:-1 so
  the light pools/foliage never wash out prose. SSR/no-JS/reduced-motion
  always get a fully grown page: the hidden `pending` state exists only
  client-side under `prefers-reduced-motion: no-preference`.
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

- Orbit Toy and Scrum Poker still contain sample project content. The overview
  renders the actual inventory without empty slots.
- **CV dive**: the station data is REAL (LinkedIn export 2026-09), but —
  full `skills` arrays (slots marked "— placeholder" where the export
  truncated "+N"), the `cv_lead` prose (marked placeholder; `cv_origin`
  ships the plan's caption — rewrite if wanted), the real CV PDF (drop at
  `static/media/cv/luiz-perren-cv.pdf`, set `cvPdf` in `lib/content/cv.ts`
  — the Flaschenpost becomes the download), and the MA thesis as a
  kakemono scroll (author it in `scrolls[]` with slug `thesis`, wire
  `stations[hslu-ma].detail: 'thesis'`; the sample paper
  `perception-in-low-light` stays only as the PaperScroll design fixture
  until then). Also owner-check: `EMVs Visp/Sion` org naming came from
  the plan's table — verify the spelling.
- Real hobby photos/videos (Rick Astley + stock shots are placeholders),
  and the About
  page's optional herbarium fields (epithet/since/link notes — see
  `routes/about/+page.svelte` fallbacks).
- About `chapters[]` in `lib/content/about.ts` (heartwood-ADHD / passions /
  roots / mycelium): structure + ids are load-bearing, but the prose is
  assistant-written placeholder voice — owner should rewrite in their own
  words (en + de).
- **Portrait photo**: drop it at `static/media/about/portrait-800.webp`
  (4:5) and uncomment the `portrait` field in `lib/content/about.ts`; a
  leafy silhouette placeholder renders in the bower until then.

## Known open items

- Outside the Projects overview, the docked wheel can still overlay content
  mid-scroll on narrow screens. The overview now has its own navigation ledge.
- Handoff-era open question, still unconfirmed: the wheel docks to the corner
  **opposite** its hub quadrant — confirm the owner wants that end position.
- Optional i18n nicety: singular `hobbies_plate`/`hobbies_signal` keys would
  let plate captions read "Plate I·1" instead of glyphs.

## Deploy & versioning

Committed per milestone; push to `main`. Live at **https://luizperren.dev** via
a systemd `webfolio` unit (adapter-node on `127.0.0.1:3001`) behind Traefik +
Cloudflare. Redeploy = `npm run build` then `sudo systemctl restart webfolio`
(on the server). Full infra notes in the server's config repo / project memory.
