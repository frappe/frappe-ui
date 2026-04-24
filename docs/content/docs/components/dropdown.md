# Dropdown

A flexible menu component for selecting actions or options. It handles lists,
groups, nested items, switches, disabled items, and custom triggers.

<!-- AUTO-GENERATED STORIES START -->
## Basic
<ComponentPreview name="Dropdown-01_Basic" />

## Menu Patterns
<ComponentPreview name="Dropdown-02_MenuPatterns" />

## Trigger Patterns
<ComponentPreview name="Dropdown-03_TriggerPatterns" />

## User Menu
<ComponentPreview name="Dropdown-04_UserMenu" />

## Item Slots And Empty State
<ComponentPreview name="Dropdown-05_ItemSlotsAndEmptyState" />

## Kebab Menu
A classic row-actions pattern — a ghost icon button that opens a grouped menu. Use `#trigger` to swap in the `LucideMoreHorizontal` icon button, and rely on the `open` slot prop to flip the button into its `active` state while the menu is open.

<ComponentPreview name="Dropdown-06_KebabMenu" />
<!-- AUTO-GENERATED STORIES END -->

## Notes

- Prefer `#item-prefix`, `#item-label`, and `#item-suffix` when you want to
  customize the standard dropdown row.
- Use `#item` or `item.component` only when you need to replace the entire row.
  Those escape hatches own the outer menu item element, so they should be
  reserved for exceptional cases.

<!-- @include: ../../../meta/Dropdown.md -->
