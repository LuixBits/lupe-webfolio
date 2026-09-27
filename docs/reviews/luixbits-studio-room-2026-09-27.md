# LuixBits studio: the room behind the doorway

Implementation: `d9dbeae`.

The owner asked for the LuixBits studio to match the expanded Projects room,
with more Linux and Neovim decoration. This refinement applies to
`/projects/my-channel` and `/de/projects/my-channel`.

## Composition

The studio now uses the overview's 2000px room limit and perspective side walls.
Violet plaster, ceiling trim, cyan and pink light, a grid floor, desk supports,
stool and plant make the player and desk part of one furnished room. The outer
walls retain their framed jokes and the clickable duck. The LuixBits title uses
the shared SVG neon alphabet with a real HTML heading.

Two framed prints feature Tux and the Neovim mark. Vim keycaps and `:wq`, cloth
books, a development board on a stand, and a tin of keycaps with a NixOS sticker
add personal details. A sunset print echoes the one visible through the doorway.
The downloaded artwork is local, with attribution and licensing recorded in
[the asset README](../../static/media/projects/luixbits/README.md).

The gallery hangs beside the player at a room width of 110rem or more. From
65rem it occupies the upper wall; below that it follows the programme and sits
above the desk. At very large text settings its prints stack. The player and
tape rack use two columns from an 80rem room width. Container queries follow
the available room, while navigation clearance follows the wheel's viewport
breakpoint. This prevents the wheel from covering Power or playback controls.

The illustration is HTML, SVG and CSS. It adds no renderer, font download or
continuous animation. Captions use the existing body token, and keycap/book
symbols are decorative SVG lettering. The existing TV and lamp still light
their receiving surfaces. Player activation, cassette selection, watch shortcut,
external links and localized returns retain their existing behavior.

## Validation

- `npm run check`: zero errors and zero warnings.
- `npm run build`: passed with adapter-node.
- Scoped Prettier check and `git diff --check`: passed.
- Chromium layout checks: 36 English/German combinations, from 320px to 5120px,
  including short landscape screens and 200% root text. Checked room/footer
  centering, overflow, allowed typography, image loading, unique IDs, artwork
  clearance around the return link, and pointer access to TV controls near the
  fixed navigation wheel.
- All four tapes select without loading an iframe. Explicit Play mounts the
  selected episode; Eject, selecting another tape and Power remove it. The
  watch selects its episode and focuses Play. Keyboard lamp activation updates
  the paper and desk lighting. EN/DE return navigation restores the Studio link.
- SSR checks with JavaScript disabled retain the heading, four cassettes,
  external video link and native return link.
- Normal-motion doorway navigation retains inert snapshots with valid SVG
  references and unique IDs. Return navigation restores focus, and re-entering
  the studio does not carry a playing iframe. New decoration has no idle motion.
- The production preview passed the same EN/DE interaction and SSR checks.
  The existing overview's seven previews, hover/focus precedence, keyboard
  returns, navigation mount, phone single-tap links and departure snapshots
  also passed. No browser exceptions were recorded.

Provider responses in interaction tests are mocked. These checks verify local
activation, selection and cleanup; they do not establish real YouTube playback.
Visual review used the actual local SVGs, fonts and video thumbnails.

## Build and review artifacts

The shared development server remains at `http://localhost:5173`. The production
preview at `http://localhost:5191` runs an isolated build from
`/tmp/lupe-studio-validation-tupc3u8b`. It starts from `8533c4f` and overlays the
nine explicitly listed studio source and asset files, excluding concurrent CV
work. `/tmp/lupe-studio-room/overlay.json` records their SHA-256 hashes.

Screenshots, temporary browser checks, build output and production logs are in
`/tmp/lupe-studio-room/`. The directory contains before/after desktop and phone
captures, `verify.mjs`, `interactions.mjs`, `check.log` and `build.log`.
The published site has not been deployed by this work. Final visual approval
remains with the owner.
