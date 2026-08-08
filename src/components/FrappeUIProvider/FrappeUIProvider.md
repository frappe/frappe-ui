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
exported for that case, and mounting `<Dialogs />` more than once is safe (the
imperative dialog stack lives in one shared module, so every host renders the
same stack).

<!-- @include: ./FrappeUIProvider.api.md -->
