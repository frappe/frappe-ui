<template>
  <span class="truncate text-lg font-semibold text-ink-gray-9">
    <slot>{{ title }}</slot>
  </span>
</template>

<script setup lang="ts">
import type { PageHeaderTitleProps } from './types'

defineProps<PageHeaderTitleProps>()

defineSlots<{
  /** Overrides `title` with custom markup. */
  default?: () => any
}>()
</script>
