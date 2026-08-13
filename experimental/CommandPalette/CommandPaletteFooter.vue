<template>
  <div
    data-slot="command-palette-footer"
    class="flex shrink-0 items-center gap-4 border-t border-outline-gray-1 px-4.5 py-2 text-sm text-ink-gray-6 dark:border-outline-gray-2"
  >
    <slot v-bind="slotProps" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCommandPaletteContext } from './context'
import type { CommandPaletteFooterSlotProps } from './types'

defineOptions({ name: 'CommandPaletteFooter' })

defineSlots<{
  /** The footer's content. Receives the active value, so a hint can follow it. */
  default: (props: CommandPaletteFooterSlotProps) => any
}>()

const palette = useCommandPaletteContext()

if (import.meta.env.DEV && !palette) {
  console.warn(
    '[frappe-ui] CommandPaletteFooter has to render inside a CommandPalette.',
  )
}

const slotProps = computed<CommandPaletteFooterSlotProps>(() => ({
  active: palette?.activeValue.value,
}))
</script>
