# KeyboardShortcutsModal & useShortcut

A composable + modal pair for registering, managing, and displaying keyboard
shortcuts across an application.

## useShortcut

Register one or more keyboard shortcuts inside a component. Shortcuts are
automatically removed when the component unmounts (or is deactivated in a
`<KeepAlive>` tree).

### Basic usage

```ts
import { useShortcut } from 'frappe-ui'

useShortcut({
  key: 's',
  ctrl: true,
  description: 'Save document',
  group: 'General',
  handler: () => save(),
})
```

### Multiple shortcuts at once

```ts
useShortcut([
  {
    key: 'z',
    ctrl: true,
    description: 'Undo',
    group: 'Edit',
    handler: () => undo(),
  },
  {
    key: 'z',
    ctrl: true,
    shift: true,
    description: 'Redo',
    group: 'Edit',
    handler: () => redo(),
  },
])
```

### Conditional shortcut

```ts
useShortcut({
  key: 'Delete',
  description: 'Delete selected block',
  group: 'Canvas',
  condition: () => !!selectedBlock.value,
  handler: () => deleteBlock(selectedBlock.value),
})
```

### Hold-to-activate mode

```ts
useShortcut({
  key: ' ',
  description: 'Hold for move mode',
  group: 'Tools',
  triggeredOn: 'hold',
  onHold: () => (mode.value = 'move'),
  onRelease: () => (mode.value = 'select'),
})
```

### ShortcutConfig options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `key` | `string` | — | Key to listen for (e.g. `"s"`, `"Escape"`, `"ArrowUp"`) |
| `ctrl` | `boolean` | `false` | Require Ctrl (or ⌘ on Mac) |
| `shift` | `boolean` | `false` | Require Shift |
| `description` | `string` | — | Human-readable label shown in the shortcuts modal |
| `group` | `string` | `"General"` | Group name used to categorise shortcuts |
| `triggeredOn` | `"press" \| "hold"` | `"press"` | When to fire the handler |
| `handler` | `(e) => void` | — | Called on keydown when the shortcut matches |
| `onHold` | `(e) => void` | — | Called on first keydown while held (`triggeredOn: "hold"`) |
| `onRelease` | `(e) => void` | — | Called on keyup when the held combo is released |
| `preventDefault` | `boolean` | `true` | Prevent the browser's default action |
| `allowInInput` | `boolean` | `false` | Allow the shortcut to fire inside inputs / textareas |
| `condition` | `() => boolean` | — | Shortcut only fires when this returns `true` |

---

## KeyboardShortcutsModal

A dialog that lists all currently active shortcuts, grouped and searchable.
Reads its data from the global `useShortcut` registry automatically.

### Mount once in your app root

```vue
<template>
  <KeyboardShortcutsModal ref="shortcutsModal" />
</template>

<script setup lang="ts">
import { KeyboardShortcutsModal } from 'frappe-ui'
import { ref } from 'vue'

const shortcutsModal = ref<InstanceType<typeof KeyboardShortcutsModal> | null>(null)

function openShortcuts() {
  if (shortcutsModal.value) shortcutsModal.value.show = true
}
</script>
```

### Open via keyboard shortcut

```ts
import { useShortcut, KeyboardShortcutsModal } from 'frappe-ui'
import { ref } from 'vue'

const shortcutsModal = ref<InstanceType<typeof KeyboardShortcutsModal> | null>(null)

useShortcut({
  key: '?',
  description: 'Show keyboard shortcuts',
  group: 'General',
  handler: () => {
    if (shortcutsModal.value) shortcutsModal.value.show = true
  },
})
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Keyboard Shortcuts"` | Dialog title |
| `paddingTop` | `string` | `"5vh"` | Top padding when dialog position is `top` |
| `searchThreshold` | `number` | `20` | Show the search input when this many shortcuts are registered |

### Exposed

| Name | Type | Description |
|------|------|-------------|
| `show` | `Ref<boolean>` | Set to `true` to open the modal |

---

## getActiveShortcuts

Lower-level helper that returns a computed list of all currently registered
shortcuts whose conditions are met. Duplicate registrations with the same
group + description + modifiers are merged into a single entry with multiple
`keys`. This is what `KeyboardShortcutsModal` consumes internally.

```ts
import { getActiveShortcuts } from 'frappe-ui'

const shortcuts = getActiveShortcuts()
// shortcuts.value → ActiveShortcut[]
```

---

## formatShortcutLabel

Returns a short human-readable string for a shortcut (e.g. `"⌘ S"` on Mac or
`"Ctrl + S"` on Windows).

```ts
import { formatShortcutLabel } from 'frappe-ui'

const label = formatShortcutLabel({ key: 's', ctrl: true })
// → "⌘ S" (macOS) or "Ctrl + S" (Windows/Linux)
```
