# Projects: responsive workstations and room depth

Date: 2026-09-27. Source commit: `f8845a6`.

The owner approved four further improvements: workstation previews tied to
projects, more depth through the studio door, a physical navigation mount and
neon reflections on nearby surfaces. All four are implemented on `/projects`
and its German route, retaining the 2000px room cap and side walls.

## Workstations

Each shelf passes the active project slug to its illustration. Mouse or pen
hover selects that file, and leaving it returns to the focused file or the
first project. A focus event clears the hover choice so keyboard navigation
takes over even if the pointer remains on another file. The active emblem
picks up its station's neon colour.

The Web cabinet switches between the portfolio model, a miniature planning-poker
table and a browser with feed documents and replies. The Neovim monitor shows
either the room plan or a stack of review cards. Desktop retains its Noctalia
panel and shows a Magic Mouse study when that project receives hover or focus.
These are original decorative SVG illustrations. The upcoming app's artwork
does not claim an implemented interface or add feature promises.

All seven views use their station's existing dimensions. No timer, animation
loop, external fetch, player or renderer is added. The native links keep their
destinations and metadata; touch goes straight to the project with one tap.
Illustrations stay hidden from assistive technology because the adjacent link
already carries the title and description. SSR supplies the default illustration
and usable links. Return focus selects the matching artwork again.

## Architecture, mount and light

The doorway's ceiling, back wall, side walls, skirting and tiled floor now form
a continuous recess. Architectural planes stretch with the doorway while the
CRT, furniture and new framed print keep their proportions. The floor joins
behind the desk, with a contact shadow beneath its legs. A cool threshold and
light spilling beyond it connect the inner studio to the workshop.

The Projects navigation has a metal plate shaped around its quarter fan and
Back knob. Bevels, screws and a static shadow give it support without adding a
hit target. It inherits the existing distance limits, clears the wall pictures
and stays absent on the home hub and other sections. Compact layouts hide the
plate and retain the navigation ledge.

Each station's sign colour now reaches its wall and shelf edge. The Web cabinet
has pink and cyan highlights on separate rails; the floor combines restrained
colour washes and a cyan-to-pink grid. Reflections belong to receiving surfaces.
The existing text scale, contrast and lamp behaviour are preserved.

## Checks

- Svelte check passed with zero errors and warnings in the shared app and the
  isolated build. Production build, scoped Prettier and diff checks passed.
  Existing Zod annotation notices remain non-fatal.
- English and German layouts passed from 320px phones through 7680px desktops,
  including short landscape and 200% root text. The room/footer cap, wheel
  position, exclusive drawers, nine project links, typography, reduced motion
  and departure snapshots were checked. No horizontal document overflow appeared.
- All seven preview states passed hover and keyboard checks in both languages.
  The checks covered mixed input, unchanged scene dimensions, SVG bounds,
  native Enter navigation, restored focus and preview, mobile single-tap links,
  SSR defaults and native links. Animated snapshots retained the selected artwork
  and valid local SVG references.
- The mount clears the wall frames horizontally, does not intercept pointer
  events, disappears on the home hub and stays hidden on the compact ledge.
- Desktop, ultrawide and phone screenshots were reviewed, including every
  project illustration, the mount and the studio floor. The production preview
  also passed the interaction, SSR and snapshot checks. Browser checks used
  installed Chromium; other engines were not tested.

## Preview and provenance

The shared development app remains <http://localhost:5173/projects>. The isolated
production preview at <http://localhost:5191/projects> contains this refinement;
German routes use `/de/projects`. The shared dev server stayed running. Only the
previous isolated preview was replaced, and no deployment was made.

The build directory is `/tmp/lupe-responsive-validation-1riwphjz`, archived from
`072d611b5e7edab290d05ebde708d0ef75fd292e` with the 13 changed source files overlaid.
Their bytes match `f8845a6`. Concurrent CV work is excluded from this build.
Dependencies use the existing installation; Paraglide uses `url`, `cookie`,
then `baseLocale`.

Temporary artifacts live in `/tmp/lupe-workshop-responsive/`: `previews.mjs`,
`verify.mjs`, `capture.mjs`, the individual `first-*` preview images, the final
studio and room captures, `build.log` and the exact file list in `overlay.json`.
