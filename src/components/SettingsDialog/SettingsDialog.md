# SettingsDialog

A modal for app settings: a sidebar of grouped, navigable items on the left
and the active item's content on the right. Built on top of `Dialog` and
`Sidebar`.

<ComponentPreview name="SettingsDialog-Default" layout="stacked" />

## Sections and items

Pass `sections`, each with a `label` and a list of `items`. Every item is a
sidebar entry; give it a `component` to render in the content area when it is
selected. The first item is active by default.

## Custom tab content

Use the `#tab-content` slot to render the content area yourself instead of
per-item `component`s. The slot receives the active `{ tab }`.

<ComponentPreview name="SettingsDialog-CustomTabContent" />

## SettingsPanel

`SettingsPanel` is the chrome for a single settings tab: a padded, scrollable
container with a title, an optional description, an `#actions` area, and a body
slot. Render one per tab — it pairs naturally with each `sections` item's
`component`.

<ComponentPreview name="SettingsDialog-PanelBasic" />

<!-- @include: ./SettingsDialog.api.md -->
