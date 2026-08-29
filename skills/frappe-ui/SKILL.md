---
name: frappe-ui
description: Build consistent Frappe-style user interfaces using the frappe-ui Vue 3 component library and its design tokens. Use when scaffolding pages, forms, dialogs, lists, or any UI inside a Frappe-based app, when the user mentions frappe-ui, Frappe Cloud / Gameplan / Desk / Drive / Insights styling, or asks to "use frappe-ui components".
---

# frappe-ui

Build UIs that look and feel like Frappe products by composing **frappe-ui** components and styling with the library's **semantic Tailwind tokens**.

## Quick start

```vue
<script setup>
import { Button, Dialog, FormControl } from 'frappe-ui'
import { ref } from 'vue'

const open = ref(false)
const name = ref('')
</script>

<template>
  <div class="p-4 bg-surface-base text-ink-gray-8">
    <Button variant="solid" theme="gray" @click="open = true">New Task</Button>
    <Dialog v-model:open="open" title="Create Task">
      <FormControl v-model="name" label="Title" required />
    </Dialog>
  </div>
</template>
```

## Where to look

Prop names, prop value types and slot names live in these files, not here. Open the one you need before you write markup.

| Writing this | Open this first |
|---|---|
| a list or a table | [COMPONENTS.md](COMPONENTS.md) → List family |
| a form or any input | [COMPONENTS.md](COMPONENTS.md) → Input controls |
| a dialog, popover, menu, toast | [COMPONENTS.md](COMPONENTS.md) → Overlays |
| a command palette | [COMPONENTS.md](COMPONENTS.md) → CommandPalette |
| anything that fetches or writes data | [DATA.md](DATA.md) |
| a whole page, screen or app | [DESIGN.md](DESIGN.md) |
| colors, typography, radius, shadow, dark mode | [TOKENS.md](TOKENS.md) |
| a fresh Vite + Vue 3 project | [SETUP.md](SETUP.md) |

## Contracts

These hold across components. Everything else is per-component.

1. **Pick the component.** Every interactive element comes from `COMPONENTS.md`.
   Raw HTML is for layout: grids, flex, spacing wrappers.
2. **Color is two props: `variant` and `theme`.** The value sets differ per
   component — `COMPONENTS.md` lists each one. In your own markup, colors come
   from the semantic scales: `bg-surface-*`, `text-ink-*`, `border-outline-*`
   (`TOKENS.md`).
3. **Two-way state is `v-model`.** Inputs take `v-model`. Overlays take
   `v-model:open`. `Combobox` and `MultiSelect` add optional `v-model:query`.
   `List` adds `v-model:selection` and `v-model:active`.
4. **Icons are CSS classes.** `<span class="lucide-edit size-4" aria-hidden="true" />`.
   A prop named `icon` takes the string `"lucide-edit"`.
5. **Slot names are per component, never universal.** Read the component's
   row in `COMPONENTS.md` → Overlays before writing a `<template #…>`.
6. **Frappe API calls go through the `use*` composables** — `useCall`,
   `useList`, `useDoc`, `useDoctype`, `useNewDoc`, all exported from
   `frappe-ui`. Each one takes its own option set and returns its own shape;
   [DATA.md](DATA.md) lists them separately.

## Authoritative upstream docs

When the bundled refs don't answer a specific API question, fetch **https://ui.frappe.io/llms.txt** — a curated index of every component doc, the design-system token pages, and the data-fetching guides. Source lives in the `frappe/frappe-ui` GitHub repo under `src/components/<Name>/`, with `PHILOSOPHY.md` (the API design rules) and `CONTEXT.md` (the shared vocabulary: `open`, `variant`, `theme`, `dismissible`) at the repo root.
