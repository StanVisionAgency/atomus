// What the Atomus shadcn registry ships. scripts/generate.mjs turns this into registry.json and copies the
// component sources from react/src and the website sections from sites/docs into atomus/.
//
// Installed layout (every file has an explicit target, so nothing overwrites shadcn/ui's own components/ui/*):
//   components/atomus/utils.ts, components/atomus/<component>.tsx    registry:ui items (source copies of react/src)
//   components/atomus/blocks/<block>.tsx                             app screens (registry:block)
//   components/atomus/sections/<section>.tsx                         website sections (registry:block)
// Imports between them are relative, so they work whatever the project's import aliases are.

export const SITE = 'https://docs.atomus.io';
export const REGISTRY_URL = `${SITE}/r`;

/**
 * One registry:ui item per file in react/src/components.
 * `css`: the "/* <Name> — Figma: … *\/" sections of react/src/styles.css the component needs.
 * `cssDeps`: other items whose CSS it reuses (the TSX imports are detected automatically).
 */
export const COMPONENTS = [
  { file: 'Button', name: 'button', title: 'Button', page: 'components/button', css: ['Button'], exports: ['Button'], description: 'Triggers an action. Five hierarchies (primary, secondary, outline, tertiary, link), five sizes, icons and a loading state.' },
  { file: 'Badge', name: 'badge', title: 'Badge', page: 'components/badge-tag', css: ['Badge'], exports: ['Badge'], description: 'Short status or category label in five colours, light or solid, with an optional dot, icon or remove button.' },
  { file: 'Tag', name: 'tag', title: 'Tag', page: 'components/badge-tag', css: ['Tag'], exports: ['Tag'], description: 'Removable keyword chip for filters and multi-value fields.' },
  { file: 'Input', name: 'input', title: 'Input', page: 'components/input', css: ['Input'], exports: ['Input'], description: 'Text field with label, hint, error message, three sizes and leading/trailing icons.' },
  { file: 'Choice', name: 'checkbox-radio-toggle', title: 'Checkbox, Radio, Toggle', page: 'components/checkbox-radio-toggle', css: ['Checkbox, Radio, Toggle'], exports: ['Checkbox', 'Radio', 'Toggle'], description: 'Native checkbox (with indeterminate), radio and switch controls with label and description.' },
  { file: 'Avatar', name: 'avatar', title: 'Avatar', page: 'components/avatar', css: ['Avatar'], exports: ['Avatar'], description: 'Image, initials or icon avatar in six sizes, circle or rounded, with an online/away/offline status.' },
  { file: 'Alert', name: 'alert', title: 'Alert', page: 'components/alert', css: ['Alert'], exports: ['Alert'], description: 'Inline message in five colours and three styles (subtle, outline, solid) with actions and dismiss.' },
  { file: 'Card', name: 'card', title: 'Card', page: 'components/card', css: ['Card'], exports: ['Card'], description: 'Surface with header (title, supporting text, action), content slot and footer; outlined, elevated or filled.' },
  { file: 'Tabs', name: 'tabs', title: 'Tabs', page: 'components/tabs', css: ['Tabs'], exports: ['Tabs'], description: 'Accessible tab list (arrow keys, Home, End) in underline, pill and segmented styles with counts.' },
  { file: 'ProgressBar', name: 'progress-bar', title: 'Progress bar', page: 'components/progress-bar', css: ['Progress bar'], exports: ['ProgressBar'], description: 'Determinate progress bar with the percentage on the right, below or hidden.' },
  { file: 'MetricCard', name: 'metric-card', title: 'Metric card', page: 'components/metric-card', css: ['Metric card'], exports: ['MetricCard'], description: 'KPI card: label, value, change vs a period and an optional sparkline.' },
  { file: 'EmptyState', name: 'empty-state', title: 'Empty state', page: 'components/empty-state', css: ['Empty state'], exports: ['EmptyState'], description: 'Featured icon, title, description and actions for empty lists, searches and first runs.' },
  { file: 'Icon', name: 'icon', title: 'Icon', page: 'foundations/icons', css: [], exports: ['Icon'], description: 'The small set of glyphs the Atomus components use internally (check, close, status, chevrons, navigation).' },
  { file: 'Menu', name: 'dropdown-menu', title: 'Dropdown menu', page: 'components/dropdown-menu', css: ['Menu item + Dropdown menu'], exports: ['MenuItem', 'DropdownMenu'], description: 'Menu item rows and a keyboard-accessible dropdown / context menu with headings, separators and shortcuts.' },
  { file: 'Select', name: 'select', title: 'Select', page: 'components/select', css: ['Select'], cssDeps: ['input'], exports: ['Select'], description: 'WAI-ARIA select-only combobox with label, hint, error, type-ahead and a hidden input for forms.' },
  { file: 'Modal', name: 'modal', title: 'Modal', page: 'components/modal', css: ['Modal'], exports: ['Modal'], description: 'Dialog on the native <dialog> element (focus trap, Esc, inert background) in three sizes, with a destructive type.' },
  { file: 'Toast', name: 'toast', title: 'Toast', page: 'components/toast', css: ['Toast'], exports: ['Toast', 'ToastProvider', 'useToast'], description: 'Floating notifications: Toast, ToastProvider and the useToast() hook, with auto-dismiss that pauses on hover and focus.' },
  { file: 'Table', name: 'table', title: 'Table', page: 'components/table', css: ['Table'], cssDeps: ['checkbox-radio-toggle'], exports: ['Table'], description: 'Data table with sortable columns, row selection, supporting text, two densities and an empty slot.' },
  { file: 'DatePicker', name: 'date-picker', title: 'Date picker', page: 'components/date-picker', css: ['Calendar + Date picker'], cssDeps: ['input', 'select'], exports: ['Calendar', 'DatePicker'], description: 'Calendar (single or range, keyboard navigation) and a date field that opens it in a popover.' },
  { file: 'Navigation', name: 'navigation', title: 'Navigation', page: 'components/navigation', css: ['Navigation'], exports: ['NavItem', 'SidebarNavigation', 'AppHeader'], description: 'NavItem, SidebarNavigation (280px or a 72px rail) and AppHeader for product apps.' },
  // Agent kit (react/src/components/ai). Shared helpers ship as the `ai-internal` lib item.
  { file: 'ai/PromptInput', name: 'ai-prompt-input', title: 'Prompt input', page: 'components/ai-prompt-input', css: ['Prompt input'], exports: ['PromptInput'], description: 'Chat composer: auto-growing text, attachments, a toolbar slot, Send that turns into Stop while streaming, and / and @ menus.' },
  { file: 'ai/Message', name: 'ai-message', title: 'Message', page: 'components/ai-message', css: ['Message'], exports: ['Message'], description: 'One conversation turn (user, assistant, system or tool) with streaming, error and stopped states, copy, regenerate, edit and branches.' },
  { file: 'ai/StreamingText', name: 'ai-streaming-text', title: 'Streaming text', page: 'components/ai-streaming-text', css: ['Shimmer + Streaming text'], exports: ['StreamingText', 'Shimmer'], description: 'A reply that renders as it streams, with a caret and batched screen-reader announcements, plus a shimmer for status lines.' },
  { file: 'ai/Reasoning', name: 'ai-reasoning', title: 'Reasoning', page: 'components/ai-reasoning', css: ['Reasoning'], exports: ['Reasoning'], description: 'Collapsible "Thought for 12s" disclosure with the agent\'s reasoning steps.' },
  { file: 'ai/ToolCall', name: 'ai-tool-call', title: 'Tool call', page: 'components/ai-tool-call', css: ['Tool call'], exports: ['ToolCall'], description: 'One function call: name, status, duration, and its input and output as JSON.' },
  { file: 'ai/Approval', name: 'ai-approval', title: 'Approval', page: 'components/ai-approval', css: ['Approval'], exports: ['Approval'], description: 'Human-in-the-loop confirmation before an agent acts: risk level, edit then approve, deny, always allow.' },
  { file: 'ai/Sources', name: 'ai-sources', title: 'Sources', page: 'components/ai-sources', css: ['Sources + Inline citation'], exports: ['Sources', 'InlineCitation'], description: 'Citations for an AI answer: a sources list or chips, and numbered inline citations with a preview.' },
  { file: 'ai/Suggestions', name: 'ai-suggestions', title: 'Suggestions', page: 'components/ai-suggestions', css: ['Suggestions'], exports: ['Suggestions'], description: 'Prompt starters and follow-up prompts as chips or cards.' },
  { file: 'ai/ModelSelector', name: 'ai-model-selector', title: 'Model selector', page: 'components/ai-model-selector', css: ['Model selector'], exports: ['ModelSelector'], description: 'Listbox for picking a model, with provider, description, capabilities and a badge.' },
  { file: 'ai/Feedback', name: 'ai-feedback', title: 'Feedback', page: 'components/ai-feedback', css: ['Feedback'], exports: ['Feedback'], description: 'Thumbs up / down on an AI answer, with an optional reason form.' },
  { file: 'ai/AILabel', name: 'ai-label', title: 'AI label', page: 'components/ai-label', css: ['AI label'], exports: ['AILabel'], description: 'Marks AI-generated content, with an explanation popover, the model name and an edited state.' },
  { file: 'ai/ContextMeter', name: 'ai-context-meter', title: 'Context meter', page: 'components/ai-context-meter', css: ['Context meter'], exports: ['ContextMeter'], description: 'How much of the model\'s context window a conversation uses, with a token breakdown and cost.' },
];

/** Internal helpers of the Agent kit (react/src/components/ai/internal.tsx), shipped as a registry:lib item. */
export const AI_INTERNAL = { file: 'ai/internal', name: 'ai-internal', title: 'Agent kit helpers', css: ['_ai-common'], description: 'Helpers and base CSS the Agent kit components share (controllable state, dismiss, durations, the AI mark). Installed automatically with any AI component.' };

/** Hand-written app screens in atomus/blocks/. `uses`: registry items they import. */
export const APP_BLOCKS = [
  { name: 'app-shell', type: 'registry:component', title: 'App shell', description: 'Product layout: sidebar navigation, app header and a scrolling main area. The app screen blocks are built on it.', uses: ['navigation', 'avatar', 'button', 'icon', 'input'] },
  { name: 'dashboard', title: 'Dashboard', description: 'Dashboard screen: KPI metric cards with sparklines, a recent-activity table and a usage card inside the app shell.', uses: ['app-shell', 'metric-card', 'table', 'card', 'badge', 'avatar', 'button', 'progress-bar', 'tabs', 'icon'] },
  { name: 'settings', title: 'Settings', description: 'Account settings screen: tabs, profile form, notification toggles and a danger zone with a confirmation modal.', uses: ['app-shell', 'tabs', 'card', 'input', 'select', 'checkbox-radio-toggle', 'button', 'avatar', 'modal', 'alert'] },
  { name: 'auth', title: 'Sign in', description: 'Centered sign-in card for product apps: email and password, remember me, SSO button and a sign-up link.', uses: ['card', 'input', 'checkbox-radio-toggle', 'button', 'alert'] },
  { name: 'table-view', title: 'Table view', description: 'List screen: page header, search and filters, a selectable sortable table with status badges and row actions, an empty state and pagination.', uses: ['app-shell', 'table', 'input', 'select', 'badge', 'avatar', 'button', 'empty-state', 'icon'] },
  { name: 'ai-chat', title: 'AI chat', description: 'AI chat screen built from the Conversation pattern: header with AI label and context meter, a role="log" thread of Messages with reasoning, tool calls, approvals, streamed text and sources, a welcome state with prompt starters, and a docked Prompt input with a model selector. Bring your own AI SDK: it takes plain messages and a status.', uses: ['ai-message', 'ai-streaming-text', 'ai-reasoning', 'ai-tool-call', 'ai-approval', 'ai-sources', 'ai-suggestions', 'ai-prompt-input', 'ai-model-selector', 'ai-feedback', 'ai-label', 'ai-context-meter', 'button', 'icon'] },
];
