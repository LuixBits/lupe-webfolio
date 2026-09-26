# Building handcrafted scenes

This guide records how the Projects shelves and LuixBits workbench were made.
Use it with [ADR-0007](adr/0007-handcrafted-projects-scenes.md) and
[HANDOFF.md](../HANDOFF.md). Reuse the construction and review methods; choose
objects and materials that belong to the next page's content.

## Start with content, objects and actions

Write a short scene description before drawing. For LuixBits it was a chunky
CRT on a wooden workbench, with a plum wall, mounted neon sign, warm lamp and
cool screen light. This gives the objects a shared setting and limits arbitrary
decoration.

Map the content and interactions before adding detail:

| Content or action                     | Object                                      | Implementation to inspect                                                                              |
| ------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Categories and project links          | Labelled rental shelves and tape jackets    | [Projects overview](../src/routes/projects/+page.svelte)                                               |
| Images, videos and demos              | CRT with real HTML media behind its opening | [CounterTv](../src/lib/projects/CounterTv.svelte), [CrtCabinet](../src/lib/projects/CrtCabinet.svelte) |
| Choose an episode                     | Cassette in a rack                          | [VideoCassette](../src/lib/projects/workbench/VideoCassette.svelte)                                    |
| Return to the project's shelf         | Remote with a back key                      | [BackToShelf](../src/lib/projects/BackToShelf.svelte)                                                  |
| Change the room's light               | Desk lamp with a switch                     | [DeskLamp](../src/lib/projects/workbench/DeskLamp.svelte)                                              |
| Load the watch episode                | Casio showing `4:20`                        | [CasioWatch](../src/lib/projects/workbench/CasioWatch.svelte)                                          |
| Explain the channel and find its code | Paper sleeve, NixOS sticker and GitHub link | [ChannelPlayer](../src/lib/projects/ChannelPlayer.svelte)                                              |

An object can be purely decorative when it establishes the room or relates to
the content. The keyboard and floor plan do this. Useful details take priority
over extra badges, serial numbers, channel codes or repeated tags.

## Draw the object in layers

1. Establish the silhouette and support. The CRT needs cabinet depth, a thick
   bezel and feet. A cassette needs a shell and shelf underneath it. A neon
   sign needs mounting points. Fix these proportions before drawing scratches.
2. Add the material with a base fill, a few gradients, an edge highlight and a
   contact shadow. Repeating gradients make vents, grip ridges and wood grain.
   Low-opacity texture adds variation without competing with the content.
3. Add a few physical details: screw heads, springs, a cable, paper edges or a
   coffee ring. Small rotations work for attached prints and stickers. Keep
   important controls and text easy to recognise.

Use inline SVG for shaped objects, CSS for layout and material layers, and
HTML for text and controls. The workbench's SVGs are original drawings. For a
recognisable product, inspect a real reference first: the
[Defy drawing](../src/lib/projects/workbench/WorkbenchKeyboard.svelte) follows
its split silhouette, column stagger, thumb clusters and palm pads. Its
current charcoal keycaps are an illustration choice; the requested shell is
purple.

Use actual logos when appropriate and record their source and licence beside
the asset. The [NixOS artwork note](../static/media/projects/luixbits/README.md)
is the example. Keep external photos separate from original SVG artwork.

Give SVG geometry a stable `viewBox`. Reuse shapes with snippets, `<defs>` and
`<use>`. Prefix definition IDs when an object can appear more than once; the
CRT receives an ID derived from the project slug. Use `drop-shadow` when the
shadow should follow an object's outline and `box-shadow` for a rectangular
surface or inset edge.

The lamp switch is drawn inside the same SVG as its base. Its translated,
rotated and vertically compressed group shares the base's perspective. This
replaced a flat HTML badge that appeared to float above the foot.

## Light each receiving surface

In [ChannelPlayer](../src/lib/projects/ChannelPlayer.svelte), `powered` is bound
to the CRT and `lampLit` to the lamp. The room exposes lamp state as one
inherited CSS value:

```css
.workbench-scene {
	--lamp-glow: 0;
}
.lamp-lit {
	--lamp-glow: 1;
}
.paper-light {
	opacity: var(--lamp-glow);
	transition: opacity 500ms ease;
	pointer-events: none;
}
```

Each surface uses that state with different geometry:

| Surface             | Treatment                                                                          |
| ------------------- | ---------------------------------------------------------------------------------- |
| Wall behind the CRT | Broad, blurred blue radial gradient whose opacity follows TV power.                |
| Wooden desk         | Warm radial gradient, bounded by the desk, with `mix-blend-mode: soft-light`.      |
| Paper               | Its own warm radial gradient behind the ink, fading into an even cream base.       |
| Keyboard            | A warm SVG gradient clipped to both halves' silhouettes and blended with `screen`. |

Use `position: relative` and `isolation: isolate` on a surface when its local
lighting and shadows need a controlled stack. Decorative layers use
`pointer-events: none`; negative `z-index` layers stay inside that local stack.
Opacity transitions stop under reduced motion.

The first desk glow sat behind opaque objects, so it barely affected the paper
or keys. A later wash over the whole composition also affected the text. The
final separate layers make the surfaces respond while leaving the ink clear.

Compare lamp-on and lamp-off screenshots. Check that the light visibly changes
the nearby objects, fades through several transparent gradient stops and stays
inside the surface. The original negative left inset leaked light beyond the
desk. Avoid hard rectangular light boundaries and a centre fold that darkens
half the paper; the owner rejected both. Physical edges and cast shadows can
remain sharp.

The [wall](../src/lib/projects/workbench/WorkshopWall.svelte) spans the full
page through an absolute layer inside the room. A viewport-sized backdrop can
leave a visible cutoff below the fold. The
[cable footer](../src/lib/components/footer/FooterWorkbench.svelte) completes
the room at the bottom, including the whole plug.

## Coordinate motion with state and navigation

Use a small number of deliberate movements. The channel's props have no idle
animation loops; the overview retains its existing gentle neon hum.

| Event                          | Accepted implementation                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Enter a project from its shelf | Zoom from the clicked tape's position over 640ms. The new page settles over 470ms after a 170ms delay.     |
| Open the CRT                   | Two dark shutters retract from a bright horizontal beam. Power-on takes 820ms; selecting media uses 460ms. |
| Arrive during the shelf zoom   | Delay the CRT opening by 640ms so the two movements have a readable order.                                 |
| Toggle the lamp                | Fade the receiving-surface light over 500ms.                                                               |
| Hover or focus a cassette      | Lift and slightly turn the case over 280ms; turn its reel hubs once over 450ms.                            |

These timings describe the accepted version. Tune the next scene in the browser
and preserve the relationship between its movements.

[PowerOn](../src/lib/projects/PowerOn.svelte) is an overlay with no pointer
events. It starts after mount, removes itself when finished and leaves the
complete image visible for SSR and reduced motion.

The [Projects layout](../src/routes/projects/+layout.svelte) coordinates route
motion through `onNavigate`. It measures the selected tape for the zoom origin,
keeps a fixed visual clone of the departing shelf, then animates the arriving
page. The clone is inert and hidden from assistive technology; its IDs and tape
lookup attributes are removed. A sequence counter rejects stale completions.
Cleanup cancels animations and removes the clone on interruption or unmount.
Return navigation restores focus to the source tape.

The `projectNavigation` context exposes `moving` so the CRT and room can defer
their reveals. Keep the layout alive between project routes. In the
[root layout](../src/routes/+layout.svelte), delocalize the URL before selecting
the room, and scope its wall, palette overrides and footer to that route.

## Keep the interactions ordinary underneath

One physical object should expose one clear control. The remote is one link;
the lamp, watch and each cassette are individual buttons. Drawn screw heads,
reels and the small switch icon are decorative, not additional hit targets.

Use visible focus outlines and localized accessible names. Toggle/selection
buttons expose `aria-pressed`; cassettes point to the player with
`aria-controls` and associate their runtime with `aria-describedby`. The whole
object responds to touch. Pointer hover effects are limited to devices that
support hover, and keyboard focus gets equivalent feedback.

Loading and playing are separate states. Selecting a tape sets the video,
powers the TV on and shows its poster. Only Play creates the embed. Eject or
power-off removes it. Selecting the watch episode brings Play into view and
focuses it; a tape selection also does this when the player is outside the
viewport. The external video link provides a useful path without JavaScript.

The CRT casing has an actual opening. Its HTML screen is positioned as
percentages of the `660 / 510` shell, with media fitted inside that screen.
Images use `object-fit: contain`; iframe dimensions use the screen container's
width and height with the source aspect ratio. The cabinet shape must not crop
provider controls. The ink Play arrow measures the real button through a
`ResizeObserver`, so it keeps pointing at the control after a resize.

## Fit the content without shrinking its text

Use the shared sizes in [app.css](../src/app.css): `--fs-hero`, `--fs-h1`,
`--fs-h2`, `--fs-h3`, `--fs-body` and `--fs-small`. Typography communicates
hierarchy; labels should not multiply merely to make an object look technical.

The compact cassette revision reduced shell padding, reel size and rack gaps.
It moved the thumbnail from the reel window to a small, rotated paper print on
the lower-right edge. The titles kept their original size and full wording.
Reserve room for the print's rotation, shadow and slight overhang.

Use `minmax(0, ...)` grid tracks and `min-width: 0` on children that must shrink.
Let text wrap. Rearrange objects on phones: the Defy gets a row beneath the
lamp and watch. Check transformed bounds as well as normal layout bounds; the
Casio's rotation originally caused overflow at 320px. Do not use horizontal
clipping as proof that the objects fit.

## Work and review in small passes

Use a small visual study when the shape or movement is unclear. The CRT cabinet
came from an approved motion study; its artwork was carried into the portfolio
with real content, playback controls and routing. Once that direction works,
continue in the actual page so the surrounding layout remains part of the review.

1. Read the handoff and inspect the live page, shared tokens and Git status.
   Identify files being edited by another collaborator. Save a rollback point
   before changing an accepted visual direction.
2. Build composition and silhouettes, then material detail, interactions and
   light. Keep actual content in [projects.ts](../src/lib/content/projects.ts)
   and UI messages in `messages/en.json` and `messages/de.json`.
3. Run a stable preview and inspect it in a real browser. For this session the
   command was `npm run dev -- --host 127.0.0.1 --port 5189 --strictPort`.
   Choose an available port for a future session.
4. Capture the whole page and close-ups of the changed object. Compare useful
   states such as lamp on/off, TV on/off, cassette resting/hovered/focused and
   different video selections. Fix the specific defect before adding detail.
5. Run the relevant checks, review the scoped diff and save the accepted
   milestone. Include the preview URL and what was verified in the handoff.

Use an isolated checkout or preview copy when concurrent work needs separate
generated output. Ensure it contains the exact source changes being reviewed.
Build in a separate validation copy when necessary. Rebuilding beneath a
running `vite preview` caused stale asset references and a failed dynamic import
during this work; restart that preview after building, or use the dev server
for iteration. Avoid replacing another collaborator's preview or files.

For UI changes, `npm run check` must report zero errors and the production build
must pass. Run formatting checks on the files being changed. A documentation
edit needs documentation checks, not another browser or application build.

Browser review should cover the relevant rows below:

| Check                   | What to look for                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop, tablet, phones | Review at 1440, 768, 390 and 320 CSS pixels. Inspect the full scene and individual controls; check document, body and object bounds for overflow. |
| Text                    | Keep full titles, readable contrast and the declared size tokens. Include German labels.                                                          |
| Mouse, keyboard, touch  | Inspect hover and real Tab focus. Verify Enter/Space and one-tap selection. Do not require hover to reveal essential information.                 |
| Reduced motion          | Disable the zoom, CRT overlay, cassette movement and light transitions while preserving visible content and state changes.                        |
| Media state             | Load without playing, explicitly play, eject, switch video, switch power and activate the watch. Verify focus and the selected cassette.          |
| Routes and fallback     | Direct-load the channel, enter from the shelf, return to its tape, try another project, switch locale and inspect the page without JavaScript.    |
| Failures                | Check browser exceptions and asset failures. A successful compile does not verify the scene's appearance.                                         |

This session used an ad-hoc Playwright harness with system Chromium. On this
host the executable was `/home/luix/.nix-profile/bin/chromium`; check the browser
available in the next environment. Scripts, screenshots and isolated copies
under `/tmp` are session artifacts, not a committed test suite. Recreate the
runner as needed from the checks above. Tests that mock YouTube verify embed
creation, selection and focus, not real provider playback.

The docked radial menu can still overlap content on narrow screens. That is an
existing site-wide limitation recorded in the handoff, not a cassette fix or a
reason to accept new overflow.
