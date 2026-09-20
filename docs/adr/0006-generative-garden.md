# ADR-0006: Generative "garden" via L-systems

- Status: accepted
- Date: 2026-09-20

## Context

When the menu docks, it should grow leaves and roots that "actually look good"
— organic, not hand-drawn one-offs, and different per section.

## Decision

Generate botany procedurally with a seeded **L-system** turtle
(`garden/lsystem.ts`) that emits pure geometry (segments + leaf anchors).
`Garden.svelte` renders it as SVG and animates a growth "frontier" along
cumulative path length (branches draw on, then leaves scale/fade in). Seeded on
the page slug, so each section deterministically grows its own plant.
`prefers-reduced-motion` jumps straight to the fully-grown state.

## Consequences

- Data/render split: the same geometry can later be rendered on the WebGL layer.
- Presets (`BRANCH_PRESET`, `ROOT_PRESET`) tune up-growth vs. corner roots.

## Future options

- **Space-colonization** algorithm for more natural root branching.
- **Differential growth** for curling vine edges.
