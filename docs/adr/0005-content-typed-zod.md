# ADR-0005: Content as typed TS validated with Zod

- Status: accepted
- Date: 2026-09-20

## Context

Content is structured — projects with sources, videos, and links — more than it
is long-form prose. It must be type-safe and fail fast on malformed entries.

## Decision

Author content as plain TS objects, parsed through **Zod** schemas
(`src/lib/content/schema.ts`) at module load. Localized fields use a
`LocalizedString` (`{ en, de }`) resolved with `resolveLocalized()`. Sources,
videos, and links are typed sub-schemas, so every project self-documents its
media and citations.

## Consequences

- Bad content is a build/dev error, not a runtime surprise.
- No CMS service, auth, or network dependency.
- Long-form prose, if needed later, can be added via MDsveX without displacing
  this structured layer.

## Alternatives rejected

- Headless CMS (Sanity/Contentful) — heavier for a solo, frontend-first site.
- Markdown-only — weak typing for structured sources/videos/links.
