# Projects floor and typography refinement

Date: 2026-09-27. Application milestone: `6950ea8`.
Responds to the owner's request to improve the cat, plans and
seat, review the rest of the room, and make the typography rules explicit.

## Visual findings and changes

| Finding                                                                  | Implemented change                                                                                                                                                                                    |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The sleeping cat had angular eyes, an oval body and a disconnected tail. | A shaped shoulder and flank, tucked paws, a curled striped tail, rounded sleeping eyes and green eyes when awake. The existing keyboard control and small gaze response remain. Breathing is subtler. |
| The stool looked like two sticks under a thick cylinder.                 | Four splayed steel legs, a curved foot ring, visible joints, rubber feet, worn wood grain and a contact shadow. Its perspective now comes from the drawing rather than rotating the whole stool.      |
| The plant was a flat stem with similar leaves.                           | Overlapping leaves with varied angles, curved stems, veins and shaded surfaces; a terracotta pot with a rim, soil, saucer and floor shadow.                                                           |
| The floor-plan sheet was sparse and grey.                                | Warm layered paper, a folded corner, grid, wall openings, furniture, door swings and graphical dimension chains. The shared component improves the drawer and channel desk together.                  |
| The nearby basket and rug had little material detail.                    | Woven strips, cylindrical rolled drawings and a ruler in the basket; woven texture and a bordered diamond pattern on the rug.                                                                         |

These are original SVG/CSS illustrations. Gradients and repeated artwork use
instance-specific IDs, which the existing transition snapshot remaps. The
drawings introduce no new animation loops. Existing visibility, Pause and
reduced-motion controls continue to gate the cat's breathing.

## Typography findings and changes

The shared scale already existed in `src/app.css`, `HANDOFF.md` and the scene
guide. [Projects typography](../projects-typography.md) now records the six
permitted tokens, their exact values and roles, the Righteous / Space Mono
pairing, and the separate SVG neon lettering. The guide also distinguishes
illustration markings and the shared radial wheel's fitted lettering from
HTML project content.

Studio's project title now uses the same `--fs-h3` as the other project titles.
The Play annotation and signature use Space Mono, replacing Georgia. The
language switcher uses `--fs-small` throughout Projects; the CRT status uses the
body face and its decorative casing lettering uses the same family. Legacy
TestCard and VcrKey primitives also use the shared sizes instead of tiny custom
values; those primitives are not mounted by the current room.

Reviewing 200% text at 320px exposed existing detail-page layout failures.
Cassette titles were squeezed beside durations, the channel masthead and
recorder controls overflowed, and footer clearance pushed the language switcher
offscreen. Container queries now stack the cassette metadata, masthead and desk
objects when needed. Controls wrap, decorative padding is capped, and project
sleeves stack their cover above the heading. Font sizes remain on the shared
scale.

The existing phone navigation ledge now applies to every Projects route. The
resting wheel scrolls away with the ledge instead of covering detail content.
The Projects footer consequently uses the available width on small screens.

## Validation

- Final isolated `npm run check`: **0 errors, 0 warnings**. `npm run build`
  passed with adapter-node.
- Overview: EN/DE at 1440, 1024, 768, 390 and 320px, plus 844 × 390 landscape.
  Also checked 200% root text at 1440px and 320px. All nine links, three open
  drawers, revised artwork and controls fit. Computed HTML text matched the
  shared size tokens and the two content typefaces.
- Channel and Magic Mouse detail: EN/DE, 1440px and 320px, normal and 200% root
  text. Typography and control bounds passed. Large-text screenshots were
  inspected in the built preview as well.
- Cat: Space and Enter toggle its state; project return preserves that state
  and the sketch drawer. Breathing runs while the floor is visible, stops on
  Pause, and is absent under reduced motion.
- Transition: new gradient, pattern and SVG `use` references resolve inside
  the departure snapshot; the document has no duplicate IDs during that check.
- Production: native project return, German phone category navigation, a tape
  target clear of the wheel, and the menu's Projects-only scope passed. New
  plant and plan artwork render with JavaScript disabled. No browser exceptions
  occurred in the completed checks.

The 200% checks change the root font size, rather than applying browser page
zoom. YouTube playback was not repeated in this refinement; the preceding
[collections review](projects-collections-2026-09-27.md) records that check.

## Preview and artifacts

- Current app: <http://localhost:5173/projects>, including `/de/projects`.
- Production preview: <http://localhost:5191/projects>.
- Build copy: `/tmp/lupe-polish-validation-8a_iyp4c`, based on
  `e21a08b42e31362893f530c4b778df3713e03b89` plus the scoped Projects changes.
  Concurrent CV edits beyond that base were excluded. Existing dependencies and
  cached inlang plugins were used; the shared dev build was not replaced.
- Browser scripts, before/after images and logs:
  `/tmp/lupe-workshop-polish/`. `verify.log` records the full layout/type matrix;
  `production.log` records the built checks. `isolated-check.log` and `build.log`
  record the final source checks.
- `before-*` / `after-*` show the artwork changes. `production-room.png`,
  `production-channel-320-de.png`, `production-cassettes-200.png` and
  `production-paper-200.png` show the built results.

Artifacts in `/tmp` are temporary session files. Nothing was published or pushed.
