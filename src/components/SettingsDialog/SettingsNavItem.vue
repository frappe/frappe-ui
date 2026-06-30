<template>
  <button
    type="button"
    class="flex h-7 w-full items-center gap-2 rounded px-2 text-left text-base text-ink-gray-7"
    :class="
      active ? 'bg-surface-elevation-3 shadow-sm' : 'hover:bg-surface-gray-2'
    "
  >
    <slot name="prefix" />
    <span class="min-w-0 flex-1 truncate"><slot /></span>
    <slot name="suffix" />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  /** Highlights the item as the current tab. */
  active?: boolean
}>()

defineSlots<{
  /** Item label. */
  default?: () => any
  /** Leading icon or avatar. */
  prefix?: () => any
  /** Trailing badge / count. */
  suffix?: () => any
}>()
</script>
