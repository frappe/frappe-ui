<template>
  <ListboxGroup
    v-show="visible"
    as="div"
    data-slot="command-palette-group"
    class="mb-2 mt-4.5 first:mt-3"
  >
    <ListboxGroupLabel
      v-if="label"
      as="div"
      data-slot="command-palette-group-label"
      class="mb-2.5 px-4.5 text-base text-ink-gray-5"
    >
      {{ label }}
    </ListboxGroupLabel>
    <slot />
  </ListboxGroup>
</template>

<script setup lang="ts">
import { ListboxGroup, ListboxGroupLabel } from 'reka-ui'
import { computed } from 'vue'
import {
  provideCommandPaletteGroupContext,
  useCommandPaletteContext,
  useCommandPaletteListContext,
} from './context'
import type { CommandPaletteGroupProps } from './types'

defineOptions({ name: 'CommandPaletteGroup' })

defineProps<CommandPaletteGroupProps>()

defineSlots<{
  /** The group's `CommandPaletteItem`s. */
  default: () => any
}>()

const palette = useCommandPaletteContext()
const list = useCommandPaletteListContext()

if (import.meta.env.DEV && !palette) {
  console.warn(
    '[frappe-ui] CommandPaletteGroup has to render inside a CommandPalette.',
  )
} else if (import.meta.env.DEV && !list) {
  // Reka builds the listbox from `CommandPaletteList`. Outside it there is no
  // listbox at all, so the palette renders and then does nothing.
  console.warn(
    '[frappe-ui] CommandPaletteGroup has to render inside a CommandPaletteList.',
  )
}

const id = Symbol('command-palette-group')

provideCommandPaletteGroupContext({ id })

// `v-show`, not `v-if`: the items have to stay mounted to keep their
// registration, and they hide themselves one by one when the query filters
// them out. An empty group is therefore an already-empty box.
const visible = computed(() => palette?.groupHasVisibleItems(id) ?? true)
</script>
