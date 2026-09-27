# Projects collections, drawers and neon: implementation review

Date: 2026-09-27. Application milestone: `394daa4`.
Implements the owner's request for a larger project inventory,
three working drawers, a tablet Rickroll and more neon lettering. The
[collections plan](../plans/projects-collections-drawers.md) records the
structure and content sources.

## Result

The room now contains nine native project links. Studio leads to LuixBits; Web
holds Webfolio, Scrum Poker and Team Feed; Neovim holds RoomPlan and Flashcards;
Desktop holds Noctalia Plugins and the upcoming Magic Mouse application. Orbit
Toy remains a small sample at the end of the bench. Four wheel destinations
match the main workstations, and the old `#opensource` anchor leads to Web.
More projects can join the existing content-driven shelves.

The three drawer handles reveal a floor-plan sketch, spare keys and electronics,
and a tablet. Play loads the Rickroll. Stop, closing the drawer and leaving the
room remove its iframe. Returning restores the drawer states with the tablet
idle. Snapshot cloning excludes media, so navigation cannot create another
player. Native two-way disclosure bindings also handle rapid drawer activation.

Five signs use original SVG tube lettering with a static glow and separate HTML
headings. New terminal and desktop illustrations sit above readable project
files. The room keeps the violet walls, cyan reflections, pink neon, wood and
paper of the inhabited workshop.

## Validation

| Area                | Result                                                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Svelte / TypeScript | Final isolated `npm run check`: 0 errors, 0 warnings.                                                                                                                                       |
| Production          | `npm run build` passed with adapter-node; built room checked in Chromium.                                                                                                                   |
| EN / DE layout      | 1920 × 1080, 1440 × 1000, 1024 × 768, 768 × 1024, 390 × 844, 320 × 740 and 844 × 390. Nine links and all three open drawers fit without horizontal overflow or clipped controls.            |
| Enlarged text       | Root font size increased to 200% at 1440px and 320px in both languages; text, drawer contents and controls fit.                                                                             |
| Reduced motion      | Zero active room animations in the responsive checks.                                                                                                                                       |
| No JavaScript       | All three native drawers open in EN and DE; the tablet offers a direct video link; RoomPlan detail and native return work.                                                                  |
| Navigation          | All nine round trips passed at 1440px EN and 390px DE. Lamp, pause, cat and all drawer states persist; source focus returns and scroll differs by at most 4px. Browser Back/Forward passed. |
| Menu                | Four desktop destinations and the legacy anchor passed; Neovim and Desktop menu navigation passed on the German phone layout.                                                               |
| Drawer input        | Enter, Space, Escape and rapid opening of all three drawers passed. Escape restores focus to the corresponding handle.                                                                      |
| Tablet lifecycle    | No iframe before Play. Play creates one; Stop or closing removes it. Navigation excludes it from the snapshot and makes no duplicate provider request. Returning does not autoplay.         |
| Upcoming content    | Magic Mouse displays its upcoming status and has no invented release or external download link.                                                                                             |
| Browser errors      | No browser exceptions in the completed navigation checks.                                                                                                                                   |

The repeatable lifecycle tests mocked the YouTube document. A separate test
used the real provider on both `http://localhost:5173` and
`http://localhost:5191`: the Rick Astley player returned status OK, the video
was playing, and its media time advanced between samples. Screenshots show the
actual video inside the tablet. Chromium was muted during this check. Closing
the drawer removed the player.

An earlier real-provider attempt on `http://127.0.0.1:5191` reported the video
unavailable. The same build played successfully through `localhost`; the exact
reason for that provider response was not established. The direct YouTube link
remains available after Play. Local success does not establish playback in
every browser or network environment.

## Preview and artifacts

- Shared development app: <http://localhost:5173/projects>, including `/de/projects`.
- Production preview: <http://localhost:5191/projects>.
- Build copy: `/tmp/lupe-collections-validation-ibqt6f1e`, created from
  `a69ca6ac2af9a46f9e62352bb7b5b6b4f8e325a3` plus the scoped Projects sources,
  messages and menu changes. Concurrent CV refinements beyond that base were
  excluded. The final drawer binding fix was copied in before the final check
  and build.
- Production command: `HOST=127.0.0.1 PORT=5191 node build/index.js` in that copy.
- Logs, browser scripts and screenshots: `/tmp/lupe-workshop-collections/`.
  `responsive.log`, `journeys.log`, `production.log` and `tablet-live.log` contain
  browser results. `isolated-check.log` and `build.log` record the final source
  checks. `production.log` includes the earlier numeric-IP provider failure;
  `tablet-live.log` records the later successful hostname checks.
- `production-room.png` shows the built overview;
  `final-open-{1440,390,320}-{en,de}.png` shows the open drawers;
  `tablet-live-5173.png` and `tablet-live-5191.png` show actual Rickroll playback.

The isolated copy used existing dependencies and cached inlang plugins. Browser
scripts used system Chromium and a temporary Playwright package outside the
repository. No testing dependency was added. Temporary artifacts remain session
files. Nothing was published or pushed.
