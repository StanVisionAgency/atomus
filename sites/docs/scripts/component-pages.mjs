// One docs page per component, grouped by category in the sidebar.
// Each page pulls its "In Figma" content from guideline sections: [file in guidelines/components, "## Section" name].
// Pages with a React component have a hand-written source in src/component-pages/<slug>.mdx (demo + usage);
// pages without one are generated from the guidelines alone and marked "Figma only".
// `figma` lists the Code Connect components (react/src/components/*.figma.ts, `// component=` header) whose Figma links the page shows.
// `api` lists the React exports whose generated "React API" tables (guidelines/components/*.md) the page shows;
// it defaults to `figma`. Every React API entry must land on a page, like every guideline section.
// Old /figma-reference/<file>/ URLs redirect to the first page that uses <file>.

export const CATEGORIES = [
  'Actions',
  'Forms & inputs',
  'Feedback',
  'Navigation',
  'Data display',
  'Overlays',
  'Layout & content',
  'Media & assets',
  'Charts',
  'AI',
];

const s = (file, ...sections) => sections.map((name) => [file, name]);

export const COMPONENT_PAGES = [
  // Actions
  { slug: 'button', category: 'Actions', react: true, figma: ['Button'], sections: s('button', 'Button', 'Button icon') },
  { slug: 'button-group', title: 'Button group', category: 'Actions', sections: s('button-group', 'Button group', 'Button group item') },

  // Forms & inputs
  { slug: 'input', category: 'Forms & inputs', react: true, figma: ['Input'], sections: s('input-select', 'Input', 'Textarea', 'Number input', 'Verification code input', 'Tags input', 'Phone input', 'Payment input') },
  { slug: 'select', category: 'Forms & inputs', react: true, figma: ['Select'], sections: s('input-select', 'Select', 'Multi-select') },
  { slug: 'checkbox-radio-toggle', category: 'Forms & inputs', react: true, figma: ['Checkbox', 'Radio', 'Toggle'], sections: [...s('checkbox-radio', 'Checkbox', 'Radio'), ...s('toggle', 'Toggle')] },
  { slug: 'date-picker', category: 'Forms & inputs', react: true, figma: ['DatePicker', 'Calendar'], sections: s('date-time-pickers', 'Date picker', 'Date input', 'Calendar day') },
  { slug: 'slider', title: 'Slider', category: 'Forms & inputs', sections: s('input-select', 'Slider') },
  { slug: 'file-upload', title: 'File upload', intro: 'A drop zone and upload rows with progress, success and error states.', category: 'Forms & inputs', sections: s('empty-state-file-upload', 'File upload', 'File upload item') },
  { slug: 'color-picker', title: 'Color picker', category: 'Forms & inputs', sections: s('tree-editor-color-picker', 'Color picker', 'Color swatch') },
  { slug: 'text-editor', title: 'Text editor', category: 'Forms & inputs', sections: s('tree-editor-color-picker', 'Text editor', 'Editor toolbar button') },

  // Feedback
  { slug: 'alert', category: 'Feedback', react: true, figma: ['Alert'], sections: s('message-alert', 'Alert') },
  { slug: 'toast', category: 'Feedback', react: true, figma: ['Toast'], api: ['Toast', 'ToastProvider', 'useToast'], sections: s('message-alert', 'Toast') },
  { slug: 'banner', title: 'Banner', category: 'Feedback', sections: s('metrics-feeds', 'Banner') },
  { slug: 'notifications', title: 'Notifications', category: 'Feedback', sections: s('message-alert', 'Notifications panel', 'Notification item') },
  { slug: 'progress-bar', category: 'Feedback', react: true, figma: ['ProgressBar'], sections: s('progress-loading', 'Progress bar', 'Progress circle') },
  { slug: 'loading-skeleton', title: 'Loading & skeleton', intro: 'Spinners for short waits and skeletons that hold the layout while content loads.', category: 'Feedback', sections: s('progress-loading', 'Loading indicator', 'Skeleton') },
  { slug: 'empty-state', category: 'Feedback', react: true, figma: ['EmptyState'], sections: s('empty-state-file-upload', 'Empty state') },

  // Navigation
  { slug: 'navigation', category: 'Navigation', react: true, figma: ['AppHeader', 'SidebarNavigation', 'NavItem'], sections: s('navigation', 'App header', 'Sidebar navigation', 'Nav item') },
  { slug: 'tabs', category: 'Navigation', react: true, figma: ['Tabs'], sections: s('tabs', 'Tabs', 'Tab', 'Vertical tabs') },
  { slug: 'breadcrumb', title: 'Breadcrumb', category: 'Navigation', sections: s('breadcrumb', 'Breadcrumb', 'Breadcrumb item') },
  { slug: 'pagination', title: 'Pagination & carousel', intro: 'Pagination for tables and lists, and carousel controls for marketing galleries.', category: 'Navigation', sections: s('pagination', 'Pagination', 'Pagination number', 'Carousel', 'Carousel dots') },
  { slug: 'progress-steps', title: 'Progress steps', intro: 'Multi-step flow indicator for onboarding, checkout and setup wizards.', category: 'Navigation', sections: s('progress-loading', 'Progress steps', 'Step') },

  // Data display
  { slug: 'table', category: 'Data display', react: true, figma: ['Table'], sections: s('table', 'Table header cell', 'Table cell', 'Filter bar') },
  { slug: 'badge-tag', category: 'Data display', react: true, figma: ['Badge', 'Tag'], sections: s('badge', 'Badge', 'Tag') },
  { slug: 'avatar', category: 'Data display', react: true, figma: ['Avatar'], sections: s('avatar', 'Avatar', 'Avatar photo', 'Avatar group', 'Avatar label group') },
  { slug: 'metric-card', category: 'Data display', react: true, figma: ['MetricCard'], sections: s('metrics-feeds', 'Metric card') },
  { slug: 'activity-item', title: 'Activity item', intro: 'A feed or notification row: who did what, and when.', category: 'Data display', sections: s('metrics-feeds', 'Activity item') },
  { slug: 'code-snippet', title: 'Code snippet', category: 'Data display', sections: s('metrics-feeds', 'Code snippet') },
  { slug: 'tree-view', title: 'Tree view', intro: 'Nested, expandable lists for files, folders and navigation hierarchies.', category: 'Data display', sections: s('tree-editor-color-picker', 'Tree view', 'Tree item') },
  { slug: 'messaging', title: 'Messaging', category: 'Data display', sections: s('messaging', 'Chat', 'Message bubble', 'Message input') },

  // Overlays
  { slug: 'modal', category: 'Overlays', react: true, figma: ['Modal'], sections: s('modal', 'Modal') },
  { slug: 'dropdown-menu', category: 'Overlays', react: true, figma: ['DropdownMenu', 'MenuItem'], sections: s('menu', 'Dropdown menu', 'Menu item', 'Context menu') },
  { slug: 'tooltip-popover', title: 'Tooltip & popover', category: 'Overlays', sections: s('tooltip-popover', 'Tooltip') },
  { slug: 'drawer', title: 'Drawer & slideout', category: 'Overlays', sections: s('slideout-command-menu', 'Drawer', 'Slideout menu') },
  { slug: 'command-menu', title: 'Command menu', category: 'Overlays', sections: s('slideout-command-menu', 'Command menu') },

  // Layout & content
  { slug: 'card', category: 'Layout & content', react: true, figma: ['Card'], sections: s('card', 'Card', 'Card header', 'Section footer', 'Inline CTA') },
  { slug: 'headers-dividers', title: 'Headers & dividers', category: 'Layout & content', sections: s('headers-dividers', 'Page header', 'Section header', 'Divider') },

  // Media & assets
  { slug: 'atomus-icons', title: 'Atomus icons', intro: 'Icon sets beyond the UI icons: featured icons, brand and payment marks, flags, file types, folders, integrations and star ratings.', category: 'Media & assets', sections: s('atomus-icons', 'Featured icon', 'Icon brand', 'Icon payment', 'Icon flag', 'Icon file type', 'Icon folder', 'Icon integration', 'Star rating') },
  { slug: 'shared-assets', title: 'Shared assets', intro: 'Mockups and annotation kit used across product and marketing files: credit card, video player, email template, status tags and spec annotations.', category: 'Media & assets', sections: s('shared-assets', 'Credit card', 'Video player', 'Email template', 'Status tag', 'Annotation marker', 'Annotation note', 'Spec line', 'A11y annotation') },

  // Charts
  { slug: 'charts', title: 'Charts', intro: 'Line, bar, pie, radar and gauge charts for dashboards and reports, with a shared legend item.', category: 'Charts', sections: s('charts', 'Line chart', 'Bar chart', 'Pie chart', 'Radar chart', 'Activity gauge', 'Chart legend item') },

  // AI — Agent kit (react/src/components/ai). Conversation is a docs-only composition of the parts.
  { slug: 'ai-conversation', category: 'AI', react: true, api: ['Message'], sections: s('ai-message', 'Conversation') },
  { slug: 'ai-prompt-input', category: 'AI', react: true, api: ['PromptInput'], sections: s('ai-prompt-input', 'Prompt input') },
  { slug: 'ai-message', category: 'AI', react: true, api: ['Message'], sections: s('ai-message', 'Message') },
  { slug: 'ai-streaming-text', category: 'AI', react: true, api: ['StreamingText', 'Shimmer'], sections: s('ai-streaming-text', 'Streaming text', 'Shimmer') },
  { slug: 'ai-reasoning', category: 'AI', react: true, api: ['Reasoning'], sections: s('ai-reasoning', 'Reasoning') },
  { slug: 'ai-tool-call', category: 'AI', react: true, api: ['ToolCall'], sections: s('ai-tool-call', 'Tool call') },
  { slug: 'ai-approval', category: 'AI', react: true, api: ['Approval'], sections: s('ai-approval', 'Approval') },
  { slug: 'ai-sources', category: 'AI', react: true, api: ['Sources', 'InlineCitation'], sections: s('ai-sources', 'Sources', 'Inline citation') },
  { slug: 'ai-suggestions', category: 'AI', react: true, api: ['Suggestions'], sections: s('ai-suggestions', 'Suggestions') },
  { slug: 'ai-model-selector', category: 'AI', react: true, api: ['ModelSelector'], sections: s('ai-model-selector', 'Model selector') },
  { slug: 'ai-feedback', category: 'AI', react: true, api: ['Feedback'], sections: s('ai-feedback', 'Feedback') },
  { slug: 'ai-label', category: 'AI', react: true, api: ['AILabel'], sections: s('ai-label', 'AI label') },
  { slug: 'ai-context-meter', category: 'AI', react: true, api: ['ContextMeter'], sections: s('ai-context-meter', 'Context meter') },
];

/** Sidebar groups for astro.config.mjs. */
export function componentSidebar() {
  return [
    { label: 'Overview', link: '/components/' },
    { label: 'Choosing a component', link: '/components/choosing/' },
    ...CATEGORIES.map((label) => ({
      label,
      collapsed: true,
      items: COMPONENT_PAGES.filter((p) => p.category === label).map((p) => `components/${p.slug}`),
    })),
  ];
}

/** Old Figma reference URLs → the merged component page. */
export function figmaReferenceRedirects() {
  const out = { '/figma-reference': '/components/' };
  for (const p of COMPONENT_PAGES) {
    for (const [file] of p.sections) {
      const from = `/figma-reference/${file}`;
      if (!out[from]) out[from] = `/components/${p.slug}/`;
    }
  }
  return out;
}
