# Sidebar

The wide navigation panel of an app shell. `Sidebar` is a bare frame — a
fixed-width column with the collapse machinery and a single slot — and you
compose the body from `SidebarItem`, `SidebarLabel`, and your own markup. The
app owns its header, scroll region, and empty state; lay them out with plain
flex utilities.

<ComponentPreview name="Sidebar-Default" />

There are no layout slots and no built-in scrolling in composition mode. Put a
header as a direct child, wrap the middle list in your own `overflow-y-auto`
container, and push a footer down with `mt-auto`.

## Collapse

`Sidebar` owns collapse. Bind `v-model:collapsed` to control it, or leave it
unset to collapse automatically below the `sm` breakpoint. `disableCollapse`
pins it open. Width comes from the `width` / `collapsedWidth` props (CSS lengths,
applied inline so an app can override them). Drop a `SidebarCollapseToggle`
anywhere inside to flip the state; `SidebarLabel divider` turns a section label
into a divider line while collapsed.

<ComponentPreview name="Sidebar-Collapsed" />

## SidebarItem

A single row. It renders a container with a navigable main area and a **sibling**
trailing zone, so an options menu in `#suffix` isn't nested inside the link
(which anchors and buttons disallow).

- `#prefix` — a leading icon or avatar (falls back to the `icon` prop: a lucide
  class, text, or a component).
- default slot — the label region (falls back to the `label` prop). Put inline
  adornments like a lock icon here next to the text.
- `#suffix` — the trailing zone: an unread count, an options `…` menu, etc.

Set `to` to render a router link; omit it for a button. `active` drives
`data-state`; when omitted it's inferred by matching `to` against the current
route. A click invokes `onClick` (bound from `@click`) in both cases.

## SidebarHeader

The app-switcher / workspace-identity row. A fixed 48px region that lines up
with `PageHeader`, rendered as a dropdown trigger. `title` and `subtitle` are
plain strings; `#prefix` fills the default logo/initial box (a `size-7
overflow-hidden` frame — wide content clips), falling back to the `logo` prop,
or the title's first letter; `showLogo: false` drops the box entirely for a
flush-left title. `menuItems` renders inside the trigger's
dropdown — the same structured-options shape `Dropdown` itself takes.

## SidebarSection

A collapsible group. It owns only the label row and the collapse chrome —
compose `SidebarItem` (or anything else) as children in the default slot.
Non-collapsible groups don't need this component at all: compose `SidebarLabel`
+ `SidebarItem` directly instead.

<ComponentPreview name="Sidebar-Section" />

Bind `v-model:collapsed` to own a section's state (start a section collapsed,
persist the choice); left unbound the section manages it internally, starting
expanded.

## SidebarCard

A promotional or onboarding card for the sidebar footer — a trial notice, an
upgrade prompt, a "what's new" pointer. A white card with an optional
theme-colored icon and one full-width tinted action button. Like `Alert`, it is
stateless: `dismiss` is an event and the parent owns hiding the card. It is not
a status announcement, so it has no live-region role.

<ComponentPreview name="Sidebar-Card" />

`action` takes `ButtonProps` plus an `onClick({ dismiss })` handler (the same
shape as `Alert`'s actions). `#prefix`, `#title`, `#description`, and
`#actions` override the corresponding parts.

<!-- @include: ./Sidebar.api.md -->
