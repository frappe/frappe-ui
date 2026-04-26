# Dropdown Spec

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the exact public API for `Dropdown`. It is a sub-spec of
[`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md) and
inherits the shared design rules from that document.

## Role

`Dropdown` is the action menu component.

It should continue to support:

- simple action lists
- grouped actions
- submenus
- switch/toggle rows
- route-based actions
- occasional advanced custom rows
- menu-style "choose one of a few actions" cases where the app marks the current
  choice

Important boundary:

- if the UI is semantically choosing a form value or picker value, use `Select`
- if the UI is a menu of actions or view/filter/sort modes and one is currently
  active, `Dropdown` is still acceptable

So `Dropdown` can support checkmarks and active menu items, but it should not
become the generic replacement for `Select`.

## Exact public API for v1

### Props

```ts
type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
type PopoverAlign = 'start' | 'center' | 'end'

/** @deprecated use `align` with start | center | end */
type DropdownPlacement = 'left' | 'center' | 'right'

interface DropdownProps {
  button?: ButtonProps
  options?: DropdownOptions
  open?: boolean
  side?: PopoverSide
  align?: PopoverAlign
  offset?: number
  portalTo?: string | HTMLElement
  emptyText?: string
  /** @deprecated alias for `align`; maps left→start, center→center, right→end */
  placement?: DropdownPlacement
}
```

Defaults:

- `options = []`
- `open = false`
- `side = 'bottom'`
- `align = 'start'`
- `offset = 4`
- `portalTo = 'body'`
- `emptyText = 'No options'`

Positioning follows the shared popover positioning conventions in
[`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md).

Compatibility rules for `placement`:

- `placement` remains supported through `v1.x`
- if `placement` is provided without `align`, it is silently mapped:
  - `'left'` → `align: 'start'`
  - `'center'` → `align: 'center'`
  - `'right'` → `align: 'end'`
- if both `placement` and `align` are provided, `align` wins and a dev warning
  is emitted
- docs should show `align` in primary examples; `placement` should only appear
  in the deprecation table

State conventions:

- visibility is controlled with `v-model:open`
- `Dropdown` does **not** expose `v-model` for a selected value
- `Dropdown` does **not** own query state

`button` is only used when no custom trigger slot is provided.

### Emits

```ts
interface DropdownEmits {
  'update:open': [value: boolean]
}
```

There is no component-level `select` event in v1. Action handling stays
item-owned through `route` and `onClick`.

### Slots

Guaranteed slot props:

```ts
type DropdownTriggerSlotProps = {
  open: boolean
  close: () => void
  disabled: boolean
}

type DropdownItemSlotProps = {
  item: DropdownOption
  close: () => void
  selected: boolean
}

type DropdownGroupLabelSlotProps = {
  group: DropdownGroupOption
}
```

Supported slots:

- `#trigger="{ open, close, disabled }"`
  - preferred advanced trigger slot
- default slot
  - supported trigger slot with the same contract as `#trigger`
  - especially ergonomic when trigger customization is the only customization
    needed
- `#item-prefix="{ item, close, selected }"`
  - custom leading content for all item rows, including submenu and switch rows
- `#item-label="{ item, close, selected }"`
  - custom label/content region for all item rows
- `#item-suffix="{ item, close, selected }"`
  - custom trailing content for all item rows
- `#item="{ item, close, selected }"`
  - full-row escape hatch for leaf action rows only
- `#item-<slot>="{ item, close, selected }"`
  - dynamic named label slot selected via `item.slot`
- `#group-label="{ group }"`
  - optional custom group label rendering
- `#empty`
  - empty state for any menu level with no visible items

Exact slot rules:

- `#trigger` wins over the default slot
- the default slot wins over the generated `button` trigger
- `close()` closes the whole dropdown, not just the current submenu
- `selected` is always `Boolean(item.selected)`
- `#item-<slot>` overrides the label region only; it does not replace the full
  row shell
- `#item` is an escape hatch for leaf action rows only
- submenu and switch rows keep their shell-owned structure even when `#item`
  exists
- `#item-prefix`, `#item-label`, and `#item-suffix` apply at every menu depth
- on submenu rows, `#item-suffix` renders before the built-in submenu chevron
- on switch rows, `#item-suffix` renders before the built-in switch control

## Exact option shape for v1

```ts
type DropdownTheme = 'gray' | 'red'

type SlotFn<TProps> = (props: TProps) => VNodeChild

interface ItemSlots<TProps> {
  prefix?: SlotFn<TProps>
  label?: SlotFn<TProps>
  suffix?: SlotFn<TProps>
  /** Full-row replacement; mutually exclusive with prefix/label/suffix */
  item?: SlotFn<TProps>
}

interface DropdownBaseOption {
  icon?: string | Component | null
  description?: string
  selected?: boolean
  disabled?: boolean
  theme?: DropdownTheme
  slot?: string
  slots?: ItemSlots<DropdownItemSlotProps>
  condition?: () => boolean
  [key: string]: any
}

interface DropdownActionOption extends DropdownBaseOption {
  label: string
  route?: RouteLocationRaw
  onClick?: (event: PointerEvent) => void
  submenu?: never
  switch?: never
  switchValue?: never
  component?: never
}

interface DropdownSwitchOption extends DropdownBaseOption {
  label: string
  switch: true
  switchValue?: boolean
  onClick?: (value: boolean) => void
  route?: never
  submenu?: never
  component?: never
}

interface DropdownSubmenuOption extends DropdownBaseOption {
  label: string
  submenu: DropdownOptions
  route?: never
  onClick?: never
  switch?: never
  switchValue?: never
  component?: never
}

/** @deprecated use `slots: { item: fn }` */
interface DropdownComponentOption extends DropdownBaseOption {
  component: any
  label?: string
  route?: never
  submenu?: never
  switch?: never
  switchValue?: never
}

interface DropdownGroupOption {
  key?: string | number
  group: string
  hideLabel?: boolean
  theme?: DropdownTheme
  options: DropdownOption[]
  /** @deprecated alias for `options` (Dropdown previously used `items`) */
  items?: DropdownOption[]
}

type DropdownOption =
  | DropdownActionOption
  | DropdownSwitchOption
  | DropdownSubmenuOption
  | DropdownComponentOption

type DropdownOptions = Array<DropdownOption | DropdownGroupOption>
```

Compatibility rule for the group field:

- the canonical group entry is `{ group, options }`, matching `Combobox`,
  `MultiSelect`, and `Select`
- `{ group, items }` (the previous Dropdown shape) keeps working through
  `v1.x` as a deprecated alias
- if both `options` and `items` are provided on the same group entry,
  `options` wins and a dev warning is emitted
- if only `items` is provided, it is silently mapped to `options`

Notes:

- `label` is required for every standard action, switch, and submenu row
- `label` is optional only for `component` escape-hatch rows
- `submenu`, `switch`, and `component` are mutually exclusive item modes
- app-defined extra fields like `value`, `id`, `image`, `shortcut`, and
  analytics metadata are allowed and must be passed through unchanged to slot
  props
- `slot` is the preferred name for dynamic label slot selection
- keep `onClick` and `condition` as canonical names

## Rendering and behavior rules

### Grouping and visibility

- `options` may mix plain items and explicit groups
- plain items are rendered as implicit unlabeled groups in source order
- each menu level should normalize its `DropdownOptions` input into an explicit
  grouped structure before row rendering
- that normalized structure should be equivalent to
  `ItemListGroup<DropdownOption>[]`, even if the implementation does not
  literally render the `ItemList` component
- `condition()` is evaluated before rendering at every menu depth
- items whose `condition()` returns false are omitted
- groups with zero visible items are omitted
- if a menu or submenu level has no visible items, render `#empty`

### Trigger behavior

- if `#trigger` is provided, use it
- else if the default slot is provided, use it as the compatibility trigger slot
- else render the generated `Button` from `button`
- trigger disabled state is derived from `button.disabled` or a forwarded
  `disabled` attribute

### Item behavior

- `selected` is visual-only state owned by the app
- `Dropdown` does not infer selection and does not emit selection changes
- selected rows receive shell-owned selected styling, but `Dropdown` does
  **not** render a trailing checkmark automatically
- if any visible item in a group has an icon, items without icons in that same
  group should reserve the same prefix space for alignment
- `route` takes precedence over `onClick` on leaf action rows
- leaf action rows close the dropdown on selection through menu semantics
- switch rows do not auto-close on toggle
- submenu rows open nested menu content and do not call `onClick`
- `component` rows are escape hatches for exceptional content and do not receive
  shell-owned prefix/label/suffix regions

### Disabled handling

Follows the shared disabled-option rule (shared design rule 8 in the main
RFC):

- disabled items are skipped by keyboard navigation and typeahead
- disabled leaf actions do not call `onClick` and do not follow `route`
- disabled submenu rows do not open their submenu
- disabled switch rows do not toggle and do not emit
- disabled items apply `ItemListRow` disabled styling and `data-disabled`

### Rendering precedence

For each visible item:

1. if `item.submenu` exists, render a submenu row
2. else if `item.switch === true`, render a switch row
3. else determine the row by combining template slots, `item.slots`, and
   the default shell (see per-region precedence below)

Per-region precedence for standard action rows (following shared design
rule 9):

Full row (if any of these provide a full-row renderer, the per-region
renderers below are skipped):

1. `#item` slot
2. `item.slots.item`
3. `item.component` — kept as a deprecated alias of `item.slots.item`; if
   both are present, `slots.item` wins and a dev warning fires

Prefix region:

1. `#item-prefix` slot
2. `item.slots.prefix`
3. default: `icon` with group-level alignment placeholder behavior

Label region:

1. `#item-<slot>` slot matching `item.slot`
2. `#item-label` slot
3. `item.slots.label`
4. default: `label` plus optional `description`

Suffix region:

1. `#item-suffix` slot
2. `item.slots.suffix`
3. default: empty for leaf action rows; submenu chevron or switch control
   is appended after the suffix region on submenu / switch rows

Notes:

- submenu and switch rows keep their shell-owned affordances even when a
  full-row renderer is provided elsewhere — the full-row escape hatch
  applies to leaf action rows only, matching the existing `#item` rule

## Styling hooks

Stable hooks for `Dropdown` should include:

- `data-slot="content"`
- `data-slot="group"`
- `data-slot="group-label"`
- `data-slot="item"`
- `data-slot="empty"`

Standard rows inside `Dropdown` should use `ItemListRow`, which provides:

- `data-slot="item-list-row"`
- `data-slot="item-prefix"`
- `data-slot="item-label"`
- `data-slot="item-suffix"`

State hooks should include, where relevant:

- `data-state="open|closed"` on menu content via the menu primitive
- `data-disabled`
- row-level selected/active styling hooks inherited from `ItemListRow`

## Motion

`Dropdown` follows the shared popover motion conventions (shared design
rule 10 in the main RFC):

- content scales in from the trigger via
  `transform-origin: var(--reka-dropdown-menu-content-transform-origin)` on
  the animated element (the inner content-body, not the outer positioned
  wrapper)
- enter `180ms` / exit `140ms` with `cubic-bezier(0.23, 1, 0.32, 1)`, from
  `scale(0.97)` + `translateY(2px)` + `opacity: 0`
- keyboard-driven opens (Enter, Space, ArrowUp, ArrowDown on the trigger)
  skip the animation entirely
- pointer-driven opens (click / tap) play the full animation
- classification is pointer-recency based: an open transition counts as
  pointer-driven only if a `pointerdown` fired on the trigger within
  ~300ms before it; everything else defaults to keyboard. The resolved
  mode is exposed as `data-motion="animated" | "instant"` on the
  content-body
- `prefers-reduced-motion: reduce` disables the content animation

## Accessibility and semantics

`Dropdown` should follow the menu button pattern, not the listbox/select
pattern.

That means:

- trigger uses menu-trigger semantics
- leaf actions are menu actions, not form options
- submenu items expose submenu semantics
- keyboard navigation, escape handling, typeahead, and submenu arrow-key
  behavior are delegated to the underlying menu primitive
- `selected` is visual state only; it does not change the component into a
  single-select control

## Keep supported in v1.x

These stay supported:

- `button`
- `options`
- `placement` (as an alias for `align`)
- `side`
- `offset`
- `portalTo`
- grouped items, including the legacy `{ group, items }` shape
- `submenu`
- `switch`
- `switchValue`
- `component`
- `#item`
- current default trigger slot behavior

## Deprecate

Keep working, but deprecate for ordinary row customization:

- `#item` as the default recommendation
- `item.component` in favor of `item.slots` (use `slots.item` for the
  full-row escape hatch; use `slots.prefix` / `slots.label` /
  `slots.suffix` for per-region customization)
- `placement` prop in favor of `align`
- `{ group, items }` group entries in favor of `{ group, options }` (for
  symmetry with `Combobox` / `MultiSelect` / `Select`)

Keep as escape hatches:

- deeply custom rows
- destructive full-width special rows
- embedded app selectors or similar exceptional content

Do **not** deprecate:

- `onClick`
- `condition`
- `route`
- `submenu`
- `switch`

## Migration path

### Old

```vue
<Dropdown :options="items">
  <template #item="{ item }">
    <button class="flex h-7 w-full items-center justify-between rounded px-2 hover:bg-surface-gray-3">
      <span>{{ item.label }}</span>
      <LucideCheck v-if="active === item.value" class="size-4" />
    </button>
  </template>
</Dropdown>
```

### New

```vue
<Dropdown :options="items">
  <template #item-suffix="{ item }">
    <LucideCheck v-if="item.selected" class="size-4" />
  </template>
</Dropdown>
```

### `{ group, items }` → `{ group, options }` rename

Old:

```ts
const actions = [
  {
    group: 'Edit',
    items: [
      { label: 'Rename', onClick: rename },
      { label: 'Duplicate', onClick: duplicate },
    ],
  },
]
```

New:

```ts
const actions = [
  {
    group: 'Edit',
    options: [
      { label: 'Rename', onClick: rename },
      { label: 'Duplicate', onClick: duplicate },
    ],
  },
]
```

`{ group, items }` keeps working through `v1.x`; a dev warning fires if
both `options` and `items` are provided on the same group entry.

### Old: full-row escape hatch via `component`

```ts
{
  label: 'Delete',
  component: h(Button, { variant: 'solid', theme: 'red' }, () => 'Delete'),
}
```

### New: full-row escape hatch via `slots.item`

```ts
{
  label: 'Delete',
  slots: {
    item: () =>
      h(Button, { variant: 'solid', theme: 'red' }, () => 'Delete'),
  },
}
```

### New: per-region `slots` (preferred when the shell still makes sense)

```ts
import { h } from 'vue'
import LucideCheck from '~icons/lucide/check'
import Avatar from '@/components/Avatar.vue'

const options = users.map((user) => ({
  label: user.name,
  selected: user.id === activeId,
  onClick: () => switchTo(user.id),
  slots: {
    prefix: ({ item }) =>
      h(Avatar, { image: item.image, class: 'size-4' }),
    suffix: ({ selected }) =>
      selected ? h(LucideCheck, { class: 'size-4' }) : null,
  },
}))
```

### v1.x stance

`component` is still supported as a deprecated alias for `slots.item`. Use
`slots.prefix` / `slots.label` / `slots.suffix` for ordinary
icon/label/check/suffix customization authored in JS; use `slots.item`
when the whole row needs to be taken over.

## Changelog

### 2026-04-24

- **`item.icon` accepts `lucide-*` strings.** Pass `icon: 'lucide-pen'`
  directly in an item definition — no component import needed. Strings
  starting with `lucide-` are rendered as a `<span>` styled via the Tailwind
  CSS-mask plugin. Other strings still route to FeatherIcon (back-compat).
  Component values continue to work unchanged.

- **Group labels toned to `text-ink-gray-4`.** Separator group headings are
  now visually quieter so they recede behind the action items.
