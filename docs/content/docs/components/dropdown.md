# Dropdown

A flexible menu component for actions. Handles groups, nested submenus,
toggle rows, disabled items, custom triggers, and a built-in kebab pattern.

## Simple
A plain actions menu with icons. The default trigger is an auto-generated `<Button>` — pass `button: { label }` to override its text.

<ComponentPreview name="Dropdown-01_Simple" layout="stacked" />

## With Shortcuts
Keyboard shortcuts rendered in the row suffix. Use the `#item-suffix` slot and a custom `shortcut` field on each item to keep the label clean and the hint secondary.

<ComponentPreview name="Dropdown-02_Shortcuts" layout="stacked" />

## Submenus
Grouped actions with nested submenus — the "Share" path recurses into "Invite people" which recurses into channel targets. Groups are just `{ group, options }` entries in the options array.

<ComponentPreview name="Dropdown-03_Submenus" />

## Switches
Toggle items live inside the menu using `switch: true` + `switchValue`. Clicking a switch row fires `onClick(boolean)` with the new value and keeps the menu open, so consumers can flip multiple settings in one sitting.

<ComponentPreview name="Dropdown-04_Switches" />

## Kebab Menu
The classic row-actions pattern — a ghost icon button that opens a grouped menu. `#trigger` swaps in the `LucideMoreHorizontal` button, and the `open` slot prop keeps the button in its `active` state while the menu is open.

<ComponentPreview name="Dropdown-05_KebabMenu" />

## User Menu
A real workspace + profile menu — nested Apps / Theme submenus, account-group footer, and a completely custom trigger showing the workspace icon, product name, and current user.

<ComponentPreview name="Dropdown-06_UserMenu" />

## Notes

- Prefer `#item-prefix`, `#item-label`, and `#item-suffix` when you want to customize the standard dropdown row.
- Use `#item` or `item.component` only when you need to replace the entire row. Those escape hatches own the outer menu item element, so they should be reserved for exceptional cases.

<!-- @include: ../../../meta/Dropdown.md -->
