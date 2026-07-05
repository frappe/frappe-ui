<template>
  <div data-slot="list-header" role="row" class="h-8 text-sm text-ink-gray-5">
    <slot />
    <Transition
      enter-active-class="transition-transform duration-75 ease-out"
      leave-active-class="transition-transform duration-75 ease-out"
      enter-from-class="scale-0"
      leave-to-class="scale-0"
    >
      <div
        v-if="context?.selectable.value"
        data-slot="list-header-checkbox"
        role="checkbox"
        :aria-checked="ariaChecked"
        aria-label="Select all"
        tabindex="0"
        @click.stop.prevent="context.toggleSelectAll"
        @keydown.enter.prevent="context.toggleSelectAll"
        @keydown.space.prevent="context.toggleSelectAll"
      >
        <!-- Presentational; the wrapper div is the real role=checkbox control.
             See ListRowBase for why pointer-events-none matters. -->
        <Checkbox
          :modelValue="context.selectAllState.value === 'all'"
          :indeterminate="context.selectAllState.value === 'some'"
          tabindex="-1"
          aria-hidden="true"
          class="pointer-events-none"
        />
      </div>
    </Transition>
    <div
      data-slot="list-header-border"
      aria-hidden="true"
      class="border-b border-outline-gray-1"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import Checkbox from '../../components/Checkbox/Checkbox.vue'
import { useListContext } from './list-context'

const context = useListContext()

const ariaChecked = computed(() => {
  const state = context?.selectAllState.value
  if (state === 'all') return 'true'
  if (state === 'some') return 'mixed'
  return 'false'
})

// Header presence is the signal that flips the List into table semantics
// (role table/row/columnheader/cell) — there is no mode prop.
if (context) {
  context.hasHeader.value = true
  onBeforeUnmount(() => {
    context.hasHeader.value = false
  })
}
</script>
