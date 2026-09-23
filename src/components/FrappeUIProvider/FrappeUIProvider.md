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
app needs it only if it uses the `dialog.*` or `toast.*` helpers, including
`dialog.confirm`, `dialog.alert` and `dialog.prompt`.

### Mounting the hosts yourself

To get the hosts without the wrapper, mount `<Dialogs />` and
`<ToastProvider />` directly. Both are still exported for this case.

- Mount `<ToastProvider />` before the app content. It shows only toasts sent
  after it mounts, so a toast sent from `setup()` is lost if it mounts later.
- Mount `<ToastProvider />` once. A second one shows every toast twice.
- `<Dialogs />` can be mounted more than once. Only one of them shows the
  dialogs, and an extra one logs a warning in development.

## Migrating from v0

The `FrappeUIProviderProps` type is removed. It described props the component
never accepted. See the
[migration guide](../migration#frappeuiproviderprops-is-deleted).

<!-- @include: ./FrappeUIProvider.api.md -->
