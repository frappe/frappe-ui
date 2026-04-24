# Combobox Spec

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the exact public API for `Combobox`. It is a sub-spec of
[`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md) and
inherits the shared design rules from that document.

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

/** @deprecated alias for `align` */
type ComboboxPlacement = PopoverAlign

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
  value: string
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
  /** @deprecated use `slots` — function → `slots.item`; object → `slots` */
  render?: (() => VNode) | ItemSlots<ComboboxItemSlotProps>
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
interface ComboboxProps {
  modelValue?: string | null
  options?: ComboboxOption[]
  trigger?: 'input' | 'button'
  variant?: ComboboxVariant
  size?: ComboboxSize
  placeholder?: string
  disabled?: boolean
  id?: string
  open?: boolean
  openOnFocus?: boolean
  openOnClick?: boolean
  side?: PopoverSide
  align?: PopoverAlign
  offset?: number
  portalTo?: string | HTMLElement
  allowCustomValue?: boolean
  loading?: boolean
  emptyText?: string
  /** @deprecated alias for `align` */
  placement?: ComboboxPlacement
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
- `openOnFocus = false`
- `openOnClick = false`
- `side = 'bottom'`
- `align = 'start'`
- `offset = 4`
- `portalTo = 'body'`
- `allowCustomValue = false`
- `loading = false`
- `emptyText = 'No results'`

`id`, when provided, is forwarded to the focusable input element so a
`<label for="...">` associates correctly.

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

Positioning follows the shared popover positioning conventions in
[`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md).

Compatibility rules for `placement`:

- `placement` remains supported through `v1.x`
- if `placement` is provided without `align`, it is silently mapped
  one-to-one: `'start'` / `'center'` / `'end'` → same value on `align`
- if both `placement` and `align` are provided, `align` wins and a dev warning
  is emitted
- docs should show `align` in primary examples

State conventions:

- selected value uses `v-model` / `modelValue`
- menu visibility uses `v-model:open`
- query state stays internal; searchable components emit `update:query` but do
  not accept a `v-model:query` in v1
- `Combobox` does not accept a value prop for the input query directly

### Emits

```ts
interface ComboboxEmits {
  'update:modelValue': [value: string | null]
  'update:open': [value: boolean]
  'update:query': [value: string]
  'update:selectedOption': [
    option: ComboboxSelectableOption | ComboboxCustomOption | null,
  ]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  input: [value: string]
}
```

Custom-option context:

- `onClick` and `condition` on a `type: 'custom'` option receive an object
  context. In v1 the canonical field is `query`
- for backward compatibility, the context object also carries `searchTerm`
  with the same value through `v1.x`, so existing handlers destructuring
  `({ searchTerm })` continue to work unchanged
- `searchTerm` is marked deprecated in types; apps should migrate to
  `query`
- the two fields are always kept in sync; apps must not rely on only one of
  them being present

Emit rules:

- `update:modelValue` fires only when a regular selectable option is chosen, or
  when `allowCustomValue` is true and the free-form query becomes the value
- `update:open` fires on open/close transitions driven by user interaction or
  selection
- `update:query` fires on every user-driven change to the input query
- `input` is kept as a compatibility alias of `update:query` and should emit
  the same value; `update:query` is the preferred event
- `update:selectedOption` fires alongside `update:modelValue` with the resolved
  option object, or `null` when the selection is cleared
- custom options do **not** emit `update:modelValue`; they call their own
  `onClick({ query })` handler

### Slots

Guaranteed slot props:

```ts
type ComboboxTriggerSlotProps = {
  open: boolean
  disabled: boolean
  query: string
  selectedOption: ComboboxSelectableOption | null
  displayValue: string
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

- `#trigger="{ open, disabled, query, selectedOption, displayValue }"`
  - renders a custom button-like trigger in place of the default input
    shell. When present, `Combobox` moves the search input **into the
    popover header** instead of using the trigger as the input. Use this
    for assignee pickers, status pills, emoji reactions, and any other
    button-initiated search flow.
- `#prefix`
  - convenience slot rendered inside the default input shell, before the input
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
- `#footer`
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
- for selectable options, a case-insensitive substring match against `label`
  (and `value`) is used by default
- for custom options, `condition({ query })` is evaluated when present and
  controls visibility; if `condition` is absent, custom options match the same
  case-insensitive rule against `label`
- filtering is not applied when the popover just opened and the user has not
  yet typed, so the full list is shown with the current selection focused

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

- when `true` and no option matches the current query on commit, the free-form
  query itself is accepted as the value
- `update:modelValue` fires with the raw query string in that case
- custom options still take precedence over free-form acceptance when they
  match and are chosen explicitly

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
    Tailwind plugin (see the main RFC) — e.g. `icon: 'lucide-edit'`
  - Vue `Component` values render directly as `<component :is>`
  - other strings are ignored (back-compat with FeatherIcon strings
    is not provided here — consumers that need FeatherIcon should use
    the prefix slot explicitly)
- default label rendering is `label` plus optional `description`

## Disabled handling

Follows the shared disabled-option rule (shared design rule 8 in the main
RFC):

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

Rows follow the per-region precedence from shared design rule 9. For each
visible item:

Full row (if any of these provide a full-row renderer, per-region rendering
below is skipped):

1. `#item` slot
2. `item.slots.item` (or function-form legacy `item.render`)

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

Back-compat note:

- the old semantic where `type: 'custom'` options with a `render()` function
  replaced the row is preserved: a function-form `render` is aliased to
  `slots.item`, and an object-form `render` is aliased to `slots`
- existing code like `render: () => h(...)` continues to produce a full-row
  takeover

## Imperative API

`Combobox` should continue to expose:

```ts
interface ComboboxExposed {
  reset: () => void
}
```

Rules:

- `reset()` clears the query, clears the selected value, and emits
  `update:modelValue(null)` and `update:selectedOption(null)`
- `reset()` does not open or close the popover on its own

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

`Combobox` follows the shared popover motion conventions (shared design
rule 10 in the main RFC):

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
- `placement` (as an alias for `align`)
- `allowCustomValue`
- `update:selectedOption`
- `focus`
- `blur`
- `input`
- `slotName`
- `render`
- `type: 'custom'`
- `#prefix`
- current dynamic slot behavior for custom items
- imperative `reset()`

## Add / prefer

### Advanced state

- `v-model:open`

### Query event

- `@update:query` is the preferred event
- keep `@input` working as a compatibility alias in v1.x

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
  value: string
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

Preferred change here should be limited to:

- `slot` over `slotName`
- `query` over `searchTerm` in the custom option context

Keep these existing names as canonical because they already match broader
library convention:

- `onClick`
- `condition`

Dynamic custom item slots should be namespaced as:

- `#item-<slot>`

## Deprecate

Keep working, but deprecate in favor of the new names only where the change is
clearly worth it:

- `slotName` on custom options, in favor of `slot`
- `searchTerm` in custom-option context, in favor of `query`
- `input` event for query updates, in favor of `update:query`
- `render` on options, in favor of `slots` —
  - function-form `render` (full-row takeover) maps to `slots.item`
  - object-form `render` (`{ prefix, label, suffix, item }`) maps one-to-one
    to `slots`
- `placement` prop, in favor of `align`

Do not deprecate:

- `onClick`
- `condition`
- `type: 'custom'`
- imperative `reset()`

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

The old function-form `render` is aliased to `slots.item` and the old
object-form `render` is aliased one-to-one to `slots`, so existing code
continues to work unchanged through `v1.x`.
