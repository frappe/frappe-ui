# Select Spec

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the exact public API for `Select`. The rules it shares
with `Combobox` and `MultiSelect` — option shape, slot vocabulary, positioning,
motion, and styling hooks — are in [`selection.md`](./selection.md).

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
type SelectOptionValue = string | number

type SelectOption =
  | string
  | {
      label: string
      value: SelectOptionValue
      disabled?: boolean
      icon?: string | Component
      description?: string
      slot?: string
      [key: string]: any
    }

type SelectNormalizedOption = Exclude<SelectOption, string>

type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
type PopoverAlign = 'start' | 'center' | 'end'

// Extends `InputLabelingProps`: `label`, `description`, `error`, `required`, `id`.
interface SelectProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'subtle' | 'outline' | 'ghost'
  placeholder?: string
  disabled?: boolean
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

A value is a `string` or a `number`. Objects and `bigint` are not values —
carry the record an option came from as extra fields on the option instead, and
let `value` be its id. `''` is a real value, not "nothing".

`Select` has no per-option `slots` object; that is a `Combobox` and
`MultiSelect` feature. Per-option customization on `Select` goes through
`option.slot` and the `#item-<name>` template slot.

Defaults:

- `size = 'sm'`
- `variant = 'subtle'`
- `placeholder = 'Select option'`
- `open = false`
- `options = []`
- `portalTo = 'body'`
- `emptyText = 'No options'`

`side`, `align`, and `offset` have no defaults. Left unset, the menu is
item-aligned (anchored over the trigger so the selected row lands on the
value); setting any one of them switches to ordinary popper placement, where
the two you left out fall back to `'bottom'` / `'start'` / `4`. See
[Positioning](./selection.md#positioning).

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
// `#trigger`, `#prefix`, `#suffix`, and `#footer` all receive the same shape.
type SelectSlotProps = {
  open: boolean
  disabled: boolean
  selectedOption: SelectNormalizedOption | null
  clear: () => void
  setOpen: (value: boolean) => void
}

type SelectTriggerSlotProps = SelectSlotProps
type SelectPrefixSlotProps = SelectSlotProps
type SelectSuffixSlotProps = SelectSlotProps

type SelectItemSlotProps = {
  item: SelectNormalizedOption
  selected: boolean
}
```

`clear` and `setOpen` are the inside-out helpers: content rendered inside a
slot has no reference to the model or open state the parent owns.

Supported slots:

- `#trigger="{ open, disabled, selectedOption, clear, setOpen }"`
  - advanced trigger customization
- `#prefix="{ open, disabled, selectedOption, clear, setOpen }"`
  - convenience slot inside the default trigger shell. `selectedOption`
    is always `null` here (prefix renders pre-selection)
- `#suffix="{ open, disabled, selectedOption, clear, setOpen }"`
  - convenience slot inside the default trigger shell. **Replaces the
    default chevron** — render an explicit chevron fallback when your
    slot content is conditional
- `#label="{ required }"` and `#description`
  - override the rendered labeling content
- `#item-prefix="{ item, selected }"`
- `#item-label="{ item, selected }"`
- `#item-suffix="{ item, selected }"`
- `#item-<slot>="{ item, selected }"`
- `#item="{ item, selected }"`
  - replaces the entire row, shell included
- `#empty`
- `#footer="{ open, disabled, selectedOption, clear, setOpen }"`

Exact slot rules:

- if `#trigger` is provided, it replaces the default trigger content
- when `#trigger` is used, `#prefix` and `#suffix` are ignored
- if `option.slot` is set, it maps to `#item-<slot>` and overrides the label
  region
- `#item-label` is the preferred label-region slot
- a per-option `slot` is more specific than `#item`, so it keeps the row shell
  and fills the label region rather than handing the whole row to `#item`
- `#item-prefix` and `#item-suffix` customize only those regions of the standard
  option row shell
- `#item-suffix` renders before the built-in selected checkmark indicator
- `#footer` is rendered once after the option list
- `#empty` is rendered when there are no normalized options

Per-region precedence for each option row (the family rule is in
[Customizing rows](./selection.md#customizing-rows)):

- Full row: `#item` slot replaces the standard row shell and skips all
  per-region rendering, unless the option's `slot` matches a template slot
- Prefix: `#item-prefix` slot > `option.icon` auto-rendered (`lucide-*`
  string → Tailwind plugin, Component → rendered directly) > default (empty)
- Label: `#item-<slot>` slot (for `option.slot`) > `#item-label` slot >
  default (`label` + optional `description`)
- Suffix: `#item-suffix` slot > default (built-in selected checkmark
  indicator)

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
- a selected option whose `value` and `label` are both blank shows the
  placeholder rather than an empty trigger
- `selectedOption` exposed to the trigger slots is the normalized object option
  or `null`. There is no `displayValue` slot prop on `Select` — read
  `selectedOption.label`

Row behavior:

- option rows should use the shared `ItemListRow` shell
- `selected` state is derived from `option.value === modelValue`
- disabled options are not selectable
- selecting an enabled option updates `modelValue` and closes the list through
  select semantics
- selected rows render a built-in trailing checkmark indicator
- `option.icon` is auto-rendered in the prefix region when no `#item-prefix`
  slot overrides it (`lucide-*` string → Tailwind plugin, Component →
  rendered directly)
- default label rendering is `label` plus optional `description`

## Disabled handling

Follows the family rule in
[Disabled, loading, and empty](./selection.md#disabled-loading-and-empty):

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

`Select` follows the family's [Motion](./selection.md#motion) rules:

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
- `#item`, `#item-prefix`, `#item-label`, `#item-suffix`, `#item-<slot>`
- `#footer`
- string options

## Removed

- `#option` — the label-region slot from the pre-v1 component. Replaced by
  `#item-label` (and `#item-prefix` for the icon half of the old pattern).
  Under [ADR-0008](./adr/0008-no-deprecated-members-in-1-0-0.md) it is deleted
  rather than carried through `1.x` as an alias.
- `displayValue` on the trigger slot props. Read `selectedOption.label`.

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
  <template #item-prefix="{ item }">
    <component :is="item.icon" class="size-4" />
  </template>

  <template #item-label="{ item }">
    {{ item.label }}
  </template>
</Select>
```

`option.icon` is auto-rendered now, so an icon-only customization needs no
slot at all — set `icon` on the option and drop both templates.

## Changelog

### 2026-04-24

- **`option.icon` is auto-rendered in the prefix region.** Setting `icon` on
  an option now shows that icon automatically — no `#item-prefix` slot needed
  for the common case. Precedence: `#item-prefix` slot → `option.icon` →
  empty. Existing prefix slots are unaffected.

- **`option.icon` accepts `lucide-*` strings.** Pass `icon: 'lucide-user'`
  directly in an option definition — rendered via the Tailwind CSS-mask plugin,
  no import needed. Component values also work.
