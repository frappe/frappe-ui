# ItemListRow Spec

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the exact public API for `ItemListRow`. It is a sub-spec
of [`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md)
and inherits the shared design rules from that document.

## Role

`ItemListRow` is the single-row shell used internally by the selection/menu
family for consistent row presentation. It is exported from `frappe-ui` so
that app code building advanced or custom listboxes can match the design
system row styling without copying markup.

It is composed by:

- `Dropdown`
- `Select`
- `Combobox`
- `MultiSelect`

## Scope

`ItemListRow` is responsible for:

- spacing
- alignment
- prefix / label / suffix regions
- active / selected / disabled presentation
- row-level styling hooks

`ItemListRow` is **not** responsible for:

- list-level grouping or normalization
- empty / footer regions
- keyboard navigation
- selection state ownership
- popover or trigger behavior

Those concerns belong to the higher-level component that composes the row.

## Exact public API for v1

### Shared types

```ts
type ItemListSize = 'sm' | 'md' | 'lg' | 'xl'
```

`ItemListSize` is exported and reused by the higher-level selection
components so that their `size` prop maps cleanly to the row size.

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

- `Dropdown` composes `ItemListRow` for action rows
- `Select` composes `ItemListRow` for option rows
- `Combobox` composes `ItemListRow` for search-results rows
- `MultiSelect` composes `ItemListRow` for multi-select option rows

The row shell is shared; each higher-level component owns its own listbox
container.

## v1 stance

`ItemListRow` is public in v1. It is a small primitive, but worth exposing
so that app code building advanced or custom listboxes can match the
design system row styling without copying markup.
