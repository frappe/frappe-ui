<template>
  <div v-if="props.label || props.hint" class="min-w-50 space-y-[10px]">
    <div class="flex items-baseline justify-between">
      <span v-if="props.label" class="text-base font-medium text-gray-800">{{
        props.label
      }}</span>
      <!-- Empty for alignment -->
      <span v-else></span>

      <span
        class="self-end text-base font-medium text-gray-500"
        v-if="props.hint"
        >{{ props.value }}%</span
      >
    </div>

    <!-- Progress Bar -->
    <div
      class="relative overflow-hidden rounded-xl bg-gray-100"
      :class="indicatorContainerClasses"
    >
      <div
        class="h-full bg-gray-900"
        :style="`width: ${props.value}%`"
        aria-valuemax="100"
        :aria-valuenow="props.value"
        role="progressbar"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity'

interface ProgressProps {
  value: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  hint?: boolean
}

const props = withDefaults(defineProps<ProgressProps>(), {
  size: 'md',
  hint: false,
})

const indicatorContainerClasses = computed(() => {
  return {
    sm: 'h-[2px]',
    md: 'h-1',
    lg: 'h-2',
    xl: 'h-3',
  }[props.size]
})
</script>
