# FrappeUIProvider

Mounts the imperative `dialog.*` and `toast.*` portals — `<Dialogs />` and
`<ToastProvider />` — next to the app, and renders the default slot unchanged.
Wrap the app root with it once.

<ComponentPreview name="FrappeUIProvider-Default" />

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

## Is it required?

Only if the app uses the imperative `dialog.*` / `toast.*` helpers (or
`Dialog`'s `dialog.confirm` / `alert` / `prompt` family). An app that mounts
neither doesn't need it. An app that wants the portals without the wrapper can
mount `<Dialogs />` and `<ToastProvider />` directly instead — both stay
exported for that case. Mount `<ToastProvider />` ahead of the app content:
it only shows toasts published after it subscribes, so anything the app
toasts from `setup()` is dropped if it mounts later. Mount it once too: it
has no dedup guard, so a second one renders every toast twice. `<Dialogs />` dedups
itself — only one host renders the stack, nested or sibling, and an extra
mount warns in dev.

<!-- @include: ./FrappeUIProvider.api.md -->
