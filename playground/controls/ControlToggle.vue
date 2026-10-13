<template>
  <!-- A labelled off/on setting: two equal halves, the chosen one on a gray
       pill. -->
  <div
    class="flex h-12 shrink-0 items-center gap-4 rounded-6 border border-outline-gray-1 px-4 py-2.5"
    :class="disabled && 'opacity-50'"
  >
    <span :id="labelId" class="truncate text-base text-ink-gray-6">{{
      label
    }}</span>
    <!-- Fixed width, pushed right: every row's off/on pair lines up with the
         next one, and with the values of the picker rows. -->
    <div
      role="radiogroup"
      :aria-labelledby="labelId"
      :aria-disabled="disabled || undefined"
      class="ml-auto grid h-7 w-40 shrink-0 grid-cols-2"
    >
      <button
        v-for="option in options"
        :key="option.label"
        type="button"
        role="radio"
        :aria-checked="model === option.value"
        :disabled="disabled"
        class="rounded-5 text-base outline-none transition-colors focus-visible:focus-ring disabled:cursor-not-allowed"
        :class="
          model === option.value
            ? 'bg-surface-gray-3 text-ink-gray-8'
            : 'text-ink-gray-6 enabled:hover:text-ink-gray-8'
        "
        @click="model = option.value"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

defineProps<{ label: string; disabled?: boolean }>()

const model = defineModel<boolean>({ required: true })

const labelId = useId()

const options = [
  { label: 'off', value: false },
  { label: 'on', value: true },
]
</script>
