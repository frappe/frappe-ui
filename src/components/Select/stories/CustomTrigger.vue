<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'frappe-ui'

const frequency = ref('mentions')

const options = [
  { label: 'for every message', value: 'all' },
  { label: 'for @mentions only', value: 'mentions' },
  { label: 'never', value: 'never' },
]
</script>

<template>
  <!--
    An inline trigger reads as part of the sentence rather than as a form
    control. `#prefix` / `#suffix` can't get here — they add to the default
    trigger shell, while `#trigger` replaces it. `variant="ghost"` and
    `size="sm"` keep the shell from drawing a border or a tall row.
  -->
  <p class="max-w-md text-base text-ink-gray-7">
    Notify me
    <Select
      v-model="frequency"
      :options="options"
      variant="ghost"
      size="sm"
      class="!px-0"
    >
      <template #trigger="{ selectedOption, open }">
        <span
          :class="[
            'rounded-4 px-1 -mx-1 font-medium text-ink-gray-8 decoration-outline-gray-3 underline-offset-4 transition-colors duration-150',
            open ? 'bg-surface-gray-3' : 'underline hover:bg-surface-gray-3',
          ]"
        >
          {{ selectedOption?.label }}
        </span>
      </template>
    </Select>
    in this project.
  </p>
</template>
