# KeyboardShortcutsDialog

A dialog that lists every shortcut registered with
[`useKeyboardShortcut`](../other/composables.md#usekeyboardshortcut), grouped
and searchable. Mount it once near the app root, and bind `v-model:open`,
because the dialog has no trigger of its own. Its rows come from the registry,
so it takes no content props.

## Default

<ComponentPreview name="KeyboardShortcutsDialog-Default" />

Two rules shape what the dialog shows:

- A shortcut whose `enabled` is `false` is inert **and** hidden. A shortcut the
  user cannot press is not advertised. Toggle read-only mode in the preview
  above to watch the Editing group leave.
- Shortcuts that share a group and a description merge into one row. The first
  combo is the row's combo; the rest render after a `/` as alternatives. Undo
  and Redo above are three registrations and two rows.

The dialog reads `enabled` each time it opens, and again whenever a shortcut
registers or unregisters. A getter that reads untracked state, such as
`document.activeElement`, is correct on every open.

Above `searchThreshold` rows a search field appears. It matches the text a row
draws as well as the name behind it, so a row for `Mod+Slash` answers to both
`/` and `slash`. The query clears when the dialog closes. The preview above lowers
`searchThreshold` to 3, because it has too few rows to pass the default of 20.

## Open it from a shortcut

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

`allowInDialog: true` lets the combo answer while the dialog holds focus, so the
same keys close it again. The handler toggles for that reason.

`Mod+Shift+Slash` is the `?` most apps use. The combo names the physical key,
not the character it types. See
[the combo grammar](https://github.com/frappe/frappe-ui/blob/main/spec/shortcuts.md).

## A custom help surface

<ComponentPreview name="KeyboardShortcutsDialog-CustomLayout" />

The default slot receives the grouped shortcuts, so an app can render its own
layout. The library exports no registry reader; this slot is the way in.

## Styling hooks

Every part carries a `data-slot` (P10). Target them from CSS instead of reaching
for a class prop:

| `data-slot`     | Element                                                    |
| --------------- | ---------------------------------------------------------- |
| `header`        | title row                                                  |
| `title`         | dialog title                                               |
| `search`        | the search field, when shown                               |
| `empty`         | the empty message; `data-state` is `empty` or `no-results` |
| `groups`        | the grid of groups                                         |
| `group`         | one group column                                           |
| `group-title`   | a group heading                                            |
| `shortcut`      | one row                                                    |
| `description`   | the row label                                              |
| `shortcut-keys` | the row's `KeyboardShortcut`                               |

<!-- @include: ./KeyboardShortcutsDialog.api.md -->
