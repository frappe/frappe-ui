# Select Spec

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the exact public API for `Select`. It is a sub-spec of
[`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md) and
inherits the shared design rules from that document.

## Role

`Select` is the simple single-choice picker for small static lists.

It should stay narrow:

- single selection only
- local static options
- no search input
- no action-menu semantics
- no grouped option support in v1

If the UI needs search, use `Combobox`. If the UI is choosing actions, use
`Dropdown`.

## Exact public API for v1

### Types

```ts
type SelectOptionValue = string | number | bigint | Record<string, any>

type SlotFn<TProps> = (props: TProps) => VNodeChild

interface ItemSlots<TProps> {
  prefix?: SlotFn<TProps>
  label?: SlotFn<TProps>
  suffix?: SlotFn<TProps>
  /** Full-row replacement; mutually exclusive with prefix/label/suffix */
  item?: SlotFn<TProps>
}

type SelectOption =
  | string
  | {
      label: string
      value: SelectOptionValue
      disabled?: boolean
      icon?: string | Component
      description?: string
      slot?: string
      slots?: ItemSlots<SelectOptionSlotProps>
      [key: string]: any
    }

type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
type PopoverAlign = 'start' | 'center' | 'end'

interface SelectProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'subtle' | 'outline' | 'ghost'
  placeholder?: string
  disabled?: boolean
  id?: string
  modelValue?: SelectOptionValue
  open?: boolean
  options?: SelectOption[]
  side?: PopoverSide
  align?: PopoverAlign
  offset?: number
  portalTo?: string | HTMLElement
  emptyText?: string
}
```

Defaults:

- `size = 'sm'`
- `variant = 'subtle'`
- `placeholder = 'Select option'`
- `open = false`
- `options = []`
- `side = 'bottom'`
- `align = 'start'`
- `offset = 4`
- `portalTo = 'body'`
- `emptyText = 'No options'`

Positioning follows the shared popover positioning conventions in
[`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md).

`side`, `align`, `offset`, and `portalTo` are additive in v1.x: they did not
exist in previous versions of `Select`, so no migration is needed. Apps that
never pass them continue to see the same default positioning as before.

State conventions:

- selected value uses `v-model` / `modelValue`
- menu visibility uses `v-model:open`
- `Select` does not own query state
- `Select` accepts flat options only in v1

### Emits

```ts
interface SelectEmits {
  'update:modelValue': [value: SelectOptionValue | undefined]
  'update:open': [value: boolean]
}
```

There is no separate component-level `select` event in v1.

### Slots

Guaranteed slot props:

```ts
type SelectTriggerSlotProps = {
  open: boolean
  disabled: boolean
  selectedOption: Exclude<SelectOption, string> | null
  displayValue: string
}

type SelectOptionSlotProps = {
  option: Exclude<SelectOption, string>
}
```

Supported slots:

- `#trigger="{ open, disabled, selectedOption, displayValue }"`
  - advanced trigger customization
- `#prefix`
  - convenience slot inside the default trigger shell
- `#suffix`
  - convenience slot inside the default trigger shell
- `#item-prefix="{ option }"`
- `#item-label="{ option }"`
- `#item-suffix="{ option }"`
- `#item-<slot>="{ option }"`
- `#option="{ option }"`
  - compatibility alias for item label customization through `v1.x`
- `#empty`
- `#footer`

Exact slot rules:

- if `#trigger` is provided, it replaces the default trigger content
- when `#trigger` is used, `#prefix` and `#suffix` are ignored
- if `option.slot` is set, it maps to `#item-<slot>` and overrides the label
  region
- `#item-label` is the preferred label-region slot
- `#option` remains supported as the compatibility fallback for the label region
  when `#item-label` is not used
- `#item-prefix` and `#item-suffix` customize only those regions of the standard
  option row shell
- `#item-suffix` renders before the built-in selected checkmark indicator
- `#footer` is rendered once after the option list
- `#empty` is rendered when there are no normalized options

Per-region precedence for each option row (following shared design rule 9):

- Prefix: `#item-prefix` slot > `option.slots.prefix` > default (empty;
  consumers use `option.icon` + `#item-prefix` if they want icon rendering)
- Label: `#item-<slot>` slot (for `option.slot`) > `#item-label` slot >
  `#option` slot (compatibility) > `option.slots.label` > default
  (`label` + optional `description`)
- Suffix: `#item-suffix` slot > `option.slots.suffix` > default (built-in
  selected checkmark indicator)
- Full row: `option.slots.item` replaces the standard row shell and skips
  all per-region rendering; there is no full-row template slot on `Select`

## Option normalization and behavior

Normalization rules:

- `Select` accepts flat `options` only in v1; it does not accept grouped options
- string options normalize to `{ label: option, value: option }`
- nullish options are ignored
- options whose `value` is `undefined` or `null` are omitted
- selected option lookup uses strict equality against `modelValue`

Display rules:

- if a selected option exists, its `label` is the default display value
- otherwise the trigger shows `placeholder`
- `displayValue` exposed to `#trigger` is the selected option label or `''`
- `selectedOption` exposed to `#trigger` is the normalized object option or
  `null`

Row behavior:

- option rows should use the shared `ItemListRow` shell
- `selected` state is derived from `option.value === modelValue`
- disabled options are not selectable
- selecting an enabled option updates `modelValue` and closes the list through
  select semantics
- selected rows render a built-in trailing checkmark indicator
- `option.icon` is allowed in the item shape but is **not** rendered by default;
  consumers should use `#item-prefix` or trigger slots when they want icon
  rendering
- default label rendering is `label` plus optional `description`

## Disabled handling

Follows the shared disabled-option rule (shared design rule 8 in the main
RFC):

- disabled options are skipped by keyboard navigation and typeahead
- disabled options cannot be selected by click or keyboard
- disabled options never emit `update:modelValue`
- disabled options apply `ItemListRow` disabled styling and `data-disabled`
- an already-selected option that becomes disabled stays in `modelValue`;
  it just stops being interactable

## Styling hooks

Stable hooks for `Select` should include:

- `data-slot="trigger"`
- `data-slot="content"`
- `data-slot="item"`
- `data-slot="empty"`
- `data-slot="footer"`

Select rows should use `ItemListRow`, which provides:

- `data-slot="item-list-row"`
- `data-slot="item-prefix"`
- `data-slot="item-label"`
- `data-slot="item-suffix"`

State hooks should include, where relevant:

- `data-state="open|closed"` on trigger/content via the select primitive
- `data-state="checked|unchecked"` on option items via the select primitive
- `data-disabled`
- row-level selected styling inherited from `ItemListRow`

## Motion

`Select` follows the shared popover motion conventions (shared design rule
10 in the main RFC):

- content scales in from the trigger via
  `transform-origin: var(--reka-select-content-transform-origin)` on the
  animated element (the inner content-body, not the outer positioned wrapper)
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

`Select` should follow the select/listbox pattern, not the menu button pattern.

That means:

- trigger and content use select semantics
- items are options, not actions
- keyboard navigation, typeahead, highlighted state, and selection behavior are
  delegated to the underlying select primitive
- selected state is semantic component state, not just visual decoration

## Keep supported in v1.x

These stay supported:

- `v-model`
- `v-model:open`
- `size`
- `variant`
- `placeholder`
- `disabled`
- `id`
- `options`
- `side`, `align`, `offset`, `portalTo` (additive)
- `emptyText` (additive)
- `#trigger`
- `#prefix`
- `#suffix`
- `#option`
- `#footer`
- string options

## Deprecate

Keep working, but deprecate for ordinary customization:

- `#option` as the primary documented customization API once `#item-label`
  exists

`#option` should remain as an alias/fallback for the label region through
`v1.x`.

## Migration path

### Old

```vue
<Select v-model="chartType" :options="options">
  <template #option="{ option }">
    <div class="flex items-center gap-2">
      <component :is="option.icon" class="size-4" />
      <span>{{ option.label }}</span>
    </div>
  </template>
</Select>
```

### New

```vue
<Select v-model="chartType" :options="options">
  <template #item-prefix="{ option }">
    <component :is="option.icon" class="size-4" />
  </template>

  <template #item-label="{ option }">
    {{ option.label }}
  </template>
</Select>
```
