# SidebarRail

The narrow icon column of an app shell. For a wide column with labels, use
[`Sidebar`](/docs/components/sidebar).

<ComponentPreview name="SidebarRail-Default" />

## Anatomy

`SidebarRail` is a fixed 50px column with one slot. `SidebarRailItem` is one
cell in it, with a tooltip. The rail has no layout slots and does not scroll,
so lay out the children with flex classes. Give the middle group `flex-1` to
push the items above and below it to the ends.

```vue
<SidebarRail>
  <SidebarRailItem label="Home" variant="ghost" icon="lucide-house" route="/" />

  <div class="flex w-full flex-1 flex-col items-center gap-3 overflow-y-auto pt-3">
    <SidebarRailItem label="Design" route="/c/design" :badge="3">
      <span>DE</span>
    </SidebarRailItem>
  </div>

  <SidebarRailItem label="Search" variant="ghost" icon="lucide-search" />
  <SidebarRailItem label="You" variant="ghost">
    <Avatar label="Jane Doe" size="md" />
  </SidebarRailItem>
</SidebarRail>
```

## Behavior

### Rail and sidebar

`SidebarRail` shares the `Sidebar` name because the two sit side by side in the
same app frame, not because one contains the other. Use a rail with a `Sidebar`
beside it, a rail on its own, or a sidebar on its own. The rail is not a
collapsed `Sidebar`. `Sidebar` collapses by itself.

### Layout and scrolling

Put fixed items, such as a logo or a user menu, directly in the rail. If the
middle list can overflow, wrap it in your own `overflow-y-auto` container.

### Tooltips

Each item shows its `label` in a tooltip to the right. `description` adds a
second line, such as "12 members". The rail shares one tooltip context across
its items, so moving between items shows each tooltip with no delay.

### Variants

- `variant="subtle"` (default) is a filled cell with a bar on its left edge when
  active. Use the default slot for an image, an avatar or initials.
- `variant="ghost"` is transparent until hovered, and raised when active. Pass
  an `icon` for a shortcut such as Search or Notifications.

### Links

`route` renders a router link and `href` a plain same-tab link. `route` wins
when both are set. A string `route` falls back to a plain link when no router
is installed. An item with neither is a button. All three emit `click`.

When `active` is unset, a routed item is active when its `route` matches the
current route.

### Unread badge

`badge` takes an unread count. `badgeStyle="count"` (default) shows it as a
pill, and counts above 99 show as "99+". `badgeStyle="dot"` shows a dot, and
the tooltip spells out the number unless `description` is set. The pill is
rendered outside the rail, so an `overflow-hidden` container does not clip it.

### Attributes

Attributes on `SidebarRailItem` go on the clickable cell (the `<button>` or the
link), not on the tooltip wrapper. A `class` adds to the cell's own classes.

## Accessibility

Each item uses its `label` as its accessible name. When `badge` is above zero,
the count is added to the name, for example "Notifications, 3 unread". The
active item gets `aria-current="page"`.

<!-- @include: ./SidebarRail.api.md -->
