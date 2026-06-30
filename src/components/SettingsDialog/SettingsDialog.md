# SettingsDialog

A modal for app settings: a sidebar of grouped, navigable items on the left and
the active tab's content on the right. Built on top of `Dialog`.

It is **composition-first** — you assemble the dialog from small building blocks
rather than passing a config object. This keeps simple dialogs terse while
letting complex tabs (custom headers, search, filters) bend freely.

<ComponentPreview name="SettingsDialog-Default" layout="stacked" />

## Anatomy

- **`SettingsDialog`** — wraps `Dialog`, owns open state (`v-model`), and binds
  the `Cmd/Ctrl+Shift+,` toggle shortcut. It renders a responsive shell that is
  full-screen on mobile and a centered panel on desktop.
- **`SettingsSidebar`** / **`SettingsNavGroup`** / **`SettingsNavItem`** — the
  left navigation. You own the active state: bind `:active` and `@click` on each
  item. `SettingsNavItem` exposes `#prefix` (icon/avatar) and `#suffix` (badge).
- **`SettingsContent`** — the right pane; drop the active tab's panel in here.

You keep the list of tabs and the active tab in your own `ref`, then render the
nav and content from it (see the example above).

## Panels: fixed header, scrolling body

A tab's content is a **`SettingsPanel`** containing a **`SettingsHeader`** and a
**`SettingsBody`**. The header stays pinned while only the body scrolls, so
titles, search inputs, and table column-headers never scroll away. The body uses
an auto-hide overlay scrollbar (`ScrollArea`).

`SettingsHeader` renders a `title` + `description` (+ `#actions`) for the common
case, or you can pass arbitrary content via its default slot for custom headers.

<ComponentPreview name="SettingsDialog-PanelBasic" />

## SettingsRow

`SettingsRow` lays out a setting as a label + description on the left and a
control on the right. If the slotted control is a frappe-ui form control (e.g.
`Switch`), the row's title is automatically wired up as its `<label>` — no
`label-for` needed.

<!-- @include: ./SettingsDialog.api.md -->
