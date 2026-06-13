# ContextMenu

A right-click context menu for surfaces, rows, and canvas elements. Opens at the cursor position wherever the user right-clicks within the trigger area.

## Simple

Right-click a chat message to open a quick-actions menu.

<ComponentPreview name="ContextMenu-Simple" />

## Groups and Submenus

A task card with grouped actions and nested submenus for Move and Share operations.

<ComponentPreview name="ContextMenu-Groups" />

## Tailored options per row

One `<ContextMenu>` wraps the entire list, with no separate instance per row. The trick is a single reactive `activeOptions` ref: each row's `@contextmenu` handler calls `getActions(file)` and writes the result into that ref before the menu opens, so the menu always reflects the item that was right-clicked.

This also lets you tailor options per item type. In this example, **Open**, **Rename**, **Copy link**, and **Delete** appear for every item, but folders get a **New file** action to create inside them, files get **Download**, and images get an extra **Set as cover** option on top of that.

<ComponentPreview name="ContextMenu-FileList" />

<!-- @include: ./ContextMenu.api.md -->
