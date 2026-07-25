# Combobox Spec

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the exact public API for `Combobox`. The rules it shares
with `Select` and `MultiSelect` — option shape, slot vocabulary, positioning,
motion, and styling hooks — are in [`selection.md`](./selection.md).

## Role

`Combobox` is the canonical searchable single-choice picker.

It should become the recommended path for new searchable single-select work.
Use `Combobox` when the UI needs:

- free-form typing combined with a filtered option list
- create-new actions driven by the current query
- single-select picking from a non-trivial list where scanning alone is not
  enough

If the UI is a small static value picker, use `Select`. If the UI is a menu of
actions, use `Dropdown`. If the UI needs multiple selected values, use
`MultiSelect`.

## Exact public API for v1

### Types

```ts
type ComboboxVariant = 'subtle' | 'outline' | 'ghost'
type ComboboxSize = 'sm' | 'md' | 'lg' | 'xl'

type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
type PopoverAlign = 'start' | 'center' | 'end'

/** Value accepted by a selectable option and by `v-model`. */
type ComboboxOptionValue = string | number

type SlotFn<TProps> = (props: TProps) => VNodeChild

interface ItemSlots<TProps> {
  prefix?: SlotFn<TProps>
  label?: SlotFn<TProps>
  suffix?: SlotFn<TProps>
  /** Full-row replacement; mutually exclusive with prefix/label/suffix */
  item?: SlotFn<TProps>
}

interface ComboboxSelectableOption {
  type?: 'option'
  label: string
  value: ComboboxOptionValue
  icon?: string | Component
  description?: string
  disabled?: boolean
  slot?: string
  slots?: ItemSlots<ComboboxItemSlotProps>
  [key: string]: any
}

interface ComboboxCustomOption {
  type: 'custom'
  key: string
  label: string
  icon?: string | Component
  description?: string
  disabled?: boolean
  slot?: string
  slots?: ItemSlots<ComboboxItemSlotProps>
  onClick: (context: { query: string }) => void
  keepOpen?: boolean
  condition?: (context: { query: string }) => boolean
  [key: string]: any
}

type ComboboxSimpleOption =
  | string
  | ComboboxSelectableOption
  | ComboboxCustomOption

interface ComboboxGroupedOption {
  key?: string | number
  group: string
  hideLabel?: boolean
  options: ComboboxSimpleOption[]
}

type ComboboxOption = ComboboxSimpleOption | ComboboxGroupedOption
```

Notes:

- `type: 'option'` is the default for selectable items and may be omitted
- `type: 'custom'` items are action-style rows driven by the current query
- app-defined extra fields on selectable options are allowed and passed through
  unchanged to slot props

### Props

```ts
// Extends `InputLabelingProps`: `label`, `description`, `error`, `required`, `id`.
interface ComboboxProps {
  modelValue?: ComboboxOptionValue | null
  options?: ComboboxOption[]
  trigger?: 'input' | 'button'
  variant?: ComboboxVariant
  size?: ComboboxSize
  placeholder?: string
  disabled?: boolean
  open?: boolean
  query?: string
  openOnFocus?: boolean
  openOnClick?: boolean
  side?: PopoverSide
  align?: PopoverAlign
  offset?: number
  portalTo?: string | HTMLElement
  allowCustomValue?: boolean
  loading?: boolean
  emptyText?: string
  hideSearch?: boolean
  filterable?: boolean
}
```

Defaults:

- `options = []`
- `trigger = 'input'`
- `variant = 'subtle'`
- `size = 'sm'`
- `placeholder = 'Select option'`
- `disabled = false`
- `open = false`
- `query = ''`
- `openOnFocus = false`
- `openOnClick = true`
- `side = 'bottom'`
- `align = 'start'`
- `offset = 4`
- `portalTo = 'body'`
- `allowCustomValue = false`
- `loading = false`
- `emptyText = 'No results'`
- `hideSearch = false`
- `filterable = true`

`id`, when provided, is forwarded to the focusable input element so a
`<label for="...">` associates correctly.

`hideSearch` removes the in-popover search row in `trigger="button"` mode; in
input mode the trigger *is* the search input, so the prop has nothing to hide.
`filterable="false"` turns off client-side query filtering for server-driven
option lists — see
[Search and filtering](./selection.md#search-and-filtering).

Loading behavior:

- when `loading` is `true`, the popover shows a loading indicator in place
  of the empty/result list, suspends `#empty`, and disables the create-new
  path for `allowCustomValue`

Trigger modes:

- `trigger = 'input'` (default): the trigger IS the search input. User
  types directly into it.
- `trigger = 'button'`: the trigger is a Button. The search input moves
  into the popover header and auto-focuses on open. The button's label
  is the selected option's `label` or the `placeholder`. The button's
  prefix resolves by priority:
    1. selected + consumer's `#item-prefix` slot → reused with the
       selected option, so the same slot that renders each row's prefix
       also renders the selected-state prefix
    2. selected + `selectedOption.icon` → rendered as a `<component>`
    3. no selection + consumer's `#prefix` slot → used as the
       placeholder prefix (e.g. a generic icon shown before anything is
       picked)
    4. nothing
  For richer custom triggers, use the `#trigger` slot directly.

Providing a `#trigger` slot implicitly activates button mode regardless
of the `trigger` prop value, since the caller is replacing the trigger
shell wholesale.

Positioning follows [Positioning](./selection.md#positioning).

State conventions:

- selected value uses `v-model` / `modelValue`
- menu visibility uses `v-model:open`
- search text uses `v-model:query`. Bound, the query belongs to the consumer
  and the component never resets it — not on open, not on close, not on mount.
  In `trigger="input"` mode it still follows the committed option's label,
  because there the input is the value display. Unbound, `trigger="button"`
  mode clears the search box every time the popover opens

### Emits

```ts
interface ComboboxEmits {
  'update:modelValue': [value: ComboboxOptionValue | null]
  'update:open': [value: boolean]
  'update:query': [value: string]
  'update:selectedOption': [
    option: ComboboxSelectableOption | ComboboxCustomOption | null,
  ]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}
```

Custom-option context:

- `onClick` and `condition` on a `type: 'custom'` option receive
  `{ query }` — the only field in the context

Emit rules:

- `update:modelValue` fires only when a regular selectable option is chosen, or
  when `allowCustomValue` is true and the free-form query becomes the value
- `update:open` fires on open/close transitions driven by user interaction or
  selection
- `update:query` fires on every user-driven change to the input query
- `update:selectedOption` fires alongside `update:modelValue` with the resolved
  option object, or `null` when the selection is cleared
- custom options do **not** emit `update:modelValue`; they call their own
  `onClick({ query })` handler

### Slots

Guaranteed slot props:

```ts
// `#trigger`, `#prefix`, `#suffix`, and `#footer` all receive the same shape.
// `selectedOption` is always `null` inside `#prefix` since the prefix slot only
// renders before a selection — the field is still exposed for symmetry.
type ComboboxControlSlotProps = {
  open: boolean
  disabled: boolean
  query: string
  selectedOption: ComboboxSelectableOption | null
  displayValue: string
  clear: () => void
  setOpen: (value: boolean) => void
}

type ComboboxSlotProps = ComboboxControlSlotProps
type ComboboxTriggerSlotProps = ComboboxControlSlotProps
type ComboboxPrefixSlotProps = ComboboxControlSlotProps
type ComboboxSuffixSlotProps = ComboboxControlSlotProps

// `#search-prefix` and `#search-suffix`, which live inside the in-popover
// search row and disappear with it when `hideSearch` is set.
type ComboboxSearchSlotProps = {
  query: string
  setQuery: (value: string) => void
  disabled: boolean
  focus: (options?: FocusOptions) => void
}

type ComboboxItemSlotProps = {
  item: ComboboxSelectableOption | ComboboxCustomOption
  query: string
  selected: boolean
}

type ComboboxGroupLabelSlotProps = {
  group: ComboboxGroupedOption
}

type ComboboxEmptySlotProps = {
  query: string
}
```

Supported slots:

- `#trigger="{ open, disabled, query, selectedOption, displayValue, clear, setOpen }"`
  - renders a custom button-like trigger in place of the default input
    shell. When present, `Combobox` moves the search input **into the
    popover header** instead of using the trigger as the input. Use this
    for assignee pickers, status pills, emoji reactions, and any other
    button-initiated search flow.
- `#prefix="{ ...ComboboxControlSlotProps }"`
  - convenience slot rendered inside the default input shell, before the input.
    Receives the same shape as `#trigger` and `#suffix`. `selectedOption` is
    always `null` here because the prefix only renders pre-selection
- `#suffix="{ ...ComboboxControlSlotProps }"`
  - convenience slot rendered after the input (input mode) or after the
    label (button mode). **Replaces the default chevron** when provided —
    render an explicit chevron fallback when your slot content is
    conditional. Typical use: an inline clear button. The slot's button
    should call `@click.stop` and `@pointerdown.stop` so the press does
    not toggle the popover
- `#search-prefix="{ query, setQuery, disabled, focus }"`
- `#search-suffix="{ query, setQuery, disabled, focus }"`
  - decorate the in-popover search row (button mode only). Both live inside
    that row, so `hideSearch` removes them along with it
- `#label="{ required }"` and `#description`
  - override the rendered labeling content
- `#item-prefix="{ item, query, selected }"`
  - custom leading content for the standard option row shell
- `#item-label="{ item, query, selected }"`
  - custom label region for the standard option row shell
- `#item-suffix="{ item, query, selected }"`
  - custom trailing content for the standard option row shell
- `#item="{ item, query, selected }"`
  - full-row escape hatch for a single item; replaces the standard row shell
- `#item-<slot>="{ item, query, selected }"`
  - dynamic named label slot selected via `item.slot`
- `#group-label="{ group }"`
  - optional custom group label rendering
- `#empty="{ query }"`
  - empty state rendered when the filtered result set is empty
- `#footer="{ ...ComboboxControlSlotProps }"`
  - rendered once after the option list, inside the popover

Exact slot rules:

- `#trigger` wins over the default input shell; when `#trigger` is used:
  - the caller-provided content is wrapped in the underlying primitive's
    trigger element, so it behaves as a real button (click / Enter /
    Space toggles the popover, `aria-expanded` is managed)
  - `#prefix` is ignored (it only applies inside the default input shell)
  - the search input is rendered at the top of the popover content and
    receives auto-focus on open so the user can start typing immediately
  - the popover does not constrain itself to the trigger's width
- if `item.slot` is set, it maps to `#item-<slot>` and overrides the label
  region only
- `#item-label` is the preferred label-region slot and is used as the fallback
  when no matching `#item-<slot>` exists
- `#item-prefix` and `#item-suffix` customize only those regions of the standard
  option row shell
- `#item-suffix` renders before the built-in selected checkmark indicator
- `#item` is a per-row escape hatch and, when used, fully replaces the standard
  row shell for that row
- `#empty` receives the current query so create-new prompts can be rendered in
  the empty state if desired
- custom options may provide a `slots.item` function on the option itself as
  an alternative to slots; template slots take precedence when both are
  present

## Option normalization and behavior

Normalization rules:

- string options normalize to `{ type: 'option', label: option, value: option }`
- nullish entries in `options` are ignored
- selectable options with missing or `undefined` `value` are omitted
- grouped entries with empty `options` after filtering are omitted
- each custom option keeps its original `key`; each selectable option is keyed
  by its `value`

Filtering rules:

- filtering is internal to `Combobox` and is based on the current query
- `filterable="false"` switches query filtering off entirely, for options that
  come back already matched from a server search
- for selectable options, a case-insensitive substring match against `label`
  (and `value`) is used by default
- for custom options, `condition({ query })` is evaluated when present and
  controls visibility; if `condition` is absent, custom options match the same
  case-insensitive rule against `label`
- `condition` is **authoritative**: it is consulted even before the user
  has typed since opening, so a `type: 'custom'` row can fully gate its
  own visibility (e.g. "show only when the typed query is non-empty and
  doesn't already match an existing option"). The `query` passed in is
  the typed-since-open query — empty when the user hasn't typed yet
- the "show the full list before the user has typed" bypass applies only
  to selectable options; custom options always go through `condition`

Selection behavior:

- selecting an enabled selectable option:
  - updates `modelValue` to the option's `value`
  - emits `update:modelValue` and `update:selectedOption`
  - closes the popover via select semantics
- selecting a custom option:
  - calls `onClick({ query })` with the last user-typed query
  - does **not** emit `update:modelValue`
  - keeps the popover open if `keepOpen` is true; otherwise closes it
- disabled options (selectable or custom) are not selectable and are skipped by
  keyboard navigation
- when the query is cleared to empty by the user, the current selection is
  cleared and `update:modelValue` fires with `null`

`allowCustomValue` behavior:

`allowCustomValue` is the **free-form acceptance** flag — it lets the combobox
behave like a text input with autocomplete, where any typed-or-programmatically-set
string is a valid model value.

- when `true` and no option matches the current query on commit, the free-form
  query itself is accepted as the value
- `update:modelValue` fires with the raw query string in that case
- external `modelValue` updates with unknown strings are preserved; without
  `allowCustomValue`, an unmatched external value is dropped
- the combobox also renders a built-in "Create X" row as a click affordance
  when typing has no matches
- custom options still take precedence over free-form acceptance when they
  match and are chosen explicitly

For **richer create-new UX** — custom label, icon, persistence callback, or
"create only when the query isn't already a known value" — prefer a
`type: 'custom'` option with `condition` (see the Create New story). The two
mechanisms are independent and can be combined.

Display rules:

- when an option matches `modelValue`, the input shows its `label` by default
- when no option matches but a raw value is set (via `allowCustomValue`), the
  input shows the raw value
- otherwise the input shows the placeholder
- `displayValue` exposed to `#trigger` is the resolved display string or `''`
- `selectedOption` exposed to `#trigger` is the resolved selectable option or
  `null`; custom options never appear as `selectedOption`

Row behavior:

- option rows should use the shared `ItemListRow` shell
- selectable option rows render a built-in trailing checkmark indicator when
  their `value === modelValue`
- custom option rows do not render a checkmark
- `item.icon` is auto-rendered in the prefix region when no consumer
  slot (`#item-prefix` or `item.slots.prefix`) overrides it:
  - strings starting with `lucide-` render through the shared Lucide
    Tailwind plugin — e.g. `icon: 'lucide-edit'`. Write the class out in
    full; a name built at runtime is invisible to Tailwind's scanner
  - Vue `Component` values render directly as `<component :is>`
  - other strings are ignored (back-compat with FeatherIcon strings
    is not provided here — consumers that need FeatherIcon should use
    the prefix slot explicitly)
- default label rendering is `label` plus optional `description`

## Disabled handling

Follows the family rule in
[Disabled, loading, and empty](./selection.md#disabled-loading-and-empty):

- disabled selectable options are skipped by keyboard navigation and
  typeahead
- disabled custom options are skipped too, even if their `condition`
  returns `true`
- disabled options cannot be selected by click or keyboard
- disabled options never emit `update:modelValue` or
  `update:selectedOption`, and disabled custom options never invoke
  `onClick`
- a disabled option is never used as the `allowCustomValue` target
- disabled options apply `ItemListRow` disabled styling and `data-disabled`

## Rendering precedence

Rows follow the per-region precedence in
[Customizing rows](./selection.md#customizing-rows). For each visible item:

Full row (if any of these provide a full-row renderer, per-region rendering
below is skipped):

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
3. default: built-in selected checkmark indicator for selectable options;
   empty for custom options

## Imperative API

A template ref on `Combobox` gives back the family's shared shape:

```ts
interface SelectionExposed {
  clear: () => void
  focus: (options?: FocusOptions) => void
}
```

Rules:

- `clear()` clears the selected value and the query together, and emits
  `update:modelValue(null)` and `update:selectedOption(null)`
- `clear()` does not open or close the popover on its own
- `focus()` moves focus to the trigger input in input mode; in button mode it
  prefers the mounted in-popover search input and falls back to the trigger

## Styling hooks

Stable hooks for `Combobox` should include:

- `data-slot="trigger"`
- `data-slot="input"`
- `data-slot="content"`
- `data-slot="group"`
- `data-slot="group-label"`
- `data-slot="item"`
- `data-slot="empty"`
- `data-slot="footer"`
- `data-variant`
- `data-size`

Combobox rows should use `ItemListRow`, which provides:

- `data-slot="item-list-row"`
- `data-slot="item-prefix"`
- `data-slot="item-label"`
- `data-slot="item-suffix"`

State hooks should include, where relevant:

- `data-state="open|closed"` on trigger/content via the combobox primitive
- `data-state="checked|unchecked"` on selectable option rows
- `data-disabled`
- row-level selected styling inherited from `ItemListRow`

## Motion

`Combobox` follows the family's [Motion](./selection.md#motion) rules:

- content scales in from the trigger via
  `transform-origin: var(--reka-combobox-content-transform-origin)` on the
  animated element (the inner content-body, not the outer positioned wrapper)
- enter `180ms` / exit `140ms` with `cubic-bezier(0.23, 1, 0.32, 1)`, from
  `scale(0.97)` + `translateY(2px)` + `opacity: 0`
- keyboard-driven opens — typing, Enter, Space, ArrowUp, ArrowDown on the
  trigger, or tab-focus with `openOnFocus` — skip the animation entirely
- pointer-driven opens (click / tap) play the full animation
- classification is pointer-recency based: the component records the
  timestamp of each `pointerdown` on the trigger, and an open transition
  counts as pointer-driven only if a `pointerdown` fired within ~300ms
  before it; everything else (including tab-focus) defaults to keyboard.
  The resolved mode is exposed as `data-motion="animated" | "instant"` on
  the content-body
- `prefers-reduced-motion: reduce` disables the content animation and the
  chevron rotation

## Accessibility and semantics

`Combobox` should follow the ARIA combobox pattern (single-select, with
listbox popup).

That means:

- the input has `role="combobox"` with appropriate `aria-expanded`,
  `aria-controls`, and `aria-activedescendant` attributes
- the listbox exposes `role="listbox"` and items expose `role="option"`
- keyboard navigation (arrow keys, home/end, typeahead), escape handling, and
  active-descendant management are delegated to the underlying combobox
  primitive
- escape closes the popover without clearing the current value
- the query and the committed value are distinct: typing updates the query,
  only explicit selection (or `allowCustomValue` acceptance) updates the value

## Keep supported in v1.x

Current API stays supported:

- `v-model`
- `variant`
- `options`
- `placeholder`
- `disabled`
- `openOnFocus`
- `openOnClick`
- `allowCustomValue`
- `update:selectedOption`
- `focus`
- `blur`
- `type: 'custom'`
- `#prefix`
- current dynamic slot behavior for custom items

## Add / prefer

### Advanced state

- `v-model:open`

### Query event

- `@update:query`, or `v-model:query` when the consumer wants to own the text

### Preferred trigger API

- `#trigger`
- keep `#prefix` as a convenience slot

### Preferred item slots

- `#item-prefix`
- `#item-label`
- `#item-suffix`
- `#empty`
- `#footer`
- `#item` as the full takeover escape hatch

### Preferred item schema

Simple selectable items can keep their current shape, but richer object items
should converge on:

```ts
{
  label: string
  value: ComboboxOptionValue
  icon?: string | Component
  description?: string
  disabled?: boolean
  slot?: string
}
```

For custom action-style rows, keep the current capability and preserve the
existing naming convention:

```ts
{
  type: 'custom'
  key: string
  label: string
  icon?: string | Component
  disabled?: boolean
  slot?: string
  onClick?: (context: { query: string }) => void
  keepOpen?: boolean
  condition?: (context: { query: string }) => boolean
  slots?: ItemSlots<ComboboxItemSlotProps>
}
```

`onClick` and `condition` keep their names — they already match broader
library convention.

Dynamic custom item slots are namespaced as:

- `#item-<slot>`

## Removed

Under [ADR-0008](./adr/0008-no-deprecated-members-in-1-0-0.md) these are
deleted rather than carried through `1.x` as aliases:

| Removed | Replacement |
| --- | --- |
| `slotName` on custom options | `slot` |
| `searchTerm` in custom-option context | `query` |
| `input` emit | `update:query` |
| `render` on options | `slots` — function form → `slots.item`, object form → `slots` |
| `placement` prop (and `ComboboxPlacement`) | `align` |
| imperative `reset()` | `clear()` from `SelectionExposed` |

Nothing on `Combobox` is `@deprecated` today.

## Migration path

### Custom option: old

```ts
{
  type: 'custom',
  key: 'create-new',
  label: 'Create new',
  slotName: 'create-new',
  onClick: ({ searchTerm }) => createItem(searchTerm),
  condition: ({ searchTerm }) => Boolean(searchTerm),
}
```

```vue
<Combobox v-model="value" :options="options">
  <template #create-new="{ option, searchTerm }">
    Create "{{ searchTerm }}"
  </template>
</Combobox>
```

### Custom option: new

```ts
{
  type: 'custom',
  key: 'create-new',
  label: 'Create new',
  slot: 'create-new',
  onClick: ({ query }) => createItem(query),
  condition: ({ query }) => Boolean(query),
}
```

```vue
<Combobox
  v-model="value"
  :options="options"
  @update:query="query = $event"
>
  <template #item-create-new="{ item, query }">
    Create "{{ query }}"
  </template>
</Combobox>
```

### Query event migration

Old:

```vue
<Combobox @input="onQueryChange" />
```

New:

```vue
<Combobox @update:query="onQueryChange" />
```

### Standard item customization migration

Old (function-form `render` takes over the entire row, skipping the shell):

```ts
{
  label: 'John Doe',
  value: 'john',
  render: () => h('div', { class: 'flex items-center gap-2' }, [
    h(Avatar, { image: '/john.png' }),
    h('span', 'John Doe'),
  ]),
}
```

New, template-first (shell-owned rows with focused slots):

```vue
<Combobox v-model="user" :options="users">
  <template #item-prefix="{ item }">
    <Avatar :image="item.image" class="size-4" />
  </template>

  <template #item-label="{ item }">
    {{ item.label }}
  </template>
</Combobox>
```

New, JS-authored (shell-owned rows with per-region `slots`, for cases
where no template is available):

```ts
import { h } from 'vue'
import Avatar from '@/components/Avatar.vue'

const users = fetchedUsers.map((user) => ({
  label: user.name,
  value: user.id,
  slots: {
    prefix: ({ item }) =>
      h(Avatar, { image: item.image, class: 'size-4' }),
  },
}))
```

Full-row takeover still available via `slots.item` when the shell is not
wanted:

```ts
{
  label: 'John Doe',
  value: 'john',
  slots: {
    item: () => h('div', { class: 'flex items-center gap-2' }, [
      h(Avatar, { image: '/john.png' }),
      h('span', 'John Doe'),
    ]),
  },
}
```

`render` is gone. Function-form `render` becomes `slots.item`; object-form
`render` becomes `slots` one-to-one.

## Changelog

### 2026-05-17

- **Added `#suffix` slot.** Rendered after the input (input mode) or label
  (button mode). Providing the slot replaces the default chevron — consumers
  render their own fallback for the unselected/closed state. Canonical use
  is an inline clear button; the slot's button must `stopPropagation` on
  `click` and `pointerdown` so the press does not toggle the popover.

- **`condition` is now authoritative for custom rows.** A `type: 'custom'`
  row's `condition({ query })` is consulted even before the user types
  since opening, so it can fully gate its own visibility based on selection
  state and the typed query. Selectable rows are unchanged — they still
  skip query filtering until the user types.

- **Decided against a dedicated `clearable` prop (#658).** The `#suffix`
  slot plus `v-model` already cover the clear-button pattern with no
  loss of expressiveness. The story at `stories/Clearable.vue` is the
  canonical example.

- **Decided against a dedicated `createOption` prop (#661).** The
  existing `type: 'custom'` option shape, combined with the authoritative
  `condition`, expresses the "create new" pattern in ~15 lines of consumer
  code. A `createOption` prop would be pure sugar over the same primitive.
  The story at `stories/CreateNew.vue` is the canonical example.

- **`#659` deferred.** Suppressing the popover-header search input when
  `#trigger` already contains an input still requires a Combobox-level
  change (a `hideSearchInput` prop or similar). Will revisit when a
  concrete consumer needs it.

- **Slot-prop symmetry across `#trigger` / `#prefix` / `#suffix`.** All
  three slots now receive the same shape (`ComboboxSlotProps`). `#prefix`
  previously received no props; it now gets `{ open, disabled, query,
  selectedOption, displayValue }` for parity. `selectedOption` is always
  `null` inside `#prefix` because the prefix only renders pre-selection,
  but the field is exposed for symmetry. The matching change was made on
  `MultiSelect` (added `query` to `#trigger`; aligned `#suffix`) and
  `Select` (added the shared shape to `#prefix` / `#suffix`).

- **`allowCustomValue` reframed as the free-form-acceptance flag.** The
  prop docs and spec now lead with its distinctive behavior — accepting
  arbitrary typed-or-set strings into the model — rather than the
  "creatable option" framing. For richer create-new UX, prefer
  `type: 'custom'` with `condition` (Create New story). The two are
  independent.

### 2026-04-24

- **Added `trigger="button"` mode.** When `trigger="button"`, the combobox
  renders a Button-shaped trigger instead of a bare input. The closed state
  shows the selected label (or placeholder); opening swaps the face for an
  input. Keyboard focus and native tab order work as expected. Useful for
  pickers that should not look like a text field when closed.

- **`item.icon` is auto-rendered in the prefix region.** Setting `icon` on an
  option now shows that icon automatically — no `#item-prefix` slot needed for
  the common case. Precedence: `#item-prefix` slot → `item.slots.prefix` →
  `item.icon` → empty. Existing prefix slots are unaffected.

- **`item.icon` accepts `lucide-*` strings.** Pass `icon: 'lucide-user-plus'`
  directly in an item definition — rendered via the Tailwind CSS-mask plugin,
  no import needed. Component values also work.
