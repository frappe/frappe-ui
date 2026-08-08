# Composables

Composition API helpers that don't belong to one component.

## usePageMeta

Keeps `document.title` (and the favicon) in sync with reactive state. Call it
once per page component; it watches the function you pass and re-applies the
result whenever a dependency changes.

```vue
<script setup>
import { ref } from 'vue'
import { usePageMeta } from 'frappe-ui'

const title = ref('Loading…')

usePageMeta(() => ({
  title: title.value,
  emoji: '🌈',
}))
</script>
```

The function returns `null`/`undefined` to skip an update, or a `PageMeta`
object:

- `title` — sets `document.title`.
- `icon` — a URL to a favicon image.
- `emoji` — renders the emoji as the favicon, taking priority over `icon`.
- Omitting both `icon` and `emoji` restores the page's original favicon.

Called inside a component, the watcher stops automatically on unmount — there
is nothing to clean up. Called outside one (a router hook, a plain module),
it returns a stop function:

```js
const stop = usePageMeta(() => ({ title: 'Loading…' }))
// later
stop()
```

## useColorScheme

The app's light/dark preference, shared by every caller. The first call
restores the saved preference and starts following the OS setting — there is
nothing to install.

```vue
<script setup>
import { useColorScheme } from 'frappe-ui'

const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme()
</script>

<template>
  <button @click="toggleColorScheme">
    {{ colorScheme }}
  </button>
</template>
```

- `colorScheme` — `Ref<'light' | 'dark' | 'system'>`, read-only. It, the
  `<html data-theme>` attribute, and the saved preference always move
  together, so write through `setColorScheme` rather than assigning the ref.
- `setColorScheme(scheme)` — selects a preference: applies `data-theme` and
  persists it.
- `toggleColorScheme()` — flips between light and dark.

## shellScrollContainer / useShellScrolled

`shellScrollContainer` is a computed ref pointing at the scroll element of the
mounted [`DesktopShell` or `MobileShell`](../components/desktopshell) — `null`
when neither is mounted. Read `scrollTop` off it, or call `scrollTo`/`scrollBy`
directly, from anywhere — a component, a `vue-router` `scrollBehavior`, a
navigation guard.

```vue
<script setup>
import { shellScrollContainer } from 'frappe-ui'

function scrollToTop() {
  shellScrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
```

`useShellScrolled` tracks whether that container is scrolled past a threshold
— the usual driver of a header's border or shadow appearing on scroll. It
follows the active shell automatically across a desktop/mobile layout swap.

```vue
<script setup>
import { useShellScrolled } from 'frappe-ui'

const scrolled = useShellScrolled({ threshold: 12 })
</script>

<template>
  <header :data-scrolled="scrolled">…</header>
</template>
```

`threshold` defaults to `200`. Without a mounted shell, `scrolled` stays
`false` and the composable warns once in development.
