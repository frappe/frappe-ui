<template>
  <div class="mt-1 grid grid-cols-6 gap-1">
    <Tooltip
      v-for="swatch in swatches"
      :key="swatch.label"
      class="flex"
      :text="swatch.label"
    >
      <button
        type="button"
        :aria-label="swatch.label"
        :aria-pressed="swatch.value === active"
        class="flex h-5 w-5 items-center justify-center rounded border text-base"
        :class="[
          swatch.class,
          variant === 'highlight' ? 'text-ink-gray-9' : '',
          swatch.value === active
            ? 'ring-2 ring-outline-gray-3 ring-offset-1'
            : '',
        ]"
        @click="emit('select', swatch.value)"
      >
        A
      </button>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import Tooltip from '#components/Tooltip/Tooltip.vue'
import type { ColorSwatch } from './swatches'

defineProps<{
  /** Swatches to render (first entry is usually the "Default" / unset swatch). */
  swatches: ColorSwatch[]
  /** The currently-active palette value, or `null` when unset/default. */
  active: string | null
  /** Selects the active-ring affordance and text contrast. */
  variant: 'text' | 'highlight'
}>()

const emit = defineEmits<{
  (e: 'select', value: string | null): void
}>()
</script>
