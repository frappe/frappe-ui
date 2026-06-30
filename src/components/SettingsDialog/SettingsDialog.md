# SettingsDialog

A modal for app settings: a sidebar of grouped tabs on the left, the active
tab's content on the right. Built on `Dialog`, composed from small building
blocks rather than a config object.

<ComponentPreview name="SettingsDialog-Default" layout="stacked" />

## Anatomy

It's a [reka-ui Tabs](https://reka-ui.com/docs/components/tabs) set, so you get
`tablist`/`tab`/`tabpanel` roles, `aria-selected`, and arrow-key focus for free.
Instead of tracking an `active` flag, give each nav item and panel a matching
`value`.

- **`SettingsDialog`** — wraps `Dialog`; owns open state (`v-model`), the
  selected tab (`v-model:tab`), and the `Cmd/Ctrl+Shift+,` shortcut. Full-screen
  on mobile, centered panel on desktop.
- **`SettingsSidebar`** / **`SettingsNavGroup`** / **`SettingsNavItem`** — the
  navigation. Give each item a `:value`; it also takes `#prefix` and `#suffix`.
- **`SettingsContent`** / **`SettingsPanel`** — the right pane; one panel per
  tab, each with a `:value` matching its nav item.

`v-model:tab` is optional — bind it to drive selection yourself (Gameplan uses
it for deep-linkable `/settings/:tab` URLs). Set `:unmount-on-hide="false"` to
keep visited panels mounted across switches.

## Panels: fixed header, scrolling body

A `SettingsPanel` holds a `SettingsHeader` (pinned) and a `SettingsBody`
(scrolls), so titles, search inputs, and column headers never scroll away.
`SettingsHeader` takes `title` + `description` (+ `#actions`), or arbitrary
content via its default slot.

<ComponentPreview name="SettingsDialog-PanelBasic" />

## SettingsRow

Lays out a setting as label + description on the left, control on the right. A
slotted frappe-ui control (e.g. `Switch`) is auto-wired to the title `<label>` —
no `label-for` needed.

<!-- @include: ./SettingsDialog.api.md -->
