# UI patterns

Common compositions seen across Frappe Cloud, Gameplan, Desk, Drive, Insights. Reach for these before inventing layouts.

## Layout principles

Apply these before reaching for any specific pattern below — they're what make a Frappe screen *read* as a Frappe screen.

1. **Strive for alignment.** Repeating elements down a list should align in columns, not float inside flex rows. If every list item has a `<Badge>`, a timestamp, or a button on the right, give each one a fixed-width slot (`w-24 shrink-0`, `w-32 shrink-0`) so they form a column. Inline `flex items-center gap-2` is fine for one row but produces ragged edges down a list.
2. **One primary action per page.** Only one `<Button variant="solid" theme="gray">` per screen — usually the page header's "New X". Everything else is default (`subtle`) or `ghost`. If the app shell already has a global "Create" button, the page should not also have a solid primary.
3. **Mostly neutral, color for state only.** Frappe screens are dominated by ink-gray and surface-base/gray. Reserve color for things that **encode information** — status badges, destructive buttons, error inline messages. Don't theme cards, icons, or section headers for visual interest.
4. **Icons support labels, not replace them.** Pair an icon with a text label (`<Button icon-left="lucide-plus" label="New Site" />`). Avoid icon-only buttons except in long-running toolbars where space is genuinely tight and the meaning is universal (close ×, more …). Decorative icons in stat cards / activity feeds / quick actions are usually noise — drop them.
5. **Pick the right text scale.** Use `text-*` for single-line labels (headings, button text, badges, "2h ago"). Use `text-p-*` for anything that wraps — descriptions, helper text, feed entries, paragraphs. Multi-line copy in `text-*` looks cramped; one-line labels in `text-p-*` look floppy. See [TOKENS.md](TOKENS.md) → Typography.
6. **Borders earn their place — don't box everything.** A border or `rounded-md` surface should signal something: an interactive affordance (clickable card / button), grouping that crosses a visual boundary (a popover, a dialog), or a distinct surface (an inset code block, a callout). Static sections — stats, lists, feeds, "section + items" groups — don't need an outer box; a section heading plus `divide-y divide-outline-gray-1` between rows reads cleaner than wrapping the whole thing in a card. Reach for boxes only when removing them would lose meaning.

## Spacing & content width

Frappe screens share one spacing rhythm. Match it instead of picking ad-hoc values — a page that uses `px-6` gutters and full-width content reads as foreign next to the rest of the product.

**Horizontal gutters scale with the viewport: `px-3 sm:px-5`** (12px mobile → 20px desktop). Use this same pair on the page header, the content container, and any full-bleed row. Don't use a flat `px-6`.

**Constrain reading content to a centered column.** Don't let text, forms, or cards stretch the full width of a wide screen. Wrap the scrollable page body in a centered max-width container, defined once as a reusable utility and applied to every page:

```css
/* tailwind @layer components — Gameplan calls this .body-container */
.body-container {
  @apply mx-auto w-full max-w-[940px] px-3 sm:px-5;
}
```

```vue
<div class="body-container pt-5 pb-40">
  <!-- page content -->
</div>
```

~940px (`max-w-4xl` is the close stock equivalent) is the standard content width. A single long-form reading surface (one discussion / article) narrows to ~720px; a dense table view may opt out and run full-width.

**Vertical rhythm — keep it on the standard steps:**
- Top of a page body: `pt-5` / `pt-6` (20–24px).
- Between sibling sections: `space-y-5`, or `mt-5` / `mt-6` on each block.
- Stack of form fields: `space-y-4`.
- Tight list rows / sidebar nav items: `space-y-0.5`.
- Bottom of any scroll area: generous `pb-40`, so the last row clears floating UI and the scroll feels finished.

**Gaps:** `gap-2` for inline button / icon groups, `gap-3` for card grids, `gap-5` for major section blocks.

**Cards are flush on mobile, boxed on desktop.** A section card carries its border, rounding, and inner padding only at `sm:` and up — on mobile it runs edge-to-edge inside the gutter:

```vue
<div class="sm:rounded sm:border sm:border-outline-gray-1 sm:px-4 sm:py-3">
  <!-- section content -->
</div>
```

(This is subordinate to layout principle #6 — only box a section when the border earns its place.)

## App shell

```vue
<script setup>
import { FrappeUIProvider, Sidebar } from 'frappe-ui'
</script>

<template>
  <FrappeUIProvider>
    <div class="flex h-screen bg-surface-base text-ink-gray-9">
      <Sidebar />
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </FrappeUIProvider>
</template>
```

Mount `FrappeUIProvider` once at the app root so imperative `dialog.*` / `toast.*` work.

## Page header

Single row, **48px tall (`min-h-12`)**, sticky to the top, with a bottom border and the same `px-3 sm:px-5` gutter as the page body:

```vue
<header
  class="sticky top-0 z-10 flex min-h-12 items-center justify-between border-b border-outline-gray-1 bg-surface-base px-3 sm:px-5"
>
  <Breadcrumbs :items="crumbs" />
  <div class="flex gap-2">
    <Button icon="lucide-filter" label="Filter" />
    <Button variant="solid" theme="gray" icon-left="lucide-plus" label="New" @click="create" />
  </div>
</header>
```

Primary action: `variant="solid" theme="gray"`. Secondary actions: default `subtle`. Keep the header to one row — use `Breadcrumbs` for context rather than stacking a separate `<h1>` that pushes it past 48px.

## Form page

```vue
<script setup>
import { FormControl, Button } from 'frappe-ui'
import { reactive } from 'vue'

const form = reactive({ title: '', description: '', priority: 'medium' })
const errors = reactive({})
</script>

<template>
  <form class="mx-auto max-w-xl space-y-4 p-6" @submit.prevent="save">
    <FormControl v-model="form.title" label="Title" required :error="errors.title" />
    <FormControl v-model="form.description" type="textarea" label="Description" description="Markdown supported." />
    <FormControl
      v-model="form.priority"
      type="select"
      label="Priority"
      :options="[
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ]"
    />
    <div class="flex justify-end gap-2 pt-2">
      <Button label="Cancel" @click="cancel" />
      <Button variant="solid" theme="gray" type="submit" :loading="saving" label="Save" />
    </div>
  </form>
</template>
```

Rules:
- One column. Stack with `space-y-4`.
- Every field uses `FormControl` (or a direct input control) with `label` + `error`.
- Submit pair: secondary `Cancel` left, primary `Save` right.

## API calls

Always use `useCall` (or `useList` / `useDoc`) — never raw `fetch` / `axios`. Read = auto-fetch on mount; write = `immediate: false` + `submit(params)`. Bind `.loading` to `<Button :loading>` and render `.error?.message` next to the form. Canonical read/write examples and the full option/return surface: [COMPONENTS.md](COMPONENTS.md) → Data & resources.

## Confirmation flow

```ts
import { dialog, toast } from 'frappe-ui'

async function deleteItem(id) {
  dialog.confirm({
    title: 'Delete this item?',
    message: 'This cannot be undone.',
    theme: 'red',
    confirmLabel: 'Delete',
    onConfirm: async ({ close }) => {
      await api.delete(id)
      toast.success('Deleted')
    },
  })
}
```

Never build your own confirm `<Dialog>` for this.

## List page

```vue
<script setup>
import { ListView, Button, useList } from 'frappe-ui'

const tasks = useList<Task>({
  doctype: 'Task',
  fields: ['name', 'title', 'status', 'modified'],
})
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="flex min-h-12 items-center justify-between border-b border-outline-gray-1 px-3 sm:px-5">
      <h1 class="text-lg text-ink-gray-9">Tasks</h1>
      <Button variant="solid" theme="gray" icon-left="lucide-plus" label="New Task" />
    </header>
    <ListView
      class="flex-1"
      :columns="[
        { label: 'Title', key: 'title' },
        { label: 'Status', key: 'status' },
        { label: 'Updated', key: 'modified' },
      ]"
      :rows="tasks.data ?? []"
      :loading="tasks.loading"
      row-key="name"
    />
  </div>
</template>
```

## Empty state

```vue
<div class="flex flex-col items-center justify-center gap-3 py-16 text-center">
  <div class="rounded-full bg-surface-gray-2 p-3 text-ink-gray-5">
    <span class="lucide-inbox size-6" aria-hidden="true" />
  </div>
  <p class="text-base text-ink-gray-7">No tasks yet</p>
  <p class="text-sm text-ink-gray-5">Create one to get started.</p>
  <Button variant="solid" theme="gray" icon-left="lucide-plus" label="New Task" class="mt-2" />
</div>
```

## Settings panel

Two-column: nav on the left (`Sidebar` or vertical `Tabs`), form on the right. Each section uses the **form page** pattern. Save action at the bottom of each section, not floating.

## Toast usage

- `toast.success('Saved')` — after writes complete.
- `toast.error(err.message)` — for transient failures.
- `toast.info('Heads up')` — neutral notifications.

Don't use toasts for confirmations or anything requiring a decision — that's `dialog.confirm`.

## Status badges

```vue
<Badge :label="status" :theme="statusTheme(status)" variant="subtle" />
```

Map statuses to themes in one place:
```ts
function statusTheme(s) {
  return ({ open: 'blue', closed: 'gray', error: 'red', done: 'green' })[s] ?? 'gray'
}
```

## Loading states

- Buttons: `<Button :loading="saving" />`.
- Inline blocks: `<LoadingIndicator />` / `<Spinner />`.
- Skeleton text: `<LoadingText :lines="3" />`.
- Whole-page first load: render the page shell + `LoadingText` placeholders inside content slots. Don't blank out the screen.

## Dark-mode check

Before declaring a page done, toggle `[data-theme="dark"]` on `<html>` (or your app's dark-mode switch) and verify nothing looks broken. If you used only semantic tokens, it should just work.
