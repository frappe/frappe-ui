<script setup lang="ts">
import { ref } from 'vue'
import { Button, KeyboardShortcutsDialog, useKeyboardShortcut } from 'frappe-ui'

const open = ref(false)
const readOnly = ref(false)

// Every registration lists itself in the dialog. `enabled: false` makes a
// shortcut inert and hides its row, so read-only mode drops the editing group.
// "Redo" is registered twice and renders as one row with two combos.
//
// This story runs inside the docs page, not in a frame. Every row that does
// nothing sets `preventDefault: false`, so the browser's own Save, Undo and
// Zoom shortcuts keep working for the reader.
useKeyboardShortcut([
  {
    combo: 'Mod+Shift+Slash',
    description: 'Show keyboard shortcuts',
    group: 'General',
    allowInDialog: true,
    handler: () => (open.value = !open.value),
  },
  {
    combo: 'Mod+S',
    description: 'Save',
    group: 'General',
    preventDefault: false,
    handler: () => {},
  },
  {
    combo: 'Mod+Z',
    description: 'Undo',
    group: 'Editing',
    enabled: () => !readOnly.value,
    preventDefault: false,
    handler: () => {},
  },
  {
    combo: 'Mod+Shift+Z',
    description: 'Redo',
    group: 'Editing',
    enabled: () => !readOnly.value,
    preventDefault: false,
    handler: () => {},
  },
  {
    combo: 'Mod+Y',
    description: 'Redo',
    group: 'Editing',
    enabled: () => !readOnly.value,
    preventDefault: false,
    handler: () => {},
  },
  {
    combo: 'Mod+Equal',
    description: 'Zoom in',
    group: 'View',
    preventDefault: false,
    handler: () => {},
  },
  {
    combo: 'Mod+Minus',
    description: 'Zoom out',
    group: 'View',
    preventDefault: false,
    handler: () => {},
  },
])
</script>

<template>
  <div class="flex items-center gap-3">
    <Button label="Open shortcuts" @click="open = true" />
    <Button
      :label="readOnly ? 'Leave read-only mode' : 'Enter read-only mode'"
      @click="readOnly = !readOnly"
    />
    <!-- A story has far fewer rows than the default `searchThreshold` of 20.
         Lower it so the search field shows here. -->
    <KeyboardShortcutsDialog v-model:open="open" :search-threshold="3" />
  </div>
</template>
