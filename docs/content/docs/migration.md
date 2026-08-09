---
pageClass: migration-page
---

# Migration from v0

A guide for moving an existing app onto `frappe-ui` v1. Work through one
component family at a time. Each section opens with a before/after table. For
the full change list see the
[changelog](https://github.com/frappe/frappe-ui/blob/main/v1-release/changelog.md);
for the rationale behind each API see the
[v1 release specs](https://github.com/frappe/frappe-ui/tree/main/v1-release).

After each pass, `grep` for the old prop or slot name to catch anything missed,
then test the flows you touched. Type-checking won't catch focus, slot renames,
or visual regressions.

## Requirements

v1 requires **Node `>=20.19.0`** (`package.json` `engines`); this is a breaking
bump from the 0.1.x line (Node 18).

## Dialog

The `options` blob is flattened into top-level props. See the
[Dialog](./components/dialog) component page for the full API.

| Before                                | After                            |
| ------------------------------------- | -------------------------------- |
| `v-model="show"`                      | `v-model:open="show"`            |
| `:options="{ title, size, actions }"` | `title` / `size` / `:actions`    |
| `disableOutsideClickToClose`          | `:dismissible="false"`           |
| `<template #body-content>`            | default slot                     |
| `<template #body-main>`               | default slot                     |
| `<template #body-title>`              | `<template #title>`              |
| `<template #body-header>`             | `<template #title>` (no direct replacement) |
| `<template #body>`                    | `bare` prop + default slot       |
| `onClick: (close) => …`               | `onClick: ({ close }) => …`      |
| `:icon="{ appearance: 'warning' }"`   | `:icon="{ theme: 'yellow' }"`    |
| `dialogRef.close()`                   | `v-model:open` / `close` slot prop |
| manual focus hacks / `v-focus`        | `autofocus` attr on a descendant |

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

For reactive `:options` objects, spread them: `<Dialog v-bind="opts || {}" />`.
For the imperative API, use `dialog.confirm` / `dialog.danger` / `dialog.prompt`
from `frappe-ui` (callback-based: `onConfirm` resolves to close, throws to stay
open) and wrap your app root in `<FrappeUIProvider>`.

### `icon.appearance` → `icon.theme`

```vue
<!-- Before -->
<Dialog :icon="{ name: 'lucide-alert-triangle', appearance: 'warning' }" ... />

<!-- After -->
<Dialog :icon="{ name: 'lucide-alert-triangle', theme: 'yellow' }" ... />
```

`appearance` is dropped silently — Vue accepts the unknown key with no error,
so the icon renders with no tone. Map `warning → yellow`, `info → blue`,
`danger → red`, `success → green`.

### A template ref no longer exposes `close()`

```vue
<!-- Before -->
<Dialog ref="dialogRef" v-model="show" />
<script setup>
dialogRef.value.close()
</script>

<!-- After -->
<Dialog v-model:open="show" />
<script setup>
show.value = false
</script>
```

`Dialog` exposes nothing on its template ref (ADR-0012); calling `.close()`
now throws. Drive `open` through `v-model:open`, or use the `close` slot prop
from inside `#default` / `#actions`.

## DatePicker / TimePicker family

Covers `DatePicker`, `DateRangePicker`, `DateTimePicker`, and `TimePicker`. They
share the popover-trigger vocabulary. Removed members are deleted, not
aliased — a call site that still uses one breaks at the tag rather than
warning; `grep` for each old name after upgrading.

| Before                                   | After                        |
| ----------------------------------------- | --------------------------- |
| `:value` prop                             | `v-model`                    |
| `placement="bottom-start"`                | `side` + `align` + `offset`  |
| `:autoClose`                              | `:keepOpen` (inverted)       |
| `allowCustom` / picker-level `readonly`   | `typeable`                   |
| `inputClass`                              | `class`                      |
| `minDate`/`maxDate`/`minTime`/`maxTime`   | `min` / `max`                |
| `#target`                                 | `#trigger`                   |
| `TimePicker.scrollMode`                   | nothing — list is always centered |
| `TimePicker` template ref `.selectAll()` / `.blurInput()` | nothing — dead, no callers |

`@change` still fires alongside `@update:modelValue` — it wasn't deprecated
and doesn't need replacing.

Most of the table above is a **silent break**: an old prop name that's no
longer in the component's types lands as an inert extra attribute (or, for
`min`/`max` aliases, the constraint just stops being enforced) instead of
throwing. TypeScript callers get a compile error instead. `#target` is the
one slot case — content in a leftover `<template #target>` silently stops
rendering.

Behavior changes that apply even if you don't touch your code:

- `DateRangePicker` emits a `[from, to]` tuple. Update handlers that called
  `.split(',')` on the value.
- `DateTimePicker` no longer auto-closes on date click. Close from
  `@update:modelValue` or add an `#actions` Apply button.
- The popover footer and auto Clear button were removed. Render an explicit
  Clear inside `#actions` if you relied on it.
- `DateRangePicker.clearable` now defaults to `true`. Pass `:clearable="false"`
  to opt out.
- `useDatePicker` and its helpers (`getDate`, `getDatesAfter`,
  `getDaysInMonth`, `isLeapYear`) are deleted — the import fails. Nothing in
  the picker components used them; drop the import.

## MonthPicker

`MonthPicker` is deleted — the import fails. Use `Select` with month options:

```vue
<!-- Before -->
<MonthPicker v-model="month" />

<!-- After -->
<Select
  v-model="month"
  :options="[
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    // ...
  ]"
/>
```

## Selection family (Dropdown / Select / Combobox / MultiSelect)

Upgrade all three pickers together. They share an option shape and a slot
vocabulary, and most apps use more than one.

Removed members are deleted, not aliased — a call site that still uses one
breaks at the tag rather than warning.

### Shared

| Before                                  | After                                        |
| --------------------------------------- | -------------------------------------------- |
| Dropdown `{ group, items }`             | `{ group, options }`                         |
| `#option` slot                          | `#item-label`, plus `#item-prefix` for icons |
| `option` item slot prop                 | `item`                                       |
| `clearSelection` / `clearAll` slot prop | `clear`                                      |
| chevron / trailing content              | `#suffix` slot (replaces the chevron)        |

Option values are `string | number` everywhere. `Select` no longer accepts
`bigint` or object values.

### Select

| Before                           | After                                                    |
| -------------------------------- | -------------------------------------------------------- |
| `displayValue` trigger slot prop | `selectedOption.label`                                   |
| `data-slot="trigger-value"`      | nothing — it marked an invisible element used to measure |

### Combobox

| Before                                                              | After                                      |
| ------------------------------------------------------------------- | ------------------------------------------ |
| `slotName` on custom options                                        | `slot`, which dispatches to `#item-<slot>` |
| `searchTerm` in the custom-option context                           | `query`                                    |
| `input` emit                                                        | `@update:query`                            |
| `render` on options                                                 | `slots`                                    |
| `placement`, `ComboboxPlacement`                                    | `side` + `align`                           |
| `createOption`                                                      | `type: 'custom'` option + `condition`      |
| `allowCustomValue`                                                  | `type: 'custom'` option + `condition`      |
| `reset()` on a template ref                                         | `clear()`                                  |
| `SimpleOption`, `GroupedOption`, `SelectableOption`, `CustomOption` | the `Combobox`-prefixed names              |

### MultiSelect

| Before                   | After                                                               |
| ------------------------ | ------------------------------------------------------------------- |
| `compareFn` prop         | nothing — an option is selected when its `value` is in `modelValue` |
| `displayValue` slot prop | `summary` on `#summary`, or `selectedOptions`                       |
| `toggleOpen` slot prop   | `setOpen(boolean)`                                                  |

### Dropdown and ContextMenu

| Before                                     | After                            |
| ------------------------------------------ | -------------------------------- |
| `placement` prop, `DropdownPlacement` type | `align`                          |
| `{ group, items }`                         | `{ group, options }`             |
| `component:` option rows                   | `slots: { item: fn }`            |
| `DropdownExposed` type                     | nothing — it described a template ref surface that never existed; use `v-model:open` or the `close` slot prop |

All three behavioral removals are silent in plain-JS apps — the old code still
runs and renders wrong instead of failing — so check each one. TypeScript
callers get errors instead: the removed keys stay in the types as `never`. A
dev-mode console warning also fires when `items` or `component` reaches the
menu at runtime.

**`placement` is ignored now.** The menu falls back to `align="start"`, so a
right-aligned menu quietly moves left:

```vue
<!-- Before -->
<Dropdown :options="options" placement="right" />
<Dropdown :options="options" placement="center" />

<!-- After -->
<Dropdown :options="options" align="end" />
<Dropdown :options="options" align="center" />
```

**A `{ group, items }` entry renders an empty menu** — the group resolves to
zero options:

```ts
// Before
const actions = [{ group: 'Edit', items: [{ label: 'Rename', onClick: rename }] }]

// After
const actions = [{ group: 'Edit', options: [{ label: 'Rename', onClick: rename }] }]
```

**A `component:` row renders as a plain action row** using its `label`, which
for most of these rows is empty:

```ts
// Before
{ component: h(Button, { theme: 'red' }, () => 'Delete') }

// After
{
  label: 'Delete',
  slots: {
    item: () => h(Button, { theme: 'red' }, () => 'Delete'),
  },
}
```

These apply identically to `ContextMenu`, which shares the option shape
(`ContextMenuComponentOption` is removed with `DropdownComponentOption`).

### Custom rows

`Select` and `MultiSelect` lost `#option`, and `Combobox` lost `render`. They
were the same idea — hand the whole row to the consumer. All three are replaced
by region slots on a row the component owns.

```vue
<!-- Before: one slot for the whole label area -->
<Select v-model="chartType" :options="options">
  <template #option="{ option }">
    <div class="flex items-center gap-2">
      <component :is="option.icon" class="size-4" />
      <span>{{ option.label }}</span>
    </div>
  </template>
</Select>

<!-- After: one slot per region -->
<Select v-model="chartType" :options="options">
  <template #item-prefix="{ item }">
    <component :is="item.icon" class="size-4" />
  </template>
  <template #item-label="{ item }">{{ item.label }}</template>
</Select>
```

An icon is rendered from `option.icon` automatically now, so the common case
needs no slot at all — set `icon` and drop both templates.

`Combobox`'s `render` moves the same way: the function form becomes
`slots.item`, and the object form maps to `slots` key for key. Use these for
lists built in JavaScript, where no template is in reach:

```ts
const users = fetchedUsers.map((user) => ({
  label: user.name,
  value: user.id,
  slots: {
    prefix: ({ item }) => h(Avatar, { image: item.image, class: 'size-4' }),
  },
}))
```

Full-row takeover is still there — `slots.item`, or the `#item` template slot.

### Custom options on Combobox

Two renames land on the same option object:

```ts
// Before
{
  type: 'custom',
  key: 'create-new',
  slotName: 'create-new',
  onClick: ({ searchTerm }) => createItem(searchTerm),
  condition: ({ searchTerm }) => Boolean(searchTerm),
}

// After
{
  type: 'custom',
  key: 'create-new',
  slot: 'create-new',
  onClick: ({ query }) => createItem(query),
  condition: ({ query }) => Boolean(query),
}
```

The slot the row lands in is renamed with it. `#create-new` becomes
`#item-create-new`, and it receives `{ item, query, selected }` instead of
`{ option, searchTerm }`. `onClick` and `condition` keep their names.

### If you used `allowCustomValue`

`Combobox` had a prop that accepted the typed text as the value and drew a
built-in `Create "…"` row. It is gone. It could not do anything a custom row
cannot, and it hardcoded the row — no way to change the label, add an icon, or
say when it appears.

Build the row instead. It commits on click and on Enter, because Enter picks
the highlighted row:

```vue
<script setup>
const value = ref('')
const people = ref(['John Doe', 'Jane Doe'])

const options = computed(() => [
  ...people.value.map((p) => ({ label: p, value: p })),
  {
    type: 'custom',
    key: 'create',
    label: 'Create',
    slot: 'create',
    condition: ({ query }) =>
      Boolean(query.trim()) && !people.value.includes(query.trim()),
    onClick: ({ query }) => {
      value.value = query.trim()
    },
  },
])
</script>

<template>
  <Combobox v-model="value" :options="options">
    <template #item-create="{ query }">Create "{{ query }}"</template>
  </Combobox>
</template>
```

A `modelValue` that matches no option is kept regardless — the trigger falls
back to the raw string — so nothing else changes.

`dialog.prompt`'s `allowCreate` field option is unaffected; it now builds this
row internally.

### If you filter on the server

`Combobox` and `MultiSelect` filter their options in the browser by default.
When the options already come back from a search endpoint, that filters them a
second time and drops fuzzy, ranked, or id-based matches. Pass
`:filterable="false"` to turn it off. Apps that forked the component for this
reason can move back.

For the removed `Autocomplete`, see
[Autocomplete (removed)](#autocomplete-removed).

## Popover / HoverCard / Tooltip

The v0 `Popover` API is **removed** in `1.0.0`. Nothing is aliased and nothing
warns — Vue drops an unknown prop or slot without complaining, so a missed call
site renders a popover with no trigger, or an empty one. Check every
`<Popover>` in your app.

| Before                                            | After                                                                                              |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `#target` slot                                    | `#trigger` — reka wires the click, so drop your own click handler                                  |
| `#body` slot                                      | `#default` + `bare` prop (renders without the panel shell)                                          |
| `#body-main` slot                                 | `#default`                                                                                          |
| `togglePopover` / `updatePosition` slot props     | `toggle` (`updatePosition` is gone — reka repositions on its own)                                   |
| `placement="bottom-start"`                        | `side="bottom"` + `align="start"` (a bare side like `placement="bottom"` maps to `align="center"`) |
| `show` / `v-model:show`                           | `open` / `v-model:open`                                                                            |
| `update:show` emit                                | `update:open`                                                                                       |
| `hideOnBlur`                                      | `dismissible`                                                                                       |
| `matchTargetWidth`                                | `matchTriggerWidth`                                                                                 |
| `trigger="hover"` (+ `hoverDelay` / `leaveDelay`) | the [`HoverCard`](./components/hovercard) component                                                |
| `popoverClass`                                    | `data-slot` CSS hooks                                                                               |
| `transition="default"`                            | built-in motion — delete the prop                                                                   |
| `PopoverPlacement` type                           | `PopoverSide` + `PopoverAlign`                                                                      |
| `PopoverLegacySlotProps` type                     | `PopoverSlotProps`                                                                                  |
| `NestedPopover`                                   | `Popover` — it never nested, and it was the last `@popperjs/core` consumer                          |

### Trigger and content slots

`#target` did not wire anything — you called `togglePopover` yourself. `#trigger`
renders through reka's `PopoverTrigger` as-child, which brings the click handler,
keyboard support and `aria-expanded` with it. **Keeping your click handler makes
the popover toggle twice and stay shut.**

```vue
<!-- Before -->
<Popover placement="bottom-end">
  <template #target="{ togglePopover }">
    <Button label="Filter" @click="togglePopover" />
  </template>
  <template #body-main="{ close }">
    <FilterPanel @done="close" />
  </template>
</Popover>

<!-- After -->
<Popover side="bottom" align="end">
  <template #trigger>
    <Button label="Filter" />
  </template>
  <template #default="{ close }">
    <FilterPanel @done="close" />
  </template>
</Popover>
```

`#body` rendered outside the panel shell, so it maps to `#default` **plus**
`bare` — without `bare` your content ends up inside a second panel.

```vue
<!-- Before -->
<Popover>
  <template #body><EmojiPicker /></template>
</Popover>

<!-- After -->
<Popover bare>
  <EmojiPicker />
</Popover>
```

### Driving the popover yourself

If your trigger needs custom timing (a delayed open, a drag that must not open
it), bind `open` and accept only closes, so the trigger's own toggle cannot
open it behind your back:

```vue
<Popover :open="isOpen" @update:open="(value) => !value && (isOpen = false)">
  <template #trigger>
    <div @click="onClick">…</div>
  </template>
</Popover>
```

### Slot props

`#trigger` and `#default` receive `{ open, close, toggle }`.

| Before                     | After                                    |
| -------------------------- | ---------------------------------------- |
| `isOpen`                   | `open`                                   |
| `open` (a method to call)  | `toggle`, or nothing — see below         |
| `togglePopover`            | `toggle`                                 |
| `updatePosition`           | gone; reka repositions on its own        |

`open` is now the boolean state, which is what it already means on `Dropdown`,
`Select`, `MultiSelect`, `HoverCard` and `Sidebar`. It used to be a method on
`Popover` alone.

This one is silent and worth grepping for: a destructured `isOpen` becomes
`undefined`, so a class bound to it stops applying with no error.

```vue
<!-- Before -->
<template #trigger="{ isOpen }">
  <Button :class="isOpen && 'ring-2'" label="Filter" />
</template>

<!-- After -->
<template #trigger="{ open }">
  <Button :class="open && 'ring-2'" label="Filter" />
</template>
```

Most triggers need nothing at all — `#trigger` wires its own click, so the
`open()` method it used to hand out had no callers. `toggle` is there for the
cases that drive it by hand.

### Attributes are not inherited

`<Popover class="…">` and `<Popover :style="…">` used to land on a wrapper the
legacy `#target` rendered. `#trigger` is as-child and renders no wrapper, so
those attributes now go nowhere. Move them onto the element inside `#trigger`.

### Hover panels

Hover-driven panels move to the [`HoverCard`](./components/hovercard)
component, which keeps `hoverDelay` / `leaveDelay` in seconds.

### Tooltip

| Before              | After                                                      |
| ------------------- | ---------------------------------------------------------- |
| `placement="right"` | `side="right"`                                             |
| `arrowClass`        | `[data-slot="arrow"]` CSS, or `offset` to shift the bubble  |
| `#body`             | `#content` (add `bare` if the content owns its surface)     |

All three are silent — the tooltip keeps working, it just points the wrong way,
loses the styling, or comes up empty. `arrowClass` was documented as the arrow's
fill, but was mostly used to nudge the bubble's position; `offset` does that
directly.

`#default` is still the **trigger**. That is deliberate and is not changing.

```vue
<!-- Before -->
<Tooltip text="Preview" placement="bottom" arrow-class="mb-3">
  <Button label="Preview" />
</Tooltip>

<!-- After -->
<Tooltip text="Preview" side="bottom" :offset="12">
  <Button label="Preview" />
</Tooltip>
```

`#body` replaced the whole bubble, surface included, so call sites hand-copied
the bubble's own classes to get them back. `#content` renders inside the bubble,
so that wrapper goes away:

```vue
<!-- Before -->
<Tooltip>
  <template #body>
    <div
      class="rounded bg-surface-gray-10 px-2 py-1 text-xs text-ink-base shadow-xl"
    >
      <span>Hide password</span>
    </div>
  </template>
  <Button icon="eye" />
</Tooltip>

<!-- After -->
<Tooltip>
  <template #content>
    <span>Hide password</span>
  </template>
  <Button icon="eye" />
</Tooltip>
```

If the content really does bring its own surface — an image preview, say — keep
it and add `bare`:

```vue
<Tooltip bare>
  <template #content>
    <img :src="url" class="max-h-40 rounded shadow-xl" />
  </template>
  <span class="truncate">{{ filename }}</span>
</Tooltip>
```

## Inputs

Covers `TextInput`, `Textarea`, `Password`, `Checkbox`, `Switch`, `Rating`,
`Slider`. All share the labeling contract (`label` / `description` / `error` /
`required`).

| Before                                     | After                  |
| ------------------------------------------ | ---------------------- |
| `<Input>` (removed)                        | `<TextInput>` or `FormControl` |
| `Rating` `:rating_from`                    | `:max`                 |
| `Rating` `:readonly`                       | `:disabled`            |
| `Switch` `@change`                         | `@update:modelValue`   |
| `Switch.labelClasses`                      | `data-*` styling hooks |
| `Checkbox.padding`                         | `padded`               |
| `Password` `:value` prop (removed)         | `v-model`              |
| `TextInput` / `Textarea` ref `.el`         | ref `.inputElement`    |

The first five rows are **removed**, not aliased. The old names are silently
ignored: a `Rating` with `:rating_from="10"` renders 5 stars, a `:readonly`
Rating becomes interactive, a `Switch` `@change` handler never fires, and
`labelClasses` / `Checkbox.padding` stop styling anything. Nothing breaks at
build time, so grep for these names when upgrading.

`Slider` no longer hardcodes `aria-label="Volume"`. Pass `label` explicitly so
the control is announced correctly.

### Password — `value` prop removed

`value` was a deprecated alternate way to set the password, seeding
`v-model` on mount. It's gone. `:value` now falls through as a plain HTML
attribute on the native `<input>` instead of seeding the model — the field
still renders, so nothing throws or warns.

```vue
<!-- Before -->
<Password v-model="password" :value="initialValue" />

<!-- After -->
<Password v-model="password" />
<script setup>
password.value = initialValue
</script>
```

### `TextInput`, `Textarea`, `Password` — ref surface

`TextInput` and `Textarea` handed back `{ el }`, a raw ref on the native
element. It's now `{ focus, inputElement }`: call `focus(options?)` to move
keyboard focus, and read `inputElement` for the native element itself (a
computed, so it can't be reassigned). `Password` gains the same pair — it
previously exposed nothing.

This is silent for plain JS: `ref.value.el` becomes `undefined` at runtime
instead of throwing. A typed ref catches it as a build-time error instead.

```vue
<!-- Before -->
<TextInput ref="input" />
<script setup>
function focusIt() {
  input.value.el.focus({ preventScroll: true })
}
</script>

<!-- After -->
<TextInput ref="input" />
<script setup>
function focusIt() {
  input.value.focus({ preventScroll: true })
}
</script>
```

`Duration` already exposed `focus()`; it now takes the same `options?`
parameter as the rest of the family.

## FileUploader

`FileUploader` reached structural bar in `1.0.0`: TypeScript, flat props, and
a security fix to the default it shares with `useFileUpload` /
`FileUploadHandler`.

### Uploads default to private

`useFileUpload()` and `FileUploadHandler` now resolve an upload with no
stated `private` / `is_private` to **private**, not public. `FileUploader`
itself is unaffected — it has uploaded private by default since
`v1.0.0-beta.21`; this only changes the two lower-level primitives, called
directly.

```ts
// Same call, before and after — the result changes:
await useFileUpload().upload(file, {})
await new FileUploadHandler().upload(file, {})
// Before: is_private=0 (public).  After: is_private=1 (private).

// State the intent explicitly instead of relying on the default:
await useFileUpload().upload(file, { private: false }) // public
await useFileUpload().upload(file, { private: true }) // private
```

If your app serves an uploaded file with no session — an avatar in an email
digest, an image embedded on a public page — audit every call that omits
`private` / `is_private` before upgrading. A file that flips to private
returns `403` to a session-less request instead of the image.

### `uploadArgs` → flat props

The single `uploadArgs` object prop is gone. Its commonly-used fields are now
flat props on the component:

| Before (`uploadArgs`)      | After                       |
| --------------------------- | ---------------------------- |
| `private` / `is_private`    | `private`                    |
| `folder`                    | `folder`                     |
| `doctype`                   | `doctype`                    |
| `docname`                   | `docname`                    |
| `fieldname`                 | `fieldname`                  |
| `upload_endpoint`           | `uploadEndpoint`             |
| `optimize`                  | `optimize`                   |

```vue
<!-- Before -->
<FileUploader :uploadArgs="{ private: false, folder: 'Attachments' }" />

<!-- After -->
<FileUploader :private="false" folder="Attachments" />
```

This is silent: `uploadArgs` isn't a recognized prop anymore, so Vue passes it
through as an inert HTML attribute on the root element. Nothing throws — the
options it carried just stop applying, and (combined with the default flip
above) a `uploadArgs="{ private: false }"` override that used to make an
upload public silently starts uploading private instead. `grep` every
`<FileUploader>` for `uploadArgs=` / `:upload-args=` and move each field to
its flat prop.

`file_url`, `method`, `type`, `params`, `max_width` / `max_height`, and upload
cancellation (`signal`) have no flat-prop equivalent — they had no measured
use on the component. Use
[`useFileUpload()`](./other/utilities#usefileupload-fileuploadhandler)
directly for those.

### Template ref — `inputRef` removed

`FileUploader` hands back nothing through a template ref, per
[ADR-0012](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0012-template-ref-surface.md).
`inputRef()` (a function, despite the name) is gone with nothing in its
place — the `openFileSelector` slot prop already covers what it opened.

```vue
<!-- Before -->
<FileUploader ref="uploader" />
<script setup>
uploader.value.inputRef().click()
</script>

<!-- After -->
<FileUploader v-slot="{ openFileSelector }">
  <Button @click="openFileSelector">Upload</Button>
</FileUploader>
```

### Default slot's `error` prop — always a string

The default slot's `error` prop is `string | null`, no longer `unknown`.
Upload failures were always normalized to a message string; validation
failures (a `validateFile` prop returning an `Error`) were not, so `error`
could previously be an `Error` object too. Both paths normalize to a message
string now.

```vue
<!-- Before: had to guard against error being a string or an Error -->
<template #default="{ error }">
  {{ typeof error === 'string' ? error : error?.message }}
</template>

<!-- After: error is always a string -->
<template #default="{ error }">
  {{ error }}
</template>
```

This is silent: a slot that only ever did `error.message` (assuming the
`Error` shape) now renders `undefined` instead of the validation message.

### `fileToBase64` and the size-limit helpers — no longer exported

`fileToBase64`, `formatBytes`, `getMaxFileSize`, and `fileSizeLimitMessage`
are no longer exported from `frappe-ui`; the import fails at build time.
There were no external call sites at the v1 sweep. Computing a file's base64
representation yourself is a few lines of `FileReader.readAsDataURL`.

## Divider

| Before           | After            |
| ---------------- | ---------------- |
| `action.handler` | `action.onClick` |

## ListView — moved to `frappe-ui/experimental`

`ListView` is not core v1 surface. It moves out of the root export to
`frappe-ui/experimental` (P14 — no stability promise) and stays there until
`frappe-ui/list` reaches full functional parity. The import fails at the
root; switch the subpath:

```ts
// Before
import { ListView, ListRow, ListHeader } from 'frappe-ui'

// After
import { ListView, ListRow, ListHeader } from 'frappe-ui/experimental'
```

Every other name in the family moves the same way: `List`, `ListEmptyState`,
`ListFooter`, `ListGroupHeader`, `ListGroupRows`, `ListGroups`,
`ListHeaderItem`, `ListRowItem`, `ListRows`, `ListSelectBanner`. Nothing about
the component itself changed — only where it's imported from.

## Sprite icons — moved to `frappe-ui/experimental`

The sprite-based `Icon`, `IconPicker`, and `spritePlugin` are not core v1
surface. They move from `frappe-ui/icons` to `frappe-ui/experimental`
(P14 — no stability promise). The old import fails; switch the subpath:

```ts
// Before
import { Icon, IconPicker, spritePlugin } from 'frappe-ui/icons'

// After
import { Icon, IconPicker, spritePlugin } from 'frappe-ui/experimental'
```

Nothing about the components changed — only where they're imported from.
Apps that spread `content` from `frappe-ui/tailwind` keep `IconPicker`
styles automatically — no Tailwind change needed. Note that root
`frappe-ui` exports a different `Icon`; alias one if you import both,
e.g. `import { Icon as SpriteIcon } from 'frappe-ui/experimental'`.
The named SFC icons (`CircleCheckIcon`, `HelpIcon`, ...) stay on
`frappe-ui/icons`. For new code, use `lucide-*` classes — they are the
canonical way to render icons.

## Alert

`Alert` is stateless now — it has no `v-model` and never hides itself. The
parent renders it with `v-if` and reacts to `@dismiss`. Layout is
content-driven: a description or a second action switches it to the banner
layout; there is no `variant` prop. See the [Alert](./components/alert)
component page for the full API.

| Before                       | After                                            |
| ---------------------------- | ------------------------------------------------ |
| unnamed `v-model` (visibility) | `v-if` + `@dismiss` — the parent owns hiding   |
| `theme="yellow"`             | `theme="amber"`                                  |
| `theme` default `'blue'`     | default `'gray'`                                 |
| `variant="subtle" / "outline"` | nothing — one container look, layout is content-driven |
| `dismissible` default `true` | default `false` — pass `dismissible` to keep the × |
| `#icon` slot                 | `#prefix` slot                                   |
| `#footer` slot               | `primaryAction` / `secondaryAction` props, or `#actions` slot |
| hand-rolled icon             | the theme shows a status icon on its own; `:icon="false"` opts out |

Every row is a **silent break**: Vue drops the unknown prop or slot with no
error. The old `v-model` is the one to check first — a dismissed alert now
stays on screen until the parent hides it:

```vue
<!-- Before -->
<Alert v-model="showAlert" title="Payment failed" theme="yellow">
  <template #footer>
    <Button label="Retry" @click="retry" />
  </template>
</Alert>

<!-- After -->
<Alert
  v-if="showAlert"
  title="Payment failed"
  theme="amber"
  dismissible
  :primary-action="{ label: 'Retry', onClick: retry }"
  @dismiss="showAlert = false"
/>
```

An action is `ButtonProps` plus an `onClick` that receives `{ dismiss }` —
call `context.dismiss()` to emit the alert's `dismiss` event:

```ts
const primaryAction = {
  label: 'Retry',
  onClick: ({ dismiss }) => {
    retry()
    dismiss()
  },
}
```

If the alert was really a promotional card in a sidebar, use the new
[`SidebarCard`](./components/sidebar) component instead.

## Sidebar

`Sidebar` is a bare frame — compose `SidebarHeader` / `SidebarSection` /
`SidebarLabel` / `SidebarItem` in its default slot instead of passing
config-object props. See the [Sidebar](./components/sidebar) component page
for the full API.

| Before                                    | After                                             |
| ------------------------------------------ | -------------------------------------------------- |
| `:header="{ title, subtitle, menuItems }"` | `<SidebarHeader :title :subtitle :menu-items />` as a child |
| `:sections="[{ label, items }]"`           | `<SidebarLabel>` + `<SidebarItem>` (or `<SidebarSection>`) as children |
| `<template #header-logo>`                  | `<SidebarHeader>`'s `#prefix` slot                |
| `<template #footer-items>`                 | plain markup in the default slot                  |
| `<SidebarSection :items="rows">`           | `<SidebarSection>` with `<SidebarItem>` children  |
| `<template #sidebar-item="{ item }">`      | write the `<SidebarItem>` directly, no slot needed |
| `item.condition`                           | `v-if` on the composed `<SidebarItem>`            |
| `SidebarItem.isActive`                     | `SidebarItem.active`                              |
| `SidebarHeader`'s `#logo` slot             | `#prefix` slot                                    |

```vue
<!-- Before -->
<Sidebar
  :header="{ title: 'Frappe CRM', subtitle: 'crm.frappe.io', menuItems }"
  :sections="[
    { label: '', items: [{ label: 'Leads', to: '/leads', icon: 'lucide-user-plus' }] },
    { label: 'Views', collapsible: true, items: viewItems },
  ]"
/>

<!-- After -->
<Sidebar>
  <SidebarHeader title="Frappe CRM" subtitle="crm.frappe.io" :menu-items="menuItems" />
  <div class="flex-1 overflow-y-auto px-2">
    <SidebarItem label="Leads" to="/leads" icon="lucide-user-plus" />
    <SidebarSection label="Views" collapsible>
      <SidebarItem v-for="item in viewItems" :key="item.label" v-bind="item" />
    </SidebarSection>
  </div>
</Sidebar>
```

`Sidebar` no longer wraps the middle list in a scroll container or applies any
padding — that's app-owned now (see the component page's Collapse section for
the full composition contract).

## Data fetching (useDoctype / useList)

The write methods on `useDoctype` (`insert`, `delete`, `setValue`,
`runDocMethod`, `runMethod`) and on `useList` (`insert`, `setValue`, `delete`)
used to share one request between all their submits. Each one now sends its own
request, so the shared-request members are gone.

Nothing fails to build, so grep for these by hand. The app keeps rendering and
then throws the first time the removed member is read — usually the first time
someone deletes a row.

| Before                                              | After                        |
| --------------------------------------------------- | ---------------------------- |
| `delete.loading && delete.params.name === row.name` | `delete.isLoading(row.name)` |
| `setValue.params.name`                              | `setValue.isLoading(name)`   |
| `delete.execute()` / `.fetch()` / `.reload()`       | `delete.submit({ name })`    |
| `insert.reset()` / `.abort()`                       | removed, no replacement      |
| `runMethod.isFetching` / `.isFinished`              | `runMethod.loading`          |
| `setValue.promise`                                  | `await setValue.submit(...)` |
| `delete.url`                                        | removed, no replacement      |

All eight now have the same five members: `submit()`, `data`, `error`,
`loading` and `isLoading()`.

`isLoading()` takes whatever identifies one submit:

```js
todos.delete.isLoading(row.name)
todos.setValue.isLoading(row.name)
todos.runDocMethod.isLoading(row.name, 'archive')
todos.runMethod.isLoading('sync_all')
todos.insert.isLoading() // no argument: a new row has no name yet
```

`insert.isLoading()` gives the same answer as `insert.loading`. It is there so
every write method reads the same way.

More changes you will not see at build time:

- `submit()` now resolves with its own response. Code that fired two submits
  and read the result of the first was receiving the second one's data, or
  `null`. If you queued submits to work around that, you can drop the queue.
- `data` and `error` belong to the submit that started last, not the one that
  answered last. A slow submit that comes back after a newer one writes
  nothing and clears nothing. It still answers its own caller with its own
  outcome — resolving with its response, or rejecting with its error.
- **`data` is no longer reset to `null` when a submit fails.** It used to be,
  because the shared request cleared it on any not-ok response. It now keeps
  the last successful response.

  ```js
  await todos.setValue.submit({ name: 'TODO-1', status: 'Done' })
  await todos.setValue.submit({ name: 'TODO-2', status: 'Done' }) // fails

  todos.setValue.data // still the TODO-1 response
  todos.setValue.error // the failure
  ```

  Test `error`, not `data`, to tell a failed submit from a successful one.
  `if (!todos.setValue.data)` used to mean "the last save failed" and no
  longer does.

- `error` is no longer cleared when a submit starts. It used to be, which
  erased the error of a sibling submit still in flight. It now stands until
  the newest submit settles. To blank an error banner while a retry runs, hide
  it on `loading` yourself.
- **`submit()` rejects on any failure.** It resolves with the response, or
  rejects with the error. A failed `validate` already rejected; a failed
  request used to resolve with `null`. Both reject now.

  ```js
  // Before
  const doc = await todos.insert.submit({ title: 'Buy milk' })
  if (!doc) return showError(todos.insert.error)

  // After
  try {
    const doc = await todos.insert.submit({ title: 'Buy milk' })
  } catch (e) {
    showError(e)
  }
  ```

  `null` no longer means "it failed". A server that answers with `null`
  resolves with `null`, like any other response. Every `if (!result)` check
  after a `submit()` has to become a `try` / `catch` or a `.catch()`, and an
  unawaited `submit()` now needs a `.catch()` or it becomes an unhandled
  rejection.
- `useList`'s `insert` and `delete` now send to the `baseUrl` you passed to
  `useList`. They used to ignore it and hit the current origin. `setValue`
  already honoured it, so all three write methods now agree. `useDoctype` was
  never affected.

## Data fetching (exports)

`useFrappeFetch` is no longer exported. It is the raw `createFetch` instance
`useCall`, `useDoc` and `useList` are built on: it sets the Frappe headers and
parses the response, and leaves the URL, the params and the caching to you.
Pick the composable that matches what you are fetching.

| Before                                   | After                       |
| ---------------------------------------- | --------------------------- |
| `useFrappeFetch('/api/v2/method/…')`     | `useCall({ url })`          |
| `useFrappeFetch('/api/v2/document/…')`   | `useDoc({ doctype, name })` |
| `useFrappeFetch('/api/v2/document/…?…')` | `useList({ doctype, … })`   |

This is a build failure at the import, so nothing changes silently.

```js
// Before
import { useFrappeFetch } from 'frappe-ui'
const { data } = useFrappeFetch('/api/v2/method/ping').get()

// After
import { useCall } from 'frappe-ui'
const ping = useCall({ url: '/api/v2/method/ping' })
```

`FrappeResponseError` is exported now. A Frappe error response raises it — it
lands on `.error`, and the write methods above reject with it. The class was
never exported, so you could not tell it apart from a network or parse failure.
Narrow it with `instanceof` and you get `title`, `type`, `indicator` and
`exception`:

```ts
import { FrappeResponseError } from 'frappe-ui'

try {
  await todos.insert.submit({ title: 'Buy milk' })
} catch (e) {
  if (e instanceof FrappeResponseError) {
    showError(e.title, e.type)
  } else {
    throw e
  }
}
```

## Tree

The Tree was rebuilt from a single recursive `node` renderer into a stateful
forest. It takes a `nodes` array and scopes its per-row slots as `#item-*`. Each
node still owns its expansion via an `expanded` field, now defaulting to open —
set `expanded: false` to collapse one (v0 used `defaultCollapsed`). The
`options` blob is gone — sizing moves to CSS variables. Keyboard navigation,
`role="tree"` ARIA, and opt-in drag-and-drop are new.

| Before                                           | After                                                           |
| ------------------------------------------------ | --------------------------------------------------------------- |
| `:node="root"` (single root object)              | `:nodes="[root]"` (array of roots)                              |
| `node.collapsed` / internal collapse             | `node.expanded` (inverted, on each node)                        |
| `:options="{ rowHeight, indentWidth }"`          | `--tree-row-height` / `--tree-indent` CSS vars                  |
| `:options="{ showIndentationGuides }"`           | `guides="connectors" \| "lines" \| "none"`                      |
| `:options="{ defaultCollapsed: true }"`          | `expanded: false` per node, or `v-model:expanded` to toggle all |
| `#node="{ node, isCollapsed, toggleCollapsed }"` | `#item="{ node, expanded, toggle, … }"`                         |
| `#label`                                         | `#item-label`                                                   |
| `#icon`                                          | built-in chevron; override via `#item`                          |

```vue
<!-- Before -->
<Tree :node="root" node-key="name" :options="{ defaultCollapsed: false }">
  <template #label="{ node }">{{ node.title }}</template>
</Tree>

<!-- After -->
<Tree :nodes="[root]" node-key="name">
  <template #item-label="{ node }">{{ node.title }}</template>
</Tree>
```

`v-model:expanded` is a boolean expand/collapse-all switch (bind it to a
button), not a per-node value.

Drag-and-drop is opt-in: set `draggable`, gate drops with
`:move="({ node, target, position }) => …"`, and persist from
`@drag-end="(info) => …"` — `info` is
`{ node, from, to, position, oldIndex, newIndex }`, or `null` when the drag is
cancelled.

## Icons

The single recommended way to pass an icon anywhere in the library is a
`lucide-*` string (rendered via the Tailwind mask plugin) or a `Component`
escape hatch (P11). `FeatherIcon` is removed per
ADR-0008 — it
shipped `@deprecated` in code, so nothing marked deprecated ships in `1.0.0`.

**Breaking, loud:** `import { FeatherIcon } from 'frappe-ui'` and
`<FeatherIcon>` fail at the import. Replace a direct usage with the
`lucide-*` class form:

```vue
<!-- Before -->
<FeatherIcon name="plus" class="size-4" />
<!-- After -->
<span class="lucide-plus size-4" aria-hidden="true" />
```

Feather and lucide share most icon names, so `<FeatherIcon name="x">` →
`<span class="lucide-x">` is usually a direct rename — check each name
individually against [lucide.dev](https://lucide.dev/icons) since a few
differ or were renamed.

**Breaking, silent:** every icon-name prop across the library (`Button.icon`
/ `iconLeft` / `iconRight`, `Dialog.icon`, `Dropdown`/`ContextMenu` item
`icon`, `TabButtons` options `icon` / `iconLeft` / `iconRight`, the `Icon`
component's `name` prop) used to render a bare feather-style name (e.g.
`"edit"`, `"chevron-down"`) via `FeatherIcon`. That fallback is gone: an
unrecognized string now renders nothing. No build or type error — the icon
silently disappears. A dev-mode console warning names the component, the
prop, and the offending value once per (component, prop). Prefix the name
with `lucide-`:

```vue
<!-- Before -->
<Button icon="plus" />
<!-- After -->
<Button icon="lucide-plus" />
```

Same for icon-name strings in `Dropdown` options:

```js
// Before
const options = [{ label: 'Edit', icon: 'edit' }]

// After
const options = [{ label: 'Edit', icon: 'lucide-pen' }]
```

## Card, ListItem, standalone `<Toast>` (removed)

Three unmaintained wrappers are gone in v1, per
ADR-0008 — each
shipped `@deprecated` in code and had zero call sites left across our
census of downstream apps.

**`Card`** wrapped a title/subtitle/actions layout with a manual loading
state. There's no drop-in replacement; rebuild the layout with plain
markup, using [`LoadingText`](./components/loadingtext) or
[`Skeleton`](./components/skeleton) for the loading state:

```vue
<!-- Before -->
<Card title="Title" subtitle="Subtitle" :loading="loading">
  <template #actions><Button label="Edit" /></template>
  Content
</Card>

<!-- After -->
<div class="flex flex-col rounded-lg border px-6 py-5">
  <div class="flex items-baseline justify-between">
    <h2 class="text-lg font-semibold">Title</h2>
    <Button label="Edit" />
  </div>
  <p class="mt-1.5 text-ink-gray-6">Subtitle</p>
  <LoadingText v-if="loading" class="mt-4" />
  <div v-else class="mt-4">Content</div>
</div>
```

**`ListItem`** rendered a title/subtitle/actions row. Same story — no
drop-in replacement, rebuild with plain markup:

```vue
<!-- Before -->
<ListItem title="Title" subtitle="Subtitle">
  <template #actions><Button label="Edit" /></template>
</ListItem>

<!-- After -->
<div class="flex items-center justify-between py-3">
  <div>
    <h3 class="font-medium">Title</h3>
    <p class="text-ink-gray-6">Subtitle</p>
  </div>
  <Button label="Edit" />
</div>
```

**Standalone `<Toast>`** — `import { Toast } from 'frappe-ui'` and
`<Toast>` fail at the import. This only removes the raw `ToastRoot`-based
component; the imperative API is unaffected and is what you almost
certainly want:

```vue
<!-- Before -->
<Toast v-model:open="open" message="Saved" type="success" />

<!-- After -->
<script setup>
import { toast } from 'frappe-ui'
toast.success('Saved')
</script>
```

`<ToastProvider>` (mount once near your app root) and `toast.success()` /
`toast.error()` / `toast.info()` / plain `toast()` are unchanged.

## Tokens

Run the v2 token codemod from the app you are migrating:

```sh
npx --package frappe-ui@beta tokens-v2 --dry-run .
```

Review the output, then run it without `--dry-run`:

```sh
npx --package frappe-ui@beta tokens-v2 .
```

The codemod renames espresso color tokens like `bg-surface-white` to
`bg-surface-base` and merges static text size + weight class pairs, for example
`text-base font-medium` to `text-base-medium`. Run it once per codebase; the
token migration is not idempotent because some v2 names overlap with v0 names.

After upgrading to `frappe-ui@1.0.0-beta.11`, run the codemod again. Apps that
already ran it will only get the typography correction (`text-lg` → `text-md`,
`text-xl` → `text-lg`, ...). Apps that still have pre-v2 color tokens can pass
`--force`, but review the output carefully because color tokens may
double-shift.

### Unused tokens and utilities removed

A pre-`1.0.0` audit (#940) removed the token names below — all had zero call
sites across frappe-ui and every consumer app. Each is a **silent** break:
the class or `--*` variable just stops applying, with no build or type
error.

```
text-tiny
text-13xl / text-14xl / text-15xl / text-16xl (and their -medium/-semibold/-bold/-black variants)
shadow-status
--elevation-status
surface-alert-button-default / -info / -success / -warning / -error
ink-alert-button-default / -info / -success / -warning / -error
surface-alpha-gray-2-overlay
```

If your build used any of these, replace them with the nearest step on the
regular scale — e.g. `text-16xl` → `text-12xl`, `shadow-status` →
`shadow-sm`, `surface-alert-button-error` → `surface-red-2` (or whichever
`variant`+`theme` pairing the design calls for).

## Editor

The v0 monolith `<TextEditor>` (imported from `frappe-ui`) is replaced by the
`frappe-ui/editor` family: a headless `<Editor>` you compose with **kits**
(bundled, configurable extension sets) and **building-block** menus. Everything
moves to the `frappe-ui/editor` subpath; `TextEditor` and its siblings
(`TextEditorBubbleMenu`, `TextEditorFixedMenu`, `TextEditorFloatingMenu`,
`TextEditorContent`, `createEditorButton`) are removed from top-level
`frappe-ui` in `1.0.0` — nothing editor-related is exported from root. See the
[Editor](./molecules/editor) page for the full API and recipes.

Not migrated yet? The v0 family is parked, unchanged, in
`frappe-ui/experimental` as an interim import path. It is unstable — no
deprecation window — and will be removed once consumers migrate:

```ts
import { TextEditor } from 'frappe-ui/experimental'
```

```ts
// Before
import { TextEditor, TextEditorFixedMenu } from 'frappe-ui'
// After
import {
  Editor,
  EditorFixedMenu,
  RichTextKit,
  articleToolbar,
} from 'frappe-ui/editor'
```

| Before                                          | After                                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------ |
| `import … from 'frappe-ui'`                     | `import … from 'frappe-ui/editor'`                                       |
| `<TextEditor>`                                  | `<Editor>`                                                               |
| `:content="x" @change="x = $event"`             | `v-model="x"` (`@change` still emitted)                                  |
| HTML string only                                | `v-model` + `format="json"` for a JSON value                             |
| `:starterkit-options="{ heading: { levels } }"` | `RichTextKit.configure({ heading: { levels } })` in `:extensions`        |
| auto-loaded extension set (no opt-out)          | explicit `:extensions` — pick `CommentKit` / `RichTextKit` / `InlineKit` |
| `:mentions` / `:tags` props                     | `kit.configure({ mention: { items, component }, tag: { items } })`       |
| `:bubble-menu="true"`                           | `<EditorBubbleMenu :items="articleToolbar">` in the default slot         |
| `:floating-menu="true"`                         | `<EditorFloatingMenu :items>`                                            |
| `<TextEditorFixedMenu :buttons>`                | `<EditorFixedMenu :items>`                                               |
| `<TextEditorContent>`                           | `<EditorContent>`                                                        |
| menu `:buttons`                                 | menu `:items`                                                            |
| hand-rolled `textEditorMenuButtons` array       | `commentToolbar` / `articleToolbar` / `minimalToolbar` presets           |
| `#top` / `#bottom` / `#editor` slots            | one default slot — you render `EditorContent` + menus yourself           |
| `:uploadFunction` (optional, frappe default)    | `:upload-function` (required to enable uploads)                          |

### Compose, don't configure

v0 took every option as a prop on `<TextEditor>` and auto-loaded every
extension. v1 renders no chrome of its own — you place the building blocks
inside its default slot and they pick up the editor from context (the `:editor`
prop is only needed when composing primitives without `<Editor>`):

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  Editor,
  EditorContent,
  EditorBubbleMenu,
  RichTextKit,
  articleToolbar,
} from 'frappe-ui/editor'

const content = ref('')
const extensions = [
  RichTextKit.configure({ heading: { levels: [2, 3, 4, 5, 6] } }),
]
</script>

<template>
  <Editor v-model="content" :extensions="extensions" placeholder="Write…">
    <EditorBubbleMenu :items="articleToolbar" />
    <EditorContent class="prose max-w-none" />
  </Editor>
</template>
```

Pick the kit per surface: `CommentKit` (light — no table/toc/slash),
`RichTextKit` (full document), `InlineKit` (single-line). Configure kit members
in place rather than via props — e.g. mentions/tags through
`kit.configure({ mention: {...}, tag: {...} })`. To keep the mention/tag nodes
rendering but disable the live popups, pass `mention: { items: null }`.

For a fully custom layout (e.g. a title `<textarea>` as a sibling of the body),
skip `<Editor>` and drive `useEditor` yourself — see
[Composing primitives](./molecules/editor#composing-primitives) — rendering
`<EditorContent>` and the menus as siblings of your own markup.

### Gotchas

- **Tailwind must scan frappe-ui's editor source.** Menu icons are literal
  `lucide-*` class strings living in `frappe-ui/src/molecules/**`. Add that glob
  to your `tailwind.config.js` `content`, or the toolbar / bubble / floating
  icons silently won't be generated.
- **Uploads need an explicit handler.** v0 silently invoked the Frappe upload;
  v1 requires `:upload-function`. In a Frappe app:
  `(file) => useFileUpload().upload(file, {})`.
- **TipTap must be v3.** The v1 editor is built on TipTap 3 — pin
  `@tiptap/core`, `@tiptap/pm`, and `@tiptap/vue-3` to `^3`.

## Family stylesheets (list-style.css / editor-style.css)

The manual `frappe-ui/list-style.css` and `frappe-ui/editor-style.css` exports
are removed. The `frappe-ui/list` and `frappe-ui/editor` barrels are now marked
as side-effectful, so each family's CSS lands in your production build
automatically when you import anything from its subpath.

Delete the manual imports; there is nothing to add back:

```css
/* Before */
@import 'frappe-ui/list-style.css';
@import 'frappe-ui/editor-style.css';
/* After: nothing — the CSS ships with the subpath import */
```

The build fails loudly (`Missing "./list-style.css" specifier in "frappe-ui"
package`) until the lines are gone.

## `frappe-ui/frappe` and `frappe-ui/drive` (removed)

Both subpaths are gone in v1. frappe-ui is a UI library; the members that
know about doctypes, onboarding flows, or billing moved to `@framework/ui`
(the `ui/` package in the [frappe repo](https://github.com/frappe/frappe)).
Every break here is loud — the import path stops resolving.

| Before (`frappe-ui/frappe`)     | After                              |
| ------------------------------- | ---------------------------------- |
| `useTelemetry`, `telemetryPlugin` | `@framework/ui`                  |
| `useOnboarding`, `GettingStartedBanner`, `IntermediateStepModal`, `HelpModal`, `showHelpModal`, `minimize` | `@framework/ui` |
| `TrialBanner`, `SignupBanner`   | `@framework/ui`                    |
| `DataImport`                    | `@framework/ui`                    |
| `Link`, `LinkProps`, `LinkEmits`, `LinkExposed`, `LinkOption` | `@framework/ui` (superset, see below) |
| `Filter`                        | `@framework/ui` (superset, see below) |
| `OnboardingSteps`, `HelpCenter`, `showHelpCenter` | removed — they live on inside `@framework/ui`'s `HelpModal` |
| `frappe-ui/drive`, `frappe-ui/drive/*` | removed, no replacement     |

`@framework/ui` peer-depends on `frappe-ui`, so add it as a dependency if
your app does not carry it yet, then change the import path:

```js
// Before
import { useTelemetry, TrialBanner } from 'frappe-ui/frappe'

// After
import { useTelemetry, TrialBanner } from '@framework/ui'
```

Two replacements are supersets of what they replace — existing call sites
work unchanged:

- `Link` adds `redirectable` / `editable` props and `redirect` / `edit`
  emits.
- `Filter` adds a `useFilters` composable, `parseFilters` /
  `serializeFilters`, and an operator registry.

The drive components were removed because the drive app already owns the
live copy of all six; nothing imported the subpath.

Finally, drop the stale Tailwind glob. The `frappe/` directory no longer
ships, so this line in `tailwind.config.js` scans nothing:

```js
// Delete this line
'./node_modules/frappe-ui/frappe/**/*.{vue,js,ts,jsx,tsx}',
```

Better: replace the hand-copied list with the
[`content` export](/docs/foundations/tailwind#the-content-export), which
tracks the library's source directories for you.

## Autocomplete (removed)

`Autocomplete` is gone in v1. It merged single- and multi-select via the
`multiple` boolean; v1 splits them: [`Combobox`](./components/combobox) for
single, [`MultiSelect`](./components/multiselect) for multiple.

The import fails, so your build tells you where every call site is. Three
things inside those call sites change quietly instead, and each has a
before/after below: the **v-model payload**, the **group key**, and the
**`open` slot prop**, which was a function and is now a boolean.

Sweep your codebase:

```bash
grep -rln '<Autocomplete\b' src --include='*.vue'   # find usages
grep -rln ':multiple' src --include='*.vue'         # these become MultiSelect
grep -rn 'items:' src --include='*.vue'             # grouped options — see below
```

| Before (`Autocomplete`)           | After                                     |
| --------------------------------- | ----------------------------------------- |
| `:multiple="false"` (default)     | use `Combobox`                            |
| `:multiple="true"`                | use `MultiSelect`                         |
| `v-model` (option or value)       | `v-model` (value / value array)           |
| `@change`                         | `@update:modelValue` (`@update:selectedOption` for the option) |
| grouped `{ group, items }`        | grouped `{ group, options }`              |
| `placement` (string)              | `side` + `align`                          |
| `:showFooter`                     | `#footer` slot (MultiSelect has built-in) |
| `:bodyClasses`                    | `data-slot` CSS                           |
| `:maxOptions`                     | no equivalent                             |
| `#target="{ togglePopover }"`     | `#trigger`, with no click handler (`open` is now a boolean) |
| `#prefix` / `#suffix` / `#item-*` | same (`#suffix` now replaces chevron)     |

### The v-model payload inverts

`Autocomplete` took and emitted the **whole option object**; both replacements
model the **value only** — `Combobox` is `string | number | null`, `MultiSelect`
is `(string | number)[]`. Code that reads `country.value` off the model gets
`undefined` rather than a type error, since the model was loosely typed.

```vue
<!-- Before -->
<Autocomplete v-model="country" :options="countries" @change="onChange" />
<!-- country === { label: 'India', value: 'in' } -->

<!-- After -->
<Combobox v-model="country" :options="countries" @update:model-value="onChange" />
<!-- country === 'in' -->
```

Still need the whole option — for its `description`, an id field, anything
beyond the value? Listen to `@update:selectedOption`, which carries it:

```vue
<Combobox
  v-model="country"
  :options="countries"
  @update:selected-option="(option) => (label = option?.label ?? '')"
/>
```

### Grouped options: `items` → `options`

The key holding a group's children is now `options`, matching the top-level
prop. Both components throw and name the group if they find the old key, so
this one is caught the first time the picker opens — but only then, not at
build time.

```vue
<!-- Before -->
<Autocomplete :options="[{ group: 'Asia', items: [india, japan] }]" />

<!-- After -->
<Combobox :options="[{ group: 'Asia', options: [india, japan] }]" />
```

### `#target` → `#trigger`, and drop the click handler

The slot is renamed, and the wiring inside it changes. `Autocomplete` handed
`#target` a `togglePopover` function you had to call yourself. `Combobox` and
`MultiSelect` attach the open toggle to the `#trigger` element for you, so the
handler is not just unnecessary — a `togglePopover()` carried through the
rename throws `togglePopover is not a function` on every click. The popover
still opens, because the component's own handler already ran, so this reads as
"works, but noisy" until someone looks at the console.

```vue
<!-- Before -->
<Autocomplete :options="fields">
  <template #target="{ togglePopover }">
    <Button label="Add filter" @click="togglePopover()" />
  </template>
</Autocomplete>

<!-- After -->
<Combobox :options="fields">
  <template #trigger>
    <Button label="Add filter" />
  </template>
</Combobox>
```

**`open` changed from a function to a boolean, and that part is silent.** On
`#target` it was the function that opened the popover, so anything reading it
as a value — `v-if="open"`, `:class="{ 'rotate-180': open }"` — was reading a
function object and was **always truthy**. On `#trigger` it is the real open
state, so those expressions start doing what they always looked like they did.

`#trigger` receives
`{ open, disabled, query, selectedOption, displayValue, clear, setOpen }`. Use
`setOpen` for a trigger that has to open the popover from somewhere other than
its own click.

### The default trigger is `trigger="button"`

`Autocomplete` rendered a button showing the selection, with the search box
inside the popover. `Combobox` defaults to `trigger="input"` — the trigger
_is_ the search field. Pass `trigger="button"` to keep the old shape.

## FormControl `type="autocomplete"` (removed)

**This one is silent.** `FormControl` is a dispatcher: with the `autocomplete`
case gone, the type falls through to `TextInput` and is still forwarded as an
html input type. The result is `<input type="autocomplete">`, which every
browser renders as a plain text box. No build error, no runtime error — just a
picker that turned into a text field. A dev-only `console.error` names it.

```vue
<!-- Before -->
<FormControl type="autocomplete" :options="countries" v-model="country" />
<!-- country === { label: 'India', value: 'in' } -->

<!-- After -->
<FormControl type="combobox" :options="countries" v-model="country" />
<!-- country === 'in' -->
```

The v-model payload inverts here too, for the same reason as above. Or use the
standalone [`Combobox`](./components/combobox), which exposes the full set of
props and slots without the wrapper.

## HTTP transport and the `FrappeUI` plugin

v1 has one HTTP path. `frappeRequest` is it; `call` is a thin wrapper over it
for the common "POST to a whitelisted method" case. `request`, `createCall` and
`initSocket` are gone, and `app.use(FrappeUI)` is down to a single option.

| Before                          | After                                        |
| ------------------------------- | -------------------------------------------- |
| `import { request }`            | `import { frappeRequest }`                   |
| `createCall(options)`           | wrap `call` yourself, or use `frappeRequest` |
| `import initSocket`             | your own `io(...)` connection                |
| `app.use(FrappeUI, { config })` | `setConfig(key, value)` per entry            |
| `app.use(FrappeUI, { call })`   | `import { call }` where you need it          |
| `this.$resources` (implicit)    | `app.use(FrappeUI, { resources: true })`     |

The first three are build failures — your bundler or type-check names them. The
rest are the silent ones.

### `call` now honours `setConfig`

`call` built its own `fetch` and never read the config, so `requestBaseUrl` and
`requestHeaders` were quietly ignored on every `call()` while `frappeRequest`
respected them. That inconsistency is fixed, which means a `call` in an app that
sets either one now behaves differently — usually the way you assumed it already
did. Two knock-on effects worth checking:

- If you set `requestBaseUrl` for local dev against a remote site, `call` now
  goes to the remote site too, with `credentials: 'include'`.
- If you set `serverMessagesHandler`, `_server_messages` returned by a `call`
  now reach it. Previously only `frappeRequest` and the resources fed it, so
  expect toasts from paths that used to be silent.

`call`'s signature, the value it resolves to, and the
`{ response, status, error }` object passed to `onError` are all unchanged.

### The plugin's `config` option is gone

```js
// Before
app.use(FrappeUI, {
  config: {
    resourceFetcher: frappeRequest,
    defaultListUrl: 'gameplan.extends.client.get_list',
    systemTimezone: window.system_timezone || null,
  },
})

// After
setConfig('resourceFetcher', frappeRequest)
setConfig('defaultListUrl', 'gameplan.extends.client.get_list')
setConfig('systemTimezone', window.system_timezone || null)
app.use(FrappeUI)
```

Passing a removed option is not a type error if your `main.js` is plain JS, so
the plugin logs a dev-mode warning naming the option it ignored. Note that
`setConfig` only accepts keys of `FrappeUIConfig` — if you were passing a key
that isn't one, it was never read and can be deleted.

### `$resources` is opt-in

The plugin used to install the v1 resources Options API mixin by default, so
`this.$resources`, `$getResource`, `$getDoc`, `$getListResource` and
`$refetchResource` existed in any app that called `app.use(FrappeUI)`. It now
installs only when asked:

```js
app.use(FrappeUI, { resources: true })
```

Nothing changes for Composition API code — `createResource`,
`createListResource` and `createDocumentResource` never went through the plugin.
You need the option only if you declare a `resources: { … }` block in a
component's options.

You will not have to work this out from a blank screen. A component that
declares `resources` without the option throws on creation, naming itself and
the fix, and reading `this.$resources` throws too. Both throw in production
builds as well as dev — this is a break that has no quiet failure mode.

### `initSocket` is gone

It was a nine-line `io()` wrapper, and the plugin created one by default — which
meant apps that also built their own socket held two live connections per page
load. If you relied on the `$socket` global the plugin set, create the
connection yourself:

```js
import { io } from 'socket.io-client'

const host = window.location.hostname
const port = window.location.port ? ':9000' : ''
const protocol = port ? 'http' : 'https'
const siteName = import.meta.env.DEV ? host : window.site_name

app.config.globalProperties.$socket = io(
  `${protocol}://${host}${port}/${siteName}`,
  { withCredentials: true },
)
```

Until you do, reading `this.$socket` throws with that instruction rather than
returning `undefined` and crashing in whatever realtime handler reads it next.
Assigning your own replaces the guard. The same applies to `$call`, the other
global the plugin used to install — import `call` from `frappe-ui` instead.

## useCall: a throwing `beforeSubmit` now cancels the submit

Previously a `beforeSubmit` hook that threw was caught and logged, and the
request was **sent anyway**. Now the throw propagates: the request is not sent
and `submit()` rejects with the hook's error.

This is a silent behavior change. If one of your `beforeSubmit` hooks can
throw, the submit it used to let through now stops. Either handle the rejection
at the call site or make the hook non-throwing to keep the old behavior. A
hook that returns normally is unaffected — it still cannot stop the request.

`beforeSubmit` may now be async (`() => void | Promise<void>`); it was always
awaited, only the type said otherwise.

## pageMetaPlugin — removed

`pageMetaPlugin` and the global mixin it installed are gone. A `pageMeta()`
component option still compiles — it's a plain, unread object key — but
nothing calls it anymore, so `document.title` and the favicon stop updating.
This is a **silent break**: no error, no warning, the page just stops
retitling itself.

| Before                                    | After                                   |
| ------------------------------------------ | ---------------------------------------- |
| `app.use(pageMetaPlugin)`                  | delete — nothing to install              |
| `pageMeta() { return { title, emoji } }`   | `usePageMeta(() => ({ title, emoji }))` in `setup()` |

```vue
<!-- Before -->
<script>
export default {
  pageMeta() {
    return { title: this.pageTitle, emoji: '🌈' }
  },
}
</script>

<!-- After -->
<script setup>
import { usePageMeta } from 'frappe-ui'

usePageMeta(() => ({ title: pageTitle.value, emoji: '🌈' }))
</script>
```

`usePageMeta` works the same everywhere — see the
[composables page](./other/composables#usepagemeta).

## CommandPalette

`show` is renamed to `open`, matching the rest of the library's overlay
vocabulary. This is a **silent break**: Vue accepts the unknown `show` prop
with no error, so the palette just never opens.

| Before                  | After                    |
| ------------------------ | ------------------------ |
| `v-model:show="show"`    | `v-model:open="open"`    |

```vue
<!-- Before -->
<CommandPalette v-model:show="show" :groups="groups" @select="onSelect" />

<!-- After -->
<CommandPalette v-model:open="open" :groups="groups" @select="onSelect" />
```

`Mod+K` now opens the palette on its own (registered internally via
`useShortcut`) — delete any app-level keydown listener that toggled it.

## KeyboardShortcut

The deprecated `shortcut` prop, and the unused `meta` / `ctrl` / `shift` /
`alt` boolean props, are removed. Use `combo` — a string like `"Mod+Shift+K"`.

| Before                                   | After                        |
| ------------------------------------------ | ----------------------------- |
| `<KeyboardShortcut shortcut="Mod+K" />`    | `<KeyboardShortcut combo="Mod+K" />` |
| `<KeyboardShortcut ctrl shift>K</KeyboardShortcut>` | `<KeyboardShortcut combo="Mod+Shift+K" />` |

## PageHeaderMobile family — slot names

`PageHeaderMobile`'s `#left`/`#right` and `PageHeaderMobileTitle`'s `#icon`
are renamed to the shared `#prefix`/`#suffix` vocabulary (see
[PHILOSOPHY.md P6](https://github.com/frappe/frappe-ui/blob/main/PHILOSOPHY.md)).
This is a **silent break**: Vue drops content passed to an unknown slot name
with no error or warning — the back button, title icon, or trailing action
just stops rendering.

| Before                                | After                             |
| -------------------------------------- | ---------------------------------- |
| `PageHeaderMobile` `#left`             | `#prefix`                          |
| `PageHeaderMobile` `#right`            | `#suffix`                          |
| `PageHeaderMobileTitle` `#icon`        | `#prefix`                          |

```vue
<!-- Before -->
<PageHeaderMobile title="Space">
  <template #left><BackButton /></template>
  <template #right><Button icon="lucide-more-horizontal" /></template>
</PageHeaderMobile>
<PageHeaderMobileTitle title="Space">
  <template #icon><SpaceIcon /></template>
</PageHeaderMobileTitle>

<!-- After -->
<PageHeaderMobile title="Space">
  <template #prefix><BackButton /></template>
  <template #suffix><Button icon="lucide-more-horizontal" /></template>
</PageHeaderMobile>
<PageHeaderMobileTitle title="Space">
  <template #prefix><SpaceIcon /></template>
</PageHeaderMobileTitle>
```

Grep for `#left`, `#right`, and `#icon` on these two components specifically —
other components (e.g. `ListView`'s footer) have their own unrelated `#left`/
`#right` slots that are unaffected.

## FAQ

**Will my CSS break?** Where structure changed, components expose `data-*` hooks
(`data-slot`, `data-state`, `data-size`, `data-variant`). Audit selectors that
targeted tags or classes.

**Report bugs:** [file an issue](https://github.com/frappe/frappe-ui/issues/new)
with the `v1-beta` label. Include the component name, before/after code,
version, and a repro.
