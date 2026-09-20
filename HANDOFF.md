# Handoff — lupe-webfolio

A themed **radial-menu portfolio**. SvelteKit + **Svelte 5 (runes)**, adapter-node.
Repo: `LuixBits/lupe-webfolio` (`main`). This doc is for a Claude session picking
up **locally with a browser** — please read it first.

## ⚠️ The one thing that matters most

Everything so far was built on a **headless server with no browser**, so all the
**visual** work is unverified and the owner is (rightly) unhappy with how it
looks. Your advantage is a **browser** — run the app, look at it, and iterate on
look-and-feel by *seeing* it. Don't push CSS you haven't looked at. Logic,
routing, i18n, build all pass `npm run check` (0 errors); the gap is purely visual.

## Run it

```bash
npm install
npm run dev            # http://localhost:5173  (Vite plugin compiles i18n)
# or: npm run check / npm run build
```
Node 22. Paraglide (i18n) messages compile to `src/lib/paraglide/` (git-ignored)
on dev/build; if `$lib/paraglide/*` is missing run
`npx @inlang/paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide`.

## Interaction model

- **Home (`/`) = the hub:** four scene "squares" as a non-interactive backdrop
  (`lib/portal/HubBackdrop.svelte`) with the **radial wheel centered on top** as
  the **only navigation** (`lib/radial-menu/RadialMenu.svelte`). Grid:
  **About top-left · Projects top-right · Hobbies bottom-left · CV bottom-right**
  — each square sits under its matching wheel segment.
- **Click a segment →** navigate to that section: the theme takes over, the wheel
  **glides to a corner** (docked sub-nav: sub-segments + curved **Back** → home),
  content flies in. Route-driven + SSR-safe.
- Sections: `/about`, `/projects`, `/hobbies`, `/cv`. Sub-links anchor to
  `#sections` on each page.

## Architecture map

- `routes/+layout.svelte` — orchestrates theme (from route), hub vs section,
  transitions, decor/scene/footer gating.
- `lib/themes.ts` / `lib/themes.css` — 4 themes: **garden / water / vaporwave /
  cosmos**. `data-theme` palette + fonts, swapped per route (stamped on `<html>`
  server-side in `hooks.server.ts`). Section→theme: about=garden, cv=water,
  projects=vaporwave, hobbies=cosmos. `SECTION_COLORS` = the wheel segment colors.
- `lib/scenes/*` — per-theme "corner scene" (GardenScene = L-system melt; Water,
  Vaporwave, Cosmos). Shown docked in a corner on a section; also reused as the
  hub squares. **Many are Fable-generated** and sophisticated (deterministic
  PRNG, `$props.id()`).
- `lib/decor/*` — per-theme floating decor layer (GSAP mouse-parallax).
- `lib/components/footer/*` — theme-dispatched footer (wave = water only).
- `lib/content/*` — typed + Zod-validated content (about, cv, projects, hobbies);
  bilingual `LocalizedString` maps. Mostly placeholder.
- `lib/radial-menu/geometry.ts` — wheel/label geometry (curved + radial text).

## Themes & typography ("CI")

Each theme has a display + body font (loaded in `app.html`): garden
Fraunces/Nunito Sans, water Spectral/Karla, vaporwave Righteous/Space Mono,
cosmos Space Grotesk/Sora. Shared clamp type scale in `app.css` (`--fs-hero/h1/
h2/h3/body/small`), wired via `--font-display` / `--font-body`.

## Known visual issues to fix WITH the browser (priority order)

1. **Hub squares don't fill nicely.** The corner-scenes emanate from a corner and
   fade toward center, so each square looks sparse/half-empty. Needs a real visual
   fix (fuller compositions for the square, or a distinct hub visual). This is the
   owner's top complaint. `lib/portal/HubBackdrop.svelte`.
2. **Radial buttons are plain** — a redesign is **staged in `docs/wip/`** (SVG
   sheen/glow/jewel-hub). Apply per `docs/wip/README.md`, verify, keep/adjust.
3. **Decor richness uneven across themes** — owner wants all four rich (not just
   botanical): pull more SVG assets (unDraw MIT, DrawKit, SVGRepo, freesvg.org /
   svgsilh CC0, public-domain botanicals). Planets/solids/foliage per theme.
4. **Mobile** — wheel shrinks on small screens, but do a full responsive pass
   (scenes, footers, docked menu, content).
5. **Vaporwave scene** — sun was just realigned into the grid (verify it reads
   right). 
6. Owner wanted the open transition tuned (currently: theme cross-fade + 520ms
   ease-in-out wheel glide + content fly-in).

## Open question (unresolved)

When a segment is clicked, the wheel glides to the **opposite** corner (so the
selected segment faces into the viewport and its sub-segments stay visible). The
owner may want it to end elsewhere — confirm the desired end position.

## Deploy & versioning

Committed per milestone; push to `main`. Live at **https://luizperren.dev** via a
systemd `webfolio` unit (adapter-node on `127.0.0.1:3001`) behind Traefik +
Cloudflare. Redeploy = `npm run build` then `sudo systemctl restart webfolio`
(on the server). Full infra notes in the server's config repo / project memory.

## More context

`docs/adr/` (architecture decisions), git history (clear milestone commits),
and the assistant's project memory.
