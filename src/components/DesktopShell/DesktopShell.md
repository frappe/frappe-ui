# DesktopShell

The desktop app frame. It places a `SidebarRail` and a `Sidebar` beside the
page content, with a pinned header above a scrolling content area. On mobile,
use [`MobileShell`](/docs/components/mobileshell) instead.

<ComponentPreview name="DesktopShell-Default" />

## Examples

### List and detail

`:scroll="false"` turns off the page scroll, so the ticket list and the ticket
each scroll on their own.

<ComponentPreview name="DesktopShell-ListDetail" />

## Behavior

### Regions

Put the icon column in `#rail`, the navigation panel in `#sidebar`, and the
routed page in the default slot. Both side slots are optional. Render
`#sidebar` with `v-if` to hide it on routes that don't need it.

A page declares its own `PageHeader` anywhere in its template. The header
teleports to a `PageHeaderTarget` that the shell pins above the scroll area.

### Mobile is a separate component

`DesktopShell` and `MobileShell` are two navigation models, not one responsive
component. The app picks which one to render for the viewport.

### Scroll container

The shell owns its scroll area. `useShellScrolled()` reads it with no setup,
so a page can scroll to the top and a router `scrollBehavior` can read the
scroll offset without an app-owned global.

```ts
import { shellScrollContainer, useShellScrolled } from 'frappe-ui'

const scrolled = useShellScrolled({ threshold: 12 })
shellScrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
```

A page inside the shell reads that shell, even while another shell is still
mounted. `shellScrollContainer` is for code that is not inside the shell: a
router `scrollBehavior`, a navigation guard, or code outside a component. It
holds a stack, so when `DesktopShell` and `MobileShell` swap on a viewport
change, the active container passes to the new shell in any mount order.

### Turning the page scroll off

`:scroll="false"` makes the content area fill the remaining height and never
scroll as a page. Use it in a layout where the panes own their overflow: a
list-and-detail split, or a board whose columns scroll separately. Without it,
apps fake the same thing with `absolute inset-0`, a fixed
`h-[calc(100vh-3rem)]`, or `[&>div]:h-full`.

```vue
<DesktopShell :scroll="false">
  <template #sidebar><Sidebar /></template>
  <div class="flex min-h-0 flex-1">
    <ScrollArea class="w-72 border-e"><ItemList /></ScrollArea>
    <ScrollArea class="flex-1"><Detail /></ScrollArea>
  </div>
</DesktopShell>
```

With `:scroll="false"` the shell has no scroll element, so
`shellScrollContainer` is `null` and `useShellScrolled()` stays `false`. Read
the pane's own `ScrollArea` instead.

### Slot names

`DesktopShell` has `#rail` and `#sidebar`. `MobileShell` has `#nav`. The names
describe regions, not components. The desktop frame has two side regions that
can appear together, and the mobile frame has one bar along the bottom. One
shared name would have to mean "the icon column", "the navigation panel" and
"the tab bar" at once, and an app that renders both a rail and a sidebar could
not say which is which.

## Migrating from v0

`useShellScrolled()` now requires a `threshold` in pixels, and a page reads the
shell it is inside before the shared registry. `:scroll="false"` is new. See
the [migration guide](../migration#shells).

<!-- @include: ./DesktopShell.api.md -->
