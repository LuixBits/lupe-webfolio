# Projects: side walls and reachable navigation

Date: 2026-09-27. Source commit: `212e73c`.

The owner wanted more width than the previous 1600px cap, an immersive use of
the remaining space, and navigation that stays near the room on large displays.
The overview now stops at 2000 CSS pixels. Perspective walls fill the sides,
and the wheel has horizontal and vertical limits on every Projects route.

## Room and navigation

The overview and footer share `--workshop-max-width: 2000px` in the root layout.
The side walls occupy the resulting gutters and join the room through ceiling
lines, corner posts, baseboards and a perspective floor. Plum and blue-violet
surfaces carry the room's existing light and palette into the extra space.

The docked wheel's pivot stops at 1240px left and 600px below the viewport
centre. On wide displays this places it 240px left of the room, leaving about
48px between its fan and the room edge. The paintings leave a separate lane
for it, so scrolling does not move a frame under the controls. The unused
three quarters of the rim are clipped when the circle becomes fully visible.
Normal desktop docking, the compact navigation ledge and other sections keep
their existing behaviour.

The walls appear above 2000px. Each gallery needs at least 38rem of wall width;
at the default text size that means a viewport of 3216px or more. Smaller
gutters retain the architectural surfaces. Enlarged text can hide the optional
pictures when they would no longer fit. Their captions use the existing body
size and Space Mono rather than a new decorative text scale.

The four prints show a working CRT, the existing Nix logo, a rubber-duck
debugging consultant and late-night coffee. The duck is a native button: click,
Enter or Space reveals its wizard hat and a second caption. Its localized name,
pressed state and live caption describe the change. State belongs to the
Projects layout and survives detail visits. The other three prints are figures.
All new artwork is original SVG/CSS except the already attributed local Nix
logo. There are no new external downloads, renderers or ambient animation loops.

The interior keeps its clipping layer, while the overview allows the walls to
extend into the gutters. Both walls remain inside the route snapshot. Existing
ID remapping preserves the print gradients, and the copy remains inert.

## Checks

- `npm run check`: zero errors and warnings. Production build passed with the
  existing non-fatal Zod annotation notices. Scoped Prettier and diff checks passed.
- English and German layouts passed at widths of 7680, 5120, 3840, 3440, 2560,
  2001, 2000, 1920, 1680, 1440, 1024, 768, 390 and 320px, plus 844 × 390
  landscape. Both languages also passed 200% root text at 5120, 3440, 1440
  and 320px. Room/footer alignment, wheel coordinates, content fit and document
  overflow were checked. All nine project links remained present.
- Each drawer still opens exclusively. The six permitted text sizes and the
  two content fonts remain in use. Reduced motion leaves zero room animations.
  Both workstation drawings fit their SVG viewBoxes.
- Mouse and keyboard checks covered the duck, its state after a detail visit,
  category navigation, restored link focus and return through the home hub.
  Phone touch navigation and English SSR project links passed. Static wall
  art is present without JavaScript; the optional duck control stays disabled.
- At 3440px with 200% text, the animated departure copy retained the live room's
  columns, 2000px width and both walls. Its IDs were unique, its SVG references
  resolved and its drawer group names were removed. Return restored the selected
  drawer and project link focus.
- Full-room and viewport screenshots were reviewed at ultrawide sizes, along
  with the separate wall artwork and phone layout. The production preview
  passed the English/German interaction and SSR checks, plus width and navigation
  checks at 3440 × 1440 and 5120 × 2160. No browser exceptions were observed.
  These checks used installed Chromium; other browser engines were not tested.

## Preview and provenance

Use <http://localhost:5173/projects> for the shared development app, or
<http://localhost:5191/projects> for the isolated production preview. German
routes use `/de/projects`. The shared dev server stayed running; only the
previous isolated preview on port 5191 was replaced. No deployment was made.

The build source is `/tmp/lupe-walls-validation-h_h0rsyl`, archived from
`2102ee887f1acafc05c55516d511eb4e6481085f` with the nine changed source/message
files overlaid. Their bytes match `212e73c`. Concurrent CV changes are excluded
from that build. Dependencies use the existing installation, and Paraglide was
compiled with the `url`, `cookie`, `baseLocale` strategy.

Temporary checks and images live in `/tmp/lupe-workshop-walls/`: `verify.mjs`,
`interactions.mjs`, `capture.mjs`, the `refined-*` room and wall captures,
`duck-secret-*`, `production-3440.png`, `production-5120.png` and `build.log`.
`overlay.json` records the base, build directory, source commit and nine files.
