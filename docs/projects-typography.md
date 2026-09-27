# Projects typography

Applies to the `/projects` overview, project detail pages and LuixBits workbench,
including their German routes. The size rule was already recorded in
[HANDOFF.md](../HANDOFF.md) and the [scene guide](handcrafted-scenes.md).
This page makes the roles and typefaces explicit.

## Typefaces

| Use                                                     | Typeface                    | Source                                      |
| ------------------------------------------------------- | --------------------------- | ------------------------------------------- |
| HTML titles and headings                                | Righteous                   | `--font-display` in `src/lib/themes.css`    |
| Descriptions, project files, controls, dates and status | Space Mono                  | `--font-body` in `src/lib/themes.css`       |
| Neon signs                                              | Original SVG tube lettering | `src/lib/projects/overview/NeonSign.svelte` |

Righteous and Space Mono are self-hosted through Fontsource imports in the root
layout. Neon is a separate drawn alphabet, with layered strokes for glass,
bright cores and glow. It adds no font download. Its HTML heading supplies the
accessible text, and the sign's dimensions follow the corresponding heading
size. A different face may be used for neon without changing the content fonts.

The Play annotation and author signature use Space Mono, with italic styling.
These previously introduced Georgia as a third content face.

## Six permitted sizes

Use the existing tokens in [src/app.css](../src/app.css). Values in pixels below
assume a 16px root size; rem values respect the reader's enlarged text setting.

| Token        | Definition                      | Pixels at the default root size | Role                                                               |
| ------------ | ------------------------------- | ------------------------------- | ------------------------------------------------------------------ |
| `--fs-hero`  | `clamp(2.4rem, 6vw, 4.25rem)`   | 38.4–68                         | Main room sign                                                     |
| `--fs-h1`    | `clamp(1.85rem, 4.2vw, 2.9rem)` | 29.6–46.4                       | Project and channel page title                                     |
| `--fs-h2`    | `clamp(1.25rem, 2.6vw, 1.8rem)` | 20–28.8                         | Workstation signs and content sections                             |
| `--fs-h3`    | `1.15rem`                       | 18.4                            | All overview project titles, including Studio; signature           |
| `--fs-body`  | `1.06rem`                       | 16.96                           | Prose, descriptions, tape titles and primary actions               |
| `--fs-small` | `0.85rem`                       | 13.6                            | Status, durations, secondary actions and compact hardware controls |

The responsive headings are one token per role. Body and metadata keep their
sizes on phones. Use `--lh-tight` for headings and `--lh-body` for reading text.
Allow controls and descriptions to wrap; give their containers more room when
needed. Do not create a new pixel size, viewport clamp or transform to squeeze
content into an object.

## Lettering inside illustrations

Blueprint marks, keycap symbols and the CRT's moulded casing belong to the SVG
illustration and scale with it. They carry no unique instructions or project
information. Keep descriptive content and interactive labels in HTML at the
sizes above. The existing site-wide radial wheel uses text fitted to SVG arcs;
its geometry is owned by `RadialMenu.svelte`, rather than the Projects content
scale.

## Review

Inspect computed sizes on the overview, a project detail and the channel room.
Check both languages at desktop and 320px phone widths, including 200% root
text. A passing source check cannot show whether a rotated annotation is
clipped, a long title wraps poorly, or a control label becomes hard to read.
