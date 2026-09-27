# Inhabited Projects workshop: implementation review

Date: 2026-09-27. Application milestone: `613e505`.
Implements the [inhabited workshop plan](../plans/projects-inhabited-workshop.md)
and the owner's later request to restore the vaporwave palette. Final visual
approval remains with the owner.

## Result and integration

The actual `/projects` route now contains the full room. Rafters and a mounted
neon sign lead into a studio doorway and sunset window. A miniature portfolio
world rests on a shelf; the workbench holds a glass-enclosed particle cube and
planning cards. Drawers, a stool, cables, a rug, a plant and a cat finish the
floor. Magenta, cyan and violet connect it to the existing Projects hub tile.
Warm wood and paper still distinguish the furniture and project labels.

The four real project records appear once, in their existing categories. Native
localized links, category anchors and `tape-{slug}` IDs remain intact. Shared
state in the Projects layout preserves the lamp, pause, cat and drawer through
a detail visit. A remote return restores the chosen object and saved scroll;
browser Back and Forward retain their normal history behavior. The room's
snapshot includes its furniture, preserves SVG paint references and freezes
ambient frames while leaving labels still.

The lamp changes receiving surfaces. The cat wakes, rests and follows a nearby
mouse slightly; the drawer reveals the existing floor-plan illustration.
Visible rain, apparatus and breathing animations stop outside the viewport,
when the document is hidden, during route motion, on Pause, or under reduced
motion. Geometry is measured on resize rather than on scroll. Static SSR
contains the complete illustration and working project links.

The old standalone composition study now redirects to the integrated route.
Its original drawing remains in commit `5e96a49`. The previous production
preview on port 5191 was replaced with the new build, so its project return
links also lead to the full room.

## Validation

| Area                 | Result                                                                                                                                                                                       |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Svelte / TypeScript  | `npm run check`: 0 errors, 0 warnings in an isolated validation copy.                                                                                                                        |
| Production           | `npm run build`: passed with adapter-node. Built preview verified in Chromium.                                                                                                               |
| EN / DE composition  | 1920 × 1080, 1440 × 1000, 1024 × 768, 768 × 1024, 390 × 844, 320 × 740 and 844 × 390. No document/body overflow or clipped labels.                                                           |
| Enlarged text        | 200% root text at 1440px and 320px in both languages; all project text and controls fit.                                                                                                     |
| Fallbacks            | Reduced motion leaves zero active room animations. No-JavaScript EN/DE room → studio → remote return works.                                                                                  |
| Content growth       | A temporary isolated fixture added one long-titled project to each category. All seven appeared once, wrapped at 1440px EN and 320px DE, and supported detail return. Fixtures were removed. |
| Navigation           | Hub entry, all four project round trips at desktop and phone sizes, remote, browser Back/Forward, category anchors and locale changes passed.                                                |
| Room state           | Lamp, pause, cat and drawer persist across each detail round trip; source focus and scroll return within 4px.                                                                                |
| Input                | Real Tab/Enter, Space on room controls, Ctrl-click, middle-click and touch navigation passed. No hover prerequisite.                                                                         |
| Transition lifecycle | Inert, aria-hidden snapshot; unique IDs; frozen ambient frames; mid-transition resize/reduced-motion change; rapid Back and leaving Projects leave no stranded overlay.                      |
| Channel              | Selection, explicit Play, eject, Casio, television power, desk lamp and remote checked. Overview and tape selection create no iframe.                                                        |
| Browser failures     | No unexpected browser exceptions in the completed checks.                                                                                                                                    |

The YouTube document was mocked for embed lifecycle tests. These establish
creation and teardown, not playback from the real provider. Hidden-document
handling was checked by dispatching a visibility change with `document.hidden`
set; this is a handler check, not an operating-system background-tab trace.

A short trace covered visible window, bench and floor areas with scroll between
them. After each area settled, three 1.2-second samples recorded zero room
`getBoundingClientRect()` calls. Offscreen animation names were `none`. Across
the trace, Chromium recorded 36.7ms of layout work, 26.6ms of style updates and
22ms of paint work. The small active SVG effects still cause rendering work;
these measurements are local observations, not a frame-rate or device guarantee.
There is no animated room-sized blur or scroll measurement loop.

## Preview and artifacts

- Current shared app: <http://localhost:5173/projects>, including `/de/projects`.
- Local production build: <http://127.0.0.1:5191/projects>.
- Build copy: `/tmp/lupe-inhabited-validation-mwqya3ii`, created from `d594971`
  plus the scoped Projects changes. All Projects sources match `613e505`;
  concurrent CV refinements made after the copy was created are excluded.
- Production process: `HOST=127.0.0.1 PORT=5191 node build/index.js` in that copy.
- Screenshots, browser scripts, logs and trace: `/tmp/lupe-workshop-integration/`.
  `production-room.png` and `hub.png` record the room and its hub reference;
  `final-{locale}-{width}-{height}-{zoom}.png` records the final built matrix.
- `journeys.log`, `interactions.log`, `final-input.log`,
  `production-responsive.log`, `fixture.log` and `performance.log` record browser
  checks; `performance-trace.json` contains the trace. `check-final.log` and
  `build-final.log` contain the isolated source checks.

The isolated copy used existing dependencies and cached inlang plugins. Its
build did not replace generated output under the shared development server.
The temporary fixture server was stopped and its source restored. Artifacts in
`/tmp` are session files. Concurrent CV work was excluded from the Projects
commit; nothing was published or pushed.
