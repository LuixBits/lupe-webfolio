# Projects workshop implementation review

Date: 2026-09-27. Implements the
[after-hours workshop plan](../plans/projects-after-hours-workshop.md), including
the owner's request during implementation for a larger, more expressive room.

**Owner follow-up:** this delivery was still too simple and compact. The owner
requested an inhabited room using the whole space, with About as a reference.
The [inhabited workshop plan](../plans/projects-inhabited-workshop.md) has since
been implemented. See its [review](projects-inhabited-workshop-2026-09-27.md) and
use <http://localhost:5173/projects>. Preview addresses and build paths below
are historical records; port 5191 now serves the new room. The checks below
apply to the compact baseline.

## Implemented

The overview is a plum plaster room with a mounted neon Projects sign, a full
studio doorway, a wooden display cabinet and a tiled threshold. LuixBits appears
once, in the doorway. Its decorative CRT and lamp preview leads to the existing
channel room. The other three projects have illustrated software cases with
cream labels. The covers depict the radial portfolio, particle cube and planning
cards; they are original illustrations, not invented screenshots.

The larger composition keeps all four entrances fully visible at 1440 × 1000.
The three category IDs, project URLs, `tape-{slug}` anchors and
`data-project-tape` hooks remain intact. Content still comes from `projects.ts`.
Orbit Toy and Scrum Poker retain their existing sample disclosures. Additional
cases wrap onto supported rows.

On the overview, the wheel has a normal-flow ledge at widths up to 960px and on
short landscape screens. Its resting state scrolls away with the ledge. Wide
layouts reserve 216px for the docked wheel. The hub and detail pages retain their
existing wheel placement. Container queries let the room stack when enlarged
text needs more space. Decorative padding, panel clearance and light spill were
also checked against the actual rendered bounds.

The studio camera translates toward the measured aperture as it scales. Case
navigation lifts the chosen case and dissolves into the detail page. A fixed,
inert snapshot retains the departing room's CSS variables and SVG paint
references. Snapshot SVG IDs are remapped; HTML IDs and project lookup hooks are
removed. Route preparation, motion and reveal do not block native navigation.

The route timings live in `lib/projects/navigation.ts`. Desktop studio entry is
640ms, with a 470ms arrival starting after 170ms. Case entry uses 460ms. Compact
entry uses 360ms. Returns use 420ms on desktop and 260ms on compact screens.
The CRT shutters and channel light wait on `moving`, so they resume when motion
finishes or is cancelled instead of guessing with a second 640ms timer.

Returns restore focus to the originating link. The remote restores the saved
overview scroll position; browser history keeps its own scroll restoration.
Arrival runs after SvelteKit's queued fragment-focus task so an older hash cannot
steal focus. A sequence counter, cancellation handlers and a preparation timeout
remove snapshots after interrupted, failed or superseded navigation.

Locale changes use Paraglide's normal reload. A one-shot session marker suppresses
the overview CRT reveal on that reload. Category jumps do not start room motion.
Reduced motion removes travel, door movement, neon animation and CRT shutters.
No overview interaction loads an iframe or starts audio.

## Validation

| Review                | Result                                                                                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Svelte and TypeScript | `npm run check`: 0 errors, 0 warnings.                                                                                                                                                                              |
| Production build      | `npm run build`: passed with adapter-node in an isolated copy.                                                                                                                                                      |
| EN and DE layout      | Reviewed at 1440 × 1000, 768 × 1024, 390 × 844, 320 × 740 and 844 × 390. No document/body overflow or clipped project labels.                                                                                       |
| Enlarged text         | 200% root text size at 1440px and 320px in both languages. Content wraps and remains within the viewport.                                                                                                           |
| SSR                   | JavaScript-disabled EN/DE overviews retain all four links and visible artwork. Studio entry and remote return work as native navigation.                                                                            |
| Input                 | Real Tab/Enter, mouse hover, Ctrl-click and middle-click, touch menu expansion, category selection and one-tap entry checked.                                                                                       |
| Return paths          | Remote return and browser Back restore the source link. Long-page return restores the overview position. Browser Forward checked in the production build.                                                           |
| Motion                | Hub/direct entry, door and case entry, return, rapid navigation, resize during entry, motion-preference changes, unmount and a missing-project error route checked. No stranded snapshots.                          |
| Snapshot rendering    | No duplicate IDs; snapshot controls are inert and hidden from assistive technology. Theme variables and SVG gradients remain present in a paused camera frame.                                                      |
| Channel controls      | Tape selection, explicit Play, eject, power, lamp and Casio selection checked. The watch focuses Play and loads its episode without autoplay. Existing keyboard, paper, sticker and cable artwork remains in place. |
| Other detail views    | Webfolio remains a no-media page. Scrum Poker stills and Orbit Toy's explicit demo/eject controls checked. Sample disclosures remain visible.                                                                       |
| Browser failures      | No unexpected browser exceptions or missing local assets in the completed checks.                                                                                                                                   |

YouTube's iframe response was mocked for the player-control checks. These tests
verify embed creation, selection and teardown, not real provider playback.

## Preview and artifacts

- Stable production preview: <http://127.0.0.1:5191/projects>.
- German preview: <http://127.0.0.1:5191/de/projects>.
- Source for that build: commit `40390dd`, archived into
  `/tmp/lupe-workshop-validation-2AaOVw`.
- Server command in that directory:
  `HOST=127.0.0.1 PORT=5191 node build/index.js`.
- Shared development preview used during implementation:
  <http://127.0.0.1:5190/projects>.
- Browser scripts, screenshots and logs: `/tmp/lupe-workshop-review/`.
  `production-desktop.png` and `production-phone.png` show the built result;
  `baseline-projects-1440.png` and `baseline-projects-390.png` record the start.
  `responsive.log`, `interaction.log`, `production.log`, `validation-check.log`
  and `validation-build.log` contain the completed checks.

The isolated copy uses the existing node_modules and cached inlang plugins so
validation can run without fetching plugins. Its generated output is separate
from the shared development server. The `/tmp` artifacts are temporary session
files, not a permanent test suite.

## Milestones and scope

| Commit    | Scope                                                                           |
| --------- | ------------------------------------------------------------------------------- |
| `2f6f0e7` | Plan and rollback reference; application still at the accepted overview.        |
| `ae0fe96` | Plain composition, exact inventory, route shell and navigation ledge.           |
| `53dc1c1` | Doorway illustration, cases, supports and receiving-surface light.              |
| `0004947` | Larger covers, full counter, responsive and enlarged-text refinements.          |
| `40390dd` | Measured camera, shared completion state, focus/scroll restoration and cleanup. |

Concurrent Water/CV commits and edits were kept separate. This work did not
publish or restart the live site. The implementation is ready for the owner's
visual review; this record does not claim that the owner has approved the final
screenshots.
