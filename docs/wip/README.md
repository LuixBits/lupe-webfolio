# WIP — staged but NOT applied (needs a browser to verify)

## radial-redesign.{defs.svg, style.css}
A Fable-generated visual upgrade for the radial wheel (the buttons are currently
plain). It's an SVG-filter approach — a specular "sheen" on each wedge, a
self-coloured themed glow on hover/focus, and a jewel-like Back hub — plus a
replacement `<style>` block. Colours are untouched (per-slice `--slice-fill`
still shows through); filters are applied via CSS `filter: url(#id)`.

To apply, in `src/lib/radial-menu/RadialMenu.svelte`:
1. Paste `radial-redesign.defs.svg` inside the existing `<defs>…</defs>`.
2. Replace the contents of the `<style>…</style>` block with
   `radial-redesign.style.css`.
3. Re-apply these three tweaks the current file already has and that the new
   style may overwrite:
   - `.menu-root { transition: transform 520ms cubic-bezier(0.66,0,0.28,1); }`
   - the `@media (max-width: 560px)` wheel-shrink block
   - `.label { font-family: var(--font-display, …); }`
4. Verify **in a browser** (hover/focus, docked Back, mobile), then keep or
   discard.

It was NOT auto-applied because visual changes here were being made without a
browser and repeatedly missed the mark — verify before committing.
