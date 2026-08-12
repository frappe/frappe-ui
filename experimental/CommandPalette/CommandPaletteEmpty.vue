<template>
  <div
    v-if="empty"
    data-slot="command-palette-empty"
    class="px-4.5 py-8 text-center text-base text-ink-gray-6"
  >
    <slot v-bind="slotProps">No results for "{{ slotProps.query }}"</slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCommandPaletteContext } from './context'
import type { CommandPaletteEmptySlotProps } from './types'

defineOptions({ name: 'CommandPaletteEmpty' })

defineSlots<{
  /** The message. Receives the query so it can quote what the user typed. */
  default: (props: CommandPaletteEmptySlotProps) => any
}>()

const palette = useCommandPaletteContext()

const empty = computed(() => palette?.empty.value ?? false)

const slotProps = computed<CommandPaletteEmptySlotProps>(() => ({
  query: palette?.query.value ?? '',
}))
</script>
