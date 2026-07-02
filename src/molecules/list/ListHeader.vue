<template>
  <div data-slot="list-header" role="row" class="h-8 text-sm text-ink-gray-5">
    <slot />
    <div
      data-slot="list-header-border"
      aria-hidden="true"
      class="border-b border-outline-gray-1"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useListContext } from './list-context'

const context = useListContext()

// Header presence is the signal that flips the List into table semantics
// (role table/row/columnheader/cell) — there is no mode prop.
if (context) {
  context.hasHeader.value = true
  onBeforeUnmount(() => {
    context.hasHeader.value = false
  })
}
</script>
