<template>
  <ListboxGroup
    v-show="visible"
    as="div"
    data-slot="command-palette-group"
    class="mb-2 mt-4.5 first:mt-3"
  >
    <ListboxGroupLabel
      v-if="title"
      as="div"
      data-slot="command-palette-group-title"
      class="mb-2.5 px-4.5 text-base text-ink-gray-5"
    >
      {{ title }}
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
} from './context'
import type { CommandPaletteGroupProps } from './types'

defineOptions({ name: 'CommandPaletteGroup' })

defineProps<CommandPaletteGroupProps>()

defineSlots<{
  /** The group's `CommandPaletteItem`s. */
  default: () => any
}>()

const palette = useCommandPaletteContext()

const id = Symbol('command-palette-group')

provideCommandPaletteGroupContext({ id })

// `v-show`, not `v-if`: the items have to stay mounted to keep their
// registration, and they hide themselves one by one when the query filters
// them out. An empty group is therefore an already-empty box.
const visible = computed(() => palette?.groupHasVisibleItems(id) ?? true)
</script>
