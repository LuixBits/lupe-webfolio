# Projects: ultrawide fit and calmer room

Date: 2026-09-27. Source commit: `d2674c4`.

The owner asked to improve or remove the Defy keyboard, remove the motion button
and subtitle, simplify the rain for performance, and constrain the room on a
34-inch display. The implementation keeps the accepted room and makes those
changes in `/projects` and its German route.

## Changes

The overview and footer now stop at 1600 CSS pixels and centre within the wall
background. `--workshop-max-width` in the root layout controls both. The room's
left padding accounts for the outside gutter: it clears the corner wheel on
ordinary desktops and becomes balanced when the viewport provides that clearance.
Phone and tablet widths remain fluid. Other project pages retain their existing
content widths.

The room itself owns the responsive container. Its temporary departure copy
therefore retains the same layout when a project opens. This matters on an
ultrawide display with enlarged text: the 1600px room can need a stacked layout
even while the surrounding viewport is much wider.

The Defy's silhouette was redrawn using the official
[purple and white product photo](https://dygma.com/products/dygma-defy-purple-white)
as a visual reference. Deeper palm pads, curved thumb clusters, a fuller staggered
key layout and brighter keycaps replace the flattened first drawing. Existing
workbench geometry informed the original SVG; no downloaded photo is shipped.
Standard keycaps share one SVG definition. The channel's keyboard is unchanged.

The room heading contains only the neon sign. The subtitle, motion button, pause
state, unused translation keys and their CSS are removed. The window's rain
pattern, animated layer, keyframes and visibility observer are also removed.
Its sunset, skyline and glass reflection remain static. The cat and Orbit Toy
retain their visibility and reduced-motion gates; the lamp, drawers and tablet
keep their interactions. No performance benchmark is claimed.

## Checks

- `npm run check`: zero errors and warnings. Production build passed; the existing
  Zod annotation notices remain non-fatal. Scoped Prettier and diff checks passed.
- English and German layouts passed at 3440, 1920, 1680, 1440, 1024, 768, 390 and
  320px, plus 844 × 390 landscape. Both languages passed 200% root text at 3440,
  1440 and 320px. Room and footer widths matched, centred at 1600px or filled the
  narrower viewport. All nine links remained present and visible text fitted.
- The corrected SVG fits its viewBox. Standard text still uses the documented
  six sizes and two content fonts. Desktop and phone artwork were inspected.
- At 3440px with 200% text, the departure snapshot retained the live room's grid
  columns and 1600px width. Its IDs were unique and local SVG references resolved.
  Return restored the originating link and the selected drawer.
- The window had zero animations and no visibility-observer state. The visible
  cat breathed normally; changing the browser's reduced-motion preference stopped
  all room animation. The cat's awake state survived a project visit.
- German SSR without JavaScript retained the capped room, valid keyboard SVG
  references and exclusive drawers. No browser exceptions were observed.
- The final production preview passed the responsive, transition, motion and SSR
  checks. These checks used installed Chromium, not other browser engines.

## Preview and provenance

The shared app remains <http://localhost:5173/projects>. The isolated production
preview at <http://localhost:5191/projects> now contains this follow-up; neither
the shared dev server nor the published site was restarted or deployed.

The build source is `/tmp/lupe-calm-validation-qzu6x19_`, archived from
`834605ae6ea2e1c6a798b7f5ba306e5c6dfdc7a8` with the ten changed source/message
files overlaid. Their contents match `d2674c4`. Concurrent CV changes are excluded
from that build. Dependencies use the existing installation, and Paraglide was
compiled with the `url`, `cookie`, `baseLocale` strategy.

Temporary checks and images live in `/tmp/lupe-workshop-calm/`: `verify.mjs`,
`motion.mjs`, `capture.mjs`, `production-ultrawide.png`, `production-keyboard.png`,
phone captures and the final `build.log`. `overlay.json` records the ten files.
