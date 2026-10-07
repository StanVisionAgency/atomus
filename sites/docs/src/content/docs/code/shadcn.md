---
title: shadcn/ui
description: Map shadcn/ui's theme variables onto Atomus tokens.
---

Replace the `:root` / `.dark` blocks in your `globals.css` with [`shadcn/globals.css`](https://github.com/StanVisionAgency/atomus/blob/main/shadcn/globals.css), after `@import "tailwindcss"`.

| shadcn variable | Atomus token |
| --- | --- |
| `--background`, `--card`, `--popover` | `bg-primary` |
| `--foreground` | `text-primary` |
| `--primary` / `--primary-foreground` | `bg-brand-solid` / `text-on-brand` |
| `--secondary` | `bg-secondary` |
| `--muted` / `--muted-foreground` | `bg-tertiary` / `text-tertiary` |
| `--accent` / `--accent-foreground` | `bg-brand-subtle` / `text-brand` |
| `--destructive` | `bg-error-solid` |
| `--border` / `--input` / `--ring` | `border-secondary` / `border-primary` / `border-focus` |
| `--chart-1 … 5` | brand 600, 400, 200, gray 400, 200 |
| `--sidebar-*` | sidebar surfaces and accents |
| `--radius` | `radius-lg` |

Brand, theme and radius modes keep working: shadcn components follow `data-brand`, `data-theme` and `data-radius`.
