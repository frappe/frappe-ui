---
pageClass: migration-page
---

# Migration from v0

A guide for moving an existing app onto `frappe-ui` v1. Work through one
component family at a time. Each section opens with a before/after table. For
the full change list see the
[changelog](/docs/changelog);
for the rationale behind each API see the
[v1 release specs](https://github.com/frappe/frappe-ui/tree/main/v1-release).

After each pass, `grep` for the old prop or slot name to catch anything missed,
then test the flows you touched. Type-checking won't catch focus, slot renames,
or visual regressions.

## What this guide covers

Every **silent break** has a before/after here: old code that still runs, still
type-checks, and behaves differently. Vue drops an unknown prop or slot without
a word, so those are the ones that reach production. Each is marked.

**Loud breaks** — an import that stops resolving, a type that no longer exists
— are listed in the [changelog](/docs/changelog) and only appear here when the
replacement needs explaining. If your build already names the file and the
line, the changelog is the faster read.

Two changes have a codemod: the Tailwind token renames (`tokens-v2`, see
[Tokens](#tokens)) and the shortcut config (`shortcuts-v1`, see
[The shortcuts codemod](#the-shortcuts-codemod)). Every other component, prop
and slot rename is a hand edit.

### Sections

- **Overlays** — [Dialog](#dialog) · [Popover / HoverCard / Tooltip](#popover-hovercard-tooltip) · [CommandPalette](#commandpalette)
- **Pickers and selection** — [DatePicker / TimePicker](#datepicker-timepicker-family) · [MonthPicker](#monthpicker) · [Selection family](#selection-family-dropdown-select-combobox-multiselect) · [Autocomplete](#autocomplete-removed) · [FormControl `type="autocomplete"`](#formcontrol-type-autocomplete-removed)
- **Inputs and files** — [Inputs](#inputs) · [FileUploader](#fileuploader)
- **Navigation and layout** — [Sidebar](#sidebar) · [Tabs](#tabs) · [TabButtons](#tabbuttons) · [PageHeaderMobile](#pageheadermobile-family-slot-names) · [Divider](#divider)
- **Keyboard** — [useShortcut](#useshortcut-is-now-usekeyboardshortcut) · [KeyboardShortcutsModal](#keyboardshortcutsmodal-is-now-keyboardshortcutsdialog) · [The shortcuts codemod](#the-shortcuts-codemod) · [KeyboardShortcut](#keyboardshortcut)
- **Display** — [Alert](#alert) · [Icons](#icons) · [Tree](#tree) · [Card, ListItem, Toast](#card-listitem-standalone-toast-removed)
- **Editor and charts** — [Editor](#editor) · [Charts](#charts)
- **Data and transport** — [useDoctype / useList](#data-fetching-usedoctype-uselist) · [Data-fetching exports](#data-fetching-exports) · [HTTP transport and the plugin](#http-transport-and-the-frappeui-plugin) · [`beforeSubmit`](#usecall-a-throwing-beforesubmit-now-cancels-the-submit) · [Composables and directives](#composables-and-directives-renamed) · [pageMetaPlugin](#pagemetaplugin-removed)
- **Tokens and CSS** — [Tokens](#tokens) · [Family stylesheets](#family-stylesheets-list-style-css-editor-style-css) · [`hljs-theme.css` and `tailwind/tokens.js`](#hljs-theme-css-and-tailwind-tokens-js-removed)
- **Moved, not removed** — these five families changed an import path and
  nothing else: [ListView](#listview-—-moved-to-frappe-ui-experimental) ·
  [Calendar](#calendar-—-moved-to-frappe-ui-experimental) ·
  [Charts (v1)](#charts-v1-—-moved-to-frappe-ui-experimental) ·
  [Sprite icons](#sprite-icons-—-moved-to-frappe-ui-experimental) ·
  [ThemeSwitcher](#themeswitcher), which
  stays deprecated at its new path. The v0 `TextEditor` family moved the same
  way — see [Editor](#editor).
- **Removed subpaths** — [`frappe-ui/code-editor`](#frappe-ui-code-editor-removed) · [`frappe-ui/frappe` and `frappe-ui/drive`](#frappe-ui-frappe-and-frappe-ui-drive-removed)

## Requirements

v1 requires **Node `>=20.19.0`** (`package.json` `engines`). The 0.1.x line
declared no `engines` field at all, so this is a new floor rather than a raised
one — a Node 18 image that built v0 fine now fails to install.

Vue and vue-router are unchanged: `vue >=3.5.0` and `vue-router ^4.1.6`
(`package.json` `peerDependencies`). An app already on v0 needs no Vue bump.

Tailwind stays on **v3**. `frappe-ui/tailwind` is a v3 preset and frappe-ui
declares no `tailwindcss` peer dependency, so a v4 project installs cleanly and
then fails at build time. See the
[Tailwind page](/docs/foundations/tailwind).

v1 also depends on **`@vueuse/core` `^14.1.0`**, up from `^10.4.1` in the 0.1.x
line. VueUse 14 requires Vue `^3.5.0`, which v1 already requires. If your app
depends on `@vueuse/core` directly, move it to `^14` as well. Two major ranges
in one app install two copies of the library, and a `resolve.dedupe` entry for
`@vueuse/core` then collapses them onto whichever copy wins. That breaks the
components which expect the newer one.

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
| `:icon="{ appearance: 'warning' }"`   | `:icon="{ theme: 'amber' }"`     |
| `dialogRef.close()`                   | `v-model:open` / `close` slot prop |
| manual focus hacks / `v-focus`        | `autofocus` attr on a descendant |

Most of this table is **silent**: Vue drops an unknown prop or slot with no
error, so the dialog renders with no title, no actions, or an empty body, and a
leftover `:disable-outside-click-to-close` quietly becomes dismissible. Two
rows are loud instead — `onClick: (close) => close()` throws
`TypeError: close is not a function`, and a template-ref `.close()` throws the
same way. `v-model` itself still works (`modelValue` is kept as a second
binding), but `open` is canonical and wins when both are bound.

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
<Dialog :icon="{ name: 'lucide-alert-triangle', theme: 'amber' }" ... />
```

`appearance` is dropped silently — Vue accepts the unknown key with no error,
so the icon renders with no tone. Map `warning → amber`, `info → blue`,
`danger → red`, `success → green`.

### `theme: 'yellow'` → `theme: 'amber'`

The warning tone is `amber`, matching `Alert`, `SidebarCard`, `Badge` and
`Avatar`. `Dialog` was the last component spelling it `yellow`, and it already
rendered that value with the amber tokens — only the word changes, not the
color.

| Before                     | After                     |
| -------------------------- | ------------------------- |
| `:icon="{ theme: 'yellow' }"` | `:icon="{ theme: 'amber' }"` |
| `dialog.confirm({ theme: 'yellow' })` | `dialog.confirm({ theme: 'amber' })` |

This is a **silent break** for JavaScript call sites: `yellow` is no longer a
key in the tone maps, so the icon renders with no tone and nothing throws.
TypeScript call sites get a union error.

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
share the popover-trigger vocabulary. Every removed prop and slot below is
deleted, not aliased — and nothing warns at the tag: an unknown prop lands as
an inert attribute, a renamed slot stops rendering. `grep` for each old name
after upgrading.

| Before                                   | After                        |
| ----------------------------------------- | --------------------------- |
| `:value` prop                             | `v-model`                    |
| `placement="bottom-start"`                | `side` + `align` + `offset`  |
| `:autoClose`                              | `:keepOpen` (inverted)       |
| `allowCustom` / picker-level `readonly`   | `typeable`                   |
| `inputClass`                              | `class`                      |
| `minTime`/`maxTime` (TimePicker), `minDateTime`/`maxDateTime` (DateTimePicker) | `min` / `max` |
| `#target` (DatePicker, DateRangePicker, DateTimePicker) | `#trigger` — TimePicker has neither |
| `TimePicker.scrollMode`                   | nothing — list is always centered |
| `TimePicker.use12Hour`                    | `format="h:mm A"`            |

`@change` still fires alongside `@update:modelValue` — it wasn't deprecated
and doesn't need replacing.

Most of the table above is a **silent break**: an old prop name that's no
longer in the component's types lands as an inert extra attribute (or, for
`min`/`max` aliases, the constraint just stops being enforced) instead of
throwing. TypeScript callers get a compile error instead. `#target` is the
one slot case — content in a leftover `<template #target>` silently stops
rendering.

### Trigger slot props

`#trigger`, `#prefix` and `#suffix` receive `{ open, toggle }` — the same two
names `Popover`, `HoverCard`, `Dropdown`, `Select`, `Combobox` and
`MultiSelect` hand out. `TimePicker`'s `#suffix` follows.

| Before          | After    |
| --------------- | -------- |
| `isOpen`        | `open`   |
| `togglePopover` | `toggle` |

`displayLabel` and `inputValue` are unchanged, and `#actions` already used
`close` — that stays too.

`toggle` also takes `Popover`'s signature, `(flag?: boolean | Event) => void`:
a bare call flips, a boolean sets, and a DOM event is ignored. `togglePopover`
only ever flipped, so nothing that worked before behaves differently.

This is a **silent break**: a destructured `isOpen` becomes `undefined`, so a
class bound to it stops applying with no error, and `togglePopover()` throws
`togglePopover is not a function` only if you call it.

```vue
<!-- Before -->
<template #trigger="{ togglePopover, isOpen }">
  <Button :class="isOpen && 'ring-2'" label="Pick a date" @click="togglePopover" />
</template>

<!-- After -->
<template #trigger="{ toggle, open }">
  <Button :class="open && 'ring-2'" label="Pick a date" @click="toggle" />
</template>
```

Behavior changes that apply even if you don't touch your code:

- `DateRangePicker` emits a `[from, to]` tuple. Update handlers that called
  `.split(',')` on the value.
- `DateRangePicker.modelValue` is `string[]` on the way in too. A stored v0
  `"from,to"` string is read positionally, so the picker silently opens with
  nothing selected. Convert stored values with `.split(',')` before binding.
- `DateTimePicker` no longer auto-closes on date click. Close from
  `@update:modelValue` or add an `#actions` Apply button.
- The popover footer and auto Clear button were removed. Render an explicit
  Clear inside `#actions` if you relied on it.
- `DateRangePicker.clearable` now defaults to `true`, and nothing on
  `DateRangePicker` reads it — emptying the input always clears the range.
  `DatePicker` and `DateTimePicker` still honour `:clearable="false"`.
- `useDatePicker` and its helpers (`getDate`, `getDatesAfter`,
  `getDaysInMonth`, `isLeapYear`) are deleted — the import fails. Nothing in
  the picker components used them; drop the import.

## MonthPicker

`MonthPicker` is deleted — the import fails.

Its model was one string holding **both** parts, `"<Month> <Year>"` (for
example `"January 2026"`), written by a popover that toggled between a month
grid and a year grid. Nothing in v1 reproduces that, so pick the replacement
that matches what your code reads off the value:

- Month **and** year: use `DatePicker` and format the value yourself, or pair
  two `Select`s.
- Month only: use `Select` with month options.

```vue
<!-- Before -->
<MonthPicker v-model="month" />
<!-- month === 'January 2026' -->

<!-- After -->
<Select
  v-model="month"
  :options="[
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    // ...
  ]"
/>
<!-- month === '01' — the year is no longer part of the value -->
```

## Selection family (Dropdown / Select / Combobox / MultiSelect)

Upgrade all three pickers together. They share an option shape and a slot
vocabulary, and most apps use more than one.

Nothing here was deleted for an alias — the removed props, option keys and
slot props are gone outright. Most fail quietly; see each subsection.

### Shared

| Before                                  | After                                        |
| --------------------------------------- | -------------------------------------------- |
| Dropdown `{ group, items }`             | `{ group, options }`                         |
| `#option` slot                          | `#item-label`, plus `#item-prefix` for icons |
| `option` item slot prop                 | `item`                                       |
| `clearAll` slot prop                    | `clear`                                      |
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
callers get errors instead: `items` and `component` stay in the option types as
`never`, and `placement` is gone from `DropdownProps` altogether. A dev-mode
console warning also fires when `placement`, `items` or `component` reaches the
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

**A `{ group, items }` entry disappears** — the group resolves to zero options
and is dropped, leaving the rest of the menu intact:

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

`Select` and `MultiSelect` lost `#option`; `Combobox` and `MultiSelect` lost
`render` and `slotName`. They
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
| `NestedPopover`                                   | `Popover` — **loud**: the import fails, so the build names every call site. It never nested, and it was the last `@popperjs/core` consumer |

Two more changes have no prop to grep for. v0 always set the panel's
`min-width` to the trigger's width; v1 does it only under `matchTriggerWidth`,
so a panel that leaned on that now shrinks to its content. And the panel no
longer teleports into a `#frappeui-popper-root` div — reka portals it to
`body`, or to the host's portal target. Delete any CSS or
`document.querySelector` aimed at that id; nothing creates it now.

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
    <img :src="url" class="max-h-40 rounded-4 shadow-xl" />
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
| `<Input>` (removed)                        | `TextInput` / `Textarea` / `Select` / `Checkbox`, or `FormControl` |
| `Rating` `:rating_from`                    | `:max`                 |
| `Rating` `:readonly`                       | `:disabled`            |
| `Switch` `@change`                         | `@update:modelValue`   |
| `Switch.labelClasses`                      | `data-*` styling hooks |
| `Checkbox.padding`                         | `padded`               |
| `Password` `:value` prop (removed)         | `v-model`              |
| `TextInput` / `Textarea` ref `.el`         | ref `.inputElement`    |

The five rows below `<Input>` are **removed**, not aliased. The old names are
silently ignored: a `Rating` with `:rating_from="10"` renders 5 stars, a
`:readonly` Rating becomes interactive, a `Switch` `@change` handler never
fires, and `labelClasses` / `Checkbox.padding` stop styling anything. Nothing
breaks at build time, so grep for these names when upgrading.

`<Input>` is different: the import fails, so importing call sites break loudly.
Apps that register components globally get no import error — the tag just fails
to resolve and renders nothing, with a dev-only "Failed to resolve component"
warning. Grep the tag, not the import: `grep -rn '<Input\b' src`.

`Slider` no longer hardcodes `aria-label="Volume"`. Pass `label` explicitly so
the control is announced correctly.

`CircularProgressBar` is deleted — the import fails. Use `Progress` for a
linear bar, or render the arc yourself; there is no circular variant in v1.

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

This fails late rather than at build time: `ref.value.el` is `undefined`, so
the next access — `ref.value.el.focus()` — throws at runtime, far from the
upgrade. A typed ref catches it as a build error instead.

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
stated `private` / `is_private` to **private**, not public. Coming from v0,
`FileUploader` flips with them: it had no `private` prop at all and inherited
the public default. It has uploaded private by default since
`v1.0.0-beta.21`, so only pre-beta.21 upgrades see the component change.

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

`failure` also fires for validation now. A `validateFile` that returns a
message or throws emits `failure` with that value; v0 only wrote it to the
slot's `error`. An existing `@failure` handler starts seeing validation
rejections alongside upload errors.

### `fileToBase64` and the size-limit helpers — no longer exported

`fileToBase64` is no longer exported from `frappe-ui`; the import fails at
build time. There were no external call sites at the v1 sweep. Computing a
file's base64 representation yourself is a few lines of
`FileReader.readAsDataURL`. The size-limit helpers (`formatBytes`,
`getMaxFileSize`, `fileSizeLimitMessage`) were only ever exported during the
`1.0.0` betas and are internal now.

## Divider

| Before           | After            |
| ---------------- | ---------------- |
| `action.handler` | `action.onClick` |

This is a **silent break**: `handler` is dropped as an unknown key, so the
action button still renders and does nothing on click.

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

## Calendar — moved to `frappe-ui/experimental`

`Calendar` is not core v1 surface. It moves out of the root export to
`frappe-ui/experimental` (P14 — no stability promise) and parks there,
API unchanged, until a redesigned calendar family replaces it. The import
fails at the root; switch the subpath:

```ts
// Before
import { Calendar, CalendarColorMap } from 'frappe-ui'

// After
import { Calendar, CalendarColorMap } from 'frappe-ui/experimental'
```

Every other name in the family moves the same way: `CalendarActiveEvent`
and the types `CalendarActions`, `CalendarCellClickData`, `CalendarConfig`,
`CalendarEvent`, `CalendarMode`, `CalendarPublicProps`, `CalendarTimeFormat`,
`GroupedCalendarEvents`. Nothing about the component itself changed — only
where it's imported from.

## Charts (v1) — moved to `frappe-ui/experimental`

The first chart family is not core v1 surface. `AxisChart`, `DonutChart`,
`ECharts`, `FunnelChart`, `NumberChart` and `useAxisChartOptions` move out of
the root export to `frappe-ui/experimental` (P14 — no stability promise) and
park there, API unchanged, while apps migrate. The import fails at the root;
switch the subpath:

```ts
// Before
import { AxisChart, DonutChart, NumberChart } from 'frappe-ui'

// After
import { AxisChart, DonutChart, NumberChart } from 'frappe-ui/experimental'
```

Nothing about the components changed — only where they're imported from. Apps
that spread `content` from `frappe-ui/tailwind` keep their styles
automatically.

For new code, use [`frappe-ui/charts`](/docs/charts/overview) instead. It is
the replacement family and draws everything the old one did. Its props are
flat and name the columns of your rows, so a `config` object becomes props:

```vue
<!-- Before -->
<AxisChart :config="{ data: rows, xAxis: { key: 'week' }, series: [{ name: 'balance', type: 'area' }] }" />

<!-- After -->
<AreaChart :data="rows" x="week" y="balance" />
```

The port is not a pure rename. Four `config` keys have no same-named prop, so a
rename-only port drops them **silently** — no build error, no type error, just a
chart that scales or draws differently:

| v0 `config` key               | `frappe-ui/charts` prop                                            |
| ----------------------------- | ------------------------------------------------------------------ |
| `yAxis.yMin` / `yAxis.yMax`   | `yAxis.min` / `yAxis.max`                                          |
| `y2Axis.yMin` / `y2Axis.yMax` | `y2Axis.min` / `y2Axis.max`                                        |
| `swapXY`                      | `horizontal` (`BarChart` only — a horizontal bar has no `y2` axis) |
| `colors`                      | `palette`, or `seriesConfig[key].color`                            |

Combo charts survive the port: `seriesConfig[key].type` takes
`'bar' | 'line' | 'area'`, and `seriesConfig[key].axis: 'y2'` moves one series
to the second value axis, configured with the chart-level `y2Axis` prop.

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
| `type="warning"`             | nothing — `theme` colors the status icon and the row action |
| default slot (body text)     | `description` prop, or the `#description` slot   |
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

## Badge

`theme="orange"` is removed. It was a deprecated alias that resolved to
`amber`, so the replacement renders the same badge it always did.

| Before            | After            |
| ----------------- | ---------------- |
| `theme="orange"`  | `theme="amber"`  |

How the break shows up depends on whether the call site is typed:

- **TypeScript: loud.** `vue-tsc` rejects the value, because the `theme` prop
  union no longer accepts the string. You get a compile error, not a surprise
  in production.
- **JavaScript and bound values: silent.** The badge renders in the default
  `gray` theme and logs a one-time dev-mode warning naming the component, the
  prop and the value. Production logs nothing.

```
[frappe-ui] Badge.theme="orange" is not a supported value — falling back to
"gray". Supported: gray, blue, green, amber, red, violet.
```

A missed site is therefore a grey badge, not a broken page. `Badge` used to
index a class map by theme and then index the result again by variant, so an
unknown theme threw `TypeError: Cannot read properties of undefined` mid-render
and took the parent render with it. All three of `theme`, `variant` and `size`
now fall back to their defaults instead.

Do not rely on the fallback. It is a safety net for the upgrade, not a
supported way to pass a colour — a grey badge where a coloured one belongs is
still a bug, and the dev warning is the only thing that will tell you.

```vue
<!-- Before -->
<Badge theme="orange" label="In Progress" />

<!-- After -->
<Badge theme="amber" label="In Progress" />
```

Check bound themes too, not only literal attributes. A status-to-theme map or
a computed that returns `'orange'` degrades the same way, and neither `vue-tsc`
nor a grep for `theme="orange"` finds it:

```ts
// Before
const themeByStatus = { open: 'orange', closed: 'green' }

// After
const themeByStatus = { open: 'amber', closed: 'green' }
```

Watch for `orange` as a **fallback**, which affects more sites than it looks —
every caller that omits a theme lands on it:

```vue
<!-- Before — every caller without `badge.theme` renders grey -->
<Badge :theme="badge.theme ?? 'orange'" />

<!-- After -->
<Badge :theme="badge.theme ?? 'amber'" />
```

If your app keeps its own colour vocabulary and cannot rename `orange` at the
source, translate at the boundary instead of passing it through:

```ts
const badgeTheme = tone === 'orange' ? 'amber' : tone
```

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

Every removal here is a **silent break**. A dropped prop (`header`, `sections`,
`items`, `isActive`) becomes a fall-through attribute on the component's root
element, and content passed to the removed `#sidebar-item` slot is discarded —
no build error, no type error, no warning. The sidebar renders as an empty
frame. Grep for `:header=`, `:sections=`, `:items=`, `#sidebar-item` and
`isActive` on these five components after upgrading.

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

## SettingsDialog

Open state moves from the unnamed `v-model` to `v-model:open`, the name every
other overlay in the library uses.

This is a **silent break**: Vue accepts the unknown `modelValue` prop with no
error, so the dialog just never opens.

| Before                          | After                                |
| ------------------------------- | ------------------------------------ |
| `v-model="showSettings"`        | `v-model:open="showSettings"`        |
| `@update:modelValue="onToggle"` | `@update:open="onToggle"`            |

```vue
<!-- Before -->
<SettingsDialog v-model="showSettings" v-model:tab="tab">…</SettingsDialog>

<!-- After -->
<SettingsDialog v-model:open="showSettings" v-model:tab="tab">…</SettingsDialog>
```

`v-model:tab` is unchanged. Unlike `Dialog`, `SettingsDialog` has no legacy
unnamed-`v-model` binding to keep — `open` is the only visibility channel.

## Tabs

The monolithic `Tabs` is replaced by a composed family: `Tabs`, `TabList`,
`TabTrigger`, `TabPanel`. The model is the trigger `value`, never an index.
See the [Tabs](./components/tabs) component page for the full API.

There is no codemod for the Tabs family. `tokens-v2` rewrites Tailwind token
names only — it never touches a component, prop, or slot name. Every rename
below is a hand edit, and most of them fail silently, so grep for the old name
rather than waiting for the build to tell you.

| Before                                      | After                                                                      |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| `v-model="tabIndex"` (index)                | `v-model="tab"` (trigger `value`)                                          |
| `:tabs="[{ label, icon }]"` (required)      | `<TabTrigger>` children; the `tabs` shorthand stays for generated sets     |
| `label` implied the value                   | `value` is required on every trigger                                       |
| `as="div"`                                  | removed — compose and style the container directly                         |
| `<template #tab-item="{ tab, selected }">`  | `TabTrigger` props (`icon`, `iconLeft`, `route`) and slots (`#prefix`, default, `#suffix`), or `#tab-label` in shorthand mode |
| `#prefix` / `#label` / `#suffix` / `#panel` alongside `:tabs` | `#tab-prefix` / `#tab-label` / `#tab-suffix` / `#tab-panel` — every shorthand slot carries the `tab-` prefix; composed `TabTrigger` keeps plain `#prefix` / `#suffix`. An unknown slot name renders nothing, nothing throws |
| extra fields on a `tabs` item (`{ value, content }`) | `data: { content }`, read as `tab.data.content` — extra keys are now a type error |
| `<template #tab-panel="{ tab }">`           | `<TabPanel :value>` children; the shorthand slot is `#tab-panel`, back on its v0 name (it was briefly `#panel` in the betas) |
| `Tab.route` string + hand-rolled route sync | `route: RouteLocationRaw` on the trigger; selection derives from the route |
| stale-index clamps for conditional tabs     | built in: a stale model falls back to the first visible trigger and emits  |
| `[&_[role='tablist']]:px-4` class blobs     | `<TabList class="px-4">` — the app owns the element                        |
| built-in flex and overflow defaults          | none — see Scrolling below; the tabs stop scrolling and overflow instead   |
| `iconRight` on a trigger or a `tabs` item   | `<template #suffix>` on a composed `TabTrigger`, `<template #tab-suffix>` in shorthand mode — the icon silently stops rendering, nothing throws |

```vue
<!-- Before -->
<Tabs v-model="tabIndex" :tabs="[{ label: 'Emails' }, { label: 'Calls' }]">
  <template #tab-item="{ tab, selected }">
    <span :class="selected ? 'text-ink-gray-9' : ''">{{ tab.label }}</span>
  </template>
  <template #tab-panel="{ tab }">
    <div>{{ tab.label }} content</div>
  </template>
</Tabs>

<!-- After -->
<Tabs v-model="tab">
  <TabList>
    <TabTrigger value="emails" label="Emails" />
    <TabTrigger value="calls" label="Calls" />
  </TabList>
  <TabPanel value="emails">Emails content</TabPanel>
  <TabPanel value="calls">Calls content</TabPanel>
</Tabs>
```

`Tabs` exposes nothing on the template ref, and `TabList` gains full variant
parity with `TabButtons`: `underline`, `subtle`, `ghost`, `browser-tab`.

### Scrolling

v0 shipped layout defaults: the root was `flex flex-1 overflow-hidden
flex-col`, the tablist `overflow-x-auto`, and every panel `flex flex-col
overflow-auto`. v1 sets none of them, because they broke as often as they
helped — a `Tabs` that force-grows to fill its parent is wrong everywhere the
tabs are not the whole screen.

Nothing throws. Inside a height-constrained container the panel stops
scrolling and overflows instead. Check any call site that relied on it.

In composed mode the app owns the elements, so put the classes back where you
want them:

```vue
<Tabs v-model="tab" class="flex min-h-0 flex-1 flex-col">
  <TabList class="overflow-x-auto">…</TabList>
  <TabPanel value="emails" class="min-h-0 flex-1 overflow-auto">…</TabPanel>
</Tabs>
```

In shorthand mode the generated elements are not yours to class, so reach them
through their `data-slot` hooks:

```vue
<Tabs
  v-model="tab"
  :tabs="items"
  class="min-h-0 flex-1 [&_[data-slot=tab-list]]:overflow-x-auto [&_[data-slot=tab-panel]]:min-h-0 [&_[data-slot=tab-panel]]:flex-1 [&_[data-slot=tab-panel]]:overflow-auto"
/>
```

## TabButtons

`TabButtons` keeps its radiogroup role — a value input, not a panel switcher —
and aligns its vocabulary with the Tabs family. See the
[TabButtons](./components/tabbuttons) component page for the full API.

| Before                                      | After                                       |
| ------------------------------------------- | ------------------------------------------- |
| `type="ghost"`                              | `variant="ghost"`                           |
| `direction="right"`                         | `side="right"` — the same prop name on `TabList` |
| `TabButtonsType` / `TabButtonsDirection` types | `TabsVariant` / `TabsSide`, shared with the Tabs family |
| `:buttons="items"` (deprecated)             | `:options="items"`                          |
| `{ label: 'Day' }` (label as value)         | `value` is required on every option         |
| `{ active: true }` fallback                 | the `v-model` is the single source of truth |
| boolean `value` / `modelValue`              | `string \| number` only                     |
| wrapper divs / raw CSS for equal-width tabs | `fluid` prop                                |
| `iconRight` on an option                    | `<template #suffix>` — silent, nothing throws |
| `hideLabel: true` on an option              | `icon` alone — the option is icon-only and `label` becomes its accessible name |
| `theme` / `variant` / `size` / `loading` on an option | removed — options no longer forward `Button` props. Use `Button` directly for per-tab theming or a spinner |
| `tooltip` on an option                      | still `tooltip`, but it renders as the native `title` attribute, not a floating `Tooltip` |

Every prop rename here is a **silent break**: an unknown prop lands in `$attrs`
and is spread onto the radiogroup root, so a `TabButtons` still on `:buttons`
renders an empty track with no build error, type error, or warning. As with
Tabs, there is no codemod — grep for `:buttons`, `type=`, `direction=` and
`hideLabel`.

## Data fetching (useDoctype / useList)

The write methods on `useDoctype` (`insert`, `delete`, `setValue`,
`runDocMethod`, `runMethod`) and on `useList` (`insert`, `setValue`, `delete`)
used to share one request between all their submits. Each one now sends its own
request, so the shared-request members are gone.

Nothing fails to build, so grep for these by hand. There are two failure modes,
and one of them is quiet. Calling a removed method throws (`delete.execute()`,
`insert.reset()`), and so does dotting into one (`delete.params.name`). A
removed *data* member reads as `undefined` instead: `runMethod.isFetching` is
always falsy, so a spinner silently never shows and nothing says why.

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
- A stale `setValue` or `delete` on the same row no longer writes the shared
  document and list stores, and no longer triggers `useList`'s auto-refetch.
  Every request carries a dispatch number, and a store rejects a write that a
  later-dispatched request already made. Submits with different keys, and
  keyless submits such as inserts, stay independent and all of their hooks
  still fire. Nothing to change — this is here so you can drop the workarounds.

### `useDoc` writes and `useNewDoc`

`useDoc`'s `setValue`, `delete` and every `methods:` entry, and all of
`useNewDoc`, held one shared request too. Each submit now sends its own. They
keep the full `useCall` surface — same members, same types — so there is
nothing to rename.

One silent behavior change: **a second submit no longer cancels the first.**
Both requests reach the server. If you relied on the abort to drop a superseded
save, debounce or guard the call site yourself. `data` and `error` follow the
same newest-wins rule as `useDoctype` above, and `loading` stays `true` until
every submit settles.

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

Nothing here fails loudly. `:node` and `:options` become fall-through
attributes, and content passed to the old `#node` / `#label` / `#icon` slots is
discarded — the default row renders in its place. Only the now-required `nodes`
prop warns, and only in dev; a production build renders an empty tree. Grep for
`:node=`, `:options=`, `#node`, `#label` and `#icon` on `Tree` specifically.

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
/ `iconLeft` / `iconRight`, `Dialog.icon`, `Alert.icon`, `SidebarCard.icon`,
`Dropdown`/`ContextMenu` item `icon`, `TabButtons` options `icon` /
`iconLeft`, `TabTrigger.icon` / `iconLeft`, the `Icon` component's `name`
prop) used to render a bare feather-style name (e.g. `"edit"`,
`"chevron-down"`) via `FeatherIcon`. That fallback is gone: only a `lucide-*`
string, an emoji or symbol glyph, or a `Component` renders. Any other string
renders nothing. No build or type error — the icon silently disappears. A
dev-mode console warning names the component, the prop, and the offending
value once per (component, prop). Prefix the name with `lucide-`:

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
<div class="flex flex-col rounded-6 border px-6 py-5">
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

`<ToastProvider>` (mount once near your app root) is unchanged. The current
API is plain `toast()` plus `toast.success()` / `toast.error()` /
`toast.warning()` / `toast.info()`. v0's `toast.create()`, `toast.remove()`
and `toast.removeAll()` still work, but warn once in dev — move them to
`toast(...)` and `toast.dismiss(...)`.

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
`bg-surface-base`, merges static text size + weight class pairs (for example
`text-base font-medium` to `text-base-medium`), and renames the removed
radius aliases (`rounded-md` → `rounded-5`, see below). Run it once per
codebase; the token migration is not idempotent because some v2 names overlap
with v0 names. The radius renames are idempotent and also run on
already-migrated codebases.

In every mode, the codemod stays inside the directories you give it. A
symlink whose real path leaves the target — a file or a directory — is
skipped and listed at the end of the run. Run the codemod on each real
package root, so a shared package linked into several apps is migrated once.

After upgrading to `frappe-ui@1.0.0-beta.11`, run the codemod again. Apps that
already ran it will only get the typography correction (`text-lg` → `text-md`,
`text-xl` → `text-lg`, ...) and the radius renames. Apps that still have
pre-v2 color tokens can pass `--force`, but review the output carefully
because color tokens may double-shift.

Already ran the typography correction too? Pass `--radius-only`. It performs
only the radius renames (safe to repeat) and reports removed tokens — it
never touches color or text-size names, so nothing can double-shift.

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
surface-alpha-red-1 … surface-alpha-red-7
outline-alpha-red-2 / -3 / -4
```

The codemod reports only some of these: the dead text sizes, the
`text-*-black` styles, and the two alpha-red families. It has no rule for
`shadow-status`, `--elevation-status`, the `alert-button` tokens, or
`surface-alpha-gray-2-overlay` — grep for those five by hand.

If your build used any of these, replace them with the nearest step on the
regular scale — e.g. `text-16xl` → `text-12xl`, `shadow-status` →
`shadow-sm`, `surface-alert-button-error` → `surface-red-2` (or whichever
`variant`+`theme` pairing the design calls for).

### Radius aliases removed

The named radius aliases are removed in `1.0.0`. Numbered tokens are the only
radius vocabulary now ([ADR-0006](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0006-numbered-radius-tokens.md)).
`rounded-none` and `rounded-full` are kept.

This is a **silent** break. The preset replaces Tailwind's `borderRadius`
scale, so an unmigrated `rounded-md` emits no CSS at all — no build error, no
type error, just square corners. Run the codemod, then grep for leftover
aliases.

| Before | After | px |
|---|---|---|
| `rounded` | `rounded-4` | 8 |
| `rounded-sm` | `rounded-1` | 4 |
| `rounded-md` | `rounded-5` | 10 |
| `rounded-lg` | `rounded-6` | 12 |
| `rounded-xl` | `rounded-7` | 16 |
| `rounded-2xl` | `rounded-8` | 20 |

The same map applies to every directional and corner form (`rounded-t-lg` →
`rounded-t-6`, `rounded-tl-sm` → `rounded-tl-1`), to the logical sides
(`rounded-ss-md` → `rounded-ss-5`, and the same for `s`, `e`, `se`, `es`,
`ee`), to the bare directional aliases (`rounded-t` → `rounded-t-4`), and to
variant prefixes (`hover:rounded-2xl` → `hover:rounded-8`). Pixel values are
identical — the migration changes vocabulary, not rendering.

The codemod handles all of these. One caveat: the bare word `rounded` is
plain English, so the codemod only rewrites it inside quoted strings and
`@apply` rules. A class list inside a multi-line template literal can be
missed — grep for bare `rounded` after running it.

The alias CSS variables go away with the aliases. Hand-written CSS that
reads `var(--radius-sm)` / `var(--radius-md)` / `var(--radius-lg)` /
`var(--radius-xl)` / `var(--radius-2xl)` resolves to nothing — the same
silent break. The codemod only rewrites `rounded-*` classes, so grep for
`--radius-(sm|md|lg|xl|2xl)` and switch to the numbered variables
(`var(--radius-5)` for the old `--radius-md`, same map as above).

### `text-*-black` styles removed

The `text-<size>-black` / `text-p-<size>-black` style classes are removed —
zero usage anywhere, and the Figma weights behind them were corrupt export
data. This is also a **silent** break: the class stops emitting CSS.

The codemod no longer merges `font-extrabold` (or `font-black`) onto a
`text-*-black` class. It flags the pair under "needs manual attention"
instead. If you need weight 800, keep `font-extrabold`; there is no
letter-spacing-corrected style class for it.

### Ink chromatic scales shift one level

The updated espresso v2 tokens shift every chromatic ink scale down one
level: the new `ink-red-1` is the old `ink-red-2`, and so on for all 11
chromatic families. The scales now end at `-9`. `ink-gray` keeps its own
9-step scale and does not shift. This is a **silent** break: every
`ink-<family>-N` site renders one shade off after the token update.

Run the codemod once with `--ink-shift`:

```sh
npx --package frappe-ui@beta tokens-v2 --ink-shift .
```

Run the codemod in the same change as the frappe-ui upgrade that ships the
shifted tokens. The upgrade without the codemod renders one shade off. The
codemod without the upgrade also renders one shade off. Land both together.

Add `--dry-run` first to review the renames before they apply:

```sh
npx --package frappe-ui@beta tokens-v2 --ink-shift --dry-run .
```

`--ink-shift` cannot be combined with `--force` or `--radius-only`; the run
exits with an error rather than hiding which renames applied. A dry run is not
a safety probe either: it only warns when it finds a run-once marker, while a
real run refuses outright.

This mode runs only the ink shift — no color renames, no typography, no
radius renames. Run it exactly once per codebase. There is no way to detect
a prior run from file content (`ink-red-5` is a valid name before and
after), so a second run double-shifts. To guard against that, `--ink-shift`
takes directory targets only, and a real run writes a `.tokens-v2-ink-shift`
marker file in each target directory. It refuses to run again while a marker
exists in the target, an ancestor, or anywhere in the target subtree. The
marker is written before the first file rewrite, so an interrupted run
refuses to retry instead of double-shifting; restore the tree with git,
delete the marker, and re-run. Commit the marker with the migration — on a
fresh clone without it the guard is gone, and a teammate's re-run
double-shifts. Delete it only to re-run the shift on purpose.

Each marker is created exclusively, so two runs on the same directory cannot
both start: the second stops before it rewrites anything. For nested targets
(a repo root and one of its subdirectories) the run searches again after it
claims its markers, and stops if another run claimed an overlapping tree.
Both runs can stop this way. Neither has rewritten a file at that point, so
re-run whichever tree is still unshifted.

The marker search follows the same symlink rule as the run: a marker in a
linked external package never blocks a target the run would not rewrite. Run
the codemod on each real package root directly, so every migrated tree gets
its own marker. If the refusal names a marker inside a vendored dependency
(for example `vendor/frappe-ui/.tokens-v2-ink-shift`), that dependency is
already shifted — leave its marker alone and target the directories that do
not contain it. Pointing at the app root will not help: the search walks the
whole subtree, so any ancestor of the vendored copy finds the same marker and
refuses again. Target `src/` and your other own trees instead.

The old `ink-<family>-1` step was white. The new `-1` is a light tint, so
these sites have no automatic destination. The codemod flags them under
"needs manual attention". The usual fix is `text-white` (or the literal CSS
color `white` in hand-written CSS).

## Editor

The v0 monolith `<TextEditor>` (imported from `frappe-ui`) is replaced by the
`frappe-ui/editor` family: a headless `<Editor>` you compose with **kits**
(bundled, configurable extension sets) and **building-block** menus. Everything
moves to the `frappe-ui/editor` subpath; `TextEditor` and its siblings
(`TextEditorBubbleMenu`, `TextEditorFixedMenu`, `TextEditorFloatingMenu`,
`TextEditorContent`, `createEditorButton`) are removed from top-level
`frappe-ui` in `1.0.0`, and so are the v0 extension helpers `ImageExtension`
and `createSuggestionExtension` with their types `SetImageOptions`,
`BaseSuggestionItem` and `CreateSuggestionExtensionOptions` — nothing
editor-related is exported from root. See the
[Editor](./molecules/editor) page for the full API and recipes.

Not migrated yet? All eleven v0 names are parked, unchanged, in
`frappe-ui/experimental` as an interim import path. It is unstable — no
deprecation window — and will be removed once consumers migrate:

```ts
import {
  TextEditor,
  TextEditorBubbleMenu,
  TextEditorFixedMenu,
  TextEditorFloatingMenu,
  TextEditorContent,
  createEditorButton,
  ImageExtension,
  createSuggestionExtension,
} from 'frappe-ui/experimental'
import type {
  SetImageOptions,
  BaseSuggestionItem,
  CreateSuggestionExtensionOptions,
} from 'frappe-ui/experimental'
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

## `frappe-ui/code-editor` (removed)

The subpath is gone. `CodeEditor`, `CodePreview` and `loadLanguage` move to
`frappe-ui/experimental` (P14 — no stability promise). The components are
unchanged; one import line changes per file. The build fails loudly until it
does:

```ts
// Before
import { CodeEditor, CodePreview, loadLanguage } from 'frappe-ui/code-editor'

// After
import { CodeEditor, CodePreview, loadLanguage } from 'frappe-ui/experimental'
```

The types move with them: `CodeLanguage`, `CodeEditorProps`, `CodeEditorEmits`
and `CodePreviewProps`.

## `hljs-theme.css` and `tailwind/tokens.js` (removed)

Two exports with no importers left are gone. Both breaks are loud — the
specifier stops resolving.

| Removed                        | Replacement                                                     |
| ------------------------------ | ---------------------------------------------------------------- |
| `frappe-ui/hljs-theme.css`     | none — `frappe-ui/editor` ships its own code-block highlighting  |
| `frappe-ui/tailwind/tokens.js` | `frappe-ui/tailwind`, the preset, imported directly              |

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
| `#prefix` / `#suffix`             | same (`#suffix` now replaces chevron)     |
| `#item-prefix` / `#item-suffix` slot props `{ active, selected, option }` | `{ item, query, selected }` — `option` is renamed and `active` is gone, so a carried-over `option.label` throws during render |

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
prop. `Combobox` and `MultiSelect` throw and name the group if they find the
old key, so this one is caught the first time the picker opens — but only then,
not at build time. `Dropdown` and `ContextMenu` share the rename and fail the
other way: the group is dropped in silence (see
[Dropdown and ContextMenu](#dropdown-and-contextmenu)).

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

`Combobox`'s `#trigger` receives
`{ open, disabled, query, selectedOption, displayValue, clear, setOpen }`.
`MultiSelect`'s receives `{ open, disabled, query, selectedOptions, clear,
setOpen }` — plural, and with no `displayValue`. Use `setOpen` for a trigger
that has to open the popover from somewhere other than its own click.

### The trigger shape changed — pass `trigger="button"` to keep v0's

`Autocomplete` rendered a button showing the selection, with the search box
inside the popover. `Combobox` defaults to `trigger="input"` — the trigger
_is_ the search field. Pass `trigger="button"` to keep the old shape.

## FormControl `type="autocomplete"` (removed)

**This one is silent.** `FormControl` is a dispatcher: with the `autocomplete`
case gone, the type falls through to `TextInput` and is still forwarded as an
html input type. The result is `<input type="autocomplete">`, which every
browser renders as a plain text box — a picker that turned into a text field.
No runtime error, and no build error in plain JS; TypeScript callers do get
one, because `'autocomplete'` is no longer in the `type` union. A dev-only
`console.error` names it.

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
| `import { initSocket }`         | your own `io(...)` connection                |
| `app.use(FrappeUI, { config })` | `setConfig(key, value)` per entry            |
| `app.use(FrappeUI, { call })`   | `import { call }` where you need it          |
| `this.$resources` (implicit)    | `app.use(FrappeUI, { resources: true })`     |

The first three are build failures — your bundler or type-check names them. The
last three fail at runtime instead: a dropped `config` is applied nowhere, and
reading `this.$call` or `this.$resources` throws with the fix in the message.

`frappeRequest` is not a drop-in for `request`. Check three things at each call
site you swap: the method defaults to `POST`, not `GET`; a URL that is not a
path is prefixed with `/api/method/`; and it resolves with the response body's
`message`, not the whole body. The shape you get back changes with no error.

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
`this.$resources`, `$getResource`, `$getDocumentResource`, `$getDoc`,
`$getListResource` and `$refetchResource` existed in any app that called
`app.use(FrappeUI)`. It now installs only when asked:

```js
app.use(FrappeUI, { resources: true })
```

Nothing changes for Composition API code — `createResource`,
`createListResource` and `createDocumentResource` never went through the plugin.
You need the option only if you declare a `resources: { … }` block in a
component's options.

You will not have to work this out from a blank screen. A component that
declares `resources` without the option throws on creation, naming itself and
the fix. Vue routes that throw through its own error handling, which rethrows
in dev and only logs in production, so the read is guarded too: reading
`this.$resources` throws at the access in every build, straight into your own
code. `resourcesPlugin` is still exported if you would rather install it
directly.

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

## Composables and directives renamed

Three groups of root exports changed names. All of them fail at the import, so
the build lists every call site — but one of them has a quiet second half, and
that is the one to read.

### `useTheme` → `useColorScheme`

`theme` means color tone everywhere else in the library (`theme="blue"` on a
Button), so the light/dark composable gives the word back.

| Before              | After                                            |
| ------------------- | ------------------------------------------------ |
| `useTheme()`        | `useColorScheme()`                               |
| `Theme` type        | `ColorScheme` type                               |
| `currentTheme`      | `colorScheme` — read-only                        |
| `setTheme(t)`       | `setColorScheme(t)`                              |
| `toggleTheme()`     | `toggleColorScheme()`                            |
| `getSystemTheme()`  | `resolvedColorScheme()`, imported from the root  |
| `initializeTheme()` | removed — `useColorScheme()` initializes itself  |

The read-only `colorScheme` is the quiet part. The ref was only a third of the
state; the `data-theme` attribute and the `theme` key in `localStorage` are the
other two. Assigning to the old writable ref moved the ref and left the
document and the stored value behind, so the app desynced with no error.

```js
// Before — moved the ref, desynced the page
const { currentTheme } = useTheme()
currentTheme.value = 'dark'

// After
const { setColorScheme } = useColorScheme()
setColorScheme('dark')
```

The `data-theme` attribute and the `theme` localStorage key keep their names,
so app CSS targeting `[data-theme='dark']` and saved user preferences still
work.

### Scroll container: nine members become two

`useScrollContainer` published nine members for the two things apps do: read
the shell's scroll element, and know whether it has been scrolled.

| Before                                                  | After                                     |
| -------------------------------------------------------- | ------------------------------------------ |
| `activeScrollContainer`                                 | `shellScrollContainer`                    |
| `getScrollContainer()`                                  | `shellScrollContainer.value`              |
| `useScrollContainer().isScrolled`                       | `useShellScrolled({ threshold })`         |
| `scrollTo(options)` / `scrollToTop()`                   | call them on `shellScrollContainer.value` |
| `registerScrollContainer` / `unregisterScrollContainer` | removed — internal to the two shells      |
| `UseScrollContainer` / `UseScrollContainerOptions`      | removed                                   |

`useShellScrolled()` returns the boolean ref directly, not an object:

```js
// Before
const { isScrolled } = useScrollContainer({ threshold: 12 })

// After
const isScrolled = useShellScrolled({ threshold: 12 })
```

The `shell` prefix is load-bearing: both resolve only while a `DesktopShell` or
a `MobileShell` is mounted. Without one, `useShellScrolled` stays `false` and
warns once in development.

### Directives: `vFocus` and `vOnOutsideClick`

`<script setup>` auto-registers a directive only when the imported binding is
spelled `vFoo`, so the old names had to be aliased at every call site.

| Before                    | After                   |
| ------------------------- | ------------------------ |
| `focusDirective`          | `vFocus`                |
| `onOutsideClickDirective` | `vOnOutsideClick`       |
| `visibilityDirective`     | removed, no replacement |

```vue
<!-- Before -->
<script setup>
import { onOutsideClickDirective as vOnOutsideClick } from 'frappe-ui'
</script>

<!-- After -->
<script setup>
import { vOnOutsideClick } from 'frappe-ui'
</script>
```

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

`error` is untouched by a cancelled submit. The throw reaches you only through
the rejected `submit()`, so `error` still holds the last *request's* error — an
app that renders failures from `error` alone renders nothing when a hook
cancels. This covers every place `beforeSubmit` is accepted: `useCall`,
`useNewDoc`, and each entry in `useDoc`'s `methods:`.

## pageMetaPlugin (removed)

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

`CommandPalette` and `CommandPaletteItem` leave the root export. The family is
rebuilt as seven composable parts in `frappe-ui/experimental`, where it stays
until gameplan, helpdesk and this site all run on it (P14 — no stability
promise).

The root import fails to resolve, so your build names every call site.

```ts
// Before
import { CommandPalette, CommandPaletteItem } from 'frappe-ui'

// After
import {
  CommandPalette,
  CommandPaletteInput,
  CommandPaletteList,
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteEmpty,
  CommandPaletteFooter,
} from 'frappe-ui/experimental'
```

### The `groups` prop becomes markup

`groups` is gone. Write the rows as parts, so a group renders whatever it needs
without a per-group `component` escape hatch.

```vue
<!-- Before -->
<CommandPalette
  v-model:open="open"
  v-model:query="q"
  :groups="groups"
  @select="onSelect"
/>

<!-- After -->
<CommandPalette v-model:open="open" v-model:query="q" @select="onSelect">
  <CommandPaletteInput placeholder="Search" />

  <CommandPaletteList>
    <CommandPaletteGroup
      v-for="group in groups"
      :key="group.title"
      :label="group.hideTitle ? undefined : group.title"
    >
      <CommandPaletteItem
        v-for="item in group.items"
        :key="item.name"
        :value="item"
        :disabled="item.disabled"
      >
        <template v-if="item.icon" #prefix>
          <span :class="[item.icon, 'mr-3 size-4']" />
        </template>
        {{ item.title }}
        <template v-if="item.description" #suffix>{{ item.description }}</template>
      </CommandPaletteItem>
    </CommandPaletteGroup>
  </CommandPaletteList>

  <CommandPaletteEmpty />
</CommandPalette>
```

`CommandPaletteList` is the list itself and the only part that scrolls. It may
own rows and groups and nothing else, so the field, the empty state and the
footer stay outside it.

| Before                | After                                        |
| --------------------- | -------------------------------------------- |
| `:groups="groups"`    | `CommandPaletteList` + `CommandPaletteGroup` + `CommandPaletteItem` |
| `group.title`         | `:label` on `CommandPaletteGroup`            |
| `group.hideTitle`     | leave `label` out                            |
| `group.component`     | write the row in the item's slots            |
| `item.icon`           | `#prefix` on `CommandPaletteItem`            |
| `item.description`    | `#suffix` on `CommandPaletteItem`            |
| `item.disabled`       | `:disabled` on `CommandPaletteItem`          |
| `@select="fn"`        | `@select="(value, event) => fn(value)"`      |

`select` now carries two arguments: the item's `value`, and the click that
picked it. Call `event.preventDefault()` to keep the palette open.

### Filtering is included

The old palette filtered nothing; it rendered `groups` as given. The new one
filters against the query by default, so a call site that never filtered starts
narrowing its list. That is usually the fix, not a break.

Set `:filterable="false"` when a server search already decided what matches,
then refetch on `update:query` yourself. It is the same word `Combobox` and
`MultiSelect` use.

An item filters on the text of its default slot. `#prefix` and `#suffix` are
left out, so a trailing shortcut hint never becomes searchable.

### `Mod+K` moves to the caller

The palette registered `Mod+K` itself and carried
`enabled: () => !document.activeElement?.closest('.ProseMirror')`, hardcoding
knowledge of the rich-text editor. Both are gone. Register the shortcut where
the app knows the answer:

```js
useKeyboardShortcut({
  combo: 'Mod+K',
  description: 'Open command palette',
  allowInInput: true,
  handler: () => (open.value = true),
})
```

Keep `allowInInput: true`. The old palette set it, and `useKeyboardShortcut`
defaults it to `false`, so leaving it out gives you a `Mod+K` that stops
working the moment a field has focus.

### If you are on `1.0.0-beta` or older

Two earlier renames land in the same move. `show` became `open` and
`searchQuery` became `query`, both **silent breaks**: Vue accepts the unknown
prop, so the palette never opens and your query binding never updates. Suite's
`SheetEditor` still binds `v-model:show` and `v-model:searchQuery`, so its
palette does not open today.

| Before                           | After                      |
| -------------------------------- | -------------------------- |
| `v-model:show="show"`            | `v-model:open="open"`      |
| `v-model:search-query="q"`       | `v-model:query="q"`        |
| `@update:searchQuery="onSearch"` | `@update:query="onSearch"` |

## `useShortcut` is now `useKeyboardShortcut`

The import fails to resolve, so your build names every call site. The **config
inside it is a silent break**: 14 fields become 10, and the ones that left are
dropped without a word.

| Before | After |
| --- | --- |
| `useShortcut(...)` | `useKeyboardShortcut(...)` |
| `key: 's', ctrl: true` | `combo: 'Mod+S'` |
| `key: 'z', ctrl: true, shift: true` | `combo: 'Mod+Shift+Z'` |
| `key: 'ArrowUp'` | `combo: 'ArrowUp'` |
| `key: '/'` | `combo: 'Slash'` |
| `key: '?'` | `combo: 'Shift+Slash'` |
| `key: ' '` | `combo: 'Space'` |
| `condition: () => canEdit.value` | `enabled: () => canEdit.value` |
| `triggeredOn: 'hold'` | delete it; `onHold` selects hold mode |
| `const { activeShortcuts } = useShortcut(...)` | returns `void` |
| `ShortcutConfig` | `KeyboardShortcutConfig` |
| `RegisteredShortcut`, `ActiveShortcut` | gone; see below |

```js
// Before
useShortcut([
  { key: 's', ctrl: true, description: 'Save', group: 'View', handler: onSave },
  { key: 'z', ctrl: true, description: 'Undo', condition: notReadOnly, handler: undo },
  { key: 'y', ctrl: true, description: 'Redo', condition: notReadOnly, handler: redo },
])

// After
useKeyboardShortcut([
  { combo: 'Mod+S', description: 'Save', group: 'View', handler: onSave },
  { combo: 'Mod+Z', description: 'Undo', enabled: notReadOnly, handler: undo },
  { combo: 'Mod+Y', description: 'Redo', enabled: notReadOnly, handler: redo },
])
```

`ctrl` never meant Control. It matched `ctrlKey || metaKey`, so
`{ key: 's', ctrl: true }` fired on ⌘S, on ⌃S and on Win+S alike. `Mod+S`
compares every modifier exactly: ⌘S on macOS, Ctrl+S elsewhere. Those two extra
trigger paths stop. Register `Ctrl+S` as well if you need Control+S on a Mac.
The grammar has no token for the Windows key, so Win+S cannot come back. Write
`Ctrl` only where you mean Control on a Mac too.

A combo spells its modifiers in one order, `Mod+Ctrl+Alt+Shift+<Key>`, and a
letter uppercase. The type accepts no other spelling.

### Punctuation and digits take a key name

`+` separates the parts of a combo, so it cannot also be a key. Name the key
instead:

| Before | After |
| --- | --- |
| `key: '+'` | `combo: 'Shift+Equal'` (or `'Plus'` for the keypad key) |
| `key: '='` | `combo: 'Equal'` |
| `key: '-'` | `combo: 'Minus'` |
| `key: '/'` | `combo: 'Slash'` |
| `key: '\\'` | `combo: 'Backslash'` |
| the backtick key | `combo: 'Backtick'` |
| `key: '1'` | `combo: 'Digit1'` |
| `key: '!'` | `combo: 'Shift+Digit1'` |

Digits and punctuation now match `event.code`, so `Mod+Shift+Digit1` fires on
⌘⇧1 and on ⌘⇧! alike. A punctuation name means the physical key position, as
labelled on a US layout, so `Mod+Slash` fires on the same key everywhere.
`Plus` is the keypad `+` alone, the key whose `event.code` is `NumpadAdd`.
Letters and named keys still match `event.key`. The old US-layout heuristic
that let `?` match without declaring Shift is gone: declare the Shift.

TypeScript rejects an unknown combo. A JavaScript call site still passing the
v0 shape logs one dev warning and never fires.

### Hold shortcuts

```ts
// Before
{ key: 'l', ctrl: true, shift: true, triggeredOn: 'hold',
  description: 'Highlight blocks', onHold: on, onRelease: off }

// After
{ combo: 'Mod+Shift+L', description: 'Highlight blocks', onHold: on, onRelease: off }
```

A hold registration takes no `handler`. `triggeredOn: 'hold'` used to fire
`handler` **and** `onHold`; if you relied on that, move the work into `onHold`.

A v0 shortcut that paired a plain `handler` with your own `keyup` listener
folds into `onHold` / `onRelease` too. Delete the listener.

### `enabled` also hides the shortcut

While `enabled` is `false` the shortcut is inert **and** absent from
`KeyboardShortcutsDialog`. `condition` behaved this way already, undocumented.
It is now specified and tested, so read-only modes keep working.

### Precedence changed

Two shortcuts on one combo used to run whichever the registry reached first.
The last registration that is enabled **at the time of the keypress** now wins.
`enabled` is resolved first, so a pair with mutually exclusive guards still
works unchanged. A real collision warns once per combo in development.

### `formatShortcutLabel` and `getActiveShortcuts` are gone

Both imports fail at the build. Neither had a consumer. To render a combo, use
`<KeyboardShortcut :combo="combo" />`. To read the registry, use
`KeyboardShortcutsDialog`'s default slot.

The types they used, `RegisteredShortcut` and `ActiveShortcut`, are gone with
them. The dialog's slot gives `KeyboardShortcutGroup` and
`KeyboardShortcutEntry` instead. An entry carries `combo`, `altCombos`,
`description` and `group`.

## `KeyboardShortcutsModal` is now `KeyboardShortcutsDialog`

The import fails to resolve, and Vue logs an unknown-component warning for a
globally registered `<KeyboardShortcutsModal>`. Props are unchanged.

| Before | After |
| --- | --- |
| `import { KeyboardShortcutsModal } from 'frappe-ui'` | `import { KeyboardShortcutsDialog } from 'frappe-ui'` |
| `<KeyboardShortcutsModal v-model:open="open" />` | `<KeyboardShortcutsDialog v-model:open="open" />` |
| `KeyboardShortcutsModalProps` | `KeyboardShortcutsDialogProps` |

Two dialog behaviors are worth knowing before you diff its output:

- Shortcuts that share a group and a description merge into **one row**, with
  the other combos after a `/`. `Mod+Shift+Z` and `Mod+Y`, both "Redo", are one
  row. v0 merged only when the modifiers matched too, so rows that used to be
  separate now join.
- A disabled shortcut has no row at all.

## The shortcuts codemod

`shortcuts-v1` applies both changes above for you. Run it from the app you are
migrating:

```sh
npx --package frappe-ui@beta shortcuts-v1 --dry-run .
```

Review the output, then run it without `--dry-run`:

```sh
npx --package frappe-ui@beta shortcuts-v1 .
```

It renames `useShortcut`, `KeyboardShortcutsModal` and `ShortcutConfig`, folds
`key` and the modifier flags into one `combo`, and renames `condition` to
`enabled`. `description`, `group`, `handler`, `onHold`, `onRelease`,
`preventDefault`, `allowInInput` and `allowInDialog` keep their names and their
defaults. The codemod passes them through.

The codemod exits non-zero when it refused a site, on a dry run too. A clean
exit means a clean run. Re-running it is safe: a converted object has no `key`
field left to convert, and a refusal repeats until you fix it.

A file with a refused site stays exactly as it was, even when its other
shortcuts converted. Half a migration puts a renamed call beside a config with
no `combo`, and v1 throws on the first keypress. Fix the sites the run names,
then run again and take the whole file at once.

The same rule decides an object the codemod cannot prove is a config. In a file
it would otherwise write, that object is a refusal and the file stays as it
was. In a file with nothing else to change, it is advice, and the run exits
zero. A file the run names is never written, whichever the line was.

The codemod does not reflow the code it edits. Run your formatter after it.

### What it rewrites

The codemod rewrites an object in two places only:

- Inside a `useShortcut(...)` or `useKeyboardShortcut(...)` call, where the
  name is imported from `frappe-ui` in the same file.
- Inside an array or object literal typed `ShortcutConfig` or
  `KeyboardShortcutConfig`, where that type is imported from `frappe-ui`. An
  annotation, a `satisfies` clause and an `as` cast all count.

Both places name frappe-ui. Nothing else does.

```ts
import { useShortcut, type ShortcutConfig } from 'frappe-ui'

// Rewritten: the call is frappe-ui's.
useShortcut({ key: 's', ctrl: true, description: 'Save', handler: save })

// Rewritten: the annotation is frappe-ui's.
const bindings: ShortcutConfig[] = [
  { key: 'k', ctrl: true, description: 'Palette', handler: open },
]

// Rewritten: a clause after the literal names the same type.
const save = { key: 's', ctrl: true, description: 'Save', handler: onSave } satisfies ShortcutConfig

// Left alone: nothing here says frappe-ui.
const menu = [{ key: 'delete', label: 'Delete', condition: canDelete, handler: remove }]
```

Field names alone are never evidence. `key`, `description`, `condition`,
`group` and `handler` are frappe-ui's own option vocabulary too: a
`ComboboxCustomOption` is `{ type, key, label, description, condition,
onClick }` and a `ComboboxGroupedOption` is `{ key, group, hideLabel,
options }`. An app that hands a config array to its own composable, or builds
one with `.map()`, writes the same names for something else.

The cost is a registration written away from its call and with no annotation.
The codemod does not rewrite it. It names it instead, with the `combo` to
write.

```ts
import { useShortcut } from 'frappe-ui'

// Refused: the call renames, so writing this file would leave the array on v0.
const bindings = [{ key: 's', ctrl: true, description: 'Save', handler: save }]
useShortcut(bindings)
```

Clear that line in one of three ways: write the `combo` by hand, annotate the
array with frappe-ui's config type so the next run can prove it, or migrate the
whole file by hand and leave the run nothing to write.

Both type names count as proof. Write `ShortcutConfig[]` while the app is still
on v0, which is where the codemod runs, and `KeyboardShortcutConfig[]` once you
have bumped. A lone object takes the same name without the `[]`. Each refused
line names the type for its own shape.

### Punctuation keys are never converted

This is the reason to run a codemod instead of a grep. `+` is both the combo
separator and a key, so `{ key: '+', ctrl: true }` written by hand becomes
`'Mod++'`, which splits into `['Mod', '', '']` and never fires. Nothing fails:
the build passes, the types pass, and you get one dev-console warning that a
production build drops.

So the codemod stops on the site and prints the whole `combo` to write, with
the modifier flags to delete beside the `key`:

```
✗ Not converted — 3 sites need a decision:
  src/sheets/useShortcuts.js:L95  key '=' is punctuation ... Write `combo: 'Mod+Equal'` by hand. Delete `ctrl` with the `key`.
  src/sheets/useShortcuts.js:L96  key '+' is a shifted character ... Write `combo: 'Mod+Shift+Equal'` by hand. Delete `ctrl` with the `key`.
  src/Commands/index.ts:L196      key '?' is a shifted character ... Write `combo: 'Mod+Shift+Slash'` by hand. Delete `ctrl` with the `key`.
```

The combo carries the modifiers. A `ctrl: true` left beside a hand-written
`combo` reaches v1 as an excess property, and no later run mentions it: with
no `key` there is nothing left to refuse.

The name each key takes is in
[Punctuation and digits take a key name](#punctuation-and-digits-take-a-key-name).
`Plus` is the trap: it is the keypad key alone, so `{ key: '+', ctrl: true }`
becomes `'Mod+Shift+Equal'`. The codemod writes that whole combo on the line,
because `Mod+Plus` would bind a key the user never presses and report a clean
run.

Write the `combo` the line gives you.

### Combo reference

Every key name a `combo` can hold is listed under
[`combo` takes the key names the composable fires on](#combo-takes-the-key-names-the-composable-fires-on).
A refused line points here when it cannot build the name for you.

Take the name into `combo`, never back into `key`. `key` is the v0 field, and
v0 compared it to `KeyboardEvent.key`, which reports none of those spellings. A
v1 name left in `key` is still a v0 config, and the next run refuses it again.

### Digits convert, and get listed

`{ key: '1', ctrl: true, shift: true }` becomes `{ combo: 'Mod+Shift+Digit1' }`.
A shifted digit (`!`, `@`, ...) now resolves to the same combo. That is a
behaviour change, so the codemod lists every digit it touched under "Digit keys
converted". Read each one.

### What it reports but never rewrites

Each of these exits the run non-zero. Fix them by hand.

- **Punctuation and shifted characters.** See above.
- **An uppercase key with no `shift: true`.** v0 matched the letter either way
  and ignored Shift, so `{ key: 'S' }` fired on `s` and on Shift+S. v1 is
  exact. Write `S`, or `Shift+S`, or register both.
- **A `key` that is not a plain string**, and a modifier flag that is not a
  literal `true` / `false`. v1 has no conditional modifier. A shorthand
  property counts: `{ key, ctrl }` holds its values somewhere else, so the
  combo cannot be built from the object.
- **A spread, or a computed name the run cannot read, on a config it proved.**
  `{ ...base, handler: save }` and `{ [Keys.SAVE]: 's' }` can carry a `key` or
  a modifier that never reaches the run. Write the properties out, or convert
  the object by hand.
- **`formatShortcutLabel` and `getActiveShortcuts`.** Both are deleted, and
  their `ActiveShortcut` and `RegisteredShortcut` types go with them. See
  [`formatShortcutLabel` and `getActiveShortcuts` are gone](#formatshortcutlabel-and-getactiveshortcuts-are-gone)
  for what replaces each one. The codemod names all four wherever they appear,
  comments included.
- **A destructured `useShortcut(...)` return.** v1 returns void; cleanup
  already runs on unmount.
- **`triggeredOn: 'hold'` next to a `handler`.** v0 fired both and v1 will not,
  so the run cannot pick a side. To keep the hold, delete the `handler`. To
  keep the press, delete `triggeredOn: 'hold'` and the hold callbacks with it.
  See [Hold shortcuts](#hold-shortcuts).
- **`onHold` or `onRelease` without `triggeredOn: 'hold'`.** v0 gated both on
  `'hold'`, so the callback never fired. In v1 the callback itself selects hold
  mode, so it starts firing. Delete it, or add `triggeredOn: 'hold'` to keep it
  on purpose — the next run converts that pair.
- **A `vi.mock('frappe-ui', ...)` keyed on `useShortcut`.** The file is left
  alone: the captured configs carry `key` / `ctrl` and the assertions read
  them. Rename the mock key, write the combos and move the assertions by hand.
- **An object that reads like a config, where the run cannot prove it, in a
  file it would otherwise write.** A `key` string beside a `handler` or a
  `condition` is enough to name it, with or without a modifier. See "What it
  rewrites".

### What it lists without failing the run

None of these fails the run. Read them and decide if the code wants a rewrite.

- **Every digit it converted.** See above.
- **A v0 key spelling that never matched**, such as `'esc'`, `'up'`,
  `'spacebar'` or `'space'`. v0 compared `event.key`, which never reports
  those, so the shortcut never fired. The combo does fire, so the shortcut is
  live now. `'space'` is on the list because `event.key` gives `' '` for the
  space bar; `Space` is that key's `event.code`.
- **An object that reads like a config, in a place the run cannot prove, in a
  file with nothing else to change.** The line gives the `combo` to write. Take
  it if the object is a registration: v1 throws on a config with no `combo`. An
  object that carries an option-only name, such as `label`, `options`,
  `onClick` or `type`, is never listed, and neither is one your own composable
  receives.
- **Your own `useShortcut` or `ShortcutConfig`**, imported from your module or
  declared in the file. That name is left as it is, and the rest of the file
  still migrates.
- **A possible hand-rolled hold**: a shortcut registration and a manual
  `keyup` listener in the same file. The pair may fold into one registration,
  as [Hold shortcuts](#hold-shortcuts) describes. Only you can say which half
  is which. This is a guess: an unrelated `keyup` listener matches too, and no
  edit would clear it, so it never fails the run.

### It never renames your own composable

`useShortcut` is renamed only where the file imports it from the `frappe-ui`
barrel. A fork imported from your own module, or declared in the same file,
keeps its name, and the run says so and moves on. helpdesk ships a
`useShortcut` of its own in `composables/shortcuts.ts`; every page that uses
that one is left as it is. crm, lms and suite each ship a local
`useKeyboardShortcuts`, one character from the new name; those are untouched
too.

A fork silences its own calls, not the whole file. A `useKeyboardShortcut(...)`
imported from `frappe-ui` a few lines below your own `useShortcut` still
converts, and the objects your composable receives are still left alone.

A rename also stays inside code. A name in a string, a module specifier or a
comment keeps its spelling. In a `.vue` template only three places rename: the
tag, a bound attribute value such as `:is="..."`, and a mustache. A bound value
and a mustache hold an expression, so a reference in one migrates and a quoted
string in one does not. `class="useShortcut"`, `{{ 'useShortcut' }}` and
template prose all stay as they are.

## KeyboardShortcut

The deprecated `shortcut` prop, and the unused `meta` / `ctrl` / `shift` /
`alt` boolean props, are removed. Use `combo` — a string like `"Mod+Shift+K"`.

| Before                                   | After                        |
| ------------------------------------------ | ----------------------------- |
| `<KeyboardShortcut shortcut="Mod+K" />`    | `<KeyboardShortcut combo="Mod+K" />` |
| `<KeyboardShortcut ctrl shift>K</KeyboardShortcut>` | `<KeyboardShortcut combo="Mod+Shift+K" />` |

Both are **silent breaks** at runtime: the removed props fall through onto the
rendered `<span>` as plain HTML attributes, so `shortcut="Mod+K"` renders an
empty chip and `ctrl shift` renders the key with no modifier glyphs. Only a
type-check names the call sites.

### `combo` takes the key names the composable fires on

The display used to accept a second, looser vocabulary. It is gone: a chip for
a combo that can never fire is the failure this family exists to remove. An
unknown token renders as written, so `<KeyboardShortcut combo="Cmd+K" />` draws
the word "Cmd" next to the K.

This is a **silent break**. `combo` stays typed `string`, because callers
compute it, so no type-check names the call sites. The chip warns once per
token in development and says nothing in production.

| Before | After |
| --- | --- |
| `Cmd`, `Command`, `⌘`, `Meta` | `Mod` |
| `Control` | `Ctrl` |
| `Option`, `Opt`, `⌥` | `Alt` |
| `⇧` | `Shift` |
| `Win`, `Windows` | nothing; the grammar has no Windows key |
| `Esc` | `Escape` |
| `Return` | `Enter` |
| `Del` | `Delete` |
| `Up`, `Down`, `Left`, `Right` | `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` |
| `=` | `Equal` |
| `F13` and above | nothing; the grammar stops at `F12` |

```vue
<!-- Before -->
<KeyboardShortcut combo="Cmd+K" />
<KeyboardShortcut combo="Ctrl+Esc" />
<KeyboardShortcut combo="Option+Up" />

<!-- After -->
<KeyboardShortcut combo="Mod+K" />
<KeyboardShortcut combo="Ctrl+Escape" />
<KeyboardShortcut combo="Alt+ArrowUp" />
```

Grep every `combo` on the component, including bound values. The whole
vocabulary is `Mod`, `Ctrl`, `Alt` and `Shift`, a letter, `F1` to `F12`, and
these key names: `Escape`, `Enter`, `Space`, `Tab`, `Insert`, `Backspace`,
`Delete`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`,
`PageUp`, `PageDown`, `Digit0` to `Digit9`, `Plus`, `Minus`, `Equal`, `Slash`,
`Backslash`, `Backtick`, `Comma`, `Period`, `Semicolon`, `Quote`,
`BracketLeft`, `BracketRight`. `useKeyboardShortcut` reads the same grammar,
so a combo you register is a combo you can draw.

### `useIcons` now reaches `bg` mode

`bg` chips ignored the prop and always drew an icon for the arrow, Enter,
Backspace and Delete keys. `:use-icons="false"` now drops those icons in both
modes and draws the glyph instead. The default is `true`, so a chip that never
set the prop is unchanged.

### The root's `role` is `img`

`role="note"` on the root becomes `role="img"` when `combo` is set, and no role
at all without one. A labelled `img` replaces its subtree, so a screen reader
reads "Shortcut Control + Backspace" once instead of meeting every chip. Update
any test or stylesheet that selects `[role='note']`.

### `matchesShortcut` is no longer exported

`import { matchesShortcut } from 'frappe-ui'` fails at the build. Its own doc
comment said it was exported for unit tests only. Register a shortcut with
`useKeyboardShortcut` instead of matching a `KeyboardEvent` by hand.

## PageHeaderMobile family: slot names

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

### `FrappeUIProviderProps` is deleted

The type was exported but never wired to the component, so it described props
`FrappeUIProvider` did not accept. It is removed in `1.0.0` with no
replacement. This one is **loud** — `import type { FrappeUIProviderProps } from
'frappe-ui'` fails the type-check. `FrappeUIProvider` itself is unchanged and
still exported.

## Charts

Only for apps already on `frappe-ui/charts` from `1.0.0-beta.42` or later — the
subpath did not exist before that. The family is new in v1, so an app coming
from v0 has nothing to migrate here; the older `config`-object family is covered
by the "Charts (v1)" section above.

Eight charts renamed their mark emit to `select`, collapsing six old names into
one. This is a **silent break**: Vue
attaches a listener for an emit the component no longer declares as a plain
attribute, so the handler stops firing with no error and no warning. The
payload is unchanged, so only the name moves.

| Before                            | After                     |
| --------------------------------- | ------------------------- |
| `AreaChart` `@datapoint-click`    | `@select`                 |
| `BarChart` `@datapoint-click`     | `@select`                 |
| `LineChart` `@datapoint-click`    | `@select`                 |
| `DonutChart` `@slice-click`       | `@select`                 |
| `FunnelChart` `@stage-click`      | `@select`                 |
| `HeatmapChart` `@cell-click`      | `@select`                 |
| `SankeyChart` `@link-click`       | `@select`                 |
| `ScatterChart` `@point-click`     | `@select`                 |

```vue
<!-- Before -->
<BarChart :data="rows" x="warehouse" :y="['picked']" @datapoint-click="open" />
<DonutChart :data="rows" category="channel" value="sessions" @slice-click="open" />
<SankeyChart :data="rows" source="from" target="to" value="amount" @link-click="open" />

<!-- After -->
<BarChart :data="rows" x="warehouse" :y="['picked']" @select="open" />
<DonutChart :data="rows" category="channel" value="sessions" @select="open" />
<SankeyChart :data="rows" source="from" target="to" value="amount" @select="open" />
```

`select` also fires on Enter and Space over the plot's keyboard cursor, which
is why the old names had to go — they described the mouse, not the behavior.

Grep for `datapoint-click`, `slice-click`, `stage-click`, `cell-click`,
`link-click` and `point-click`, and for the camelCase spellings in render
functions and `h()` props.

The rest of the family's breaks are loud — the build or the type-check reports
them. `ChartTheme` is `ChartTokens`, `useChartTheme` is `useChartTokens` and it
returns `{ tokens }` instead of `{ theme }`, and the `ColorScheme` type this
subpath exported is now `ResolvedColorScheme`. `formatValue`, `formatDate`,
`formatLabel`, `formatPercent`, `formatAxisValue`, `currentColorScheme` and
`resolveChartTheme` are no longer exported.

## Toast: the legacy object form is removed {#toast-legacy-object}

`toast({ title, text })` no longer works, and **nothing tells you**. The object
is handed to sonner as the message. Sonner expects a string, a component or a
VNode, so the toast renders empty or wrong instead of throwing.

```js
// Before
toast({ title: 'Saved', text: 'Your changes are live.', type: 'success' })

// After
toast.success('Saved', { description: 'Your changes are live.' })
```

`position` was already ignored per toast. Set it once on `<ToastProvider>`.

```js
// Before
toast({ title: 'Copied', position: 'bottom-right' })

// After — position is global
toast('Copied')
```

A grep for `toast(` will not find these reliably. Grep for the keys instead:
`title:`, `text:` and `message:` inside a `toast(` call.

The three named shims go at the same time, and those fail loudly:

```js
toast.create({ message: 'Loading…' })  // → toast.message('Loading…')
toast.remove(id)                        // → toast.dismiss(id)
toast.removeAll()                       // → toast.dismiss()
```

`toast.create({ closable: false })` mapped to three sonner flags. Write them out:

```js
// Before
toast.create({ message: 'Uploading…', closable: false })

// After
toast.message('Uploading…', {
  duration: Infinity,
  closeButton: false,
  dismissible: false,
})
```

`toast.create` also took `duration` in **seconds**, where sonner takes
milliseconds, and treated `duration: 0` as "never dismiss". Multiply by 1000,
and write `Infinity` where you meant persistent.

## Toast: `description` now renders limited inline HTML {#toast-description-html}

`description` is sanitized and rendered like the message, with the same
safelist (`a`, `em`, `strong`, `i`, `b`, `u`). It used to render as plain text.

**This is silent.** A description holding a `<` that is not one of those six
tags loses those characters, with no warning:

```js
// Before — rendered literally: Set <Button> variant
toast('Heads up', { description: 'Set <Button> variant' })

// After — DOMPurify strips <Button>: Set  variant
// Escape it, or drop the angle brackets:
toast('Heads up', { description: 'Set &lt;Button&gt; variant' })
```

Descriptions that are components, VNodes or render functions are untouched.

## TabButtons: `class` on an option → `data-value` {#tabbuttons-class}

`class` on a `TabButton` option object no longer applies. In JavaScript nothing
warns and nothing fails: the tab simply loses its styling. Style the tab from
CSS through the new `data-value` hook instead.

```vue
<!-- Before -->
<script setup>
const tabs = [
  { label: 'Open', value: 'open', class: 'text-red-600 font-bold' },
  { label: 'Closed', value: 'closed' },
]
</script>

<template>
  <TabButtons :buttons="tabs" v-model="tab" />
</template>
```

```vue
<!-- After -->
<script setup>
const tabs = [
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
]
</script>

<template>
  <TabButtons class="my-tabs" :options="tabs" v-model="tab" />
</template>

<style scoped>
.my-tabs :deep([data-slot='tab-button'][data-value='open']) {
  color: var(--ink-red-3);
  font-weight: 600;
}
</style>
```

Two related names go with it:

- `NativeButtonClass` is no longer exported. The import fails.
- `customClass` is gone from the `#prefix` and `#suffix` slot props. Destructuring
  it fails; spreading it silently yields nothing.

The composed `Tabs` family needs no change. You write the `<TabTrigger>`
yourself there, so a class goes on the element directly.

## ThemeSwitcher — moved to `frappe-ui/experimental` {#themeswitcher}

`ThemeSwitcher` is not core v1 surface. It moves out of the root export to
`frappe-ui/experimental` (P14 — no stability promise) and parks there, still
deprecated, while apps migrate. The import fails at the root; switch the
subpath:

```ts
// Before
import { ThemeSwitcher } from 'frappe-ui'

// After
import { ThemeSwitcher } from 'frappe-ui/experimental'
```

`ThemeSwitcherProps` moves the same way. Nothing about the component changed,
only where it is imported from.

### If you want off the deprecated component

The replacement is behavioral, not visual. `ThemeSwitcher` renders a group of
theme preview cards. `Select` bound to `useColorScheme` gives you the same
control in a dropdown, so an app that wants the cards keeps its own markup:

```vue
<!-- Before -->
<script setup>
import { ThemeSwitcher } from 'frappe-ui'
</script>

<template>
  <ThemeSwitcher />
</template>
```

```vue
<!-- After -->
<script setup>
import { Select, useColorScheme } from 'frappe-ui'

const { colorScheme, setColorScheme } = useColorScheme()
const options = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
]
</script>

<template>
  <Select
    :model-value="colorScheme"
    :options="options"
    @update:model-value="setColorScheme"
  />
</template>
```

Moving the import is the smaller change and keeps the current UI. Take this
rewrite only when you want off the deprecated component.

## FAQ

**Will my CSS break?** In two ways. Where component structure changed,
components expose `data-*` hooks (`data-slot`, `data-state`, `data-size`,
`data-variant`) — audit selectors that targeted tags or classes. Separately,
the token vocabulary moved: removed radius aliases and the shifted ink scales
emit no CSS at all, with no build or type error. Run the
[token codemod](#tokens) before you audit anything by hand.

**Do I have to run the codemods?** Run `tokens-v2` if you use Tailwind
utilities from the frappe-ui preset. Run `shortcuts-v1` if you register
keyboard shortcuts — it also catches the punctuation keys that a hand
migration breaks in silence. These two are the mechanical steps in this
guide; every component, prop and slot rename is a hand edit.

**Report bugs:** [file an issue](https://github.com/frappe/frappe-ui/issues/new)
with the `v1-beta` label. Include the component name, before/after code,
version, and a repro.
