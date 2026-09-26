# ADR-0007: Handcrafted Projects scenes with HTML, SVG and CSS

- Status: accepted
- Date: 2026-09-27
- Scope: Projects overview, project media views and the LuixBits workbench

## Context

Projects should feel like a neon video shop: browse labelled shelves, choose a
tape, then enter its project through a camera zoom and CRT opening animation.
LuixBits gets a personal room within that world, a workbench after midnight.
The owner wanted recognisable objects, useful interactions and details from his
actual work. He also asked for fewer decorative labels, consistent text sizes
and compact video choices.

The design needs to work through ordinary URLs, localized routes, keyboard
navigation and touch. Artwork must leave room for readable content and usable
video controls.

## Decision

Build these scenes from semantic HTML, original SVG artwork and CSS materials.
Use CSS for local motion and the Web Animations API for the Projects route
transition. These scenes add no rendering or animation framework. This decision
extends [ADR-0003](0003-hybrid-rendering.md) without changing the site's existing
navigation and decorative rendering architecture.

1. **Give the content a physical home.** Categories become shelves, projects
   become tape jackets, video choices become cassettes, and media plays inside a
   CRT. A room includes its wall, supports, lighting and footer. Objects should
   appear to rest on or attach to something.
2. **Keep each action in a native control.** A project tape and the remote back
   control are links. Each video cassette, lamp and watch is one button. SVG
   supplies the casing; HTML supplies the accessible name, focus and action.
   Descriptive text stays in HTML at the shared `--fs-*` sizes.
3. **Make personal details specific.** The purple Dygma Defy, NixOS sticker and
   floor-plan sketch connect to the channel's subject. Clicking the Casio loads
   its episode. Its face reads the owner's requested `4:20`; the episode's real
   runtime remains separate metadata. The coffee ring and small photo prints
   give materials character without adding explanatory labels.
4. **Tie effects to application state.** TV power drives the blue wall spill.
   Lamp state drives the warm desk, paper and keyboard light. Each receiving
   surface gets its own treatment, allowing paper text to remain crisp and
   keyboard light to follow the actual silhouette.
5. **Keep motion bounded and purposeful.** The entrance establishes the room;
   hovering a cassette pulls it slightly forward and turns its reels once.
   Titles and runtimes remain visible. Reduced motion keeps navigation,
   selection and the finished composition while removing animated movement.
6. **Scope the room to its route.** The root layout matches the delocalized
   `/projects/my-channel` path and selects its wall and footer. The other
   Projects views retain their scenery. The Projects layout stays mounted
   across shelf/detail navigation so it can coordinate the zoom and CRT reveal.
7. **Review the rendered result in small passes.** Establish composition and
   silhouette, then add materials, state, motion and a few personal details.
   Compare states in a browser and revise from specific owner feedback. Save
   useful milestones so a visual direction can be revisited.

## Alternatives considered

| Approach                                     | Reason for the current choice                                                                                                                                     |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A full 3D scene                              | The illustrated viewpoints and shallow movement can be built with SVG and CSS. A 3D scene would add asset, camera and interaction work for this scope.            |
| One flattened room image                     | Individual controls, responsive layout and surface lighting need independent elements. Raster images remain useful for real thumbnails and the channel avatar.    |
| Flip the cassette to reveal details on hover | The owner also allowed a simpler interaction. A slight lift and turn keeps browsing information visible and makes one tap sufficient on touch devices.            |
| Reduce text size to fit more tapes           | The shared type scale is an owner constraint. We reduced padding, reel-window height and rack spacing, then moved thumbnails onto the side as small paper prints. |

## Consequences

The artwork can be changed independently of content and player logic. Real
links, readable page content and an external YouTube link remain available
without JavaScript; local player and object interactions require hydration.

The design contains bespoke geometry and lighting that need visual review.
Compilation cannot establish whether a light ends abruptly, a case looks flat,
or a transformed object crosses a phone's edge. Repeated components also need
care around SVG definition IDs, stacking contexts and focus outlines.

Use the [scene-building guide](../handcrafted-scenes.md) for the implementation
recipe and review checklist. The accepted workbench began at `9574d64`; lighting
and personal objects were refined in `9b0b8b0`, and compact cassettes landed in
`54814da`. Those commits record this design, not a requirement to copy its theme
into every future scene.

## Follow-up: workshop overview, 2026-09-27

The [after-hours workshop plan](../plans/projects-after-hours-workshop.md)
replaces the overview's rental shelves with a studio entrance and a compact
software display counter. The owner selected this direction and requested a
larger, more expressive room during implementation. The finished composition
uses a full doorway, larger printed cover illustrations, a mounted neon sign,
smoked glass, wood and a tiled threshold. The existing channel room remains the
destination behind the door.

The technical decisions above remain in effect. Semantic project links keep
their URLs and return anchors. HTML, SVG and CSS provide the room without a new
renderer. New objects live in `lib/projects/overview/`; the root layout selects
the overview wall, navigation ledge and footer separately from the workbench and
other project detail pages. All four existing projects appear once; empty rental
slots have been removed.

Navigation now measures the doorway aperture and translates as well as scales
the departing room. Case selection lifts its software case. Snapshots preserve
inherited theme variables and remap SVG IDs while remaining inert and hidden
from assistive technology. The CRT and room light wait for navigation completion
instead of using separate copies of the route duration. Returns restore scroll
and the originating link after SvelteKit's queued fragment focus.

Composition, artwork, motion, EN/DE layouts, reduced motion and SSR fallbacks
were reviewed in Chromium. See the
[implementation review](../reviews/projects-after-hours-workshop-2026-09-27.md)
for scoped commits, exact checks, the production preview and the limits of the
mocked player tests. Final owner review is still pending; the original accepted
workbench and this ADR's historical context are preserved above.
