# MobileShell

The mobile app frame: a pinned header, a scrolling content area and a bottom
tab bar. On desktop, use [`DesktopShell`](/docs/components/desktopshell)
instead.

<ComponentPreview name="MobileShell-Default" />

## Behavior

### Regions

`MobileShell` is a fixed, full-height column. Put the routed page in the
default slot and a [`MobileNav`](/docs/components/mobilenav) in `#nav`. A page
declares its own `PageHeaderMobile`, which teleports to a `PageHeaderTarget` at
the top of the shell.

The content area uses the browser's native scrolling, with momentum and
overscroll. The header and the tab bar stay fixed to the edges. In an installed
PWA, the header gets extra top padding to clear the status bar.

### Mobile and desktop are separate components

Mobile and desktop are different navigation models, so the app picks which
shell to render for the viewport. There is no single responsive shell.

### Scroll container

Like `DesktopShell`, the shell gives its content area to everything it
renders, and registers it in the shared registry. `shellScrollContainer` and
`useShellScrolled({ threshold })` both read it, so a tap on the active tab or a
router `scrollBehavior` can scroll it without an app-owned global.

### Slot names

`MobileShell` has `#nav`. `DesktopShell` has `#rail` and `#sidebar`. The names
describe regions, not components. See
[`DesktopShell`](/docs/components/desktopshell#slot-names) for why they differ.

## Migrating from v0

`useShellScrolled()` now requires a `threshold` in pixels. See the
[migration guide](../migration#shells).

<!-- @include: ./MobileShell.api.md -->
