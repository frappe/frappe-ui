# MobileNav

The bottom tab bar for a [`MobileShell`](/docs/components/mobileshell).
`MobileNav` is a grid frame; each `MobileNavItem` becomes one equal-width tab, so
the bar adapts to any number of items.

<ComponentPreview name="MobileNav-Default" />

## MobileNavItem

Each item takes a `label`, an `icon` (or a default slot for custom content like
an avatar), and a `to` target. It renders a router link when navigating
somewhere new, and — when it's already the current route — a button that scrolls
the shell's scroll container to the top instead of re-navigating.

`active` controls the highlight and is independent of the current route, so one
tab can stay lit across a whole section (e.g. Home across every community route)
while tapping it still navigates home. When `active` is omitted it defaults to
whether `to` matches the current route. The default slot receives `{ active }`
so custom content — an avatar, a badge — can react to the highlight:

```vue
<MobileNavItem label="You" :to="{ name: 'More' }" :active="isMoreRoute">
  <template #default="{ active }">
    <UserAvatar :user="me" :class="{ 'ring-2 ring-outline-gray-4': active }" />
  </template>
</MobileNavItem>
```

Like `SidebarItem`, `MobileNavItem` is router-optional: mounted without
vue-router it degrades to a plain `<a>`/`<button>` with no warnings, so it works
in docs, tests, and embedded use.

<!-- @include: ./MobileNav.api.md -->
