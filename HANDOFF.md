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
model, shared project workstations, then drawers, stool, rug, plant
and cat. Violet walls, magenta neon, cyan reflections and a perspective floor
grid retain the Projects palette alongside the wooden furniture.

**Use <http://localhost:5173/projects>**, or `/de/projects`, for the current
shared development preview. The old standalone study redirects here. The local
production preview at <http://localhost:5191/projects> also contains this room;
see the [collections review](docs/reviews/projects-collections-2026-09-27.md)
for the build, browser checks and temporary artifact paths. The published site
has not been changed. Final visual approval remains with the owner.

The [collections follow-up](docs/plans/projects-collections-drawers.md) adds
Team Feed, RoomPlan, Flashcards, Noctalia Plugins and the upcoming Magic Mouse
app. The wheel and physical workstations now group the nine entries into
Studio, Web, Neovim and Desktop, with Orbit Toy kept as a small bench experiment.
Open-source status is metadata. Existing slugs are preserved and the old
`#opensource` fragment leads to Webfolio's Web station. Native project files
expand with the content instead of creating another large scene per plugin.

All three drawers now open, using native disclosures: floor-plan sketch, spare
keys/electronics, then a tablet. The tablet's explicit Play button loads the
Rickroll; Stop, closing the drawer and route exit remove its iframe. Snapshots
exclude media to prevent a second player. Room controls and all three drawer
states survive project visits. Returns restore the selected link and scroll.
The main sign and station signs now use SVG neon tubes with HTML headings.

Only visible ambient zones animate; hidden tabs, pause, route motion and reduced
motion stop them. Static project links and drawer disclosures work without
JavaScript. The desktop wheel clears the content; phones and short landscape
screens use its normal-flow ledge. The channel player's controls retain their
behavior. See the [collections review](docs/reviews/projects-collections-2026-09-27.md)
for the current build, checks and provider-test limits.

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
  Hobbies = Star Atlas, CV = **»Der Anlegesteg«** (one compact pond scene,
  every craft a doorway — its own entry below). CV content lives in `lib/content/cv.ts`
  (`stations[]` + `vessels[]` + `cvPdf` + `scrolls[]`).
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
- **The mooring (CV)** — the whole CV is ONE pond at dawn, composed like
  a signed woodblock print (plan + judgment calls:
  `docs/plans/cv-mooring.md`; it supersedes the one-night dive build of
  `cv-koi-dive.md`, whose asset library it reuses). **Work floats,
  education grows — split by bank:** Ausbildung as lily pads on the LEFT,
  Erfahrung as boats on the RIGHT of one central timeline current, each
  bank flying its cloth BANNER — vertical stacked letters on a finial
  pole at the scene's outer edge (sky strip, clear of every craft),
  hemmed scallop, a barely-there skewX flutter from the hanging rod. Six bespoke crafts in `lib/water/pond/Vessel.svelte`
  — the SIGA flagship (two lashed cargo crates = the two roles under
  their red cord, furled sail + red signal pennant on the stern mast,
  lit bow lamp), the HSLU lotus raft (MA + BSc pads in
  bloom, braced stake sign, tombo dragonfly), the Neptun skiff (trident
  boat-hook), the Armee punt (origami crane — deliberately NOT a red
  cross), the weathered EMVs rowboat (Lehre only), and the young
  EFZ · BM pad cluster (slug 'schule' — the apprenticeship's school side,
  strictly education; its deck slips name their own orgs). **Time is the
  line itself:** washi YEAR CHIPS (heute at the bollard → 2013 framed by
  the gate's pillars, "Hier beginnt die Strömung.") are threaded on the
  dashed current, and every craft hangs on two mooring ROPES tied to the
  years its chapter began and ended — spans read as rigging, concurrency
  mirrors across the line, no date tags to collide. Print devices: kumo cloud bars, kasumi mist, seigaiha patches,
  dash-stylized reflections (no masks), bokashi sky, the artist's LP seal.
  `lib/water/pond/PondScene.svelte` holds TWO fixed compositions — the
  wide PANORAMA and, under 700px, the vertical QUAY (same fleet walked
  down an S-current) — both SSR-rendered with real `<a>` links per craft
  (hover/focus lifts the craft in a foam ring that doubles as the hit
  target), a media query shows one, and interactions convert pointer
  coords through the active layout's CTM. Play: feed-the-koi (open-water
  click → sinking pellet, one hungry asagi glides over, 1.5 s cooldown),
  the surfaced namazu (pupils follow fine pointers; click/Enter = slow
  blink + bubbles + "+1 ruhige See" — never a screen shake), and die
  Flaschenpost (placeholder washi tag until `cvPdf` is set, then the
  download). Each craft opens `/cv/<slug>` (`lib/cv/VesselDeck.svelte`):
  a berth band with the SAME craft floating (shared art component), then
  the **Logbuch** of washi station slips (PaperScroll palette); the
  future thesis scroll hangs off the HSLU MA slip via `stations.detail`.
  Wheel CV children: SIGA / HSLU / Neptun (routes, no hash anchors).
  `/cv` ends on **FooterJetty** — the dock you stand on: the pond's own
  water runs into the footer and laps a foam scallop against the edge
  board, pile heads carry stretch-safe plank rows (joints, knots), and
  a fixed center vignette holds the mooring rope on its cleat, the
  coil, a breathing glass lamp and a straw hat set down to watch —
  while the /cv/* deck and scroll pages out on the water keep the
  Hokusai `FooterWave` (route-scoped in `Footer.svelte`).
  Reduced motion = a finished still print (koi parked at `--rest`
  offsets, zero pond animations, games disabled); no-JS gets the full
  working harbor and decks. Shared vocabulary: sky · horizon ·
  current · craft/berth · uki tag · bollard · gate · nobori.
  **v3 (owner review round 2)**: the bank boards became the edge nobori
  (the pano board had sat inside SIGA's silhouette), the whole print
  grew again (~12% larger fleet on taller canvases — pano 1000×920,
  quay 420×1020, bigger chips/koi/namazu), and the water world got its
  own display face: **Shippori Mincho** (Fontsource, weights 400/600/
  700) set as `--font-display` for `[data-theme='water']` in
  `themes.css` — an engraved mincho that matches the woodblock print;
  Spectral stays as fallback, Karla keeps body/small text.
  **v4 (owner: "too hard on the Japanese side")**: identity-claiming
  emblems traded for harbor vernacular — banner mon removed, the
  vermilion torii is now the weathered WOODEN harbor gate (corner
  knees, hanging channel lamp), the koinobori carps became a furled
  sail + one red masthead pennant (flying clear below the heute tag on
  the quay), paper-rib lanterns became glass lamps, the footer geta a
  straw hat. Plus a polish pass: sheer highlights on every hull,
  struts + nails on the stake signs, still small wave marks across
  pond, berth band and footer.
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
- **CV mooring**: the station data is REAL (LinkedIn export 2026-09),
  but — full `skills` arrays (slots marked "— placeholder" where the
  export truncated "+N"), the `cv_lead` prose (marked placeholder;
  `cv_origin` ships the agreed caption — rewrite if wanted), the real CV
  PDF (drop at `static/media/cv/luiz-perren-cv.pdf`, set `cvPdf` in
  `lib/content/cv.ts` — die Flaschenpost becomes the download link), and
  the MA thesis as a kakemono scroll (author it in `scrolls[]` with slug
  `thesis`, wire `stations[hslu-ma].detail: 'thesis'` — the hanko then
  appears on the HSLU deck; the sample paper `perception-in-low-light`
  stays only as the PaperScroll design fixture until then). Also
  owner-check: the `EMVs` org naming (hull + deck + wheel spell it that
  way) — verify the spelling.
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
