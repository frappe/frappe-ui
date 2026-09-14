# DesktopShell

The desktop app frame. `DesktopShell` arranges an app's `SidebarRail` and
`Sidebar` alongside the main content, and owns the skeleton the content needs:
a pinned `PageHeaderTarget` and a registered scroll region. Its mobile
counterpart is a separate family —
[`MobileShell`](/docs/components/mobileshell) — because the two are different
navigation models, not one responsive component.

<ComponentPreview name="DesktopShell-Default" />

Put the icon column in `#rail`, the navigation panel in `#sidebar` (render it
conditionally to hide it on routes that don't need it), and the routed page in
the default slot. Pages declare their own `PageHeader` anywhere — it teleports
to the target the shell pins above the scroll region.

## Scroll container

The shell owns its scroll region and hands it to everything it renders, so
`useShellScrolled()` resolves it with no wiring — a page can scroll to the top,
or a router `scrollBehavior` can read the scroll offset, without the app owning
a global.

```ts
import { shellScrollContainer, useShellScrolled } from 'frappe-ui'

const scrolled = useShellScrolled({ threshold: 12 })
shellScrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
```

A page inside the shell reads that shell, even while another is still mounted.
`shellScrollContainer` is the fallback for what a page cannot reach that way: a
router `scrollBehavior`, a navigation guard, anything outside a component. It is
a stack, so swapping `DesktopShell` for `MobileShell` on a viewport change hands
the active container over cleanly whatever the mount order.

## Turning the page scroll off

`:scroll="false"` makes the content area fill the remaining height and never
page-scroll. Reach for it in a multi-pane layout where the panes own their own
overflow — a list-and-detail split, or a board whose columns scroll separately.
Without it an app fakes the same thing with `absolute inset-0`, a hardcoded
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

With `scroll="false"` there is no shell scroll element, so
`shellScrollContainer` is `null` and `useShellScrolled()` stays `false`. Read
the pane's own `ScrollArea` instead.

## Slot names

`DesktopShell` has `#rail` and `#sidebar`; `MobileShell` has `#nav`. The names
describe regions, not components: the desktop frame has two side regions that
can appear together, and the mobile frame has one bar along the bottom. One
shared name would have to mean "the icon column", "the navigation panel" and
"the tab bar" at once, and an app rendering both a rail and a sidebar could not
say which is which.

## Theming the content region

The content region exposes `data-slot="desktop-shell-content"` for app-level
styling. Target that slot in CSS when an app needs a card, gutter, border,
background, or other product-specific surface treatment.

<!-- @include: ./DesktopShell.api.md -->
