# ADR-0004: Internationalization via Paraglide JS (inlang)

- Status: accepted
- Date: 2026-09-20

## Context

The site needs translations as a first-class concern (nav, content, metadata).

## Decision

Use **Paraglide JS** (`@inlang/paraglide-js@2`). Messages live in
`messages/{locale}.json`, compiled to typed getter functions under
`src/lib/paraglide/` (git-ignored, regenerated on dev/build via the Vite
plugin). Locale is resolved by URL → cookie → base, wired through
`src/hooks.server.ts` (`paraglideMiddleware`) and `src/hooks.ts` (`reroute`
with `deLocalizeUrl`). Locales: `en` (base), `de`.

## Consequences

- Tree-shakeable, type-safe messages: `m.nav_home()`.
- Menu labels are message getters, so the menu re-renders per locale.
- Structured content (projects) carries its own `LocalizedString` maps
  (see ADR-0005), separate from UI strings.

## Alternatives rejected

- `svelte-i18n` — runtime dictionaries, no compile-time type safety.
- `typesafe-i18n` — typed but more boilerplate, less SvelteKit-native.
