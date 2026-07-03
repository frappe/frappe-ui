# Rail

The narrow icon column of an app shell. `Rail` is a bare frame — a fixed 50px
column with one shared tooltip context and a single slot — and `RailItem` is one
tooltip'd cell inside it. Lay the children out with plain flex utilities: give
the middle section `flex-1` to push the anchors above and below it to the edges.

<ComponentPreview name="Rail-Default" />

There are no layout slots and no built-in scrolling — position is CSS. Put fixed
anchors (a logo, a user menu) as direct children, and if the middle list can
overflow, wrap it in your own `overflow-y-auto` container.

## RailItem

`RailItem` carries the tooltip (its `label`), the active indicator, and an
optional unread `badge`. Two visual treatments:

- `variant="tile"` (default) — a filled cell with a left indicator bar when
  active. Use the default slot for an image, avatar, or initials.
- `variant="ghost"` — transparent until hovered, raised when active. Pass an
  `icon` for a shortcut like Search or Notifications.

Set `to` to render a router link; omit it to get a button that emits `click`.
The `badge` count shows as a pill (`badgeStyle="count"`) or a dot
(`badgeStyle="dot"`); either way it folds into the item's accessible label, and
a dot surfaces the real number in the tooltip. The badge pill teleports to
`<body>` so an `overflow-hidden` scroll container can't clip it.

<!-- @include: ./Rail.api.md -->
