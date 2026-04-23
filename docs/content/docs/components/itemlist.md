# ItemList

`ItemList` is the advanced list surface behind selection and menu components
like `Dropdown`, `Select`, and `Combobox`.

Use it when you need custom triggers, custom containers, search inputs, or other
app-specific layout, but still want the shared row styling and slot model.

`ItemListRow` is the matching row shell. Use it when you need to compose a
single row directly.

## Basic list

<ComponentPreview name="ItemList-Basic" css='justify-center !py-20 grid' />

## Custom item slots

<ComponentPreview name="ItemList-CustomSlots" css='justify-center !py-20 grid' />

## Advanced slots

<ComponentPreview name="ItemList-AdvancedSlots" css='justify-center !py-20 grid' />

## Empty state and footer

<ComponentPreview name="ItemList-EmptyAndFooter" css='justify-center !py-20 grid' />

## ItemListRow states

<ComponentPreview name="ItemList-RowStates" css='justify-center !py-20 grid' />

## ItemListRow quick reference

- Props: `as`, `size`, `active`, `selected`, `disabled`
- Slots: default, `#prefix`, `#label`, `#suffix`
- Hooks: `data-slot="item-list-row"`, `data-slot="item-prefix"`,
  `data-slot="item-label"`, `data-slot="item-suffix"`, `data-size`,
  `data-state`, `data-disabled`

## Notes

- `groups` takes precedence over `items`. Empty groups are omitted during
  normalization.
- `item-click` fires only for enabled items.
- `ItemList` does not render icons or checkmarks by default. Use `#item-prefix`
  and `#item-suffix` when you need those affordances.
- `ItemListRow` is the shared row shell for direct composition when you do not
  need the full list wrapper.

<!-- @include: ../../../meta/ItemList.md -->
