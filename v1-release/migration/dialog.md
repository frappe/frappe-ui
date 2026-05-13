# Migrating to the new Dialog API

This guide walks app teams through migrating existing `Dialog` usages to the
flat-prop API introduced in `frappe-ui` v1. The legacy surfaces (`:options`,
`#body-content`, `#body`, `disableOutsideClickToClose`) still work and emit
a one-time dev warning per surface — you can migrate file by file.

See [`../08f-dialog-spec.md`](../08f-dialog-spec.md) for the full API
spec. This document is the practical checklist.

## TL;DR — the migration table

| Before                                     | After                                       | Notes                                                  |
| ------------------------------------------ | ------------------------------------------- | ------------------------------------------------------ |
| `v-model="show"`                           | `v-model:open="show"`                       | `v-model` still works; `:open` is canonical.           |
| `:options="{ title: 'X' }"`                | `title="X"`                                 | Flatten every key in `options` to a top-level prop.    |
| `:options="{ size: 'sm' }"`                | `size="sm"`                                 | Same scale (`xs` → `7xl`).                             |
| `:options="{ actions: [...] }"`            | `:actions="[...]"`                          | Array-of-`{label, variant, theme, onClick}` unchanged. |
| `disableOutsideClickToClose`               | `:dismissable="false"`                      | Inverted boolean. Default is `true`.                   |
| `<template #body-content>…</template>`     | `…` (default slot)                          | Drop the wrapper — content goes in the default slot.   |
| `<template #body-title>…</template>`       | `<template #title>…</template>`             | Renamed.                                               |
| `<template #body>…</template>`             | `bare` prop + default slot                  | `bare` opts out of the chrome (no padded card, no auto-header, no auto-actions). |
| `<template #body-header>…</template>`      | `<template #title>…</template>`             | No direct replacement — put extras in `#title`.        |
| `onClick: (close) => …`                    | `onClick: ({ close }) => …`                 | Action callbacks now receive an object, not a bare fn. |
| Manual focus (`ref` + `setTimeout`, `v-focus`, `focus()` in `onMounted`) | `autofocus` attribute on a descendant       | Dialog focuses any `[autofocus]` element on open.       |

## Walkthroughs

### 1. The 95% case — flatten `options` and rename `#body-content`

```vue
<!-- Before -->
<Dialog :options="{ title: 'Edit Item' }" v-model="show">
  <template #body-content>
    <FormControl label="Name" v-model="item.name" />
  </template>
  <template #actions>
    <Button variant="solid" @click="save">Save</Button>
  </template>
</Dialog>

<!-- After -->
<Dialog title="Edit Item" v-model:open="show">
  <FormControl label="Name" v-model="item.name" />
  <template #actions>
    <Button variant="solid" @click="save">Save</Button>
  </template>
</Dialog>
```

Two mechanical edits: flatten `:options` and replace `<template #body-content>`
with the default slot. `#actions` is unchanged.

### 2. Action arrays — both prop and callback shape

```vue
<!-- Before -->
<Dialog
  :options="{
    title: 'Delete record',
    message: 'This cannot be undone.',
    actions: [
      {
        label: 'Delete',
        variant: 'solid',
        theme: 'red',
        onClick: (close) => api.delete().then(close),
      },
    ],
  }"
  v-model="confirmOpen"
/>

<!-- After -->
<Dialog
  title="Delete record"
  message="This cannot be undone."
  :actions="[
    {
      label: 'Delete',
      variant: 'solid',
      theme: 'red',
      onClick: ({ close }) => api.delete().then(close),
    },
  ]"
  v-model:open="confirmOpen"
/>
```

The action callback receives `{ close }` instead of `close` directly. The
legacy callable-context shim still works (it's a function with `.close` on
it) but warns once. Update to `({ close })` to silence the warning.

### 3. Full-chrome override — `#body` becomes `bare`

```vue
<!-- Before: caller drew the whole modal contents themselves -->
<Dialog :options="{ size: '5xl' }" v-model="show">
  <template #body>
    <div class="flex h-[80vh]">
      <Sidebar />
      <Content />
    </div>
  </template>
</Dialog>

<!-- After: bare opts out of chrome; default slot fills the shell -->
<Dialog size="5xl" bare v-model:open="show">
  <div class="flex h-[80vh]">
    <Sidebar />
    <Content />
  </div>
</Dialog>
```

When `bare` is set, the Dialog drops the padded card, auto-header, and
auto-actions container. `title`/`icon`/`actions` props become no-ops (and
warn). The caller is responsible for `aria-labelledby` — render a
`<Dialog.Title>` somewhere inside if you want an accessible heading, and
reach for `<Dialog.Close>` to wire up a custom close button without
needing the slot-scope `close`:

```vue
<Dialog v-model:open="show" size="5xl" bare>
  <Dialog.Title as-child>
    <h1 class="px-4 pt-4 text-lg font-semibold">Settings</h1>
  </Dialog.Title>

  <!-- …custom layout… -->

  <Dialog.Close as-child>
    <Button class="absolute right-4 top-4" label="Close" icon="x" />
  </Dialog.Close>
</Dialog>
```

`Dialog.Title`, `Dialog.Description`, and `Dialog.Close` are all
re-exports of the equivalent `reka-ui` primitives exposed on the Dialog
component itself, so no extra import is needed. `Dialog.Close` with
`as-child` dismisses the dialog when the wrapped element is clicked —
the declarative equivalent of `v-slot="{ close }"` + `@click="close"`.

### 4. Focus management — drop `v-focus` and manual focus hacks

The new Dialog calls `useAutofocusOnOpen` internally. On open it scans the
content tree for any element with the `autofocus` attribute and focuses
it. This replaces three common patterns:

```vue
<!-- Before: custom directive -->
<Combobox v-focus />

<!-- Before: directive variant that selects existing text -->
<TextInput v-focus:autoselect />

<!-- Before: ref + setTimeout in a watcher on `show` -->
<FormControl ref="titleInput" />
<script setup>
watch(show, (val) => {
  if (val) setTimeout(() => titleInput.value.$el?.querySelector('input')?.focus(), 100)
})
</script>

<!-- After: standard HTML autofocus -->
<Combobox autofocus />
<TextInput autofocus />
<FormControl autofocus />
```

Once you've stopped using `v-focus`, delete the import:

```ts
// Remove this line
import { vFocus } from '@/directives'
```

If your input component doesn't forward attrs to a focusable DOM node,
wrap it: `<div autofocus><CustomInput /></div>` — the composable walks
into the wrapper to find the first focusable descendant.

### 5. Dismiss control

```vue
<!-- Before -->
<Dialog :disableOutsideClickToClose="isSubmitting" v-model="show">…</Dialog>

<!-- After -->
<Dialog :dismissable="!isSubmitting" v-model:open="show">…</Dialog>
```

`dismissable` covers both outside-click and Escape; the default is `true`.
Set it to `false` while a form is submitting or whenever you want to trap
the user until they pick an action.

### 6. Reactive `options` objects — use `v-bind`

Some legacy code reuses a single `<Dialog>` instance and swaps its options
reactively (a confirm dialog driven by `{ title, message, actions }` set
just before opening). The flat-prop API doesn't have a single object to
swap, so spread it:

```vue
<!-- Before -->
<Dialog :options="confirm.options" v-model="confirm.open" />

<!-- After -->
<Dialog v-bind="confirm.options || {}" v-model:open="confirm.open" />
```

Each key of `confirm.options` (`title`, `message`, `actions`, …) becomes a
top-level prop via `v-bind`. The fallback `|| {}` keeps `v-bind` happy
when the options haven't been set yet.

### 7. The imperative API — `dialog.confirm` / `alert` / `prompt`

If your app still uses `$dialog({ … })` or a homegrown `createDialog`
helper, the v1 imperative API is Promise-based:

```ts
// Before — callback style
$dialog({
  title: 'Delete',
  message: 'Are you sure?',
  actions: [
    { label: 'Delete', variant: 'solid', theme: 'red',
      onClick: (close) => item.delete().then(close) },
  ],
})

// After — Promise style
import { dialog } from 'frappe-ui'

const { ok, close } = await dialog.confirm({
  title: 'Delete',
  message: 'Are you sure?',
  confirmLabel: 'Delete',
  theme: 'red',
})
if (ok) {
  await item.delete()
  close()
}
```

Two contract changes worth knowing:

1. The Promise resolves **on click**, not on dismiss. Cancel resolves with
   `ok: false`.
2. The caller calls `close()` when ready. The confirm button shows a
   loading spinner automatically until `close()` runs — perfect for
   awaiting an API call before dismissing.

To use the imperative helpers, wrap your app root once:

```vue
<!-- App.vue -->
<FrappeUIProvider>
  <RouterView />
</FrappeUIProvider>
```

`FrappeUIProvider` also hosts toasts. Apps that don't use the provider can
mount `<Dialogs />` directly in their root template.

## Step-by-step recipe for a codebase sweep

1. **Find every `<Dialog`** in your `.vue` files:
   ```bash
   grep -rln '<Dialog\b' src --include='*.vue'
   ```
2. **For each file**, apply the migration table above. Most edits are
   purely mechanical and don't change runtime behaviour.
3. **Search for stale imports** of any `v-focus`-style directive and
   delete the ones whose only callsites were inside dialogs.
4. **Search for `:options=` on `<Dialog`** specifically to catch any
   missed dialogs (`grep -rn ':options=' src --include='*.vue'`); ignore
   hits on `Dropdown`, `Combobox`, `Select`, `FormControl` — they
   legitimately use `:options`.
5. **Search for `(close) =>`** action callbacks and migrate them to
   `({ close }) =>`.
6. **Compile-check** each migrated file. If your app has a Vite dev
   server running, the easiest verification is:
   ```bash
   curl -sf "http://localhost:8080/src/path/to/MyDialog.vue?t=$(date +%s)" > /dev/null
   ```
   A non-zero exit or a response starting with `throw new Error(` means
   Vite failed to transform the file — read the response for the
   compiler error.
7. **Manual UI smoke test** the flows you touched. Type-checking and
   compilation don't catch focus-management regressions or visual issues
   with `bare` mode.

## What stays the same

- `<Dialog.Title>`, `<Dialog.Description>`, and `<Dialog.Close>`
  shorthand accessors are exposed on the `Dialog` component itself
  (re-exports of `reka-ui`'s `DialogTitle` / `DialogDescription` /
  `DialogClose`). Useful inside `bare` dialogs where you own the chrome.
- `v-model` (bare) still works — no warning. `v-model:open` is just the
  canonical form and aligns with `Popover`/`Dropdown`.
- `actions` array shape, button props, theme names, size scale —
  unchanged.
- The `@after-leave` event is still emitted after the close animation
  finishes (use it for the common "reset form state after the dialog
  fully closes" pattern).
- The `data-dialog="{title}"` overlay attribute used by Playwright/Cypress
  selectors is preserved.

## What's removed (not just deprecated)

Nothing in v1 — every legacy surface is still wired through internally
with a one-time dev warning. The deprecations will be removed in a future
major. Migrate at your own pace.

## Common gotchas

- **Extra `</div>` after dropping `#body-content`.** If your old slot had
  conditional content (`v-if="ready"`) wrapping the children, double-check
  the closing tags after you remove the `<template>` wrapper.
- **`bare` and `title` are mutually exclusive.** Passing both warns and
  drops the title. Render `<Dialog.Title>` yourself inside the default
  slot instead.
- **The `position: 'top'` option** still works but is now a top-level
  prop (`position="top"`) — handy for command palettes.
- **Custom directives that focused inputs** (`v-focus`, `v-autofocus`,
  etc.) often did more than the HTML `autofocus` attribute (e.g. select
  existing text). If you need that behaviour, keep the directive and just
  drop the `autofocus` attribute on that one input — `useAutofocusOnOpen`
  is opt-in via the attribute, not a requirement.
- **`createDialog`/`$dialog` helpers** in app code aren't part of
  `frappe-ui` — they're typically thin wrappers around imperative state.
  Migrate them to `dialog.confirm/alert/prompt` from `frappe-ui` when you
  want the Promise-based contract; otherwise leave them in place.
