<template>
  <span class="truncate text-lg font-semibold text-ink-gray-9">
    <slot>{{ title }}</slot>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  /** Title text. Overridden by the default slot. */
  title?: string
}>()
</script>
