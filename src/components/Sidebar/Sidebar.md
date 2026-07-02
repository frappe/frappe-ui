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

## Legacy config API

::: warning Deprecated
The config-object API (`:header` and `:sections="[{ items }]"`) still works for
one release, reimplemented on top of the new sub-components. Prefer the
composition API above for new code.
:::

<ComponentPreview name="Sidebar-Legacy" />

<!-- @include: ./Sidebar.api.md -->
