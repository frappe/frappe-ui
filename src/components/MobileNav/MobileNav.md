# MobileNav

The bottom tab bar for a [`MobileShell`](./mobileshell).

<ComponentPreview name="MobileNav-Default" />

## Anatomy

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

## Behavior

### Items

Each item takes a `label` and an `icon`. The default slot replaces the icon
with custom content, such as an avatar. The label always shows under it.

### Links

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

### Without a router

Like `SidebarItem`, `MobileNavItem` works without vue-router. It renders a
plain `<a>` or `<button>` with no warnings, so it works in docs, tests and
embedded use.

## Accessibility

`MobileNav` renders a `<nav>` element. Each item uses its `label` as its
accessible name. The item whose `route` is the current route gets
`aria-current="page"`.

<!-- @include: ./MobileNav.api.md -->
