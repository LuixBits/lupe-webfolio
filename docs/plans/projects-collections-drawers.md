# Projects collections, drawers and neon signs

Date: 2026-09-27. Implements the owner's follow-up to the inhabited workshop.

Group projects by where people use them. A project has one home in the room;
open-source status, readiness and related videos describe that project without
creating competing categories.

| Workstation | Current projects                      | Physical presentation                                                             |
| ----------- | ------------------------------------- | --------------------------------------------------------------------------------- |
| Studio      | LuixBits                              | Existing doorway into the channel room.                                           |
| Web         | Lupe Webfolio, Scrum Poker, Team Feed | Portfolio model by the window, with individual project files in the wooden shelf. |
| Neovim      | RoomPlan, Flashcards                  | Terminal, floor plan, purple keyboard and study cards.                            |
| Desktop     | Noctalia Plugins, Magic Mouse         | Monitor, Casio watch and mouse above their project files.                         |

Orbit Toy remains a small sample experiment at the end of the bench. The main
wheel links to Studio, Web, Neovim and Desktop. Existing project URLs remain
valid. The old `#opensource` fragment points to the Web station, where Webfolio
now belongs.

Each file is a native link with its full title and description. New Neovim or
Noctalia projects can be added to the content collection; their station expands
without requiring another giant illustration or a new route component.
Additional plugins can join their station when their names and descriptions
are available.

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

All three drawer handles are native `details` / `summary` disclosures. Their
open states use Svelte's two-way binding to the shared Projects room state, so
quick keyboard activation and a project round trip preserve the correct state.
Opening a tray increases the cabinet's height in normal document flow. Handles
and contents remain reachable on small screens and with enlarged text.

1. The top drawer contains the floor-plan sketch and a pencil.
2. The middle drawer contains keycaps, a cable and loose electronics.
3. The bottom drawer contains a tablet with a Play video button. An explicit
   click loads the Rick Astley video in a YouTube privacy-enhanced iframe. Stop,
   closing the drawer, or leaving the room removes it. Returning leaves the
   tablet ready to play rather than restarting it. A YouTube link remains
   available after Play and in the no-JavaScript fallback.

The tablet does not preload an iframe or start audio when someone opens the
room or drawer. Transition snapshots remove media elements before mounting, so
an active video cannot be cloned into a second player. Escape closes a focused
drawer and returns focus to its handle. Native disclosures also work without
JavaScript.

## Neon

The main sign and four station signs use original SVG tube lettering with a
pale core, coloured glass, and a restrained static glow. HTML headings retain
the accessible text. Pink, cyan and violet distinguish the signs; wooden
supports, paper and the warm lamp keep the room's material contrast. These signs
add no flicker or animation loop.

Implementation and validation are recorded in the
[review](../reviews/projects-collections-2026-09-27.md).
