# MobileShell

The mobile app frame. `MobileShell` is a fixed, full-height column: a pinned
`PageHeaderTarget` on top (with safe-area padding for installed PWAs), a
native-scrolling content area, and a `#nav` slot for a bottom
[`MobileNav`](/docs/components/mobilenav). It's a separate family from
[`DesktopShell`](/docs/components/desktopshell) — mobile and desktop are
different navigation models, so the app chooses which to render for the viewport
rather than toggling one responsive component.

<ComponentPreview name="MobileShell-Default" />

Put the routed page in the default slot and the tab bar in `#nav`. The content
area scrolls with the platform's own momentum and overscroll; the header and nav
stay fixed to the edges.

## Scroll container

Like `DesktopShell`, the content area registers into the scroll-container
registry, so [`useScrollContainer()`](/docs/other/utilities) and
`getScrollContainer()` resolve it — a tapped-active tab or a router
`scrollBehavior` can drive it with no app-owned global.

<!-- @include: ./MobileShell.api.md -->
