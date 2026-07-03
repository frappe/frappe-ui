# DesktopShell

The desktop app frame. `DesktopShell` arranges an app's `Rail` and `Sidebar`
alongside the main content, and owns the skeleton the content needs: a pinned
`PageHeaderTarget` and a registered scroll region. Its mobile counterpart is a
separate family — [`MobileShell`](/docs/components/mobileshell) — because the
two are different navigation models, not one responsive component.

<ComponentPreview name="DesktopShell-Default" />

Put the icon column in `#rail`, the navigation panel in `#sidebar` (render it
conditionally to hide it on routes that don't need it), and the routed page in
the default slot. Pages declare their own `PageHeader` anywhere — it teleports
to the target the shell pins above the scroll region.

## Scroll container

The shell registers its scroll region into a small module registry, so
[`useScrollContainer()`](/docs/other/utilities) and the plain
`getScrollContainer()` resolve it with no wiring — a page can scroll-to-top or a
router `scrollBehavior` can read the scroll offset without the app owning a
global. Because the registry is a stack, swapping `DesktopShell` for
`MobileShell` on a viewport change hands the active container over cleanly.

## Theming the content region

The content region exposes `data-slot="desktop-shell-content"` for app-level
styling. Target that slot in CSS when an app needs a card, gutter, border,
background, or other product-specific surface treatment.

<!-- @include: ./DesktopShell.api.md -->
