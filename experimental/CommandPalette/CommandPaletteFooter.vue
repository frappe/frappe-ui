<template>
  <div
    ref="root"
    data-slot="command-palette-footer"
    class="sticky bottom-0 z-10 flex items-center gap-4 border-t border-outline-gray-1 bg-surface-elevation-1 px-4.5 py-2 text-sm text-ink-gray-6 dark:border-outline-gray-2"
  >
    <slot v-bind="slotProps" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue'
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

// The footer sits over the bottom edge of the scroll region, so the palette
// has to know how tall it is to keep a row from parking behind it. A caller
// is free to draw two lines here, so it is measured, never assumed.
const root = useTemplateRef<HTMLElement>('root')
let unregisterSticky: (() => void) | undefined

onMounted(() => {
  if (root.value)
    unregisterSticky = palette?.registerSticky('bottom', root.value)
})

onUnmounted(() => unregisterSticky?.())

const slotProps = computed<CommandPaletteFooterSlotProps>(() => ({
  active: palette?.activeValue.value,
}))
</script>
