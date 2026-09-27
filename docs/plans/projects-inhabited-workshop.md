# Projects: an inhabited workshop

Date: 2026-09-27. Status: implemented in `/projects`; final owner review pending.
This replaces the spatial direction of the
[first workshop plan](projects-after-hours-workshop.md). That implementation is
a working baseline, but the owner rejected its scale and simplicity and asked
for a whole-room experience comparable to About.

The Svelte implementation now follows this plan, including the owner’s later
request to restore magenta, cyan and violet from the vaporwave hub. Use
<http://localhost:5173/projects>. The former standalone study redirects to that
route; project links and return navigation stay in the app. See the
[implementation review](../reviews/projects-inhabited-workshop-2026-09-27.md) for
validation and remaining review limits.

**Build a room someone appears to have just stepped out of.** Rafters cross the
top of the browser. Rain falls beyond a large window. A studio glows through an
open door. An unusually long workbench holds distinct objects for the projects.
Cables descend behind it; drawers, a stool, a rug and a resting cat finish the
room. Scrolling reveals more of this same place. Light and a few small actions
connect its parts.

## Read and look first

- [Integrated Projects room](http://localhost:5173/projects). The former
  [composition study](studies/projects-inhabited-workshop.html) redirects here;
  its original drawing is preserved in commit `5e96a49`.
- [HANDOFF](../../HANDOFF.md), [ADR-0007](../adr/0007-handcrafted-projects-scenes.md)
  and the [scene-building guide](../handcrafted-scenes.md).
- [About page](../../src/routes/about/+page.svelte),
  [TreeLayer](../../src/lib/garden/tree/TreeLayer.svelte) and
  [LivingLine](../../src/lib/garden/LivingLine.svelte).
- [CV](../../src/routes/cv/+page.svelte) and
  [PondScene](../../src/lib/water/pond/PondScene.svelte), which are under active
  development in the shared checkout. Study their composition without editing
  their work.
- [LuixBits player](../../src/lib/projects/ChannelPlayer.svelte),
  [desk lamp](../../src/lib/projects/workbench/DeskLamp.svelte) and
  [Hobbies](../../src/routes/hobbies/+page.svelte).

The original study established the HTML/SVG composition. Its objects now live
in Svelte components with the actual project content, localized navigation and
shared type scale. Review controls and explanatory study notes are absent from
the application.

## 1. What the comparison shows

About works because a single tree owns the page. Its canopy occupies the upper
edges. The trunk winds between the content; branches grip the papers. Scrolling
reaches grass, animals, soil, roots and an ant colony. The footer ends that
descent. Several discoveries reward attention without being necessary to read
the biography.

The compact baseline was about 1081px tall at 1440 × 1000. Its illustrated
wrapper is 1152px wide, starts at x=236 and ends at x=1388. Almost everything
belongs to a two-column rectangle. The wheel has clearance, but the room does
little with the space around it. A thin floor strip finishes the composition
before the visitor has had much to explore.

| Observed technique                                                                     | Apply it to Projects                                                                                 |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| About has one continuous trunk and an atmosphere that changes over the page.           | A continuous wall, conduit and workbench connect the entrance, project stations and floor.           |
| Branches attach to the actual positions of content.                                    | Shelf brackets, leads and light pools meet the measured project objects, including after text wraps. |
| About's background, main forms and occasional foreground details have separate layers. | Use rear architecture, solid furniture and a sparse foreground layer for depth.                      |
| The ground line changes both materials and inhabitants.                                | The bench edge opens a lower view of legs, drawers, cables, stool, rug and room companion.           |
| The deer, squirrel and treasure chest have distinct responses.                         | Give the workshop a few distinct discoveries: a responsive lamp, a cat and a sketch drawer.          |
| CV uses a continuous sounding line and surface-to-depth atmosphere.                    | Let one visible cable route and a shift from window blue to warm wood lead the eye through the room. |
| The channel's lamp affects the desk, paper and keyboard.                               | Each light must reach nearby surfaces and objects, with a visible difference when switched.          |
| Hobbies turns a familiar object into a usable media interaction.                       | Project objects remain obvious links; room toys get separate, clearly focusable controls.            |

These are lessons from the local rendered pages and source, not claims that
every aspect of those pages has passed a fresh accessibility or regression
audit. A transient generated-types error appeared on the shared dev Projects
preview during concurrent work; the clean isolated production capture was used
for its visual comparison.

### Decisions that change from the first plan

| Earlier constraint                                              | New decision                                                                                                                                          |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fit all four project entrances into the first 1440 × 1000 view. | The first view establishes the room and its main entrance. Other projects can continue below it. Category navigation keeps them directly reachable.   |
| Put all software into compact instances of one case.            | Give each current project a different physical silhouette and a substantial station. Share content/link behavior, not a compulsory rectangular shell. |
| End with a short threshold.                                     | Give the floor a complete closing scene, connected to the bench and wall.                                                                             |
| Use a bounded room wrapper with a mostly atmospheric surround.  | Extend architecture to both viewport edges and through the footer. Constrain text independently.                                                      |
| Keep life mainly in hover and route motion.                     | Add weather, localized ambient life, stateful lighting and two optional discoveries.                                                                  |

Keep the current work's native links, content source, wheel clearance,
localization, reduced-motion behavior and reliable entry/return lifecycle.

## 2. Spatial direction

Use an illustrated cutaway interior with shallow perspective. The viewpoint
starts high enough to see the rafters and far wall, then the scroll exposes the
work surface and the space beneath it. This is a continuous editorial view of a
room; the camera does not need to obey a single photograph's perspective.

The main forms should be unmistakable with detail, texture and animation
disabled. A doorway needs a recess and an open panel. A workbench needs a top,
front edge, brackets or legs, and weight. A window needs an opening into an
outside space. A project needs a recognisable object and a readable label.

```text
                 RAFTERS / JOISTS / ROUTED WIRE
  wall return       mounted PROJECTS sign        window return
  ┌──────────────────────────────────────────────────────────┐
  │                 soft pink wall light                     │
  │                                      RAINY NIGHT         │
  │    recessed studio                   WINDOW + SILL        │
  │    LuixBits doorway                                      │
  │    ╔══════════════╗                  four-world model    │
  │    ║ real room's  ║                  Lupe Webfolio        │
  │    ║ silhouette  ║            ━━━━━━━ shelf ━━━━━━━       │
  │    ║ beyond      ║                 cable / lamp arm      │
  │    ╚══════════════╝                                      │
  │        light across plaster and wood                     │
  │  ┌──────────────── pegboard ──────────────────────────┐  │
  │  │                                                       │
  │  │     Orbit apparatus          Scrum Poker table         │
  │  │     under curved glass       cards, mat, notes         │
  │  │     project label            project label            │
  │  └━━━━━━━━━━━━━━ LONG WORKBENCH ━━━━━━━━━━━━━━━━━━━━━━━┘  │
  │      drawers       legs / crossbrace       hanging leads  │
  │                    pushed-back stool                     │
  ├────────────────── skirting / floor join ──────────────────┤
  │       patterned rug       resting cat          plant     │
  │             cable finishes at its plug                    │
  └──────────────── quiet integrated footer ──────────────────┘
```

The drawing is a composition guide. Exact positions follow real HTML content
and translated text. They must not become a fixed collection of percentage
coordinates for labels and controls.

### Scale and use of space

- Architecture spans the viewport. The wall continues behind the wheel; only
  actionable objects and text avoid the wheel's reserved area.
- Start desktop composition studies around 2600–3200px of room height at
  1440px width. The current study is intentionally generous. Adjust after
  putting the real wheel, type and controls into it; this is not a minimum
  height to pad toward.
- On large monitors, widen the room, bench, window and spacing between objects.
  Keep project descriptions around 28–45 characters per line. Large screens
  should reveal more architecture rather than ever-wider paragraphs.
- Give the doorway roughly two fifths of the useful upper-room width and a
  clear human-scale silhouette. Keep the window separate from the studio so
  both the exterior and adjacent room imply space beyond the page.
- The main work surface spans most of the viewport. Its edges and legs bridge
  the project areas instead of wrapping each object in its own panel.
- Leave some quiet plaster around a light beam or doorway. Empty areas should
  help explain distance, illumination or shape. Broad flat margins that do
  none of those jobs should be redesigned.

## 3. The visitor's journey

### Arrival: the room is already awake

The existing hub transition lands inside the workshop. The Projects sign
hangs from visible mounts beneath the rafters. The window and studio establish
the cool light sources; one work lamp establishes a warmer pool. The full room
exists beneath the existing reveal, and all navigation works immediately.

The initial view should include a substantial part of the doorway and enough
of the workbench or its connecting furniture to show that the room continues.
Do not spend a whole first screen on ceiling or typography. Category navigation
offers YouTube, Open Source and Web without adding a second navigation system.

### The upper wall: a studio and a model

The LuixBits doorway is cut into the wall. Its jamb, lintel, open panel and
threshold share that wall's perspective and light. Through it, show the chunky
CRT, lamp and a suggestion of the purple keyboard in the accepted channel
room. Use a decorative SVG glimpse; no player is mounted here.

Hover or focus opens the panel a little more and broadens the same spill on
the nearby plaster and floor. The HTML title and action remain still. One tap
or Enter follows the project link.

Across the room, under the window, Lupe Webfolio becomes a tabletop model of
its four worlds. A tree, water, miniature neon structure and a ringed planet
sit on a common wooden base. The actual radial identity is visible in the
base's four-part organization. Fine details can respond to the model's hover
or focus: a leaf stirs, a reflection moves, a small star brightens. The whole
model and its label lead to Webfolio. Its little worlds are decorative, so
they do not create four nested destinations or a second radial menu.

### The work surface: two different experiments

Orbit Toy sits in a substantial glass apparatus with a metal base. A sparse
particle cube and a ring occupy its interior. This is original illustrative
cover art, not a running embedded build. On hover/focus, give it one bounded
response; when idle, any movement is slow and limited. Its existing tagline
still identifies it as a sample interactive build.

Scrum Poker occupies a broad angled mat with a small fan of cards, a pencil
and a few unlettered planning slips. Its cards settle or spread slightly when
the project link receives hover/focus. Leave the title and description level.
Retain the sample disclosure in the detail page, and avoid adding invented
screens, team names, estimates or product claims to the scene.

Both stations rest on the same bench. They have different proportions and
silhouettes; shared support, light and materials make them belong together.

### Below the bench: evidence of someone working here

The bench has depth beneath it. Add a crossbrace, worn drawer faces, a stool
pushed partly out and a cable that reaches a real plug. A narrow basket can
hold blank paper rolls. A floor plant grows into the lower edge. The lamp and
window spill should reach the wood, stool and floor in different shapes.

A resting cat on the rug is the proposed room companion. This is a fictional
illustration, not a claim that Luix owns a cat. It breathes very slightly; on
activation it opens its eyes and moves its tail once. Its response stays local
and quiet. It never chases the cursor across text or controls.

The final footer sits in this floor scene. It should feel like reaching the
bottom of the room, in the way About reaches its seed.

## 4. Make the room respond as a whole

Three kinds of behavior keep the room alive: ambient conditions, responses to
attention, and explicit actions. Each has a different pace and a small scope.

| Element         | Resting state                                               | Response                                                                                    | Receiving surfaces or consequence                                                     |
| --------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Window          | Slow rain confined to the glass; a few distant windows lit. | Optional small drops merge or slide, without a global weather event.                        | Cool oblique bands across the wall and work surface; static floor reflection.         |
| Projects sign   | Steady legible neon with a very gentle local variation.     | Settles into the existing entrance sequence.                                                | Upper plaster, nearby metal mounts and top edges.                                     |
| Studio door     | Open enough to show the room and its destination.           | Hover/focus opens the drawn panel over about 220ms; activation enters.                      | Opening and spill widen together; threshold and jamb catch the blue.                  |
| Webfolio model  | Four worlds on one support.                                 | One small coordinated response on hover/focus.                                              | Contact shadow and soft highlight change without moving the label.                    |
| Orbit apparatus | Restrained particles or a slow ring; fixed casing.          | A bounded response on attention, then settle.                                               | Glass catches cyan; a small reflection reaches the metal base.                        |
| Scrum cards     | A readable still fan.                                       | A slight spread, then return.                                                               | Shadows follow the cards onto the mat.                                                |
| Work lamp       | Warm light on.                                              | A native toggle changes `lampOn`.                                                           | Pegboard, bench, paper edges, drawer fronts and the rug respond; text stays readable. |
| Cat             | Resting, with barely visible breathing.                     | Click, Enter or Space toggles awake/resting. Fine-pointer gaze is limited to the eyes/head. | One ear/tail response, no roaming or sound.                                           |
| Sketch drawer   | Closed; handle is visibly a control when focused.           | Opens a shallow tray and reveals a drawing derived from the existing floor-plan artwork.    | A small discovery on the same page, with no reward counter or made-up project.        |

Make the lamp, cat and drawer proper HTML buttons, outside project anchors.
Use localized names, pressed/expanded state and visible focus. The drawer can
use `aria-expanded` and an associated region. Its open state must not cover
project links or require precise pointer use.

Do not add a separate switch for every decorative object. Start with these
three optional controls and the four project destinations. A small, clearly
labeled motion control lets visitors pause ambient animation. Keep its wording
and placement useful; it is not another decorative control panel.

### Shared state and motion rules

The room owns a small state object: lamp state, paused motion, cat state,
drawer state and visible zones. Existing route `moving` remains the authority
for navigation and CRT completion.

- Lights start in a readable default state. Even with the lamp off, labels
  retain enough ambient light and contrast.
- Preserve room choices across overview/detail navigation within the Projects
  layout. A return should not unexpectedly turn the lamp back on or close an
  inspected drawer. Reload persistence is optional, not a prerequisite.
- Suspend ambient activity while the tab is hidden, its zone is offscreen, a
  route is moving, motion is paused, or reduced motion is requested.
- Limit simultaneous continuous activity to a few small areas: rain in the
  window, one project apparatus and the resting companion. Do not give every
  prop its own idle animation.
- Keep the wall, bench, text and page camera still while reading. No whole-room
  mouse wobble, scroll-jacking, forced camera path or automatic audio.
- Under reduced motion, keep a fully drawn room, immediate state changes and
  static focus feedback. The lamp, drawer, cat and links still work.

These numbers and timings are starting budgets to inspect, not claims of
measured performance or final choreography.

## 5. Layering, materials and lighting

Build five visual depths. Each exists for the whole composition rather than
being independently restarted around every project.

| Depth      | Contents                                                    | How it is built                                                             |
| ---------- | ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| Far        | Night beyond the window, recessed studio wall.              | Small clipped SVG scenes with static atmosphere and bounded local motion.   |
| Room shell | Ceiling, plaster, corners, conduit, window frame, skirting. | A viewport-wide background component and a few measured SVG connections.    |
| Furniture  | Door frame, shelf, main bench, drawers, legs and stool.     | Responsive structural components attached to the normal-flow project zones. |
| Objects    | Model, apparatus, cards, tools, paper and lamp.             | Individual SVG illustrations with semantic HTML links or controls.          |
| Near       | Plant leaves, a cable curl, rug edge and cat.               | Sparse foreground accents that avoid labels, focus rings and controls.      |

Use the existing plum, pink and cyan palette with more readable midtones:
smoky plaster, oak and walnut, warm cream, muted teal glass, worn aluminium.
Warm light should make the room feel occupied. Keep black for actual recesses
and contact shadows, rather than flattening every surface into darkness.

The window, lamp and studio are distinct light sources. Give each a constrained
mask on each receiving surface. Wood receives a broad warm pool; metal receives
a thin edge; paper receives a restrained base-color shift beneath its text;
glass gets a reflection. Occlusion under the bench helps explain its depth.

Include physical details that survive at their intended scale: a bent shelf
bracket, screws that meet the wall, a lead plugged into its apparatus, a worn
stool edge, a ring on the mat, one piece of tape holding a label. Texture comes
after the room reads correctly without it.

The study's broad window bands need softer masks and clearer occlusion in
production. The objects also need final contact shadows and more consistent
perspective. These are known next steps, not reasons to copy the study CSS
verbatim into the app.

## 6. Responsive composition and navigation

### Wide desktop

Keep the upper room asymmetric: a tall door on one side, window and model on
the other. The workbench below spans most of the viewport. Furniture can pass
behind the radial wheel; text and targets reserve its actual resting bounds.
The wheel should feel mounted within the same environment without changing
its established controls or hub behavior.

### Tablet and enlarged text

Reflow from two bays to one before labels are squeezed. Use content/container
conditions, not just a fixed device width. The shared bench may become two
connected lengths with one wall and cable continuing between them. HTML grows
with the translated text; decoration follows it.

### Phones

Keep the overview's normal-flow wheel ledge. Make it the upper beam or room
threshold so it belongs to the scene. After it scrolls away, no fixed wheel
obscures the project labels.

The order remains YouTube → Open Source → Web. Show a shorter doorway, then
the window and Webfolio model, followed by Orbit and Scrum stations at useful
widths. They become a vertical walk through the room, not compressed thumbnails.
The same conduit, wall seams and wooden supports continue down the page.

Rearrange the stool, cat and plant to fit the floor. Reduce peripheral prop
count, overhang and empty depth before shrinking useful illustration or text.
No horizontal panning is required. Check 320px and 200% text early.

## 7. Entering and returning

Preserve the existing route mechanism and fix its assumptions where the new
scale changes geometry. A richer world is not a reason to restart navigation.

- Every project has one localized native link with its existing URL,
  `id="tape-{slug}"` and `data-project-tape` hooks. `youtube`, `opensource`
  and `web` remain the category anchor IDs.
- The studio camera measures the actual aperture. The drawn door opens as the
  movement starts; the real channel arrives during the latter part. Keep the
  CRT and light tied to completion, not a second guessed timer.
- Measure a project object separately from its HTML label for the other three
  journeys. Move toward that object, with a restrained lift for the tabletop
  stations, then reveal the detail view. Do not scale an enormous room around
  a generic center point.
- Keep the world shell, furniture and local lights inside the scene that gets
  captured. Freeze any active ambient animation at its current appearance in
  the departure snapshot so moving rain or a rotating ring cannot jump back
  to its initial frame.
- Preserve inert snapshots, remapped SVG IDs, copied theme variables, cleanup
  on interruption, and the queued focus restoration after framework hash work.
- A remote or browser Back return restores the exact source object, room
  choices and overview position. A direct detail load still has a meaningful
  ordinary return path.
- Reduced motion uses immediate navigation. Category jumps and locale changes
  keep their current behavior without replaying a room entrance.

The accepted channel room remains a separate destination. Its personal
keyboard, Casio, paper, media selection, explicit Play, power, lamp and remote
must be regression-checked after integration.

## 8. Implementation structure

Keep semantic content in normal flow and build the scene around it. Reuse the
About technique of measured anchors for scenery that must connect across
components. Do not duplicate the entire TreeLayer implementation or create a
general-purpose scene engine.

Proposed ownership under `src/lib/projects/overview/`:

| Component or module                              | Responsibility                                                                                           |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `OverviewRoom.svelte`                            | Normal-flow room composition, scoped state/context, heading and complete scene wrapper.                  |
| `WorkshopArchitecture.svelte`                    | Full-width rafters, wall returns, skirting and background material/light.                                |
| `WorkshopConnections.svelte`                     | Measures a small set of `data-workshop` anchors; draws conduit, cross-zone leads and connected supports. |
| `NightWindow.svelte`                             | Exterior vignette, frame, rain, clipped reflections and visibility-gated motion.                         |
| `StudioEntrance.svelte` / `StudioGlimpse.svelte` | Remodel the existing entrance and glimpse to fit the architectural opening.                              |
| `ProjectStation.svelte`                          | Shared project link, title/tagline, accessible name and transition hooks; accepts distinct artwork.      |
| `WebfolioModel.svelte`                           | Four-world physical model and local response.                                                            |
| `OrbitApparatus.svelte`                          | Glass enclosure, original cube illustration and bounded motion.                                          |
| `PlanningTable.svelte`                           | Cards, mat and useful project label.                                                                     |
| `WorkshopBench.svelte`                           | Common furniture, lamp receiving surfaces and optional sketch drawer.                                    |
| `WorkshopFloor.svelte` / `WorkshopCat.svelte`    | Floor, connected ending, plant and companion control.                                                    |
| `workshop-state.svelte.ts`                       | Small shared state and motion policy, only if extraction makes ownership clearer.                        |

Use unique SVG IDs from `$props.id()`. Batch geometry reads after layout and
fonts settle; rebuild connections with `ResizeObserver` when anchors move.
Pointer responses can use a scheduled frame while receiving input, without
continuous document measurements. Static CSS and component-local geometry must
still produce a finished composition before measurement or JavaScript.

If rendering every decorative connection during SSR becomes complex, start
with coherent local supports and add the measured cross-room cables after
hydration. A missing dynamic cable should never mean a missing bench, project
or label.

Keep new text in EN/DE messages and every readable production label on the
shared `--fs-*` scale. The study uses standalone fonts and fixed visual
proportions only to explore the composition.

### Reuse and replace

Reuse `projects.ts`, the decorative CRT proportions, relevant FloorPlan art,
workbench materials, lamp lighting patterns, project navigation and the wheel
ledge. Redraw the overview's repeated case presentation into distinct stations.
Retire obsolete `ProjectCase`/`ProjectCover` usage only when their replacement
works. Additional future projects get supported, content-driven stations;
unknown entries can use a compact case fallback on another bench segment.

Do not add WebGL, a physics engine, autoplaying video or remote assets for this
scope. The proposed depth and interactions can be authored with the existing
HTML, SVG, CSS and Web Animations stack.

## 9. Build order and review gates

Each gate is a concrete review of the rendered work. Continue autonomously
through ordinary refinements; these are not new permission checkpoints.

| Phase                          | Work                                                                                                                        | Exit condition                                                                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 0. Protect the baseline        | Record status, save scoped milestone, identify concurrent CV/Footer edits, capture Projects and channel.                    | A rollback reference and an exact list of shared files exist.                                      |
| 1. Establish the room          | Replace the compact wrapper with full-width architecture, real content and broad furniture silhouettes. Keep detail sparse. | Top, middle and bottom all read as the same room at desktop and phone sizes, even with motion off. |
| 2. Build architectural depth   | Recess door and window; add ceiling, wall joins, bench top/legs, supports and floor. Resolve wheel clearance.               | Objects meet surfaces; no large arbitrary blank strips surround a central card grid.               |
| 3. Build the four stations     | Remodel studio, draw four-world model, Orbit enclosure and planning table. Use actual labels immediately.                   | All four silhouettes are distinct, project links remain obvious, sample content remains honest.    |
| 4. Connect light and materials | Wire the lamp; tune separate receiving surfaces, shadows, glass and window spill.                                           | Lamp-on/off and door-rest/focus captures visibly explain the light sources without hurting text.   |
| 5. Add bounded life            | Rain, model response, apparatus motion, cat, drawer and pause policy.                                                       | Each action has one local consequence; hidden/offscreen/paused/reduced states stop idle work.      |
| 6. Reconnect project journeys  | Measure new objects, freeze snapshots, preserve room state and return position.                                             | Studio, media project and no-media project all enter and return correctly.                         |
| 7. Refine every composition    | EN/DE, tablet, phones, wide monitors, short landscape and enlarged text.                                                    | Reflow preserves useful artwork, full labels and unobscured controls.                              |
| 8. Finish and record           | Browser acceptance, appropriate lifecycle checks, `npm run check`, isolated build, scoped milestones and documentation.     | The experience passes the visual rubric as well as technical checks.                               |

Build the macro composition before polishing tiny props. If phase 1 still
looks like a portfolio grid with a background, revise the structure then.
Additional texture and animation will not fix that failure.

## 10. What counts as finished

### Experience review

Capture three ordinary viewport views: arrival, working surface and floor.
View them beside About's canopy, middle and roots. Projects needs its own
equally clear sequence and depth; it does not need to match About's height or
copy its creatures.

- At arrival, the ceiling, wall, opening and furniture establish an interior.
  The page heading and main destination are readable without waiting.
- In the middle, substantial project objects share furniture and light. The
  content has a physical place rather than floating above unrelated art.
- At the bottom, the bench leads into a deliberate floor scene and footer.
- The wide edges contain meaningful room architecture. Labels keep a readable
  measure. The page works as a still illustration with all motion disabled.
- A short visit exposes the available projects. A longer visit discovers at
  least the lamp, cat and drawer, with distinct responses.
- Mobile retains the room's most recognisable forms and all destinations.
  It should not become a list of plain rectangular text cards.

### Technical and interaction review

| Review      | Required result                                                                                                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Viewports   | 1920/1440 desktop, 1024/768 intermediate, 390/320 phones and 844 × 390 landscape. Inspect actual body and object bounds, not only clipped document width.                                                                             |
| Text        | EN/DE, shared sizes, 200% text, long labels, contrast with lamp on/off, clear hover/focus.                                                                                                                                            |
| Content     | Four current projects appear once; categories and destinations survive; sample disclosures remain. Add a temporary extra content fixture to verify a supported extension, then remove it.                                             |
| Input       | Native links, modified/middle clicks, real Tab/Enter, Space on toys, one-tap touch navigation, no nested controls or hover-only information.                                                                                          |
| Room state  | Lamp, cat, drawer and pause work and survive a detail round trip; initial state is readable.                                                                                                                                          |
| Motion      | Offscreen and background pause, changed motion preference, quick repeated navigation, resize during entry and cancellation leave no orphaned animation or overlay.                                                                    |
| Return      | Remote, Back and Forward restore the correct object and expected scroll, including a lower bench station.                                                                                                                             |
| Fallbacks   | No-JavaScript view contains the complete static room and working links; reduced motion preserves controls without travel or shutters.                                                                                                 |
| Channel     | Existing props, tape selection, Play, eject, power, watch, lamp and back remote retain behavior. No iframe/audio from visiting or hovering the overview.                                                                              |
| Performance | Inspect a trace while idle and while scrolling. No continuous layout reads or animation work for invisible zones; no room-sized animated blur/filter repaint. Record findings instead of claiming a frame rate from appearance alone. |
| Build       | No unexpected browser errors or missing local assets; `npm run check` and production build pass in a separate validation copy.                                                                                                        |

Keep screenshots and a concise validation record. Mocked provider playback
tests only establish embed lifecycle, not that YouTube itself played a video.

## 11. Scope and delivery

This revision covers the Projects overview, its integrated floor/footer and
its connections to existing project detail pages. The rest of the site is a
reference and a regression boundary. The root layout, radial menu and shared
Footer need particular care because CV work is active in the same checkout.

Save milestones for room composition, project objects, light/life and route
integration. Update the handoff with the actual reviewed preview and results.
Record the final direction in ADR-0007 after implementation and owner review;
do not call this proposal accepted just because its technical checks pass.

The initial planning pass produced this document and the interactive study. The study
was viewed at 1440, 768, 390 and 320px; text/control bounds and its three toggle
behaviors were checked. Its light changes the receiving surfaces, the cat works
from the keyboard, and reduced motion leaves zero active animations. No browser
exceptions were observed in that check. Screenshots and the comparison script are temporary
session artifacts under `/tmp/lupe-workshop-room-plan/`. These checks do not
constitute production acceptance of the proposed redesign.
