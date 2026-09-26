# CV — »Der Tauchgang« (The Dive)

**Plan written 2026-09-27. Status: all open decisions resolved by the owner the
same day (see §9) — cleared for implementation.**
Rollback point before any work: `c79db38` (clean HEAD at planning time —
re-check `git log` before starting and note the then-current hash).

## Run instructions for the implementing session (owner is asleep)

- Work **autonomously, phase by phase (0 → 9)**. Do not wait for answers —
  every decision is resolved in §9; where judgment remains (e.g. exact
  darkness stops, grid-vs-interleave in Phase 2), decide in the browser
  yourself against the §8 checks and the owner prefs (gentle motion, no
  wobble, small-laptop performance, reduced-motion lands fully drawn).
- **Verify visually before every commit**: dev server + playwright-core with
  system chromium (`/home/luix/.nix-profile/bin/chromium`), screenshot, and
  actually Read the PNGs. `npm run check` must stay at 0 errors.
- **Commit each milestone on `main` with explicit paths only** — never
  `git add -A` (Codex shares this working tree; inspect `git diff messages/`
  before staging those). **Do not push.**
- If a phase is truly blocked, note it in the final summary and continue
  with what you can. The page must feel complete even if Phase 7 items are
  dropped (they are individually droppable by design).
- Owner-to-fill content (full skills lists, `cv_lead`/`cv_origin` prose, the
  real CV PDF, the thesis scroll) ships as **plausible placeholders marked
  "— placeholder"** (HANDOFF convention). Use the _known real_ skills from
  the LinkedIn export (MA: UX, Svelte · BSc: Linux Desktop, Ubuntu · SIGA
  Trainee: Linux Desktop, Softwareentwicklung · Neptun: Linux Desktop) and
  placeholder slots for the "+N" remainders.
- Finish with Phase 9: update `HANDOFF.md`, then leave the owner a summary —
  what was built, what was verified (viewports/locales/motion), the commit
  list, and anything that needs their eyes.

The About page became one living tree — crown to roots, newest growth up top, the
Seed at the bottom. The CV becomes its mirror in water: **one continuous dive**
from today's sunlit surface down through thirteen years to the place where the
current begins. Japanese koi-pond world: koi, torii, washi, hanko, seigaiha,
stone lanterns, kelp — built with the exact same architecture that carries the
tree (measured anchors → one procedural full-bleed layer → scroll-scrubbed
spine → gated CSS growth), and the same rules (gentle motion, reduced-motion
lands fully drawn, one IntersectionObserver, O(1) scroll work, no animated SVG
filters).

---

## 1. The idea

### Fiction

You stand at the surface of a deep Japanese pond at dawn. A small wooden boat
floats near a vermilion torii; from the boat a **sounding line** (Lotleine)
drops into the water — the CV's existing "Sounding Line / depth-as-time"
metaphor, kept, but now you go down _with_ it. Scrolling is diving. Every meter
of depth is time: **the surface is today, the seabed is 2013.**

- The water column is the page. Light fades from bright aqua through twilight
  teal to a near-black midnight indigo.
- The sounding line is the spine (the trunk's analog): a rope that pays out as
  you scroll, drifting in gentle S-curves with the current, **knotted at every
  station** with a depth tag (`— 7 m · 2024 —`). It retracts when you scroll up.
- Every CV station is a **washi paper slip** tied to the line by a short cord —
  paper stays paper (bright, readable) no matter how dark the water gets;
  deeper stations get a sunken **stone lantern (tōrō)** whose warm glow lights
  the card.
- **Koi carry the timeline.** The biggest koi (a proud kohaku) circles the
  newest station at the surface. Each older station has a smaller, younger koi;
  the twilight koi are blue asagi; near the bottom only a school of tiny fry.
  At the very bottom, beside a **sunken, moss-dark torii**, glows a clutch of
  **koi eggs** — the mirror of the About page's amber Seed. Caption:
  _"Hier beginnt die Strömung." / "Where the current begins."_
- One **asagi companion koi** dives with you, riding the line at your viewport,
  turning to face up when you scroll back up (the squirrel/doe of this page).

### Why the metaphor is honest, not decoration

The owner's education and work ran **in parallel** almost the whole time
(Master ∥ SIGA Trainee, Bachelor ∥ Projekt Neptun, EFZ ∥ Lehre ∥ BM). So the
page uses a **two-bank weave**: the line runs down the middle (desktop), the
**Ausbildung** bank on one side, the **Erfahrung** bank on the other, and
_concurrent stations sit at the same depth_, visibly side by side. Depth = the
shared time axis; sides = the two tracks. This is information design the old
alternating layout couldn't express, and it's the same auto-margin `.side-l` /
`.side-r` mechanic the About page already uses.

Time is **ordinal, not linear in pixels** (same decision as the tree): cards
take the space their content needs; the knots' depth tags carry the true
numbers. A 10-month army stint doesn't get 1/16 the room of the apprenticeship.

### Depth ↔ time table (the real data)

Mapping: `depth ≈ (2026.75 − year) × 3 m`, rounded to friendly tags.

| Depth tag | Years                 | Ausbildung (left bank)                                                                  | Erfahrung (right bank)                                                                                                                   | Zone                    |
| --------- | --------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 0 m       | Juli 2024 – heute     | —                                                                                       | **SIGA — Developer Customer Experience** · Vollzeit · Hybrid · Ruswil LU (2 J 3 Mo)                                                      | Surface / sunlit        |
| ~7 m      | Aug 2021 – Juli 2024  | **HSLU — MA Design, Digital Ideation** (UX, Svelte, +4)                                 | **SIGA — Trainee Digitalisierung** · Teilzeit (3 J) — same employer panel as above, tied with a mizuhiki cord: "SIGA · 5 Jahre 2 Monate" | Sunlit → upper twilight |
| ~15 m     | 2018 – 2021           | **HSLU — BSc Computer Science, Major HCID** (Linux Desktop, Ubuntu, +4)                 | **Projekt Neptun — Support Mitarbeiter, Leitung Help Point Luzern** · Teilzeit · Feb 2019 – Juli 2021 (2 J 6 Mo)                         | Twilight / kelp forest  |
| ~26 m     | Juli 2017 – Apr. 2018 | —                                                                                       | **Schweizer Armee — Sanitätssoldat** (10 Mo) — narrow stratum, an origami crane rests on the card                                        | Lower twilight          |
| ~30–39 m  | 2013 – 2017           | **EMVs Visp — EFZ Informatik** · **BFS Oberwallis — Technische Berufsmaturität (TALS)** | **EMVs Sion — Lernender** (4 J)                                                                                                          | Midnight / lantern-lit  |
| ~40 m     | Aug 2013              | **The origin:** sunken torii, koi eggs, hatchling fry                                   |                                                                                                                                          | Seabed / finale         |

Notes on the data:

- SIGA is **one employer panel with two role slips** (LinkedIn-style grouping,
  "5 Jahre 2 Monate" as the panel note) — schema must support grouped roles.
- Skills lists are truncated in the source ("+4 Kenntnisse") → schema stores
  full arrays; owner fills them later (marked placeholder until then).
- **Thesis hook:** the MA station gets an optional `detail` slug. Later, the
  thesis becomes a full **kakemono scroll page** at `/cv/thesis` using the
  existing `PaperScroll` reader (it's already built and beautiful). The station
  card shows a small rolled-scroll icon + Hanko link once the slug exists.
- Sanitätssoldat: **do not** use a red cross (protected emblem). The station's
  motif is a folded **origami crane** (senbazuru — healing), quiet and Japanese.

---

## 2. What exists today — reuse / redraw / drop

From the full inventory (WaterScene 1105 l, WaterDecor 729 l, cv page 890 l,
PaperScroll 702 l, FooterWave 284 l):

**Reuse as-is (extract into `src/lib/water/`):**

- **The good koi** — `WaterScene.svelte:70-107` (`KOI_BODY/TAIL/FIN/DORSAL`,
  robes `kohaku`/`hi`/`asagi`, clipped patches, contact shadow, eyes, spine,
  articulated tail/fin wag, `offset-path` swim + reduced-motion rest pose).
  This is the best asset in the theme. Extract to `koi.ts` + `Koi.svelte`.
- **Torii gate + masked reflection** — `cv/+page.svelte:67-107` (six paths,
  myōjin profile, water rings; reflection = `<use>` mirrored inside a
  slit-broken gradient mask). Reuse at the surface; re-tint a second, sunken
  instance for the seabed.
- **Seigaiha fan pattern** — canonical 44×22 tile (`cv/+page.svelte:25-42`).
  Extract one `Seigaiha.svelte` defs-snippet (there are 5 near-copies in the
  repo; the new page uses the shared one — consolidating the other four is
  optional cleanup, not this project).
- **Lily pad** (notched disc + veins), **weeds** (`weedTall`), **momiji leaf**,
  **lotus** — from `WaterScene.svelte:110-225`.
- **`Hanko.svelte`** — self-contained CSS seal-stamp button/link with sensible
  fallback vars; used for real links (org sites, thesis scroll).
- **`PaperScroll.svelte` + `/cv/[slug]`** — keep the whole scroll-reader
  machinery for the thesis (and any future paper).
- **`reveal.ts`** (shared IO), **`Garden.svelte` + `lsystem.ts`** (kelp!),
  **`generate.ts` helpers** (`smoothOpen/…/taperedPath` — import, don't copy).
- **`FooterWave`** — keep intact for `/cv/[slug]` pages (see §6 finale).

**Redraw / replace:**

- The crude `koiShadow` silhouette (`cv/+page.svelte:46-61`) — superseded by
  the real koi.
- The straight 2px `.rail` + plumb bob → becomes the procedural drifting line
  inside the new layer.
- The page itself: `.pond`, `--bleed` half-measure, `.card`/`.card--tablet`
  chrome → full rebuild (owner rule: big art-direction asks mean rebuilding
  the scaffold, not decorating it).

**Drop (content):**

- Sample `research[]` / `publications[]` entries (all fake: "Sample venue —
  replace…"). The wheel's `#research`/`#publications` sub-links retarget to
  the real story: **Erfahrung / Ausbildung** (see §5 anchors). The
  `perception-in-low-light` sample paper stays temporarily as the PaperScroll
  design fixture until the thesis replaces it (decided — §9.2).

**Leave alone:** `WaterScene` hub/corner variants, `WaterDecor` (fixed margin
decor keeps working around the new page), radial-menu wedge art, themes.css
palette (see next section for why).

---

## 3. Design decisions

### 3.1 Darkness lives in the page layer, not in `themes.css`

Water is a **light** theme (`--bg: #e8f4f8`) and must stay one — the wheel
wedge, hub square, labels and `/cv/[slug]` scroll pages depend on it. The About
page already solved this exact problem: its sky→soil→rock atmosphere is **one
`<rect>` with an 11-stop `linearGradient` painted by the layer**, covering the
full page behind the content. The DiveLayer does the same:

```
0.000  #f4efe2   washi dawn sky (above the waterline)
wl−ε   #eaf3f4   haze at the waterline
wl     #cfeaf0   ← hard break: the underside of the surface   (wl = waterlineY/H)
wl+.04 #a6d8e4   sunlit aqua
~.30   #6cc3d6   (--slice-bg territory)
~.45   #3e97b4
~.60   #1e6d88   twilight
~.75   #0e3a52
~.88   #092838   midnight
bed−ε  #061c2a
1.000  #04141f   abyss / seabed ink
```

Exact stops are computed in `build()` from the measured `waterline` and
`origin` anchors (like the tree computes `g = groundY / H`), so the zones
always align with the content regardless of locale/viewport reflow. The
`wl−ε → wl` pair is the hard waterline break (same trick as the soil line's
`g−0.002 → g+0.004`).

Content stays readable because **cards are washi** (`#f5efdf` paper, ink text —
PaperScroll's proven palette) — the world darkens, the paper doesn't. Deep
cards additionally get a lantern glow pool behind them (radial gradient, no
filter).

### 3.2 Two instances, like the tree

- **Base layer** (`z-index: -1`): atmosphere, rays, line, knots, kelp, station
  koi, bubbles, seabed, sunken torii, eggs. `pointer-events: none`.
- **Overlay** (`z-index: 3`): the companion koi, 1–2 free-swimming koi that may
  cross card edges (sells "you are _in_ the water"), the namazu's clickable
  hitbox, food pellets. `pointer-events: none` except the interactive elements
  (the chest precedent).

Both instances derive the line's drift phase from
`hashSeed(\`phase:${W}x${H}\`)`— **never from the instance's own PRNG
stream** — so they agree on`lineXAt(y)` exactly as the two TreeLayers agree on
the trunk (TreeLayer.svelte:262-264 discipline).

### 3.3 Motion language: buoyancy, not spring

The tree grows with a springy overshoot; underwater everything **settles
through resistance**. One growth primitive, no overshoot:

```css
.dive-zone .grow {
	opacity: 0;
	transform: translateY(16px) scale(0.97);
}
.dive-zone.on .grow {
	opacity: 1;
	transform: none;
	transition:
		transform var(--gt, 1100ms) cubic-bezier(0.22, 0.61, 0.21, 1) var(--gd, 0ms),
		opacity var(--gt, 1100ms) ease var(--gd, 0ms);
}
```

plus per-unit `--gd` stagger exactly like the tree. Koi arrive by fading in
while already mid-glide (opacity + `offset-distance` from a rest value), never
by popping. Idle loops that exist (tail wag, ray sway, bubble columns, pad bob)
are few, slow, and inside `@media (prefers-reduced-motion: no-preference)`.
**No wobble. Nothing shakes. Ever.**

### 3.4 The dock corner constraint

CV docks the wheel **top-left** (`DOCK_CORNER.cv`, CornerScene at
`clamp(360px, 48vmin, 620px)`, z12). The sky/header composition therefore
keeps its left side calm: title and boat sit center-right (the current page's
`margin-left: clamp(…)` trick is kept), the torii stands right, and at ≤560px
the surface gets the existing `padding-top: calc(min(86vw,400px) * 0.45)`
clearance. The corner water scene (ripples from the top-left corner) reads as
part of the same pond — free thematic continuity.

---

## 4. Architecture — `DiveLayer` (a faithful TreeLayer clone)

New files:

```
src/lib/water/
  koi.ts             path constants + robe styles (extracted from WaterScene)
  Koi.svelte         parametric koi: {robe, scale, swim?: {path, dur, rest}, pose?}
  Seigaiha.svelte    the 44×22 defs tile as a snippet/component
  dive/
    DiveLayer.svelte the organism (structure mirrors TreeLayer.svelte)
    generate.ts      dive-specific geometry (imports shared helpers from
                     $lib/garden/tree/generate.ts — taperedPath, smoothOpen…)
```

### 4.1 Anchor contract (`[data-dive]`)

DiveLayer is a **direct child of `.page--dive`**; it measures
`parent.querySelectorAll('[data-dive]')`, coords relative to its own box, SVG
user units = CSS px, ResizeObserver on itself with rAF-coalesced `rebuild()` —
all verbatim TreeLayer mechanics (TreeLayer.svelte:210-232, 1254-1315).

| anchor                   | element                                                                                                                                           | required                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `divewrap`               | the water column wrapper                                                                                                                          | ✔ (build bails without it) |
| `sky`                    | the surface header block (title, lead)                                                                                                            | ✔                          |
| `waterline`              | empty 34px `aria-hidden` div between header and column (the `ground` twin)                                                                        | ✔                          |
| `edu-head` / `work-head` | the two bank headings just under the surface                                                                                                      |                            |
| `st-<id>`                | every station card (8: `siga-dev`, `hslu-ma`, `siga-trainee` _(inside the SIGA panel)_, `hslu-bsc`, `neptun`, `armee`, `efz`, `bm`, `emvs-lehre`) |                            |
| `origin`                 | the finale block above the footer                                                                                                                 | ✔                          |

Reveal keys in the page's `revealed` record: every station id + `waterline` +
`edu`/`work` heads + `origin`. Registered with `use:revealOnce`; one shared
IO; unobserve-after-first-hit; `class:pending={hydrated && !revealed[id]}` —
the exact About pattern including all three fully-drawn fallbacks (SSR, no-JS,
reduced motion).

### 4.2 `lineXAt(y)` — the spine

```ts
const lineXAt = (y: number) => {
	const b = clamp((y - bendY0) / (bendY1 - bendY0), 0, 1);
	const bs = b * b * (3 - 2 * b); // smoothstep: boat x → column center
	return (
		xBoat +
		(xMid - xBoat) * bs +
		Math.sin(((y - waterY) / max(1, bedY - waterY)) * Math.PI * 2.1 + sPhase) * 14 * sizeK
	); // current drift, ~2 gentle S turns
};
```

- `xBoat` = under the boat (center-right of the sky block); `xMid` = column
  center (desktop weave) or the left gutter (mobile fallback — same
  `central`/gutter dual mode as the tree, switching on measured corridor
  width).
- Rendered as a `taperedPath` rope (w ≈ 2.5 → 1.5) + a one-px highlight, with
  **knots** (small wrapped-cord ellipses) and **depth tags** at each station's
  `y` (`— 7 m · 2021–2024 —`, text in the layer, `aria-hidden`; the real dates
  live in the cards).
- Below ~60% depth the rope grows **algae wisps** (short `taperedBranch`
  tufts, seeded) — the line ages as it deepens.
- Ends in the **plumb lead** (the existing clip-path pentagon, redrawn in the
  layer) resting on the seabed beside the sunken torii.
- Every attachment (cord ties, knots, cross-currents) asks `lineXAt(y)` — the
  single source of truth, and sidedness is geometric:
  `const left = anchor.cx < lineXAt(anchor.cy)`.

### 4.3 Scroll scrub — two clip rects, O(1)

Identical to the trunk (TreeLayer.svelte:167-168, 1257-1324):

- `{uid}-clip`: rect `height = skyY + (bedY + 70 − skyY) × progress` clips the
  rope + knots + algae → the line pays out as you dive and **rewinds when you
  scroll up**.
- `{uid}-uclip` twin for the below-bed finale strokes (eggs' root-glow tendrils
  reaching into the footer overshoot).
- One passive scroll/resize listener, rAF-coalesced, one
  `getBoundingClientRect()` per frame, `tip = 0.86`. The **only** per-frame
  mutations: the two rect heights + the companion koi's holder transform.

### 4.4 The companion koi (overlay)

State mirrors the squirrel: `koiY` follows `tipY` clamped inside
`[waterY + 60, bedY − 40]` and inside the viewport; `koiX = lineXAt(koiY) +
26 × side`; heading flips by scroll direction (`headUp` class rotates the
group 180° like `.sq-pose.headdown`); CSS
`transition: transform 700ms cubic-bezier(.3,.8,.3,1)` does the swimming —
**no rAF loop**, the scroll handler just updates the target. Robe: `asagi`
(blue — reads in every zone). Idle: tail wag only. Reduced motion: parked
beside the first station, fully visible, no listener.

### 4.5 Zones & gates

`Zone[]` exactly as the tree (`{key, clipped, units, gate?}` + recursive
`unitG` snippet, nested `<g class="grow">` with `transform-origin: 0px 0px`).
Zone list: `surface` (gated on `arrive` — unfurls on page load like the
crown), one zone per station (gated on its reveal key), `kelp-mid`,
`kelp-deep`, `bed` (gated on `origin`). Deep zones get the slow winding
transition variant (the `.zone--under` precedent, minus rotation overshoot).

---

## 5. Page structure, content model, i18n

### 5.1 `routes/cv/+page.svelte` skeleton

```svelte
<div class="page page--dive" class:living={hydrated}>
  <DiveLayer seed="cv-dive"        grown={revealed} arrive={hydrated} />
  <DiveLayer seed="cv-dive-over" overlay grown={revealed} arrive={hydrated} />

  <header class="sky" data-dive="sky">          <!-- washi dawn, boat, torii -->
    <p class="eyebrow">{m.cv_eyebrow()}</p>     <!-- "Werdegang · ein Tauchgang" -->
    <h1>{m.nav_cv()}</h1>
    <p class="lead">{m.cv_lead()}</p>           <!-- 1–2 sentences, du-form -->
  </header>

  <div class="waterline" data-dive="waterline" aria-hidden="true"></div>

  <div class="column" data-dive="divewrap">
    <section id="experience" class="section bank bank--work" ...>
      <h2 data-dive="work-head" use:revealOnce={...}>{m.cv_positions()}</h2>
    </section>
    <section id="education" class="section bank bank--edu" ...>
      <h2 data-dive="edu-head" use:revealOnce={...}>{m.cv_education()}</h2>
    </section>
    <!-- stations interleaved by depth; each: -->
    <article class="station side-l|side-r" id="st-hslu-ma" data-dive="st-hslu-ma"
             class:pending={hydrated && !revealed['hslu-ma']}
             class:in={!!revealed['hslu-ma']}
             use:revealOnce={() => (revealed['hslu-ma'] = true)}>
      …washi card: role, org, span chip, location/pensum/mode chips, skills row…
    </article>
    <!-- SIGA = one .station.station--group panel containing two role slips -->
  </div>

  <section class="origin" data-dive="origin" use:revealOnce={...}>
    <p class="origin-line">{m.cv_origin()}</p>  <!-- "Hier beginnt die Strömung." -->
  </section>
</div>
```

Layout CSS mirrors the folio: `.page--dive { position: relative;
padding-top: ~9rem }`, the layer full-bleeds via
`top/bottom: -2.5rem; left:50%; translateX(-50%); width:100vw; z-index:-1`
(`overflow-x: clip` on body makes this safe — do **not** change it to
`hidden`, PaperScroll's sticky roller depends on `clip`). Weave ≥900px via
auto-margins (`.side-l { margin-right: auto } .side-r { margin-left: auto }`,
`max-width: ~27rem`); below 900px single column right of a left-gutter line.
Anchored sections keep the `.section` class → `scroll-margin-top: 6rem` keeps
wheel deep-links landing right.

**Two h2s + interleaved stations:** semantically the banks are two labelled
lists; visually stations interleave by depth. Implementation: one
depth-sorted station flow with per-station `aria` grouping and the two `h2`s
as bank headings pinned at the top of each side — screen-reader order stays
"Erfahrung: (its stations) … Ausbildung: (its stations)" by rendering two
`<section>` lists and letting **CSS grid place both banks on a shared row
track per depth band** (grid areas per station, `grid-template-columns:
1fr var(--line-gap) 1fr`). This keeps DOM order semantic and visual order
temporal. (Fallback if grid rows fight content heights: interleave in DOM and
use `aria-labelledby` on each station instead — decide in Phase 2 with real
content in the browser.)

### 5.2 Station card anatomy (washi slip)

- Paper: `#f5efdf`, laid-line background (`repeating-linear-gradient` 13px,
  from PaperScroll), 1px ink border, irregular radius `10px 4px 12px 4px`,
  drop shadow toward `--water-deep`. `.side-r` mirrors the radius.
- Tie: a short cord from the card's line-facing corner to the rope knot
  (drawn by the layer; the card just leaves the corner visually quiet).
- Header row: role/degree (`--fs-h3`, Spectral) + org line + span chip.
- Meta chips: location · Vollzeit/Teilzeit · Hybrid — small washi tags.
- Skills row: **mini seal chips** (non-interactive `.skill-chip`: seal-red
  tick + label — NOT the 2.75rem Hanko button; Hanko stays for real links).
- Optional Hanko links: org site ↗, thesis scroll (`/cv/thesis`) when it
  exists.
- Group panel (SIGA): one washi panel, two role slips inside, a red
  **mizuhiki cord** knot tying them, panel note "5 Jahre 2 Monate".
- Deep stations (`armee` and below): slightly aged paper
  (`#efe5cc` override, the About underground precedent) + lantern glow pool
  behind (painted by the layer).

### 5.3 Content model (`lib/content/schema.ts` + `cv.ts`)

```ts
// schema.ts — new
stationSchema = z.object({
	id: z.string(),
	track: z.enum(['education', 'work']),
	org: z.string(),
	role: localizedString,
	span: yearSpan, // display string(s), owner-maintained
	start: z.number(),
	end: z.number().nullable(), // decimal years → depth order
	duration: localizedString.optional(), // "2 Jahre 3 Monate" — literal for now
	location: localizedString.optional(),
	pensum: z.enum(['full', 'part']).optional(),
	mode: localizedString.optional(), // "Hybrid"
	skills: z.array(localizedString).default([]), // full lists; owner fills
	group: z.string().optional(), // 'siga' → grouped employer panel
	groupNote: localizedString.optional(), // "5 Jahre 2 Monate" (on first member)
	detail: z.string().optional() // slug into /cv/[slug] (thesis later)
});
export const defineStations = (input) => z.array(stationSchema).parse(input);
```

`cv.ts`: export `stations` (the 9 real entries from §1's table — real data,
only `skills` arrays and `cv_lead` prose marked placeholder), plus
`export const cvPdf: string | undefined` (the Flaschenpost target —
`undefined` until the owner drops the real PDF; the bottle then renders its
placeholder tag instead of a link). Keep `getCvProject` + a `scrolls` array
for `[slug]` — **decided:** the fake research/publications entries disappear
from every visible list now; the `perception-in-low-light` sample paper
stays in the file as the PaperScroll design fixture until the thesis scroll
replaces it. Durations are **literal strings** (matches the LinkedIn export;
auto-computing "heute" durations risks hydration drift — revisit later via
server-provided `now` if wanted).

### 5.4 i18n (paraglide, flat `cv_*` keys, en + de du-form)

New keys (both `messages/en.json` and `messages/de.json`, lockstep):
`cv_eyebrow`, `cv_lead`, `cv_origin`, `cv_depth_m` ("{n} m"), `cv_today`
("heute"/"today"), `cv_pensum_full`, `cv_pensum_part`, `cv_skills`,
`nav_cv_experience`, `nav_cv_education`. Update `meta_desc_cv`.
Remove `nav_cv_research` / `nav_cv_publications` **only after** the menu
change lands (keys must never dangle in one file).

**⚠️ Coordination:** Codex works in this tree and touches
`messages/*.json` — before staging, `git diff messages/` and stage only if
the diff is exclusively ours; otherwise hand-merge. Never `git add -A`.

### 5.5 The wheel (`lib/radial-menu/menu.ts:27-30`)

```ts
{ id: 'cv-experience', label: m.nav_cv_experience, href: '/cv#experience' },
{ id: 'cv-education',  label: m.nav_cv_education,  href: '/cv#education'  },
```

Hash scrolling is native SvelteKit + `scroll-margin-top` — nothing else to
wire. Verify the docked sub-wedge labels fit (German "Ausbildung" is long —
check at 320px).

---

## 6. The world, zone by zone (build order = §7 phases)

1. **Sky sliver (~320px):** washi-dawn band, pale sun disc, far two-tone
   ridge line, the **boat** (new drawing: hull 3 paths, ~8 total, moored,
   2px bob under no-preference), standing **torii** right (reuse, with its
   reflection mask), title/lead center-right (dock clearance).
   **Koinobori (confirmed):** two carp streamers off the boat's stern pole —
   a red and a blue one, gently rippling under no-preference (2 paths each +
   eye dot; a slow skew/scaleX breathe, no wobble) — carp in the air above,
   real koi below.
2. **Waterline + the Hokusai crest (confirmed):** seigaiha band (shared
   snippet) fading down, 3 lily pads (reuse path; one edge-on ellipse from
   the side), foam ticks, the hard gradient break, ray roots. **The Hokusai
   wave lives here:** one small front-breaker crest in FooterWave's exact
   language (curl arm, 3–4 claw foam fingers, face-foam stroke, 3 spray
   dots — reuse/adapt `CLAW` and the curl construction from
   `FooterWave.svelte:53-105` at ~180px wide) rising behind the boat so the
   skiff sits **in the trough like Hokusai's boats** — a direct Great Wave
   homage at the moment you dive. Static or ultra-slow drift; it must not
   compete with the title. (`FooterWave` itself also stays alive on
   `/cv/[slug]` — see item 9.) The plunge beat: on first scroll past, the
   `waterline` reveal fires a one-shot ring + 5-bubble burst (CSS one-shots).
3. **Sunlit zone — SIGA panel (0–7 m):** brightest water, big kohaku circling
   an `offset-path` loop near the panel, second hi koi smaller, ringsets,
   bubble wisps, lily stems dangling from the pads above with root tufts.
4. **Upper twilight — HSLU MA ∥ SIGA Trainee (~7–12 m):** first kelp
   (`Garden` with a kelp preset — near-vertical rule, e.g.
   `X → F[+L]F[-L]FX`, angle ≈ 12°, step ≈ 8, 4 iter — **bbox-scan seeds in a
   scratch script first**, per the established workflow), asagi koi pair, a
   **cross-current** tie between the two concurrent cards (faint bubble trail
   arc drawn by the layer).
5. **Twilight — BSc ∥ Neptun (~15 m):** full kelp forest bracketing the
   column (2 Gardens per side, composed like the About rootbed), fish-school
   silhouette (5 tiny fish, ONE shared `offset-path` group), first tōrō
   lantern, water noticeably darker.
6. **Armee stratum (~26 m):** narrow band, sparser life, the origami crane on
   the card, a single small hi koi.
7. **Midnight — the apprenticeship trio (~30–39 m):** near-dark; EFZ + BM
   cards (education bank) and Lehre card (work bank) each lit by a tōrō glow;
   tiny fry cluster (6 fry = 6 two-path silhouettes on one loop); the rope
   heavily algae-grown; occasional single bubble columns (2 dashed-stroke
   wavy paths with `dashoffset` loop = dozens of bubbles for 2 paths).
8. **Seabed + origin (~40 m):** sand floor + pebbles/stones (reuse), the
   plumb lead landing, the **sunken torii** (re-tinted `#5a4a44`/moss,
   half-buried, barnacle dots, no reflection), the **koi-egg clutch** glowing
   amber under the gate (mirror of the Seed), one hatchling fry, the
   `origin` caption. **Namazu** half-buried in the sand nearby (see §8).
   **Flaschenpost (confirmed):** a corked bottle resting against a stone near
   the origin — the CV-as-PDF download. Drawn in the layer, interactive via
   the overlay (the chest/namazu precedent: `role="button"`/link,
   keyboard-reachable, its own `pointer-events: auto`). Content gains
   `cvPdf?: string` (see §5.3); **until the owner drops the real PDF**, the
   bottle renders with a small washi tag "PDF folgt — placeholder" and no
   dead link. Expected asset path once real:
   `static/media/cv/luiz-perren-cv.pdf`.
9. **Footer finale — DECIDED: Option A.** Route-scoped footer variant —
   `/cv` gets a new `FooterAbyss` (smooth dark rock masses stretch-safe at
   the edges + a fixed-size centered vignette where the egg-glow's tendrils
   reach down — exactly the Seed-footer recipe, `--footer-bar-bg` near-black
   indigo `#03101a`), while `/cv/[slug]` keeps the Hokusai `FooterWave`
   (paper-room fiction — and, together with the surface crest in item 2,
   this satisfies the owner's "a Hokusai wave somewhere" wish twice over).
   Layout already receives `variant` — extend `Footer.svelte`/
   `+layout.svelte` to pick by delocalized pathname.

---

## 7. Implementation phases (each = one milestone commit)

Every phase ends: `npm run check` (0 errors) → browser look (dev server,
screenshots) → commit **explicit paths only**.

- **Phase 0 — Safety + extraction.**
  Note clean HEAD hash. Create `src/lib/water/koi.ts`, `Koi.svelte`,
  `Seigaiha.svelte` (extract, don't yet rewire WaterScene — zero visual risk).
  Kelp preset scratch script (`playwright-core` bbox-scan over seed/step/
  iterations/angle) → record chosen params in the plan file.
  _Commit: "Water: shared koi + seigaiha modules"._
  **DONE 2026-09-27.** Rollback hash at start: `53dc1c1` (Codex's projects
  commits landed after the plan's `c79db38`). Kelp bbox scan result — the
  gentle-S grammar wins by a wide margin: `X → F+F[+L]F-F[-L]FX` (no F rule),
  **angle 14°, step 11, iterations 5, jitter 4**, heading 0 → h ≈ 265–295,
  w ≈ 50–62, 10 blades, only 25 segments/strand. Seeds barely change the
  silhouette at jitter 4 (kelp-3/kelp-4 verified). Ships as `KELP_PRESET` +
  `variant="kelp"` in lsystem/Garden when Phase 5 needs it; canvas ~120×310,
  origin bottom-center.
- **Phase 1 — Content + i18n + wheel.**
  `schema.ts` stationSchema, `cv.ts` real stations (skills placeholders
  flagged), messages keys, `menu.ts` sub-links, `meta_desc_cv`.
  _Commit: "CV: real stations content model, dive nav"._
- **Phase 2 — Page skeleton.**
  New `+page.svelte` structure (banks/weave/anchors/reveal wiring), static
  washi cards fully styled, **no layer yet** — this is the SSR/no-JS/reduced
  fallback and must already look complete and calm. Decide grid-vs-interleave
  here in the browser. _Commit: "CV: dive skeleton + washi stations"._
- **Phase 3 — DiveLayer core.**
  `dive/generate.ts` + `DiveLayer.svelte`: measurement, atmosphere gradient,
  `lineXAt`, rope + knots + tags + lead, clip-rect scrub, zone/gate plumbing,
  `instant` path. _Commit: "CV: the dive — atmosphere and sounding line"._
- **Phase 4 — Sky, waterline, light.**
  Boat, koinobori, sun, ridge, standing torii, the Hokusai surface crest
  (boat in the trough), seigaiha band, lily pads, rays, caustic drifters,
  plunge beat. _Commit: "CV: surface, koinobori and the plunge"._
- **Phase 5 — Life.**
  Station koi casting (size/robe by era), kelp Gardens, fish school, fry,
  bubbles (columns + one-shot bursts), lanterns + glow pools, algae on the
  rope, cross-current ties. _Commit: "CV: koi, kelp, lanterns"._
- **Phase 6 — Seabed + origin + footer.**
  Sand, stones, sunken torii, egg clutch + tendrils, origin caption, and the
  **`FooterAbyss`** (Option A, decided) wired by delocalized pathname.
  _Commit: "CV: the origin and the abyss footer"._
- **Phase 7 — Interactivity** (all confirmed in scope; each item still
  independently droppable if it fights the §8 budgets):
  companion koi (scroll scrub), **feed-the-koi — full pellet interaction**
  (window `click`; only when `event.target` is page background; pellet sinks
  via one CSS transition; nearest of 2 free koi glides to it — state + CSS
  transition, 1.5s cooldown, no rAF chase), **namazu** (eye follows cursor —
  the doe-gaze atan2 clamp; click = slow blink + bubble burst + `{#key}`
  "+1 ruhige See" float; no screen shake — owner hates wobble;
  `role="button"`, Enter/Space, the chest precedent), **Flaschenpost**
  (bottle near the origin; link when `cvPdf` is set, placeholder tag until
  then). _Commit: "CV: companions, the namazu and the Flaschenpost"._
- **Phase 8 — Responsive + a11y + reduced-motion hardening.**
  320/390/768/1440, de/en, gutter mode, dock clearance, focus order, chips
  not hit targets, `aria-hidden` on all decorative SVG, reduced-motion
  full-tableau audit, no-JS audit. _Commit: "CV: dive hardening"._
- **Phase 9 — Verification matrix (§8) + docs.**
  Update `HANDOFF.md` (CV section: shared vocabulary — sky · waterline ·
  sunlit · twilight · midnight · seabed · origin; the anchor contract; owner
  to-fill list: skills arrays, lead prose, thesis scroll), note plan
  completion here. _Commit: "CV: dive handoff notes"._

Estimated size: comparable to the About grove build (the biggest single piece
is Phase 3; Phases 4–6 are steady scene work).

---

## 8. Test & verification plan (in detail)

### 8.1 Gates (every phase)

1. `npm run check` — **0 errors, 0 warnings tolerated new**.
2. `npm run build` passes (Zod parses `stations` at module load — bad content
   fails the build by design).
3. `npx prettier --check` on changed files.
4. `git diff --stat` reviewed; stage explicit paths; `messages/` diff
   inspected for Codex co-changes first.

### 8.2 Browser harness (the memory workflow, scripted per phase)

Setup (once per session): `npm run dev` (read the port — 5173 may be taken),
`npm i --no-save playwright-core`, launch headless with
`executablePath: '/home/luix/.nix-profile/bin/chromium'`. Screenshots to the
session scratchpad; **Read the PNGs and actually look** — a green script is
not a verified scene.

Matrix (automated screenshots + assertions):

| Axis            | Values                                                   |
| --------------- | -------------------------------------------------------- |
| Viewport        | 1440×900 · 768×1024 · 390×844 · 320×700                  |
| Locale          | `/cv` · `/de/cv`                                         |
| Motion          | default · `reducedMotion: 'reduce'` context              |
| Scroll stations | sky · waterline · each depth band · origin · footer seam |

Assertions per run:

- **Anchors:** `goto('/cv#experience')` and `#education` → target section's
  `getBoundingClientRect().top` ≈ `6rem` (scroll-margin honored); same from
  a real wheel click on the docked sub-wedge.
- **Reveal:** before scroll a station has `.pending`; after
  `scrollIntoView({behavior:'instant'})` + settle wait it has `.in` and
  computed opacity 1; `revealed` never regresses.
- **Scrub:** read the clip rect height at scrollY = 0.25·max and 0.75·max →
  strictly increasing; scroll back up → decreases (rope rewinds).
- **Companion koi:** overlay holder transform differs between two scroll
  positions; flips heading class on direction change.
- **Reduced motion:** zero `.pending` at load; `document.getAnimations()`
  ≈ 0 (allow ≤2 for the corner-scene layer outside the page); every zone
  `on`; koi parked at rest poses; rope fully paid out.
- **No-JS:** `javaScriptEnabled: false` → all station text/chips/headings
  present, static borders visible, no blank regions, no `.pending`.
- **Overflow:** `document.documentElement.scrollWidth <= innerWidth` at every
  viewport (German labels included — "Berufsfachschule Oberwallis" is the
  long-string canary).
- **Dock clearance:** at 1440 and 390, elementFromPoint checks in the wheel's
  top-left square hit no station content.
- **Interactions:** synthetic click in open water → pellet node exists →
  free-koi holder transform targets it → pellet gone after its transition;
  pointermove near namazu → eye group rotate changes; namazu click →
  float node appears (`{#key}` remount), **no transform on the page root**
  (anti-wobble assertion).
- **Hydration determinism:** two loads produce identical layer SVG (seeded
  PRNG; no `Date.now`/`Math.random` in build paths) — diff the serialized
  `<svg>` innerHTML.
- **Defs collisions:** both DiveLayer instances + WaterScene corner mounted →
  all `id` attributes on the page unique (uid-prefix discipline).

### 8.3 Performance sanity

- Element budget: total layer nodes **< ~1,800** (tree ≈ 2,000 at desktop);
  concurrently _animating_ elements **< 40** (count via
  `getAnimations({subtree:true})` on the layer at 3 scroll positions).
- Per-frame scroll work: exactly 2 clip-rect heights + 1 companion transform
  (code review + a Performance-panel trace while wheel-scrolling the full
  page at 6× CPU throttle — no long tasks > 50ms after build).
- Greps: no `filter` animations/transitions anywhere new; exactly one
  `new IntersectionObserver` in the running page (the shared one);
  `will-change` nowhere; all listeners passive; `pointermove` gated on
  `pointer: fine`; every `{#each}` keyed.
- Coordinates through `f1` rounding; grass-band-style silhouette compilation
  wherever a mass of small things is wanted (sand ripples, fry, bubbles).

### 8.4 Owner review (after the overnight build)

The owner reviews the finished page, not each phase (they're asleep during
the build — self-review against §8.1–8.3 replaces the per-phase walk).
Their checklist when they wake: feel of the plunge, koi believability,
darkness curve on the small laptop's panel, feed-the-koi delight vs
annoyance, dock overlap while scrolling, de prose voice (du-form), the
Hokusai crest vs title balance, and the placeholder list to fill (skills,
lead/origin prose, PDF, thesis).

---

## 9. Decisions — RESOLVED by the owner, 2026-09-27

1. **Footer: Option A** (route-scoped `FooterAbyss` finale for `/cv`;
   `FooterWave` stays on `/cv/[slug]`) — **plus** the owner wants "a Hokusai
   wave somewhere" visible: satisfied by the **surface crest behind the boat**
   (§6 item 2, boat-in-the-trough homage) in addition to the wave footer on
   the scroll pages.
2. **Sample research/publications:** go with the recommendation — fake
   entries removed from every visible list now; the sample paper file stays
   as the PaperScroll fixture until the thesis scroll replaces it.
3. **Koinobori: yes** (§6 item 1).
4. **Flaschenpost: yes, in scope** — implemented with a placeholder tag until
   the owner provides the real PDF (`cvPdf` in content, §5.3 / §6 item 8).
5. **Feed-the-koi: yes, full pellet interaction** (§7 Phase 7).
6. **Darkness ceiling: implementer's judgment** — the owner is asleep; decide
   in the browser against the washi cards and the §8 contrast/readability
   checks (start from the `#092838` band and adjust by eye).
7. **Skills + prose: placeholders until the design is finished** — ship the
   known-real skills plus "— placeholder"-marked slots and placeholder
   `cv_lead`/`cv_origin` prose (en + du-form de); the owner fills them
   afterwards.

---

## 10. Risks & mitigations

- **Grid banks vs content height** (two-bank same-depth alignment): riskiest
  layout piece → decided early, in Phase 2, with real content; fallback
  (DOM-interleaved + aria-labelledby) specified up front.
- **Dark-zone contrast:** washi cards guarantee text contrast independent of
  water darkness; lantern pools are additive. Checked at every viewport in
  the matrix (§8.2).
- **Two-instance drift:** phase from dimension-hash, not PRNG stream —
  covered by the hydration-determinism assertion.
- **Codex co-editing:** explicit-path staging + `messages/` diff inspection
  every commit; never touch `src/lib/projects/*`.
- **Scope creep in fauna:** every Phase-7 item is independently droppable;
  the page must already feel complete after Phase 6.
- **Perf on the small laptop:** budgets in §8.3 are asserted, not hoped; the
  compile-to-few-paths rule (bubble columns, fry-as-silhouettes, sand as 3
  bands) is specified per element in §6.
