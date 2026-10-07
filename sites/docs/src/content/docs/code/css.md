---
title: CSS
description: atomus.css — every token as a CSS custom property, with theme, brand, radius and breakpoint switches.
---

[`css/atomus.css`](https://github.com/StanVisionAgency/atomus/blob/main/css/atomus.css) works with any stack.

```html
<link rel="stylesheet" href="atomus.css">

<html data-theme="light">          <!-- light | dark | system -->
<body data-brand="violet">         <!-- omit for Atomus blue -->
<section data-radius="round">      <!-- default | sharp | round -->
```

- Switches nest: a `data-theme` or `data-brand` on any element re-themes everything inside it.
- Breakpoints follow the Figma modes: Desktop ≥ 1024px, Tablet 768–1023px, Mobile < 768px. Layout spacing, container padding and headline sizes change automatically.
- `.text-*` classes match every Figma text style (`.text-headline-h1`, `.text-content-body`, `.text-web-display` …).
- Shadows: `--shadow-elevation-1 … 24` and `--shadow-focus-ring`.

## Add a client brand

1. In Figma, add a mode to the **Brand** collection and point `brand-25 … brand-950` at the client ramp.
2. In CSS, copy the `[data-brand="violet"]` block, rename it and paste the client hex values.
