# ItemListRow Spec

Status: accepted direction for `frappe-ui` v1 planning.

This document defines the exact public API for `ItemListRow`. It is a sub-spec
of [`08-selection-and-menu-api-spec.md`](./08-selection-and-menu-api-spec.md)
and inherits the shared design rules from that document.

## Background: why no `ItemList` container in v1

Earlier drafts of this spec proposed shipping a public `ItemList` container
alongside `ItemListRow` as the "advanced base layer" for the selection/menu
family.

In practice the family did not use it. `Dropdown`, `Select`, `Combobox`, and
`MultiSelect` each ended up owning their own listbox shell because each had
distinct requirements that a single generic container could not satisfy
without becoming the do-everything component this RFC explicitly rules out:

- different keyboard navigation models (menu vs listbox vs combobox)
- different open/close ownership and trigger relationships
- different empty/loading/footer composition
- different grouping normalization rules
- different interaction with a search input

Across the four high-level components, the only piece that was actually
shared was the row presentation itself — spacing, prefix/label/suffix
regions, and the active/selected/disabled visual states. That is exactly
what `ItemListRow` covers.

Decision for v1:

- ship `ItemListRow` as the shared row primitive
- do **not** ship a public `ItemList` container
- each higher-level component owns its own listbox shell and composes
  `ItemListRow` for row rendering
- if a real need for a public list container emerges later, it can be added
  additively in a future minor without breaking the row contract

This keeps the v1 public surface honest: we only freeze APIs that have at
least one validated consumer.

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

This is the key architectural decision for this family: the row shell is
shared, but the listbox container is owned by each higher-level component.

## v1 stance

`ItemListRow` is public in v1.

It is intentionally a small primitive, but it is worth exposing because:

- the row styling is shared
- the row structure is shared
- advanced app cases for custom listboxes clearly exist
- higher-level components can build on it without duplicating row markup
- app authors should not have to rebuild the row shell to get the design
  system behavior
