# Projects: distinct workstations and exclusive drawers

Date: 2026-09-27. Source commit: `7bf295b`.

The owner requested one open drawer at a time, more distinct Neovim and Desktop
computers, better peripherals, and ideas for giving Web a physical setting.
This follow-up implements those changes in the existing `/projects` overview.

## Design

Neovim now has a deep cream terminal with a bevelled bezel, vents, phosphor
screen, swivel base and a purple split keyboard. Its screen combines editor
marks with a room plan. Stacked study cards and a pencil connect the drawing to
the collection. The keyboard has staggered keycaps, thumb keys, palm supports
and a connecting cable.

Desktop uses a different silhouette: a thin widescreen on a swept metal stand,
with a compact vented tower. The display retains the sunset, mountains and grid
from the room's palette. The digital watch has linked straps, pushers, a
chamfered case and the owner's established 4:20 face. The mouse has a longer
unbroken glass surface and a thin dark underside; the first preview was revised
because its compressed proportions looked round.

Web now sits inside a recessed network cabinet beside the window. Metal rails,
corner screws, hinges, a model shelf and connected network hardware frame the
whole collection. Lavender paper labels distinguish its project files from the
wooden workstations. This is the implemented proposal for the Web discussion;
the owner has not yet chosen among the alternatives. The
[collections plan](../plans/projects-collections-drawers.md) records the cabinet,
freestanding rack, testing desk and couch tradeoffs.

The drawings are original SVG. Illustrated editor and desktop panels carry no
new product claims. The implementation adds no package, external asset, font or
animation loop. The six shared text sizes remain in use. A named container query
stacks the emblem above narrow project labels after browser review showed that
200% text otherwise left a cramped column beside it.

## Drawer behavior

The room stores one `openDrawer` value: sketch, parts, tablet or null. Function
bindings keep the native disclosures and room state synchronized. All three
details share a component-specific `name`, so native grouping also works without
JavaScript. Closing the previous drawer only clears the state if it remains the
selection; this handles queued toggle events during rapid activation.

Opening a different drawer stops a playing tablet. The selected drawer survives
project visits, but playback does not. Transition snapshots remove media and
disclosure group names before insertion, so a decorative copy cannot join the
live group. Escape closes the focused drawer and returns focus to its handle.

API references: [Svelte function bindings](https://svelte.dev/docs/svelte/bind),
[native details grouping](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details).

## Validation

- `npm run check`: zero errors and warnings in the isolated build source.
- `npm run build`: passed after the final responsive CSS change. Existing Zod
  annotation notices remain non-fatal build output.
- Prettier checks for all nine changed source files and `git diff --check` passed.
- Chromium overview checks passed in English and German at 1440, 1024, 768, 390
  and 320px widths, plus 844 × 390 landscape. Both languages also passed with
  200% root text at 1440 and 320px. Every drawer was checked separately.
- All nine project links remained present. Visible copy and controls fitted the
  viewport; text used only the permitted fonts and size tokens. Both computer
  drawings stayed within their SVG viewBoxes. Reduced motion produced no room
  animations.
- Normal clicks, twenty rapid activation sequences, Enter, Space, Escape,
  remote return and browser Back preserved one selected drawer or none.
- No iframe was created by opening a drawer. Switching away from the playing
  tablet and navigating to a project removed it. Return restored the selected
  drawer with the Play button ready. These lifecycle checks used a local stub
  for the external player; they do not claim a new real-provider playback test.
- German drawers remained exclusive with JavaScript disabled, and the tablet's
  external video link remained available.
- With motion enabled, departure snapshots had unique IDs, valid gradient,
  pattern and local SVG references, no disclosure group names, and an inert
  root. Returning restored the selected drawer and exact originating link.
- The finished production preview passed the drawer lifecycle, rapid-input,
  keyboard, native fallback and return checks. Desktop and phone artwork were
  captured from that build.

## Preview and provenance

The shared development server remains at <http://localhost:5173/projects> and
<http://localhost:5173/de/projects>. The isolated production preview at
<http://localhost:5191/projects> now contains this follow-up. No published site
was changed.

The production source is `/tmp/lupe-stations-validation-u98a5xzh`: a Git archive
of `3e14730b5730690e34ef53102a472e45e379b605` with only this follow-up's nine
source files overlaid. Those files match commit `7bf295b`. It uses the existing
installed dependencies. Paraglide was compiled with `url`, `cookie`, `baseLocale`
strategy before checking. The final CSS was rebuilt after the text-layout fix.
The previous isolated preview was identified by port and working directory
before replacement; the shared 5173 server was not restarted.

Temporary browser scripts and screenshots are in
`/tmp/lupe-workshop-stations/`: `drawers.mjs`, `responsive.mjs`, `capture.mjs`,
`production-room-1440.png`, `production-room-390.png`, individual workstation
captures, and 320px German/English text-zoom captures. The final build log is
`production-build.log` in that directory. Browser checks used the installed
Chromium; other browser engines were not exercised in this follow-up.
