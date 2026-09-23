# Dropdown

A menu of actions that opens from a button. To open a menu on right-click, use
[ContextMenu](./contextmenu) instead.

<ComponentPlayground name="Dropdown" />

## Examples

### More actions button

A plain actions menu with icons. The `button` prop configures the default
trigger `<Button>`.

<ComponentPreview name="Dropdown-Simple" layout="stacked" />

### Row actions

An icon-only `ghost` button on each row of a list opens a grouped menu. The
`#trigger` slot replaces the default button.

<ComponentPreview name="Dropdown-KebabMenu" />

### File menu with shortcuts

The `#item-suffix` slot shows a keyboard shortcut at the end of each row. The
shortcut is a custom `shortcut` field on each item.

<ComponentPreview name="Dropdown-Shortcuts" layout="stacked" />

### Share and move

Groups of actions with nested submenus. "Share" opens a submenu, and "Invite
people" inside it opens another.

<ComponentPreview name="Dropdown-Submenus" />

### Preference toggles

Items with `switch: true` show a switch. The menu stays open, so the user can
change several settings at once.

<ComponentPreview name="Dropdown-Switches" />

### Workspace menu

A custom trigger that shows the app, product name and current user, with
submenus for apps and theme. `selected` marks the current app and theme.

<ComponentPreview name="Dropdown-UserMenu" />

## Behavior

### Options

`options` is an array of items and groups:

- An item has a `label` and an `onClick`. It can also have an `icon`, a
  `description`, a `theme` (`gray` or `red`), a `route`, `disabled` and
  `selected`.
- An item with `submenu` opens a nested menu. The submenu takes the same array
  shape.
- A group is `{ group, options }`. `hideLabel` hides the group heading.
  Items outside a group form groups without a heading.
- An item with a `condition` shows only while the function returns true. A
  group with no visible items is left out.

### Switch items

An item with `switch: true` shows a switch set to `switchValue`. Clicking it
calls `onClick` with the new boolean value and keeps the menu open.

### Trigger

Without a trigger slot, `Dropdown` renders a `<Button>` with the `button`
props. Its label defaults to "Options". The button stays pressed while the menu
is open.

The `#trigger` and default slots replace the button. They receive
`{ open, disabled, setOpen, close }`. `close()` is shorthand for
`setOpen(false)`.

### Custom rows

Use `#item-prefix`, `#item-label` and `#item-suffix` to change parts of the
standard row. Use the `#item` slot, or `slots: { item: fn }` on a single
option, only when you need to replace the whole row. Those slots render the
outer menu item element themselves, so keep them for exceptional cases.

## Accessibility

| Keys                                           | Action                                         |
| ---------------------------------------------- | ---------------------------------------------- |
| `Enter` / `Space` / `ArrowDown` on the trigger | Open the menu                                  |
| `ArrowDown` / `ArrowUp`                        | Move focus between items                       |
| `Enter` / `Space`                              | Run the focused item, or open its submenu      |
| `ArrowRight`                                   | Open the focused submenu                       |
| `ArrowLeft`                                    | Close the submenu                              |
| `Escape`                                       | Close the menu and return focus to the trigger |

An icon-only trigger needs a `label` so screen readers can name it.

## Migrating from v0

`placement` is replaced by `align`, and groups use `{ group, options }`
instead of `{ group, items }`. See the
[migration guide](../migration#dropdown-and-contextmenu) for the full list.

<!-- @include: ./Dropdown.api.md -->
