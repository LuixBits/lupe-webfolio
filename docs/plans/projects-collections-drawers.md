# Projects collections, drawers and neon signs

Date: 2026-09-27. Implements the owner's follow-up to the inhabited workshop.

Group projects by where people use them. A project has one home in the room;
open-source status, readiness and related videos describe that project without
creating competing categories.

| Workstation | Current projects                      | Physical presentation                                                                                    |
| ----------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Studio      | LuixBits                              | Existing doorway into the channel room.                                                                  |
| Web         | Lupe Webfolio, Scrum Poker, Team Feed | Recessed network cabinet by the window, with the portfolio model, patch panel and mounted project files. |
| Neovim      | RoomPlan, Flashcards                  | Deep cream terminal, green editor and room plan, purple split keyboard and study cards.                  |
| Desktop     | Noctalia Plugins, Magic Mouse         | Slim widescreen, metal stand, compact tower, digital watch and glass-topped mouse.                       |

Orbit Toy remains a small sample experiment at the end of the bench. The main
wheel links to Studio, Web, Neovim and Desktop. Existing project URLs remain
valid. The old `#opensource` fragment points to the Web station, where Webfolio
now belongs.

Each file is a native link with its full title and description. New Neovim or
Noctalia projects can be added to the content collection; their station expands
without requiring another giant illustration or a new route component.
Additional plugins can join their station when their names and descriptions
are available.

## Web's physical setting

The owner asked for a clearer physical home for Web and suggested a couch or
server rack. The current implementation tries a recessed network cabinet beside
the window. This is a reviewable design choice, pending the owner's feedback.

| Direction                              | What it gives the room                                                                                      | Tradeoff                                                                                      |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Recessed network cabinet — implemented | A complete frame with metal rails, a model shelf, patch cables, a shallow server and mounted project files. | Adds some height, but retains the existing room footprint and window.                         |
| Freestanding server rack               | A strong silhouette and more space for network hardware.                                                    | Makes this corner more industrial and competes with the tall studio doorway.                  |
| Browser testing desk                   | An obvious relationship to websites and applications.                                                       | Repeats the two computer stations already on the bench.                                       |
| Couch                                  | A softer, more domestic corner.                                                                             | Gives the browser projects a less direct physical association and repeats the room's seating. |

The cabinet uses the same native project links and content collection as the
other workstations. Its pale lavender labels, metal supports and patch panel
distinguish it from their wooden shelves. The pink sign and cyan reflections
keep it in the room's vaporwave palette. No extra decorative text or font sizes
are introduced. Narrow project labels stack their emblem above the copy so
enlarged text can use the full width.

## Content boundaries

RoomPlan and Flashcards descriptions come from their local repository READMEs.
Team Feed is the Atlassian project in `../atlassian_feed`; its README describes
the shared Confluence/Markdown feed and distinguishes development from public
release. The [Noctalia collection](https://github.com/LuixBits/luixbits-noctalia-plugins)
identifies Casio Deck, and its existing LuixBits video supplies related media.
The portfolio and Scrum Poker retain their existing URLs.

Magic Mouse uses the owner's supplied name and is marked upcoming. It has no
invented release date, download, repository URL or feature list. Project years
are optional; undated entries retain author order after dated entries. Scrum
Poker's existing stand-in screenshots are labelled as a sample preview.

## Drawers

All three drawer handles are native `details` / `summary` disclosures. At most
one drawer is open; clicking its handle again closes it. A shared `name` makes
the disclosures exclusive even without JavaScript. Svelte function bindings
map them to one `openDrawer` selection in the Projects room state. A queued
close event from the previous drawer cannot clear the new selection.

Quick keyboard activation and a project round trip preserve the selected
drawer. Opening a tray increases the cabinet's height in normal document flow;
the three trays can no longer accumulate into a tall stack. Handles and contents
remain reachable on small screens and with enlarged text.

1. The top drawer contains the floor-plan sketch and a pencil.
2. The middle drawer contains keycaps, a cable and loose electronics.
3. The bottom drawer contains a tablet with a Play video button. An explicit
   click loads the Rick Astley video in a YouTube privacy-enhanced iframe. Stop,
   closing the drawer, opening another drawer, or leaving the room removes it. Returning leaves the
   tablet ready to play rather than restarting it. A YouTube link remains
   available after Play and in the no-JavaScript fallback.

The tablet does not preload an iframe or start audio when someone opens the
room or drawer. Transition snapshots remove media elements before mounting, so
an active video cannot be cloned into a second player. Escape closes a focused
drawer and returns focus to its handle. Snapshot copies also lose their drawer
group names, preventing an inert copy from closing a live drawer. Native
disclosures also work without JavaScript.

## Neon

The main sign and four station signs use original SVG tube lettering with a
pale core, coloured glass, and a restrained static glow. HTML headings retain
the accessible text. Pink, cyan and violet distinguish the signs; wooden
supports, paper and the warm lamp keep the room's material contrast. These signs
add no flicker or animation loop.

Implementation and validation are recorded in the
[collections review](../reviews/projects-collections-2026-09-27.md) and the
[workstation follow-up](../reviews/projects-stations-2026-09-27.md). The later
[ultrawide refinement](../reviews/projects-ultrawide-2026-09-27.md) caps the room
at 1600px, redraws the Defy and removes the subtitle, rain and motion button.
The subsequent [side-wall refinement](../reviews/projects-side-walls-2026-09-27.md)
raises that cap to 2000px, fills the surrounding space with perspective walls
and framed jokes, and bounds the navigation's distance on large displays.
