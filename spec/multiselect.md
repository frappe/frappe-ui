# MultiSelect Spec

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the exact public API for `MultiSelect`. The rules it
shares with `Select` and `Combobox` — option shape, slot vocabulary,
positioning, motion, and styling hooks — are in
[`selection.md`](./selection.md).

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
  value: string | number
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
// Extends `InputLabelingProps`: `label`, `description`, `error`, `required`, `id`.
interface MultiSelectProps {
  modelValue?: Array<string | number>
  options?: MultiSelectOptions
  variant?: MultiSelectVariant
  size?: MultiSelectSize
  placeholder?: string
  disabled?: boolean
  open?: boolean
  query?: string
  hideSearch?: boolean
  loading?: boolean
  filterable?: boolean
  emptyText?: string
  side?: PopoverSide
  align?: PopoverAlign
  offset?: number
  portalTo?: string | HTMLElement
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
- `query = ''`
- `hideSearch = false`
- `loading = false`
- `filterable = true`
- `emptyText = 'No results'`
- `side = 'bottom'`
- `align = 'start'`
- `offset = 4`
- `portalTo = 'body'`

State conventions:

- selected values use `v-model` / `modelValue` (array of option values)
- menu visibility uses `v-model:open`
- search text uses `v-model:query`. Bound, the query belongs to the consumer
  and the component never resets it — not on open, not on close, not on mount;
  a seeded query filters the list immediately. Unbound, it clears every time
  the popover opens

There is no value-equality hook. Selection is `option.value` against the
entries in `modelValue`, and values are `string | number` — see
[Options](./selection.md#options).

Positioning follows [Positioning](./selection.md#positioning).
`side`, `align`, `offset`, and `portalTo` did not exist in previous versions
of `MultiSelect`, so their addition is purely additive.

### Emits

```ts
interface MultiSelectEmits {
  'update:modelValue': [value: Array<string | number>]
  'update:selectedOptions': [value: MultiSelectOption[]]
  'update:open': [value: boolean]
  'update:query': [value: string]
}
```

Emit rules:

- `update:modelValue` fires with the new array whenever the selection changes
  (add, remove, clear-all, select-all)
- `update:selectedOptions` fires alongside it with the original option objects
  resolved out of `options`, so custom fields on an option survive
- `update:open` fires on open/close transitions driven by user interaction
- `update:query` fires on every user-driven change to the search input
- disabled options do not toggle selection and do not emit
  `update:modelValue`

### Slots

Guaranteed slot props:

```ts
// Shared shape for `#trigger`, `#prefix`, `#suffix`, `#summary` (adds
// `summary`), and `#footer` (adds `selectAll`). `clear` and `setOpen` are
// exposed on every slot so consumers don't need to hoist into `#trigger`
// just to clear the selection or toggle the popover.
type MultiSelectSlotProps = {
  open: boolean
  disabled: boolean
  query: string
  selectedOptions: MultiSelectOption[]
  clear: () => void
  setOpen: (value: boolean) => void
}

type MultiSelectTriggerSlotProps = MultiSelectSlotProps
type MultiSelectPrefixSlotProps = MultiSelectSlotProps
type MultiSelectSuffixSlotProps = MultiSelectSlotProps

type MultiSelectSummarySlotProps = MultiSelectSlotProps & {
  // default summary text — placeholder, single label, or `"N selected"`
  summary: string
}

type MultiSelectItemSlotProps = {
  item: MultiSelectOption
  query: string
  selected: boolean
}

type MultiSelectFooterSlotProps = MultiSelectSlotProps & {
  selectAll: () => void
}

// `#search-prefix` and `#search-suffix`, which live inside the search row
// and disappear with it when `hideSearch` is set.
type MultiSelectSearchSlotProps = {
  query: string
  setQuery: (value: string) => void
  disabled: boolean
  focus: (options?: FocusOptions) => void
}

type MultiSelectGroupLabelSlotProps = {
  group: MultiSelectGroupedOption
}

type MultiSelectEmptySlotProps = {
  query: string
}
```

Supported slots:

- `#trigger="{ open, disabled, query, selectedOptions, clear, setOpen }"`
  - preferred advanced trigger slot; replaces the default button trigger
- `#prefix="{ ...MultiSelectSlotProps }"`
  - convenience slot rendered before the trigger label. When provided,
    it owns the entire prefix area regardless of selection count — use
    it for aggregate visuals like stacked avatars across multiple
    selections. If omitted, the trigger auto-renders the selected
    option's `#item-prefix` / `icon` when exactly one is selected
- `#summary="{ ...MultiSelectSlotProps, summary }"`
  - overrides the trigger's label region. Receives the default summary
    text as `summary` — placeholder, single label, or `"N selected"` —
    so the consumer can fall back to it or replace entirely (e.g. with
    a comma-separated label list). Providing this slot suppresses the
    default phantom-sizer (which only knows the default summary's
    worst-case width), so the trigger is content-sized — pin a width
    on the trigger (or wrap with one) if you need a stable layout
- `#suffix="{ ...MultiSelectSlotProps }"`
  - convenience slot rendered after the trigger label. **Replaces the
    default chevron** — render an explicit chevron fallback when your
    slot content is conditional. Use `@click.stop` / `@pointerdown.stop`
    so the press doesn't toggle the popover. Canonical home for a
    clear-all button — call `clear` from the slot prop
- `#label="{ required }"` and `#description`
  - override the rendered labeling content
- `#search-prefix="{ query, setQuery, disabled, focus }"`
- `#search-suffix="{ query, setQuery, disabled, focus }"`
  - decorate the search row. Both live inside it, so `hideSearch` removes
    them along with it
- `#item-prefix="{ item, query, selected }"`
- `#item-label="{ item, query, selected }"`
- `#item-suffix="{ item, query, selected }"`
- `#item="{ item, query, selected }"`
  - full-row escape hatch for a single item
- `#item-<slot>="{ item, query, selected }"`
  - dynamic named label slot selected via `item.slot`
- `#group-label="{ group }"`
- `#empty="{ query }"`
- `#footer="{ ...MultiSelectSlotProps, selectAll }"`
  - replaces the default footer, which contains Clear All / Select All
    buttons. Clear All is `clear` from the shared shape; Select All is the
    extra `selectAll`

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
- which options count as selected is resolved by `option.value` strict
  equality against the entries in `modelValue`

Filtering rules:

- filtering is internal to `MultiSelect` and is based on the current query
- `filterable="false"` switches query filtering off entirely, for options that
  come back already matched from a server search
- a case-insensitive substring match against `label` (and `value`) is used by
  default
- filtering never removes already-selected options from the selection; it
  only hides them from the list

Selection behavior:

- clicking an enabled option toggles its value in `modelValue`
- disabled options cannot be toggled and do not emit `update:modelValue`
- the popover does not auto-close on selection; it stays open until the user
  closes it
- `clear` empties `modelValue`
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

- with exactly one option selected, the trigger shows that option's `label`
- with two or more, it collapses to `"N selected"` so the trigger width does
  not balloon
- with none, it shows `placeholder`
- `#summary` overrides that text and receives it as `summary`. There is no
  `displayValue` slot prop
- `selectedOptions` exposed to the trigger slots is the resolved option objects
  array, preserving `modelValue` order

Disabled handling:

- disabled items are skipped during keyboard navigation
- disabled items cannot be clicked into selection
- disabled items apply shared `ItemListRow` disabled styling
- `selectAll` skips disabled options
- selecting never emits `update:modelValue` from a disabled item

## Rendering precedence

Rows follow the per-region precedence in
[Customizing rows](./selection.md#customizing-rows). For each visible item:

Full row:

1. `#item` slot
2. `item.slots.item`

Prefix region:

1. `#item-prefix` slot
2. `item.slots.prefix`
3. `item.icon` auto-rendered (`lucide-*` string → Tailwind plugin,
   Component → rendered directly)
4. default: empty

Label region:

1. `#item-<slot>` slot matching `item.slot`
2. `#item-label` slot
3. `item.slots.label`
4. default: `label` plus optional `description`

Suffix region:

1. `#item-suffix` slot
2. `item.slots.suffix`
3. default: built-in selected checkmark indicator

## Styling hooks

Stable hooks for `MultiSelect` should include:

- `data-slot="trigger"`
- `data-slot="chevron"`
- `data-slot="content"`
- `data-slot="content-body"`
- `data-slot="search"`
- `data-slot="input"`
- `data-slot="group"`
- `data-slot="group-label"`
- `data-slot="item"`
- `data-slot="loading"`
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

`MultiSelect` follows the family's [Motion](./selection.md#motion) rules:

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
- `#footer`

## Add / prefer

### Additive props

- `size`, `variant`, `id`, `open`, `disabled`, `emptyText`
- `side`, `align`, `offset`, `portalTo`

### Advanced state

- `v-model:open`

### Query event

- `@update:query`, or `v-model:query` when the consumer wants to own the text

The old version of `MultiSelect` exposed no search event, so no alias is
needed.

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
  value: string | number
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

## Removed

Under [ADR-0008](./adr/0008-no-deprecated-members-in-1-0-0.md) these are
deleted rather than carried through `1.x` as aliases:

| Removed | Replacement |
| --- | --- |
| `#option` slot | `#item-label` (and `#item-prefix` for the icon half) |
| `compareFn` prop | none — selection is `option.value` against `modelValue` |
| `displayValue` slot prop | `#summary`'s `summary`, or `selectedOptions` |
| `clearAll` slot prop | `clear` |
| `toggleOpen` slot prop | `setOpen(boolean)` |

Nothing on `MultiSelect` is `@deprecated` today.

Not going anywhere:

- `hideSearch`
- `loading`
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
