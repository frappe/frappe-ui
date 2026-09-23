# ContextMenu

A menu that opens at the cursor when the user right-clicks inside its trigger
area. To open a menu from a button, use [Dropdown](./dropdown) instead.

<ComponentPreview name="ContextMenu-Simple" />

## Examples

### Task card

A card with grouped actions and submenus for Share and Move to. `options` takes
the same items, groups and submenus as Dropdown.

<ComponentPreview name="ContextMenu-Groups" />

### File list

One `ContextMenu` wraps the whole list. Each row's `@contextmenu` handler
writes that row's actions into a ref before the menu opens. Folders get
**New file**, files get **Download**, and images also get **Set as cover**.

<ComponentPreview name="ContextMenu-FileList" />

## Behavior

### Trigger

The default slot, or the `#trigger` slot, is the area that opens the menu on
right-click. Both receive `{ open, setOpen, close }`.

`ContextMenu` does not pass attributes through. Put classes and attributes on
the element inside the trigger slot.

### Options per row

A list does not need one `ContextMenu` per row. Wrap the list once, and set the
`options` from the row's `@contextmenu` handler. The handler runs before the
menu opens, so the menu shows the actions for the row that was right-clicked.

### Opening from code

`setOpen(true)` from the slot props opens the menu at the lower-left corner of
the trigger, because there is no cursor position to use.

### Scroll lock

While the menu is open, the page does not scroll with the mouse wheel or touch.
The menu itself still scrolls.

### Portal

The menu renders in `body`, or in the nearest host container that provides a
portal target. Use `portalTo` when the menu must render inside a specific
container.

## Accessibility

| Key                     | Action                              |
| ----------------------- | ----------------------------------- |
| `ArrowDown` / `ArrowUp` | Moves focus between items           |
| `Enter` / `Space`       | Runs the focused item               |
| `ArrowRight`            | Opens the focused submenu           |
| `ArrowLeft`             | Closes the submenu                  |
| `Escape`                | Closes the menu                     |

The menu opens on right-click, or on a long press on touch screens. Users
may not know it is there, so also offer important actions somewhere visible,
such as a row actions [Dropdown](./dropdown).

## Migrating from v0

ContextMenu shares its option changes with Dropdown: groups use
`{ group, options }`, and `component:` rows are replaced by
`slots: { item: fn }`. See the
[migration guide](../migration#dropdown-and-contextmenu).

<!-- @include: ./ContextMenu.api.md -->
