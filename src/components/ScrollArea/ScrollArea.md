# ScrollArea

A scroll container with scrollbars that look the same in every browser. The
scrollbars show while the pointer is over the area.

<ComponentPreview name="ScrollArea-Default" />

## Examples

### Wide table

`orientation="both"` lets a table scroll in both directions, with one
scrollbar per axis.

<ComponentPreview name="ScrollArea-WideTable" />

## Behavior

### Orientation

`orientation` picks which scrollbars render. `vertical` (the default) and
`horizontal` render one. `both` renders two, one per axis, for content that can
overflow either way, such as a wide table or a canvas.

### Hiding the scrollbars

The scrollbars hide `scrollHideDelay` milliseconds after the pointer leaves
the area. The default is 600.

### Viewport classes

The element that scrolls is inside the root, so a `class` on `ScrollArea` does
not reach it. `viewportClass` adds classes to that element, for layout that has
to sit on the scrolling element itself: padding, a grid, a minimum width, or
`h-full` on its child.

### Where it is used

`ScrollArea` is a general component, not only part of the app shell.
`DesktopShell` uses it for its content area, and `SettingsBody` uses it for a
settings panel.

## Migrating from v0

`ScrollBar` is no longer exported, and there is no replacement. `ScrollArea`
draws its own scrollbars, and `ScrollBar` only worked inside reka-ui's
`ScrollAreaRoot`, which frappe-ui does not export. Use `orientation` instead.
See the [migration guide](../migration#scrollbar-removed).

<!-- @include: ./ScrollArea.api.md -->
