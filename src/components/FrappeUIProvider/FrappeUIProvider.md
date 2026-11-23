# FrappeUIProvider

A wrapper for the app root that mounts the hosts for the `dialog.*` and
`toast.*` helpers. An app that uses neither helper does not need it.

<ComponentPreview name="FrappeUIProvider-Default" />

## Behavior

### Setup

Wrap the app root with it once. It renders the default slot unchanged and adds
no wrapper element.

```vue
<script setup>
import { FrappeUIProvider } from 'frappe-ui'
</script>

<template>
  <FrappeUIProvider>
    <App />
  </FrappeUIProvider>
</template>
```

### When it is required

The provider mounts `<ToastProvider />` and `<Dialogs />` beside the app. The
app needs it if it uses the `dialog.*` or `toast.*` helpers, including
`dialog.confirm`, `dialog.alert` and `dialog.prompt`.

An app that can show a right-to-left page also needs it, or its own Reka
`ConfigProvider` (see [Direction](#direction)). Without one, Tabs, menus,
selects and sliders lay out left to right on a `dir="rtl"` page.

### Direction

The provider passes the page's direction (`<html dir>`) to the Reka parts
inside it, which otherwise default to `ltr`. On a `dir="rtl"` page that is what
lets Tabs, SettingsDialog, TabButtons, menus, selects and scroll areas lay out
right to left. The provider follows the page if `<html dir>` changes after
mount.

To open a popup beside its trigger in reading order, pass `side="inline-start"`
or `side="inline-end"` to Popover, Tooltip, HoverCard, Dropdown, Select,
Combobox, MultiSelect, DatePicker or TimePicker. `left` and `right` stay
physical on both kinds of page.

An app that wraps its own Reka `ConfigProvider`, even only for `nonce` or
`useId`, keeps it, and the provider then leaves the direction alone. Reka gives
`dir` a default of `ltr`, so the provider cannot tell whether that
`ConfigProvider` set it. Pass the page's direction to it yourself:

```vue
<script setup>
import { ConfigProvider } from 'reka-ui'
import { FrappeUIProvider } from 'frappe-ui'

const pageDir = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'
</script>

<template>
  <ConfigProvider :dir="pageDir">
    <FrappeUIProvider>
      <App />
    </FrappeUIProvider>
  </ConfigProvider>
</template>
```

### Mounting the hosts yourself

To get the hosts without the wrapper, mount `<Dialogs />` and
`<ToastProvider />` directly. Both are still exported for this case.

- Mount `<ToastProvider />` before the app content. It shows only toasts sent
  after it mounts, so a toast sent from `setup()` is lost if it mounts later.
- Mount `<ToastProvider />` once. A second one shows every toast twice.
- `<Dialogs />` can be mounted more than once. Only one of them shows the
  dialogs, and an extra one logs a warning in development.

<!-- @include: ./FrappeUIProvider.api.md -->
