# Selection and Menu API RFC

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the intended public API direction for:

- `ItemList`
- `ItemListRow`
- `Dropdown`
- `Select`
- `Combobox`
- `MultiSelect`

It is based on:

- the v1 component philosophy
- the real-world usage audit in
  [`research/07-real-world-component-usage-audit.md`](./research/07-real-world-component-usage-audit.md)
- the decision to prefer higher-level components with props and slots over
  publicly exposing compound primitive families

This RFC is meant to guide v1 implementation and cleanup. It does not authorize
breaking removals in `1.0.0`.

## Decision summary

- add `ItemList` as the shared styled list surface for option and menu rows
- add `ItemListRow` as the shared row shell for item rendering
- keep `Dropdown`, `Select`, `Combobox`, and `MultiSelect` as separate
  higher-level components with clear boundaries
- treat `Dropdown` as an action menu, not as the generic value picker
- standardize on shell-owned item customization
- standardize slot vocabulary around `#trigger`, `#item-prefix`, `#item-label`,
  `#item-suffix`, `#empty`, and `#footer`
- support `v-model:open` across the family
- keep query internal for now, but standardize on `@update:query`
- keep older APIs working in v1.x, but move weaker customization patterns out of
  the happy path
- keep `onClick` and `condition` as canonical naming where they already match
  library convention

## Goals

- keep these components separate and narrowly scoped
- make app usage easier and more consistent
- avoid breaking existing apps during `1.x`
- aggressively deprecate awkward customization APIs when a better replacement
  exists
- standardize slot vocabulary, state vocabulary, and styling hooks
- keep the component shell responsible for spacing, hover, selected, disabled,
  and layout states
- reuse one styled list foundation across selection and menu components instead
  of duplicating row markup and classes

## Non-goals

- collapsing all pickers into a single do-everything component
- exposing a broad set of low-level primitive families as the primary public API
- removing legacy APIs immediately in v1
- solving every richer people-picker or chip-input use case inside the base
  `MultiSelect`

## Component responsibilities

These boundaries should stay clear.

- `ItemList` = the shared styled list surface for option and menu rows
- `ItemListRow` = the shared row shell for item rendering
- `Dropdown` = action menus
- `Select` = small static choice lists
- `Combobox` = searchable single-choice picker
- `MultiSelect` = searchable multi-choice picker

This means:

- `ItemList` is the reusable base layer, not the default recommendation for
  ordinary app code
- do not grow `Dropdown` into a value picker
- do not treat `Select` as the searchable story
- do not keep `Autocomplete` as the long-term canonical public API once
  `Combobox` and `MultiSelect` are good enough

## Shared design rules

### 1. State conventions

Across this family:

- primary value uses `v-model` / `modelValue`
- visibility uses `v-model:open`
- secondary state gets named models only when really needed

For v1:

- `Dropdown` should support `v-model:open`
- `Select` should support `v-model:open`
- `Combobox` should support `v-model:open`
- `MultiSelect` should support `v-model:open`
- query stays internal for now
- searchable components may emit `update:query`, but should not require
  `v-model:query`

### 2. Trigger customization vocabulary

Use one advanced trigger slot name across this family where a trigger exists:

- `#trigger`

`ItemList` itself does not need a trigger. It is the content/list layer.

Slot props should be component-specific but predictable. At minimum:

- `open`
- `disabled`

Where relevant, also expose:

- `selectedOption`
- `selectedOptions`
- `displayValue`
- `toggleOpen`
- `close`

Compatibility aliases can remain:

- `Dropdown` keeps its current default slot behavior as a supported trigger API
  in `v1.x`
- `Select`, `Combobox`, and `MultiSelect` can keep convenience slots like
  `#prefix` and `#suffix`

`#trigger` should remain the consistent explicit slot name across the family,
but `Dropdown` should also continue to support and document the default slot for
trigger-only customization because it is a common and ergonomic use case.

### 3. Shell-owned item customization

This is the most important API decision.

`ItemList` should be the place where this shell is defined once and reused.

The component should own the item shell, including:

- spacing
- row height
- hover styling
- active styling
- selected styling
- disabled styling
- icon/check/suffix layout regions

Consumers should customize content through shared sub-slots instead of
rebuilding the whole row.

Preferred shared item slots:

- `#item-prefix`
- `#item-label`
- `#item-suffix`
- `#empty`
- `#footer`

Escape hatch:

- `#item`

`#item` should remain supported, but it should be clearly documented as an
escape hatch because it forces the consumer to own the full row shell.

### 4. Styling hooks

Owned shells should expose stable hooks:

- `data-slot="trigger"`
- `data-slot="content"`
- `data-slot="item"`
- `data-slot="item-prefix"`
- `data-slot="item-label"`
- `data-slot="item-suffix"`
- `data-slot="empty"`
- `data-slot="footer"`

And state hooks where relevant:

- `data-state="open|closed"`
- `data-state="active|inactive"`
- `data-state="checked|unchecked"`
- `data-disabled`
- `data-variant`
- `data-size`

These hooks should reduce the need for shell replacement just to change classes.

### 5. Shared item object direction

The option model does not need to become identical across all four components,
but it should converge where practical.

Common fields we should allow where they make sense:

```ts
{
  label: string
  value?: string | number | boolean
  disabled?: boolean
  icon?: string | Component
  description?: string
  slot?: string
}
```

Notes:

- `slot` should be the preferred field for alternate item rendering strategies
- `slot` should map to `#item-<slot>`
- old names like `slotName` should be deprecated in favor of `slot`

### 6. Escape hatches stay, but move out of the happy path

These remain supported in v1.x, but should be documented as advanced or
deprecated depending on the component:

- direct `ItemList` usage for advanced cases

- full `#item` takeover
- per-item `component`
- per-item `render`
- old per-item custom slot fields like `slotName`

The better API should be:

- shell-owned rows
- focused sub-slots
- predictable state and styling hooks

### 7. Deprecation policy for this family

For v1.x:

- do not break existing public APIs
- add the new preferred APIs first
- keep older APIs exported and functioning
- add dev warnings where detection is practical and low-noise
- move older APIs out of the main docs path

Good candidates for deprecation warnings:

- `Combobox` custom items using `slotName`
- `Combobox` query listeners using `input` instead of `update:query`
- `Dropdown` items using `component` for ordinary row customization
- `Select` / `MultiSelect` usage of `#option` once `#item-label` exists

Harder-to-warn cases like `Dropdown #item` can be deprecated in docs first.

---

## ItemList proposed spec

### Role

`ItemList` is the shared styled list surface behind menu rows and option rows.

It should be used internally by:

- `Dropdown`
- `Select`
- `Combobox`
- `MultiSelect`

It should also be public for advanced app code that needs custom layout around
the list but still wants the shared row styling, grouping, empty state, and slot
model.

`ItemListRow` is the single-row shell used by `ItemList` and by higher-level
components that need the same row presentation.

### Scope

`ItemList` is not responsible for:

- trigger rendering
- popover or dropdown positioning
- search input behavior
- fetching data
- value ownership
- form semantics
- routing semantics
- menu semantics

It is responsible for:

- rendering grouped and ungrouped lists
- rendering a consistent item row shell by default
- rendering empty and footer regions
- exposing item customization through focused sub-slots
- exposing stable layout and state hooks
- emitting click intent for enabled items

`ItemListRow` is responsible for:

- spacing
- alignment
- prefix / label / suffix regions
- active / selected / disabled presentation
- row-level styling hooks

### Exact public API for v1

#### Shared types

```ts
type ItemListSize = 'sm' | 'md' | 'lg' | 'xl'

interface ItemListItem {
  label?: string
  value?: string | number | boolean
  icon?: string | Component
  description?: string
  disabled?: boolean
  selected?: boolean
  active?: boolean
  slot?: string
  [key: string]: any
}

interface ItemListGroup<TItem extends ItemListItem = ItemListItem> {
  key?: string | number
  group?: string
  hideLabel?: boolean
  items: TItem[]
}
```

#### ItemList props

```ts
interface ItemListProps<TItem extends ItemListItem = ItemListItem> {
  items?: TItem[]
  groups?: Array<ItemListGroup<TItem>>
  size?: ItemListSize
  emptyText?: string
}
```

Defaults:

- `items = []`
- `groups = []`
- `size = 'sm'`
- `emptyText = 'No items'`

Rules:

- `ItemList` does not expose `v-model`
- `ItemList` does not own selected state; `selected` is input data only
- `ItemList` does not own active state; `active` is input data only
- explicit `groups` is the grouped API for `ItemList`; higher-level components
  may accept mixed item/group arrays and normalize them before rendering
- if `groups.length > 0`, grouped rendering is used and `items` is ignored
- if `groups.length === 0`, `items` is rendered as one implicit unlabeled group

#### ItemList emits

```ts
interface ItemListEmits<TItem extends ItemListItem = ItemListItem> {
  'item-click': [item: TItem]
}
```

Rules:

- `item-click` fires only for enabled items
- clicking a disabled item does nothing
- `item-click` does not mutate `selected` or `active`

#### ItemList slots

```ts
type ItemListItemSlotProps<TItem extends ItemListItem = ItemListItem> = {
  item: TItem
  group: ItemListGroup<TItem>
}

type ItemListGroupSlotProps<TItem extends ItemListItem = ItemListItem> = {
  group: ItemListGroup<TItem>
}
```

Supported slots:

- `#item-prefix="{ item, group }"`
- `#item-label="{ item, group }"`
- `#item-suffix="{ item, group }"`
- `#item="{ item, group }"`
- `#item-<slot>="{ item, group }"`
- `#group-label="{ group }"`
- `#empty`
- `#footer`

Exact slot rules:

- `#item` replaces the standard `ItemListRow` rendering for every item
- `#item` is an escape hatch; when used, `#item-prefix`, `#item-label`,
  `#item-suffix`, and `#item-<slot>` are not used
- `item.slot` maps to `#item-<slot>`
- `#item-<slot>` overrides the label region only
- `#item-label` is the fallback label-region customization when no matching
  `#item-<slot>` exists
- `#item-prefix` and `#item-suffix` customize only those regions of the standard
  row shell
- `#group-label` overrides the default group label text
- `#empty` is rendered when there are no visible items after normalization
- `#footer` is rendered once after the list content

#### ItemList rendering and behavior

Normalization rules:

- explicit groups with empty `items` are omitted
- implicit ungrouped items are wrapped in a group with `hideLabel = true`
- if no groups remain after normalization, render the empty region

Default row behavior:

- each item renders inside a component-owned clickable wrapper
- enabled items emit `item-click` on click
- disabled items set `disabled` on the clickable wrapper and emit nothing
- default label rendering is `label` plus optional `description`
- `item.icon` is allowed in the item shape but is **not** rendered by `ItemList`
  by default; consumers should use `#item-prefix` if they want icon rendering
- `ItemList` does **not** render a built-in checkmark; selection-specific
  affordances belong in higher-level components or `#item-suffix`

State rules:

- `selected` affects row styling only
- `active` affects row styling only
- `ItemList` does not implement menu roving-focus or picker semantics in v1
- keyboard semantics beyond native focus/click are the responsibility of the
  higher-level container component

#### ItemList styling hooks

`ItemList` should expose these stable hooks:

- `data-slot="item-list"`
- `data-slot="group"`
- `data-slot="group-label"`
- `data-slot="item"`
- `data-slot="empty"`
- `data-slot="footer"`
- `data-size`

Each item wrapper should expose:

- `data-slot="item"`
- `data-state="active|inactive"`
- `data-disabled`
- `data-size`

The standard row shell should come from `ItemListRow`, which exposes:

- `data-slot="item-list-row"`
- `data-slot="item-prefix"`
- `data-slot="item-label"`
- `data-slot="item-suffix"`

### ItemListRow exact public API for v1

#### Props

```ts
interface ItemListRowProps {
  as?: string | Component
  size?: ItemListSize
  active?: boolean
  selected?: boolean
  disabled?: boolean
}
```

Defaults:

- `as = 'div'`
- `size = 'sm'`
- `active = false`
- `selected = false`
- `disabled = false`

#### Slots

- default slot
- `#prefix`
- `#label`
- `#suffix`

Rules:

- `#label` overrides the default slot for the label region
- prefix and suffix regions are omitted when they have no renderable content
- `selected` and `active` share the same emphasized visual treatment in v1
- `disabled` applies muted text and not-allowed cursor styling

#### Styling hooks

`ItemListRow` should expose:

- `data-slot="item-list-row"`
- `data-slot="item-prefix"`
- `data-slot="item-label"`
- `data-slot="item-suffix"`
- `data-size`
- `data-state="active|inactive"`
- `data-disabled`

### Relationship to the higher-level components

- `Dropdown` should compose `ItemList` / `ItemListRow` for action rows
- `Select` should compose `ItemList` / `ItemListRow` for option rows
- `Combobox` should compose `ItemList` / `ItemListRow` for search results rows
- `MultiSelect` should compose `ItemList` / `ItemListRow` for multi-select
  option rows

This is the key architectural decision for this family.

### v1 stance

`ItemList` and `ItemListRow` should both be public in v1.

They are intentionally advanced APIs, but they are worth exposing because:

- the styling is shared
- the structure is shared
- advanced app cases clearly exist
- higher-level components can build on them without duplicating row markup
- app authors should not have to rebuild the shell to get the design system
  behavior

---

## Dropdown proposed spec

### Role

`Dropdown` is the action menu component.

It should continue to support:

- simple action lists
- grouped actions
- submenus
- switch/toggle rows
- route-based actions
- occasional advanced custom rows
- menu-style “choose one of a few actions” cases where the app marks the current
  choice

Important boundary:

- if the UI is semantically choosing a form value or picker value, use `Select`
- if the UI is a menu of actions or view/filter/sort modes and one is currently
  active, `Dropdown` is still acceptable

So `Dropdown` can support checkmarks and active menu items, but it should not
become the generic replacement for `Select`.

### Exact public API for v1

#### Props

```ts
type DropdownPlacement = 'left' | 'center' | 'right'
type DropdownSide = 'top' | 'right' | 'bottom' | 'left'

interface DropdownProps {
  button?: ButtonProps
  options?: DropdownOptions
  open?: boolean
  placement?: DropdownPlacement
  side?: DropdownSide
  offset?: number
  portalTo?: string | HTMLElement
}
```

Defaults:

- `options = []`
- `open = false`
- `placement = 'left'`
- `side = 'bottom'`
- `offset = 4`
- `portalTo = 'body'`

State conventions:

- visibility is controlled with `v-model:open`
- `Dropdown` does **not** expose `v-model` for a selected value
- `Dropdown` does **not** own query state

`button` is only used when no custom trigger slot is provided.

#### Emits

```ts
interface DropdownEmits {
  'update:open': [value: boolean]
}
```

There is no component-level `select` event in v1. Action handling stays
item-owned through `route` and `onClick`.

#### Slots

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

### Exact option shape for v1

```ts
type DropdownTheme = 'gray' | 'red'

interface DropdownBaseOption {
  icon?: string | Component | null
  description?: string
  selected?: boolean
  disabled?: boolean
  theme?: DropdownTheme
  slot?: string
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
  items: DropdownOption[]
}

type DropdownOption =
  | DropdownActionOption
  | DropdownSwitchOption
  | DropdownSubmenuOption
  | DropdownComponentOption

type DropdownOptions = Array<DropdownOption | DropdownGroupOption>
```

Notes:

- `label` is required for every standard action, switch, and submenu row
- `label` is optional only for `component` escape-hatch rows
- `submenu`, `switch`, and `component` are mutually exclusive item modes
- app-defined extra fields like `value`, `id`, `image`, `shortcut`, and
  analytics metadata are allowed and must be passed through unchanged to slot
  props
- `slot` is the preferred name for dynamic label slot selection
- keep `onClick` and `condition` as canonical names

### Rendering and behavior rules

#### Grouping and visibility

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

#### Trigger behavior

- if `#trigger` is provided, use it
- else if the default slot is provided, use it as the compatibility trigger slot
- else render the generated `Button` from `button`
- trigger disabled state is derived from `button.disabled` or a forwarded
  `disabled` attribute

#### Item behavior

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

#### Rendering precedence

For each visible item:

1. if `item.submenu` exists, render a submenu row
2. else if `item.switch === true`, render a switch row
3. else if `#item` exists, render the full-row escape hatch
4. else if `item.component` exists, render the exceptional custom component row
5. else render the standard shell-owned row with `#item-prefix`, `#item-label`,
   `#item-suffix`, and `#item-<slot>` support

For standard shell-owned rows:

- use `item.slot` to map to `#item-<slot>` before falling back to `#item-label`
- default label rendering is `label` plus optional `description`
- default prefix rendering is `icon` plus group-level alignment placeholder
  behavior
- default suffix rendering is empty for leaf action rows

### Styling hooks

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

### Accessibility and semantics

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

### Keep supported in v1.x

These stay supported:

- `button`
- `options`
- `placement`
- `side`
- `offset`
- `portalTo`
- grouped items
- `submenu`
- `switch`
- `switchValue`
- `component`
- `#item`
- current default trigger slot behavior

### Deprecate

Keep working, but deprecate for ordinary row customization:

- `#item` as the default recommendation
- `item.component` for normal icon/label/check/suffix customization

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

### Migration path

#### Old

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

#### New

```vue
<Dropdown :options="items">
  <template #item-suffix="{ item }">
    <LucideCheck v-if="item.selected" class="size-4" />
  </template>
</Dropdown>
```

#### Old exceptional custom row

```ts
{
  label: 'Delete',
  component: h(Button, { ... })
}
```

#### v1.x stance

Still supported. Keep it for exceptional content, but do not recommend it for
normal icon/label/check/suffix customization.

---

## Select proposed spec

### Role

`Select` is the simple single-choice picker for small static lists.

It should stay narrow:

- single selection only
- local static options
- no search input
- no action-menu semantics
- no grouped option support in v1

If the UI needs search, use `Combobox`. If the UI is choosing actions, use
`Dropdown`.

### Exact public API for v1

#### Types

```ts
type SelectOptionValue = string | number | bigint | Record<string, any>

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

interface SelectProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'subtle' | 'outline' | 'ghost'
  placeholder?: string
  disabled?: boolean
  id?: string
  modelValue?: SelectOptionValue
  open?: boolean
  options?: SelectOption[]
}
```

Defaults:

- `size = 'sm'`
- `variant = 'subtle'`
- `placeholder = 'Select option'`
- `open = false`
- `options = []`

State conventions:

- selected value uses `v-model` / `modelValue`
- menu visibility uses `v-model:open`
- `Select` does not own query state
- `Select` accepts flat options only in v1

#### Emits

```ts
interface SelectEmits {
  'update:modelValue': [value: SelectOptionValue | undefined]
  'update:open': [value: boolean]
}
```

There is no separate component-level `select` event in v1.

#### Slots

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

### Option normalization and behavior

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

### Styling hooks

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

### Accessibility and semantics

`Select` should follow the select/listbox pattern, not the menu button pattern.

That means:

- trigger and content use select semantics
- items are options, not actions
- keyboard navigation, typeahead, highlighted state, and selection behavior are
  delegated to the underlying select primitive
- selected state is semantic component state, not just visual decoration

### Keep supported in v1.x

These stay supported:

- `v-model`
- `v-model:open`
- `size`
- `variant`
- `placeholder`
- `disabled`
- `id`
- `options`
- `#trigger`
- `#prefix`
- `#suffix`
- `#option`
- `#footer`
- string options

### Deprecate

Keep working, but deprecate for ordinary customization:

- `#option` as the primary documented customization API once `#item-label`
  exists

`#option` should remain as an alias/fallback for the label region through
`v1.x`.

### Migration path

#### Old

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

#### New

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

---

## Combobox proposed spec

### Role

`Combobox` is the canonical searchable single-choice picker.

It should become the recommended path for new searchable single-select work.

### Keep supported in v1.x

Current API stays supported:

- `v-model`
- `variant`
- `options`
- `placeholder`
- `disabled`
- `openOnFocus`
- `openOnClick`
- `placement`
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

### Add / prefer

#### Advanced state

- `v-model:open`

#### Query event

- `@update:query`

Keep `input` working as a compatibility alias in v1.x, but document
`update:query` as the preferred event.

#### Preferred trigger API

- `#trigger`
- keep `#prefix` as a convenience slot

#### Preferred item slots

- `#item-prefix`
- `#item-label`
- `#item-suffix`
- `#empty`
- `#footer`
- `#item` as the full takeover escape hatch

#### Preferred item schema

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
  render?: () => VNode
}
```

Preferred change here should be limited to:

- `slot` over `slotName`

Keep these existing names as canonical because they already match broader
library convention:

- `onClick`
- `condition`

Dynamic custom item slots should be namespaced as:

- `#item-<slot>`

### Deprecate

Keep working, but deprecate in favor of the new names only where the change is
clearly worth it:

- `slotName`
- `input` for query updates
- `render` as the default customization story

`render` should remain an escape hatch only.

Do not deprecate:

- `onClick`
- `condition`

### Migration path

#### Old

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

#### New

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
<Combobox v-model="value" :options="options" @update:query="query = $event">
  <template #item-create-new="{ item, query }">
    Create "{{ query }}"
  </template>
</Combobox>
```

#### Query event migration

Old:

```vue
<Combobox @input="onQueryChange" />
```

New:

```vue
<Combobox @update:query="onQueryChange" />
```

---

## MultiSelect proposed spec

### Role

`MultiSelect` is the canonical searchable multi-choice picker.

It should stay narrower than a full people-picker or chips input, but it should
inherit the same item-slot model as `Combobox` and `Select`.

### Keep supported in v1.x

Current API stays supported:

- `v-model`
- `placeholder`
- `options`
- `hideSearch`
- `loading`
- `compareFn`
- `#option`
- `#footer`

### Add / prefer

#### Advanced state

- `v-model:open`

#### Query event

- `@update:query`

Query should stay internal otherwise.

#### Preferred trigger API

- `#trigger`
- keep trigger convenience behavior built in by default

#### Preferred item slots

- `#item-prefix`
- `#item-label`
- `#item-suffix`
- `#empty`
- `#footer`
- `#item` as the full takeover escape hatch

#### Option shape expansion

Support a richer non-breaking option object:

```ts
{
  label: string
  value: string
  disabled?: boolean
  icon?: string | Component
  description?: string
  slot?: string
}
```

Grouped options should also be supported so apps do not keep building richer
local multi-select variants just for grouped pickers.

### Deprecate

- `#option` as the primary documented customization API once `#item-label`
  exists

Keep `#option` as an alias in v1.x.

### Migration path

#### Old

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

#### New

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

### Scope guard

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

---

## Autocomplete compatibility note

`Autocomplete` is not part of the long-term preferred API shape, but it is still
heavily used across real apps.

v1 direction:

- keep `Autocomplete` exported and functioning
- document it as a migration layer
- direct new single-select searchable work toward `Combobox`
- direct new multi-select searchable work toward `MultiSelect`

Migration intent:

- `Autocomplete` single-select -> `Combobox`
- `Autocomplete` multi-select -> `MultiSelect`
- `#target` -> `#trigger`
- `#item-prefix` / `#item-label` / `#item-suffix` vocabulary should stay
  recognizable across the migration path

This should be a long migration, not an abrupt rename.

---

## Implementation order

1. **ItemList / ItemListRow**
   - build the shared styled list surface
   - build the shared row shell
   - add grouped list support
   - add shared item slots and styling hooks
   - make it usable directly by app authors for advanced cases

2. **Dropdown**
   - compose `ItemList` / `ItemListRow`
   - add shell-owned item slots
   - add `selected` support
   - add `v-model:open`
   - keep `#item` and `component`, but move them to escape-hatch status

3. **Combobox**
   - compose `ItemList` / `ItemListRow`
   - add `update:query`
   - add `v-model:open`
   - add preferred alias: `slot`
   - preserve `onClick` and `condition`
   - preserve current custom item API while warning on old names where needed

4. **Select**
   - compose `ItemList` / `ItemListRow`
   - add `v-model:open`
   - add `#item-prefix`, `#item-label`, `#item-suffix`
   - keep `#option` as alias

5. **MultiSelect**
   - compose `ItemList` / `ItemListRow`
   - align with the same slot model as `Select` and `Combobox`
   - add `v-model:open`
   - add `update:query`
   - add grouped option support

## v1 release contract for this RFC

For v1, this RFC means:

- no breaking API removals
- clear preferred APIs for new work
- explicit deprecations for awkward legacy customization patterns
- migration paths for existing apps
- a more consistent mental model across `ItemList`, `Dropdown`, `Select`,
  `Combobox`, and `MultiSelect`
