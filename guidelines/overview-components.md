# Components: catalogue and decision trees

Use this file to pick the right component before you write code or design. For props and rules, open the component's file in `components/`. Its **React API** section lists every prop, value and default.

**React** names the export from `@stanvision/atomus-react`. "—" means the component is **Figma only**. Don't import it in code. Compose it from tokens and the React components named in its guideline file.

## Catalogue

### Actions

| Component | Use it for | React | Guideline |
|---|---|---|---|
| Button | Triggering an action. Hierarchies primary · secondary · outline · tertiary · link; sizes xs–xl (24–56px). | `Button` | `components/button.md` |
| Button icon | Icon-only action in toolbars and rows. Always has an `aria-label`. | `Button iconOnly` | `components/button.md` |
| Button group | 2–5 joined, mutually exclusive options (view or filter switch). | — (use `Tabs variant="segmented"`) | `components/button-group.md` |

### Forms and inputs

| Component | Use it for | React | Guideline |
|---|---|---|---|
| Input | Single-line text, email, number, search. Sizes sm · md · lg (32 · 40 · 48). | `Input` | `components/input-select.md` |
| Textarea | Multi-line text. | — | `components/input-select.md` |
| Number input, Phone input, Payment input, Verification code input, Tags input | Formatted text entry. | — | `components/input-select.md` |
| Select | One value from a list (6+ options, or when space is tight). | `Select` | `components/input-select.md` |
| Multi-select | Several values from a list, shown as tags. | — | `components/input-select.md` |
| Slider | A value or range on a continuous scale. | — | `components/input-select.md` |
| Checkbox | Independent yes/no choices; several can be on. | `Checkbox` | `components/checkbox-radio.md` |
| Radio | One choice from 2–5 visible options. | `Radio` | `components/checkbox-radio.md` |
| Toggle | A setting that applies immediately. | `Toggle` | `components/toggle.md` |
| Date input, Date picker, Calendar day | Picking a date or a range. | `DatePicker`, `Calendar` | `components/date-time-pickers.md` |
| File upload, File upload item | Drop zone and per-file progress. | — | `components/empty-state-file-upload.md` |
| Color picker, Color swatch | Picking a colour. | — | `components/tree-editor-color-picker.md` |
| Text editor, Editor toolbar button | Rich-text editing. | — | `components/tree-editor-color-picker.md` |

### Feedback

| Component | Use it for | React | Guideline |
|---|---|---|---|
| Alert | A persistent message about a page, section or form. | `Alert` | `components/message-alert.md` |
| Toast | A short, temporary confirmation of something the user just did. | `Toast`, `ToastProvider`, `useToast` | `components/message-alert.md` |
| Banner | One product- or account-wide announcement across the top of the page. | — | `components/metrics-feeds.md` |
| Notifications panel, Notification item | The bell-icon inbox. | — | `components/message-alert.md` |
| Progress bar, Progress circle | Progress of a task with a known percentage. | `ProgressBar` (bar only) | `components/progress-loading.md` |
| Loading indicator | A spinner for short waits of unknown length. | — (`Button loading` for buttons) | `components/progress-loading.md` |
| Skeleton | A placeholder that holds the layout while content loads. | — | `components/progress-loading.md` |
| Empty state | An empty page, table or panel, with an icon, explanation and action. | `EmptyState` | `components/empty-state-file-upload.md` |

### Navigation

| Component | Use it for | React | Guideline |
|---|---|---|---|
| Sidebar navigation, Nav item | The main app navigation (280px, or a 72px rail). | `SidebarNavigation`, `NavItem` | `components/navigation.md` |
| App header | Top bar of an app: brand, links, search, notifications, account. | `AppHeader` | `components/navigation.md` |
| Tabs, Tab | Switching between views of the same content (underline · pill · segmented). | `Tabs` | `components/tabs.md` |
| Vertical tabs | Settings sub-navigation. | — (list of `NavItem`) | `components/tabs.md` |
| Breadcrumb | The path to the current page in deep hierarchies. | — | `components/breadcrumb.md` |
| Pagination, Carousel | Paging tables and lists; stepping through galleries. | — | `components/pagination.md` |
| Progress steps, Step | A multi-step flow (onboarding, checkout, setup). | — | `components/progress-loading.md` |
| Header navigation, Footer | Website header and footer. | — | `website-sections.md` |

### Data display

| Component | Use it for | React | Guideline |
|---|---|---|---|
| Table (header cell, cell) | Rows of records you compare, sort and select. | `Table` | `components/table.md` |
| Filter bar | Search, filters and actions above a table. | — | `components/table.md` |
| Badge | A short status or count label. | `Badge` | `components/badge.md` |
| Tag | A removable value: filter, skill, recipient. | `Tag` | `components/badge.md` |
| Avatar, Avatar group, Avatar label group | A person or workspace. | `Avatar` | `components/avatar.md` |
| Metric card | A KPI: number, change and period. | `MetricCard` | `components/metrics-feeds.md` |
| Activity item | A feed row: who did what, when. | — | `components/metrics-feeds.md` |
| Code snippet | Copyable code. | — | `components/metrics-feeds.md` |
| Tree view, Tree item | Nested, expandable hierarchies (files, categories). | — | `components/tree-editor-color-picker.md` |
| Chat, Message bubble, Message input | Messaging. | — | `components/messaging.md` |
| Charts | Line, bar, pie, radar, activity gauge, legend item. | — | `components/charts.md` |

### Overlays

| Component | Use it for | React | Guideline |
|---|---|---|---|
| Modal | A focused task or decision that blocks the page. Sizes 400 · 544 · 720px. | `Modal` | `components/modal.md` |
| Dropdown menu, Menu item | A short list of actions from a trigger. | `DropdownMenu`, `MenuItem` | `components/menu.md` |
| Context menu | Right-click actions. | `DropdownMenu` | `components/menu.md` |
| Tooltip | A one-sentence hint on hover or focus. | — | `components/tooltip-popover.md` |
| Drawer, Slideout menu | A side panel for details or secondary forms. | — | `components/slideout-command-menu.md` |
| Command menu | ⌘K search and actions. | — | `components/slideout-command-menu.md` |

### Layout and content

| Component | Use it for | React | Guideline |
|---|---|---|---|
| Card (Card header, Section footer) | A bounded group of related content with optional header and footer. | `Card` | `components/card.md` |
| Inline CTA | A call to action inside app pages or articles. | — | `components/card.md` |
| Page header | Top of an app page: breadcrumb, title, description, actions, tabs. | — | `components/headers-dividers.md` |
| Section header | A heading for a section inside a page. | — | `components/headers-dividers.md` |
| Divider | A rule between groups, optionally with a label. | — | `components/headers-dividers.md` |
| Website sections | Hero, features, pricing, FAQ, CTA … 30 responsive sections. | — | `website-sections.md` |

### Media and assets

| Component | Use it for | React | Guideline |
|---|---|---|---|
| Featured icon | An icon in a tinted circle or square for empty states, modals and feature lists. | — | `components/atomus-icons.md` |
| Icon sets | Brand, payment, flag, file-type, folder and integration icons; star rating. | — | `components/atomus-icons.md` |
| Shared assets | Mockups and annotation kit (design files only). | — | `components/shared-assets.md` |

## Also called

If a request uses one of these names, use the Atomus component on the right.

| You may hear | Atomus component |
|---|---|
| dialog, popup, lightbox, confirm dialog | Modal |
| sheet, side sheet, side panel, off-canvas, flyout | Drawer |
| snackbar, notification (temporary), flash message | Toast |
| callout, inline message, notice | Alert |
| announcement bar, top bar message | Banner |
| chip, pill, token (removable) | Tag |
| pill, label, status, lozenge (read-only) | Badge |
| switch | Toggle |
| dropdown (picks a value), picker | Select |
| dropdown (runs actions), kebab menu, overflow menu, action menu | Dropdown menu |
| right-click menu | Context menu |
| combobox, autocomplete, typeahead | Select. A searchable combobox is not in Atomus yet (see the decision tree below). |
| segmented control, toggle group | Tabs `variant="segmented"` (code) / Button group (Figma) |
| stepper, wizard | Progress steps |
| spinner, loader | Loading indicator (`Button loading` inside buttons) |
| placeholder, shimmer | Skeleton |
| zero state, blank slate, no results | Empty state |
| dropzone, uploader | File upload |
| data grid, data table, list view | Table |
| KPI, stat, scorecard | Metric card |
| navbar, top nav (app) | App header |
| navbar, site header (website) | Header navigation |
| side nav, rail | Sidebar navigation |
| panel, tile, box, container | Card |
| separator, hr, rule | Divider |
| page title, page heading | Page header |
| command palette, ⌘K, spotlight | Command menu |
| hint, info bubble | Tooltip |
| accordion | FAQ item (website) |
| range slider | Slider |
| image slider, gallery | Carousel |
| user picture, profile image | Avatar |
| rating | Star rating |
| rich text editor, WYSIWYG | Text editor |

## Decision trees

### Which button hierarchy?

1. Is it **the** main action of this view (screen, modal, card, form)? → `primary`. There is only one per view.
2. Is it an alternative to the main action ("Cancel", "Save draft", "Export")? → `outline` on white surfaces, `secondary` on grey or in dense groups.
3. Is it in a toolbar, table row, card header or another dense spot? → `tertiary` (often `iconOnly` with an `aria-label`).
4. Does it sit inside a sentence or look like a link ("Learn more", "Edit")? → `link`.
5. Is it destructive? → In a confirmation Modal (`type="destructive"`) the confirm button is the `primary`. Elsewhere use `outline` and confirm first. Never use `link` for destructive actions.
6. Does it go to another page? → Use a link (`<a>`, or `NavItem` in navigation), not a Button.

Sizes: `md` in product UI, `sm`/`xs` in tables and toolbars, `lg`/`xl` on marketing pages. Match the inputs on the same row.

### Input, Textarea, Select, Multi-select, Combobox, Radio, Checkbox or Toggle?

1. Is the answer free text?
   - One line → **Input** (`type="email"`, `"number"`, `"search"` …).
   - Several lines → **Textarea** (Figma only; in code a native `<textarea>` styled with tokens).
2. Is it a choice from known options?
   - **One** value:
     - 2–5 options and there is room to show them all → **Radio** group. Use **Tabs `variant="segmented"`** when the choice switches a view.
     - 6 or more options, or no room → **Select**.
     - Very long or searchable list (countries, users) → a **combobox**. It is not in Atomus yet: use **Select** up to about 15 options, and for longer lists flag it to a human instead of building your own.
   - **Several** values:
     - Few options, all visible → **Checkbox** group.
     - Many options → **Multi-select** (Figma only; in code compose Select-like UI with `Tag`s, or flag it).
3. Is it a single on/off?
   - It applies **immediately** (a setting) → **Toggle**.
   - It is submitted with a form ("I agree", "Remember me") → **Checkbox**.
4. Is it a date? → **DatePicker** (`type="range"` for ranges). Birth dates and far dates → a typed date **Input**.

### Alert, Toast, Banner, Modal, field error or Empty state?

1. Is the message about **one form field**? → the field's `error` prop (Input, Select, DatePicker). Not an Alert.
2. Must the user **decide or confirm** before continuing (delete, discard changes)? → **Modal**.
3. Does it confirm something the user **just did**, and is it fine if it disappears ("Saved", "Invite sent")? → **Toast** (`useToast().show`). Errors stay until closed.
4. Is it about **this page, section or form** and should it stay visible until resolved ("Your trial ends in 3 days", "3 rows failed to import")? → **Alert**. Use `variant="solid"` only for blocking issues.
5. Is it **product- or account-wide** and shown across the top of every page ("Scheduled maintenance Sunday")? → **Banner** (one at a time).
6. Is there **no content yet** (first use, no results, cleared inbox)? → **Empty state** in place of the content.
7. Is it a history of events the user checks later? → **Notifications panel**.

### Card or Section?

1. Is it a **bounded, self-contained group** (a settings group, a chart, a form, one record) that sits next to similar groups on a page? → **Card** (`title`, `footer`, Content slot).
2. Is it a **band of a page** that spans the content width (a settings area with several groups, or a marketing section)? → a **section**: a `<section>` with a **Section header** and `--layout-*` spacing. Use a website section on marketing pages. Don't wrap a whole page section in a Card.
3. Is it one item in a **list or grid** of similar items (projects, pricing plans, blog posts)? → **Card** per item (marketing: Pricing card, Blog card).
4. Is it a single **call to action** inside content? → **Inline CTA**.
5. Would the card sit **inside another card**? → Don't. Use a Divider, a Section header or a filled area (`--color-bg-secondary`) instead.

Card style: `outlined` on white backgrounds, `filled` on grey, `elevated` only when it floats above content.

### Tabs, segmented control, Button group, Vertical tabs, Sidebar or Progress steps?

1. Do the options show **different views of the same content** on one page? → **Tabs** (`underline` under a Page header, `pill` inside cards).
2. Is it a **compact switch** of 2–5 options, like a view mode or a time range? → **Tabs `variant="segmented"`** (Figma: Button group or Segmented tab).
3. Is it **sub-navigation for settings** with many sections? → **Vertical tabs** (code: a list of `NavItem`s).
4. Is it **app-wide navigation** between areas? → **Sidebar navigation** (or **App header** links for apps with few areas).
5. Are the options **sequential steps**? → **Progress steps**. Never tabs.

### Modal, Drawer, Dropdown menu, Tooltip or Command menu?

1. A decision or short focused task that must block the page → **Modal**.
2. Details of a record, or a secondary form, while keeping the page in view → **Drawer** (Bottom position on mobile).
3. A list of actions or options from a trigger → **Dropdown menu** (up to about 10 items).
4. A one-sentence hint about an icon or truncated text → **Tooltip**. No links or buttons inside.
5. Searching everything and running commands with the keyboard → **Command menu**.
6. A long form or multi-step flow → a **page**, not an overlay.

### Badge, Tag or Status tag?

- A read-only **status or count** ("Active", "Overdue", "3") → **Badge**. Pick the colour by meaning.
- A **value the user added and can remove** (filter, skill, recipient) → **Tag** with `onRemove`.
- A **design-file annotation** (Ready, In progress) → **Status tag** (shared assets, Figma only).

### Progress bar, Loading indicator, Skeleton or Button loading?

1. Is the percentage known (upload, storage used)? → **Progress bar**.
2. Is a button's action running? → `<Button loading>`.
3. Is content loading and the layout known? → **Skeleton**.
4. Is it a short wait with unknown layout? → **Loading indicator**.
5. Is it a multi-step flow? → **Progress steps**.

### Table, cards, metric cards or a chart?

- **Records with the same fields** that people compare, sort or select → **Table**, with Filter bar above and Pagination below over about 25 rows.
- **A few items with visuals or mixed content** (projects, integrations) → a grid of **Card**s.
- **Headline numbers** (up to four in a row) → **Metric card**s.
- **A trend or a comparison over time** → a **chart** (line for time, bar for categories).
