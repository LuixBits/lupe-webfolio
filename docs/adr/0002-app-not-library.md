# ADR-0002: Ship a SvelteKit app, not a component library

- Status: accepted
- Date: 2026-09-20

## Context

The repo was scaffolded from the `sv` **library** template (`exports`, `files`,
`svelte-package`, `peerDependencies`, `publint`). We're building a website.

## Decision

Convert to an application: drop the packaging fields/scripts, keep a private
`package.json`, use `@sveltejs/adapter-auto`. `src/lib/index.ts` remains as an
optional public surface in case individual pieces (RadialMenu, Garden) are
extracted later, but shipping a package is not a goal.

## Consequences

- Standard app build/deploy flow.
- The RadialMenu geometry + a11y model were salvaged; library plumbing dropped.
