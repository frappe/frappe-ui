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

Switching schemes would otherwise cross-fade every transitioning surface at
once, which reads as a flash. To suppress it, `useColorScheme` puts a
`no-transition` class on `<html>` for the two frames around the swap; the
rule that acts on it ships in `frappe-ui/style.css`. Apps that don't load
that stylesheet still switch correctly — they just see the cross-fade.

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

## useKeyboardShortcut

Registers a global keyboard shortcut for as long as the calling component is
mounted. No manual `keydown` listener, no cleanup to remember. It returns
nothing.

```vue
<script setup>
import { useKeyboardShortcut } from 'frappe-ui'

useKeyboardShortcut({
  combo: 'Mod+K',
  description: 'Open command palette',
  group: 'General',
  allowInInput: true,
  handler: () => open(),
})
</script>
```

Pass an array to register several at once.

### The combo

A combo is `Mod+Ctrl+Alt+Shift+<Key>`. That order is the canonical spelling and
the type enforces it, but the matcher accepts the modifiers in any order.

| Modifier | Means |
| --- | --- |
| `Mod` | Cmd on macOS, Ctrl elsewhere |
| `Ctrl` | Control on every platform |
| `Alt` | Alt, Option on macOS |
| `Shift` | Shift |

Punctuation and digits use a key **name**, never the character: `Mod+Slash`,
not `Mod+/`. `+` is the separator, so `Mod++` would split into empty parts and
never fire. The names are `Digit0`–`Digit9`, `Plus`, `Minus`, `Equal`, `Slash`,
`Backslash`, `Backtick`, `Comma`, `Period`, `Semicolon`, `Quote`,
`BracketLeft`, `BracketRight`.

`Plus` is the keypad `+`. A normal keyboard types `+` with Shift, so ⌘+ is
`Mod+Shift+Equal`.

Letters, function keys and named keys (`Escape`, `Enter`, `Space`, `ArrowUp`, …)
match `event.key`. Digits and punctuation match `event.code`, so
`Mod+Shift+Digit1` fires on ⌘⇧1 and on ⌘⇧! alike. A punctuation name means the
physical key position, as labelled on a US layout, so `Mod+Slash` fires on the
same key everywhere. The full grammar is in
[`spec/shortcuts.md`](https://github.com/frappe/frappe-ui/blob/main/spec/shortcuts.md).

TypeScript checks the combo: an unknown key name or a stray character fails to
compile. In JavaScript it warns once and never fires.

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `combo` | `KeyboardShortcutCombo` | — | The key combination |
| `description` | `string` | — | Label in `KeyboardShortcutsDialog`. Shortcuts sharing one merge into a single row |
| `group` | `string` | `"General"` | Heading the shortcut is listed under |
| `handler` | `(e) => void` | — | Runs on keydown. Press mode |
| `onHold` | `(e) => void` | — | Runs once when the combo goes down. Hold mode |
| `onRelease` | `(e?) => void` | — | Runs when a held combo is released |
| `enabled` | `MaybeRefOrGetter<boolean>` | `true` | While `false` the shortcut is inert **and** hidden from the dialog |
| `preventDefault` | `boolean` | `true` | Call `preventDefault()` on the matched event |
| `allowInInput` | `boolean` | `false` | Fire while an input, textarea or contenteditable has focus |
| `allowInDialog` | `boolean` | `false` | Fire while focus is inside a `[role="dialog"]` element |

A registration is either press mode or hold mode. Press mode takes `handler`;
hold mode takes `onHold` and, usually, `onRelease`, and takes no `handler`.

```ts
useKeyboardShortcut({
  combo: 'Mod+Shift+L',
  description: 'Highlight blocks with client scripts',
  group: 'View',
  onHold: () => (highlight.value = true),
  onRelease: () => (highlight.value = false),
})
```

`onRelease` also runs when the component unmounts, or is deactivated inside a
`<KeepAlive>`, while the combo is still down. Without it the highlight above
would stay on, with no shortcut left to switch it off. A teardown carries no
event, so `onRelease` gets none: its parameter is optional, and a callback that
reads the event has to handle `undefined`.

### Two shortcuts on one combo

The last registration that is **enabled at the time of the keypress** wins.
`enabled` is resolved before precedence, so two registrations with mutually
exclusive guards both keep working. In development the library warns once per
combo, naming the shadowed shortcut and the active one.

### Showing them to the user

[`KeyboardShortcutsDialog`](../components/keyboardshortcutsdialog) renders
whatever is registered as a searchable cheat sheet. It reads the registry
itself, and its default slot hands the grouped shortcuts to an app that wants
its own layout.
