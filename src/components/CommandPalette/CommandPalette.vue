<template>
  <Dialog
    v-model:open="open"
    size="xl"
    position="top"
    bare
    @after-leave="query = ''"
  >
    <template #default>
      <div>
        <Combobox nullable @update:model-value="select">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4.5">
              <span class="lucide-search size-4" aria-hidden="true" />
            </div>
            <ComboboxInput
              placeholder="Search"
              class="w-full border-none bg-transparent py-3 pl-11.5 pr-4.5 text-base text-ink-gray-8 placeholder-ink-gray-4 focus:ring-0"
              v-model="query"
              autocomplete="off"
            />
          </div>
          <ComboboxOptions
            class="max-h-96 overflow-auto border-t border-gray-100"
            static
            :hold="true"
          >
            <div
              class="mb-2 mt-4.5 first:mt-3"
              v-for="group in groups"
              :key="group.title"
            >
              <div
                class="mb-2.5 px-4.5 text-base text-ink-gray-5"
                v-if="!group.hideTitle"
              >
                {{ group.title }}
              </div>
              <ComboboxOption
                v-for="item in group.items"
                :key="item.name"
                v-slot="{ active }"
                :value="item"
                class="px-2.5"
                :disabled="item.disabled"
              >
                <component
                  :is="group.component ?? CommandPaletteItem"
                  :item="item"
                  :active="active"
                />
              </ComboboxOption>
            </div>
          </ComboboxOptions>
        </Combobox>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'
import Dialog from '../Dialog/Dialog.vue'
import CommandPaletteItem from './CommandPaletteItem.vue'
import { useKeyboardShortcut } from '../../composables/useKeyboardShortcut'
import type { CommandPaletteItemData, CommandPaletteProps } from './types'

defineOptions({ name: 'CommandPalette' })

withDefaults(defineProps<CommandPaletteProps>(), {
  groups: () => [],
})

const emit = defineEmits<{
  select: [item: CommandPaletteItemData]
}>()

const open = defineModel<boolean>('open', { default: false })
/** The search text. Filter `groups` against it. Cleared when the palette closes. */
const query = defineModel<string>('query', { default: '' })

function select(item: CommandPaletteItemData | null) {
  if (!item) return
  emit('select', item)
  open.value = false
}

// Cmd/Ctrl+K opens the palette. Fires while a normal input is focused (so it
// works from anywhere on the page), but not while the rich text editor has
// focus — Mod+K is also its own shortcut there.
useKeyboardShortcut({
  combo: 'Mod+K',
  description: 'Open command palette',
  allowInInput: true,
  enabled: () => !document.activeElement?.closest('.ProseMirror'),
  handler: () => {
    open.value = true
  },
})

// Escape-to-close is handled natively by Dialog (reka-ui DialogContent).
</script>
