<template>
  <!-- An inline-flex box sizes itself to its content, and the header's nowrap
       stops that content from ever reporting a narrower minimum. max-w-full is
       what caps it at the header's width, so the text below it has to shrink
       and can ellipsise instead of being clipped mid-word. -->
  <span
    class="inline-flex h-6 min-w-0 max-w-full items-center justify-center gap-1.5 align-middle"
  >
    <!-- Only the text truncates; the prefix keeps its natural size. -->
    <span v-if="$slots.prefix" class="flex shrink-0 items-center">
      <slot name="prefix" />
    </span>
    <span class="min-w-0 truncate leading-6">
      <slot>{{ title }}</slot>
    </span>
  </span>
</template>

<script setup lang="ts">
import type { PageHeaderMobileTitleProps } from './types'

defineProps<PageHeaderMobileTitleProps>()

defineSlots<{
  /** A leading glyph next to the title text — keeps its natural size while the text truncates. */
  prefix?: () => any
  /** Overrides `title` with custom markup. */
  default?: () => any
}>()
</script>
