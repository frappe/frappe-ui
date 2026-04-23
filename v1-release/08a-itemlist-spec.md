# ItemList / ItemListRow Spec

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the exact public API for `ItemList` and `ItemListRow`. It
is a sub-spec of
[`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md) and
inherits the shared design rules from that document.

## Role

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

## Scope

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

## Exact public API for v1

### Shared types

```ts
type ItemListSize = 'sm' | 'md' | 'lg' | 'xl'

type SlotFn<TProps> = (props: TProps) => VNodeChild

interface ItemSlots<TProps> {
  prefix?: SlotFn<TProps>
  label?: SlotFn<TProps>
  suffix?: SlotFn<TProps>
  /** Full-row replacement; mutually exclusive with prefix/label/suffix */
  item?: SlotFn<TProps>
}

interface ItemListItem {
  label?: string
  value?: string | number | boolean
  icon?: string | Component
  description?: string
  disabled?: boolean
  selected?: boolean
  active?: boolean
  slot?: string
  slots?: ItemSlots<ItemListItemSlotProps>
  [key: string]: any
}

interface ItemListGroup<TItem extends ItemListItem = ItemListItem> {
  key?: string | number
  group?: string
  hideLabel?: boolean
  items: TItem[]
}
```

### ItemList props

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

### ItemList emits

```ts
interface ItemListEmits<TItem extends ItemListItem = ItemListItem> {
  'item-click': [item: TItem]
}
```

Rules:

- `item-click` fires only for enabled items
- clicking a disabled item does nothing
- `item-click` does not mutate `selected` or `active`

### ItemList slots

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

Per-item inline slots (shared design rule 9) compose with these template
slots:

- for full-row rendering: `#item` slot > `item.slots.item` > standard row
  shell
- for each region: `#item-*` slot > `item.slots.*` > default
- templates on the parent component always win over `item.slots.*` so app
  code can override JS-defined slot implementations locally
- if `item.slots.item` is provided alongside `item.slots.prefix` /
  `label` / `suffix`, `slots.item` wins and a dev warning is emitted

### ItemList rendering and behavior

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

### ItemList styling hooks

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

## ItemListRow exact public API for v1

### Props

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

### Slots

- default slot
- `#prefix`
- `#label`
- `#suffix`

Rules:

- `#label` overrides the default slot for the label region
- prefix and suffix regions are omitted when they have no renderable content
- `selected` and `active` share the same emphasized visual treatment in v1
- `disabled` applies muted text and not-allowed cursor styling

### Styling hooks

`ItemListRow` should expose:

- `data-slot="item-list-row"`
- `data-slot="item-prefix"`
- `data-slot="item-label"`
- `data-slot="item-suffix"`
- `data-size`
- `data-state="active|inactive"`
- `data-disabled`

## Relationship to the higher-level components

- `Dropdown` should compose `ItemList` / `ItemListRow` for action rows
- `Select` should compose `ItemList` / `ItemListRow` for option rows
- `Combobox` should compose `ItemList` / `ItemListRow` for search results rows
- `MultiSelect` should compose `ItemList` / `ItemListRow` for multi-select
  option rows

This is the key architectural decision for this family.

## v1 stance

`ItemList` and `ItemListRow` should both be public in v1.

They are intentionally advanced APIs, but they are worth exposing because:

- the styling is shared
- the structure is shared
- advanced app cases clearly exist
- higher-level components can build on them without duplicating row markup
- app authors should not have to rebuild the shell to get the design system
  behavior
