<template>
  <div
    data-slot="list-cell"
    :role="context?.hasHeader.value ? 'cell' : undefined"
    class="flex min-w-0 items-center"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useListContext } from './list-context'

defineSlots<{
  /** The cell's content. */
  default?: () => unknown
}>()

const context = useListContext()
</script>
