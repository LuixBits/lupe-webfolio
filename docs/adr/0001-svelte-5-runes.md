# ADR-0001: Svelte 5 with runes

- Status: accepted
- Date: 2026-09-20

## Context

The prototype ran on Svelte 4 idioms (`export let`, `$:`, `on:click`, `<slot>`)
while depending on `svelte@^5`. The site is state-heavy: an animated radial menu
with hover/focus/dock state, generative growth, and a GPU layer.

## Decision

Build on Svelte 5 with **runes** (`$state`, `$derived`, `$props`, `$effect`,
`{@render}`) and the new event syntax (`onclick`). Module-level reactive state
lives in `.svelte.ts` files (e.g. `dock.svelte.ts`).

## Consequences

- Cleaner, explicit reactivity for complex derived geometry.
- Uses `$app/state` (not the legacy `$app/stores`).
- Contributors must know runes; no mixing legacy reactive syntax in new code.
