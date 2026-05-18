---
name: frappe-ui
description: Build consistent Frappe-style user interfaces using the frappe-ui Vue 3 component library and its design tokens. Use when scaffolding pages, forms, dialogs, lists, or any UI inside a Frappe-based app, when the user mentions frappe-ui, Frappe Cloud / Gameplan / Desk / Drive / Insights styling, or asks to "use frappe-ui components".
---

# frappe-ui

Build UIs that look and feel like Frappe products by composing **frappe-ui** components and styling with the library's **semantic Tailwind tokens**. Never hand-roll buttons, inputs, dialogs, dropdowns, etc. — pick the right component first.

## Quick start

```vue
<script setup>
import { Button, Dialog, TextInput, FormControl } from 'frappe-ui'
import { ref } from 'vue'

const open = ref(false)
const name = ref('')
</script>

<template>
  <div class="p-4 bg-surface-white text-ink-gray-9">
    <Button variant="solid" theme="gray" @click="open = true">New Task</Button>
    <Dialog v-model:open="open" title="Create Task">
      <FormControl v-model="name" label="Title" required />
    </Dialog>
  </div>
</template>
```

## Workflow

1. **Pick the component, don't build one.** Consult `COMPONENTS.md` — if any entry fits, use it. Only fall back to raw HTML for layout (grids, flex containers).
2. **Use semantic tokens, not raw colors.** No `bg-gray-100`, `text-gray-900`, `border-gray-300`. Use `bg-surface-*`, `text-ink-*`, `border-outline-*`. See `TOKENS.md`.
3. **Follow the two-axis color rule.** Component color = `variant` (`solid | outline | subtle | ghost`) + `theme` (`gray | blue | green | red | orange`). Never invent `intent`, `kind`, `severity`, `appearance`.
4. **Wire two-way state with `v-model`.** Overlays use `v-model:open`. Inputs use `v-model`. Comboboxes use `v-model` + `v-model:query`. Never `:value` + `@change`.
5. **Use the labeling contract on inputs.** Every input control accepts `label`, `description`, `error`, `required` — use these instead of placeholder hacks or separate `<label>` elements.
6. **Slot vocabulary is fixed.** `#prefix`, `#suffix`, `#trigger`, `#empty`, `#header`, `#footer`, `#default`. Scoped per-item slots: `#item-prefix`, `#item-suffix`. No `#icon-left` / `#avatar-right`.
7. **Icons are CSS classes.** Render an icon as `<span class="lucide-<name> size-4" aria-hidden="true" />`. For frappe-ui props that accept an icon (e.g. `Button.icon`, `Dropdown` option `icon`), pass the namespaced string `"lucide-edit"`. Never import per-icon Vue components.
8. **Imperative for one-shot UI.** Use `dialog.confirm`, `dialog.alert`, `dialog.prompt`, `toast.success/error/info` — don't manually mount `<Dialog>` for confirmations.
9. **API calls go through `useCall`.** Use the `useCall` composable (or `useList` / `useDoc` for higher-level shapes) for every Frappe API call. Never `fetch` / `axios` directly. `immediate: false` + `submit(params)` for writes; default behavior auto-fetches on mount. See `COMPONENTS.md` → Data & resources.

## Reference files

- [SETUP.md](SETUP.md) — scaffolding a fresh Vite + Vue 3 + frappe-ui project: version pinning, `vite.config.js`, Tailwind, PostCSS, CSS entry, plugin vs provider. Read this first when bootstrapping from scratch.
- [COMPONENTS.md](COMPONENTS.md) — component catalog: when to reach for each one, key props, common pitfalls.
- [TOKENS.md](TOKENS.md) — semantic color tokens (`ink-*`, `surface-*`, `outline-*`), typography, spacing, radii.
- [PATTERNS.md](PATTERNS.md) — recipes: form pages, list pages, settings panels, empty states, confirmation flows.

## Authoritative upstream docs

When the bundled refs don't answer a specific API question, fetch the official LLM-friendly index:

- **https://ui.frappe.io/llms.txt** — curated index of every component doc, design-system tokens page, and data-fetching guide. Always current with the published library; follow the links inside for full details on a specific component.

Prefer the upstream `llms.txt` over guessing — it lists every component's docs page and the canonical design-system / data-fetching pages.

## Anti-patterns to flag

- Scaffolding a fresh project with `npm create vite` and using whatever versions it gives you — current defaults (Vite 8 + Tailwind v4) are incompatible with frappe-ui 0.1.x. See [SETUP.md](SETUP.md).
- Importing `'frappe-ui/tailwind/preset'` or `'frappe-ui/src/style.css'` — these paths are not in the package's `exports` map. Use `'frappe-ui/tailwind'` and `'frappe-ui/style.css'`.
- Omitting `optimizeDeps.exclude: ['frappe-ui']` — esbuild's prebundler will choke on the package's `~icons/lucide/*` virtual imports before any Vite plugin runs.
- Forgetting `app.use(FrappeUI)` because you only saw `<FrappeUIProvider>` mentioned — both are required. Plugin handles app-level injections; provider mounts the imperative dialog/toast portals.
- Skipping `vue-router` for single-page prototypes — `<Button>` injects `Symbol(router)` and warns on every render without it.
- Hand-rolled `<button class="bg-blue-500 ...">` instead of `<Button>`.
- Raw Tailwind palette colors (`gray-`, `blue-`) outside the semantic tokens.
- `intent="warning"` / `appearance="primary"` / `kind="success"` props — collapse to `variant` + `theme`.
- Class-injection props (`triggerClass`, `contentClass`). Use the component's `data-slot` / `data-state` attributes from CSS instead.
- Manually mounting `<Dialog>` just to ask "are you sure?" — use `dialog.confirm`.
- Bare `v-model` on `<Dialog>` for visibility — use `v-model:open`.
- Placeholder-as-label on `TextInput` / `Select` / `DatePicker` — pass `label`.
- Raw `fetch` / `axios` for API calls — use `useCall` (or `useList` / `useDoc`).
- `createResource` / `createListResource` / `createDocumentResource` in new code — those are legacy v1 APIs; the v3 composables (`useCall`, `useList`, `useDoc`) are the recommended path.

When in doubt about an API, start at https://ui.frappe.io/llms.txt and follow the link for the component or topic in question. Source lives in the `frappe/frappe-ui` GitHub repo (`src/components/<Name>/`, plus `PHILOSOPHY.md` and `CONTEXT.md` at the repo root).
