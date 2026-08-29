# Component catalog

Import from `'frappe-ui'`. Four families ship on their own subpaths: `frappe-ui/list`, `frappe-ui/editor`, `frappe-ui/charts`, `frappe-ui/experimental`.

Color is two props: `variant` (visual weight) and `theme` (hue). The value set differs per component — each entry states its own.

## Icons

Render any lucide icon as a `<span>` carrying the icon class.

```vue
<span class="lucide-edit size-4" aria-hidden="true" />
<span class="lucide-plus size-5 text-ink-gray-7" aria-hidden="true" />
```

- Class name is `lucide-<kebab-case-name>` (`lucide-arrow-right`, `lucide-circle-check`). Size with `size-*`; the size-by-role ladder is in DESIGN.md → Hierarchy.
- Decorative icons take `aria-hidden="true"`. When the icon is the *only* content (icon-only button), give the parent an `aria-label`.
- Props named `icon` take the namespaced **string** `"lucide-edit"` (or a Vue component): `Button`, `Dropdown` options, `Dialog`, `Alert`, `Switch`, `Tabs` items. `Badge` has no `icon` prop — put the span in its `#prefix` / `#suffix` slot.
- `<Icon :name />` renders a `lucide-*` string, an emoji, or a component. A bare name like `"home"` renders nothing.

## Actions

### `Button`
Default for any trigger. `<Button :label icon iconLeft iconRight variant theme size loading disabled />`.
- `variant`: `solid | subtle | outline | ghost` (default `subtle`). `theme`: `gray | blue | green | red` (default `gray`). `size`: `xs | sm | md | lg` (default `sm`).
- Also `tooltip`, `loadingText`, `type` (`button | submit | reset`, default `button`).
- Navigation: `route` (Vue Router target) or `link` (external URL) — it renders the right element with the right semantics.
- Icon-only: pass just `icon`. Leading icon: `iconLeft` + `label`.
- Primary action: `variant="solid" theme="gray"`. Destructive: `variant="solid" theme="red"` or `subtle theme="red"`.

### `Dropdown` / `ContextMenu`
Menu of actions anchored to a trigger. The default slot (or `#trigger`) is the trigger; `Dropdown` also builds one from a `button?: ButtonProps` object.

`Dropdown` props: `options`, `button`, `v-model:open`, `side: 'top' | 'right' | 'bottom' | 'left'` (default `bottom`), `align: 'start' | 'center' | 'end'` (default `start`), `offset: number` (default `4`), `matchTriggerWidth`, `portalTo`. Placement is `side` + `align`. `ContextMenu` takes `options` and `v-model:open` only; its default slot is the right-clickable region.

Option shapes — `options` is one flat array, mix these freely:
- action: `{ label, icon?, description?, onClick?, route?, disabled?, selected?, theme? }`
- group: `{ group: 'Label', options: [...], hideLabel? }` — the key inside a group is **`options`**. `{ group, items }` is a type error and renders nothing.
- submenu: `{ label, submenu: [...] }` · switch: `{ label, switch: true, switchValue?, onClick(value: boolean) }`

`theme` on a menu option is `gray | red` only. Item slots: `#item-prefix`, `#item-label`, `#item-suffix`, `#item`, `#group-label`, `#empty`.

## Overlays

Slot names differ per component. Read the row before writing a `<template #…>`.

| Component | Trigger | Content | Other slots |
|---|---|---|---|
| `Dialog` | — (`v-model:open`) | default | `#title`, `#actions` |
| `Popover` | `#trigger` | default | — |
| `HoverCard` | `#trigger` | default | — |
| `Tooltip` | **default** | `#content` | — |
| `Dropdown` / `ContextMenu` | default or `#trigger` | the `options` prop | `#item-prefix`, `#item-label`, `#item-suffix`, `#group-label`, `#empty` |
| `PageHeader` | — | **default only** | — |
| `PageHeaderMobile` | — | default (the centered title) | `#prefix`, `#suffix` |

A `#prefix` or `#suffix` template on `PageHeader` renders nothing — put the whole header row, actions included, in its default slot.

### `Dialog`
Modal. `v-model:open` is canonical (`v-model` also works). Props: `title`, `message`, `icon` (a `lucide-*` string or `{ name, theme }`), `size` (`xs`…`7xl`, default `lg`), `position` (`center | top`), `paddingTop`, `actions`, `dismissible` (default `true`), `showCloseButton` (default `true`), `bare`.
- `actions` is an array of `ButtonProps` plus `label` and `onClick(ctx)`, where `ctx` is `{ close }`.
- Dialog has no `theme` prop. The color lives on the icon object: `:icon="{ name: 'lucide-trash-2', theme: 'red' }"` — `amber | blue | red | green`.
- `bare` drops the padded card, auto-header and auto-actions (full-bleed content).
- For confirm / danger / prompt, use the imperative API below.

### Imperative dialogs and toasts
`dialog.confirm`, `dialog.prompt` and `dialog.danger` each return a `DialogHandle` (`{ close }`) **synchronously**. Values and results arrive through callbacks.

```ts
import { dialog, toast } from 'frappe-ui'

dialog.danger({
  title: 'Delete this item?', message: 'This cannot be undone.', confirmLabel: 'Delete',
  onConfirm: async () => { await api.delete(id); toast.success('Deleted') },
})

dialog.prompt({
  title: 'Rename', fields: [{ name: 'title', label: 'Title', required: true }],
  onConfirm: ({ values }) => rename(values.title),
})
```

- `confirm(args)` — `title`, `message`, `confirmLabel` (default `'Confirm'`), `cancelLabel` (default `'Cancel'`), `theme`, `icon`, `size` (default `'md'`), `dismissible`, `onConfirm(ctx)`, `onCancel()`, `actions[]`. `ctx` is `{ close, setError }`. Resolving `onConfirm` closes the dialog; rejecting renders the error inline and re-enables the buttons.
- `prompt(args)` — `title`, `message`, `fields` (**required**), `confirmLabel` (default `'Submit'`), `cancelLabel`, `theme`, `icon`, `size` (default `'md'`), `dismissible`, `onCancel`, and a **required** `onConfirm({ values, close, setError })`. It has no `actions`. A field is `{ name, label?, placeholder?, description?, required?, validate?, type?, defaultValue?, options? }` with `type` one of `text` (default), `textarea`, `select`, `checkbox`, `combobox`.
- `danger(args)` — the destructive preset: forces `theme: 'red'`, defaults the icon to `lucide-alert-triangle` and `confirmLabel` to `'Delete'`. Same args as `confirm` minus `theme` and `icon`.
- Toasts: `toast.success | error | warning | info (message, { id?, description?, duration?, action? })` and `toast.dismiss(id?)`. Policy in DESIGN.md → Toasts.
- These imperative APIs render through `<FrappeUIProvider>`; mount it once (SETUP.md).

### `Popover` / `Tooltip` / `HoverCard`
- `Popover` — arbitrary anchored content. `v-model:open`, `side`, `align`, `offset`, `bare`, `portalTo`. Trigger in `#trigger`, content in the default slot.
- `Tooltip` — hover hints: `<Tooltip text="Rename"><Button icon="lucide-pencil" /></Tooltip>`. Props `text`, `side`, `offset`, `hoverDelay` (seconds), `bare`, `disabled`; rich content goes in `#content`. Anything clickable belongs in `Popover` or `Dropdown` instead.
- `HoverCard` — hover-revealed rich previews (person cards, deal owners). `#trigger` plus the default slot.

## Input controls

Every input control **except `FileUploader`** accepts the shared labeling contract: `label`, `description`, `error` (`string | Error`), `required`, `id`. Label text goes in `label`, help text in `description`, validation in `error`. `Radio` is the one partial: it takes `label`, `description` and `id`, while `required` and `error` sit on `RadioGroup`.

Text-family sizes are `sm | md | lg | xl` and variants `subtle | outline | ghost`. Binary controls (`Checkbox`, `Radio`, `Switch`) size `xs | sm | md`.

### `FormControl`
The default for a labeled field, and a dispatcher: `type` picks the child component. Values are any `TextInput` type (`text`, `email`, `number`, `password`, `search`, `tel`, `url`, `date`, `datetime-local`, `time`, `month`, `week`, `file`, `range`) plus `textarea`, `select`, `checkbox`, `combobox`, `multiselect`, `date`, `daterange`, `datetime`, `time`. Its own props are `label`, `description`, `error`, `required`, `size` (`sm | md`), `variant` (`subtle | outline`); type-specific props and the `v-model` shape follow the child component, so read that entry. Reach for a bare `TextInput` only inside a control you compose yourself.

### `TextInput` / `Textarea` / `Password`
Single-line / multi-line / masked. `v-model` is `string | number` (`string` for Textarea). Also `type` (TextInput), `placeholder`, `disabled`, `debounce` (ms), `rows` (Textarea).

### `Select`
Fixed list, one value. `v-model` is `string | number`. `options: Array<string | { label, value, disabled?, icon?, description? }>`. Also `placeholder`, `emptyText`, `open`, `side`, `align`, `offset`, `portalTo`.

### `MultiSelect`
Fixed list, several values. `v-model` is `Array<string | number>`. `options` accepts `{ label, value, icon?, description?, disabled? }` and grouped entries `{ group, options, hideLabel? }`. Optional `v-model:query`.

### `Combobox`
One value with search. `v-model` is `string | number | null`. Optional `v-model:query` — the component owns the query when it is unbound. `trigger: 'input' | 'button'` (default `input`). Grouped options are `{ group, options }`.

### `Checkbox` / `Switch` / `Radio`
`v-model` plus `label`. `Checkbox` model is `boolean` (`1`/`0` still accepted) and adds `indeterminate`. `Switch` adds `controlPosition` (`start | end`, default `end`) and `icon`. `RadioGroup` holds the `v-model` (`string | number | boolean`) and `orientation` (`vertical | horizontal`), while `Radio` renders one option and takes a **required** `value` plus optional `disabled`. `Checkbox` and `Switch` take `padded` for a clickable row surface; on radios `padded` and `size` live on `RadioGroup` and are inherited, so `<Radio padded>` is ignored.

### `DatePicker` / `DateTimePicker` / `TimePicker` / `DateRangePicker`
`v-model` holds the value as a string. `DateRangePicker`'s `v-model` is `[from, to]` in `YYYY-MM-DD`, or `[]` when nothing is selected; it also takes `dualPane`.

### `Slider` / `Rating` / `Duration`
- `Slider` `v-model` is `number[]` — `[25]` for one thumb, `[20, 80]` for a range. Props `min`, `max`, `step`, `size` (`sm | md`); emits `value-commit` on drag end.
- `Rating` `v-model` is a `number`. Props `max` (default 5), `step` (`1 | 0.5`).
- `Duration` `v-model` is seconds (`number | null`). `format` is `short | long | colon` or a token template (`hh:mm:ss`).

### `FileUploader`
Frappe-native upload. Props `fileTypes`, `private` (default `true`), `folder`, `doctype`, `docname`, `fieldname`, `optimize`, `validateFile`. Emits `success` with the uploaded File doc, and `failure`. It has no labeling props — render your own label around it.

### `ErrorMessage`
`<ErrorMessage :message="err" />`. `message` takes a string or an `Error`.

## Display

### `Badge`
Status pill. `<Badge :label theme variant size />`. `variant` matches Button (`solid | subtle | outline | ghost`); `theme` is `gray | blue | green | amber | red | violet`; `size` is `sm | md | lg`. Icons go in `#prefix` / `#suffix`.

### `Alert`
Inline notice. `<Alert :title :description theme :icon :primary-action :secondary-action dismissible @dismiss />`.
- No layout prop: it renders a single-line row, and switches to the stacked banner when `description` or `secondaryAction` is set (readable as `data-layout`).
- `theme` (`gray | blue | green | amber | red`, default `gray`) colors the status icon. Every theme auto-shows one, gray included as a black-ink info glyph; `:icon="false"` hides it and a `lucide-*` string or component replaces it. The container never changes color.
- Actions are `ButtonProps` plus `onClick({ dismiss })`. Stateless: `dismissible` shows a × that emits `dismiss`, and the parent hides the alert with `v-if`.

### `Avatar`
`<Avatar :label :image size shape theme />`. `label` generates the initials when there is no image. `size`: `xs | sm | md | lg | xl | 2xl | 3xl`. `shape`: `circle | square`. `theme`: `gray | blue | green | amber | red | violet`.

### `Progress` / `Spinner` / `LoadingIndicator` / `LoadingText` / `Skeleton`
- `Progress` — `value` is **required**. Also `size` (`sm | md | lg | xl`), `label`, `hint`, `intervals` (turns it into a step indicator), `intervalCount`.
- `Spinner` / `LoadingIndicator` — inline spinners.
- `LoadingText` — a spinner plus one line of text. Its only prop is `text?: string` (default `"Loading..."`). It has no `lines` prop.
- `Skeleton` — the placeholder primitive. It takes no props; size it with classes: `<Skeleton class="h-4 w-40" />`.

### `Divider`
`orientation` (`horizontal | vertical`) picks the axis. Also `position` (`start | center | end`), `flexItem`, `action`.

### `Breadcrumbs`
`<Breadcrumbs :items="[{ label, route }]" />`. Each item is `{ label, route?, href?, onClick? }`.

### `Tabs` / `TabButtons`
- `Tabs` — full content tabs. `v-model` holds the selected `TabValue` (`string | number`). Compose `TabList` + `TabTrigger :value` + `TabPanel :value`, or pass the `tabs` shorthand (`[{ value, label, icon?, route? }]`). `variant`: `underline | subtle | ghost | browser-tab`. `size`: `sm | md`. `vertical` for a side rail. (`v-model:tab` belongs to `SettingsDialog`.)
- `TabButtons` — inline segmented control. `v-model` plus `options: [{ value, label, icon? }]`, and `fluid` to stretch.

### `KeyboardShortcut`
Renders a kbd combo: `<KeyboardShortcut combo="Mod+K" />` (`Mod` is Cmd on macOS, Ctrl elsewhere). Register the shortcut itself with `useKeyboardShortcut({ combo: 'Mod+K', description, handler })`, and list them all with `KeyboardShortcutsDialog`.

## Lists and collections

### `List` family (`frappe-ui/list`)
The list primitive for every list. Feed mode is the default; adding `:columns` and a `ListHeader` gives table mode.

`List` props:
- `columns?: string[]` — **CSS grid track sizes**, joined into the `--list-columns` template shared by the header and every row. Not column descriptors: `['minmax(0,1fr)', '11rem', '6rem']`. Default is the feed template `['auto', 'minmax(0,1fr)', 'auto']`. Table lists need deterministic sizes; an `auto` track sizes per row.
- `divider?: 'inset' | 'full' | 'none'` — `inset` on the feed template, `full` once `columns` is set.
- `selectable?: boolean` — reveals the checkbox column and switches row click from navigate to toggle.
- `rowHeight?: number` — px; required for virtualization.
- `v-model:selection` (`string[]`) and `v-model:active` (`string | undefined`). Binding `v-model:active` is what opts the list into active-row tracking.

The parts:
- `ListRow` — props `{ to?: RouteLocationRaw, value?: string, onClick? }`. `value` is the **row key**, required whenever the list uses `selectable` or `v-model:active`. There is no `row` prop; the row's content is app-written `<ListCell>` children.
- `ListRows` — props `{ items: T[], rowKey?: string | ((item, index) => PropertyKey), virtual?: boolean | { itemHeight?, overscan? } }`. Its scoped slot gives `{ item, index, value }`. `rowKey` defaults to the item's `name`, then `id`, then the index.
- `ListCell` — default slot only.
- `ListHeaderCell` — **the column label goes in the default slot**, not a prop. Optional `#prefix` / `#suffix`.
- `ListHeaderCellSort` — props `{ direction?: 'asc' | 'desc' | null, align?: 'start' | 'end' }`, emits `click`, label in the default slot, scoped `#suffix="{ direction }"` for a custom glyph. It is controlled: sort state and comparators are app code.
- `ListHeader` — default slot holds the header cells. Its presence flips the list into table semantics; there is no mode prop.
- `ListGroup` — props `{ label?: string, sticky?: boolean }`, slots `#header` and default.
- Geometry: the `list-gap-*` and `list-row-px-*` utilities, or the raw `--list-columns`, `--list-gap`, `--list-row-padding-x` vars.

```vue
<List :columns="['minmax(0,1fr)', '11rem', '6rem']" :row-height="60" selectable v-model:selection="selection">
  <ListHeader>
    <ListHeaderCell>Subject</ListHeaderCell>
    <ListHeaderCell>Assigned to</ListHeaderCell>
    <ListHeaderCellSort :direction="dir" align="end" @click="toggleSort">Modified</ListHeaderCellSort>
  </ListHeader>
  <ListRows :items="rows" v-slot="{ item, value }">
    <ListRow :value="value" @click="open(item)">
      <ListCell>{{ item.subject }}</ListCell>
      <ListCell>{{ item.owner }}</ListCell>
      <ListCell class="justify-end">{{ item.modified }}</ListCell>
    </ListRow>
  </ListRows>
</List>
```

### `ItemListRow`
The shared row primitive behind `Dropdown`, `Select`, `Combobox` and `MultiSelect`. Use it when composing a custom listbox surface that should keep the design-system row shell, its prefix/label/suffix regions, and active/selected/disabled states.

### `Tree`
`<Tree :nodes :node-key="'key'" draggable :move guides />`. A node is `{ [nodeKey]: id, label?, children?, expanded? }` — `expanded` is per node and defaults to open. `guides`: `connectors | lines | none`.

### `Calendar` (`frappe-ui/experimental`)
Day/week/month view. `CalendarMode` is `'Day' | 'Week' | 'Month'`; an event is `{ id?, title?, fromDate/toDate, fromTime/toTime, participant?, venue?, color? }`. Parked in experimental with the API unchanged — import from `frappe-ui/experimental`.

### `Charts` (`frappe-ui/charts`)
`BarChart`, `LineChart`, `AreaChart`, `DonutChart`, `FunnelChart`, `HeatmapChart`, `ScatterChart`, `SankeyChart`, `NumberCard`, plus the chrome (`ChartCard`, `ChartContainer`, `ChartLegend`, `ChartTooltip`). Props are flat and name the columns of your rows (`:data`, `x`, `y`).

### `Editor` (`frappe-ui/editor`)
TipTap-based rich text. `extensions` is **required**. The kits (`RichTextKit`, `CommentKit`, `InlineKit`) are extension instances — pass them uncalled; use `Kit.configure({...})` to set options. Also `format` (`html | json | markdown`, default `html`), `placeholder`, `editable`, `autofocus`, `uploadFunction`.

`Editor` is **renderless**: its template is one slot (`{ editor, isEmpty }`) and it draws no UI. A self-closing `<Editor … />` renders nothing. Put the chrome in the default slot:

```vue
<Editor v-model="content" :extensions="[RichTextKit]">
  <template #default="{ editor }">
    <EditorFixedMenu :editor="editor" :items="toolbar" />
    <EditorContent :editor="editor" />
  </template>
</Editor>
```

`EditorFixedMenu` / `EditorBubbleMenu` / `EditorContent` take `editor` optionally — inside `<Editor>` they fall back to the provided context — but `items` is required on the menus.

### `CommandPalette` (`frappe-ui/experimental`)
Seven parts: `CommandPalette` + `CommandPaletteInput` + `CommandPaletteList` + `CommandPaletteGroup` + `CommandPaletteItem` + `CommandPaletteEmpty` + `CommandPaletteFooter`. Groups and items go inside `CommandPaletteList`; the input, the empty state and the footer are its siblings.
- Root: `v-model:open`, `v-model:query`, props `filterable` (default `true` — set `false` when a server search already decided what matches) and `title` (the accessible name, never drawn). Emits `select(value, event)`.
- `CommandPaletteItem`: **`value` is required** — it is what `select` reports. The visible label is the default slot. The `label` prop only feeds the client filter, so set it only when the default slot draws more than the label. Also `keywords?: string[]`, `disabled?`, `as?`. Icons go in `#prefix` and shortcut hints in `#suffix`; neither is searchable.
- `CommandPaletteInput` takes `placeholder`; `CommandPaletteGroup` takes `label`.
- Register the opener yourself: `useKeyboardShortcut({ combo: 'Mod+K', description: 'Open command palette', allowInInput: true, handler })`. `allowInInput` is off by default, so without it the palette stops opening as soon as a field has focus.

## Layout

### App shell
`DesktopShell` — prop `scroll` (default `true`; set `false` for multi-pane layouts that own their own scroll), slots `#rail`, `#sidebar`, default. `MobileShell` — slots default and `#nav`. Compose with the `Sidebar` family (`Sidebar` with `width` / `collapsedWidth` / `disableCollapse`, plus `SidebarHeader`, `SidebarSection`, `SidebarLabel`, `SidebarItem`, `SidebarCollapseToggle`, `SidebarCard` — a promotional footer card: `<SidebarCard :title :description theme :icon :action dismissible @dismiss />` — and `Rail` / `RailItem`), `PageHeader` / `PageHeaderBase` / `PageHeaderMobile` (with `PageHeaderTitle`, `PageHeaderMobileTitle`, `PageHeaderBackButton`), `MobileNav` / `MobileNavItem`, `BottomSheet`, and the `SettingsDialog` family. Anatomy and geometry: [DESIGN.md](DESIGN.md).

### `ScrollArea`
Owns every app-level scroll region (sidebar nav, panes). Props `orientation` (`vertical | horizontal | both`), `viewportClass`, `scrollHideDelay`. Exposes `viewportElement` for scroll-position work.

### Card surface
Build one from tokens: `bg-surface-base rounded-6 border border-outline-gray-1 p-4`.

## Names that moved

Old names that no longer resolve from `frappe-ui`, and what to write instead.

- `Autocomplete` → `Combobox` (one value) or `MultiSelect` (several). Removed in `1.0.0`, along with `FormControl type="autocomplete"`.
- `ListView` → the `List` / `ListRow` / `ListCell` family from `frappe-ui/list`. The config-driven `ListView` still exists on the `frappe-ui/experimental` import path, unstable, until `frappe-ui/list` reaches parity.
- `TextEditor` (and its menu components) → `Editor` from `frappe-ui/editor`. The v0 family is parked on `frappe-ui/experimental`.
- `Input` → `TextInput`, `Textarea`, `Select`, `Checkbox`, or `FormControl`.
- `ListItem` → list primitives from `frappe-ui/list`, or app-written row markup.
- `Card` → build the surface from tokens (see Card surface above).
- `ConfirmDialog` / `confirmDialog` → `dialog.confirm(...)`. The `Toast` SFC → the imperative `toast(...)` API.
- `FeatherIcon` → a `lucide-*` class string, or the `Icon` component.
- `MonthPicker` → `Select`.
- `CircularProgressBar` → `Progress` for a linear bar. There is no radial progress component in `1.0`; copy the old SFC into your app if you need the arc.
- `useShortcut` → `useKeyboardShortcut`; `KeyboardShortcutsModal` → `KeyboardShortcutsDialog`.
- `AxisChart` / `NumberChart` / `ECharts` → the `frappe-ui/charts` family. The old charts are parked on `frappe-ui/experimental`.
- `Badge theme="orange"` → `theme="amber"`.
