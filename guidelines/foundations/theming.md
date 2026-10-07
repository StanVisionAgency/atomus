# Theming
Three collections re-theme everything without touching components. Set the mode on the top frame (Figma) or an attribute on an element (code):

| Collection | Modes | Code |
|---|---|---|
| Brand | Atomus · Example — Violet · (your brands) | `data-brand="violet"` |
| Color | Light · Dark | `data-theme="dark"` |
| Radius | Default · Sharp · Round | `data-radius="sharp"` |
| Spacing & Layout, Typography | Desktop · Tablet · Mobile | media queries (automatic) |

**Add a client brand:** add a mode to Brand, point `brand-25 … brand-950` at the client ramp (add the ramp to _Primitives first). In CSS, copy the `[data-brand="violet"]` block.
