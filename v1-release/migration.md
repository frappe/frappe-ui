# Migrating to Frappe UI v1

The practical guide for moving an existing app onto `frappe-ui` v1. For the
full list of changes, see [`./changelog.md`](./changelog.md). For the
design rationale behind each component's new API, see the specs linked
from [`./README.md`](./README.md).

## Contents

- [How to migrate](#how-to-migrate)
- [Breaking changes (read before upgrading)](#breaking-changes)
- [Vocabulary cheatsheet](#vocabulary-cheatsheet)
- Per-component guides
  - [Dialog + imperative `dialog.*`](#dialog)
  - [DatePicker / DateRangePicker / DateTimePicker](#datepicker-family) ⏳
  - [TimePicker](#timepicker) ⏳
  - [Dropdown / Select / Combobox / MultiSelect](#selection-family) ⏳
  - [Inputs (TextInput / Textarea / Password / Checkbox / Switch / Rating / Slider)](#inputs) ⏳
  - [Divider](#divider) ⏳
  - [Icons (FeatherIcon → lucide)](#icons) ⏳
  - [Legacy components (`Input.vue`, `Autocomplete`, `FormControl autocomplete`)](#legacy-components) ⏳
- [FAQ](#faq)

## How to migrate

1. **Read [Breaking changes](#breaking-changes) first.** These are the
   behavior changes that affect your code even if you don't touch it.
2. **Upgrade to the latest v1 release.**
3. **Work through one component family at a time** using the
   per-component sections below. Each opens with a migration table you
   can run through mechanically.
4. **Verify with `grep`.** After each migration pass, search the repo
   for the legacy prop / slot name to confirm there are no stragglers.
5. **Smoke test the flows you touched.** Type-checking won't catch
   focus management, slot rename, or visual regressions.

## Breaking changes

Behavior changes that affect your code even if you don't touch it.

| Change                                                       | Where                                  | Action                                                                 |
| ------------------------------------------------------------ | -------------------------------------- | ---------------------------------------------------------------------- |
| `DateRangePicker` emits `[from, to]` tuple                   | `update:modelValue` / `change`         | Update `onChange` handlers that called `.split(',')`.                  |
| `DateTimePicker` keeps popover open after date click         | Date click no longer auto-closes       | Close from `@update:modelValue`, or add an `#actions` Apply button.    |
| DatePicker family — footer + auto Clear button removed       | Popover footer                         | Render explicit Clear inside `#actions` if you relied on it.           |
| `DateRangePicker.clearable` default flipped to `true`        | Prop default                           | Pass `:clearable="false"` if you don't want the clear affordance.      |
| `Slider` — hardcoded `aria-label="Volume"` removed           | A11y output                            | Pass `label` explicitly (every non-volume site was announced wrong).   |
| `Slider` — uncontrolled init from `min`                      | Initial render                         | Was rendering with no thumb. No code change needed if you `v-model`.   |
| `Password.v-model` now works                                 | Two-way binding                        | If you were working around the bug with `:value` + `@input`, simplify. |
| `Rating` filled stars now render visibly                     | Visual                                 | No code change. Confirm screenshots in tests.                          |

## Vocabulary cheatsheet

v1 unifies the prop names used across popover-trigger components
(`Combobox`, `Dropdown`, `Select`, `DatePicker`, `TimePicker`, etc).
If you've used any of them, the rest will feel familiar.

| Concept                          | v1 vocabulary                              |
| -------------------------------- | ------------------------------------------ |
| Popover position                 | `side` + `align` + `offset`                |
| Close-on-select                  | `keepOpen` (boolean, default `false`)      |
| Allow typing into the trigger    | `typeable` (boolean, default `true`)       |
| Constraint range                 | `min` / `max`                              |
| Two-way bound open state         | `v-model:open`                             |
| Custom trigger slot              | `#trigger`                                 |
| Trailing slot (replaces chevron) | `#suffix`                                  |
| Dismiss via outside click / Esc  | `dismissible` (boolean, default `true`)    |

---

## Dialog

Migrating existing `Dialog` usages to the flat-prop API. See
[`08f-dialog-spec.md`](./08f-dialog-spec.md) for the full API spec.

### TL;DR — the migration table

| Before                                     | After                                       | Notes                                                  |
| ------------------------------------------ | ------------------------------------------- | ------------------------------------------------------ |
| `v-model="show"`                           | `v-model:open="show"`                       | `:open` is the canonical model name.                   |
| `:options="{ title: 'X' }"`                | `title="X"`                                 | Flatten every key in `options` to a top-level prop.    |
| `:options="{ size: 'sm' }"`                | `size="sm"`                                 | Same scale (`xs` → `7xl`).                             |
| `:options="{ actions: [...] }"`            | `:actions="[...]"`                          | Array-of-`{label, variant, theme, onClick}` unchanged. |
| `disableOutsideClickToClose`               | `:dismissible="false"`                      | Inverted boolean. Default is `true`.                   |
| `<template #body-content>…</template>`     | `…` (default slot)                          | Drop the wrapper — content goes in the default slot.   |
| `<template #body-title>…</template>`       | `<template #title>…</template>`             | Renamed.                                               |
| `<template #body>…</template>`             | `bare` prop + default slot                  | `bare` opts out of the chrome (no padded card, no auto-header, no auto-actions). |
| `<template #body-header>…</template>`      | `<template #title>…</template>`             | No direct replacement — put extras in `#title`.        |
| `onClick: (close) => …`                    | `onClick: ({ close }) => …`                 | Action callbacks now receive an object, not a bare fn. |
| Manual focus (`ref` + `setTimeout`, `v-focus`, `focus()` in `onMounted`) | `autofocus` attribute on a descendant       | Dialog focuses any `[autofocus]` element on open.       |

### Walkthroughs

#### 1. The 95% case — flatten `options` and rename `#body-content`

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

#### 2. Action arrays — both prop and callback shape

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

The action callback receives `{ close }` instead of `close` directly.
Update destructuring at every `onClick` call site.

#### 3. Full-chrome override — `#body` becomes `bare`

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

#### 4. Focus management — drop `v-focus` and manual focus hacks

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

#### 5. Dismiss control

```vue
<!-- Before -->
<Dialog :disableOutsideClickToClose="isSubmitting" v-model="show">…</Dialog>

<!-- After -->
<Dialog :dismissible="!isSubmitting" v-model:open="show">…</Dialog>
```

`dismissible` covers both outside-click and Escape; the default is `true`.
Set it to `false` while a form is submitting or whenever you want to trap
the user until they pick an action.

#### 6. Reactive `options` objects — use `v-bind`

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

#### 7. The imperative API — `dialog.confirm` / `dialog.danger` / `dialog.prompt`

If your app still uses `$dialog({ … })` or a homegrown `createDialog`
helper, the v1 imperative API is callback-based:

```ts
// Before — callback style with hideDialog
$dialog({
  title: 'Delete',
  message: 'Are you sure?',
  actions: [
    { label: 'Delete', variant: 'solid', theme: 'red',
      onClick: ({ hideDialog }) => item.delete().then(hideDialog) },
  ],
})

// After — destructive preset
import { dialog } from 'frappe-ui'

dialog.danger({
  title: 'Delete',
  message: 'Are you sure?',
  onConfirm: async () => {
    await item.delete()
    // dialog auto-closes when onConfirm resolves
  },
})
```

The lifecycle contract:

| `onConfirm` outcome | Result |
|---|---|
| Resolves | Dialog auto-closes |
| Throws / rejects | Dialog stays open; thrown message rendered inline; buttons re-enabled |
| Calls `ctx.close()` early | Dialog closes immediately (the trailing auto-close is a no-op) |

Three helpers in the `dialog` namespace:

- **`dialog.confirm(args)`** — generic confirm with `confirmLabel`/`cancelLabel`/optional `theme`.
- **`dialog.danger(args)`** — destructive preset; forces `theme: 'red'`, defaults `confirmLabel` to `'Delete'`, defaults the icon to `lucide-alert-triangle`. Use for delete/revoke/discard flows.
- **`dialog.prompt(args)`** — form dialog with typed `fields[]` (`text`, `textarea`, `select`, `checkbox`, `combobox`) and optional per-field `validate` callbacks. `onConfirm` receives `{ values, close, setError }`.

All three return a synchronous `DialogHandle` (`{ close }`) so callers can dismiss the dialog programmatically — e.g., from a socket event:

```ts
const handle = dialog.confirm({ title: 'Waiting…', dismissible: false })
socket.once('done', () => handle.close())
```

For custom button layouts (paste / replace / cancel, save / discard / cancel, …), pass `actions[]` instead of relying on the default confirm + cancel pair:

```ts
dialog.confirm({
  title: 'Unsaved changes',
  message: 'Save before leaving?',
  actions: [
    { label: 'Cancel', variant: 'outline' },
    { label: 'Discard', theme: 'red', variant: 'subtle', onClick: () => { /* … */ } },
    { label: 'Save', variant: 'solid', onClick: async () => { await save() } },
  ],
})
```

Each action's `onClick` is awaited independently — the clicked button shows a loading spinner, every other button disables until it settles, and throwing surfaces inline.

To use the imperative helpers, wrap your app root once:

```vue
<!-- App.vue -->
<FrappeUIProvider>
  <RouterView />
</FrappeUIProvider>
```

`FrappeUIProvider` also hosts toasts. Apps that don't use the provider can
mount `<Dialogs />` directly in their root template.

> **Note**: an older version of this guide described a Promise-based contract
> (`const { ok, close } = await dialog.confirm(...)`). That design was
> evaluated in [ADR-0002](./adr/0002-imperative-dialog-caller-closes.md)
> but reversed in implementation — see
> [ADR-0003](./adr/0003-imperative-dialog-onconfirm.md) for why the
> callback-based shape above won.

### Step-by-step recipe for a codebase sweep

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
6. **Manual UI smoke test** the flows you touched. Type-checking and
   compilation don't catch focus-management regressions or visual issues
   with `bare` mode.

### What doesn't change

- `<Dialog.Title>`, `<Dialog.Description>`, and `<Dialog.Close>`
  shorthand accessors are exposed on the `Dialog` component itself
  (re-exports of `reka-ui`'s `DialogTitle` / `DialogDescription` /
  `DialogClose`). Useful inside `bare` dialogs where you own the chrome.
- `actions` array shape, button props, theme names, size scale.
- The `@after-leave` event fires after the close animation finishes
  (use it for the common "reset form state after the dialog fully
  closes" pattern).
- The `data-dialog="{title}"` overlay attribute used by Playwright /
  Cypress selectors.

### Common gotchas

- **Extra `</div>` after dropping `#body-content`.** If your old slot had
  conditional content (`v-if="ready"`) wrapping the children, double-check
  the closing tags after you remove the `<template>` wrapper.
- **`bare` and `title` are mutually exclusive.** Passing both warns and
  drops the title. Render `<Dialog.Title>` yourself inside the default
  slot instead.
- **The `position: 'top'` option** is now a top-level prop
  (`position="top"`) — handy for command palettes.
- **Custom directives that focused inputs** (`v-focus`, `v-autofocus`,
  etc.) often did more than the HTML `autofocus` attribute (e.g. select
  existing text). If you need that behaviour, keep the directive and just
  drop the `autofocus` attribute on that one input — `useAutofocusOnOpen`
  is opt-in via the attribute, not a requirement.
- **`createDialog`/`$dialog` helpers** in app code aren't part of
  `frappe-ui` — they're typically thin wrappers around imperative state.
  Migrate them to `dialog.confirm/alert/prompt` from `frappe-ui` when you
  want the Promise-based contract; otherwise leave them in place.

---

## DatePicker family

> ⏳ **TODO.** Covers `DatePicker`, `DateRangePicker`, `DateTimePicker`.
> Key migrations: `placement` → `side`/`align`/`offset`, `autoClose` →
> `keepOpen` (inverse), `allowCustom`/`readonly` → `typeable`,
> `minDateTime`/`maxDateTime` → `min`/`max`, `#target` → `#trigger`,
> `value` prop → `v-model`, `change` emit → `update:modelValue`.
> See [`changelog.md`](./changelog.md) — "DatePicker family — v1 spec".

---

## TimePicker

> ⏳ **TODO.** Same popover-trigger vocab as DatePicker family.
> `minTime`/`maxTime` → `min`/`max`. `scrollMode` removed (list always
> centered on selection). Flexible parser now accepts `"3pm"`,
> `"3.30pm"`, `"1500"`. See [`changelog.md`](./changelog.md) —
> "TimePicker — v1 refresh".

---

## Selection family

> ⏳ **TODO.** Covers `Dropdown`, `Select`, `Combobox`, `MultiSelect`.
> Key migrations: Dropdown `{ group, items }` → `{ group, options }`;
> Select `#item-*` slot prop `option` → `item`; new `#suffix` slot on
> Combobox/MultiSelect (replaces chevron); Combobox `condition` is now
> authoritative for `type: 'custom'` rows (no more `createOption`).
> See [`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md).

---

## Inputs

> ⏳ **TODO.** Covers `TextInput`, `Textarea`, `Password`, `Checkbox`,
> `Switch`, `Rating`, `Slider`. Key migrations: shared labeling contract
> (`label`/`description`/`error`/`required`); `Password` v-model now
> works (drop `:value` workarounds); `Rating.rating_from` → `max`;
> `Switch.change` → `update:modelValue`; `Switch.labelClasses` /
> `Checkbox.padding` → `data-*` styling hooks; `Slider` aria-label
> hardcode removed (pass `label`). See
> [`09-input-components-spec.md`](./09-input-components-spec.md).

---

## Divider

> ⏳ **TODO.** `action.handler` → `action.onClick`. One-line change in
> most call sites.

---

## Icons

> ⏳ **TODO.** Replace `FeatherIcon` and Feather-name strings with
> `lucide-*` strings or a `Component`. Applies to `Button.icon` /
> `iconLeft` / `iconRight`, `Dialog.options.icon`, Dropdown item icons,
> and TabButtons icons.
>
> ```vue
> <!-- Before -->
> <Button icon="plus" />
>
> <!-- After -->
> <Button icon="lucide-plus" />
> <span class="lucide-search size-4" aria-hidden="true" />
> ```

---

## Legacy components

> ⏳ **TODO.** Replacements:
> - `Input.vue` → `TextInput`
> - `Autocomplete` → `Combobox` (single-select) or `MultiSelect`
> - `FormControl type='autocomplete'` → `Combobox` standalone

---

## FAQ

**Will my CSS break?**
Where structure changed, components expose `data-*` hooks (`data-slot`,
`data-state`, `data-size`, `data-variant`). If you were selecting by tag
or class, audit those selectors.

**What about Popover, Toast, and Autocomplete?**
- `Autocomplete` → `Combobox` (single-select) or `MultiSelect`.
- `Popover` → component-level popovers are owned by the component
  (Combobox, Dropdown, Select, DatePicker). No standalone replacement
  yet.
- `Toast` → API revisited in a follow-up spec; track
  [`11-toast-spec.md`](./11-toast-spec.md).

**Where do I report bugs?**
[File an issue](https://github.com/frappe/frappe-ui/issues/new) with the
`v1-beta` label. Include: component name, before/after code, frappe-ui
version, and a minimal repro.
