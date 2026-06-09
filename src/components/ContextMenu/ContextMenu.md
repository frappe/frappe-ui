# ContextMenu

A right-click context menu for surfaces, rows, and canvas elements. Opens at the cursor position wherever the user right-clicks within the trigger area.

## Simple

Right-click a chat message to open a quick-actions menu.

<ComponentPreview name="ContextMenu-Simple" />

## Groups and Submenus

A task card with grouped actions and nested submenus for Move and Share operations.

<ComponentPreview name="ContextMenu-Groups" />

## Shared over a list

A single `<ContextMenu>` wrapping a file list. The `@contextmenu` handler swaps `options` based on which item was right-clicked.

<ComponentPreview name="ContextMenu-FileList" />

<!-- @include: ./ContextMenu.api.md -->
