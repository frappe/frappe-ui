<template>
  <ListboxContent
    as="div"
    data-slot="command-palette-list"
    :aria-label="palette?.title.value"
    class="min-h-0 overflow-y-auto overscroll-contain focus-visible:outline-none"
  >
    <slot />
  </ListboxContent>
</template>

<script setup lang="ts">
import { ListboxContent } from 'reka-ui'
import {
  provideCommandPaletteListContext,
  useCommandPaletteContext,
} from './context'

defineOptions({ name: 'CommandPaletteList' })

defineSlots<{
  /**
   * The palette's groups and items. This element is the listbox itself, and a
   * listbox owns options and groups only, so anything else belongs outside it.
   */
  default: () => any
}>()

const palette = useCommandPaletteContext()

if (import.meta.env.DEV && !palette) {
  console.warn(
    '[frappe-ui] CommandPaletteList has to render inside a CommandPalette.',
  )
}

provideCommandPaletteListContext()
</script>
