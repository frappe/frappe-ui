<template>
  <span
    class="inline-flex h-6 min-w-0 items-center justify-center gap-1.5 align-middle"
  >
    <slot name="icon" />
    <span class="min-w-0 truncate leading-6">
      <slot>{{ title }}</slot>
    </span>
  </span>
</template>

<script setup lang="ts">
import type { PageHeaderMobileTitleProps } from './types'

defineProps<PageHeaderMobileTitleProps>()
</script>
