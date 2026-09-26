# Composables

Composition API helpers that don't belong to one component: page title, color
scheme, shell scrolling and keyboard shortcuts.

## usePageMeta

Keeps `document.title` and the favicon in sync with reactive state. Call it once
per page component. It watches the function you pass and applies the result
again whenever a dependency changes.

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

The function returns `null` or `undefined` to skip an update, or a `PageMeta`
object:

| Field   | Type     | Description                                           |
| ------- | -------- | ----------------------------------------------------- |
| `title` | `string` | Sets `document.title`.                                |
| `icon`  | `string` | URL of a favicon image.                               |
| `emoji` | `string` | Uses the emoji as the favicon. Wins over `icon`.      |

With neither `icon` nor `emoji`, the page's original favicon comes back.

Inside a component, the watcher stops on unmount, so there is nothing to clean
up. `usePageMeta` also returns a stop function, for calls outside a component
such as a router hook or a plain module:

```js
const stop = usePageMeta(() => ({ title: 'Loading…' }))
// later
stop()
```

## useColorScheme

Reads and sets the app's light or dark preference. Every caller shares one
state. The first call restores the saved preference and starts following the OS
setting, so there is nothing to install.

```vue
<script setup>
import { useColorScheme } from 'frappe-ui'

const { colorScheme, resolvedColorScheme, setColorScheme, toggleColorScheme } =
  useColorScheme()
</script>

<template>
  <button @click="toggleColorScheme">
    {{ resolvedColorScheme === 'dark' ? 'Light mode' : 'Dark mode' }}
  </button>
</template>
```

| Member                  | Type                                     | Description                                                                                                                  |
| ----------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `colorScheme`           | `Ref<'light' \| 'dark' \| 'system'>`     | The selected preference. Read-only: change it with `setColorScheme`, which also updates `<html data-theme>` and the saved value. |
| `resolvedColorScheme`   | `Ref<'light' \| 'dark'>`                 | The scheme on screen. Under `system` it follows the OS. Read this for a sun or moon icon, or an image per scheme.            |
| `setColorScheme(scheme)` | `(scheme) => void`                      | Selects a preference, sets `data-theme`, and saves it.                                                                       |
| `toggleColorScheme()`   | `() => void`                             | Switches to the opposite of what is on screen. Under `system` on a dark OS it selects `light`.                               |

Switching schemes would otherwise animate every element with a CSS transition
at the same time, which looks like a flash. To prevent it, `useColorScheme` adds
a `no-transition` class to `<html>` for the two frames around the switch. The
CSS rule for that class is in `frappe-ui/style.css`. Apps that don't load that
stylesheet still switch correctly, but with the animation.

## useResolvedColorScheme

Returns the current `'light' | 'dark'` scheme without setting it. It reads the
document and follows changes, and it writes nothing.

```vue
<script setup>
import { useResolvedColorScheme } from 'frappe-ui'

const scheme = useResolvedColorScheme()
</script>

<template>
  <img :src="scheme === 'dark' ? darkShot : lightShot" alt="" />
</template>
```

Use it when something else already sets `data-theme`: an app that sets its own
theme before the first paint, a page embedded in another app, or a demo in an
iframe. `useColorScheme()` would be a second writer of that attribute and of the
`theme` storage key, because its first call applies the saved preference.

- It returns `Readonly<Ref<'light' | 'dark'>>` directly, not an object.
- It reads `<html data-theme>` first, then Tailwind's `dark` class, then the
  OS setting, and reacts to all three.
- It writes no attribute, class or `localStorage` key, and it does not start
  `useColorScheme`'s shared state.
- Outside the browser it returns `light`.

When your app owns the scheme, read `useColorScheme().resolvedColorScheme`
instead. It is the same value.

## shellScrollContainer / useShellScrolled

`shellScrollContainer` is a computed ref to the scroll element of the mounted
[`DesktopShell` or `MobileShell`](../components/desktopshell), or `null` when
neither is mounted. Read `scrollTop` from it, or call `scrollTo` or `scrollBy`,
from anywhere: a component, a `vue-router` `scrollBehavior`, or a navigation
guard.

```vue
<script setup>
import { shellScrollContainer } from 'frappe-ui'

function scrollToTop() {
  shellScrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
```

`useShellScrolled` returns whether that container is scrolled past a threshold.
Use it to show a header border or shadow on scroll. It follows the active shell
when the layout switches between desktop and mobile.

```vue
<script setup>
import { useShellScrolled } from 'frappe-ui'

const scrolled = useShellScrolled({ threshold: 12 })
</script>

<template>
  <header :data-scrolled="scrolled">…</header>
</template>
```

`threshold` is required, in pixels. It has no default because no single value
suits every layout: the old 200px default made header borders appear late.

The value comes from the nearest shell above the caller. A shell provides its
own scroll element to its children, so a page inside one reads that shell even
while another shell is still mounted. A caller outside any shell reads the
globally registered shell instead.

Without a mounted shell, `scrolled` stays `false` and the composable warns once
in development.

## useKeyboardShortcut

Registers a global keyboard shortcut while the calling component is mounted. It
adds and removes the `keydown` listener for you, and returns nothing.

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

A combo is `Mod+Ctrl+Alt+Shift+<Key>`. The type requires that order, but the
matcher accepts the modifiers in any order.

| Modifier | Means |
| --- | --- |
| `Mod` | Cmd on macOS, Ctrl elsewhere |
| `Ctrl` | Control on every platform |
| `Alt` | Alt, Option on macOS |
| `Shift` | Shift |

Digits and punctuation use a key **name**, not the character: `Mod+Slash`, not
`Mod+/`. `+` separates the parts, so `Mod++` would never fire. The names are
`Digit0`–`Digit9`, `Plus`, `Minus`, `Equal`, `Slash`, `Backslash`, `Backtick`,
`Comma`, `Period`, `Semicolon`, `Quote`, `BracketLeft`, `BracketRight`.

`Plus` is the keypad `+`. A normal keyboard types `+` with Shift, so ⌘+ is
`Mod+Shift+Equal`.

Letters, function keys and named keys (`Escape`, `Enter`, `Space`, `ArrowUp`, …)
match `event.key`. Digits and punctuation match `event.code`, so
`Mod+Shift+Digit1` fires on both ⌘⇧1 and ⌘⇧!. A punctuation name means the
physical key position on a US layout, so `Mod+Slash` fires on the same key on
every layout. The full grammar is in
[`spec/shortcuts.md`](https://github.com/frappe/frappe-ui/blob/main/spec/shortcuts.md).

TypeScript checks the combo: an unknown key name or a stray character fails to
compile. In JavaScript it warns once and never fires.

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `combo` | `KeyboardShortcutCombo` | none | The key combination. |
| `description` | `string` | none | Label in `KeyboardShortcutsDialog`. Shortcuts with the same label share one row. |
| `group` | `string` | `"General"` | Heading the shortcut is listed under. |
| `handler` | `(e) => void` | none | Runs on keydown. Press mode. |
| `onHold` | `(e) => void` | none | Runs once when the combo goes down. Hold mode. |
| `onRelease` | `(e?) => void` | none | Runs when a held combo is released. |
| `enabled` | `MaybeRefOrGetter<boolean>` | `true` | While `false`, the shortcut does nothing **and** is hidden from the dialog. |
| `preventDefault` | `boolean` | `true` | Call `preventDefault()` on the matched event. |
| `allowInInput` | `boolean` | `false` | Fire while an input, textarea or contenteditable has focus. |
| `allowInDialog` | `boolean` | `false` | Fire while focus is inside a `[role="dialog"]` element. |

A shortcut uses either press mode or hold mode. Press mode takes `handler`.
Hold mode takes `onHold` and usually `onRelease`, and no `handler`.

```ts
useKeyboardShortcut({
  combo: 'Mod+Shift+L',
  description: 'Highlight blocks with client scripts',
  group: 'View',
  onHold: () => (highlight.value = true),
  onRelease: () => (highlight.value = false),
})
```

`onRelease` also runs if the component unmounts, or is deactivated inside a
`<KeepAlive>`, while the combo is still held. Without this, the highlight above
would stay on with no shortcut left to turn it off. In that case there is no
key event, so `onRelease` gets no argument: its parameter is optional, and a
callback that reads the event must handle `undefined`.

### Two shortcuts on one combo

The last registration that is **enabled at the time of the keypress** wins.
`enabled` is checked first, so two registrations with opposite conditions both
work. In development the library warns once per combo, naming the hidden
shortcut and the active one.

### Showing them to the user

[`KeyboardShortcutsDialog`](../components/keyboardshortcutsdialog) shows every
registered shortcut as a searchable list. It reads the registry itself, and its
default slot gives the grouped shortcuts to an app that wants its own layout.
