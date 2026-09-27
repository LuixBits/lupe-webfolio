# CV — »Der Anlegesteg« (The Mooring)

**2026-09-27, same night as the dive.** The owner reviewed »Der Tauchgang«
and called it too structurally similar to the About tree (long scroll, cards
on a spine, depth-as-time — the same bones). Re-concept, owner-directed:
**compact, scene-first** — each topic a craft ON the water, click to go
aboard for details. This supersedes the page composition of
`cv-koi-dive.md`; that plan's asset library, content model, verification
harness and owner rules all carry forward.

## The concept

One panoramic pond, roughly a viewport. **Work floats, education grows:**

- **Boats = Erfahrung.** SIGA is the flagship wasen in the foreground — two
  lashed cargo crates (the two roles) tied with a red mizuhiki cord,
  koinobori off the stern, a lit chōchin at the bow. Neptun a light skiff
  with a trident boat-hook; the Armee a spartan olive punt carrying the
  origami crane; the EMVs Lehre a weathered rowboat, oar shipped.
- **Lily pads = Ausbildung.** HSLU is a lotus raft (MA + BSc pads, both in
  bloom — a completed degree blooms; young blossoms on the school pads the
  EMVs boat tows). A dragonfly (tombo, the victory insect) rests on the MA
  lotus.
- **Time = distance.** Newest big in the foreground-left, oldest small and
  hazy toward the horizon-right, where the far torii marks 2013. The
  sounding line is reborn as the **mooring current**: one line from the
  torii to the "heute" bollard, every craft tied to it, uki float-tags
  carrying the year spans. Concurrent chapters are rafted together (the
  HSLU pads corded to the SIGA boat).
- **Going aboard:** every craft is a real link to `/cv/<slug>` (siga, hslu,
  neptun, armee, emvs) — the site's overview→detail grammar (like
  Projects). The detail page opens on a berth band with the SAME craft
  floating (you really boarded), then the **Logbuch**: one washi slip per
  station, the dive's proven paper language. `/cv/thesis` (PaperScroll)
  hangs off the HSLU MA slip once the owner writes it.
- **Print-craft** (the "unique and special" ask): ukiyo-e devices — kumo
  cloud bars, kasumi mist bands across the far water, stylized woodblock
  reflections (three broken dashes, no masks), patches of seigaiha rather
  than a uniform band, and the artist's red seal in the corner.
- **Play carries over:** feed-the-koi in open water, the namazu's eyes
  breaking the surface (gaze + blink + "+1 ruhige See"), the Flaschenpost
  with its placeholder tag until `cvPdf` is real.

## Layout modes

- **Panorama** (≥700px): fixed viewBox ≈1200×620, full-width hero.
- **Quay** (<700px): the same crafts re-moored down a vertical line
  (viewBox ≈420×940) — both SVGs render (SSR-safe), a media query shows
  one; the scene stays fully server-rendered with working links (better
  no-JS than the dive had).

## Structure

- `lib/water/pond/`: `Vessel.svelte` (the five bespoke crafts, shared by
  scene + berth), `Torii.svelte`, `Crane.svelte`, `PondScene.svelte`.
- `lib/cv/VesselDeck.svelte` + extended `/cv/[slug]` (vessels first, then
  scrolls). `content/cv.ts`: `vessels[]` (zod `vesselSchema`, stationIds
  checked at load), `getVessel`, `vesselStations`; `stations[]` unchanged.
- Wheel CV children → SIGA / HSLU / Neptun (`/cv/<slug>`, org names
  locale-free). i18n: eyebrow "vor Anker", new lead (placeholder), new
  meta, +`cv_logbook`/`cv_aboard`/`cv_moor_hint`; `cv_depth_m` and the
  `nav_cv_*` pair retire with the dive page.
- The dive (`lib/water/dive/`, the long page, `FooterAbyss`) is removed in
  P2; `/cv` ends on the Hokusai `FooterWave` again. Koi/Seigaiha/kelp-preset
  stay in the shared library.

## Phases

**IMPLEMENTED the same day** — P1 content+routes+wheel → P2 panorama +
compact `/cv` + dive removal → P3 quay + life + play → P4 hardening (the dive's assertion matrix, minus
scrub/dive-specific checks, plus scene link hit-targets) + HANDOFF.

Same rules as ever: gentle motion, no wobble, reduced-motion lands fully
drawn, one shared IO where observation is needed, explicit-path commits,
verify in the browser before every commit, never `git add -A`.
