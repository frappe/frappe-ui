<script setup lang="ts">
import { ref } from 'vue'
import { Button, KeyboardShortcut, useKeyboardShortcut } from 'frappe-ui'
import {
  CommandPalette,
  CommandPaletteEmpty,
  CommandPaletteFooter,
  CommandPaletteGroup,
  CommandPaletteInput,
  CommandPaletteList,
  CommandPaletteItem,
} from '..'
import type { CommandPaletteValue } from '..'

// The client filter runs by default, so this list is written once and the
// palette narrows it as the user types.
const pages = [
  { name: 'inbox', title: 'Inbox', icon: 'lucide-inbox', keywords: ['mail'] },
  { name: 'people', title: 'People', icon: 'lucide-users' },
  { name: 'settings', title: 'Settings', icon: 'lucide-settings' },
]

const actions = [
  {
    name: 'new-task',
    title: 'New task',
    icon: 'lucide-plus',
    combo: 'Mod+N',
  },
  {
    name: 'new-note',
    title: 'New note',
    icon: 'lucide-file-text',
    combo: 'Mod+Shift+N',
  },
]

const open = ref(false)
const picked = ref('')

// The palette no longer registers a shortcut. The app decides when Mod+K
// belongs to it.
useKeyboardShortcut({
  combo: 'Mod+K',
  description: 'Open command palette',
  allowInInput: true,
  handler: () => (open.value = true),
})

// `select` hands back exactly the object the item carried, typed as the
// palette's value union, so the handler narrows it.
function select(value: CommandPaletteValue) {
  picked.value = (value as { title: string }).title
}
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <Button @click="open = true">Open command palette (or press Mod+K)</Button>
    <p v-if="picked" class="text-p-sm text-ink-gray-6">Picked: {{ picked }}</p>

    <CommandPalette v-model:open="open" @select="select">
      <CommandPaletteInput placeholder="Search commands" />

      <CommandPaletteList>
        <CommandPaletteGroup label="Pages">
          <CommandPaletteItem
            v-for="page in pages"
            :key="page.name"
            :value="page"
            :keywords="page.keywords"
          >
            <template #prefix>
              <span :class="[page.icon, 'mr-3 size-4 text-ink-gray-7']" />
            </template>
            {{ page.title }}
          </CommandPaletteItem>
        </CommandPaletteGroup>

        <CommandPaletteGroup label="Actions">
          <CommandPaletteItem
            v-for="action in actions"
            :key="action.name"
            :value="action"
          >
            <template #prefix>
              <span :class="[action.icon, 'mr-3 size-4 text-ink-gray-7']" />
            </template>
            {{ action.title }}
            <template #suffix>
              <KeyboardShortcut :combo="action.combo" />
            </template>
          </CommandPaletteItem>
        </CommandPaletteGroup>
      </CommandPaletteList>

      <CommandPaletteEmpty v-slot="{ query }">
        Nothing matches "{{ query }}"
      </CommandPaletteEmpty>

      <CommandPaletteFooter>
        <KeyboardShortcut combo="Enter" /> to run
        <KeyboardShortcut combo="Escape" /> to close
      </CommandPaletteFooter>
    </CommandPalette>
  </div>
</template>
