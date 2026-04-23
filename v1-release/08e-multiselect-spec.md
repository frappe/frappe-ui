# MultiSelect Spec

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the exact public API for `MultiSelect`. It is a sub-spec
of [`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md)
and inherits the shared design rules from that document.

## Role

`MultiSelect` is the canonical searchable multi-choice picker.

It should stay narrower than a full people-picker or chips input, but it
should inherit the same item-slot model as `Combobox` and `Select`.

Use `MultiSelect` when the UI needs:

- multiple simultaneously selected values from a list
- in-popover search over those values
- clear-all / select-all affordances in the footer

If the UI needs chips in the trigger, avatars everywhere, grouped async remote
results, custom selected-summary behavior, create-new actions, or
person-specific affordances all at once, that combination may justify a
separate future component such as `MultiCombobox` or `PeoplePicker`.

## Exact public API for v1

### Types

```ts
type MultiSelectVariant = 'subtle' | 'outline' | 'ghost'
type MultiSelectSize = 'sm' | 'md' | 'lg' | 'xl'

type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
type PopoverAlign = 'start' | 'center' | 'end'

type SlotFn<TProps> = (props: TProps) => VNodeChild

interface ItemSlots<TProps> {
  prefix?: SlotFn<TProps>
  label?: SlotFn<TProps>
  suffix?: SlotFn<TProps>
  /** Full-row replacement; mutually exclusive with prefix/label/suffix */
  item?: SlotFn<TProps>
}

interface MultiSelectOption {
  label: string
  value: string
  icon?: string | Component
  description?: string
  disabled?: boolean
  slot?: string
  slots?: ItemSlots<MultiSelectItemSlotProps>
  [key: string]: any
}

interface MultiSelectGroupedOption {
  key?: string | number
  group: string
  hideLabel?: boolean
  options: MultiSelectOption[]
}

type MultiSelectOptions = Array<MultiSelectOption | MultiSelectGroupedOption>
```

### Props

```ts
interface MultiSelectProps {
  modelValue?: string[]
  options?: MultiSelectOptions
  variant?: MultiSelectVariant
  size?: MultiSelectSize
  placeholder?: string
  disabled?: boolean
  id?: string
  open?: boolean
  hideSearch?: boolean
  loading?: boolean
  emptyText?: string
  side?: PopoverSide
  align?: PopoverAlign
  offset?: number
  portalTo?: string | HTMLElement
  compareFn?: (a: MultiSelectOption, b: MultiSelectOption) => boolean
}
```

Defaults:

- `modelValue = []`
- `options = []`
- `variant = 'subtle'`
- `size = 'sm'`
- `placeholder = 'Select option'`
- `disabled = false`
- `open = false`
- `hideSearch = false`
- `loading = false`
- `emptyText = 'No results'`
- `side = 'bottom'`
- `align = 'start'`
- `offset = 4`
- `portalTo = 'body'`

State conventions:

- selected values use `v-model` / `modelValue` (array of option values)
- menu visibility uses `v-model:open`
- query state stays internal; `MultiSelect` emits `update:query` but does not
  accept a `v-model:query` in v1
- `compareFn` overrides the default `===` value equality used to decide which
  options are selected; it is invoked with full option objects

Positioning follows the shared popover positioning conventions in
[`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md).
`side`, `align`, `offset`, and `portalTo` did not exist in previous versions
of `MultiSelect`, so their addition is purely additive.

### Emits

```ts
interface MultiSelectEmits {
  'update:modelValue': [value: string[]]
  'update:open': [value: boolean]
  'update:query': [value: string]
}
```

Emit rules:

- `update:modelValue` fires with the new array whenever the selection changes
  (add, remove, clear-all, select-all)
- `update:open` fires on open/close transitions driven by user interaction
- `update:query` fires on every user-driven change to the search input
- disabled options do not toggle selection and do not emit
  `update:modelValue`

### Slots

Guaranteed slot props:

```ts
type MultiSelectTriggerSlotProps = {
  open: boolean
  disabled: boolean
  selectedOptions: MultiSelectOption[]
  displayValue: string
  clearAll: () => void
  toggleOpen: () => void
}

type MultiSelectItemSlotProps = {
  item: MultiSelectOption
  query: string
  selected: boolean
}

type MultiSelectFooterSlotProps = {
  clearAll: () => void
  selectAll: () => void
  selectedOptions: MultiSelectOption[]
  query: string
}

type MultiSelectGroupLabelSlotProps = {
  group: MultiSelectGroupedOption
}

type MultiSelectEmptySlotProps = {
  query: string
}
```

Supported slots:

- `#trigger="{ open, disabled, selectedOptions, displayValue, clearAll, toggleOpen }"`
  - preferred advanced trigger slot; replaces the default button trigger
- `#item-prefix="{ item, query, selected }"`
- `#item-label="{ item, query, selected }"`
- `#item-suffix="{ item, query, selected }"`
- `#item="{ item, query, selected }"`
  - full-row escape hatch for a single item
- `#item-<slot>="{ item, query, selected }"`
  - dynamic named label slot selected via `item.slot`
- `#group-label="{ group }"`
- `#empty="{ query }"`
- `#footer="{ clearAll, selectAll, selectedOptions, query }"`
  - compatibility alias for the current `#footer` slot; default footer contains
    Clear All / Select All buttons

Exact slot rules:

- if `option.slot` is set, it maps to `#item-<slot>` and overrides the label
  region
- `#item-label` is the fallback label-region slot when no matching
  `#item-<slot>` exists
- `#item-prefix` and `#item-suffix` customize only those regions of the
  standard option row shell
- `#item-suffix` renders before the built-in selected checkmark indicator
- `#item` is a per-row escape hatch and, when used, fully replaces the
  standard row shell for that row
- `#empty` receives the current query
- `#footer` replaces the default Clear All / Select All footer; when not
  provided, the default footer is rendered if either action is available

## Option normalization and behavior

Normalization rules:

- nullish entries in `options` are ignored
- options with missing or `undefined` `value` are omitted
- grouped entries with empty `options` after filtering are omitted
- `compareFn`, when provided, is used to resolve which options are currently
  selected for display and rendering; otherwise `option.value` strict equality
  against entries in `modelValue` is used

Filtering rules:

- filtering is internal to `MultiSelect` and is based on the current query
- a case-insensitive substring match against `label` (and `value`) is used by
  default
- filtering never removes already-selected options from the selection; it
  only hides them from the list

Selection behavior:

- clicking an enabled option toggles its value in `modelValue`
- disabled options cannot be toggled and do not emit `update:modelValue`
- the popover does not auto-close on selection; it stays open until the user
  closes it
- `clearAll` empties `modelValue`
- `selectAll` sets `modelValue` to the concatenated values of every enabled,
  non-disabled option across all groups

Loading behavior:

- when `loading` is `true`, the popover shows a loading indicator in the
  search input (or in place of the list when `hideSearch` is true) and
  suspends the empty state

Search behavior:

- when `hideSearch` is `true`, no search input is rendered and `update:query`
  is never emitted
- when `hideSearch` is `false`, the search input is always rendered at the
  top of the popover

Display rules:

- when at least one option is selected, the trigger shows the comma-separated
  labels of the selected options
- otherwise the trigger shows `placeholder`
- `displayValue` exposed to `#trigger` is the same comma-separated string or
  `''`
- `selectedOptions` exposed to `#trigger` is the resolved option objects
  array, preserving `modelValue` order

Disabled handling:

- disabled items are skipped during keyboard navigation
- disabled items cannot be clicked into selection
- disabled items apply shared `ItemListRow` disabled styling
- `selectAll` skips disabled options
- selecting never emits `update:modelValue` from a disabled item

## Rendering precedence

Rows follow the per-region precedence from shared design rule 9. For each
visible item:

Full row:

1. `#item` slot
2. `item.slots.item`

Prefix region:

1. `#item-prefix` slot
2. `item.slots.prefix`
3. default: empty

Label region:

1. `#item-<slot>` slot matching `item.slot`
2. `#item-label` slot
3. `#option` slot (compatibility)
4. `item.slots.label`
5. default: `label` plus optional `description`

Suffix region:

1. `#item-suffix` slot
2. `item.slots.suffix`
3. default: built-in selected checkmark indicator

## Styling hooks

Stable hooks for `MultiSelect` should include:

- `data-slot="trigger"`
- `data-slot="content"`
- `data-slot="search"`
- `data-slot="group"`
- `data-slot="group-label"`
- `data-slot="item"`
- `data-slot="empty"`
- `data-slot="footer"`
- `data-variant`
- `data-size`

MultiSelect rows should use `ItemListRow`, which provides:

- `data-slot="item-list-row"`
- `data-slot="item-prefix"`
- `data-slot="item-label"`
- `data-slot="item-suffix"`

State hooks should include, where relevant:

- `data-state="open|closed"` on trigger/content via the primitive
- `data-state="checked|unchecked"` on option rows via the primitive
- `data-loading` on content when `loading` is true
- `data-disabled`
- row-level selected styling inherited from `ItemListRow`

## Motion

`MultiSelect` follows the shared popover motion conventions (shared design
rule 10 in the main RFC):

- content scales in from the trigger via
  `transform-origin: var(--reka-popper-transform-origin)` (or the
  equivalent primitive-provided variable) on the animated element (the
  inner content-body, not the outer positioned wrapper)
- enter `180ms` / exit `140ms` with `cubic-bezier(0.23, 1, 0.32, 1)`, from
  `scale(0.97)` + `translateY(2px)` + `opacity: 0`
- keyboard-driven opens — Enter, Space, ArrowUp, ArrowDown on the trigger,
  or typing in the search input when `hideSearch` is `false` — skip the
  animation entirely
- pointer-driven opens (click / tap) play the full animation
- classification is pointer-recency based: an open transition counts as
  pointer-driven only if a `pointerdown` fired on the trigger within
  ~300ms before it; everything else defaults to keyboard. The resolved
  mode is exposed as `data-motion="animated" | "instant"` on the
  content-body
- `prefers-reduced-motion: reduce` disables the content animation

## Accessibility and semantics

`MultiSelect` should follow the ARIA listbox pattern with multi-selection.

That means:

- the trigger uses `aria-haspopup="listbox"` and `aria-expanded`
- the list exposes `role="listbox"` and `aria-multiselectable="true"`
- items expose `role="option"` with `aria-selected` reflecting their presence
  in `modelValue`
- keyboard navigation (arrow keys, home/end, typeahead), escape handling, and
  multi-select toggling are delegated to the underlying primitive
- escape closes the popover without clearing selection
- the `id` prop is forwarded to the trigger so `<label for="...">` works

## Keep supported in v1.x

Current API stays supported:

- `v-model`
- `placeholder`
- `options`
- `hideSearch`
- `loading`
- `compareFn`
- `#option`
- `#footer`

## Add / prefer

### Additive props

- `size`, `variant`, `id`, `open`, `disabled`, `emptyText`
- `side`, `align`, `offset`, `portalTo`

### Advanced state

- `v-model:open`

### Query event

- `@update:query`

Query stays internal otherwise. The old version of `MultiSelect` did not
expose a search event, so no alias is needed.

### Preferred trigger API

- `#trigger`
- keep the default Button-based trigger as the fallback when `#trigger` is
  not provided

### Preferred item slots

- `#item-prefix`
- `#item-label`
- `#item-suffix`
- `#empty`
- `#footer`
- `#item` as the full takeover escape hatch

### Preferred item schema

Simple options can keep their current shape (`{ label, value, disabled? }`),
but richer object items should converge on:

```ts
{
  label: string
  value: string
  icon?: string | Component
  description?: string
  disabled?: boolean
  slot?: string
}
```

Grouped options should also be supported so apps do not keep building richer
local multi-select variants just for grouped pickers:

```ts
{
  group: string
  key?: string | number
  hideLabel?: boolean
  options: MultiSelectOption[]
}
```

## Deprecate

Keep working, but deprecate for ordinary customization:

- `#option` as the primary documented customization API once `#item-label`
  exists

`#option` remains as an alias for the label region through `v1.x`. Its slot
prop signature (`{ item }`) continues to work unchanged.

Do not deprecate:

- `hideSearch`
- `loading`
- `compareFn`
- default footer behavior

## Scope guard

Do not force every richer multi-picker need into the base component.

If apps need all of these together:

- chips in the trigger
- avatars everywhere
- grouped async remote results
- custom selected summary behavior
- create-new actions
- person-specific affordances

that may justify a separate future component such as `MultiCombobox` or
`PeoplePicker`.

## Migration path

### Old

```vue
<MultiSelect v-model="values" :options="options">
  <template #option="{ item }">
    <div class="flex items-center gap-2">
      <Avatar :image="item.image" class="size-4" />
      <span>{{ item.label }}</span>
    </div>
  </template>
</MultiSelect>
```

### New

```vue
<MultiSelect v-model="values" :options="options">
  <template #item-prefix="{ item }">
    <Avatar :image="item.image" class="size-4" />
  </template>

  <template #item-label="{ item }">
    {{ item.label }}
  </template>
</MultiSelect>
```

### Query migration

Old: no public search event.

New:

```vue
<MultiSelect
  v-model="values"
  :options="options"
  @update:query="onQueryChange"
/>
```

### Grouped options

Old: grouped options not supported; apps built custom variants.

New:

```ts
const options = [
  {
    group: 'Active',
    options: [
      { label: 'Alpha', value: 'alpha' },
      { label: 'Beta', value: 'beta' },
    ],
  },
  {
    group: 'Archived',
    options: [{ label: 'Gamma', value: 'gamma' }],
  },
]
```
