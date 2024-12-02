<template>
  <div
    class="flex h-full w-full flex-col items-center justify-center text-base"
  >
    <slot>
      <div class="text-xl font-medium">{{ list.options.emptyState.title }}</div>
      <div class="mt-1 text-base text-ink-gray-5">
        {{ list.options.emptyState.description }}
      </div>
      <Button
        v-if="list.options.emptyState.button"
        v-bind="list.options.emptyState.button"
        class="mt-4"
      ></Button>
    </slot>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { Button } from '../Button'

const list = inject('list')
</script>
