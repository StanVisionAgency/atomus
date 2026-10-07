---
title: Tailwind CSS v4
description: The Atomus theme for Tailwind v4 with semantic utilities.
---

```css
@import "tailwindcss";
@import "./atomus.tailwind.css";
```

```html
<button class="bg-brand-solid text-on-brand rounded-md px-xl h-10 shadow-e2">Save</button>
<p class="text-secondary text-body">…</p>
<section class="px-layout-md py-layout-xl">…</section>
```

- `@theme` holds the palette (`bg-brand-600`, `text-gray-900` …), radius, spacing (`p-md`, `gap-layout-sm`), type scale (`text-h1`) and shadows (`shadow-e1 … e24`).
- 54 semantic utilities: `text-primary`, `bg-secondary`, `border-primary`, `fg-brand`, `text-on-warning` …
- `dark:` works with `data-theme="dark"` or `.dark`. Brand, radius and breakpoint switches come from `atomus.css`, which the theme imports.

Use **either** this theme **or** the shadcn/ui theme in one app — both define `bg-primary` with different meanings.
