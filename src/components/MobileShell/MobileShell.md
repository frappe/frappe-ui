# MobileShell

The mobile app frame: a pinned header, a scrolling content area and a bottom
tab bar built with `MobileNav`. On desktop, use
[`DesktopShell`](./desktopshell) instead.

<ComponentPreview name="MobileShell-Default" />

## Anatomy

Put the routed page in the default slot and a `MobileNav` in `#nav`.
`MobileNav` is a grid. Each `MobileNavItem` in it becomes one equal-width tab,
so the bar fits any number of items.

```vue
<MobileShell>
  <RouterView />

  <template #nav>
    <MobileNav>
      <MobileNavItem label="Home" icon="lucide-house" :route="{ name: 'Home' }" />
      <MobileNavItem label="Search" icon="lucide-search" :route="{ name: 'Search' }" />
      <MobileNavItem label="You" :route="{ name: 'More' }">
        <Avatar label="Jane Doe" size="md" />
      </MobileNavItem>
    </MobileNav>
  </template>
</MobileShell>
```

## Examples

### Tab bar with an avatar tab

The last tab puts an `Avatar` in the default slot of `MobileNavItem`, in place
of the icon. The slot receives `{ active }`, so the avatar gets a ring while
its tab is active.

<ComponentPreview name="MobileShell-AvatarTab" />

## Behavior

### Regions

`MobileShell` is a fixed, full-height column. A page declares its own
`PageHeaderMobile`, which teleports to a `PageHeaderTarget` at the top of the
shell.

The content area uses the browser's native scrolling, with momentum and
overscroll. The header and the tab bar stay fixed to the edges. In an installed
PWA, the header gets extra top padding to clear the status bar.

### Desktop is a separate component

`MobileShell` and `DesktopShell` are two navigation models, not one responsive
component. The app picks which one to render for the viewport.

### Scroll container

Like `DesktopShell`, the shell owns its scroll area. It provides that element
to the pages inside it and registers it in the shared registry.
`useShellScrolled({ threshold })` and `shellScrollContainer` both read it, so a
tap on the active tab or a router `scrollBehavior` can scroll it without an
app-owned global.

### Slot names

`MobileShell` has `#nav`. `DesktopShell` has `#rail` and `#sidebar`. The names
describe regions, not components. See
[`DesktopShell`](./desktopshell#slot-names) for why they differ.

### Tab content

Each `MobileNavItem` takes a `label` and an `icon`. The default slot replaces
the icon with custom content, such as an avatar. The label always shows under
it.

### Tab links

`route` renders a router link and `href` a plain same-tab link. `route` wins
when both are set. An item with neither is a button that emits `click`.

### Tapping the current tab

When an item's `route` is already the current route, the item renders a button
instead of a link. Tapping it scrolls the shell's scroll container to the top
instead of navigating again.

### Active tab

`active` controls the highlight, separately from the current route. One tab can
stay lit across a whole section (for example, Home across every community
route), and tapping it still navigates home. Left unset, `active` is true when
`route` matches the current route.

The default slot receives `{ active }`, so custom content can react to the
highlight:

```vue
<MobileNavItem label="You" :route="{ name: 'More' }" :active="isMoreRoute">
  <template #default="{ active }">
    <Avatar label="Jane Doe" size="md" :class="{ 'ring-2 ring-outline-gray-4': active }" />
  </template>
</MobileNavItem>
```

### Tabs without a router

Like `SidebarItem`, `MobileNavItem` works without vue-router. It renders a
plain `<a>` or `<button>` with no warnings, so it works in docs, tests and
embedded use.

## Accessibility

`MobileNav` renders a `<nav>` element. Each item uses its `label` as its
accessible name. The item whose `route` is the current route gets
`aria-current="page"`.

<!-- @include: ./MobileShell.api.md -->
