# Sidebar

The wide navigation column of an app. You fill it with `SidebarItem`,
`SidebarSection` and your own markup.

<ComponentPreview name="Sidebar-Default" />

## Anatomy

`Sidebar` is a fixed-width column with one slot, and it owns collapsing. It
has no layout slots and does not scroll, so lay out the header, the scrolling
list and the footer yourself with flex classes.

```vue
<Sidebar v-model:collapsed="collapsed">
  <SidebarHeader title="Acme" :menu-items="workspaceMenu" />

  <div class="flex-1 overflow-y-auto">
    <SidebarItem label="Inbox" icon="lucide-inbox" route="/inbox" />
    <SidebarLabel>Projects</SidebarLabel>
    <SidebarItem label="Website" icon="lucide-globe" route="/p/website" />

    <SidebarSection label="Archived" collapsible>
      <SidebarItem label="Q3 launch" route="/p/q3" />
    </SidebarSection>
  </div>

  <SidebarCard class="mt-auto" title="Trial ends in 5 days" :action="upgrade" />
  <SidebarCollapseToggle />
</Sidebar>
```

## Examples

### Collapsing to icons

A collapsed sidebar shows only icons. `SidebarCollapseToggle` switches between
the two widths, and `SidebarLabel divider` turns a section label into a line
while collapsed.

<ComponentPreview name="Sidebar-Collapsed" />

### Collapsible sections

`SidebarSection` adds a label row that opens and closes the items under it.

<ComponentPreview name="Sidebar-Section" />

### Trial notice

`SidebarCard` holds a notice at the foot of the sidebar: a trial ending, an
upgrade offer, or a pointer to what is new.

<ComponentPreview name="Sidebar-Card" />

## Behavior

### Collapse

Bind `v-model:collapsed` to control collapsing. Left unbound, the sidebar
collapses by itself below the `sm` breakpoint. `:collapsible="false"` keeps it
open. `width` and `collapsedWidth` take CSS lengths.

### Items

`SidebarItem` is one row: a link or button, and a separate area after it for
`#suffix`. The suffix sits beside the link rather than inside it, so a menu
button there is valid HTML.

- `#prefix` holds a leading icon or avatar. Without it, the `icon` prop is
  used: a `lucide-*` class, an emoji or a component. Any other string shows
  nothing and logs a warning in development, so put initials in `#prefix`.
- The default slot holds the label, and falls back to the `label` prop.
- `#suffix` holds an unread count or an options menu.

`route` renders a router link and `href` a plain link. `route` wins when both
are set, and a row with neither is a button. `active` marks the current row.
Left unset, it is worked out by matching `route` against the current route.

### Header

`SidebarHeader` is the 48px row at the top, level with `PageHeader`. It shows
`title`, `subtitle`, and a square logo from `#prefix`, the `logo` prop, or the
title's first letter. `:show-logo="false"` removes the square. With
`menuItems` the header opens a dropdown, which takes the same options as
`Dropdown`. Without them it is plain text, and the logo and title stay in the
same place.

### Sections

Bind `v-model:collapsed` on a `SidebarSection` to start it closed or to
remember the choice. Left unbound, it starts open and keeps its own state.
For a group that never collapses, use `SidebarLabel` and `SidebarItem`
without a section.

### Card

`SidebarCard` does not hide itself. It emits `dismiss`, and the parent removes
it. `action` takes `Button` props and an `onClick({ dismiss })` handler, the
same shape as `Alert`'s actions. `#prefix`, `#title`, `#description` and
`#actions` replace each part.

### Attributes

Attributes on `SidebarItem` go to two places. `class`, `style` and event
listeners go on the row, so a background or a drop target covers the
`#suffix` area too. Every other attribute (`target`, `rel`, `id`, `title`,
`data-*`, `aria-*`) goes on the link or button inside. Your `aria-label`
replaces the one taken from the label.

## Accessibility

`Sidebar` renders a `<nav>` named "Main". Set `ariaLabel` to rename it, when a
page has a second sidebar or to translate it. It is the only landmark in the
family, so keep your own wrappers as plain `div`s.

`SidebarSection` marks its items as a group, named by its label. A collapsible
section's toggle reports whether it is open.

<!-- @include: ./Sidebar.api.md -->
