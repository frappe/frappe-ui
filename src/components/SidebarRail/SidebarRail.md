# SidebarRail

The narrow icon column of an app shell. `SidebarRail` is a bare frame — a
fixed 50px column with one shared tooltip context and a single slot — and
`SidebarRailItem` is one tooltip'd cell inside it. Lay the children out with
plain flex utilities: give the middle section `flex-1` to push the anchors
above and below it to the edges.

It shares the `Sidebar` name because the two sit side by side in the same app
frame, not because one contains the other. Compose them independently: a rail
with a `Sidebar` beside it, a rail on its own, or a sidebar on its own. The
rail is not a collapsed `Sidebar` — collapsing is `Sidebar`'s own behaviour.

<ComponentPreview name="SidebarRail-Default" />

There are no layout slots and no built-in scrolling — position is CSS. Put fixed
anchors (a logo, a user menu) as direct children, and if the middle list can
overflow, wrap it in your own `overflow-y-auto` container.

## SidebarRailItem

`SidebarRailItem` carries the tooltip (its `label`), the active indicator, and
an optional unread `badge`. Two visual treatments:

- `variant="tile"` (default) — a filled cell with a left indicator bar when
  active. Use the default slot for an image, avatar, or initials.
- `variant="ghost"` — transparent until hovered, raised when active. Pass an
  `icon` for a shortcut like Search or Notifications.

Set `to` to render a router link; omit it to get a button that emits `click`.
The `badge` count shows as a pill (`badgeStyle="count"`) or a dot
(`badgeStyle="dot"`); either way it folds into the item's accessible label, and
a dot surfaces the real number in the tooltip. The badge pill teleports to
`<body>` so an `overflow-hidden` scroll container can't clip it.

<!-- @include: ./SidebarRail.api.md -->
