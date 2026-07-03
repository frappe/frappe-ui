<template>
  <div
    data-slot="list-header-cell"
    role="columnheader"
    class="flex min-w-0 items-center gap-1"
  >
    <span v-if="$slots.prefix" class="shrink-0">
      <slot name="prefix" />
    </span>
    <span class="truncate"><slot /></span>
    <span v-if="$slots.suffix" class="shrink-0">
      <slot name="suffix" />
    </span>
  </div>
</template>

<script setup lang="ts">
defineSlots<{
  /** Column label. */
  default?: () => unknown
  /** Leading adornment, rendered before the label. */
  prefix?: () => unknown
  /** Trailing adornment, rendered after the label. */
  suffix?: () => unknown
}>()
</script>
