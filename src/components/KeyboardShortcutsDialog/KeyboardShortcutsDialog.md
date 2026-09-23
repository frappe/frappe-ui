# KeyboardShortcutsDialog

A dialog that lists every shortcut registered with
[`useKeyboardShortcut`](../other/composables#usekeyboardshortcut), in groups,
with search.

<ComponentPreview name="KeyboardShortcutsDialog-Default" />

## Examples

### Custom help layout

An app draws its own list of shortcuts inside the dialog with the default
slot.

<ComponentPreview name="KeyboardShortcutsDialog-CustomLayout" />

## Behavior

### Setup

Mount the dialog once near the app root and bind `v-model:open`. The dialog
has no trigger of its own. Its rows come from the shortcut registry, so it
takes no content props.

### Opening from a shortcut

The preview at the top of this page registers this shortcut. Press
<kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>/</kbd> to open it.

```vue
<script setup lang="ts">
import { KeyboardShortcutsDialog, useKeyboardShortcut } from 'frappe-ui'
import { ref } from 'vue'

const open = ref(false)

useKeyboardShortcut({
  combo: 'Mod+Shift+Slash',
  description: 'Show keyboard shortcuts',
  group: 'General',
  allowInDialog: true,
  handler: () => (open.value = !open.value),
})
</script>

<template>
  <KeyboardShortcutsDialog v-model:open="open" />
</template>
```

`allowInDialog: true` lets the combo work while the dialog has focus, so the
same keys close it again. That is why the handler toggles.

`Mod+Shift+Slash` is the `?` most apps use. The combo names the physical key,
not the character it types. See
[the combo grammar](https://github.com/frappe/frappe-ui/blob/main/spec/shortcuts.md).

### Disabled shortcuts are hidden

A shortcut whose `enabled` is `false` does not run **and** does not show in the
dialog. A shortcut the user cannot press is not listed. In the preview at the
top, turn on read-only mode to see the Editing group go away.

The dialog reads `enabled` each time it opens, and again whenever a shortcut
registers or unregisters. A getter that reads untracked state, such as
`document.activeElement`, is correct on every open.

### Merged rows

Shortcuts that share a group and a description merge into one row. The first
combo is the row's combo, and the rest show after a `/` as alternatives. In
the preview at the top, Undo and Redo are three registrations and two rows.

### Search

When there are more rows than `searchThreshold`, a search field shows. The
default is 20. It matches the text a row shows and the key name behind it, so a
row for `Mod+Slash` matches both `/` and `slash`. The query clears when the
dialog closes. The preview at the top sets `searchThreshold` to 3, because it
has fewer than 20 rows.

### Custom layout

The default slot receives `{ groups }`: the enabled shortcuts, grouped and
merged. The library exports no other way to read the registry, so use this slot
for a custom help layout.

<!-- @include: ./KeyboardShortcutsDialog.api.md -->
