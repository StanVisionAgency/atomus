# Navigation

`AppHeader` (top bar), `SidebarNavigation` (280px, or a 72px rail) and `NavItem` rows.

## Provide

- `NavItem` — `label`, `href`, `icon`, `badge`, `chevron`, `active` (sets `aria-current="page"`), `collapsed` (icon only, label as tooltip and accessible name).
- `SidebarNavigation` — `header`, `children` (NavItems), `footer`, `collapsed`.
- `AppHeader` — `brand`, `nav`, `actions`; the nav hides below 768px, so pair it with a menu button.

## Don't

- Don't mix a sidebar and a header nav with the same links.
