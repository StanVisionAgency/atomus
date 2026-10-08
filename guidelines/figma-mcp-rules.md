# Figma MCP rules for Atomus

Rules for an agent that reads Atomus designs through the Figma MCP server (`get_design_context`, `get_screenshot`, `get_variable_defs`, `get_code_connect_map`, `search_design_system`, `use_figma`) and turns them into code, or writes designs back into Figma. Add this file to your agent's rules next to `Guidelines.md`.

The Figma MCP output is a **reference, not final code**. It describes layers in generic React and Tailwind with raw values. Your job is to rebuild the design with Atomus components and tokens.

## Files

- The Atomus library file key is `bC42e82J3PYg2LMkryodIA` (Atomus 4.0). The file is sold separately; teams work in a duplicate per client project, so the key in a link you are given is usually that duplicate. Parse it from the URL: `figma.com/design/<fileKey>/<name>?node-id=<a-b>` → node id `a:b`.
- Code Connect mappings live in `react/src/components/*.figma.tsx`. When they are published, `get_design_context` returns the real `@stanvision/atomus-react` snippet for each mapped instance.

## Workflow: Figma to code

1. **Get the context.** Call `get_design_context` for the frame you were given, and `get_screenshot` to see it. If the frame is large, call `get_metadata` first and fetch child frames one at a time.
2. **Read the modes on the top frame.** Light/Dark, Brand, Radius and Desktop/Tablet/Mobile are set on the top frame. Translate them to `data-theme`, `data-brand` and `data-radius` on the root element. Breakpoint modes need no attribute because the CSS handles them.
3. **Map every instance to a component.**
   - The instance has a Code Connect snippet → use it as written.
   - No snippet → match the Figma component name to `overview-components.md` and open its guideline file. Use the React export if there is one; otherwise follow the file's "React API" note for what to compose it from.
   - It is a website section ("Hero section", "Pricing section") → build it from `website-sections.md`; keep the section order.
4. **Map properties to props.** Use the guideline's React API table (it lists the Figma name for each prop):
   - Variant properties become lowercase string props: Hierarchy=Primary → `hierarchy="primary"`, Size=md → `size="md"`, Style=Outlined → `variant="outlined"`.
   - **State is not a prop.** Hover, Focused and Active come from CSS. Disabled → `disabled`, Loading → `loading`, Error → `error="…message"`, Selected/Active → the component's selection prop (`value`, `active`).
   - Boolean + instance-swap pairs (Leading icon + Leading icon swap) → one prop with an icon node (`iconLeading={<Icon />}`). Off → omit the prop.
   - Text properties (Label, Title, Description) → `children` or the prop with that name.
   - Slot content (Content, Items, Actions) → `children`, `items`, `actions`, `footer`.
5. **Map variables to tokens.** Call `get_variable_defs` and use the variable's code syntax. It is the CSS name: `Text/text-primary` → `var(--color-text-primary)`, `Background/bg-brand-solid_hover` → `var(--color-bg-brand-solid-hover)`, `Spacing/spacing-xl` → `var(--spacing-xl)`, `Layout/layout-md` → `var(--layout-md)`, `radius-md` → `var(--radius-md)`.
6. **Map text styles to classes.** Figma text style `Headline/H2` → `.text-headline-h2`; `Content/Body` → `.text-content-body`; `Web/Heading lg` → `.text-web-heading-lg`. The full list is in `foundations/typography.md`.
7. **Lay out with tokens.** Turn auto layout into flex/grid with `gap` and `padding` from `--spacing-*` (inside components) and `--layout-*` (between blocks). Use the Desktop frame (1440) for structure and check the Tablet (768) and Mobile (375) frames for what changes.
8. **Validate.** Run `node skills/atomus/scripts/validate.mjs <files>` and compare your result with the screenshot in light and dark.

## Always

- Use Atomus components for every instance of an Atomus component, even when the MCP output inlines it as divs.
- Use semantic tokens for every colour, gap, padding, radius, shadow and font size.
- Keep one primary button per view. If the design shows two, flag it.
- Keep icons as icon components from your icon library (Font Awesome names match the Figma icon names). Download image assets only for photos and illustrations.
- Keep labels, `aria-label`s and alt text, even when the design hides the label.

## Never

- Never copy hex values, pixel paddings or font sizes from the MCP output. Map them to tokens. If a value has no token, the layer is probably detached: flag it.
- Never reproduce a component's internals (its padding, border, radius) with divs and utility classes.
- Never invent props from Figma property names that are not in the React API (for example a `state` prop). Check the guideline file.
- Never use absolute positioning from the frame coordinates for layout.
- Never set themes per element to match a single layer's mode. Modes belong on the top frame / root.
- Never ship the MCP output's generated Tailwind classes (`bg-[#4057ff]`, `p-[17px]`) as they are.

## When the design is off-system

Flag these to a human instead of guessing:

- Detached instances, or layers named `Frame 123` that look like components.
- Raw colours or sizes with no matching variable.
- A component or variant that is not in the guidelines.
- Two primary buttons in one view, or text that fails contrast.

## Writing to Figma (`use_figma`)

- Call `search_design_system` first and insert Atomus components from the library. Never draw a component from rectangles and text.
- Set Light/Dark, Brand, Radius and breakpoint modes on the top frame only.
- Fill slots and use instance swaps for icons; never detach.
- Bind every fill, stroke, gap, padding, radius and text style to Atomus variables and styles.
- Build pages from website sections (Desktop 1440, Tablet 768, Mobile 375) and keep one Breakpoint variant per frame.
