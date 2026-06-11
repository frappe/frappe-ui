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
  <div class="p-4 bg-surface-base text-ink-gray-9">
    <Button variant="solid" theme="gray" @click="open = true">New Task</Button>
    <Dialog v-model:open="open" title="Create Task">
      <FormControl v-model="name" label="Title" required />
    </Dialog>
  </div>
</template>
```

## Rules

Each rule states what to do and what to avoid — one canonical place, no separate anti-pattern list.

1. **Pick the component, don't build one.** Consult `COMPONENTS.md`; only fall back to raw HTML for layout (grids, flex). Never hand-roll `<button class="bg-blue-500 …">`.
2. **Semantic tokens, not raw colors.** `bg-surface-*`, `text-ink-*`, `border-outline-*` — never `bg-gray-100`, `text-gray-900`, `border-gray-300`. See `TOKENS.md`.
3. **Color = `variant` + `theme`.** `variant` (`solid | outline | subtle | ghost`) + `theme` (`gray | blue | green | red | orange`). Never invent `intent` / `kind` / `severity` / `appearance`.
4. **Two-way state via `v-model`.** Inputs `v-model`; overlays `v-model:open`; comboboxes `v-model` + `v-model:query`. Never `:value` + `@change`, never bare `v-model` on `<Dialog>`. Writes: `immediate: false` + `submit(params)`.
5. **Use the input labeling contract.** Every control accepts `label`, `description`, `error`, `required` — use them, not placeholder-as-label or a separate `<label>`.
6. **Slot vocabulary is fixed.** `#prefix`, `#suffix`, `#trigger`, `#empty`, `#header`, `#footer`, `#default`; per-item `#item-prefix` / `#item-suffix`. No `#icon-left` / `#avatar-right`.
7. **Icons are CSS classes.** `<span class="lucide-<name> size-4" aria-hidden="true" />`; for icon props pass the string `"lucide-edit"`. Never import per-icon Vue components. See `COMPONENTS.md` → Icons.
8. **Imperative for one-shot UI.** `dialog.confirm` / `alert` / `prompt`, `toast.success` / `error` / `info` — don't hand-mount `<Dialog>` to ask "are you sure?".
9. **API calls go through `useCall`** (or `useList` / `useDoc`). Never `fetch` / `axios`; don't reach for the legacy `createResource` family in new code. See `COMPONENTS.md` → Data & resources.
10. **Style components via `data-slot` / `data-state`, not class injection.** No `triggerClass` / `contentClass` props — they don't exist by design. See `TOKENS.md` → Custom CSS hooks.
11. **Bootstrapping from scratch?** Follow `SETUP.md` exactly — version pins (Tailwind v3, Vite 5), `exports` subpaths, `optimizeDeps.exclude: ['frappe-ui']`, `app.use(FrappeUI)`, and `vue-router` are all required and easy to miss.

## Reference files

- [SETUP.md](SETUP.md) — scaffolding a fresh Vite + Vue 3 + frappe-ui project: version pinning, `vite.config.js`, Tailwind, PostCSS, CSS entry, plugin vs provider. Read this first when bootstrapping from scratch.
- [COMPONENTS.md](COMPONENTS.md) — component catalog: when to reach for each one, key props, common pitfalls.
- [TOKENS.md](TOKENS.md) — semantic color tokens (`ink-*`, `surface-*`, `outline-*`), typography, spacing, radii.
- [PATTERNS.md](PATTERNS.md) — recipes: form pages, list pages, settings panels, empty states, confirmation flows.

## Authoritative upstream docs

When the bundled refs don't answer a specific API question, fetch the official LLM-friendly index:

- **https://ui.frappe.io/llms.txt** — curated index of every component doc, design-system tokens page, and data-fetching guide. Always current with the published library; follow the links inside for full details on a specific component.

Prefer the upstream `llms.txt` over guessing — it lists every component's docs page and the canonical design-system / data-fetching pages. Source lives in the `frappe/frappe-ui` GitHub repo (`src/components/<Name>/`, plus `PHILOSOPHY.md` and `CONTEXT.md` at the repo root).
