<template>
  <div
    data-slot="command-palette-input"
    class="flex shrink-0 items-center gap-3 border-b border-outline-gray-1 px-4.5 dark:border-outline-gray-2"
  >
    <slot name="prefix">
      <span class="lucide-search size-4 shrink-0 text-ink-gray-6" />
    </slot>
    <ListboxFilter
      v-model="query"
      as="input"
      auto-focus
      autocomplete="off"
      :placeholder="placeholder"
      class="w-full border-none bg-transparent py-3 px-0 text-base text-ink-gray-8 placeholder-ink-gray-4 focus:ring-0"
      v-bind="$attrs"
    />
    <slot name="suffix" />
  </div>
</template>

<script setup lang="ts">
import { ListboxFilter } from 'reka-ui'
import { computed } from 'vue'
import { useCommandPaletteContext } from './context'
import type { CommandPaletteInputProps } from './types'

defineOptions({ name: 'CommandPaletteInput', inheritAttrs: false })

withDefaults(defineProps<CommandPaletteInputProps>(), {
  placeholder: 'Search',
})

defineSlots<{
  /** Replaces the leading search icon. */
  prefix?: () => any
  /** Trailing content, after the field. */
  suffix?: () => any
}>()

const palette = useCommandPaletteContext()

if (import.meta.env.DEV && !palette) {
  console.warn(
    '[frappe-ui] CommandPaletteInput has to render inside a CommandPalette.',
  )
}

// Writes go through the palette's `query` model, so `v-model:query` on the
// parent stays the single source of truth.
const query = computed({
  get: () => palette?.query.value ?? '',
  set: (value: string) => {
    if (palette) palette.query.value = value
  },
})
</script>
