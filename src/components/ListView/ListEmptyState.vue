<template>
  <div
    class="flex h-full w-full flex-col items-center justify-center text-base"
  >
    <slot>
      <div class="text-xl font-medium">
        {{ __(list.options.emptyState.title) }}
      </div>
      <div class="mt-1 text-base text-ink-gray-5">
        {{ __(list.options.emptyState.description) }}
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
import { __ } from '../../utils/translation'
import { inject } from 'vue'
import { Button } from '../Button'

const list = inject('list')
</script>
