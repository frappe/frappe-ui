<template>
  <!--
    The region is mounted whether or not it holds a message. The focus never
    leaves the field, and the message is not a row the keyboard can reach, so
    a screen reader only hears it as a live region. A region that appears
    together with its first message is announced by some readers and not by
    others.
  -->
  <div role="status">
    <div
      v-if="empty"
      v-bind="$attrs"
      data-slot="command-palette-empty"
      class="px-4.5 py-8 text-center text-base text-ink-gray-6"
    >
      <slot v-bind="slotProps">{{ message }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCommandPaletteContext } from './context'
import type { CommandPaletteEmptySlotProps } from './types'

defineOptions({ name: 'CommandPaletteEmpty', inheritAttrs: false })

defineSlots<{
  /** The message. Receives the query so it can quote what the user typed. */
  default: (props: CommandPaletteEmptySlotProps) => any
}>()

const palette = useCommandPaletteContext()

if (import.meta.env.DEV && !palette) {
  console.warn(
    '[frappe-ui] CommandPaletteEmpty has to render inside a CommandPalette.',
  )
}

const empty = computed(() => palette?.empty.value ?? false)

const slotProps = computed<CommandPaletteEmptySlotProps>(() => ({
  query: palette?.query.value ?? '',
}))

// A palette with no rows at all is empty too, so the default cannot assume
// the query is what hid them and quote it back.
const message = computed(() =>
  slotProps.value.query
    ? `No results for "${slotProps.value.query}"`
    : 'No results',
)
</script>
