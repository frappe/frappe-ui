<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  KeyboardShortcut,
  KeyboardShortcutsDialog,
  useKeyboardShortcut,
} from 'frappe-ui'

const open = ref(false)

// The default slot receives the grouped, enabled shortcuts, so an app can
// render its own help surface without reading the registry itself. Both rows
// have an empty handler, so both set `preventDefault: false` and leave the
// docs page they run in alone.
//
// Alt pairs with a digit here, not a letter: macOS rewrites `event.key` while
// Option is held, so an `Alt+<letter>` combo can miss there.
useKeyboardShortcut([
  {
    combo: 'Mod+Alt+Digit1',
    description: 'New page',
    group: 'Pages',
    preventDefault: false,
    handler: () => {},
  },
  {
    combo: 'Mod+Alt+Digit2',
    description: 'Duplicate page',
    group: 'Pages',
    preventDefault: false,
    handler: () => {},
  },
])
</script>

<template>
  <Button label="Open shortcuts" @click="open = true" />
  <KeyboardShortcutsDialog v-model:open="open" v-slot="{ groups }">
    <div class="space-y-4">
      <section v-for="group in groups" :key="group.name">
        <h4 class="mb-2 text-sm-medium text-ink-gray-5">{{ group.name }}</h4>
        <div
          v-for="shortcut in group.shortcuts"
          :key="shortcut.description"
          class="flex items-center justify-between py-1"
        >
          <span class="text-p-base text-ink-gray-7">
            {{ shortcut.description }}
          </span>
          <KeyboardShortcut
            :combo="shortcut.combo"
            :alt-combos="shortcut.altCombos"
            bg
          />
        </div>
      </section>
    </div>
  </KeyboardShortcutsDialog>
</template>
