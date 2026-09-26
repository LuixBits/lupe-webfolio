# Projects: the after-hours workshop

Date: 2026-09-27. The owner selected the after-hours workshop direction and
requested suitable transitions. This document is the design and implementation
plan for a future session. The application has not been changed for this plan.

## Read first

Read [HANDOFF.md](../../HANDOFF.md),
[ADR-0007: Handcrafted Projects scenes](../adr/0007-handcrafted-projects-scenes.md)
and the [scene-building guide](../handcrafted-scenes.md) before implementing.
ADR-0007 records the HTML/SVG/CSS approach, native controls and motion rules.
The guide explains how to construct objects, light each receiving surface,
preserve the typography and review the result in a browser.

This plan changes the overview's composition and its connection to the project
rooms. It carries those techniques forward. It does not require another
rendering framework.

## What is wrong with the current overview

Reviewed the local preview at 1440, 768 and 390 CSS pixels, including navigation
from Projects into LuixBits. The relevant overview, layout, content and channel
files matched the working repository at `c79db38`. These are observations of
that preview, not a production-site audit.

| Observation                                                                                                        | Effect on the page                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Four projects occupy twelve desktop slots. Eight slots are empty.                                                  | The composition suggests an unfinished catalogue. Most of its available width explains nothing.                             |
| YouTube and Open Source each contain one project, but each gets a full shelf about 380px tall.                     | The category structure dictates the height more than the content does. At 1440 × 1000, Web begins below the first viewport. |
| LuixBits is a 221 × 320px jacket, like every other entry. Its existing `featured` flag is unused by this overview. | The entrance gives little indication of the developed room behind it.                                                       |
| Floating statues, planets, a cassette, a browser window and a car frame the content.                               | The parts share colours but have no common physical setting. The grounded LuixBits room feels separate.                     |
| On phones, `.window` is hidden and tapes become flat text panels.                                                  | The artwork that distinguishes the objects disappears where space is tight.                                                 |
| The corner wheel overlaps content on narrow screens. Its scroll fade reduces opacity without removing the overlap. | Some project content competes with navigation. A new illustration alone cannot resolve this.                                |

The overview is roughly 1868px tall at the reviewed desktop size. Length itself
is not the problem: the longer LuixBits page uses its space for videos and a
personal workbench. Projects needs a composition that fits the actual inventory.

Keep the existing strengths: readable names, real links, the three category
anchors, the selected-object zoom, the remote back control and the CRT reveal.

## Directions considered

| Direction                                      | What it offers                                                                                                                              | Tradeoff                                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **After-hours workshop storefront — selected** | A small display counter for software and an open studio doorway into LuixBits. Wall materials, screen light and wood connect the two pages. | Doorway framing, room lighting and navigation clearance need careful composition.                            |
| Retro editing console                          | Physical media and illuminated controls arranged around a central monitor.                                                                  | A second prominent monitor competes with the channel's CRT. Controls can conceal ordinary project links.     |
| Small neon arcade                              | Each project gets a distinctive cabinet, with LuixBits as a screening room.                                                                 | Four cabinets would take substantial space. The game metaphor is also a poor fit for some software projects. |

The selected setting should feel like a small personal electronics workshop
still lit late at night. “After-hours workshop” is the working design name.
The actual page heading remains **Projects**.

## The proposed room

Use a nearly frontal view with shallow depth. A mounted Projects sign sits
above a compact room. The LuixBits doorway is the main feature on the left.
Open Source and Web occupy two levels of a display counter on the right.
A short tiled threshold and a skirting board ground the bottom of the page.

```text
                  PROJECTS
     Things I build, and the videos behind them.

 YouTube                         Open Source
 ┌─────────────────────┐         ┌──────────────────────────┐
 │ LuixBits            │         │ Lupe Webfolio            │
 │                     │         │ project case + cover art │
 │ glimpse of the CRT  │         └───────── shelf ──────────┘
 │ and warm room       │
 │                     │         Web
 │ channel tagline     │         ┌────────────┬─────────────┐
 │ Enter the studio →  │         │ Orbit Toy  │ Scrum Poker │
 └──── door threshold ─┘         └────── display counter ───┘

             skirting board / tiled threshold
```

This is a composition sketch. Exact proportions must be reviewed with the real
type, translations and wheel. Keep the DOM order YouTube → Open Source → Web;
the desktop layout and phone reading order should follow that hierarchy.

At desktop size, aim to expose all four project entrances in the first view at
1440 × 1000. This is a layout target, not a fixed-height container. Longer copy,
German text, text zoom and additional projects must expand the page normally.

### The LuixBits entrance

Make the doorway one native link to the localized `/projects/my-channel` URL.
Give it a visible LuixBits title, the existing tagline and **Enter the studio →**.
The category heading remains YouTube. The visible action explains that this
opens a page; a play triangle would suggest immediate video playback.

Inside the frame, draw a restrained glimpse of the room: the chunky CRT's
silhouette, the edge of its wooden support and warm lamp light. Use the same
shapes and material colours as the existing room. Keep this a decorative SVG
preview. Do not mount `ChannelPlayer`, embed YouTube or render a complete second
interactive workbench inside the link.

The door is already slightly open. Its hinge, frame depth and threshold make
the entrance recognisable before any interaction. The title and action remain
HTML outside moving artwork. On a phone, the entrance becomes a shorter, wider
framed view with the same readable text and a visible CRT silhouette.

### The other projects

Use compact software cases resting on real supports. A shared component can
provide a case edge, paper label, project-specific cover and a contact shadow.
The covers should relate to the work: the radial portfolio, the particle cube
and the planning-poker app. Reuse suitable existing artwork before adding more.

Each case is one link to its existing project route. Show its full title and
tagline. Keep repository links, media and longer descriptions in the detail
view. A case can lean a little against its support; readable text should stay
close to level. Hover and focus pull it slightly forward without hiding content.

Render exactly the projects in [projects.ts](../../src/lib/content/projects.ts).
LuixBits appears once, as the doorway. Open Source currently has Lupe Webfolio;
Web has Orbit Toy and Scrum Poker. The latter two still contain sample content.
Preserve that distinction where it is currently disclosed, and do not invent
screenshots, maturity claims or project descriptions for the redesign.

Remove empty rental slots. Let a single case use a useful amount of its shelf.
More cases should wrap into another supported row. Do not put them behind a
carousel or make the room require horizontal panning.

### Materials and light

Keep the Projects palette and fonts. Use deep plum plaster, charcoal casing,
smoked glass, worn wood, cream paper, pink neon and cyan screen spill. The
overview can be brighter and more architectural than the warm channel room.

Give the room two obvious light sources: the Projects sign and the blue light
through the studio entrance. Small warm highlights can come from the visible
lamp inside. Follow the guide's separate-surface technique: light on plaster,
case edges and the floor needs different masks and gradients. Text stays above
the material light.

Make a few details physically specific: sign brackets, a routed power cable,
a worn threshold, shelf screws and a small glued cover print. Use the floor's
tile lines as the vaporwave grid. Keep the effect local to the room, with no
additional floating inventory of symbols.

Do not add fictitious “LIVE”, “ON AIR”, shop-opening or system-status labels.
Keep decorative microcopy, serial numbers and extra chips out. Use the shared
`--fs-*` sizes for every piece of readable UI text.

## Transition choreography

The transition should explain which object was selected and where the visitor
arrived. Use the existing Web Animations route mechanism and `PowerOn` effect.
The following timings are starting values based on the accepted implementation;
review them in the browser before treating them as final.

| Journey                         | Proposed movement                                                                                                                               | Settled result                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Home → Projects                 | Keep the hub's existing zoom and the overview's CRT opening. Let the sign and receiving surfaces reach their normal light during that entrance. | The complete room is visible. Do not add another delayed introduction after the opening. |
| Direct load of Projects         | Run the existing viewport CRT reveal once after mount.                                                                                          | Ordinary readable content is already present underneath; no loading theatre.             |
| Hover/focus on LuixBits         | Over roughly 180–240ms, open the drawn door slightly farther and strengthen its local light.                                                    | The same title and destination remain visible. One tap still navigates.                  |
| Projects → LuixBits             | Move toward the measured doorway over roughly 640ms; reveal the real room during the latter part of that move.                                  | The existing CRT opens after the route movement, with the chosen poster ready.           |
| Projects → another project      | Lift the chosen software case toward the viewer and dissolve into its existing detail view.                                                     | Show its content, and the CRT when that project has media.                               |
| Detail → Projects               | Settle the room around the originating doorway or case, with a restrained reverse move.                                                         | Restore scroll position and keyboard focus to that exact project link.                   |
| Category anchor / locale change | Keep normal anchor or locale navigation.                                                                                                        | Do not replay the doorway entrance for a category jump or a translation change.          |

### Entering the studio, step by step

1. Activate the native link immediately. Preserve modified clicks, opening in a
   new tab and browser history. Animation must not be a prerequisite for routing.
2. Measure the entrance at the current viewport and scroll position. Keep a
   visual snapshot of the departing scene while SvelteKit prepares the route.
   Its duplicate controls must be inert and hidden from assistive technology.
3. When the destination is ready, start the camera movement. Centre it on the
   doorway aperture, using its measured bounds rather than a fixed page centre.
   Open the drawn panel slightly as the frame passes outward. Keep this panel
   movement part of the same transition, not an additional wait before it.
4. Bring in the actual LuixBits room during the move. Start with the existing
   470ms arrival at a 170ms delay within the 640ms transition. Align the entrance
   direction and colour change so the visitor perceives the room beyond it.
5. Remove the snapshot and finish the navigation state. Then let the existing
   CRT reveal expose the poster. Entering the room does not start a video.

Prototype the camera with simple rectangles first. Translate as well as scale
when necessary: scaling around an off-centre doorway alone does not place it at
the viewport centre. Avoid extreme magnification. On narrow screens, use much
less travel and a shorter visual dissolve while keeping the reveal sequence.
If the perspective becomes awkward, a restrained doorway-centred zoom is the
fallback; do not turn this into a 3D-engine project.

The current code repeats a `640`ms entry delay in both
[ChannelPlayer](../../src/lib/projects/ChannelPlayer.svelte) and
[CounterTv](../../src/lib/projects/CounterTv.svelte).
If timings vary between journeys or breakpoints, centralize the timing through
[projectNavigation](../../src/lib/projects/navigation.ts), or trigger reveals
from completion. Do not change the route duration while leaving those consumers
on unrelated timers.

### Return, interruption and fallback

Keep the remote's **Back to projects** label and return anchor. Browser Back
should land at the same object too. A return from a long detail page must not
zoom from an unrelated coordinate or force the overview to its top.

Extend the existing sequence counter and animation cleanup to cover any door,
case or background movement. A second navigation, failed navigation, resize,
unmount or changed motion preference must leave a usable page with no snapshot
covering it. Same-page hash navigation must stay separate from room transitions.

Reduced motion removes spatial travel, door movement and CRT shutters while
preserving immediate navigation and static focus feedback. Without JavaScript,
all project links and the finished composition remain available. No transition
adds automatic sound or starts a video.

## Implementation steps for the next session

### 1. Record the starting point

Read the three documents above, inspect `git status --short` and identify any
concurrent work before touching shared files. Capture desktop and phone views
of the overview and channel. Save a scoped rollback milestone before replacing
the accepted overview. Keep unrelated About, CV and Hobbies changes out of it.

**Result:** a known baseline and a clear list of files being changed.

### 2. Establish the content and navigation contract

Keep `youtube`, `opensource` and `web` category IDs and their EN/DE labels.
Preserve `/projects#youtube`, `/projects#opensource`, `/projects#web` and the
localized equivalents used by the radial menu. Select the existing channel
project for the doorway; exclude it from any secondary project list so it
appears once. Keep the other cases driven by the existing typed content.

Retain `id="tape-{slug}"` and `data-project-tape` on the new project links for
the first implementation. Their names are internal; the current transition
lookup and remote return URLs depend on them. A later rename must update all
consumers together.

Suggested new copy is limited to the entrance action and, if needed, the intro:

| English                                     | German                                  |
| ------------------------------------------- | --------------------------------------- |
| Enter the studio                            | Studio betreten                         |
| Things I build, and the videos behind them. | Meine Projekte und die Videos dahinter. |

**Result:** the new layout can reuse every existing destination and return path.

### 3. Build a plain layout and resolve the wheel clearance

Arrange the doorway and two display levels with ordinary HTML and CSS Grid.
Use actual titles and taglines immediately. Remove empty slots and the fixed
four-column expectation. Test the arrangement before adding material effects.

At wide sizes, reserve space for the docked wheel when positioning the room.
On phones, the proposed solution is a dedicated navigation ledge near the top,
with the existing compact wheel in normal flow on `/projects` only. Its expanded
fan may temporarily overlay the room while being used; its resting state should
not cover project text. This is a scoped presentation change to test, not a new
navigation system. Preserve the hub wheel and the other pages' behaviour.

Coordinate any necessary change to
[RadialMenu](../../src/lib/radial-menu/RadialMenu.svelte) with concurrent work.
If its current positioning cannot support that ledge cleanly, resolve the
navigation placement as a separate small change before polishing the scene.
Fading the wheel or adding bottom padding alone does not fix overlap mid-scroll.

**Result:** all four links are readable and reachable at 1440, 768, 390 and
320px, before artwork is used to make the layout attractive.

### 4. Give the overview its own room shell

Add a route-scoped overview variant in the
[root layout](../../src/routes/+layout.svelte), using the delocalized pathname.
Keep the distinction between the overview, the LuixBits workbench and other
project detail pages explicit. Replace the overview's floating decor, corner
scene and outrun footer with its wall, threshold and room ending.

Keep the architecture needed for the camera snapshot inside the overview's
scene wrapper. The broad backdrop can remain a route layer. The current
transition clones only `#main .page`, so artwork placed exclusively in the root
background will not move with that clone. Also preserve the scene's CSS
variables when the snapshot is moved outside its original parent.

**Result:** the overview reads as one room, and the accepted channel page keeps
its wall, desk, lamp, keyboard, paper and cable footer.

### 5. Draw the doorway and its room glimpse

Construct the frame, hinge, angled panel and threshold in SVG. Borrow the
established cabinet silhouette and materials for a small decorative preview.
Give repeated SVG definitions unique IDs. Put the visible HTML title, tagline
and action inside the single native link, with a clear focus outline.

**Result:** a still screenshot communicates both LuixBits and an entrance.
The link works before hover, motion or additional decoration is added.

### 6. Build the project cases and supports

Create one reusable project-case component with actual title, tagline and
artwork. Draw depth with an edge, inset highlight and contact shadow. Give Open
Source and Web recognisable shelf supports within the same counter. Reuse
[TapeArtwork](../../src/lib/projects/TapeArtwork.svelte) where it fits, and add
specific original covers only when they improve recognition.

Use full-width rows for longer labels and narrow layouts. Keep a small piece of
cover art visible on phones. Do not shorten project names or lower the font size
to meet an arbitrary case height.

**Result:** every remaining project has a distinct physical presence without
reintroducing tall, mostly empty jackets.

### 7. Apply the materials and receiving-surface light

Follow the construction order in the scene-building guide: silhouette, support,
base material, highlights/shadows, then a few specific details. Use isolated
local stacks for light and keep decorative layers pointer-free. Review the
doorway's resting, hovered and focused light on the wall and threshold.

Keep the glow soft at the perimeter. A cable should meet its fixture; a shelf
should cast a shadow where it is attached. Remove any detail whose scale,
placement or lighting makes the objects seem to float.

**Result:** the room relates visibly to the channel without duplicating its desk.

### 8. Implement and review the route transitions

Extend [the Projects layout](../../src/routes/projects/+layout.svelte) using the
choreography above. Keep real navigation in control. Preserve snapshot cleanup,
focus restoration, category anchors and the persistent Projects layout. Review
the studio entrance first, then a media project, then the no-media Webfolio view.

Use the existing [PowerOn](../../src/lib/projects/PowerOn.svelte) and
[BackToShelf](../../src/lib/projects/BackToShelf.svelte) behaviours. Touch should
take one tap. Keyboard activation should produce the same journey. Do not make
hover a preview screen that requires a second activation to proceed.

**Result:** entering and returning feel connected to the selected physical object.

### 9. Finish responsive composition and motion preferences

At smaller widths, stack the shorter studio entrance above Open Source and Web.
Let the counter become narrower sections of the same furniture. Reduce
decorative depth, overhang and gaps before reducing useful content. Keep the
room in normal document flow; avoid a fixed 100vh canvas or scroll-controlled
camera. Test wrapping, transforms and the navigation ledge with German text.

Check the static composition with reduced motion and JavaScript disabled.
Hidden entrance states should exist only while an enabled client animation
needs them. The SSR page must not wait for JavaScript to become visible.

**Result:** phones retain the illustrated setting and all destinations remain
available through ordinary scrolling.

### 10. Validate the complete journey

For the future UI change, run `npm run check` and `npm run build`. Use a stable
dev preview and a separate validation copy if another collaborator needs the
current preview. Follow the guide's warning about rebuilding beneath an active
`vite preview` process.

| Review                     | Required result                                                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop, tablet and phones | No horizontal overflow or clipped titles at 1440, 768, 390 and 320px. Also inspect a short landscape viewport and enlarged text.                                          |
| First view                 | LuixBits is the main entrance; the remaining work is easy to find. No empty placeholder slots consume the room.                                                           |
| Navigation                 | Category anchors, localized routes, native links, modified clicks, remote return and browser Back/Forward work.                                                           |
| Input                      | Mouse hover, real Tab focus and touch all expose the same destinations. Resting navigation does not cover project labels.                                                 |
| Motion                     | Direct entry, door entry, case entry, return, rapid navigation and mid-transition resize leave the page usable. Reduced motion stays still.                               |
| Channel regression         | The chunky TV, tape selection, explicit Play, eject, power, lamp, watch, purple Defy, paper and back remote still work. No iframe starts from an overview hover or visit. |
| Content and typography     | All four entries appear once, full labels fit, EN/DE copy is present and text uses the declared scale. Sample content is not presented as new verified work.              |
| Rendering                  | No browser exceptions, broken assets, duplicate interactive snapshots or stranded overlays.                                                                               |

Mocked YouTube checks can validate player lifecycle, but do not establish real
provider playback. This planning session inspected the current pages; these
future acceptance checks have not been run against an implementation.

### 11. Record the accepted implementation

Save scoped milestones for composition, artwork/light and navigation/motion so
they can be reviewed independently. Update the handoff with the actual preview
location and verified results. Once the new overview is implemented and
accepted, add a dated follow-up to ADR-0007 describing the change from rental
shelves to the workshop entrance. Keep its technical decisions and historical
context intact. Extend the guide only for a technique that was actually used
and verified.

**Result:** the next session can distinguish the proposal, the implemented
design and the checks that were completed.

## File map and scope

| Existing file                                                                              | Expected work in the future implementation                                                                   |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| [`src/routes/projects/+page.svelte`](../../src/routes/projects/+page.svelte)               | Replace the padded shelf grid with the doorway and compact displays. Keep semantic headings and anchor IDs.  |
| [`src/routes/projects/+layout.svelte`](../../src/routes/projects/+layout.svelte)           | Adapt measured origins and transition choreography; preserve cleanup and focus.                              |
| [`src/routes/+layout.svelte`](../../src/routes/+layout.svelte)                             | Select the overview room, navigation presentation and footer without altering the channel or other sections. |
| [`src/lib/components/Footer.svelte`](../../src/lib/components/Footer.svelte)               | Add the overview's room ending alongside existing footer variants.                                           |
| [`src/lib/radial-menu/RadialMenu.svelte`](../../src/lib/radial-menu/RadialMenu.svelte)     | Support scoped overview placement if required after the plain-layout review.                                 |
| [`src/lib/projects/navigation.ts`](../../src/lib/projects/navigation.ts)                   | Share transition timing/completion if the new journeys need it.                                              |
| [`messages/en.json`](../../messages/en.json), [`messages/de.json`](../../messages/de.json) | Add only useful entrance copy and accessible names.                                                          |

Likely new components belong under `src/lib/projects/overview/`: a room shell,
studio entrance and project case. Extract a component when it owns a useful
piece of geometry or behaviour; do not build a general scene engine.

The first implementation covers the overview and its transitions. The existing
project URLs, channel player and other detail-page content remain the
destinations. A future visual update to those other detail rooms can use the
same material language, but is separate from this overview redesign.
